"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatExpenseDateTime } from "@/utils/format";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { EditExpenseDialog } from "./edit-expense-dialog";
import { transactionService } from "@/services/transaction.service";
import { getErrorMessage } from "@/lib/axios";

interface ExpensesTableProps {
  expenses: Transaction[];
  title?: string;
  onChanged?: () => void;
}

function NatureBadge({ nature }: { nature?: Transaction["expenseNature"] }) {
  if (!nature) return <Badge variant="outline">—</Badge>;
  if (nature === "need") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400">
        Real Need
      </Badge>
    );
  }
  return (
    <Badge className="bg-violet-500/15 text-violet-700 hover:bg-violet-500/20 dark:text-violet-400">
      Desire
    </Badge>
  );
}

export function ExpensesTable({ expenses, title = "All Expenses", onChanged }: ExpensesTableProps) {
  const { formatMoney } = useCurrency();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await transactionService.remove(id);
      onChanged?.();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Card variant="glass">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Date & time</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden lg:table-cell">Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No expenses yet. Click &quot;Add Expense&quot; to record your first one.
                  </TableCell>
                </TableRow>
              )}
              {expenses.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                    {formatExpenseDateTime(t.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <NatureBadge nature={t.expenseNature} />
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatMoney(Math.abs(t.amount))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditing(t);
                          setEditOpen(true);
                        }}
                        aria-label="Edit expense"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 text-destructive hover:text-destructive")}
                        disabled={deletingId === t.id}
                        onClick={() => void handleDelete(t.id)}
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditExpenseDialog
        expense={editing}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => {
          setEditOpen(false);
          setEditing(null);
          onChanged?.();
        }}
      />
    </>
  );
}
