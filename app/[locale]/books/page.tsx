import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import type { Locale } from "@/i18n/routing";
import { BooksToolbar } from "./components/books-toolbar";
import BooksGrid from "./components/books-grid";
import { BooksSkeleton } from "./components/books-skeleton";

interface BooksPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: BooksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const tBooks = await getTranslations({
    locale: locale as Locale,
    namespace: "books",
  });
  const tMeta = await getTranslations({
    locale: locale as Locale,
    namespace: "meta",
  });

  return {
    title: tBooks("title"),
    description: tMeta("description"),
    alternates: {
      languages: {
        en: "/en/books",
        ar: "/ar/books",
      },
    },
  };
}

function ToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="h-10 min-w-[220px] flex-1 animate-pulse rounded-full bg-muted" />
      <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
    </div>
  );
}

export default async function BooksPage({
  params,
  searchParams,
}: BooksPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const tBooks = await getTranslations("books");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tBooks("title")}
        </h1>
        <p className="text-muted-foreground">{tBooks("subtitle")}</p>
      </header>

      <Suspense fallback={<ToolbarSkeleton />}>
        <BooksToolbar />
      </Suspense>

      <Suspense fallback={<BooksSkeleton />}>
        <BooksGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
