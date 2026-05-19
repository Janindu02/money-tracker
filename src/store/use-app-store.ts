import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type BudgetPeriod = "weekly" | "monthly" | "yearly";
type ChartPeriod = "7d" | "30d" | "3m" | "6m" | "12m";

interface AppState {
  isAuthenticated: boolean;
  theme: Theme;
  budgetPeriod: BudgetPeriod;
  chartPeriod: ChartPeriod;
  sidebarOpen: boolean;
  searchQuery: string;
  setAuthenticated: (value: boolean) => void;
  setTheme: (theme: Theme) => void;
  setBudgetPeriod: (period: BudgetPeriod) => void;
  setChartPeriod: (period: ChartPeriod) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      theme: "system",
      budgetPeriod: "monthly",
      chartPeriod: "6m",
      sidebarOpen: false,
      searchQuery: "",
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setTheme: (theme) => set({ theme }),
      setBudgetPeriod: (period) => set({ budgetPeriod: period }),
      setChartPeriod: (period) => set({ chartPeriod: period }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    { name: "finova-store" }
  )
);
