"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { Book } from "@/types";
import { BookCoverPanel } from "./book-cover-panel";
import { BookDetailsPanel } from "./book-details-panel";

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
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsClient(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return isClient;
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
          className="absolute cursor-pointer -end-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:border-danger/50 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
        </div>
      </div>
    </div>,
    document.body,
  );
}
