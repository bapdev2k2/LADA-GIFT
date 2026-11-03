'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ZoomIn, Sparkles } from 'lucide-react';
import { galleryItems } from '@/data/products';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLanguage } from '@/lib/i18n';

type GalleryItem = (typeof galleryItems)[number];

const categoryLabels: Record<string, string> = {
  keychain: 'Móc khóa',
  magnet: 'Nam châm',
  'mica-magnet': 'Mica nam châm',
};

const categoryColors: Record<string, string> = {
  keychain: 'from-pink-500 to-purple-600',
  magnet: 'from-purple-600 to-indigo-600',
  'mica-magnet': 'from-sky-500 to-pink-500',
};

/* ─── Gallery Card with Real Images from aelinh ─── */
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
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  const categoryLabel =
    item.category === 'keychain'
      ? t('gallery_cat_keychain')
      : item.category === 'magnet'
      ? t('gallery_cat_magnet')
      : t('gallery_cat_mica_magnet');

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

  return (
    <motion.div
      ref={cardRef}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl ${item.span} shadow-md shadow-pink-100/40 hover:shadow-2xl hover:shadow-pink-300/40 transition-shadow duration-300`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1 }
          : {}
      }
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      onClick={() => onSelect(item)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-white/90 bg-white/80"
        style={{
          minHeight: item.span.includes('row-span-2') ? '320px' : '170px',
        }}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
      >
        {/* Real Product Image */}
        <div className="absolute inset-0 overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Ambient Gradient Overlay for Readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

        {/* Glossy light sweep overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-full top-0 h-full w-1/2 -skew-x-12 opacity-0 transition-all duration-700 group-hover:left-[150%] group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </div>

        {/* Top Badges */}
        <div className="absolute left-3 top-3 z-10 flex items-center justify-between right-3">
          <div
            className={`rounded-full bg-gradient-to-r ${categoryColors[item.category]} px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md`}
          >
            {categoryLabel}
          </div>

          <div className="h-7 w-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
            <ZoomIn className="h-3.5 w-3.5 text-pink-600" />
          </div>
        </div>

        {/* Bottom Title & Description Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <h3 className="text-sm sm:text-base font-black text-white leading-snug drop-shadow-md">
            {item.title}
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs font-medium text-pink-200 line-clamp-1 opacity-90 drop-shadow">
            {item.description}
          </p>
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
  const { t } = useLanguage();
  const categoryLabel =
    item.category === 'keychain'
      ? t('gallery_cat_keychain')
      : item.category === 'magnet'
      ? t('gallery_cat_magnet')
      : t('gallery_cat_mica_magnet');
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-white/90 bg-white/95 backdrop-blur-2xl shadow-2xl"
        initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white/90 text-slate-700 shadow-md transition-colors hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600 cursor-pointer"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Real Product Image in Lightbox */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info Area */}
        <div className="p-6 bg-white">
          <div
            className={`mb-2.5 inline-block rounded-full bg-gradient-to-r ${categoryColors[item.category]} px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm`}
          >
            {categoryLabel}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1E1035]">{item.title}</h3>
          <p className="mt-2 text-sm font-semibold text-slate-600 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-4 pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{t("gallery_footer_info")}</span>
            <span className="text-pink-600 font-extrabold">{t("gallery_footer_badge")}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Gallery Section ─── */
export default function Gallery() {
  const reducedMotion = useReducedMotion();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[550px] w-[550px] sm:h-[800px] sm:w-[800px] rounded-full bg-gradient-to-tr from-pink-300/20 via-purple-300/15 to-sky-300/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-14 text-center md:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/80 px-4 py-1 text-xs font-black uppercase tracking-widest text-pink-700 shadow-sm backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            <span>{t("gallery_tag")}</span>
          </div>
          <h2 className="text-3xl font-black text-[#1E1035] md:text-4xl lg:text-5xl">
            {t("gallery_title")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600">
              LADA GIFT
            </span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-700 max-w-xl mx-auto">
            {t("gallery_desc")}
          </p>
        </motion.div>

        {/* 7-Card Bento Grid */}
        <div className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[190px]">
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

      {/* Lightbox Modal */}
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
