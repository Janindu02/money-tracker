"use client";

import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/utils/format";
import { useCurrency } from "@/components/providers/currency-provider";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: LucideIcon;
  variant?: "default" | "gradient";
  format?: "currency" | "percent" | "number";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
  format = "currency",
  className,
}: StatCardProps) {
  const { formatMoney } = useCurrency();

  const displayValue =
    format === "currency"
      ? formatMoney(value)
      : format === "percent"
        ? `${value}%`
        : value.toLocaleString();

  return (
    <Card
      variant={variant === "gradient" ? "gradient" : "glass"}
      className={cn("h-full overflow-hidden", className)}
    >
      <CardContent className="flex h-full min-h-[148px] flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn("text-sm font-medium", variant === "gradient" ? "text-white/80" : "text-muted-foreground")}>
              {title}
            </p>
            <p className={cn("mt-2 text-2xl font-bold tracking-tight", variant === "gradient" && "text-white")}>
              {displayValue}
            </p>
            {change !== undefined && (
              <Badge variant={change >= 0 ? "success" : "destructive"} className="mt-3 gap-1">
                {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercent(change)}
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              variant === "gradient" ? "bg-white/20" : "bg-primary/10",
            )}
          >
            <Icon className={cn("h-5 w-5", variant === "gradient" ? "text-white" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
