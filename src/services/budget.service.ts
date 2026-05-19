import { api } from "./api";

export interface Budget {
  id: string;
  name: string;
  spent: number;
  limit: number;
  icon: string;
  overBudget: boolean;
  percentUsed: number;
}

export interface BudgetAnalytics {
  totalLimit: number;
  totalSpent: number;
  remaining: number;
  overBudgetCount: number;
  categories: Budget[];
}

export const budgetService = {
  getAll: (month?: number, year?: number) =>
    api.get<{ currency: string; items: Budget[] }>("/budgets", { month, year }),

  getAnalytics: () => api.get<BudgetAnalytics>("/budgets/analytics"),

  create: (data: {
    name: string;
    limit: number;
    icon?: string;
    period?: "WEEKLY" | "MONTHLY" | "YEARLY";
    month?: number;
    year?: number;
  }) => api.post<Budget>("/budgets", data),

  update: (id: string, data: Partial<{ name: string; limit: number; icon?: string }>) =>
    api.patch<Budget>(`/budgets/${id}`, data),

  remove: (id: string) => api.delete<{ message: string }>(`/budgets/${id}`),
};
