export const Endpoints = {
  // Auth
  auth: {
    login: "/users",           // POST - find user by email (we'll filter)
    register: "/users",        // POST - create user
    me: (id: number) => `/users/${id}`, // GET - get current user
  },
  // Books
  books: {
    list: "/books",
    detail: (id: number) => `/books/${id}`,
    create: "/books",
    update: (id: number) => `/books/${id}`,
    delete: (id: number) => `/books/${id}`,
  },
  // Users
  users: {
    list: "/users",
    detail: (id: number) => `/users/${id}`,
    byEmail: (email: string) => `/users?email=${encodeURIComponent(email)}`,
  },
  // Borrowings
  borrowings: {
    list: "/borrowings",
    create: "/borrowings",
    return: (id: number) => `/borrowings/${id}`,
    byUser: (userId: number) => `/borrowings?userId=${userId}`,
    byBook: (bookId: number) => `/borrowings?bookId=${bookId}`,
  },
} as const;