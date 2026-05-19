import { apiClient } from "@/lib/axios";

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, body?: unknown) =>
    apiClient.post<T>(url, body).then((r) => r.data),
  patch: <T>(url: string, body?: unknown) =>
    apiClient.patch<T>(url, body).then((r) => r.data),
  delete: <T>(url: string) => apiClient.delete<T>(url).then((r) => r.data),
};

export { apiClient };
