"use client";

import Link from "next/link";
import {
  Plus,
  Home,
  Utensils,
  Car,
  Zap,
  Film,
  Heart,
  Wallet,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/providers/currency-provider";
import { useAppStore } from "@/store/use-app-store";
import { MotionWrapper } from "@/components/shared/motion-wrapper";
import { useFetch } from "@/hooks/use-fetch";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";
import { budgetService, type Budget } from "@/services/budget.service";
import { aiInsightsService } from "@/services/ai-insights.service";
import { CircularProgressRing } from "@/components/budget/circular-progress-ring";
import { BudgetHealthGauge } from "@/components/budget/budget-health-gauge";
import { CategoryBudgetCard } from "@/components/budget/category-budget-card";
import { SpendingTrendsChart } from "@/components/budget/spending-trends-chart";
import { BudgetPeriodToggle } from "@/components/budget/budget-period-toggle";
import { AddCategoryDialog } from "@/components/budget/add-category-dialog";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { mockBudgetCategories, mockBudgetInsights, mockBudgetSpendingTrends } from "@/services/mock-data";

const icons: Record<string, LucideIcon> = {
  Home,
  Utensils,
  Car,
  Zap,
  Film,
  Heart,
  Wallet,
  ShoppingBag,
};

const PERIOD_MAP = {
  monthly: "MONTHLY",
  weekly: "WEEKLY",
  yearly: "YEARLY",
} as const;

function toBudgetItem(cat: { id: string; name: string; spent: number; limit: number; icon: string }): Budget {
  const percentUsed = cat.limit > 0 ? Math.round((cat.spent / cat.limit) * 100) : 0;
  return {
    id: cat.id,
    name: cat.name,
    spent: cat.spent,
    limit: cat.limit,
    icon: cat.icon,
    overBudget: cat.spent > cat.limit,
    percentUsed,
  };
}

const DEMO_CATEGORIES: Budget[] = mockBudgetCategories.map(toBudgetItem);

const DEMO_ANALYTICS = {
  totalLimit: DEMO_CATEGORIES.reduce((sum, c) => sum + c.limit, 0),
  totalSpent: DEMO_CATEGORIES.reduce((sum, c) => sum + c.spent, 0),
  overBudgetCount: DEMO_CATEGORIES.filter((c) => c.overBudget).length,
};

interface BudgetPlannerSectionProps {
  /** Show on dashboard: fewer categories + link to full page */
  compact?: boolean;
  showCharts?: boolean;
  showPeriodToggle?: boolean;
  /** Hide title/description when the parent page already renders PageHeader */
  showHeader?: boolean;
  className?: string;
}

export function BudgetPlannerSection({
  compact = false,
  showCharts = true,
  showPeriodToggle = true,
  showHeader = true,
  className,
}: BudgetPlannerSectionProps) {
  const { budgetPeriod, setBudgetPeriod } = useAppStore();
  const { formatMoney } = useCurrency();

  const { data: budgetsRes, refetch } = useFetch(() => budgetService.getAll(), []);
  const { data: analytics, refetch: refetchAnalytics } = useFetch(() => budgetService.getAnalytics(), []);
  const { data: insights, refetch: refetchInsights } = useFetch(() => aiInsightsService.getAll(), []);

  const refetchAll = () => {
    void refetch();
    void refetchAnalytics();
    void refetchInsights();
  };

  useCurrencyRefresh(refetchAll);

  const apiCategories = budgetsRes?.items ?? [];
  const categories = apiCategories.length > 0 ? apiCategories : DEMO_CATEGORIES;
  const displayCategories = compact ? categories.slice(0, 3) : categories;

  const totalBudget = analytics?.totalLimit || DEMO_ANALYTICS.totalLimit;
  const totalSpent = analytics?.totalSpent || DEMO_ANALYTICS.totalSpent;
  const remaining = Math.max(0, totalBudget - totalSpent);
  const pct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const overCount = analytics?.overBudgetCount ?? DEMO_ANALYTICS.overBudgetCount;
  const healthScore = Math.max(0, Math.min(100, 100 - overCount * 15));
  const budgetInsights = (insights?.length ? insights.slice(0, 2) : mockBudgetInsights) ?? mockBudgetInsights;

  const periodLabel =
    budgetPeriod === "weekly" ? "Weekly" : budgetPeriod === "yearly" ? "Yearly" : "Monthly";

  return (
    <section className={className}>
      {showHeader && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Budget Planner</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your limits and optimize your financial growth.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
          {showPeriodToggle && (
            <BudgetPeriodToggle value={budgetPeriod} onChange={setBudgetPeriod} />
          )}
          {compact && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/budgets">
                View full planner
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="gradient" className="lg:col-span-2">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-white/80">Total {periodLabel} Budget</p>
                <p className="mt-1 text-4xl font-bold text-white">{formatMoney(totalBudget)}</p>
              </div>
              <div className="grid max-w-sm grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">Spent</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{formatMoney(totalSpent)}</p>
                </div>
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">Remaining</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{formatMoney(remaining)}</p>
                </div>
              </div>
              <AddTransactionDialog
                onSuccess={refetchAll}
                trigger={
                  <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90">
                    <Plus className="h-4 w-4" />
                    Add Transaction
                  </Button>
                }
              />
            </div>
            <CircularProgressRing value={pct} size={128} strokeWidth={10} className="shrink-0 text-white" />
          </CardContent>
        </Card>

        <BudgetHealthGauge
          score={healthScore}
          comparisonText={`You are spending more efficiently than ${Math.min(95, healthScore + 6)}% of users with similar profiles.`}
        />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Category Budgets</h3>
          <div className="flex gap-2">
            {!compact && (
              <AddCategoryDialog period={PERIOD_MAP[budgetPeriod]} onSuccess={refetchAll} />
            )}
            {compact && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/budgets">
                  <Plus className="h-4 w-4" />
                  Manage categories
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayCategories.map((cat, i) => {
            const Icon = icons[cat.icon] ?? Wallet;
            return (
              <MotionWrapper key={cat.id} delay={i * 0.05}>
                <CategoryBudgetCard
                  name={cat.name}
                  spent={cat.spent}
                  limit={cat.limit}
                  icon={Icon}
                  formatMoney={formatMoney}
                />
              </MotionWrapper>
            );
          })}

          {!compact && (
            <Card className="flex min-h-[148px] items-center justify-center border-2 border-dashed border-border/80 bg-transparent shadow-none">
              <AddCategoryDialog
                period={PERIOD_MAP[budgetPeriod]}
                onSuccess={refetchAll}
                trigger={
                  <Button variant="ghost" className="flex flex-col gap-2 text-muted-foreground">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40">
                      <Plus className="h-5 w-5" />
                    </span>
                    Add Category
                  </Button>
                }
              />
            </Card>
          )}
        </div>
      </div>

      {showCharts && !compact && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingTrendsChart data={mockBudgetSpendingTrends} />
          </div>
          <AiInsightsCard
            insights={budgetInsights}
            title="Smart Insights"
            actionLabel="View All Recommendations"
          />
        </div>
      )}
    </section>
  );
}
