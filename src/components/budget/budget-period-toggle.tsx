"use client";

import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
] as const;

export type BudgetPeriod = (typeof PERIODS)[number]["value"];

interface BudgetPeriodToggleProps {
  value: BudgetPeriod;
  onChange: (value: BudgetPeriod) => void;
  className?: string;
}

export function BudgetPeriodToggle({ value, onChange, className }: BudgetPeriodToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-border bg-muted/50 p-1",
        className,
      )}
    >
      {PERIODS.map((period) => (
        <button
          key={period.value}
          type="button"
          onClick={() => onChange(period.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            value === period.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
