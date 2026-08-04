"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context";

export function Header() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const { user, logout, isLoading } = useAuth();

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
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.fullName}
              </span>
              <button
                onClick={logout}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {tAuth("logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {tAuth("signIn")}
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground transition hover:bg-primary/90"
              >
                {tAuth("signUp")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
