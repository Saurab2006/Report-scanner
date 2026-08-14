"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, ScanLine, Upload, Zap, Languages, Lock, HeartPulse, Activity } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function HomePage() {
  const { lang } = useLang();
  const isNe = lang === "ne";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-pink-50">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-blue-100 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm mb-6">
              <Sparkles size={14} className="text-pink-500" /> {isNe ? "AI-सञ्चालित मेडिकल स्क्यानर" : "AI-Powered Medical Scanner"}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-blue-950 leading-[1.1] mb-6">
              {isNe ? (
                <>
                  तपाईंको <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">मेडिकल रिपोर्ट</span>,<br />सानो बनाऔं।
                </>
              ) : (
                <>
                  Your Medical Report,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">Made Simple.</span>
                </>
              )}
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              {isNe
                ? "तपाईंको मेडिकल रिपोर्ट स्क्यान गर्नुहोस् र तपाईं सरल अंग्रेजी वा नेपालीमा परिणाम बुझ्नुहोस्।"
                : "Scan your medical report and understand your results in simple English or Nepali."}
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-200/40 hover:shadow-blue-300/50 hover:scale-[1.03] transition-all flex items-center gap-3">
                <ScanLine size={22} /> {isNe ? "📷 मेरो रिपोर्ट स्क्यान" : "📷 Scan My Report"}
              </Link>
              <Link href="/auth/login" className="bg-white text-blue-900 text-lg font-semibold px-8 py-4 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-3">
                <Upload size={22} /> {isNe ? "📁 रिपोर्ट अपलोड" : "📁 Upload Report"}
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> {isNe ? "सुरक्षित" : "Secure"}</span>
              <span className="flex items-center gap-2"><Lock size={16} className="text-pink-500" /> {isNe ? "निजी" : "Private"}</span>
              <span className="flex items-center gap-2"><Zap size={16} className="text-amber-500" /> {isNe ? "AI-सञ्चालित" : "AI-Powered"}</span>
              <span className="flex items-center gap-2"><Languages size={16} className="text-emerald-500" /> English + नेपाली</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block absolute top-12 right-12 w-[540px] h-[420px]">
            <div className="relative w-full h-full bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100/60 p-6 rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-pink-500 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">AI SCANNING</div>
              <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 mb-4">
                <h3 className="font-extrabold text-blue-950 text-lg mb-3">Complete Blood Count</h3>
                <div className="space-y-2">
                  {[
                    { label: "Hemoglobin", val: "10.2", unit: "g/dL", ref: "12–16", status: "low" },
                    { label: "WBC", val: "8,500", unit: "/µL", ref: "4,000–11,000", status: "normal" },
                    { label: "Glucose", val: "145", unit: "mg/dL", ref: "70–140", status: "high" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center justify-between text-sm bg-blue-50/50 rounded-xl px-3 py-2">
                      <span className="font-semibold text-slate-700">{t.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-950">{t.val} <span className="text-xs text-slate-400 font-normal">{t.unit}</span></span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.status === "low" ? "bg-red-100 text-red-600" : t.status === "high" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>{t.status === "low" ? "LOW" : t.status === "high" ? "HIGH" : "NORMAL"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> AI reading complete — 15 parameters analyzed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-4">{isNe ? "मेडिकल रिपोर्ट" : "Medical Reports"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">{isNe ? "विदेशी भाषा जस्तो महसुस हुनुहुन्न" : "Shouldn’t Feel Like a Foreign Language."}</span></h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">{isNe ? "हामीले ती समस्याहरू पहिचान गर्यौं।" : "We identified the problems."}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: isNe ? "जटिल रिपोर्ट" : "Complex Reports", desc: isNe ? "मेडिकल रिपोर्टहरूमा प्राविधिक शब्द र संख्या छन् जुन सामान्य प्रयोगकर्ताहरूले बुझ्न सक्छन्।" : "Medical reports contain technical terms and numbers that ordinary users may struggle to understand.", icon: "📄", color: "from-blue-500 to-blue-600" },
            { title: isNe ? "गडबड परिणाम" : "Confusing Results", desc: isNe ? "प्रयोगकर्ताहरूलाई थाहा नहुन सक्छ कि परिणाम सामान्य छ, उच्च छ, वा कम छ।" : "Users may not know whether a result is normal, high, or low.", icon: "❓", color: "from-pink-400 to-pink-600" },
            { title: isNe ? "भाषा बाधा" : "Language Barrier", desc: isNe ? "धेरै रिपोर्टहरूमा अंग्रेजी मेडिकल शब्दहरू प्रयोग गरिन्छन्, जबकि प्रयोगकर्ताहरू नेपालीमा सहज महसुस गर्छन्।" : "Many reports use English medical terminology even when users are more comfortable with Nepali.", icon: "🇳🇵", color: "from-amber-400 to-amber-500" },
          ].map((p) => (
            <div key={p.title} className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-50 hover:-translate-y-1 transition-transform">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center text-2xl shadow-lg mb-5`}>{p.icon}</div>
              <h3 className="text-xl font-extrabold text-blue-950 mb-3">{p.title}</h3>
              <p className="text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-3">{isNe ? "SwasthaScan तपाईंको रिपोर्ट सजिलो बनाउँछ" : "SwasthaScan Makes Your Report Easier to Understand."}</h3>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-blue-50/60 to-pink-50/60 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-4">{isNe ? "यसरी काम गर्छ" : "How It Works"}</h2>
            <p className="text-slate-500 text-lg">{isNe ? "चार सरल चरणमा आफ्नो रिपोर्ट बुझ्नुहोस्।" : "Understand your report in four simple steps."}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-pink-300 to-blue-200" />
            {[
              { num: "01", title: isNe ? "स्क्यान" : "Scan", desc: isNe ? "आफ्नो क्यामेराबाट रिपोर्ट क्याप्चर गर्नुहोस् वा छवि अपलोड गर्नुहोस्।" : "Capture your report using your camera or upload an image/PDF.", icon: ScanLine },
              { num: "02", title: isNe ? "पढी" : "Read", desc: isNe ? "AI ले रिपोर्ट पढ्छ र परीक्षण नाम, मूल्य, र सन्दर्भ दायराहरू निकाल्छ।" : "AI reads the report and extracts test names, values, and reference ranges.", icon: HeartPulse },
              { num: "03", title: isNe ? "बुझी" : "Understand", desc: isNe ? "प्रणालीले परिणाम एक सरल भाषामा व्याख्या गर्छ।" : "The system explains results in simple language.", icon: Sparkles },
              { num: "04", title: isNe ? "समीक्षा" : "Review", desc: isNe ? "पूर्ण रिपोर्ट सारांश, प्रवृत्तिहरू, र अघिल्ला परिणामहरू हेर्नुहोस्।" : "See complete report summaries, trends, and previous results.", icon: Activity },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-50 relative z-10 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-500 text-white flex items-center justify-center font-extrabold text-lg shadow-lg mb-5">{step.num}</div>
                <h3 className="text-xl font-extrabold text-blue-950 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Trust */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-pink-900 rounded-[2.5rem] p-12 md:p-16 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">{isNe ? "तपाईंको रिपोर्टहरू निजी छन्।" : "Your Reports Are Private."}</h2>
              <p className="text-blue-100/80 text-lg mb-8 leading-relaxed">{isNe ? "हामी तपाईंको मेडिकल डाटा सुरक्षित गर्छौं। कुनै पनि सार्वजनिक प्रदर्शन छैन। तपाईंको रिपोर्टहरू केवल तपाईंको खातामै उपलब्ध छन्।" : "We keep your medical data secure. No public exposure. Your reports are available only to your account."}</p>
              <div className="flex flex-wrap gap-3">
                {["🔒 Secure account", "🔒 Private reports", "🔒 Protected data", "🗑️ Delete anytime"].map((item) => (
                  <span key={item} className="bg-white/10 border border-white/10 text-blue-50 text-sm font-medium px-4 py-2 rounded-full">{item}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/10 shadow-2xl max-w-sm w-full">
                <h3 className="font-extrabold text-xl mb-4">{isNe ? "सुरक्षा विशेषताहरू" : "Privacy Features"}</h3>
                <ul className="space-y-3 text-blue-100/90 text-sm">
                  {[isNe ? "एन्क्रिप्टेड भण्डारण" : "Encrypted storage", isNe ? "केही पनि तेस्रो-पक्ष पहुँच छैन" : "No third-party access", isNe ? "खाता मेटाउन सकिन्छ" : "Account can be deleted", isNe ? "कुनै विज्ञापन छैन" : "No ads or tracking"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> {f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-3xl p-12 text-center border border-blue-100 shadow-xl shadow-blue-100/40">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4">{isNe ? "आफ्नो रिपोर्ट बुझ्नुहोस्" : "Understand Your Report With SwasthaScan."}</h2>
          <p className="text-slate-600 text-lg mb-8">{isNe ? "स्क्यान। बुझ्नुहोस्। सेयर गर्नुहोस्।" : "Scan. Understand. Take Care."}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-200/40 hover:scale-105 transition-transform">{isNe ? "📷 रिपोर्ट स्क्यान" : "📷 Scan Your Report"}</Link>
            <Link href="/auth/signup" className="bg-white text-blue-950 font-bold px-8 py-3.5 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all">{isNe ? "खाता बनाउनुहोस्" : "Create Account"}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
