"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, BarChart3, Heart, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { useLang } from "./LanguageContext";

export function AuthLayout({ children, activeTab = "login" }) {
  const { lang } = useLang();
  const isNe = lang === "ne";

  return (
    <div className="auth-viewport">
      {/* Ambient background decoration shapes */}
      <div className="auth-ambient-blob blob-1" aria-hidden="true" />
      <div className="auth-ambient-blob blob-2" aria-hidden="true" />
      <div className="auth-ambient-blob blob-3" aria-hidden="true" />
      <div className="dot-matrix-grid top-left" aria-hidden="true" />
      <div className="dot-matrix-grid bottom-right" aria-hidden="true" />
      <div className="floating-plus plus-1" aria-hidden="true">+</div>
      <div className="floating-plus plus-2" aria-hidden="true">+</div>

      <div className="auth-container">
        {/* LEFT COLUMN: HERO SHOWCASE */}
        <section className="auth-showcase-panel">
          {/* Header Brand */}
          <div className="showcase-brand">
            <div className="brand-logo-glow">
              <Image
                src="/swastha-logo.jpg"
                alt="SwasthaScan Logo"
                width={56}
                height={56}
                priority
                className="rounded-2xl object-cover shadow-md"
              />
            </div>
            <div>
              <h2 className="showcase-brand-title">
                Swastha<span>Scan</span>
              </h2>
              <p className="showcase-brand-tagline">
                {isNe ? "स्क्यान • बुझ्नुहोस् • स्वस्थ रहनुहोस्" : "Scan • Understand • Stay Healthy"}
              </p>
            </div>
          </div>

          {/* Hero Feature Pill */}
          <div className="showcase-pill">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{isNe ? "तपाईंको स्वास्थ्य रिपोर्ट, अब सरल र स्पष्ट" : "Your Health Reports, Made Simple"}</span>
          </div>

          {/* Main Title & Description */}
          <div className="showcase-copy">
            <h1>
              {activeTab === "signup"
                ? isNe
                  ? "SwasthaScan मा सामेल हुनुहोस्"
                  : "Join SwasthaScan Today"
                : isNe
                ? "SwasthaScan मा स्वागत छ"
                : "Welcome to SwasthaScan"}
            </h1>
            <p>
              {isNe
                ? "आफ्नो मेडिकल रिपोर्टहरू सजिलै अपलोड र स्क्यान गर्नुहोस्। तत्काल जानकारी प्राप्त गर्नुहोस्, आफ्नो स्वास्थ्यलाई राम्ररी बुझ्नुहोस् र आफ्नो स्वास्थ्यको ख्याल राख्नुहोस्।"
                : "Upload and scan your medical reports with ease. Get instant insights, understand your health better, and take control of your well-being."}
            </p>
          </div>

          {/* Three Feature Highlight Badges */}
          <div className="showcase-features-grid">
            <div className="feature-badge-card">
              <div className="feature-badge-icon">
                <FileText size={20} />
              </div>
              <div>
                <strong>{isNe ? "रिपोर्ट स्क्यान" : "Scan Reports"}</strong>
                <small>{isNe ? "फोटो वा PDF" : "JPG, PNG & PDF"}</small>
              </div>
            </div>

            <div className="feature-badge-card">
              <div className="feature-badge-icon">
                <BarChart3 size={20} />
              </div>
              <div>
                <strong>{isNe ? "स्पष्ट विवरण" : "Get Insights"}</strong>
                <small>{isNe ? "HIGH, NORMAL, LOW" : "Instant Indicators"}</small>
              </div>
            </div>

            <div className="feature-badge-card">
              <div className="feature-badge-icon">
                <Heart size={20} />
              </div>
              <div>
                <strong>{isNe ? "राम्रो निर्णय" : "Better Decisions"}</strong>
                <small>{isNe ? "सजिलो र सुरक्षित" : "Healthier Life"}</small>
              </div>
            </div>
          </div>

          {/* Aesthetic Doctor Illustration / Graphic Frame */}
          <div className="showcase-visual-wrapper">
            <div className="health-matters-tag">
              <Sparkles size={16} />
              <span>{isNe ? "तपाईंको स्वास्थ्य महत्त्वपूर्ण छ" : "Your Health Matters"}</span>
            </div>

            <div className="doctor-visual-card">
              <div className="doctor-art-container">
                <Image
                  src="/auth-hero-illustration.png"
                  alt="Doctor Illustration"
                  width={460}
                  height={380}
                  className="doctor-illustration-img"
                  priority
                />
              </div>
              <div className="doctor-card-subtext">
                <ShieldCheck size={16} />
                <span>{isNe ? "१००% सुरक्षित र गोप्य रिपोर्ट विश्लेषण" : "100% Secure & Confidential Report Analysis"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: AUTH CARD */}
        <section className="auth-card-panel">
          <div className="auth-card-box">
            {/* Header with logo and tabs */}
            <div className="auth-card-header">
              <div className="auth-card-logo">
                <Image
                  src="/swastha-logo.jpg"
                  alt="SwasthaScan"
                  width={52}
                  height={52}
                  className="rounded-2xl"
                />
              </div>
              <h2 className="auth-card-title">
                Swastha<span className="text-emerald-700">Scan</span>
              </h2>
              <p className="auth-card-tagline">
                {isNe ? "स्क्यान • बुझ्नुहोस् • स्वस्थ रहनुहोस्" : "Scan • Understand • Stay Healthy"}
              </p>

              {/* Navigation Switch Tabs */}
              <div className="auth-nav-tabs" role="tablist">
                <Link
                  href="/login"
                  className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
                >
                  {isNe ? "लगइन" : "Login"}
                </Link>
                <Link
                  href="/signup"
                  className={`auth-tab-btn ${activeTab === "signup" ? "active" : ""}`}
                >
                  {isNe ? "साइन अप" : "Sign Up"}
                </Link>
              </div>
            </div>

            {/* Dynamic Form Content */}
            <div className="auth-card-body">{children}</div>

            {/* Footer Copyright */}
            <div className="auth-card-footer">
              <p>© {new Date().getFullYear()} SwasthaScan. {isNe ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function GoogleAuthButton({ onClick, loading, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="google-auth-button"
      aria-label={text}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span>{loading ? "Connecting to Google..." : text}</span>
    </button>
  );
}
