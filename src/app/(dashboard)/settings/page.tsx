"use client";

import { useEffect, useState } from "react";
import { Shield, Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { CurrencySettingsPanel } from "@/components/currency/currency-settings-panel";
import { ConnectedAccountsCard } from "@/components/auth/connected-accounts-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFetch } from "@/hooks/use-fetch";
import { authService } from "@/services/auth.service";
import { api } from "@/services/api";
import { getErrorMessage } from "@/lib/axios";
import { useCurrency } from "@/components/providers/currency-provider";
import { getCurrencyInfo } from "@/constants/currencies";

export default function SettingsPage() {
  const { displayCurrency, setDisplayCurrency } = useCurrency();
  const { data: profile, loading, refetch } = useFetch(() => authService.getProfile(), []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhone(profile.phone ?? "");
      const prefs = profile.notificationPrefs as Record<string, boolean> | null;
      if (prefs?.budgetAlerts !== undefined) setBudgetAlerts(prefs.budgetAlerts);
    }
  }, [profile]);

  const saveProfile = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.patch("/users/profile", { firstName, lastName, phone, currency: displayCurrency });
      await api.patch("/users/notification-preferences", {
        budgetAlerts,
        savingsReminders: true,
        emailNotifications: true,
        systemNotifications: true,
      });
      setMessage("Settings saved. All amounts will display in " + getCurrencyInfo(displayCurrency).name + ".");
      void refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCurrencyChange = async (code: string) => {
    await setDisplayCurrency(code);
    setMessage(`Display currency changed to ${getCurrencyInfo(code).name}. Refreshing data…`);
  };

  if (loading && !profile) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader title="Profile & Settings" description="Currency, profile, and notification preferences." />
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={profile?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button onClick={() => void saveProfile()} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {profile && <ConnectedAccountsCard profile={profile} />}
          <CurrencySettingsPanel onChange={(code) => void handleCurrencyChange(code)} />
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Budget Alerts</Label>
                <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
              </div>
            </CardContent>
          </Card>
          <Card variant="gradient">
            <CardContent className="p-6">
              <p className="text-sm text-white/80">Active Plan</p>
              <p className="text-xl font-bold text-white">{profile?.plan ?? "Starter"}</p>
              <Separator className="my-4 bg-white/20" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
