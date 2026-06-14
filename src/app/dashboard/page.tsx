"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ─── Nav items ──────────────────────────────────────────────────────────── */
const navItems = [
  { label: "Dashboard",        href: "/dashboard", icon: "🏠" },
  { label: "Sahara AI",        href: "/chat",      icon: "🤖" },
  { label: "Know Your Rights", href: "/rights",    icon: "📜" },
  { label: "Case Library",     href: "/cases",     icon: "📚" },
  { label: "Find a Lawyer",    href: "/lawyers",   icon: "⚖️" },
  { label: "Helplines",        href: "/helpline",  icon: "📞" },
  { label: "Profile",          href: "/profile",   icon: "👤" },
];

const statsData = [
  { icon: "📜", label: "Legal Rights",       value: "10+",  desc: "Categories" },
  { icon: "📚", label: "Cases",              value: "12+",  desc: "Landmark judgments" },
  { icon: "⚖️", label: "Lawyers",           value: "—",    desc: "Data pending" },
  { icon: "🤖", label: "AI Consultations",   value: "24/7", desc: "Always available" },
];

const quickLinks = [
  { label: "Sahara AI",        href: "/chat",      icon: "🤖",  desc: "Ask any legal question" },
  { label: "Know Your Rights", href: "/rights",    icon: "📜",  desc: "Women, Men, Cyber & more" },
  { label: "Case Library",     href: "/cases",     icon: "📚",  desc: "Supreme Court judgments" },
  { label: "Find a Lawyer",    href: "/lawyers",   icon: "⚖️",  desc: "Search by city & area" },
  { label: "Helplines",        href: "/helpline",  icon: "📞",  desc: "Emergency legal contacts" },
  { label: "My Profile",       href: "/profile",   icon: "👤",  desc: "Settings & preferences" },
];

const emergencyHelplines = [
  { n: "112",   l: "Emergency", icon: "🚨" },
  { n: "100",   l: "Police",    icon: "👮" },
  { n: "1091",  l: "Women",     icon: "👩" },
  { n: "1930",  l: "Cyber",     icon: "💻" },
  { n: "1098",  l: "Child",     icon: "👶" },
  { n: "15100", l: "NALSA",     icon: "⚖️" },
];

const BG = "#07111F";
const CARD = "#111827";
const GOLD = "#D4AF37";

/* ─── Animated background particles ─────────────────────────────────────── */
const PARTICLES = [
  { top: "10%", left: "5%",  dur: "7s",  delay: "0s",   size: 3 },
  { top: "20%", left: "88%", dur: "9s",  delay: "1s",   size: 2 },
  { top: "45%", left: "3%",  dur: "8s",  delay: "2.2s", size: 4 },
  { top: "65%", left: "92%", dur: "6s",  delay: "0.7s", size: 2 },
  { top: "80%", left: "15%", dur: "10s", delay: "1.5s", size: 3 },
  { top: "55%", left: "75%", dur: "7s",  delay: "3s",   size: 2 },
  { top: "30%", left: "50%", dur: "11s", delay: "0.3s", size: 2 },
  { top: "72%", left: "40%", dur: "8s",  delay: "2s",   size: 3 },
];

/* ─── Sahara AI quick-chat preview ──────────────────────────────────────── */
function SaharaQuickChat() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push("/chat");
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: CARD, border: `1px solid rgba(212,175,55,0.18)` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: "rgba(212,175,55,0.12)", border: `1px solid rgba(212,175,55,0.3)` }}
        >
          🤖
        </div>
        <div>
          <p className="text-sm font-bold text-white">Sahara AI</p>
          <p className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            Online · Hindi &amp; English
          </p>
        </div>
      </div>

      {/* Sample messages */}
      <div className="mb-4 space-y-2 text-xs">
        <div className="flex justify-end">
          <span
            className="rounded-2xl rounded-br-none px-3 py-2 max-w-[80%]"
            style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)`, color: BG, fontWeight: 600 }}
          >
            What are my rights in a property dispute?
          </span>
        </div>
        <div className="flex justify-start">
          <span
            className="rounded-2xl rounded-bl-none px-3 py-2 max-w-[85%] text-[#CBD5E1]"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.14)" }}
          >
            Under the Transfer of Property Act, you can file a civil suit. First step: gather all title documents…
          </span>
        </div>
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Ask Sahara AI…"
          className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-[#4A5568] outline-none"
          style={{ background: "rgba(7,17,31,0.8)", border: "1px solid rgba(212,175,55,0.18)" }}
        />
        <Link
          href="/chat"
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[#07111F]"
          style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
        >
          Chat →
        </Link>
      </form>
    </div>
  );
}

/* ─── Main dashboard ─────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: BG }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
          <p className="text-sm" style={{ color: "#9EADC8" }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const memberYear  = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();
  const displayName = user.full_name?.trim() || user.email.split("@")[0];
  const initials    = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen" style={{ background: BG, color: "#FFFFFF" }}>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden w-64 shrink-0 lg:flex lg:flex-col"
        style={{ background: "#0B1220", borderRight: "1px solid rgba(212,175,55,0.12)" }}
      >
        <div className="flex flex-col h-full px-4 py-6">

          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-0 blur-md transition-opacity group-hover:opacity-20" />
              <Image src="/logo.png" alt="Nyaya Setu" width={36} height={36} className="relative h-9 w-9 object-contain" />
            </div>
            <span className="font-serif text-base font-bold text-white">
              Nyaya<span style={{ color: GOLD }}>Setu</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "nav-item-active" : "nav-item-inactive"}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === "Sahara AI" && (
                    <span
                      className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ background: "rgba(212,175,55,0.2)", color: GOLD }}
                    >
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User card + logout */}
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.1)", paddingTop: "1rem" }}>
            <div
              className="mb-3 rounded-xl px-3 py-3"
              style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.12)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)`, color: "#07111F" }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{displayName}</p>
                  <p className="truncate text-[10px]" style={{ color: "#6B8098" }}>{user.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-400"
              style={{ color: "#6B8098" }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────────────────── */}
      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileNavOpen(false)} />
          <aside
            className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col lg:hidden"
            style={{ background: "#0B1220", borderRight: "1px solid rgba(212,175,55,0.12)" }}
          >
            <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileNavOpen(false)}>
                <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                <span className="font-serif text-sm font-bold text-white">Nyaya<span style={{ color: GOLD }}>Setu</span></span>
              </Link>
              <button onClick={() => setMobileNavOpen(false)} style={{ color: "#6B8098" }}>✕</button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navItems.map(item => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "nav-item-active" : "nav-item-inactive"}`}
                  >
                    <span>{item.icon}</span>{item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}>
              <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
                🚪 Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 lg:hidden"
          style={{ background: "#0B1220", borderBottom: "1px solid rgba(212,175,55,0.1)" }}
        >
          <button onClick={() => setMobileNavOpen(true)} style={{ color: GOLD }}>☰</button>
          <Link href="/">
            <Image src="/logo.png" alt="Nyaya Setu" width={32} height={32} className="h-8 w-8 object-contain" />
          </Link>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#07111F]"
            style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
          >
            {initials}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">

          {/* ── Hero welcome banner ─────────────────────────────────────── */}
          <div
            ref={heroRef}
            className="relative overflow-hidden px-6 py-10 md:px-10 md:py-12 legal-pattern"
            style={{ background: "linear-gradient(135deg,#040C18 0%,#0B1220 50%,#0F1A2E 100%)" }}
          >
            {/* Particles */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {PARTICLES.map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full particle"
                  style={{
                    top: p.top, left: p.left,
                    width: p.size, height: p.size,
                    background: GOLD,
                    ["--dur" as string]: p.dur,
                    animationDelay: p.delay,
                  }}
                />
              ))}
            </div>

            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full blur-[100px]"
              style={{ background: "rgba(212,175,55,0.07)" }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                {/* Badge */}
                <div
                  className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.08)", color: GOLD }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-gold-pulse" />
                  Dashboard
                </div>

                <h1 className="font-serif text-3xl font-extrabold text-white md:text-4xl">
                  Welcome back, <span className="gold-shimmer">{displayName}</span> 👋
                </h1>
                <p className="mt-2 text-base" style={{ color: "#9EADC8" }}>
                  Justice is just one click away.
                </p>
                <p className="mt-1 text-sm" style={{ color: "#6B8098" }}>
                  Member since {memberYear}{user.city ? ` · ${user.city}` : ""}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/chat"
                    className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
                    style={{ boxShadow: "0 0 20px rgba(212,175,55,0.3)" }}
                  >
                    🤖 Start Sahara AI Chat
                  </Link>
                  <Link
                    href="/rights"
                    className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
                  >
                    📜 Know Your Rights
                  </Link>
                </div>
              </div>

              {/* Avatar card */}
              <div
                className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-3xl"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  boxShadow: "0 0 30px rgba(212,175,55,0.1)",
                }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full font-serif text-3xl font-extrabold text-[#07111F]"
                  style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
                >
                  {initials}
                </div>
                <p className="mt-2 text-xs font-semibold text-white">{displayName.split(" ")[0]}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 md:px-8">

            {/* ── Stats row ──────────────────────────────────────────────── */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statsData.map(s => (
                <div
                  key={s.label}
                  className="rounded-2xl p-5 text-center transition-all duration-300"
                  style={{ background: CARD, border: "1px solid rgba(212,175,55,0.14)" }}
                >
                  <div
                    className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                    style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
                  >
                    {s.icon}
                  </div>
                  <p className="font-serif text-2xl font-extrabold" style={{ color: GOLD }}>{s.value}</p>
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                  <p className="text-xs" style={{ color: "#6B8098" }}>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* ── Three-column grid ──────────────────────────────────────── */}
            <div className="grid gap-6 xl:grid-cols-3">

              {/* Left: Quick links (2 cols on xl) */}
              <div className="xl:col-span-2 space-y-6">

                {/* Quick Access heading */}
                <div>
                  <h2 className="mb-4 font-serif text-xl font-bold text-white">Quick Access</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {quickLinks.map(card => (
                      <Link
                        key={card.href}
                        href={card.href}
                        className="gold-card group rounded-2xl p-5 block"
                      >
                        <div
                          className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-transform duration-300 group-hover:scale-110"
                          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.18)" }}
                        >
                          {card.icon}
                        </div>
                        <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{card.label}</p>
                        <p className="mt-0.5 text-xs" style={{ color: "#6B8098" }}>{card.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Getting started steps */}
                <div
                  className="rounded-2xl p-6"
                  style={{ background: CARD, border: "1px solid rgba(212,175,55,0.14)" }}
                >
                  <h2 className="mb-4 font-serif text-lg font-bold text-white">Getting Started</h2>
                  <div className="space-y-3">
                    {[
                      { icon: "🤖", text: "Ask Sahara AI your legal questions in Hindi or English" },
                      { icon: "📜", text: "Explore Know Your Rights for women, men, cyber & more" },
                      { icon: "📚", text: "Browse landmark Supreme Court judgments" },
                      { icon: "⚖️", text: "Find a lawyer by city and specialization" },
                      { icon: "📞", text: "Access emergency helplines instantly" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:border-[rgba(212,175,55,0.3)]"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <p className="text-sm text-white">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">

                {/* Sahara AI quick chat */}
                <SaharaQuickChat />

                {/* Emergency helplines */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: CARD, border: "1px solid rgba(212,175,55,0.14)" }}
                >
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <span>🆘</span> Emergency Helplines
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {emergencyHelplines.map(h => (
                      <a
                        key={h.n}
                        href={`tel:${h.n}`}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all hover:border-[rgba(212,175,55,0.5)]"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.12)" }}
                      >
                        <span>{h.icon}</span>
                        <div>
                          <p className="text-xs font-bold" style={{ color: GOLD }}>{h.n}</p>
                          <p className="text-[10px]" style={{ color: "#6B8098" }}>{h.l}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <a
                    href="tel:112"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-[#07111F] transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 0 14px rgba(239,68,68,0.3)" }}
                  >
                    📞 Call 112 — Emergency
                  </a>
                </div>

                {/* Account card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: CARD, border: "1px solid rgba(212,175,55,0.14)" }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Your Account</h3>
                    <Link href="/profile" className="text-xs font-medium hover:underline" style={{ color: GOLD }}>
                      Edit →
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl p-3 mb-3"
                    style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-[#07111F]"
                      style={{ background: `linear-gradient(135deg,${GOLD},#B8941E)` }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                      <p className="truncate text-xs" style={{ color: "#6B8098" }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs" style={{ color: "#6B8098" }}>
                    {user.city && <p>📍 {user.city}</p>}
                    <p>📅 Member since {memberYear}</p>
                  </div>
                  <div
                    className="mt-3 rounded-xl px-3 py-2.5 text-xs"
                    style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.15)", color: "#D4B56E" }}
                  >
                    🚧 Platform under active development · More features coming soon
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Dark footer ────────────────────────────────────────────────── */}
          <footer
            className="mt-4 px-6 py-6 text-center text-xs"
            style={{ borderTop: "1px solid rgba(212,175,55,0.1)", color: "#4A5568" }}
          >
            <p>
              Made with <span className="text-red-400">❤️</span> by{" "}
              <span style={{ color: GOLD }}>NyayaSetu Team</span>
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} NyayaSetu. All Rights Reserved. · General legal information only — not legal advice.
            </p>
          </footer>
        </main>
      </div>

      {/* ── Floating Sahara AI button ─────────────────────────────────────── */}
      <Link
        href="/chat"
        aria-label="Open Sahara AI"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 animate-chat-pop"
        style={{
          background: `linear-gradient(135deg,${GOLD},#B8941E)`,
          boxShadow: "0 0 28px rgba(212,175,55,0.5), 0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#0B1220" }}>
          <Image src="/logo.png" alt="Sahara AI" width={24} height={24} className="h-6 w-6 object-contain" />
        </div>
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full"
          style={{ background: "#0B1220" }}
        >
          <span className="h-3 w-3 rounded-full bg-emerald-400 animate-gold-pulse" />
        </span>
      </Link>
    </div>
  );
}
