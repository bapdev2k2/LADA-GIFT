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
  Star,
  ShieldCheck,
  Zap,
  Gift,
  CheckCircle2,
  Eye,
} from "lucide-react";
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
      className="relative flex w-full items-start overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12"
    >
      {/* Ambient Radial Lights behind Hero */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-[110px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-sky-300/30 blur-[100px]" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-6 lg:flex-row lg:items-start lg:gap-12 lg:px-8 xl:gap-16">
        {/* Left Column: Brand, Persuasive Headline & Copywriting */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* 1. Hot Promotion / Brand Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3.5 inline-flex items-center gap-2.5 rounded-full border-2 border-pink-300/90 bg-white/90 px-4 py-1.5 shadow-md shadow-pink-200/50 backdrop-blur-xl"
          >
            <div className="h-5 w-5 rounded-full overflow-hidden border border-pink-300 shadow-sm flex-shrink-0">
              <img
                src="/lada-gift-logo.jpg"
                alt="LADA GIFT Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xs font-black tracking-wider text-pink-700 uppercase flex items-center gap-1.5">
              <span>XƯỞNG MICA QUÀ TẶNG CAO CẤP</span>
              <span className="hidden sm:inline text-pink-400">•</span>
              <span className="hidden sm:inline font-extrabold text-purple-700">IN THEO YÊU CẦU</span>
            </span>
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping ml-0.5" />
          </motion.div>

          {/* 2. Headline - Cực kỳ nổi bật, ngang bằng với ảnh động bên phải */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#180D2B] leading-[1.14]">
              Biến Kỷ Niệm Thành{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                  Kiệt Tác Pha Lê
                </span>
                {/* Floating Bling Star on the word */}
                <BlingSparkle top="-10px" left="96%" delay={0.2} size={20} />
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold text-slate-800">
                Móc Khóa & Nam Châm Mica LADA
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
            Mica Acrylic đúc nguyên khối siêu trong suốt 99.8%, vát cạnh kim cương CNC bóng loáng. In hình cá nhân hóa theo yêu cầu — sắc nét, bền màu 10 năm.
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
              <span>Tự thiết kế & Xem bản in ngay</span>
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => smoothScrollTo("#products", 85, 750)}
              className="w-full sm:w-auto py-3.5 px-6"
            >
              <Eye className="h-4 w-4 text-pink-600" />
              <span>Khám phá sản phẩm</span>
              <ChevronRight className="h-4 w-4 ml-0.5" />
            </MagneticButton>
          </motion.div>

          {/* 5. Gold Trust Badges (Bố cục 2x2 gọn gàng, thoáng đãng) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-lg text-left"
          >
            {[
              {
                icon: Zap,
                title: "Duyệt mẫu trong 15P",
                desc: "Gửi demo bản in xem trước miễn phí",
              },
              {
                icon: ShieldCheck,
                title: "Mica đúc Grade A 100%",
                desc: "Trong suốt 99.8%, không ố vàng 10 năm",
              },
              {
                icon: Gift,
                title: "Hộp quà & Thiệp chỉn chu",
                desc: "Đóng gói sang trọng sẵn sàng tặng",
              },
              {
                icon: CheckCircle2,
                title: "Bảo hành 1 đổi 1",
                desc: "Đổi mới lập tức nếu bản in không sắc nét",
              },
            ].map((badge) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={badge.title}
                  className="flex items-center gap-3 rounded-2xl bg-white/85 p-2.5 sm:p-3 border border-pink-200/90 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white hover:border-pink-300 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-600 flex-shrink-0 shadow-inner">
                    <IconComp className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-black text-[#1E1035] leading-snug">
                      {badge.title}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-600 mt-0.5 whitespace-normal leading-tight">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: 3D Floating Stage - CĂN CAO NGANG BẰNG VỚI TEXT "Biến Kỷ Niệm Thành" */}
        <div className="relative flex flex-1 items-start justify-center w-full max-w-lg lg:max-w-none pt-4 lg:pt-11">
          {/* Ambient Glowing Aura */}
          <div className="pointer-events-none absolute h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-pink-400/25 via-purple-400/20 to-sky-300/25 blur-[90px] animate-pulse" />

          {/* Central 3D Showcase Presentation */}
          <div className="relative w-full h-[440px] sm:h-[480px] flex items-start justify-center perspective-[1200px]">
            {/* Bling Sparkles around the 3D Stage */}
            <BlingSparkle top="2%" left="12%" delay={0} size={22} />
            <BlingSparkle top="14%" left="84%" delay={0.6} size={18} />
            <BlingSparkle top="75%" left="6%" delay={1.2} size={20} />
            <BlingSparkle top="82%" left="80%" delay={1.8} size={24} />

            {/* Main Primary Showcase Card (Đỉnh card ngang bằng với text Biến Kỷ Niệm Thành) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px) rotate(-4deg)`,
              }}
              className="absolute z-20 left-4 sm:left-8 top-0 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-4, -2, -5, -4],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-52 sm:w-60 rounded-3xl p-3 bg-white/95 backdrop-blur-2xl border-2 border-white/95 shadow-[0_20px_50px_rgba(244,114,182,0.35)] transition-all duration-300 hover:scale-105 group"
              >
                {/* Heart-shaped metal connector ring */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                  <div className="h-9 w-9 rounded-full border-[3px] border-slate-300 bg-gradient-to-tr from-slate-200 via-white to-slate-400 shadow-md flex items-center justify-center">
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" />
                  </div>
                  <div className="h-2.5 w-1.5 rounded-full bg-slate-300 -mt-1 shadow-sm" />
                </div>

                {/* Badge Row */}
                <div className="flex items-center justify-between mb-2 mt-0.5">
                  <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                    Bán chạy #1
                  </span>
                  <span className="text-xs font-black text-pink-600 font-mono">
                    35.000đ
                  </span>
                </div>

                {/* Real Product Photo from Workshop (`gallery-1.jpg`) */}
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                  <img
                    src="/gallery/gallery-1.jpg"
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
                <div className="mt-2.5 text-center">
                  <h4 className="text-xs sm:text-sm font-black text-[#1E1035]">Móc Khóa Mica LADA GIFT</h4>
                  <p className="text-[10px] sm:text-[11px] font-bold text-pink-600 mt-0.5">
                    Vát kim cương CNC • In 2 mặt
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Secondary Showcase Card (Real Acrylic Photo `gallery-4.jpg`) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) rotate(6deg)`,
              }}
              className="absolute z-10 right-2 sm:right-6 bottom-2 sm:bottom-6 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [6, 8, 5, 6],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 sm:w-54 rounded-3xl p-3 bg-white/90 backdrop-blur-2xl border-2 border-white/90 shadow-[0_20px_50px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-105 group"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-full bg-gradient-to-r from-purple-600 to-sky-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                    In Theo Ảnh Yêu Cầu
                  </span>
                  <span className="text-[11px] font-black text-purple-600 font-mono">
                    Cao Cấp
                  </span>
                </div>

                {/* Real Product Photo (`gallery-4.jpg`) */}
                <div className="relative h-40 sm:h-46 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                  <img
                    src="/gallery/gallery-4.jpg"
                    alt="Set quà tặng mica in hình LADA GIFT"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="mt-2 text-center">
                  <h4 className="text-xs font-black text-[#1E1035]">Set Quà Tặng Cá Nhân Hóa</h4>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                    Tặng người yêu, bạn thân, kỷ niệm
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Customer Review Bubble Floating Card */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 left-4 sm:left-10 z-30 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2 shadow-xl shadow-pink-300/40 border border-pink-200 backdrop-blur-md"
            >
              <div className="flex -space-x-1.5 overflow-hidden">
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[10px] font-black text-slate-700 ml-1">5.0 (2,400+ review)</span>
                </div>
                <p className="text-[10px] font-extrabold text-[#1E1035]">
                  &ldquo;Mica bóng loáng như pha lê, in nét xỉu!&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
