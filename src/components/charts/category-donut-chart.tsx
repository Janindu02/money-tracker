"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/components/providers/currency-provider";

interface CategoryDonutChartProps {
  data: { name: string; value: number; color: string }[];
  title?: string;
}

export function CategoryDonutChart({ data, title = "Spending by Category" }: CategoryDonutChartProps) {
  const { formatMoney } = useCurrency();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatMoney(Number(v ?? 0))} />
          </PieChart>
        </ResponsiveContainer>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Add expenses with categories to see the breakdown.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {data.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <li key={d.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                    <span className="truncate">{d.name}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="font-medium">{formatMoney(d.value)}</span>
                    <span className="ml-2 text-muted-foreground">({pct}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
