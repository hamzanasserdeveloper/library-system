import { ApiError, ApiResponse, FetchOptions, FetchResult } from "@/types";
import { getAxiosInstance } from "@/utils/Axios";

function buildUrl(endpoint: string, params?: Record<string, unknown>) {
  if (!params) return endpoint;

  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
    } else {
      search.append(key, String(value));
    }
  });

  return search.toString() ? `${endpoint}?${search.toString()}` : endpoint;
}

export async function baseFetch<
  TResponse,
  TRequest = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>,
>(
  options: FetchOptions<TResponse, TRequest, TParams>,
  server = false,
): Promise<FetchResult<TResponse>> {
  try {
    const response = await getAxiosInstance(server).request<
      ApiResponse<TResponse>
    >({
      url: buildUrl(options.endpoint, options.params),
      method: options.method,
      data: options.body,
      headers: options.headers,
    });

    options.onSuccess?.(response.data.data);

    return {
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    const apiError = error as ApiError;

    options.onError?.(apiError);

    return {
      data: null,
      error: apiError,
    };
  }
}

export const createBaseFetch =
  (server = false) =>
  <
    TResponse,
    TRequest = unknown,
    TParams extends Record<string, unknown> = Record<string, unknown>,
  >(
    options: FetchOptions<TResponse, TRequest, TParams>,
  ) =>
    baseFetch(options, server);
