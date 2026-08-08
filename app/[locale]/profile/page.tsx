import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ProfileContent } from "./_components/profile-content";
import { ProfileSkeleton } from "./_components/profile-skeleton";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "profile",
  });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      languages: {
        en: "/en/profile",
        ar: "/ar/profile",
      },
    },
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}
