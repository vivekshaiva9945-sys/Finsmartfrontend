"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

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
  distance = 30,
  direction = "vertical",
  reverse = false,
  duration = 0.45,
  delay = 0,
  className = "",
  style,
  ...props
}) => {
  const axis = direction === "horizontal" ? "x" : "y";
  const startVal = reverse ? -distance : distance;

  return (
    <motion.div
      initial={{ opacity: 0, [axis]: startVal }}
      animate={{ opacity: 1, [axis]: 0 }}
      exit={{ opacity: 0, [axis]: startVal }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContent;
