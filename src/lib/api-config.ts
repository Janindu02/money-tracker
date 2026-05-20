const PRODUCTION_API_URL =
  "https://money-tracker-backend-hx4ypssc8-janindus-projects-560b4744.vercel.app/api/v1";

const LOCAL_API_URL = "http://localhost:3001/api/v1";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : LOCAL_API_URL);
