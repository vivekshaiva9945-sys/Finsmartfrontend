import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface AlertBannerProps {
  type?: "info" | "success" | "warning" | "danger";
  message: string;
  title?: string;
  className?: string;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = "info",
  message,
  title,
  className = "",
}) => {
  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          bg: "var(--color-success-bg)",
          border: "#bbf7d0",
          color: "var(--color-success)",
          icon: <CheckCircle2 aria-hidden="true" className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-success)" }} />,
        };
      case "warning":
        return {
          bg: "var(--color-warning-bg)",
          border: "#fde68a",
          color: "var(--color-warning)",
          icon: <AlertTriangle aria-hidden="true" className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-warning)" }} />,
        };
      case "danger":
        return {
          bg: "var(--color-danger-bg)",
          border: "#fecaca",
          color: "var(--color-danger)",
          icon: <AlertCircle aria-hidden="true" className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-danger)" }} />,
        };
      case "info":
      default:
        return {
          bg: "var(--color-info-bg)",
          border: "#bfdbfe",
          color: "var(--color-info)",
          icon: <Info aria-hidden="true" className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-info)" }} />,
        };
    }
  };

  const config = getConfig();

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`alert-banner alert-${type} ${className}`}
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        color: config.color,
        fontSize: "0.875rem",
        lineHeight: 1.45,
      }}
    >
      {config.icon}
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: "2px" }}>
            {title}
          </div>
        )}
        <div>{message}</div>
      </div>
    </div>
  );
};
