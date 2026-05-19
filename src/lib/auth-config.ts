const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export function getGoogleSignInUrl(): string {
  return `${API_URL}/auth/google`;
}
