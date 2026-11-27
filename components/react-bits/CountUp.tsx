"use client";

import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { motionTokens } from "../../lib/motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = motionTokens.duration.slow,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  style = {},
}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  const motionVal = useMotionValue(direction === "down" ? to : from);
  const springVal = useSpring(motionVal, {
    damping: 24,
    stiffness: 90,
    duration: duration * 1000,
  });
  const inView = useInView(ref, { once: true, margin: "0px" });

  const formatNumber = (num: number) => {
    return `${prefix}${num.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  };

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (inView) {
      const timeout = setTimeout(() => {
        motionVal.set(direction === "down" ? from : to);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [inView, delay, direction, from, to, motionVal, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    motionVal.set(to);
  }, [to, motionVal, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const unsubscribe = springVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest);
      }
    });
    return () => unsubscribe();
  }, [springVal, prefix, suffix, decimals, shouldReduceMotion]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {formatNumber(to)}
    </span>
  );
};

export default CountUp;
