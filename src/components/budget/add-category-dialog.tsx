"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { budgetService } from "@/services/budget.service";
import { getErrorMessage } from "@/lib/axios";

const CATEGORY_ICONS = [
  { value: "Home", label: "Housing" },
  { value: "Utensils", label: "Food & Dining" },
  { value: "Car", label: "Transport" },
  { value: "ShoppingBag", label: "Shopping" },
  { value: "Zap", label: "Utilities" },
  { value: "Heart", label: "Health" },
  { value: "Film", label: "Entertainment" },
  { value: "Wallet", label: "Other" },
] as const;

interface AddCategoryDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  period?: "WEEKLY" | "MONTHLY" | "YEARLY";
}

export function AddCategoryDialog({ onSuccess, trigger, period = "MONTHLY" }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [icon, setIcon] = useState<string>("Wallet");

  const reset = () => {
    setName("");
    setLimit("");
    setIcon("Wallet");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (!name.trim() || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
      setError("Enter a category name and a valid budget limit.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await budgetService.create({
        name: name.trim(),
        limit: parsedLimit,
        icon,
        period,
      });
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Category Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Food & Dining"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-limit">Monthly limit</Label>
            <Input
              id="category-limit"
              type="number"
              min="1"
              step="0.01"
              placeholder="600"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ICONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
