import { api } from "./api";
import type { Insight } from "@/types";

export const aiInsightsService = {
  getAll: () => api.get<Insight[]>("/ai-insights"),

  generate: () => api.post<Insight[]>("/ai-insights/generate"),

  dismiss: (id: string) => api.delete<{ message: string }>(`/ai-insights/${id}`),
};
