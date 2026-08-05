"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { getCookieByKey, setCookie } from "@/utils/cookies/ClientSide";
import { CookieKeys } from "@/constants/SystemConfig";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = getCookieByKey(CookieKeys.Theme);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function createThemeStore() {
  let theme: Theme = getInitialTheme();
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => theme,
    getServerSnapshot: () => "light" as Theme,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setTheme: (newTheme: Theme) => {
      theme = newTheme;
      setCookie(CookieKeys.Theme, newTheme);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    },
    toggle: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      theme = newTheme;
      setCookie(CookieKeys.Theme, newTheme);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    },
  };
}

const themeStore = createThemeStore();

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: themeStore.toggle,
        setTheme: themeStore.setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export { ThemeContext };
