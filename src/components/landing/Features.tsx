"use client";

import Link from "next/link";

const panels = [
  { icon: "👩", title: "Women's Rights",       desc: "DV Act, POSH, Maternity, Dowry protection.",    href: "/rights",  color: "rgba(236,72,153,0.15)" },
  { icon: "👨", title: "Men's Rights",          desc: "False case defence, custody & fair trial.",     href: "/rights",  color: "rgba(59,130,246,0.15)" },
  { icon: "💻", title: "Cyber Crime",           desc: "IT Act, fraud reporting, online harassment.",   href: "/rights",  color: "rgba(139,92,246,0.15)" },
  { icon: "📄", title: "FIR Guide",             desc: "How to file, track and follow up an FIR.",      href: "/cases",   color: "rgba(249,115,22,0.15)" },
  { icon: "⚖️", title: "Legal Aid",             desc: "NALSA free aid, pro-bono, eligibility check.",  href: "/helpline",color: "rgba(212,175,55,0.18)" },
  { icon: "🏠", title: "Property Disputes",     desc: "Ownership, RERA, partition & tenant rights.",   href: "/rights",  color: "rgba(34,197,94,0.15)"  },
  { icon: "👶", title: "Child Rights",          desc: "RTE, POCSO, child labour & identity rights.",   href: "/rights",  color: "rgba(20,184,166,0.15)" },
  { icon: "👴", title: "Senior Citizens",       desc: "Maintenance law, Elderline 14567, protection.", href: "/rights",  color: "rgba(245,158,11,0.15)" },
];

export default function Features() {
  return (
    <section
      id="quick-access"
      className="relative overflow-hidden px-5 py-20 md:px-8"
      style={{ background: "#0B1220" }}
    >
      <div className="divider-gold absolute top-0 left-0 right-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
            style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
          >
            Quick Access
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
            Know Your <span className="gold-text">Rights &amp; Remedies</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-[#6B8098]">
            Select a category to explore laws, landmark cases and get AI-guided legal steps.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {panels.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="gold-card group relative overflow-hidden rounded-2xl p-5 block"
            >
              {/* Hover colour fill */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                style={{ background: p.color }}
              />
              <div className="relative">
                <div
                  className="mb-3.5 flex h-13 w-13 items-center justify-center rounded-xl text-3xl transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.15)" }}
                >
                  <span className="text-2xl">{p.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-white transition-colors group-hover:text-[#D4AF37]">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6B8098] transition-colors group-hover:text-[#9EADC8]">
                  {p.desc}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#D4AF37] opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="divider-gold absolute bottom-0 left-0 right-0" />
    </section>
  );
}
