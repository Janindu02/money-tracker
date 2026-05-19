import { api } from "./api";
import type { LoginInput, RegisterInput, ForgotPasswordInput } from "@/lib/validations/auth";

export type AuthProvider = "google" | "email" | "both";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  plan: string;
  role: string;
  currency: string;
  darkMode: boolean;
  emailVerified: boolean;
  authProvider?: AuthProvider;
  hasGoogleLinked?: boolean;
  hasPassword?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken?: string;
}

export interface AuthProviders {
  emailPassword: boolean;
  google: boolean;
}

export const authService = {
  getProviders: () => api.get<AuthProviders>("/auth/providers"),
  register: (data: RegisterInput) =>
    api.post<AuthResponse>("/auth/register", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }),

  login: (data: LoginInput) =>
    api.post<AuthResponse>("/auth/login", data),

  logout: () => api.post<{ message: string }>("/auth/logout"),

  refresh: () => api.post<AuthResponse>("/auth/refresh"),

  forgotPassword: (data: ForgotPasswordInput) =>
    api.post<{ message: string }>("/auth/forgot-password", data),

  getProfile: () =>
    api.get<
      AuthUser & {
        phone?: string | null;
        location?: string | null;
        memberSince?: string;
        notificationPrefs?: Record<string, boolean> | null;
        authProvider?: AuthProvider;
        hasGoogleLinked?: boolean;
        hasPassword?: boolean;
      }
    >("/users/profile"),
};
