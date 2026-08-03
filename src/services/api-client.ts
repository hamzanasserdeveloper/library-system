import { getAxiosInstance } from "@/utils/axios";
import { ApiError, ApiResponse, FetchOptions, FetchResult } from "@/types";

interface HttpMethod {
  GET: "GET";
  POST: "POST";
  PUT: "PUT";
  PATCH: "PATCH";
  DELETE: "DELETE";
}

function buildUrlWithParams(endpoint: string, params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return endpoint;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export async function baseFetch<
  TResponse = unknown,
  TRequest = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
>(options: FetchOptions<TResponse, TRequest, TParams>): Promise<FetchResult<TResponse>> {
  const {
    endpoint,
    method,
    params,
    body,
    headers,
    onSuccess,
    onError,
  } = options;

  try {
    const axios = getAxiosInstance(false);
    const url = buildUrlWithParams(endpoint, params);

    const response = await axios.request<ApiResponse<TResponse>>({
      url,
      method: method as HttpMethod,
      data: body,
      headers,
    });

    const data = response.data.data as TResponse;

    if (onSuccess) {
      onSuccess(data);
    }

    return { data, error: null };
  } catch (err) {
    let apiError: ApiError;

    if (err instanceof Error) {
      const axiosError = err as { response?: { status?: number; data?: unknown }; code?: string };
      apiError = {
        name: "ApiError",
        message: err.message,
        status: axiosError.response?.status,
        code: axiosError.code,
        data: axiosError.response?.data,
      };
    } else {
      apiError = {
        name: "ApiError",
        message: "Unknown error occurred",
      };
    }

    if (onError) {
      onError(apiError);
    }

    return { data: null, error: apiError };
  }
}

export function createBaseFetch(isServerSide: boolean = false) {
  return async function baseFetchServer<
    TResponse = unknown,
    TRequest = unknown,
    TParams extends Record<string, unknown> = Record<string, unknown>
  >(options: FetchOptions<TResponse, TRequest, TParams>): Promise<FetchResult<TResponse>> {
    const {
      endpoint,
      method,
      params,
      body,
      headers,
      onSuccess,
      onError,
    } = options;

    try {
      const axios = getAxiosInstance(isServerSide);
      const url = buildUrlWithParams(endpoint, params);

      const response = await axios.request<ApiResponse<TResponse>>({
        url,
        method: method as HttpMethod,
        data: body,
        headers,
      });

      const data = response.data.data as TResponse;

      if (onSuccess) {
        onSuccess(data);
      }

      return { data, error: null };
    } catch (err) {
      let apiError: ApiError;

      if (err instanceof Error) {
        const axiosError = err as { response?: { status?: number; data?: unknown }; code?: string };
        apiError = {
          name: "ApiError",
          message: err.message,
          status: axiosError.response?.status,
          code: axiosError.code,
          data: axiosError.response?.data,
        };
      } else {
        apiError = {
          name: "ApiError",
          message: "Unknown error occurred",
        };
      }

      if (onError) {
        onError(apiError);
      }

      return { data: null, error: apiError };
    }
  };
}