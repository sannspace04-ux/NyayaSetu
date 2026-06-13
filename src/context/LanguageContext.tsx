"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Language, getStoredLanguage, setStoredLanguage } from "@/lib/language";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    setLangState(getStoredLanguage());
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    setStoredLanguage(l);
  };

  const toggle = () => setLang(lang === "en" ? "hi" : "en");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
