"use client";

import Link from "next/link";
import { ScanLine } from "lucide-react";
import { useLang } from "./LanguageContext";

export function Navigation() {
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";

  return (
    <header className="app-header">
      <Link href="/" className="brand-link" aria-label="ReportScan home">
        <span className="brand-icon">
          <ScanLine size={20} />
        </span>
        <span>
          <strong>ReportScan</strong>
          <small>{isNe ? "मेडिकल रिपोर्ट स्क्यानर" : "Medical Report Scanner"}</small>
        </span>
      </Link>

      <nav className="header-actions" aria-label="Main navigation">
        <Link href="/scan" className="scan-link">
          {isNe ? "स्क्यान" : "Scan"}
        </Link>
        <div className="lang-toggle">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={lang === "ne" ? "active" : ""} onClick={() => setLang("ne")}>
            ने
          </button>
        </div>
      </nav>
    </header>
  );
}
