"use client";

import { cn } from "@/lib/utils";

interface CircularProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  displayValue?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

export function CircularProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  label = "used",
  displayValue,
  trackClassName = "stroke-white/25",
  indicatorClassName = "stroke-white",
}: CircularProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500", indicatorClassName)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold leading-none">{displayValue ?? `${clamped}%`}</span>
        {label ? <span className="mt-0.5 text-xs opacity-80">{label}</span> : null}
      </div>
    </div>
  );
}
