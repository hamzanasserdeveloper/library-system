import { baseFetch } from "./api-client";
import { Endpoints } from "@/constants/Endpoints";
import { User, PaginatedResponse, ApiError } from "@/types";
import { CookieKeys, HttpMethod } from "@/constants/SystemConfig";
import {
  getCookieByKey,
  removeCookie,
  setCookie,
} from "@/utils/cookies/ClientSide";

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

function createError(message: string, status: number): ApiError {
  return {
    name: "ApiError",
    message,
    status,
    code: String(status),
    data: null,
  };
}

export const userService = {
  async login(credentials: { email: string; password: string }) {
    const result = await baseFetch<User[], never, { email: string }>({
      endpoint: Endpoints.users.byEmail(credentials.email),
      method: HttpMethod.GET,
      params: { email: credentials.email },
    });

    if (result.error || !result.data || result.data.length === 0) {
      return {
        data: null,
        error: createError("Invalid email or password", 401),
      };
    }

    const user = result.data[0];
    if (user.password !== credentials.password) {
      return {
        data: null,
        error: createError("Invalid email or password", 401),
      };
    }

    setCookie(CookieKeys.UserId, String(user.id));
    setCookie(CookieKeys.Token, "fake-jwt-token");

    const { password: _, ...userWithoutPassword } = user;
    return { data: userWithoutPassword as User, error: null };
  },

  async register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const existing = await baseFetch<User[], never, { email: string }>({
      endpoint: Endpoints.users.byEmail(data.email),
      method: HttpMethod.GET,
      params: { email: data.email },
    });

    if (existing.data && existing.data.length > 0) {
      return {
        data: null,
        error: createError("Email already registered", 400),
      };
    }

    const result = await baseFetch<User, RegisterData>({
      endpoint: Endpoints.auth.register,
      method: HttpMethod.POST,
      body: data,
    });

    if (result.data) {
      setCookie(CookieKeys.UserId, String(result.data.id));
      setCookie(CookieKeys.Token, "fake-jwt-token");
    }

    return result;
  },

  async getCurrentUser() {
    const userId = getCookieByKey(CookieKeys.UserId);
    if (!userId) return { data: null, error: null };

    return baseFetch<User, never, never>({
      endpoint: `/users/${userId}`,
      method: HttpMethod.GET,
    });
  },

  async getUsers(params: { _page?: number; _per_page?: number } = {}) {
    return baseFetch<
      PaginatedResponse<unknown>,
      never,
      Record<string, unknown>
    >({
      endpoint: Endpoints.users.list,
      method: HttpMethod.GET,
      params: {
        _page: params._page || 1,
        _per_page: params._per_page || 10,
      },
    });
  },

  logout() {
    removeCookie(CookieKeys.UserId);
    removeCookie(CookieKeys.Token);
    removeCookie(CookieKeys.RedirectPath);
  },

  saveRedirectPath(path: string) {
    setCookie(CookieKeys.RedirectPath, path);
  },

  getRedirectPath(): string | null {
    return getCookieByKey(CookieKeys.RedirectPath);
  },

  clearRedirectPath() {
    removeCookie(CookieKeys.RedirectPath);
  },

  async getUserById(id: number) {
    return baseFetch<User, never, never>({
      endpoint: Endpoints.users.detail(id),
      method: HttpMethod.GET,
    });
  },
};
