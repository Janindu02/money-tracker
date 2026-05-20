import { API_URL } from "@/lib/api-config";

export function getGoogleSignInUrl(): string {
  return `${API_URL}/auth/google`;
}
