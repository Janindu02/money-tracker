"use client";

import { ArrowRightLeft, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/components/providers/currency-provider";
import { FEATURED_CURRENCY_CODES, getCurrencyInfo } from "@/constants/currencies";
import { CurrencyPicker } from "./currency-picker";
import { CurrencyFlag } from "./currency-flag";
import { cn } from "@/lib/utils";

interface CurrencySettingsPanelProps {
  onChange?: (code: string) => void;
}

export function CurrencySettingsPanel({ onChange }: CurrencySettingsPanelProps) {
  const { displayCurrency, currencyInfo, rates, ratesLoading, formatMoney, setDisplayCurrency } = useCurrency();

  const selectCurrency = async (code: string) => {
    if (code === displayCurrency) return;
    await setDisplayCurrency(code);
    onChange?.(code);
  };

  const lkrRate = rates.LKR;
  const usdToLkr =
    lkrRate && displayCurrency === "LKR"
      ? `1 USD = ${lkrRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} LKR`
      : null;

  const sampleAmount = 1000;
  const converted = formatMoney(sampleAmount, { fromCurrency: "USD" });

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-gradient-to-br from-primary/5 to-transparent pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
          </span>
          Display currency
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Switch between LKR, USD, and 18+ currencies. Balances, budgets, and charts refresh automatically with live rates.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active currency</p>
          <CurrencyPicker variant="settings" onChange={onChange} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">Preview</p>
            <p className="mt-1 text-lg font-bold">{converted}</p>
            <p className="text-xs text-muted-foreground">Sample: $1,000 USD converted</p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> Live rate
            </p>
            <p className="mt-1 text-lg font-bold text-primary">
              {ratesLoading ? "Updating…" : usdToLkr ?? (displayCurrency === "USD" ? "Base: US Dollar" : `1 USD ≈ ${(rates[displayCurrency] ?? 0).toFixed(2)} ${displayCurrency}`)}
            </p>
            <p className="text-xs text-muted-foreground">Frankfurter · refreshed hourly</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick switch</p>
          <div className="flex flex-wrap gap-2">
            {FEATURED_CURRENCY_CODES.map((code) => {
              const info = getCurrencyInfo(code);
              const active = code === displayCurrency;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => void selectCurrency(code)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all",
                    active
                      ? "border-primary bg-primary/10 font-semibold text-primary shadow-sm"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <CurrencyFlag flag={info.flag} code={info.code} size="sm" />
                  {info.code}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Currently viewing all amounts as {currencyInfo.flag} <strong>{currencyInfo.name}</strong> ({displayCurrency})
        </p>
      </CardContent>
    </Card>
  );
}
