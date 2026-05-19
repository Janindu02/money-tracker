"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { CurrencyFlag } from "./currency-flag";

interface CurrencyDisplayBadgeProps {
  className?: string;
  showRate?: boolean;
}

export function CurrencyDisplayBadge({ className, showRate = false }: CurrencyDisplayBadgeProps) {
  const { currencyInfo, displayCurrency, rates, ratesLoading } = useCurrency();
  const rate = rates[displayCurrency];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-sm shadow-sm",
        ratesLoading && "opacity-80",
        className,
      )}
    >
      <CurrencyFlag flag={currencyInfo.flag} code={currencyInfo.code} size="sm" />
      <span className="font-medium">{displayCurrency}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-xs text-muted-foreground">{currencyInfo.name}</span>
      {showRate && rate && displayCurrency !== "USD" && (
        <>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-primary">
            1 USD ≈ {rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} {displayCurrency}
          </span>
        </>
      )}
      {ratesLoading && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
