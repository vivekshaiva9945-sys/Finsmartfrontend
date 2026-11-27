"use client";

import React, { useRef, useState, MouseEvent, useEffect } from "react";
import { motionTokens, isReducedMotionPreferred, isTouchDevice } from "../../lib/motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
  spotlightSize?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightColor = motionTokens.colors.emeraldSpotlight,
  className = "",
  spotlightSize = 300,
  style,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Disable on touch devices or reduced motion preference
    if (isReducedMotionPreferred() || isTouchDevice()) {
      setEnabled(false);
    }
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enabled || !divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => enabled && setOpacity(1);
  const handleMouseLeave = () => enabled && setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {enabled && (
        <div
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            opacity,
            transition: "opacity 200ms ease",
            background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
            zIndex: 1,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
