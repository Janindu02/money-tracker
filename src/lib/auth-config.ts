import { getApiUrl } from "@/lib/api-config";

export function getGoogleSignInUrl(): string {
  return `${getApiUrl()}/auth/google`;
}
