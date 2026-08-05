"use client";

import Image from "next/image";
import type { Book } from "@/types";

export function BookCoverPanel({ book }: { book: Book }) {
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
