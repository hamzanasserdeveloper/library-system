"use client";

import { useTranslations } from "next-intl";
import { CheckIcon } from "./icons";

interface DemoHintProps {
  onFill?: (credentials: { email: string; password: string }) => void;
}

const DEMO_EMAIL = "john@example.com";
const DEMO_PASSWORD = "password123";

export function DemoHint({ onFill }: DemoHintProps) {
  const t = useTranslations("auth");

  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <CheckIcon className="h-3.5 w-3.5 text-success" />
        {t("demoTitle")}
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">{t("demoHint")}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-card px-3 py-2 ring-1 ring-border">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("demoEmail")}
          </dt>
          <dd className="truncate font-mono text-xs font-semibold text-foreground">
            {DEMO_EMAIL}
          </dd>
        </div>
        <div className="rounded-xl bg-card px-3 py-2 ring-1 ring-border">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("demoPassword")}
          </dt>
          <dd className="truncate font-mono text-xs font-semibold text-foreground">
            {DEMO_PASSWORD}
          </dd>
        </div>
      </dl>
      {onFill ? (
        <button
          type="button"
          onClick={() => onFill({ email: DEMO_EMAIL, password: DEMO_PASSWORD })}
          className="mt-3 w-full cursor-pointer rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/15"
        >
          {t("useDemoAccount")}
        </button>
      ) : null}
    </div>
  );
}
