"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, AlertCircle, CheckCircle2, X } from "lucide-react";
import { AuthLayout, GoogleAuthButton } from "@/components/AuthLayout";
import { useAuth } from "@/components/AuthContext";
import { useLang } from "@/components/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const { lang } = useLang();
  const isNe = lang === "ne";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage(
        isNe
          ? "कृपया आफ्नो इमेल र पासवर्ड प्रविष्ट गर्नुहोस्।"
          : "Please provide both email and password."
      );
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(
        isNe
          ? "कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्।"
          : "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password, rememberMe);
      setSuccessMessage(
        isNe ? "लगइन सफल भयो! रिडिरेक्ट गर्दै..." : "Login successful! Redirecting..."
      );
      setTimeout(() => {
        router.push("/scan");
      }, 700);
    } catch (err) {
      setErrorMessage(
        isNe
          ? "लगइन गर्न सकिएन। कृपया विवरण जाँच गर्नुहोस्।"
          : (err?.message || "Failed to log in. Please check your credentials.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setErrorMessage("");
      await loginWithGoogle();
      setSuccessMessage(
        isNe ? "गुगल लगइन सफल भयो! रिडिरेक्ट गर्दै..." : "Google sign-in successful! Redirecting..."
      );
      setTimeout(() => {
        router.push("/scan");
      }, 700);
    } catch (err) {
      setErrorMessage(
        isNe ? "गुगल लगइन असफल भयो।" : "Google authentication failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    // Simulate reset link dispatch
    await new Promise((r) => setTimeout(r, 800));
    setForgotStatus(
      isNe
        ? "पासवर्ड रिसेट लिङ्क तपाईंको इमेलमा पठाइयो!"
        : "Password reset instructions have been sent to your email!"
    );
    setForgotLoading(false);
  };

  return (
    <AuthLayout activeTab="login">
      <div className="auth-form-container">
        {/* Form Title */}
        <div className="auth-heading-group">
          <h1 className="auth-title">{isNe ? "रिपोर्ट स्क्यान पोर्टल" : "Report Scan Portal"}</h1>
          <p className="auth-subtitle">
            {isNe ? "आफ्नो स्वास्थ्य रिपोर्ट जानकारी हेर्नुहोस्" : "Access your health report insights"}
          </p>
        </div>

        {/* Feedback Notices */}
        {errorMessage && (
          <div className="auth-alert error" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert success" role="status">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google Sign-in */}
        <GoogleAuthButton
          onClick={handleGoogleLogin}
          loading={googleLoading}
          text={isNe ? "गुगलबाट लगइन गर्नुहोस्" : "Sign in with Google"}
        />

        <div className="auth-divider">
          <span>{isNe ? "वा इमेलबाट लगइन गर्नुहोस्" : "or continue with email"}</span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="auth-form" noValidate>
          {/* Email field */}
          <div className="form-field-group">
            <label htmlFor="login-email" className="form-label">
              <Mail size={16} />
              <span>{isNe ? "इमेल ठेगाना" : "Email Address"}</span>
            </label>
            <div className="input-with-icon">
              <input
                id="login-email"
                type="email"
                placeholder={isNe ? "आफ्नो इमेल प्रविष्ट गर्नुहोस्" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-field-group">
            <label htmlFor="login-password" className="form-label">
              <Lock size={16} />
              <span>{isNe ? "पासवर्ड" : "Password"}</span>
            </label>
            <div className="input-with-icon">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder={isNe ? "आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="form-input has-action"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="form-options-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-label">{isNe ? "मलाई सम्झनुहोस्" : "Remember Me"}</span>
            </label>
            <button
              type="button"
              className="forgot-link-btn"
              onClick={() => {
                setForgotEmail(email);
                setForgotStatus("");
                setShowForgotModal(true);
              }}
            >
              {isNe ? "पासवर्ड बिर्सनुभयो?" : "Forgot Password?"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="auth-submit-btn"
          >
            {loading ? (
              <span className="btn-spinner-content">
                <span className="loading-spinner" />
                {isNe ? "प्रमाणीकरण गर्दै..." : "Logging in..."}
              </span>
            ) : (
              <span className="btn-label-content">
                <LogIn size={20} />
                <span>{isNe ? "लगइन गर्नुहोस्" : "Login"}</span>
                <ArrowRight size={18} className="btn-arrow-icon" />
              </span>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="auth-switch-link">
          <p>
            {isNe ? "खाता छैन? " : "Don't have an account? "}
            <Link href="/signup" className="highlight-link">
              {isNe ? "साइन अप गर्नुहोस्" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isNe ? "पासवर्ड रिसेट गर्नुहोस्" : "Reset Password"}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowForgotModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="modal-description">
              {isNe
                ? "तपाईंको इमेल प्रविष्ट गर्नुहोस् र हामी पासवर्ड रिसेट निर्देशनहरू पठाउनेछौं।"
                : "Enter your email address and we will send you instructions to reset your password."}
            </p>

            {forgotStatus ? (
              <div className="auth-alert success">
                <CheckCircle2 size={18} />
                <span>{forgotStatus}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="modal-form">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="auth-submit-btn compact"
                >
                  {forgotLoading
                    ? isNe
                      ? "पठाउँदै..."
                      : "Sending..."
                    : isNe
                    ? "रिसेट लिङ्क पठाउनुहोस्"
                    : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
