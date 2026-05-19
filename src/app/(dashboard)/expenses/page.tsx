"use client";

import { Plus, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { SpendingAreaChart } from "@/components/charts/spending-area-chart";
import { StatCard } from "@/components/shared/stat-card";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { MotionStagger, MotionItem } from "@/components/shared/motion-wrapper";
import { useFetch } from "@/hooks/use-fetch";
import { transactionService } from "@/services/transaction.service";
import { analyticsService } from "@/services/analytics.service";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";

export default function ExpensesPage() {
  const { data: summary, refetch: refetchSummary } = useFetch(() => analyticsService.getSummary(), []);
  const { data: txData, loading, refetch } = useFetch(
    () => transactionService.getAll({ type: "EXPENSE", limit: 50 }),
    [],
  );
  const { data: monthly, refetch: refetchMonthly } = useFetch(() => analyticsService.getMonthly(6), []);

  useCurrencyRefresh(() => {
    void refetchSummary();
    void refetch();
    void refetchMonthly();
  });

  const expenses = txData?.items ?? [];
  const weeklyChart =
    monthly?.data?.slice(-7).map((d) => ({ name: d.name, value: d.expenses ?? 0 })) ?? [];
  const avgDaily = summary?.monthlyExpenses ? Math.round(summary.monthlyExpenses / 30) : 0;

  if (loading && !txData) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        description="Track and categorize your spending."
        action={{ label: "Add Expense", icon: Plus, href: "#" }}
      />
      <div className="flex flex-wrap justify-end gap-3 -mt-4">
        <AddTransactionDialog onSuccess={() => { void refetch(); void refetchSummary(); }} />
      </div>
      <MotionStagger className="grid gap-4 sm:grid-cols-3">
        <MotionItem>
          <StatCard
            title="Total Expenses"
            value={summary?.monthlyExpenses ?? 0}
            change={-3.1}
            icon={TrendingDown}
          />
        </MotionItem>
        <MotionItem>
          <StatCard title="Transactions" value={expenses.length} icon={Receipt} format="number" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Avg. Daily" value={avgDaily} change={5.2} icon={TrendingUp} />
        </MotionItem>
      </MotionStagger>
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingAreaChart data={weeklyChart} title="Monthly Expense Trend" />
        <TransactionsTable transactions={expenses} title="All Expenses" />
      </div>
    </div>
  );
}
