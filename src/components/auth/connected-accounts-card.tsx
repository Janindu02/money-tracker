"use client";

import { Link2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import type { AuthUser } from "@/services/auth.service";

interface ConnectedAccountsCardProps {
  profile: AuthUser & {
    memberSince?: string;
    hasGoogleLinked?: boolean;
    hasPassword?: boolean;
    authProvider?: AuthUser["authProvider"];
  };
}

export function ConnectedAccountsCard({ profile }: ConnectedAccountsCardProps) {
  const googleLinked = Boolean(
    profile.hasGoogleLinked ||
      profile.authProvider === "google" ||
      profile.authProvider === "both",
  );
  const hasPassword = profile.hasPassword ?? profile.authProvider !== "google";

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="h-4 w-4" /> Connected accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </span>
            <div>
              <p className="font-medium">Email & password</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <Badge variant={hasPassword ? "default" : "secondary"}>
            {hasPassword ? "Active" : "Not set"}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Google</p>
            <p className="text-sm text-muted-foreground">
              {googleLinked
                ? "Your account is linked to Google. You can sign in with one click."
                : "Link Google to sign in faster without a password."}
            </p>
          </div>
          {googleLinked ? (
            <Badge className="w-fit shrink-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              Connected
            </Badge>
          ) : (
            <GoogleSignInButton variant="compact" label="Link Google" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
