"use client";

import { CookieKeys } from "@/constants/SystemConfig";
import {
  buildCookie,
  CookieOptions,
  DEFAULT_COOKIE_OPTIONS,
  parseCookies,
} from "./Shared";

export function getCookieByKey(key: CookieKeys) {
  if (typeof document === "undefined") return null;

  return parseCookies(document.cookie)[key] ?? null;
}

export function getCookies() {
  if (typeof document === "undefined") return {};

  return parseCookies(document.cookie);
}

export function hasCookie(key: CookieKeys) {
  return getCookieByKey(key) !== null;
}

export function setCookie(
  key: CookieKeys,
  value: string,
  options: CookieOptions = {},
) {
  if (typeof document === "undefined") return;

  document.cookie = buildCookie(key, value, {
    ...DEFAULT_COOKIE_OPTIONS,
    ...options,
  });
}

export function removeCookie(key: CookieKeys) {
  if (typeof document === "undefined") return;

  document.cookie = buildCookie(key, "", {
    path: "/",
    maxAge: 0,
  });
}

export function clearCookies() {
  Object.keys(getCookies()).forEach((key) => removeCookie(key as CookieKeys));
}
