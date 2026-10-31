# HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS & GOOGLE DRIVE – LADA GIFT

Tài liệu này hướng dẫn chi tiết cách kết nối hệ thống đặt hàng **LADA GIFT** với **Google Sheets** (quản lý đơn hàng) và **Google Drive** (tự động lưu ảnh khách hàng theo từng thư mục đơn).

---

## 1. TẠO GOOGLE SPREADSHEET

1. Truy cập [Google Sheets](https://sheets.google.com) và tạo một trang tính mới.
2. Đổi tên trang tính thành: **LADA_GIFT_ORDERS_DATABASE**.
3. Không cần tự tạo trước các cột — file script `google-apps-script/Code.gs` đã được lập trình sẵn cơ chế **tự động khởi tạo 3 Sheet**:
   - `ORDERS`: Lưu thông tin chung của đơn hàng (Mã đơn, Họ tên, SĐT, Địa chỉ, Ghi chú, Tổng tiền, Trạng thái).
   - `ORDER_ITEMS`: Lưu từng sản phẩm trong đơn (Loại, Kích thước, Số lượng, Đơn giá, Thành tiền, ID và Link ảnh Drive).
   - `CONFIG`: Lưu bảng giá và cấu hình vận chuyển.

---

## 2. CÀI ĐẶT GOOGLE APPS SCRIPT

1. Trong trang Google Spreadsheet vừa tạo, trên thanh menu nhấn vào **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Đổi tên dự án Apps Script thành: **LADA GIFT Order API**.
3. Xóa toàn bộ nội dung mặc định trong file `Mã.gs` (Code.gs).
4. Mở file [google-apps-script/Code.gs](file:///C:/Users/Admin/.gemini/antigravity/scratch/hologram-print/google-apps-script/Code.gs) trong dự án này, copy toàn bộ nội dung và dán vào Apps Script.
5. Nhấn biểu tượng **Lưu (Save - Ctrl+S)**.

---

## 3. TRIỂN KHAI THÀNH WEB APP (DEPLOY)

1. Ở góc trên cùng bên phải của giao diện Apps Script, nhấn nút **Triển khai (Deploy)** > **Triển khai mới (New deployment)**.
2. Nhấn vào biểu tượng bánh răng **Chọn loại (Select type)** > chọn **Ứng dụng web (Web app)**.
3. Cấu hình các thông số:
   - **Mô tả (Description)**: `LADA GIFT Order API v1.0`
   - **Thực thi dưới dạng (Execute as)**: `Tôi (Email của bạn - Me)`
   - **Ai có quyền truy cập (Who has access)**: `Bất kỳ ai (Anyone)` *(Quan trọng: phải chọn Anyone để API từ website có thể gửi đơn hàng vào)*.
4. Nhấn **Triển khai (Deploy)**.
5. Google sẽ yêu cầu cấp quyền (**Authorize access**):
   - Chọn tài khoản Google của bạn.
   - Nhấn **Nâng cao (Advanced)** > Nhấn vào **Đi tới LADA GIFT Order API (không an toàn)**.
   - Nhấn **Cho phép (Allow)**.
6. Sau khi cấp quyền xong, Google sẽ cung cấp một **URL ứng dụng web (Web App URL)**, có dạng:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
7. Copy đường dẫn Web App URL này.

---

## 4. CẤU HÌNH VÀO DỰ ÁN NEXT.JS

1. Mở file `.env.local` ở thư mục gốc của dự án (hoặc tạo file `.env.local` nếu chưa có).
2. Thêm dòng cấu hình sau:
   ```env
   GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
3. Lưu file và khởi động lại server Next.js (`npm run dev` hoặc `npm run build`).

---

## 5. CẤU TRÚC LƯU TRỮ TRÊN GOOGLE DRIVE

Khi có đơn hàng mới gửi lên, script sẽ tự động tạo cấu trúc thư mục trên Google Drive của bạn:

```
LADA_GIFT_ORDERS/
└── 2026/
    └── 10/
        ├── LADA-20261031-102/
        │   ├── item_1_original.png
        │   └── item_2_original.jpg
        └── LADA-20261031-205/
            └── item_1_original.png
```

- Ảnh được lưu giữ nguyên độ phân giải gốc để xưởng in mica trực tiếp.
- Link truy cập xem ảnh được lưu tại cột `image_url` trong sheet `ORDER_ITEMS`.
