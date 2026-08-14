import { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { LangProvider } from "@/app/components/LanguageContext";
import { Navigation } from "@/app/components/Navigation";

export const metadata = {
  title: "SwasthaScan — AI Medical Report Scanner",
  description: "Scan your medical report and understand your results in simple English or Nepali.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans selection:bg-pink-200 selection:text-pink-900">
        <LangProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-pink-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-bold text-lg mb-2 text-pink-200">SwasthaScan</h3>
          <p className="text-blue-100/80">Scan. Understand. Take Care.</p>
          <p className="text-pink-200/90 text-xs mt-1">रिपोर्ट बुझौँ, स्वास्थ्यको ख्याल गरौँ।</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1 text-blue-100/70">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/scan" className="hover:text-white">Scan Report</a></li>
            <li><a href="/reports" className="hover:text-white">My Reports</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-blue-100/70">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Disclaimer</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Safety Notice</h4>
          <p className="text-blue-100/60 text-xs leading-relaxed">
            SwasthaScan provides educational information to help you understand your medical report. It does not diagnose diseases or replace professional medical advice.
          </p>
        </div>
      </div>
      <div className="text-center text-blue-200/40 text-xs py-4 border-t border-white/10">© {new Date().getFullYear()} SwasthaScan. All rights reserved.</div>
    </footer>
  );
}
