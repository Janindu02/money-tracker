/** Production API (Vercel). Override via NEXT_PUBLIC_API_URL or VITE_API_URL at build time. */
export const DEFAULT_PRODUCTION_API_URL =
  "https://money-tracker-backend-delta.vercel.app/api/v1";

const LOCAL_API_URL = "http://localhost:3001/api/v1";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PRODUCTION_API_URL : LOCAL_API_URL);
