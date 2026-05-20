import type {
  Account,
  BudgetCategory,
  ChartDataPoint,
  Insight,
  Notification,
  PricingPlan,
  SavingsGoal,
  Transaction,
  UserProfile,
} from "@/types";

export const mockUser: UserProfile = {
  id: "1",
  firstName: "Alex",
  lastName: "Rivers",
  email: "alex.rivers@finova.app",
  phone: "+1 (555) 012-3456",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  plan: "Finova Plus",
  memberSince: "March 2023",
  location: "San Francisco, CA",
};

export const mockSummary = {
  totalBalance: 142502.8,
  monthlyIncome: 12450,
  monthlyExpenses: 8340,
  savingsYield: 4.2,
  netWorth: 124592,
  netWorthChange: 12.5,
  monthlyNetChange: 2840,
};

export const mockAccounts: Account[] = [
  { id: "1", name: "Main Savings", balance: 48200, type: "savings", status: "active" },
  { id: "2", name: "Visa Gold", balance: -1240, type: "credit", status: "active" },
  { id: "3", name: "Investment", balance: 95400, type: "investment", status: "active" },
];

export const mockTransactions: Transaction[] = [
  { id: "1", name: "Starbucks", category: "Dining", amount: -12.5, type: "expense", date: "2024-05-17", status: "completed" },
  { id: "2", name: "Salary Deposit", category: "Income", amount: 5200, type: "income", date: "2024-05-15", status: "completed" },
  { id: "3", name: "Netflix", category: "Subscriptions", amount: -15.99, type: "expense", date: "2024-05-14", status: "completed" },
  { id: "4", name: "Whole Foods", category: "Groceries", amount: -86.42, type: "expense", date: "2024-05-13", status: "completed" },
  { id: "5", name: "Uber", category: "Transport", amount: -24.8, type: "expense", date: "2024-05-12", status: "pending" },
  { id: "6", name: "Freelance Payment", category: "Income", amount: 1800, type: "income", date: "2024-05-10", status: "completed" },
  { id: "7", name: "Amazon", category: "Shopping", amount: -64.2, type: "expense", date: "2024-05-09", status: "completed" },
  { id: "8", name: "Gym Membership", category: "Health", amount: -49, type: "expense", date: "2024-05-08", status: "completed" },
];

export const mockBudgetCategories: BudgetCategory[] = [
  { id: "1", name: "Housing", spent: 2100, limit: 2200, icon: "Home" },
  { id: "2", name: "Food & Dining", spent: 450, limit: 600, icon: "Utensils" },
  { id: "3", name: "Transport", spent: 320, limit: 300, icon: "Car" },
  { id: "4", name: "Shopping", spent: 180, limit: 400, icon: "ShoppingBag" },
  { id: "5", name: "Utilities", spent: 245, limit: 250, icon: "Zap" },
  { id: "6", name: "Health", spent: 50, limit: 200, icon: "Heart" },
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: "1", name: "New Home Fund", saved: 24000, target: 50000, deadline: "Dec 2024", icon: "Home", category: "Property" },
  { id: "2", name: "Summer Cabin", saved: 18200, target: 25000, deadline: "Aug 2024", icon: "TreePine", category: "Travel" },
  { id: "3", name: "Emergency Fund", saved: 15000, target: 15000, deadline: "Complete", icon: "Shield", category: "Safety" },
  { id: "4", name: "Tesla Model 3", saved: 12800, target: 45000, deadline: "Jun 2025", icon: "Car", category: "Vehicle" },
];

export const mockCashFlowData: ChartDataPoint[] = [
  { name: "Jan", income: 11200, expenses: 7800 },
  { name: "Feb", income: 11800, expenses: 8100 },
  { name: "Mar", income: 12100, expenses: 7900 },
  { name: "Apr", income: 11900, expenses: 8200 },
  { name: "May", income: 12450, expenses: 8340 },
  { name: "Jun", income: 12600, expenses: 8500 },
];

export const mockWeeklySpending: ChartDataPoint[] = [
  { name: "Mon", value: 420 },
  { name: "Tue", value: 380 },
  { name: "Wed", value: 510 },
  { name: "Thu", value: 290 },
  { name: "Fri", value: 640 },
  { name: "Sat", value: 720 },
  { name: "Sun", value: 480 },
];

export const mockBudgetSpendingTrends = [
  { name: "Mon", value: 280, budgetLimit: 320 },
  { name: "Tue", value: 310, budgetLimit: 320 },
  { name: "Wed", value: 295, budgetLimit: 320 },
  { name: "Thu", value: 340, budgetLimit: 320 },
  { name: "Fri", value: 380, budgetLimit: 320 },
  { name: "Sat", value: 290, budgetLimit: 320 },
  { name: "Sun", value: 250, budgetLimit: 320 },
];

export const mockBudgetInsights: Insight[] = [
  {
    id: "b1",
    title: "Optimize Utilities",
    description: "Switch to eco-mode on weekdays to save ~$45 this month.",
    type: "savings",
  },
  {
    id: "b2",
    title: "Dining Habit Shift",
    description: "Your dining spend is down 15% compared to last Tuesday.",
    type: "spending",
  },
];

export const mockCategorySpending = [
  { name: "Housing", value: 2100, color: "#10b981" },
  { name: "Food", value: 680, color: "#0ea5e9" },
  { name: "Transport", value: 420, color: "#6366f1" },
  { name: "Utilities", value: 245, color: "#f59e0b" },
  { name: "Other", value: 380, color: "#94a3b8" },
];

export const mockInsights: Insight[] = [
  { id: "1", title: "Subscription Alert", description: "You have 3 unused subscriptions costing $47/mo. Cancel to save $564/year.", type: "subscription" },
  { id: "2", title: "Spending Trend", description: "Dining out is up 24% vs your 6-month average. Consider meal planning.", type: "spending" },
  { id: "3", title: "Savings Opportunity", description: "Move $5,000 to a high-yield account to earn an extra $210/year.", type: "savings" },
  { id: "4", title: "High-Yield Opportunity", description: "Your idle cash could earn 4.5% APY with Finova Smart Savings.", type: "investment" },
];

export const mockNotifications: Notification[] = [
  { id: "1", title: "Budget Alert", message: "Transport category is over budget by $20", time: "2m ago", read: false, type: "alert" },
  { id: "2", title: "Goal Milestone", message: "New Home Fund reached 48% completion", time: "1h ago", read: false, type: "success" },
  { id: "3", title: "Smart Insight", message: "You spent 15% less on dining this week", time: "3h ago", read: true, type: "info" },
];

export const mockPricingPlans: PricingPlan[] = [
  { id: "free", name: "Starter", price: 0, period: "month", features: ["Basic budgeting", "5 categories", "Monthly reports", "Email support"] },
  { id: "plus", name: "Plus", price: 9.99, period: "month", popular: true, features: ["Unlimited categories", "AI insights", "Savings goals", "Priority support", "Export data"] },
  { id: "pro", name: "Pro", price: 19.99, period: "month", features: ["Everything in Plus", "Investment tracking", "Tax reports", "Family accounts", "Dedicated advisor"] },
];

export const mockTestimonials = [
  { name: "Sarah Chen", role: "Product Designer", quote: "Finova transformed how I manage money. The AI insights alone saved me $200/month.", avatar: "Sarah" },
  { name: "Marcus Johnson", role: "Software Engineer", quote: "Clean UI, powerful analytics. Finally a finance app that doesn't feel overwhelming.", avatar: "Marcus" },
  { name: "Elena Rodriguez", role: "Marketing Director", quote: "Reached my savings goal 3 months early thanks to Finova's smart recommendations.", avatar: "Elena" },
];

export const mockFaq = [
  { q: "Is Finova free to use?", a: "Yes! Start with our free Starter plan. Upgrade anytime for advanced features." },
  { q: "How secure is my data?", a: "Bank-level 256-bit encryption, SOC 2 compliance, and we never sell your data." },
  { q: "Can I connect my bank accounts?", a: "Yes, we support 10,000+ institutions via secure Plaid integration (coming soon)." },
  { q: "Does Finova work on mobile?", a: "Absolutely. Finova is fully responsive and optimized for all devices." },
];
