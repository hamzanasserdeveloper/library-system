"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./Theme";
import { AuthProvider } from "./Auth";
import { ToastProviderWrapper } from "@/components/ToastProviderWrapper";
import { BookModalProvider } from "@/components/Book";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProviderWrapper>
          <BookModalProvider>{children}</BookModalProvider>
        </ToastProviderWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}