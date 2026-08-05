"use client";

import { createPortal } from "react-dom";
import { ToastProvider, useToast } from "@/context/Toast";
import { ToastComponent } from "./Toast";
import { ToastPosition } from "@/constants/SystemConfig";

interface ToastContainerProps {
  position?: ToastPosition;
}

function ToastContainer({
  position = ToastPosition.BottomEnd,
}: ToastContainerProps) {
  const { toasts, dismissToast } = useToast();

  const positionStyles: Record<ToastPosition, string> = {
    [ToastPosition.TopStart]: "top-4 left-4 flex-col",
    [ToastPosition.TopCenter]:
      "top-4 left-1/2 -translate-x-1/2 flex-col items-center",
    [ToastPosition.TopEnd]: "top-4 right-4 flex-col",
    [ToastPosition.BottomStart]: "bottom-4 left-4 flex-col-reverse",
    [ToastPosition.BottomCenter]:
      "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
    [ToastPosition.BottomEnd]: "bottom-4 right-4 flex-col-reverse",
  };

  const containerStyle = positionStyles[position];

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className={`fixed z-50 flex gap-2 pointer-events-none ${containerStyle}`}
      style={{ pointerEvents: "none" }}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <ToastComponent toast={toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>,
    document.body,
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
}

export function ToastProviderWrapper({
  children,
  defaultPosition = ToastPosition.BottomEnd,
  defaultDuration = 5000,
}: ToastProviderProps) {
  return (
    <ToastProvider
      defaultPosition={defaultPosition}
      defaultDuration={defaultDuration}
    >
      {children}
      <ToastContainer position={defaultPosition} />
    </ToastProvider>
  );
}
