"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { AuthLayout, GoogleAuthButton } from "@/components/AuthLayout";
import { useAuth } from "@/components/AuthContext";
import { useLang } from "@/components/LanguageContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();
  const { lang } = useLang();
  const isNe = lang === "ne";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: isNe ? "कमजोर" : "Weak", color: "bg-red-500 text-red-600" };
    if (score <= 3) return { score: 2, label: isNe ? "मध्यम" : "Medium", color: "bg-amber-500 text-amber-600" };
    return { score: 3, label: isNe ? "बलियो" : "Strong", color: "bg-emerald-500 text-emerald-600" };
  };

  const strength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage(
        isNe
          ? "कृपया सबै आवश्यक विवरणहरू भर्नुहोस्।"
          : "Please complete all required fields."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(
        isNe
          ? "कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्।"
          : "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        isNe
          ? "पासवर्ड कम्तिमा ६ वर्ण लामो हुनुपर्छ।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        isNe
          ? "दुबै पासवर्ड मेल खाएनन्।"
          : "Passwords do not match. Please re-enter."
      );
      return;
    }

    if (!agreeTerms) {
      setErrorMessage(
        isNe
          ? "कृपया सेवाका सर्तहरू स्वीकार गर्नुहोस्।"
          : "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);
      await signup(fullName.trim(), email.trim(), password);
      setSuccessMessage(
        isNe
          ? "तपाईंको खाता सफलतापूर्वक सिर्जना भयो! रिडिरेक्ट गर्दै..."
          : "Account created successfully! Redirecting..."
      );
      setTimeout(() => {
        router.push("/scan");
      }, 700);
    } catch (err) {
      setErrorMessage(
        isNe
          ? "खाता सिर्जना गर्न सकिएन।"
          : (err?.message || "Failed to create account. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      setErrorMessage("");
      await loginWithGoogle();
      setSuccessMessage(
        isNe
          ? "गुगलबाट दर्ता सफल भयो! रिडिरेक्ट गर्दै..."
          : "Google sign-up successful! Redirecting..."
      );
      setTimeout(() => {
        router.push("/scan");
      }, 700);
    } catch (err) {
      setErrorMessage(
        isNe
          ? "गुगल दर्ता असफल भयो।"
          : "Google sign-up failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout activeTab="signup">
      <div className="auth-form-container">
        {/* Form Title */}
        <div className="auth-heading-group">
          <h1 className="auth-title">{isNe ? "नयाँ खाता सिर्जना गर्नुहोस्" : "Create Your Account"}</h1>
          <p className="auth-subtitle">
            {isNe
              ? "स्वास्थ्य रिपोर्ट सजिलै बुझ्न र व्यवस्थापन गर्न आजै जोडिनुहोस्"
              : "Start scanning and understanding your health reports"}
          </p>
        </div>

        {/* Feedback Alerts */}
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

        {/* Google Signup Button */}
        <GoogleAuthButton
          onClick={handleGoogleSignup}
          loading={googleLoading}
          text={isNe ? "गुगलबाट साइन अप गर्नुहोस्" : "Sign up with Google"}
        />

        <div className="auth-divider">
          <span>{isNe ? "वा इमेलबाट दर्ता गर्नुहोस्" : "or register with email"}</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSignup} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="form-field-group">
            <label htmlFor="signup-name" className="form-label">
              <User size={16} />
              <span>{isNe ? "पूरा नाम" : "Full Name"}</span>
            </label>
            <div className="input-with-icon">
              <input
                id="signup-name"
                type="text"
                placeholder={isNe ? "आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्" : "Enter your full name"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-field-group">
            <label htmlFor="signup-email" className="form-label">
              <Mail size={16} />
              <span>{isNe ? "इमेल ठेगाना" : "Email Address"}</span>
            </label>
            <div className="input-with-icon">
              <input
                id="signup-email"
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

          {/* Password */}
          <div className="form-field-group">
            <label htmlFor="signup-password" className="form-label">
              <Lock size={16} />
              <span>{isNe ? "पासवर्ड सिर्जना गर्नुहोस्" : "Password"}</span>
            </label>
            <div className="input-with-icon">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder={isNe ? "कम्तिमा ६ वर्ण भएको पासवर्ड" : "At least 6 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="password-strength-bar">
                <div className="strength-track">
                  <div
                    className={`strength-progress ${
                      strength.score === 1
                        ? "weak"
                        : strength.score === 2
                        ? "medium"
                        : "strong"
                    }`}
                    style={{ width: `${(strength.score / 3) * 100}%` }}
                  />
                </div>
                <span className="strength-text">
                  {isNe ? "सुरक्षा:" : "Strength:"} <strong>{strength.label}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-field-group">
            <label htmlFor="signup-confirm-password" className="form-label">
              <ShieldCheck size={16} />
              <span>{isNe ? "पासवर्ड पुष्टि गर्नुहोस्" : "Confirm Password"}</span>
            </label>
            <div className="input-with-icon">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={isNe ? "पासवर्ड पुनः प्रविष्ट गर्नुहोस्" : "Re-enter your password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="form-input has-action"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="form-options-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="checkbox-label text-xs">
                {isNe
                  ? "म SwasthaScan का सेवाका सर्तहरू र गोपनीयता नीति स्वीकार गर्दछु।"
                  : "I agree to SwasthaScan's Terms of Service and Privacy Policy."}
              </span>
            </label>
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
                {isNe ? "दर्ता गर्दै..." : "Creating Account..."}
              </span>
            ) : (
              <span className="btn-label-content">
                <span>{isNe ? "खाता सिर्जना गर्नुहोस् →" : "Create Account →"}</span>
              </span>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="auth-switch-link">
          <p>
            {isNe ? "पहिले नै खाता छ? " : "Already have an account? "}
            <Link href="/login" className="highlight-link">
              {isNe ? "लगइन गर्नुहोस्" : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
