/**
 * ==============================================================================
 * LADA GIFT - GOOGLE APPS SCRIPT WEB APP API (PHIÊN BẢN TỰ ĐỘNG PHÂN CHIA FOLDER DRIVE)
 * ==============================================================================
 * Spreadsheet liên kết: 
 * https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit
 * ID: 1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA
 *
 * QUY TRÌNH TỰ ĐỘNG HÓA:
 * 1. Nhận thông tin đơn hàng & toàn bộ ảnh tải lên từ Website LADA GIFT.
 * 2. Tự động tạo thư mục gốc: LADA_GIFT_ORDERS / [Năm] / [Tháng] / [Mã Đơn].
 * 3. TỰ ĐỘNG PHÂN CHIA THƯ MỤC CON THEO QUY TẮC:
 *    [Mã Đơn] - [Loại Ảnh / Kiểu Dáng] - [Size Ảnh]
 *    (Ví dụ: MC-20261103-888 - Toàn thân - Size S (5x7.5cm))
 * 4. Tự động giải mã & đẩy ảnh của từng sản phẩm vào đúng thư mục phân loại đó.
 * 5. Tự động cấp quyền chia sẻ (Anyone with link can view) để xem ảnh trực tiếp.
 * 6. Tự động ghi toàn bộ dữ liệu vào Google Sheets:
 *    - Sheet ORDERS: Thông tin khách hàng, tổng tiền, ưu đãi kèm LINK GOOGLE DRIVE ĐƠN HÀNG.
 *    - Sheet ORDER_ITEMS: Chi tiết từng loại ảnh, size, số lượng kèm LINK XEM ẢNH & LINK FOLDER PHÂN LOẠI.
 * ==============================================================================
 */

// ID Spreadsheet của bạn (Đã tích hợp sẵn)
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
      Logger.log("Không thể mở bằng ID, sử dụng getActiveSpreadsheet(): " + e.toString());
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Xử lý yêu cầu POST gửi đơn hàng từ Website
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Khóa tối đa 30 giây để xử lý tuần tự an toàn
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

    // 1. Kiểm tra thông tin bắt buộc
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

    // 2. Định dạng thông tin mã đơn & thời gian
    const countryRaw = (payload.country || customer.country || "VN").toString().toUpperCase();
    const isThai = countryRaw === "TH" || countryRaw.includes("THAI") || countryRaw.includes("THÁI");
    const prefix = isThai ? "TL" : "MC";
    const countryName = isThai ? "Thái Lan" : "Việt Nam";

    const orderId =
      payload.orderId ||
      (prefix + "-" + Utilities.formatDate(now, "GMT+7", "yyyyMMdd-") + Math.floor(100 + Math.random() * 900));
    const createdAt = payload.createdAt || Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // 3. Khởi tạo cây thư mục Google Drive:
    // LADA_GIFT_ORDERS / YYYY / MM / [Mã Đơn - Tên Khách]
    const yearStr = Utilities.formatDate(now, "GMT+7", "yyyy");
    const monthStr = Utilities.formatDate(now, "GMT+7", "MM");

    const rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), ROOT_FOLDER_NAME);
    const yearFolder = getOrCreateFolder(rootFolder, yearStr);
    const monthFolder = getOrCreateFolder(yearFolder, monthStr);

    const safeCustomerName = sanitizeFolderName(customer.customerName || "Khach");
    const orderFolderName = orderId + " - " + safeCustomerName;
    const orderFolder = getOrCreateFolder(monthFolder, orderFolderName);

    // Cấp quyền xem cho thư mục đơn hàng
    try {
      orderFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      Logger.log("Lỗi setSharing orderFolder: " + shareErr.toString());
    }

    // 4. Mở Spreadsheet & Sheet
    const ss = getSpreadsheet();
    setupSheetsIfNotExist(ss);

    const ordersSheet = ss.getSheetByName("ORDERS");
    const orderItemsSheet = ss.getSheetByName("ORDER_ITEMS");

    // 5. Xử lý từng sản phẩm:
    // Tạo folder con theo thứ tự: [Mã Đơn] - [Loại Ảnh] - [Size Ảnh]
    // Và lưu file ảnh vào đúng folder đó
    let totalItems = items.length;
    let totalQuantity = 0;
    let computedTotalPrice = 0;

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

      // Đặt tên thư mục con: [Mã đơn] - [Loại ảnh] - [Size ảnh]
      // Ví dụ: MC-20261103-123 - Toàn thân - 5x7.5cm
      const subFolderName = orderId + " - " + sanitizeFolderName(styleName) + " - " + sanitizeFolderName(sizeStr);
      const categoryFolder = getOrCreateFolder(orderFolder, subFolderName);

      try {
        categoryFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (eSubShare) {}

      let fileId = "";
      let fileUrl = "";
      let fileName = it.imageName || ("anh_" + (i + 1) + ".jpg");

      // Lưu file ảnh vào thư mục phân loại tương ứng
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
        // Tải ảnh từ URL từ xa (như presets) về lưu vào Drive
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

      // Ghi dòng sản phẩm vào Sheet ORDER_ITEMS
      // Cột:
      // 1: item_id
      // 2: order_id
      // 3: product_name
      // 4: style_label (Loại ảnh)
      // 5: size_value (Kích thước)
      // 6: quantity
      // 7: unit_price
      // 8: subtotal
      // 9: image_name
      // 10: image_url (Hyperlink xem ảnh)
      // 11: subfolder_url (Hyperlink mở folder Mã đơn-Loại ảnh-Size ảnh)
      // 12: created_at
      const imageHyperlink = fileUrl.startsWith("http")
        ? '=HYPERLINK("' + fileUrl + '", "🖼️ Xem ảnh gốc")'
        : (fileUrl || "Chưa có ảnh");

      const folderHyperlink = '=HYPERLINK("' + categoryFolder.getUrl() + '", "📁 ' + subFolderName + '")';

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
        imageHyperlink,
        folderHyperlink,
        createdAt,
      ]);
    }

    // 6. Ghi thông tin chung vào Sheet ORDERS
    const promoNotes = (promotion.promotionNotes && promotion.promotionNotes.length > 0)
      ? promotion.promotionNotes.join(" | ")
      : "Không có";

    const customerAddress = (customer.address || "").includes(countryName)
      ? (customer.address || "")
      : ("[" + countryName + "] " + (customer.address || ""));

    const finalTotalPrice = payload.totalPrice || computedTotalPrice;

    const driveFolderHyperlink = '=HYPERLINK("' + orderFolder.getUrl() + '", "📂 Mở Folder Đơn Hàng Trên Drive")';

    ordersSheet.appendRow([
      orderId,
      createdAt,
      customer.customerName,
      "'" + customer.phone, // Dấu nháy đơn để giữ nguyên số 0 đầu điện thoại
      customerAddress,
      customer.note || "",
      totalItems,
      totalQuantity,
      finalTotalPrice,
      promoNotes,
      driveFolderHyperlink,
      "CHỜ XỬ LÝ",
    ]);

    // 7. Trả phản hồi JSON thành công về Website
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

/**
 * Xử lý GET test kiểm tra kết nối API qua trình duyệt
 */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ONLINE",
      app: "LADA GIFT Order Management Web App",
      version: "2.0-AutoFolderDrive",
      spreadsheetId: SPREADSHEET_ID,
      timestamp: new Date().toISOString(),
      message: "API hoạt động hoàn hảo! Đã sẵn sàng tự động phân loại ảnh và đẩy vào Google Drive / Sheets.",
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
 * Làm sạch tên để tạo thư mục an toàn trên Google Drive
 */
function sanitizeFolderName(name) {
  if (!name) return "Folder";
  return name.toString().replace(/[\\/:*?"<>|]/g, "_").trim();
}

/**
 * Tự động tạo và định dạng cấu trúc 3 Sheet nếu chưa tồn tại
 */
function setupSheetsIfNotExist(ss) {
  // 1. Sheet ORDERS
  let ordersSheet = ss.getSheetByName("ORDERS");
  if (!ordersSheet) {
    const sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      ordersSheet = sheets[0];
      ordersSheet.setName("ORDERS");
    } else {
      ordersSheet = ss.insertSheet("ORDERS");
    }

    ordersSheet.appendRow([
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
      "Thư Mục Google Drive",
      "Trạng Thái",
    ]);
    const headerRange = ordersSheet.getRange(1, 1, 1, 12);
    headerRange.setFontWeight("bold").setBackground("#FCE7F3").setFontColor("#1E1035");
    ordersSheet.setFrozenRows(1);
    ordersSheet.autoResizeColumns(1, 12);
  }

  // 2. Sheet ORDER_ITEMS
  let itemsSheet = ss.getSheetByName("ORDER_ITEMS");
  if (!itemsSheet) {
    itemsSheet = ss.insertSheet("ORDER_ITEMS");
    itemsSheet.appendRow([
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
      "Thư Mục Phân Loại (Mã-Loại-Size)",
      "Thời Gian Tạo",
    ]);
    const headerRange = itemsSheet.getRange(1, 1, 1, 12);
    headerRange.setFontWeight("bold").setBackground("#EDE9FE").setFontColor("#1E1035");
    itemsSheet.setFrozenRows(1);
    itemsSheet.autoResizeColumns(1, 12);
  }

  // 3. Sheet CONFIG
  let configSheet = ss.getSheetByName("CONFIG");
  if (!configSheet) {
    configSheet = ss.insertSheet("CONFIG");
    configSheet.appendRow(["config_key", "config_value", "description"]);
    const headerRange = configSheet.getRange(1, 1, 1, 3);
    headerRange.setFontWeight("bold").setBackground("#E0F2FE").setFontColor("#1E1035");
    configSheet.setFrozenRows(1);

    configSheet.appendRow(["STORE_NAME", "LADA GIFT - Gift From The Heart", "Tên thương hiệu"]);
    configSheet.appendRow(["ROOT_DRIVE_FOLDER", ROOT_FOLDER_NAME, "Thư mục lưu trữ chính trên Google Drive"]);
    configSheet.appendRow(["FREE_SHIPPING_MIN_QTY", "30", "Số lượng tối thiểu được freeship (hoặc đơn > 600k)"]);
    configSheet.appendRow(["MIN_ORDER_MICA_MAGNET", "5", "Số lượng đặt hàng tối thiểu Mica Nam Châm"]);
  }
}

/**
 * HÀM TEST TRỰC TIẾP TRONG APPS SCRIPT:
 * Chọn hàm 'testSpreadsheetSetup' hoặc 'testCreateSampleOrder' rồi nhấn Chạy (Run)
 */
function testSpreadsheetSetup() {
  const ss = getSpreadsheet();
  setupSheetsIfNotExist(ss);
  Logger.log("Đã khởi tạo thành công bảng tính tại: " + SPREADSHEET_ID);
}

function testCreateSampleOrder() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        orderId: "MC-TEST-" + Math.floor(100 + Math.random() * 900),
        createdAt: Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss"),
        country: "Việt Nam",
        customer: {
          customerName: "Nguyễn Văn Test",
          phone: "0366831128",
          address: "Số 32 Ngõ 292 Kim Giang, Kim Văn, Hoàng Mai, Hà Nội",
          note: "Đơn test thử nghiệm tự động phân chia thư mục Drive"
        },
        items: [
          {
            itemId: "item-1",
            productType: "mica-magnet",
            productName: "Ảnh mica nam châm",
            styleType: "fullbody",
            styleLabel: "Toàn thân",
            size: "S",
            sizeValue: "5x7.5 cm",
            quantity: 5,
            unitPrice: 22000,
            subtotal: 110000,
            imageName: "chup_toan_than.jpg",
            imageBase64: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80"
          },
          {
            itemId: "item-2",
            productType: "mica-magnet",
            productName: "Ảnh mica nam châm",
            styleType: "face",
            styleLabel: "Khuôn mặt",
            size: "L",
            sizeValue: "8x8 cm",
            quantity: 2,
            unitPrice: 37000,
            subtotal: 74000,
            imageName: "khuon_mat_be.jpg",
            imageBase64: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"
          }
        ],
        totalItems: 2,
        totalQuantity: 7,
        totalPrice: 184000,
        promotion: {
          promotionNotes: ["Tối thiểu 5 cái Mica nam châm"]
        }
      })
    }
  };
  const res = doPost(fakeEvent);
  Logger.log("Kết quả test: " + res.getContent());
}
