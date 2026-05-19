"use client";

import { Brain, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { CategoryDonutChart } from "@/components/charts/category-donut-chart";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { StatCard } from "@/components/shared/stat-card";
import { MotionStagger, MotionItem } from "@/components/shared/motion-wrapper";
import { useFetch } from "@/hooks/use-fetch";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";
import { useCurrency } from "@/components/providers/currency-provider";
import { analyticsService } from "@/services/analytics.service";
import { aiInsightsService } from "@/services/ai-insights.service";

export default function AnalyticsPage() {
  const { formatMoney } = useCurrency();
  const { data: summary, loading: sLoading, refetch: refetchSummary } = useFetch(
    () => analyticsService.getSummary(),
    [],
  );
  const { data: cashFlowRes, refetch: refetchCf } = useFetch(() => analyticsService.getMonthly(6), []);
  const { data: categoriesRes, refetch: refetchCat } = useFetch(() => analyticsService.getCategories(), []);
  const { data: insights, loading: iLoading, refetch: refetchInsights } = useFetch(
    () => aiInsightsService.getAll(),
    [],
  );

  useCurrencyRefresh(() => {
    void refetchSummary();
    void refetchCf();
    void refetchCat();
    void refetchInsights();
  });

  const cashFlow = cashFlowRes?.data ?? [];
  const categories = categoriesRes?.data ?? [];
  const loading = sLoading;
  const healthScore = summary
    ? Math.min(100, Math.round(50 + (summary.monthlyNetChange > 0 ? 20 : 0) + (summary.monthlyExpenses < summary.monthlyIncome ? 30 : 10)))
    : 84;
  const topCategory = categories[0];

  if (loading && !summary) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Financial insights in your display currency." />
      <MotionStagger className="grid gap-4 lg:grid-cols-3">
        <MotionItem>
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Financial Health</p>
                  <p className="mt-2 text-4xl font-bold">
                    {healthScore}
                    <span className="text-lg text-muted-foreground">/100</span>
                  </p>
                  <Badge variant="success" className="mt-2">
                    Net {formatMoney(summary?.monthlyNetChange ?? 0)} this month
                  </Badge>
                </div>
                <Brain className="h-8 w-8 text-primary/40" />
              </div>
              <Progress value={healthScore} className="mt-4" />
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <StatCard title="Net Worth" value={summary?.netWorth ?? 0} change={summary?.netWorthChange ?? 0} icon={TrendingUp} />
        </MotionItem>
        <MotionItem>
          <Card variant="highlight">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Top Expense Category</p>
              <p className="mt-2 text-xl font-bold">{topCategory?.name ?? "—"}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {topCategory ? formatMoney(topCategory.value) + " this month" : "No data yet"}
              </p>
            </CardContent>
          </Card>
        </MotionItem>
      </MotionStagger>
      <div className="grid gap-6 lg:grid-cols-2">
        <CashFlowChart data={cashFlow} title="Cash Flow History" />
        <CategoryDonutChart data={categories} />
      </div>
      {!iLoading && <AiInsightsCard insights={insights ?? []} title="Finova AI Insights" />}
    </div>
  );
}
