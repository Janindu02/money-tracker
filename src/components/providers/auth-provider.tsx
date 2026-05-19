"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authService, type AuthUser } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/axios";
import { useAppStore } from "@/store/use-app-store";
import type { ForgotPasswordInput, LoginInput, RegisterInput } from "@/lib/validations/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  forgotPassword: (data: ForgotPasswordInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, setAuthenticated } = useAppStore();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setAuthenticated(true);
    } catch {
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setAuthenticated]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (data: LoginInput) => {
      setError(null);
      setLoading(true);
      try {
        const res = await authService.login(data);
        setUser(res.user);
        setAuthenticated(true);
        router.push("/dashboard");
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setAuthenticated],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      setError(null);
      setLoading(true);
      try {
        const res = await authService.register(data);
        setUser(res.user);
        setAuthenticated(true);
        router.push("/dashboard");
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setAuthenticated],
  );

  const forgotPassword = useCallback(async (data: ForgotPasswordInput) => {
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(data);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setAuthenticated(false);
      router.push("/login");
    }
  }, [router, setAuthenticated]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      forgotPassword,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, loading, error, login, register, forgotPassword, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
