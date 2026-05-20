"use client";

import { useMemo, useState } from "react";
import { Receipt, TrendingDown, CalendarDays, Heart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { SpendingAreaChart } from "@/components/charts/spending-area-chart";
import { CategoryDonutChart } from "@/components/charts/category-donut-chart";
import { StatCard } from "@/components/shared/stat-card";
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog";
import { ExpensesTable } from "@/components/expenses/expenses-table";
import {
  ExpenseFilters,
  defaultExpenseFilters,
  expenseFiltersToQuery,
  type ExpenseFiltersState,
} from "@/components/expenses/expense-filters";
import { MotionStagger, MotionItem } from "@/components/shared/motion-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { useFetch } from "@/hooks/use-fetch";
import { useExpenseCategories } from "@/hooks/use-expense-categories";
import { transactionService } from "@/services/transaction.service";
import { analyticsService } from "@/services/analytics.service";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";
import { useCurrency } from "@/components/providers/currency-provider";

export default function ExpensesPage() {
  const { formatMoney } = useCurrency();
  const [filters, setFilters] = useState<ExpenseFiltersState>(defaultExpenseFilters);

  const queryParams = useMemo(() => expenseFiltersToQuery(filters), [filters]);
  const analyticsParams = useMemo(() => {
    const { sortBy: _s, sortOrder: _o, ...rest } = queryParams;
    return rest;
  }, [queryParams]);

  const { categories } = useExpenseCategories(true);

  const { data: expenseSummary, refetch: refetchSummary } = useFetch(
    () => analyticsService.getExpenseSummary(analyticsParams),
    [analyticsParams],
  );
  const { data: txData, loading, refetch } = useFetch(
    () =>
      transactionService.getAll({
        type: "EXPENSE",
        limit: 100,
        ...queryParams,
      }),
    [queryParams],
  );
  const { data: monthly, refetch: refetchMonthly } = useFetch(
    () => analyticsService.getMonthly(6),
    [],
  );
  const { data: categorySpending, refetch: refetchCategories } = useFetch(
    () => analyticsService.getCategories(analyticsParams),
    [analyticsParams],
  );

  const refetchAll = () => {
    void refetchSummary();
    void refetch();
    void refetchMonthly();
    void refetchCategories();
  };

  useCurrencyRefresh(refetchAll);

  const expenses = txData?.items ?? [];
  const monthlyTrend =
    monthly?.data?.map((d) => ({ name: d.name, value: d.expenses ?? 0 })) ?? [];
  const categoryData = categorySpending?.data ?? [];

  const totalExpenses = expenseSummary?.totalExpenses ?? 0;
  const transactionCount = expenseSummary?.transactionCount ?? expenses.length;
  const avgDaily = expenseSummary?.avgDaily ?? 0;
  const needTotal = expenseSummary?.needTotal ?? 0;
  const desireTotal = expenseSummary?.desireTotal ?? 0;

  if (loading && !txData) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        description="Track spending by category. Filter by date, type, and need vs desire."
        actions={<AddExpenseDialog onSuccess={refetchAll} />}
      />

      <ExpenseFilters filters={filters} onChange={setFilters} categories={categories} />

      <MotionStagger className="grid gap-4 sm:grid-cols-3">
        <MotionItem className="h-full">
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            icon={TrendingDown}
            className="h-full"
          />
        </MotionItem>
        <MotionItem className="h-full">
          <StatCard
            title="Transactions"
            value={transactionCount}
            icon={Receipt}
            format="number"
            className="h-full"
          />
        </MotionItem>
        <MotionItem className="h-full">
          <StatCard
            title="Avg. Daily"
            value={avgDaily}
            icon={CalendarDays}
            className="h-full"
          />
        </MotionItem>
      </MotionStagger>

      {(needTotal > 0 || desireTotal > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="glass" className="border-emerald-500/20">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Real needs (filtered)</p>
                <p className="text-2xl font-bold">{formatMoney(needTotal)}</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass" className="border-violet-500/20">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <Sparkles className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Desires (filtered)</p>
                <p className="text-2xl font-bold">{formatMoney(desireTotal)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingAreaChart data={monthlyTrend} title="Monthly Expense Trend" />
        <CategoryDonutChart data={categoryData} title="Spending by Category" />
      </div>

      <ExpensesTable
        expenses={expenses}
        title={`All Expenses (${expenses.length})`}
        onChanged={refetchAll}
      />
    </div>
  );
}
