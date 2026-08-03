import { baseFetch } from "./api-client";
import { Endpoints } from "@/constants/Endpoints";
import { User, PaginatedResponse } from "@/types";
import { CookieManager } from "@/utils/cookies";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, "id"> {
  password: string;
}

export const userService = {
  async login(credentials: LoginCredentials) {
    const result = await baseFetch<User[], never, { email: string }>({
      endpoint: Endpoints.users.byEmail(credentials.email),
      method: "GET" as const,
      params: { email: credentials.email },
    });

    if (result.error || !result.data || result.data.length === 0) {
      return { data: null, error: { message: "Invalid email or password", status: 401 } as any };
    }

    const user = result.data[0];
    if (user.password !== credentials.password) {
      return { data: null, error: { message: "Invalid email or password", status: 401 } as any };
    }

    CookieManager.set("user_id", String(user.id), { maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    CookieManager.set("token", "fake-jwt-token", { maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });

    const { password: _password, ...userWithoutPassword } = user;
    return { data: userWithoutPassword as User, error: null };
  },

  async register(data: RegisterData) {
    const existing = await baseFetch<User[], never, { email: string }>({
      endpoint: Endpoints.users.byEmail(data.email),
      method: "GET" as const,
      params: { email: data.email },
    });

    if (existing.data && existing.data.length > 0) {
      return { data: null, error: { message: "Email already registered", status: 400 } as any };
    }

    const result = await baseFetch<User, RegisterData>({
      endpoint: Endpoints.auth.register,
      method: "POST" as const,
      body: data,
    });

    if (result.data) {
      CookieManager.set("user_id", String(result.data.id), { maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
      CookieManager.set("token", "fake-jwt-token", { maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    }

    return result;
  },

  async getCurrentUser() {
    const userId = CookieManager.get("user_id");
    if (!userId) return { data: null, error: null };

    return baseFetch<User, never, never>({
      endpoint: `/users/${userId}`,
      method: "GET" as const,
    });
  },

  async getUsers(params: { _page?: number; _per_page?: number } = {}) {
    return baseFetch<PaginatedResponse<unknown>, never, unknown>({
      endpoint: Endpoints.users.list,
      method: "GET" as const,
      params: {
        _page: params._page || 1,
        _per_page: params._per_page || 10,
      },
    });
  },

  logout() {
    CookieManager.delete("user_id");
    CookieManager.delete("token");
    CookieManager.delete("redirect_path");
  },

  saveRedirectPath(path: string) {
    CookieManager.set("redirect_path", path, { maxAge: 60 * 60, sameSite: "lax" });
  },

  getRedirectPath(): string | null {
    return CookieManager.get("redirect_path");
  },

  clearRedirectPath() {
    CookieManager.delete("redirect_path");
  },

  async getUserById(id: number) {
    return baseFetch<unknown, never, never>({
      endpoint: Endpoints.users.detail(id),
      method: "GET" as const,
    });
  },
};