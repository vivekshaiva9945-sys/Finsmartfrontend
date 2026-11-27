import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--primary)",
          color: "#ffffff",
          border: "1px solid var(--primary-dark)",
        };
      case "secondary":
        return {
          backgroundColor: "#ffffff",
          color: "var(--text-main)",
          border: "1px solid var(--border-light)",
        };
      case "danger":
        return {
          backgroundColor: "var(--color-danger)",
          color: "#ffffff",
          border: "1px solid #991b1b",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: "var(--primary)",
          border: "1px solid var(--primary-border)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "var(--text-main)",
          border: "1px solid transparent",
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "sm":
        return {
          padding: "6px 12px",
          fontSize: "0.8125rem",
          minHeight: "36px",
        };
      case "lg":
        return {
          padding: "12px 24px",
          fontSize: "1rem",
          minHeight: "48px",
        };
      case "md":
      default:
        return {
          padding: "9px 18px",
          fontSize: "0.9375rem",
          minHeight: "42px",
        };
    }
  };

  return (
    <button
      className={`fin-btn fin-btn-${variant} ${className}`}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontWeight: 600,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease",
        fontFamily: "inherit",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {icon && <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
};
