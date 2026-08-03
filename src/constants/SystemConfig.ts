export enum CookieKeys {
  Token = "token",
  UserId = "user_id",
  RedirectPath = "redirect_path",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum ToastType {
  Error = "error",
  Success = "success",
  Info = "info",
  Warning = "warning",
}

export enum ToastPosition {
  TopStart = "top-start",
  TopCenter = "top-center",
  TopEnd = "top-end",
  BottomStart = "bottom-start",
  BottomCenter = "bottom-center",
  BottomEnd = "bottom-end",
}

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  TIMEOUT: 30000,
} as const;

export type ToastTypeValue = ToastType;
export type ToastPositionValue = ToastPosition;
export type CookieKeysValue = CookieKeys;
export type HttpMethodValue = HttpMethod;
