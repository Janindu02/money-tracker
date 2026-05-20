"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useAppStore } from "@/store/use-app-store";
import { BudgetPeriodToggle } from "@/components/budget/budget-period-toggle";
import { BudgetPlannerSection } from "@/components/budget/budget-planner-section";

export default function BudgetsPage() {
  const { budgetPeriod, setBudgetPeriod } = useAppStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget Planner"
        description="Manage your limits and optimize your financial growth."
        actions={<BudgetPeriodToggle value={budgetPeriod} onChange={setBudgetPeriod} />}
      />

      <BudgetPlannerSection showHeader={false} showPeriodToggle={false} />

      <p className="pb-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Finova. Secure & Encrypted.
      </p>
    </div>
  );
}
