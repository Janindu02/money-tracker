"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, PieChart, Plus, Receipt, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/expenses", icon: Receipt, label: "Expenses" },
  { href: "/budgets", icon: PieChart, label: "Budgets" },
  { href: "/savings", icon: Target, label: "Goals" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
];

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 px-2 py-2 backdrop-blur-md",
        className
      )}
    >
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/expenses"
            className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full gradient-primary shadow-lg"
            aria-label="Add transaction"
          >
            <Plus className="h-6 w-6 text-white" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
