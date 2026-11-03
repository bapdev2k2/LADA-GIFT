"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "star4" | "star8" | "heart" | "bubble";
}

export default function HolographicBackground() {
  const reducedMotion = useReducedMotion();

  // Floating ambient bling sparkle elements (diamond stars, hearts, pearl bubbles)
  // Perfectly distributed across the screen for 60fps GPU smoothness
  const floatingElements: FloatingElement[] = useMemo(() => {
    return [
      { id: 1, x: 8, y: 12, size: 22, duration: 9, delay: 0, type: "star4" },
      { id: 2, x: 22, y: 28, size: 14, duration: 11, delay: 1.5, type: "bubble" },
      { id: 3, x: 38, y: 15, size: 20, duration: 10, delay: 2, type: "star8" },
      { id: 4, x: 52, y: 8, size: 16, duration: 12, delay: 0.5, type: "heart" },
      { id: 5, x: 68, y: 22, size: 24, duration: 9.5, delay: 3, type: "star4" },
      { id: 6, x: 86, y: 14, size: 18, duration: 10.5, delay: 1, type: "bubble" },
      { id: 7, x: 94, y: 32, size: 20, duration: 13, delay: 2.5, type: "star8" },

      { id: 8, x: 12, y: 45, size: 18, duration: 11, delay: 2, type: "heart" },
      { id: 9, x: 28, y: 55, size: 24, duration: 8.5, delay: 0.8, type: "star4" },
      { id: 10, x: 45, y: 42, size: 15, duration: 12, delay: 3.5, type: "bubble" },
      { id: 11, x: 62, y: 52, size: 22, duration: 9, delay: 1.2, type: "star8" },
      { id: 12, x: 78, y: 46, size: 16, duration: 10, delay: 2.8, type: "heart" },
      { id: 13, x: 90, y: 58, size: 20, duration: 11.5, delay: 0.4, type: "star4" },

      { id: 14, x: 6, y: 72, size: 22, duration: 10, delay: 1.8, type: "star8" },
      { id: 15, x: 20, y: 84, size: 16, duration: 13, delay: 0.2, type: "bubble" },
      { id: 16, x: 36, y: 76, size: 18, duration: 9.8, delay: 2.2, type: "heart" },
      { id: 17, x: 54, y: 88, size: 24, duration: 10.5, delay: 1.6, type: "star4" },
      { id: 18, x: 72, y: 78, size: 15, duration: 12, delay: 3.2, type: "bubble" },
      { id: 19, x: 84, y: 86, size: 22, duration: 9.2, delay: 0.6, type: "star8" },
      { id: 20, x: 95, y: 74, size: 16, duration: 11, delay: 2.4, type: "heart" },
    ];
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Soft Radiant Pastel Canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F5] via-[#FAF3FC] to-[#F0F7FF]" />

      {/* 2. Tactile Holographic Paper/Mica Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-soft-light"
        style={{
          backgroundImage: "url('/hologram-bg.png')",
        }}
      />

      {/* 3. GPU-Accelerated Dynamic Liquid Aurora Orbs */}
      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {/* ORB 1: Sweet Rose Pink (Top-Left) */}
          <div
            className="animate-orb-1 absolute -top-24 -left-24 h-[550px] w-[550px] sm:h-[650px] sm:w-[650px] rounded-full opacity-45 mix-blend-multiply blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, rgba(251,113,133,0.7) 0%, rgba(244,114,182,0.45) 50%, transparent 75%)",
            }}
          />

          {/* ORB 2: Dreamy Lavender Lilac (Top-Right) */}
          <div
            className="animate-orb-2 absolute -top-28 -right-24 h-[600px] w-[600px] sm:h-[700px] sm:w-[700px] rounded-full opacity-45 mix-blend-multiply blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(192,132,252,0.7) 0%, rgba(168,85,247,0.45) 50%, transparent 75%)",
            }}
          />

          {/* ORB 3: Holographic Sky Cyan (Center-Left) */}
          <div
            className="animate-orb-3 absolute top-1/3 -left-36 h-[500px] w-[500px] sm:h-[600px] sm:w-[600px] rounded-full opacity-40 mix-blend-multiply blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.7) 0%, rgba(125,211,252,0.45) 50%, transparent 75%)",
            }}
          />

          {/* ORB 4: Sunset Peach & Magenta (Bottom-Right) */}
          <div
            className="animate-orb-4 absolute -bottom-32 -right-32 h-[650px] w-[650px] sm:h-[750px] sm:w-[750px] rounded-full opacity-45 mix-blend-multiply blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(244,114,182,0.7) 0%, rgba(251,146,60,0.35) 50%, transparent 75%)",
            }}
          />

          {/* ORB 5: Soft Opal Violet Core (Center Roaming) */}
          <div
            className="animate-orb-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] sm:h-[550px] sm:w-[550px] rounded-full opacity-35 mix-blend-multiply blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(216,180,254,0.7) 0%, rgba(244,114,182,0.3) 50%, transparent 75%)",
              animationDuration: "24s",
              animationDirection: "reverse",
            }}
          />

          {/* 4. Rotating Conic Holographic Prism Halo */}
          <div
            className="absolute -inset-[40%] opacity-25 mix-blend-overlay animate-[spin_55s_linear_infinite]"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255,182,193,0.35) 0deg, rgba(216,180,254,0.3) 60deg, rgba(125,211,252,0.35) 120deg, rgba(244,114,182,0.35) 180deg, rgba(165,243,252,0.3) 240deg, rgba(192,132,252,0.3) 300deg, rgba(255,182,193,0.35) 360deg)",
              filter: "blur(70px)",
            }}
          />

          {/* 5. Sweeping Diamond-Cut Mica Light Reflection Beam */}
          <div
            className="animate-holo-sweep absolute -inset-[100%] pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.7) 48%, rgba(244,114,182,0.3) 52%, rgba(56,189,248,0.3) 56%, transparent 68%)",
            }}
          />
        </div>
      )}

      {/* 6. Subtle Center Vignette for text contrast & sharp readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(255,245,250,0.35) 70%, rgba(248,235,248,0.55) 100%)",
        }}
      />

      {/* 7. Floating Bling Sparkle Stars, Hearts, and Pearl Bubbles */}
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
                y: [0, -32, 0],
                x: [0, el.id % 2 === 0 ? 12 : -12, 0],
                rotate: [0, el.id % 2 === 0 ? 180 : -180, 0],
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.9, 0.35],
              }}
              transition={{
                duration: el.duration,
                delay: el.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {el.type === "star4" ? (
                // 4-pointed diamond star
                <svg
                  width={el.size}
                  height={el.size}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                >
                  <path
                    d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                    fill="url(#holo-star-grad)"
                  />
                  <defs>
                    <linearGradient id="holo-star-grad" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="45%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : el.type === "star8" ? (
                // 8-pointed brilliance star
                <svg
                  width={el.size * 1.1}
                  height={el.size * 1.1}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                >
                  <path
                    d="M12 0L13.8 8.2L22 10L14.5 14L16 22L12 16.5L8 22L9.5 14L2 10L10.2 8.2L12 0Z"
                    fill="url(#holo-star8-grad)"
                  />
                  <defs>
                    <linearGradient id="holo-star8-grad" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="40%" stopColor="#C084FC" />
                      <stop offset="100%" stopColor="#F472B6" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : el.type === "heart" ? (
                // Sweet pastel heart
                <svg
                  width={el.size * 0.9}
                  height={el.size * 0.9}
                  viewBox="0 0 24 24"
                  fill="rgba(244, 114, 182, 0.45)"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="1.2"
                  className="drop-shadow-[0_0_6px_rgba(244,114,182,0.45)]"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                // Glowing pearl bubble
                <div
                  style={{
                    width: el.size * 0.85,
                    height: el.size * 0.85,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(244,114,182,0.35) 50%, rgba(56,189,248,0.3) 80%, rgba(255,255,255,0.15))",
                    boxShadow:
                      "0 0 12px rgba(255,255,255,0.85), inset 0 0 5px rgba(255,255,255,0.9)",
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
