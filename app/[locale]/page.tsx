import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("meta");
  const tHome = await getTranslations("home");

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {tHome("title")}
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
        {tHome("subtitle")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/books"
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          {tHome("cta")}
        </Link>
      </div>
      <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: tHome("featureBooks"), href: "/books" },
          { label: tHome("featureUsers"), href: "/users" },
          { label: tHome("featureBorrow"), href: "/borrowings" },
        ].map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {feature.label}
            </h2>
          </Link>
        ))}
      </div>
      <p className="sr-only">{t("title")}</p>
    </section>
  );
}
