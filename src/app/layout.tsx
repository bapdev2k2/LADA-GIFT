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
  metadataBase: new URL("https://ladagift.com"),
  title: "LADA GIFT – Quà Tặng Mica In Hình Theo Yêu Cầu Cao Cấp",
  description:
    "Xưởng sản xuất móc khóa mica, ảnh nam châm tủ lạnh in theo yêu cầu cao cấp LADA GIFT. Mica Acrylic đúc 3.5mm vát cạnh kim cương CNC siêu bóng, bền màu 10 năm.",
  keywords: [
    "LADA GIFT",
    "lada gift",
    "móc khóa mica",
    "móc khóa lada gift",
    "nam châm in hình",
    "ảnh mica nam châm",
    "quà tặng cá nhân hóa",
    "in mica theo yêu cầu",
    "gift from the heart",
  ],
  authors: [{ name: "LADA GIFT", url: "https://ladagift.com" }],
  creator: "LADA GIFT",
  publisher: "LADA GIFT",
  openGraph: {
    title: "LADA GIFT – Quà Tặng Mica In Hình Theo Yêu Cầu Cao Cấp",
    description:
      "Xưởng sản xuất móc khóa mica, ảnh nam châm tủ lạnh in theo yêu cầu cao cấp LADA GIFT. Mica đúc 3.5mm vát cạnh kim cương CNC bóng loáng, bền đẹp 10 năm.",
    url: "https://ladagift.com",
    siteName: "LADA GIFT",
    images: [
      {
        url: "/lada-gift-logo.jpg",
        width: 1024,
        height: 1024,
        alt: "LADA GIFT – Quà Tặng Mica In Hình Cao Cấp",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LADA GIFT – Quà Tặng Mica In Hình Theo Yêu Cầu Cao Cấp",
    description:
      "Xưởng sản xuất móc khóa mica, ảnh nam châm tủ lạnh in theo yêu cầu cao cấp LADA GIFT. Mica đúc 3.5mm vát cạnh kim cương CNC bóng loáng.",
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
