"use client";

import { Camera } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { authService } from "@/services/auth.service";
import { AuthProviderBadge } from "@/components/auth/auth-provider-badge";

export default function ProfilePage() {
  const { data: profile, loading } = useFetch(() => authService.getProfile(), []);

  if (loading && !profile) return <PageLoader />;

  const user = profile ?? {
    firstName: "User",
    lastName: "",
    email: "",
    avatar: "",
    plan: "Starter",
    memberSince: "—",
    location: "—",
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Your public profile and membership details." />
      <Card variant="glass" className="overflow-hidden">
        <div className="gradient-primary p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white/30">
                <AvatarImage src={user.avatar ?? undefined} alt={user.firstName} />
                <AvatarFallback>{user.firstName[0]}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-600 shadow"
                aria-label="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="bg-white/20 text-white">{user.plan}</Badge>
                <AuthProviderBadge
                  authProvider={"authProvider" in user ? user.authProvider : undefined}
                  hasGoogleLinked={"hasGoogleLinked" in user ? user.hasGoogleLinked : undefined}
                />
              </div>
              <p className="mt-2 text-sm text-white/80">{user.email}</p>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                Public Profile
              </Button>
              <Button className="bg-white text-emerald-700 hover:bg-white/90" asChild>
                <a href="/settings">Edit Settings</a>
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="font-medium">{"memberSince" in user ? user.memberSince : "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{user.location ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-medium">{user.plan}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
