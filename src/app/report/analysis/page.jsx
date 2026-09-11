"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, CircleAlert, CircleHelp, HeartPulse } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

const statusContent = {
  high: { label: "HIGH", labelNe: "उच्च", className: "status high" },
  normal: { label: "NORMAL", labelNe: "सामान्य", className: "status normal" },
  low: { label: "LOW", labelNe: "कम", className: "status low" },
  needs_review: { label: "NEEDS REVIEW", labelNe: "समीक्षा आवश्यक", className: "status review" },
};

function ResultCard({ result, isNe }) {
  const display = statusContent[result.status] || statusContent.needs_review;

  return (
    <article className="result-card">
      <div className="result-top">
        <h2>{result.testName}</h2>
        <span className={display.className}>{isNe ? display.labelNe : display.label}</span>
      </div>
      <p className="result-value">
        {result.value} {result.unit && <span>{result.unit}</span>}
      </p>
      <p className="reference">
        {isNe ? "सन्दर्भ" : "Reference"}: <strong>{result.referenceRange || (isNe ? "फेला परेन" : "Not found")}</strong>
      </p>

      <div className="result-section">
        <h3>
          <CircleHelp size={18} />
          {isNe ? "यसको अर्थ के हो?" : "What does this mean?"}
        </h3>
        <p>{isNe ? result.explanationNe : result.explanationEn}</p>
      </div>

      <div className="result-section">
        <h3>
          <HeartPulse size={18} />
          {isNe ? "के गर्न सकिन्छ?" : "What can you do?"}
        </h3>
        <p>{isNe ? result.guidanceNe : result.guidanceEn}</p>
      </div>
    </article>
  );
}

export default function AnalysisPage() {
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";
  const [data] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = window.sessionStorage.getItem("reportscan_latest_analysis");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  if (!data) {
    return (
      <div className="page-shell">
        <section className="empty-state">
          <AlertCircle size={38} />
          <h1>{isNe ? "विश्लेषण भेटिएन" : "No Analysis Found"}</h1>
          <p>{isNe ? "कृपया रिपोर्ट स्क्यान वा अपलोड गर्नुहोस्।" : "Please scan or upload a report first."}</p>
          <Link href="/scan" className="primary-action compact">
            {isNe ? "रिपोर्ट स्क्यान गर्नुहोस्" : "Scan Report"}
          </Link>
        </section>
      </div>
    );
  }

  const counts = data.statusCounts || { high: 0, normal: 0, low: 0, needs_review: 0 };

  return (
    <div className="page-shell results-page">
      <Link href="/scan" className="back-link">
        <ArrowLeft size={18} />
        {isNe ? "स्क्यानमा फर्कनुहोस्" : "Back to Scan"}
      </Link>

      <section className="results-header">
        <div>
          <p className="eyebrow">{isNe ? "विश्लेषण परिणाम" : "Analysis Results"}</p>
          <h1>{data.reportName}</h1>
          <p>{isNe ? data.summaryNe : data.summaryEn}</p>
        </div>
        <div className="language-row compact-row">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            English
          </button>
          <span>|</span>
          <button className={lang === "ne" ? "active" : ""} onClick={() => setLang("ne")}>
            नेपाली
          </button>
        </div>
      </section>

      <section className="summary-strip" aria-label={isNe ? "सारांश" : "Summary"}>
        <span>🔴 {counts.high} {isNe ? "उच्च" : "High"}</span>
        <span>🟢 {counts.normal} {isNe ? "सामान्य" : "Normal"}</span>
        <span>🟡 {counts.low} {isNe ? "कम" : "Low"}</span>
        <span>⚪ {counts.needs_review} {isNe ? "समीक्षा" : "Needs Review"}</span>
      </section>

      <section className="result-list">
        {data.results.map((result) => (
          <ResultCard key={`${result.testName}-${result.value}`} result={result} isNe={isNe} />
        ))}
      </section>

      <section className="safety-box">
        <CircleAlert size={22} />
        <div>
          <h2>{isNe ? "महत्त्वपूर्ण स्वास्थ्य सूचना" : "Important Medical Disclaimer"}</h2>
          <p>
            {isNe
              ? "ReportScan ले शैक्षिक जानकारी मात्र दिन्छ। यसले रोग निदान गर्दैन, औषधि सिफारिस गर्दैन, र व्यावसायिक चिकित्सा सल्लाहको स्थान लिँदैन। असामान्य वा अस्पष्ट परिणामका लागि योग्य स्वास्थ्यकर्मीसँग परामर्श गर्नुहोस्।"
              : "ReportScan provides educational information only. It does not diagnose disease, prescribe medication, or replace professional medical advice. Consult a qualified healthcare professional for abnormal or unclear results."}
          </p>
        </div>
      </section>

      <Link href="/scan" className="secondary-action wide">
        <CheckCircle2 size={18} />
        {isNe ? "अर्को रिपोर्ट स्क्यान गर्नुहोस्" : "Scan Another Report"}
      </Link>
    </div>
  );
}
