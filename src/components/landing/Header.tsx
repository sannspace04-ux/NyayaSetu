"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/language";

const navLinks = [
  { labelKey: "home", href: "/" },
  { labelKey: "rights", href: "/rights" },
  { labelKey: "cases", href: "/cases" },
  { labelKey: "lawyers", href: "/lawyers" },
  { labelKey: "helplines", href: "/helpline" },
  { labelKey: "faq", href: "/faq" },
  { labelKey: "contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-surface/95 shadow-sm backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Nyaya Setu"
            width={44}
            height={44}
            className="h-10 w-10 object-contain md:h-11 md:w-11"
            priority
          />
          <span className="font-serif text-lg font-bold text-primary md:text-xl">
            Nyaya Setu
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {t(link.labelKey, lang)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* Language Toggle */}
          <button
            onClick={toggle}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:border-accent hover:text-accent"
            aria-label="Toggle language"
          >
            {lang === "en" ? "हिंदी" : "ENG"}
          </button>
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            {t("login", lang)}
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg"
          >
            {t("signup", lang)}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 p-2 xl:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block h-0.5 w-6 bg-primary transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-primary transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-primary transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-surface px-5 py-4 xl:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.labelKey, lang)}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { toggle(); setMenuOpen(false); }}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary"
              >
                {lang === "en" ? "हिंदी" : "ENG"}
              </button>
              <Link
                href="/login"
                className="flex-1 rounded-full border border-border py-2 text-center text-sm font-semibold text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {t("login", lang)}
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-full bg-primary py-2 text-center text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                {t("signup", lang)}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
