"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthProviderBadge } from "@/components/auth/auth-provider-badge";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setStatus("error");
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    void refreshUser()
      .then(() => {
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 1200);
      })
      .catch(() => {
        setStatus("error");
        router.replace("/login?error=oauth");
      });
  }, [router, searchParams, refreshUser]);

  return (
    <div className="flex min-h-[40vh] w-full max-w-sm flex-col items-center justify-center gap-4 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Completing Google sign-in…</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <div className="space-y-2">
            <p className="font-semibold">Welcome{user?.firstName ? `, ${user.firstName}` : ""}!</p>
            <AuthProviderBadge authProvider={user?.authProvider ?? "google"} hasGoogleLinked />
            <p className="text-sm text-muted-foreground">Redirecting to your dashboard…</p>
          </div>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
