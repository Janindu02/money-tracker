import { cn } from "@/lib/utils";

export function CurrencyFlag({
  flag,
  code,
  size = "md",
  className,
}: {
  flag: string;
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-7 w-7 text-base",
    md: "h-9 w-9 text-lg",
    lg: "h-11 w-11 text-xl",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border/60 bg-gradient-to-br from-background to-muted/80 shadow-sm",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {flag}
    </span>
  );
}
