"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useToastHelpers } from "@/hooks/useToast";
import { useAuth } from "@/context";
import type { ApiError } from "@/types";
import {
  DemoHint,
  FormField,
  MailIcon,
  PasswordInput,
  SpinnerIcon,
} from "@/components/Auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { error: toastError, success: toastSuccess } = useToastHelpers();
  const { login } = useAuth();

  const redirect = searchParams.get("redirect") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = t("emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = t("emailInvalid");
    if (!password) newErrors.password = t("passwordRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      toastSuccess(t("success"), t("loginSuccess"));
      router.push(redirect);
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      toastError(t("error"), apiError.message ?? t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (credentials: { email: string; password: string }) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    setErrors({});
  };

  return (
    <div className="w-full h-full rounded-3xl border border-border bg-card p-6 shadow-md sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t("welcomeBack")}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
        {t("loginSubtitle")}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <FormField
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          icon={<MailIcon className="h-5 w-5" />}
          error={errors.email}
          autoComplete="email"
          disabled={isLoading}
        />
        <PasswordInput
          label={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
          error={errors.password}
          autoComplete="current-password"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="h-4 w-4" />
              {t("loggingIn")}
            </>
          ) : (
            t("login")
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center">
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
