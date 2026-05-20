"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_EXPENSE_CATEGORIES } from "@/constants/expense-categories";
import {
  mapToExpenseCategory,
  transactionService,
  type CreateCategoryInput,
} from "@/services/transaction.service";
import type { ExpenseCategory } from "@/types";

export function useExpenseCategories(enabled = true) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedFromApi, setLoadedFromApi] = useState(false);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setLoadError(null);
    try {
      const cats = await transactionService.getCategories("EXPENSE");
      const list =
        cats.length > 0
          ? cats.map(mapToExpenseCategory)
          : [...DEFAULT_EXPENSE_CATEGORIES];
      setCategories(list);
      setLoadedFromApi(cats.length > 0);
    } catch {
      setCategories([...DEFAULT_EXPENSE_CATEGORIES]);
      setLoadedFromApi(false);
      setLoadError("Could not load categories. Using defaults — if save fails, refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  const createCategory = useCallback(async (data: CreateCategoryInput) => {
    const created = await transactionService.createCategory(data);
    const mapped = mapToExpenseCategory(created);
    setCategories((prev) => [...prev, mapped].sort((a, b) => a.name.localeCompare(b.name)));
    return mapped;
  }, []);

  return { categories, loading, loadError, loadedFromApi, reload: load, createCategory };
}
