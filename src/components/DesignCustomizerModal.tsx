"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Sparkles,
  Check,
  RotateCw,
  ShoppingBag,
  Layers,
  Maximize2,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { fireHologramConfetti } from "@/lib/confetti";
import { formatPrice } from "@/data/products";

export interface CustomDesignData {
  productType: "keychain" | "magnet" | "mica-magnet";
  size: "S" | "L" | "XL";
  foilEffect: "prism" | "starlight" | "aurora" | "crystal";
  imageUrl: string;
  imageName: string;
  quantity: number;
}

interface DesignCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductType?: "keychain" | "magnet" | "mica-magnet";
  initialSize?: "S" | "L" | "XL";
  onAddToCart?: (item: any) => void;
}

const samplePresets = [
  {
    name: "LADA GIFT Brand",
    url: "/lada-gift-logo.jpg",
  },
  {
    name: "Couple Kỷ Niệm",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Kawaii Pet",
    url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Anime Chibi",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  },
];

const productTypes = [
  {
    id: "keychain" as const,
    name: "Móc khóa mica",
    tagline: "Có khoen kim loại treo chìa khóa",
    basePrice: 35000,
  },
  {
    id: "magnet" as const,
    name: "Nam châm in hình",
    tagline: "Dán tủ lạnh, bảng từ, case PC",
    basePrice: 25000,
  },
  {
    id: "mica-magnet" as const,
    name: "Mica nam châm",
    tagline: "Mặt mica bóng vát cạnh kim cương + nam châm",
    basePrice: 45000,
  },
];

const sizeOptions = [
  { id: "S" as const, label: "Size S (7.5 cm)", scale: 0.8, priceOffset: 0 },
  { id: "L" as const, label: "Size L (10 cm)", scale: 1.0, priceOffset: 10000 },
  { id: "XL" as const, label: "Size XL (15 cm)", scale: 1.25, priceOffset: 30000 },
];

const foilEffects = [
  {
    id: "prism" as const,
    name: "Bóng gương pha lê",
    desc: "Mặt mica trong suốt 99.8%",
    gradient: "from-pink-400 via-purple-400 to-sky-400",
  },
  {
    id: "starlight" as const,
    name: "Ánh sao Bling Bling",
    desc: "Hạt sao nhũ bắt sáng lấp lánh",
    gradient: "from-amber-300 via-pink-400 to-purple-400",
  },
  {
    id: "aurora" as const,
    name: "Cực quang chuyển sắc",
    desc: "Đổi sắc nhẹ theo góc nhìn",
    gradient: "from-emerald-300 via-sky-400 to-indigo-500",
  },
  {
    id: "crystal" as const,
    name: "Vát kim cương CNC",
    desc: "Cạnh bóng loáng bắt sáng",
    gradient: "from-sky-300 via-white to-pink-300",
  },
];

export default function DesignCustomizerModal({
  isOpen,
  onClose,
  initialProductType = "keychain",
  initialSize = "L",
  onAddToCart,
}: DesignCustomizerModalProps) {
  const [productType, setProductType] = useState<"keychain" | "magnet" | "mica-magnet">(
    initialProductType
  );
  const [size, setSize] = useState<"S" | "L" | "XL">(initialSize);
  const [foilEffect, setFoilEffect] = useState<"prism" | "starlight" | "aurora" | "crystal">(
    "prism"
  );
  const [customImage, setCustomImage] = useState<string>(samplePresets[0].url);
  const [quantity, setQuantity] = useState(1);
  const [mouseRot, setMouseRot] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Sync initial props
  useEffect(() => {
    if (initialProductType) setProductType(initialProductType);
  }, [initialProductType]);

  useEffect(() => {
    if (initialSize) setSize(initialSize);
  }, [initialSize]);

  // Handle 3D preview mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseRot({
      x: -y * 30, // tilt X
      y: x * 35,  // tilt Y
    });
    setAutoRotate(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseRot({ x: 0, y: 0 });
    setAutoRotate(true);
  }, []);

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setCustomImage(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Price calculation
  const currentBase = productTypes.find((p) => p.id === productType)?.basePrice || 35000;
  const currentOffset = sizeOptions.find((s) => s.id === size)?.priceOffset || 0;
  const unitPrice = currentBase + currentOffset;
  const totalPrice = unitPrice * quantity;

  // Handle submit order
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Vui lòng điền họ tên và số điện thoại nhận hàng!");
      return;
    }

    // Trigger celebration confetti
    try {
      fireHologramConfetti();
    } catch {
      // fallback if confetti fails
    }

    if (onAddToCart) {
      onAddToCart({
        id: `custom-${Date.now()}`,
        name: `${productTypes.find((p) => p.id === productType)?.name} LADA GIFT`,
        type: productType,
        size,
        foil: foilEffect,
        image: customImage,
        unitPrice,
        quantity,
        totalPrice,
        customerName,
        customerPhone,
        customerAddress,
      });
    }

    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="relative z-10 w-full max-w-5xl rounded-3xl border border-cyan-500/30 bg-[#0a0d1d]/95 shadow-[0_0_60px_rgba(0,212,255,0.25)] backdrop-blur-2xl overflow-hidden my-auto"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-pink-200/40 px-6 py-4 bg-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-pink-300 shadow-md">
                <img
                  src="/lada-gift-logo.jpg"
                  alt="LADA GIFT"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  LADA GIFT • 3D Design Studio
                  <span className="hidden sm:inline-block rounded-full bg-pink-500/30 border border-pink-400/50 px-2.5 py-0.5 text-[11px] font-bold text-pink-200">
                    Trực quan hóa thời gian thực
                  </span>
                </h3>
                <p className="text-xs text-pink-200/80 font-medium">
                  Tải ảnh hoặc chọn mẫu để xem mockup mica 3D đổi màu theo góc nhìn
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isSuccess ? (
            /* Success confirmation */
            <div className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 shadow-xl shadow-cyan-500/40"
              >
                <Check className="h-10 w-10 text-white stroke-[3]" />
              </motion.div>
              <h4 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
                Đặt hàng LADA GIFT thành công!
              </h4>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-300">
                Cảm ơn bạn <span className="font-semibold text-cyan-300">{customerName}</span>! Kỹ
                thuật viên của chúng tôi sẽ liên hệ qua SĐT{" "}
                <span className="font-semibold text-purple-300">{customerPhone}</span> trong vòng 15
                phút để xác nhận file in và xuất xưởng.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 text-left font-mono text-xs text-zinc-300">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>MÃ ĐƠN HÀNG:</span>
                  <span className="text-pink-400">#LADA-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span>Sản phẩm:</span>
                  <span className="text-white">
                    {productTypes.find((p) => p.id === productType)?.name} ({size})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Hiệu ứng:</span>
                  <span className="text-purple-300 capitalize">{foilEffect} Foil 4D</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Số lượng:</span>
                  <span className="text-white">{quantity} chiếc</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm">
                  <span>Tổng tiền:</span>
                  <span className="text-cyan-300">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
                >
                  Hoàn tất & Tiếp tục khám phá
                </button>
              </div>
            </div>
          ) : (
            /* Main 2-column customizer interface */
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
              {/* Left Column: 3D Holographic Interactive Stage */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#0e122b] to-[#080a17] p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative select-none">
                {/* Stage background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,212,255,0.15),_transparent_70%)] pointer-events-none" />

                <div className="w-full flex items-center justify-between text-xs text-zinc-400 z-10">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Layers className="h-3.5 w-3.5" /> Chế độ 3D Motion
                  </span>
                  <span className="italic">Di chuột để xoay góc nhìn</span>
                </div>

                {/* 3D Acrylic Object Container */}
                <div
                  ref={previewRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="relative my-8 flex items-center justify-center w-full min-h-[320px] cursor-grab active:cursor-grabbing perspective-[1000px]"
                >
                  <motion.div
                    animate={
                      autoRotate
                        ? {
                            rotateY: [0, 15, -15, 0],
                            rotateX: [0, -8, 8, 0],
                            y: [0, -10, 0],
                          }
                        : {
                            rotateX: mouseRot.x,
                            rotateY: mouseRot.y,
                            y: 0,
                          }
                    }
                    transition={
                      autoRotate
                        ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        : { type: "spring", damping: 18, stiffness: 120 }
                    }
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Metal Ring & Keychain connector if keychain */}
                    {productType === "keychain" && (
                      <div className="flex flex-col items-center -mb-2 z-20">
                        {/* Ring */}
                        <div className="h-10 w-10 rounded-full border-[3.5px] border-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.4)] bg-gradient-to-tr from-zinc-400 via-zinc-100 to-zinc-500" />
                        {/* Chain link */}
                        <div className="h-4 w-2 rounded-full border border-zinc-400 bg-zinc-300 -mt-1 shadow-sm" />
                      </div>
                    )}

                    {/* Acrylic Body Container */}
                    <div
                      className={`relative overflow-hidden rounded-2xl border-[2.5px] border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_35px_rgba(0,212,255,0.35)] backdrop-blur-md transition-all duration-300 ${
                        size === "S"
                          ? "w-44 h-56"
                          : size === "L"
                          ? "w-52 h-64"
                          : "w-60 h-76"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)",
                      }}
                    >
                      {/* Customer Custom Image Layer */}
                      <img
                        src={customImage}
                        alt="Preview"
                        className="h-full w-full object-cover object-center filter contrast-110"
                      />

                      {/* Holographic Iridescent Reflection Overlay (Shifts with foil selection) */}
                      <div
                        className={`pointer-events-none absolute inset-0 opacity-55 mix-blend-color-dodge transition-all duration-500 ${
                          foilEffect === "prism"
                            ? "bg-gradient-to-tr from-cyan-400/40 via-purple-500/40 to-pink-500/40"
                            : foilEffect === "starlight"
                            ? "bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_10%,_transparent_40%),_linear-gradient(45deg,_rgba(234,179,8,0.4),_rgba(168,85,247,0.4))]"
                            : foilEffect === "aurora"
                            ? "bg-gradient-to-bl from-emerald-400/40 via-cyan-400/30 to-indigo-600/50"
                            : "bg-[linear-gradient(115deg,_rgba(255,255,255,0.5)_20%,_transparent_40%,_rgba(0,212,255,0.4)_70%)]"
                        }`}
                      />

                      {/* Moving light sweep shine */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* Acrylic bevel edge highlight */}
                      <div className="pointer-events-none absolute inset-[3px] rounded-xl border border-white/40" />

                      {/* Magnet badge indicator if magnet type */}
                      {productType !== "keychain" && (
                        <div className="absolute top-2 right-2 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-300 border border-white/20">
                          {productType === "magnet" ? "MAGNET RUBBER" : "MICA + MAGNET"}
                        </div>
                      )}
                    </div>

                    {/* Acrylic 3D Thickness drop shadow simulation */}
                    <div className="mt-3 h-3 w-40 rounded-full bg-cyan-400/20 blur-md" />
                  </motion.div>
                </div>

                {/* Bottom preview controls */}
                <div className="w-full flex items-center justify-between text-xs text-zinc-400 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    {autoRotate ? "Dừng xoay" : "Tự động xoay"}
                  </button>
                  <span className="text-zinc-500 font-mono">Độ dày mica: 3.5mm CNC</span>
                </div>
              </div>

              {/* Right Column: Customization Controls & Checkout Form */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  {/* Step 1: Choose Product Type */}
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                      <span>1. Chọn loại sản phẩm</span>
                    </label>
                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {productTypes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setProductType(t.id)}
                          className={`flex flex-col items-start p-3 rounded-xl border text-left transition duration-200 ${
                            productType === t.id
                              ? "border-cyan-400 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/10"
                              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                          }`}
                        >
                          <span className="text-sm font-bold text-white">{t.name}</span>
                          <span className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                            {t.tagline}
                          </span>
                          <span className="mt-2 text-xs font-semibold text-cyan-300">
                            từ {formatPrice(t.basePrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Choose Size */}
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
                      2. Chọn kích thước
                    </label>
                    <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                      {sizeOptions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSize(s.id)}
                          className={`p-3 rounded-xl border text-center transition duration-200 ${
                            size === s.id
                              ? "border-purple-400 bg-purple-500/20 text-white shadow-lg shadow-purple-500/10"
                              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                          }`}
                        >
                          <div className="text-sm font-bold text-white">{s.label}</div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {s.priceOffset > 0 ? `+${formatPrice(s.priceOffset)}` : "Giá gốc"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Choose Surface Effect */}
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-pink-400">
                      3. Tùy chọn hiệu ứng bề mặt Mica LADA GIFT
                    </label>
                    <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {foilEffects.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFoilEffect(f.id)}
                          className={`p-2.5 rounded-xl border text-left transition duration-200 ${
                            foilEffect === f.id
                              ? "border-pink-400 bg-pink-500/20 text-white shadow-lg shadow-pink-500/10"
                              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                          }`}
                        >
                          <div
                            className={`h-2.5 w-full rounded-full bg-gradient-to-r ${f.gradient} mb-2`}
                          />
                          <div className="text-xs font-bold text-white">{f.name}</div>
                          <div className="text-[10px] text-zinc-400 truncate mt-0.5">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Upload Image OR Pick Presets */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
                        4. Tải ảnh của bạn hoặc chọn ảnh mẫu
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        <Upload className="h-3 w-3" /> Tải ảnh riêng
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Presets row */}
                    <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1">
                      {samplePresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setCustomImage(preset.url)}
                          className={`flex-shrink-0 flex items-center gap-2 rounded-lg border p-1.5 transition ${
                            customImage === preset.url
                              ? "border-cyan-400 bg-cyan-500/20 text-white"
                              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="h-7 w-7 rounded object-cover"
                          />
                          <span className="text-xs pr-1 font-medium">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 5: Quantity & Shipping info form */}
                  <form onSubmit={handleCompleteOrder} className="space-y-4 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">Số lượng:</span>
                      <div className="flex items-center rounded-lg border border-white/15 bg-white/5">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 text-zinc-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-bold text-white">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 text-zinc-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Họ và tên của bạn *"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Số điện thoại Zalo nhận mẫu *"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Địa chỉ nhận hàng (Ví dụ: 123 Cầu Giấy, Hà Nội)"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Total Price and Submit Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-xs text-zinc-400">Tổng thanh toán (Freeship từ 2c):</div>
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                          {formatPrice(totalPrice)}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 px-6 sm:px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 active:scale-95"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Đặt in sản phẩm này</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
