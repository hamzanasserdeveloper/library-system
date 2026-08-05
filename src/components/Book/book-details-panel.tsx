"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Book } from "@/types";

interface BookDetailsPanelProps {
  book: Book;
  titleId: string;
  onClose: () => void;
}

export function BookDetailsPanel({
  book,
  titleId,
  onClose,
}: BookDetailsPanelProps) {
  const tBooks = useTranslations("books");
  const tStatus = useTranslations("status");
  const tDetails = useTranslations("bookDetails");
  const tCommon = useTranslations("common");

  const isAvailable = book.status === "available";

  return (
    <div className="book-open-right relative flex w-1/2 flex-col overflow-y-auto rounded-e-xl bg-card p-5 text-foreground [transform-origin:left] [animation:book-open-right_650ms_cubic-bezier(0.22,1,0.36,1)_140ms_both] rtl:[transform-origin:right] sm:p-7">
      <div className="flex flex-col gap-1.5">
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px] ${
            isAvailable ? "bg-success" : "bg-danger"
          }`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "animate-pulse bg-white" : "bg-white/90"}`}
          />
          {isAvailable ? tStatus("available") : tStatus("checkedOut")}
        </span>

        <h2
          id={titleId}
          className="font-serif text-xl font-bold leading-tight text-foreground sm:text-2xl"
        >
          {book.title}
        </h2>
        <p className="text-sm font-medium text-primary">{book.author}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-4">
        {book.description}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-border pt-4 text-xs sm:text-sm">
        <DetailItem label={tBooks("category")} value={book.category} />
        <DetailItem label={tBooks("language")} value={book.language} />
        <DetailItem
          label={tBooks("publishedYear")}
          value={String(book.publishedYear)}
        />
        <DetailItem label={tBooks("pages")} value={`${book.pages}`} />
      </dl>

      <p className="mt-4 text-xs font-medium text-muted-foreground sm:text-sm">
        {isAvailable
          ? tBooks("copiesAvailable", {
              count: book.availableCopies,
              total: book.totalCopies,
            })
          : tBooks("noCopies")}
      </p>

      <div className="mt-auto pt-6">
        <Link
          href={`/books/${book.slug}`}
          onClick={onClose}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {tDetails("viewFullDetails")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 rtl:rotate-180"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">{tCommon("viewDetails")}</span>
        </Link>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70 sm:text-xs">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
    </div>
  );
}
