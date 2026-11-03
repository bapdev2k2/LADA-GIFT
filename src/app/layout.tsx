import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LADA GIFT – Quà Tặng Mica In Hình Cao Cấp | Gift From The Heart",
  description:
    "Thương hiệu LADA GIFT chuyên sản xuất móc khóa mica, nam châm in hình cá nhân hóa theo yêu cầu. Lưu giữ những khoảnh khắc đặc biệt từ trái tim.",
  keywords: [
    "LADA GIFT",
    "lada gift",
    "móc khóa mica",
    "móc khóa lada gift",
    "nam châm in hình",
    "quà tặng cá nhân hóa",
    "in mica theo yêu cầu",
    "gift from the heart",
  ],
  openGraph: {
    title: "LADA GIFT – Quà Tặng Mica In Hình Cao Cấp",
    description:
      "Biến những khoảnh khắc đáng nhớ thành những món phụ kiện mica độc đáo cùng LADA GIFT.",
    type: "website",
    locale: "vi_VN",
    images: ["/lada-gift-logo.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/lada-gift-logo.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen text-[#1E1035] antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
