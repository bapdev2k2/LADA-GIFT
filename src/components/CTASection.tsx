"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLanguage } from "@/lib/i18n";

/* -------------------------------------------------------------------------- */
/*  Acrylic product SVG with holographic rainbow edge glow                     */
/* -------------------------------------------------------------------------- */

function AcrylicProductSVG() {
  return (
    <svg
      viewBox="0 0 320 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 lg:w-80 lg:h-[26rem]"
    >
      <defs>
        {/* Main holographic gradient */}
        <linearGradient id="cta-holo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.15" />
          <stop offset="25%" stopColor="#A855F7" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.1" />
          <stop offset="75%" stopColor="#3B82F6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.15" />
        </linearGradient>

        {/* Edge rainbow glow */}
        <linearGradient id="cta-edge-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="20%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#A855F7" />
          <stop offset="60%" stopColor="#EC4899" />
          <stop offset="80%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>

        {/* Reflection gradient */}
        <linearGradient id="cta-reflection" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="50%" stopColor="white" stopOpacity="0.02" />
          <stop offset="100%" stopColor="white" stopOpacity="0.08" />
        </linearGradient>

        {/* Radial center glow */}
        <radialGradient id="cta-center-glow" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Rainbow shimmer for edge */}
        <linearGradient id="cta-shimmer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
          <stop offset="16%" stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="33%" stopColor="#A855F7" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.6" />
          <stop offset="66%" stopColor="#F472B6" stopOpacity="0.5" />
          <stop offset="83%" stopColor="#3B82F6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.8" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="cta-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>

      {/* Outer glow ring */}
      <rect
        x="24"
        y="30"
        width="272"
        height="340"
        rx="28"
        stroke="url(#cta-edge-glow)"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
        filter="url(#cta-glow-filter)"
      />

      {/* Main acrylic body */}
      <rect
        x="30"
        y="36"
        width="260"
        height="328"
        rx="24"
        fill="url(#cta-holo-grad)"
        stroke="url(#cta-edge-glow)"
        strokeWidth="2"
      />

      {/* Glass reflection top half */}
      <rect
        x="30"
        y="36"
        width="260"
        height="164"
        rx="24"
        fill="url(#cta-reflection)"
      />

      {/* Center glow */}
      <rect
        x="30"
        y="36"
        width="260"
        height="328"
        rx="24"
        fill="url(#cta-center-glow)"
      />

      {/* Inner frame */}
      <rect
        x="50"
        y="60"
        width="220"
        height="200"
        rx="16"
        fill="white"
        fillOpacity="0.04"
        stroke="white"
        strokeOpacity="0.08"
        strokeWidth="1"
      />

      {/* Abstract holographic pattern – diagonal lines */}
      <line x1="50" y1="100" x2="270" y2="100" stroke="white" strokeOpacity="0.06" strokeWidth="0.5" />
      <line x1="50" y1="140" x2="270" y2="140" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
      <line x1="50" y1="180" x2="270" y2="180" stroke="white" strokeOpacity="0.06" strokeWidth="0.5" />
      <line x1="50" y1="220" x2="270" y2="220" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />

      {/* Diamond sparkles */}
      <path d="M160 120 L165 135 L160 150 L155 135 Z" fill="white" fillOpacity="0.15" />
      <path d="M100 170 L104 180 L100 190 L96 180 Z" fill="white" fillOpacity="0.1" />
      <path d="M220 160 L223 168 L220 176 L217 168 Z" fill="white" fillOpacity="0.12" />

      {/* Large central diamond / holographic emblem */}
      <path
        d="M160 90 L190 145 L160 200 L130 145 Z"
        fill="none"
        stroke="url(#cta-shimmer)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Small star sparkles */}
      <circle cx="80" cy="90" r="2.5" fill="#00D4FF" fillOpacity="0.5" />
      <circle cx="240" cy="110" r="2" fill="#A855F7" fillOpacity="0.4" />
      <circle cx="100" cy="240" r="1.5" fill="#EC4899" fillOpacity="0.4" />
      <circle cx="230" cy="230" r="2" fill="#3B82F6" fillOpacity="0.35" />

      {/* Rainbow edge highlight – left side */}
      <rect
        x="30"
        y="60"
        width="3"
        height="280"
        rx="1.5"
        fill="url(#cta-shimmer)"
        opacity="0.35"
      />

      {/* Rainbow edge highlight – right side */}
      <rect
        x="287"
        y="60"
        width="3"
        height="280"
        rx="1.5"
        fill="url(#cta-shimmer)"
        opacity="0.35"
      />

      {/* Bottom text area placeholder lines */}
      <rect x="70" y="290" width="180" height="6" rx="3" fill="white" fillOpacity="0.08" />
      <rect x="90" y="306" width="140" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="110" y="318" width="100" height="4" rx="2" fill="white" fillOpacity="0.04" />

      {/* Top hole for keychain attachment */}
      <circle cx="160" cy="18" r="10" stroke="url(#cta-edge-glow)" strokeWidth="2.5" fill="none" opacity="0.6" />
      <circle cx="160" cy="18" r="5" fill="#080912" fillOpacity="0.8" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Magnetic CTA Button                                                        */
/* -------------------------------------------------------------------------- */

function MagneticCTAButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-[#00D4FF] via-[#A855F7] to-[#EC4899] px-10 py-4 text-base font-bold tracking-wider text-white uppercase shadow-lg shadow-cyan-500/30 transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.4),0_0_80px_rgba(168,85,247,0.2)]"
    >
      {/* Glow pulse behind the button */}
      <span className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-[#00D4FF] via-[#A855F7] to-[#EC4899] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-50" />
      {/* Shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[cta-shimmer-sweep_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTA Section                                                                */
/* -------------------------------------------------------------------------- */

interface CTASectionProps {
  onOpenCustomizer?: () => void;
}

export default function CTASection({ onOpenCustomizer }: CTASectionProps = {}) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reducedMotion) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: nx, y: ny });
    },
    [reducedMotion]
  );

  /* Animation variants */
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        {/* ---- Left: Text content in glassmorphism container ---- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Glassmorphism container */}
          <div className="rounded-3xl border-2 border-white/90 bg-white/85 p-8 backdrop-blur-2xl sm:p-10 lg:p-12 shadow-2xl shadow-pink-200/50">
            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="mb-6 text-3xl font-black leading-tight tracking-tight text-[#180D2B] sm:text-4xl lg:text-5xl"
            >
              <span className="block">{t("cta_title_1")}</span>
              <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                {t("cta_title_2")}
              </span>
              <span className="block">{t("cta_title_3")}</span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-sky-500 bg-clip-text text-transparent">
                {t("cta_title_4")}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mb-8 max-w-md text-base font-semibold leading-relaxed text-slate-700 sm:text-lg"
            >
              {t("cta_desc")}
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeUp}>
              <MagneticCTAButton onClick={onOpenCustomizer}>
                {t("cta_btn").toUpperCase()}
              </MagneticCTAButton>
            </motion.div>
          </div>
        </motion.div>

        {/* ---- Right: Floating product SVG ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={
            isInView
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.85, y: 40 }
          }
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative flex flex-1 items-center justify-center"
        >
          {/* Large radial glow behind product */}
          <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

          {/* Floating + rotating product */}
          <div
            className="cta-product-float relative will-change-transform"
            style={{
              animation: reducedMotion
                ? "none"
                : "cta-product-float 8s ease-in-out infinite",
              transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            }}
          >
            {/* Rainbow ring behind */}
            <div
              className="pointer-events-none absolute -inset-8 rounded-3xl opacity-30"
              style={{
                background:
                  "conic-gradient(from 90deg, #00D4FF, #A855F7, #EC4899, #3B82F6, #C0C0C0, #00D4FF)",
                filter: "blur(30px)",
              }}
            />

            <AcrylicProductSVG />

            {/* Sparkle dots around the product */}
            <span className="absolute -top-4 -right-2 h-3 w-3 rounded-full bg-cyan-400 opacity-60 blur-[3px] animate-pulse" />
            <span className="absolute -bottom-3 -left-4 h-2 w-2 rounded-full bg-purple-400 opacity-50 blur-[2px] animate-pulse" style={{ animationDelay: "0.5s" }} />
            <span className="absolute top-1/3 -right-6 h-2 w-2 rounded-full bg-pink-400 opacity-40 blur-[2px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
