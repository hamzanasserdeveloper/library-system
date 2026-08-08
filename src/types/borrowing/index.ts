import type { QueryParams } from "../base";

export type BorrowingStatus = "borrowed" | "returned";

export interface Borrowing {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: BorrowingStatus;
}

export interface ListBorrowingsParams extends QueryParams {
  _page?: number;
  _per_page?: number;
  userId?: string;
  bookId?: string;
  status?: BorrowingStatus;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface CreateBorrowingData {
  bookId: string;
  userId: string;
}
