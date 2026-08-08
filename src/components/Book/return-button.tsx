"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useToastHelpers } from "@/hooks/useToast";
import { returnBook } from "@/services/borrowing.actions";

interface ReturnButtonProps {
  borrowingId: string;
  bookTitle: string;
  onSuccess?: () => void;
}

export function ReturnButton({
  borrowingId,
  bookTitle,
  onSuccess,
}: ReturnButtonProps) {
  const tCommon = useTranslations("common");
  const tBorrowings = useTranslations("borrowings");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToastHelpers();

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await returnBook(borrowingId);
      if (result.status === "success") {
        toastSuccess(tBorrowings("returnSuccess"), bookTitle);
        setIsOpen(false);
        router.refresh();
        onSuccess?.();
      } else if (result.status === "already-returned") {
        toastError(tAuth("error"), tBorrowings("returnError"));
        setIsOpen(false);
      } else {
        toastError(tAuth("error"), tBorrowings("returnError"));
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:border-danger/50 hover:text-danger"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 rtl:rotate-180"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25H10a.75.75 0 0 1 0 1.5H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.06.025Zm6.413 1.58a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v14.5a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V3.812Z"
            clipRule="evenodd"
          />
        </svg>
        {tCommon("return")}
      </button>

      {isOpen && (
        <ReturnDialog
          bookTitle={bookTitle}
          pending={isPending}
          onCancel={() => setIsOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

function ReturnDialog({
  bookTitle,
  pending,
  onCancel,
  onConfirm,
}: {
  bookTitle: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const tCommon = useTranslations("common");
  const tProfile = useTranslations("profile");

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
        aria-labelledby="return-dialog-title"
        className="relative w-full max-w-sm animate-[modal-in_450ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl outline-none"
      >
        <h3
          id="return-dialog-title"
          className="font-serif text-lg font-bold leading-tight"
        >
          {tProfile("returnConfirmTitle")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {tProfile("returnConfirmMessage", { title: bookTitle })}
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
              tCommon("return")
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
