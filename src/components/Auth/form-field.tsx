"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
  icon?: ReactNode;
  endSlot?: ReactNode;
}

export function FormField({
  label,
  error,
  icon,
  endSlot,
  className,
  ...inputProps
}: FormFieldProps) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span
            className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors focus:border-transparent focus:outline-none focus:ring-2 ${
            icon ? "ps-10" : ""
          } ${endSlot ? "pe-11" : ""} ${
            error
              ? "border-danger/60 focus:ring-danger/25"
              : "border-border focus:ring-primary/40"
          } ${className ?? ""}`}
          {...inputProps}
        />
        {endSlot ? (
          <span className="absolute inset-y-0 end-2 flex items-center">
            {endSlot}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
