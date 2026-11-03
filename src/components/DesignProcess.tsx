'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Package, Ruler, Upload, CheckCircle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLanguage } from '@/lib/i18n';

interface Step {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  number: number;
}

const steps: Step[] = [
  {
    icon: Package,
    title: 'Chọn sản phẩm',
    description:
      'Lựa chọn loại sản phẩm bạn muốn: móc khóa, nam châm hoặc mica nam châm',
    number: 1,
  },
  {
    icon: Ruler,
    title: 'Chọn kích thước',
    description:
      'Chọn kích thước phù hợp: S (7.5cm), L (10cm) hoặc XL (15cm)',
    number: 2,
  },
  {
    icon: Upload,
    title: 'Upload hình ảnh',
    description:
      'Tải lên hình ảnh cá nhân của bạn. Chúng tôi sẽ thiết kế và gửi bản xem trước',
    number: 3,
  },
  {
    icon: CheckCircle,
    title: 'Xác nhận đặt hàng',
    description:
      'Xác nhận thiết kế và đặt hàng. Sản phẩm sẽ được giao trong 3-5 ngày',
    number: 4,
  },
];

function StepCard({
  step,
  index,
  reducedMotion,
}: {
  step: Step;
  index: number;
  reducedMotion: boolean;
}) {
  const Icon = step.icon;
  const { t } = useLanguage();
  const stepTitle = t(`process_step_${step.number}` as any) || step.title;
  const stepDesc = t(`process_step_${step.number}_desc` as any) || step.description;

  return (
    <motion.div
      className="group relative flex flex-col items-center text-center"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
    >
      {/* Number badge with holographic gradient */}
      <div className="relative z-10 mb-4">
        <div className="relative">
          <div
            className="absolute -inset-1 rounded-full opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'linear-gradient(135deg, #00D4FF, #A855F7, #EC4899, #3B82F6)',
            }}
          />
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{
              background:
                'linear-gradient(135deg, #00D4FF, #A855F7, #EC4899, #3B82F6)',
            }}
          >
            {step.number}
          </div>
        </div>
      </div>

      {/* Card */}
      <motion.div
        className="relative w-full max-w-[260px] rounded-3xl border-2 border-white/90 p-6 backdrop-blur-2xl transition-all duration-300 shadow-xl shadow-pink-100/50 bg-white/80 group-hover:border-pink-400"
        whileHover={
          reducedMotion
            ? {}
            : { y: -8, boxShadow: '0 20px 40px rgba(244,114,182,0.25)' }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Light sweep effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div
            className="absolute -left-full top-0 h-full w-1/2 -skew-x-12 opacity-0 transition-all duration-700 group-hover:left-[150%] group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </div>

        {/* Icon */}
        <motion.div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-200 bg-gradient-to-tr from-pink-100 via-purple-50 to-pink-50 shadow-md shadow-pink-200/40"
          whileHover={reducedMotion ? {} : { rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-7 w-7 text-pink-600" strokeWidth={2} />
        </motion.div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-black text-[#1E1035]">{stepTitle}</h3>

        {/* Description */}
        <p className="text-sm font-semibold leading-relaxed text-slate-600">
          {stepDesc}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ConnectingLine({
  index,
  orientation,
  reducedMotion,
}: {
  index: number;
  orientation: 'horizontal' | 'vertical';
  reducedMotion: boolean;
}) {
  const lineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(lineRef, { once: true, amount: 0.5 });

  if (orientation === 'horizontal') {
    return (
      <div
        ref={lineRef}
        className="hidden flex-1 items-center px-2 lg:flex"
        style={{ minWidth: '40px' }}
      >
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-pink-200/80">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background:
                'linear-gradient(90deg, #EC4899, #A855F7, #38BDF8)',
            }}
            initial={{ width: '0%' }}
            animate={
              isInView && !reducedMotion
                ? { width: '100%' }
                : reducedMotion
                ? { width: '100%' }
                : {}
            }
            transition={{
              duration: 0.8,
              delay: 0.3 + index * 0.2,
              ease: 'easeInOut',
            }}
          />
          {/* Animated glow dot */}
          {!reducedMotion && isInView && (
            <motion.div
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
              style={{
                background: '#EC4899',
                boxShadow: '0 0 10px #EC4899, 0 0 20px #A855F7',
              }}
              initial={{ left: '0%' }}
              animate={{ left: ['0%', '100%'] }}
              transition={{
                duration: 2,
                delay: 0.8 + index * 0.2,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Vertical connecting line for mobile
  return (
    <div
      ref={lineRef}
      className="flex items-center justify-center py-2 lg:hidden"
    >
      <div className="relative h-12 w-[3px] overflow-hidden rounded-full bg-pink-200/80">
        <motion.div
          className="absolute left-0 top-0 w-full rounded-full"
          style={{
            background:
              'linear-gradient(180deg, #EC4899, #A855F7, #38BDF8)',
          }}
          initial={{ height: '0%' }}
          animate={
            isInView && !reducedMotion
              ? { height: '100%' }
              : reducedMotion
              ? { height: '100%' }
              : {}
          }
          transition={{
            duration: 0.8,
            delay: 0.3 + index * 0.2,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}

interface DesignProcessProps {
  onOpenCustomizer?: () => void;
}

export default function DesignProcess({ onOpenCustomizer }: DesignProcessProps = {}) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-32"
    >
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-tr from-pink-300/20 via-purple-300/15 to-sky-300/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center md:mb-20"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1 text-xs font-black uppercase tracking-widest text-pink-700 shadow-sm backdrop-blur-md mb-3">
            <span>{t("process_tag")}</span>
          </div>
          <h2 className="text-3xl font-black text-[#1E1035] md:text-4xl lg:text-5xl">
            {t("process_title")}{" "}
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600"
            >
              LADA GIFT
            </span>
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
          />
        </motion.div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:flex lg:items-start lg:justify-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-start">
              <StepCard
                step={step}
                index={index}
                reducedMotion={reducedMotion}
              />
              {index < steps.length - 1 && (
                <ConnectingLine
                  index={index}
                  orientation="horizontal"
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="flex flex-col items-center lg:hidden">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <StepCard
                step={step}
                index={index}
                reducedMotion={reducedMotion}
              />
              {index < steps.length - 1 && (
                <ConnectingLine
                  index={index}
                  orientation="vertical"
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA Launch Studio */}
        {onOpenCustomizer && (
          <div className="mt-16 text-center">
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-pink-400/35 transition hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>{t("hero_btn_customize")}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
