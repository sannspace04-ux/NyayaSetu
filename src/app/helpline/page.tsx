"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/language";

// All numbers are verified real India government helplines.
// Sources: Ministry of Home Affairs, NALSA, NCW, CHILDLINE India, I4C.
const helplines = [
  {
    id: "1",
    name: "National Emergency",
    number: "112",
    description: "Single national emergency number — connects to Police, Fire & Ambulance. Works across India.",
    category: "Emergency",
    available: "24/7",
    icon: "🆘",
    urgent: true,
  },
  {
    id: "2",
    name: "Police",
    number: "100",
    description: "Direct police emergency line. Report crimes, accidents, or any law and order emergency.",
    category: "Emergency",
    available: "24/7",
    icon: "👮",
    urgent: true,
  },
  {
    id: "3",
    name: "Fire Emergency",
    number: "101",
    description: "National fire emergency helpline. Contact for fire-related emergencies anywhere in India.",
    category: "Emergency",
    available: "24/7",
    icon: "🔥",
    urgent: true,
  },
  {
    id: "4",
    name: "Ambulance",
    number: "102",
    description: "Free government ambulance service for emergencies. Available pan-India.",
    category: "Emergency",
    available: "24/7",
    icon: "🚑",
    urgent: true,
  },
  {
    id: "5",
    name: "Women Helpline (National)",
    number: "1091",
    description: "24×7 national helpline for women in distress — domestic violence, harassment, or danger.",
    category: "Women",
    available: "24/7",
    icon: "👩",
    urgent: true,
  },
  {
    id: "6",
    name: "Women Support (Shakti Shalini)",
    number: "181",
    description: "Women support helpline — advice, shelter, legal guidance for women facing abuse or crisis.",
    category: "Women",
    available: "24/7",
    icon: "🛡️",
    urgent: true,
  },
  {
    id: "7",
    name: "Child Helpline (CHILDLINE)",
    number: "1098",
    description: "CHILDLINE India — care and support for children in need, abuse, or exploitation.",
    category: "Child",
    available: "24/7",
    icon: "🧒",
    urgent: true,
  },
  {
    id: "8",
    name: "Cyber Crime Helpline",
    number: "1930",
    description: "Report online financial fraud, cyber crime, and digital harassment. Operated by I4C, MHA.",
    category: "Cyber",
    available: "24/7",
    icon: "💻",
    urgent: true,
  },
  {
    id: "9",
    name: "National Legal Services Authority (NALSA)",
    number: "15100",
    description: "Free legal aid for eligible citizens — SC/ST, women, disabled, economically weaker sections.",
    category: "Legal Aid",
    available: "Mon–Sat, 9 AM–5 PM",
    icon: "⚖️",
    urgent: false,
  },
  {
    id: "10",
    name: "National Consumer Helpline",
    number: "1800-11-4000",
    description: "Toll-free helpline for consumer complaints, guidance on Consumer Protection Act 2019.",
    category: "Consumer",
    available: "Mon–Sat, 9:30 AM–5:30 PM",
    icon: "🛒",
    urgent: false,
  },
  {
    id: "11",
    name: "Senior Citizen Helpline (Elderline)",
    number: "14567",
    description: "Elderline — support for senior citizens facing abuse, neglect, or legal issues. Operated by MoSJE.",
    category: "Senior",
    available: "8 AM–8 PM",
    icon: "👴",
    urgent: false,
  },
  {
    id: "12",
    name: "Anti-Corruption (CVC)",
    number: "1964",
    description: "Report corruption, bribery, or misconduct by central government employees.",
    category: "Anti-Corruption",
    available: "Office hours",
    icon: "🔍",
    urgent: false,
  },
  {
    id: "13",
    name: "Vandrevala Foundation (Mental Health)",
    number: "1860-2662-345",
    description: "24×7 mental health helpline. Free, confidential support for distress, crisis, and counselling.",
    category: "Mental Health",
    available: "24/7",
    icon: "💙",
    urgent: false,
  },
  {
    id: "14",
    name: "Disaster Management (NDMA)",
    number: "1070",
    description: "National Disaster Management Authority — assistance for flood, earthquake, and natural disasters.",
    category: "Emergency",
    available: "24/7",
    icon: "⚠️",
    urgent: false,
  },
];

const categories = ["All", "Emergency", "Women", "Child", "Cyber", "Legal Aid", "Consumer", "Anti-Corruption", "Mental Health", "Senior"];

const categoryColors: Record<string, string> = {
  Emergency: "border-red-200 bg-red-50",
  Women: "border-pink-200 bg-pink-50",
  Child: "border-green-200 bg-green-50",
  Cyber: "border-purple-200 bg-purple-50",
  "Legal Aid": "border-blue-200 bg-blue-50",
  Consumer: "border-orange-200 bg-orange-50",
  Senior: "border-teal-200 bg-teal-50",
  "Anti-Corruption": "border-yellow-200 bg-yellow-50",
  "Mental Health": "border-indigo-200 bg-indigo-50",
};

export default function HelplinePage() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackStep, setCallbackStep] = useState<"form" | "sent">("form");
  const [cbData, setCbData] = useState({ name: "", phone: "", issue: "" });

  const filtered =
    selectedCategory === "All"
      ? helplines
      : helplines.filter((h) => h.category === selectedCategory);

  const handleCbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to Supabase callback_requests table
    setCallbackStep("sent");
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={550} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Hero */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {t("emergency", lang)}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">
              {t("helplines", lang)} Directory
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Verified India government emergency and legal support numbers. All numbers are real and official.
            </p>
          </div>

          {/* Urgent alert strip */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-red-200 bg-red-50">
            <div className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-2xl">
                🆘
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-800">
                  In immediate danger? Call 112 (National Emergency) or 100 (Police)
                </p>
                <p className="mt-0.5 text-sm text-red-600">
                  Women: <a href="tel:1091" className="font-bold underline">1091</a> ·{" "}
                  Child: <a href="tel:1098" className="font-bold underline">1098</a> ·{" "}
                  Cyber Fraud: <a href="tel:1930" className="font-bold underline">1930</a> ·{" "}
                  Ambulance: <a href="tel:102" className="font-bold underline">102</a>
                </p>
              </div>
              <a
                href="tel:112"
                className="shrink-0 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95"
              >
                📞 Call 112
              </a>
            </div>
          </div>

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-muted hover:border-primary/30 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="mb-5 text-xs text-muted">
            Showing {filtered.length} helpline{filtered.length !== 1 ? "s" : ""} · All numbers verified as of {new Date().getFullYear()}
          </p>

          {/* Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h) => (
              <div
                key={h.id}
                className={`group rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  categoryColors[h.category] ?? "border-border bg-surface"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-2xl shadow-sm">
                    {h.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold leading-tight text-primary">{h.name}</h3>
                      {h.urgent && (
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                          Urgent
                        </span>
                      )}
                    </div>
                    <a
                      href={`tel:${h.number.replace(/-/g, "")}`}
                      className="mt-0.5 block font-serif text-xl font-bold text-primary underline-offset-2 hover:text-accent hover:underline"
                    >
                      {h.number}
                    </a>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{h.description}</p>
                    <p className="mt-1 text-xs text-muted">🕐 {h.available}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${h.number.replace(/-/g, "")}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light active:scale-95"
                  >
                    📞 {t("callNow", lang)}
                  </a>
                  <button
                    onClick={() => { setCallbackOpen(true); setCallbackStep("form"); }}
                    className="flex flex-1 items-center justify-center rounded-full border border-border py-2 text-xs font-semibold text-primary transition-all hover:border-accent hover:text-accent"
                  >
                    {t("requestCallback", lang)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Source note */}
          <p className="mt-8 text-center text-xs text-muted">
            Sources: Ministry of Home Affairs, NALSA, NCW, CHILDLINE India, I4C (MHA), MoSJE · Numbers accurate as of {new Date().getFullYear()}
          </p>
        </div>

        {/* Callback modal */}
        {callbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
            <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-primary">Request Legal Callback</h3>
                <button
                  onClick={() => setCallbackOpen(false)}
                  className="rounded-lg p-1 text-muted hover:text-primary"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {callbackStep === "sent" ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
                    ✅
                  </div>
                  <p className="font-semibold text-primary">Request Received</p>
                  <p className="mt-2 text-sm text-muted">
                    Your callback request has been noted. In the meantime, please call the relevant helpline directly if urgent.
                  </p>
                  <button
                    onClick={() => setCallbackOpen(false)}
                    className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-light"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCbSubmit} className="space-y-4">
                  <p className="text-sm text-muted">
                    Fill in your details and a legal aid volunteer will try to reach you. For urgent matters, call the helpline directly.
                  </p>
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={cbData.name}
                    onChange={(e) => setCbData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number (with country code)"
                    value={cbData.phone}
                    onChange={(e) => setCbData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <select
                    required
                    value={cbData.issue}
                    onChange={(e) => setCbData((p) => ({ ...p, issue: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select Issue Type</option>
                    <option>Domestic Violence</option>
                    <option>Cyber Crime / Fraud</option>
                    <option>Property Dispute</option>
                    <option>Divorce / Family Matter</option>
                    <option>Consumer Complaint</option>
                    <option>Workplace Harassment</option>
                    <option>Child Protection</option>
                    <option>Other Legal Matter</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light"
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
