import { getTranslations } from "next-intl/server";
import { safeResult } from "@/services/core";
import { getBooks, getBorrowings } from "@/services/book.service";
import type { Borrowing } from "@/types";
import { BookCard } from "@/components/Book";
import Pagination from "@/components/pagination";

interface BooksGridProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PER_PAGE = 10;

export default async function BooksGrid({ searchParams }: BooksGridProps) {
  const tBooks = await getTranslations("books");
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const page = Math.max(
    1,
    parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1,
  );

  const params: Record<string, string | number> = {
    _page: page,
    _per_page: PER_PAGE,
  };

  const where: Record<string, unknown> = {};

  if (q) {
    where.or = [
      { title: { contains: q } },
      { author: { contains: q } },
      { isbn: { contains: q } },
    ];
  }

  if (status === "available" || status === "checked-out") {
    where.status = { eq: status };
  }

  if (Object.keys(where).length > 0) {
    params._where = JSON.stringify(where);
  }

  const [booksResult, borrowingsResult] = await Promise.all([
    safeResult(getBooks(params)),
    safeResult(getBorrowings()),
  ]);

  const books = booksResult.data?.data ?? [];
  const pages = booksResult.data?.pages ?? 1;

  const activeByBookId = new Map<string, Borrowing[]>();
  (borrowingsResult.data ?? []).forEach((borrowing) => {
    if (borrowing.status !== "borrowed") return;
    const list = activeByBookId.get(borrowing.bookId);
    if (list) {
      list.push(borrowing);
    } else {
      activeByBookId.set(borrowing.bookId, [borrowing]);
    }
  });

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="text-lg font-semibold text-foreground">
          {tBooks("empty")}
        </p>
        <p className="text-sm text-muted-foreground">{tBooks("title")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-12">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="flex w-[45%] max-w-[240px] justify-center sm:w-[30%] lg:w-[22%]"
          >
            <BookCard
              book={book}
              borrow={activeByBookId.get(book.id)?.[0] ?? null}
              activeBorrowings={activeByBookId.get(book.id) ?? []}
              index={index}
            />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <Pagination
          currentPage={page}
          pages={pages}
          buildHref={(pageNumber) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (status && status !== "all") params.set("status", status);
            params.set("page", String(pageNumber));
            return `/books?${params.toString()}`;
          }}
        />
      )}
    </div>
  );
}
