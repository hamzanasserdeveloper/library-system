import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AuthShell } from "@/components/Auth";
import { AuthSkeleton } from "@/components/Auth";
import { SignupForm } from "./_components/signup-form";

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
    title: t("signUp"),
    description: t("signUpTagline"),
    alternates: {
      languages: {
        en: "/en/signup",
        ar: "/ar/signup",
      },
    },
  };
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <Suspense fallback={<AuthSkeleton fieldCount={3} />}>
      <AuthShell>
        <SignupForm />
      </AuthShell>
    </Suspense>
  );
}
