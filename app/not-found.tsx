import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg-main, #f8fafc)",
        color: "var(--text-main, #0f172a)",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          background: "var(--primary, #047857)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        ₹
      </div>

      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "9999px",
          background: "#ecfdf5",
          color: "#065f46",
          fontSize: "0.8125rem",
          fontWeight: 600,
          marginBottom: "14px",
        }}
      >
        404 • Not Found
      </span>

      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: "12px",
          maxWidth: "500px",
          color: "#0f172a",
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-muted, #64748b)",
          maxWidth: "460px",
          lineHeight: 1.5,
          marginBottom: "28px",
        }}
      >
        The page or financial resource you are looking for does not exist or has been moved.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "var(--primary, #047857)",
            color: "white",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.9375rem",
            textDecoration: "none",
            minHeight: "48px",
            transition: "all 0.15s ease",
          }}
        >
          Return to Dashboard
        </Link>
      </div>

      <p style={{ marginTop: "40px", fontSize: "0.82rem", color: "#94a3b8" }}>
        © {new Date().getFullYear()} FinSmart • Smart Financial Literacy & Budget Planner
      </p>
    </div>
  );
}
