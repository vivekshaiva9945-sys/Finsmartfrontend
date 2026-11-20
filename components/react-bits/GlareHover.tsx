"use client";

import React, { useRef, useState, ReactNode } from "react";

interface GlareHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  className?: string;
  borderRadius?: string;
}

export const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.35,
  glareAngle = 45,
  className = "",
  borderRadius = "8px",
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`glare-hover-container ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        display: "inline-block",
        width: "100%",
        ...style,
      }}
      {...props}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          opacity: isHovered ? glareOpacity : 0,
          transition: "opacity 200ms ease",
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, rgba(255,255,255,0) 65%)`,
          mixBlendMode: "overlay",
          borderRadius,
        }}
      />
    </div>
  );
};

export default GlareHover;
