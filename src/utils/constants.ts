export const APP_NAME = "Finova";
export const APP_TAGLINE = "Smart money management for modern life";
export const APP_DESCRIPTION =
  "Finova helps you track expenses, plan budgets, reach savings goals, and get AI-powered financial insights.";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/expenses", label: "Expenses", icon: "Receipt" },
  { href: "/budgets", label: "Budgets", icon: "PieChart" },
  { href: "/savings", label: "Savings", icon: "Target" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
] as const;

export const FOOTER_NAV = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/login", label: "Sign in" },
] as const;

export const CHART_COLORS = {
  primary: "#10b981",
  secondary: "#0ea5e9",
  accent: "#6366f1",
  warning: "#f59e0b",
  danger: "#ef4444",
  muted: "#94a3b8",
} as const;
