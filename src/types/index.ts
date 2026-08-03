export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publishedYear: number;
  language: string;
  pages: number;
  description: string;
  cover: string;
  totalCopies: number;
  availableCopies: number;
  status: "available" | "checked-out";
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  membershipNumber: string;
  status: "active" | "inactive";
  password?: string;
}

export interface Borrowing {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned";
}

export interface PaginatedResponse<T> {
  data: T[];
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
}

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

export interface FetchOptions<
  TResponse = unknown,
  TRequest = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
> {
  endpoint: string;
  method: HttpMethod;
  params?: TParams;
  body?: TRequest;
  headers?: Record<string, string>;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: ApiError) => void;
}

export interface FetchResult<T> {
  data: T | null;
  error: ApiError | null;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ToastType = "error" | "success" | "info" | "warning";
export type ToastPosition = "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
  createdAt: number;
}

export interface ShowToastOptions {
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
}