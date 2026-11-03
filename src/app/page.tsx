"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import ProductRotation from "@/components/ProductRotation";
import FullBodyCutoutSection from "@/components/FullBodyCutoutSection";
import SizeSelector from "@/components/SizeSelector";
import DesignProcess from "@/components/DesignProcess";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import HolographicBackground from "@/components/HolographicBackground";
import CursorGlow from "@/components/CursorGlow";
import SmoothScrollInit from "@/components/SmoothScrollInit";
import SectionDivider from "@/components/SectionDivider";
import DesignCustomizerModal from "@/components/DesignCustomizerModal";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import { type Product } from "@/data/products";
import { clearCartStorage } from "@/lib/cartStorage";

export default function Home() {
  // Xóa sạch giỏ hàng cũ mỗi khi loading lại web
  useEffect(() => {
    clearCartStorage();
  }, []);
  // State for Customizer Studio Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerProductType, setCustomizerProductType] = useState<
    "keychain" | "magnet" | "mica-magnet"
  >("keychain");
  const [customizerSize, setCustomizerSize] = useState<"S" | "L" | "XL">("L");

  // State for Product Details Modal
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Cart / Orders in session
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Handlers
  const handleOpenCustomizer = useCallback(
    (
      type: "keychain" | "magnet" | "mica-magnet" = "keychain",
      size: "S" | "L" | "XL" = "L"
    ) => {
      setCustomizerProductType(type);
      setCustomizerSize(size);
      setIsCustomizerOpen(true);
    },
    []
  );

  const handleViewProductDetails = useCallback((product: Product) => {
    setSelectedDetailProduct(product);
    setIsDetailOpen(true);
  }, []);

  const handleOrderProduct = useCallback(
    (product: Product) => {
      handleOpenCustomizer(product.category, "L");
    },
    [handleOpenCustomizer]
  );

  const handleSelectSizeAndCustomize = useCallback(
    (size: "S" | "L" | "XL") => {
      handleOpenCustomizer("keychain", size);
    },
    [handleOpenCustomizer]
  );

  const handleAddToCart = useCallback((item: any) => {
    setCartItems((prev) => [...prev, item]);
  }, []);

  return (
    <div className="relative min-h-screen text-[#1E1035] selection:bg-pink-500/30 selection:text-pink-900 overflow-x-hidden">
      {/* Smooth scroll anchor handler */}
      <SmoothScrollInit />

      {/* Holographic background with continuous mesh gradient & floating particles */}
      <HolographicBackground />

      {/* Cursor Glow follower */}
      <CursorGlow />

      {/* Navigation bar */}
      <Navbar onOpenCustomizer={() => handleOpenCustomizer("keychain", "L")} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection onOpenCustomizer={() => handleOpenCustomizer("keychain", "L")} />

        <SectionDivider />

        {/* 2. 3D Showroom & Continuous Rotation */}
        <section id="showroom" className="scroll-mt-24">
          <ProductRotation onOpenCustomizer={() => handleOpenCustomizer("keychain", "L")} />
        </section>

        <SectionDivider />

        {/* 2.5 Full-Body Cutout Section (Ảnh mica nam châm toàn thân) */}
        <FullBodyCutoutSection
          onOpenCustomizer={(cat) => handleOpenCustomizer(cat || "mica-magnet", "L")}
        />

        <SectionDivider />

        {/* 3. Product Showcase (3 dòng sản phẩm chính) */}
        <div id="products" className="scroll-mt-24">
          <ProductShowcase
            onViewDetails={handleViewProductDetails}
            onOrder={handleOrderProduct}
          />
        </div>

        <SectionDivider />

        {/* 4. Size Selector (Lựa chọn kích thước tương tác) */}
        <section id="sizes" className="scroll-mt-24">
          <SizeSelector onSelectSize={handleSelectSizeAndCustomize} />
        </section>

        <SectionDivider />

        {/* 5. Custom Design Process (4 bước đặt hàng) */}
        <section id="process" className="scroll-mt-24">
          <DesignProcess onOpenCustomizer={() => handleOpenCustomizer("keychain", "L")} />
        </section>

        <SectionDivider />

        {/* 6. Gallery / Bento Grid Showcase Thành Phẩm */}
        <section id="gallery" className="scroll-mt-24">
          <Gallery />
        </section>

        <SectionDivider />

        {/* 7. Why Choose Us (Ưu điểm vượt trội LADA GIFT) */}
        <div id="why-choose-us" className="scroll-mt-24">
          <WhyChooseUs />
        </div>

        <SectionDivider />

        {/* 8. CTA Section (Kêu gọi hành động ấn tượng) */}
        <section id="cta" className="scroll-mt-24">
          <CTASection onOpenCustomizer={() => handleOpenCustomizer("keychain", "L")} />
        </section>
      </main>

      {/* 9. Footer & Liên hệ */}
      <div id="contact" className="scroll-mt-24">
        <Footer />
      </div>

      {/* Interactive 3D Hologram Design Customizer Modal */}
      <DesignCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialProductType={customizerProductType}
        initialSize={customizerSize}
        onAddToCart={handleAddToCart}
      />

      {/* Product Details & Specifications Modal */}
      <ProductDetailsModal
        product={selectedDetailProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onCustomize={(prod, size) => {
          setIsDetailOpen(false);
          handleOpenCustomizer(prod.category, size);
        }}
      />
    </div>
  );
}
