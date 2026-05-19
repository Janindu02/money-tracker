"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCurrencyInfo, SUPPORTED_CURRENCIES, type CurrencyInfo } from "@/constants/currencies";
import { currencyService } from "@/services/currency.service";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface CurrencyContextValue {
  displayCurrency: string;
  currencyInfo: CurrencyInfo;
  rates: Record<string, number>;
  ratesLoading: boolean;
  setDisplayCurrency: (code: string) => Promise<void>;
  formatMoney: (amount: number, options?: { fromCurrency?: string }) => string;
  convert: (amount: number, from: string, to?: string) => number;
  supportedCurrencies: CurrencyInfo[];
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [displayCurrency, setDisplayCurrencyState] = useState("LKR");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [ratesLoading, setRatesLoading] = useState(true);

  const loadRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      if (isAuthenticated) {
        const prefs = await currencyService.getPreferences();
        setDisplayCurrencyState(prefs.displayCurrency);
        setRates(prefs.rates);
      } else {
        const data = await currencyService.getRates("USD");
        setRates(data.rates);
      }
    } catch {
      const data = await currencyService.getRates("USD");
      setRates(data.rates);
    } finally {
      setRatesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.currency) {
      setDisplayCurrencyState(user.currency);
    }
  }, [user?.currency]);

  useEffect(() => {
    void loadRates();
    const interval = setInterval(() => void loadRates(), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadRates, isAuthenticated]);

  const convert = useCallback(
    (amount: number, from: string, to?: string) => {
      const target = to ?? displayCurrency;
      if (from === target) return amount;
      const base = "USD";
      let inBase = from === base ? amount : amount / (rates[from] ?? 1);
      if (target === base) return Math.round(inBase * 100) / 100;
      return Math.round(inBase * (rates[target] ?? 1) * 100) / 100;
    },
    [displayCurrency, rates],
  );

  const formatMoney = useCallback(
    (amount: number, options?: { fromCurrency?: string }) => {
      const from = options?.fromCurrency ?? displayCurrency;
      const value = from === displayCurrency ? amount : convert(amount, from, displayCurrency);
      const info = getCurrencyInfo(displayCurrency);
      return new Intl.NumberFormat(info.locale, {
        style: "currency",
        currency: displayCurrency,
        minimumFractionDigits: displayCurrency === "JPY" || displayCurrency === "KRW" ? 0 : 2,
        maximumFractionDigits: displayCurrency === "JPY" || displayCurrency === "KRW" ? 0 : 2,
      }).format(value);
    },
    [displayCurrency, convert],
  );

  const setDisplayCurrency = useCallback(
    async (code: string) => {
      setDisplayCurrencyState(code);
      if (isAuthenticated) {
        await api.patch("/users/profile", { currency: code });
        await refreshUser();
        await loadRates();
        window.dispatchEvent(new CustomEvent("finova:currency-changed", { detail: code }));
      }
    },
    [isAuthenticated, refreshUser, loadRates],
  );

  const value = useMemo(
    () => ({
      displayCurrency,
      currencyInfo: getCurrencyInfo(displayCurrency),
      rates,
      ratesLoading,
      setDisplayCurrency,
      formatMoney,
      convert,
      supportedCurrencies: SUPPORTED_CURRENCIES,
      refreshRates: loadRates,
    }),
    [displayCurrency, rates, ratesLoading, setDisplayCurrency, formatMoney, convert, loadRates],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
