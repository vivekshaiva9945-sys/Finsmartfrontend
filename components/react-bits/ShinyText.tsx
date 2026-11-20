"use client";

import React, { ReactNode } from "react";

interface ShinyTextProps {
  text?: string;
  children?: ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  children,
  disabled = false,
  speed = 4,
  className = "",
}) => {
  const content = text || children;

  return (
    <span
      className={`shiny-text ${disabled ? "" : "animate-shiny"} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundImage: disabled
          ? "none"
          : "linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 70%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: `${speed}s`,
      }}
    >
      {content}
    </span>
  );
};

export default ShinyText;
