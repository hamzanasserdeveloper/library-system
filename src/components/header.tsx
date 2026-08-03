import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { getSession } from "@/lib/auth";
import { User } from "@/types";

interface HeaderProps {
  user?: User | null;
}

export async function Header({ user }: HeaderProps = {}) {
  const t = await getTranslations("nav");
  const tAuth = await getTranslations("auth");

  const links = [
    { href: "/", label: t("dashboard") },
    { href: "/books", label: t("books") },
    { href: "/users", label: t("users") },
    { href: "/borrowings", label: t("borrowings") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground"
          >
            📚 <span className="sr-only">Library</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 sm:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.fullName}
              </span>
              <div className="flex items-center gap-1">
                <Link
                  href="/logout"
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {tAuth.signIn}
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {tAuth.signIn}
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground transition hover:bg-primary/90"
              >
                {tAuth.signUp}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
