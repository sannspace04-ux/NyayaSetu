const legalAreas = [
  {
    icon: "🏠",
    title: "Property Disputes",
    description:
      "Understand ownership rights, partition suits, and land registration disputes with clear guidance.",
  },
  {
    icon: "💔",
    title: "Divorce & Alimony",
    description:
      "Navigate mutual consent, maintenance claims, and custody matters with step-by-step clarity.",
  },
  {
    icon: "🛡️",
    title: "Domestic Violence",
    description:
      "Know your protections under the DV Act, how to file complaints, and access immediate support.",
  },
  {
    icon: "⚠️",
    title: "False Cases",
    description:
      "Learn how to respond to wrongful accusations and protect your rights through proper legal channels.",
  },
  {
    icon: "🛒",
    title: "Consumer Rights",
    description:
      "Fight defective products, unfair trade practices, and service failures with consumer court remedies.",
  },
  {
    icon: "💻",
    title: "Cyber Crime",
    description:
      "Report online fraud, harassment, and data breaches — and understand cyber law protections in India.",
  },
];

function CarouselCard({
  icon,
  title,
  description,
}: (typeof legalAreas)[number]) {
  return (
    <article className="group w-72 shrink-0 rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:shadow-xl md:w-80">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-2xl transition-colors group-hover:bg-accent/15">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-4 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

export default function HowItWorks() {
  const doubled = [...legalAreas, ...legalAreas];

  return (
    <section id="legal-areas" className="overflow-hidden px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Legal Areas
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">
            Expert guidance across every legal domain
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            From property battles to cyber fraud — Nyaya Setu covers the legal
            challenges Indians face most.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24" />

          <div className="animate-marquee flex w-max gap-6">
            {doubled.map((area, index) => (
              <CarouselCard key={`${area.title}-${index}`} {...area} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
