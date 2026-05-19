"use client";

import { useEffect } from "react";

/** Re-run fetch when user changes display currency app-wide */
export function useCurrencyRefresh(refetch: () => void) {
  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener("finova:currency-changed", handler);
    return () => window.removeEventListener("finova:currency-changed", handler);
  }, [refetch]);
}
