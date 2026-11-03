/**
 * LADA GIFT Multi-Product Cart Storage & State Management
 * Supports LocalStorage + IndexedDB for robust image persistence across page reloads
 */

export type ProductTypeKey = "keychain" | "magnet" | "mica-magnet";
export type StyleTypeKey = "fullbody" | "face" | "original" | "square" | "rect";

export interface CartItem {
  id: string; // Unique item ID
  productType: ProductTypeKey;
  productName: string;
  styleType?: StyleTypeKey;
  styleLabel?: string; // e.g. "Toàn thân", "Khuôn mặt", "Nguyên ảnh", "Ảnh vuông", "Ảnh chữ nhật"
  size: "S" | "L" | "XL" | string;
  sizeValue: string; // e.g. "5x7.5 cm", "5x5 cm", "8x10 cm", "9x6.5 cm"
  quantity: number;
  imageFile?: File | null;
  imagePreview: string; // Data URL or preset image URL
  imageName: string;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrderInfo {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
}

export interface OrderItemPayload {
  itemId: string;
  productType: string;
  productName: string;
  styleType?: string;
  styleLabel?: string;
  size: string;
  sizeValue: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageName: string;
  imageBase64: string;
}

export interface OrderSubmissionPayload {
  orderId?: string;
  customer: CustomerOrderInfo;
  items: OrderItemPayload[];
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface OrderResult {
  success: boolean;
  orderId: string;
  message: string;
  totalPrice: number;
  driveFolderUrl?: string;
}

const STORAGE_KEY = "lada_gift_cart_v3";
const CUSTOMER_STORAGE_KEY = "lada_gift_customer_v3";

/**
 * Save cart items to SessionStorage (tự động xóa khi đóng tab hoặc tải lại)
 */
export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = items.map((item) => ({
      id: item.id,
      productType: item.productType,
      productName: item.productName,
      styleType: item.styleType,
      styleLabel: item.styleLabel,
      size: item.size,
      sizeValue: item.sizeValue,
      quantity: item.quantity,
      imagePreview: item.imagePreview,
      imageName: item.imageName,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn("Could not save cart to sessionStorage:", err);
  }
}

/**
 * Load cart items from Storage
 */
export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p) => ({
        ...p,
        quantity: Math.max(1, p.quantity || 1),
        subtotal: (p.unitPrice || 25000) * (p.quantity || 1),
      }));
    }
  } catch (err) {
    console.warn("Could not load cart from storage:", err);
  }
  return [];
}

/**
 * Clear cart storage (Xóa toàn bộ cả localStorage và sessionStorage)
 */
export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEY);
  } catch (err) {
    console.warn("Error clearing cart storage:", err);
  }
}

/**
 * Save customer info draft to localStorage
 */
export function saveCustomerDraft(info: CustomerOrderInfo): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(info));
  } catch (err) {
    console.warn("Error saving customer draft:", err);
  }
}

/**
 * Load customer info draft
 */
export function loadCustomerDraft(): CustomerOrderInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
  return null;
}
