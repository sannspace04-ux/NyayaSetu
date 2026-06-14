"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/language";
import MusicControl from "@/components/shared/MusicControl";

const navLinks = [
  { labelKey: "home",      href: "/" },
  { labelKey: "rights",    href: "/rights" },
  { labelKey: "cases",     href: "/cases" },
  { labelKey: "lawyers",   href: "/lawyers" },
  { labelKey: "helplines", href: "/helpline" },
  { labelKey: "faq",       href: "/faq" },
  { labelKey: "contact",   href: "/contact" },
];

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { lang, toggle } = useLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[rgba(212,175,55,0.15)] bg-[rgba(11,18,32,0.96)] shadow-[0_4px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8 md:py-4">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-0 blur-md transition-opacity group-hover:opacity-30" />
            <Image
              src="/logo.png"
              alt="Nyaya Setu"
              width={42}
              height={42}
              className="relative h-10 w-10 object-contain"
              priority
            />
          </div>
          <span className="font-serif text-lg font-bold text-white md:text-xl">
            Nyaya<span className="text-[#D4AF37]">Setu</span>
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────────── */}
        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#9EADC8] transition-colors hover:text-[#D4AF37]"
            >
              {t(link.labelKey, lang)}
            </Link>
          ))}
        </nav>

        {/* ── Desktop actions ───────────────────────────────────────────── */}
        <div className="hidden items-center gap-2 md:flex">
          {/* 🎵 Music control */}
          <MusicControl />

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="rounded-full border border-[rgba(212,175,55,0.3)] px-3 py-1.5 text-xs font-semibold text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)]"
            aria-label="Toggle language"
          >
            {lang === "en" ? "हिंदी" : "ENG"}
          </button>

          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-semibold text-[#9EADC8] transition-colors hover:text-white"
          >
            {t("login", lang)}
          </Link>
          <Link
            href="/signup"
            className="btn-gold rounded-full px-5 py-2 text-sm"
          >
            {t("signup", lang)}
          </Link>
        </div>

        {/* ── Mobile hamburger ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 xl:hidden">
          {/* Music control visible on mobile too */}
          <MusicControl />
          <button
            type="button"
            aria-label="Toggle menu"
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block h-0.5 w-6 bg-[#D4AF37] transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#D4AF37] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#D4AF37] transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="border-t border-[rgba(212,175,55,0.15)] bg-[#0B1220] px-5 py-5 xl:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#9EADC8] hover:text-[#D4AF37]"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.labelKey, lang)}
              </Link>
            ))}

            <div className="flex gap-3 pt-3 border-t border-[rgba(212,175,55,0.1)]">
              <button
                onClick={() => { toggle(); setMenuOpen(false); }}
                className="rounded-full border border-[rgba(212,175,55,0.3)] px-4 py-2 text-sm font-semibold text-[#D4AF37]"
              >
                {lang === "en" ? "हिंदी" : "ENG"}
              </button>
              <Link
                href="/login"
                className="flex-1 rounded-full border border-[rgba(255,255,255,0.1)] py-2 text-center text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                {t("login", lang)}
              </Link>
              <Link
                href="/signup"
                className="flex-1 btn-gold rounded-full py-2 text-center text-sm"
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
