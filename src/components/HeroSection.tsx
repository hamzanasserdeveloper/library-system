import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo/ServerLogo";

const HeroSection = async () => {
  const t = await getTranslations("meta");
  const tHome = await getTranslations("home");
  return (
    <section className="flex flex-col items-center justify-center gap-8 text-center lg:gap-16">
      <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between lg:gap-16">
        <article className="flex flex-col items-center justify-center gap-8 py-12 text-center lg:max-w-xl lg:items-start lg:py-16 lg:text-start">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {tHome("title")}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {tHome("subtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/books"
              className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              {tHome("cta")}
            </Link>
          </div>
        </article>
        <article className="hidden lg:block" aria-hidden>
          <Logo size={400} withoutLogoTitle />
        </article>
      </div>
      <p className="sr-only">{t("title")}</p>
    </section>
  );
};
export default HeroSection;
