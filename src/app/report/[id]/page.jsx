import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { getCurrentUser, getUserLang } from "@/app/actions/auth";
import { db } from "@/db";
import { reports, results } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ReportDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const lang = await getUserLang();
  const isNe = lang === "ne";

  const report = await db.select().from(reports).where(eq(reports.id, parseInt(params.id))).limit(1);
  if (!report.length) redirect("/reports");
  const r = report[0];
  const resultRows = await db.select().from(results).where(eq(results.reportId, r.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/reports" className="text-blue-600 font-bold flex items-center gap-2 mb-6 hover:text-pink-500"><ChevronLeft size={20} /> {isNe ? "मेरो रिपोर्टमा फर्कनुहोस्" : "Back to Reports"}</Link>

        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-pink-900 rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl shadow-blue-900/20 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">{r.reportName}</h1>
            <p className="text-blue-100/80 text-lg">{isNe ? "तपाईंको रिपोर्ट तयार छ ✨" : "Your Report Is Ready ✨"}</p>
            <p className="text-blue-200/60 text-sm mt-1">{new Date(r.reportDate).toLocaleDateString()}</p>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-blue-950 mb-6">{isNe ? "नतिजाहरू" : "Results"}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {resultRows.map((res) => (
            <div key={res.id} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-blue-950">{res.testName}</h3>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${res.status === "normal" ? "bg-emerald-100 text-emerald-700" : res.status === "high" ? "bg-amber-100 text-amber-700" : res.status === "low" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}>{res.status === "normal" ? "NORMAL" : res.status === "high" ? "HIGH" : res.status === "low" ? "LOW" : "UNKNOWN"}</span>
              </div>
              <div className="text-2xl font-extrabold text-blue-950">{res.value} <span className="text-sm text-slate-400 font-medium">{res.unit}</span></div>
              <div className="text-xs text-slate-500 font-medium mt-1">{isNe ? "सन्दर्भ" : "Reference"}: {res.referenceRange}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
