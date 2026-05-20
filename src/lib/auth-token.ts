const STORAGE_KEY = "finova_access_token";

let memoryToken: string | null = null;

export function setAccessToken(token: string | null | undefined): void {
  if (!token) {
    clearAccessToken();
    return;
  }
  memoryToken = token;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, token);
  }
}

export function getAccessToken(): string | null {
  if (memoryToken) return memoryToken;
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  memoryToken = stored;
  return stored;
}

export function clearAccessToken(): void {
  memoryToken = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
