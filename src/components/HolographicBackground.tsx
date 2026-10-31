"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "star" | "heart" | "bubble";
}

export default function HolographicBackground() {
  const reducedMotion = useReducedMotion();

  // Floating ambient elements (sparkles, hearts, bubbles)
  const floatingElements: FloatingElement[] = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 6,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * 6,
      type: i % 3 === 0 ? "star" : i % 3 === 1 ? "heart" : "bubble",
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Holographic Background Image (Image 2) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: "url('/hologram-bg.png')",
          backgroundAttachment: "fixed",
        }}
      />

      {/* 2. Soft Iridescent Dreamy Ambient Overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(255, 182, 193, 0.45) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(135, 206, 250, 0.4) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(221, 160, 221, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* 3. Moving Liquid Hologram Light Waves */}
      {!reducedMotion && (
        <div
          className="absolute -inset-[50%] opacity-25 mix-blend-overlay animate-[spin_35s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,192,203,0.3) 0deg, rgba(168,85,247,0.2) 60deg, rgba(56,189,248,0.25) 120deg, rgba(244,114,182,0.3) 180deg, rgba(52,211,153,0.2) 240deg, rgba(192,132,252,0.25) 300deg, rgba(255,192,203,0.3) 360deg)",
            filter: "blur(60px)",
          }}
        />
      )}

      {/* 4. Vignette for text contrast & edge polish */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(245, 235, 245, 0.35) 60%, rgba(230, 215, 235, 0.6) 100%)",
        }}
      />

      {/* 5. Floating Sparkles, Hearts, and Light Dust */}
      {!reducedMotion && (
        <div className="absolute inset-0">
          {floatingElements.map((el) => (
            <motion.div
              key={el.id}
              className="absolute"
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
              }}
              animate={{
                y: [0, -35, 0],
                x: [0, (el.id % 2 === 0 ? 15 : -15), 0],
                rotate: [0, el.id % 2 === 0 ? 45 : -45, 0],
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.85, 0.35],
              }}
              transition={{
                duration: el.duration,
                delay: el.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {el.type === "star" ? (
                // 4-pointed sparkle star
                <svg
                  width={el.size}
                  height={el.size}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                >
                  <path
                    d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                    fill="url(#star-grad)"
                  />
                  <defs>
                    <linearGradient id="star-grad" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : el.type === "heart" ? (
                // Floating sweet heart
                <svg
                  width={el.size * 0.9}
                  height={el.size * 0.9}
                  viewBox="0 0 24 24"
                  fill="rgba(244, 114, 182, 0.45)"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.2"
                  className="drop-shadow-[0_0_6px_rgba(244,114,182,0.4)]"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                // Glowing pearl bubble
                <div
                  style={{
                    width: el.size * 0.8,
                    height: el.size * 0.8,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(244,114,182,0.3) 50%, rgba(56,189,248,0.3) 80%, rgba(255,255,255,0.1))",
                    boxShadow: "0 0 10px rgba(255,255,255,0.7), inset 0 0 4px rgba(255,255,255,0.8)",
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
