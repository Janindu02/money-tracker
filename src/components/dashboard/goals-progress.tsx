"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SavingsGoal } from "@/types";
import { useCurrency } from "@/components/providers/currency-provider";

export function GoalsProgress({ goals, title = "Savings Goals" }: { goals: SavingsGoal[]; title?: string }) {
  const { formatMoney } = useCurrency();

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.slice(0, 3).map((goal) => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          return (
            <div key={goal.id}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-muted-foreground">{pct}%</span>
              </div>
              <Progress value={pct} />
              <p className="mt-1 text-xs text-muted-foreground">
                {formatMoney(goal.saved)} / {formatMoney(goal.target)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
