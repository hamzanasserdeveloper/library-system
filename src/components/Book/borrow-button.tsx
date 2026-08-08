"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context";
import { useToastHelpers } from "@/hooks/useToast";
import { borrowBook } from "@/services/borrowing.actions";
import { DUE_DAYS } from "@/constants/SystemConfig";
import type { Book } from "@/types";

interface BorrowButtonProps {
  book: Book;
  autoOpen?: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
}

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function BorrowButton({
  book,
  autoOpen = false,
  disabled = false,
  onSuccess,
}: BorrowButtonProps) {
  const locale = useLocale();
  const tBooks = useTranslations("books");
  const tCommon = useTranslations("common");
  const tProfile = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const tDetails = useTranslations("bookDetails");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToastHelpers();

  const [isOpen, setIsOpen] = useState(false);
  const [autoDismissed, setAutoDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isAvailable = book.status === "available" && book.availableCopies > 0;
  const canBorrow = isAvailable && !disabled;
  const shouldAutoOpen =
    autoOpen && user && canBorrow && !autoDismissed && !isPending;
  const isDialogOpen = isOpen || shouldAutoOpen;

  const loginRedirect = () => {
    router.push(
      `/login?redirect=${encodeURIComponent(`${pathname}?borrow=1`)}`,
    );
  };

  const closeDialog = () => {
    setIsOpen(false);
    setAutoDismissed(true);
    if (autoOpen) router.replace(pathname);
  };

  const handleClick = () => {
    if (!user) {
      loginRedirect();
      return;
    }
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (!user) return;
    startTransition(async () => {
      const result = await borrowBook(book.id);

      switch (result.status) {
        case "success": {
          toastSuccess(
            tDetails("borrowSuccess"),
            tBooks("due", { date: formatDate(result.dueDate, locale) }),
            {
              action: { label: tProfile("viewMyProfile"), href: "/profile" },
            },
          );
          closeDialog();
          onSuccess?.();
          router.refresh();
          break;
        }
        case "unavailable":
          toastError(tAuth("error"), tBooks("noCopies"));
          closeDialog();
          break;
        case "already-borrowed":
          toastError(tAuth("error"), tProfile("alreadyBorrowed"));
          closeDialog();
          break;
        case "unauth":
          closeDialog();
          loginRedirect();
          break;
        default:
          toastError(tAuth("error"), tDetails("borrowError"));
      }
    });
  };

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + DUE_DAYS);
  const dueLabel = formatDate(dueDate.toISOString(), locale);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={!canBorrow || isLoading}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden
        >
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
        {disabled ? tProfile("borrowed") : tCommon("borrow")}
      </button>

      {isDialogOpen && user && (
        <BorrowDialog
          book={book}
          dueLabel={dueLabel}
          pending={isPending}
          onCancel={closeDialog}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

function BorrowDialog({
  book,
  dueLabel,
  pending,
  onCancel,
  onConfirm,
}: {
  book: Book;
  dueLabel: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const tCommon = useTranslations("common");
  const tProfile = useTranslations("profile");
  const tBooks = useTranslations("books");

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        aria-hidden
        onClick={pending ? undefined : onCancel}
        className="absolute inset-0 animate-[backdrop-in_250ms_ease_both] bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="borrow-dialog-title"
        className="relative w-full max-w-sm animate-[modal-in_450ms_cubic-bezier(0.22,1,0.36,1)_both] overflow-hidden rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl outline-none"
      >
        <div className="flex items-start gap-4">
          <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h3
              id="borrow-dialog-title"
              className="font-serif text-lg font-bold leading-tight"
            >
              {book.title}
            </h3>
            <p className="truncate text-sm text-primary">{book.author}</p>
          </div>
        </div>

        <p className="mt-5 rounded-lg bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground">
          {tProfile("confirmMessage", { date: dueLabel })}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 cursor-pointer rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-danger/50 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tCommon("cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
              />
            ) : (
              tCommon("borrow")
            )}
          </button>
        </div>

        <span className="sr-only">
          {tBooks("availableCopies")}: {book.availableCopies}
        </span>
      </div>
    </div>,
    document.body,
  );
}
