import React from "react";

interface StatCardProps {
  label: string;
  amount: string | number;
  subtext: string;
  trend?: "positive" | "negative" | "neutral";
  accentBorder?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  amount,
  subtext,
  trend = "neutral",
  accentBorder = false,
}) => {
  const getAmountColor = () => {
    if (trend === "positive") return "var(--color-success)";
    if (trend === "negative") return "var(--color-danger)";
    return "var(--text-main)";
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: accentBorder
          ? "1.5px solid var(--primary-border)"
          : "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            marginBottom: "8px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: getAmountColor(),
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
            lineHeight: 1.15,
          }}
        >
          {amount}
        </div>
      </div>
      <div
        style={{
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {subtext}
      </div>
    </div>
  );
};
