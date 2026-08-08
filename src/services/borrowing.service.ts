import { cacheTag } from "next/cache";
import { Endpoints } from "@/constants/Endpoints";
import type {
  BaseListResponse,
  Borrowing,
  ListBorrowingsParams,
} from "@/types";
import { ssrApi } from "./server";

function normalizeBorrowing(borrowing: Borrowing): Borrowing {
  return {
    ...borrowing,
    id: String(borrowing.id),
    bookId: String(borrowing.bookId),
    userId: String(borrowing.userId),
  };
}

function toPage<T>(
  response: BaseListResponse<T> | T[],
): BaseListResponse<T> {
  if (Array.isArray(response)) {
    return {
      data: response,
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: response.length,
    };
  }
  return response;
}

export async function getBorrowingsByUser(
  userId: string,
  params: ListBorrowingsParams = {},
): Promise<BaseListResponse<Borrowing>> {
  "use cache";
  cacheTag("library");
  const response = await ssrApi.get<BaseListResponse<Borrowing> | Borrowing[]>(
    Endpoints.borrowings.list,
    { userId, _page: 1, _per_page: 100, ...params },
  );
  const page = toPage(response);
  return { ...page, data: page.data.map(normalizeBorrowing) };
}
