"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
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
  SIZE_CONFIGS,
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

const productTypesList = [
  {
    id: "keychain" as const,
    name: "Móc khóa mica",
    tagline: "Khoen kim loại treo chìa khóa",
    basePrice: 35000,
  },
  {
    id: "magnet" as const,
    name: "Nam châm in hình",
    tagline: "Dán tủ lạnh, bảng từ, case PC",
    basePrice: 25000,
  },
  {
    id: "mica-magnet" as const,
    name: "Mica nam châm",
    tagline: "Vát CNC kim cương + nam châm",
    basePrice: 45000,
  },
];

const sizeOptionsList = [
  { id: "S" as const, label: "Size S (7.5 cm)", dimension: "7.5 cm", priceOffset: 0 },
  { id: "L" as const, label: "Size L (10 cm)", dimension: "10 cm", priceOffset: 10000 },
  { id: "XL" as const, label: "Size XL (15 cm)", dimension: "15 cm", priceOffset: 30000 },
];

export default function DesignCustomizerModal({
  isOpen,
  onClose,
  initialProductType = "keychain",
  initialSize = "L",
  onAddToCart,
}: DesignCustomizerModalProps) {
  // Current active editor configuration
  const [currentType, setCurrentType] = useState<"keychain" | "magnet" | "mica-magnet">(
    initialProductType
  );
  const [currentSize, setCurrentSize] = useState<"S" | "L" | "XL">(initialSize);
  const [currentImage, setCurrentImage] = useState<string>(samplePresets[0].url);
  const [currentImageName, setCurrentImageName] = useState<string>("lada-gift-logo.jpg");
  const [currentQty, setCurrentQty] = useState(1);

  // Editing existing item ID (if editing an existing item from cart)
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const { t, language } = useLanguage();

  const getProductTypeName = (type: "keychain" | "magnet" | "mica-magnet") => {
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

  const getProductTypeTagline = (type: "keychain" | "magnet" | "mica-magnet") => {
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

  // Mỗi khi loading lại trang web: Xóa sạch thông tin cũ trong giỏ hàng và biểu mẫu (bắt đầu giỏ hàng trống 0 sản phẩm)
  useEffect(() => {
    clearCartStorage();
    setCartItems([]);
    setActivePreviewIndex(0);

    // Xóa sạch thông tin khách hàng cũ
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerNote("");
  }, [initialProductType, initialSize]);

  // Synchronize cart changes to LocalStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems]);

  // Handle incoming props changes
  useEffect(() => {
    if (initialProductType) setCurrentType(initialProductType);
    if (initialSize) setCurrentSize(initialSize);
  }, [initialProductType, initialSize]);

  // 3D Preview calculations based on active item
  const activeItem: CartItem | undefined =
    cartItems[activePreviewIndex] || cartItems[0];
  const previewType = activeItem ? activeItem.productType : currentType;
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
      // Validate file size (max 20MB)
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

  // Handle replacing image for a specific existing item in cart
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
    const { unitPrice, subtotal } = calculateItemPrice(
      currentType,
      currentSize,
      currentQty
    );
    const prodName = getProductTypeName(currentType);
    const sizeDim = SIZE_CONFIGS[currentSize]?.dimension || "10 cm";

    if (editingItemId) {
      // Update existing item
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === editingItemId
            ? {
                ...it,
                productType: currentType,
                productName: prodName,
                size: currentSize,
                sizeValue: sizeDim,
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
      // Create new item
      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productType: currentType,
        productName: prodName,
        size: currentSize,
        sizeValue: sizeDim,
        quantity: currentQty,
        imagePreview: currentImage,
        imageName: currentImageName,
        unitPrice,
        subtotal,
      };
      setCartItems((prev) => [...prev, newItem]);
      setActivePreviewIndex(cartItems.length); // point preview to new item
    }

    // Reset current quantity to 1 for the next item
    setCurrentQty(1);
  };

  // Modify quantity of a cart item
  const handleUpdateItemQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newQty = Math.max(1, it.quantity + delta);
          return {
            ...it,
            quantity: newQty,
            subtotal: it.unitPrice * newQty,
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
    setCurrentType(item.productType);
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
        // Trigger celebratory confetti
        fireHologramConfetti();

        // Clear local storage cart
        clearCartStorage();

        // Save order success data
        setOrderSuccessData({
          orderId: result.orderId,
          totalPrice: result.totalPrice || totals.totalPrice,
          items: [...cartItems],
        });

        // Clear current items state
        setCartItems([]);

        // Notify parent if listener exists
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

        {/* Modal Window - THEME ĐỒNG BỘ NỀN PASTEL HOLOGRAM CỦA LADA GIFT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="relative z-10 w-full max-w-6xl rounded-3xl border-2 border-white/90 bg-gradient-to-br from-white/95 via-pink-50/90 to-sky-50/95 shadow-[0_25px_70px_rgba(244,114,182,0.35)] backdrop-blur-2xl text-[#1E1035] overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-pink-200/80 px-6 py-4 bg-white/70">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-pink-300 shadow-md flex-shrink-0">
                <img
                  src="/lada-gift-logo.jpg"
                  alt="LADA GIFT Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1E1035] flex items-center gap-2">
                  <span>{t("modal_title")}</span>
                  <span className="hidden sm:inline-block rounded-full bg-pink-100 border border-pink-300 px-2.5 py-0.5 text-[10px] font-black uppercase text-pink-700">
                    {t("modal_badge")}
                  </span>
                </h3>
                <p className="text-[11px] font-semibold text-slate-500">
                  {t("modal_sub")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-pink-200 text-slate-500 hover:text-pink-600 hover:bg-white hover:border-pink-300 transition shadow-sm cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Hidden file input for replacing an existing cart item's image */}
          <input
            ref={replaceItemFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReplaceItemFile}
            className="hidden"
          />

          {/* MAIN MODAL CONTENT */}
          {orderSuccessData ? (
            /* ================================================================= */
            /* SUCCESS CONFIRMATION VIEW                                         */
            /* ================================================================= */
            <div className="p-6 sm:p-10 text-center max-h-[80vh] overflow-y-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-sky-500 shadow-xl shadow-pink-300/50"
              >
                <Check className="h-10 w-10 text-white stroke-[3]" />
              </motion.div>

              <h4 className="mt-5 text-2xl sm:text-3xl font-black text-[#180D2B]">
                {t("success_title")}
              </h4>
              <p className="mx-auto mt-2 max-w-lg text-sm font-semibold text-slate-600 leading-relaxed">
                {t("success_desc")}
              </p>

              {/* Order Info Summary Card */}
              <div className="mx-auto mt-6 max-w-xl rounded-2xl border-2 border-pink-200/90 bg-white/90 p-5 text-left shadow-lg shadow-pink-100/50">
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">{t("success_order_id")}:</span>
                    <div className="text-base font-black text-pink-600 font-mono tracking-wider">
                      {orderSuccessData.orderId}
                    </div>
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

                {/* Items in completed order */}
                <div className="py-3 divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {orderSuccessData.items.map((item, idx) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.imagePreview}
                          alt="Item preview"
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-black text-[#1E1035] truncate">{item.productName}</p>
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

                {/* Total Payment */}
                <div className="flex items-center justify-between pt-3 border-t border-pink-100">
                  <span className="text-xs font-black text-slate-700 uppercase">{t("success_total")}:</span>
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 font-mono">
                    {formatPrice(orderSuccessData.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Actions */}
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
            /* ================================================================= */
            /* 2-COLUMN MULTI-PRODUCT STUDIO & CART INTERFACE                    */
            /* ================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
              {/* LEFT COLUMN: 3D HOLOGRAPHIC INTERACTIVE STAGE */}
              <div className="lg:col-span-5 bg-gradient-to-b from-pink-100/50 via-white/80 to-sky-100/50 p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-pink-200/70 relative select-none">
                {/* Dreamy Ambient Glow Aura */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,114,182,0.22),_transparent_70%)] pointer-events-none" />

                <div className="w-full flex items-center justify-between text-xs text-slate-600 z-10 font-bold">
                  <span className="flex items-center gap-1.5 text-pink-600">
                    <Layers className="h-3.5 w-3.5" /> {t("modal_3d_mockup")}
                  </span>
                  <span className="italic text-slate-500 text-[11px]">{t("modal_drag_rotate")}</span>
                </div>

                {/* 3D Acrylic Object Container */}
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
                    {/* Metal Ring & Keychain connector if keychain */}
                    {previewType === "keychain" && (
                      <div className="flex flex-col items-center -mb-2 z-20">
                        {/* Heart or round metal ring */}
                        <div className="h-10 w-10 rounded-full border-[3.5px] border-slate-300 shadow-md bg-gradient-to-tr from-slate-200 via-white to-slate-400 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" />
                        </div>
                        {/* Chain link */}
                        <div className="h-3.5 w-2 rounded-full border border-slate-300 bg-slate-200 -mt-1 shadow-sm" />
                      </div>
                    )}

                    {/* Acrylic Body Container */}
                    <div
                      className={`relative overflow-hidden rounded-2xl border-[3px] border-white/95 shadow-[0_20px_50px_rgba(244,114,182,0.35)] backdrop-blur-md transition-all duration-300 ${
                        previewSize === "S"
                          ? "w-44 h-56"
                          : previewSize === "L"
                          ? "w-52 h-64"
                          : "w-60 h-76"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)",
                      }}
                    >
                      {/* Customer Custom Image Layer */}
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full object-cover object-center"
                      />

                      {/* Mica Gloss Reflection Overlay */}
                      <div className="pointer-events-none absolute inset-0 opacity-45 mix-blend-color-dodge bg-gradient-to-tr from-cyan-400/30 via-purple-500/25 to-pink-500/30" />

                      {/* Moving light sweep shine */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-overlay"
                        style={{
                          background:
                            "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)",
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* Diamond CNC bevel edge highlight */}
                      <div className="pointer-events-none absolute inset-[3px] rounded-xl border border-white/70" />

                      {/* Magnet badge indicator if magnet type */}
                      {previewType !== "keychain" && (
                        <div className="absolute top-2 right-2 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-black tracking-wider text-pink-700 border border-pink-200 shadow-sm">
                          {previewType === "magnet" ? t("modal_badge_magnet") : t("modal_badge_mica_magnet")}
                        </div>
                      )}
                    </div>

                    {/* Acrylic 3D Thickness drop shadow simulation */}
                    <div className="mt-3 h-3 w-40 rounded-full bg-pink-400/25 blur-md" />
                  </motion.div>
                </div>

                {/* Bottom preview controls & status */}
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
                    {activeItem ? t("modal_viewing_from_cart") : t("modal_previewing_design")} {getProductTypeName(previewType)} ({previewSize})
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: MULTI-PRODUCT CART & CHECKOUT CONTROLS */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white/60">
                <div className="space-y-6">
                  {/* ========================================================= */}
                  {/* 1. PRODUCT CONFIGURATOR SECTION                           */}
                  {/* ========================================================= */}
                  <div className="rounded-2xl border-2 border-pink-200/80 bg-white/80 p-4 sm:p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                        <span>
                          {editingItemId
                            ? t("cfg_edit_title")
                            : t("cfg_title")}
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

                    {/* Choose Product Type */}
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
                              onClick={() => setCurrentType(tItem.id)}
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

                    {/* Choose Size */}
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-600 mb-1.5 block">
                        {t("cfg_step_2")}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {sizeOptionsList.map((s) => {
                          const isSelected = currentSize === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setCurrentSize(s.id)}
                              className={`p-2 rounded-xl border text-center transition duration-200 cursor-pointer ${
                                isSelected
                                  ? "border-2 border-purple-500 bg-purple-50/90 text-[#1E1035] shadow-md shadow-purple-200/40"
                                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-purple-300 hover:bg-white"
                              }`}
                            >
                              <div className="text-xs font-black text-[#1E1035]">{s.label}</div>
                              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                {s.priceOffset > 0 ? `+${formatPrice(s.priceOffset)}` : t("cfg_base_price")}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Upload or Pick Image */}
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

                      {/* Presets and Upload Preview */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {samplePresets.map((preset) => {
                          const isSelected = currentImage === preset.url;
                          const displayName = preset.presetKey && (t as any)(preset.presetKey) ? t(preset.presetKey) : preset.name;
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
                          = {formatPrice(calculateItemPrice(currentType, currentSize, currentQty).subtotal)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddOrUpdateItem}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-pink-300/40 hover:brightness-110 transition active:scale-95 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[3]" />
                        <span>
                          {editingItemId
                            ? t("cfg_update_btn")
                            : t("cfg_add_btn")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* 2. MULTI-ITEM CART LIST SECTION                           */}
                  {/* ========================================================= */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{t("cart_heading")} ({cartItems.length} {t("form_summary_lines")})</span>
                      </label>
                      <span className="text-[11px] font-bold text-pink-600">
                        {t("cart_freeship")}
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
                              {/* Left: Thumbnail & details */}
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
                                    {getProductTypeName(item.productType)}
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

                              {/* Right: Quantity, Subtotal, Delete */}
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {/* Quantity buttons */}
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
                  </div>

                  {/* ========================================================= */}
                  {/* 3. CUSTOMER CHECKOUT INFORMATION FORM                     */}
                  {/* ========================================================= */}
                  <form onSubmit={handleSubmitOrder} className="space-y-3.5 pt-3 border-t border-pink-200/80">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        {t("form_heading")}
                      </label>
                      <span className="text-[10px] font-bold text-pink-600 font-mono">
                        {`${t("form_code_prefix")}: ${customerCountry === "VN" ? "MC-XXXX" : "TL-XXXX"}`}
                      </span>
                    </div>

                    {/* Choose Delivery Country: Vietnam vs Thailand */}
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

                    {/* Summary row & Submit Button */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-pink-200/80">
                      <div>
                        <div className="text-[11px] font-bold text-slate-500">
                          {t("form_summary_items")} {totals.totalItems} {t("form_summary_lines")} ({totals.totalQuantity} {t("form_summary_pcs")}) •{" "}
                          <span className="text-emerald-600 font-black">{t("form_freeship_badge")}</span>:
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
