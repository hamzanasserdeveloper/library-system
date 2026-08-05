import type { QueryParams } from "../base";

export type BorrowingStatus = "borrowed" | "returned";

export interface Borrowing {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: BorrowingStatus;
}

export interface ListBorrowingsParams extends QueryParams {
  _page?: number;
  _per_page?: number;
  userId?: number;
  bookId?: number;
  status?: BorrowingStatus;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface CreateBorrowingData {
  bookId: number;
  userId: number;
}
