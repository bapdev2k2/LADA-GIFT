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
      className="relative flex min-h-[94vh] w-full items-center overflow-hidden pt-28 pb-16 sm:py-32"
    >
      {/* Ambient Radial Lights behind Hero */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[550px] w-[550px] rounded-full bg-pink-300/35 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[500px] w-[500px] rounded-full bg-sky-300/35 blur-[110px]" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-center lg:gap-14 lg:px-8 xl:gap-20">
        {/* Left Column: Brand, Persuasive Headline & Copywriting */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* 1. Hot Promotion / Brand Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border-2 border-pink-300/90 bg-white/90 px-4 py-1.5 shadow-md shadow-pink-200/50 backdrop-blur-xl"
          >
            <div className="h-6 w-6 rounded-full overflow-hidden border border-pink-300 shadow-sm flex-shrink-0">
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

          {/* 2. Headline - Cực kỳ nổi bật, cảm xúc & thôi thúc khách hàng */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-[#180D2B] leading-[1.12]">
              Biến Kỷ Niệm Thành{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                  Kiệt Tác Pha Lê
                </span>
                {/* Floating Bling Star on the word */}
                <BlingSparkle top="-12px" left="96%" delay={0.2} size={22} />
              </span>
              <br />
              <span className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-slate-800">
                Móc Khóa & Nam Châm Mica LADA
              </span>
            </h1>
          </motion.div>

          {/* 3. Sub-headline - Đầy đủ giá trị, thuyết phục & giải quyết nỗi lo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 mb-8 max-w-xl text-base sm:text-lg leading-relaxed text-slate-700 font-semibold"
          >
            Lưu giữ trọn vẹn từng khoảnh khắc ngọt ngào của người yêu thương, gia đình, thú cưng hay idol yêu thích với chất liệu{" "}
            <span className="font-extrabold text-[#180D2B] bg-pink-100/80 px-2 py-0.5 rounded-md border border-pink-200">
              Mica Acrylic đúc trong suốt 99.8%
            </span>
            , vát cạnh kim cương CNC siêu bóng gương. In sắc nét chuẩn màu, bền bỉ trên 10 năm không phai!
          </motion.p>

          {/* 4. Action CTA Buttons Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 lg:justify-start w-full sm:w-auto"
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
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
              <span>Tự thiết kế & Xem bản in ngay</span>
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => smoothScrollTo("#products", 85, 750)}
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 text-pink-600" />
              <span>Khám phá các dòng sản phẩm</span>
              <ChevronRight className="h-4 w-4 ml-0.5" />
            </MagneticButton>
          </motion.div>

          {/* 5. Gold Trust Badges (Cam kết vàng thuyết phục khách) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left"
          >
            {[
              {
                icon: Zap,
                title: "Duyệt mẫu 15P",
                desc: "Gửi demo xem trước",
              },
              {
                icon: ShieldCheck,
                title: "Mica đúc 100%",
                desc: "Không ố vàng, chống vỡ",
              },
              {
                icon: Gift,
                title: "Hộp quà chỉn chu",
                desc: "Tặng kèm thiệp thiết kế",
              },
              {
                icon: CheckCircle2,
                title: "Bảo hành 1-1",
                desc: "Đổi mới nếu không sắc nét",
              },
            ].map((badge) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={badge.title}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/80 p-2.5 sm:p-3 border border-pink-200/90 shadow-sm backdrop-blur-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600 flex-shrink-0">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#1E1035] leading-tight">
                      {badge.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: 3D Floating Stage with Real Finished Products from Workshop */}
        <div className="relative flex flex-1 items-center justify-center w-full max-w-lg lg:max-w-none">
          {/* Ambient Glowing Aura */}
          <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-pink-400/30 via-purple-400/25 to-sky-300/30 blur-[100px] animate-pulse" />

          {/* Central 3D Showcase Presentation */}
          <div className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center perspective-[1200px]">
            {/* Bling Sparkles around the 3D Stage */}
            <BlingSparkle top="8%" left="15%" delay={0} size={24} />
            <BlingSparkle top="18%" left="82%" delay={0.6} size={20} />
            <BlingSparkle top="75%" left="8%" delay={1.2} size={22} />
            <BlingSparkle top="82%" left="78%" delay={1.8} size={26} />

            {/* Main Primary Showcase Card (Real Acrylic Keychain from workshop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) rotate(-4deg)`,
              }}
              className="absolute z-20 left-4 sm:left-10 top-6 sm:top-10 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [-4, -2, -5, -4],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-56 sm:w-64 rounded-3xl p-3.5 bg-white/90 backdrop-blur-2xl border-2 border-white/95 shadow-[0_25px_60px_rgba(244,114,182,0.35)] transition-all duration-300 hover:scale-105 group"
              >
                {/* Heart-shaped metal connector ring */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                  <div className="h-10 w-10 rounded-full border-[3.5px] border-slate-300 bg-gradient-to-tr from-slate-200 via-white to-slate-400 shadow-md flex items-center justify-center">
                    <Heart className="h-4.5 w-4.5 text-pink-500 fill-pink-500 animate-pulse" />
                  </div>
                  <div className="h-3 w-1.5 rounded-full bg-slate-300 -mt-1 shadow-sm" />
                </div>

                {/* Badge Row */}
                <div className="flex items-center justify-between mb-2 mt-1">
                  <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                    Bán chạy #1
                  </span>
                  <span className="text-xs font-black text-pink-600 font-mono">
                    35.000đ
                  </span>
                </div>

                {/* Real Product Photo from Workshop (`gallery-1.jpg`) */}
                <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden border-2 border-white/90 bg-slate-100 flex items-center justify-center shadow-inner">
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
                <div className="mt-3 text-center">
                  <h4 className="text-sm font-black text-[#1E1035]">Móc Khóa Mica LADA GIFT</h4>
                  <p className="text-[11px] font-bold text-pink-600 mt-0.5">
                    Vát kim cương CNC • In 2 mặt
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Secondary Showcase Card (Real Acrylic Photo `gallery-4.jpg`) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px) rotate(6deg)`,
              }}
              className="absolute z-10 right-2 sm:right-6 bottom-4 sm:bottom-8 will-change-transform"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [6, 8, 5, 6],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="w-52 sm:w-60 rounded-3xl p-3 bg-white/85 backdrop-blur-2xl border-2 border-white/90 shadow-[0_20px_50px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-105 group"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-full bg-gradient-to-r from-purple-600 to-sky-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                    In Theo Ảnh Yêu Cầu
                  </span>
                  <span className="text-[11px] font-black text-purple-600 font-mono">
                    Cao Cấp
                  </span>
                </div>

                {/* Real Product Photo (`gallery-4.jpg`) */}
                <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border-2 border-white/90 bg-slate-100 flex items-center justify-center shadow-inner">
                  <img
                    src="/gallery/gallery-4.jpg"
                    alt="Set quà tặng mica in hình LADA GIFT"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="mt-2.5 text-center">
                  <h4 className="text-xs sm:text-sm font-black text-[#1E1035]">Set Quà Tặng Cá Nhân Hóa</h4>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5">
                    Tặng người yêu, bạn thân, kỷ niệm
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Customer Review Bubble Floating Card */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 left-6 sm:left-14 z-30 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-xl shadow-pink-300/40 border border-pink-200 backdrop-blur-md"
            >
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[10px] font-black text-slate-700 ml-1">5.0 (2,400+ review)</span>
                </div>
                <p className="text-[11px] font-extrabold text-[#1E1035]">
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
