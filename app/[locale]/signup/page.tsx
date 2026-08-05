"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useToastHelpers } from "@/hooks/useToast";
import { useAuth } from "@/context";
import type { ApiError } from "@/types";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { error: toastError, success: toastSuccess } = useToastHelpers();
  const { register } = useAuth();

  const redirect = searchParams.get("redirect") || "/";
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
    <div className=" flex items-center justify-center bg-background my-auto">
      <div className="w-full max-w-200">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h1 className="flex justify-center w-full mb-5 text-[40px] font-bold">
            Join To Us
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("fullName")}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder={t("fullNamePlaceholder")}
                  disabled={isLoading}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder={t("phonePlaceholder")}
                  disabled={isLoading}
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder={t("emailPlaceholder")}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder={t("passwordPlaceholder")}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder={t("confirmPasswordPlaceholder")}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 cursor-pointer rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t("creatingAccount") : t("signUp")}
            </button>
          </form>

          <button className="mt-6 text-center pointer">
            <p className="text-sm text-muted-foreground pointer">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline ml-1"
              >
                {t("signIn")}
              </Link>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
