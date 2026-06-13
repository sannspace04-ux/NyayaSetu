import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,42,91,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="animate-fade-up opacity-0">
          <Image
            src="/logo.png"
            alt="Nyaya Setu Logo"
            width={200}
            height={200}
            className="animate-float mx-auto h-32 w-32 object-contain md:h-44 md:w-44 lg:h-52 lg:w-52"
            priority
          />
        </div>

        <p className="animate-fade-up animate-delay-100 mt-6 opacity-0 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          India&apos;s Legal-Tech Platform · Under Development
        </p>

        <h1 className="animate-fade-up animate-delay-200 mt-4 max-w-4xl opacity-0 font-serif text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
          Where Justice Meets{" "}
          <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            Clarity
          </span>
        </h1>

        <p className="animate-fade-up animate-delay-300 mt-6 max-w-2xl opacity-0 text-base leading-relaxed text-muted md:text-lg">
          Navigate Indian law with confidence. Nyaya Setu combines AI-powered
          guidance, verified resources, and expert pathways — so you never face
          legal uncertainty alone.
        </p>

        <div className="animate-fade-up animate-delay-400 mt-10 flex flex-col gap-4 opacity-0 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-light hover:shadow-xl"
          >
            Get Started Free
          </Link>
          <a
            href="#legal-areas"
            className="rounded-full border border-border bg-surface px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            Explore Legal Areas
          </a>
        </div>
      </div>
    </section>
  );
}
