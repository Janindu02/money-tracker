"use client";

import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryBudgetCardProps {
  name: string;
  spent: number;
  limit: number;
  icon: LucideIcon;
  formatMoney: (amount: number) => string;
  className?: string;
}

export function CategoryBudgetCard({
  name,
  spent,
  limit,
  icon: Icon,
  formatMoney,
  className,
}: CategoryBudgetCardProps) {
  const over = spent > limit;
  const percentUsed = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const displayPercent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const remaining = Math.max(0, limit - spent);
  const barWidth = over ? 100 : percentUsed;

  return (
    <Card variant="glass" className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                over ? "bg-destructive/10" : "bg-primary/10",
              )}
            >
              <Icon className={cn("h-5 w-5", over ? "text-destructive" : "text-primary")} />
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {formatMoney(spent)} of {formatMoney(limit)}
              </p>
            </div>
          </div>
          {!over && (
            <p className="shrink-0 text-xs font-medium text-muted-foreground">{formatMoney(remaining)} left</p>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className={cn("font-medium", over ? "text-destructive" : "text-muted-foreground")}>
              {displayPercent}% used
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                over ? "bg-destructive" : "bg-gradient-to-r from-emerald-500 to-teal-500",
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          {over ? (
            <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Over budget by {formatMoney(spent - limit)}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
