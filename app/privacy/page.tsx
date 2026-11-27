import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Shield, Lock, FileText, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | FinSmart",
  description:
    "Learn how FinSmart collects, stores, and protects your household financial data under India's Digital Personal Data Protection (DPDP) Act 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="app-container" style={{ maxWidth: "860px", padding: "32px 20px 64px" }}>
      <header style={{ marginBottom: "32px" }}>
        <Link
          href="/"
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          Return to Dashboard
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--primary, #047857)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            ₹
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>FinSmart</span>
          <span className="badge badge-eligible">DPDP Act 2023 Compliant</span>
        </div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)", margin: "12px 0 6px" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
          Last Updated: November 2026 • Effective Date: November 2026
        </p>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: 1.65 }}>
        {/* Purpose Statement */}
        <section className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield aria-hidden="true" className="w-5 h-5 text-emerald-700" />
            1. Purpose and Scope
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
            FinSmart (developed by Team LYNX as an academic initiative under Visvesvaraya Technological University) is committed to protecting your personal, demographic, and financial information. This Privacy Policy details our practices regarding the collection, processing, storage, and erasure of user data in compliance with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the <strong>Reserve Bank of India (RBI)</strong> Financial Education Standards.
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            FinSmart functions under a strict principle of <strong>data minimization</strong>: we collect only data that is strictly necessary to assist you with household budgeting, goal setting, and government welfare scheme matching.
          </p>
        </section>

        {/* Data We Collect */}
        <section className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText aria-hidden="true" className="w-5 h-5 text-emerald-700" />
            2. Information We Collect
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "14px" }}>
            We only collect personal and financial information when you voluntarily provide it:
          </p>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--text-secondary)" }}>
            <li>
              <strong>Account Credentials:</strong> Full name, institutional or personal email address, institutional role (student, faculty, public user), and cryptographic password hash (Argon2id/Bcrypt).
            </li>
            <li>
              <strong>Demographic Profile (Optional):</strong> Age, state of domicile, academic year, social category, and annual family income slab. This data is exclusively utilized by the offline rules engine to evaluate eligibility for Central and Karnataka State scholarships and welfare schemes.
            </li>
            <li>
              <strong>Financial Activity:</strong> User-recorded transactions (amount in integer paise, category, date, description) and category budgeting limits. We do not require or connect directly to bank account credentials, debit card numbers, or NetBanking passwords.
            </li>
            <li>
              <strong>Technical Logs:</strong> Non-identifying HTTP diagnostic headers, session timestamps, and localized language preferences (English, Kannada, Hindi).
            </li>
          </ul>
        </section>

        {/* Security and Storage */}
        <section className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Lock aria-hidden="true" className="w-5 h-5 text-emerald-700" />
            3. Data Storage & Cryptographic Security
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "14px" }}>
            <div style={{ padding: "16px", borderRadius: "8px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}>
              <strong style={{ display: "block", color: "var(--text-main)", marginBottom: "6px" }}>PostgreSQL Row-Level Security</strong>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Multi-tenant database engine strictly enforces RLS per user and institutional tenant ID, guaranteeing zero cross-tenant data leakage.
              </span>
            </div>
            <div style={{ padding: "16px", borderRadius: "8px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}>
              <strong style={{ display: "block", color: "var(--text-main)", marginBottom: "6px" }}>Integer-Paise Precision</strong>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Financial balances are strictly stored as 64-bit integer paise (minor units), eliminating binary floating-point rounding errors.
              </span>
            </div>
            <div style={{ padding: "16px", borderRadius: "8px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}>
              <strong style={{ display: "block", color: "var(--text-main)", marginBottom: "6px" }}>Transport Layer Security</strong>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                All API communications are protected via TLS 1.3 / HTTPS with HSTS, CSP, and OWASP ASVS L2 security headers.
              </span>
            </div>
          </div>
        </section>

        {/* User Rights under DPDP Act */}
        <section className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 aria-hidden="true" className="w-5 h-5 text-emerald-700" />
            4. Your Rights as a Data Principal
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "14px" }}>
            Under Section 11–13 of the Digital Personal Data Protection Act, 2023, you retain full sovereignty over your data:
          </p>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--text-secondary)" }}>
            <li>
              <strong>Right to Access & Data Portability (DSAR):</strong> You can export an immutable JSON copy of all transactions, budgets, goals, and profiles recorded under your identity from your Profile screen.
            </li>
            <li>
              <strong>Right to Correction:</strong> You can update or amend demographic attributes and budgeting limits at any time.
            </li>
            <li>
              <strong>Right to Erasure (Right to Be Forgotten):</strong> Triggering account erasure immediately purges all associated transactions, profile data, and consent logs from active databases.
            </li>
            <li>
              <strong>Right of Grievance Redressal:</strong> Direct recourse through our designated Data Protection Officer.
            </li>
          </ul>
        </section>

        {/* Grievance Redressal and Contact */}
        <section className="card" style={{ padding: "24px", background: "var(--primary-light, #ecfdf5)", borderColor: "var(--primary-border, #a7f3d0)" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary-dark, #064e3b)", marginBottom: "8px" }}>
            5. Grievance Redressal Officer
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "14px" }}>
            In accordance with the DPDP Act 2023, if you have questions, concerns, or requests regarding your data, please contact our designated coordinator:
          </p>
          <div style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
            <div><strong>Institutional Unit:</strong> Team LYNX • Department of Computer Science & Engineering</div>
            <div><strong>Affiliation:</strong> Visvesvaraya Technological University (VTU)</div>
            <div><strong>Contact Email:</strong> <a href="mailto:privacy@finsmart.gov.in" style={{ color: "var(--primary)", fontWeight: 600 }}>[YOUR_GRIEVANCE_EMAIL@example.com]</a></div>
            <div><strong>Physical Address:</strong> [YOUR_INSTITUTION_ADDRESS, Karnataka, India]</div>
          </div>
        </section>

        {/* Clear Call to Action */}
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <Link
            href="/"
            className="btn btn-primary"
            style={{ minHeight: "48px", padding: "12px 28px", fontSize: "0.95rem" }}
          >
            I Understand — Proceed to FinSmart Dashboard
          </Link>
        </div>
      </main>

      <footer style={{ marginTop: "48px", paddingTop: "20px", borderTop: "1px solid var(--border-light)", textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} FinSmart (Team LYNX, VTU). All rights reserved.
      </footer>
    </div>
  );
}
