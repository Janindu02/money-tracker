import { api } from "./api";
import type { Transaction } from "@/types";

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: "INCOME" | "EXPENSE";
  status?: "COMPLETED" | "PENDING";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
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

  getCategories: () =>
    api.get<Array<{ id: string; name: string; icon?: string; type: string }>>(
      "/transactions/categories",
    ),
};
