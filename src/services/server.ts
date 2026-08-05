import axios from "axios";
import { cookies } from "next/headers";
import { cacheTag } from "next/cache";

import { API_CONFIG, CookieKeys, HttpMethod } from "@/constants/SystemConfig";
import type { ApiError, QueryParams } from "@/types";
import { mapApiError } from "@/utils/ApiErrorHandler";
import { parseCookies } from "@/utils/cookies/Shared";
import {
  buildUrlWithParams,
  createApiError,
  createApiService,
  toFormData,
  type ApiTransport,
  type RequestConfig,
} from "./core";

function createServerAxiosInstance(
  authCookie?: string,
  additionalHeaders?: Record<string, string>,
) {
  const token = authCookie
    ? (parseCookies(authCookie)[CookieKeys.Token] ?? null)
    : null;

  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

interface SSROptions {
  params?: QueryParams;
  data?: unknown;
  cookies?: string;
  headers?: Record<string, string>;
}

export class SSRFetch {
  static async request<TResponse>(
    endpoint: string,
    method: HttpMethod = HttpMethod.GET,
    options: SSROptions = {},
  ): Promise<TResponse> {
    const instance = createServerAxiosInstance(options.cookies, options.headers);
    const url = buildUrlWithParams(endpoint, options.params);

    try {
      switch (method) {
        case HttpMethod.GET: {
          const response = await instance.get<TResponse>(url);
          return response.data;
        }
        case HttpMethod.POST: {
          const response = await instance.post<TResponse>(url, options.data);
          return response.data;
        }
        case HttpMethod.PUT: {
          const response = await instance.put<TResponse>(url, options.data);
          return response.data;
        }
        case HttpMethod.PATCH: {
          const response = await instance.patch<TResponse>(url, options.data);
          return response.data;
        }
        case HttpMethod.DELETE: {
          const response = await instance.delete<TResponse>(url, {
            data: options.data,
          });
          return response.data;
        }
        case HttpMethod.PostForm: {
          const formData = toFormData((options.data ?? {}) as object);
          const response = await instance.postForm<TResponse>(url, formData);
          return response.data;
        }
        default:
          throw createApiError(`Unsupported method: ${method}`, 500);
      }
    } catch (error) {
      throw mapApiError(error) as ApiError;
    }
  }

  static get<TResponse>(
    endpoint: string,
    params?: QueryParams,
    options: Omit<SSROptions, "params" | "data"> = {},
  ): Promise<TResponse> {
    return this.request(endpoint, HttpMethod.GET, { params, ...options });
  }

  static post<TResponse, TData = unknown>(
    endpoint: string,
    data?: TData,
    options: Omit<SSROptions, "params" | "data"> = {},
  ): Promise<TResponse> {
    return this.request(endpoint, HttpMethod.POST, { data, ...options });
  }

  static put<TResponse, TData = unknown>(
    endpoint: string,
    data?: TData,
    options: Omit<SSROptions, "params" | "data"> = {},
  ): Promise<TResponse> {
    return this.request(endpoint, HttpMethod.PUT, { data, ...options });
  }

  static patch<TResponse, TData = unknown>(
    endpoint: string,
    data?: TData,
    options: Omit<SSROptions, "params" | "data"> = {},
  ): Promise<TResponse> {
    return this.request(endpoint, HttpMethod.PATCH, { data, ...options });
  }

  static delete<TResponse>(
    endpoint: string,
    options: Omit<SSROptions, "params" | "data"> = {},
  ): Promise<TResponse> {
    return this.request(endpoint, HttpMethod.DELETE, options);
  }

  static async batch<TResults extends Record<string, unknown>>(
    requests: Record<
      keyof TResults,
      {
        endpoint: string;
        method?: HttpMethod;
        params?: QueryParams;
        data?: unknown;
      }
    >,
    options: { cookies?: string; headers?: Record<string, string> } = {},
  ): Promise<TResults> {
    const keys = Object.keys(requests) as Array<keyof TResults>;

    const results = await Promise.all(
      keys.map((key) => {
        const request = requests[key];
        return this.request<TResults[keyof TResults]>(
          request.endpoint,
          request.method,
          {
            params: request.params,
            data: request.data,
            ...options,
          },
        );
      }),
    );

    return keys.reduce((acc, key, index) => {
      acc[key] = results[index];
      return acc;
    }, {} as TResults);
  }
}

export async function serverGet<TResponse>(
  endpoint: string,
  params?: QueryParams,
  authCookie?: string,
): Promise<TResponse> {
  'use cache'
  cacheTag("library");

  const token = authCookie
    ? (parseCookies(authCookie)[CookieKeys.Token] ?? null)
    : null;

  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const search = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.append(key, String(value));
      }
    });
  }
  const queryString = search.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  const response = await instance.get<TResponse>(url);
  return response.data;
}

export async function withServerAuth<T>(
  handler: (cookieString: string) => Promise<T>,
): Promise<T> {
  const cookieStore = await cookies();
  return handler(cookieStore.toString());
}

const serverTransport: ApiTransport = {
  async request<TResponse>(
    config: RequestConfig<TResponse>,
  ): Promise<TResponse> {
    if (config.method === HttpMethod.GET) {
      return serverGet<TResponse>(
        config.endpoint,
        config.params as QueryParams | undefined,
        config.cookies,
      );
    }

    return SSRFetch.request<TResponse>(config.endpoint, config.method, {
      params: config.params as QueryParams | undefined,
      data: config.body,
      cookies: config.cookies,
      headers: config.headers,
    });
  },
};

export const ssrApi = createApiService(serverTransport);
