"use client";

import { useEffect, useState } from "react";
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
import { transactionService } from "@/services/transaction.service";
import { getErrorMessage } from "@/lib/axios";
import { useCurrency } from "@/components/providers/currency-provider";
import { useExpenseCategories } from "@/hooks/use-expense-categories";
import type { ExpenseNatureType } from "@/constants/expense-categories";
import { ExpenseNatureToggle } from "./expense-nature-toggle";
import { CategoryPicker } from "./category-picker";
import { combineDateAndTime, nowDateTimeInputs } from "@/utils/datetime";

interface AddExpenseDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddExpenseDialog({ onSuccess, trigger }: AddExpenseDialogProps) {
  const { displayCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => nowDateTimeInputs().date);
  const [time, setTime] = useState(() => nowDateTimeInputs().time);
  const [categoryId, setCategoryId] = useState("");
  const [expenseNature, setExpenseNature] = useState<ExpenseNatureType>("need");

  const { categories, loading: categoriesLoading, loadError, reload, createCategory } =
    useExpenseCategories(open);

  useEffect(() => {
    if (open && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [open, categories, categoryId]);

  const reset = () => {
    const now = nowDateTimeInputs();
    setName("");
    setAmount("");
    setDate(now.date);
    setTime(now.time);
    setCategoryId("");
    setExpenseNature("need");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Please select or create a category.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await transactionService.create({
        name: name.trim(),
        amount: parseFloat(amount),
        type: "EXPENSE",
        date: combineDateAndTime(date, time),
        currency: displayCurrency,
        categoryId,
        expenseNature: expenseNature.toUpperCase() as "NEED" | "DESIRE",
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
        if (next) void reload();
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loadError && (
            <p className="text-sm text-amber-600 dark:text-amber-400">{loadError}</p>
          )}

          <div className="space-y-2">
            <Label>Category</Label>
            <CategoryPicker
              categories={categories}
              value={categoryId}
              onChange={setCategoryId}
              onCreateCategory={createCategory}
            />
          </div>

          <div className="space-y-2">
            <Label>Is this a real need or a desire?</Label>
            <ExpenseNatureToggle value={expenseNature} onChange={setExpenseNature} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-name">Description</Label>
            <Input
              id="exp-name"
              placeholder="e.g. Lunch at cafe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="exp-amount">Amount</Label>
              <Input
                id="exp-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-date">Date</Label>
              <Input
                id="exp-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-time">Time</Label>
              <Input
                id="exp-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || categoriesLoading || !categoryId}
          >
            {loading ? "Saving…" : categoriesLoading ? "Loading categories…" : "Save Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
