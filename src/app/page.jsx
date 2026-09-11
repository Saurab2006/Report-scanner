"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, FileText, ShieldCheck } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function HomePage() {
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";

  return (
    <div className="page-shell">
      <section className="hero">
        <div className="logo-frame">
          <Image
            src="/swastha-scan-logo.png"
            alt="Swastha Scan logo"
            width={180}
            height={180}
            priority
          />
        </div>

        <p className="eyebrow">English + नेपाली</p>
        <h1>ReportScan</h1>
        <h2>{isNe ? "तपाईंको मेडिकल रिपोर्ट सजिलै बुझ्नुहोस्" : "Understand Your Medical Report"}</h2>
        <p className="hero-copy">
          {isNe
            ? "आफ्नो रिपोर्ट अपलोड गर्नुहोस् र के HIGH, NORMAL वा LOW छ भनेर सरल भाषामा हेर्नुहोस्।"
            : "Upload your report and see what's HIGH, NORMAL, or LOW."}
        </p>

        <Link href="/scan" className="primary-action">
          <Camera size={22} />
          {isNe ? "रिपोर्ट स्क्यान / अपलोड" : "Scan / Upload Report"}
        </Link>

        <div className="language-row" aria-label="Language">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            English
          </button>
          <span>|</span>
          <button className={lang === "ne" ? "active" : ""} onClick={() => setLang("ne")}>
            नेपाली
          </button>
        </div>
      </section>

      <section className="info-list" aria-label={isNe ? "विशेषताहरू" : "Features"}>
        <article>
          <FileText size={22} />
          <div>
            <h3>{isNe ? "JPG, PNG र PDF" : "JPG, PNG and PDF"}</h3>
            <p>
              {isNe
                ? "मोबाइलबाट फोटो लिनुहोस् वा पुरानो रिपोर्ट अपलोड गर्नुहोस्।"
                : "Take a photo on mobile or upload an existing report."}
            </p>
          </div>
        </article>
        <article>
          <ShieldCheck size={22} />
          <div>
            <h3>{isNe ? "सुरक्षित व्याख्या" : "Safe explanations"}</h3>
            <p>
              {isNe
                ? "यो एपले रोग निदान गर्दैन र औषधि सुरु/बन्द गर्न भन्दैन।"
                : "This app does not diagnose conditions or tell you to start or stop medicine."}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
