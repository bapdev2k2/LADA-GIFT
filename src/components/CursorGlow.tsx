"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        transform: "translate3d(0,0,0)",
      }}
    >
      <div className="relative">
        {/* Outer pastel aura */}
        <div
          className="absolute -inset-20 rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.3) 0%, rgba(168,85,247,0.15) 45%, transparent 70%)",
          }}
        />
        {/* Inner glow */}
        <div
          className="absolute -inset-10 rounded-full opacity-55"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(56,189,248,0.2) 60%, transparent 80%)",
          }}
        />
        {/* Core sparkle diamond dot */}
        <div
          className="h-3 w-3 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-400"
          style={{
            boxShadow:
              "0 0 12px rgba(244,114,182,0.9), 0 0 24px rgba(168,85,247,0.6)",
          }}
        />
      </div>
    </motion.div>
  );
}
