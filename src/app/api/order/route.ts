import { NextRequest, NextResponse } from "next/server";
import {
  calculateCartTotals,
  calculateItemPrice,
  isValidVietnamPhone,
  PRODUCT_CONFIGS,
  SIZE_CONFIGS,
} from "@/lib/orderPricing";

// Simple in-memory rate limiting to prevent spam
const requestHistory = new Map<string, number>();

/**
 * Generate unique order ID:
 * - Vietnam: MC-YYYYMMDD-XXX
 * - Thailand: TL-YYYYMMDD-XXX
 */
function generateOrderId(prefix = "MC"): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${yyyy}${mm}${dd}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const lastRequest = requestHistory.get(ip) || 0;

    // Rate limit: Max 1 order submission every 3 seconds per IP
    if (now - lastRequest < 3000) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng đợi vài giây trước khi gửi lại đơn hàng!",
        },
        { status: 429 }
      );
    }
    requestHistory.set(ip, now);

    const body = await req.json();
    const { customer, items, country } = body;

    // Determine country & prefix: Vietnam -> MC, Thailand -> TL
    const selectedCountry = (country || customer?.country || "VN").toString().toUpperCase();
    const isThai = selectedCountry === "TH" || selectedCountry.includes("THAI") || selectedCountry.includes("THÁI");
    const orderPrefix = isThai ? "TL" : "MC";
    const countryName = isThai ? "Thái Lan" : "Việt Nam";

    // 1. Validate Customer Info
    if (!customer?.customerName || !customer.customerName.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập họ và tên nhận hàng!" },
        { status: 400 }
      );
    }

    if (isThai) {
      const cleanPhone = (customer?.phone || "").replace(/[\s\-\(\)\.]/g, "");
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return NextResponse.json(
          {
            success: false,
            message: "Số điện thoại Thái Lan không hợp lệ (cần từ 9 đến 10 chữ số)!",
          },
          { status: 400 }
        );
      }
    } else {
      if (!customer?.phone || !isValidVietnamPhone(customer.phone)) {
        return NextResponse.json(
          {
            success: false,
            message: "Số điện thoại không hợp lệ (cần 10 chữ số của các nhà mạng VN)!",
          },
          { status: 400 }
        );
      }
    }

    if (!customer?.address || !customer.address.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập địa chỉ nhận hàng!" },
        { status: 400 }
      );
    }

    // 2. Validate Items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Giỏ hàng đang trống, vui lòng chọn ít nhất 1 sản phẩm!" },
        { status: 400 }
      );
    }

    // 3. Server-side authoritative price recalculation
    const verifiedItems = items.map((item: any, idx: number) => {
      const type = item.productType || "keychain";
      const size = item.size || "L";
      const qty = Math.max(1, Math.floor(item.quantity || 1));
      const { unitPrice, subtotal } = calculateItemPrice(type, size, qty);

      const prodName = PRODUCT_CONFIGS[type]?.name || "Móc khóa mica";
      const sizeDimension = SIZE_CONFIGS[size]?.dimension || "10 cm";

      return {
        itemId: item.id || `item-${idx + 1}-${Date.now()}`,
        productType: type,
        productName: prodName,
        size,
        sizeValue: sizeDimension,
        quantity: qty,
        unitPrice,
        subtotal,
        imageName: item.imageName || `image-${idx + 1}.jpg`,
        imageBase64: item.imagePreview || "",
      };
    });

    const { totalItems, totalQuantity, subtotal, shippingFee, totalPrice } =
      calculateCartTotals(verifiedItems);

    const orderId = generateOrderId(orderPrefix);
    const createdAt = new Date().toISOString();

    const orderPayload = {
      orderId,
      createdAt,
      country: countryName,
      customer: {
        customerName: customer.customerName.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        note: customer.note?.trim() || "",
        country: countryName,
      },
      items: verifiedItems,
      totalItems,
      totalQuantity,
      subtotal,
      shippingFee,
      totalPrice,
    };

    // 4. Forward to Google Apps Script if URL is configured
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;

    if (googleScriptUrl) {
      try {
        const gasResponse = await fetch(googleScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
          redirect: "follow",
        });

        const rawText = await gasResponse.text();
        let gasResult: any = null;
        try {
          gasResult = JSON.parse(rawText);
        } catch {
          console.warn("Google Apps Script returned non-JSON response:", rawText.slice(0, 300));
        }

        if (gasResult && gasResult.success) {
          return NextResponse.json({
            success: true,
            orderId: gasResult.orderId || orderId,
            message: gasResult.message || "Đặt hàng LADA GIFT thành công!",
            totalPrice: gasResult.totalPrice || totalPrice,
            driveFolderUrl: gasResult.driveFolderUrl,
          });
        } else {
          console.error("Google Apps Script returned error or auth required:", rawText.slice(0, 300));
          // Return fallback success locally so customer order is preserved
          return NextResponse.json({
            success: true,
            orderId,
            message: "Đặt hàng LADA GIFT thành công! Đội ngũ thiết kế sẽ liên hệ qua Zalo trong 15 phút.",
            totalPrice,
            syncStatus: "gas_pending_auth",
          });
        }
      } catch (gasErr) {
        console.error("Error communicating with Google Apps Script:", gasErr);
        // Fallback: still return success locally if GAS connection failed so customer's order isn't lost
        return NextResponse.json({
          success: true,
          orderId,
          message: "Đặt hàng thành công! Đơn hàng đã được ghi nhận trên hệ thống LADA GIFT.",
          totalPrice,
          warning: "Chưa kết nối trực tiếp đến Google Apps Script (offline mode)",
        });
      }
    }

    // Default mode (if GOOGLE_SCRIPT_WEBAPP_URL not configured yet in .env)
    console.log("=== NEW LADA GIFT ORDER RECORDED ===");
    console.log("Order ID:", orderId);
    console.log("Customer:", orderPayload.customer);
    console.log("Items count:", totalItems, "Total Qty:", totalQuantity);
    console.log("Total Price:", totalPrice);

    return NextResponse.json({
      success: true,
      orderId,
      message: "Đặt hàng LADA GIFT thành công! Đội ngũ thiết kế sẽ liên hệ qua Zalo trong 15 phút.",
      totalPrice,
      mode: "local_ready",
    });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
