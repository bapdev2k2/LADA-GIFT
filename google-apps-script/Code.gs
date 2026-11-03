/**
 * ==============================================================================
 * LADA GIFT - GOOGLE APPS SCRIPT WEB APP API (PHIÊN BẢN TỰ ĐỘNG PHÂN CHIA FOLDER DRIVE)
 * ==============================================================================
 * Spreadsheet liên kết: 
 * https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit
 * ID: 1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA
 *
 * TỰ ĐỘNG HÓA HOÀN TOÀN:
 * 1. Tự động cập nhật đúng chuẩn 12 cột tiêu đề cho sheet ORDERS & ORDER_ITEMS.
 * 2. Tự động tạo cây thư mục trên Google Drive:
 *    - Thư mục chính: LADA_GIFT_ORDERS / YYYY / MM / [Mã Đơn - Tên Khách]
 *    - Thư mục con phân loại: [Mã Đơn] - [Loại Ảnh / Kiểu Dáng] - [Size Ảnh]
 * 3. Tự động lưu ảnh vào đúng thư mục con phân loại.
 * 4. Đẩy LINK TRỰC TIẾP Google Drive về Google Sheet (Click vào là mở ngay, không bị lỗi #ERROR!).
 * ==============================================================================
 */

// ID Spreadsheet của bạn
const SPREADSHEET_ID = "1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA";

// Tên thư mục gốc lưu trữ toàn bộ đơn hàng trên Google Drive
const ROOT_FOLDER_NAME = "LADA_GIFT_ORDERS";

/**
 * Lấy đối tượng Spreadsheet
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (e) {
      Logger.log("Sử dụng getActiveSpreadsheet(): " + e.toString());
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Xử lý yêu cầu POST gửi đơn hàng từ Website
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
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
    const promotion = payload.promotion || {};
    const now = new Date();

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
          message: "Đơn hàng chưa có sản phẩm nào trong giỏ!",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const countryRaw = (payload.country || customer.country || "VN").toString().toUpperCase();
    const isThai = countryRaw === "TH" || countryRaw.includes("THAI") || countryRaw.includes("THÁI");
    const prefix = isThai ? "TL" : "MC";
    const countryName = isThai ? "Thái Lan" : "Việt Nam";

    const orderId =
      payload.orderId ||
      (prefix + "-" + Utilities.formatDate(now, "GMT+7", "yyyyMMdd-") + Math.floor(100 + Math.random() * 900));
    const createdAt = payload.createdAt || Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // 1. Tạo thư mục cấp đơn hàng: LADA_GIFT_ORDERS / YYYY / MM / [orderId - Khach]
    const yearStr = Utilities.formatDate(now, "GMT+7", "yyyy");
    const monthStr = Utilities.formatDate(now, "GMT+7", "MM");

    const rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), ROOT_FOLDER_NAME);
    const yearFolder = getOrCreateFolder(rootFolder, yearStr);
    const monthFolder = getOrCreateFolder(yearFolder, monthStr);

    const safeCustomerName = sanitizeFolderName(customer.customerName || "Khach");
    const orderFolderName = orderId + " - " + safeCustomerName;
    const orderFolder = getOrCreateFolder(monthFolder, orderFolderName);

    try {
      orderFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {}

    // 2. Mở Spreadsheet & đồng bộ chuẩn 12 cột tiêu đề
    const ss = getSpreadsheet();
    setupSheetsIfNotExist(ss);

    const ordersSheet = ss.getSheetByName("ORDERS");
    const orderItemsSheet = ss.getSheetByName("ORDER_ITEMS");

    let totalItems = items.length;
    let totalQuantity = 0;
    let computedTotalPrice = 0;

    // 3. Xử lý từng sản phẩm và lưu ảnh vào folder con: [Mã Đơn] - [Loại Ảnh] - [Size Ảnh]
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const qty = parseInt(it.quantity, 10) || 1;
      const unitPrice = parseInt(it.unitPrice, 10) || 25000;
      const subtotal = parseInt(it.subtotal, 10) || (unitPrice * qty);

      totalQuantity += qty;
      computedTotalPrice += subtotal;

      const prodName = it.productName || "Sản phẩm";
      const styleName = it.styleLabel || it.styleType || "Nguyên ảnh";
      const sizeStr = it.sizeValue || it.size || "Size chuẩn";

      // CẤU TRÚC THƯ MỤC CON: [Mã Đơn] - [Loại Ảnh] - [Size Ảnh]
      const subFolderName = orderId + " - " + sanitizeFolderName(styleName) + " - " + sanitizeFolderName(sizeStr);
      const categoryFolder = getOrCreateFolder(orderFolder, subFolderName);

      try {
        categoryFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (eSubShare) {}

      let fileId = "";
      let fileUrl = "";
      let fileName = it.imageName || ("anh_" + (i + 1) + ".jpg");

      if (it.imageBase64 && it.imageBase64.includes("base64,")) {
        try {
          const parts = it.imageBase64.split("base64,");
          const mimeMatch = parts[0].match(/:(.*?);/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
          const base64Data = parts[1];
          const decodedBytes = Utilities.base64Decode(base64Data);
          const ext = mimeType.includes("png") ? ".png" : ".jpg";
          
          if (!fileName.includes(".")) {
            fileName += ext;
          }

          const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
          const savedFile = categoryFolder.createFile(blob);

          try {
            savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          } catch (eFileShare) {}

          fileId = savedFile.getId();
          fileUrl = savedFile.getUrl();
        } catch (saveImgErr) {
          fileUrl = "Lỗi lưu file: " + saveImgErr.toString();
        }
      } else if (it.imageBase64 && it.imageBase64.startsWith("http")) {
        try {
          const fetchedResponse = UrlFetchApp.fetch(it.imageBase64, { muteHttpExceptions: true });
          if (fetchedResponse.getResponseCode() === 200) {
            const blob = fetchedResponse.getBlob().setName(fileName);
            const savedFile = categoryFolder.createFile(blob);
            try {
              savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            } catch (eFileShare2) {}
            fileId = savedFile.getId();
            fileUrl = savedFile.getUrl();
          } else {
            fileUrl = it.imageBase64;
          }
        } catch (fetchErr) {
          fileUrl = it.imageBase64;
        }
      }

      // Ghi dòng sản phẩm vào Sheet ORDER_ITEMS (URL trực tiếp, không dùng công thức dễ bị lỗi #ERROR!)
      orderItemsSheet.appendRow([
        it.itemId || ("item-" + (i + 1)),
        orderId,
        prodName,
        styleName,
        sizeStr,
        qty,
        unitPrice,
        subtotal,
        fileName,
        fileUrl || "Chưa có ảnh",
        categoryFolder.getUrl(),
        createdAt,
      ]);
    }

    // 4. Ghi thông tin chung vào Sheet ORDERS
    const promoNotes = (promotion.promotionNotes && promotion.promotionNotes.length > 0)
      ? promotion.promotionNotes.join(" | ")
      : "Không có";

    const customerAddress = (customer.address || "").includes(countryName)
      ? (customer.address || "")
      : ("[" + countryName + "] " + (customer.address || ""));

    const finalTotalPrice = payload.totalPrice || computedTotalPrice;

    // Ghi link Google Drive trực tiếp (Clickable URL)
    ordersSheet.appendRow([
      orderId,
      createdAt,
      customer.customerName,
      "'" + customer.phone,
      customerAddress,
      customer.note || "",
      totalItems,
      totalQuantity,
      finalTotalPrice,
      promoNotes,
      orderFolder.getUrl(), // Link Google Drive trực tiếp
      "CHỜ XỬ LÝ",
    ]);

    // 5. Trả phản hồi thành công
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        orderId: orderId,
        message: "Đặt hàng LADA GIFT thành công! Đã phân loại ảnh và lưu trữ vào Google Drive.",
        totalPrice: finalTotalPrice,
        driveFolderUrl: orderFolder.getUrl(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Lỗi xử lý đơn hàng trên Apps Script: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ONLINE",
      app: "LADA GIFT Order Management Web App",
      version: "2.1-DirectLinkDrive",
      spreadsheetId: SPREADSHEET_ID,
      timestamp: new Date().toISOString(),
      message: "API hoạt động hoàn hảo!",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(folderName);
}

function sanitizeFolderName(name) {
  if (!name) return "Folder";
  return name.toString().replace(/[\\/:*?"<>|]/g, "_").trim();
}

/**
 * Tự động đồng bộ chuẩn 12 cột tiêu đề cho cả sheet cũ và mới
 */
function setupSheetsIfNotExist(ss) {
  const ordersHeaders = [
    "Mã Đơn Hàng",
    "Thời Gian Đặt",
    "Tên Khách Hàng",
    "Số Điện Thoại",
    "Địa Chỉ Nhận Hàng",
    "Ghi Chú",
    "Số Mẫu Ảnh",
    "Tổng Số Lượng",
    "Tổng Tiền (VNĐ)",
    "Ưu Đãi / Quà Tặng",
    "Link Google Drive Đơn Hàng",
    "Trạng Thái",
  ];

  let ordersSheet = ss.getSheetByName("ORDERS");
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet("ORDERS");
  }
  ordersSheet.getRange(1, 1, 1, ordersHeaders.length).setValues([ordersHeaders]);
  ordersSheet.getRange(1, 1, 1, ordersHeaders.length)
    .setFontWeight("bold")
    .setBackground("#FCE7F3")
    .setFontColor("#1E1035");
  ordersSheet.setFrozenRows(1);

  const itemsHeaders = [
    "Mã Dòng",
    "Mã Đơn Hàng",
    "Loại Sản Phẩm",
    "Kiểu Dáng / Loại Ảnh",
    "Kích Thước",
    "Số Lượng",
    "Đơn Giá",
    "Thành Tiền",
    "Tên File Ảnh",
    "Link Ảnh Drive",
    "Link Thư Mục Phân Loại (Mã-Loại-Size)",
    "Thời Gian Tạo",
  ];

  let itemsSheet = ss.getSheetByName("ORDER_ITEMS");
  if (!itemsSheet) {
    itemsSheet = ss.insertSheet("ORDER_ITEMS");
  }
  itemsSheet.getRange(1, 1, 1, itemsHeaders.length).setValues([itemsHeaders]);
  itemsSheet.getRange(1, 1, 1, itemsHeaders.length)
    .setFontWeight("bold")
    .setBackground("#EDE9FE")
    .setFontColor("#1E1035");
  itemsSheet.setFrozenRows(1);
}
