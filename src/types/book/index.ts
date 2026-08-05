import type { QueryParams } from "../base";

export type BookStatus = "available" | "checked-out";

export interface Book {
  id: number;
  slug: string;
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
  status: BookStatus;
}

export interface ListBooksParams extends QueryParams {
  _page?: number;
  _per_page?: number;
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  status?: BookStatus;
  _sort?: string;
  _order?: "asc" | "desc";
}
