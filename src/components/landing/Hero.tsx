"use client";

import Image from "next/image";
import Link from "next/link";

/* ── Gold particles ──────────────────────────────────────────────────────── */
const PARTICLES = [
  { top: "12%", left: "4%",  d: "0s",   s: 3 },
  { top: "22%", left: "92%", d: "1s",   s: 2 },
  { top: "48%", left: "2%",  d: "1.6s", s: 4 },
  { top: "74%", left: "94%", d: "0.4s", s: 2 },
  { top: "35%", left: "84%", d: "2.2s", s: 3 },
  { top: "82%", left: "14%", d: "1.3s", s: 2 },
  { top: "8%",  left: "56%", d: "0.7s", s: 2 },
  { top: "60%", left: "42%", d: "1.9s", s: 2 },
];

/* ── Scales of Justice SVG ────────────────────────────────────────────────── */
function ScalesSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Pillar */}
      <rect x="95" y="28" width="10" height="158" rx="3" fill="#D4AF37" opacity="0.55" />
      {/* Base plate */}
      <rect x="58" y="182" width="84" height="7" rx="3" fill="#D4AF37" opacity="0.45" />
      <rect x="70" y="188" width="60" height="10" rx="3" fill="#D4AF37" opacity="0.35" />
      {/* Beam */}
      <rect x="28" y="55" width="144" height="7" rx="3" fill="#D4AF37" opacity="0.7" />
      {/* Chains */}
      <line x1="44" y1="62" x2="44" y2="114" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.6" />
      <line x1="156" y1="62" x2="156" y2="108" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.6" />
      {/* Pans */}
      <path d="M14 114 Q44 126 74 114" stroke="#D4AF37" strokeWidth="2.5" fill="none" opacity="0.75" />
      <path d="M126 108 Q156 120 186 108" stroke="#D4AF37" strokeWidth="2.5" fill="none" opacity="0.75" />
      {/* Top cap */}
      <circle cx="100" cy="28" r="8" fill="#D4AF37" opacity="0.8" />
      {/* Pivot dots */}
      <circle cx="44" cy="62" r="4" fill="#D4AF37" opacity="0.7" />
      <circle cx="156" cy="62" r="4" fill="#D4AF37" opacity="0.7" />
    </svg>
  );
}

/* ── AI Chat Preview card (right column) ─────────────────────────────────── */
function ChatPreview() {
  const msgs = [
    { from: "user",  text: "मुझे साइबर फ्रॉड हुआ है, क्या करूं?" },
    { from: "ai",    text: "तुरंत 1930 पर कॉल करें। cybercrime.gov.in पर ऑनलाइन शिकायत दर्ज करें।" },
    { from: "user",  text: "Can I get a protection order?" },
    { from: "ai",    text: "Yes — under the DV Act 2005 you can apply to a Magistrate directly. I'll walk you through the steps." },
  ];

  return (
    <div
      className="relative w-full max-w-sm animate-float-slow rounded-3xl p-px"
      style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.06) 60%, rgba(212,175,55,0.3) 100%)",
        boxShadow: "0 0 50px rgba(212,175,55,0.12), 0 24px 60px rgba(0,0,0,0.6)",
      }}
    >
      <div className="rounded-3xl overflow-hidden" style={{ background: "#111827" }}>
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            background: "linear-gradient(90deg, rgba(212,175,55,0.12) 0%, rgba(11,18,32,0) 100%)",
            borderBottom: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1220] ring-2 ring-[rgba(212,175,55,0.4)]">
            <Image src="/logo.png" alt="AI" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#111827] bg-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Nyaya AI</p>
            <p className="text-xs text-emerald-400">● Live · Hindi &amp; English</p>
          </div>
          <div className="ml-auto flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3 px-4 py-5">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              style={{
                animation: `fade-up 0.4s ease-out ${0.1 + i * 0.12}s both`,
              }}
            >
              {m.from === "ai" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] ring-1 ring-[rgba(212,175,55,0.3)]">
                  <Image src="/logo.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.from === "user"
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm text-[#E2E8F0]"
                }`}
                style={{
                  background:
                    m.from === "user"
                      ? "linear-gradient(135deg, #D4AF37, #B8941E)"
                      : "rgba(255,255,255,0.07)",
                  border: m.from === "ai" ? "1px solid rgba(212,175,55,0.12)" : "none",
                  color: m.from === "user" ? "#0B1220" : undefined,
                  fontWeight: m.from === "user" ? 600 : 400,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] ring-1 ring-[rgba(212,175,55,0.3)]">
              <Image src="/logo.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
            </div>
            <div
              className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-3.5 py-2.5"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,175,55,0.12)" }}
            >
              {[0, 0.18, 0.36].map((d, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"
                  style={{ animation: `bounce-dot 0.7s ease-in-out ${d}s infinite` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div
          className="flex items-center gap-2 px-4 py-3.5"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <div
            className="flex-1 rounded-xl px-3 py-2 text-xs text-[#6B8098]"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Ask your legal question…
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#0B1220]"
            style={{ background: "linear-gradient(135deg,#D4AF37,#B8941E)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating label badge */}
      <div
        className="absolute -right-3 -top-3 rounded-full px-3 py-1 text-xs font-bold text-[#0B1220]"
        style={{ background: "linear-gradient(135deg,#D4AF37,#E8C84A)", boxShadow: "0 0 14px rgba(212,175,55,0.45)" }}
      >
        ⚡ Powered by Gemini AI
      </div>
    </div>
  );
}

/* ── Main Hero component ─────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden legal-pattern"
      style={{
        background: "linear-gradient(150deg, #04080F 0%, #0B1220 40%, #0F1A2E 70%, #080E1A 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full blur-[120px]"
           style={{ background: "rgba(11,42,91,0.35)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full blur-[100px]"
           style={{ background: "rgba(212,175,55,0.06)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
           style={{ background: "radial-gradient(circle, rgba(212,175,55,0.055) 0%, transparent 70%)" }} aria-hidden="true" />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37] animate-float"
            style={{ top: p.top, left: p.left, width: p.s, height: p.s, animationDelay: p.d, opacity: 0.22 }}
          />
        ))}
      </div>

      {/* Decorative scales (desktop only, behind content) */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 hidden w-[320px] opacity-[0.07] xl:block animate-scales"
        style={{ transform: "translateY(30px) translateX(40px)" }}
        aria-hidden="true"
      >
        <ScalesSVG className="w-full" />
      </div>

      {/* ── Content grid ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-12 px-5 pb-10 pt-24 md:px-8 lg:flex-row lg:items-center lg:gap-16 lg:pb-16 lg:pt-28">

        {/* ── LEFT: Text + CTAs ─────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">

          {/* Logo + brand badge */}
          <div className="animate-fade-up opacity-0 mb-6 flex flex-col items-center gap-4 lg:flex-row lg:items-center">
            <div className="relative">
              {/* Gold glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-gold-ring"
                style={{ background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)" }}
              />
              <Image
                src="/logo.png"
                alt="Nyaya Setu"
                width={80}
                height={80}
                className="relative h-20 w-20 animate-float object-contain"
                priority
              />
            </div>
            <div className="hidden h-10 w-px bg-[rgba(212,175,55,0.25)] lg:block" />
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
              style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-gold-pulse" />
              India&apos;s AI Legal Platform
            </div>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up animate-delay-100 opacity-0 font-serif text-5xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-[4.25rem]">
            ⚖️{" "}
            <span className="gold-shimmer">NyayaSetu</span>
          </h1>

          <p className="animate-fade-up animate-delay-200 opacity-0 mt-3 text-xl font-light tracking-wide text-[#9EADC8] md:text-2xl">
            India&apos;s AI-Powered Legal Companion
          </p>

          <p className="animate-fade-up animate-delay-300 opacity-0 mt-5 max-w-lg text-base leading-relaxed text-[#6B8098] md:text-lg">
            Get legal guidance, know your rights, access emergency support,
            and connect with legal resources — in Hindi and English, 24/7.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up animate-delay-400 opacity-0 mt-8 flex flex-col items-center gap-3.5 sm:flex-row lg:items-start">
            <Link
              href="/chat"
              className="btn-gold inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold tracking-wide"
              style={{ boxShadow: "0 0 22px rgba(212,175,55,0.32)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              Start Legal Consultation
            </Link>
            <Link href="/rights" className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold">
              Explore Rights
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-up animate-delay-500 opacity-0 mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {["🇮🇳 Made for India", "🔒 Privacy-First", "⚖️ Verified Legal Info", "🌐 Hindi & English"].map((b) => (
              <span
                key={b}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-[#9EADC8]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="animate-fade-up animate-delay-600 opacity-0 mt-8 flex gap-8">
            {[
              { v: "10+",  l: "Legal Areas" },
              { v: "24/7", l: "AI Guidance" },
              { v: "11+",  l: "Helplines" },
            ].map((s) => (
              <div key={s.l} className="text-center lg:text-left">
                <div className="font-serif text-2xl font-bold text-[#D4AF37]">{s.v}</div>
                <div className="mt-0.5 text-xs text-[#6B8098]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Chat Preview Card ──────────────────────────────────── */}
        <div className="animate-fade-up animate-delay-300 opacity-0 flex w-full flex-1 justify-center lg:justify-end">
          <ChatPreview />
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg width="20" height="30" viewBox="0 0 20 30">
          <rect x="8" y="2" width="4" height="14" rx="2" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="10" cy="7" r="2" fill="#D4AF37" className="animate-float" />
          <polyline points="5 22 10 27 15 22" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
