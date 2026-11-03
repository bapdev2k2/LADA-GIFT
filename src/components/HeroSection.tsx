"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Heart,
  Eye,
} from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { useLanguage } from "@/lib/i18n";

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
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

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

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 text-white shadow-xl shadow-pink-500/35 hover:shadow-pink-500/50 hover:brightness-110 active:scale-95",
    secondary:
      "border-2 border-pink-400 bg-white/90 backdrop-blur-md text-[#1E1035] hover:bg-white hover:text-pink-600 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-200/50 active:scale-95",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 py-4 font-black text-sm sm:text-base tracking-wide transition-all duration-300 focus:outline-none cursor-pointer ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </motion.button>
  );
};

/* -------------------------------------------------------------------------- */
/*  Bling Sparkle Star Component                                              */
/* -------------------------------------------------------------------------- */

function BlingSparkle({
  top,
  left,
  delay = 0,
  size = 20,
}: {
  top: string;
  left: string;
  delay?: number;
  size?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 animate-pulse"
      style={{
        top,
        left,
        animationDelay: `${delay}s`,
        animationDuration: "2.2s",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]"
      >
        <path
          d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
          fill="url(#hero-bling-grad)"
        />
        <defs>
          <linearGradient id="hero-bling-grad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero Section Component                                                    */
/* -------------------------------------------------------------------------- */

interface HeroSectionProps {
  onOpenCustomizer?: () => void;
}

export default function HeroSection({ onOpenCustomizer }: HeroSectionProps = {}) {
  const { t } = useLanguage();
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

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[86vh] lg:min-h-[88vh] w-full items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-16"
    >
      {/* Ambient Radial Lights behind Hero */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-[110px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-sky-300/30 blur-[100px]" />

      {/* Main Container - Centered Vertically & Horizontally */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 xl:gap-14 my-auto">
        {/* Left Column: Brand, Persuasive Headline & Copywriting */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left justify-center my-auto max-w-xl">
          {/* 1. Hot Promotion / Brand Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2.5 rounded-full border-2 border-pink-300/90 bg-white/90 px-4 py-1.5 shadow-md shadow-pink-200/50 backdrop-blur-xl"
          >
            <div className="h-5 w-5 rounded-full overflow-hidden border border-pink-300 shadow-sm flex-shrink-0">
              <img
                src="/lada-gift-logo.jpg"
                alt="LADA GIFT Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xs font-black tracking-wider text-pink-700 uppercase flex items-center gap-1.5">
              <span>{t("hero_badge")}</span>
            </span>
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping ml-0.5" />
          </motion.div>

          {/* 2. Headline - Cực kỳ nổi bật */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#180D2B] leading-[1.14]">
              {t("hero_title_1")}{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                  {t("hero_title_2")}
                </span>
                {/* Floating Bling Star on the word */}
                <BlingSparkle top="-10px" left="96%" delay={0.2} size={20} />
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold text-slate-800">
                {t("hero_subtitle")}
              </span>
            </h1>
          </motion.div>

          {/* 3. Sub-headline - Rút gọn súc tích, dễ đọc lướt */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 mb-6 max-w-lg text-sm sm:text-base leading-relaxed text-slate-700 font-semibold"
          >
            {t("hero_desc")}
          </motion.p>

          {/* 4. Action CTA Buttons Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 lg:justify-start w-full sm:w-auto"
          >
            <MagneticButton
              variant="primary"
              onClick={() => {
                if (onOpenCustomizer) {
                  onOpenCustomizer();
                } else {
                  smoothScrollTo("#showroom", 85, 750);
                }
              }}
              className="w-full sm:w-auto py-3.5 px-7"
            >
              <Sparkles className="h-4.5 w-4.5 text-white animate-spin-slow" />
              <span>{t("hero_btn_customize")}</span>
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => smoothScrollTo("#products", 85, 750)}
              className="w-full sm:w-auto py-3.5 px-6"
            >
              <Eye className="h-4 w-4 text-pink-600" />
              <span>{t("hero_btn_explore")}</span>
              <ChevronRight className="h-4 w-4 ml-0.5" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Column: 3D Floating Stage - 3 BOX ẢNH CÂN ĐỐI, KHOẢNG CÁCH ĐỀU NHAU, CĂN GIỮA HOÀN TOÀN */}
        <div className="relative flex flex-1 items-center justify-center w-full max-w-lg lg:max-w-none my-auto">
          {/* Ambient Glowing Aura */}
          <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-pink-400/25 via-purple-400/20 to-sky-300/25 blur-[95px] animate-pulse" />

          {/* Central 3D Showcase Presentation - Kích thước chuẩn & cân đối */}
          <div className="relative w-full max-w-[540px] h-[480px] sm:h-[500px] flex items-center justify-center perspective-[1200px]">
            {/* Bling Sparkles around the 3D Stage */}
            <BlingSparkle top="2%" left="12%" delay={0} size={22} />
            <BlingSparkle top="6%" left="86%" delay={0.6} size={20} />
            <BlingSparkle top="75%" left="4%" delay={1.2} size={18} />
            <BlingSparkle top="82%" left="82%" delay={1.8} size={24} />
            <BlingSparkle top="48%" left="48%" delay={2.2} size={16} />

            {/* BOX 1 (Top-Left): Nam Châm Mica Kỷ Niệm (`gallery-3.jpg`) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 35 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
              }}
              className="absolute z-10 left-0 sm:left-4 top-2 sm:top-4 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [0, -14, 6, 0],
                  x: [0, 6, -4, 0],
                  rotate: [-6, -2, -8, -6],
                  rotateY: [-8, 6, -8],
                }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-42 sm:w-46 rounded-3xl p-2.5 bg-white/95 backdrop-blur-2xl border-2 border-white/95 shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-108 hover:z-50 hover:shadow-[0_25px_60px_rgba(59,130,246,0.45)] group cursor-pointer"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                    {t("hero_card1_badge")}
                  </span>
                  <span className="text-[11px] font-black text-sky-600 font-mono">
                    25.000đ
                  </span>
                </div>

                {/* Real Product Photo (`magnet-idols-hand.webp`) */}
                <div className="relative h-36 sm:h-40 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                  <img
                    src="/images/lada/magnet-idols-hand.webp"
                    alt="Nam châm mica tủ lạnh kỷ niệm LADA GIFT"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Glass Gloss Shimmer */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)",
                      backgroundSize: "200% 200%",
                      animation: "shimmer 3.2s ease-in-out infinite",
                    }}
                  />
                </div>

                <div className="mt-2 text-center">
                  <h4 className="text-[11px] sm:text-xs font-black text-[#1E1035] truncate">{t("hero_card1_title")}</h4>
                  <p className="text-[9px] sm:text-[10px] font-bold text-sky-600 mt-0.5">
                    {t("hero_card1_desc")}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* BOX 2 (Center Hero): Móc Khóa Mica LADA GIFT (Bán chạy #1) (`gallery-1.jpg`) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * 22}px, ${mousePos.y * 22}px)`,
              }}
              className="absolute z-30 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  x: [0, 5, -5, 0],
                  rotate: [-2, 2, -2],
                  rotateX: [6, -6, 6],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-46 sm:w-50 rounded-3xl p-2.5 bg-white/95 backdrop-blur-2xl border-2 border-white/95 shadow-[0_20px_50px_rgba(244,114,182,0.38)] transition-all duration-300 hover:scale-108 hover:z-50 hover:shadow-[0_25px_60px_rgba(244,114,182,0.55)] group cursor-pointer"
              >
                {/* Heart-shaped metal connector ring */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                  <div className="h-8 w-8 rounded-full border-[3px] border-slate-300 bg-gradient-to-tr from-slate-200 via-white to-slate-400 shadow-md flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500 animate-pulse" />
                  </div>
                  <div className="h-2 w-1.5 rounded-full bg-slate-300 -mt-1 shadow-sm" />
                </div>

                {/* Badge Row */}
                <div className="flex items-center justify-between mb-1.5 mt-0.5">
                  <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                    {t("hero_card2_badge")}
                  </span>
                  <span className="text-[11px] font-black text-pink-600 font-mono">
                    35.000đ
                  </span>
                </div>

                {/* Real Product Photo from Workshop (`keychain-shiba-hand.webp`) */}
                <div className="relative h-40 sm:h-46 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                  <img
                    src="/images/lada/keychain-shiba-hand.webp"
                    alt="Móc khóa mica in hình LADA GIFT"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Glass Gloss Shimmer */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)",
                      backgroundSize: "200% 200%",
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  />
                </div>

                {/* Title */}
                <div className="mt-2 text-center">
                  <h4 className="text-[11px] sm:text-xs font-black text-[#1E1035] truncate">{t("hero_card2_title")}</h4>
                  <p className="text-[9px] sm:text-[10px] font-bold text-pink-600 mt-0.5">
                    {t("hero_card2_desc")}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* BOX 3 (Bottom-Right): Set Quà Tặng Mica Pha Lê (`gallery-4.jpg`) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * 24}px, ${mousePos.y * -20}px)`,
              }}
              className="absolute z-20 right-0 sm:right-4 bottom-2 sm:bottom-4 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [0, 14, -6, 0],
                  x: [0, -6, 4, 0],
                  rotate: [6, 2, 8, 6],
                  rotateY: [6, -6, 6],
                  rotateX: [-6, 6, -6],
                }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-42 sm:w-46 rounded-3xl p-2.5 bg-white/95 backdrop-blur-2xl border-2 border-white/95 shadow-[0_20px_50px_rgba(168,85,247,0.32)] transition-all duration-300 hover:scale-108 hover:z-50 hover:shadow-[0_25px_60px_rgba(168,85,247,0.5)] group cursor-pointer"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                    {t("hero_card3_badge")}
                  </span>
                  <span className="text-[10px] font-black text-purple-600 font-mono">
                    VIP
                  </span>
                </div>

                {/* Real Product Photo (`magnet-family-decor.webp`) */}
                <div className="relative h-36 sm:h-40 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                  <img
                    src="/images/lada/magnet-family-decor.webp"
                    alt="Set quà tặng mica in hình LADA GIFT"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Glass Gloss Shimmer */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)",
                      backgroundSize: "200% 200%",
                      animation: "shimmer 2.8s ease-in-out infinite",
                    }}
                  />
                </div>

                <div className="mt-2 text-center">
                  <h4 className="text-[11px] sm:text-xs font-black text-[#1E1035] truncate">{t("hero_card3_title")}</h4>
                  <p className="text-[9px] sm:text-[10px] font-bold text-purple-600 mt-0.5">
                    {t("hero_card3_desc")}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
