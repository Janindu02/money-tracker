import { api } from "./api";

export interface Goal {
  id: string;
  name: string;
  saved: number;
  target: number;
  deadline: string;
  icon: string;
  category: string;
  percentComplete: number;
  completed: boolean;
}

export interface GoalsAnalytics {
  totalTarget: number;
  totalSaved: number;
  overallProgress: number;
  completedCount: number;
  goals: Goal[];
}

export const goalsService = {
  getAll: () => api.get<{ currency: string; items: Goal[] }>("/goals"),

  getAnalytics: () => api.get<GoalsAnalytics>("/goals/analytics"),

  create: (data: {
    name: string;
    target: number;
    saved?: number;
    deadline?: string;
    icon?: string;
    category?: string;
  }) => api.post<Goal>("/goals", data),

  update: (id: string, data: Partial<{ name: string; target: number; saved: number }>) =>
    api.patch<Goal>(`/goals/${id}`, data),

  remove: (id: string) => api.delete<{ message: string }>(`/goals/${id}`),
};
