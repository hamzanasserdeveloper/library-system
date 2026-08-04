import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { API_CONFIG, CookieKeys } from "@/constants/SystemConfig";
import { getCookieByKey, removeCookie } from "./cookies/ClientSide";
import { mapApiError } from "./ApiErrorHandler";

const API_TIMEOUT = API_CONFIG.TIMEOUT;

const BASE_URL = API_CONFIG.BASE_URL;

let abortController = new AbortController();

async function getAuthToken(isServer: boolean) {
  // return isServer
  //   ? await getServerCookie(CookieKeys.Token)
  //   :
  getCookieByKey(CookieKeys.Token);
}

async function logout(isServer: boolean) {
  // if (isServer) {
  //   await removeServerCookie(CookieKeys.Token);
  //   await removeServerCookie(CookieKeys.UserId);
  //   return;
  // }

  removeCookie(CookieKeys.Token);
  removeCookie(CookieKeys.UserId);

  if (typeof window !== "undefined") {
    const locale = window.location.pathname.split("/")[1] || "en";
    window.location.assign(`/${locale}/login`);
  }
}

function createAxios(isServer = false) {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.signal = abortController.signal;

      const token = getAuthToken(isServer);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(mapApiError(error)),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await logout(isServer);
      }

      return Promise.reject(mapApiError(error));
    },
  );

  return instance;
}

export const axiosClient = createAxios(false);

export const axiosServer = createAxios(true);

export const getAxiosInstance = (server = false) =>
  server ? axiosServer : axiosClient;

export function cancelAllRequests() {
  abortController.abort();
  abortController = new AbortController();
}
