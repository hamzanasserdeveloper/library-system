"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useToastHelpers } from "@/hooks/useToast";
import { useAuth } from "@/context";
import type { ApiError } from "@/types";
import {
  FormField,
  MailIcon,
  PasswordInput,
  PhoneIcon,
  SpinnerIcon,
  UserIcon,
} from "@/components/Auth";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { error: toastError, success: toastSuccess } = useToastHelpers();
  const { register } = useAuth();

  const redirect = searchParams.get("redirect") ?? "/";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t("fullNameRequired");
    if (!formData.email) newErrors.email = t("emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("emailInvalid");
    if (!formData.phone.trim()) newErrors.phone = t("phoneRequired");
    if (!formData.password) newErrors.password = t("passwordRequired");
    else if (formData.password.length < 8)
      newErrors.password =
        t("passwordMinLength") || "Password must be at least 8 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = t("confirmPasswordRequired");
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t("passwordsMismatch");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toastSuccess(t("success"), t("registerSuccess"));
      router.push(redirect);
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      toastError(t("error"), apiError.message ?? t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full  h-full rounded-3xl border border-border bg-card p-6 shadow-md sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t("signUpTitle")}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
        {t("signUpTagline")}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label={t("fullName")}
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t("fullNamePlaceholder")}
            icon={<UserIcon className="h-5 w-5" />}
            error={errors.fullName}
            autoComplete="name"
            disabled={isLoading}
          />
          <FormField
            label={t("phone")}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("phonePlaceholder")}
            icon={<PhoneIcon className="h-5 w-5" />}
            error={errors.phone}
            autoComplete="tel"
            disabled={isLoading}
          />
        </div>

        <FormField
          label={t("email")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("emailPlaceholder")}
          icon={<MailIcon className="h-5 w-5" />}
          error={errors.email}
          autoComplete="email"
          disabled={isLoading}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordInput
            label={t("password")}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("passwordPlaceholder")}
            error={errors.password}
            autoComplete="new-password"
            disabled={isLoading}
          />
          <PasswordInput
            label={t("confirmPassword")}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t("confirmPasswordPlaceholder")}
            error={errors.confirmPassword}
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="h-4 w-4" />
              {t("creatingAccount")}
            </>
          ) : (
            t("signUp")
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center">
        <p className="text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
