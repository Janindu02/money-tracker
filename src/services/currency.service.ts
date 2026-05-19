import { api } from "./api";

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
}

export interface CurrencyPreferences {
  displayCurrency: string;
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
}

export const currencyService = {
  getSupported: () =>
    api.get<{ base: string; currencies: Array<{ code: string; name: string; symbol: string; flag: string }> }>(
      "/currency/supported",
    ),

  getRates: (base = "USD") => api.get<ExchangeRates>("/currency/rates", { base }),

  convert: (amount: number, from: string, to: string) =>
    api.post<{ amount: number; from: string; to: string; rate: number; converted: number }>(
      "/currency/convert",
      { amount, from, to },
    ),

  getPreferences: () => api.get<CurrencyPreferences>("/currency/preferences"),
};
