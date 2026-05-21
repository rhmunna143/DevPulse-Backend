import type { UserRole } from "../modules/users/users.interfaces.js";

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

export type AuthUser = {
  id: number;
  name: string;
  role: UserRole;
};

export type AuthTokenPayload = AuthUser & {
  iat?: number;
  exp?: number;
};
