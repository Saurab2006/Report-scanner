import Link from "next/link";
import { FileText, ArrowRight, Eye, Download, Trash2 } from "lucide-react";
import { getCurrentUser, getUserLang } from "@/app/actions/auth";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const lang = await getUserLang();
  const isNe = lang === "ne";
  const userReports = await db.select().from(reports).where(eq(reports.userId, user.id)).orderBy(reports.createdAt);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-2">{isNe ? "मेरो रिपोर्ट" : "My Reports"}</h1>
      <p className="text-slate-500 mb-8">{isNe ? "पछिल्ला स्क्यान गरिएका रिपोर्टहरू।" : "Previously scanned reports."}</p>

      {userReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100 shadow-lg">
          <FileText size={48} className="mx-auto text-blue-200 mb-4" />
          <h3 className="text-xl font-extrabold text-blue-950 mb-2">{isNe ? "कुनै रिपोर्ट छैन" : "No Reports Yet"}</h3>
          <p className="text-slate-500 mb-6">{isNe ? "तपाईंको स्क्यान गरिएका रिपोर्टहरू यहाँ देखिनेछन्।" : "Your scanned reports will appear here."}</p>
          <Link href="/scan" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl">{isNe ? "📷 पहिलो रिपोर्ट स्क्यान" : "📷 Scan Your First Report"}</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userReports.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 shadow-lg shadow-blue-900/5 border border-blue-100 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-blue-950 truncate">{r.reportName}</h3>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{r.reportType}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-3">{new Date(r.reportDate).toLocaleDateString()}</p>
              <div className="flex gap-2 text-sm font-bold mb-4">
                <span className="text-emerald-600">🟢 {r.statusCounts?.normal || 0}</span>
                <span className="text-amber-500">🟡 {r.statusCounts?.high || 0}</span>
                <span className="text-red-500">🔴 {r.statusCounts?.low || 0}</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/report/${r.id}`} className="flex-1 text-center bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-200/40 hover:scale-[1.02] transition-all">{isNe ? "हेर्नुहोस्" : "View"}</Link>
                <button className="bg-blue-50 text-blue-600 font-bold px-3 py-2.5 rounded-xl hover:bg-blue-100" aria-label="Download"><Download size={18} /></button>
                <button className="bg-red-50 text-red-500 font-bold px-3 py-2.5 rounded-xl hover:bg-red-100" aria-label="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
