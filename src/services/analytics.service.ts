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

export interface ExpenseSummary {
  currency: string;
  totalExpenses: number;
  transactionCount: number;
  avgDaily: number;
  needTotal: number;
  desireTotal: number;
}

export interface ExpenseFilterQuery {
  categoryId?: string;
  expenseNature?: "NEED" | "DESIRE";
  year?: number;
  month?: number;
  day?: number;
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

  getCategories: (filters?: ExpenseFilterQuery) =>
    api.get<{ currency: string; data: CategorySpending[] }>(
      "/analytics/categories",
      filters as Record<string, unknown>,
    ),

  getExpenseSummary: (filters?: ExpenseFilterQuery) =>
    api.get<ExpenseSummary>(
      "/analytics/expenses/summary",
      filters as Record<string, unknown>,
    ),

  getTrends: () =>
    api.get<{
      cashFlow: ChartDataPoint[];
      incomeVsExpenses: ChartDataPoint[];
    }>("/analytics/trends"),

  getSavings: () => api.get<{ currency: string; data: SavingsTrend[] }>("/analytics/savings"),
};
