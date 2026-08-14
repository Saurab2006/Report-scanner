"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Download, HeartPulse, AlertCircle, Check, Sparkles, Languages, ShieldCheck, Trash2 } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";
import Link from "next/link";

function AnalysisContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";
  const [data, setData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = params.get("data");
      if (raw) setData(JSON.parse(decodeURIComponent(raw)));
    } catch {}
  }, [params]);

  const counts = data?.statusCounts || { normal: 0, high: 0, low: 0, unknown: 0 };

  const saveReport = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center mx-auto mb-6 shadow-xl"><AlertCircle size={36} className="text-blue-600" /></div>
        <h1 className="text-2xl font-extrabold text-blue-950 mb-3">{isNe ? "डाटा फेला परेन" : "No Data Found"}</h1>
        <p className="text-slate-500 mb-6">{isNe ? "कृपया स्क्यान पृष्ठबाट फर्कनुहोस्।" : "Please go back to the scan page."}</p>
        <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl">{isNe ? "← स्क्यानमा फर्कनुहोस्" : "← Back to Scan"}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => router.back()} className="text-blue-600 font-bold flex items-center gap-2 mb-6 hover:text-pink-500 transition-colors"><ChevronLeft size={20} /> {isNe ? "फर्कनुहोस्" : "Back"}</button>

        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-pink-900 rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-full px-3 py-1 text-xs font-bold mb-4"><Sparkles size={14} className="text-pink-300" /> AI {isNe ? "विश्लेषण" : "Analysis"}</div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">{data.reportName}</h1>
              <p className="text-blue-100/80 text-lg">{isNe ? "तपाईंको रिपोर्ट तयार छ ✨" : "Your Report Is Ready ✨"}</p>
              <p className="text-blue-200/60 text-sm mt-1">{data.results?.length || 0} {isNe ? "पैरामिटरहरू विश्लेषण गरियो" : "parameters analyzed"}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={saveReport} className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${saved ? "bg-emerald-500 text-white" : "bg-white text-blue-950 hover:scale-105"}`}><Check size={18} /> {saved ? (isNe ? "सुरक्षित" : "Saved") : (isNe ? "बचत गर्नुहोस्" : "Save")}</button>
              <button onClick={() => { const w = window.open("", "_blank"); if (w) w.document.write(`<html><body style='font-family:sans-serif;padding:2rem'><h1>SwasthaScan - ${data.reportName}</h1><p>Disclaimer: Educational info only.</p></body></html>`); }} className="bg-white/10 text-white font-bold px-5 py-2.5 rounded-xl text-sm border border-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"><Download size={18} /> {isNe ? "डाउनलोड" : "Download"}</button>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-900/5 border border-blue-100 mb-10">
          <h2 className="text-xl font-extrabold text-blue-950 mb-3 flex items-center gap-2"><Sparkles size={22} className="text-pink-500" /> {isNe ? "AI सारांश" : "AI Summary"}</h2>
          <p className="text-slate-600 leading-relaxed">{data.summary || (isNe ? "तपाईंको रिपोर्टमा विश्लेषण गरिएका मापदण्डहरू छन्।" : "Your report contains analyzed parameters.")}</p>
        </div>

        {/* Status overview */}
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: isNe ? "सामान्य" : "Normal", val: counts.normal, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
            { label: isNe ? "ध्यान" : "Attention", val: counts.high, color: "bg-amber-100 text-amber-700 border-amber-200" },
            { label: isNe ? "कम" : "Low", val: counts.low, color: "bg-red-100 text-red-700 border-red-200" },
            { label: isNe ? "अज्ञात" : "Unknown", val: counts.unknown, color: "bg-slate-100 text-slate-600 border-slate-200" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-6 text-center border shadow-sm ${s.color}`}>
              <div className="text-4xl font-extrabold">{s.val}</div>
              <div className="text-sm font-bold mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Donut chart visual */}
        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-900/5 border border-blue-100 mb-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-48 h-48 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${(counts.normal / Math.max(1, counts.normal + counts.high + counts.low + counts.unknown)) * 251.2} 251.2`} strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray={`${(counts.high / Math.max(1, counts.normal + counts.high + counts.low + counts.unknown)) * 251.2} 251.2`} strokeLinecap="round" strokeDashoffset={`-${(counts.normal / Math.max(1, counts.normal + counts.high + counts.low + counts.unknown)) * 251.2}`} />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray={`${(counts.low / Math.max(1, counts.normal + counts.high + counts.low + counts.unknown)) * 251.2} 251.2`} strokeLinecap="round" strokeDashoffset={`-${((counts.normal + counts.high) / Math.max(1, counts.normal + counts.high + counts.low + counts.unknown)) * 251.2}`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><div className="text-2xl font-extrabold text-blue-950">{data.results?.length || 0}</div><div className="text-xs text-slate-400 font-medium">{isNe ? "पैरामिटर" : "Tests"}</div></div></div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-blue-950 mb-3">{isNe ? "परिणाम समीक्षा" : "Results Overview"}</h3>
            <div className="space-y-2">
              {data.results?.slice(0, 6).map((r) => (
                <div key={r.testName} className="flex items-center justify-between bg-blue-50/50 rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-semibold text-slate-700">{r.testName}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-950">{r.value} <span className="text-xs text-slate-400 font-normal">{r.unit}</span></span>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${r.status === "normal" ? "bg-emerald-100 text-emerald-700" : r.status === "high" ? "bg-amber-100 text-amber-700" : r.status === "low" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}>{r.status === "normal" ? "NORMAL" : r.status === "high" ? "HIGH" : r.status === "low" ? "LOW" : "UNKNOWN"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual results */}
        <h2 className="text-2xl font-extrabold text-blue-950 mb-6">{isNe ? "विस्तृत परिणाम" : "Detailed Results"}</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {data.results?.map((r) => {
            const statusColor = r.status === "normal" ? "from-emerald-400 to-emerald-600" : r.status === "high" ? "from-amber-400 to-amber-500" : r.status === "low" ? "from-red-400 to-rose-500" : "from-slate-300 to-slate-400";
            const statusText = r.status === "normal" ? (isNe ? "सामान्य" : "Normal") : r.status === "high" ? (isNe ? "उच्च" : "High") : r.status === "low" ? (isNe ? "कम" : "Low") : (isNe ? "अज्ञात" : "Unknown");
            return (
              <Link href={`/result/${encodeURIComponent(r.testName)}?data=${encodeURIComponent(JSON.stringify(r))}`} key={r.testName} className="bg-white rounded-3xl p-6 shadow-lg shadow-blue-900/5 border border-blue-100 hover:-translate-y-1 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-extrabold text-blue-950 group-hover:text-pink-600 transition-colors">{r.testName}</h3>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full text-white bg-gradient-to-br ${statusColor} shadow-md`}>{statusText}</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-950 mb-1">{r.value} <span className="text-base font-medium text-slate-400">{r.unit}</span></div>
                <div className="text-sm text-slate-500 font-medium">{isNe ? "सन्दर्भ" : "Reference"}: <span className="font-bold text-blue-900">{r.referenceRange}</span></div>
                <div className="mt-3 text-xs text-slate-400">{r.status === "low" ? (isNe ? "🔴 यो रिपोर्टमा दिइएको सामान्य दायराभन्दा कम छ।" : "🔴 Below reference range shown on report.") : r.status === "high" ? (isNe ? "🟡 यो रिपोर्टमा दिइएको सामान्य दायराभन्दा माथि छ।" : "🟡 Above reference range shown on report.") : (isNe ? "🟢 यो रिपोर्टमा दिइएको सामान्य दायराभित्र छ।" : "🟢 Within reference range shown on report.")}</div>
                <div className="mt-4 pt-4 border-t border-blue-50 flex items-center justify-between text-sm font-bold text-blue-600 group-hover:text-pink-500">{isNe ? "बुझ्नुहोस् →" : "Understand This →"}</div>
              </Link>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start mb-12">
          <AlertCircle className="text-amber-500 shrink-0" size={24} />
          <div>
            <h3 className="font-extrabold text-amber-900 mb-1">{isNe ? "सुरक्षा सूचना" : "Disclaimer"}</h3>
            <p className="text-amber-800 text-sm leading-relaxed">{isNe ? "SwasthaScan तपाईंको मेडिकल रिपोर्ट बुझ्न मद्दत पुर्‍याउँछ। यसले रोग निदान गर्दैन वा व्यावसायिक चिकित्सा सल्लाहको स्थान लिँदैन। कुनै पनि असामान्य परिणामका लागि आफ्नो स्वास्थ्यकर्मीसँग परामर्श गर्नुहोस्।" : "SwasthaScan provides educational information to help you understand your medical report. It does not diagnose diseases or replace professional medical advice. Consult your healthcare professional for any abnormal results."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-20 text-center text-slate-500">Loading analysis...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
