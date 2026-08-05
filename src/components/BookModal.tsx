"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Book } from "@/types";

interface BookModalContextValue {
  open: (book: Book) => void;
  close: () => void;
}

const BookModalContext = createContext<BookModalContextValue | null>(null);

export function BookModalProvider({ children }: { children: ReactNode }) {
  const [book, setBook] = useState<Book | null>(null);

  const open = useCallback((next: Book) => setBook(next), []);
  const close = useCallback(() => setBook(null), []);

  return (
    <BookModalContext.Provider value={{ open, close }}>
      {children}
      <BookModalRoot book={book} onClose={close} />
    </BookModalContext.Provider>
  );
}

export function useBookModal(): BookModalContextValue {
  const context = useContext(BookModalContext);
  if (!context) {
    throw new Error("useBookModal must be used within a BookModalProvider");
  }
  return context;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function BookModalRoot({
  book,
  onClose,
}: {
  book: Book | null;
  onClose: () => void;
}) {
  const mounted = useIsClient();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    if (!book) return;

    previouslyFocused.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [book, onClose]);

  if (!mounted || !book) return null;

  const titleId = `book-modal-title-${book.id}`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="presentation"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 animate-[backdrop-in_250ms_ease_both] bg-black/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-3xl animate-[modal-in_450ms_cubic-bezier(0.22,1,0.36,1)_both] outline-none [perspective:2200px]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -end-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:border-danger/50 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        <div className="relative flex min-h-[420px] max-h-[85vh] [transform-style:preserve-3d] sm:min-h-[480px]">
          <BookCoverPanel book={book} />
          <BookDetailsPanel book={book} titleId={titleId} onClose={onClose} />
          <BookSpine />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function BookCoverPanel({ book }: { book: Book }) {
  return (
    <div className="book-open-left relative w-1/2 overflow-hidden rounded-s-xl bg-[linear-gradient(135deg,#d6cbb0_0%,#b7ab8c_55%,#a29473_100%)] shadow-[12px_0_28px_rgba(0,0,0,0.35)] [transform-origin:right] [animation:book-open-left_650ms_cubic-bezier(0.22,1,0.36,1)_both] rtl:[transform-origin:left]">
      <Image
        src={book.cover}
        alt={book.title}
        fill
        priority
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.15)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 w-10 bg-gradient-to-l from-black/40 via-black/10 to-transparent rtl:bg-gradient-to-r"
      />
    </div>
  );
}

function BookDetailsPanel({
  book,
  titleId,
  onClose,
}: {
  book: Book;
  titleId: string;
  onClose: () => void;
}) {
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
        <DetailItem label={tBooks("publishedYear")} value={String(book.publishedYear)} />
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

function BookSpine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-7 -translate-x-1/2 [background:linear-gradient(90deg,rgba(0,0,0,0.22),rgba(255,255,255,0.4)_45%,rgba(0,0,0,0.15))] shadow-[0_0_16px_rgba(0,0,0,0.3)]"
    />
  );
}
