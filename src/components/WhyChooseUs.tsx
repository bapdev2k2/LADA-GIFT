"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, ShieldCheck, Palette, Crown, Gift, ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  gradient: string;
  index: number;
  reducedMotion: boolean;
}

function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
  badge,
  gradient,
  index,
  reducedMotion,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={reducedMotion ? {} : { y: -6 }}
      className="group relative rounded-3xl p-[1px] transition-all duration-300 h-full flex flex-col flex-1 will-change-transform"
    >
      {/* Animated gradient border on hover */}
      <div
        className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r ${gradient} opacity-25 blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-hover:blur-sm`}
      />

      {/* Card Content Container */}
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-white/90 bg-white/85 p-6 sm:p-8 backdrop-blur-xl transition-all duration-200 shadow-xl shadow-pink-100/40 group-hover:border-pink-400 group-hover:bg-white/95 flex-1">
        {/* Hologram sweep shine overlay */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        {/* Top bar: Icon & Badge */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-200 bg-gradient-to-tr from-pink-100 to-purple-50 shadow-md transition-transform duration-300 group-hover:scale-110">
              <Icon className="relative z-10 h-7 w-7 text-pink-600 transition-colors duration-300 group-hover:text-purple-600" />
            </div>

            <span className="rounded-full border border-pink-200 bg-pink-50/90 px-3 py-1 text-xs font-black tracking-wider uppercase text-pink-700 shadow-sm">
              {badge}
            </span>
          </div>

          <div className="mt-6 flex-1 flex flex-col">
            <span className="text-xs font-black tracking-widest uppercase text-pink-600">
              {subtitle}
            </span>
            <h3 className="mt-1 text-xl font-black tracking-tight text-[#1E1035] transition-colors duration-300 group-hover:text-pink-600 sm:text-2xl">
              {title}
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 group-hover:text-slate-700 flex-1">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom accent glow bar */}
        <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-bold text-pink-700 group-hover:text-pink-600 transition-colors duration-300">
          <span className="font-mono">LADA GIFT STANDARD</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const features = [
    {
      icon: Sparkles,
      subtitle: "Ultra HD UV Print",
      title: "In hình sắc nét vượt trội",
      description:
        "Công nghệ in phun đa lớp UV 8 màu siêu phân giải. Mực in cao cấp chuẩn Nhật Bản bền màu trên 10 năm, không bong tróc, không ố vàng.",
      badge: "Độ sắc nét 2400 DPI",
      gradient: "from-[#00D4FF] via-[#3B82F6] to-[#A855F7]",
    },
    {
      icon: ShieldCheck,
      subtitle: "Pure Acrylic Grade A",
      title: "Mica đúc trong suốt 99.8%",
      description:
        "Sử dụng mica acrylic nhập khẩu nguyên khối, vát cạnh kim cương CNC siêu bóng. Chống va đập, chống thấm nước tuyệt đối với độ dày tiêu chuẩn 3mm - 5mm.",
      badge: "Mica đúc chuẩn A",
      gradient: "from-[#A855F7] via-[#EC4899] to-[#F43F5E]",
    },
    {
      icon: Palette,
      subtitle: "Limitless Customization",
      title: "Cá nhân hóa theo yêu cầu",
      description:
        "Tự do đưa hình ảnh người yêu, idol anime, thú cưng, chữ ký, mã QR Spotify lên sản phẩm. Cắt viền tự do theo form dáng hình ảnh không giới hạn.",
      badge: "Free Die-Cut",
      gradient: "from-[#38BDF8] via-[#818CF8] to-[#C084FC]",
    },
    {
      icon: Crown,
      subtitle: "Exclusive LADA GIFT Touch",
      title: "Gia công kim cương CNC độc quyền",
      description:
        "Tích hợp công nghệ đánh bóng quang học vát kim cương CNC, bề mặt bóng loáng như pha lê, bắt sáng lung linh dưới mọi góc nhìn.",
      badge: "Độc quyền LADA GIFT",
      gradient: "from-[#F472B6] via-[#A855F7] to-[#00D4FF]",
    },
    {
      icon: Gift,
      subtitle: "Cyber Luxe Packaging",
      title: "Đóng gói cao cấp làm quà tặng",
      description:
        "Mỗi sản phẩm đi kèm hộp quà LADA GIFT sang trọng, túi nhung bảo vệ và thiệp chúc mừng thiết kế riêng. Hoàn hảo để làm quà tặng sinh nhật, kỷ niệm, quà cặp đôi.",
      badge: "Gift Box Included",
      gradient: "from-[#34D399] via-[#06B6D4] to-[#3B82F6]",
    },
  ];

  return (
    <section id="why-choose-us" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-r from-purple-600/15 via-cyan-500/15 to-pink-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={containerRef}>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1 text-xs font-black uppercase tracking-widest text-pink-700 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            <span>LADA GIFT • Đẳng cấp chất lượng</span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-[#1E1035]"
          >
            Tại sao nên chọn{" "}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              LADA GIFT?
            </span>
          </motion.h2>

          <motion.p
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg font-medium text-slate-700"
          >
            Sự kết hợp giữa công nghệ in UV đa lớp hiện đại và chất liệu mica cao cấp tạo nên
            những tác phẩm quà tặng LADA GIFT bền vững theo thời gian.
          </motion.p>
        </div>

        {/* Features Bento Layout with Synchronized Heights */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`${
                i === 0 ? "lg:col-span-2" : i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              } h-full flex flex-col`}
            >
              <FeatureCard {...feature} index={i} reducedMotion={reducedMotion} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
