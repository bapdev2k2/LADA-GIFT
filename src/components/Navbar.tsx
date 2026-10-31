"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Heart } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";

/* -------------------------------------------------------------------------- */
/*  Nav link data                                                              */
/* -------------------------------------------------------------------------- */

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Sản phẩm", href: "#products" },
  { label: "Showroom 3D", href: "#showroom" },
  { label: "Kích thước", href: "#sizes" },
  { label: "Quy trình in", href: "#process" },
  { label: "Bộ sưu tập", href: "#gallery" },
  { label: "Liên hệ", href: "#contact" },
];

/* -------------------------------------------------------------------------- */
/*  Desktop Nav Link with hover underline                                      */
/* -------------------------------------------------------------------------- */

function DesktopNavLink({ link }: { link: NavLink }) {
  return (
    <button
      type="button"
      onClick={() => smoothScrollTo(link.href)}
      className="group relative cursor-pointer bg-transparent border-none px-2 py-2 text-sm font-bold tracking-wide text-slate-700 transition-colors duration-300 hover:text-pink-600"
    >
      {link.label}
      {/* Hover underline animation */}
      <span className="absolute bottom-0 left-0 h-[2.5px] w-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile menu variants                                                       */
/* -------------------------------------------------------------------------- */

const drawerVariants = {
  closed: {
    x: "100%",
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
  open: {
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const mobileItemVariants = {
  closed: { opacity: 0, x: 30 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                     */
/* -------------------------------------------------------------------------- */

interface NavbarProps {
  onOpenCustomizer?: () => void;
}

export default function Navbar({ onOpenCustomizer }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Scroll listener for opacity transition */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMobileLinkClick = (href: string) => {
    setMobileOpen(false);
    setTimeout(() => smoothScrollTo(href), 350);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/85 backdrop-blur-2xl border-b border-pink-200/80 shadow-md shadow-pink-100/40 py-2.5"
            : "bg-white/60 backdrop-blur-lg border-b border-white/60 py-3.5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ---- Brand Logo (Image 1 - LADA GIFT) ---- */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer bg-transparent border-none text-left group"
          >
            {/* Round Logo Image */}
            <div className="relative h-11 w-11 rounded-full p-[2px] bg-gradient-to-tr from-pink-400 via-purple-400 to-pink-300 shadow-md shadow-pink-300/40 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/lada-gift-logo.jpg"
                alt="LADA GIFT Logo"
                className="h-full w-full rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] text-white shadow-sm">
                ✦
              </span>
            </div>

            {/* Brand Name Text */}
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E1035] leading-none group-hover:text-pink-600 transition-colors">
                LADA GIFT
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-pink-600/90 mt-0.5">
                Gift From The Heart
              </span>
            </div>
          </button>

          {/* ---- Desktop links ---- */}
          <div className="hidden items-center gap-6 md:flex bg-white/50 px-5 py-1.5 rounded-full border border-white/80 shadow-sm backdrop-blur-md">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.href} link={link} />
            ))}
          </div>

          {/* ---- Desktop CTA button ---- */}
          <div className="hidden md:block">
            <button
              type="button"
              onClick={() => {
                if (onOpenCustomizer) {
                  onOpenCustomizer();
                } else {
                  smoothScrollTo("#contact");
                }
              }}
              className="relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-6 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-pink-500/50 hover:brightness-110 active:scale-95"
            >
              {/* Shimmer overlay */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Tự thiết kế ngay</span>
              </span>
            </button>
          </div>

          {/* ---- Mobile hamburger ---- */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex cursor-pointer items-center justify-center rounded-xl border border-pink-200/80 bg-white/80 p-2.5 text-[#1E1035] shadow-sm backdrop-blur-sm transition-colors hover:bg-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* ---- Mobile slide-in drawer ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed right-0 top-0 bottom-0 z-50 flex w-80 flex-col border-l border-pink-200 bg-white/95 backdrop-blur-2xl md:hidden shadow-2xl"
            >
              {/* Header with Logo */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-pink-50/50">
                <div className="flex items-center gap-3">
                  <img
                    src="/lada-gift-logo.jpg"
                    alt="Logo"
                    className="h-10 w-10 rounded-full object-cover border border-pink-300 shadow-sm"
                  />
                  <div>
                    <span className="text-lg font-black text-[#1E1035] block leading-tight">
                      LADA GIFT
                    </span>
                    <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                      Gift From The Heart
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-pink-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-pink-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-1 flex-col gap-1 px-6 py-6 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    custom={i}
                    variants={mobileItemVariants}
                    initial="closed"
                    animate="open"
                    type="button"
                    onClick={() => handleMobileLinkClick(link.href)}
                    className="cursor-pointer rounded-xl bg-transparent border-none px-4 py-3 text-left text-base font-bold text-slate-800 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="px-6 pb-8 border-t border-pink-100 pt-4 bg-pink-50/30">
                <motion.button
                  custom={navLinks.length}
                  variants={mobileItemVariants}
                  initial="closed"
                  animate="open"
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (onOpenCustomizer) {
                      onOpenCustomizer();
                    } else {
                      handleMobileLinkClick("#contact");
                    }
                  }}
                  className="w-full cursor-pointer rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-6 py-3.5 text-center text-sm font-extrabold text-white shadow-lg shadow-pink-400/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Tự thiết kế ngay</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}
