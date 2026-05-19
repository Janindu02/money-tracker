"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FinovaLogo } from "@/components/shared/finova-logo";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/hooks/useAuth";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";

type AuthMode = "login" | "register" | "forgot";

const schemas = {
  login: loginSchema,
  register: registerSchema,
  forgot: forgotPasswordSchema,
} as const;

const OAUTH_ERRORS: Record<string, string> = {
  oauth: "Google sign-in failed. Please try again or use email and password.",
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const { login, register, forgotPassword, loading, error } = useAuth();
  const schema = schemas[mode];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "register"
        ? { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }
        : mode === "forgot"
          ? { email: "" }
          : { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (mode === "login") await login(values as LoginInput);
    else if (mode === "register") await register(values as RegisterInput);
    else await forgotPassword(values as ForgotPasswordInput);
  });

  const titles = {
    login: { title: "Welcome back", desc: "Sign in to your Finova account" },
    register: { title: "Create account", desc: "Start managing your money smarter" },
    forgot: { title: "Reset password", desc: "We'll send you a reset link" },
  };

  const displayError =
    error ?? (oauthError ? (OAUTH_ERRORS[oauthError] ?? "Sign-in failed. Please try again.") : null);

  return (
    <Card variant="glass" className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <FinovaLogo className="mb-4 justify-center" />
        <CardTitle>{titles[mode].title}</CardTitle>
        <CardDescription>{titles[mode].desc}</CardDescription>
      </CardHeader>
      <CardContent>
        {mode !== "forgot" && (
          <div className="mb-4 space-y-4">
            <GoogleSignInButton disabled={loading} />
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {displayError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{displayError}</p>
          )}
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" autoComplete="given-name" {...form.register("firstName")} />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-destructive">{String(form.formState.errors.firstName.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" autoComplete="family-name" {...form.register("lastName")} />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{String(form.formState.errors.email.message)}</p>
            )}
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{String(form.formState.errors.password.message)}</p>
              )}
              {mode === "register" && (
                <p className="text-xs text-muted-foreground">
                  Use 8+ characters with uppercase, lowercase, a number, and a symbol.
                </p>
              )}
            </div>
          )}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {String(form.formState.errors.confirmPassword.message)}
                </p>
              )}
            </div>
          )}
          {mode === "login" && (
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : mode === "register"
                  ? "Create account"
                  : "Send reset link"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </>
          ) : mode === "register" ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
