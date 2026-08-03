import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { CookieManager } from "./cookies";
import { CookieKeys } from "../constants/SystemConfig";

export interface ApiError extends Error {
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
}

export interface ApiResponse<TData = unknown> {
  data: TData;
  message?: string;
  success: boolean;
}

const API_TIMEOUT = 30000;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let abortController = new AbortController();

function getAuthToken(isServerSide: boolean): string | null {
  if (isServerSide) {
    return CookieManager.getServer(CookieKeys.Token);
  }
  return CookieManager.get(CookieKeys.Token);
}

function handleLogout(isServerSide: boolean) {
  if (isServerSide) {
    CookieManager.deleteServer(CookieKeys.Token);
    CookieManager.deleteServer(CookieKeys.UserId);
  } else {
    CookieManager.delete(CookieKeys.Token);
    CookieManager.delete(CookieKeys.UserId);
    if (typeof window !== "undefined") {
      const locale = window.location.pathname.split("/")[1] || "en";
      window.location.href = `/${locale}/login`;
    }
  }
}

function createInstance(isServerSide: boolean = false) {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.signal = abortController.signal;

      const token = getAuthToken(isServerSide);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleLogout(isServerSide);
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const axiosInstance = createInstance(false);
export const serverAxiosInstance = createInstance(true);

export const cancelAllRequests = () => {
  abortController.abort();
  abortController = new AbortController();
};

export function getAxiosInstance(isServerSide: boolean = false) {
  return isServerSide ? serverAxiosInstance : axiosInstance;
}
