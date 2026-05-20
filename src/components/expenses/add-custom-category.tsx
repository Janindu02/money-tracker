"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_ICON_OPTIONS } from "@/constants/expense-categories";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";
import type { CreateCategoryInput } from "@/services/transaction.service";

interface AddCustomCategoryProps {
  onCreated: (category: ExpenseCategory) => void;
  createCategory: (data: CreateCategoryInput) => Promise<ExpenseCategory>;
}

export function AddCustomCategory({ onCreated, createCategory }: AddCustomCategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>("Wallet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Category name must be at least 2 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await createCategory({ name: trimmed, icon });
      onCreated(created);
      setName("");
      setIcon("Wallet");
      setExpanded(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add custom category
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="custom-cat-name">Category name</Label>
            <Input
              id="custom-cat-name"
              placeholder="e.g. Pet Care, Gym, Kids"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleCreate();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  onClick={() => setIcon(opt.value)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    icon === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="button" size="sm" className="w-full" disabled={loading} onClick={() => void handleCreate()}>
            {loading ? "Creating…" : "Create Category"}
          </Button>
        </div>
      )}
    </div>
  );
}
