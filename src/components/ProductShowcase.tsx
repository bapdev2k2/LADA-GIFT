"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { type Product, products, formatPrice } from "@/data/products";
import { useLanguage } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  SVG illustrations per product category                            */
/* ------------------------------------------------------------------ */

function KeychainSVG() {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-36 drop-shadow-[0_0_24px_rgba(0,212,255,0.4)]"
    >
      <defs>
        <linearGradient id="kc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="kc-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Ring at top */}
      <circle
        cx="60"
        cy="22"
        r="14"
        stroke="url(#kc-ring)"
        strokeWidth="3.5"
        fill="none"
      />
      {/* Connector */}
      <rect x="57" y="35" width="6" height="12" rx="2" fill="url(#kc-ring)" />
      {/* Main body */}
      <rect
        x="20"
        y="47"
        width="80"
        height="100"
        rx="14"
        fill="url(#kc-grad)"
        opacity="0.85"
      />
      {/* Inner shine */}
      <rect
        x="28"
        y="55"
        width="64"
        height="84"
        rx="10"
        fill="white"
        opacity="0.08"
      />
      {/* Diagonal shine */}
      <rect
        x="30"
        y="60"
        width="18"
        height="70"
        rx="6"
        fill="white"
        opacity="0.12"
        transform="rotate(-12 39 95)"
      />
      {/* Star sparkle */}
      <circle cx="75" cy="68" r="3" fill="white" opacity="0.5" />
      <circle cx="45" cy="120" r="2" fill="white" opacity="0.35" />
    </svg>
  );
}

function MagnetSVG() {
  return (
    <svg
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 h-32 drop-shadow-[0_0_24px_rgba(168,85,247,0.4)]"
    >
      <defs>
        <linearGradient id="mg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Main square */}
      <rect
        x="10"
        y="10"
        width="110"
        height="110"
        rx="18"
        fill="url(#mg-grad)"
        opacity="0.85"
      />
      {/* Inner frame */}
      <rect
        x="20"
        y="20"
        width="90"
        height="90"
        rx="12"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.15"
      />
      {/* Magnet icon */}
      <path
        d="M50 50 C50 38, 80 38, 80 50 L80 80 L72 80 L72 52 C72 46, 58 46, 58 52 L58 80 L50 80 Z"
        fill="white"
        opacity="0.25"
      />
      {/* Poles */}
      <rect x="48" y="78" width="14" height="8" rx="2" fill="#f9a8d4" opacity="0.5" />
      <rect x="68" y="78" width="14" height="8" rx="2" fill="#818cf8" opacity="0.5" />
      {/* Shine */}
      <rect
        x="18"
        y="18"
        width="14"
        height="60"
        rx="7"
        fill="white"
        opacity="0.1"
        transform="rotate(-10 25 48)"
      />
      {/* Sparkles */}
      <circle cx="100" cy="30" r="3" fill="white" opacity="0.4" />
      <circle cx="35" cy="100" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}

function MicaMagnetSVG() {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-36 h-28 drop-shadow-[0_0_24px_rgba(16,185,129,0.4)]"
    >
      <defs>
        <linearGradient id="mm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="mm-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      {/* Shadow / perspective back */}
      <rect
        x="18"
        y="14"
        width="110"
        height="96"
        rx="10"
        fill="#0ea5e9"
        opacity="0.15"
        transform="skewY(-2)"
      />
      {/* Main body */}
      <rect
        x="12"
        y="10"
        width="116"
        height="100"
        rx="12"
        fill="url(#mm-grad)"
        opacity="0.85"
      />
      {/* Glossy top half */}
      <rect
        x="12"
        y="10"
        width="116"
        height="50"
        rx="12"
        fill="white"
        opacity="0.1"
      />
      {/* Edge glow line */}
      <rect
        x="12"
        y="106"
        width="116"
        height="4"
        rx="2"
        fill="url(#mm-edge)"
        opacity="0.6"
      />
      {/* Inner shine line */}
      <rect
        x="22"
        y="20"
        width="10"
        height="70"
        rx="5"
        fill="white"
        opacity="0.12"
        transform="rotate(-6 27 55)"
      />
      {/* Diamond sparkle center */}
      <path
        d="M70 50 L74 58 L70 66 L66 58 Z"
        fill="white"
        opacity="0.3"
      />
      {/* Sparkles */}
      <circle cx="108" cy="30" r="3" fill="white" opacity="0.45" />
      <circle cx="40" cy="88" r="2.5" fill="white" opacity="0.3" />
      <circle cx="100" cy="85" r="2" fill="white" opacity="0.25" />
    </svg>
  );
}

const productIllustrations: Record<Product["category"], React.FC> = {
  keychain: KeychainSVG,
  magnet: MagnetSVG,
  "mica-magnet": MicaMagnetSVG,
};

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

interface CardProps {
  product: Product;
  index: number;
  onViewDetails?: (product: Product) => void;
  onOrder?: (product: Product) => void;
}

function ProductCard({ product, index, onViewDetails, onOrder }: CardProps) {
  const { t, language } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const Illustration = productIllustrations[product.category];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -15, y: x * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const padded = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        },
      }}
      className="group perspective-[1200px] h-full flex flex-col"
    >
      {/* 3‑D tilt wrapper */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative will-change-transform h-full flex flex-col flex-1"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Holographic gradient border glow */}
        <div
          className={`
            absolute -inset-[1px] rounded-3xl opacity-0 blur-[2px]
            bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500
            transition-opacity duration-300
            ${isHovered ? "opacity-70" : ""}
          `}
        />

        {/* Card body */}
        <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border-2 border-white/90 shadow-xl shadow-pink-200/40 transition-all duration-300 group-hover:border-pink-400 group-hover:shadow-2xl h-full flex flex-col justify-between flex-1">
          {/* Light sweep overlay */}
          <div
            className={`
              pointer-events-none absolute inset-0 z-10
              bg-gradient-to-r from-transparent via-white/40 to-transparent
              -translate-x-full transition-transform duration-700 ease-in-out
              ${isHovered ? "translate-x-full" : ""}
            `}
            style={{ width: "200%" }}
          />

          {/* Number badge */}
          <div className="absolute top-4 left-4 z-20">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-xs font-black tracking-widest bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-300/50"
            >
              {padded}
            </span>
          </div>

          {/* Illustration area */}
          <div className="relative flex items-center justify-center pt-16 pb-8 bg-gradient-to-b from-pink-50/60 to-purple-50/40">
            {/* Soft radial glow behind illustration */}
            <div
              className={`
                absolute inset-0 opacity-40
                bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.3)_0%,transparent_70%)]
                ${isHovered ? "opacity-70" : ""}
                transition-opacity duration-500
              `}
            />
            <motion.div
              animate={isHovered ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <Illustration />
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-between space-y-4">
            {/* Name + description */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#1E1035] leading-tight">
                {language === "th"
                  ? (product.category === "keychain" ? "พวงกุญแจอะคริลิก LADA" : product.category === "magnet" ? "แม่เหล็กพิมพ์ภาพติดตู้เย็น" : "อะคริลิกแม่เหล็กเจียระไนขอบเพชร")
                  : language === "en"
                  ? product.name
                  : product.nameVi}
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed min-h-[44px] line-clamp-2">
                {language === "th"
                  ? (product.category === "keychain"
                      ? "พวงกุญแจอะคริลิกใสคุณภาพพรีเมียม พิมพ์ภาพตามสั่ง ผิวมันวาวดุจคริสตัล พร้อมห่วงโลหะแข็งแรง"
                      : product.category === "magnet"
                      ? "แม่เหล็กพิมพ์ภาพตามสั่ง สำหรับติดตู้เย็นหรือพื้นผิวโลหะ มีให้เลือกทั้งแบบสี่เหลี่ยมและไดคัทตามทรงภาพ"
                      : "อะคริลิกหล่อแข็งระดับพรีเมียม ฝังแม่เหล็กนีโอไดเมียม เจียระไนขอบเพชร CNC แวววาวหรูหรา")
                  : language === "en"
                  ? product.description
                  : product.descriptionVi}
              </p>
            </div>

            {/* Price */}
            <p className="text-2xl font-black text-pink-600">
              {formatPrice(product.price)}
              <span className="text-xs font-bold text-slate-500 ml-1.5">
                {t("per_size_s")}
              </span>
            </p>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
              {(language === "th"
                ? (product.category === "keychain"
                    ? ["อะคริลิกใส 99.8%", "พิมพ์ UV คมชัดสูง", "ห่วงโลหะพรีเมียม", "กันรอยขีดข่วน"]
                    : product.category === "magnet"
                    ? ["แม่เหล็กแรงดูดสูง", "พิมพ์สี HD แม่นยำ", "กันน้ำ 100%", "ไดคัทตามทรง"]
                    : ["อะคริลิกหล่อเกรด A", "แม่เหล็กฝังแนบเนียน", "เจียระไนขอบเพชร CNC", "ผิวมันวาวดุจกระจก"])
                : language === "en"
                ? (product.category === "keychain"
                    ? ["99.8% Clear Acrylic", "Sharp UV Print", "Durable Metal Ring", "Scratch Resistant"]
                    : product.category === "magnet"
                    ? ["Strong Magnetic Grip", "HD Color Print", "100% Waterproof", "Custom Die-cut"]
                    : ["Grade A Cast Acrylic", "Embedded Magnet", "Diamond CNC Bevel", "Mirror Gloss Surface"])
                : product.features
              ).map((feat) => (
                <span
                  key={feat}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-pink-50/90 border border-pink-200/80 text-pink-700 shadow-sm"
                >
                  {feat}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onViewDetails?.(product)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-pink-300 bg-white/90 text-slate-800 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-400 transition-colors duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                {t("btn_view_detail")}
              </button>
              <button
                type="button"
                onClick={() => onOrder?.(product)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 hover:brightness-110 shadow-md shadow-pink-400/30 transition-all duration-200 cursor-pointer active:scale-95"
              >
                {t("btn_customize_now")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

interface ProductShowcaseProps {
  onViewDetails?: (product: Product) => void;
  onOrder?: (product: Product) => void;
}

export default function ProductShowcase({ onViewDetails, onOrder }: ProductShowcaseProps = {}) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1 text-xs font-black uppercase tracking-widest text-pink-700 shadow-sm backdrop-blur-md mb-3">
            <span>LADA GIFT • {t("showcase_subtitle")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1035]">
            {t("showcase_title").toUpperCase()}{" "}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              LADA GIFT
            </span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500" />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } },
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onViewDetails={onViewDetails}
              onOrder={onOrder}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
