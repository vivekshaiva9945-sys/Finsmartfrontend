"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api, clearStoredAuth, formatINR, getStoredToken, getStoredUser, getTenantSlug, setStoredAuth, setTenantSlug, toPaise, toRupees } from "../lib/api";
import { Language, t } from "../lib/i18n";
import { CountUp, AnimatedContent, BlurText, ClickSpark, DotGrid, ShinyText, SpotlightCard } from "../components/react-bits";
import {
  LayoutDashboard,
  PieChart,
  Target,
  Landmark,
  Bot,
  Calculator,
  ShieldCheck,
  User,
  ShieldAlert,
  Menu,
  X,
  Phone,
  Mail,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  PlusCircle,
} from "lucide-react";

type Tab =
  | "dashboard"
  | "budgets"
  | "goals"
  | "schemes"
  | "ai_assistant"
  | "calculators"
  | "learning"
  | "profile"
  | "admin";

interface UserSession {
  token: string;
  user_id: string;
  tenant_id: string;
  role: string;
  full_name: string;
  email: string;
}

export default function FinSmartApp() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("dashboard");
  const [tenant, setTenant] = useState<string>("public");
  const [language, setLanguage] = useState<Language>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize session and tenant from storage
  useEffect(() => {
    const savedTenant = getTenantSlug();
    setTenant(savedTenant);

    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (savedToken && savedUser) {
      setSession({ ...savedUser, token: savedToken });
    }

    const onAuthExpired = () => {
      setSession(null);
      setCurrentTab("dashboard");
    };

    window.addEventListener("finsmart_auth_expired", onAuthExpired);
    return () => window.removeEventListener("finsmart_auth_expired", onAuthExpired);
  }, []);

  // Dynamic Title & Meta Description per Tab / Page
  useEffect(() => {
    const metaDescriptions: Record<string, string> = {
      dashboard: "View real-time household cashflow, accounts balance, monthly expenses and savings rates.",
      budgets: "Set strict monthly spending limits with proactive overspend warnings and daily allowances.",
      goals: "Track goal-based savings milestones with target dates and recommended monthly allocations.",
      schemes: "Discover Central & Karnataka welfare schemes and scholarships matching your profile criteria.",
      ai_assistant: "Chat with FinSmart AI mentor for grounded financial literacy, budgeting tips, and fraud prevention.",
      calculators: "Calculate loan EMI, mutual fund SIP compounding, and recommended emergency funds.",
      learning: "Bilingual bite-sized modules on inflation, savings, cyber fraud shields, and interactive quizzes.",
      profile: "Manage demographic details and exercise your DPDP Act 2023 data rights and portability.",
      admin: "Aggregated, privacy-preserving institutional financial literacy metrics and compliance overview.",
    };

    const titles: Record<string, string> = {
      dashboard: "FinSmart - Financial Health Dashboard",
      budgets: "FinSmart - Budget Planner & Spending Limits",
      goals: "FinSmart - Savings Goals Tracker",
      schemes: "FinSmart - Welfare Schemes & Scholarships",
      ai_assistant: "FinSmart - AI Financial Mentor & Advisor",
      calculators: "FinSmart - Financial Calculators (EMI & SIP)",
      learning: "FinSmart - Financial Literacy & Fraud Shield",
      profile: "FinSmart - Profile & DPDP Privacy Center",
      admin: "FinSmart - Institutional Analytics Console",
    };

    const activeTitle = session
      ? titles[currentTab] || "FinSmart - Smart Financial Literacy & Budget Planner"
      : "FinSmart - Secure Login & Account Access";
    const activeDesc = session
      ? metaDescriptions[currentTab] || "Smart financial literacy and budget planner for the public."
      : "Sign in to FinSmart to track your household budget and explore government schemes.";

    document.title = activeTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", activeDesc);
  }, [session, currentTab]);

  const handleLoginSuccess = (data: any, remember: boolean = true) => {
    const u = {
      token: data.access_token,
      user_id: data.user_id,
      tenant_id: data.tenant_id,
      role: data.role,
      full_name: data.full_name,
      email: data.email,
    };
    setStoredAuth({ access_token: data.access_token, user: u }, remember);
    setSession(u);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    clearStoredAuth();
    setSession(null);
    setCurrentTab("dashboard");
  };

  const navItems = [
    { id: "dashboard", label: t(language, "navDashboard"), icon: <LayoutDashboard aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "budgets", label: t(language, "navBudgets"), icon: <PieChart aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "goals", label: t(language, "navGoals"), icon: <Target aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "schemes", label: t(language, "navSchemes"), icon: <Landmark aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "ai_assistant", label: t(language, "navAI"), icon: <Bot aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "calculators", label: t(language, "navCalculators"), icon: <Calculator aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "learning", label: t(language, "navLearn"), icon: <ShieldCheck aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    { id: "profile", label: t(language, "navProfile"), icon: <User aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> },
    ...((session?.role === "college_admin" || session?.role === "admin")
      ? [{ id: "admin", label: t(language, "navAdmin"), icon: <ShieldAlert aria-hidden="true" className="w-4 h-4 flex-shrink-0" /> }]
      : []),
  ];

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Top Header */}
      <header className="app-header">
        <div
          className="brand-section"
          onClick={() => {
            if (session) setCurrentTab("dashboard");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ cursor: "pointer", userSelect: "none" }}
          role="button"
          tabIndex={0}
          aria-label="FinSmart Home"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (session) setCurrentTab("dashboard");
            }
          }}
        >
          <div className="brand-logo">₹</div>
          <div>
            <div className="brand-title">FinSmart</div>
            <div className="brand-subtitle">{t(language, "brandSubtitle")}</div>
          </div>
        </div>

        <div className="header-controls">
          <select
            className="lang-select"
            aria-label="Select Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="en">English (EN)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
            <option value="hi">हिन्दी (HI)</option>
          </select>

          {session && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-agency">
                {session.full_name} ({session.role})
              </span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                {t(language, "signOut")}
              </button>
              {/* Mobile Menu Hamburger Toggle */}
              <button
                type="button"
                className="mobile-nav-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </header>

      <main id="main-content">
      {/* Main Authentication Flow if not logged in */}
      {!session ? (
        <AuthView tenant={tenant} language={language} onLoginSuccess={handleLoginSuccess} onTenantChange={(t) => setTenant(t)} />
      ) : (
        <>
          {/* Mobile Collapsible Navigation Drawer */}
          <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
            {navItems.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`mobile-nav-btn ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setCurrentTab(tab.id as Tab);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", color: isActive ? "var(--primary)" : "var(--text-muted)" }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Navigation Bar with Framer Motion Sliding Pill & Overflow Safeguard */}
          <nav
            className="nav-tabs desktop-nav-tabs"
            style={{
              position: "relative",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "8px",
              marginBottom: "24px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            {navItems.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`nav-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => setCurrentTab(tab.id as Tab)}
                  style={{
                    position: "relative",
                    background: "transparent",
                    color: isActive ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: isActive ? 600 : 500,
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0,
                    fontSize: "0.9375rem",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "var(--primary-light)",
                        borderRadius: "8px",
                        border: "1px solid var(--primary-border)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Active Tab View */}
          {currentTab === "dashboard" && <DashboardView session={session} language={language} />}
          {currentTab === "budgets" && <BudgetsView session={session} language={language} />}
          {currentTab === "goals" && <GoalsView session={session} language={language} />}
          {currentTab === "schemes" && <SchemesView session={session} language={language} />}
          {currentTab === "ai_assistant" && <AIAssistantView session={session} language={language} />}
          {currentTab === "calculators" && <CalculatorsView language={language} />}
          {currentTab === "learning" && <LearningView language={language} />}
          {currentTab === "profile" && <ProfileView session={session} language={language} onLogout={handleLogout} />}
          {currentTab === "admin" && (session.role === "college_admin" || session.role === "admin") && (
            <AdminView session={session} language={language} />
          )}
        </>
      )}
      </main>

      {/* Comprehensive Production Footer */}
      <footer className="app-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
              onClick={() => {
                if (session) setCurrentTab("dashboard");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="brand-logo" style={{ width: "32px", height: "32px", fontSize: "16px" }}>₹</div>
              <strong style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>FinSmart</strong>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, marginTop: "6px" }}>
              {t(language, "brandSubtitle")} — Empowering citizens, students, and households with transparent financial planning and government welfare discovery.
            </p>
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone aria-hidden="true" className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  Citizen Helpline:{" "}
                  <a href="tel:+918023456789" className="contact-link" aria-label="Call Helpline">
                    +91 (080) 2345-6789
                  </a>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail aria-hidden="true" className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  Support & Grievance:{" "}
                  <a href="mailto:support@finsmart.gov.in" className="contact-link" aria-label="Email Support">
                    support@finsmart.gov.in
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-title">Platform Features</div>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("dashboard");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <LayoutDashboard aria-hidden="true" className="w-4 h-4" /> Financial Dashboard
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("budgets");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <PieChart aria-hidden="true" className="w-4 h-4" /> Budget Planner & Alerts
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("goals");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Target aria-hidden="true" className="w-4 h-4" /> Savings Goals Tracker
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("schemes");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Landmark aria-hidden="true" className="w-4 h-4" /> Welfare Schemes Matcher
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("calculators");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Calculator aria-hidden="true" className="w-4 h-4" /> Financial Calculators
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("learning");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ShieldCheck aria-hidden="true" className="w-4 h-4" /> Fraud Shield & Literacy
            </button>
          </div>

          <div className="footer-col">
            <div className="footer-title">Governance & Privacy</div>
            <Link href="/privacy" className="footer-link">
              <ShieldCheck aria-hidden="true" className="w-4 h-4" /> Privacy Policy (DPDP 2023)
            </Link>
            <Link href="/terms" className="footer-link">
              <FileText aria-hidden="true" className="w-4 h-4" /> Terms & Educational Disclaimer
            </Link>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("profile");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Download aria-hidden="true" className="w-4 h-4" /> Right to Data Portability (DSAR)
            </button>
            <a
              href="https://www.rbi.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <ExternalLink aria-hidden="true" className="w-4 h-4" /> Reserve Bank of India (RBI)
            </a>
            <a
              href="https://scholarships.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <ExternalLink aria-hidden="true" className="w-4 h-4" /> National Scholarship Portal
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} FinSmart (Team LYNX, VTU). All rights reserved. •{" "}
            <Link href="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
              Privacy Policy
            </Link>{" "}
            •{" "}
            <Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
              Terms of Service
            </Link>
          </div>
          <div>
            Zero Speculative Trading Advice • Built for Public Financial Literacy
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// 1. Authentication View (Login & Register with Dynamic Translation)
// =============================================================================
function AuthView({
  tenant,
  language,
  onLoginSuccess,
  onTenantChange,
}: {
  tenant: string;
  language: Language;
  onLoginSuccess: (d: any, remember: boolean) => void;
  onTenantChange?: (t: string) => void;
}) {
  const [selectedTenant, setSelectedTenant] = useState(tenant || "public");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [consent, setConsent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please provide a valid email address (e.g. name@example.com).");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (honeypot) {
      setError("Automated submission detected.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        if (!fullName.trim() || fullName.trim().length < 2) {
          throw new Error("Full name must be at least 2 characters.");
        }
        if (!consent) {
          throw new Error("Explicit consent is legally required under India's DPDP Act 2023.");
        }
        const res = await api("/auth/register", {
          method: "POST",
          tenant: selectedTenant,
          body: {
            email: email.trim(),
            password,
            full_name: fullName.trim(),
            role,
            consent_data_processing: consent,
            honeypot: honeypot || undefined,
          },
        });
        setTenantSlug(selectedTenant);
        onLoginSuccess(res, rememberMe);
      } else {
        const res = await api("/auth/login", {
          method: "POST",
          tenant: selectedTenant,
          body: { email: email.trim(), password, honeypot: honeypot || undefined },
        });
        setTenantSlug(selectedTenant);
        onLoginSuccess(res, rememberMe);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "520px", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", position: "relative", overflow: "hidden" }}>
      <DotGrid dotColor="rgba(4, 120, 87, 0.05)" spacing={28} dotSize={1.5} />
      <AnimatedContent
        distance={20}
        direction="vertical"
        duration={0.3}
        style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}
      >
        <div
          className="ledger-card"
          style={{
            padding: "36px 32px",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "#ffffff",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ marginBottom: "6px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
              <BlurText text={mode === "login" ? t(language, "welcomeBack") : t(language, "createAccount")} animateBy="words" delay={25} />
            </h1>
          </div>
          <p className="card-description" style={{ marginBottom: "24px", color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5 }}>
            {mode === "login" ? t(language, "signInSubtitle") : t(language, "registerSubtitle")}
          </p>

          {error && (
            <div className="alert-banner alert-danger" role="alert" style={{ marginBottom: "16px" }}>
              <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Honeypot field for bot spam trap */}
            <div style={{ display: "none" }} aria-hidden="true">
              <label htmlFor="website_url">Website</label>
              <input
                id="website_url"
                name="website_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Institution / Portal Selector */}
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label htmlFor="auth-institution" className="form-label" style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                {t(language, "institution")}
              </label>
              <select
                id="auth-institution"
                name="tenant"
                className="fin-input"
                style={{ minHeight: "44px" }}
                value={selectedTenant}
                onChange={(e) => {
                  const tVal = e.target.value;
                  setSelectedTenant(tVal);
                  setTenantSlug(tVal);
                  onTenantChange?.(tVal);
                }}
              >
                <option value="public">{t(language, "portalPublic")}</option>
                <option value="navkis">{t(language, "portalNavkis")}</option>
                <option value="rvce">{t(language, "portalRvce")}</option>
              </select>
            </div>
            {mode === "register" && (
              <>
                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>{t(language, "fullName")}</label>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    className="fin-input"
                    style={{ minHeight: "44px" }}
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>{t(language, "role")}</label>
                  <select name="role" autoComplete="off" className="fin-input" style={{ minHeight: "44px" }} value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">{t(language, "student")}</option>
                    <option value="faculty">{t(language, "faculty")}</option>
                    <option value="admin">{t(language, "admin")}</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>{t(language, "email")}</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                required
                className="fin-input"
                style={{ minHeight: "44px" }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>{t(language, "password")}</label>
              <input
                type="password"
                name="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={8}
                className="fin-input"
                style={{ minHeight: "44px" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === "register" && (
              <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  id="dpdp-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ width: "18px", height: "18px", marginTop: "3px", flexShrink: 0 }}
                />
                <label htmlFor="dpdp-consent" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {t(language, "dpdpConsent")}
                </label>
              </div>
            )}

            {/* Session Persistence / Remember Me */}
            <div style={{ marginBottom: "18px", display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 }}
              />
              <label htmlFor="remember-me" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", cursor: "pointer", userSelect: "none" }}>
                {t(language, "rememberMe")}
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                minHeight: "48px",
                fontSize: "0.9375rem",
                fontWeight: 600,
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "1px solid var(--primary-dark)",
                borderRadius: "var(--radius-md)",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease",
              }}
              disabled={loading}
            >
              <ShinyText speed={4} disabled={loading}>
                {loading ? "…" : mode === "login" ? t(language, "signInBtn") : t(language, "registerBtn")}
              </ShinyText>
            </button>

            {mode === "login" && (
              <div style={{ marginTop: "14px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("vivekshaiva9945@gmail.com");
                    setPassword("vivek123");
                  }}
                  style={{
                    background: "var(--primary-light)",
                    border: "1px solid var(--primary-border)",
                    color: "var(--primary)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 16px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  Use Demo Account (vivekshaiva9945@gmail.com)
                </button>
              </div>
            )}
          </form>

          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.88rem" }}>
            {mode === "login" ? (
              <p>
                {t(language, "newHere")}{" "}
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer" }}
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                >
                  {t(language, "createAccountLink")}
                </button>
              </p>
            ) : (
              <p>
                {t(language, "haveAccount")}{" "}
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer" }}
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  {t(language, "signInLink")}
                </button>
              </p>
            )}
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 2. Dashboard View (Dynamic Translation)
// =============================================================================
function DashboardView({ session, language }: { session: UserSession; language: Language }) {
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Transaction Form State
  const [amountRupees, setAmountRupees] = useState("");
  const [kind, setKind] = useState<"DEBIT" | "CREDIT">("DEBIT");
  const [category, setCategory] = useState("food");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [description, setDescription] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, txRes, accRes, budRes] = await Promise.all([
        api("/transactions/summary"),
        api("/transactions/?limit=25"),
        api("/accounts/"),
        api("/budgets/status"),
      ]);
      setSummary(sumRes);
      setTransactions(txRes);
      setAccounts(accRes);
      setBudgetAlerts(budRes.filter((b: any) => b.level === "warning" || b.level === "over"));
      if (accRes.length > 0 && !selectedAccount) {
        setSelectedAccount(accRes[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const paise = toPaise(amountRupees);
    if (paise <= 0) {
      setError("Please enter an amount greater than ₹0.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api("/transactions/", {
        method: "POST",
        body: {
          amount_minor: paise,
          kind,
          category,
          payment_mode: paymentMode,
          description,
          account_id: selectedAccount || null,
        },
      });
      setAmountRupees("");
      setDescription("");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to record transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api(`/transactions/${id}`, { method: "DELETE" });
        await loadData();
      } catch (err: any) {
        alert(err.message || "Failed to delete.");
      }
    }
  };

  return (
    <div>
      {/* Overspend Alert Banners */}
      {budgetAlerts.map((b) => (
        <div key={b.category} className={`alert-banner ${b.level === "over" ? "alert-danger" : "alert-warning"}`}>
          <AlertTriangle aria-hidden="true" className="w-4 h-4 flex-shrink-0" style={{ display: "inline-block", marginRight: "6px" }} />
          <strong>Budget Alert:</strong> You have used {b.percent}% of your {b.category} budget ({formatINR(b.spent_minor)} of {formatINR(b.limit_minor)}).
        </div>
      ))}

      {error && (
        <div className="alert-banner alert-danger">
          <AlertCircle aria-hidden="true" className="w-4 h-4 flex-shrink-0" style={{ display: "inline-block", marginRight: "6px" }} />
          {error}
        </div>
      )}

      {/* 4-Metric Overview Cards with Staggered Entrance and CountUp */}
      <div className="stats-grid">
        <AnimatedContent distance={16} delay={0} duration={0.3}>
          <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={260} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
            <div
              className="stat-card"
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--primary-border)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div className="stat-label" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{t(language, "netBalance")}</div>
              <div className="stat-value tabular-nums" style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.02em", margin: "6px 0" }}>
                <CountUp
                  to={toRupees(summary ? summary.balance_minor : 0)}
                  prefix="₹"
                  decimals={2}
                  duration={0.5}
                />
              </div>
              <div className="stat-subtext" style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{t(language, "cumulativeCashflow")}</div>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={16} delay={0.06} duration={0.3}>
          <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={260} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
            <div
              className="stat-card"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div className="stat-label" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{t(language, "monthlyIncome")}</div>
              <div className="stat-value tabular-nums" style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--color-success)", letterSpacing: "-0.02em", margin: "6px 0" }}>
                <CountUp
                  to={toRupees(summary ? summary.income_minor : 0)}
                  prefix="+₹"
                  decimals={2}
                  duration={0.5}
                />
              </div>
              <div className="stat-subtext positive" style={{ fontSize: "0.8125rem" }}>{t(language, "totalCredits")}</div>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={16} delay={0.12} duration={0.3}>
          <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={260} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
            <div
              className="stat-card"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div className="stat-label" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{t(language, "monthlyExpenses")}</div>
              <div className="stat-value tabular-nums" style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--color-danger)", letterSpacing: "-0.02em", margin: "6px 0" }}>
                <CountUp
                  to={toRupees(summary ? summary.expense_minor : 0)}
                  prefix="-₹"
                  decimals={2}
                  duration={0.5}
                />
              </div>
              <div className="stat-subtext negative" style={{ fontSize: "0.8125rem" }}>{t(language, "totalDebits")}</div>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={16} delay={0.18} duration={0.3}>
          <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={260} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
            <div
              className="stat-card"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div className="stat-label" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{t(language, "savingsRate")}</div>
              <div className="stat-value tabular-nums" style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.02em", margin: "6px 0" }}>
                <CountUp
                  to={summary ? summary.savings_rate_pct : 0}
                  suffix="%"
                  decimals={1}
                  duration={0.5}
                />
              </div>
              <div className={`stat-subtext ${(summary?.savings_rate_pct || 0) >= 20 ? "positive" : "warning"}`} style={{ fontSize: "0.8125rem" }}>
                {(summary?.savings_rate_pct || 0) >= 20 ? t(language, "healthySavings") : t(language, "targetSavings")}
              </div>
            </div>
          </SpotlightCard>
        </AnimatedContent>
      </div>

      {/* Main Grid: Add Transaction & Category Breakdown with Animated Entrance & ClickSpark */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Quick Add Transaction Card */}
        <AnimatedContent distance={24} delay={0.32} duration={0.4}>
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header">
              <div>
                <div className="card-title">{t(language, "recordTransaction")}</div>
                <div className="card-description">{t(language, "recordSubtitle")}</div>
              </div>
            </div>

            <form onSubmit={handleAddTransaction}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">{t(language, "amount")}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="fin-input"
                    placeholder="e.g. 250.00"
                    value={amountRupees}
                    onChange={(e) => setAmountRupees(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t(language, "type")}</label>
                  <select className="fin-input" value={kind} onChange={(e) => setKind(e.target.value as any)}>
                    <option value="DEBIT">{t(language, "expense")}</option>
                    <option value="CREDIT">{t(language, "income")}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t(language, "category")}</label>
                  <select className="fin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="food">{t(language, "catFood")}</option>
                    <option value="education">{t(language, "catEducation")}</option>
                    <option value="books">{t(language, "catBooks")}</option>
                    <option value="rent">{t(language, "catRent")}</option>
                    <option value="travel">{t(language, "catTravel")}</option>
                    <option value="bills">{t(language, "catBills")}</option>
                    <option value="stipend">{t(language, "catStipend")}</option>
                    <option value="salary">{t(language, "catSalary")}</option>
                    <option value="other">{t(language, "catOther")}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t(language, "paymentMode")}</label>
                  <select className="fin-input" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK">Net Banking</option>
                    <option value="CARD">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label">{t(language, "noteDescription")}</label>
                <input
                  className="fin-input"
                  placeholder="e.g. Books, grocery, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <ClickSpark sparkColor="#047857" sparkCount={5} sparkRadius={24} duration={350} style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    minHeight: "48px",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  disabled={submitting}
                >
                  <PlusCircle aria-hidden="true" className="w-5 h-5" />
                  {submitting ? "…" : t(language, "addTransactionBtn")}
                </button>
              </ClickSpark>
            </form>
          </div>
        </AnimatedContent>

        {/* Category Expense Breakdown */}
        <AnimatedContent distance={24} delay={0.38} duration={0.4}>
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header">
              <div>
                <div className="card-title">{t(language, "spendingBreakdown")}</div>
                <div className="card-description">{t(language, "monthlyDistribution")}</div>
              </div>
            </div>

            {summary && summary.by_category.length > 0 ? (
              <div>
                {summary.by_category.map((cat: any) => (
                  <div key={cat.category} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600" }}>
                      <span style={{ textTransform: "capitalize" }}>{cat.category}</span>
                      <span>
                        {formatINR(cat.total_minor)} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar-container" style={{ margin: "4px 0" }}>
                      <div className="progress-bar-fill progress-ok" style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="animate-soft-pulse"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "36px 16px",
                  textAlign: "center",
                  background: "var(--bg-subtle)",
                  borderRadius: "12px",
                  border: "1px dashed var(--border-light)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <PieChart aria-hidden="true" className="w-5 h-5 text-emerald-700" />
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", fontWeight: 500 }}>
                  {t(language, "noTransactions")}
                </p>
              </div>
            )}
          </div>
        </AnimatedContent>
      </div>

      {/* Recent Transactions Ledger Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "recentTransactions")}</div>
            <div className="card-description">{t(language, "recentSubtitle")}</div>
          </div>
        </div>

        {transactions.length === 0 ? (
          <p style={{ color: "var(--text-muted)", padding: "16px 0" }}>{t(language, "noTransactions")}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t(language, "date")}</th>
                  <th>{t(language, "category")}</th>
                  <th>{t(language, "noteDescription")}</th>
                  <th>{t(language, "paymentMode")}</th>
                  <th style={{ textAlign: "right" }}>{t(language, "amount")}</th>
                  <th style={{ textAlign: "center" }}>{t(language, "action")}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tRow) => (
                  <tr key={tRow.id}>
                    <td>{tRow.occurred_on}</td>
                    <td>
                      <span className="badge badge-agency" style={{ textTransform: "capitalize" }}>
                        {tRow.category}
                      </span>
                    </td>
                    <td>{tRow.description || "—"}</td>
                    <td>{tRow.payment_mode}</td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "700",
                        color: tRow.kind === "CREDIT" ? "var(--color-success)" : "var(--text-main)",
                      }}
                    >
                      {tRow.kind === "CREDIT" ? "+" : "-"}
                      {formatINR(tRow.amount_minor)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--color-danger)" }}
                        onClick={() => handleDelete(tRow.id)}
                      >
                        {t(language, "delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// 3. Budgets View (Dynamic Translation)
// =============================================================================
function BudgetsView({ session, language }: { session: UserSession; language: Language }) {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [category, setCategory] = useState("food");
  const [limitRupees, setLimitRupees] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadBudgets = useCallback(async () => {
    try {
      const res = await api("/budgets/status");
      setBudgets(res);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const paise = toPaise(limitRupees);
    if (paise <= 0) {
      setFeedback({ type: "error", text: "Please enter a valid monthly limit greater than ₹0." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await api("/budgets/", {
        method: "PUT",
        body: { category, limit_minor: paise, period: "MONTHLY" },
      });
      setLimitRupees("");
      setFeedback({ type: "success", text: "Budget target saved and updated successfully." });
      setTimeout(() => setFeedback(null), 4000);
      await loadBudgets();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save budget." });
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDay - now.getDate());

  return (
    <div>
      <AnimatedContent distance={16} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "setMonthlyBudget")}</div>
              <div className="card-description">{t(language, "budgetSubtitle")}</div>
            </div>
          </div>

          {feedback && (
            <div className={`alert-banner alert-${feedback.type === "success" ? "success" : "danger"}`} style={{ marginBottom: "16px" }}>
              {feedback.type === "success" ? (
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              )}
              <div>{feedback.text}</div>
            </div>
          )}

          <form onSubmit={handleSaveBudget} className="form-grid" style={{ alignItems: "flex-end" }}>
            <div className="form-group">
              <label className="form-label">{t(language, "category")}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="food">{t(language, "catFood")}</option>
                <option value="education">{t(language, "catEducation")}</option>
                <option value="books">{t(language, "catBooks")}</option>
                <option value="rent">{t(language, "catRent")}</option>
                <option value="travel">{t(language, "catTravel")}</option>
                <option value="bills">{t(language, "catBills")}</option>
                <option value="other">{t(language, "catOther")}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t(language, "monthlyLimit")}</label>
              <input
                type="number"
                step="1"
                required
                placeholder="e.g. 5000"
                value={limitRupees}
                onChange={(e) => setLimitRupees(e.target.value)}
              />
            </div>

            <ClickSpark sparkColor="#047857" sparkCount={5}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "…" : t(language, "saveBudgetBtn")}
              </button>
            </ClickSpark>
          </form>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={16} delay={0.1} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "activeBudgets")}</div>
              <div className="card-description">
                {daysRemaining} {t(language, "daysRemainingText")}
              </div>
            </div>
          </div>

          {budgets.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "16px 0" }}>
              No category budgets created yet. Define your monthly targets above.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {budgets.map((b) => {
                const dailyAllowance = Math.max(0, Math.floor(b.remaining_minor / daysRemaining));
                return (
                  <SpotlightCard
                    key={b.category}
                    spotlightColor="rgba(4, 120, 87, 0.08)"
                    spotlightSize={240}
                    style={{ borderRadius: "var(--radius-lg)", marginBottom: 0 }}
                  >
                    <div
                      className="card"
                      style={{
                        marginBottom: 0,
                        height: "100%",
                        borderLeft: `5px solid ${
                          b.level === "over"
                            ? "var(--color-danger)"
                            : b.level === "warning"
                            ? "var(--color-warning)"
                            : "var(--color-success)"
                        }`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontSize: "1.05rem", textTransform: "capitalize" }}>{b.category}</strong>
                        <span
                          className={`badge ${
                            b.level === "over"
                              ? "badge-ineligible"
                              : b.level === "warning"
                              ? "badge-ineligible"
                              : "badge-eligible"
                          }`}
                        >
                          {b.percent}% {t(language, "used")}
                        </span>
                      </div>

                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar-fill ${
                            b.level === "over"
                              ? "progress-danger"
                              : b.level === "warning"
                              ? "progress-warning"
                              : "progress-ok"
                          }`}
                          style={{ width: `${Math.min(b.percent, 100)}%` }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                        <span>{t(language, "spent")}: {formatINR(b.spent_minor)}</span>
                        <span>{t(language, "limit")}: {formatINR(b.limit_minor)}</span>
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          paddingTop: "8px",
                          borderTop: "1px solid var(--border-light)",
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{t(language, "remaining")}: {formatINR(b.remaining_minor)}</span>
                        <span>
                          {t(language, "dailySafeAllowance")}: <strong>{formatINR(dailyAllowance)}/day</strong>
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 4. Savings Goals View (Dynamic Translation)
// =============================================================================
function GoalsView({ session, language }: { session: UserSession; language: Language }) {
  const [goals, setGoals] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [targetRupees, setTargetRupees] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState("Emergency Fund");
  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      const res = await api("/goals/");
      setGoals(res);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const paise = toPaise(targetRupees);
    if (!name.trim() || paise <= 0) {
      setFeedback({ type: "error", text: "Please provide a valid goal name and target amount greater than ₹0." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await api("/goals/", {
        method: "POST",
        body: {
          name,
          target_minor: paise,
          target_date: targetDate || null,
          category,
        },
      });
      setName("");
      setTargetRupees("");
      setTargetDate("");
      setFeedback({ type: "success", text: "New milestone goal created successfully." });
      setTimeout(() => setFeedback(null), 4000);
      await loadGoals();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to create goal." });
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (goalId: string) => {
    const amtStr = depositAmounts[goalId];
    const paise = toPaise(amtStr);
    if (paise <= 0) {
      setFeedback({ type: "error", text: "Please enter a contribution amount greater than ₹0." });
      return;
    }

    setFeedback(null);
    try {
      await api(`/goals/${goalId}/contribute`, {
        method: "POST",
        body: { amount_minor: paise },
      });
      setDepositAmounts({ ...depositAmounts, [goalId]: "" });
      setFeedback({ type: "success", text: "Contribution recorded towards goal progress." });
      setTimeout(() => setFeedback(null), 4000);
      await loadGoals();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to contribute." });
    }
  };

  return (
    <div>
      {/* Create New Goal Card */}
      <AnimatedContent distance={16} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "createGoal")}</div>
              <div className="card-description">{t(language, "goalSubtitle")}</div>
            </div>
          </div>

          {feedback && (
            <div className={`alert-banner alert-${feedback.type === "success" ? "success" : "danger"}`} style={{ marginBottom: "16px" }}>
              {feedback.type === "success" ? (
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              )}
              <div>{feedback.text}</div>
            </div>
          )}

          <form onSubmit={handleCreateGoal}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t(language, "goalTitle")}</label>
                <input
                  required
                  placeholder="e.g. Next Semester Tuition Buffer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t(language, "targetAmount")}</label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 20000"
                  value={targetRupees}
                  onChange={(e) => setTargetRupees(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t(language, "targetDate")}</label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">{t(language, "category")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Education">College / Tuition Fees</option>
                  <option value="Gadgets">Laptop / Device</option>
                  <option value="Certification">Skill Certification</option>
                  <option value="Travel">Family / Travel</option>
                </select>
              </div>
            </div>

            <ClickSpark sparkColor="#047857" sparkCount={5}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "…" : t(language, "setGoalBtn")}
              </button>
            </ClickSpark>
          </form>
        </div>
      </AnimatedContent>

      {/* Goal Cards Grid */}
      <AnimatedContent distance={16} delay={0.1} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">{t(language, "yourMilestones")}</div>
          </div>

          {goals.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "16px 0" }}>
              No savings goals currently active. Create your first goal above!
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              {goals.map((g) => (
                <SpotlightCard
                  key={g.id}
                  spotlightColor="rgba(4, 120, 87, 0.08)"
                  spotlightSize={240}
                  style={{ borderRadius: "var(--radius-lg)", marginBottom: 0 }}
                >
                  <div className="card" style={{ marginBottom: 0, height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <strong style={{ fontSize: "1.1rem" }}>{g.name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{g.category}</div>
                      </div>
                      <span className={`badge ${g.is_completed ? "badge-eligible" : "badge-agency"}`}>
                        {g.is_completed ? t(language, "achieved") : `${g.percent}%`}
                      </span>
                    </div>

                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar-fill ${g.is_completed ? "progress-ok" : "progress-ok"}`}
                        style={{ width: `${g.percent}%` }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600" }}>
                      <span>
                        {t(language, "saved")}:{" "}
                        <CountUp to={toRupees(g.saved_minor)} prefix="₹" decimals={2} duration={0.4} />
                      </span>
                      <span>
                        {t(language, "target")}:{" "}
                        <CountUp to={toRupees(g.target_minor)} prefix="₹" decimals={2} duration={0.4} />
                      </span>
                    </div>

                    {g.monthly_recommended_minor && !g.is_completed && (
                      <div style={{ fontSize: "0.78rem", color: "var(--primary)", marginTop: "6px" }}>
                        Save <strong>{formatINR(g.monthly_recommended_minor)}/month</strong> to reach goal by {g.target_date}.
                      </div>
                    )}

                    {!g.is_completed && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                        <input
                          type="number"
                          step="1"
                          placeholder="Amount ₹…"
                          aria-label="Contribution amount in Rupees"
                          value={depositAmounts[g.id] || ""}
                          onChange={(e) => setDepositAmounts({ ...depositAmounts, [g.id]: e.target.value })}
                        />
                        <ClickSpark sparkColor="#047857" sparkCount={5}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleContribute(g.id)}>
                            {t(language, "depositBtn")}
                          </button>
                        </ClickSpark>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 5. Government Schemes & Eligibility Engine (Dynamic Translation)
// =============================================================================
function SchemesView({ session, language }: { session: UserSession; language: Language }) {
  const [profile, setProfile] = useState<any>({
    age: "20",
    is_student: "yes",
    annual_family_income: "180000",
    social_category: "OBC",
    state: "Karnataka",
    has_bank_account: "yes",
    has_disability: "no",
  });
  const [schemes, setSchemes] = useState<any[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const runEvaluation = async () => {
    setEvaluating(true);
    setFeedback(null);
    try {
      const res = await api("/schemes/eligibility", {
        method: "POST",
        body: {
          age: profile.age ? parseInt(profile.age) : null,
          is_student: profile.is_student === "yes",
          annual_family_income: profile.annual_family_income ? parseInt(profile.annual_family_income) : null,
          social_category: profile.social_category || null,
          state: profile.state,
          has_bank_account: profile.has_bank_account === "yes",
          has_disability: profile.has_disability === "yes",
        },
      });
      setSchemes(res);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to evaluate scheme eligibility." });
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, []);

  return (
    <div>
      {/* Criteria Profiler Card */}
      <AnimatedContent distance={16} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "schemeMatcher")}</div>
              <div className="card-description">{t(language, "schemeSubtitle")}</div>
            </div>
          </div>

          {feedback && (
            <div className={`alert-banner alert-${feedback.type === "success" ? "success" : "danger"}`} style={{ marginBottom: "16px" }}>
              {feedback.type === "success" ? (
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              )}
              <div>{feedback.text}</div>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{t(language, "age")}</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t(language, "currentlyStudent")}</label>
              <select
                value={profile.is_student}
                onChange={(e) => setProfile({ ...profile, is_student: e.target.value })}
              >
                <option value="yes">{t(language, "yes")}</option>
                <option value="no">{t(language, "no")}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t(language, "annualIncome")}</label>
              <input
                type="number"
                value={profile.annual_family_income}
                onChange={(e) => setProfile({ ...profile, annual_family_income: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t(language, "socialCategory")}</label>
              <select
                value={profile.social_category}
                onChange={(e) => setProfile({ ...profile, social_category: e.target.value })}
              >
                <option value="GEN">General (GEN)</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t(language, "stateDomicile")}</label>
              <input
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                placeholder="e.g. Karnataka"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t(language, "hasBank")}</label>
              <select
                value={profile.has_bank_account}
                onChange={(e) => setProfile({ ...profile, has_bank_account: e.target.value })}
              >
                <option value="yes">{t(language, "yes")}</option>
                <option value="no">{t(language, "no")}</option>
              </select>
            </div>
          </div>

          <ClickSpark sparkColor="#047857" sparkCount={5}>
            <button className="btn btn-primary" onClick={runEvaluation} disabled={evaluating}>
              {evaluating ? t(language, "evaluatingBtn") : t(language, "checkEligibilityBtn")}
            </button>
          </ClickSpark>
        </div>
      </AnimatedContent>

      {/* Matched Schemes List */}
      <AnimatedContent distance={16} delay={0.1} duration={0.3}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "14px" }}>
            {t(language, "evaluatedSchemes")} ({schemes.filter((s) => s.eligible).length} {t(language, "likelyEligibleCount")})
          </h3>

          {schemes.map((s) => {
            const isExpanded = expandedCode === s.code;
            const displayTitle = language === "kn" && s.title_kn ? s.title_kn : language === "hi" && s.title_hi ? s.title_hi : s.title_en;

            return (
              <SpotlightCard
                key={s.code}
                spotlightColor={s.eligible ? "rgba(4, 120, 87, 0.08)" : "rgba(100, 116, 139, 0.05)"}
                spotlightSize={280}
                style={{ borderRadius: "var(--radius-lg)", marginBottom: "14px" }}
              >
                <div className={`scheme-card ${s.eligible ? "eligible" : "ineligible"}`} style={{ marginBottom: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <h4 style={{ fontSize: "1.15rem", fontWeight: "800" }}>{displayTitle}</h4>
                        <span className="badge badge-agency">{s.category}</span>
                        <span className="badge badge-agency">{s.agency}</span>
                      </div>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "4px" }}>{s.summary}</p>
                    </div>

                    <span className={`badge ${s.eligible ? "badge-eligible" : "badge-ineligible"}`}>
                      {s.eligible ? t(language, "likelyEligible") : t(language, "criteriaNotMatched")}
                    </span>
                  </div>

                  {/* Explainable Reasons */}
                  <div style={{ marginTop: "12px", background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px", color: "var(--text-muted)" }}>
                      EXPLAINABLE EVALUATION CLAUSES:
                    </div>
                    <ul style={{ paddingLeft: "18px", fontSize: "0.85rem", lineHeight: "1.6" }}>
                      {s.reasons.map((r: string, idx: number) => (
                        <li key={idx} style={{ color: r.startsWith("Criteria satisfied") ? "var(--color-success)" : "var(--color-warning)" }}>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Toggle Details Button */}
                  <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setExpandedCode(isExpanded ? null : s.code)}
                    >
                      {isExpanded ? t(language, "hideGuide") : t(language, "viewGuide")}
                    </button>

                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      {t(language, "officialPortal")}
                    </a>
                  </div>

                  {/* Expandable Application Guide & Document Checklist */}
                  {isExpanded && (
                    <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-light)" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <strong style={{ fontSize: "0.9rem" }}>{t(language, "keyBenefits")}</strong>
                        <p style={{ fontSize: "0.86rem", color: "var(--text-main)", marginTop: "2px" }}>{s.benefits}</p>
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <strong style={{ fontSize: "0.9rem" }}>{t(language, "requiredDocs")}</strong>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px", marginTop: "6px" }}>
                          {s.documents_required.map((doc: string, idx: number) => (
                            <label key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.85rem", background: "#f8fafc", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                              <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                              {doc}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong style={{ fontSize: "0.9rem" }}>{t(language, "applicationWalkthrough")}</strong>
                        <ol style={{ paddingLeft: "20px", fontSize: "0.86rem", marginTop: "6px", lineHeight: "1.6" }}>
                          {s.application_steps.map((step: string, idx: number) => (
                            <li key={idx} style={{ marginBottom: "4px" }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 6. FinSmart AI Assistant (Dynamic Translation)
// =============================================================================
function AIAssistantView({ session, language }: { session: UserSession; language: Language }) {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; citations?: any[] }>>([
    {
      sender: "bot",
      text:
        language === "kn"
          ? "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಫಿನ್‌ಸ್ಮಾರ್ಟ್ AI ಹಣಕಾಸು ಮಾರ್ಗದರ್ಶಿ. ಬಜೆಟ್, ವಿದ್ಯಾರ್ಥಿವೇತನ, ಸಾಲದ ಸುರಕ್ಷತೆ ಮತ್ತು ತುರ್ತು ನಿಧಿಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು. ನಿಮ್ಮ ಆಧಾರ್, ಪಾನ್ ಮತ್ತು ಫೋನ್ ವಿವರಗಳನ್ನು ಗೌಪ್ಯವಾಗಿ ರಕ್ಷಿಸಲಾಗಿದೆ."
          : language === "hi"
          ? "नमस्ते! मैं आपका फिनस्मार्ट AI वित्तीय सलाहकार हूँ। आप बजट, छात्रवृत्ति, ऋण सुरक्षा और आपातकालीन फंड के बारे में कुछ भी पूछ सकते हैं। आपकी व्यक्तिगत जानकारी पूरी तरह सुरक्षित है।"
          : "Hello! I am your FinSmart AI Financial Mentor. I can assist you with budgeting rules, scholarship eligibility, loan cyber safety, and emergency funds. Your sensitive details (Aadhaar, PAN, phone) are automatically redacted for privacy.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts =
    language === "kn"
      ? [
          "ವಿದ್ಯಾರ್ಥಿ ಬಜೆಟ್‌ನಲ್ಲಿ ತುರ್ತು ನಿಧಿ ನಿರ್ಮಿಸುವುದು ಹೇಗೆ?",
          "ಕರ್ನಾಟಕದಲ್ಲಿ ಎಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಯಾವ ಸ್ಕಾಲರ್‌ಶಿಪ್‌ಗಳಿವೆ?",
          "ನಕಲಿ ಸಾಲದ ಆ್ಯಪ್‌ಗಳನ್ನು ಗುರುತಿಸುವುದು ಹೇಗೆ?",
          "50/30/20 ಬಜೆಟ್ ನಿಯಮವನ್ನು ವಿವರಿಸಿ",
        ]
      : language === "hi"
      ? [
          "छात्र बजट पर आपातकालीन फंड कैसे बनाएं?",
          "कर्नाटक में कौन सी छात्रवृत्तियां उपलब्ध हैं?",
          "फर्जी लोन ऐप्स की पहचान कैसे करें?",
          "50/30/20 बजट नियम क्या है?",
        ]
      : [
          "How do I build an emergency fund on a student budget?",
          "Which scholarships can I apply for in Karnataka?",
          "How do I spot fake instant loan apps?",
          "Explain the 50/30/20 budgeting rule",
        ];

  const handleSend = async (textToSend: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg = { sender: "user" as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api("/ai/chat", {
        method: "POST",
        body: { message: q, language },
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.reply,
          citations: res.citations,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I am temporarily unable to answer. Please refer to official guidelines under the Schemes and Learn tabs.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{t(language, "aiMentorTitle")}</div>
          <div className="card-description">{t(language, "aiSubtitle")}</div>
        </div>
        <span className="badge badge-eligible">{t(language, "piiActive")}</span>
      </div>

      {/* Sample Query Chips */}
      <div className="chip-group">
        {samplePrompts.map((p, idx) => (
          <button key={idx} className="chip" onClick={() => handleSend(p)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <HelpCircle aria-hidden="true" className="w-3.5 h-3.5 text-emerald-700" />
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>
              <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>
              {m.citations && m.citations.length > 0 && (
                <div style={{ marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "6px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: "700", textTransform: "uppercase" }}>Sources:</div>
                  {m.citations.map((c: any, cIdx: number) => (
                    <div key={cIdx} className="chat-citation">
                      <strong>{c.title}</strong> — {c.source}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot">
              <em>Thinking…</em>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="chat-input-row">
          <input
            aria-label={t(language, "askPlaceholder")}
            placeholder={t(language, "askPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          />
          <ClickSpark sparkColor="#047857" sparkCount={5}>
            <button className="btn btn-primary" onClick={() => handleSend(input)} disabled={loading}>
              {t(language, "sendBtn")}
            </button>
          </ClickSpark>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 7. Financial Calculators View (Dynamic Translation)
// =============================================================================
function CalculatorsView({ language }: { language: Language }) {
  const [calcType, setCalcType] = useState<"emi" | "sip" | "emergency">("emi");

  // EMI State
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("11.5");
  const [tenureMonths, setTenureMonths] = useState("24");
  const [emiResult, setEmiResult] = useState<any>(null);

  // SIP State
  const [sipMonthly, setSipMonthly] = useState("2500");
  const [sipRate, setSipRate] = useState("12");
  const [sipMonths, setSipMonths] = useState("36");
  const [sipResult, setSipResult] = useState<any>(null);

  // Emergency Fund State
  const [expenses, setExpenses] = useState("15000");
  const [targetBuffer, setTargetBuffer] = useState("6");
  const [emergencyResult, setEmergencyResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const calculateEMI = async () => {
    setFeedback(null);
    try {
      const res = await api("/calc/emi", {
        method: "POST",
        body: { principal: parseFloat(principal), annual_rate: parseFloat(rate), months: parseInt(tenureMonths) },
      });
      setEmiResult(res);
    } catch (e: any) {
      setFeedback({ type: "error", text: e.message || "Failed to calculate EMI." });
    }
  };

  const calculateSIP = async () => {
    setFeedback(null);
    try {
      const res = await api("/calc/sip", {
        method: "POST",
        body: { monthly: parseFloat(sipMonthly), annual_rate: parseFloat(sipRate), months: parseInt(sipMonths) },
      });
      setSipResult(res);
    } catch (e: any) {
      setFeedback({ type: "error", text: e.message || "Failed to calculate SIP." });
    }
  };

  const calculateEmergency = async () => {
    setFeedback(null);
    try {
      const res = await api("/calc/emergency-fund", {
        method: "POST",
        body: { monthly_expenses: parseFloat(expenses), target_months: parseInt(targetBuffer) },
      });
      setEmergencyResult(res);
    } catch (e: any) {
      setFeedback({ type: "error", text: e.message || "Failed to calculate Emergency Fund." });
    }
  };

  return (
    <div>
      <AnimatedContent distance={16} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "calcTitle")}</div>
              <div className="card-description">{t(language, "calcSubtitle")}</div>
            </div>
          </div>

          {feedback && (
            <div className={`alert-banner alert-${feedback.type === "success" ? "success" : "danger"}`} style={{ marginBottom: "16px" }}>
              {feedback.type === "success" ? (
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              )}
              <div>{feedback.text}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            <button
              className={`btn ${calcType === "emi" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setCalcType("emi")}
            >
              {t(language, "loanEmi")}
            </button>
            <button
              className={`btn ${calcType === "sip" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setCalcType("sip")}
            >
              {t(language, "sipWealth")}
            </button>
            <button
              className={`btn ${calcType === "emergency" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setCalcType("emergency")}
            >
              {t(language, "emergencyFund")}
            </button>
          </div>

          {/* EMI Calculator */}
          {calcType === "emi" && (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Loan Amount (₹)</label>
                  <input value={principal} onChange={(e) => setPrincipal(e.target.value)} type="number" />
                </div>
                <div className="form-group">
                  <label className="form-label">Annual Interest Rate (%)</label>
                  <input value={rate} onChange={(e) => setRate(e.target.value)} type="number" step="0.1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenure (Months)</label>
                  <input value={tenureMonths} onChange={(e) => setTenureMonths(e.target.value)} type="number" />
                </div>
              </div>
              <ClickSpark sparkColor="#047857" sparkCount={5}>
                <button className="btn btn-primary" onClick={calculateEMI}>
                  {t(language, "calcEmiBtn")}
                </button>
              </ClickSpark>

              {emiResult && (
                <AnimatedContent distance={12} duration={0.3}>
                  <div className="stats-grid" style={{ marginTop: "20px" }}>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Monthly EMI</div>
                        <div className="stat-value tabular-nums">
                          <CountUp to={emiResult.monthly_emi} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard spotlightColor="rgba(220, 38, 38, 0.06)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Total Interest</div>
                        <div className="stat-value tabular-nums" style={{ color: "var(--color-danger)" }}>
                          <CountUp to={emiResult.total_interest} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Total Payable</div>
                        <div className="stat-value tabular-nums">
                          <CountUp to={emiResult.total_payable} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </AnimatedContent>
              )}
            </div>
          )}

          {/* SIP Calculator */}
          {calcType === "sip" && (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Monthly Investment (₹)</label>
                  <input value={sipMonthly} onChange={(e) => setSipMonthly(e.target.value)} type="number" />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Return (% p.a.)</label>
                  <input value={sipRate} onChange={(e) => setSipRate(e.target.value)} type="number" step="0.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (Months)</label>
                  <input value={sipMonths} onChange={(e) => setSipMonths(e.target.value)} type="number" />
                </div>
              </div>
              <ClickSpark sparkColor="#047857" sparkCount={5}>
                <button className="btn btn-primary" onClick={calculateSIP}>
                  {t(language, "calcSipBtn")}
                </button>
              </ClickSpark>

              {sipResult && (
                <AnimatedContent distance={12} duration={0.3}>
                  <div className="stats-grid" style={{ marginTop: "20px" }}>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Invested Amount</div>
                        <div className="stat-value tabular-nums">
                          <CountUp to={sipResult.total_invested} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Estimated Wealth Gain</div>
                        <div className="stat-value tabular-nums" style={{ color: "var(--color-success)" }}>
                          +<CountUp to={sipResult.wealth_gain} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Total Expected Corpus</div>
                        <div className="stat-value tabular-nums" style={{ color: "var(--primary)" }}>
                          <CountUp to={sipResult.future_value} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </AnimatedContent>
              )}
            </div>
          )}

          {/* Emergency Fund Calculator */}
          {calcType === "emergency" && (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Monthly Living Expenses (₹)</label>
                  <input value={expenses} onChange={(e) => setExpenses(e.target.value)} type="number" />
                </div>
                <div className="form-group">
                  <label className="form-label">Buffer Months</label>
                  <select value={targetBuffer} onChange={(e) => setTargetBuffer(e.target.value)}>
                    <option value="3">3 Months (Minimum)</option>
                    <option value="6">6 Months (Recommended)</option>
                    <option value="9">9 Months (Conservative)</option>
                  </select>
                </div>
              </div>
              <ClickSpark sparkColor="#047857" sparkCount={5}>
                <button className="btn btn-primary" onClick={calculateEmergency}>
                  {t(language, "calcEmergencyBtn")}
                </button>
              </ClickSpark>

              {emergencyResult && (
                <AnimatedContent distance={12} duration={0.3}>
                  <div className="stats-grid" style={{ marginTop: "20px" }}>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Recommended Reserve</div>
                        <div className="stat-value tabular-nums" style={{ color: "var(--primary)" }}>
                          <CountUp to={emergencyResult.recommended_fund} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)" }}>
                      <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                        <div className="stat-label">Minimum Safe Reserve</div>
                        <div className="stat-value tabular-nums">
                          <CountUp to={emergencyResult.minimum_safe_fund} prefix="₹" decimals={2} duration={0.4} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </AnimatedContent>
              )}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 8. Financial Literacy & Cyber Fraud Shield View (Vernacular & Quizzes)
// =============================================================================
function LearningView({ language }: { language: Language }) {
  const [modules, setModules] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<Record<number, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api(`/learning/?lang=${language}`).then(setModules).catch(console.error);
  }, [language]);

  const handleQuizSubmit = async (moduleId: number) => {
    const selected = quizAnswers[moduleId];
    if (selected === undefined) {
      setError("Please select an answer option before checking.");
      return;
    }

    setError(null);
    try {
      const res = await api("/learning/quiz/submit", {
        method: "POST",
        body: { module_id: moduleId, selected_option_index: selected },
      });
      setQuizResults({ ...quizResults, [moduleId]: res });
    } catch (err: any) {
      setError(err.message || "Failed to submit quiz.");
    }
  };

  return (
    <div>
      <AnimatedContent distance={16} duration={0.3}>
        {/* Cyber Fraud Alert Bar */}
        <div
          className="alert-banner alert-warning"
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "14px 18px",
            borderRadius: "var(--radius-md)",
          }}
        >
          <ShieldAlert aria-hidden="true" className="w-5 h-5 flex-shrink-0 text-amber-700 mt-0.5" />
          <div style={{ fontSize: "0.875rem", lineHeight: 1.5, color: "var(--color-warning)" }}>
            {t(language, "cyberAlert")}
          </div>
        </div>

        {error && (
          <div className="alert-banner alert-danger" style={{ marginBottom: "16px" }}>
            <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "learnTitle")}</div>
              <div className="card-description">{t(language, "learnSubtitle")}</div>
            </div>
          </div>

          {modules.map((m) => {
            const q = m.quiz && m.quiz.length > 0 ? m.quiz[0] : null;
            const result = quizResults[m.id];

            return (
              <SpotlightCard
                key={m.id}
                spotlightColor="rgba(4, 120, 87, 0.05)"
                spotlightSize={260}
                style={{ borderRadius: "var(--radius-lg)", marginBottom: "16px" }}
              >
                <div className="card" style={{ background: "#fafafa", marginBottom: 0 }}>
                  <span className="badge badge-agency">{m.category}</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginTop: "8px", marginBottom: "8px" }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: "0.92rem", lineHeight: "1.6", color: "var(--text-main)" }}>{m.body}</p>

                  {/* Interactive Module Quiz */}
                  {q && (
                    <div style={{ marginTop: "16px", padding: "14px", background: "white", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                      <strong style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        Knowledge Check: {q.question}
                      </strong>
                      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {q.options.map((opt: string, optIdx: number) => (
                          <label key={optIdx} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.88rem", cursor: "pointer" }}>
                            <input
                              type="radio"
                              name={`quiz-${m.id}`}
                              checked={quizAnswers[m.id] === optIdx}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [m.id]: optIdx })}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>

                      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <ClickSpark sparkColor="#047857" sparkCount={5}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleQuizSubmit(m.id)}>
                            {t(language, "checkAnswerBtn")}
                          </button>
                        </ClickSpark>
                        {result && (
                          <span style={{ fontSize: "0.86rem", fontWeight: "700", color: result.is_correct ? "var(--color-success)" : "var(--color-danger)" }}>
                            {result.is_correct ? "Correct! " : "Incorrect. "} {result.explanation}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 9. Profile & DPDP 2023 Privacy Center View (Dynamic Translation)
// =============================================================================
function ProfileView({ session, language, onLogout }: { session: UserSession; language: Language; onLogout: () => void }) {
  const [profile, setProfile] = useState<any>({
    age: 20,
    gender: "male",
    state: "Karnataka",
    district: "Hassan",
    annual_family_income_minor: 18000000,
    social_category: "OBC",
    has_bank_account: true,
  });
  const [consents, setConsents] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api("/profiles/").then((p) => p && setProfile(p)).catch(console.error);
    api("/consents/").then(setConsents).catch(console.error);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError(null);
    try {
      await api("/profiles/", {
        method: "PUT",
        body: profile,
      });
      setMsg("Profile details updated successfully.");
      setTimeout(() => setMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadDSAR = async () => {
    setError(null);
    try {
      const data = await api("/profiles/dsar-export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finsmart_data_export_${session.user_id}.json`;
      a.click();
      setMsg("Statutory DSAR personal data export downloaded successfully.");
      setTimeout(() => setMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to export data.");
    }
  };

  const handleErasure = async () => {
    if (confirm("WARNING: Right to be Forgotten (India DPDP Act 2023). This will permanently delete your account, ledger transactions, and profile. Proceed?")) {
      setError(null);
      try {
        await api("/profiles/erasure", { method: "DELETE" });
        onLogout();
      } catch (err: any) {
        setError(err.message || "Failed to erase data.");
      }
    }
  };

  return (
    <div>
      <AnimatedContent distance={16} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "profileTitle")}</div>
              <div className="card-description">{t(language, "profileSubtitle")}</div>
            </div>
          </div>

          {error && (
            <div className="alert-banner alert-danger" style={{ marginBottom: "16px" }}>
              <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {msg && (
            <div className="alert-banner alert-success" style={{ marginBottom: "16px" }}>
              <CheckCircle2 aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              <div>{msg}</div>
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t(language, "age")}</label>
                <input
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t(language, "socialCategory")}</label>
                <select
                  value={profile.social_category || "GEN"}
                  onChange={(e) => setProfile({ ...profile, social_category: e.target.value })}
                >
                  <option value="GEN">General (GEN)</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t(language, "annualIncome")}</label>
                <input
                  type="number"
                  value={toRupees(profile.annual_family_income_minor || 0)}
                  onChange={(e) => setProfile({ ...profile, annual_family_income_minor: toPaise(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t(language, "stateDomicile")}</label>
                <input
                  value={profile.state || ""}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                />
              </div>
            </div>

            <ClickSpark sparkColor="#047857" sparkCount={5}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "…" : t(language, "updateProfileBtn")}
              </button>
            </ClickSpark>
          </form>
        </div>
      </AnimatedContent>

      {/* DPDP Act 2023 Consent Ledger & Data Rights Card */}
      <AnimatedContent distance={16} delay={0.1} duration={0.3}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t(language, "dpdpRights")}</div>
              <div className="card-description">{t(language, "dpdpSubtitle")}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <ClickSpark sparkColor="#047857" sparkCount={5}>
              <button className="btn btn-secondary" onClick={handleDownloadDSAR}>
                {t(language, "downloadDSAR")}
              </button>
            </ClickSpark>
            <button className="btn btn-danger" onClick={handleErasure}>
              {t(language, "erasureBtn")}
            </button>
          </div>

          <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "8px" }}>{t(language, "activeConsents")}</h4>
          {consents.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)", fontSize: "0.85rem" }}>
              <span>Purpose: <strong>{c.purpose}</strong></span>
              <span className="badge badge-eligible">Granted on {c.at.substring(0, 10)}</span>
            </div>
          ))}
        </div>
      </AnimatedContent>
    </div>
  );
}

// =============================================================================
// 10. College Administrator View (Dynamic Translation)
// =============================================================================
function AdminView({ session, language }: { session: UserSession; language: Language }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api("/admin/stats").then(setStats).catch(console.error);
  }, []);

  return (
    <AnimatedContent distance={16} duration={0.3}>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 aria-hidden="true" className="w-5 h-5 text-emerald-700" />
              {t(language, "navAdmin")}
            </div>
            <div className="card-description">
              Aggregated, privacy-preserving participation metrics
            </div>
          </div>
          <span className="badge badge-eligible">Zero Personal PII Exposed</span>
        </div>

        {stats ? (
          <div className="stats-grid">
            <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
              <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                <div className="stat-label">Enrolled Users</div>
                <div className="stat-value tabular-nums">
                  <CountUp to={stats.total_users} duration={0.4} />
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
              <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                <div className="stat-label">Transactions Recorded</div>
                <div className="stat-value tabular-nums">
                  <CountUp to={stats.total_transactions} duration={0.4} />
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
              <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                <div className="stat-label">Total Volume Tracked</div>
                <div className="stat-value tabular-nums">
                  <CountUp to={toRupees(stats.total_volume_minor)} prefix="₹" decimals={2} duration={0.4} />
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(4, 120, 87, 0.08)" spotlightSize={240} style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
              <div className="stat-card" style={{ height: "100%", marginBottom: 0 }}>
                <div className="stat-label">Active Savings Goals</div>
                <div className="stat-value tabular-nums">
                  <CountUp to={stats.total_goals} duration={0.4} />
                </div>
              </div>
            </SpotlightCard>
          </div>
        ) : (
          <p>Loading analytics…</p>
        )}
      </div>
    </AnimatedContent>
  );
}
