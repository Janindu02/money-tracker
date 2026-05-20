"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPENSE_NATURE_OPTIONS, type ExpenseNatureType } from "@/constants/expense-categories";

interface ExpenseNatureToggleProps {
  value: ExpenseNatureType;
  onChange: (value: ExpenseNatureType) => void;
}

export function ExpenseNatureToggle({ value, onChange }: ExpenseNatureToggleProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {EXPENSE_NATURE_OPTIONS.map((option) => {
        const selected = value === option.value;
        const Icon = option.value === "need" ? CheckCircle2 : Sparkles;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all",
              selected
                ? option.value === "need"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-violet-500 bg-violet-500/10"
                : "border-border hover:border-primary/40 hover:bg-muted/50",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <Icon
                className={cn(
                  "h-5 w-5",
                  selected
                    ? option.value === "need"
                      ? "text-emerald-600"
                      : "text-violet-600"
                    : "text-muted-foreground",
                )}
              />
              {selected && (
                <span className="text-xs font-medium text-primary">Selected</span>
              )}
            </div>
            <span className="font-semibold">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
