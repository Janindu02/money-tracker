"use client";

import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { SpendingAreaChart } from "@/components/charts/spending-area-chart";
import { MotionStagger, MotionItem, MotionWrapper } from "@/components/shared/motion-wrapper";
import { useFetch } from "@/hooks/use-fetch";
import { useCurrencyRefresh } from "@/hooks/use-currency-refresh";
import { useCurrency } from "@/components/providers/currency-provider";
import { goalsService } from "@/services/goals.service";
import { analyticsService } from "@/services/analytics.service";

export default function SavingsPage() {
  const { formatMoney } = useCurrency();
  const { data: goalsRes, loading, refetch } = useFetch(() => goalsService.getAll(), []);
  const { data: analytics, refetch: refetchAnalytics } = useFetch(() => goalsService.getAnalytics(), []);
  const { data: savingsTrendRes, refetch: refetchTrend } = useFetch(() => analyticsService.getSavings(), []);

  useCurrencyRefresh(() => {
    void refetch();
    void refetchAnalytics();
    void refetchTrend();
  });

  const goalList = goalsRes?.items ?? [];
  const totalSaved = analytics?.totalSaved ?? 0;
  const activeGoals = goalList.filter((g) => !g.completed).length;
  const avgProgress = analytics?.overallProgress ?? 0;
  const chartData = (savingsTrendRes?.data ?? []).map((s) => ({ name: s.name.slice(0, 8), value: s.saved }));

  if (loading && !goalsRes) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader label="Growth Center" title="Savings Goals" description="Track progress in your currency." action={{ label: "Create New Goal", icon: Plus, href: "#" }} />
      <MotionStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MotionItem>
          <StatCard title="Total Saved" value={totalSaved} change={12} icon={TrendingUp} />
        </MotionItem>
        <MotionItem>
          <StatCard title="Active Goals" value={activeGoals} icon={Target} format="number" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Avg. Progress" value={avgProgress} change={5} icon={TrendingUp} format="percent" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Completed" value={analytics?.completedCount ?? 0} icon={Calendar} format="number" />
        </MotionItem>
      </MotionStagger>
      <div className="grid gap-6 sm:grid-cols-2">
        {goalList.map((goal, i) => {
          const pct = goal.percentComplete;
          return (
            <MotionWrapper key={goal.id} delay={i * 0.05}>
              <Card variant="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{goal.name}</CardTitle>
                  <Badge variant="outline">{goal.category}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-semibold">{formatMoney(goal.saved)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-semibold">{formatMoney(goal.target)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Target: {goal.deadline}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={async () => {
                        const add = Math.min(goal.target - goal.saved, 500);
                        await goalsService.update(goal.id, { saved: goal.saved + add });
                        void refetch();
                        void refetchAnalytics();
                      }}
                    >
                      Add Funds
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>
          );
        })}
        <Card className="flex min-h-[200px] items-center justify-center border-dashed">
          <Button
            variant="ghost"
            onClick={async () => {
              await goalsService.create({ name: "New Goal", target: 10000, icon: "Target", category: "General" });
              void refetch();
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Goal
          </Button>
        </Card>
      </div>
      <SpendingAreaChart data={chartData} title="Savings by Goal" />
    </div>
  );
}
