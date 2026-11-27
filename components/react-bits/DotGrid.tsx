"use client";

import React, { useRef, useEffect, useState } from "react";
import { isReducedMotionPreferred, isTouchDevice } from "../../lib/motion";

interface DotGridProps {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const DotGrid: React.FC<DotGridProps> = ({
  dotColor = "rgba(4, 120, 87, 0.06)",
  dotSize = 1.5,
  spacing = 28,
  className = "",
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Disable heavy canvas effects on reduced-motion preference or low-end touch screens
    if (isReducedMotionPreferred() || (typeof window !== "undefined" && window.innerWidth < 640)) {
      setShouldRender(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = dotColor;

      for (let x = spacing / 2; x < canvas.width; x += spacing) {
        for (let y = spacing / 2; y < canvas.height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, dotSize, spacing]);

  if (!shouldRender) {
    // Accessible, zero-overhead CSS fallback
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          ...style,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export default DotGrid;
