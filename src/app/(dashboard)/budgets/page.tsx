"use client";

import { Plus, Home, Utensils, Car, Zap, Film, Heart, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/providers/currency-provider";
import { useAppStore } from "@/store/use-app-store";
import { MotionWrapper } from "@/components/shared/motion-wrapper";
import { useFetch } from "@/hooks/use-fetch";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";
import { budgetService } from "@/services/budget.service";

const icons: Record<string, React.ElementType> = { Home, Utensils, Car, Zap, Film, Heart, Wallet };

export default function BudgetsPage() {
  const { budgetPeriod, setBudgetPeriod } = useAppStore();
  const { formatMoney } = useCurrency();
  const { data: budgetsRes, loading, refetch } = useFetch(() => budgetService.getAll(), []);
  const { data: analytics, refetch: refetchAnalytics } = useFetch(() => budgetService.getAnalytics(), []);

  useCurrencyRefresh(() => {
    void refetch();
    void refetchAnalytics();
  });

  const mockBudgetCategories = budgetsRes?.items ?? [];
  const totalBudget = analytics?.totalLimit ?? 0;
  const totalSpent = analytics?.totalSpent ?? 0;
  const pct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const healthScore = Math.max(0, Math.min(100, 100 - (analytics?.overBudgetCount ?? 0) * 15));

  if (loading && !budgetsRes) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader title="Budget Planner" description="Manage your limits in your preferred currency." action={{ label: "New Category", icon: Plus, href: "#" }} />
      <Tabs value={budgetPeriod} onValueChange={(v) => setBudgetPeriod(v as typeof budgetPeriod)}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value={budgetPeriod} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card variant="gradient">
              <CardContent className="p-6">
                <p className="text-sm text-white/80">Total Monthly Budget</p>
                <p className="text-3xl font-bold text-white">{formatMoney(totalBudget)}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/15 p-3">
                    <p className="text-xs text-white/70">Spent</p>
                    <p className="font-semibold text-white">{formatMoney(totalSpent)}</p>
                  </div>
                  <div className="rounded-xl bg-white/15 p-3">
                    <p className="text-xs text-white/70">Remaining</p>
                    <p className="font-semibold text-white">{formatMoney(totalBudget - totalSpent)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-1 text-sm text-white/80">{pct}% used</p>
                  <Progress value={pct} className="h-2 bg-white/20" />
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Budget Health</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-5xl font-bold text-primary">{healthScore}</p>
                <Badge variant="success" className="mt-2">
                  {healthScore >= 80 ? "GREAT" : healthScore >= 50 ? "GOOD" : "NEEDS WORK"}
                </Badge>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Category Budgets</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockBudgetCategories.map((cat, i) => {
                const Icon = icons[cat.icon] ?? Home;
                const over = cat.overBudget;
                const progress = cat.percentUsed;
                return (
                  <MotionWrapper key={cat.id} delay={i * 0.05}>
                    <Card variant="glass">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatMoney(cat.spent)} of {formatMoney(cat.limit)}
                            </p>
                          </div>
                        </div>
                        <Progress value={progress} className="mt-4" />
                        {over ? (
                          <p className="mt-2 text-xs text-destructive">
                            Over budget by {formatMoney(cat.spent - cat.limit)}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {formatMoney(cat.limit - cat.spent)} left
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </MotionWrapper>
                );
              })}
              <Card className="flex min-h-[140px] items-center justify-center border-dashed">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await budgetService.create({ name: "New Budget", limit: 500, icon: "Wallet" });
                    void refetch();
                    void refetchAnalytics();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
