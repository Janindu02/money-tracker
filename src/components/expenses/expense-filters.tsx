"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseCategory } from "@/types";

export interface ExpenseFiltersState {
  categoryId: string;
  expenseNature: string;
  year: string;
  month: string;
  day: string;
  sortOrder: "asc" | "desc";
}

export const defaultExpenseFilters: ExpenseFiltersState = {
  categoryId: "all",
  expenseNature: "all",
  year: "all",
  month: "all",
  day: "all",
  sortOrder: "desc",
};

interface ExpenseFiltersProps {
  filters: ExpenseFiltersState;
  onChange: (filters: ExpenseFiltersState) => void;
  categories: ExpenseCategory[];
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function buildYearOptions() {
  const current = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = current; y >= current - 5; y--) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

const YEAR_OPTIONS = buildYearOptions();

export function expenseFiltersToQuery(filters: ExpenseFiltersState) {
  return {
    ...(filters.categoryId !== "all" && { categoryId: filters.categoryId }),
    ...(filters.expenseNature !== "all" && {
      expenseNature: filters.expenseNature as "NEED" | "DESIRE",
    }),
    ...(filters.year !== "all" && { year: Number(filters.year) }),
    ...(filters.month !== "all" && { month: Number(filters.month) }),
    ...(filters.day !== "all" &&
      filters.month !== "all" &&
      filters.year !== "all" && { day: Number(filters.day) }),
    sortBy: "date" as const,
    sortOrder: filters.sortOrder,
  };
}

export function ExpenseFilters({ filters, onChange, categories }: ExpenseFiltersProps) {
  const set = (patch: Partial<ExpenseFiltersState>) => onChange({ ...filters, ...patch });

  const hasActive =
    filters.categoryId !== "all" ||
    filters.expenseNature !== "all" ||
    filters.year !== "all" ||
    filters.month !== "all" ||
    filters.day !== "all";

  const daysInMonth =
    filters.year !== "all" && filters.month !== "all"
      ? new Date(Number(filters.year), Number(filters.month), 0).getDate()
      : 31;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4 text-primary" />
          Filter expenses
        </div>
        {hasActive && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultExpenseFilters)}
          >
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select value={filters.categoryId} onValueChange={(v) => set({ categoryId: v })}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Expense type</Label>
          <Select value={filters.expenseNature} onValueChange={(v) => set({ expenseNature: v })}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="NEED">Real need</SelectItem>
              <SelectItem value="DESIRE">Desire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Year</Label>
          <Select
            value={filters.year}
            onValueChange={(v) => set({ year: v, month: v === "all" ? "all" : filters.month, day: "all" })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Month</Label>
          <Select
            value={filters.month}
            onValueChange={(v) => set({ month: v, day: "all" })}
            disabled={filters.year === "all"}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Day</Label>
          <Select
            value={filters.day}
            onValueChange={(v) => set({ day: v })}
            disabled={filters.month === "all" || filters.year === "all"}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All days</SelectItem>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Select
          value={filters.sortOrder}
          onValueChange={(v) => set({ sortOrder: v as "asc" | "desc" })}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
