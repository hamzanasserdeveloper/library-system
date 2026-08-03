import { baseFetch } from "./api-client";
import { HttpMethod } from "@/constants/SystemConfig";
import { Endpoints } from "@/constants/Endpoints";
import { Book, PaginatedResponse, ListBooksParams } from "@/types";

export interface ListBooksParams {
  _page?: number;
  _per_page?: number;
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  status?: "available" | "checked-out";
  _sort?: string;
  _order?: "asc" | "desc";
}

export const bookService = {
  async getBooks(params: ListBooksParams = {}) {
    return baseFetch<PaginatedResponse<Book>, never, ListBooksParams>({
      endpoint: Endpoints.books.list,
      method: HttpMethod.GET,
      params: {
        _page: params._page || 1,
        _per_page: params._per_page || 10,
        title: params.title,
        author: params.author,
        isbn: params.isbn,
        category: params.category,
        status: params.status,
        _sort: params._sort,
        _order: params._order,
      },
    });
  },

  async getBook(id: number) {
    return baseFetch<Book, never, never>({
      endpoint: Endpoints.books.detail(id),
      method: HttpMethod.GET,
    });
  },

  async createBook(data: Omit<Book, "id">) {
    return baseFetch<Book, Omit<Book, "id">>({
      endpoint: Endpoints.books.create,
      method: HttpMethod.POST,
      body: data,
    });
  },

  async updateBook(id: number, data: Partial<Book>) {
    return baseFetch<Book, Partial<Book>>({
      endpoint: Endpoints.books.update(id),
      method: HttpMethod.PATCH,
      body: data,
    });
  },

  async deleteBook(id: number) {
    return baseFetch<void, never>({
      endpoint: Endpoints.books.delete(id),
      method: HttpMethod.DELETE,
    });
  },
};