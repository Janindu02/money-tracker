"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/utils/format";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";

export function TransactionsTable({ transactions, title = "Recent Transactions" }: { transactions: Transaction[]; title?: string }) {
  const { formatMoney } = useCurrency();

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  No transactions yet. Add your first transaction to get started.
                </TableCell>
              </TableRow>
            )}
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{formatShortDate(t.date)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{t.category}</Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-semibold",
                    t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "",
                  )}
                >
                  {t.type === "income" ? "+" : ""}
                  {formatMoney(Math.abs(t.amount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
