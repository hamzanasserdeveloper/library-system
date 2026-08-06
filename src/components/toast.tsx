"use client";

import { useEffect, useState } from "react";
import { ToastType, ToastPosition } from "@/constants/SystemConfig";
import { mergeClasses } from "@/utils/MergeClasses";
import { Link } from "@/i18n/navigation";
import { Toast } from "@/context/Toast";

const typeStyles: Record<ToastType, string> = {
  [ToastType.Error]:
    "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800",
  [ToastType.Success]:
    "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800",
  [ToastType.Info]:
    "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800",
  [ToastType.Warning]:
    "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:border-yellow-800",
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  [ToastType.Error]: (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  [ToastType.Success]: (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  [ToastType.Info]: (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  [ToastType.Warning]: (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const positionStyles: Record<ToastPosition, string> = {
  [ToastPosition.TopStart]: "top-4 left-4",
  [ToastPosition.TopCenter]: "top-4 left-1/2 -translate-x-1/2",
  [ToastPosition.TopEnd]: "top-4 right-4",
  [ToastPosition.BottomStart]: "bottom-4 left-4",
  [ToastPosition.BottomCenter]: "bottom-4 left-1/2 -translate-x-1/2",
  [ToastPosition.BottomEnd]: "bottom-4 right-4",
};

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastComponent({ toast, onDismiss }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const startTime = Date.now();
    const duration = toast.duration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setProgress(remaining * 100);

      if (remaining === 0) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.duration, toast.id, onDismiss]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  const baseStyles =
    "flex items-start gap-3 p-4 w-full max-w-sm rounded-xl border shadow-lg animate-in slide-in-from-bottom-2 duration-300";
  const exitStyles = "animate-out slide-out-to-right-2 duration-200 opacity-0";

  const positionClass =
    positionStyles[toast.position || ToastPosition.BottomEnd];
  const typeStyle = typeStyles[toast.type] || typeStyles[ToastType.Info];

  return (
    <div
      className={mergeClasses(
        "fixed z-50",
        positionClass,
        baseStyles,
        typeStyle,
        isExiting && exitStyles,
      )}
      role="alert"
      aria-live="polite"
      style={{ width: "320px" }}
    >
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-sm leading-tight">{toast.title}</p>
        )}
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}
        {toast.action && (
          <Link
            href={toast.action.href}
            onClick={handleClose}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2"
          >
            {toast.action.label}
          </Link>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="flex-shrink-0" aria-hidden="true">
          {typeIcons[toast.type] || typeIcons[ToastType.Info]}
        </span>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {toast.duration && toast.duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 rounded-b-xl bg-current/20"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Time remaining"
        />
      )}
    </div>
  );
}
