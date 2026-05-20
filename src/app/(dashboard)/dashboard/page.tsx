"use client";

import { Plus, TrendingUp, Wallet, PiggyBank, ArrowDownRight } from "lucide-react";
import { MotionWrapper, MotionStagger, MotionItem } from "@/components/shared/motion-wrapper";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { CategoryDonutChart } from "@/components/charts/category-donut-chart";
import { SpendingAreaChart } from "@/components/charts/spending-area-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { CurrencyDisplayBadge } from "@/components/currency/currency-display-badge";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/use-fetch";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";
import { useCurrency } from "@/components/providers/currency-provider";
import { analyticsService } from "@/services/analytics.service";
import { transactionService } from "@/services/transaction.service";
import { goalsService } from "@/services/goals.service";
import { aiInsightsService } from "@/services/ai-insights.service";
import { formatPercent } from "@/utils/format";
import type { SavingsGoal } from "@/types";
import Link from "next/link";
import { BudgetPlannerSection } from "@/components/budget/budget-planner-section";

export default function DashboardPage() {
  const { user } = useAuth();
  const { formatMoney, currencyInfo } = useCurrency();

  const { data: summary, loading: summaryLoading, refetch: refetchSummary } = useFetch(
    () => analyticsService.getSummary(),
    [],
  );
  const { data: cashFlowRes, loading: cfLoading, refetch: refetchCf } = useFetch(
    () => analyticsService.getMonthly(6),
    [],
  );
  const { data: categoriesRes, loading: catLoading, refetch: refetchCat } = useFetch(
    () => analyticsService.getCategories(),
    [],
  );
  const { data: transactionsData, loading: txLoading, refetch: refetchTx } = useFetch(
    () => transactionService.getAll({ limit: 8 }),
    [],
  );
  const { data: goalsRes, loading: goalsLoading, refetch: refetchGoals } = useFetch(
    () => goalsService.getAll(),
    [],
  );
  const { data: insights, loading: insightsLoading, refetch: refetchInsights } = useFetch(
    () => aiInsightsService.getAll(),
    [],
  );

  const refetchAll = () => {
    void refetchSummary();
    void refetchCf();
    void refetchCat();
    void refetchTx();
    void refetchGoals();
    void refetchInsights();
  };
  useCurrencyRefresh(refetchAll);

  const cashFlow = cashFlowRes?.data ?? [];
  const categories = categoriesRes?.data ?? [];
  const goals = goalsRes?.items ?? [];
  const loading = summaryLoading || cfLoading || catLoading || txLoading;

  const savingsGoals: SavingsGoal[] = goals.map((g) => ({
    id: g.id,
    name: g.name,
    saved: g.saved,
    target: g.target,
    deadline: g.deadline,
    icon: g.icon,
    category: g.category,
  }));

  const weeklyFromCashFlow = cashFlow.slice(-7).map((d) => ({ name: d.name, value: d.expenses ?? 0 }));

  if (loading && !summary) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.firstName ?? "there"}. Here's your financial overview (${currencyInfo.code}).`}
        actions={
          <>
            <CurrencyDisplayBadge showRate />
            <AddTransactionDialog onSuccess={refetchAll} />
          </>
        }
      />

      <MotionStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MotionItem>
          <StatCard title="Total Balance" value={summary?.totalBalance ?? 0} change={12.5} icon={Wallet} variant="gradient" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Monthly Income" value={summary?.monthlyIncome ?? 0} change={8.2} icon={TrendingUp} />
        </MotionItem>
        <MotionItem>
          <StatCard title="Monthly Expenses" value={summary?.monthlyExpenses ?? 0} change={-3.1} icon={ArrowDownRight} />
        </MotionItem>
        <MotionItem>
          <StatCard title="Savings Yield" value={summary?.savingsYield ?? 0} change={1.2} icon={PiggyBank} format="percent" />
        </MotionItem>
      </MotionStagger>

      <MotionWrapper delay={0.1}>
        <Card variant="gradient" className="overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/80">Total Net Worth</p>
              <p className="mt-1 text-3xl font-bold text-white">{formatMoney(summary?.netWorth ?? 0)}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {formatPercent(summary?.netWorthChange ?? 0)}
                </Badge>
                <span className="text-sm text-white/80">
                  +{formatMoney(summary?.monthlyNetChange ?? 0)} this month
                </span>
              </div>
            </div>
            <Button variant="secondary" size="lg" className="shrink-0 bg-white text-emerald-700 hover:bg-white/90" asChild>
              <Link href="/savings">
                <Plus className="h-4 w-4" /> View Goals
              </Link>
            </Button>
          </CardContent>
        </Card>
      </MotionWrapper>

      <BudgetPlannerSection compact showCharts={false} className="rounded-2xl border border-border/60 bg-card/30 p-6" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlow} />
        </div>
        <CategoryDonutChart data={categories} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SpendingAreaChart data={weeklyFromCashFlow} />
        {!goalsLoading && <GoalsProgress goals={savingsGoals} />}
        {!insightsLoading && <AiInsightsCard insights={insights ?? []} />}
      </div>

      <TransactionsTable transactions={transactionsData?.items ?? []} />
    </div>
  );
}
