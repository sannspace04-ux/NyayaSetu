"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

// Sample lawyer profiles — clearly marked as illustrative examples.
// Real lawyer data integration is pending verified API partnership.
const SAMPLE_NOTICE = "These profiles are illustrative samples to demonstrate the lawyer finder feature. Real verified lawyer listings require Bar Council API integration, which is pending. Do not contact these sample entries.";

type SampleLawyer = {
  id: string;
  initials: string;
  name: string;
  specialization: string;
  city: string;
  experience: string;
  languages: string[];
  bio: string;
  isSample: true;
};

const sampleLawyers: SampleLawyer[] = [
  {
    id: "s1", initials: "—", name: "Sample Advocate — Delhi",
    specialization: "Family Law", city: "Delhi", experience: "10+ years",
    languages: ["Hindi", "English"],
    bio: "Handles divorce, alimony, child custody, and domestic violence cases in Delhi Family Courts.",
    isSample: true,
  },
  {
    id: "s2", initials: "—", name: "Sample Advocate — Mumbai",
    specialization: "Property Law", city: "Mumbai", experience: "15+ years",
    languages: ["Hindi", "English", "Marathi"],
    bio: "Property disputes, RERA matters, title documents, land registration in Maharashtra courts.",
    isSample: true,
  },
  {
    id: "s3", initials: "—", name: "Sample Advocate — Bengaluru",
    specialization: "Criminal Law", city: "Bengaluru", experience: "12+ years",
    languages: ["Kannada", "Hindi", "English"],
    bio: "Bail applications, anticipatory bail, High Court matters, and false case defence.",
    isSample: true,
  },
  {
    id: "s4", initials: "—", name: "Sample Advocate — Hyderabad",
    specialization: "Cyber Law", city: "Hyderabad", experience: "7+ years",
    languages: ["Telugu", "English"],
    bio: "IT Act cases, online fraud, cyber crime FIR assistance, data privacy disputes.",
    isSample: true,
  },
  {
    id: "s5", initials: "—", name: "Sample Advocate — Chennai",
    specialization: "Consumer Law", city: "Chennai", experience: "9+ years",
    languages: ["Tamil", "English"],
    bio: "Consumer forum complaints, deficiency in service, unfair trade practice cases.",
    isSample: true,
  },
  {
    id: "s6", initials: "—", name: "Sample Advocate — Pune",
    specialization: "Labour Law", city: "Pune", experience: "11+ years",
    languages: ["Marathi", "Hindi", "English"],
    bio: "Workplace harassment, wrongful termination, labour tribunal proceedings.",
    isSample: true,
  },
];

const cities = ["All Cities", "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Pune"];
const specs = [
  "All Areas", "Family Law", "Property Law", "Criminal Law",
  "Cyber Law", "Consumer Law", "Labour Law", "Divorce", "Corporate Law",
];

export default function LawyersPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSpec, setSelectedSpec] = useState("All Areas");
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);

  const filtered = sampleLawyers.filter((l) => {
    const matchCity = selectedCity === "All Cities" || l.city === selectedCity;
    const matchSpec = selectedSpec === "All Areas" || l.specialization === selectedSpec;
    const matchSearch = !search ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.specialization.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSpec && matchSearch;
  });

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={550} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Hero */}
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Legal Network</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Find a Lawyer</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Search legal professionals by city, specialization, or legal area.
            </p>
          </div>

          {/* Integration notice */}
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-xl">🔧</span>
              <div>
                <p className="font-semibold text-amber-800">Real lawyer data integration pending</p>
                <p className="mt-1 text-sm text-amber-700">{SAMPLE_NOTICE}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <input
              type="text"
              placeholder="🔍  Search by city or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">Filter by City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-primary outline-none focus:border-primary"
                >
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">Filter by Specialization</label>
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-primary outline-none focus:border-primary"
                >
                  {specs.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <p className="mb-5 text-sm text-muted">
            Showing {filtered.length} illustrative sample{filtered.length !== 1 ? "s" : ""} · Real data coming soon
          </p>

          {/* Sample lawyer cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((lawyer) => (
              <div
                key={lawyer.id}
                className="relative rounded-2xl border border-border bg-surface shadow-sm overflow-hidden card-hover"
              >
                {/* Sample badge */}
                <div className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  Sample
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-serif text-sm font-bold text-primary">
                      ⚖️
                    </div>
                    <div className="flex-1 min-w-0 pr-16">
                      <h3 className="font-serif text-lg font-bold text-primary">{lawyer.name}</h3>
                      <p className="text-sm font-medium text-accent">{lawyer.specialization}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                        <span>📍 {lawyer.city}</span>
                        <span>⚖️ {lawyer.experience}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted">{lawyer.bio}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lawyer.languages.map((lang) => (
                      <span key={lang} className="rounded-full bg-primary/5 px-2.5 py-0.5 text-xs text-primary">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-border px-6 py-4">
                  <button
                    onClick={() => setCallbackOpen(true)}
                    className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light"
                  >
                    Register Interest
                  </button>
                  <span className="text-xs text-muted">Real listings coming soon</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-4xl">⚖️</p>
              <p className="mt-3 font-serif text-xl text-primary">No matching samples</p>
              <p className="mt-2 text-sm text-muted">Try different filters.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCity("All Cities"); setSelectedSpec("All Areas"); }}
                className="mt-4 rounded-full border border-border px-5 py-2 text-sm text-muted hover:text-primary"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Callback modal */}
          {callbackOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
              <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-primary">Register Your Interest</h3>
                  <button onClick={() => { setCallbackOpen(false); setCallbackSent(false); }} className="text-muted hover:text-primary">✕</button>
                </div>

                {callbackSent ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">✅</div>
                    <p className="font-semibold text-primary">Interest Registered</p>
                    <p className="mt-2 text-sm text-muted">We will notify you when verified lawyer listings are live.</p>
                    <button
                      onClick={() => { setCallbackOpen(false); setCallbackSent(false); }}
                      className="mt-5 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted">
                      Real verified lawyer listings are coming soon. Leave your details and we will notify you when available.
                    </p>
                    <input type="text" placeholder="Your Name" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    <select className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                      <option>Select Legal Issue Type</option>
                      <option>Divorce / Family</option>
                      <option>Property Dispute</option>
                      <option>Criminal / False Case</option>
                      <option>Consumer Complaint</option>
                      <option>Cyber Crime</option>
                      <option>Workplace Harassment</option>
                      <option>Other</option>
                    </select>
                    <button
                      onClick={() => setCallbackSent(true)}
                      className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light"
                    >
                      Notify Me When Live
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
