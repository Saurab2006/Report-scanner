"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, CircleAlert, CircleHelp, Download, HeartPulse } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

const statusContent = {
  high: { label: "HIGH", labelNe: "उच्च", className: "status high" },
  normal: { label: "NORMAL", labelNe: "सामान्य", className: "status normal" },
  low: { label: "LOW", labelNe: "कम", className: "status low" },
  needs_review: { label: "NEEDS REVIEW", labelNe: "समीक्षा आवश्यक", className: "status review" },
  unknown: { label: "NEEDS REVIEW", labelNe: "समीक्षा आवश्यक", className: "status review" },
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
        {isNe ? "सन्दर्भ:" : "Reference:"} <strong>{result.referenceRange || (isNe ? "फेला परेन" : "Not found")}</strong>
      </p>

      <div className="result-section">
        <h3>
          <CircleHelp size={18} />
          {isNe ? "यसको अर्थ के हो?" : "What does this mean?"}
        </h3>
        <p>{result.explanation || (isNe ? "विस्तारित जानकारी उपलब्ध नाहे।" : "No additional details available.")}</p>
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
  const hasResults = (data.results || []).length > 0;

  return (
    <div className="page-shell results-page">
      <Link href="/scan" className="back-link">
        <ArrowLeft size={18} />
        {isNe ? "स्क्यानमा फर्कनुहोस्" : "Back to Scan"}
      </Link>

      <section className="results-header">
        <div>
          <p className="eyebrow">{isNe ? "विश्लेषण परिणाम" : "Analysis Results"}</p>
          <h1>{data.reportName || (isNe ? "मेडिकल रिपोर्ट" : "Medical Report")}</h1>
          <p>
            {data.summary ||
              (isNe
                ? "आपूर्तिकर्ता द्वारा विश्लेषण गरिएको"
                : "Analyzed by AI")}
          </p>
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

      {hasResults && (
        <section className="summary-strip" aria-label={isNe ? "सारांश" : "Summary"}>
          <span>
            🔴 {counts.high} {isNe ? "उच्च" : "High"}
          </span>
          <span>
            🟢 {counts.normal} {isNe ? "सामान्य" : "Normal"}
          </span>
          <span>
            🟡 {counts.low} {isNe ? "कम" : "Low"}
          </span>
          <span>
            ⚪ {counts.needs_review} {isNe ? "समीक्षा" : "Review"}
          </span>
        </section>
      )}

      <p className="database-note">
        {data.saved
          ? isNe
            ? `डाटाबेसमा सुरक्षित। रिपोर्ट ID: ${data.reportId}`
            : `Saved to database. Report ID: ${data.reportId}`
          : isNe
            ? "स्थानीय विश्लेषण - डाटाबेसमा सुरक्षित नाहे।"
            : "Local analysis - not saved to database."}
      </p>

      {data.reportSummary && (
        <article className="result-card">
          <h2>{isNe ? "विश्लेषण सारांश" : "Analysis Summary"}</h2>
          <p>{data.reportSummary}</p>
        </article>
      )}

      {hasResults ? (
        <section className="result-list">
          {data.results.map((result) => (
            <ResultCard key={`${result.testName}-${result.value}`} result={result} isNe={isNe} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <AlertCircle size={38} />
          <h2>{isNe ? "कोई परिणाम नहीं" : "No Results Found"}</h2>
          <p>
            {isNe
              ? "रिपोर्ट को पढ़ा नहीं जा सका। कृपया एक स्पष्ट तस्वीर अपलोड करें।"
              : "The report could not be read. Please upload a clearer image."}
          </p>
          <Link href="/scan" className="primary-action compact">
            {isNe ? "फिर से प्रयास करें" : "Try Again"}
          </Link>
        </section>
      )}

      {(data.abnormalFindings || []).length > 0 && (
        <article className="result-card">
          <h2>{isNe ? "असामान्य निष्कर्ष" : "Abnormal Findings"}</h2>
          <ul style={{ paddingLeft: "20px", margin: "12px 0 0" }}>
            {data.abnormalFindings.map((finding, idx) => (
              <li key={idx} style={{ margin: "6px 0", color: "var(--muted)" }}>
                {finding}
              </li>
            ))}
          </ul>
        </article>
      )}

      {(data.recommendations || []).length > 0 && (
        <article className="result-card">
          <h2>{isNe ? "सिफारिशें" : "Recommendations"}</h2>
          <ul style={{ paddingLeft: "20px", margin: "12px 0 0" }}>
            {data.recommendations.map((rec, idx) => (
              <li key={idx} style={{ margin: "6px 0", color: "var(--muted)" }}>
                {rec}
              </li>
            ))}
          </ul>
        </article>
      )}

      <section className="safety-box">
        <CircleAlert size={22} />
        <div>
          <h2>{isNe ? "महत्त्वपूर्ण स्वास्थ्य सूचना" : "Important Medical Disclaimer"}</h2>
          <p>
            {isNe
              ? "ReportScan शैक्षणिक जानकारी मात्र प्रदान करता है। यह किसी भी बीमारी का निदान नहीं करता, दवा नहीं देता, और न ही पेशेवर चिकित्सा सलाह का विकल्प है। किसी भी स्वास्थ्य संबंधी समस्या के लिए योग्य स्वास्थ्य सेवा प्रदानकर्ता से परामर्श लें।"
              : "ReportScan provides educational information only. It does not diagnose disease, prescribe medication, or replace professional medical advice. Always consult a qualified healthcare provider for medical concerns."}
          </p>
        </div>
      </section>

      <div className="button-row">
        <Link href="/scan" className="primary-action">
          <CheckCircle2 size={18} />
          {isNe ? "अर्को रिपोर्ट स्क्यान गर्नुहोस्" : "Scan Another Report"}
        </Link>
      </div>
    </div>
  );
}
