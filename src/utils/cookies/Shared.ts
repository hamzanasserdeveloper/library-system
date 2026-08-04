import { CookieKeys } from "@/constants/SystemConfig";

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

const ONE_MINUTE = 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  sameSite: "lax",
  maxAge: ONE_DAY,
};

export function parseCookies(cookieString: string) {
  return cookieString
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, cookie) => {
      const index = cookie.indexOf("=");

      if (index === -1) return acc;

      const key = cookie.slice(0, index);
      const value = decodeURIComponent(cookie.slice(index + 1));

      acc[key] = value;

      return acc;
    }, {});
}

export function buildCookie(
  key: CookieKeys,
  value: string,
  options: CookieOptions,
) {
  const cookie = [
    `${key}=${encodeURIComponent(value)}`,
    `Path=${options.path ?? "/"}`,
    `SameSite=${options.sameSite ?? "lax"}`,
  ];

  if (options.maxAge) cookie.push(`Max-Age=${options.maxAge}`);

  if (options.domain) cookie.push(`Domain=${options.domain}`);

  if (options.secure) cookie.push("Secure");

  return cookie.join("; ");
}
