import { getTranslations } from "next-intl/server";
import type { Borrowing, Book } from "@/types";
import { BookCard, ReturnButton } from "@/components/Book";
import Pagination from "@/components/pagination";
import { Link } from "@/i18n/navigation";

export interface ProfileBookEntry {
  borrowing: Borrowing;
  book: Book;
}

interface ProfileBooksProps {
  entries: ProfileBookEntry[];
  currentPage: number;
  pages: number;
  totalItems: number;
}

export async function ProfileBooks({
  entries,
  currentPage,
  pages,
  totalItems,
}: ProfileBooksProps) {
  const t = await getTranslations("profile");
  const tBooks = await getTranslations("books");

  if (totalItems === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-8 w-8"
            aria-hidden
          >
            <path d="M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06v-11a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 3a8.963 8.963 0 0 0-4.25 1.065V16.82Z" />
            <path d="M9.25 4.065A8.963 8.963 0 0 0 5 3c-.85 0-1.673.118-2.454.339A.75.75 0 0 0 2 4.06v11a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.065Z" />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-foreground">{t("empty")}</h2>
          <p className="text-sm text-muted-foreground">{t("emptyHint")}</p>
        </div>
        <Link
          href="/books"
          className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary-hover"
        >
          {tBooks("title")}
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8" aria-labelledby="profile-books-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="profile-books-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t("borrowedBooks")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("borrowedBooksSubtitle", { count: totalItems })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {entries.map(({ borrowing, book }, index) => (
          <div key={borrowing.id} className="flex w-full flex-col items-center gap-3">
            <BookCard book={book} borrow={borrowing} index={index} />
            <ReturnButton
              borrowingId={borrowing.id}
              bookTitle={book.title}
            />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <Pagination
          currentPage={currentPage}
          pages={pages}
          buildHref={(pageNumber) => `/profile?page=${pageNumber}`}
        />
      )}
    </section>
  );
}
