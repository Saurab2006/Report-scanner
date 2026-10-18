"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowUpRight, CalendarDays, CheckCircle2, CircleAlert, FileHeart, FilePlus2, HeartPulse, Stethoscope } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useLang } from "@/components/LanguageContext";

const copy = {
  en: { welcome:"Your health, made clearer", hello:"Welcome back", subtitle:"Review your reports and keep track of what matters.", upload:"Scan a report", history:"Recent reports", viewAll:"View all", total:"Reports scanned", normal:"In range", attention:"Need attention", noReports:"Your report history will appear here after your first scan.", start:"Upload your first report", trend:"Latest report overview", guidance:"Your next steps", guide1:"Discuss flagged results with a qualified clinician who knows your health history.", guide2:"Keep a copy of your report and note any symptoms or medicines to discuss.", guide3:"Make gradual lifestyle changes; avoid starting or stopping medicine based on a scan.", doctor:"When to talk to a doctor", doctorText:"Book a consultation for persistent symptoms or results marked high, low, or needing review. Seek urgent care for severe or sudden symptoms.", safe:"Educational information only • Not a diagnosis", noName:"Medical report", scanAgain:"Scan another report" },
  ne: { welcome:"तपाईंको स्वास्थ्य, अझ स्पष्ट", hello:"फेरि स्वागत छ", subtitle:"रिपोर्ट हेर्नुहोस् र महत्त्वपूर्ण स्वास्थ्य जानकारी ट्र्याक गर्नुहोस्।", upload:"रिपोर्ट स्क्यान", history:"हालका रिपोर्टहरू", viewAll:"सबै हेर्नुहोस्", total:"स्क्यान गरिएका रिपोर्ट", normal:"सामान्य सीमाभित्र", attention:"ध्यान दिनुपर्ने", noReports:"पहिलो स्क्यानपछि तपाईंको रिपोर्ट इतिहास यहाँ देखिनेछ।", start:"पहिलो रिपोर्ट अपलोड गर्नुहोस्", trend:"पछिल्लो रिपोर्टको अवस्था", guidance:"अब के गर्ने", guide1:"चिन्ह लगाइएका नतिजाबारे आफ्नो स्वास्थ्य इतिहास थाहा भएको योग्य चिकित्सकसँग छलफल गर्नुहोस्।", guide2:"रिपोर्ट सुरक्षित राख्नुहोस् र लक्षण वा औषधिबारे चिकित्सकलाई बताउनुहोस्।", guide3:"बिस्तारै जीवनशैली परिवर्तन गर्नुहोस्; स्क्यानका आधारमा औषधि सुरु वा बन्द नगर्नुहोस्।", doctor:"चिकित्सकसँग कहिले कुरा गर्ने", doctorText:"लक्षण रहिरहेमा वा नतिजा उच्च, कम वा थप जाँच आवश्यक देखिएमा परामर्श लिनुहोस्। गम्भीर वा अचानक लक्षण भए तुरुन्त स्वास्थ्य सेवा लिनुहोस्।", safe:"जानकारीका लागि मात्र • रोग निदान होइन", noName:"मेडिकल रिपोर्ट", scanAgain:"अर्को रिपोर्ट स्क्यान" }
};

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const { lang } = useLang();
  const t = copy[lang];
  const router = useRouter();
  const [reports, setReports] = useState([]);
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");
    const frame = requestAnimationFrame(() => {
      try { setReports(JSON.parse(localStorage.getItem("reportscan_saved_reports") || "[]")); } catch { setReports([]); }
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, isAuthenticated, router]);
  const totals = useMemo(() => reports.reduce((acc, item) => {
    const counts = item.data?.statusCounts || {};
    acc.normal += Number(counts.normal || 0);
    acc.attention += Number(counts.high || 0) + Number(counts.low || 0) + Number(counts.needs_review || 0);
    return acc;
  }, { normal: 0, attention: 0 }), [reports]);
  if (loading || !isAuthenticated) return <div className="route-loading" aria-label="Loading" />;

  return <div className="dashboard-shell">
    <section className="dashboard-welcome">
      <div><p className="dashboard-kicker">{t.welcome}</p><h1>{t.hello}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1><p>{t.subtitle}</p></div>
      <Link href="/scan" className="dashboard-primary"><FilePlus2 size={19}/>{t.upload}</Link>
    </section>
    <section className="dashboard-stats" aria-label={t.welcome}>
      <article className="stat-card"><span className="stat-icon mint"><FileHeart size={21}/></span><div><small>{t.total}</small><strong>{reports.length}</strong></div></article>
      <article className="stat-card"><span className="stat-icon green"><CheckCircle2 size={21}/></span><div><small>{t.normal}</small><strong>{totals.normal}</strong></div></article>
      <article className="stat-card"><span className="stat-icon amber"><CircleAlert size={21}/></span><div><small>{t.attention}</small><strong>{totals.attention}</strong></div></article>
    </section>
    <div className="dashboard-grid">
      <section className="dashboard-panel report-history"><div className="panel-heading"><div><p className="panel-overline"><CalendarDays size={15}/>{t.history}</p><h2>{t.history}</h2></div>{reports.length > 0 && <Link href="/report/analysis" className="text-link">{t.viewAll}<ArrowUpRight size={16}/></Link>}</div>
        {reports.length ? <div className="history-list">{reports.slice(0,5).map((item) => <Link className="history-row" href="/report/analysis" key={item.reportId} onClick={() => { if (item.data) sessionStorage.setItem("reportscan_latest_analysis", JSON.stringify(item.data)); }}><span className="history-file"><FileHeart size={19}/></span><span className="history-name"><strong>{item.fileName || t.noName}</strong><small>{item.savedAt ? new Date(item.savedAt).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", { year:"numeric", month:"short", day:"numeric" }) : ""}</small></span><span className="history-arrow"><ArrowUpRight size={17}/></span></Link>)}</div> : <div className="history-empty"><span><FileHeart size={24}/></span><p>{t.noReports}</p><Link href="/scan" className="text-link">{t.start}<ArrowUpRight size={16}/></Link></div>}
      </section>
      <section className="dashboard-panel overview-panel"><div className="panel-heading"><div><p className="panel-overline"><Activity size={15}/>{t.trend}</p><h2>{t.trend}</h2></div></div>
        {reports.length ? <div className="mini-chart" role="img" aria-label={t.trend}><div className="chart-bars">{reports.slice(0,6).reverse().map((item, i) => { const c = item.data?.statusCounts || {}; const total = Math.max(1, (c.normal||0)+(c.high||0)+(c.low||0)+(c.needs_review||0)); const normal = Math.round((c.normal||0)/total*100); return <div className="chart-column" key={item.reportId}><div className="chart-track"><span className="chart-fill" style={{height:`${Math.max(8,normal)}%`}}/><span className="chart-attention" style={{height:`${Math.max(5,100-normal)}%`}}/></div><small>{i+1}</small></div>; })}</div><div className="chart-legend"><span><i className="legend-normal"/>{t.normal}</span><span><i className="legend-attention"/>{t.attention}</span></div></div> : <div className="chart-empty"><HeartPulse size={34}/><p>{t.noReports}</p></div>}
      </section>
      <section className="dashboard-panel guidance-panel"><div className="panel-heading"><div><p className="panel-overline"><CheckCircle2 size={15}/>{t.guidance}</p><h2>{t.guidance}</h2></div></div><ul className="guidance-list"><li>{t.guide1}</li><li>{t.guide2}</li><li>{t.guide3}</li></ul></section>
      <section className="doctor-card"><div className="doctor-icon"><Stethoscope size={22}/></div><div><h2>{t.doctor}</h2><p>{t.doctorText}</p></div><Link href="/report/analysis" aria-label={t.history}><ArrowUpRight size={18}/></Link></section>
    </div>
    <p className="dashboard-safe"><Activity size={15}/>{t.safe}</p>
    {reports.length > 0 && <Link href="/scan" className="dashboard-mobile-action"><FilePlus2 size={18}/>{t.scanAgain}</Link>}
  </div>;
}
