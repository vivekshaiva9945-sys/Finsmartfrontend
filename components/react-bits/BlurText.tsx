"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { motionTokens } from "../../lib/motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Record<string, any>[];
  easing?: (t: number) => number | string;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 40,
  className = "",
  animateBy = "words", // Word-level splitting ensures Kannada and Hindi conjuncts never break
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing,
  onAnimationComplete,
  style = {},
}) => {
  const shouldReduceMotion = useReducedMotion();
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: rootMargin as any });

  // If user prefers reduced motion, render immediate accessible text without blur or transform
  if (shouldReduceMotion) {
    return (
      <span ref={ref} className={className} style={{ display: "inline-block", ...style }}>
        {text}
      </span>
    );
  }

  const defaultFrom =
    direction === "top"
      ? { filter: "blur(6px)", opacity: 0, y: -10 }
      : { filter: "blur(6px)", opacity: 0, y: 10 };

  const defaultTo = [
    {
      filter: "blur(2px)",
      opacity: 0.7,
      y: direction === "top" ? 2 : -2,
    },
    { filter: "blur(0px)", opacity: 1, y: 0 },
  ];

  const fromSnapshot = animationFrom || defaultFrom;
  const toSnapshots = animationTo || defaultTo;

  return (
    <span
      ref={ref}
      aria-label={text}
      className={`blur-text ${className}`}
      style={{ display: "inline-flex", flexWrap: "wrap", ...style }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          initial={fromSnapshot}
          animate={inView ? toSnapshots[toSnapshots.length - 1] : fromSnapshot}
          transition={{
            duration: motionTokens.duration.medium,
            delay: (index * delay) / 1000,
            ease: (easing as any) || motionTokens.ease.civicOut,
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
          style={{
            display: "inline-block",
            willChange: "transform, filter, opacity",
            marginRight: animateBy === "words" ? "0.28em" : "0",
          }}
        >
          {element === " " ? "\u00A0" : element}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
