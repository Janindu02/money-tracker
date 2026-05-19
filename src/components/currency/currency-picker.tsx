"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Globe2, Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { FEATURED_CURRENCY_CODES, getCurrencyInfo, type CurrencyInfo } from "@/constants/currencies";
import { CurrencyFlag } from "./currency-flag";

interface CurrencyPickerProps {
  variant?: "navbar" | "toolbar" | "settings";
  onChange?: (code: string) => void;
  className?: string;
}

function formatRate(code: string, rates: Record<string, number>): string | null {
  if (code === "USD") return "Base currency";
  const rate = rates[code];
  if (!rate) return null;
  if (rate >= 100) return `1 USD ≈ ${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${code}`;
  return `1 USD = ${rate.toFixed(4)} ${code}`;
}

function CurrencyListItem({
  currency,
  selected,
  rateLabel,
  onSelect,
}: {
  currency: CurrencyInfo;
  selected: boolean;
  rateLabel: string | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
        selected
          ? "bg-primary/10 ring-1 ring-primary/30"
          : "hover:bg-muted/70",
      )}
    >
      <CurrencyFlag flag={currency.flag} code={currency.code} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{currency.code}</span>
          <span className="truncate text-xs text-muted-foreground">{currency.name}</span>
        </div>
        {rateLabel && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{rateLabel}</p>
        )}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{currency.symbol}</span>
      {selected && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
}

export function CurrencyPicker({ variant = "toolbar", onChange, className }: CurrencyPickerProps) {
  const {
    displayCurrency,
    currencyInfo,
    rates,
    ratesLoading,
    setDisplayCurrency,
    supportedCurrencies,
  } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [changing, setChanging] = useState(false);

  const featured = useMemo(
    () => FEATURED_CURRENCY_CODES.map((code) => getCurrencyInfo(code)),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return supportedCurrencies;
    return supportedCurrencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q),
    );
  }, [search, supportedCurrencies]);

  const others = filtered.filter((c) => !c.featured);

  const handleSelect = async (code: string) => {
    if (code === displayCurrency) {
      setOpen(false);
      return;
    }
    setChanging(true);
    try {
      await setDisplayCurrency(code);
      onChange?.(code);
      setOpen(false);
      setSearch("");
    } finally {
      setChanging(false);
    }
  };

  const triggerClass = cn(
    "group relative gap-2 border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md",
    variant === "navbar" && "h-9 rounded-full px-3",
    variant === "toolbar" && "h-10 rounded-xl px-3",
    variant === "settings" && "h-11 w-full justify-between rounded-xl px-4",
    className,
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={triggerClass} disabled={changing}>
          {changing || ratesLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <CurrencyFlag flag={currencyInfo.flag} code={currencyInfo.code} size="sm" />
          )}
          <span className="font-semibold tracking-tight">{displayCurrency}</span>
          {variant !== "settings" && (
            <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
              {currencyInfo.symbol}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={variant === "settings" ? "center" : "end"}
        className="w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border-border/80 bg-popover/95 p-0 shadow-xl backdrop-blur-xl"
        sideOffset={8}
      >
        {/* Header */}
        <div className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Globe2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Display currency</p>
              <p className="text-xs text-muted-foreground">Live rates · updates app-wide</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-border/40 px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-lg border-border/60 bg-muted/30 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {/* Featured LKR & USD */}
          {!search && (
            <div className="mb-3">
              <p className="mb-2 flex items-center gap-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Popular
              </p>
              <div className="grid grid-cols-2 gap-2">
                {featured.map((c) => {
                  const selected = c.code === displayCurrency;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => void handleSelect(c.code)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-muted/50",
                      )}
                    >
                      {selected && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <CurrencyFlag flag={c.flag} code={c.code} size="lg" />
                      <div>
                        <p className="font-bold">{c.code}</p>
                        <p className="text-[11px] text-muted-foreground">{c.name}</p>
                      </div>
                      <p className="text-xs font-medium text-primary">
                        {formatRate(c.code, rates) ?? c.symbol}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All currencies */}
          <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {search ? "Results" : "All currencies"}
          </p>
          <div className="space-y-0.5">
            {(search ? filtered : others).length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No currencies found</p>
            ) : (
              (search ? filtered : others).map((c) => (
                <CurrencyListItem
                  key={c.code}
                  currency={c}
                  selected={c.code === displayCurrency}
                  rateLabel={formatRate(c.code, rates)}
                  onSelect={() => void handleSelect(c.code)}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer rate for current selection */}
        <div className="border-t border-border/60 bg-muted/20 px-4 py-2.5">
          <p className="text-center text-[11px] text-muted-foreground">
            Showing amounts as{" "}
            <span className="font-semibold text-foreground">
              {currencyInfo.flag} {currencyInfo.name}
            </span>
            {ratesLoading ? " · updating rates…" : ""}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
