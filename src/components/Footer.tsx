"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Social Brand SVG icons                                                    */
/* -------------------------------------------------------------------------- */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface FooterLink {
  label: string;
  href: string;
}

const productLinks: FooterLink[] = [
  { label: "Móc khóa mica in hình", href: "#products" },
  { label: "Nam châm in hình cá nhân", href: "#products" },
  { label: "Mica nam châm kim cương", href: "#products" },
  { label: "Standee mica để bàn", href: "#products" },
  { label: "Showroom 3D tương tác", href: "#showroom" },
];

const policyLinks: FooterLink[] = [
  { label: "Chính sách đặt hàng quà tặng", href: "#" },
  { label: "Chính sách bảo hành 10 năm", href: "#" },
  { label: "Hướng dẫn thanh toán & Vận chuyển", href: "#" },
  { label: "Thiết kế & duyệt mẫu miễn phí", href: "#" },
  { label: "Câu hỏi thường gặp (FAQ)", href: "#" },
];

const socialLinks = [
  { label: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
  { label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
  { label: "TikTok", icon: TikTokIcon, href: "https://tiktok.com" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* -------------------------------------------------------------------------- */
/*  Footer Link Component                                                      */
/* -------------------------------------------------------------------------- */

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <a
        href={link.href}
        className="text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-pink-600 flex items-center gap-1.5"
      >
        <span className="text-pink-400">›</span>
        <span>{link.label}</span>
      </a>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                     */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative overflow-hidden border-t-2 border-pink-200/80 bg-white/80 backdrop-blur-2xl"
    >
      {/* Top holographic gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-500 to-sky-400" />

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand Info */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full p-[2px] bg-gradient-to-tr from-pink-400 to-purple-400 shadow-md">
                <img
                  src="/lada-gift-logo.jpg"
                  alt="LADA GIFT Logo"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black text-[#1E1035] block leading-none">
                  LADA GIFT
                </span>
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mt-1 block">
                  Gift From The Heart
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="mb-6 max-w-xs text-sm font-medium leading-relaxed text-slate-600">
              Chuyên thiết kế & sản xuất các sản phẩm mica in hình, móc khóa quà tặng, nam châm cá nhân hóa cao cấp.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 bg-white text-pink-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-pink-400 hover:bg-pink-500 hover:text-white hover:scale-110"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Products */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-xs font-black tracking-wider text-[#1E1035] uppercase">
              Danh mục sản phẩm
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <FooterLinkItem key={link.label} link={link} />
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Policies */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-xs font-black tracking-wider text-[#1E1035] uppercase">
              Chính sách & Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <FooterLinkItem key={link.label} link={link} />
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-xs font-black tracking-wider text-[#1E1035] uppercase">
              Liên hệ xưởng LADA GIFT
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600" />
                <a
                  href="mailto:ladagift.custom@gmail.com"
                  className="text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-pink-600"
                >
                  ladagift.custom@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600" />
                <a
                  href="tel:0987654321"
                  className="text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-pink-600"
                >
                  Hotline / Zalo: 0987 654 321
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Hà Nội & TP. Hồ Chí Minh (Giao hàng toàn quốc)
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LADA GIFT. All rights reserved. Gift From The Heart.</p>
          <div className="flex items-center gap-1.5 text-pink-600 font-extrabold">
            <span>Thiết kế độc quyền từ LADA GIFT</span>
            <Heart className="h-3.5 w-3.5 fill-pink-500" />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
