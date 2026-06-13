"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "AI Assistant", href: "/chat", icon: "🤖" },
  { label: "Know Your Rights", href: "/rights", icon: "📜" },
  { label: "Case Library", href: "/cases", icon: "📚" },
  { label: "Find a Lawyer", href: "/lawyers", icon: "⚖️" },
  { label: "Helplines", href: "/helpline", icon: "📞" },
  { label: "Profile", href: "/profile", icon: "👤" },
];

const quickCards = [
  { label: "AI Legal Assistant", href: "/chat", icon: "🤖", desc: "Ask legal questions in English or Hindi" },
  { label: "Know Your Rights", href: "/rights", icon: "📜", desc: "Explore rights by category" },
  { label: "Case Library", href: "/cases", icon: "📚", desc: "Study landmark Indian judgments" },
  { label: "Find a Lawyer", href: "/lawyers", icon: "⚖️", desc: "Search legal professionals" },
  { label: "Helplines", href: "/helpline", icon: "📞", desc: "Emergency legal contacts" },
  { label: "My Profile", href: "/profile", icon: "👤", desc: "Manage your settings" },
];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const memberYear = user.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  const displayName = user.full_name?.trim() || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <WatermarkLogo opacity={0.04} size={600} />

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
          <div className="flex flex-col h-full px-4 py-6">
            <Link href="/" className="mb-8 flex items-center gap-3">
              <Image src="/logo.png" alt="Nyaya Setu" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="font-serif text-base font-bold text-primary">Nyaya Setu</span>
            </Link>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-border pt-4">
              <div className="mb-3 rounded-xl bg-primary/5 px-3 py-3">
                <p className="text-xs font-semibold text-primary truncate">{displayName}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-all hover:bg-red-50 hover:text-red-600"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay nav */}
        {mobileNavOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/30 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface lg:hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileNavOpen(false)}>
                  <Image src="/logo.png" alt="Nyaya Setu" width={28} height={28} className="h-7 w-7 object-contain" />
                  <span className="font-serif text-sm font-bold text-primary">Nyaya Setu</span>
                </Link>
                <button onClick={() => setMobileNavOpen(false)} className="p-1 text-muted">✕</button>
              </div>
              <nav className="flex-1 space-y-1 px-4 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      pathname === item.href ? "bg-primary text-white" : "text-muted hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border px-4 py-4">
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="relative flex-1 overflow-auto px-5 py-8 md:px-8">
          {/* Mobile top bar */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <button onClick={() => setMobileNavOpen(true)} className="rounded-xl border border-border p-2 text-muted">
              ☰
            </button>
            <Link href="/">
              <Image src="/logo.png" alt="Nyaya Setu" width={32} height={32} className="h-8 w-8 object-contain" />
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {initials}
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="mb-8 overflow-hidden rounded-3xl bg-primary px-6 py-8 text-white md:px-10 relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,164,93,0.2),transparent_60%)]" />
            <div className="relative">
              <p className="text-sm font-medium text-white/60">Welcome,</p>
              <h1 className="mt-1 font-serif text-2xl font-bold md:text-3xl">
                {displayName} 👋
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Member since {memberYear}
                {user.city ? ` · ${user.city}` : ""}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/chat"
                  className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-primary transition-all hover:bg-accent-light"
                >
                  Start AI Chat →
                </Link>
                <Link
                  href="/rights"
                  className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
                >
                  Know Your Rights
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mb-8">
            <h2 className="mb-4 font-serif text-xl font-bold text-primary">Quick Access</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {quickCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all card-hover"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-xl transition-transform group-hover:scale-110 group-hover:bg-accent/15">
                    {card.icon}
                  </div>
                  <p className="text-sm font-semibold text-primary">{card.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Info panels */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Getting Started */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-lg font-bold text-primary">Getting Started</h2>
              <div className="space-y-3">
                {[
                  { icon: "🤖", text: "Ask the AI assistant your legal questions" },
                  { icon: "📜", text: "Explore the Know Your Rights section" },
                  { icon: "📚", text: "Browse landmark court judgments" },
                  { icon: "⚖️", text: "Find a lawyer by city or specialization" },
                  { icon: "📞", text: "Save emergency helpline numbers" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-background px-4 py-3">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-sm text-primary">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-primary">Your Account</h2>
                <Link href="/profile" className="text-xs font-medium text-accent hover:underline">
                  Edit profile →
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary">{displayName}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                {user.city && (
                  <div className="rounded-xl bg-background px-4 py-3 text-sm text-muted">
                    📍 {user.city}
                  </div>
                )}
                <div className="rounded-xl bg-background px-4 py-3 text-sm text-muted">
                  📅 Member since {memberYear}
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  ℹ️ Platform under active development. More features coming soon.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
