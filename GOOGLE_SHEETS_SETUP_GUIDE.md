# HƯỚNG DẪN XUẤT API GOOGLE APPS SCRIPT CHO GOOGLE SHEETS LADA GIFT

Bảng tính của bạn: [https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit](https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit)  
ID bảng tính: `1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA`

---

## BƯỚC 1: DÁN MÃ NGUỒN VÀO APPS SCRIPT TRONG GOOGLE SHEET

1. Mở trang Google Sheet của bạn qua đường link:
   [https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit](https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit)
2. Trên thanh menu trên cùng, nhấn vào **Tiện ích mở rộng** (Extensions) > chọn **Apps Script**.
3. Cửa sổ biên tập code Apps Script sẽ hiện ra.
4. Xóa hết tất cả code mẫu có sẵn trong file `Mã.gs` (Code.gs).
5. Mở file [google-apps-script/Code.gs](file:///C:/Users/Admin/.gemini/antigravity/scratch/hologram-print/google-apps-script/Code.gs) trong dự án này (hoặc copy từ ô code bên dưới), dán toàn bộ vào cửa sổ Apps Script.
6. Nhấn biểu tượng **Lưu dự án** (hình chiếc đĩa mềm hoặc bấm `Ctrl + S`).

---

## BƯỚC 2: CHẠY THỬ ĐỂ KHỞI TẠO BẢNG TÍNH & CẤP QUYỀN

1. Trên thanh công cụ của Apps Script, ở ô chọn hàm (Function dropdown), chọn hàm: **`testSpreadsheetSetup`**.
2. Nhấn nút **Chạy (Run)**.
3. Google sẽ hiện hộp thoại yêu cầu cấp quyền (**Cần có sự ủy quyền / Authorization Required**):
   - Nhấn **Xem lại quyền** (Review permissions).
   - Chọn tài khoản Google của bạn.
   - Nhấn **Nâng cao** (Advanced) ở góc dưới bên trái.
   - Nhấn vào dòng **Đi tới Dự án không có tiêu đề (không an toàn)** (Go to Untitled project (unsafe)).
   - Nhấn **Cho phép** (Allow).
4. Sau khi chạy xong, quay lại tab Google Sheet, bạn sẽ thấy script đã tự động tạo và định dạng đẹp mắt 3 Sheet:
   - **`ORDERS`**: Quản lý thông tin đơn hàng, khách hàng, số điện thoại, trạng thái.
   - **`ORDER_ITEMS`**: Quản lý chi tiết từng sản phẩm, size, số lượng, đơn giá, link ảnh Google Drive.
   - **`CONFIG`**: Bảng giá và cấu hình cửa hàng LADA GIFT.

---

## BƯỚC 3: XUẤT RA WEB APP API URL ĐỂ KẾT NỐI VỚI WEBSITE

1. Ở góc trên bên phải của màn hình Apps Script, nhấn nút màu xanh **Triển khai (Deploy)** > chọn **Triển khai mới (New deployment)**.
2. Nhấn vào biểu tượng bánh răng ⚙️ (chọn loại triển khai) > chọn **Ứng dụng web (Web app)**.
3. Điền các trường sau (cực kỳ quan trọng):
   - **Mô tả (Description)**: `LADA GIFT Order API v1.0`
   - **Thực thi dưới dạng (Execute as)**: **Tôi** (Tài khoản Google của bạn - Me)
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)** *(Bắt buộc phải chọn Anyone để API từ website có thể gửi đơn hàng vào)*.
4. Nhấn nút **Triển khai (Deploy)**.
5. Google sẽ tạo ra một đường link **URL ứng dụng web (Web App URL)**, có định dạng:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. Nhấn nút **Sao chép (Copy)** đường link này và gửi lại cho tôi, hoặc dán trực tiếp vào file `.env.local` của dự án:
   ```env
   GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
