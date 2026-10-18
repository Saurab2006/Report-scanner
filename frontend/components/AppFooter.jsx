"use client";

import { useLang } from "@/components/LanguageContext";

export function AppFooter() {
  const { lang } = useLang();
  const isNe = lang === "ne";
  return <footer className="app-footer">
    <strong>SwasthaScan</strong>
    <span>{isNe ? "यो शैक्षिक जानकारी मात्र हो। योग्य स्वास्थ्यकर्मीसँग परामर्श गर्नुहोस्।" : "Educational information only. Consult a qualified healthcare professional."}</span>
  </footer>;
}
