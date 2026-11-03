"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Gift,
  Truck,
  CheckCircle2,
  Maximize2,
  X,
  Palette,
  Heart,
  ShieldCheck,
  Zap,
  ArrowRight,
  User,
  Smile,
  Layers,
  Square,
  RectangleHorizontal,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { formatPrice } from "@/data/products";

interface PricingSectionProps {
  onOpenCustomizer?: (productType?: "keychain" | "magnet" | "mica-magnet") => void;
}

export default function PricingSection({ onOpenCustomizer }: PricingSectionProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "mica-magnet" | "keychain" | "magnet">("all");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const pricingCards = [
    {
      id: "mica-magnet" as const,
      badge: "Bán chạy nhất",
      badgeTh: "ยอดนิยมอันดับ 1",
      badgeEn: "Best Seller",
      badgeColor: "from-pink-500 to-rose-500",
      title: "Ảnh Mica Nam Châm",
      titleTh: "แม่เหล็กไมก้าตัดเพชร",
      titleEn: "Diamond Mica Magnet",
      subtitle: "Mica đúc 3.5mm vát kim cương CNC + Nam châm Neodymium siêu hút",
      subtitleTh: "อะคริลิกหนา 3.5 มม. เจียระไนขอบเพชร CNC + แม่เหล็กนีโอไดเมียมแรงสูง",
      subtitleEn: "3.5mm diamond CNC beveled acrylic + strong Neodymium magnet backing",
      flyerImage: "/pricing/bang-gia-mica-nam-cham.jpg",
      gradient: "from-pink-500/10 via-purple-500/5 to-transparent",
      borderColor: "border-pink-300/80 hover:border-pink-500",
      minOrder: "Tối thiểu 5 cái",
      minOrderTh: "ขั้นต่ำ 5 ชิ้น",
      minOrderEn: "Min 5 pcs",
      groups: [
        {
          styleName: "Khuôn mặt",
          styleNameTh: "ไดคัทใบหน้า",
          styleNameEn: "Face Cutout",
          icon: Smile,
          iconColor: "text-amber-500 bg-amber-50",
          items: [
            { size: "Size S (5x5 cm)", price: 17000 },
            { size: "Size L (8x8 cm)", price: 37000 },
            { size: "Size XL (10x10 cm)", price: 43000 },
          ],
        },
        {
          styleName: "Toàn thân",
          styleNameTh: "ไดคัททั้งตัว",
          styleNameEn: "Full-Body Cutout",
          icon: User,
          iconColor: "text-pink-500 bg-pink-50",
          items: [
            { size: "Size S (5x7.5 cm)", price: 22000 },
            { size: "Size L (8x10 cm)", price: 42000 },
            { size: "Size XL (10x15 cm)", price: 52000 },
          ],
        },
        {
          styleName: "Nguyên ảnh",
          styleNameTh: "ภาพถ่ายเดิม",
          styleNameEn: "Original Photo",
          icon: Layers,
          iconColor: "text-purple-500 bg-purple-50",
          items: [
            { size: "Size S (5x7.5 cm)", price: 17000 },
            { size: "Size L (8x10 cm)", price: 37000 },
            { size: "Size XL (10x15 cm)", price: 43000 },
          ],
        },
      ],
      promotions: [
        { threshold: "Đặt 15 cái", gift: "Tặng 1 Móc Khóa mica ngẫu nhiên" },
        { threshold: "Đặt 30 cái", gift: "Tặng 2 Móc Khóa + Freeship Toàn Quốc", highlight: true },
        { threshold: "Đặt 50 cái", gift: "Tặng 5 Móc Khóa + Freeship Toàn Quốc", highlight: true },
      ],
      promotionsTh: [
        { threshold: "สั่ง 15 ชิ้น", gift: "แถมฟรี พวงกุญแจ 1 ชิ้น" },
        { threshold: "สั่ง 30 ชิ้น", gift: "แถมฟรี พวงกุญแจ 2 ชิ้น + ส่งฟรีทั่วประเทศ", highlight: true },
        { threshold: "สั่ง 50 ชิ้น", gift: "แถมฟรี พวงกุญแจ 5 ชิ้น + ส่งฟรีทั่วประเทศ", highlight: true },
      ],
      promotionsEn: [
        { threshold: "Order 15 pcs", gift: "Free 1 Acrylic Keychain" },
        { threshold: "Order 30 pcs", gift: "Free 2 Keychains + Free National Shipping", highlight: true },
        { threshold: "Order 50 pcs", gift: "Free 5 Keychains + Free National Shipping", highlight: true },
      ],
      ctaText: "Thiết kế Mica Nam Châm",
      ctaTextTh: "ออกแบบแม่เหล็กไมก้า",
      ctaTextEn: "Design Mica Magnet",
    },
    {
      id: "keychain" as const,
      badge: "Quà tặng yêu thích",
      badgeTh: "ของขวัญยอดนิยม",
      badgeEn: "Top Gift Choice",
      badgeColor: "from-purple-500 to-indigo-500",
      title: "Móc Khóa Mica Theo Yêu Cầu",
      titleTh: "พวงกุญแจอะคริลิกสั่งทำ",
      titleEn: "Custom Acrylic Keychain",
      subtitle: "Mica trong suốt 99.8%, in 2 mặt sắc nét kèm khoen kim loại mạ cao cấp",
      subtitleTh: "อะคริลิกใสพิเศษ 99.8% พิมพ์คมชัด 2 ด้าน พร้อมห่วงโลหะชุบเงาสวยงาม",
      subtitleEn: "99.8% transparent acrylic with premium metal ring and double-sided UV print",
      flyerImage: "/pricing/bang-gia-moc-khoa-mica.jpg",
      gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
      borderColor: "border-purple-300/80 hover:border-purple-500",
      minOrder: "Chỉ từ 1 cái",
      minOrderTh: "สั่งได้ตั้งแต่ 1 ชิ้น",
      minOrderEn: "From 1 pc",
      groups: [
        {
          styleName: "Khuôn mặt",
          styleNameTh: "ไดคัทใบหน้า",
          styleNameEn: "Face Cutout",
          icon: Smile,
          iconColor: "text-amber-500 bg-amber-50",
          items: [{ size: "Size chuẩn (5x5 cm)", price: 20000 }],
        },
        {
          styleName: "Toàn thân",
          styleNameTh: "ไดคัททั้งตัว",
          styleNameEn: "Full-Body Cutout",
          icon: User,
          iconColor: "text-pink-500 bg-pink-50",
          items: [{ size: "Size chuẩn (5x7.5 cm)", price: 30000 }],
        },
        {
          styleName: "Nguyên ảnh",
          styleNameTh: "ภาพถ่ายเดิม",
          styleNameEn: "Original Photo",
          icon: Layers,
          iconColor: "text-purple-500 bg-purple-50",
          items: [{ size: "Size chuẩn (5x7.5 cm)", price: 25000 }],
        },
      ],
      promotions: [
        { threshold: "Đặt 15 cái", gift: "Tặng 1 Móc Khóa mica ngẫu nhiên" },
        { threshold: "Đặt 30 cái", gift: "Giảm 30.000đ + Freeship Toàn Quốc", highlight: true },
        { threshold: "Đặt 50 cái", gift: "Giảm 60.000đ + Freeship Toàn Quốc", highlight: true },
      ],
      promotionsTh: [
        { threshold: "สั่ง 15 ชิ้น", gift: "แถมฟรี พวงกุญแจ 1 ชิ้น" },
        { threshold: "สั่ง 30 ชิ้น", gift: "ลด 30.000đ + ส่งฟรีทั่วประเทศ", highlight: true },
        { threshold: "สั่ง 50 ชิ้น", gift: "ลด 60.000đ + ส่งฟรีทั่วประเทศ", highlight: true },
      ],
      promotionsEn: [
        { threshold: "Order 15 pcs", gift: "Free 1 Acrylic Keychain" },
        { threshold: "Order 30 pcs", gift: "Save 30k VND + Free Shipping", highlight: true },
        { threshold: "Order 50 pcs", gift: "Save 60k VND + Free Shipping", highlight: true },
      ],
      ctaText: "Thiết kế Móc Khóa Ngay",
      ctaTextTh: "ออกแบบพวงกุญแจทันที",
      ctaTextEn: "Design Keychain Now",
    },
    {
      id: "magnet" as const,
      badge: "Combo Tiết Kiệm",
      badgeTh: "เซตคอมโบสุดคุ้ม",
      badgeEn: "Best Value Combo",
      badgeColor: "from-sky-500 to-cyan-500",
      title: "Ảnh Nam Châm LADA GIFT",
      titleTh: "แม่เหล็กติดตู้เย็น LADA GIFT",
      titleEn: "Photo Magnet LADA GIFT",
      subtitle: "Nam châm dẻo 5 lớp siêu bền 10 năm, hít chắc tủ lạnh, máy giặt, case PC",
      subtitleTh: "แม่เหล็กยาง 5 ชั้น ทนทาน 10 ปี ติดแน่นตู้เย็น เครื่องซักผ้า เคสคอม",
      subtitleEn: "5-layer durable photo magnet lasting 10+ years, strong magnetic grip",
      flyerImage: "/pricing/bang-gia-anh-nam-cham.jpg",
      gradient: "from-sky-500/10 via-purple-500/5 to-transparent",
      borderColor: "border-sky-300/80 hover:border-sky-500",
      minOrder: "Chỉ từ 1 ảnh (25k)",
      minOrderTh: "เริ่มต้นเพียง 1 ภาพ (25k)",
      minOrderEn: "From 1 photo (25k)",
      groups: [
        {
          styleName: "Ảnh vuông (Bo tròn góc)",
          styleNameTh: "สี่เหลี่ยมจัตุรัส (ขอบมน)",
          styleNameEn: "Square (Rounded corners)",
          icon: Square,
          iconColor: "text-sky-500 bg-sky-50",
          items: [{ size: "KT: 5x5 cm (Bo tròn 4 góc)", price: 25000 }],
        },
        {
          styleName: "Ảnh chữ nhật",
          styleNameTh: "สี่เหลี่ยมผืนผ้า",
          styleNameEn: "Rectangle",
          icon: RectangleHorizontal,
          iconColor: "text-indigo-500 bg-indigo-50",
          items: [{ size: "KT: 9x6.5 cm (Chuẩn tỉ lệ điện thoại)", price: 25000 }],
        },
      ],
      promotions: [
        { threshold: "Combo 6 ảnh", gift: "120.000đ (Gốc 150k - Giảm ngay 30k)" },
        { threshold: "Combo 15 ảnh", gift: "300.000đ (Giảm 75k + Tặng 1 ảnh)", highlight: true },
        { threshold: "Combo 30 ảnh", gift: "600.000đ (Giảm 150k + Tặng 2 ảnh + Freeship)", highlight: true },
        { threshold: "Combo 50 ảnh", gift: "1.000.000đ (Tiết kiệm 500k + Tặng 4 ảnh + Freeship)", highlight: true },
      ],
      promotionsTh: [
        { threshold: "คอมโบ 6 ภาพ", gift: "120.000đ (ปกติ 150k - ลดทันที 30k)" },
        { threshold: "คอมโบ 15 ภาพ", gift: "300.000đ (ลด 75k + แถมฟรี 1 ภาพ)", highlight: true },
        { threshold: "คอมโบ 30 ภาพ", gift: "600.000đ (ลด 150k + แถมฟรี 2 ภาพ + ส่งฟรี)", highlight: true },
        { threshold: "คอมโบ 50 ภาพ", gift: "1.000.000đ (ประหยัด 500k + แถมฟรี 4 ภาพ + ส่งฟรี)", highlight: true },
      ],
      promotionsEn: [
        { threshold: "Combo 6 photos", gift: "120k VND (Save 30k VND)" },
        { threshold: "Combo 15 photos", gift: "300k VND (Save 75k + Free 1 photo)", highlight: true },
        { threshold: "Combo 30 photos", gift: "600k VND (Save 150k + Free 2 photos + Freeship)", highlight: true },
        { threshold: "Combo 50 photos", gift: "1,000k VND (Save 500k + Free 4 photos + Freeship)", highlight: true },
      ],
      ctaText: "Thiết kế Ảnh Nam Châm",
      ctaTextTh: "ออกแบบแม่เหล็กติดตู้เย็น",
      ctaTextEn: "Design Photo Magnet",
    },
  ];

  const filteredCards =
    activeTab === "all" ? pricingCards : pricingCards.filter((c) => c.id === activeTab);

  return (
    <section id="pricing" className="relative py-20 overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FAF5FF] to-[#F0F7FF]">
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-200/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-200/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-sky-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-1.5 text-xs font-black tracking-wide text-pink-600 shadow-sm backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-spin" style={{ animationDuration: "6s" }} />
            <span>
              {language === "th"
                ? "ตารางราคาทางการ • LADA GIFT"
                : language === "en"
                ? "OFFICIAL PRICE LIST • LADA GIFT"
                : "BẢNG GIÁ CHÍNH HÃNG • LADA GIFT"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1035] tracking-tight mb-4">
            {language === "th" ? (
              <>
                BẢNG GIÁ SẢN PHẨM{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600">
                  LADA GIFT
                </span>
              </>
            ) : language === "en" ? (
              <>
                PRODUCT PRICE LIST{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600">
                  LADA GIFT
                </span>
              </>
            ) : (
              <>
                BẢNG GIÁ SẢN PHẨM{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600">
                  LADA GIFT
                </span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {language === "th"
              ? "ราคาตรงจากโรงงานผลิต ไม่ผ่านคนกลาง หมึกพิมพ์ UV 8 สีคมชัดพิเศษ อะคริลิกเกรด A เจียระไนขอบเพชรสวยหรู"
              : language === "en"
              ? "Direct workshop pricing with no middleman. High-definition 8-color UV printing & CNC diamond polished acrylic."
              : "Cam kết giá gốc tại xưởng sản xuất trực tiếp • In UV 8 màu chuẩn nét • Vát cạnh kim cương CNC bóng loáng • Đổi mới 100% nếu có lỗi"}
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-pink-200/80 shadow-sm">
            {[
              { id: "all", label: language === "th" ? "Tất cả sản phẩm" : language === "en" ? "All Products" : "Tất cả sản phẩm" },
              { id: "mica-magnet", label: language === "th" ? "Mica nam châm" : language === "en" ? "Mica Magnet" : "Mica nam châm" },
              { id: "keychain", label: language === "th" ? "Móc khóa mica" : language === "en" ? "Keychain" : "Móc khóa mica" },
              { id: "magnet", label: language === "th" ? "Ảnh nam châm" : language === "en" ? "Photo Magnet" : "Ảnh nam châm" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 text-white shadow-md shadow-pink-300/40"
                      : "text-slate-600 hover:text-pink-600 hover:bg-pink-50/60"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Cards Grid / Full Width Container */}
        <div
          className={
            activeTab === "all"
              ? "grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
              : "w-full max-w-5xl mx-auto"
          }
        >
          {filteredCards.map((card, idx) => {
            const promoList =
              language === "th"
                ? card.promotionsTh
                : language === "en"
                ? card.promotionsEn
                : card.promotions;

            const isSingle = activeTab !== "all";

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`relative rounded-3xl border-2 ${card.borderColor} bg-white/95 backdrop-blur-xl shadow-xl shadow-pink-200/25 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  isSingle ? "w-full" : "hover:-translate-y-1"
                }`}
              >
                {/* Top Ambient Highlight */}
                <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${card.gradient} pointer-events-none`} />

                <div>
                  {/* Card Header & Badge */}
                  <div className={`p-6 sm:p-8 pb-5 relative z-10 border-b border-slate-100 ${isSingle ? "flex flex-col md:flex-row md:items-center md:justify-between gap-5" : ""}`}>
                    <div className={isSingle ? "max-w-xl" : ""}>
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black text-white bg-gradient-to-r ${card.badgeColor} shadow-sm`}
                        >
                          <Zap className="h-3 w-3 fill-white" />
                          {language === "th" ? card.badgeTh : language === "en" ? card.badgeEn : card.badge}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {language === "th" ? card.minOrderTh : language === "en" ? card.minOrderEn : card.minOrder}
                        </span>
                      </div>

                      <h3 className={`font-black text-[#1E1035] mb-1.5 ${isSingle ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                        {language === "th" ? card.titleTh : language === "en" ? card.titleEn : card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        {language === "th" ? card.subtitleTh : language === "en" ? card.subtitleEn : card.subtitle}
                      </p>
                    </div>

                    {/* Flyer Preview Pill */}
                    <div className={`flex items-center justify-between p-3 rounded-2xl bg-pink-50/80 border border-pink-200/70 shadow-xs ${isSingle ? "md:min-w-[280px] flex-shrink-0" : "mt-4"}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative h-11 w-9 rounded-lg overflow-hidden border border-pink-300 flex-shrink-0 bg-white shadow-xs">
                          <Image
                            src={card.flyerImage}
                            alt={card.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#1E1035] truncate">
                            {language === "th" ? "ภาพโปสเตอร์ราคาทางการ" : language === "en" ? "Official Price Flyer" : "Bảng giá in thực tế LADA"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {language === "th" ? "แตะ để xem phóng to" : language === "en" ? "Click to view full flyer" : "Nhấn để phóng to xem chi tiết"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLightboxImage({ src: card.flyerImage, title: card.title })}
                        className="p-2 rounded-xl bg-white text-pink-600 hover:bg-pink-600 hover:text-white transition shadow-sm border border-pink-200 cursor-pointer ml-2 flex-shrink-0"
                        title="Phóng to bảng giá"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing Groups Table */}
                  <div className={`p-6 sm:p-8 space-y-5`}>
                    <div
                      className={
                        isSingle
                          ? `grid gap-4 ${
                              card.groups.length === 2
                                ? "grid-cols-1 md:grid-cols-2"
                                : "grid-cols-1 md:grid-cols-3"
                            }`
                          : "space-y-4"
                      }
                    >
                      {card.groups.map((grp, gIdx) => {
                        const IconComp = grp.icon;
                        const styleTitle =
                          language === "th"
                            ? grp.styleNameTh
                            : language === "en"
                            ? grp.styleNameEn
                            : grp.styleName;

                        return (
                          <div
                            key={gIdx}
                            className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2.5 hover:bg-pink-50/40 hover:border-pink-200 transition"
                          >
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                              <span className={`p-1.5 rounded-lg ${grp.iconColor}`}>
                                <IconComp className="h-4 w-4" />
                              </span>
                              <span className="text-xs font-black uppercase text-[#1E1035] tracking-wide">
                                {styleTitle}
                              </span>
                            </div>

                            <div className="space-y-2">
                              {grp.items.map((item, iIdx) => (
                                <div key={iIdx} className="flex items-center justify-between text-xs">
                                  <span className="text-slate-600 font-medium">{item.size}</span>
                                  <span className="font-black text-pink-600 font-mono text-sm">
                                    {formatPrice(item.price)}
                                    <span className="text-[10px] text-slate-400 font-normal">/c</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Promotions & Deals Box */}
                    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/90 via-white to-pink-50/90 p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-700">
                        <Gift className="h-4 w-4 text-amber-600" />
                        <span>
                          {language === "th"
                            ? "สิทธิพิเศษ & ของแถม"
                            : language === "en"
                            ? "Promotions & Free Gifts"
                            : "Ưu đãi & Quà tặng"}
                        </span>
                      </div>

                      <div
                        className={
                          isSingle
                            ? `grid gap-2.5 ${
                                promoList.length >= 4
                                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                                  : "grid-cols-1 sm:grid-cols-3"
                              }`
                            : "space-y-1.5 text-xs"
                        }
                      >
                        {promoList.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            className={`flex items-start gap-2 p-2 rounded-xl text-xs ${
                              isSingle ? "bg-white/80 border border-amber-100" : ""
                            }`}
                          >
                            <CheckCircle2
                              className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                p.highlight ? "text-pink-600" : "text-amber-600"
                              }`}
                            />
                            <div className="min-w-0">
                              <span className="font-black text-[#1E1035] block sm:inline">
                                {p.threshold}:{" "}
                              </span>
                              <span
                                className={`font-semibold ${
                                  p.highlight ? "text-pink-700 font-black" : "text-slate-700"
                                }`}
                              >
                                {p.gift}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Footer Button */}
                <div className={`p-6 sm:p-8 pt-0 relative z-10 ${isSingle ? "flex flex-col sm:flex-row items-center justify-between gap-4" : ""}`}>
                  {isSingle && (
                    <div className="text-xs text-slate-500 font-medium hidden sm:block">
                      ✓ Đổi mới 100% nếu có lỗi • In UV 8 màu siêu nét • Vát cạnh kim cương sáng bóng
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenCustomizer?.(card.id)}
                    className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-pink-300/40 hover:brightness-110 active:scale-98 transition cursor-pointer ${
                      isSingle ? "w-full sm:w-auto min-w-[260px]" : "w-full"
                    }`}
                  >
                    <span>
                      {language === "th"
                        ? card.ctaTextTh
                        : language === "en"
                        ? card.ctaTextEn
                        : card.ctaText}
                    </span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Commitments Bar */}
        <div className="mt-14 rounded-3xl border border-pink-200/90 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-200/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-[#1E1035]">Mica Grade A 100%</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Trong suốt 99.8%, không ố vàng</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 flex-shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-[#1E1035]">In UV 8 màu siêu nét</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Tách nền & chỉnh sáng ảnh miễn phí</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-[#1E1035]">Freeship toàn quốc</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Áp dụng đơn từ 30c hoặc &gt;600k</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 flex-shrink-0">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-[#1E1035]">Bảo hành 1 đổi 1</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Đổi mới ngay nếu lỗi in hay trầy xước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Original Price Flyers */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 max-w-2xl w-full bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-pink-200 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-black text-[#1E1035]">{lightboxImage.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative w-full max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                <img
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  className="w-full h-auto max-h-[72vh] object-contain"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Ảnh chụp bảng giá gốc tại xưởng LADA GIFT</span>
                <button
                  type="button"
                  onClick={() => {
                    const type = lightboxImage.src.includes("mica-nam-cham")
                      ? "mica-magnet"
                      : lightboxImage.src.includes("moc-khoa")
                      ? "keychain"
                      : "magnet";
                    setLightboxImage(null);
                    onOpenCustomizer?.(type);
                  }}
                  className="font-black text-pink-600 hover:underline cursor-pointer"
                >
                  Bắt đầu đặt hàng ngay →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
