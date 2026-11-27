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
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          background: "#10b981",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          fontWeight: 900,
          marginBottom: "20px",
          boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
        }}
      >
        ₹
      </div>

      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "9999px",
          background: "#dcfce7",
          color: "#065f46",
          fontSize: "0.85rem",
          fontWeight: 700,
          marginBottom: "14px",
          letterSpacing: "0.05em",
        }}
      >
        404 • PAGE NOT FOUND
      </span>

      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          marginBottom: "12px",
          maxWidth: "500px",
        }}
      >
        Lost in Financial Space?
      </h1>

      <p
        style={{
          fontSize: "1rem",
          color: "var(--text-muted, #64748b)",
          maxWidth: "460px",
          lineHeight: 1.6,
          marginBottom: "28px",
        }}
      >
        The page or financial resource you are looking for doesn't exist, was moved, or has an outdated link.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#10b981",
            color: "white",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.95rem",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
            transition: "all 0.15s ease",
          }}
        >
          ← Return to FinSmart Home
        </Link>
      </div>

      <p style={{ marginTop: "40px", fontSize: "0.82rem", color: "#94a3b8" }}>
        © {new Date().getFullYear()} FinSmart • Smart Financial Literacy & Budget Planner
      </p>
    </div>
  );
}
