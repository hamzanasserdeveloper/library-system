import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getBookBySlug, getBookSlugs } from "@/services/book.service";
import { safeResult } from "@/services/core";
import { BookDetails } from "./_components/book-details";
import { BookDetailsSkeleton } from "./_components/book-details-skeleton";

interface BookPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  return getBookSlugs().flatMap((slug) =>
    routing.locales.map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bookResult = await safeResult(getBookBySlug(slug));
  const book = bookResult.data;

  return {
    title: book ? `${book.title} — ${book.author}` : undefined,
    description: book?.description ?? undefined,
    alternates: {
      languages: {
        en: `/en/books/${slug}`,
        ar: `/ar/books/${slug}`,
      },
    },
    openGraph: book
      ? {
          title: book.title,
          description: book.description,
          type: "book",
          images: [{ url: book.cover, alt: book.title }],
        }
      : undefined,
  };
}

export default async function BookPage({
  params,
  searchParams,
}: BookPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  return (
    <Suspense fallback={<BookDetailsSkeleton />}>
      <BookDetails locale={locale} slug={slug} searchParams={searchParams} />
    </Suspense>
  );
}
