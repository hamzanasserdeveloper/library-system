import { cacheTag } from "next/cache";
import { Endpoints } from "@/constants/Endpoints";
import type { BaseListResponse, Book, Borrowing, QueryParams } from "@/types";
import { ssrApi } from "./server";
import seed from "../../db.json";

function normalizeBook(book: Book): Book {
  return { ...book, id: Number(book.id) };
}

function normalizeBorrowing(borrowing: Borrowing): Borrowing {
  return {
    ...borrowing,
    id: Number(borrowing.id),
    bookId: Number(borrowing.bookId),
    userId: Number(borrowing.userId),
  };
}

function toPage<T>(
  response: BaseListResponse<T> | T[],
): BaseListResponse<T> {
  if (Array.isArray(response)) {
    return {
      data: response,
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: response.length,
    };
  }
  return response;
}

export function getBookSlugs(): string[] {
  return seed.books.map((book) => book.slug);
}

export async function getBooks(
  params: QueryParams = {},
): Promise<BaseListResponse<Book>> {
  "use cache";
  cacheTag("library");
  const response = await ssrApi.get<BaseListResponse<Book> | Book[]>(
    Endpoints.books.list,
    { _page: 1, _per_page: 100, ...params },
  );
  const page = toPage(response);
  return { ...page, data: page.data.map(normalizeBook) };
}

export async function getAllBooks(): Promise<Book[]> {
  "use cache";
  cacheTag("library");
  const response = await getBooks();
  return response.data;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  "use cache";
  cacheTag("library");
  const books = await getAllBooks();
  return books.find((book) => book.slug === slug) ?? null;
}

export async function getBorrowings(
  params: QueryParams = {},
): Promise<Borrowing[]> {
  "use cache";
  cacheTag("library");
  const response = await ssrApi.get<BaseListResponse<Borrowing> | Borrowing[]>(
    Endpoints.borrowings.list,
    { _page: 1, _per_page: 50, ...params },
  );
  const page = toPage(response);
  return page.data.map(normalizeBorrowing);
}
