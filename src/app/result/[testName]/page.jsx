"use client";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, HeartPulse, AlertCircle } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";
import Link from "next/link";

export default function ResultDetailPage({ params }) {
  const { lang } = useLang();
  const isNe = lang === "ne";
  const search = useSearchParams();
  const raw = search.get("data") || "{}";
  let r = {};
  try { r = JSON.parse(decodeURIComponent(raw)); } catch {}

  const testName = decodeURIComponent(params.testName || r.testName || "Test");
  const value = r.value || "—";
  const unit = r.unit || "";
  const ref = r.referenceRange || "—";
  const status = r.status || "unknown";

  const statusColor = status === "low" ? "text-red-600 bg-red-50 border-red-200" : status === "high" ? "text-amber-600 bg-amber-50 border-amber-200" : status === "normal" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-500 bg-slate-50 border-slate-200";
  const statusLabel = status === "low" ? (isNe ? "कम" : "Low / Below Range") : status === "high" ? (isNe ? "उच्च" : "High / Above Range") : status === "normal" ? (isNe ? "सामान्य" : "Normal / Within Range") : (isNe ? "अज्ञात" : "Unable to Determine");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/report/analysis" className="text-blue-600 font-bold flex items-center gap-2 mb-6 hover:text-pink-500"><ArrowLeft size={20} /> {isNe ? "विश्लेषणमा फर्कनुहोस्" : "Back to Analysis"}</Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-8 md:p-12 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">{testName}</h1>
            <div className="flex items-baseline gap-3 text-2xl font-extrabold">
              <span>{value}</span><span className="text-blue-100/90 text-lg font-medium">{unit}</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-bold border border-white/10">{statusLabel}</div>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {/* Your result */}
            <section>
              <h2 className="text-xl font-extrabold text-blue-950 mb-3">{isNe ? "तपाईंको परिणाम" : "Your Result"}</h2>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-3xl font-extrabold text-blue-950">{value} <span className="text-xl text-slate-400 font-medium">{unit}</span></div>
                <p className="text-sm text-slate-600 font-medium mt-2">{isNe ? "सन्दर्भ दायरा" : "Reference Range"}: <span className="font-bold text-blue-900">{ref}</span></p>
              </div>
            </section>

            {/* What does this mean */}
            <section>
              <h2 className="text-xl font-extrabold text-blue-950 mb-3 flex items-center gap-2"><HeartPulse size={22} className="text-pink-500" /> {isNe ? "यसको अर्थ के हो?" : "What does this mean?"}</h2>
              <p className="text-slate-600 leading-relaxed">{r.explanationEn || r.explanationNe || (isNe ? "यो परिणाम तपाईंको रिपोर्टमा दिइएको सन्दर्भ दायरासँग तुलना गरिएको छ।" : "This result is compared with the reference range shown on your report.")}</p>
            </section>

            {/* Associated possibilities */}
            <section className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="text-xl font-extrabold text-blue-950 mb-3">{isNe ? "यो परिणाम केसँग सम्बन्धित हुन सक्छ?" : "What can this result be associated with?"}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{isNe ? "यो परिणाम कहिलेकाहीँ धेरै अवस्थासँग सम्बन्धित हुन सक्छ। यसले निश्चित रूपमा कुनै रोग निदान गर्दैन। थप जानकारीका लागि स्वास्थ्यकर्मीसँग परामर्श गर्नुहोस्।" : "This result can sometimes be associated with several conditions. It does not confirm any specific disease. Please consult a healthcare professional for further interpretation."}</p>
            </section>

            {/* Lifestyle / help */}
            <section>
              <h2 className="text-xl font-extrabold text-blue-950 mb-3">{isNe ? "के सघाउन सक्छ?" : "What can help?"}</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed text-sm">
                <li>{isNe ? "सन्तुलित पोषण र पर्याप्त पानी पिउनुहोस्।" : "Maintain balanced nutrition and stay well hydrated."}</li>
                <li>{isNe ? "नियमित व्यायाम र पर्याप्त निद्रा लिनुहोस्।" : "Regular physical activity and adequate sleep."}</li>
                <li>{isNe ? "धुम्रपान र अत्यधिक रक्सीको प्रयोगबाट टाढा रहनुहोस्।" : "Avoid smoking and excessive alcohol use."}</li>
                <li>{isNe ? "आफ्नो स्वास्थ्यकर्मीसँग नियमित फलोअप गर्नुहोस्।" : "Regular follow-up with your healthcare provider."}</li>
              </ul>
            </section>

            {/* When to seek advice */}
            <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-extrabold text-blue-950 mb-3">{isNe ? "कहिले व्यावसायिक सल्लाह लिनुपर्छ?" : "When should I seek professional advice?"}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{isNe ? "यदि तपाईंले सुरुमा नदेखिएका लक्षणहरू महसुस गर्नुभयो, वा यदि यो परिणाम अघिल्ला रिपोर्टहरूसँग धेरै भिन्न छ भने, एम्बुलेन्स वा अस्पताल जानुहोस्।" : "If you experience new symptoms not previously noticed, or if this result differs significantly from previous reports, please visit a healthcare facility."}</p>
            </section>

            {/* Safety notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
              <ShieldCheck className="text-amber-600 shrink-0" size={28} />
              <div>
                <h3 className="font-extrabold text-amber-900 mb-1">{isNe ? "सुरक्षा सूचना" : "Safety Notice"}</h3>
                <p className="text-amber-900/80 text-sm leading-relaxed">{isNe ? "यो जानकारी शैक्षिक उद्देश्यका लागि मात्र हो र व्यावसायिक चिकित्सा सल्लाहको स्थान लिँदैन।" : "This information is for educational purposes only and does not replace professional medical advice."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
