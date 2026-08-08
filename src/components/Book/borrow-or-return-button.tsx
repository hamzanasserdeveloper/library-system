"use client";

import { useAuth } from "@/context";
import type { Book, Borrowing } from "@/types";
import { BorrowButton } from "./borrow-button";
import { ReturnButton } from "./return-button";

interface BorrowOrReturnButtonProps {
  book: Book;
  activeBorrowings?: Borrowing[];
  autoOpen?: boolean;
  onSuccess?: () => void;
}

export function BorrowOrReturnButton({
  book,
  activeBorrowings = [],
  autoOpen = false,
  onSuccess,
}: BorrowOrReturnButtonProps) {
  const { user } = useAuth();

  const myBorrowing =
    activeBorrowings.find((borrowing) => borrowing.userId === user?.id) ??
    null;

  if (myBorrowing) {
    return (
      <ReturnButton
        borrowingId={myBorrowing.id}
        bookTitle={book.title}
        onSuccess={onSuccess}
      />
    );
  }

  if (book.status === "available" && book.availableCopies > 0) {
    return <BorrowButton book={book} autoOpen={autoOpen} onSuccess={onSuccess} />;
  }

  return null;
}
