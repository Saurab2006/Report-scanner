"use client";
import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  brand: { en: "SwasthaScan", ne: "स्वस्थास्क्यान" },
  tagline: { en: "Scan. Understand. Take Care.", ne: "रिपोर्ट बुझौँ, स्वास्थ्यको ख्याल गरौँ।" },
  nav_home: { en: "Home", ne: "गृह" },
  nav_scan: { en: "Scan Report", ne: "रिपोर्ट स्क्यान" },
  nav_reports: { en: "My Reports", ne: "मेरो रिपोर्ट" },
  nav_trends: { en: "Health Trends", ne: "स्वास्थ्य प्रवृत्ति" },
  nav_how: { en: "How It Works", ne: "यसरी काम गर्छ" },
  nav_about: { en: "About", ne: "हाम्रो बारेमा" },
  scan_now: { en: "Scan My Report", ne: "मेरो रिपोर्ट स्क्यान" },
  upload_report: { en: "Upload Report", ne: "रिपोर्ट अपलोड" },
  good_morning: { en: "Good Morning", ne: "शुभ प्रभात" },
  understand_health: { en: "Understand your health, one report at a time.", ne: "आफ्नो स्वास्थ्य बुझ्नुहोस्, एक पटकमा।" },
  reports_scanned: { en: "Reports Scanned", ne: "स्क्यान गरिएका रिपोर्ट" },
  normal_results: { en: "Normal Results", ne: "सामान्य परिणाम" },
  needs_attention: { en: "Needs Attention", ne: "ध्यान आवश्यक" },
  recent_report: { en: "Recent Report", ne: "भर्खरैको रिपोर्ट" },
  view_analysis: { en: "View Analysis →", ne: "विश्लेषण हेर्नुहोस् →" },
  ai_summary: { en: "AI Summary", ne: "AI सारांश" },
  security: { en: "Secure • Private • AI-Powered • English + नेपाली", ne: "सुरक्षित • निजी • AI-सञ्चालित • English + नेपाली" },
};

const LangContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k || "" });

export function LangProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("swash_lang");
      if (saved === "en" || saved === "ne") setLang(saved);
    } catch {}
  }, []);

  const set = (l) => {
    setLang(l);
    try { localStorage.setItem("swash_lang", l); } catch {}
  };

  const t = (k) => (translations[k] && translations[k][lang]) || (translations[k] && translations[k].en) || k;

  return <LangContext.Provider value={{ lang, setLang: set, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
