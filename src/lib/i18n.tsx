"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "vi" | "en" | "th";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
];

export const translations = {
  vi: {
    // Header
    nav_products: "Sản phẩm",
    nav_showroom: "Showroom 3D",
    nav_sizes: "Kích thước",
    nav_process: "Quy trình in",
    nav_gallery: "Bộ sưu tập",
    nav_contact: "Liên hệ",
    nav_cta: "Tự thiết kế ngay",
    tagline: "Gift From The Heart",

    // Hero Section
    hero_badge: "XƯỞNG MICA QUÀ TẶNG CAO CẤP • IN THEO YÊU CẦU",
    hero_title_1: "Biến Kỷ Niệm Thành",
    hero_title_2: "Kiệt Tác Pha Lê",
    hero_subtitle: "Móc Khóa & Nam Châm Mica LADA",
    hero_desc: "Mica Acrylic đúc nguyên khối siêu trong suốt 99.8%, vát cạnh kim cương CNC bóng loáng. In hình cá nhân hóa theo yêu cầu — sắc nét, bền màu 10 năm.",
    hero_btn_customize: "Tự thiết kế & Xem bản in ngay",
    hero_btn_explore: "Khám phá sản phẩm",
    hero_feat_1_title: "Duyệt mẫu trong 15P",
    hero_feat_1_desc: "Gửi demo bản in xem trước miễn phí",
    hero_feat_2_title: "Mica đúc Grade A 100%",
    hero_feat_2_desc: "Trong suốt 99.8%, không ố vàng 10 năm",
    hero_feat_3_title: "Hộp quà & Thiệp chỉn chu",
    hero_feat_3_desc: "Đóng gói sang trọng sẵn sàng tặng",
    hero_feat_4_title: "Bảo hành 1 đổi 1",
    hero_feat_4_desc: "Đổi mới lập tức nếu bản in không sắc nét",

    // Showroom 3D
    showroom_title: "Showroom 3D Trực Quan 360°",
    showroom_desc: "Trải nghiệm mô phỏng chất liệu Mica pha lê cao cấp trong không gian 3D tương tác theo thời gian thực",
    showroom_hint: "Di chuột hoặc vuốt để xoay góc nhìn 360°",

    // Product Showcase
    showcase_title: "Dòng Sản Phẩm Tiêu Biểu",
    showcase_subtitle: "Mica acrylic cao cấp cá nhân hóa",
    showcase_desc: "Mỗi sản phẩm là một tác phẩm nghệ thuật cá nhân hóa, vát cạnh kim cương CNC tinh xảo, bắt sáng như pha lê.",
    cat_all: "Tất cả",
    cat_keychain: "Móc khóa mica",
    cat_magnet: "Nam châm in hình",
    cat_mica_magnet: "Mica nam châm",
    btn_view_detail: "Xem chi tiết",
    btn_customize_now: "Đặt in ngay",
    from_price: "từ",

    // Size Guide
    sizes_title: "Bảng Kích Thước Chuẩn LADA",
    sizes_subtitle: "Lựa chọn kích thước phù hợp",
    sizes_desc: "Độ dày mica tiêu chuẩn 3.5mm đúc nguyên khối, vát cạnh kim cương CNC bóng bẩy sang trọng.",
    size_s_name: "Size S (7.5 cm)",
    size_s_sub: "Nhỏ gọn, xinh xắn móc chìa khóa xe, balo",
    size_l_name: "Size L (10 cm)",
    size_l_sub: "Kích thước tiêu chuẩn, in ảnh rõ nét nổi bật",
    size_xl_name: "Size XL (15 cm)",
    size_xl_sub: "Bản lớn sang trọng làm quà lưu niệm, để bàn",

    // Design Process
    process_title: "Quy Trình Gia Công & Đóng Gói",
    process_subtitle: "Từ ý tưởng đến tay bạn",
    process_step_1: "1. Chọn sản phẩm & Gửi ảnh",
    process_step_1_desc: "Tải ảnh kỷ niệm của bạn trực tiếp lên website hoặc gửi qua Zalo.",
    process_step_2: "2. Duyệt demo 3D trong 15P",
    process_step_2_desc: "Đội ngũ LADA thiết kế cắt form và gửi demo 3D duyệt trước hoàn toàn miễn phí.",
    process_step_3: "3. In UV & Cắt CNC vát cạnh",
    process_step_3_desc: "Công nghệ in UV Nhật Bản 8 màu, phủ bóng bảo vệ và vát cạnh bóng loáng.",
    process_step_4: "4. Đóng gói hộp quà & Giao tận tay",
    process_step_4_desc: "Đóng hộp quà cao cấp, kèm thiệp viết tay và giao nhanh toàn quốc.",

    // Why Choose Us
    why_title: "Vì Sao Hơn 10.000+ Khách Hàng Chọn LADA?",
    why_subtitle: "Chất lượng làm nên thương hiệu",

    // Gallery
    gallery_title: "Bộ Sưu Tập Khách Hàng Thực Tế",
    gallery_subtitle: "Khoảnh khắc lung linh",

    // CTA
    cta_title: "Biến Khoảnh Khắc Của Bạn Thành Kiệt Tác Hôm Nay",
    cta_desc: "Duyệt demo 3D miễn phí chỉ sau 15 phút. Nhận hàng tận tay, kiểm tra hài lòng mới thanh toán.",
    cta_btn: "Bắt đầu thiết kế ngay",

    // Footer
    footer_desc: "Xưởng sản xuất quà tặng mica acrylic đúc nguyên khối cao cấp. Đóng gói hộp quà sang trọng, gửi trọn yêu thương.",
    footer_support: "Hỗ trợ khách hàng",
    footer_policy: "Chính sách bảo hành",
    footer_rights: "Bản quyền thuộc về LADA GIFT. Gift From The Heart.",

    // Order Modal / Checkout
    modal_title: "LADA GIFT • 3D Design Studio",
    modal_badge: "Trực quan hóa thời gian thực",
    modal_sub: "Đặt nhiều ảnh & sản phẩm khác nhau trong cùng một đơn hàng tiện lợi",
    cfg_title: "Cấu hình & Tải ảnh sản phẩm",
    cfg_edit_title: "Đang chỉnh sửa sản phẩm trong giỏ",
    cfg_step_1: "1. Loại sản phẩm:",
    cfg_step_2: "2. Kích thước mica:",
    cfg_step_3: "3. Ảnh in cho sản phẩm này:",
    cfg_upload_btn: "Tải ảnh riêng từ máy",
    cfg_qty: "Số lượng:",
    cfg_add_btn: "Thêm sản phẩm này vào giỏ",
    cfg_update_btn: "Lưu cập nhật sản phẩm này",
    cart_heading: "Giỏ hàng của bạn",
    cart_empty_title: "Giỏ hàng của bạn đang trống",
    cart_empty_desc: "Hãy chọn loại sản phẩm, tải ảnh và nhấn '+ Thêm sản phẩm này vào giỏ' ở trên để lên đơn nhé!",
    cart_freeship: "Freeship toàn quốc từ 2c",
    cart_view_3d: "Xem 3D",
    cart_change_photo: "Đổi ảnh",
    cart_viewing_3d: "Đang xem 3D",

    // Checkout Form
    form_heading: "Thông tin nhận hàng:",
    form_country: "Quốc gia đặt hàng *",
    form_country_vn: "Việt Nam (Mã MC)",
    form_country_th: "Thái Lan (Mã TL)",
    form_name: "Họ và tên của bạn *",
    form_phone_vn: "Số điện thoại / Zalo nhận bản in demo *",
    form_phone_th: "Số điện thoại / LINE nhận demo *",
    form_address: "Địa chỉ nhận hàng (Số nhà, đường, phường/xã, quận/huyện) *",
    form_note: "Ghi chú đơn hàng (Ví dụ: Cắt theo viền ảnh, in thêm ngày tháng...)",
    form_summary_items: "Tổng",
    form_summary_lines: "dòng",
    form_summary_pcs: "chiếc",
    form_freeship_badge: "Miễn phí ship",
    form_submit_btn: "Đặt in {qty} sản phẩm này",
    form_submit_empty: "Vui lòng thêm sản phẩm vào giỏ",
    form_submitting: "Đang gửi đơn hàng...",

    // Success Screen
    success_title: "Đặt Hàng Thành Công!",
    success_desc: "LADA GIFT đã nhận được đơn hàng của bạn. Đội ngũ thiết kế sẽ liên hệ qua Zalo / LINE trong 15 phút để gửi bản demo xem trước!",
    success_order_id: "Mã đơn hàng của bạn",
    success_copy: "Sao chép",
    success_copied: "Đã chép",
    success_total: "Tổng thanh toán",
    success_btn_new: "Tiếp tục thiết kế đơn mới",
  },

  en: {
    // Header
    nav_products: "Products",
    nav_showroom: "3D Showroom",
    nav_sizes: "Sizes",
    nav_process: "Process",
    nav_gallery: "Gallery",
    nav_contact: "Contact",
    nav_cta: "Design Now",
    tagline: "Gift From The Heart",

    // Hero Section
    hero_badge: "PREMIUM ACRYLIC GIFTS • CUSTOM PRINTING",
    hero_title_1: "Turn Memories Into",
    hero_title_2: "Crystal Masterpieces",
    hero_subtitle: "LADA Acrylic Keychains & Photo Magnets",
    hero_desc: "99.8% ultra-transparent solid cast acrylic with gleaming CNC diamond beveled edges. Personalized photo printing — crystal clear, 10-year color durability.",
    hero_btn_customize: "Customize & View 3D Now",
    hero_btn_explore: "Explore Products",
    hero_feat_1_title: "Demo Proof in 15 Mins",
    hero_feat_1_desc: "Free 3D preview mockup sent before printing",
    hero_feat_2_title: "100% Grade A Acrylic",
    hero_feat_2_desc: "99.8% clarity, never yellows for 10 years",
    hero_feat_3_title: "Elegant Gift Box & Card",
    hero_feat_3_desc: "Luxury packaging ready for gifting",
    hero_feat_4_title: "1-to-1 Replacement",
    hero_feat_4_desc: "Instant reprint if not razor-sharp",

    // Showroom 3D
    showroom_title: "Interactive 3D Showroom 360°",
    showroom_desc: "Experience ultra-clear crystal acrylic materials with real-time dynamic light reflections in 3D",
    showroom_hint: "Drag or swipe to rotate 360°",

    // Product Showcase
    showcase_title: "Featured Product Collections",
    showcase_subtitle: "Personalized premium acrylic",
    showcase_desc: "Every item is a personalized artwork, diamond CNC beveled to catch light like fine crystal.",
    cat_all: "All Products",
    cat_keychain: "Acrylic Keychain",
    cat_magnet: "Photo Magnet",
    cat_mica_magnet: "Mica Magnet",
    btn_view_detail: "View Details",
    btn_customize_now: "Order Now",
    from_price: "from",

    // Size Guide
    sizes_title: "LADA Standard Size Chart",
    sizes_subtitle: "Choose the perfect size",
    sizes_desc: "3.5mm solid cast acrylic with CNC diamond beveled edges for brilliant luxury feel.",
    size_s_name: "Size S (7.5 cm)",
    size_s_sub: "Compact and adorable for car keys, bags, backpacks",
    size_l_name: "Size L (10 cm)",
    size_l_sub: "Standard popular size, clear vibrant photo details",
    size_xl_name: "Size XL (15 cm)",
    size_xl_sub: "Grand keepsake size for desks, gifts, and souvenirs",

    // Design Process
    process_title: "Production & Packaging Process",
    process_subtitle: "From your photo to your hands",
    process_step_1: "1. Select Item & Upload Photo",
    process_step_1_desc: "Upload your favorite memories directly on our website or via WhatsApp/Zalo.",
    process_step_2: "2. 15-Minute 3D Demo Preview",
    process_step_2_desc: "Our design team crafts custom outlines and sends a 3D demo preview for free approval.",
    process_step_3: "3. Japanese UV Print & Diamond CNC",
    process_step_3_desc: "8-color Japanese UV printing with protective gloss coat and sparkling beveled edges.",
    process_step_4: "4. Gift Box Packaging & Delivery",
    process_step_4_desc: "Elegantly boxed with a handwritten card, safely delivered to your doorstep.",

    // Why Choose Us
    why_title: "Why Over 10,000+ Customers Love LADA?",
    why_subtitle: "Craftsmanship that speaks for itself",

    // Gallery
    gallery_title: "Real Customer Gallery",
    gallery_subtitle: "Cherished moments",

    // CTA
    cta_title: "Preserve Your Precious Moments As Art Today",
    cta_desc: "Free 3D preview within 15 minutes. Delivered with care, inspect before payment.",
    cta_btn: "Start Designing Now",

    // Footer
    footer_desc: "Premier workshop for custom solid-cast acrylic gifts. Packaged in luxury gift boxes to deliver your love.",
    footer_support: "Customer Care",
    footer_policy: "Warranty & Guarantee",
    footer_rights: "All rights reserved by LADA GIFT. Gift From The Heart.",

    // Order Modal / Checkout
    modal_title: "LADA GIFT • 3D Design Studio",
    modal_badge: "Real-time 3D Preview",
    modal_sub: "Order multiple photos and products together in one easy checkout",
    cfg_title: "Configure & Upload Product Photo",
    cfg_edit_title: "Editing cart item",
    cfg_step_1: "1. Product type:",
    cfg_step_2: "2. Acrylic size:",
    cfg_step_3: "3. Photo for this item:",
    cfg_upload_btn: "Upload from your device",
    cfg_qty: "Quantity:",
    cfg_add_btn: "Add this item to cart",
    cfg_update_btn: "Save changes to item",
    cart_heading: "Your Shopping Cart",
    cart_empty_title: "Your cart is currently empty",
    cart_empty_desc: "Choose a product type, upload a photo, and click '+ Add this item to cart' above to begin!",
    cart_freeship: "Free shipping nationwide from 2 items",
    cart_view_3d: "View 3D",
    cart_change_photo: "Change photo",
    cart_viewing_3d: "Viewing in 3D",

    // Checkout Form
    form_heading: "Delivery Information:",
    form_country: "Country of order *",
    form_country_vn: "Vietnam (Prefix MC)",
    form_country_th: "Thailand (Prefix TL)",
    form_name: "Your Full Name *",
    form_phone_vn: "Phone / Zalo number *",
    form_phone_th: "Phone / LINE number *",
    form_address: "Delivery address (Street, Ward, District, City) *",
    form_note: "Order note (e.g. Cut along outline, add custom date...)",
    form_summary_items: "Total",
    form_summary_lines: "lines",
    form_summary_pcs: "pcs",
    form_freeship_badge: "Free shipping",
    form_submit_btn: "Order {qty} items now",
    form_submit_empty: "Please add products to cart",
    form_submitting: "Submitting order...",

    // Success Screen
    success_title: "Order Placed Successfully!",
    success_desc: "LADA GIFT has received your order. Our design team will message you via Zalo/LINE within 15 minutes to share the 3D demo proof!",
    success_order_id: "Your Order ID",
    success_copy: "Copy",
    success_copied: "Copied",
    success_total: "Total Amount",
    success_btn_new: "Design another product",
  },

  th: {
    // Header
    nav_products: "สินค้า",
    nav_showroom: "โชว์รูม 3D",
    nav_sizes: "ขนาด",
    nav_process: "กระบวนการพิมพ์",
    nav_gallery: "แกลเลอรี",
    nav_contact: "ติดต่อ",
    nav_cta: "ออกแบบทันที",
    tagline: "Gift From The Heart",

    // Hero Section
    hero_badge: "โรงงานของขวัญอะคริลิกระดับพรีเมียม • พิมพ์ตามสั่ง",
    hero_title_1: "เปลี่ยนความทรงจำสู่",
    hero_title_2: "ผลงานคริสตัลชิ้นเอก",
    hero_subtitle: "พวงกุญแจและแม่เหล็กอะคริลิก LADA",
    hero_desc: "อะคริลิกหล่อแข็งใสพิเศษ 99.8% เจียระไนขอบเพชร CNC เปล่งประกาย พิมพ์รูปถ่ายตามสั่ง — คมชัด สีสันคงทนยาวนาน 10 ปี",
    hero_btn_customize: "ออกแบบ & ดูแบบจำลอง 3D",
    hero_btn_explore: "สำรวจสินค้า",
    hero_feat_1_title: "ส่งตัวอย่างใน 15 นาที",
    hero_feat_1_desc: "ส่งตัวอย่างแบบ 3D ให้ดูก่อนพิมพ์ฟรี",
    hero_feat_2_title: "อะคริลิกเกรด A 100%",
    hero_feat_2_desc: "ความใส 99.8% ไม่เหลืองยาวนาน 10 ปี",
    hero_feat_3_title: "กล่องของขวัญและการ์ดหรู",
    hero_feat_3_desc: "แพ็กเกจของขวัญสุดหรู พร้อมมอบให้คนพิเศษ",
    hero_feat_4_title: "รับประกันเปลี่ยนใหม่ 1 ต่อ 1",
    hero_feat_4_desc: "เปลี่ยนชิ้นใหม่ทันทีหากภาพไม่คมชัด",

    // Showroom 3D
    showroom_title: "โชว์รูม 3D แบบอินเทอร์แอคทีฟ 360°",
    showroom_desc: "สัมผัสความโปร่งใสและประกายแสงสะท้อนสมจริงของอะคริลิกคริสตัลในพื้นที่ 3D แบบเรียลไทม์",
    showroom_hint: "ลากหรือปัดเพื่อหมุนมุมมอง 360°",

    // Product Showcase
    showcase_title: "คอลเลกชันสินค้าเด่น",
    showcase_subtitle: "อะคริลิกพรีเมียมเฉพาะบุคคล",
    showcase_desc: "ทุกชิ้นงานคืองานศิลปะเฉพาะตัว เจียระไนขอบเพชร CNC ประณีต เปล่งประกายดุจคริสตัลแท้",
    cat_all: "สินค้าทั้งหมด",
    cat_keychain: "พวงกุญแจอะคริลิก",
    cat_magnet: "แม่เหล็กพิมพ์ภาพ",
    cat_mica_magnet: "อะคริลิกแม่เหล็ก",
    btn_view_detail: "ดูรายละเอียด",
    btn_customize_now: "สั่งทำทันที",
    from_price: "เริ่มต้น",

    // Size Guide
    sizes_title: "ตารางขนาดมาตรฐาน LADA",
    sizes_subtitle: "เลือกขนาดที่เหมาะกับคุณ",
    sizes_desc: "อะคริลิกหล่อแข็งหนา 3.5 มม. เจียระไนขอบเพชร CNC หรูหราและประณีต",
    size_s_name: "ไซส์ S (7.5 ซม.)",
    size_s_sub: "กะทัดรัด น่ารัก เหมาะสำหรับพวงกุญแจรถ กระเป๋า",
    size_l_name: "ไซส์ L (10 ซม.)",
    size_l_sub: "ขนาดยอดนิยม รายละเอียดภาพคมชัดโดดเด่น",
    size_xl_name: "ไซส์ XL (15 ซม.)",
    size_xl_sub: "ขนาดใหญ่หรูหรา สำหรับตั้งโต๊ะและของที่ระลึก",

    // Design Process
    process_title: "ขั้นตอนการผลิตและการบรรจุ",
    process_subtitle: "จากภาพถ่ายของคุณสู่มือคุณ",
    process_step_1: "1. เลือกสินค้า & ส่งรูปภาพ",
    process_step_1_desc: "อัปโหลดภาพความทรงจำของคุณบนเว็บไซต์ หรือส่งทาง LINE/Zalo",
    process_step_2: "2. ตรวจสอบแบบ 3D ภายใน 15 นาที",
    process_step_2_desc: "ทีมออกแบบจัดวางและส่งตัวอย่างแบบ 3D ให้ตรวจสอบฟรี",
    process_step_3: "3. พิมพ์ UV ญี่ปุ่น & ตัด CNC ขอบเพชร",
    process_step_3_desc: "เทคโนโลยีพิมพ์ UV ญี่ปุ่น 8 สี เคลือบเงาป้องกัน พร้อมเจียระไนขอบเพชรประกายเงางาม",
    process_step_4: "4. บรรจุกล่องของขวัญ & จัดส่ง",
    process_step_4_desc: "บรรจุกล่องของขวัญสุดหรู พร้อมการ์ดอวยพร ส่งตรงถึงมือคุณอย่างปลอดภัย",

    // Why Choose Us
    why_title: "ทำไมลูกค้ากว่า 10,000+ ท่านจึงเลือก LADA?",
    why_subtitle: "คุณภาพที่สร้างความไว้วางใจ",

    // Gallery
    gallery_title: "แกลเลอรีภาพจริงจากลูกค้า",
    gallery_subtitle: "ช่วงเวลาแห่งความสุข",

    // CTA
    cta_title: "เปลี่ยนช่วงเวลาพิเศษให้เป็นผลงานชิ้นเอกวันนี้",
    cta_desc: "ส่งตัวอย่างแบบ 3D ให้ดูก่อนพิมพ์ฟรีภายใน 15 นาที ส่งถึงบ้าน ตรวจสอบความพอใจก่อนชำระเงิน",
    cta_btn: "เริ่มออกแบบทันที",

    // Footer
    footer_desc: "โรงงานผลิตของขวัญอะคริลิกหล่อแข็งระดับพรีเมียม บรรจุกล่องของขวัญสุดหรู ส่งมอบความรักจากใจ",
    footer_support: "ฝ่ายบริการลูกค้า",
    footer_policy: "นโยบายการรับประกัน",
    footer_rights: "สงวนลิขสิทธิ์โดย LADA GIFT. Gift From The Heart.",

    // Order Modal / Checkout
    modal_title: "LADA GIFT • สตูดิโอออกแบบ 3D",
    modal_badge: "ดูภาพจำลอง 3D แบบเรียลไทม์",
    modal_sub: "สั่งทำหลายรูปภาพและสินค้าในคำสั่งซื้อเดียวได้อย่างสะดวก",
    cfg_title: "กำหนดค่าและอัปโหลดรูปภาพ",
    cfg_edit_title: "กำลังแก้ไขสินค้าในตะกร้า",
    cfg_step_1: "1. ประเภทสินค้า:",
    cfg_step_2: "2. ขนาดอะคริลิก:",
    cfg_step_3: "3. รูปภาพสำหรับสินค้านี้:",
    cfg_upload_btn: "อัปโหลดภาพจากอุปกรณ์",
    cfg_qty: "จำนวน:",
    cfg_add_btn: "เพิ่มสินค้านี้ลงในตะกร้า",
    cfg_update_btn: "บันทึกการแก้ไขสินค้านี้",
    cart_heading: "ตะกร้าสินค้าของคุณ",
    cart_empty_title: "ตะกร้าสินค้าของคุณว่างอยู่",
    cart_empty_desc: "เลือกประเภทสินค้า อัปโหลดรูปภาพ แล้วกด '+ เพิ่มสินค้านี้ลงในตะกร้า' ด้านบนเพื่อเริ่มสั่งทำ!",
    cart_freeship: "ส่งฟรีทั่วประเทศเมื่อสั่ง 2 ชิ้นขึ้นไป",
    cart_view_3d: "ดูแบบ 3D",
    cart_change_photo: "เปลี่ยนรูป",
    cart_viewing_3d: "กำลังดูแบบ 3D",

    // Checkout Form
    form_heading: "ข้อมูลการจัดส่ง:",
    form_country: "ประเทศสั่งซื้อ *",
    form_country_vn: "เวียดนาม Vietnam (รหัส MC)",
    form_country_th: "ไทย Thailand (รหัส TL)",
    form_name: "ชื่อ-นามสกุลของคุณ *",
    form_phone_vn: "เบอร์โทรศัพท์ / Zalo *",
    form_phone_th: "เบอร์โทรศัพท์ / LINE ID *",
    form_address: "ที่อยู่จัดส่ง (บ้านเลขที่, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด) *",
    form_note: "หมายเหตุคำสั่งซื้อ (เช่น ตัดตามรูปทรงขอบภาพ, เพิ่มวันที่...)",
    form_summary_items: "รวม",
    form_summary_lines: "รายการ",
    form_summary_pcs: "ชิ้น",
    form_freeship_badge: "จัดส่งฟรี",
    form_submit_btn: "สั่งทำ {qty} ชิ้นนี้",
    form_submit_empty: "กรุณาเพิ่มสินค้าลงในตะกร้า",
    form_submitting: "กำลังส่งคำสั่งซื้อ...",

    // Success Screen
    success_title: "สั่งซื้อสำเร็จเรียบร้อย!",
    success_desc: "LADA GIFT ได้รับคำสั่งซื้อของคุณแล้ว ทีมออกแบบจะติดต่อกลับทาง LINE / Zalo ภายใน 15 นาทีเพื่อส่งแบบ 3D ให้คุณตรวจสอบ!",
    success_order_id: "รหัสคำสั่งซื้อของคุณ",
    success_copy: "คัดลอก",
    success_copied: "คัดลอกแล้ว",
    success_total: "ยอดชำระทั้งหมด",
    success_btn_new: "ออกแบบสินค้าชิ้นต่อไป",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.vi, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    // Check saved language in localStorage or browser language
    try {
      const savedLang = localStorage.getItem("lada_language") as Language;
      if (savedLang && ["vi", "en", "th"].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("lada_language", lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof translations.vi, params?: Record<string, string | number>): string => {
    const currentDict = translations[language] || translations.vi;
    let text = (currentDict as any)[key] || (translations.vi as any)[key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(pVal));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
