"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { Transaction } from "@/types";
import { combineDateAndTime, splitDateTime } from "@/utils/datetime";

interface EditExpenseDialogProps {
  expense: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditExpenseDialog({ expense, open, onOpenChange, onSuccess }: EditExpenseDialogProps) {
  const { displayCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [categoryId, setCategoryId] = useState("");
  const [expenseNature, setExpenseNature] = useState<ExpenseNatureType>("need");

  const { categories, reload, createCategory } = useExpenseCategories(open);

  useEffect(() => {
    if (!expense || !open) return;
    setName(expense.name);
    setAmount(String(Math.abs(expense.amount)));
    const { date: d, time: t } = splitDateTime(expense.date);
    setDate(d);
    setTime(t);
    setCategoryId(expense.categoryId ?? "");
    setExpenseNature(expense.expenseNature ?? "need");
    setError(null);
  }, [expense, open]);

  useEffect(() => {
    if (open) void reload();
  }, [open, reload]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense || !categoryId) {
      setError("Please select or create a category.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await transactionService.update(expense.id, {
        name: name.trim(),
        amount: parseFloat(amount),
        type: "EXPENSE",
        date: combineDateAndTime(date, time),
        currency: displayCurrency,
        categoryId,
        expenseNature: expenseNature.toUpperCase() as "NEED" | "DESIRE",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-destructive">{error}</p>}

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
            <Label htmlFor="edit-exp-name">Description</Label>
            <Input
              id="edit-exp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="edit-exp-amount">Amount</Label>
              <Input
                id="edit-exp-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exp-date">Date</Label>
              <Input
                id="edit-exp-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exp-time">Time</Label>
              <Input
                id="edit-exp-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating…" : "Update Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
