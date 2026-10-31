/**
 * ==============================================================================
 * LADA GIFT - GOOGLE APPS SCRIPT WEB APP API
 * ==============================================================================
 * Hệ thống tự động tiếp nhận đơn hàng:
 * 1. Nhận thông tin khách hàng & nhiều sản phẩm từ Landing Page
 * 2. Tự động tạo thư mục trên Google Drive theo cấu trúc: LADA_GIFT_ORDERS / YYYY / MM / LADA-YYYYMMDD-XXX
 * 3. Tải và lưu ảnh gốc của từng sản phẩm vào đúng thư mục đơn hàng
 * 4. Tự động ghi dữ liệu vào 3 Sheet: ORDERS, ORDER_ITEMS, CONFIG
 * 5. Trả kết quả JSON về cho Frontend
 * ==============================================================================
 */

// Tên thư mục gốc lưu ảnh trên Google Drive
const ROOT_FOLDER_NAME = "LADA_GIFT_ORDERS";

/**
 * Xử lý yêu cầu POST từ Next.js / Frontend
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Khóa tối đa 30 giây để xử lý tuần tự, chống xung đột ghi dữ liệu cùng lúc
  try {
    lock.waitLock(30000);
  } catch (lockError) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Hệ thống đang bận xử lý đơn hàng khác, vui lòng thử lại sau vài giây!",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: "Dữ liệu gửi lên không hợp lệ!",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const payload = JSON.parse(e.postData.contents);
    const customer = payload.customer || {};
    const items = payload.items || [];
    const orderId = payload.orderId || ("LADA-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-") + Math.floor(100 + Math.random() * 900));
    const createdAt = payload.createdAt || new Date().toISOString();

    if (!customer.customerName || !customer.phone) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: "Thiếu thông tin bắt buộc (họ tên, số điện thoại)!",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (!items || items.length === 0) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: "Đơn hàng không có sản phẩm nào!",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Quản lý thư mục Google Drive: LADA_GIFT_ORDERS / YYYY / MM / orderId
    const now = new Date();
    const yearStr = Utilities.formatDate(now, "GMT+7", "yyyy");
    const monthStr = Utilities.formatDate(now, "GMT+7", "MM");

    const rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), ROOT_FOLDER_NAME);
    const yearFolder = getOrCreateFolder(rootFolder, yearStr);
    const monthFolder = getOrCreateFolder(yearFolder, monthStr);
    const orderFolder = getOrCreateFolder(monthFolder, orderId);

    // 2. Tự động khởi tạo và chuẩn bị 3 Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfNotExist(ss);

    const ordersSheet = ss.getSheetByName("ORDERS");
    const orderItemsSheet = ss.getSheetByName("ORDER_ITEMS");

    // 3. Xử lý lưu từng ảnh vào Drive & ghi nhận từng Item
    let totalItems = items.length;
    let totalQuantity = 0;
    let computedTotalPrice = 0;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const qty = parseInt(it.quantity, 10) || 1;
      const unitPrice = parseInt(it.unitPrice, 10) || 35000;
      const subtotal = unitPrice * qty;

      totalQuantity += qty;
      computedTotalPrice += subtotal;

      let fileId = "";
      let fileUrl = "";
      let fileName = it.imageName || ("item_" + (i + 1) + "_original.png");

      // Nếu có dữ liệu base64 ảnh thì lưu vào Drive
      if (it.imageBase64 && it.imageBase64.includes("base64,")) {
        try {
          const parts = it.imageBase64.split("base64,");
          const mimeMatch = parts[0].match(/:(.*?);/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
          const base64Data = parts[1];
          const decodedBytes = Utilities.base64Decode(base64Data);
          const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);

          const savedFile = orderFolder.createFile(blob);
          fileId = savedFile.getId();
          fileUrl = savedFile.getUrl();
        } catch (saveImgErr) {
          fileUrl = "Lỗi lưu file: " + saveImgErr.toString();
        }
      } else if (it.imageBase64 && it.imageBase64.startsWith("http")) {
        fileUrl = it.imageBase64;
      }

      // Ghi vào Sheet ORDER_ITEMS
      // [item_id, order_id, product_type, product_name, size, quantity, unit_price, subtotal, image_name, image_file_id, image_url, created_at]
      orderItemsSheet.appendRow([
        it.itemId || ("item-" + (i + 1)),
        orderId,
        it.productType || "keychain",
        it.productName || "Móc khóa mica",
        it.size || "L",
        qty,
        unitPrice,
        subtotal,
        fileName,
        fileId,
        fileUrl,
        createdAt,
      ]);
    }

    // 4. Ghi thông tin chung vào Sheet ORDERS
    // [order_id, created_at, customer_name, phone, address, note, total_items, total_quantity, total_price, status]
    ordersSheet.appendRow([
      orderId,
      createdAt,
      customer.customerName,
      customer.phone,
      customer.address || "",
      customer.note || "",
      totalItems,
      totalQuantity,
      computedTotalPrice,
      "PENDING",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        orderId: orderId,
        message: "Đặt hàng LADA GIFT thành công!",
        totalPrice: computedTotalPrice,
        driveFolderUrl: orderFolder.getUrl(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Lỗi xử lý: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Xử lý GET test kiểm tra kết nối API
 */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ONLINE",
      app: "LADA GIFT Order Management Web App",
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Tìm hoặc tạo thư mục trên Google Drive
 */
function getOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(folderName);
}

/**
 * Tự động tạo cấu trúc 3 Sheet nếu chưa tồn tại
 */
function setupSheetsIfNotExist(ss) {
  // 1. Sheet ORDERS
  let ordersSheet = ss.getSheetByName("ORDERS");
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet("ORDERS");
    ordersSheet.appendRow([
      "order_id",
      "created_at",
      "customer_name",
      "phone",
      "address",
      "note",
      "total_items",
      "total_quantity",
      "total_price",
      "status",
    ]);
    ordersSheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#FCE7F3");
  }

  // 2. Sheet ORDER_ITEMS
  let itemsSheet = ss.getSheetByName("ORDER_ITEMS");
  if (!itemsSheet) {
    itemsSheet = ss.insertSheet("ORDER_ITEMS");
    itemsSheet.appendRow([
      "item_id",
      "order_id",
      "product_type",
      "product_name",
      "size",
      "quantity",
      "unit_price",
      "subtotal",
      "image_name",
      "image_file_id",
      "image_url",
      "created_at",
    ]);
    itemsSheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#EDE9FE");
  }

  // 3. Sheet CONFIG
  let configSheet = ss.getSheetByName("CONFIG");
  if (!configSheet) {
    configSheet = ss.insertSheet("CONFIG");
    configSheet.appendRow(["config_key", "config_value", "description"]);
    configSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#E0F2FE");

    // Dữ liệu mẫu cấu hình
    configSheet.appendRow(["STORE_NAME", "LADA GIFT - Gift From The Heart", "Tên cửa hàng"]);
    configSheet.appendRow(["PRICE_KEYCHAIN", "35000", "Giá cơ bản Móc khóa mica (Size S)"]);
    configSheet.appendRow(["PRICE_MAGNET", "25000", "Giá cơ bản Nam châm in hình (Size S)"]);
    configSheet.appendRow(["PRICE_MICA_MAGNET", "45000", "Giá cơ bản Mica nam châm (Size S)"]);
    configSheet.appendRow(["SURCHARGE_SIZE_L", "10000", "Phụ thu kích thước L (10cm)"]);
    configSheet.appendRow(["SURCHARGE_SIZE_XL", "30000", "Phụ thu kích thước XL (15cm)"]);
    configSheet.appendRow(["FREE_SHIPPING_MIN_QTY", "2", "Số lượng tối thiểu được freeship"]);
    configSheet.appendRow(["MAX_FILE_SIZE_MB", "15", "Dung lượng ảnh tối đa (MB)"]);
  }
}
