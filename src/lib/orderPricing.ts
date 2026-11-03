/**
 * Authoritative Order Pricing & Validation for LADA GIFT
 * Matches the official LADA GIFT Price Flyers
 */

export type ProductType = "keychain" | "magnet" | "mica-magnet";
export type StyleType = "fullbody" | "face" | "original" | "square" | "rect";
export type SizeKey = "S" | "L" | "XL";

export interface StyleOption {
  id: StyleType;
  labelVi: string;
  labelEn: string;
  labelTh: string;
  descriptionVi: string;
  badge?: string;
}

export interface SizeOptionDetail {
  id: SizeKey;
  label: string;
  dimension: string;
  price: number;
  scale3d: number;
}

export interface ProductPricingDefinition {
  id: ProductType;
  nameVi: string;
  nameEn: string;
  nameTh: string;
  taglineVi: string;
  defaultStyle: StyleType;
  minQuantity: number;
  availableStyles: StyleType[];
  // Map style -> list of size options with specific prices & dimensions
  styleSizes: Record<string, SizeOptionDetail[]>;
}

export const STYLE_DEFINITIONS: Record<StyleType, StyleOption> = {
  fullbody: {
    id: "fullbody",
    labelVi: "Toàn thân",
    labelEn: "Full-Body Cutout",
    labelTh: "ไดคัททั้งตัว",
    descriptionVi: "Tách nền theo dáng người hoặc thú cưng, vát cạnh mica bóng",
    badge: "Hot",
  },
  face: {
    id: "face",
    labelVi: "Khuôn mặt",
    labelEn: "Face Cutout",
    labelTh: "ไดคัทใบหน้า",
    descriptionVi: "Tách nền khuôn mặt ngộ nghĩnh, bo viền mica cao cấp",
    badge: "Cute",
  },
  original: {
    id: "original",
    labelVi: "Nguyên ảnh",
    labelEn: "Original Photo",
    labelTh: "ภาพถ่ายเดิม",
    descriptionVi: "Giữ nguyên nền ảnh gốc, in chuẩn sắc nét trên phôi mica",
  },
  square: {
    id: "square",
    labelVi: "Ảnh vuông (Bo tròn góc)",
    labelEn: "Square (Rounded corners)",
    labelTh: "สี่เหลี่ยมจัตุรัส (ขอบมน)",
    descriptionVi: "Khổ vuông 5x5 cm bo tròn 4 góc tinh tế",
  },
  rect: {
    id: "rect",
    labelVi: "Ảnh chữ nhật",
    labelEn: "Rectangle",
    labelTh: "สี่เหลี่ยมผืนผ้า",
    descriptionVi: "Khổ 9x6.5 cm lớn hơn, chuẩn tỉ lệ ảnh chụp điện thoại",
    badge: "Phổ biến",
  },
};

export const PRODUCT_PRICING: Record<ProductType, ProductPricingDefinition> = {
  "mica-magnet": {
    id: "mica-magnet",
    nameVi: "Ảnh mica nam châm",
    nameEn: "Diamond Mica Magnet",
    nameTh: "แม่เหล็กไมก้าตัดเพชร",
    taglineVi: "Mặt mica bóng vát CNC + nam châm hít tủ lạnh",
    defaultStyle: "face",
    minQuantity: 5,
    availableStyles: ["face", "fullbody", "original"],
    styleSizes: {
      face: [
        { id: "S", label: "Size S (5x5 cm)", dimension: "5x5 cm", price: 17000, scale3d: 0.8 },
        { id: "L", label: "Size L (8x8 cm)", dimension: "8x8 cm", price: 37000, scale3d: 1.0 },
        { id: "XL", label: "Size XL (10x10 cm)", dimension: "10x10 cm", price: 43000, scale3d: 1.25 },
      ],
      fullbody: [
        { id: "S", label: "Size S (5x7.5 cm)", dimension: "5x7.5 cm", price: 22000, scale3d: 0.8 },
        { id: "L", label: "Size L (8x10 cm)", dimension: "8x10 cm", price: 42000, scale3d: 1.0 },
        { id: "XL", label: "Size XL (10x15 cm)", dimension: "10x15 cm", price: 52000, scale3d: 1.25 },
      ],
      original: [
        { id: "S", label: "Size S (5x7.5 cm)", dimension: "5x7.5 cm", price: 17000, scale3d: 0.8 },
        { id: "L", label: "Size L (8x10 cm)", dimension: "8x10 cm", price: 37000, scale3d: 1.0 },
        { id: "XL", label: "Size XL (10x15 cm)", dimension: "10x15 cm", price: 43000, scale3d: 1.25 },
      ],
    },
  },
  keychain: {
    id: "keychain",
    nameVi: "Móc khóa mica",
    nameEn: "Acrylic Keychain",
    nameTh: "พวงกุญแจอะคริลิค",
    taglineVi: "Móc khóa mica trong suốt có khoen kim loại treo chìa khóa",
    defaultStyle: "face",
    minQuantity: 1,
    availableStyles: ["face", "fullbody", "original"],
    styleSizes: {
      face: [
        { id: "S", label: "Size chuẩn (5x5 cm)", dimension: "5x5 cm", price: 20000, scale3d: 0.85 },
      ],
      fullbody: [
        { id: "S", label: "Size chuẩn (5x7.5 cm)", dimension: "5x7.5 cm", price: 30000, scale3d: 1.0 },
      ],
      original: [
        { id: "S", label: "Size chuẩn (5x7.5 cm)", dimension: "5x7.5 cm", price: 25000, scale3d: 0.9 },
      ],
    },
  },
  magnet: {
    id: "magnet",
    nameVi: "Ảnh nam châm dẻo",
    nameEn: "Photo Magnet",
    nameTh: "แม่เหล็กติดตู้เย็น",
    taglineVi: "Nam châm 5 lớp dính chặt tủ lạnh, chống nước độ bền 10 năm",
    defaultStyle: "square",
    minQuantity: 1,
    availableStyles: ["square", "rect"],
    styleSizes: {
      square: [
        { id: "S", label: "Ảnh vuông (5x5 cm)", dimension: "5x5 cm", price: 25000, scale3d: 0.85 },
      ],
      rect: [
        { id: "L", label: "Ảnh chữ nhật (9x6.5 cm)", dimension: "9x6.5 cm", price: 25000, scale3d: 1.05 },
      ],
    },
  },
};

// Legacy backward-compatibility constants
export const PRODUCT_CONFIGS: Record<string, { id: ProductType; name: string; tagline: string; basePrice: number }> = {
  keychain: {
    id: "keychain",
    name: "Móc khóa mica",
    tagline: "Có khoen kim loại treo chìa khóa",
    basePrice: 20000,
  },
  magnet: {
    id: "magnet",
    name: "Ảnh nam châm",
    tagline: "Dán tủ lạnh, bảng từ, chống nước độ bền 10 năm",
    basePrice: 25000,
  },
  "mica-magnet": {
    id: "mica-magnet",
    name: "Mica nam châm",
    tagline: "Mặt mica bóng vát cạnh CNC + nam châm",
    basePrice: 17000,
  },
};

export const SIZE_CONFIGS: Record<string, { id: SizeKey; label: string; dimension: string; priceOffset: number; scale3d: number }> = {
  S: { id: "S", label: "Size S", dimension: "5x5 cm / 5x7.5 cm", priceOffset: 0, scale3d: 0.82 },
  L: { id: "L", label: "Size L", dimension: "8x8 cm / 8x10 cm", priceOffset: 20000, scale3d: 1.0 },
  XL: { id: "XL", label: "Size XL", dimension: "10x10 cm / 10x15 cm", priceOffset: 26000, scale3d: 1.25 },
};

/**
 * Get available sizes for a given product and style
 */
export function getSizeOptionsForProduct(productType: ProductType, style: StyleType): SizeOptionDetail[] {
  const prod = PRODUCT_PRICING[productType];
  if (!prod) return [];
  const sizes = prod.styleSizes[style];
  if (sizes && sizes.length > 0) return sizes;
  // fallback to first available style sizes
  const firstKey = prod.availableStyles[0];
  return prod.styleSizes[firstKey] || [];
}

/**
 * Calculate single item unit price & subtotal
 */
export function calculateItemPrice(
  productType: string,
  size: string,
  quantity: number = 1,
  style?: string
): { unitPrice: number; subtotal: number; sizeDimension: string } {
  const pType = (productType in PRODUCT_PRICING ? productType : "mica-magnet") as ProductType;
  const prod = PRODUCT_PRICING[pType];
  
  // Resolve valid style
  let validStyle = (style && prod.availableStyles.includes(style as StyleType))
    ? (style as StyleType)
    : prod.defaultStyle;

  const sizeList = prod.styleSizes[validStyle] || [];
  let foundSize = sizeList.find((s) => s.id === size);
  if (!foundSize && sizeList.length > 0) {
    foundSize = sizeList[0];
  }

  let unitPrice = foundSize ? foundSize.price : 25000;
  const validQty = Math.max(1, Math.floor(quantity || 1));
  let subtotal = unitPrice * validQty;

  // Combo discount for magnet (Ảnh nam châm)
  if (pType === "magnet") {
    if (validQty >= 50) {
      // 1.000.000 for 50 or 20.000/ea
      subtotal = validQty * 20000;
      unitPrice = 20000;
    } else if (validQty >= 30) {
      // 600.000 for 30 or 20.000/ea
      subtotal = validQty * 20000;
      unitPrice = 20000;
    } else if (validQty >= 15) {
      // 300.000 for 15 or 20.000/ea
      subtotal = validQty * 20000;
      unitPrice = 20000;
    } else if (validQty >= 6) {
      // 120.000 for 6 or 20.000/ea
      subtotal = validQty * 20000;
      unitPrice = 20000;
    }
  }

  return {
    unitPrice,
    subtotal,
    sizeDimension: foundSize?.dimension || "Chuẩn",
  };
}

/**
 * Calculate full cart totals, promotions, discounts and free gifts
 */
export interface CartPromotionSummary {
  freeKeychainCount: number;
  freeMagnetCount: number;
  discountAmount: number;
  isFreeShipping: boolean;
  promotionNotes: string[];
}

export function calculateCartTotals(
  items: Array<{
    productType: string;
    styleType?: string;
    size: string;
    quantity: number;
  }>
): {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalPrice: number;
  promotion: CartPromotionSummary;
} {
  let subtotal = 0;
  let totalQuantity = 0;
  let micaMagnetQty = 0;
  let keychainQty = 0;
  let magnetQty = 0;

  for (const it of items) {
    const qty = Math.max(1, Math.floor(it.quantity || 1));
    const { subtotal: itemSubtotal } = calculateItemPrice(
      it.productType,
      it.size,
      qty,
      it.styleType
    );
    subtotal += itemSubtotal;
    totalQuantity += qty;

    if (it.productType === "mica-magnet") micaMagnetQty += qty;
    else if (it.productType === "keychain") keychainQty += qty;
    else if (it.productType === "magnet") magnetQty += qty;
  }

  // Calculate promotions based on official flyers:
  let freeKeychainCount = 0;
  let freeMagnetCount = 0;
  let discountAmount = 0;
  let isFreeShipping = false;
  const promotionNotes: string[] = [];

  // 1. Mica nam châm promotions
  if (micaMagnetQty >= 50) {
    freeKeychainCount += 5;
    isFreeShipping = true;
    promotionNotes.push("Tặng 5 Móc Khóa mica ngẫu nhiên + Freeship");
  } else if (micaMagnetQty >= 30) {
    freeKeychainCount += 2;
    isFreeShipping = true;
    promotionNotes.push("Tặng 2 Móc Khóa mica ngẫu nhiên + Freeship");
  } else if (micaMagnetQty >= 15) {
    freeKeychainCount += 1;
    promotionNotes.push("Tặng 1 Móc Khóa mica ngẫu nhiên");
  }

  // 2. Móc khóa mica promotions
  if (keychainQty >= 50) {
    discountAmount += 60000;
    isFreeShipping = true;
    promotionNotes.push("Giảm 60.000đ móc khóa + Freeship");
  } else if (keychainQty >= 30) {
    discountAmount += 30000;
    isFreeShipping = true;
    promotionNotes.push("Giảm 30.000đ móc khóa + Freeship");
  } else if (keychainQty >= 15) {
    freeKeychainCount += 1;
    promotionNotes.push("Tặng 1 Móc Khóa ngẫu nhiên");
  }

  // 3. Ảnh nam châm combo promotions
  if (magnetQty >= 50) {
    freeMagnetCount += 4;
    isFreeShipping = true;
    promotionNotes.push("Tặng 4 ảnh nam châm + Freeship");
  } else if (magnetQty >= 30) {
    freeMagnetCount += 2;
    isFreeShipping = true;
    promotionNotes.push("Tặng 2 ảnh nam châm + Freeship");
  } else if (magnetQty >= 15) {
    freeMagnetCount += 1;
    promotionNotes.push("Tặng 1 ảnh nam châm");
  } else if (magnetQty >= 6) {
    promotionNotes.push("Áp dụng giá Combo tiết kiệm 30.000đ");
  }

  // General Free Shipping rule: đơn hàng > 600.000 VND
  if (subtotal >= 600000) {
    isFreeShipping = true;
  }

  const shippingFee = isFreeShipping || totalQuantity === 0 ? 0 : 25000;
  const totalPrice = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    totalItems: items.length,
    totalQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    totalPrice,
    promotion: {
      freeKeychainCount,
      freeMagnetCount,
      discountAmount,
      isFreeShipping,
      promotionNotes,
    },
  };
}

/**
 * Validate Vietnamese phone number
 */
export function isValidVietnamPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, "");
  const vnPhoneRegex = /^(0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(cleaned);
}
