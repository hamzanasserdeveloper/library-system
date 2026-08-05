import { HttpMethod } from "@/constants/SystemConfig";
import type { ApiError, QueryParams } from "@/types";
import { mapApiError } from "@/utils/ApiErrorHandler";
import { axiosClient } from "@/utils/Axios";
import {
  buildUrlWithParams,
  createApiService,
  toFormData,
  type ApiTransport,
  type RequestConfig,
} from "./core";

const clientTransport: ApiTransport = {
  async request<TResponse>(
    config: RequestConfig<TResponse>,
  ): Promise<TResponse> {
    const url = buildUrlWithParams(
      config.endpoint,
      config.params as QueryParams | undefined,
    );

    try {
      if (config.method === HttpMethod.PostForm) {
        const formData = toFormData((config.body ?? {}) as object);
        const response = await axiosClient.postForm<TResponse>(url, formData, {
          headers: config.headers,
          signal: config.signal,
        });
        return response.data;
      }

      const response = await axiosClient.request<TResponse>({
        url,
        method: config.method,
        data: config.body,
        headers: config.headers,
        signal: config.signal,
      });
      return response.data;
    } catch (error) {
      throw mapApiError(error) as ApiError;
    }
  },
};

export const api = createApiService(clientTransport);
