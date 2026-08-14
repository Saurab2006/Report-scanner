"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ScanLine, Globe, User, BarChart3, FileText, Activity, Lightbulb } from "lucide-react";
import { useLang } from "./LanguageContext";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();

  const navLinks = [
    { href: "/", label: "Home", labelNe: "गृह", icon: Lightbulb },
    { href: "/scan", label: "Scan Report", labelNe: "रिपोर्ट स्क्यान", icon: ScanLine },
    { href: "/reports", label: "My Reports", labelNe: "मेरो रिपोर्ट", icon: FileText },
    { href: "/trends", label: "Health Trends", labelNe: "स्वास्थ्य प्रवृत्ति", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-200/50">
            <ScanLine size={20} strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="block font-extrabold text-lg tracking-tight text-blue-950">SwasthaScan</span>
            <span className="block text-[10px] font-medium text-pink-500 tracking-wide">{lang === "ne" ? "स्वस्थास्क्यान" : "AI MEDICAL SCANNER"}</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-blue-50 transition-colors">{lang === "ne" ? l.labelNe : l.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center bg-blue-50 rounded-full p-0.5 border border-blue-100">
            <button onClick={() => setLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === "en" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>EN</button>
            <button onClick={() => setLang("ne")} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === "ne" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500"}`}>NP</button>
          </div>
          <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-blue-200/40 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2">
            <ScanLine size={16} /> {lang === "ne" ? "स्क्यान" : "+ Scan Report"}
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-blue-50 text-slate-700" aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-blue-100 shadow-xl px-6 pb-6 pt-4 space-y-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium">
              <l.icon size={18} className="text-pink-500" /> {lang === "ne" ? l.labelNe : l.label}
            </Link>
          ))}
          <div className="pt-3 flex gap-2">
            <button onClick={() => { setLang("en"); setOpen(false); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${lang === "en" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"}`}>English</button>
            <button onClick={() => { setLang("ne"); setOpen(false); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${lang === "ne" ? "bg-pink-500 text-white border-pink-500" : "bg-white text-slate-600 border-slate-200"}`}>नेपाली</button>
          </div>
          <Link href="/scan" onClick={() => setOpen(false)} className="block text-center bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold py-3 rounded-2xl mt-2 shadow-lg">{lang === "ne" ? "📷 रिपोर्ट स्क्यान" : "📷 Scan My Report"}</Link>
        </div>
      )}
    </header>
  );
}
