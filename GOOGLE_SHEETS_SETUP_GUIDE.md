# HƯỚNG DẪN CẬP NHẬT GOOGLE APPS SCRIPT CHO GOOGLE SHEETS & GOOGLE DRIVE LADA GIFT

> Bảng tính Google Sheet liên kết:  
> [https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit](https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit)  
> ID Bảng tính: `1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA`

---

## 🎯 LOGIC TỰ ĐỘNG PHÂN CHIA THƯ MỤC TRÊN GOOGLE DRIVE

Khi khách hàng chọn ảnh, loại sản phẩm, kiểu dáng và kích thước rồi đặt hàng:
1. Hệ thống sẽ tự động tạo thư mục chính cho đơn hàng trên Google Drive:  
   `LADA_GIFT_ORDERS / YYYY / MM / [Mã Đơn - Tên Khách Hàng]`
2. **TỰ ĐỘNG TẠO TỪNG THƯ MỤC PHÂN LOẠI CON THEO QUY TẮC:**  
   `[Mã Đơn] - [Loại Ảnh / Kiểu Dáng] - [Size Ảnh]`  
   *Ví dụ minh họa thực tế:*  
   - Thư mục: `MC-20261103-789 - Toàn thân - 5x7.5 cm` ➔ Chứa các file ảnh toàn thân  
   - Thư mục: `MC-20261103-789 - Khuôn mặt - 5x5 cm` ➔ Chứa các file ảnh khuôn mặt  
   - Thư mục: `MC-20261103-789 - Ảnh chữ nhật - 9x6.5 cm` ➔ Chứa các file ảnh chữ nhật  
3. Toàn bộ file ảnh khách hàng tải lên sẽ được giải mã và lưu trữ an toàn trong đúng thư mục con phân loại đó.
4. Tự động đẩy dữ liệu về Google Sheets:
   - **Sheet `ORDERS`**: Thông tin người nhận, số điện thoại, địa chỉ, tổng tiền, quà tặng + **Link mở thư mục Google Drive của đơn hàng**.
   - **Sheet `ORDER_ITEMS`**: Chi tiết từng sản phẩm + **Link xem ảnh gốc** + **Link mở thư mục con phân loại (Mã đơn-Loại-Size)**.

---

## 📝 CÁC BƯỚC CẬP NHẬT CODE LÊN APPS SCRIPT

### Bước 1: Mở trình soạn thảo Google Apps Script
1. Mở trang Google Sheet của bạn:  
   [https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit](https://docs.google.com/spreadsheets/d/1uFQldyC4XyOtKXv2ZH6d7eM1eX5-GJNKY8OYR8k_yeA/edit)
2. Trên thanh menu trên cùng, chọn **Tiện ích mở rộng** (Extensions) ➔ **Apps Script**.
3. Chọn toàn bộ code trong file `Mã.gs` (Code.gs) hiện tại và **Xóa đi**.
4. Mở file [google-apps-script/Code.gs](file:///C:/Users/Admin/.gemini/antigravity/scratch/hologram-print/google-apps-script/Code.gs) trong thư mục dự án, copy toàn bộ mã nguồn mới và dán vào cửa sổ Apps Script.
5. Nhấn **Lưu** (biểu tượng đĩa mềm hoặc phím tắt `Ctrl + S`).

---

### Bước 2: Chạy thử để tạo lại cấu trúc Sheet
1. Trên thanh công cụ Apps Script, ở ô chọn hàm, chọn hàm: **`testCreateSampleOrder`**.
2. Nhấn nút **Chạy (Run)**.
3. Khi hoàn tất, bạn kiểm tra lại tab Google Sheet sẽ thấy:
   - Sheet **`ORDERS`** có cột **Thư Mục Google Drive** chứa link bấm mở trực tiếp.
   - Sheet **`ORDER_ITEMS`** có cột **Kiểu Dáng / Loại Ảnh**, **Kích Thước**, **Link Ảnh Drive**, và **Thư Mục Phân Loại (Mã-Loại-Size)**.
   - Mở Google Drive sẽ thấy thư mục `LADA_GIFT_ORDERS` đã tự động phân nhánh thư mục con đúng theo quy tắc `Mã đơn - Loại ảnh - Size ảnh`.

---

### Bước 3: Triển khai lại Web App (Quan trọng để nhận API mới)
1. Ở góc trên bên phải màn hình Apps Script, nhấn nút xanh **Triển khai (Deploy)** ➔ chọn **Quản lý các bản triển khai (Manage deployments)**.
2. Nhấn vào biểu tượng **Chỉnh sửa ✏️** (hình bút chì) ở bản triển khai Web App hiện tại.
3. Ở dòng **Phiên bản (Version)**, chọn **Phiên bản mới (New version)**.
4. Ghi mô tả: `v2.0 Auto Drive Folders`.
5. Đảm bảo 2 dòng dưới:
   - **Thực thi dưới dạng (Execute as)**: **Tôi (Me)**
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)**
6. Nhấn nút **Triển khai (Deploy)**.
7. Copy đường link **URL ứng dụng web** (Web app URL) có dạng:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
8. Gửi lại đường link này vào đoạn chat để tôi cập nhật vào file `.env.local` cho bạn, hoặc bạn có thể tự dán vào file `.env.local` theo cú pháp:
   ```env
   GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
