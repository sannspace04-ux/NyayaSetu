// Real platform feature highlights — no fabricated statistics or fake user counts.

const stats = [
  { icon: "⚖️", value: "10+",  label: "Legal Categories",   desc: "Property to Cyber Crime" },
  { icon: "🤖", value: "24/7", label: "AI Guidance",         desc: "Powered by Gemini AI" },
  { icon: "📞", value: "11+",  label: "Emergency Helplines", desc: "Verified Government Numbers" },
  { icon: "🌐", value: "2",    label: "Languages",           desc: "Hindi & English" },
];

export default function Statistics() {
  return (
    <section
      className="relative px-5 py-16 md:px-8"
      style={{ background: "linear-gradient(180deg, #0B1220 0%, #0F1A2E 100%)" }}
    >
      <div className="divider-gold absolute top-0 left-0 right-0" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
            style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
          >
            What We Offer
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
            Built for <span className="gold-text">Every Indian Citizen</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#6B8098]">
            Platform under active development — features and legal content are being expanded continuously.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card group rounded-2xl p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                {s.icon}
              </div>
              <div className="font-serif text-3xl font-extrabold text-[#D4AF37] md:text-4xl">{s.value}</div>
              <p className="mt-1 text-sm font-semibold text-white">{s.label}</p>
              <p className="mt-0.5 text-xs text-[#6B8098]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divider-gold absolute bottom-0 left-0 right-0" />

      <style>{`
        .stat-card {
          background: #111827;
          border: 1px solid rgba(212,175,55,0.14);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212,175,55,0.55);
          box-shadow: 0 0 18px rgba(212,175,55,0.12), 0 8px 28px rgba(0,0,0,0.45);
        }
      `}</style>
    </section>
  );
}
