"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@/types";
import { userService } from "@/services/user.service";
import { CookieKeys } from "@/constants/SystemConfig";
import { ErrorBoundary } from "./ErrorBoundary";
import { getCookieByKey, removeCookie } from "@/utils/cookies/ClientSide";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
} | null>(null);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const userId = getCookieByKey(CookieKeys.UserId);
        if (userId) {
          const result = await userService.getUserById(Number(userId));
          if (result.data) setUser(result.data);
        }
      } catch {
        // Ignore hydration errors
      } finally {
        setIsLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const result = await userService.login(credentials);
        if (result.error) throw new Error(result.error.message);
        setUser(result.data!);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      setIsLoading(true);
      try {
        const result = await userService.register(data);
        if (result.error) throw new Error(result.error.message);
        setUser(result.data!);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    removeCookie(CookieKeys.UserId);
    removeCookie(CookieKeys.Token);
    removeCookie(CookieKeys.RedirectPath);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          Authentication error. Please refresh.
        </div>
      }
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </ErrorBoundary>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export { AuthContext };
