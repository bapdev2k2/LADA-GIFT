"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, useSpring, useTransform } from "framer-motion";

const sizes = [
  { label: "S", dimension: "7.5cm", scale: 0.65, description: "Nhỏ gọn • Tiện lợi" },
  { label: "L", dimension: "10cm", scale: 0.85, description: "Phổ biến • Vừa vặn" },
  { label: "XL", dimension: "15cm", scale: 1.05, description: "Nổi bật • Cao cấp" },
] as const;

type SizeLabel = (typeof sizes)[number]["label"];

function AcrylicKeychainSVG({ scale }: { scale: number }) {
  return (
    <svg
      width={140 * scale}
      height={200 * scale}
      viewBox="0 0 140 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_15px_35px_rgba(244,114,182,0.35)]"
    >
      {/* Keychain ring */}
      <circle
        cx="70"
        cy="20"
        r="12"
        stroke="url(#ringGrad)"
        strokeWidth="3.5"
        fill="none"
      />
      {/* Connector */}
      <rect
        x="66"
        y="30"
        width="8"
        height="12"
        rx="2"
        fill="url(#connGrad)"
      />
      {/* Main acrylic body */}
      <rect
        x="20"
        y="42"
        width="100"
        height="140"
        rx="16"
        fill="url(#bodyGrad)"
        stroke="url(#borderGrad)"
        strokeWidth="2"
      />
      {/* Inner reflection */}
      <rect
        x="28"
        y="50"
        width="84"
        height="124"
        rx="12"
        fill="url(#innerGrad)"
        opacity="0.6"
      />
      {/* Shimmer lines */}
      <line x1="35" y1="70" x2="105" y2="70" stroke="url(#shimmer1)" strokeWidth="0.8" opacity="0.6" />
      <line x1="35" y1="95" x2="105" y2="95" stroke="url(#shimmer2)" strokeWidth="0.8" opacity="0.5" />
      <line x1="35" y1="120" x2="105" y2="120" stroke="url(#shimmer1)" strokeWidth="0.8" opacity="0.4" />
      <line x1="35" y1="145" x2="105" y2="145" stroke="url(#shimmer2)" strokeWidth="0.8" opacity="0.3" />
      
      {/* Star/sparkle decoration */}
      <path
        d="M70 80 L73 90 L83 90 L75 96 L78 106 L70 100 L62 106 L65 96 L57 90 L67 90 Z"
        fill="url(#starGrad)"
        opacity="0.85"
      />
      {/* Light reflection on glass */}
      <ellipse
        cx="48"
        cy="60"
        rx="14"
        ry="6"
        fill="white"
        opacity="0.3"
        transform="rotate(-20 48 60)"
      />
      <defs>
        <linearGradient id="ringGrad" x1="58" y1="8" x2="82" y2="32">
          <stop stopColor="#E2E8F0" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="connGrad" x1="66" y1="30" x2="74" y2="42">
          <stop stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="20" y1="42" x2="120" y2="182">
          <stop stopColor="rgba(255,255,255,0.75)" />
          <stop offset="0.5" stopColor="rgba(244,114,182,0.2)" />
          <stop offset="1" stopColor="rgba(168,85,247,0.25)" />
        </linearGradient>
        <linearGradient id="borderGrad" x1="20" y1="42" x2="120" y2="182">
          <stop stopColor="#F472B6" />
          <stop offset="0.5" stopColor="#A855F7" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="innerGrad" x1="28" y1="50" x2="112" y2="174">
          <stop stopColor="rgba(255,255,255,0.4)" />
          <stop offset="0.5" stopColor="rgba(244,114,182,0.15)" />
          <stop offset="1" stopColor="rgba(56,189,248,0.2)" />
        </linearGradient>
        <linearGradient id="shimmer1" x1="35" y1="0" x2="105" y2="0">
          <stop stopColor="transparent" />
          <stop offset="0.3" stopColor="#F472B6" />
          <stop offset="0.7" stopColor="#A855F7" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="shimmer2" x1="35" y1="0" x2="105" y2="0">
          <stop stopColor="transparent" />
          <stop offset="0.3" stopColor="#38BDF8" />
          <stop offset="0.7" stopColor="#EC4899" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="starGrad" x1="57" y1="80" x2="83" y2="106">
          <stop stopColor="#F472B6" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SizeIndicator({ size, isActive }: { size: SizeLabel; isActive: boolean }) {
  const barWidths: Record<SizeLabel, string> = { S: "w-1/3", L: "w-2/3", XL: "w-full" };
  return (
    <div className="w-full mt-3">
      <div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barWidths[size]}`}
          initial={false}
          animate={{
            background: isActive
              ? "linear-gradient(90deg, #EC4899, #A855F7)"
              : "rgba(148, 163, 184, 0.4)",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

interface SizeSelectorProps {
  onSelectSize?: (size: "S" | "L" | "XL") => void;
}

export default function SizeSelector({ onSelectSize }: SizeSelectorProps = {}) {
  const [selectedSize, setSelectedSize] = useState<SizeLabel>("L");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const selectedSizeData = sizes.find((s) => s.label === selectedSize)!;

  const springScale = useSpring(selectedSizeData.scale, {
    stiffness: 280,
    damping: 24,
    mass: 0.8,
  });

  React.useEffect(() => {
    springScale.set(selectedSizeData.scale);
  }, [selectedSize, selectedSizeData.scale, springScale]);

  const transformedScale = useTransform(springScale, (v) => v);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Soft Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-gradient-to-tr from-pink-300/25 via-purple-300/20 to-sky-300/25 blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Header - Perfectly Centered */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1 text-xs font-black uppercase tracking-widest text-pink-700 shadow-sm backdrop-blur-md mb-3">
            <span>LADA GIFT • Tiêu chuẩn kích cỡ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1035]">
            CHỌN KÍCH THƯỚC{" "}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              MICA HOÀN HẢO
            </span>
          </h2>
          <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
        </motion.div>

        {/* 1. Size Selection Buttons - Perfectly Centered in a Row */}
        <motion.div
          className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {sizes.map((size) => {
            const isSelected = selectedSize === size.label;
            return (
              <button
                key={size.label}
                type="button"
                onClick={() => setSelectedSize(size.label)}
                className={`
                  relative p-4 sm:p-5 rounded-3xl text-left
                  backdrop-blur-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between
                  ${
                    isSelected
                      ? "bg-white/95 border-pink-500 shadow-xl shadow-pink-300/40 ring-2 ring-pink-400 scale-[1.02]"
                      : "bg-white/75 border-white/90 hover:bg-white hover:border-pink-300 shadow-md shadow-purple-100/30"
                  }
                `}
              >
                <div className="relative z-10 w-full">
                  {/* Size Label */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xl sm:text-2xl font-black transition-colors ${
                        isSelected ? "text-pink-600" : "text-[#1E1035]"
                      }`}
                    >
                      Size {size.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-300/50">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Dimension */}
                  <p
                    className={`text-base sm:text-lg font-black transition-colors ${
                      isSelected ? "text-[#1E1035]" : "text-slate-700"
                    }`}
                  >
                    {size.dimension}
                  </p>

                  {/* Description */}
                  <p
                    className={`text-[11px] font-bold truncate mt-0.5 transition-colors ${
                      isSelected ? "text-pink-600" : "text-slate-500"
                    }`}
                  >
                    {size.description}
                  </p>

                  {/* Size indicator bar */}
                  <SizeIndicator size={size.label} isActive={isSelected} />
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* 2. Keychain Mockup Animation - Centered directly under the buttons */}
        <motion.div
          className="mt-12 w-full max-w-lg flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Mockup Display Box */}
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl bg-white/70 backdrop-blur-xl border-2 border-white/90 shadow-xl shadow-pink-200/30 flex items-center justify-center overflow-hidden">
            {/* Soft inner radial glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50/40 via-purple-50/20 to-sky-50/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-pink-300/30 blur-3xl animate-pulse" />

            {/* Keychain Product SVG with spring scale & gentle floating animation */}
            <motion.div
              className="relative z-10 flex items-center justify-center will-change-transform"
              style={{ scale: transformedScale }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateY: [0, 6, 0, -6, 0],
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <AcrylicKeychainSVG scale={1} />
              </motion.div>
            </motion.div>

            {/* Pedestal Reflection Shadow below Keychain */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-36 h-6 rounded-[100%] bg-pink-400/20 blur-md" />
          </div>

          {/* Size Dimension Badge - Centered */}
          <div className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSize}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <span className="inline-block text-xs font-black text-[#1E1035] bg-white/90 px-5 py-2 rounded-full border border-pink-300 shadow-sm whitespace-nowrap">
                  Kích thước thực tế:{" "}
                  <span className="text-pink-600 font-extrabold">Size {selectedSizeData.label} ({selectedSizeData.dimension})</span> — Mica dày 3.5mm vát cạnh kim cương
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. CTA Action Button - Centered */}
          {onSelectSize && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => onSelectSize(selectedSize)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-pink-400/35 transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <span>Chọn Size {selectedSize} & Tự thiết kế ngay</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
