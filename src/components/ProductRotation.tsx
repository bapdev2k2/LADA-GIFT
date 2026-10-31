"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Showcase Products Data for LADA GIFT (Using real workshop photos)         */
/* -------------------------------------------------------------------------- */

interface ShowcaseItem {
  id: string;
  name: string;
  subtitle: string;
  type: "keychain" | "magnet" | "mica-magnet" | "standee";
  image: string;
  badge: string;
  price: string;
}

const showcaseProducts: ShowcaseItem[] = [
  {
    id: "item-1",
    name: "Móc khóa Mica LADA GIFT",
    subtitle: "In 2 mặt sắc nét • Khoen tim",
    type: "keychain",
    image: "/gallery/gallery-1.jpg",
    badge: "Bán chạy #1",
    price: "35.000đ",
  },
  {
    id: "item-2",
    name: "Nam châm Kỷ Niệm",
    subtitle: "Lực hút cực mạnh • Chống nước",
    type: "magnet",
    image: "/gallery/gallery-2.jpg",
    badge: "Hút cực mạnh",
    price: "25.000đ",
  },
  {
    id: "item-3",
    name: "Mica vát cạnh kim cương",
    subtitle: "Vát CNC siêu bóng gương",
    type: "mica-magnet",
    image: "/gallery/gallery-3.jpg",
    badge: "Cao cấp VIP",
    price: "45.000đ",
  },
  {
    id: "item-4",
    name: "Set quà tặng móc khóa",
    subtitle: "Cá nhân hóa theo ảnh riêng",
    type: "keychain",
    image: "/gallery/gallery-4.jpg",
    badge: "Hot Trend",
    price: "35.000đ",
  },
  {
    id: "item-5",
    name: "Móc khóa nhân vật yêu thích",
    subtitle: "Mica trong suốt chuẩn A 99.8%",
    type: "keychain",
    image: "/gallery/gallery-5.jpg",
    badge: "Độc quyền",
    price: "35.000đ",
  },
  {
    id: "item-6",
    name: "Mica quà tặng kỷ niệm",
    subtitle: "Gift From The Heart",
    type: "mica-magnet",
    image: "/gallery/gallery-6.jpg",
    badge: "Gift Edition",
    price: "45.000đ",
  },
];

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
          fill="url(#bling-grad-rot)"
        />
        <defs>
          <linearGradient id="bling-grad-rot" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function ProductRotation({
  onOpenCustomizer,
}: {
  onOpenCustomizer?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const platformRef = useRef<HTMLDivElement>(null);

  // References for pure 120 FPS continuous loop without React re-renders
  const isHoveredAreaRef = useRef(false);
  const hoveredCardIdxRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  // Expanded orbit radiuses:
  // Base radius: 370px / 200px (wide & spacious)
  // Hovered arena radius: 470px / 250px (expands outward dramatically!)
  const radiusXRef = useRef(370);
  const radiusZRef = useRef(200);

  // Active state indicator for UI
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const isMobile = window.innerWidth < 640;

      // Expanded radiuses:
      // Base: wide enough so cards don't bunch up!
      // Hover: expands further when mouse approaches!
      const targetRadiusX = isHoveredAreaRef.current
        ? isMobile ? 240 : 470
        : isMobile ? 180 : 370;
      const targetRadiusZ = isHoveredAreaRef.current
        ? isMobile ? 145 : 250
        : isMobile ? 110 : 200;

      // Smooth Lerp physics for radius expansion
      radiusXRef.current += (targetRadiusX - radiusXRef.current) * 0.08;
      radiusZRef.current += (targetRadiusZ - radiusZRef.current) * 0.08;

      // Rotation speed:
      // When hovering on a card: STOP ROTATION COMPLETELY (0.0) so user can view/click comfortably!
      // When mouse leaves the card: resume smooth slow rotation!
      const rotationSpeed = hoveredCardIdxRef.current !== null
        ? 0.0
        : isHoveredAreaRef.current
        ? 6.5
        : 10.5;

      angleRef.current = (angleRef.current + delta * rotationSpeed) % 360;

      // Smooth scale for central platform ring
      if (platformRef.current) {
        const ringScale = isHoveredAreaRef.current ? 1.25 : 1.0;
        platformRef.current.style.transform = `rotateX(75deg) scale(${ringScale})`;
      }

      // Update each 3D card position directly via DOM style (ZERO React setState during loop)
      const total = showcaseProducts.length;
      for (let i = 0; i < total; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const angleDeg = (i / total) * 360 + angleRef.current;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = Math.sin(angleRad) * radiusXRef.current;
        const z = Math.cos(angleRad) * radiusZRef.current;
        const yFloat = Math.sin((angleDeg * 2 * Math.PI) / 180) * 8;

        const depthFactor = (z + radiusZRef.current) / (2 * radiusZRef.current); // 0 to 1
        const scale = 0.78 + depthFactor * 0.38;
        // Rear cards opacity is slightly dimmed (0.75), front cards 1.0
        const opacity = 0.72 + depthFactor * 0.28;
        const zIndex = Math.round(depthFactor * 100);

        const isThisHovered = hoveredCardIdxRef.current === i;

        cardEl.style.transform = `translate3d(${x.toFixed(2)}px, ${yFloat.toFixed(2)}px, ${z.toFixed(2)}px) scale(${
          isThisHovered ? (scale * 1.12).toFixed(3) : scale.toFixed(3)
        })`;
        cardEl.style.opacity = isThisHovered ? "1" : opacity.toFixed(2);
        cardEl.style.zIndex = isThisHovered ? "999" : String(zIndex);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="showroom"
      className="relative py-20 sm:py-28 overflow-hidden select-none"
    >
      {/* Soft Light ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] sm:h-[850px] sm:w-[850px] rounded-full bg-gradient-to-tr from-pink-300/30 via-purple-300/25 to-sky-300/30 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-pink-700 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
            <span>LADA GIFT • Trải nghiệm 360° không gian 3D</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-black tracking-tight text-[#1E1035] sm:text-5xl"
          >
            SHOWROOM 360°{" "}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              LADA GIFT
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base font-semibold text-slate-700 max-w-xl mx-auto"
          >
            Sản phẩm tự động quay 360° liên tục. Vòng xoay tự động mở rộng khi rê chuột lại gần và tạm dừng khi trỏ vào sản phẩm.
          </motion.p>
        </div>

        {/* 3D Orbit Interactive Arena with Expanded Radius & Bling Bling */}
        <div
          ref={containerRef}
          onMouseEnter={() => {
            isHoveredAreaRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredAreaRef.current = false;
            hoveredCardIdxRef.current = null;
            setHoveredCardIdx(null);
          }}
          className="relative mt-8 mx-auto h-[520px] sm:h-[600px] w-full max-w-6xl flex items-center justify-center perspective-[1200px]"
        >
          {/* Central Bling Bling Platform with Expanded Size */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Base platform ellipse ring */}
            <div
              ref={platformRef}
              className="w-80 sm:w-[560px] h-32 sm:h-52 rounded-[100%] border-2 border-pink-400/60 bg-gradient-to-b from-white/70 to-pink-200/30 backdrop-blur-md shadow-[0_0_70px_rgba(244,114,182,0.45)] transition-transform duration-500 ease-out"
              style={{ transform: "rotateX(75deg)" }}
            />
            {/* Glowing core center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-28 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-cyan-400 opacity-60 blur-xl animate-pulse" />

            {/* Center Bling Stars */}
            <BlingSparkle top="-35px" left="30px" delay={0} size={24} />
            <BlingSparkle top="25px" left="-60px" delay={0.7} size={20} />
            <BlingSparkle top="-45px" left="-40px" delay={1.4} size={22} />
          </div>

          {/* 3D Orbiting Product Cards Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(10deg)",
            }}
          >
            {showcaseProducts.map((item, index) => {
              const isCardHovered = hoveredCardIdx === index;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onMouseEnter={() => {
                    hoveredCardIdxRef.current = index;
                    setHoveredCardIdx(index);
                  }}
                  onMouseLeave={() => {
                    hoveredCardIdxRef.current = null;
                    setHoveredCardIdx(null);
                  }}
                  className="absolute cursor-pointer will-change-transform"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translate3d(0, 0, 0)",
                  }}
                >
                  {/* Card Container: SOLID OPAQUE WHITE (Không mờ, không bóng ma xuyên thấu) */}
                  <div
                    className={`relative w-48 sm:w-56 rounded-3xl p-3.5 bg-white transition-all duration-200 ${
                      isCardHovered
                        ? "border-2 border-pink-500 shadow-[0_20px_50px_rgba(244,114,182,0.45)] ring-4 ring-pink-400/35 scale-105"
                        : "border-2 border-pink-100 shadow-xl shadow-purple-100/40 hover:border-pink-300"
                    }`}
                  >
                    {/* Bling Sparkles on Cards */}
                    <BlingSparkle top="-8px" left="-8px" delay={index * 0.3} size={16} />
                    {isCardHovered && (
                      <BlingSparkle top="-6px" left="88%" delay={0.2} size={18} />
                    )}

                    {/* Badge & Price */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-2.5 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
                        {item.badge}
                      </span>
                      <span className="text-xs font-black text-pink-600 font-mono">
                        {item.price}
                      </span>
                    </div>

                    {/* Real Product Photo */}
                    <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Bling Shimmer light sweep */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                        style={{
                          background:
                            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)",
                          backgroundSize: "200% 200%",
                          animation: "shimmer 3s ease-in-out infinite",
                        }}
                      />

                      {/* Keychain ring icon if keychain */}
                      {item.type === "keychain" && (
                        <div className="absolute top-2 left-2 h-6 w-6 rounded-full border-2 border-slate-300 bg-white/95 flex items-center justify-center shadow-sm">
                          <div className="h-2 w-2 rounded-full border border-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Title & subtitle (100% sharp text on solid white background) */}
                    <div className="mt-2.5 text-center px-1">
                      <h4 className="text-xs sm:text-sm font-black text-[#1E1035] leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Action button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenCustomizer) onOpenCustomizer();
                      }}
                      className="mt-2.5 w-full rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 py-1.5 text-center text-xs font-black text-white shadow-md shadow-pink-400/30 hover:brightness-110 transition active:scale-95 cursor-pointer"
                    >
                      Tùy biến ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orbit feature highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-black text-slate-700">
          <div className="flex items-center gap-2 rounded-full bg-white/90 border border-pink-200/80 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping" />
            <span>Tự động quay 360° • Dừng khi trỏ chuột</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/90 border border-purple-200/80 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Rê chuột mở rộng quỹ đạo</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/90 border border-sky-200/80 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>Mica vát kim cương CNC bắt sáng</span>
          </div>
        </div>
      </div>
    </section>
  );
}
