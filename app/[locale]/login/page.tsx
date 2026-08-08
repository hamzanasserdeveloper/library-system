import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AuthShell } from "@/components/Auth";
import { AuthSkeleton } from "@/components/Auth";
import { LoginForm } from "./_components/login-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "auth",
  });

  return {
    title: t("login"),
    description: t("loginSubtitle"),
    alternates: {
      languages: {
        en: "/en/login",
        ar: "/ar/login",
      },
    },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <Suspense fallback={<AuthSkeleton fieldCount={2} />}>
      <AuthShell>
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
