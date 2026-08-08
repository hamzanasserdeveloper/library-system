import type { QueryParams } from "../base";

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipNumber: string;
  status: UserStatus;
  password?: string;
}

export type AuthUser = Omit<User, "password">;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ListUsersParams extends QueryParams {
  _page?: number;
  _per_page?: number;
}
