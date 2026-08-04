import { cookies } from "next/headers";
import { CookieKeys } from "@/constants/SystemConfig";
import { CookieOptions, DEFAULT_COOKIE_OPTIONS } from "./Shared";

export async function getServerCookie(key: CookieKeys) {
  const store = await cookies();

  return store.get(key)?.value ?? null;
}

export async function setServerCookie(
  key: CookieKeys,
  value: string,
  options: CookieOptions = {},
) {
  const store = await cookies();

  store.set({
    name: key,
    value,
    ...DEFAULT_COOKIE_OPTIONS,
    ...options,
    secure: options.secure ?? process.env.NODE_ENV === "production",
  });
}

export async function removeServerCookie(key: CookieKeys) {
  const store = await cookies();

  store.delete(key);
}

export async function getServerCookies() {
  const store = await cookies();

  return store.getAll();
}
