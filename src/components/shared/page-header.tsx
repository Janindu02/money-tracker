import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: { label: string; icon?: LucideIcon; href?: string };
  secondaryAction?: { label: string; href?: string };
  actions?: React.ReactNode;
}

export function PageHeader({ label, title, description, action, secondaryAction, actions }: PageHeaderProps) {
  const ActionIcon = action?.icon;
  const hasLinkActions = !actions && (action?.href || secondaryAction?.href);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {label && (
          <Badge variant="secondary" className="mb-3 uppercase tracking-wider">
            {label}
          </Badge>
        )}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>
      ) : hasLinkActions ? (
        <div className="flex flex-wrap gap-2">
          {secondaryAction?.href && (
            <Button variant="outline" asChild>
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
          {action?.href && (
            <Button asChild>
              <Link href={action.href}>
                {ActionIcon && <ActionIcon className="h-4 w-4" />}
                {action.label}
              </Link>
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
