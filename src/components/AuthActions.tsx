"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context";
import { Avatar } from "./avatar";

export interface AuthActionsProps {
  variant: "desktop" | "mobile";
}

export function AuthActions({ variant }: AuthActionsProps) {
  const t = useTranslations("auth");
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="h-8 w-8 animate-pulse rounded-full bg-muted"
        aria-hidden
      />
    );
  }

  if (user) {
    if (variant === "mobile") {
      return (
        <div className="flex flex-col gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3 transition hover:bg-muted"
          >
            <Avatar name={user.fullName} size="sm" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                {user.fullName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {t("logout")}
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full py-0.5 pe-1 ps-1 transition hover:bg-muted sm:pe-3"
        >
          <Avatar name={user.fullName} size="sm" />
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {user.fullName}
          </span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {t("logout")}
        </button>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/login"
          className="rounded-full px-4 py-2.5 text-center text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {t("signIn")}
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {t("signUp")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {t("signIn")}
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        {t("signUp")}
      </Link>
    </div>
  );
}
