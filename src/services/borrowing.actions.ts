"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { CookieKeys, DUE_DAYS } from "@/constants/SystemConfig";
import { Endpoints } from "@/constants/Endpoints";
import type { BaseListResponse, Book, Borrowing } from "@/types";
import { SSRFetch } from "./server";

export type BorrowResult =
  | { status: "success"; dueDate: string }
  | { status: "unauth" }
  | { status: "unavailable" }
  | { status: "already-borrowed" }
  | { status: "error" };

export type ReturnResult =
  | { status: "success" }
  | { status: "unauth" }
  | { status: "not-found" }
  | { status: "already-returned" }
  | { status: "error" };

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDueDate(borrowDate: string): string {
  const due = new Date(borrowDate);
  due.setDate(due.getDate() + DUE_DAYS);
  return toDateString(due);
}

async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CookieKeys.UserId)?.value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export async function borrowBook(bookId: number): Promise<BorrowResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "unauth" };

  try {
    const book = await SSRFetch.get<Book>(
      Endpoints.books.detail(bookId),
      {},
      { headers: { "Cache-Control": "no-store" } },
    );

    if (!book || book.availableCopies <= 0) {
      return { status: "unavailable" };
    }

    const activeResponse = await SSRFetch.get<
      Borrowing[] | BaseListResponse<Borrowing>
    >(Endpoints.borrowings.list, { bookId, userId, status: "borrowed" });
    const activeList = Array.isArray(activeResponse)
      ? activeResponse
      : activeResponse.data;
    if (activeList.length > 0) {
      return { status: "already-borrowed" };
    }

    const borrowDate = toDateString(new Date());
    const dueDate = getDueDate(borrowDate);

    await SSRFetch.post<Borrowing>(
      Endpoints.borrowings.create,
      {
        bookId,
        userId,
        borrowDate,
        dueDate,
        returnDate: null,
        status: "borrowed",
      },
      { headers: { "Cache-Control": "no-store" } },
    );

    const nextAvailable = book.availableCopies - 1;
    await SSRFetch.patch<Book>(
      Endpoints.books.update(bookId),
      {
        availableCopies: nextAvailable,
        status: nextAvailable === 0 ? "checked-out" : "available",
      },
      { headers: { "Cache-Control": "no-store" } },
    );

    revalidateTag("library", "max");
    return { status: "success", dueDate };
  } catch {
    return { status: "error" };
  }
}

export async function returnBook(borrowingId: number): Promise<ReturnResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "unauth" };

  try {
    const borrowing = await SSRFetch.get<Borrowing>(
      Endpoints.borrowings.return(borrowingId),
      {},
      { headers: { "Cache-Control": "no-store" } },
    );

    if (!borrowing || borrowing.id == null) {
      return { status: "not-found" };
    }
    if (borrowing.userId !== userId) return { status: "unauth" };
    if (borrowing.status !== "borrowed") {
      return { status: "already-returned" };
    }

    await SSRFetch.patch<Borrowing>(
      Endpoints.borrowings.return(borrowingId),
      { returnDate: toDateString(new Date()), status: "returned" },
      { headers: { "Cache-Control": "no-store" } },
    );

    const book = await SSRFetch.get<Book>(
      Endpoints.books.detail(borrowing.bookId),
      {},
      { headers: { "Cache-Control": "no-store" } },
    );

    await SSRFetch.patch<Book>(
      Endpoints.books.update(borrowing.bookId),
      {
        availableCopies: Math.min(
          book.totalCopies,
          book.availableCopies + 1,
        ),
        status: "available",
      },
      { headers: { "Cache-Control": "no-store" } },
    );

    revalidateTag("library", "max");
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}
