import { getCurrentUser, getUserLang, logout } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { User, Globe, Calendar, ShieldCheck, Trash2 } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const lang = await getUserLang();
  const isNe = lang === "ne";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-2">{isNe ? "प्रोफाइल" : "Profile"}</h1>
      <p className="text-slate-500 mb-8">{isNe ? "तपाईंको खाता जानकारी।" : "Your account information."}</p>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-8 md:p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-extrabold border-2 border-white/30">{user.firstName[0]}{user.lastName[0]}</div>
            <div>
              <h2 className="text-2xl font-extrabold">{user.firstName} {user.lastName}</h2>
              <p className="text-blue-100/80">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="p-8 grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">{isNe ? "भाषा" : "Language"}</h3>
            <div className="text-lg font-bold text-blue-950">{user.preferredLanguage === "ne" ? "नेपाली" : "English"}</div>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">{isNe ? "खाता निर्माण" : "Account Created"}</h3>
            <div className="text-lg font-bold text-blue-950">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">{isNe ? "रिपोर्टहरू" : "Reports"}</h3>
            <div className="text-lg font-bold text-blue-950">—</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <h3 className="font-extrabold text-blue-950 mb-3">{isNe ? "भाषा सेटिङ्स" : "Language Settings"}</h3>
          <div className="flex gap-3 mb-3">
            <form action={async () => {}} className="flex gap-2">
              <button type="button" className={`flex-1 py-2 rounded-xl text-sm font-bold border ${user.preferredLanguage === "en" ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}>English</button>
              <button type="button" className={`flex-1 py-2 rounded-xl text-sm font-bold border ${user.preferredLanguage === "ne" ? "bg-pink-500 text-white" : "bg-white text-slate-600"}`}>नेपाली</button>
            </form>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <h3 className="font-extrabold text-blue-950 mb-3">{isNe ? "गोपनीयता" : "Privacy"}</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> {isNe ? "आफ्ना रिपोर्टहरू मेटाउनुहोस्" : "Delete your reports anytime"}</li>
            <li className="flex items-center gap-2"><Trash2 size={16} className="text-red-500" /> {isNe ? "खाता मेटाउनुहोस्" : "Delete account"}</li>
          </ul>
        </div>
      </div>

      <form action={logout} className="max-w-xs">
        <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-3 rounded-2xl shadow-lg hover:scale-[1.02] transition-all">{isNe ? "लोग आउट" : "Log Out"}</button>
      </form>
    </div>
  );
}
