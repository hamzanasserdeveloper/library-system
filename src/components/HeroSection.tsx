import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo/ServerLogo";

const HeroSection = async () => {
  const t = await getTranslations("meta");
  const tHome = await getTranslations("home");
  return (
    <section className="flex flex-col items-center justify-center gap-8  text-center">
      <div className="flex items-center justify-center gap-20 w-full">
        <article className="flex flex-col items-center justify-center gap-8 py-16 text-center">
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
        </article>
        <article>
          <Logo size={400} withoutLogoTitle />
        </article>
      </div>
      <p className="sr-only">{t("title")}</p>
    </section>
  );
};
export default HeroSection;
