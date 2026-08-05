export interface ApiError {
  name: "ApiError";
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
}

export interface BaseListResponse<T> {
  data: T[];
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;
