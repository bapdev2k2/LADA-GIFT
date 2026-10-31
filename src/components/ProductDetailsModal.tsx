"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Shield, Sparkles, ArrowRight, Star } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (product: Product, size: "S" | "L" | "XL") => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onCustomize,
}: ProductDetailsModalProps) {
  const [selectedSize, setSelectedSize] = useState<"S" | "L" | "XL">("L");

  if (!isOpen || !product) return null;

  const currentSizeObj =
    product.sizes.find((s) => s.label === selectedSize) || product.sizes[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-3xl rounded-3xl border border-cyan-500/30 bg-[#0c1024]/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,212,255,0.2)] backdrop-blur-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full border border-white/10 bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Visual representation */}
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-[#13193a] to-[#0a0d1f] p-8 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.2)_0%,_transparent_70%)] pointer-events-none" />

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 1.5, -1.5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex flex-col items-center"
              >
                {product.category === "keychain" && (
                  <div className="h-10 w-10 rounded-full border-[3.5px] border-zinc-200 bg-gradient-to-tr from-zinc-400 via-zinc-100 to-zinc-400 shadow-md mb-[-6px] z-10" />
                )}

                <div
                  className={`w-44 h-56 rounded-2xl border-2 border-white/40 shadow-2xl backdrop-blur-lg flex items-center justify-center relative overflow-hidden bg-gradient-to-tr ${product.gradient}`}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                  <div className="relative text-center p-4 z-10">
                    <Sparkles className="h-10 w-10 text-white/90 mx-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                    <p className="mt-2 text-sm font-bold text-white drop-shadow">
                      {product.nameVi}
                    </p>
                    <span className="inline-block mt-2 rounded-full bg-black/40 px-3 py-1 text-xs font-mono text-pink-300 border border-white/20">
                      LADA GIFT Grade A+
                    </span>
                  </div>

                  {/* Holographic light reflection */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent mix-blend-overlay" />
                </div>
              </motion.div>

              <div className="mt-6 flex items-center gap-1.5 text-xs text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400" />
                ))}
                <span className="text-zinc-300 ml-1.5 font-medium">(4.9/5 từ 2,400+ đánh giá)</span>
              </div>
            </div>

            {/* Product info */}
            <div>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                Chi tiết sản phẩm
              </span>

              <h3 className="mt-3 text-2xl font-black text-white">{product.nameVi}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {product.descriptionVi}
              </p>

              {/* Technical specs */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>Mica Acrylic đúc siêu trong suốt 3.5mm vát cạnh kim cương CNC</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>In phun kỹ thuật số UV 8 màu độ phân giải cao 2400 DPI</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>
                    {product.category === "keychain"
                      ? "Khoen inox mạ titan chống gỉ sét 100%"
                      : "Nam châm vĩnh cửu Neodymium lực hút mạnh, bám chắc"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Shield className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <span>Bảo hành phai màu 10 năm & 1 đổi 1 nếu lỗi in ấn</span>
                </div>
              </div>

              {/* Size selector */}
              <div className="mt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Chọn kích thước:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSelectedSize(s.label as "S" | "L" | "XL")}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        selectedSize === s.label
                          ? "border-cyan-400 bg-cyan-500/20 text-white font-bold shadow-md shadow-cyan-500/20"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label} ({s.dimension})</div>
                      <div className="text-[11px] text-cyan-300 mt-0.5">
                        {formatPrice(s.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Giá sản phẩm:</div>
                  <div className="text-2xl font-black text-cyan-300">
                    {formatPrice(currentSizeObj.price)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCustomize(product, selectedSize);
                  }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition"
                >
                  <span>Tự thiết kế & Đặt hàng</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
