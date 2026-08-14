"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function ComparePage() {
  const { lang } = useLang();
  const isNe = lang === "ne";
  const [leftVal, setLeftVal] = useState(10.2);
  const [rightVal, setRightVal] = useState(11.1);
  const diff = rightVal - leftVal;
  const pct = ((diff / leftVal) * 100).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-2">{isNe ? "रिपोर्ट तुलना" : "Compare Reports"}</h1>
      <p className="text-slate-500 mb-10">{isNe ? "अघिल्ला र हालको रिपोर्ट तुलना गर्नुहोस्।" : "Compare previous and current reports."}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <h3 className="font-extrabold text-blue-950 mb-2">{isNe ? "अघिल्लो" : "Previous"}</h3>
          <div className="text-4xl font-extrabold text-blue-950 mb-1">{leftVal} <span className="text-xl text-slate-400">g/dL</span></div>
          <p className="text-xs text-slate-400">Hemoglobin</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-pink-500 rounded-3xl p-8 shadow-xl text-white">
          <h3 className="font-extrabold mb-2">{isNe ? "हालको" : "Current"}</h3>
          <div className="text-4xl font-extrabold mb-1">{rightVal} <span className="text-xl text-blue-100">g/dL</span></div>
          <p className="text-xs text-blue-100">Hemoglobin</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-blue-950">{isNe ? "परिवर्तन" : "Change"}</h3>
          <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${diff > 0 ? "bg-emerald-100 text-emerald-700" : diff < 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
            {diff > 0 ? <ArrowUpRight size={16} className="inline" /> : diff < 0 ? <ArrowDownRight size={16} className="inline" /> : <Minus size={16} className="inline" />} {diff > 0 ? "+" : ""}{diff.toFixed(1)} ({pct}%)
          </span>
        </div>
        <div className="flex gap-3 mb-6">
          {[
            { name: "Hemoglobin", prev: 10.2, curr: 11.1 },
            { name: "Glucose", prev: 145, curr: 132 },
            { name: "HbA1c", prev: 7.2, curr: 6.8 },
          ].map((t) => (
            <button key={t.name} onClick={() => { setLeftVal(t.prev); setRightVal(t.curr); }} className="flex-1 bg-blue-50 hover:bg-blue-100 rounded-xl p-3 text-left transition-colors">
              <div className="font-bold text-blue-950 text-sm">{t.name}</div>
              <div className="text-xs text-slate-500">{t.prev} → {t.curr}</div>
            </button>
          ))}
        </div>
        <div className="h-48 flex items-end gap-4">
          {[
            { label: "Mar", val: 9.8 },
            { label: "May", val: 10.2 },
            { label: "Aug", val: 11.1 },
          ].map((pt) => (
            <div key={pt.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-blue-600 to-pink-400 rounded-t-xl shadow-lg" style={{ height: `${pt.val * 12}px` }} />
              <span className="text-xs font-bold text-slate-600">{pt.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
        <TrendingUp className="text-amber-600 shrink-0" size={28} />
        <div>
          <h3 className="font-extrabold text-amber-900 mb-1">{isNe ? "सुधारिएको" : "Improved"}</h3>
          <p className="text-amber-900/80 text-sm">{isNe ? "तपाईंको रेकर्ड गरिएको मान अघिल्ला रिपोर्टहरूसँग तुलना गर्दा बढेको छ।" : "Your recorded values have increased compared with previous reports."}</p>
        </div>
      </div>
    </div>
  );
}
