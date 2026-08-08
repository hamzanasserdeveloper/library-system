"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Book, Borrowing } from "@/types";
import { useBookModal } from "./book-modal";

interface BookCardProps {
  book: Book;
  borrow?: Borrowing | null;
  index?: number;
}

function formatShortDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function BookCard({ book, borrow, index = 0 }: BookCardProps) {
  const locale = useLocale();
  const tStatus = useTranslations("status");
  const tBooks = useTranslations("books");
  const tCommon = useTranslations("common");
  const { open } = useBookModal();

  const isAvailable = book.status === "available";

  return (
    <article
      className="book-rise group relative flex w-full max-w-[260px] flex-col [perspective:1200px]"
      style={{ animationDelay: `${index * 130}ms` }}
    >
      <div className="relative aspect-[7/10] w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted via-muted to-muted-foreground/25 shadow-sm ring-1 ring-border/60 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-y-[-5deg] group-hover:shadow-xl group-hover:shadow-primary/15 rtl:group-hover:rotate-y-[5deg]">
        <Image
          src={book.cover}
          alt={`${book.title} — ${book.author}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          priority={index < 2}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        <span
          className={`absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:text-[11px] ${
            isAvailable ? "bg-success" : "bg-danger"
          }`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "animate-pulse bg-white" : "bg-white/90"}`}
          />
          {isAvailable ? tStatus("available") : tStatus("checkedOut")}
        </span>

        <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-primary/95 py-2 text-center text-xs font-semibold text-primary-foreground opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {tCommon("viewDetails")}
        </span>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1 text-center">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {book.title}
        </h3>
        <p className="truncate text-sm text-muted-foreground">{book.author}</p>
        <p className="text-xs text-muted-foreground/80">
          {book.category} · {book.language} · {book.pages} {tBooks("pages")}
        </p>
        {isAvailable ? (
          <p className="text-xs font-medium text-success">
            {tBooks("copiesAvailable", {
              count: book.availableCopies,
              total: book.totalCopies,
            })}
          </p>
        ) : borrow ? (
          <p className="text-xs font-medium text-muted-foreground">
            {tBooks("borrowedOn", {
              date: formatShortDate(borrow.borrowDate, locale),
            })}{" "}
            ·{" "}
            {tBooks("due", {
              date: formatShortDate(borrow.dueDate, locale),
            })}
          </p>
        ) : (
          <p className="text-xs font-medium text-danger">
            {tBooks("noCopies")}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => open(book)}
        aria-haspopup="dialog"
        aria-label={tBooks("openDetails", { title: book.title })}
        className="absolute inset-0 z-10 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </article>
  );
}
