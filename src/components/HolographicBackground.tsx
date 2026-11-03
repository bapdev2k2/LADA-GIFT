"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface FloatingBling {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "star4" | "star8" | "heart" | "bubble";
}

export default function HolographicBackground() {
  // 24 floating bling elements distributed across the entire screen
  const floatingElements: FloatingBling[] = useMemo(() => {
    return [
      { id: 1, x: 6, y: 10, size: 22, duration: 6, delay: 0, type: "star4" },
      { id: 2, x: 18, y: 22, size: 16, duration: 8, delay: 1, type: "bubble" },
      { id: 3, x: 32, y: 14, size: 24, duration: 7, delay: 1.8, type: "star8" },
      { id: 4, x: 48, y: 8, size: 18, duration: 8.5, delay: 0.5, type: "heart" },
      { id: 5, x: 65, y: 18, size: 26, duration: 6.5, delay: 2.2, type: "star4" },
      { id: 6, x: 82, y: 12, size: 18, duration: 7.5, delay: 1.2, type: "bubble" },
      { id: 7, x: 93, y: 25, size: 22, duration: 9, delay: 2.5, type: "star8" },

      { id: 8, x: 10, y: 40, size: 20, duration: 7.8, delay: 1.5, type: "heart" },
      { id: 9, x: 25, y: 48, size: 26, duration: 6.2, delay: 0.8, type: "star4" },
      { id: 10, x: 40, y: 38, size: 17, duration: 8.8, delay: 2.8, type: "bubble" },
      { id: 11, x: 58, y: 46, size: 24, duration: 6.8, delay: 1.4, type: "star8" },
      { id: 12, x: 74, y: 42, size: 18, duration: 7.6, delay: 2.1, type: "heart" },
      { id: 13, x: 88, y: 52, size: 22, duration: 8.2, delay: 0.4, type: "star4" },

      { id: 14, x: 5, y: 68, size: 24, duration: 7.2, delay: 1.6, type: "star8" },
      { id: 15, x: 22, y: 78, size: 18, duration: 9.2, delay: 0.3, type: "bubble" },
      { id: 16, x: 38, y: 70, size: 20, duration: 7, delay: 2, type: "heart" },
      { id: 17, x: 55, y: 82, size: 26, duration: 7.8, delay: 1.3, type: "star4" },
      { id: 18, x: 70, y: 72, size: 17, duration: 8.6, delay: 2.6, type: "bubble" },
      { id: 19, x: 85, y: 80, size: 24, duration: 6.6, delay: 0.7, type: "star8" },
      { id: 20, x: 94, y: 68, size: 18, duration: 8, delay: 2.4, type: "heart" },

      { id: 21, x: 14, y: 92, size: 22, duration: 7.5, delay: 1.1, type: "star4" },
      { id: 22, x: 44, y: 94, size: 19, duration: 8.4, delay: 2.3, type: "star8" },
      { id: 23, x: 62, y: 90, size: 16, duration: 9, delay: 0.9, type: "bubble" },
      { id: 24, x: 80, y: 93, size: 18, duration: 7.2, delay: 1.7, type: "heart" },
    ];
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Active Color-Shifting Mesh Gradient */}
      <div
        className="animate-mesh absolute inset-0 opacity-80"
        style={{
          background:
            "linear-gradient(135deg, #FFF0F6 0%, #F5EEFD 25%, #EBF8FF 50%, #FFF5EB 75%, #FDF2F8 100%)",
        }}
      />

      {/* 2. Tactile Holographic Texture Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-color-burn"
        style={{
          backgroundImage: "url('/hologram-bg.png')",
        }}
      />

      {/* 3. High-Definition Dynamic Liquid Aurora Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* ORB 1: Vibrant Hot Pink / Coral (Top-Left) */}
        <div
          className="animate-orb-1 absolute -top-20 -left-20 h-[520px] w-[520px] sm:h-[620px] sm:w-[620px] rounded-full blur-[75px] opacity-75"
          style={{
            background:
              "radial-gradient(circle, rgba(251,113,133,0.85) 0%, rgba(244,114,182,0.65) 45%, rgba(253,164,175,0) 72%)",
          }}
        />

        {/* ORB 2: Radiant Electric Violet / Lavender (Top-Right) */}
        <div
          className="animate-orb-2 absolute -top-24 -right-20 h-[560px] w-[560px] sm:h-[660px] sm:w-[660px] rounded-full blur-[80px] opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(192,132,252,0.6) 45%, rgba(221,180,254,0) 72%)",
          }}
        />

        {/* ORB 3: Glowing Holographic Sky Cyan (Center-Left) */}
        <div
          className="animate-orb-3 absolute top-1/3 -left-28 h-[480px] w-[480px] sm:h-[580px] sm:w-[580px] rounded-full blur-[70px] opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(14,165,233,0.8) 0%, rgba(56,189,248,0.6) 45%, rgba(186,230,253,0) 72%)",
          }}
        />

        {/* ORB 4: Warm Sunset Gold Peach (Bottom-Right) */}
        <div
          className="animate-orb-4 absolute -bottom-24 -right-24 h-[580px] w-[580px] sm:h-[680px] sm:w-[680px] rounded-full blur-[85px] opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.8) 0%, rgba(251,146,60,0.55) 45%, rgba(254,215,170,0) 72%)",
          }}
        />

        {/* ORB 5: Radiant Magenta & Lilac Core (Center) */}
        <div
          className="animate-orb-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] sm:h-[500px] sm:w-[500px] rounded-full blur-[70px] opacity-65"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.7) 0%, rgba(168,85,247,0.45) 50%, transparent 75%)",
            animationDuration: "14s",
            animationDirection: "reverse",
          }}
        />

        {/* 4. Rotating Conic Holographic Prism Halo */}
        <div
          className="absolute -inset-[30%] opacity-35 mix-blend-color-dodge animate-[spin_35s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,182,193,0.5) 0deg, rgba(216,180,254,0.4) 60deg, rgba(125,211,252,0.5) 120deg, rgba(244,114,182,0.5) 180deg, rgba(165,243,252,0.4) 240deg, rgba(192,132,252,0.4) 300deg, rgba(255,182,193,0.5) 360deg)",
            filter: "blur(60px)",
          }}
        />

        {/* 5. Sweeping Diamond-Cut Mica Light Reflection Beam */}
        <div
          className="animate-holo-sweep absolute -inset-[100%] pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.85) 48%, rgba(244,114,182,0.45) 52%, rgba(56,189,248,0.45) 56%, transparent 68%)",
          }}
        />
      </div>

      {/* 6. Soft White Vignette for Text Readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 20%, rgba(255,245,250,0.3) 65%, rgba(250,235,248,0.5) 100%)",
        }}
      />

      {/* 7. Active Floating Bling Sparkle Stars, Hearts, and Pearl Bubbles */}
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
              y: [0, -45, 0],
              x: [0, el.id % 2 === 0 ? 18 : -18, 0],
              rotate: [0, el.id % 2 === 0 ? 180 : -180, 0],
              scale: [0.9, 1.35, 0.9],
              opacity: [0.45, 1, 0.45],
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
                className="drop-shadow-[0_0_10px_rgba(255,255,255,1)] filter"
              >
                <path
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                  fill="url(#holo-star-grad-v2)"
                />
                <defs>
                  <linearGradient id="holo-star-grad-v2" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </svg>
            ) : el.type === "star8" ? (
              // 8-pointed brilliance star
              <svg
                width={el.size * 1.15}
                height={el.size * 1.15}
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
              >
                <path
                  d="M12 0L13.8 8.2L22 10L14.5 14L16 22L12 16.5L8 22L9.5 14L2 10L10.2 8.2L12 0Z"
                  fill="url(#holo-star8-grad-v2)"
                />
                <defs>
                  <linearGradient id="holo-star8-grad-v2" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="45%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            ) : el.type === "heart" ? (
              // Sweet pastel heart
              <svg
                width={el.size * 0.95}
                height={el.size * 0.95}
                viewBox="0 0 24 24"
                fill="rgba(244, 114, 182, 0.75)"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              // Glowing pearl bubble
              <div
                style={{
                  width: el.size * 0.9,
                  height: el.size * 0.9,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 30% 30%, #FFFFFF, rgba(244,114,182,0.5) 45%, rgba(56,189,248,0.4) 75%, rgba(255,255,255,0.2))",
                  boxShadow:
                    "0 0 14px rgba(255,255,255,0.95), inset 0 0 6px rgba(255,255,255,1)",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
