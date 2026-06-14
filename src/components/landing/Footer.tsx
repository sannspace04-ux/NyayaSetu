import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Home",      href: "/" },
  { label: "Rights",    href: "/rights" },
  { label: "Cases",     href: "/cases" },
  { label: "Lawyers",   href: "/lawyers" },
  { label: "Helplines", href: "/helpline" },
  { label: "Contact",   href: "/contact" },
];

const platformLinks = [
  { label: "AI Legal Assistant", href: "/chat" },
  { label: "Case Library",       href: "/cases" },
  { label: "Know Your Rights",   href: "/rights" },
  { label: "Find a Lawyer",      href: "/lawyers" },
];

const accountLinks = [
  { label: "Login",     href: "/login" },
  { label: "Sign Up",   href: "/signup" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "FAQ",       href: "/faq" },
];

const emergencyNumbers = [
  { n: "112", l: "Emergency" },
  { n: "100", l: "Police" },
  { n: "1091", l: "Women" },
  { n: "1930", l: "Cyber" },
  { n: "1098", l: "Child" },
];

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{ background: "#040810", borderTop: "1px solid rgba(212,175,55,0.12)" }}
    >
      {/* Top glow line */}
      <div className="divider-gold" />

      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-0 blur-md transition-opacity group-hover:opacity-20" />
                <Image src="/logo.png" alt="Nyaya Setu" width={40} height={40} className="relative h-10 w-10 object-contain" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-white">
                  Nyaya<span className="text-[#D4AF37]">Setu</span>
                </p>
                <p className="text-xs text-[#6B8098]">Where Justice Meets Clarity</p>
              </div>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6B8098]">
              India&apos;s AI-powered legal companion. Verified resources, emergency support,
              and expert pathways for every citizen.
            </p>

            {/* Emergency strip */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                Emergency Numbers
              </p>
              <div className="flex flex-wrap gap-2">
                {emergencyNumbers.map((e) => (
                  <a
                    key={e.n}
                    href={`tel:${e.n}`}
                    className="group/e inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all hover:scale-105"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.22)",
                      color: "#D4AF37",
                    }}
                  >
                    <span className="text-white">{e.n}</span>
                    <span className="text-[#6B8098] font-normal">{e.l}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {["🇮🇳 Made for India", "⚖️ Legal-Tech", "🔒 Privacy-First"].map((b) => (
                <span
                  key={b}
                  className="rounded-full px-2.5 py-1 text-xs text-[#9EADC8]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#6B8098] transition-colors hover:text-[#D4AF37]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#6B8098] transition-colors hover:text-[#D4AF37]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
              Account
            </h3>
            <ul className="space-y-2.5">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#6B8098] transition-colors hover:text-[#D4AF37]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 pt-6 md:flex-row"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <p className="text-sm font-medium text-[#6B8098]">
            Made with{" "}
            <span className="text-red-400">❤️</span>
            {" "}by Team NyayaSetu
          </p>
          <p className="text-sm font-medium text-[#D4AF37]">
            © {new Date().getFullYear()} NyayaSetu. All Rights Reserved.
          </p>
          <p className="text-center text-xs text-[#4A5568] md:text-right">
            General legal information only — not legal advice. Consult a qualified advocate for your situation.
          </p>
        </div>
      </div>
    </footer>
  );
}
