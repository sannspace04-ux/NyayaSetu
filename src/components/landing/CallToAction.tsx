import Link from "next/link";

export default function CallToAction() {
  return (
    <section
      className="relative overflow-hidden px-5 py-20 md:px-8"
      style={{ background: "linear-gradient(180deg, #0B1220 0%, #040810 100%)" }}
    >
      <div className="divider-gold absolute top-0 left-0 right-0" />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <span
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]"
          style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.07)" }}
        >
          Get Started
        </span>

        <h2 className="mt-5 font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Start Your Journey to<br />
          <span className="gold-text">Legal Clarity</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6B8098] md:text-lg">
          Create a free account to access AI legal guidance, explore your rights,
          and connect with verified legal resources — all in one place.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="btn-gold inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-sm font-bold tracking-wide"
            style={{ boxShadow: "0 0 26px rgba(212,175,55,0.35)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm font-semibold"
          >
            Login
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <p className="mt-6 text-xs text-[#4A5568]">
          Platform under active development · No credit card required · Free forever
        </p>

        {/* Decorative divider */}
        <div className="divider-gold mx-auto mt-14 w-48" />
      </div>
    </section>
  );
}
