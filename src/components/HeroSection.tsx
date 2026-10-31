"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronRight, Sparkles, Heart } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";

/* -------------------------------------------------------------------------- */
/*  Magnetic Button                                                           */
/* -------------------------------------------------------------------------- */

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const MagneticButton = ({
  children,
  className = "",
  variant = "primary",
  onClick,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 text-white shadow-xl shadow-pink-500/35 hover:shadow-pink-500/50 hover:brightness-110",
    secondary:
      "border-2 border-pink-400 bg-white/85 backdrop-blur-md text-[#1E1035] hover:bg-white hover:text-pink-600 hover:shadow-lg hover:shadow-pink-200/50",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 font-extrabold text-base tracking-wide transition-all duration-300 focus:outline-none cursor-pointer ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

/* -------------------------------------------------------------------------- */
/*  Floating Product Visual Cards for LADA GIFT                               */
/* -------------------------------------------------------------------------- */

interface FloatingProductProps {
  name: string;
  type: string;
  image: string;
  badge: string;
  mouseX: number;
  mouseY: number;
  parallaxFactor: number;
  floatDuration: number;
  floatDelay: number;
  initialRotate: number;
  initialY: string;
}

function FloatingHeroCard({
  name,
  type,
  image,
  badge,
  mouseX,
  mouseY,
  parallaxFactor,
  floatDuration,
  floatDelay,
  initialRotate,
  initialY,
}: FloatingProductProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: floatDelay, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        transform: `translate(${mouseX * parallaxFactor}px, ${mouseY * parallaxFactor}px) translateY(${initialY}) rotate(${initialRotate}deg)`,
      }}
      className="group relative select-none will-change-transform"
    >
      {/* Animated floating effect */}
      <motion.div
        animate={{
          y: [0, -14, 0],
          rotate: [initialRotate, initialRotate + 2, initialRotate - 1, initialRotate],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-48 sm:w-56 rounded-3xl p-3.5 bg-white/80 backdrop-blur-2xl border-2 border-white/90 shadow-[0_20px_50px_rgba(244,114,182,0.25)] hover:shadow-[0_25px_60px_rgba(236,72,153,0.4)] transition-all duration-500 hover:scale-105"
      >
        {/* Top Metallic Ring if keychain */}
        {type === "keychain" && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            {/* Heart-shaped metal ring */}
            <div className="h-9 w-9 rounded-full border-[3.5px] border-slate-300 bg-gradient-to-tr from-slate-200 via-white to-slate-400 shadow-md flex items-center justify-center">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-400" />
            </div>
            <div className="h-3 w-1.5 rounded-full bg-slate-300 -mt-1 shadow-sm" />
          </div>
        )}

        {/* Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
            {badge}
          </span>
          <span className="text-[11px] font-black text-pink-600 font-mono">
            LADA GIFT
          </span>
        </div>

        {/* Acrylic Body Container */}
        <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border-2 border-white/80 bg-gradient-to-tr from-pink-50 to-purple-50 shadow-inner flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />

          {/* Holographic light sweep film overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-45 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-70"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.7) 0%, rgba(244,114,182,0.4) 30%, rgba(56,189,248,0.4) 70%, rgba(255,255,255,0.6) 100%)",
            }}
          />

          {/* Shimmer sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Product Name */}
        <div className="mt-3 text-center">
          <h4 className="text-sm font-black text-[#1E1035]">{name}</h4>
          <p className="text-[11px] font-bold text-slate-500 mt-0.5">Mica đúc siêu bóng gương</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero Section Component                                                    */
/* -------------------------------------------------------------------------- */

const headlineWords = [
  "YOUR",
  "MEMORY.",
  "YOUR",
  "STYLE.",
  "YOUR",
  "LADA GIFT.",
];

interface HeroSectionProps {
  onOpenCustomizer?: () => void;
}

export default function HeroSection({ onOpenCustomizer }: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: nx, y: ny });
    },
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[92vh] w-full items-center overflow-hidden pt-24 pb-16 sm:py-28"
    >
      {/* Ambient Radial Lights behind Hero */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-[110px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-sky-300/30 blur-[100px]" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 xl:gap-20">
        {/* Left Column: Brand & Copywriting */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1.5 shadow-md shadow-pink-200/50 backdrop-blur-md"
          >
            <div className="h-5 w-5 rounded-full overflow-hidden border border-pink-300">
              <img
                src="/lada-gift-logo.jpg"
                alt="LADA GIFT Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xs font-black tracking-wider text-pink-700 uppercase">
              LADA GIFT • GIFT FROM THE HEART
            </span>
          </motion.div>

          {/* Headline with maximum contrast */}
          <AnimatePresence>
            {isLoaded && (
              <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-6 flex flex-wrap justify-center gap-x-3.5 gap-y-1 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:justify-start lg:text-6xl xl:text-7xl"
              >
                {headlineWords.map((word, i) => {
                  const isAccent =
                    word === "MEMORY." ||
                    word === "STYLE." ||
                    word === "LADA GIFT.";
                  return (
                    <motion.span
                      key={i}
                      variants={wordVariant}
                      className={
                        isAccent
                          ? "bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent drop-shadow-sm font-black"
                          : "text-[#180D2B] drop-shadow-sm font-black"
                      }
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Sub-headline */}
          <motion.p
            custom={0.55}
            variants={fadeUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="mb-8 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg font-medium"
          >
            Biến những khoảnh khắc đáng nhớ thành những món quà mica in hình cá nhân hóa
            độc đáo. Thiết kế theo phong cách của riêng bạn cùng{" "}
            <span className="font-extrabold text-[#180D2B]">LADA GIFT</span> — nơi trao gửi yêu thương từ trái tim.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            custom={0.75}
            variants={fadeUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton
              variant="primary"
              onClick={() => smoothScrollTo("#products", 85, 750)}
            >
              Khám phá sản phẩm
              <ChevronRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              onClick={() => {
                if (onOpenCustomizer) {
                  onOpenCustomizer();
                } else {
                  smoothScrollTo("#showroom", 85, 750);
                }
              }}
            >
              Thiết kế ngay
            </MagneticButton>
          </motion.div>

          {/* Trust stats row */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="mt-12 flex items-center gap-8 sm:gap-12 text-center lg:text-left bg-white/50 p-4 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm"
          >
            {[
              { value: "5,000+", label: "Khách hàng tin chọn" },
              { value: "50+", label: "Mẫu thiết kế độc quyền" },
              { value: "99.8%", label: "Đánh giá 5 sao" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E1035]">
                  {stat.value}
                </p>
                <p className="text-xs font-bold tracking-wider text-pink-700 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: 3D Floating Mockup Objects */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* Glow backdrop behind mockups */}
          <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-to-br from-pink-400/25 via-purple-300/20 to-cyan-300/25 blur-3xl" />

          {/* Floating Cards Array */}
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-6 lg:flex-col lg:gap-8 xl:flex-row xl:gap-6">
            <FloatingHeroCard
              name="Móc khóa LADA GIFT"
              type="keychain"
              image="/lada-gift-logo.jpg"
              badge="Hot Trend"
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              parallaxFactor={18}
              floatDuration={6}
              floatDelay={0.2}
              initialRotate={-4}
              initialY="0px"
            />

            <FloatingHeroCard
              name="Nam châm Kỷ Niệm"
              type="magnet"
              image="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
              badge="Couple Edition"
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              parallaxFactor={-22}
              floatDuration={7.5}
              floatDelay={0.4}
              initialRotate={3}
              initialY="25px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
