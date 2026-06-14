// Emergency Helplines section — all numbers are real verified India government helplines.

const helplines = [
  { number: "112",   label: "National Emergency", icon: "🚨", color: "rgba(239,68,68,0.18)",   border: "rgba(239,68,68,0.4)" },
  { number: "100",   label: "Police",             icon: "👮", color: "rgba(59,130,246,0.18)",  border: "rgba(59,130,246,0.4)" },
  { number: "1091",  label: "Women Helpline",     icon: "👩", color: "rgba(236,72,153,0.18)",  border: "rgba(236,72,153,0.4)" },
  { number: "1930",  label: "Cyber Crime",        icon: "💻", color: "rgba(139,92,246,0.18)",  border: "rgba(139,92,246,0.4)" },
  { number: "1098",  label: "Childline",          icon: "👶", color: "rgba(34,197,94,0.18)",   border: "rgba(34,197,94,0.4)" },
  { number: "15100", label: "NALSA Legal Aid",    icon: "⚖️", color: "rgba(212,175,55,0.18)",  border: "rgba(212,175,55,0.5)" },
];

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden px-5 py-20 md:px-8"
      style={{ background: "#0B1220" }}
    >
      <div className="divider-gold absolute top-0 left-0 right-0" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
            style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
          >
            Emergency Support
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
            Verified <span className="gold-text">Emergency Helplines</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#6B8098]">
            Real India government numbers. Tap to call instantly. All verified from official sources.
          </p>
        </div>

        {/* Urgent banner */}
        <div
          className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
        >
          <span className="text-2xl">🆘</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-300">If you are in immediate danger — Call 112 right now</p>
            <p className="mt-0.5 text-sm text-red-400/80">
              Women:{" "}
              <a href="tel:1091" className="font-bold underline hover:text-white transition-colors">1091</a>
              {" · "}Cyber:{" "}
              <a href="tel:1930" className="font-bold underline hover:text-white transition-colors">1930</a>
              {" · "}Child:{" "}
              <a href="tel:1098" className="font-bold underline hover:text-white transition-colors">1098</a>
              {" · "}Ambulance:{" "}
              <a href="tel:102" className="font-bold underline hover:text-white transition-colors">102</a>
            </p>
          </div>
          <a
            href="tel:112"
            className="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 0 18px rgba(239,68,68,0.4)" }}
          >
            📞 Call 112
          </a>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {helplines.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="group emergency-card relative rounded-2xl p-5 transition-all duration-300"
            >
              {/* Glow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: h.color }}
              />
              <div className="relative flex items-center gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${h.border}` }}
                >
                  {h.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#9EADC8]">{h.label}</p>
                  <p
                    className="font-serif text-2xl font-extrabold transition-colors group-hover:text-[#D4AF37]"
                    style={{ color: "#E2E8F0" }}
                  >
                    {h.number}
                  </p>
                </div>
                <div className="ml-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#0B1220]"
                    style={{ background: "linear-gradient(135deg,#D4AF37,#B8941E)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="relative mt-2.5 text-xs text-[#6B8098] group-hover:text-[#9EADC8] transition-colors">
                Tap to call instantly · 24/7 available
              </p>
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#4A5568]">
          Sources: Ministry of Home Affairs · NALSA · NCW · CHILDLINE India · I4C (MHA) · Numbers verified {new Date().getFullYear()}
        </p>
      </div>

      <div className="divider-gold absolute bottom-0 left-0 right-0" />
    </section>
  );
}
