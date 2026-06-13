// Testimonials section removed — no fabricated user reviews or fake success stories.
// This section is reserved for verified user feedback once the platform launches.

export default function Testimonials() {
  return (
    <section className="px-5 py-16 md:px-8 bg-surface">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border px-8 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-3xl">
            💬
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary">User Stories</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            This section will feature verified feedback from real users after the platform
            launches. We do not display fabricated testimonials.
          </p>
          <p className="mt-4 rounded-xl bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
            Platform under development · Be among the first to use Nyaya Setu
          </p>
          <a
            href="/signup"
            className="mt-5 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-light"
          >
            Create Free Account →
          </a>
        </div>
      </div>
    </section>
  );
}
