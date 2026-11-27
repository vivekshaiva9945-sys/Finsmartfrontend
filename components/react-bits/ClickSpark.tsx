"use client";

import React, { useRef, useState, useEffect } from "react";
import { motionTokens, isReducedMotionPreferred } from "../../lib/motion";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkRadius?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = motionTokens.colors.emeraldSpark,
  sparkCount = 5,
  sparkRadius = 24,
  duration = 350,
  className = "",
  style,
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [enabled, setEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotionPreferred()) {
      setEnabled(false);
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newSparks: Spark[] = Array.from({ length: sparkCount }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX,
      y: clickY,
      angle: (i / sparkCount) * 360 + (Math.random() * 15 - 7.5),
      distance: sparkRadius * (0.7 + Math.random() * 0.4),
      size: 2 + Math.random() * 1.5,
      color: sparkColor,
    }));

    setSparks((prev) => [...prev, ...newSparks]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
    }, duration);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`click-spark-container ${className}`}
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      {children}
      {sparks.map((spark) => {
        const rad = (spark.angle * Math.PI) / 180;
        const targetX = Math.cos(rad) * spark.distance;
        const targetY = Math.sin(rad) * spark.distance;

        return (
          <span
            key={spark.id}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: spark.x,
              top: spark.y,
              width: spark.size,
              height: spark.size,
              borderRadius: "50%",
              backgroundColor: spark.color,
              pointerEvents: "none",
              zIndex: 99,
              transform: "translate(-50%, -50%)",
              animation: `sparkFade ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              boxShadow: `0 0 4px ${spark.color}`,
              "--spark-tx": `${targetX}px`,
              "--spark-ty": `${targetY}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

export default ClickSpark;
