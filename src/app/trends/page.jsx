"use client";
import { useState } from "react";
import { TrendingUp, Activity } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function TrendsPage() {
  const { lang } = useLang();
  const isNe = lang === "ne";
  const [test, setTest] = useState("Hemoglobin");
  const data = [
    { month: "Mar", val: 9.8 },
    { month: "May", val: 10.2 },
    { month: "Aug", val: 11.1 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-2">{isNe ? "स्वास्थ्य प्रवृत्ति" : "Your Health Trends"}</h1>
      <p className="text-slate-500 mb-8">{isNe ? "परीक्षण चयन गर्नुहोस् र आफ्नो प्रवृत्ति हेर्नुहोस्।" : "Select a test and view your trends."}</p>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {["Hemoglobin", "Glucose", "HbA1c", "Cholesterol", "LDL", "HDL", "TSH", "Creatinine"].map((t) => (
          <button key={t} onClick={() => setTest(t)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${test === t ? "bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-lg" : "bg-white text-slate-600 border border-blue-100 hover:border-blue-300"}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-100 mb-8">
        <h2 className="text-2xl font-extrabold text-blue-950 mb-6">{test}</h2>
        <div className="flex gap-4 h-64 items-end mb-6">
          {data.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-blue-600 to-pink-400 rounded-t-xl shadow-lg" style={{ height: `${(d.val / 12) * 100}%` }} />
              <span className="text-xs font-bold text-slate-500">{d.month}</span>
              <span className="text-xs font-extrabold text-blue-950">{d.val}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 font-medium">{isNe ? "तपाईंको रेकर्ड गरिएको मान अघिल्ला रिपोर्टहरूसँग तुलना गर्दा बढेको छ।" : "Your recorded values have increased compared with previous reports."}</p>
      </div>
    </div>
  );
}
