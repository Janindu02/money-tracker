import type { NextConfig } from "next";
import { DEFAULT_PRODUCTION_API_URL } from "./src/lib/api-config";

/** Netlify/Vercel may set VITE_API_URL; Next.js only inlines NEXT_PUBLIC_* by default. */
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  process.env.VITE_API_URL?.trim() ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PRODUCTION_API_URL : undefined);

const nextConfig: NextConfig = {
  env: apiUrl ? { NEXT_PUBLIC_API_URL: apiUrl } : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
