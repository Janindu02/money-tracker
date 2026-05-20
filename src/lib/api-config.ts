/** Production API (Vercel). Override via NEXT_PUBLIC_API_URL or VITE_API_URL at build time. */
export const DEFAULT_PRODUCTION_API_URL =
  "https://money-tracker-backend-delta.vercel.app/api/v1";

const LOCAL_API_URL = "http://localhost:3001/api/v1";

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function envApiUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url || url.includes("localhost")) {
    return undefined;
  }
  return url;
}

/** Resolve API base URL (works in browser, SSR, and local dev). */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    if (isLocalHostname(window.location.hostname)) {
      return process.env.NEXT_PUBLIC_API_URL?.trim() || LOCAL_API_URL;
    }
    return envApiUrl() ?? DEFAULT_PRODUCTION_API_URL;
  }

  return envApiUrl() ?? (process.env.NODE_ENV === "production" ? DEFAULT_PRODUCTION_API_URL : LOCAL_API_URL);
}

/** @deprecated Prefer getApiUrl() for client-side navigation; kept for modules that need a constant. */
export const API_URL = getApiUrl();
