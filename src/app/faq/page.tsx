"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

const faqs = [
  {
    category: "Platform",
    items: [
      { q: "What is Nyaya Setu?", a: "Nyaya Setu is India's premium legal-tech platform that bridges the gap between citizens and the law. We offer AI-powered legal guidance, a comprehensive case library, rights education, lawyer finder, and emergency helpline directory — all in one place." },
      { q: "Is Nyaya Setu free to use?", a: "Yes! Nyaya Setu offers a free tier that includes access to Know Your Rights, Case Library, Helplines, and basic AI chat. Premium features are available for users who need deeper assistance." },
      { q: "Is the information on Nyaya Setu legally accurate?", a: "All content on Nyaya Setu is researched and based on Indian statutory law, court judgments, and legal precedents. However, it provides general legal information — not formal legal advice. For specific cases, always consult a qualified advocate." },
      { q: "In which languages is Nyaya Setu available?", a: "Nyaya Setu currently supports English and Hindi. You can toggle between languages using the button in the navigation bar. We are working on adding more regional languages." },
    ],
  },
  {
    category: "AI Assistant",
    items: [
      { q: "How does the AI Legal Assistant work?", a: "Our AI assistant is powered by Google's Gemini model and trained on Indian legal context. You can ask questions in plain English or Hindi, and it provides structured, easy-to-understand guidance on legal topics." },
      { q: "Can the AI give me legal advice?", a: "The AI provides general legal information and guidance — not formal legal advice. For advice specific to your situation, please consult a qualified advocate. We always recommend professional counsel for serious matters." },
      { q: "What topics can I ask the AI about?", a: "You can ask about property disputes, divorce, alimony, child custody, domestic violence, false cases, consumer rights, cyber crime, workplace harassment, fundamental rights, and much more under Indian law." },
    ],
  },
  {
    category: "Lawyers",
    items: [
      { q: "Are the lawyers on the platform real?", a: "The Lawyer Finder currently shows illustrative sample profiles to demonstrate the feature design. Real verified lawyer listings require Bar Council API integration, which is under development. We are transparent about this on the Lawyers page." },
      { q: "When will real lawyer listings be available?", a: "We are working on partnering with Bar Council of India and state bar councils to provide verified lawyer listings. Register your interest on the Lawyers page to be notified when this feature launches." },
      { q: "How can I find a lawyer right now?", a: "For immediate legal help, you can contact NALSA at 15100 for free legal aid, or search for advocates on the Bar Council of India website (barcouncilofindia.org). Our AI assistant can also help you understand your situation before consulting a lawyer." },
    ],
  },
  {
    category: "Account & Privacy",
    items: [
      { q: "How is my personal data protected?", a: "Nyaya Setu uses industry-standard encryption and secure authentication (powered by Supabase). We never share your personal data with third parties without your explicit consent. See our Privacy Policy for details." },
      { q: "Can I delete my account?", a: "Yes, you can request account deletion from your Profile settings page. We will delete all your personal data within 30 days of the request." },
      { q: "Is my chat history private?", a: "Yes, your AI chat history is private and only accessible to you. We do not use your conversations for training AI models without your consent." },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={500} />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-12 md:px-8">
          {/* Hero */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Help Center</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Frequently Asked Questions</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Find answers to common questions about Nyaya Setu and how we can help you.
            </p>
          </div>

          {/* Search */}
          <div className="mb-10">
            <input
              type="text"
              placeholder="🔍  Search FAQ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface px-5 py-4 text-sm text-primary placeholder-muted shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* FAQ Sections */}
          {filtered.map((section) => (
            <div key={section.category} className="mb-8">
              <h2 className="mb-4 font-serif text-xl font-bold text-primary">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="font-medium text-primary pr-4">{item.q}</span>
                        <span className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-border bg-background px-5 py-4">
                          <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-4xl">🤔</p>
              <p className="mt-3 font-serif text-xl text-primary">No results found</p>
              <p className="mt-2 text-sm text-muted">Try a different search term.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-3xl bg-primary px-6 py-8 text-center text-white">
            <h3 className="font-serif text-xl font-bold">Still have questions?</h3>
            <p className="mt-2 text-sm text-white/70">Our AI assistant or team can help you.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/chat" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-accent-light">
                Ask AI Assistant
              </Link>
              <Link href="/contact" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
