import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBookBySlug, getBorrowings } from "@/services/book.service";
import { safeResult } from "@/services/core";
import { BorrowOrReturnButton } from "@/components/Book";

interface BookDetailsProps {
  locale: string;
  slug: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function BookDetails({
  locale,
  slug,
  searchParams,
}: BookDetailsProps) {
  setRequestLocale(locale as Locale);

  const sp = await searchParams;
  const autoOpenBorrow = sp.borrow === "1";

  const bookResult = await safeResult(getBookBySlug(slug));
  const book = bookResult.data;
  if (!book) notFound();

  const t = await getTranslations("bookDetails");
  const tBooks = await getTranslations("books");
  const tStatus = await getTranslations("status");

  const borrowingsResult = await safeResult(getBorrowings());
  const activeBorrowings = (borrowingsResult.data ?? []).filter(
    (borrowing) =>
      borrowing.bookId === book.id && borrowing.status === "borrowed",
  );
  const activeBorrowing = activeBorrowings[0];

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(iso),
    );

  const isAvailable = book.status === "available";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    publisher: { "@type": "Organization", name: book.publisher },
    isbn: book.isbn,
    datePublished: String(book.publishedYear),
    numberOfPages: book.pages,
    inLanguage: book.language,
    genre: book.category,
    image: book.cover,
    description: book.description,
  };

  return (
    <div className="flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 rtl:rotate-180"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          {t("back")}
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl [perspective:2200px]">
        <div className="relative flex min-h-[540px] overflow-hidden rounded-2xl [box-shadow:0_28px_60px_-12px_rgba(0,0,0,0.3)]">
          <div className="relative w-[42%] bg-[linear-gradient(135deg,#d6cbb0_0%,#b7ab8c_55%,#a29473_100%)] sm:w-[38%]">
            <Image
              src={book.cover}
              alt={`${book.title} — ${book.author}`}
              fill
              priority
              sizes="(max-width: 768px) 42vw, 38vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 end-0 w-10 bg-gradient-to-l from-black/40 via-black/10 to-transparent rtl:bg-gradient-to-r"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 end-0 w-1.5 bg-black/25"
            />
          </div>

          <div className="relative flex w-[58%] flex-col gap-5 bg-card p-5 text-foreground sm:w-[62%] sm:p-9">
            <div className="flex items-center gap-3">
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
              <span className="text-xs font-medium text-muted-foreground">
                {isAvailable
                  ? tBooks("copiesAvailable", {
                      count: book.availableCopies,
                      total: book.totalCopies,
                    })
                  : tBooks("noCopies")}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="font-serif text-2xl font-bold leading-tight sm:text-4xl">
                {book.title}
              </h1>
              <p className="text-sm font-semibold text-primary sm:text-base">
                {book.author}
              </p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {book.category} · {book.language}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {book.description}
            </p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border border-border bg-muted/50 p-4 sm:gap-y-5 sm:p-5">
              <DetailsRow label={tBooks("publisher")} value={book.publisher} />
              <DetailsRow
                label={tBooks("publishedYear")}
                value={String(book.publishedYear)}
              />
              <DetailsRow label={tBooks("pages")} value={`${book.pages}`} />
              <DetailsRow label={tBooks("isbn")} value={book.isbn} />
            </dl>

            <BorrowOrReturnButton
              book={book}
              activeBorrowings={activeBorrowings}
              autoOpen={autoOpenBorrow}
            />

            {activeBorrowing && (
              <p className="rounded-lg bg-accent/15 px-4 py-2.5 text-sm text-accent-foreground">
                {tBooks("borrowedOn", {
                  date: formatDate(activeBorrowing.borrowDate),
                })}{" "}
                ·{" "}
                {tBooks("due", {
                  date: formatDate(activeBorrowing.dueDate),
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70 sm:text-xs">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
    </div>
  );
}
