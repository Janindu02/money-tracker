import { api } from "./api";
import type { Transaction } from "@/types";

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: "INCOME" | "EXPENSE";
  status?: "COMPLETED" | "PENDING";
  categoryId?: string;
  expenseNature?: "NEED" | "DESIRE";
  year?: number;
  month?: number;
  day?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "amount" | "name";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedTransactions {
  items: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateTransactionInput {
  name: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  description?: string;
  categoryId?: string;
  currency?: string;
  notes?: string;
  status?: "COMPLETED" | "PENDING";
  isRecurring?: boolean;
  recurringInterval?: string;
  receiptUrl?: string;
  expenseNature?: "NEED" | "DESIRE";
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon?: string | null;
  type: string;
  isDefault?: boolean;
  color?: string | null;
}

export interface CreateCategoryInput {
  name: string;
  icon?: string;
  type?: "EXPENSE" | "INCOME";
  color?: string;
}

export const transactionService = {
  getAll: (filters?: TransactionFilters) =>
    api.get<PaginatedTransactions>("/transactions", filters as Record<string, unknown>),

  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),

  create: (data: CreateTransactionInput) =>
    api.post<Transaction>("/transactions", data),

  update: (id: string, data: Partial<CreateTransactionInput>) =>
    api.patch<Transaction>(`/transactions/${id}`, data),

  remove: (id: string) => api.delete<{ message: string }>(`/transactions/${id}`),

  getCategories: (type?: "EXPENSE" | "INCOME") =>
    api.get<TransactionCategory[]>("/transactions/categories", type ? { type } : undefined),

  createCategory: (data: CreateCategoryInput) =>
    api.post<TransactionCategory>("/transactions/categories", {
      ...data,
      type: data.type ?? "EXPENSE",
    }),

  updateCategory: (id: string, data: Partial<CreateCategoryInput>) =>
    api.patch<TransactionCategory>(`/transactions/categories/${id}`, data),

  removeCategory: (id: string) =>
    api.delete<{ message: string }>(`/transactions/categories/${id}`),
};

export function mapToExpenseCategory(c: TransactionCategory): import("@/types").ExpenseCategory {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon ?? undefined,
    type: c.type,
    isDefault: c.isDefault,
    color: c.color ?? undefined,
  };
}
