"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAppStore } from "@/store/use-app-store";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex" />
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <Sidebar className="fixed inset-y-0 left-0 z-50 lg:hidden" />
        </>
      )}
      <div className="flex flex-1 flex-col">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">{children}</main>
        <footer className="hidden border-t border-border py-4 text-center text-xs text-muted-foreground lg:block">
          © {new Date().getFullYear()} Finova. Secure & Encrypted.
        </footer>
        <MobileNav className="lg:hidden" />
      </div>
    </div>
    </AuthGuard>
  );
}
