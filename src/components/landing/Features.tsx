const features = [
  {
    title: "AI Legal Chat",
    description:
      "Ask legal questions in plain Hindi or English and get instant, structured guidance powered by AI.",
    icon: "🤖",
  },
  {
    title: "Know Your Rights",
    description:
      "Explore your constitutional and statutory rights explained simply — no law degree required.",
    icon: "📜",
  },
  {
    title: "Case Library",
    description:
      "Browse landmark judgments and case summaries relevant to your situation, curated for clarity.",
    icon: "📚",
  },
  {
    title: "Helplines",
    description:
      "Instant access to national and state legal aid helplines, women's commissions, and cyber cells.",
    icon: "📞",
  },
  {
    title: "Find a Lawyer",
    description:
      "Connect with verified advocates by practice area and location when you need professional counsel.",
    icon: "⚖️",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-surface px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Platform Features
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">
            Everything you need, one platform
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Nyaya Setu brings together AI, resources, and human expertise —
            designed for citizens, students, and professionals alike.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg ${
                index === features.length - 1 && features.length % 3 !== 0
                  ? "sm:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/15">
                  {feature.icon}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
