"use client";

import { CurrencyPicker } from "@/components/currency/currency-picker";

interface CurrencySelectorProps {
  className?: string;
  compact?: boolean;
  onChange?: (code: string) => void;
}

/** @deprecated Use CurrencyPicker directly — kept for backward compatibility */
export function CurrencySelector({ className, compact, onChange }: CurrencySelectorProps) {
  return (
    <CurrencyPicker
      variant={compact ? "navbar" : "toolbar"}
      className={className}
      onChange={onChange}
    />
  );
}
