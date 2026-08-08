import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CookieKeys } from "@/constants/SystemConfig";
import { safeResult } from "@/services/core";
import { getUserById } from "@/services/user.service";
import { getBorrowingsByUser } from "@/services/borrowing.service";
import { getAllBooks } from "@/services/book.service";
import { ProfileHero } from "./profile-hero";
import { ProfileBooks, type ProfileBookEntry } from "./profile-books";

interface ProfileContentProps {
  locale: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PER_PAGE = 8;

export async function ProfileContent({
  locale,
  searchParams,
}: ProfileContentProps) {
  setRequestLocale(locale as Locale);

  const sp = await searchParams;
  const rawPage = typeof sp.page === "string" ? sp.page : "1";
  const requestedPage = Math.max(1, parseInt(rawPage, 10) || 1);

  const cookieStore = await cookies();
  const userId = cookieStore.get(CookieKeys.UserId)?.value;

  if (!userId) {
    redirect(`/${locale}/login?redirect=/profile`);
  }

  const [userResult, borrowingsResult, booksResult] = await Promise.all([
    safeResult(getUserById(userId)),
    safeResult(getBorrowingsByUser(userId, { _per_page: 100 })),
    safeResult(getAllBooks()),
  ]);

  const user = userResult.data;

  if (!user) {
    redirect(`/${locale}/login?redirect=/profile`);
  }

  const borrowings = borrowingsResult.data?.data ?? [];
  const activeBorrowings = borrowings.filter(
    (borrowing) => borrowing.status === "borrowed",
  );
  const returnedCount = borrowings.filter(
    (borrowing) => borrowing.status === "returned",
  ).length;

  const books = booksResult.data ?? [];
  const bookById = new Map(books.map((book) => [book.id, book]));

  const pages = Math.max(1, Math.ceil(activeBorrowings.length / PER_PAGE));
  const currentPage = Math.min(requestedPage, pages);

  const entries: ProfileBookEntry[] = activeBorrowings
    .slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
    .map((borrowing) => ({ borrowing, book: bookById.get(borrowing.bookId) }))
    .filter(
      (entry): entry is ProfileBookEntry =>
        entry.book !== undefined && entry.book !== null,
    );

  return (
    <div className="flex flex-col gap-10">
      <ProfileHero
        user={user}
        currentlyBorrowed={activeBorrowings.length}
        returnedCount={returnedCount}
        totalBorrowed={borrowings.length}
      />
      <ProfileBooks
        entries={entries}
        currentPage={currentPage}
        pages={pages}
        totalItems={activeBorrowings.length}
      />
    </div>
  );
}
