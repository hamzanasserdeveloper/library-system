import { HttpMethod } from "@/constants/SystemConfig";
import type { ApiError, QueryParams } from "@/types";

export interface RequestConfig<
  TResponse = unknown,
  TBody = unknown,
  TParams extends object = object,
> {
  endpoint: string;
  method: HttpMethod;
  params?: TParams;
  body?: TBody;
  headers?: Record<string, string>;
  cookies?: string;
  signal?: AbortSignal;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: ApiError) => void;
}

export interface ServiceOptions<
  TResponse = unknown,
  TBody = unknown,
  TParams extends object = object,
> {
  params?: TParams;
  body?: TBody;
  headers?: Record<string, string>;
  cookies?: string;
  signal?: AbortSignal;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: ApiError) => void;
}

export interface ApiTransport {
  request<TResponse>(config: RequestConfig<TResponse>): Promise<TResponse>;
}

export interface ApiService {
  request<TResponse, TBody = unknown, TParams extends object = object>(
    config: RequestConfig<TResponse, TBody, TParams>,
  ): Promise<TResponse>;
  get<TResponse, TParams extends object = object>(
    endpoint: string,
    params?: TParams,
    options?: ServiceOptions<TResponse, never, TParams>,
  ): Promise<TResponse>;
  post<TResponse, TBody = unknown, TParams extends object = object>(
    endpoint: string,
    body?: TBody,
    options?: ServiceOptions<TResponse, TBody, TParams>,
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown, TParams extends object = object>(
    endpoint: string,
    body?: TBody,
    options?: ServiceOptions<TResponse, TBody, TParams>,
  ): Promise<TResponse>;
  patch<TResponse, TBody = unknown, TParams extends object = object>(
    endpoint: string,
    body?: TBody,
    options?: ServiceOptions<TResponse, TBody, TParams>,
  ): Promise<TResponse>;
  delete<TResponse, TParams extends object = object>(
    endpoint: string,
    options?: ServiceOptions<TResponse, never, TParams>,
  ): Promise<TResponse>;
  postForm<TResponse, TBody = unknown, TParams extends object = object>(
    endpoint: string,
    body?: TBody,
    options?: ServiceOptions<TResponse, TBody, TParams>,
  ): Promise<TResponse>;
}

export function createApiService(transport: ApiTransport): ApiService {
  const request = async <
    TResponse,
    TBody = unknown,
    TParams extends object = object,
  >(
    config: RequestConfig<TResponse, TBody, TParams>,
  ): Promise<TResponse> => {
    try {
      const data = await transport.request<TResponse>(
        config as RequestConfig<TResponse>,
      );
      config.onSuccess?.(data);
      return data;
    } catch (error) {
      config.onError?.(error as ApiError);
      throw error;
    }
  };

  return {
    request,
    get: (endpoint, params, options) =>
      request({ endpoint, method: HttpMethod.GET, params, ...options }),
    post: (endpoint, body, options) =>
      request({ endpoint, method: HttpMethod.POST, body, ...options }),
    put: (endpoint, body, options) =>
      request({ endpoint, method: HttpMethod.PUT, body, ...options }),
    patch: (endpoint, body, options) =>
      request({ endpoint, method: HttpMethod.PATCH, body, ...options }),
    delete: (endpoint, options) =>
      request({ endpoint, method: HttpMethod.DELETE, ...options }),
    postForm: (endpoint, body, options) =>
      request({ endpoint, method: HttpMethod.PostForm, body, ...options }),
  };
}

export function buildUrlWithParams(
  endpoint: string,
  params?: QueryParams,
): string {
  if (!params) return endpoint;

  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });

  const queryString = search.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export function toFormData<T extends object>(
  data: T,
  options?: {
    stringifyArrays?: boolean;
    indices?: boolean;
    nullsAsEmpty?: boolean;
  },
): FormData {
  const formData = new FormData();
  const stringifyArrays = options?.stringifyArrays ?? true;
  const indices = options?.indices ?? false;
  const nullsAsEmpty = options?.nullsAsEmpty ?? true;

  const appendValue = (key: string, value: unknown): void => {
    if (value == null) {
      if (nullsAsEmpty) {
        formData.append(key, "");
      }
      return;
    }

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      if (stringifyArrays) {
        formData.append(key, JSON.stringify(value));
        return;
      }
      value.forEach((item, index) => {
        const arrayKey = indices ? `${key}[${index}]` : `${key}[]`;
        appendValue(arrayKey, item);
      });
      return;
    }

    if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(
        ([nestedKey, nestedValue]) => {
          appendValue(`${key}[${nestedKey}]`, nestedValue);
        },
      );
      return;
    }

    formData.append(key, String(value));
  };

  Object.entries(data).forEach(([key, value]) => appendValue(key, value));

  return formData;
}

export function createApiError(
  message: string,
  status?: number,
  code?: string,
): ApiError {
  return {
    name: "ApiError",
    message,
    status,
    code,
    data: null,
  };
}

export async function safeResult<T>(
  promise: Promise<T>,
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    return { data: await promise, error: null };
  } catch (error) {
    return { data: null, error: error as ApiError };
  }
}
