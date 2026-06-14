// Mission section — no fabricated claims or fake user counts.

const pillars = [
  { icon: "⚖️", title: "Rooted in Indian Law",  desc: "Every reference is a real Indian statute or Supreme Court judgment — never fabricated." },
  { icon: "🤖", title: "AI-Powered Guidance",    desc: "Gemini-powered assistant provides structured legal information in Hindi and English." },
  { icon: "🔒", title: "Privacy First",          desc: "Your data is yours. Industry-standard encryption. We never sell your information." },
  { icon: "🌐", title: "Accessible to All",      desc: "No law degree required. Built for citizens, students, and professionals alike." },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-5 py-20 md:px-8"
      style={{ background: "linear-gradient(180deg, #0F1A2E 0%, #0B1220 100%)" }}
    >
      <div className="divider-gold absolute top-0 left-0 right-0" />

      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-16"
          style={{
            background: "linear-gradient(135deg, #111827 0%, #162040 100%)",
            border: "1px solid rgba(212,175,55,0.16)",
            boxShadow: "0 0 80px rgba(212,175,55,0.05), inset 0 0 60px rgba(212,175,55,0.02)",
          }}
        >
          {/* Decorative corner glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "rgba(212,175,55,0.06)" }}
            aria-hidden="true"
          />

          <div className="relative text-center">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
              style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
            >
              Our Mission
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
              Building India&apos;s <span className="gold-text">Legal Clarity</span> Movement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6B8098] md:text-base">
              &ldquo;Nyaya&rdquo; means justice. &ldquo;Setu&rdquo; means bridge. We connect every citizen
              to the legal knowledge they deserve — powered by AI, backed by verified resources.
            </p>
            <div
              className="mx-auto mt-4 inline-block rounded-xl px-4 py-2 text-xs text-[#9EADC8]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              🚧 Platform under active development · More features launching soon
            </div>
          </div>

          <dl className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="pillar-card group rounded-2xl p-6 text-center">
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  {p.icon}
                </div>
                <dt className="font-semibold text-white">{p.title}</dt>
                <dd className="mt-2 text-xs leading-relaxed text-[#6B8098]">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="divider-gold absolute bottom-0 left-0 right-0" />

      <style>{`
        .pillar-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.12);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .pillar-card:hover {
          background: rgba(212,175,55,0.07);
          border-color: rgba(212,175,55,0.4);
          transform: translateY(-4px);
        }
      `}</style>
    </section>
  );
}
