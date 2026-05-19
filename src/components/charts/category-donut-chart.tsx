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
        <ul className="mt-4 space-y-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
              <span className="font-medium">{formatMoney(d.value)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
