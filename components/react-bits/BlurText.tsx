"use client";

import React, { useRef, useId, useEffect } from "react";
import { motion, useInView } from "framer-motion";

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
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = "easeOut",
  onAnimationComplete,
  style = {},
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: rootMargin as any });

  const defaultFrom =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, y: -20 }
      : { filter: "blur(10px)", opacity: 0, y: 20 };

  const defaultTo = [
    {
      filter: "blur(5px)",
      opacity: 0.5,
      y: direction === "top" ? 3 : -3,
    },
    { filter: "blur(0px)", opacity: 1, y: 0 },
  ];

  const fromSnapshot = animationFrom || defaultFrom;
  const toSnapshots = animationTo || defaultTo;

  return (
    <p
      ref={ref}
      className={`blur-text ${className}`}
      style={{ display: "flex", flexWrap: "wrap", ...style }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={fromSnapshot}
          animate={inView ? toSnapshots[toSnapshots.length - 1] : fromSnapshot}
          transition={{
            duration: 0.35,
            delay: (index * delay) / 1000,
            ease: easing as any,
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
    </p>
  );
};

export default BlurText;
