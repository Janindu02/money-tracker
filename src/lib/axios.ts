import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getApiUrl } from "@/lib/api-config";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth-token";
import { useAppStore } from "@/store/use-app-store";
import type { AuthResponse } from "@/services/auth.service";

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: Error | null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
}

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiUrl();
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const authPath = originalRequest.url ?? "";
      if (
        authPath.includes("/auth/refresh") ||
        authPath.includes("/auth/login") ||
        authPath.includes("/auth/register")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post<AuthResponse>("/auth/refresh");
        const payload = refreshResponse.data as AuthResponse | undefined;
        if (payload?.accessToken) {
          setAccessToken(payload.accessToken);
        }
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        clearAccessToken();
        useAppStore.getState().setAuthenticated(false);
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message[0];
    if (typeof data?.message === "string") return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
