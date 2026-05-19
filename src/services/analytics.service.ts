import { api } from "./api";
import type { ChartDataPoint } from "@/types";

export interface DashboardSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNetChange: number;
  totalBalance: number;
  savingsYield: number;
  netWorth: number;
  netWorthChange: number;
}

export interface CategorySpending {
  name: string;
  value: number;
  color: string;
}

export interface SavingsTrend {
  name: string;
  saved: number;
  target: number;
  progress: number;
}

export const analyticsService = {
  getSummary: () => api.get<DashboardSummary>("/analytics/summary"),

  getMonthly: (months = 6) =>
    api.get<{ currency: string; data: ChartDataPoint[] }>("/analytics/monthly", { months }),

  getCategories: () => api.get<{ currency: string; data: CategorySpending[] }>("/analytics/categories"),

  getTrends: () =>
    api.get<{
      cashFlow: ChartDataPoint[];
      incomeVsExpenses: ChartDataPoint[];
    }>("/analytics/trends"),

  getSavings: () => api.get<{ currency: string; data: SavingsTrend[] }>("/analytics/savings"),
};
