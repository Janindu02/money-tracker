import { GuestGuard } from "@/components/auth/guest-guard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-background to-sky-50 p-4 dark:from-emerald-950/20 dark:via-background dark:to-sky-950/20">
        {children}
      </div>
    </GuestGuard>
  );
}
