const legalAreas = [
  { icon: "🏠", title: "Property Disputes",  desc: "Ownership rights, partition suits, land registration disputes." },
  { icon: "💔", title: "Divorce & Alimony",  desc: "Mutual consent, maintenance claims, custody step-by-step." },
  { icon: "🛡️", title: "Domestic Violence", desc: "DV Act protections, filing complaints, immediate support." },
  { icon: "⚠️",  title: "False Cases",        desc: "Respond to wrongful accusations through legal channels." },
  { icon: "🛒", title: "Consumer Rights",     desc: "Defective products, unfair trade, consumer court remedies." },
  { icon: "💻", title: "Cyber Crime",         desc: "Online fraud, harassment, data breaches — cyber law India." },
  { icon: "👩", title: "Women's Rights",      desc: "POSH, DV Act, maternity benefits, dowry protection." },
  { icon: "👶", title: "Child Rights",        desc: "RTE, POCSO, child labour prohibition laws." },
];

function CarouselCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <article className="carousel-card group w-64 shrink-0 rounded-2xl p-5 md:w-72">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.15)" }}
      >
        {icon}
      </div>
      <h3 className="mt-3.5 text-sm font-bold text-white transition-colors group-hover:text-[#D4AF37]">
        {title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-[#6B8098]">{desc}</p>
      <div
        className="mt-3 h-px w-0 transition-all duration-300 group-hover:w-full"
        style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }}
      />
    </article>
  );
}

export default function HowItWorks() {
  const doubled = [...legalAreas, ...legalAreas];

  return (
    <section
      id="legal-areas"
      className="relative overflow-hidden px-5 py-20 md:px-8"
      style={{ background: "linear-gradient(180deg, #0F1A2E 0%, #0B1220 100%)" }}
    >
      <div className="divider-gold absolute top-0 left-0 right-0" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
            style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
          >
            Legal Areas
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
            Expert Guidance Across <span className="gold-text">Every Domain</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-[#6B8098]">
            From property battles to cyber fraud — NyayaSetu covers the challenges Indians face most.
          </p>
        </div>

        <div className="relative">
          {/* Edge fades */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-32"
            style={{ background: "linear-gradient(90deg, #0F1A2E, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-32"
            style={{ background: "linear-gradient(270deg, #0B1220, transparent)" }}
          />
          <div className="animate-marquee flex w-max gap-5">
            {doubled.map((area, i) => (
              <CarouselCard key={`${area.title}-${i}`} {...area} />
            ))}
          </div>
        </div>
      </div>

      <div className="divider-gold absolute bottom-0 left-0 right-0" />

      <style>{`
        .carousel-card {
          background: #111827;
          border: 1px solid rgba(212,175,55,0.14);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          cursor: default;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .carousel-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212,175,55,0.55);
          box-shadow: 0 0 18px rgba(212,175,55,0.12), 0 8px 28px rgba(0,0,0,0.45);
        }
      `}</style>
    </section>
  );
}
