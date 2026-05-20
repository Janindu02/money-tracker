/** Fallback expense categories when API is unavailable */
export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "default-dining", name: "Dining", icon: "Utensils", isDefault: true },
  { id: "default-groceries", name: "Groceries", icon: "ShoppingCart", isDefault: true },
  { id: "default-transport", name: "Transport", icon: "Car", isDefault: true },
  { id: "default-shopping", name: "Shopping", icon: "Bag", isDefault: true },
  { id: "default-housing", name: "Housing", icon: "Home", isDefault: true },
  { id: "default-utilities", name: "Utilities", icon: "Zap", isDefault: true },
  { id: "default-health", name: "Health", icon: "Heart", isDefault: true },
  { id: "default-subscriptions", name: "Subscriptions", icon: "Tv", isDefault: true },
] as const;

export type ExpenseNatureType = "need" | "desire";

/** Icons users can pick when creating a custom category */
export const CATEGORY_ICON_OPTIONS = [
  { value: "Utensils", label: "Food" },
  { value: "ShoppingCart", label: "Groceries" },
  { value: "Car", label: "Transport" },
  { value: "Bag", label: "Shopping" },
  { value: "Home", label: "Home" },
  { value: "Zap", label: "Bills" },
  { value: "Heart", label: "Health" },
  { value: "Tv", label: "Subs" },
  { value: "Wallet", label: "Other" },
  { value: "GraduationCap", label: "Education" },
  { value: "Plane", label: "Travel" },
  { value: "Gift", label: "Gifts" },
] as const;

export const EXPENSE_NATURE_OPTIONS: {
  value: ExpenseNatureType;
  label: string;
  description: string;
}[] = [
  {
    value: "need",
    label: "Real Need",
    description: "Essential spending you must cover",
  },
  {
    value: "desire",
    label: "Desire",
    description: "Optional spending you could reduce",
  },
];
