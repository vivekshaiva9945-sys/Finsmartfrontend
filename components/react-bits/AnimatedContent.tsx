"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { motionTokens } from "../../lib/motion";

interface AnimatedContentProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 16,
  direction = "vertical",
  reverse = false,
  duration = motionTokens.duration.medium,
  delay = 0,
  className = "",
  style,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const axis = direction === "horizontal" ? "x" : "y";
  const startVal = reverse ? -distance : distance;

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, [axis]: startVal }}
      animate={{ opacity: 1, [axis]: 0 }}
      exit={{ opacity: 0, [axis]: startVal }}
      transition={{
        duration,
        delay,
        ease: motionTokens.ease.civicOut,
      }}
      viewport={{ once: true }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContent;
