import { getCurrentUser } from "@/services/user.service";
import { User } from "@/types";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function getSession(): Promise<User | null> {
  const result = await getCurrentUser();
  return result.data;
}

export async function requireAuth(redirectTo?: string): Promise<User> {
  const user = await getSession();
  if (!user) {
    const loginUrl = redirectTo
      ? `/en/login?redirect=${encodeURIComponent(redirectTo)}`
      : "/en/login";
    redirect(loginUrl);
  }
  return user;
}

export async function requireGuest(): Promise<void> {
  const user = await getSession();
  if (user) {
    redirect("/en");
  }
}

export function getLocaleFromHeaders(): string {
  const headersList = headers();
  const acceptLanguage = headersList.get("accept-language") || "en";
  return acceptLanguage.split(",")[0].split("-")[0] === "ar" ? "ar" : "en";
}