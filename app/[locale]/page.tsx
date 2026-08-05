import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import HeroSection from "@/components/HeroSection";
import PopularBooks from "@/components/PopularBooks";
import { Suspense } from "react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return (
    <div>
      <HeroSection />
      <Suspense
        fallback={
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-14 px-4 py-16 sm:gap-x-6 sm:px-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="mx-auto aspect-[7/10] w-full max-w-[210px] animate-pulse rounded-[10px] bg-muted"
              />
            ))}
          </div>
        }
      >
        <PopularBooks />
      </Suspense>
    </div>
  );
}
