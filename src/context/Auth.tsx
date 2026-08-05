"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type {
  AuthContextValue,
  AuthUser,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types";
import { CookieKeys } from "@/constants/SystemConfig";
import { Endpoints } from "@/constants/Endpoints";
import { api } from "@/services/client";
import { createApiError } from "@/services/core";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  getCookieByKey,
  removeCookie,
  setCookie,
} from "@/utils/cookies/ClientSide";

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    membershipNumber: user.membershipNumber,
    status: user.status,
  };
}

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const userId = getCookieByKey(CookieKeys.UserId);
        if (userId) {
          const currentUser = await api.get<User>(
            Endpoints.auth.me(Number(userId)),
          );
          setUser(toAuthUser(currentUser));
        }
      } catch {
        // Ignore hydration errors
      } finally {
        setIsLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const users = await api.get<User[]>(
        Endpoints.users.byEmail(credentials.email),
      );
      const found = users.find(
        (candidate) => candidate.email === credentials.email,
      );

      if (!found || found.password !== credentials.password) {
        throw createApiError("Invalid email or password", 401);
      }

      setCookie(CookieKeys.UserId, String(found.id));
      setCookie(CookieKeys.Token, "fake-jwt-token");

      setUser(toAuthUser(found));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const existing = await api.get<User[]>(
        Endpoints.users.byEmail(data.email),
      );
      if (existing.length > 0) {
        throw createApiError("Email already registered", 400);
      }

      const created = await api.post<User>(Endpoints.auth.register, data);

      setCookie(CookieKeys.UserId, String(created.id));
      setCookie(CookieKeys.Token, "fake-jwt-token");

      setUser(toAuthUser(created));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
          <div className="flex flex-col items-center gap-4">
            <p className="text-[30px] font-bold">
              {" "}
              We had an error pls try again
            </p>
            <button
              className="bg-primary px-6 py-2 rounded-full transition cursor-pointer hover:opacity-80"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </button>
          </div>
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
