"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export type ConsentStatus = "accepted" | "essential" | "undecided";

export const CookieConsent: React.FC = () => {
  const [consent, setConsent] = useState<ConsentStatus>("undecided");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("finsmart_cookie_consent") as ConsentStatus | null;
    if (stored === "accepted" || stored === "essential") {
      setConsent(stored);
    }
  }, []);

  const handleChoice = (status: "accepted" | "essential") => {
    localStorage.setItem("finsmart_cookie_consent", status);
    setConsent(status);
    // Dispatch custom event to notify analytics script immediately
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("finsmart_consent_updated", { detail: { status } })
      );
    }
  };

  // Only render on client and when undecided
  if (!mounted || consent !== "undecided") {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: "680px",
        zIndex: 99999,
        backgroundColor: "#ffffff",
        border: "1px solid var(--border-strong, #cbd5e1)",
        borderRadius: "14px",
        padding: "18px 22px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "var(--primary-light, #ecfdf5)",
            color: "var(--primary, #047857)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Cookie aria-hidden="true" className="w-5 h-5" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "4px" }}>
            We Value Your Privacy & Data Sovereignty
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            FinSmart uses essential cookies to ensure secure user authentication and multi-tenant security. With your consent, we also load privacy-respecting, anonymized telemetry to improve public financial guidance. We never sell your personal data or track your financial records. Read our{" "}
            <Link href="/privacy" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>
              Terms
            </Link>
            .
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          paddingTop: "6px",
          borderTop: "1px solid var(--border-light, #e2e8f0)",
        }}
      >
        <button
          type="button"
          onClick={() => handleChoice("essential")}
          className="btn btn-secondary btn-sm"
          style={{ minHeight: "42px", padding: "8px 16px", fontSize: "0.85rem" }}
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => handleChoice("accepted")}
          className="btn btn-primary btn-sm"
          style={{ minHeight: "42px", padding: "8px 18px", fontSize: "0.85rem", gap: "6px" }}
        >
          <ShieldCheck aria-hidden="true" className="w-4 h-4" />
          Accept All & Continue
        </button>
      </div>
    </div>
  );
};
