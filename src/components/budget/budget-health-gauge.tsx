"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircularProgressRing } from "./circular-progress-ring";
import { cn } from "@/lib/utils";

interface BudgetHealthGaugeProps {
  score: number;
  comparisonText?: string;
  className?: string;
}

function healthLabel(score: number) {
  if (score >= 80) return "GREAT";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "FAIR";
  return "NEEDS WORK";
}

export function BudgetHealthGauge({ score, comparisonText, className }: BudgetHealthGaugeProps) {
  const label = healthLabel(score);
  const badgeVariant = score >= 80 ? "success" : score >= 50 ? "secondary" : "destructive";

  return (
    <Card variant="glass" className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Budget Health</CardTitle>
        <CardDescription>Spending efficiency score</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6">
        <div className="relative">
          <CircularProgressRing
            value={score}
            size={140}
            strokeWidth={12}
            label=""
            displayValue={String(score)}
            trackClassName="stroke-muted"
            indicatorClassName="stroke-primary"
            className="text-foreground"
          />
          <Badge
            variant={badgeVariant}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-wider"
          >
            {label}
          </Badge>
        </div>
        {comparisonText && (
          <p className="mt-4 text-center text-sm text-muted-foreground">{comparisonText}</p>
        )}
      </CardContent>
    </Card>
  );
}
