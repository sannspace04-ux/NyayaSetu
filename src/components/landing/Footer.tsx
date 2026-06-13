import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Know Your Rights", href: "/rights" },
    { label: "Case Library", href: "/cases" },
    { label: "Find a Lawyer", href: "/lawyers" },
    { label: "AI Legal Assistant", href: "/chat" },
  ],
  Support: [
    { label: "Helplines", href: "/helpline" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  Account: [
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Nyaya Setu"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="font-serif text-lg font-bold text-primary">Nyaya Setu</p>
                <p className="text-xs text-muted">Where Justice Meets Clarity</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted max-w-xs">
              India&apos;s premium legal-tech platform. AI-powered guidance, verified resources, 
              and expert pathways for every citizen.
            </p>
            <div className="mt-5 flex gap-3">
              <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                🇮🇳 Made for India
              </span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                ⚖️ Legal-Tech
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                {section}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Nyaya Setu. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            This platform provides general legal information, not legal advice. Consult a qualified advocate for specific matters.
          </p>
        </div>
      </div>
    </footer>
  );
}
