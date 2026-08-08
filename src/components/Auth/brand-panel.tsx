"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Logo from "@/components/Logo";
import { CheckIcon } from "./icons";
import dragonBook from "@/assets/books/dragon_book.jpg";
import runBook from "@/assets/books/run_book.jpg";
import happensBook from "@/assets/books/happens_book.jpg";

const bookCovers = [dragonBook, runBook, happensBook];

export function BrandPanel() {
  const t = useTranslations("auth");
  const features = [
    t("brandPointOne"),
    t("brandPointTwo"),
    t("brandPointThree"),
  ];

  return (
    <aside className="relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#3b82c4_0%,#2397ca_45%,#0b7a8f_100%)] p-6 text-white shadow-lg ring-1 ring-white/10 sm:p-8 lg:min-h-[640px] lg:p-10">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_18px)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 [background:radial-gradient(900px_420px_at_80%_-80px,rgba(255,255,255,0.35),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute -end-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -start-16 -bottom-16 h-56 w-56 rounded-full bg-secondary/30 blur-3xl"
      />

      <header className="relative z-10">
        <Logo className="text-[22px] font-bold text-white" size={42} />
      </header>

      <p className="relative z-10 mt-6 max-w-xs text-lg font-medium text-white/90 lg:hidden">
        {t("brandTagline")}
      </p>

      <div className="relative z-10 mt-12 hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
          Library
        </p>
        <h2 className="mt-3 font-serif text-4xl font-bold leading-tight">
          {t("brandTagline")}
        </h2>
        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="text-[15px] text-white/90">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mt-8 hidden items-end justify-center gap-5 lg:flex">
        {bookCovers.map((cover, index) => (
          <Image
            key={cover.src}
            src={cover}
            alt=""
            width={120}
            height={180}
            className={`w-28 rounded-lg shadow-xl ring-4 ring-white/25 book-float ${
              index === 1 ? "-mt-8 scale-105" : ""
            }`}
            style={{ animationDelay: `${index * 0.9}s` }}
          />
        ))}
      </div>
    </aside>
  );
}
