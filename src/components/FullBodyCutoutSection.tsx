"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Layers,
  Magnet,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Wand2,
  Heart,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface FullBodyCutoutSectionProps {
  onOpenCustomizer: (category?: "keychain" | "magnet" | "mica-magnet") => void;
}

type PresetType = "couple" | "pet" | "single";

interface DemoPreset {
  id: PresetType;
  tabLabelKey: "diecut_tab_couple" | "diecut_tab_pet" | "diecut_tab_single";
  originalImage: string;
  cutoutImage: string;
  originalAlt: string;
  cutoutAlt: string;
  contourShape: string;
  aspectRatio: string;
}

const PRESETS: DemoPreset[] = [
  {
    id: "couple",
    tabLabelKey: "diecut_tab_couple",
    originalImage: "/fullbody/couple-original.png",
    cutoutImage: "/fullbody/couple-cutout.png",
    originalAlt: "Ảnh gốc cặp đôi trước khi tách nền",
    cutoutAlt: "Ảnh mica cặp đôi toàn thân đã tách sạch nền",
    contourShape: "rounded-3xl",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "pet",
    tabLabelKey: "diecut_tab_pet",
    originalImage: "/fullbody/pet-original.webp",
    cutoutImage: "/fullbody/pet-cutout.png",
    originalAlt: "Ảnh gốc thú cưng trước khi tách nền",
    cutoutAlt: "Ảnh mica thú cưng toàn thân đã tách sạch nền",
    contourShape: "rounded-3xl",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "single",
    tabLabelKey: "diecut_tab_single",
    originalImage: "/fullbody/face-original.jpg",
    cutoutImage: "/fullbody/face-cutout.png",
    originalAlt: "Ảnh chụp khuôn mặt trước khi tách nền",
    cutoutAlt: "Ảnh mica khuôn mặt đã tách sạch nền",
    contourShape: "rounded-3xl",
    aspectRatio: "aspect-[4/5]",
  },
];

const ACRYLIC_MICA_FILTER = [
  // Viền mỏng khoảng 2px ôm sát mẫu sắc nét (Thin 2px crisp acrylic stroke)
  "drop-shadow(2px 0 0 #ffffff)",
  "drop-shadow(-2px 0 0 #ffffff)",
  "drop-shadow(0 2px 0 #ffffff)",
  "drop-shadow(0 -2px 0 #ffffff)",
  "drop-shadow(1.5px 1.5px 0 #ffffff)",
  "drop-shadow(-1.5px -1.5px 0 #ffffff)",
  "drop-shadow(1.5px -1.5px 0 #ffffff)",
  "drop-shadow(-1.5px 1.5px 0 #ffffff)",
  // Đổ bóng 3D tự nhiên nhẹ nhàng
  "drop-shadow(0 8px 16px rgba(30, 16, 60, 0.18))",
].join(" ");

export default function FullBodyCutoutSection({
  onOpenCustomizer,
}: FullBodyCutoutSectionProps) {
  const { t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<PresetType>("couple");
  const [finishOption, setFinishOption] = useState<"keychain" | "magnet">(
    "magnet"
  );

  const activePreset =
    PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];

  return (
    <section
      id="cutout-section"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Decorative ambient background glows - optimized with radial gradients */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-[radial-gradient(circle,rgba(244,114,182,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-pink-200/80 shadow-sm text-pink-700 text-xs font-bold tracking-wider uppercase mb-4"
        >
          <Scissors className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
          <span>{t("diecut_tag")}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 tracking-tight leading-tight mb-4"
        >
          {t("diecut_title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-purple-900/80 font-medium max-w-2xl mx-auto"
        >
          {t("diecut_desc")}
        </motion.p>

        {/* Preset Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-purple-100 max-w-md mx-auto shadow-inner"
        >
          {PRESETS.map((preset) => {
            const isActive = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-md shadow-pink-500/25"
                    : "text-purple-800/70 hover:text-purple-950 hover:bg-purple-50/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {t(preset.tabLabelKey)}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* 3-Step Visual Transformation Stage */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* STEP 1: Ảnh gốc còn nền */}
          <div className="relative flex flex-col p-5 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-purple-100 shadow-xl shadow-purple-900/5 group hover:border-pink-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                {t("diecut_step1_label")}
              </span>
              <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                📸 {t("diecut_badge_original")}
              </span>
            </div>

            {/* Photo frame */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 group-hover:border-pink-400 transition-colors">
              <Image
                src={activePreset.originalImage}
                alt={activePreset.originalAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white/95 font-medium bg-black/40 backdrop-blur-sm p-2 rounded-lg">
                ⚠️ {t("diecut_step1_note")}
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-purple-900/70 font-medium leading-relaxed">
              {t("diecut_step1_desc")}
            </p>

            {/* Direction arrow on desktop */}
            <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-pink-200 items-center justify-center text-pink-600">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* STEP 2: Tách sạch 100% background (Contour Die-Cut Laser Line) */}
          <div className="relative flex flex-col p-5 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-xl border-2 border-pink-300 shadow-2xl shadow-pink-500/10 group">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-pink-100 text-pink-700">
                {t("diecut_step2_label")}
              </span>
              <span className="text-[11px] font-bold text-pink-600 flex items-center gap-1 animate-pulse">
                <Scissors className="w-3.5 h-3.5" />
                {t("diecut_badge_cutout")}
              </span>
            </div>

            {/* Cutout visual with transparent checkerboard & neon laser contour */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:14px_14px] bg-[#f8fafc] flex items-center justify-center border-2 border-pink-400/60 p-4">
              {/* Pulsing neon contour aura */}
              <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-pink-400/50 pointer-events-none" />

              {/* Cutout silhouette display */}
              <div className="relative w-full h-[88%] flex items-center justify-center will-change-transform">
                <Image
                  src={activePreset.cutoutImage}
                  alt={activePreset.cutoutAlt}
                  fill
                  className="object-contain p-2 filter drop-shadow-[0_8px_16px_rgba(236,72,153,0.3)] drop-shadow-[0_0_4px_rgba(6,182,212,0.35)]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Laser Cutline label */}
              <div className="absolute bottom-3 left-3 right-3 text-xs text-pink-800 font-bold bg-white/95 backdrop-blur-md p-2 rounded-lg border border-pink-200 text-center shadow-md">
                ✂️ {t("diecut_step2_note")}
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-purple-900/70 font-medium leading-relaxed">
              {t("diecut_step2_desc")}
            </p>

            {/* Direction arrow on desktop */}
            <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-pink-200 items-center justify-center text-pink-600">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* STEP 3: Thành phẩm mica hoàn thiện (Diamond Beveled Acrylic) */}
          <div className="relative flex flex-col p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white/95 to-purple-50/80 backdrop-blur-xl border border-indigo-200 shadow-2xl shadow-indigo-500/10 group hover:border-indigo-400 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-700">
                {t("diecut_step3_label")}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t("diecut_badge_acrylic")}
              </span>
            </div>

            {/* Acrylic 3D mockup display */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100/70 via-pink-50/60 to-indigo-100/70 flex items-center justify-center border border-white/80 p-4">
              {/* 3D Acrylic block container with bevel shine */}
              <div
                className="relative w-full h-[85%] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 will-change-transform"
                style={{ transform: "translate3d(0, 0, 0)" }}
              >
                {/* Simulated Heart keychain or magnet fixture at top/back */}
                {finishOption === "keychain" ? (
                  <motion.div
                    key="keychain-fixture"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
                  >
                    {/* Metal heart keyring */}
                    <div className="w-8 h-8 rounded-full border-[2.5px] border-amber-300 bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-300 shadow-md flex items-center justify-center">
                      <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
                    </div>
                    {/* Metal link */}
                    <div className="w-1.5 h-3.5 bg-gradient-to-b from-amber-400 to-amber-300 shadow-sm rounded-full" />
                    {/* Acrylic punched hole tab */}
                    <div className="w-4 h-4 rounded-full border-2 border-white bg-white/70 shadow-sm -mt-1 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-900/40" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="magnet-fixture"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-2 right-2 z-30 px-2.5 py-1 rounded-lg bg-purple-900/90 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-purple-400/30"
                  >
                    <Magnet className="w-3.5 h-3.5 text-pink-300" />
                    <span>Neodymium</span>
                  </motion.div>
                )}

                <Image
                  src={activePreset.cutoutImage}
                  alt={activePreset.cutoutAlt}
                  fill
                  className="object-contain p-2.5 brightness-105"
                  style={{ filter: ACRYLIC_MICA_FILTER }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Glass reflection shine stripe */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>

              {/* Quick toggle at bottom of Step 3 */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-1.5 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-md">
                <button
                  type="button"
                  onClick={() => setFinishOption("keychain")}
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                    finishOption === "keychain"
                      ? "bg-pink-600 text-white shadow-sm"
                      : "text-purple-900 hover:bg-purple-100/60"
                  }`}
                >
                  {t("diecut_quick_toggle_keychain")}
                </button>
                <button
                  type="button"
                  onClick={() => setFinishOption("magnet")}
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                    finishOption === "magnet"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-purple-900 hover:bg-purple-100/60"
                  }`}
                >
                  {t("diecut_quick_toggle_magnet")}
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-purple-900/70 font-medium leading-relaxed">
              {t("diecut_step3_desc")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2 Dedicated Comparison Feature Cards (Loại có móc khóa & Loại không móc khóa) */}
      <div className="relative z-10 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-950 mb-2">
            {t("diecut_options_heading")}
          </h3>
          <p className="text-sm text-purple-800/70">
            {t("diecut_options_subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OPTION 1: Loại Có Móc Khóa */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all duration-300"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-purple-950">
                      {t("diecut_type_keychain_title")}
                    </h4>
                    <span className="text-xs font-semibold text-pink-600">
                      {t("diecut_type_keychain_tag")}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-700">
                  {t("diecut_badge_popular")}
                </span>
              </div>

              {/* Real Product Image Preview */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-purple-50 border border-pink-100 group">
                <Image
                  src="/images/lada/keychain-pets.webp"
                  alt="Móc khóa mica toàn thân đúc acrylic"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  ✨ {t("diecut_keychain_img_caption")}
                </div>
              </div>

              <p className="text-sm text-purple-900/80 leading-relaxed mb-6 font-medium">
                {t("diecut_type_keychain_desc")}
              </p>

              {/* Bullet points */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("diecut_feature_keychain_1")}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("diecut_feature_keychain_2")}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("diecut_feature_keychain_3")}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onOpenCustomizer("keychain")}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 group transition-all"
            >
              <span>{t("diecut_btn_keychain")}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* OPTION 2: Loại Không Móc Khóa (Mica Nam Châm) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-indigo-200 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <Magnet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-purple-950">
                      {t("diecut_type_magnet_title")}
                    </h4>
                    <span className="text-xs font-semibold text-indigo-600">
                      {t("diecut_type_magnet_tag")}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-700">
                  {t("diecut_badge_vip")}
                </span>
              </div>

              {/* Real Product Image Preview */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-purple-50 border border-indigo-100 group">
                <Image
                  src="/images/lada/magnet-colors-hand.webp"
                  alt="Ảnh mica nam châm vát cạnh kim cương LADA GIFT"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  💎 {t("diecut_magnet_img_caption")}
                </div>
              </div>

              <p className="text-sm text-purple-900/80 leading-relaxed mb-6 font-medium">
                {t("diecut_type_magnet_desc")}
              </p>

              {/* Bullet points */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("diecut_feature_magnet_1")}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("diecut_feature_magnet_2")}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("diecut_feature_magnet_3")}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onOpenCustomizer("mica-magnet")}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all"
            >
              <span>{t("diecut_btn_magnet")}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/15 to-indigo-500/10 backdrop-blur-xl border border-pink-200/80 text-center shadow-xl"
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-purple-800 text-xs font-bold mb-3 shadow-sm">
            <Wand2 className="w-3.5 h-3.5 text-pink-500" />
            <span>{t("diecut_banner_badge")}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-purple-950 mb-3">
            {t("diecut_banner_title")}
          </h3>
          <p className="text-sm text-purple-900/80 mb-6">
            {t("diecut_banner_desc")}
          </p>

          <button
            type="button"
            onClick={() => onOpenCustomizer("mica-magnet")}
            className="inline-flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white text-base font-extrabold shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{t("diecut_cta_btn")}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
