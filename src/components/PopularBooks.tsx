import { getTranslations } from "next-intl/server";
import { safeResult } from "@/services/core";
import { getBooks, getBorrowings } from "@/services/book.service";
import { BookCard } from "@/components/Book";
import { Link } from "@/i18n/navigation";
import type { Borrowing } from "@/types";

export default async function PopularBooks() {
  const t = await getTranslations("home");

  const [booksResult, borrowingsResult] = await Promise.all([
    safeResult(getBooks({ _page: 1, _per_page: 6 })),
    safeResult(getBorrowings()),
  ]);

  const books = booksResult.data?.data ?? [];
  const borrowings = borrowingsResult.data ?? [];

  const activeByBookId = new Map<number, Borrowing>();
  borrowings.forEach((borrowing) => {
    if (
      borrowing.status === "borrowed" &&
      !activeByBookId.has(borrowing.bookId)
    ) {
      activeByBookId.set(borrowing.bookId, borrowing);
    }
  });

  return (
    <section
      aria-labelledby="popular-books-title"
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className=" flex flex-col gap-4">
          <h2
            id="popular-books-title"
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {t("popular.title")}
          </h2>
          <p className="mt-1 text-muted-foreground">{t("popular.subtitle")}</p>
        </div>
        <Link
          href="/books"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
        >
          {t("popular.viewAll")}
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 place-items-center gap-x-3 gap-y-14 sm:gap-x-6 lg:gap-x-10">
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            borrow={activeByBookId.get(book.id) ?? null}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
