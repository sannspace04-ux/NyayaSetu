// Real platform feature highlights — no fake user counts or fabricated statistics

const features = [
  {
    icon: "⚖️",
    label: "Legal Areas Covered",
    value: "12+",
    desc: "From property to cyber crime",
  },
  {
    icon: "📚",
    label: "Landmark Cases",
    value: "12+",
    desc: "Curated Supreme Court judgments",
  },
  {
    icon: "🤖",
    label: "AI Assistance",
    value: "24/7",
    desc: "Powered by Gemini 1.5 Flash",
  },
  {
    icon: "📞",
    label: "Real Helplines",
    value: "14",
    desc: "Verified India emergency numbers",
  },
];

export default function Statistics() {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            What We Offer
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">
            Built for every Indian citizen
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Platform under active development. Features and content are being expanded continuously.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="group rounded-2xl border border-border bg-surface p-6 text-center shadow-sm card-hover"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-2xl transition-all group-hover:bg-accent/15 group-hover:scale-110">
                {f.icon}
              </div>
              <div className="font-serif text-3xl font-bold text-primary">{f.value}</div>
              <p className="mt-1 text-sm font-medium text-primary">{f.label}</p>
              <p className="mt-0.5 text-xs text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
