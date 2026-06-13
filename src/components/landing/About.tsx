// About section — no fabricated user counts or false statistics.
// All values shown reflect actual platform content.

const pillars = [
  {
    icon: "⚖️",
    title: "Rooted in Indian Law",
    desc: "Every piece of information references real Indian statutes, Acts of Parliament, and Supreme Court judgments — never fabricated.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Guidance",
    desc: "Our Gemini-powered assistant provides structured legal information in plain Hindi and English, available around the clock.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your conversations, queries, and personal data are yours. We use industry-standard encryption and never sell your data.",
  },
  {
    icon: "🌐",
    title: "Accessible to All",
    desc: "Built for citizens, students, and professionals alike — no law degree required to understand your rights.",
  },
];

export default function About() {
  return (
    <section id="about" className="px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-white md:px-12 md:py-16">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Our Mission
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Building India&apos;s legal clarity movement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
              &ldquo;Nyaya&rdquo; means justice. &ldquo;Setu&rdquo; means bridge.
              We connect every citizen to the legal knowledge they deserve —
              powered by AI, backed by verified resources.
            </p>
            <div className="mt-4 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
              Platform under active development · More features launching soon
            </div>
          </div>

          {/* Pillars */}
          <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-[1.02]"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  {p.icon}
                </div>
                <dt className="font-semibold text-white">{p.title}</dt>
                <dd className="mt-2 text-xs leading-relaxed text-white/60">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
