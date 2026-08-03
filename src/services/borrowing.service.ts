import { baseFetch } from "./api-client";
import { Endpoints } from "@/constants/Endpoints";
import { Borrowing, PaginatedResponse } from "@/types";

export interface ListBorrowingsParams {
  _page?: number;
  _per_page?: number;
  userId?: number;
  bookId?: number;
  status?: "borrowed" | "returned";
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface CreateBorrowingData {
  bookId: number;
  userId: number;
}

export const borrowingService = {
  async getBorrowings(params: ListBorrowingsParams = {}) {
    return baseFetch<PaginatedResponse<Borrowing>, never, ListBorrowingsParams>({
      endpoint: Endpoints.borrowings.list,
      method: "GET" as const,
      params: {
        _page: params._page || 1,
        _per_page: params._per_page || 10,
        userId: params.userId,
        bookId: params.bookId,
        status: params.status,
        _sort: params._sort,
        _order: params._order,
      },
    });
  },

  async createBorrowing(data: CreateBorrowingData) {
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);

    return baseFetch<Borrowing, { bookId: number; userId: number; borrowDate: string; dueDate: string; status: "borrowed" }>({
      endpoint: Endpoints.borrowings.create,
      method: "POST" as const,
      body: {
        bookId: data.bookId,
        userId: data.userId,
        borrowDate: now.toISOString(),
        dueDate: dueDate.toISOString(),
        status: "borrowed",
      },
    });
  },

  async returnBorrowing(borrowingId: number) {
    return baseFetch<Borrowing, { returnDate: string; status: "returned" }>({
      endpoint: Endpoints.borrowings.return(borrowingId),
      method: "PATCH" as const,
      body: {
        returnDate: new Date().toISOString(),
        status: "returned",
      },
    });
  },

  async getBorrowingById(id: number) {
    return baseFetch<Borrowing, never, never>({
      endpoint: `/borrowings/${id}`,
      method: "GET" as const,
    });
  },
};