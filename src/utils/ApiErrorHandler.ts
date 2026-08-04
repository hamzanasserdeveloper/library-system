import axios from "axios";

export interface ApiError {
  name: "ApiError";
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Resource Not Found",
  409: "Conflict",
  422: "Validation Failed",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

export function mapApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      name: "ApiError",
      message: "Unknown Error",
    };
  }

  if (axios.isCancel(error)) {
    return {
      name: "ApiError",
      message: "Request Cancelled",
      code: error.code,
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      name: "ApiError",
      message: "Request Timeout",
      code: error.code,
    };
  }

  if (!error.response) {
    return {
      name: "ApiError",
      message: "Unable to connect to server",
      code: error.code,
    };
  }

  return {
    name: "ApiError",
    message: STATUS_MESSAGES[error.response.status] ?? "Unexpected Error",
    status: error.response.status,
    code: error.code,
    data: error.response.data,
  };
}
