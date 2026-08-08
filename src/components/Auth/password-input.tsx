"use client";

import { useState, type InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { FormField } from "./form-field";
import { EyeIcon, EyeOffIcon, LockIcon } from "./icons";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  label: string;
  error?: string;
}

export function PasswordInput({ label, error, ...inputProps }: PasswordInputProps) {
  const t = useTranslations("auth");
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      label={label}
      error={error}
      type={isVisible ? "text" : "password"}
      icon={<LockIcon className="h-5 w-5" />}
      endSlot={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? t("hidePassword") : t("showPassword")}
          aria-pressed={isVisible}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {isVisible ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      }
      {...inputProps}
    />
  );
}
