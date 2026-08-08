import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { CookieKeys } from "./src/constants/SystemConfig";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = [
  "/borrowings",
  "/users",
];

const PUBLIC_PATHS = [
  "/login",
  "/signup",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const pathname = new URL(request.url).pathname;

  // Skip auth check for public paths
  if (isPublic(pathname)) {
    return response;
  }

  // Check if path is protected
  if (isProtected(pathname)) {
    const userId = request.headers.get("cookie")?.includes(CookieKeys.UserId);

    if (!userId) {
      const locale = pathname.split("/")[1] || "en";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};