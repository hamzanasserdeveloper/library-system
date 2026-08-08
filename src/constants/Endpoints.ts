export const Endpoints = {
  auth: {
    login: "/users",
    register: "/users",
    me: (id: string) => `/users/${id}`,
  },
  books: {
    list: "/books",
    detail: (id: string) => `/books/${id}`,
    create: "/books",
    update: (id: string) => `/books/${id}`,
    delete: (id: string) => `/books/${id}`,
  },
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    byEmail: (email: string) => `/users?email=${encodeURIComponent(email)}`,
  },
  borrowings: {
    list: "/borrowings",
    create: "/borrowings",
    return: (id: string) => `/borrowings/${id}`,
    byUser: (userId: string) => `/borrowings?userId=${userId}`,
    byBook: (bookId: string) => `/borrowings?bookId=${bookId}`,
  },
} as const;
