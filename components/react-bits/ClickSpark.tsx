"use client";

import React, { useRef, useState } from "react";

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
  sparkColor = "#10b981", // emerald
  sparkCount = 10,
  sparkRadius = 30,
  duration = 450,
  className = "",
  style,
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newSparks: Spark[] = Array.from({ length: sparkCount }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX,
      y: clickY,
      angle: (i / sparkCount) * 360 + (Math.random() * 20 - 10),
      distance: sparkRadius * (0.6 + Math.random() * 0.5),
      size: 2.5 + Math.random() * 2,
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
      className={`relative inline-block ${className}`}
      style={{ position: "relative", ...style }}
    >
      {children}
      {sparks.map((spark) => {
        const rad = (spark.angle * Math.PI) / 180;
        const targetX = Math.cos(rad) * spark.distance;
        const targetY = Math.sin(rad) * spark.distance;

        return (
          <span
            key={spark.id}
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
              animation: `sparkFade ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
              boxShadow: `0 0 6px ${spark.color}`,
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
