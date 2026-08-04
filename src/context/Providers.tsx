"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./Theme";
import { AuthProvider } from "./Auth";
import { ToastProviderWrapper } from "@/components/ToastProviderWrapper";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProviderWrapper>
          {children}
        </ToastProviderWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}