"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHART_COLORS } from "@/utils/constants";
import type { ChartDataPoint } from "@/types";

export interface SpendingTrendPoint extends ChartDataPoint {
  budgetLimit?: number;
}

interface SpendingTrendsChartProps {
  data: SpendingTrendPoint[];
  title?: string;
  description?: string;
}

export function SpendingTrendsChart({
  data,
  title = "Spending Trends",
  description = "Daily comparison vs. target allocation",
}: SpendingTrendsChartProps) {
  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="14d">Last 14 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <Bar
              dataKey="value"
              name="Actual Spending"
              fill={CHART_COLORS.primary}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            <Line
              type="monotone"
              dataKey="budgetLimit"
              name="Budget Limit"
              stroke={CHART_COLORS.muted}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
