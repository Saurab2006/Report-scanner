"use client";
import { useState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { ScanLine, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";

  async function handle(formData) {
    try {
      await login(formData);
    } catch (e) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-pink-200/40">
            <ScanLine size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-blue-950">{isNe ? "फिर्ता आउनुहोस्" : "Welcome Back"}</h1>
          <p className="text-slate-500 text-sm mt-2">{isNe ? "आफ्नो रिपोर्टहरू हेर्नुहोस्।" : "Access your scanned reports."}</p>
        </div>

        <form action={handle} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 mb-1.5">{isNe ? "इमेल" : "Email"}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input id="email" name="email" type="email" required placeholder={isNe ? "you@email.com" : "you@email.com"} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 mb-1.5">{isNe ? "पासवर्ड" : "Password"}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input id="password" name="password" type={showPass ? "text" : "password"} required placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-blue-600" aria-label="Toggle password">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200/40 hover:shadow-xl transition-all">{isNe ? "लोग इन" : "Login"}</button>
        </form>

        <div className="mt-4 flex gap-2">
          <button onClick={() => setLang("en")} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${lang === "en" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200"}`}>English</button>
          <button onClick={() => setLang("ne")} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${lang === "ne" ? "bg-pink-500 text-white border-pink-500" : "bg-white text-slate-500 border-slate-200"}`}>नेपाली</button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isNe ? "खाता छैन?" : "No account?"} <Link href="/auth/signup" className="font-bold text-blue-600 hover:text-pink-500">{isNe ? "रजिस्टर गर्नुहोस्" : "Create Account"}</Link>
        </div>
      </div>
    </div>
  );
}
