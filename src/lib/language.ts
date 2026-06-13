export type Language = "en" | "hi";

export const translations: Record<string, Record<Language, string>> = {
  // Navigation
  home: { en: "Home", hi: "होम" },
  rights: { en: "Rights", hi: "अधिकार" },
  cases: { en: "Cases", hi: "मामले" },
  lawyers: { en: "Lawyers", hi: "वकील" },
  helplines: { en: "Helplines", hi: "हेल्पलाइन" },
  faq: { en: "FAQ", hi: "सामान्य प्रश्न" },
  contact: { en: "Contact", hi: "संपर्क" },
  login: { en: "Login", hi: "लॉगिन" },
  signup: { en: "Sign Up", hi: "साइन अप" },
  aiAssistant: { en: "AI Assistant", hi: "AI सहायक" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  logout: { en: "Logout", hi: "लॉगआउट" },
  profile: { en: "Profile", hi: "प्रोफाइल" },

  // Hero
  getStarted: { en: "Get Started Free", hi: "मुफ्त शुरू करें" },
  exploreRights: { en: "Explore Legal Areas", hi: "कानूनी क्षेत्र देखें" },
  tagline: { en: "Where Justice Meets Clarity", hi: "जहाँ न्याय मिलती है स्पष्टता से" },
  heroSubtitle: {
    en: "Navigate Indian law with confidence. AI-powered guidance, verified resources, and expert pathways — so you never face legal uncertainty alone.",
    hi: "विश्वास के साथ भारतीय कानून को समझें। AI-संचालित मार्गदर्शन, सत्यापित संसाधन, और विशेषज्ञ मार्ग — ताकि आप कभी भी अकेले कानूनी अनिश्चितता का सामना न करें।",
  },

  // Common UI
  search: { en: "Search...", hi: "खोजें..." },
  loading: { en: "Loading...", hi: "लोड हो रहा है..." },
  save: { en: "Save", hi: "सहेजें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  submit: { en: "Submit", hi: "जमा करें" },
  back: { en: "Back", hi: "वापस" },

  // Rights page
  knowYourRights: { en: "Know Your Rights", hi: "अपने अधिकार जानें" },
  rightsSubtitle: {
    en: "Every Indian citizen deserves to know their legal rights. Browse by category.",
    hi: "हर भारतीय नागरिक को अपने कानूनी अधिकार जानने का हक है। श्रेणी के अनुसार ब्राउज़ करें।",
  },

  // Helplines
  emergency: { en: "Emergency", hi: "आपातकाल" },
  callNow: { en: "Call Now", hi: "अभी कॉल करें" },
  requestCallback: { en: "Request Callback", hi: "कॉलबैक अनुरोध" },
  searchHelplines: { en: "Search helplines, numbers or category...", hi: "हेल्पलाइन, नंबर या श्रेणी खोजें..." },
  showingHelplines: { en: "Showing helplines", hi: "हेल्पलाइन दिखाई जा रही हैं" },
  noHelplineFound: { en: "No helplines found", hi: "कोई हेल्पलाइन नहीं मिली" },
  showAll: { en: "Show all", hi: "सभी दिखाएं" },
  urgent: { en: "Urgent", hi: "जरूरी" },

  // Chat
  chatPlaceholder: { en: "Ask your legal question in English or Hindi...", hi: "अपना कानूनी प्रश्न अंग्रेजी या हिंदी में पूछें..." },
  chatDisclaimer: {
    en: "AI responses are informational only and not legal advice. Consult a qualified advocate for your specific situation.",
    hi: "AI के उत्तर केवल सूचनात्मक हैं और कानूनी सलाह नहीं हैं। अपनी विशिष्ट स्थिति के लिए एक योग्य अधिवक्ता से परामर्श करें।",
  },

  // Cases
  viewDetails: { en: "View Details", hi: "विवरण देखें" },
  hideDetails: { en: "Hide Details", hi: "विवरण छुपाएं" },
  noResults: { en: "No results found", hi: "कोई परिणाम नहीं मिला" },

  // Lawyers
  lawyerNotice: {
    en: "Real lawyer data integration pending. Profiles shown are illustrative only.",
    hi: "वास्तविक वकील डेटा एकीकरण लंबित है। दिखाई गई प्रोफ़ाइलें केवल उदाहरण के लिए हैं।",
  },

  // Profile
  memberSince: { en: "Member since", hi: "सदस्य बने" },
  editProfile: { en: "Edit Profile", hi: "प्रोफाइल संपादित करें" },
  saveChanges: { en: "Save Changes", hi: "बदलाव सहेजें" },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("nyayasetu_lang") as Language) || "en";
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("nyayasetu_lang", lang);
}
