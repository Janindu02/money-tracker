export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  status: "completed" | "pending";
  icon?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: "savings" | "checking" | "credit" | "investment";
  status: "active" | "inactive";
}

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  limit: number;
  icon: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  saved: number;
  target: number;
  deadline: string;
  icon: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "alert" | "info" | "success";
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  plan: string;
  memberSince: string;
  location: string;
}

export interface ChartDataPoint {
  name: string;
  income?: number;
  expenses?: number;
  value?: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: "subscription" | "spending" | "savings" | "investment";
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}
