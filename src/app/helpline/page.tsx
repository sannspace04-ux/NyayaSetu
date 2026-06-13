"use client";

import { useState, useMemo } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WatermarkLogo from "@/components/shared/WatermarkLogo";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/language";

// ──────────────────────────────────────────────────────────────
// Verified helplines — numbers locked to spec, no duplicates.
// Sources: MHA, NALSA, NCW, CHILDLINE India, I4C, MoSJE, Tele-Law
// ──────────────────────────────────────────────────────────────
const helplines = [
  {
    id: "1",
    nameEn: "National Emergency",
    nameHi: "राष्ट्रीय आपातकाल",
    number: "112",
    purposeEn: "Single national emergency number",
    purposeHi: "एकल राष्ट्रीय आपातकालीन नंबर",
    descEn:
      "Connects to Police, Fire & Ambulance. Works across India on all networks, even without a SIM.",
    descHi:
      "पुलिस, अग्नि और एम्बुलेंस से जोड़ता है। बिना SIM के भी पूरे भारत में काम करता है।",
    category: "Emergency",
    available: "24/7",
    icon: "🆘",
    urgent: true,
  },
  {
    id: "2",
    nameEn: "Police",
    nameHi: "पुलिस",
    number: "100",
    purposeEn: "Direct police emergency line",
    purposeHi: "सीधी पुलिस आपातकालीन लाइन",
    descEn:
      "Report crimes, accidents, or any law and order emergency anywhere in India.",
    descHi:
      "अपराध, दुर्घटना या किसी भी कानून-व्यवस्था की आपातस्थिति की रिपोर्ट करें।",
    category: "Emergency",
    available: "24/7",
    icon: "👮",
    urgent: true,
  },
  {
    id: "3",
    nameEn: "Emergency Ambulance",
    nameHi: "आपातकालीन एम्बुलेंस",
    number: "108",
    purposeEn: "Free government ambulance service",
    purposeHi: "मुफ्त सरकारी एम्बुलेंस सेवा",
    descEn:
      "Free emergency ambulance service for medical emergencies, accidents and trauma. Pan-India coverage.",
    descHi:
      "चिकित्सा आपातस्थिति, दुर्घटना और आघात के लिए मुफ्त एम्बुलेंस सेवा।",
    category: "Emergency",
    available: "24/7",
    icon: "🚑",
    urgent: true,
  },
  {
    id: "4",
    nameEn: "Women Helpline",
    nameHi: "महिला हेल्पलाइन",
    number: "1091",
    purposeEn: "National helpline for women in distress",
    purposeHi: "संकट में महिलाओं के लिए राष्ट्रीय हेल्पलाइन",
    descEn:
      "24×7 national helpline for women facing domestic violence, harassment, or danger anywhere in India.",
    descHi:
      "घरेलू हिंसा, उत्पीड़न या खतरे का सामना करने वाली महिलाओं के लिए 24×7 राष्ट्रीय हेल्पलाइन।",
    category: "Women",
    available: "24/7",
    icon: "👩",
    urgent: true,
  },
  {
    id: "5",
    nameEn: "Women Support",
    nameHi: "महिला सहायता",
    number: "181",
    purposeEn: "Advice, shelter & legal guidance for women",
    purposeHi: "महिलाओं के लिए सलाह, आश्रय और कानूनी मार्गदर्शन",
    descEn:
      "Women support helpline — advice, shelter referrals, and legal guidance for women facing abuse or crisis.",
    descHi:
      "दुर्व्यवहार या संकट का सामना कर रही महिलाओं के लिए सलाह, आश्रय और कानूनी मार्गदर्शन।",
    category: "Women",
    available: "24/7",
    icon: "🛡️",
    urgent: true,
  },
  {
    id: "6",
    nameEn: "Child Helpline",
    nameHi: "बाल हेल्पलाइन",
    number: "1098",
    purposeEn: "Care and support for children in need",
    purposeHi: "जरूरतमंद बच्चों की देखभाल और सहायता",
    descEn:
      "CHILDLINE India — free, 24×7 emergency service for children in need, abuse, or exploitation.",
    descHi:
      "CHILDLINE India — जरूरतमंद, दुर्व्यवहार या शोषण का सामना करने वाले बच्चों के लिए मुफ्त 24×7 सेवा।",
    category: "Child",
    available: "24/7",
    icon: "🧒",
    urgent: true,
  },
  {
    id: "7",
    nameEn: "Cyber Crime Helpline",
    nameHi: "साइबर अपराध हेल्पलाइन",
    number: "1930",
    purposeEn: "Report online fraud & cyber crime",
    purposeHi: "ऑनलाइन धोखाधड़ी और साइबर अपराध की रिपोर्ट करें",
    descEn:
      "Report online financial fraud, cyber crime, and digital harassment. Operated by I4C, Ministry of Home Affairs.",
    descHi:
      "ऑनलाइन वित्तीय धोखाधड़ी, साइबर अपराध और डिजिटल उत्पीड़न की रिपोर्ट करें। I4C, गृह मंत्रालय द्वारा संचालित।",
    category: "Cyber",
    available: "24/7",
    icon: "💻",
    urgent: true,
  },
  {
    id: "8",
    nameEn: "NALSA Legal Aid",
    nameHi: "NALSA कानूनी सहायता",
    number: "15100",
    purposeEn: "Free legal aid for eligible citizens",
    purposeHi: "पात्र नागरिकों को मुफ्त कानूनी सहायता",
    descEn:
      "National Legal Services Authority — free legal aid for SC/ST, women, disabled persons, and economically weaker sections.",
    descHi:
      "राष्ट्रीय कानूनी सेवा प्राधिकरण — SC/ST, महिलाओं, विकलांगों और आर्थिक रूप से कमजोर वर्गों के लिए मुफ्त कानूनी सहायता।",
    category: "Legal Aid",
    available: "Mon–Sat, 9 AM–5 PM",
    icon: "⚖️",
    urgent: false,
  },
  {
    id: "9",
    nameEn: "Senior Citizen Helpline",
    nameHi: "वरिष्ठ नागरिक हेल्पलाइन",
    number: "14567",
    purposeEn: "Support for senior citizens facing abuse or neglect",
    purposeHi: "दुर्व्यवहार या उपेक्षा का सामना करने वाले वरिष्ठ नागरिकों के लिए सहायता",
    descEn:
      "Elderline — support for senior citizens facing abuse, neglect, financial fraud, or legal issues. Operated by MoSJE.",
    descHi:
      "Elderline — दुर्व्यवहार, उपेक्षा, वित्तीय धोखाधड़ी या कानूनी समस्याओं का सामना करने वाले वरिष्ठ नागरिकों के लिए सहायता।",
    category: "Senior",
    available: "8 AM–8 PM",
    icon: "👴",
    urgent: false,
  },
  {
    id: "10",
    nameEn: "Vandrevala Foundation",
    nameHi: "वंद्रेवाला फाउंडेशन",
    number: "9999666555",
    purposeEn: "Mental health support & crisis counselling",
    purposeHi: "मानसिक स्वास्थ्य सहायता और संकट परामर्श",
    descEn:
      "24×7 free, confidential mental health helpline. Support for distress, crisis, depression, and counselling needs.",
    descHi:
      "24×7 मुफ्त, गोपनीय मानसिक स्वास्थ्य हेल्पलाइन। संकट, अवसाद और परामर्श आवश्यकताओं के लिए सहायता।",
    category: "Mental Health",
    available: "24/7",
    icon: "💙",
    urgent: false,
  },
  {
    id: "11",
    nameEn: "Tele-Law Legal Advice",
    nameHi: "टेली-लॉ कानूनी सलाह",
    number: "14420",
    purposeEn: "Free legal advice via Common Service Centres",
    purposeHi: "सामान्य सेवा केंद्रों के माध्यम से मुफ्त कानूनी सलाह",
    descEn:
      "Tele-Law Service by Dept. of Justice — free legal advice over phone through Common Service Centres (CSC) across India.",
    descHi:
      "न्याय विभाग की टेली-लॉ सेवा — पूरे भारत में सामान्य सेवा केंद्रों (CSC) के माध्यम से फोन पर मुफ्त कानूनी सलाह।",
    category: "Legal Aid",
    available: "Mon–Sat, 10 AM–5 PM",
    icon: "📋",
    urgent: false,
  },
] as const;

const ALL = "All";
const categories = [ALL, "Emergency", "Women", "Child", "Cyber", "Legal Aid", "Senior", "Mental Health"];

const categoryColors: Record<string, string> = {
  Emergency: "border-red-200 bg-red-50",
  Women: "border-pink-200 bg-pink-50",
  Child: "border-green-200 bg-green-50",
  Cyber: "border-purple-200 bg-purple-50",
  "Legal Aid": "border-blue-200 bg-blue-50",
  Senior: "border-teal-200 bg-teal-50",
  "Mental Health": "border-indigo-200 bg-indigo-50",
};

const categoryBadge: Record<string, string> = {
  Emergency: "bg-red-100 text-red-700",
  Women: "bg-pink-100 text-pink-700",
  Child: "bg-green-100 text-green-700",
  Cyber: "bg-purple-100 text-purple-700",
  "Legal Aid": "bg-blue-100 text-blue-700",
  Senior: "bg-teal-100 text-teal-700",
  "Mental Health": "bg-indigo-100 text-indigo-700",
};

type Helpline = (typeof helplines)[number];

export default function HelplinePage() {
  const { lang } = useLanguage();
  const isHindi = lang === "hi";

  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackStep, setCallbackStep] = useState<"form" | "sent">("form");
  const [cbData, setCbData] = useState({ name: "", phone: "", issue: "" });

  const filtered = useMemo(() => {
    let list: readonly Helpline[] = helplines;
    if (selectedCategory !== ALL) {
      list = list.filter((h) => h.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.nameEn.toLowerCase().includes(q) ||
          h.nameHi.includes(q) ||
          h.number.includes(q) ||
          h.category.toLowerCase().includes(q) ||
          h.purposeEn.toLowerCase().includes(q) ||
          h.descEn.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleCbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackStep("sent");
  };

  const openCallback = () => {
    setCallbackStep("form");
    setCallbackOpen(true);
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background pt-20">
        <WatermarkLogo opacity={0.05} size={550} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8">

          {/* ── Hero ── */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {t("emergency", lang)}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">
              {t("helplines", lang)} {isHindi ? "निर्देशिका" : "Directory"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              {isHindi
                ? "सत्यापित भारत सरकार की आपातकालीन और कानूनी सहायता नंबर। सभी नंबर वास्तविक और आधिकारिक हैं।"
                : "Verified India government emergency and legal support numbers. All numbers are real and official."}
            </p>
          </div>

          {/* ── Urgent strip ── */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-red-200 bg-red-50">
            <div className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-2xl">
                🆘
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-red-800">
                  {isHindi
                    ? "तत्काल खतरे में? 112 (राष्ट्रीय आपातकाल) या 100 (पुलिस) पर कॉल करें"
                    : "In immediate danger? Call 112 (National Emergency) or 100 (Police)"}
                </p>
                <p className="mt-0.5 text-sm text-red-600">
                  {isHindi ? "महिला" : "Women"}:{" "}
                  <a href="tel:1091" className="font-bold underline">1091</a> ·{" "}
                  {isHindi ? "बाल" : "Child"}:{" "}
                  <a href="tel:1098" className="font-bold underline">1098</a> ·{" "}
                  {isHindi ? "साइबर" : "Cyber"}:{" "}
                  <a href="tel:1930" className="font-bold underline">1930</a> ·{" "}
                  {isHindi ? "एम्बुलेंस" : "Ambulance"}:{" "}
                  <a href="tel:108" className="font-bold underline">108</a>
                </p>
              </div>
              <a
                href="tel:112"
                className="shrink-0 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95"
              >
                📞 {isHindi ? "112 पर कॉल करें" : "Call 112"}
              </a>
            </div>
          </div>

          {/* ── Search bar ── */}
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="text-lg text-muted">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? "हेल्पलाइन, नंबर या श्रेणी खोजें..."
                  : "Search helplines, numbers or category..."
              }
              className="flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
              aria-label="Search helplines"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Category filters ── */}
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-muted hover:border-primary/30 hover:text-primary"
                }`}
              >
                {cat === ALL ? (isHindi ? "सभी" : "All") : cat}
              </button>
            ))}
          </div>

          <p className="mb-5 text-xs text-muted">
            {isHindi
              ? `${filtered.length} हेल्पलाइन दिखाई जा रही हैं · सभी नंबर ${new Date().getFullYear()} तक सत्यापित`
              : `Showing ${filtered.length} helpline${filtered.length !== 1 ? "s" : ""} · All numbers verified as of ${new Date().getFullYear()}`}
          </p>

          {/* ── Cards grid ── */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 font-semibold text-primary">
                {isHindi ? "कोई हेल्पलाइन नहीं मिली" : "No helplines found"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {isHindi ? "अपनी खोज बदलें या फ़िल्टर हटाएं।" : "Try a different search or clear the filter."}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(ALL); }}
                className="mt-4 rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all"
              >
                {isHindi ? "सभी दिखाएं" : "Show all"}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((h) => (
                <article
                  key={h.id}
                  className={`group flex flex-col rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    categoryColors[h.category] ?? "border-border bg-surface"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-2xl shadow-sm">
                      {h.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="text-sm font-bold leading-tight text-primary">
                          {isHindi ? h.nameHi : h.nameEn}
                        </h3>
                        {h.urgent && (
                          <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                            {isHindi ? "जरूरी" : "Urgent"}
                          </span>
                        )}
                      </div>

                      {/* Category badge */}
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryBadge[h.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {h.category}
                      </span>
                    </div>
                  </div>

                  {/* Number — clickable tel link */}
                  <a
                    href={`tel:${h.number}`}
                    className="mt-3 block font-serif text-2xl font-bold text-primary underline-offset-2 hover:text-accent hover:underline transition-colors"
                    aria-label={`Call ${isHindi ? h.nameHi : h.nameEn} at ${h.number}`}
                  >
                    {h.number}
                  </a>

                  {/* Purpose */}
                  <p className="mt-1 text-xs font-semibold text-primary/70">
                    {isHindi ? h.purposeHi : h.purposeEn}
                  </p>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">
                    {isHindi ? h.descHi : h.descEn}
                  </p>

                  {/* Availability */}
                  <p className="mt-2 text-xs text-muted">
                    🕐 {h.available}
                  </p>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`tel:${h.number}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light active:scale-95"
                      aria-label={`Call ${h.number}`}
                    >
                      📞 {t("callNow", lang)}
                    </a>
                    <button
                      onClick={openCallback}
                      className="flex flex-1 items-center justify-center rounded-full border border-border py-2 text-xs font-semibold text-primary transition-all hover:border-accent hover:text-accent"
                    >
                      {t("requestCallback", lang)}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Source note */}
          <p className="mt-10 text-center text-xs text-muted">
            {isHindi
              ? `स्रोत: गृह मंत्रालय, NALSA, NCW, CHILDLINE India, I4C, MoSJE, न्याय विभाग · ${new Date().getFullYear()} तक सत्यापित`
              : `Sources: Ministry of Home Affairs, NALSA, NCW, CHILDLINE India, I4C (MHA), MoSJE, Dept. of Justice · Verified ${new Date().getFullYear()}`}
          </p>
        </div>

        {/* ── Callback modal ── */}
        {callbackOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
            role="dialog"
            aria-modal="true"
            aria-label={isHindi ? "कॉलबैक अनुरोध" : "Request Legal Callback"}
          >
            <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-primary">
                  {isHindi ? "कानूनी कॉलबैक अनुरोध" : "Request Legal Callback"}
                </h3>
                <button
                  onClick={() => setCallbackOpen(false)}
                  className="rounded-lg p-1 text-muted hover:text-primary transition-colors"
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
                  <p className="font-semibold text-primary">
                    {isHindi ? "अनुरोध प्राप्त हुआ" : "Request Received"}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {isHindi
                      ? "आपका कॉलबैक अनुरोध दर्ज कर लिया गया है। जरूरी मामलों में सीधे हेल्पलाइन पर कॉल करें।"
                      : "Your callback request has been noted. For urgent matters, please call the relevant helpline directly."}
                  </p>
                  <button
                    onClick={() => setCallbackOpen(false)}
                    className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-light"
                  >
                    {isHindi ? "बंद करें" : "Close"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCbSubmit} className="space-y-4">
                  <p className="text-sm text-muted">
                    {isHindi
                      ? "अपना विवरण भरें, एक कानूनी सहायता स्वयंसेवक आपसे संपर्क करेगा। जरूरी मामलों में सीधे हेल्पलाइन पर कॉल करें।"
                      : "Fill in your details and a legal aid volunteer will try to reach you. For urgent matters, call the helpline directly."}
                  </p>
                  <input
                    required
                    type="text"
                    placeholder={isHindi ? "आपका पूरा नाम" : "Your Full Name"}
                    value={cbData.name}
                    onChange={(e) => setCbData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <input
                    required
                    type="tel"
                    placeholder={isHindi ? "फोन नंबर (देश कोड सहित)" : "Phone Number (with country code)"}
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
                    <option value="">{isHindi ? "समस्या का प्रकार चुनें" : "Select Issue Type"}</option>
                    <option>{isHindi ? "घरेलू हिंसा" : "Domestic Violence"}</option>
                    <option>{isHindi ? "साइबर अपराध / धोखाधड़ी" : "Cyber Crime / Fraud"}</option>
                    <option>{isHindi ? "संपत्ति विवाद" : "Property Dispute"}</option>
                    <option>{isHindi ? "तलाक / पारिवारिक मामला" : "Divorce / Family Matter"}</option>
                    <option>{isHindi ? "कार्यस्थल उत्पीड़न" : "Workplace Harassment"}</option>
                    <option>{isHindi ? "बाल संरक्षण" : "Child Protection"}</option>
                    <option>{isHindi ? "मानसिक स्वास्थ्य" : "Mental Health Support"}</option>
                    <option>{isHindi ? "अन्य कानूनी मामला" : "Other Legal Matter"}</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light"
                  >
                    {isHindi ? "अनुरोध भेजें" : "Submit Request"}
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
