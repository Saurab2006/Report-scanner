"use client";

import Link from "next/link";
import Image from "next/image";
import { ScanLine, LogIn, UserPlus, LogOut, LayoutDashboard, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLang } from "./LanguageContext";
import { useAuth } from "./AuthContext";

export function Navigation() {
  const { lang, setLang } = useLang();
  const { user, isAuthenticated, logout } = useAuth();
  const isNe = lang === "ne";
  const router = useRouter();
  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <header className="app-header">
      <Link href="/" className="brand-link" aria-label="SwasthaScan home">
        <span className="brand-icon">
          <Image
            src="/swastha-logo.jpg"
            alt="SwasthaScan"
            width={34}
            height={34}
            className="rounded-lg object-contain"
          />
        </span>
        <span>
          <strong>SwasthaScan</strong>
          <small>{isNe ? "मेडिकल रिपोर्ट स्क्यानर" : "Scan • Understand • Stay Healthy"}</small>
        </span>
      </Link>

      <nav className="header-actions" aria-label="Main navigation">
        {isAuthenticated ? (
          <div className="user-profile-menu">
            <Link href="/dashboard" className="nav-item"><LayoutDashboard size={16}/><span>{isNe ? "ड्यासबोर्ड" : "Dashboard"}</span></Link>
            <Link href="/report/analysis" className="nav-item nav-history"><History size={16}/><span>{isNe ? "इतिहास" : "History"}</span></Link>
            <Link href="/scan" className="scan-link"><ScanLine size={16}/>{isNe ? "स्क्यान" : "Scan"}</Link>
            <div className="user-avatar-pill" title={user?.email}>
              <span className="user-initials" aria-hidden="true">{(user?.name || "U").trim().charAt(0).toUpperCase()}</span>
              <span className="user-name-label">{user?.name || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="logout-btn"
              title={isNe ? "लगआउट गर्नुहोस्" : "Log Out"}
            >
              <LogOut size={16} />
              <span className="hide-on-mobile">{isNe ? "बाहिरिनुहोस्" : "Logout"}</span>
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <Link href="/login" className="login-link">
              <LogIn size={15} />
              <span>{isNe ? "लगइन" : "Login"}</span>
            </Link>
            <Link href="/signup" className="signup-link">
              <UserPlus size={15} />
              <span>{isNe ? "साइन अप" : "Sign Up"}</span>
            </Link>
          </div>
        )}

        <div className="lang-toggle">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={lang === "ne" ? "active" : ""} onClick={() => setLang("ne")}>
            ने
          </button>
        </div>
      </nav>
    </header>
  );
}
