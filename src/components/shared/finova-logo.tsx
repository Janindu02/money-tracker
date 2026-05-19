import Link from "next/link";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/utils/constants";

interface FinovaLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" };
const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };

export function FinovaLogo({ className, showText = true, size = "md" }: FinovaLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl gradient-primary shadow-md",
          sizes[size]
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 text-white" fill="currentColor">
          <path d="M12 2L4 8v8l8 6 8-6V8L12 2zm0 3.2L17 9v6l-5 3.75L7 15V9l5-3.8z" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", textSizes[size])}>
          <span className="gradient-text">{APP_NAME}</span>
        </span>
      )}
    </Link>
  );
}
