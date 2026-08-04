export const Endpoints = {
  auth: {
    login: "/users",
    register: "/users",
    me: (id: number) => `/users/${id}`,
  },
  books: {
    list: "/books",
    detail: (id: number) => `/books/${id}`,
    create: "/books",
    update: (id: number) => `/books/${id}`,
    delete: (id: number) => `/books/${id}`,
  },
  users: {
    list: "/users",
    detail: (id: number) => `/users/${id}`,
    byEmail: (email: string) => `/users?email=${encodeURIComponent(email)}`,
  },
  borrowings: {
    list: "/borrowings",
    create: "/borrowings",
    return: (id: number) => `/borrowings/${id}`,
    byUser: (userId: number) => `/borrowings?userId=${userId}`,
    byBook: (bookId: number) => `/borrowings?bookId=${bookId}`,
  },
} as const;
