/**
 * Shared Motion & Animation Tokens for FinSmart
 * Enforces consistent, calm, and accessible micro-interactions across the civic platform.
 */

export const motionTokens = {
  // Durations (in seconds)
  duration: {
    fast: 0.2,      // Button presses, micro-feedback, tooltips
    medium: 0.35,   // Card entrances, drawer slide, tab switches
    slow: 0.5,      // Number count-ups, page transitions
  },

  // Custom Cubic-Bezier Curves
  ease: {
    civicOut: [0.16, 1, 0.3, 1] as const,     // Smooth deceleration
    gentle: [0.25, 1, 0.5, 1] as const,       // Subtle bounce-free settle
    linear: [0, 0, 1, 1] as const,
  },

  // Spring Presets for Framer Motion
  spring: {
    snappy: { stiffness: 260, damping: 25 },
    gentle: { stiffness: 120, damping: 20 },
    tab: { stiffness: 350, damping: 30 },
  },

  // Color Accents for Spotlights and Sparks (Civic Forest Emerald)
  colors: {
    emeraldSpotlight: "rgba(4, 120, 87, 0.08)",
    emeraldSpark: "#047857",
    emeraldDot: "rgba(4, 120, 87, 0.06)",
  },
};

/**
 * Returns whether reduced motion is requested by the operating system.
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns whether the device is coarse-pointer (mobile / touch screen).
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
