/**
 * Authoritative Order Pricing & Validation for LADA GIFT
 * Shared across client UI and server API route for absolute price security
 */

export interface ProductConfig {
  id: "keychain" | "magnet" | "mica-magnet";
  name: string;
  tagline: string;
  basePrice: number;
}

export interface SizeConfig {
  id: "S" | "L" | "XL";
  label: string;
  dimension: string;
  priceOffset: number;
  scale3d: number;
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  keychain: {
    id: "keychain",
    name: "Móc khóa mica",
    tagline: "Có khoen kim loại treo chìa khóa",
    basePrice: 35000,
  },
  magnet: {
    id: "magnet",
    name: "Nam châm in hình",
    tagline: "Dán tủ lạnh, bảng từ, case PC",
    basePrice: 25000,
  },
  "mica-magnet": {
    id: "mica-magnet",
    name: "Mica nam châm",
    tagline: "Mặt mica bóng vát cạnh CNC + nam châm",
    basePrice: 45000,
  },
};

export const SIZE_CONFIGS: Record<string, SizeConfig> = {
  S: {
    id: "S",
    label: "Size S (7.5 cm)",
    dimension: "7.5 cm",
    priceOffset: 0,
    scale3d: 0.82,
  },
  L: {
    id: "L",
    label: "Size L (10 cm)",
    dimension: "10 cm",
    priceOffset: 10000,
    scale3d: 1.0,
  },
  XL: {
    id: "XL",
    label: "Size XL (15 cm)",
    dimension: "15 cm",
    priceOffset: 30000,
    scale3d: 1.25,
  },
};

/**
 * Calculate single item unit price & subtotal
 */
export function calculateItemPrice(
  productType: "keychain" | "magnet" | "mica-magnet" | string,
  size: "S" | "L" | "XL" | string,
  quantity: number = 1
): { unitPrice: number; subtotal: number } {
  const base = PRODUCT_CONFIGS[productType]?.basePrice || 35000;
  const offset = SIZE_CONFIGS[size]?.priceOffset || 0;
  const unitPrice = base + offset;
  const validQty = Math.max(1, Math.floor(quantity || 1));
  return {
    unitPrice,
    subtotal: unitPrice * validQty,
  };
}

/**
 * Calculate full cart totals
 */
export function calculateCartTotals(
  items: Array<{
    productType: string;
    size: string;
    quantity: number;
  }>
): {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
} {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const it of items) {
    const { subtotal: itemSubtotal } = calculateItemPrice(
      it.productType,
      it.size,
      it.quantity
    );
    subtotal += itemSubtotal;
    totalQuantity += Math.max(1, Math.floor(it.quantity || 1));
  }

  // Free shipping policy (Freeship from 2 items or default 0)
  const shippingFee = totalQuantity >= 2 ? 0 : 0;
  const totalPrice = subtotal + shippingFee;

  return {
    totalItems: items.length,
    totalQuantity,
    subtotal,
    shippingFee,
    totalPrice,
  };
}

/**
 * Validate Vietnamese phone number
 * Format: 10 digits starting with 03, 05, 07, 08, 09
 */
export function isValidVietnamPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, "");
  const vnPhoneRegex = /^(0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(cleaned);
}
