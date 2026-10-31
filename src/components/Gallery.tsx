'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X } from 'lucide-react';
import { galleryItems } from '@/data/products';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type GalleryItem = (typeof galleryItems)[number];

/* ─── Gradient patterns for each gallery item ─── */
const gradientPatterns: Record<number, { bg: string; pattern: string }> = {
  1: {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    pattern:
      'radial-gradient(circle at 30% 40%, rgba(0,212,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(168,85,247,0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(236,72,153,0.2) 0%, transparent 40%)',
  },
  2: {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    pattern:
      'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.3) 0%, transparent 50%)',
  },
  3: {
    bg: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    pattern:
      'radial-gradient(circle at 50% 30%, rgba(0,212,255,0.35) 0%, transparent 40%), radial-gradient(circle at 30% 70%, rgba(16,185,129,0.3) 0%, transparent 45%), radial-gradient(circle at 70% 80%, rgba(59,130,246,0.2) 0%, transparent 40%)',
  },
  4: {
    bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #1a0a2e 100%)',
    pattern:
      'radial-gradient(circle at 60% 40%, rgba(236,72,153,0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(168,85,247,0.3) 0%, transparent 50%)',
  },
  5: {
    bg: 'linear-gradient(135deg, #042f2e 0%, #134e4a 50%, #042f2e 100%)',
    pattern:
      'radial-gradient(ellipse at 40% 30%, rgba(20,184,166,0.4) 0%, transparent 55%), radial-gradient(circle at 70% 60%, rgba(6,182,212,0.3) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(59,130,246,0.2) 0%, transparent 40%)',
  },
  6: {
    bg: 'linear-gradient(135deg, #1e1a2e 0%, #2e1065 50%, #1e1a2e 100%)',
    pattern:
      'radial-gradient(circle at 50% 50%, rgba(192,132,252,0.35) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(0,212,255,0.2) 0%, transparent 40%)',
  },
  7: {
    bg: 'linear-gradient(135deg, #0c1220 0%, #1e293b 50%, #0c1220 100%)',
    pattern:
      'radial-gradient(circle at 40% 50%, rgba(251,191,36,0.25) 0%, transparent 45%), radial-gradient(circle at 70% 30%, rgba(236,72,153,0.3) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(0,212,255,0.2) 0%, transparent 40%)',
  },
  8: {
    bg: 'linear-gradient(135deg, #1a0a1e 0%, #3b0764 50%, #1a0a1e 100%)',
    pattern:
      'radial-gradient(circle at 50% 40%, rgba(244,114,182,0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(192,132,252,0.25) 0%, transparent 45%)',
  },
};

const categoryLabels: Record<string, string> = {
  keychain: 'Móc khóa',
  magnet: 'Nam châm',
  'mica-magnet': 'Mica nam châm',
};

const categoryColors: Record<string, string> = {
  keychain: 'from-cyan-500 to-blue-500',
  magnet: 'from-pink-500 to-purple-500',
  'mica-magnet': 'from-emerald-500 to-cyan-500',
};

/* ─── Gallery Card ─── */
function GalleryCard({
  item,
  index,
  onSelect,
  reducedMotion,
}: {
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (y - 0.5) * -10,
        y: (x - 0.5) * 10,
      });
    },
    [reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const gradient = gradientPatterns[item.id] || gradientPatterns[1];

  return (
    <motion.div
      ref={cardRef}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl ${item.span}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
      animate={
        isInView
          ? reducedMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1 }
          : {}
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
      onClick={() => onSelect(item)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10"
        style={{
          minHeight: item.span.includes('row-span-2') ? '320px' : '160px',
        }}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Clip-path reveal animation */}
        <motion.div
          className="absolute inset-0"
          initial={reducedMotion ? {} : { clipPath: 'inset(100% 0 0 0)' }}
          animate={
            isInView
              ? reducedMotion
                ? {}
                : { clipPath: 'inset(0% 0 0 0)' }
              : {}
          }
          transition={{
            duration: 0.8,
            delay: index * 0.1 + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          }}
        >
          {/* Gradient product placeholder */}
          <motion.div
            className="absolute inset-0"
            style={{ background: gradient.bg }}
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            {/* Unique pattern overlay */}
            <div
              className="absolute inset-0"
              style={{ background: gradient.pattern }}
            />
            {/* Decorative shapes */}
            <svg
              className="absolute inset-0 h-full w-full opacity-10"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="0.3" />
              <rect x="60" y="60" width="80" height="80" rx="10" fill="none" stroke="white" strokeWidth="0.3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Holographic iridescent overlay on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15), rgba(236,72,153,0.15), rgba(59,130,246,0.15))',
            mixBlendMode: 'overlay',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Light sweep effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-full top-0 h-full w-1/2 -skew-x-12 opacity-0 transition-all duration-700 group-hover:left-[150%] group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
          />
        </div>

        {/* Category badge */}
        <div className="absolute left-3 top-3 z-10">
          <div
            className={`rounded-full bg-gradient-to-r ${categoryColors[item.category]} px-3 py-1 text-xs font-medium text-white shadow-lg`}
          >
            {categoryLabels[item.category]}
          </div>
        </div>

        {/* Glassmorphism overlay on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 backdrop-blur-[2px]"
          style={{
            background:
              'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: isHovered ? 0.8 : 0.4 }}
          transition={{ duration: 0.3 }}
        />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <motion.h3
            className="text-sm font-semibold text-white md:text-base"
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {item.title}
          </motion.h3>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Lightbox Modal ─── */
function Lightbox({
  item,
  onClose,
  reducedMotion,
}: {
  item: GalleryItem;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const gradient = gradientPatterns[item.id] || gradientPatterns[1];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-white/90 bg-white/95 backdrop-blur-2xl shadow-2xl"
        initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white/90 text-slate-700 shadow-md transition-colors hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <div className="absolute inset-0" style={{ background: gradient.bg }}>
            <div
              className="absolute inset-0"
              style={{ background: gradient.pattern }}
            />
            <svg
              className="absolute inset-0 h-full w-full opacity-10"
              viewBox="0 0 400 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="150" r="90" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="200" cy="150" r="60" fill="none" stroke="white" strokeWidth="0.3" />
              <circle cx="200" cy="150" r="30" fill="none" stroke="white" strokeWidth="0.3" />
              <rect x="120" y="70" width="160" height="160" rx="15" fill="none" stroke="white" strokeWidth="0.3" />
            </svg>
          </div>
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(244,114,182,0.15), rgba(168,85,247,0.15), rgba(56,189,248,0.15), transparent)',
              mixBlendMode: 'overlay',
            }}
            animate={
              reducedMotion
                ? {}
                : {
                    background: [
                      'linear-gradient(135deg, rgba(244,114,182,0.2), transparent, transparent)',
                      'linear-gradient(135deg, transparent, rgba(168,85,247,0.2), transparent)',
                      'linear-gradient(135deg, transparent, transparent, rgba(56,189,248,0.2))',
                      'linear-gradient(135deg, rgba(244,114,182,0.2), transparent, transparent)',
                    ],
                  }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Info */}
        <div className="p-6 bg-white">
          <div
            className={`mb-3 inline-block rounded-full bg-gradient-to-r ${categoryColors[item.category]} px-3 py-1 text-xs font-bold text-white shadow-sm`}
          >
            {categoryLabels[item.category]}
          </div>
          <h3 className="text-xl font-black text-[#1E1035]">{item.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Gallery Section ─── */
export default function Gallery() {
  const reducedMotion = useReducedMotion();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section
      className="relative overflow-hidden py-20 md:py-32"
    >
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[550px] w-[550px] sm:h-[800px] sm:w-[800px] rounded-full bg-gradient-to-tr from-pink-300/20 via-purple-300/15 to-sky-300/20 blur-[120px]" />
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
            <span>LADA GIFT • Showcase Gallery</span>
          </div>
          <h2 className="text-3xl font-black text-[#1E1035] md:text-4xl lg:text-5xl">
            BỘ SƯU TẬP{' '}
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600"
            >
              THÀNH PHẨM THỰC TẾ
            </span>
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
          />
        </motion.div>

        {/* Bento grid */}
        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:auto-rows-[180px]">
          {galleryItems.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              onSelect={setSelectedItem}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
