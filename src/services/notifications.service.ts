import { api } from "./api";
import type { Notification } from "@/types";

export const notificationsService = {
  getAll: (page = 1, limit = 20) =>
    api.get<{ items: Notification[]; meta: { total: number } }>("/notifications", {
      page,
      limit,
    }),

  getUnreadCount: () => api.get<{ count: number }>("/notifications/unread-count"),

  markAllRead: () => api.patch<{ message: string }>("/notifications/read-all"),

  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
};
