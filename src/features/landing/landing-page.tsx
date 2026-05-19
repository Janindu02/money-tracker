"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Shield,
  Sparkles,
  Target,
  Wallet,
  Zap,
} from "lucide-react";
import { FinovaLogo } from "@/components/shared/finova-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_TAGLINE, FOOTER_NAV } from "@/utils/constants";
import { mockFaq, mockPricingPlans, mockTestimonials } from "@/services/mock-data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

const features = [
  { icon: Wallet, title: "Smart Budgeting", desc: "Set limits, track spending, and stay on top of every category." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Visualize cash flow with beautiful charts and actionable insights." },
  { icon: Target, title: "Savings Goals", desc: "Reach your dreams faster with goal tracking and AI recommendations." },
  { icon: Sparkles, title: "AI Insights", desc: "Get personalized alerts and savings opportunities powered by AI." },
  { icon: Shield, title: "Bank-Level Security", desc: "256-bit encryption and privacy-first architecture." },
  { icon: Zap, title: "Real-Time Sync", desc: "Your finances, always up to date across all your devices." },
];

export function LandingPage() {
  const router = useRouter();
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <FinovaLogo />
          <nav className="hidden items-center gap-8 md:flex">
            {FOOTER_NAV.slice(0, 3).map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <GoogleSignInButton variant="compact" className="hidden sm:inline-flex" />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4">New · AI-Powered Finance</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Manage money with <span className="gradient-text">confidence</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">{APP_TAGLINE}</p>
            <div className="mt-8 flex max-w-md flex-col gap-3">
              <GoogleSignInButton label="Sign in with Google" />
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild className="flex-1 sm:flex-none">
                  <Link href="/register">
                    Start Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => {
                    setAuthenticated(true);
                    router.push("/dashboard");
                  }}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Card variant="glass" className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="gradient-primary p-6">
                  <p className="text-sm text-white/80">Total Net Worth</p>
                  <p className="text-3xl font-bold text-white">$124,592.00</p>
                  <Badge className="mt-2 bg-white/20 text-white">+12.5%</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  {["Income", "Expenses", "Savings", "Goals"].map((l) => (
                    <div key={l} className="rounded-xl bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">{l}</p>
                      <p className="font-semibold">$12.4k</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-t border-border bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold">Everything you need</h2>
          <p className="mt-3 text-muted-foreground">Powerful tools designed for modern financial wellness</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <h2 className="text-center text-3xl font-bold">Loved by thousands</h2>
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
          {mockTestimonials.map((t) => (
            <Card key={t.name} variant="glass">
              <CardContent className="p-6">
                <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.avatar[0]}
                  </div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-border bg-muted/30 px-4 py-20">
        <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {mockPricingPlans.map((plan) => (
            <Card key={plan.id} variant={plan.popular ? "gradient" : "glass"} className="relative">
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
              <CardHeader>
                <CardTitle className={plan.popular ? "text-white" : ""}>{plan.name}</CardTitle>
                <p className={plan.popular ? "text-white/80" : "text-muted-foreground"}>
                  <span className="text-3xl font-bold">${plan.price}</span>/{plan.period}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? "text-white/90" : ""}`}>
                      <Check className="h-4 w-4 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={plan.popular ? "secondary" : "default"} asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="px-4 py-20">
        <h2 className="text-center text-3xl font-bold">FAQ</h2>
        <div className="mx-auto mt-12 max-w-2xl space-y-3">
          {mockFaq.map((item, i) => (
            <Card key={item.q} variant="glass">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left font-medium"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {item.q}
                <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <CardContent className="pt-0 text-sm text-muted-foreground">{item.a}</CardContent>}
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <FinovaLogo />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Finova. Secure & Encrypted.</p>
          <nav className="flex gap-6">
            {FOOTER_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
