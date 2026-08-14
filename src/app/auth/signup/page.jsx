"use client";
import { useState } from "react";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { ScanLine, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";

  async function handle(formData) {
    try {
      await signup(formData);
    } catch (e) {
      setError(e.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-pink-200/40">
            <ScanLine size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-blue-950">{isNe ? "खाता बनाउनुहोस्" : "Create Account"}</h1>
          <p className="text-slate-500 text-sm mt-2">{isNe ? "SwasthaScan सुरुवात गर्नुहोस्" : "Start with SwasthaScan"}</p>
        </div>

        <form action={handle} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-xs font-bold text-slate-600 mb-1">{isNe ? "पहिलो नाम" : "First Name"}</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input id="firstName" name="firstName" required className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-bold text-slate-600 mb-1">{isNe ? "थर" : "Last Name"}</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input id="lastName" name="lastName" required className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 mb-1">{isNe ? "इमेल" : "Email"}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input id="email" name="email" type="email" required className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 mb-1">{isNe ? "पासवर्ड" : "Password"}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input id="password" name="password" type={showPass ? "text" : "password"} required className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400" aria-label="Toggle">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <div>
            <label htmlFor="preferredLanguage" className="block text-xs font-bold text-slate-600 mb-1">{isNe ? "भाषा तरजिमा" : "Language Preference"}</label>
            <select name="preferredLanguage" defaultValue={lang} className="w-full py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200">
              <option value="en">English</option>
              <option value="ne">नेपाली</option>
            </select>
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200/40">{isNe ? "खाता बनाउनुहोस्" : "Create Account"}</button>
        </form>

        <div className="mt-4 flex gap-2">
          <button onClick={() => setLang("en")} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${lang === "en" ? "bg-blue-600 text-white" : "bg-white text-slate-500"}`}>English</button>
          <button onClick={() => setLang("ne")} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${lang === "ne" ? "bg-pink-500 text-white" : "bg-white text-slate-500"}`}>नेपाली</button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">{isNe ? "पहिले नै खाता छ?" : "Already have an account?"} <Link href="/auth/login" className="font-bold text-blue-600 hover:text-pink-500">{isNe ? "लोग इन" : "Login"}</Link></div>
      </div>
    </div>
  );
}
