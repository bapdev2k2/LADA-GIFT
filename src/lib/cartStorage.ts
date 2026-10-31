/**
 * LADA GIFT Multi-Product Cart Storage & State Management
 * Supports LocalStorage + IndexedDB for robust image persistence across page reloads
 */

export interface CartItem {
  id: string; // Unique item ID
  productType: "keychain" | "magnet" | "mica-magnet";
  productName: string;
  size: "S" | "L" | "XL";
  sizeValue: string; // e.g. "7.5 cm", "10 cm", "15 cm"
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

const STORAGE_KEY = "lada_gift_cart_v2";
const CUSTOMER_STORAGE_KEY = "lada_gift_customer_v2";

/**
 * Save cart items to LocalStorage
 */
export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    // Exclude raw File objects when serializing to JSON
    const serialized = items.map((item) => ({
      id: item.id,
      productType: item.productType,
      productName: item.productName,
      size: item.size,
      sizeValue: item.sizeValue,
      quantity: item.quantity,
      imagePreview: item.imagePreview,
      imageName: item.imageName,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn("Could not save cart to localStorage (might exceed quota):", err);
  }
}

/**
 * Load cart items from LocalStorage
 */
export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p) => ({
        ...p,
        quantity: Math.max(1, p.quantity || 1),
        subtotal: (p.unitPrice || 35000) * (p.quantity || 1),
      }));
    }
  } catch (err) {
    console.warn("Could not load cart from localStorage:", err);
  }
  return [];
}

/**
 * Clear cart storage
 */
export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
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
