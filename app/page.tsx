"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, formatINR, getTenantSlug, setTenantSlug, toPaise, toRupees } from "../lib/api";
import { Language, t } from "../lib/i18n";
import {
  BlurText,
  AnimatedContent,
  SpotlightCard,
  CountUp,
  GlareHover,
  ClickSpark,
  ShinyText,
  Squares,
} from "../components/react-bits";

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
    const savedToken = sessionStorage.getItem("finsmart_token");
    const savedUser = sessionStorage.getItem("finsmart_user");
    // Ensure public tenant is always active for the general public
    sessionStorage.setItem("finsmart_tenant", "public");
    setTenant("public");

    if (savedToken && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setSession({ ...u, token: savedToken });
      } catch {
        sessionStorage.clear();
      }
    }
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

  const handleLoginSuccess = (data: any) => {
    sessionStorage.setItem("finsmart_token", data.access_token);
    const u = {
      token: data.access_token,
      user_id: data.user_id,
      tenant_id: data.tenant_id,
      role: data.role,
      full_name: data.full_name,
      email: data.email,
    };
    sessionStorage.setItem("finsmart_user", JSON.stringify(u));
    setSession(u);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("finsmart_token");
    sessionStorage.removeItem("finsmart_user");
    setSession(null);
  };

  const navItems = [
    { id: "dashboard", label: t(language, "navDashboard"), icon: "📊" },
    { id: "budgets", label: t(language, "navBudgets"), icon: "🎯" },
    { id: "goals", label: t(language, "navGoals"), icon: "🏆" },
    { id: "schemes", label: t(language, "navSchemes"), icon: "🏛️" },
    {
      id: "ai_assistant",
      label: (
        <ShinyText speed={3.5}>
          ✨ {t(language, "navAI")}
        </ShinyText>
      ),
      icon: "✨",
    },
    { id: "calculators", label: t(language, "navCalculators"), icon: "🧮" },
    { id: "learning", label: t(language, "navLearn"), icon: "🛡️" },
    { id: "profile", label: t(language, "navProfile"), icon: "👤" },
    ...((session?.role === "college_admin" || session?.role === "admin")
      ? [{ id: "admin", label: t(language, "navAdmin"), icon: "🏫" }]
      : []),
  ];

  return (
    <div className="app-container">
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
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Authentication Flow if not logged in */}
      {!session ? (
        <AuthView tenant={tenant} language={language} onLoginSuccess={handleLoginSuccess} />
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
                  <span style={{ fontSize: "1.1rem" }}>{tab.icon}</span>
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
                    color: isActive ? "#047857" : "var(--text-muted)",
                    fontWeight: isActive ? 700 : 600,
                    padding: "9px 16px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#dcfce7",
                        borderRadius: "10px",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
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
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem" }}>
              <div>
                📞 Citizen Helpline:{" "}
                <a href="tel:+918023456789" className="contact-link" aria-label="Call Helpline">
                  +91 (080) 2345-6789
                </a>
              </div>
              <div>
                ✉️ Support & Grievance:{" "}
                <a href="mailto:support@finsmart.gov.in" className="contact-link" aria-label="Email Support">
                  support@finsmart.gov.in
                </a>
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
              📊 Financial Dashboard
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("budgets");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              🎯 Budget Planner & Alerts
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("goals");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              🏆 Savings Goals Tracker
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("schemes");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              🏛️ Welfare Schemes Matcher
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("calculators");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              🧮 EMI & SIP Calculators
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("learning");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              🛡️ Fraud Shield & Literacy
            </button>
          </div>

          <div className="footer-col">
            <div className="footer-title">Governance & Privacy</div>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("profile");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              🔒 India DPDP Act 2023 Consent
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("profile");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              📥 Right to Data Portability (DSAR)
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => {
                if (session) setCurrentTab("learning");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              📜 RBI Financial Education Norms
            </button>
            <a
              href="https://www.rbi.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              🌐 Reserve Bank of India (RBI) ↗
            </a>
            <a
              href="https://scholarships.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              🎓 National Scholarship Portal ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} FinSmart. All rights reserved.
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
}: {
  tenant: string;
  language: Language;
  onLoginSuccess: (d: any) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!consent) {
          throw new Error("Explicit consent is legally required under India's DPDP Act 2023.");
        }
        const res = await api("/auth/register", {
          method: "POST",
          body: {
            email,
            password,
            full_name: fullName,
            role,
            consent_data_processing: consent,
          },
        });
        onLoginSuccess(res);
      } else {
        const res = await api("/auth/login", {
          method: "POST",
          body: { email, password },
        });
        onLoginSuccess(res);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "520px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
      {/* Subtle light-mode animated background with soft emerald grid */}
      <Squares
        direction="diagonal"
        speed={0.35}
        squareSize={38}
        borderColor="rgba(16, 185, 129, 0.08)"
        hoverFillColor="rgba(16, 185, 129, 0.05)"
      />

      <AnimatedContent
        distance={28}
        direction="vertical"
        duration={0.45}
        style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 1 }}
      >
        <div
          className="glass-card"
          style={{
            padding: "36px 32px",
            borderRadius: "16px",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <BlurText
              text={mode === "login" ? t(language, "welcomeBack") : t(language, "createAccount")}
              delay={35}
              style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}
            />
          </div>
          <p className="card-description" style={{ marginBottom: "22px", color: "var(--text-muted)" }}>
            {mode === "login" ? t(language, "signInSubtitle") : t(language, "registerSubtitle")}
          </p>

          {error && (
            <div className="alert-banner alert-danger" role="alert" style={{ marginBottom: "16px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <div className="form-group" style={{ marginBottom: "14px" }}>
                  <label className="form-label">{t(language, "fullName")}</label>
                  <input
                    required
                    className="fin-input"
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "14px" }}>
                  <label className="form-label">{t(language, "role")}</label>
                  <select className="fin-input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">{t(language, "student")}</option>
                    <option value="faculty">{t(language, "faculty")}</option>
                    <option value="admin">{t(language, "admin")}</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: "14px" }}>
              <label className="form-label">{t(language, "email")}</label>
              <input
                type="email"
                required
                className="fin-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "18px" }}>
              <label className="form-label">{t(language, "password")}</label>
              <input
                type="password"
                required
                minLength={8}
                className="fin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === "register" && (
              <div style={{ marginBottom: "18px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  id="dpdp-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ width: "18px", height: "18px", marginTop: "2px", flexShrink: 0 }}
                />
                <label htmlFor="dpdp-consent" style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {t(language, "dpdpConsent")}
                </label>
              </div>
            )}

            <GlareHover
              glareColor="#ffffff"
              glareOpacity={0.25}
              borderRadius="10px"
              style={{ width: "100%", display: "block" }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  minHeight: "46px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                }}
                disabled={loading}
              >
                {loading ? "..." : mode === "login" ? t(language, "signInBtn") : t(language, "registerBtn")}
              </button>
            </GlareHover>

            {mode === "login" && (
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("vivekshaiva9945@gmail.com");
                    setPassword("vivek123");
                  }}
                  style={{
                    background: "#f0fdf4",
                    border: "1px dashed #10b981",
                    color: "#047857",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  ⚡ Fill Demo Login (vivekshaiva9945@gmail.com)
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
  const [successMsg, setSuccessMsg] = useState("");

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
      setSuccessMsg("Transaction recorded successfully!");
      setError("");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to record transaction.");
      setSuccessMsg("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api(`/transactions/${id}`, { method: "DELETE" });
        setSuccessMsg("Transaction deleted successfully.");
        setError("");
        await loadData();
      } catch (err: any) {
        setError(err.message || "Failed to delete.");
        setSuccessMsg("");
      }
    }
  };

  return (
    <div>
      {/* Overspend Alert Banners */}
      {budgetAlerts.map((b) => (
        <div key={b.category} className={`alert-banner ${b.level === "over" ? "alert-danger" : "alert-warning"}`}>
          ⚠️ <strong>Budget Alert:</strong> You have used {b.percent}% of your {b.category} budget ({formatINR(b.spent_minor)} of {formatINR(b.limit_minor)}).
        </div>
      ))}

      {error && <div className="alert-banner alert-danger">⚠️ {error}</div>}
      {successMsg && <div className="alert-banner alert-success">✅ {successMsg}</div>}

      {/* 4-Metric Overview Cards with Staggered Entrance, Spotlight, and CountUp */}
      <div className="stats-grid">
        <AnimatedContent distance={20} delay={0} duration={0.35}>
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.12)"
            className="stat-card"
            style={{ borderRadius: "14px", height: "100%" }}
          >
            <div className="stat-label">{t(language, "netBalance")}</div>
            <div className="stat-value">
              <CountUp
                to={toRupees(summary ? summary.balance_minor : 0)}
                prefix="₹"
                decimals={2}
                duration={0.6}
              />
            </div>
            <div className="stat-subtext">{t(language, "cumulativeCashflow")}</div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={20} delay={0.08} duration={0.35}>
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.12)"
            className="stat-card"
            style={{ borderRadius: "14px", height: "100%" }}
          >
            <div className="stat-label">{t(language, "monthlyIncome")}</div>
            <div className="stat-value" style={{ color: "var(--color-success)" }}>
              <CountUp
                to={toRupees(summary ? summary.income_minor : 0)}
                prefix="+₹"
                decimals={2}
                duration={0.6}
              />
            </div>
            <div className="stat-subtext positive">{t(language, "totalCredits")}</div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={20} delay={0.16} duration={0.35}>
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.12)"
            className="stat-card"
            style={{ borderRadius: "14px", height: "100%" }}
          >
            <div className="stat-label">{t(language, "monthlyExpenses")}</div>
            <div className="stat-value" style={{ color: "var(--color-danger)" }}>
              <CountUp
                to={toRupees(summary ? summary.expense_minor : 0)}
                prefix="-₹"
                decimals={2}
                duration={0.6}
              />
            </div>
            <div className="stat-subtext negative">{t(language, "totalDebits")}</div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={20} delay={0.24} duration={0.35}>
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.12)"
            className="stat-card"
            style={{ borderRadius: "14px", height: "100%" }}
          >
            <div className="stat-label">{t(language, "savingsRate")}</div>
            <div className="stat-value">
              <CountUp
                to={summary ? summary.savings_rate_pct : 0}
                suffix="%"
                decimals={1}
                duration={0.6}
              />
            </div>
            <div className={`stat-subtext ${(summary?.savings_rate_pct || 0) >= 20 ? "positive" : "warning"}`}>
              {(summary?.savings_rate_pct || 0) >= 20 ? t(language, "healthySavings") : t(language, "targetSavings")}
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

              <ClickSpark sparkColor="#10b981" sparkCount={12} sparkRadius={36} className="w-full" style={{ width: "100%", display: "block" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", fontWeight: 700 }}
                  disabled={submitting}
                >
                  {submitting ? "..." : t(language, "addTransactionBtn")}
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
                    fontSize: "1.2rem",
                    marginBottom: "10px",
                  }}
                >
                  📊
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
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setError("Please enter a valid monthly limit greater than ₹0.");
      setSuccessMsg(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api("/budgets/", {
        method: "PUT",
        body: { category, limit_minor: paise, period: "MONTHLY" },
      });
      setLimitRupees("");
      setSuccessMsg(`Monthly budget for ${category.toUpperCase()} updated successfully!`);
      await loadBudgets();
    } catch (err: any) {
      setError(err.message || "Failed to save budget.");
      setSuccessMsg(null);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDay - now.getDate());

  return (
    <div>
      {error && <div className="alert-banner alert-danger">⚠️ {error}</div>}
      {successMsg && <div className="alert-banner alert-success">✅ {successMsg}</div>}

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "setMonthlyBudget")}</div>
            <div className="card-description">{t(language, "budgetSubtitle")}</div>
          </div>
        </div>

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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "..." : t(language, "saveBudgetBtn")}
          </button>
        </form>
      </div>

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
                <div
                  key={b.category}
                  className="card"
                  style={{
                    marginBottom: 0,
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
              );
            })}
          </div>
        )}
      </div>
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
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setError("Please provide a valid goal name and target amount.");
      setSuccessMsg(null);
      return;
    }

    setLoading(true);
    setError(null);
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
      const createdName = name;
      setName("");
      setTargetRupees("");
      setTargetDate("");
      setSuccessMsg(`Goal "${createdName}" created successfully!`);
      await loadGoals();
    } catch (err: any) {
      setError(err.message || "Failed to create goal.");
      setSuccessMsg(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (goalId: string) => {
    const amtStr = depositAmounts[goalId];
    const paise = toPaise(amtStr);
    if (paise <= 0) {
      setError("Please enter a contribution amount greater than ₹0.");
      setSuccessMsg(null);
      return;
    }

    try {
      setError(null);
      await api(`/goals/${goalId}/contribute`, {
        method: "POST",
        body: { amount_minor: paise },
      });
      setDepositAmounts({ ...depositAmounts, [goalId]: "" });
      setSuccessMsg("Contribution recorded successfully!");
      await loadGoals();
    } catch (err: any) {
      setError(err.message || "Failed to contribute.");
      setSuccessMsg(null);
    }
  };

  return (
    <div>
      {error && <div className="alert-banner alert-danger">⚠️ {error}</div>}
      {successMsg && <div className="alert-banner alert-success">✅ {successMsg}</div>}

      {/* Create New Goal Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "createGoal")}</div>
            <div className="card-description">{t(language, "goalSubtitle")}</div>
          </div>
        </div>

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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "..." : t(language, "setGoalBtn")}
          </button>
        </form>
      </div>

      {/* Goal Cards Grid */}
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
              <div key={g.id} className="card" style={{ marginBottom: 0 }}>
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
                  <span>{t(language, "saved")}: {formatINR(g.saved_minor)}</span>
                  <span>{t(language, "target")}: {formatINR(g.target_minor)}</span>
                </div>

                {g.monthly_recommended_minor && !g.is_completed && (
                  <div style={{ fontSize: "0.78rem", color: "var(--primary)", marginTop: "6px" }}>
                    💡 Save <strong>{formatINR(g.monthly_recommended_minor)}/month</strong> to reach goal by {g.target_date}.
                  </div>
                )}

                {!g.is_completed && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                    <input
                      type="number"
                      step="1"
                      placeholder="Amount ₹"
                      value={depositAmounts[g.id] || ""}
                      onChange={(e) => setDepositAmounts({ ...depositAmounts, [g.id]: e.target.value })}
                    />
                    <button className="btn btn-secondary btn-sm" onClick={() => handleContribute(g.id)}>
                      {t(language, "depositBtn")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
  const [error, setError] = useState<string | null>(null);

  const runEvaluation = async () => {
    setEvaluating(true);
    setError(null);
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
      setError(err.message || "Failed to evaluate scheme eligibility.");
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, []);

  return (
    <div>
      {error && <div className="alert-banner alert-danger">⚠️ {error}</div>}

      {/* Criteria Profiler Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "schemeMatcher")}</div>
            <div className="card-description">{t(language, "schemeSubtitle")}</div>
          </div>
        </div>

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

        <button className="btn btn-primary" onClick={runEvaluation} disabled={evaluating}>
          {evaluating ? t(language, "evaluatingBtn") : t(language, "checkEligibilityBtn")}
        </button>
      </div>

      {/* Matched Schemes List */}
      <div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "14px" }}>
          {t(language, "evaluatedSchemes")} ({schemes.filter((s) => s.eligible).length} {t(language, "likelyEligibleCount")})
        </h3>

        {schemes.map((s) => {
          const isExpanded = expandedCode === s.code;
          const displayTitle = language === "kn" && s.title_kn ? s.title_kn : language === "hi" && s.title_hi ? s.title_hi : s.title_en;

          return (
            <div key={s.code} className={`scheme-card ${s.eligible ? "eligible" : "ineligible"}`}>
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
          );
        })}
      </div>
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
          <button key={idx} className="chip" onClick={() => handleSend(p)}>
            💬 {p}
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
              <em>...</em>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="chat-input-row">
          <input
            placeholder={t(language, "askPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          />
          <button className="btn btn-primary" onClick={() => handleSend(input)} disabled={loading}>
            {t(language, "sendBtn")}
          </button>
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
  const [error, setError] = useState<string | null>(null);

  const calculateEMI = async () => {
    try {
      setError(null);
      const res = await api("/calc/emi", {
        method: "POST",
        body: { principal: parseFloat(principal), annual_rate: parseFloat(rate), months: parseInt(tenureMonths) },
      });
      setEmiResult(res);
    } catch (e: any) {
      setError(e.message || "EMI calculation failed.");
    }
  };

  const calculateSIP = async () => {
    try {
      setError(null);
      const res = await api("/calc/sip", {
        method: "POST",
        body: { monthly: parseFloat(sipMonthly), annual_rate: parseFloat(sipRate), months: parseInt(sipMonths) },
      });
      setSipResult(res);
    } catch (e: any) {
      setError(e.message || "SIP calculation failed.");
    }
  };

  const calculateEmergency = async () => {
    try {
      setError(null);
      const res = await api("/calc/emergency-fund", {
        method: "POST",
        body: { monthly_expenses: parseFloat(expenses), target_months: parseInt(targetBuffer) },
      });
      setEmergencyResult(res);
    } catch (e: any) {
      setError(e.message || "Emergency fund calculation failed.");
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "calcTitle")}</div>
            <div className="card-description">{t(language, "calcSubtitle")}</div>
          </div>
        </div>

        {error && <div className="alert-banner alert-danger" style={{ marginBottom: "16px" }}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
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
            <button className="btn btn-primary" onClick={calculateEMI}>
              {t(language, "calcEmiBtn")}
            </button>

            {emiResult && (
              <div className="stats-grid" style={{ marginTop: "20px" }}>
                <div className="stat-card">
                  <div className="stat-label">Monthly EMI</div>
                  <div className="stat-value">₹{emiResult.monthly_emi}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Interest</div>
                  <div className="stat-value" style={{ color: "var(--color-danger)" }}>
                    ₹{emiResult.total_interest}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Payable</div>
                  <div className="stat-value">₹{emiResult.total_payable}</div>
                </div>
              </div>
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
            <button className="btn btn-primary" onClick={calculateSIP}>
              {t(language, "calcSipBtn")}
            </button>

            {sipResult && (
              <div className="stats-grid" style={{ marginTop: "20px" }}>
                <div className="stat-card">
                  <div className="stat-label">Invested Amount</div>
                  <div className="stat-value">₹{sipResult.total_invested}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Estimated Wealth Gain</div>
                  <div className="stat-value" style={{ color: "var(--color-success)" }}>
                    +₹{sipResult.wealth_gain}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Expected Corpus</div>
                  <div className="stat-value" style={{ color: "var(--primary)" }}>
                    ₹{sipResult.future_value}
                  </div>
                </div>
              </div>
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
            <button className="btn btn-primary" onClick={calculateEmergency}>
              {t(language, "calcEmergencyBtn")}
            </button>

            {emergencyResult && (
              <div className="stats-grid" style={{ marginTop: "20px" }}>
                <div className="stat-card">
                  <div className="stat-label">Recommended Reserve</div>
                  <div className="stat-value" style={{ color: "var(--primary)" }}>
                    ₹{emergencyResult.recommended_fund}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Minimum Safe Reserve</div>
                  <div className="stat-value">₹{emergencyResult.minimum_safe_fund}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
  const [quizError, setQuizError] = useState<string | null>(null);

  useEffect(() => {
    api(`/learning/?lang=${language}`).then(setModules).catch(console.error);
  }, [language]);

  const handleQuizSubmit = async (moduleId: number) => {
    const selected = quizAnswers[moduleId];
    if (selected === undefined) {
      setQuizError("Please select an option before checking your answer.");
      return;
    }

    setQuizError(null);
    try {
      const res = await api("/learning/quiz/submit", {
        method: "POST",
        body: { module_id: moduleId, selected_option_index: selected },
      });
      setQuizResults({ ...quizResults, [moduleId]: res });
    } catch (err: any) {
      setQuizError(err.message || "Failed to submit quiz.");
    }
  };

  return (
    <div>
      {/* Cyber Fraud Alert Bar */}
      <div className="alert-banner alert-warning" style={{ marginBottom: "20px" }}>
        {t(language, "cyberAlert")}
      </div>

      {quizError && <div className="alert-banner alert-danger" style={{ marginBottom: "20px" }}>⚠️ {quizError}</div>}

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
            <div key={m.id} className="card" style={{ background: "#fafafa" }}>
              <span className="badge badge-agency">{m.category}</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginTop: "8px", marginBottom: "8px" }}>
                {m.title}
              </h3>
              <p style={{ fontSize: "0.92rem", lineHeight: "1.6", color: "var(--text-main)" }}>{m.body}</p>

              {/* Interactive Module Quiz */}
              {q && (
                <div style={{ marginTop: "16px", padding: "14px", background: "white", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                  <strong style={{ fontSize: "0.9rem" }}>🧠 Knowledge Check: {q.question}</strong>
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
                    <button className="btn btn-secondary btn-sm" onClick={() => handleQuizSubmit(m.id)}>
                      {t(language, "checkAnswerBtn")}
                    </button>
                    {result && (
                      <span style={{ fontSize: "0.86rem", fontWeight: "700", color: result.is_correct ? "var(--color-success)" : "var(--color-danger)" }}>
                        {result.is_correct ? "✓ Correct!" : "✗ Incorrect."} {result.explanation}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
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
      setMsg("Profile saved successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadDSAR = async () => {
    try {
      setError(null);
      const data = await api("/profiles/dsar-export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finsmart_data_export_${session.user_id}.json`;
      a.click();
      setMsg("Data export (DSAR) downloaded successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to export data.");
    }
  };

  const handleErasure = async () => {
    if (confirm("WARNING: Right to be Forgotten (DPDP Act 2023). This will permanently delete your account, transactions, and profile. Proceed?")) {
      try {
        setError(null);
        await api("/profiles/erasure", { method: "DELETE" });
        onLogout();
      } catch (err: any) {
        setError(err.message || "Failed to erase data.");
      }
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "profileTitle")}</div>
            <div className="card-description">{t(language, "profileSubtitle")}</div>
          </div>
        </div>

        {error && <div className="alert-banner alert-danger">⚠️ {error}</div>}
        {msg && <div className="alert-banner alert-info">✓ {msg}</div>}

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

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "..." : t(language, "updateProfileBtn")}
          </button>
        </form>
      </div>

      {/* DPDP Act 2023 Consent Ledger & Data Rights Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t(language, "dpdpRights")}</div>
            <div className="card-description">{t(language, "dpdpSubtitle")}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-secondary" onClick={handleDownloadDSAR}>
            {t(language, "downloadDSAR")}
          </button>
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
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">🏫 {t(language, "navAdmin")}</div>
          <div className="card-description">
            Aggregated, privacy-preserving participation metrics
          </div>
        </div>
        <span className="badge badge-eligible">Zero Personal PII Exposed</span>
      </div>

      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Enrolled Users</div>
            <div className="stat-value">{stats.total_users}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Transactions Recorded</div>
            <div className="stat-value">{stats.total_transactions}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Volume Tracked</div>
            <div className="stat-value">{formatINR(stats.total_volume_minor)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Active Savings Goals</div>
            <div className="stat-value">{stats.total_goals}</div>
          </div>
        </div>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
}
