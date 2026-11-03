"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Sparkles,
  Check,
  RotateCw,
  ShoppingBag,
  Layers,
  Plus,
  Trash2,
  Image as ImageIcon,
  Eye,
  Copy,
  CheckCheck,
  Package,
  Truck,
  Heart,
  ChevronRight,
  ShieldCheck,
  Gift,
  Smile,
  User,
  Square,
  RectangleHorizontal,
} from "lucide-react";
import { fireHologramConfetti } from "@/lib/confetti";
import { formatPrice } from "@/data/products";
import {
  CartItem,
  saveCartToStorage,
  loadCartFromStorage,
  clearCartStorage,
  saveCustomerDraft,
  loadCustomerDraft,
} from "@/lib/cartStorage";
import {
  calculateCartTotals,
  calculateItemPrice,
  isValidVietnamPhone,
  PRODUCT_CONFIGS,
  PRODUCT_PRICING,
  STYLE_DEFINITIONS,
  getSizeOptionsForProduct,
  ProductType,
  StyleType,
  SizeKey,
} from "@/lib/orderPricing";
import { useLanguage } from "@/lib/i18n";

function isValidThaiPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  return (
    /^(0[689]\d{8}|0[2-7]\d{7,8}|\+66\d{8,9})$/.test(cleaned) ||
    (cleaned.length >= 9 && cleaned.length <= 11 && /^\d+$/.test(cleaned))
  );
}

interface DesignCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductType?: "keychain" | "magnet" | "mica-magnet";
  initialSize?: "S" | "L" | "XL";
  onAddToCart?: (item: any) => void;
}

const samplePresets = [
  {
    name: "LADA GIFT Brand",
    presetKey: "preset_brand" as const,
    url: "/lada-gift-logo.jpg",
  },
  {
    name: "Couple Kỷ Niệm",
    presetKey: "preset_couple" as const,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Kawaii Pet",
    presetKey: "preset_pet" as const,
    url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Anime Chibi",
    presetKey: "preset_anime" as const,
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  },
];

const productTypesList: Array<{
  id: ProductType;
  basePrice: number;
}> = [
  {
    id: "mica-magnet",
    basePrice: 17000,
  },
  {
    id: "keychain",
    basePrice: 20000,
  },
  {
    id: "magnet",
    basePrice: 25000,
  },
];

export default function DesignCustomizerModal({
  isOpen,
  onClose,
  initialProductType = "mica-magnet",
  initialSize = "S",
  onAddToCart,
}: DesignCustomizerModalProps) {
  const { t, language } = useLanguage();

  // Current active editor configuration
  const [currentType, setCurrentType] = useState<ProductType>(initialProductType);
  const [currentStyle, setCurrentStyle] = useState<StyleType>(
    PRODUCT_PRICING[initialProductType]?.defaultStyle || "face"
  );
  const [currentSize, setCurrentSize] = useState<string>("S");
  const [currentImage, setCurrentImage] = useState<string>(samplePresets[0].url);
  const [currentImageName, setCurrentImageName] = useState<string>("lada-gift-logo.jpg");
  const [currentQty, setCurrentQty] = useState(1);

  // Editing existing item ID (if editing an existing item from cart)
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const getProductTypeName = (type: ProductType) => {
    switch (type) {
      case "keychain":
        return t("cat_keychain");
      case "magnet":
        return t("cat_magnet");
      case "mica-magnet":
        return t("cat_mica_magnet");
      default:
        return PRODUCT_CONFIGS[type]?.name || "";
    }
  };

  const getProductTypeTagline = (type: ProductType) => {
    switch (type) {
      case "keychain":
        return t("cfg_tagline_keychain");
      case "magnet":
        return t("cfg_tagline_magnet");
      case "mica-magnet":
        return t("cfg_tagline_mica_magnet");
      default:
        return PRODUCT_CONFIGS[type]?.tagline || "";
    }
  };

  const getStyleName = (style: StyleType) => {
    const meta = STYLE_DEFINITIONS[style];
    if (!meta) return style;
    return language === "th" ? meta.labelTh : language === "en" ? meta.labelEn : meta.labelVi;
  };

  // Promotion text for current product
  const getProductPromoHint = (type: ProductType) => {
    if (type === "mica-magnet") {
      return language === "th"
        ? "🎁 สั่ง 15 ชิ้น แถม 1 พวงกุญแจ • สั่ง 30 ชิ้น แถม 2 พวงกุญแจ + ส่งฟรี • สั่ง 50 ชิ้น แถม 5 พวงกุญแจ + ส่งฟรี (ขั้นต่ำ 5 ชิ้น)"
        : language === "en"
        ? "🎁 Order 15+: Free 1 Keychain • Order 30+: Free 2 Keychains + Freeship • Order 50+: Free 5 Keychains + Freeship (Min 5 pcs)"
        : "🎁 Đặt 15c: Tặng 1 Móc Khóa • Đặt 30c: Tặng 2 Móc Khóa + Freeship • Đặt 50c: Tặng 5 Móc Khóa + Freeship (Tối thiểu 5 cái)";
    }
    if (type === "keychain") {
      return language === "th"
        ? "🎁 สั่ง 15 ชิ้น แถม 1 พวงกุญแจ • สั่ง 30 ชิ้น ลด 30k + ส่งฟรี • สั่ง 50 ชิ้น ลด 60k + ส่งฟรี"
        : language === "en"
        ? "🎁 Order 15+: Free 1 Keychain • Order 30+: Save 30k + Freeship • Order 50+: Save 60k + Freeship"
        : "🎁 Đặt 15c: Tặng 1 Móc Khóa • Đặt 30c: Giảm 30.000đ + Freeship • Đặt 50c: Giảm 60.000đ + Freeship";
    }
    if (type === "magnet") {
      return language === "th"
        ? "🔥 คอมโบ 6 ภาพ: 120k • 15 ภาพ: 300k (แถม 1 ภาพ) • 30 ภาพ: 600k (แถม 2 ภาพ + ส่งฟรี) • 50 ภาพ: 1.000k (แถม 4 ภาพ + ส่งฟรี)"
        : language === "en"
        ? "🔥 Combo 6: 120k • Combo 15: 300k (+free 1 photo) • Combo 30: 600k (+free 2 photos + Freeship) • Combo 50: 1,000k (+free 4 photos + Freeship)"
        : "🔥 Combo 6 ảnh: 120k • Combo 15 ảnh: 300k (tặng 1 ảnh) • Combo 30 ảnh: 600k (tặng 2 ảnh + Freeship) • Combo 50 ảnh: 1.000.000đ (tặng 4 ảnh + Freeship)";
    }
    return "";
  };

  // Multi-Product Cart Items list
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Which item is actively displayed in the 3D studio on the left
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  // Customer Checkout Form
  const [customerCountry, setCustomerCountry] = useState<"VN" | "TH">("VN");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  // Sync country with language
  useEffect(() => {
    if (language === "th") {
      setCustomerCountry("TH");
    } else {
      setCustomerCountry("VN");
    }
  }, [language]);

  // Submitting & success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    orderId: string;
    totalPrice: number;
    items: CartItem[];
    driveFolderUrl?: string;
  } | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // 3D Motion & Auto Rotate State
  const [mouseRot, setMouseRot] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceItemFileInputRef = useRef<HTMLInputElement>(null);
  const replacingItemIdRef = useRef<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Clear cart whenever opening or reload
  useEffect(() => {
    clearCartStorage();
    setCartItems([]);
    setActivePreviewIndex(0);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerNote("");
  }, [initialProductType, initialSize]);

  // Save cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems]);

  // Handle incoming props changes
  useEffect(() => {
    if (initialProductType) {
      setCurrentType(initialProductType);
      const defStyle = PRODUCT_PRICING[initialProductType]?.defaultStyle || "face";
      setCurrentStyle(defStyle);
      const sizes = getSizeOptionsForProduct(initialProductType, defStyle);
      if (sizes.length > 0) {
        setCurrentSize(sizes[0].id);
      }
    }
  }, [initialProductType]);

  // Handle product type change
  const handleSelectProductType = (type: ProductType) => {
    setCurrentType(type);
    const defStyle = PRODUCT_PRICING[type]?.defaultStyle || "face";
    setCurrentStyle(defStyle);
    const sizes = getSizeOptionsForProduct(type, defStyle);
    if (sizes.length > 0) {
      setCurrentSize(sizes[0].id);
    }
  };

  // Handle style change
  const handleSelectStyle = (style: StyleType) => {
    setCurrentStyle(style);
    const sizes = getSizeOptionsForProduct(currentType, style);
    if (sizes.length > 0) {
      const exists = sizes.some((s) => s.id === currentSize);
      if (!exists) {
        setCurrentSize(sizes[0].id);
      }
    }
  };

  // Active available sizes for currentType & currentStyle
  const availableSizes = getSizeOptionsForProduct(currentType, currentStyle);

  // 3D Preview calculations based on active item
  const activeItem: CartItem | undefined =
    cartItems[activePreviewIndex] || cartItems[0];
  const previewType = activeItem ? (activeItem.productType as ProductType) : currentType;
  const previewStyle = activeItem ? (activeItem.styleType as StyleType) : currentStyle;
  const previewSize = activeItem ? activeItem.size : currentSize;
  const previewImage = activeItem ? activeItem.imagePreview : currentImage;

  // Mouse tilt handlers for 3D stage
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseRot({
      x: -y * 28,
      y: x * 32,
    });
    setAutoRotate(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseRot({ x: 0, y: 0 });
    setAutoRotate(true);
  }, []);

  // Handle file upload for editor
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Dung lượng ảnh quá lớn (vui lòng chọn ảnh dưới 20MB)!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          const resultStr = loadEvent.target.result as string;
          setCurrentImage(resultStr);
          setCurrentImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle replacing image for an existing item in cart
  const handleReplaceItemFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetItemId = replacingItemIdRef.current;
    if (file && targetItemId) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          const resultStr = loadEvent.target.result as string;
          setCartItems((prev) =>
            prev.map((it) =>
              it.id === targetItemId
                ? {
                    ...it,
                    imagePreview: resultStr,
                    imageName: file.name,
                  }
                : it
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add current editor item to cart (or update if editing)
  const handleAddOrUpdateItem = () => {
    const { unitPrice, subtotal, sizeDimension } = calculateItemPrice(
      currentType,
      currentSize,
      currentQty,
      currentStyle
    );
    const prodName = getProductTypeName(currentType);
    const styleLabel = getStyleName(currentStyle);

    if (editingItemId) {
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === editingItemId
            ? {
                ...it,
                productType: currentType,
                productName: prodName,
                styleType: currentStyle,
                styleLabel: styleLabel,
                size: currentSize,
                sizeValue: sizeDimension,
                quantity: currentQty,
                imagePreview: currentImage,
                imageName: currentImageName,
                unitPrice,
                subtotal,
              }
            : it
        )
      );
      setEditingItemId(null);
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productType: currentType,
        productName: prodName,
        styleType: currentStyle,
        styleLabel: styleLabel,
        size: currentSize,
        sizeValue: sizeDimension,
        quantity: currentQty,
        imagePreview: currentImage,
        imageName: currentImageName,
        unitPrice,
        subtotal,
      };
      setCartItems((prev) => [...prev, newItem]);
      setActivePreviewIndex(cartItems.length);
    }

    setCurrentQty(1);
  };

  // Modify quantity of a cart item
  const handleUpdateItemQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newQty = Math.max(1, it.quantity + delta);
          const { unitPrice, subtotal } = calculateItemPrice(
            it.productType,
            it.size,
            newQty,
            it.styleType
          );
          return {
            ...it,
            quantity: newQty,
            unitPrice,
            subtotal,
          };
        }
        return it;
      })
    );
  };

  // Delete an item from cart
  const handleDeleteItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    setActivePreviewIndex(0);
  };

  // Load an item back into editor for updating
  const handleEditItem = (item: CartItem) => {
    setEditingItemId(item.id);
    setCurrentType(item.productType as ProductType);
    if (item.styleType) {
      setCurrentStyle(item.styleType as StyleType);
    }
    setCurrentSize(item.size);
    setCurrentImage(item.imagePreview);
    setCurrentImageName(item.imageName);
    setCurrentQty(item.quantity);
  };

  // Cart summary calculations
  const totals = calculateCartTotals(cartItems);

  // Handle Checkout Order Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert(
        language === "th"
          ? "กรุณากรอกชื่อ-นามสกุลของคุณ!"
          : language === "en"
          ? "Please enter your full name!"
          : "Vui lòng nhập họ và tên của bạn!"
      );
      return;
    }

    if (customerCountry === "VN") {
      if (!isValidVietnamPhone(customerPhone)) {
        alert(
          language === "th"
            ? "เบอร์โทรศัพท์เวียดนามไม่ถูกต้อง (กรุณากรอก 10 หลัก)!"
            : language === "en"
            ? "Invalid Vietnam phone number (requires 10 digits starting with 03, 05, 07, 08, 09)!"
            : "Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số của các nhà mạng Việt Nam (03, 05, 07, 08, 09...)."
        );
        return;
      }
    } else {
      if (!isValidThaiPhone(customerPhone)) {
        alert(
          language === "th"
            ? "เบอร์โทรศัพท์ไทยไม่ถูกต้อง (กรุณากรอกเบอร์มือถือ 9-10 หลัก เช่น 08x, 09x, 06x)!"
            : language === "en"
            ? "Invalid Thailand phone number (requires 9-10 digits starting with 08, 09, 06...)!"
            : "Số điện thoại Thái Lan không hợp lệ! Vui lòng nhập số điện thoại 9-10 chữ số (Ví dụ: 08x, 09x, 06x...)."
        );
        return;
      }
    }

    if (!customerAddress.trim()) {
      alert(
        language === "th"
          ? "กรุณากรอกที่อยู่จัดส่ง!"
          : language === "en"
          ? "Please enter your delivery address!"
          : "Vui lòng nhập địa chỉ nhận hàng để LADA GIFT gửi sản phẩm tận nơi!"
      );
      return;
    }

    if (cartItems.length === 0) {
      alert(
        language === "th"
          ? "ตะกร้าสินค้าว่างอยู่!"
          : language === "en"
          ? "Your cart is empty!"
          : "Giỏ hàng đang trống!"
      );
      return;
    }

    // Check minimum order quantity for mica-magnet (Min 5 pcs)
    const micaMagnetTotal = cartItems
      .filter((it) => it.productType === "mica-magnet")
      .reduce((sum, it) => sum + it.quantity, 0);

    if (micaMagnetTotal > 0 && micaMagnetTotal < 5) {
      alert(
        language === "th"
          ? "สินค้าแม่เหล็กไมก้าต้องการขั้นต่ำ 5 ชิ้นขึ้นไป!"
          : language === "en"
          ? "Mica magnets require a minimum order of 5 pieces!"
          : "Sản phẩm Ảnh Mica Nam Châm có số lượng đặt hàng tối thiểu là 5 cái theo bảng giá! Vui lòng tăng số lượng để tiếp tục."
      );
      return;
    }

    setIsSubmitting(true);

    // Save customer draft info
    saveCustomerDraft({
      customerName,
      phone: customerPhone,
      address: customerAddress,
      note: customerNote,
    });

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: customerCountry,
          customer: {
            customerName: customerName.trim(),
            phone: customerPhone.trim(),
            address: customerAddress.trim(),
            note: customerNote.trim(),
            country: customerCountry === "TH" ? "Thái Lan" : "Việt Nam",
          },
          items: cartItems,
        }),
      });

      const result = await response.json();

      if (result.success) {
        fireHologramConfetti();
        clearCartStorage();

        setOrderSuccessData({
          orderId: result.orderId,
          totalPrice: result.totalPrice || totals.totalPrice,
          items: [...cartItems],
          driveFolderUrl: result.driveFolderUrl,
        });

        setCartItems([]);

        if (onAddToCart) {
          onAddToCart({
            orderId: result.orderId,
            items: cartItems,
            totalPrice: result.totalPrice,
          });
        }
      } else {
        alert(
          result.message ||
            (language === "th"
              ? "ไม่สามารถส่งคำสั่งซื้อได้ กรุณาตรวจสอบข้อมูลอีกครั้ง!"
              : language === "en"
              ? "Unable to submit order. Please verify your details!"
              : "Không thể gửi đơn hàng. Vui lòng kiểm tra lại thông tin!")
        );
      }
    } catch (err: any) {
      console.error("Order submit failed:", err);
      alert(
        language === "th"
          ? "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง!"
          : language === "en"
          ? "Network error while submitting order. Please try again later!"
          : "Có lỗi mạng khi gửi đơn hàng. Vui lòng thử lại sau!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderId = () => {
    if (orderSuccessData?.orderId) {
      navigator.clipboard.writeText(orderSuccessData.orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2500);
    }
  };

  if (!isOpen) return null;

  const currentItemPricing = calculateItemPrice(currentType, currentSize, currentQty, currentStyle);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Soft Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/45 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative z-10 w-full max-w-5xl rounded-3xl bg-white/95 border-2 border-pink-200 shadow-2xl backdrop-blur-2xl overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-pink-200/80 px-6 py-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-sky-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md shadow-pink-300/50">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1E1035] flex items-center gap-2">
                  <span>{t("modal_title")}</span>
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-black text-pink-700 uppercase tracking-wider">
                    {t("modal_badge")}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {t("modal_sub")}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-pink-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Hidden file input for changing existing item's image */}
          <input
            ref={replaceItemFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReplaceItemFile}
            className="hidden"
          />

          {orderSuccessData ? (
            /* Order Success View */
            <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-200">
                <Check className="h-10 w-10 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1E1035]">
                  {t("success_title")}
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  {t("success_desc")}
                </p>
              </div>

              {/* Order summary card */}
              <div className="rounded-2xl border-2 border-pink-200 bg-white/90 p-5 text-left shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{t("success_order_id")}:</span>
                    <p className="text-base font-black text-pink-600 font-mono">{orderSuccessData.orderId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyOrderId}
                    className="flex items-center gap-1.5 rounded-xl border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-700 hover:bg-pink-100 transition cursor-pointer"
                  >
                    {copiedOrderId ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{t("success_copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t("success_copy")}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="py-3 divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {orderSuccessData.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.imagePreview}
                          alt="Item preview"
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-black text-[#1E1035] truncate">
                            {item.productName}
                            {item.styleLabel && (
                              <span className="ml-1 text-[10px] text-pink-600 font-bold">
                                ({item.styleLabel})
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Size: <span className="font-bold text-pink-600">{item.sizeValue}</span> • Số lượng:{" "}
                            <span className="font-bold text-purple-700">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-800 font-mono flex-shrink-0">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-pink-100">
                  <span className="text-xs font-black text-slate-700 uppercase">{t("success_total")}:</span>
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 font-mono">
                    {formatPrice(orderSuccessData.totalPrice)}
                  </span>
                </div>

                {orderSuccessData.driveFolderUrl && (
                  <div className="pt-2 text-center">
                    <a
                      href={orderSuccessData.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 underline"
                    >
                      📁 Mở thư mục Google Drive của đơn hàng
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOrderSuccessData(null);
                    onClose();
                  }}
                  className="rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-8 py-3 text-sm font-black text-white shadow-lg shadow-pink-400/30 hover:brightness-110 transition active:scale-95 cursor-pointer"
                >
                  {t("success_btn_new")}
                </button>
              </div>
            </div>
          ) : (
            /* 2-Column Customizer & Cart Studio */
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
              {/* LEFT COLUMN: 3D HOLOGRAPHIC PREVIEW */}
              <div className="lg:col-span-5 bg-gradient-to-b from-pink-100/50 via-white/80 to-sky-100/50 p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-pink-200/70 relative select-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,114,182,0.22),_transparent_70%)] pointer-events-none" />

                <div className="w-full flex items-center justify-between text-xs text-slate-600 z-10 font-bold">
                  <span className="flex items-center gap-1.5 text-pink-600">
                    <Layers className="h-3.5 w-3.5" /> {t("modal_3d_mockup")}
                  </span>
                  <span className="italic text-slate-500 text-[11px]">{t("modal_drag_rotate")}</span>
                </div>

                {/* 3D Acrylic Preview */}
                <div
                  ref={previewRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="relative my-6 flex items-center justify-center w-full min-h-[310px] cursor-grab active:cursor-grabbing perspective-[1000px]"
                >
                  <motion.div
                    animate={
                      autoRotate
                        ? {
                            rotateY: [0, 16, -16, 0],
                            rotateX: [0, -8, 8, 0],
                            y: [0, -10, 0],
                          }
                        : {
                            rotateX: mouseRot.x,
                            rotateY: mouseRot.y,
                            y: 0,
                          }
                    }
                    transition={
                      autoRotate
                        ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        : { type: "spring", damping: 18, stiffness: 120 }
                    }
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Metal Ring & Keychain connector */}
                    {previewType === "keychain" && (
                      <div className="flex flex-col items-center -mb-2 z-20">
                        <div className="h-10 w-10 rounded-full border-[3.5px] border-slate-300 shadow-md bg-gradient-to-tr from-slate-200 via-white to-slate-400 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" />
                        </div>
                        <div className="h-3.5 w-2 rounded-full border border-slate-300 bg-slate-200 -mt-1 shadow-sm" />
                      </div>
                    )}

                    {/* Acrylic Body Container */}
                    <div
                      className={`relative overflow-hidden border-[3px] border-white/95 shadow-[0_20px_50px_rgba(244,114,182,0.35)] backdrop-blur-md transition-all duration-300 ${
                        previewStyle === "square"
                          ? "w-52 h-52 rounded-2xl"
                          : previewStyle === "rect"
                          ? "w-48 h-64 rounded-xl"
                          : previewStyle === "face"
                          ? "w-52 h-52 rounded-3xl"
                          : "w-48 h-64 rounded-3xl"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)",
                      }}
                    >
                      {/* Image Layer */}
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full object-cover object-center"
                      />

                      {/* Holographic Gloss Reflection */}
                      <div className="pointer-events-none absolute inset-0 opacity-45 mix-blend-color-dodge bg-gradient-to-tr from-cyan-400/30 via-purple-500/25 to-pink-500/30" />

                      {/* Moving shine */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-overlay"
                        style={{
                          background:
                            "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)",
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* CNC Bevel edge stroke */}
                      <div className="pointer-events-none absolute inset-[3px] rounded-xl border border-white/70" />

                      {/* Magnet badge indicator */}
                      {previewType !== "keychain" && (
                        <div className="absolute top-2 right-2 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-black tracking-wider text-pink-700 border border-pink-200 shadow-sm">
                          {previewType === "magnet" ? t("modal_badge_magnet") : t("modal_badge_mica_magnet")}
                        </div>
                      )}
                    </div>

                    {/* Drop shadow */}
                    <div className="mt-3 h-3 w-40 rounded-full bg-pink-400/25 blur-md" />
                  </motion.div>
                </div>

                {/* Bottom preview controls */}
                <div className="w-full flex items-center justify-between text-xs text-slate-600 border-t border-pink-200/80 pt-3">
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className="flex items-center gap-1.5 rounded-xl border border-pink-200 bg-white/90 px-3 py-1 font-bold text-slate-700 hover:bg-white hover:text-pink-600 transition shadow-sm cursor-pointer"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    {autoRotate ? t("modal_autorotate_off") : t("modal_autorotate_on")}
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    {getProductTypeName(previewType)} • {getStyleName(previewStyle)} ({previewSize})
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: CONFIGURATOR & CART */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white/60">
                <div className="space-y-6">
                  {/* 1. CONFIGURATOR BOX */}
                  <div className="rounded-2xl border-2 border-pink-200/80 bg-white/80 p-4 sm:p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                        <span>
                          {editingItemId ? t("cfg_edit_title") : t("cfg_title")}
                        </span>
                      </h4>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => setEditingItemId(null)}
                          className="text-[11px] font-bold text-slate-500 hover:text-pink-600 underline cursor-pointer"
                        >
                          {t("cfg_cancel_edit")}
                        </button>
                      )}
                    </div>

                    {/* Step 1: Choose Product Type */}
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-600 mb-1.5 block">
                        {t("cfg_step_1")}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {productTypesList.map((tItem) => {
                          const isSelected = currentType === tItem.id;
                          return (
                            <button
                              key={tItem.id}
                              type="button"
                              onClick={() => handleSelectProductType(tItem.id)}
                              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition duration-200 cursor-pointer ${
                                isSelected
                                  ? "border-2 border-pink-500 bg-pink-50/90 text-[#1E1035] shadow-md shadow-pink-200/40"
                                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-pink-300 hover:bg-white"
                              }`}
                            >
                              <span className="text-xs font-black text-[#1E1035]">{getProductTypeName(tItem.id)}</span>
                              <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {getProductTypeTagline(tItem.id)}
                              </span>
                              <span className="mt-1 text-[11px] font-black text-pink-600">
                                {t("from_price")} {formatPrice(tItem.basePrice)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Choose Cutout / Style Type */}
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-600 mb-1.5 block">
                        {language === "th"
                          ? "2. เลือกรูปแบบดีไซน์:"
                          : language === "en"
                          ? "2. Choose Design / Cutout Style:"
                          : "2. Chọn kiểu dáng thiết kế:"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRODUCT_PRICING[currentType].availableStyles.map((sKey) => {
                          const isSelected = currentStyle === sKey;
                          const meta = STYLE_DEFINITIONS[sKey];
                          const sTitle = language === "th" ? meta.labelTh : language === "en" ? meta.labelEn : meta.labelVi;
                          return (
                            <button
                              key={sKey}
                              type="button"
                              onClick={() => handleSelectStyle(sKey)}
                              className={`p-2.5 rounded-xl border text-left transition cursor-pointer relative ${
                                isSelected
                                  ? "border-2 border-purple-500 bg-purple-50/90 text-[#1E1035] shadow-sm shadow-purple-200/40"
                                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-purple-300 hover:bg-white"
                              }`}
                            >
                              {meta.badge && (
                                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black rounded-full shadow-xs">
                                  {meta.badge}
                                </span>
                              )}
                              <div className="text-xs font-black text-[#1E1035]">{sTitle}</div>
                              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {meta.descriptionVi}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 3: Choose Size & Price */}
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-600 mb-1.5 block">
                        {language === "th"
                          ? "3. Chọn kích thước & Giá in:"
                          : language === "en"
                          ? "3. Choose Size & Print Price:"
                          : "3. Chọn kích thước & Báo giá:"}
                      </label>
                      <div className={`grid gap-2 ${availableSizes.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
                        {availableSizes.map((s) => {
                          const isSelected = currentSize === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setCurrentSize(s.id)}
                              className={`p-2.5 rounded-xl border text-center transition duration-200 cursor-pointer ${
                                isSelected
                                  ? "border-2 border-pink-500 bg-pink-50/90 text-[#1E1035] shadow-md shadow-pink-200/40"
                                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-pink-300 hover:bg-white"
                              }`}
                            >
                              <div className="text-xs font-black text-[#1E1035]">{s.label}</div>
                              <div className="text-xs font-black text-pink-600 font-mono mt-0.5">
                                {formatPrice(s.price)}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 4: Upload or Pick Image */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-black uppercase text-slate-600">
                          {t("cfg_step_3")}
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="h-3 w-3" /> {t("cfg_upload_btn")}
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {samplePresets.map((preset) => {
                          const isSelected = currentImage === preset.url;
                          const displayName =
                            preset.presetKey && (t as any)(preset.presetKey)
                              ? t(preset.presetKey)
                              : preset.name;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setCurrentImage(preset.url);
                                setCurrentImageName(preset.name);
                              }}
                              className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl border p-1.5 transition cursor-pointer ${
                                isSelected
                                  ? "border-2 border-pink-500 bg-pink-50 text-[#1E1035] shadow-sm"
                                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-pink-300"
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={displayName}
                                className="h-6 w-6 rounded-lg object-cover"
                              />
                              <span className="text-[11px] font-bold pr-1">{displayName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Promotion perk notice */}
                    <div className="rounded-xl bg-amber-50/90 border border-amber-200 p-2.5 flex items-start gap-2">
                      <Gift className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold text-amber-800 leading-snug">
                        {getProductPromoHint(currentType)}
                      </p>
                    </div>

                    {/* Quantity & Add to Cart button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600">{t("cfg_qty")}</span>
                        <div className="flex items-center rounded-xl border border-pink-200 bg-white shadow-sm">
                          <button
                            type="button"
                            onClick={() => setCurrentQty(Math.max(1, currentQty - 1))}
                            className="px-2.5 py-1 text-slate-600 hover:text-pink-600 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 text-xs font-black text-[#1E1035] min-w-[24px] text-center">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentQty(currentQty + 1)}
                            className="px-2.5 py-1 text-slate-600 hover:text-pink-600 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-black text-pink-600 font-mono ml-1">
                          = {formatPrice(currentItemPricing.subtotal)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddOrUpdateItem}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-pink-300/40 hover:brightness-110 transition active:scale-95 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[3]" />
                        <span>
                          {editingItemId ? t("cfg_update_btn") : t("cfg_add_btn")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 2. MULTI-ITEM CART LIST */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>
                          {t("cart_heading")} ({cartItems.length} {t("form_summary_lines")})
                        </span>
                      </label>
                      <span className="text-[11px] font-bold text-pink-600">
                        {totals.promotion.isFreeShipping
                          ? "🚚 Freeship toàn quốc"
                          : "Freeship đơn từ 30c hoặc >600k"}
                      </span>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/40 p-5 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-500 mb-2">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-[#1E1035]">{t("cart_empty_title")}</p>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                          {t("cart_empty_desc")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {cartItems.map((item, index) => {
                          const isCurrentlyActiveIn3D = activePreviewIndex === index;
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition ${
                                isCurrentlyActiveIn3D
                                  ? "border-2 border-pink-400 bg-pink-50/60 shadow-sm"
                                  : "border-pink-200/70 bg-white/90 hover:border-pink-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                                  <img
                                    src={item.imagePreview}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                  />
                                  {isCurrentlyActiveIn3D && (
                                    <span className="absolute bottom-0 inset-x-0 bg-pink-600 text-[8px] font-black text-white text-center py-0.5">
                                      {t("cart_viewing_3d")}
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <h5 className="text-xs font-black text-[#1E1035] truncate leading-tight">
                                    {item.productName}
                                    {item.styleLabel && (
                                      <span className="ml-1.5 inline-block px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-pink-100 text-pink-700">
                                        {item.styleLabel}
                                      </span>
                                    )}
                                  </h5>
                                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                                    Size: <span className="text-pink-600">{item.sizeValue}</span> •{" "}
                                    <span className="text-purple-700">{formatPrice(item.unitPrice)}/{t("item_unit")}</span>
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <button
                                      type="button"
                                      onClick={() => setActivePreviewIndex(index)}
                                      className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 cursor-pointer"
                                    >
                                      <Eye className="h-3 w-3" /> {t("cart_view_3d")}
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        replacingItemIdRef.current = item.id;
                                        replaceItemFileInputRef.current?.click();
                                      }}
                                      className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 cursor-pointer"
                                    >
                                      <ImageIcon className="h-3 w-3" /> {t("cart_change_photo")}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateItemQty(item.id, -1)}
                                    className="px-2 py-0.5 text-xs text-slate-600 hover:text-pink-600 font-bold cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 py-0.5 text-xs font-black text-[#1E1035] min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateItemQty(item.id, 1)}
                                    className="px-2 py-0.5 text-xs text-slate-600 hover:text-pink-600 font-bold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>

                                <span className="text-xs font-black text-slate-800 font-mono w-16 text-right">
                                  {formatPrice(item.subtotal)}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                  title={t("cart_delete_title")}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Applied promotions banner in cart */}
                    {totals.promotion.promotionNotes.length > 0 && (
                      <div className="rounded-xl border border-pink-200 bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 p-2.5 space-y-1">
                        {totals.promotion.promotionNotes.map((note, nIdx) => (
                          <div key={nIdx} className="flex items-center gap-1.5 text-[11px] font-black text-pink-700">
                            <Gift className="h-3.5 w-3.5 text-pink-600 flex-shrink-0" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. CUSTOMER CHECKOUT INFORMATION FORM */}
                  <form onSubmit={handleSubmitOrder} className="space-y-3.5 pt-3 border-t border-pink-200/80">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        {t("form_heading")}
                      </label>
                      <span className="text-[10px] font-bold text-pink-600 font-mono">
                        {`${t("form_code_prefix")}: ${customerCountry === "VN" ? "MC-XXXX" : "TL-XXXX"}`}
                      </span>
                    </div>

                    {/* Choose Delivery Country */}
                    <div>
                      <div className="text-[11px] font-black uppercase text-slate-600 mb-1.5 flex items-center justify-between">
                        <span>{t("form_country")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomerCountry("VN")}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition cursor-pointer ${
                            customerCountry === "VN"
                              ? "border-2 border-pink-500 bg-pink-50/90 text-[#1E1035] shadow-sm shadow-pink-200/50"
                              : "border-slate-200 bg-white/90 text-slate-600 hover:border-pink-300"
                          }`}
                        >
                          <span className="text-base">🇻🇳</span>
                          <span>{t("form_country_vn")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomerCountry("TH")}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition cursor-pointer ${
                            customerCountry === "TH"
                              ? "border-2 border-purple-500 bg-purple-50/90 text-[#1E1035] shadow-sm shadow-purple-200/50"
                              : "border-slate-200 bg-white/90 text-slate-600 hover:border-purple-300"
                          }`}
                        >
                          <span className="text-base">🇹🇭</span>
                          <span>{t("form_country_th")}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder={t("form_name")}
                          className="w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-bold text-[#1E1035] placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder={customerCountry === "TH" ? t("form_phone_th") : t("form_phone_vn")}
                          className="w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-bold text-[#1E1035] placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder={t("form_address")}
                        className="w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-bold text-[#1E1035] placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        placeholder={t("form_note")}
                        className="w-full rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-bold text-[#1E1035] placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none shadow-xs"
                      />
                    </div>

                    {/* Summary & Submit Button */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-pink-200/80">
                      <div>
                        <div className="text-[11px] font-bold text-slate-500">
                          {t("form_summary_items")} {totals.totalItems} {t("form_summary_lines")} ({totals.totalQuantity} {t("form_summary_pcs")}) •{" "}
                          <span className="text-emerald-600 font-black">
                            {totals.promotion.isFreeShipping ? "Freeship" : "Ship 25k"}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 font-mono">
                          {formatPrice(totals.totalPrice)}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || cartItems.length === 0}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-6 sm:px-8 py-3.5 text-sm sm:text-base font-black text-white shadow-lg shadow-pink-300/50 hover:brightness-110 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <RotateCw className="h-4 w-4 animate-spin text-white" />
                            <span>{t("form_submitting")}</span>
                          </>
                        ) : cartItems.length === 0 ? (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            <span>{t("form_submit_empty")}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            <span>{t("form_submit_btn", { qty: totals.totalQuantity })}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
