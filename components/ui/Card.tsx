import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  title?: string;
  description?: string;
  badge?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  header,
  title,
  description,
  badge,
  ...props
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "var(--shadow-sm)",
      }}
      {...props}
    >
      {(header || title) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
            gap: "12px",
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                  marginBottom: 0,
                  lineHeight: 1.45,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {badge && <div>{badge}</div>}
          {header}
        </div>
      )}
      {children}
    </div>
  );
};
