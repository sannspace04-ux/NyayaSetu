import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center md:px-14 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,164,93,0.15),transparent_60%)]" />

          <div className="relative">
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Start your journey to legal clarity
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Create a free account to access AI legal guidance, explore your rights,
              and connect with legal resources — all in one place.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Login
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/40">
              Platform under active development. Features are being expanded continuously.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
