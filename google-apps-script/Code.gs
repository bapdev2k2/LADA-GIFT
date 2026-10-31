/**
 * ==============================================================================
 * LADA GIFT - GOOGLE APPS SCRIPT WEB APP API
 * ==============================================================================
 * Spreadsheet liên kết: 
 * https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit
 * ID: 1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA
 *
 * Chức năng:
 * 1. Tiếp nhận dữ liệu đơn hàng (POST request) từ website LADA GIFT.
 * 2. Tự động khởi tạo & định dạng 3 sheet: ORDERS, ORDER_ITEMS, CONFIG.
 * 3. Tự động tạo cây thư mục trên Google Drive: LADA_GIFT_ORDERS / YYYY / MM / [Mã Đơn].
 * 4. Tải và lưu ảnh gốc của từng sản phẩm vào thư mục đơn hàng tương ứng.
 * 5. Ghi thông tin đơn và link ảnh vào Google Sheets.
 * 6. Trả phản hồi JSON thành công hoặc thông báo lỗi về website.
 * ==============================================================================
 */

// ID Spreadsheet của bạn (Đã tích hợp cố định)
const SPREADSHEET_ID = "1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA";

// Tên thư mục gốc lưu ảnh trên Google Drive
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
    const now = new Date();

    // Xác định quốc gia & tiền tố mã đơn: Việt Nam -> MC, Thái Lan -> TL
    const countryRaw = (payload.country || customer.country || "VN").toString().toUpperCase();
    const isThai = countryRaw === "TH" || countryRaw.includes("THAI") || countryRaw.includes("THÁI");
    const prefix = isThai ? "TL" : "MC";
    const countryName = isThai ? "Thái Lan" : "Việt Nam";

    const orderId =
      payload.orderId ||
      (prefix + "-" + Utilities.formatDate(now, "GMT+7", "yyyyMMdd-") + Math.floor(100 + Math.random() * 900));
    const createdAt = payload.createdAt || Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // 1. Kiểm tra dữ liệu bắt buộc
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
          message: "Đơn hàng chưa có sản phẩm nào!",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Quản lý thư mục Google Drive: LADA_GIFT_ORDERS / YYYY / MM / [orderId]
    const yearStr = Utilities.formatDate(now, "GMT+7", "yyyy");
    const monthStr = Utilities.formatDate(now, "GMT+7", "MM");

    const rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), ROOT_FOLDER_NAME);
    const yearFolder = getOrCreateFolder(rootFolder, yearStr);
    const monthFolder = getOrCreateFolder(yearFolder, monthStr);
    const orderFolder = getOrCreateFolder(monthFolder, orderId);

    // 3. Chuẩn bị bảng tính Spreadsheet & 3 Sheet
    const ss = getSpreadsheet();
    setupSheetsIfNotExist(ss);

    const ordersSheet = ss.getSheetByName("ORDERS");
    const orderItemsSheet = ss.getSheetByName("ORDER_ITEMS");

    // 4. Lưu từng ảnh vào Google Drive và ghi vào Sheet ORDER_ITEMS
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

      // Ghi dòng sản phẩm vào Sheet ORDER_ITEMS
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

    // 5. Ghi thông tin chung vào Sheet ORDERS
    // [order_id, created_at, customer_name, phone, address, note, total_items, total_quantity, total_price, status]
    const customerAddress = (customer.address || "").includes(countryName)
      ? (customer.address || "")
      : ("[" + countryName + "] " + (customer.address || ""));

    ordersSheet.appendRow([
      orderId,
      createdAt,
      customer.customerName,
      customer.phone,
      customerAddress,
      customer.note || "",
      totalItems,
      totalQuantity,
      computedTotalPrice,
      "PENDING",
    ]);

    // 6. Trả phản hồi thành công
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
        message: "Lỗi xử lý đơn hàng: " + error.toString(),
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
      spreadsheetId: SPREADSHEET_ID,
      timestamp: new Date().toISOString(),
      message: "API hoạt động bình thường và sẵn sàng tiếp nhận đơn hàng!",
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
 * Tự động tạo và định dạng cấu trúc 3 Sheet nếu chưa tồn tại
 */
function setupSheetsIfNotExist(ss) {
  // 1. Sheet ORDERS
  let ordersSheet = ss.getSheetByName("ORDERS");
  if (!ordersSheet) {
    // Nếu có Sheet mặc định rỗng (Sheet1 hoặc Trang tính 1), đổi tên thành ORDERS
    const sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      ordersSheet = sheets[0];
      ordersSheet.setName("ORDERS");
    } else {
      ordersSheet = ss.insertSheet("ORDERS");
    }

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
    const headerRange = ordersSheet.getRange(1, 1, 1, 10);
    headerRange.setFontWeight("bold").setBackground("#FCE7F3").setFontColor("#1E1035");
    ordersSheet.setFrozenRows(1);
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
    const headerRange = itemsSheet.getRange(1, 1, 1, 12);
    headerRange.setFontWeight("bold").setBackground("#EDE9FE").setFontColor("#1E1035");
    itemsSheet.setFrozenRows(1);
  }

  // 3. Sheet CONFIG
  let configSheet = ss.getSheetByName("CONFIG");
  if (!configSheet) {
    configSheet = ss.insertSheet("CONFIG");
    configSheet.appendRow(["config_key", "config_value", "description"]);
    const headerRange = configSheet.getRange(1, 1, 1, 3);
    headerRange.setFontWeight("bold").setBackground("#E0F2FE").setFontColor("#1E1035");
    configSheet.setFrozenRows(1);

    // Cấu hình mẫu ban đầu
    configSheet.appendRow(["STORE_NAME", "LADA GIFT - Gift From The Heart", "Tên thương hiệu"]);
    configSheet.appendRow(["PRICE_KEYCHAIN", "35000", "Giá cơ bản Móc khóa mica (Size S)"]);
    configSheet.appendRow(["PRICE_MAGNET", "25000", "Giá cơ bản Nam châm in hình (Size S)"]);
    configSheet.appendRow(["PRICE_MICA_MAGNET", "45000", "Giá cơ bản Mica nam châm (Size S)"]);
    configSheet.appendRow(["SURCHARGE_SIZE_L", "10000", "Phụ thu kích thước L (10cm)"]);
    configSheet.appendRow(["SURCHARGE_SIZE_XL", "30000", "Phụ thu kích thước XL (15cm)"]);
    configSheet.appendRow(["FREE_SHIPPING_MIN_QTY", "2", "Số lượng tối thiểu được freeship"]);
    configSheet.appendRow(["MAX_FILE_SIZE_MB", "20", "Dung lượng ảnh tối đa (MB)"]);
  }
}

/**
 * HÀM TEST TRỰC TIẾP TRONG APPS SCRIPT:
 * Bạn có thể chọn hàm 'testSpreadsheetSetup' hoặc 'testCreateSampleOrder' trong dropdown của Apps Script rồi nhấn 'Chạy' (Run)
 * để kiểm tra cấp quyền Google Drive, Google Sheets và tạo thử 1 đơn hàng mẫu ngay lập tức!
 */
function testSpreadsheetSetup() {
  const ss = getSpreadsheet();
  setupSheetsIfNotExist(ss);
  Logger.log("Đã khởi tạo thành công 3 Sheet trong Spreadsheet ID: " + SPREADSHEET_ID);
}

function testCreateSampleOrder() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        orderId: "TEST-" + Math.floor(1000 + Math.random() * 9000),
        createdAt: Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss"),
        customer: {
          customerName: "Khách hàng Test",
          phone: "0987654321",
          address: "123 Cầu Giấy, Hà Nội",
          note: "Đơn test thử nghiệm trực tiếp từ Apps Script"
        },
        items: [
          {
            itemId: "item-test-1",
            productType: "keychain",
            productName: "Móc khóa mica",
            size: "S",
            sizeValue: "7.5 cm",
            quantity: 2,
            unitPrice: 35000,
            subtotal: 70000,
            imageName: "test.jpg"
          }
        ],
        totalItems: 1,
        totalQuantity: 2,
        totalPrice: 70000
      })
    }
  };
  const res = doPost(fakeEvent);
  Logger.log("Kết quả test: " + res.getContent());
}
