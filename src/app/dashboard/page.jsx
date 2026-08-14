import Link from "next/link";
import { ScanLine, Upload, FileText, TrendingUp, Activity, ArrowRight } from "lucide-react";
import { getCurrentUser, getUserLang } from "@/app/actions/auth";
import { db } from "@/db";
import { reports, results } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const lang = await getUserLang();
  const isNe = lang === "ne";

  const userReports = await db.select().from(reports).where(eq(reports.userId, user.id)).orderBy(reports.createdAt).limit(5);

  // Calculate basic stats from reports
  let normalCount = 0, attentionCount = 0, lowCount = 0;
  for (const r of userReports) {
    if (r.statusCounts) {
      normalCount += r.statusCounts.normal || 0;
      attentionCount += r.statusCounts.high || 0;
      lowCount += r.statusCounts.low || 0;
    }
  }

  const firstReport = userReports[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight">{isNe ? "शुभ प्रभात" : "Good Morning"}, {user.firstName} 👋</h1>
          <p className="text-slate-500 text-lg mt-2">{isNe ? "आफ्नो स्वास्थ्य बुझ्नुहोस्, एक पटकमा।" : "Understand your health, one report at a time."}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-blue-200/40 hover:scale-105 transition-all flex items-center gap-2"><ScanLine size={18} /> {isNe ? "📷 स्क्यान" : "📷 Scan New"}</Link>
          <Link href="/scan" className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"><Upload size={18} /> {isNe ? "📁 अपलोड" : "📁 Upload"}</Link>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: isNe ? "स्क्यान गरिएका रिपोर्ट" : "Reports Scanned", value: String(userReports.length || 0), color: "from-blue-500 to-blue-600" },
          { label: isNe ? "सामान्य परिणाम" : "Normal Results", value: String(normalCount || 0), color: "from-emerald-400 to-emerald-600" },
          { label: isNe ? "ध्यान आवश्यक" : "Needs Attention", value: String(attentionCount || 0), color: "from-amber-400 to-amber-500" },
          { label: isNe ? "भर्खरैको रिपोर्ट" : "Recent Report", value: firstReport ? firstReport.reportType : "—", color: "from-pink-400 to-pink-600", sub: firstReport ? new Date(firstReport.reportDate).toLocaleDateString() : "" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-3xl p-6 shadow-lg shadow-blue-900/5 border border-blue-50">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md mb-4`}><Activity size={20} /></div>
            <div className="text-3xl font-extrabold text-blue-950">{c.value}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">{c.label}</div>
            {c.sub && <div className="text-xs text-slate-400 mt-1">{c.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Report */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-blue-950">{isNe ? "भर्खरैको रिपोर्ट" : "Recent Report"}</h2>
            <Link href="/reports" className="text-sm font-bold text-blue-600 hover:text-pink-500 flex items-center gap-1">{isNe ? "सबै हेर्नुहोस्" : "View All"} <ArrowRight size={14} /></Link>
          </div>
          {firstReport ? (
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-blue-950">{firstReport.reportName}</h3>
                  <p className="text-xs text-slate-400 font-medium">{new Date(firstReport.reportDate).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{firstReport.reportType}</span>
              </div>
              <div className="flex gap-4 text-sm mb-4">
                <span className="font-bold text-emerald-600">🟢 {firstReport.statusCounts?.normal || 0} Normal</span>
                <span className="font-bold text-amber-500">🟡 {firstReport.statusCounts?.high || 0} Attention</span>
                <span className="font-bold text-red-500">🔴 {firstReport.statusCounts?.low || 0} Low</span>
              </div>
              <Link href={`/report/${firstReport.id}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200/40 hover:scale-[1.02] transition-transform">{isNe ? "विश्लेषण हेर्नुहोस् →" : "View Analysis →"}</Link>
            </div>
          ) : (
            <div className="bg-blue-50/50 rounded-2xl p-10 text-center">
              <p className="text-slate-500 font-medium mb-4">{isNe ? "अहिले कुनै रिपोर्ट छैन।" : "No reports yet."}</p>
              <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg">{isNe ? "📷 पहिलो रिपोर्ट स्क्यान" : "📷 Scan Your First Report"}</Link>
            </div>
          )}
        </div>

        {/* Side cards */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 shadow-lg border border-pink-100">
            <h3 className="font-extrabold text-blue-950 mb-2">{isNe ? "AI सारांश" : "AI Summary"}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{isNe ? "तपाईंको रिपोर्टमा १५ विश्लेषण गरिएका मापदण्डहरू छन्। धेरैजसो परिणामहरू रिपोर्टमा दिइएको सन्दर्भ दायराभित्र छन्।" : "Your report contains 15 analyzed parameters. Most results are within the reference ranges shown on the report."}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-lg border border-blue-100">
            <h3 className="font-extrabold text-blue-950 mb-2">{isNe ? "सुरक्षा सूचना" : "Safety Notice"}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{isNe ? "SwasthaScan तपाईंको मेडिकल रिपोर्ट बुझ्न मद्दत पुर्‍याउँछ। यसले रोग निदान गर्दैन वा व्यावसायिक चिकित्सा सल्लाहको स्थान लिँदैन।" : "SwasthaScan provides educational information to help you understand your medical report. It does not diagnose diseases or replace professional medical advice."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
