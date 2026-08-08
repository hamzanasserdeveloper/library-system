"use client";

import Image from "next/image";
import type { Book } from "@/types";

export function BookCoverPanel({ book }: { book: Book }) {
  return (
    <div className="absolute inset-0 z-0 w-full overflow-hidden bg-[linear-gradient(135deg,#d6cbb0_0%,#b7ab8c_55%,#a29473_100%)] [animation:backdrop-in_250ms_ease_both] sm:relative sm:z-auto sm:w-1/2 sm:rounded-s-xl sm:shadow-[12px_0_28px_rgba(0,0,0,0.35)] sm:[transform-origin:right] sm:[animation:book-open-left_650ms_cubic-bezier(0.22,1,0.36,1)_both] rtl:sm:[transform-origin:left]">
      <Image
        src={book.cover}
        alt={book.title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 33vw"
        className="cover-mobile-blur object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.15)] sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-10 bg-gradient-to-l from-black/40 via-black/10 to-transparent rtl:bg-gradient-to-r sm:block"
      />
    </div>
  );
}
