"use client";

import {
  Utensils,
  ShoppingCart,
  Car,
  ShoppingBag,
  Home,
  Zap,
  Heart,
  Tv,
  Wallet,
  GraduationCap,
  Plane,
  Gift,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";
import { AddCustomCategory } from "./add-custom-category";
import type { CreateCategoryInput } from "@/services/transaction.service";

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  ShoppingCart,
  Car,
  Bag: ShoppingBag,
  ShoppingBag,
  Home,
  Zap,
  Heart,
  Tv,
  Wallet,
  GraduationCap,
  Plane,
  Gift,
};

interface CategoryPickerProps {
  categories: ExpenseCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  onCreateCategory?: (data: CreateCategoryInput) => Promise<ExpenseCategory>;
}

export function CategoryPicker({
  categories,
  value,
  onChange,
  onCreateCategory,
}: CategoryPickerProps) {
  const defaults = categories.filter((c) => c.isDefault !== false);
  const custom = categories.filter((c) => c.isDefault === false);

  const renderCategory = (cat: ExpenseCategory) => {
    const Icon = iconMap[cat.icon ?? ""] ?? Wallet;
    const selected = value === cat.id;
    const isCustom = cat.isDefault === false;

    return (
      <button
        key={cat.id}
        type="button"
        onClick={() => onChange(cat.id)}
        className={cn(
          "relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition-all",
          selected
            ? "border-primary bg-primary/10 text-primary"
            : "border-border hover:border-primary/30 hover:bg-muted/50",
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-xs font-medium leading-tight">{cat.name}</span>
        {isCustom && (
          <Badge
            variant="secondary"
            className="absolute -right-1 -top-1 px-1 py-0 text-[9px]"
          >
            Custom
          </Badge>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {defaults.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Common categories
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {defaults.map(renderCategory)}
          </div>
        </div>
      )}

      {custom.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your custom categories
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {custom.map(renderCategory)}
          </div>
        </div>
      )}

      {defaults.length === 0 && custom.length === 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map(renderCategory)}
        </div>
      )}

      {onCreateCategory && (
        <AddCustomCategory
          createCategory={onCreateCategory}
          onCreated={(cat) => onChange(cat.id)}
        />
      )}
    </div>
  );
}
