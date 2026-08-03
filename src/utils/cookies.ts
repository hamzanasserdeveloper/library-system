import { CookieKeys } from "@/constants/SystemConfig";

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

function parseCookieString(cookieString: string): Map<string, string> {
  const cookies = new Map<string, string>();
  cookieString.split(";").forEach((cookie) => {
    const [key, ...valueParts] = cookie.trim().split("=");
    if (key && valueParts.length > 0) {
      cookies.set(key, valueParts.join("="));
    }
  });
  return cookies;
}

function buildCookieString(
  key: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${key}=${value}`];

  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.httpOnly) parts.push("HttpOnly");

  return parts.join("; ");
}

export class CookieManager {
  private static isServer(): boolean {
    return typeof window === "undefined";
  }

  static get(key: CookieKeys): string | null {
    if (this.isServer()) {
      return null;
    }
    const cookies = parseCookieString(document.cookie);
    return cookies.get(key) || null;
  }

  static set(key: CookieKeys, value: string, options: CookieOptions = {}): void {
    if (this.isServer()) {
      return;
    }
    const defaultOptions: CookieOptions = {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      ...options,
    };
    document.cookie = buildCookieString(key, value, defaultOptions);
  }

  static delete(key: CookieKeys): void {
    if (this.isServer()) {
      return;
    }
    document.cookie = buildCookieString(key, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0).toUTCString(),
    });
  }

  static getServer(key: CookieKeys): string | null {
    if (!this.isServer()) {
      return null;
    }
    try {
      const { cookies } = require("next/headers");
      const cookieStore = cookies();
      return cookieStore.get(key)?.value || null;
    } catch {
      return null;
    }
  }

  static setServer(key: CookieKeys, value: string, options: CookieOptions = {}): void {
    if (!this.isServer()) {
      return;
    }
    try {
      const { cookies } = require("next/headers");
      const cookieStore = cookies();
      cookieStore.set(key, value, {
        path: options.path || "/",
        maxAge: options.maxAge || 60 * 60 * 24 * 7,
        domain: options.domain,
        secure: options.secure ?? true,
        sameSite: options.sameSite || "lax",
        httpOnly: options.httpOnly ?? true,
      });
    } catch {
      // Ignore if not in a server context
    }
  }

  static deleteServer(key: CookieKeys): void {
    if (!this.isServer()) {
      return;
    }
    try {
      const { cookies } = require("next/headers");
      const cookieStore = cookies();
      cookieStore.delete(key);
    } catch {
      // Ignore if not in a server context
    }
  }

  static getAll(): Record<string, string> {
    if (this.isServer()) {
      return {};
    }
    const cookies = parseCookieString(document.cookie);
    return Object.fromEntries(cookies);
  }
}