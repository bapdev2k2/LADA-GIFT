"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "vi" | "en" | "th";

export interface LanguageOption {
  code: Language;
  name: string;
  label: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "vi", name: "Tiếng Việt", label: "Tiếng Việt", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "Tiếng Anh", label: "Tiếng Anh", nativeName: "English", flag: "🇬🇧" },
  { code: "th", name: "Tiếng Thái Lan", label: "Tiếng Thái Lan", nativeName: "ภาษาไทย", flag: "🇹🇭" },
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
    hero_card1_badge: "Mica Đúc 100%",
    hero_card1_title: "Nam Châm Mica Tủ Lạnh",
    hero_card1_desc: "Hút nam châm vĩnh cửu",
    hero_card2_badge: "Bán chạy #1",
    hero_card2_title: "Móc Khóa Mica LADA",
    hero_card2_desc: "Vát kim cương CNC • In 2 mặt",
    hero_card3_badge: "In Theo Ảnh Yêu Cầu",
    hero_card3_title: "Set Quà Tặng Cá Nhân",
    hero_card3_desc: "Tặng người yêu, bạn thân",

    // Showroom 3D
    showroom_tag: "LADA GIFT • Trải nghiệm 360° không gian 3D",
    showroom_title: "SHOWROOM 360°",
    showroom_desc: "Sản phẩm tự động quay 360° liên tục. Vòng xoay tự động mở rộng khi rê chuột lại gần và tạm dừng khi trỏ vào sản phẩm.",
    showroom_item1_name: "Móc khóa Mica LADA GIFT",
    showroom_item1_sub: "In 2 mặt sắc nét • Khoen tim",
    showroom_item1_badge: "Bán chạy #1",
    showroom_item2_name: "Nam châm Kỷ Niệm",
    showroom_item2_sub: "Lực hút cực mạnh • Chống nước",
    showroom_item2_badge: "Hút cực mạnh",
    showroom_item3_name: "Mica vát cạnh kim cương",
    showroom_item3_sub: "Vát CNC siêu bóng gương",
    showroom_item3_badge: "Cao cấp VIP",
    showroom_item4_name: "Set quà tặng móc khóa",
    showroom_item4_sub: "Cá nhân hóa theo ảnh riêng",
    showroom_item4_badge: "Hot Trend",
    showroom_item5_name: "Móc khóa nhân vật yêu thích",
    showroom_item5_sub: "Mica trong suốt chuẩn A 99.8%",
    showroom_item5_badge: "Độc quyền",
    showroom_item6_name: "Mica quà tặng kỷ niệm",
    showroom_item6_sub: "Gift From The Heart",
    showroom_item6_badge: "Gift Edition",

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
    per_size_s: "/ size S chuẩn",

    // Size Guide
    sizes_tag: "LADA GIFT • Tiêu chuẩn kích cỡ",
    sizes_title: "CHỌN KÍCH THƯỚC MICA HOÀN HẢO",
    sizes_subtitle: "Lựa chọn kích thước phù hợp",
    sizes_desc: "Độ dày mica tiêu chuẩn 3.5mm đúc nguyên khối, vát cạnh kim cương CNC bóng bẩy sang trọng.",
    size_s_name: "Size S (7.5 cm)",
    size_s_desc: "Nhỏ gọn • Tiện lợi",
    size_l_name: "Size L (10 cm)",
    size_l_desc: "Phổ biến • Vừa vặn",
    size_xl_name: "Size XL (15 cm)",
    size_xl_desc: "Nổi bật • Cao cấp",
    size_real_badge: "Kích thước thực tế: Size {size} ({dim}) — Mica dày 3.5mm vát cạnh kim cương",
    size_cta_btn: "Chọn Size {size} & Tự thiết kế ngay",

    // Design Process
    process_tag: "LADA GIFT • Đơn giản & Nhanh chóng",
    process_title: "QUY TRÌNH ĐẶT HÀNG IN MICA",
    process_step_1: "1. Chọn sản phẩm",
    process_step_1_desc: "Lựa chọn loại sản phẩm bạn muốn: móc khóa, nam châm hoặc mica nam châm",
    process_step_2: "2. Chọn kích thước",
    process_step_2_desc: "Chọn kích thước phù hợp: S (7.5cm), L (10cm) hoặc XL (15cm)",
    process_step_3: "3. Tải ảnh lên",
    process_step_3_desc: "Tải lên hình ảnh cá nhân của bạn. Chúng tôi sẽ thiết kế và gửi bản xem trước",
    process_step_4: "4. Xác nhận đặt hàng",
    process_step_4_desc: "Xác nhận thiết kế và đặt hàng. Sản phẩm sẽ được giao trong 3-5 ngày",

    // Why Choose Us
    why_tag: "LADA GIFT STANDARD",
    why_title: "VÌ SAO HƠN 10.000+ KHÁCH HÀNG CHỌN LADA?",
    why_subtitle: "Chất lượng làm nên thương hiệu",
    why_feat1_sub: "Ultra HD UV Print",
    why_feat1_title: "In hình sắc nét vượt trội",
    why_feat1_desc: "Công nghệ in phun đa lớp UV 8 màu siêu phân giải. Mực in cao cấp chuẩn Nhật Bản bền màu trên 10 năm, không bong tróc, không ố vàng.",
    why_feat1_badge: "Độ sắc nét 2400 DPI",
    why_feat2_sub: "Grade A Acrylic",
    why_feat2_title: "Mica đúc Grade A 100%",
    why_feat2_desc: "Acrylic nguyên sinh siêu trong suốt 99.8%. Độ dày 3.5mm đúc nguyên khối, vát cạnh kim cương CNC bóng loáng như pha lê.",
    why_feat2_badge: "Trong suốt như pha lê",
    why_feat3_sub: "Gift Experience",
    why_feat3_title: "Đóng gói quà tặng sang trọng",
    why_feat3_desc: "Mỗi đơn hàng được đóng hộp kraft cao cấp, thắt nơ ruy băng chỉn chu kèm thiệp viết tay xinh xắn sẵn sàng làm quà tặng.",
    why_feat3_badge: "Sẵn sàng làm quà tặng",
    why_feat4_sub: "Quality Commitment",
    why_feat4_title: "Bảo hành 1 đổi 1 & Cam kết",
    why_feat4_desc: "Cam kết gửi bản demo 3D xem trước trong 15 phút. Đổi mới 100% miễn phí nếu sản phẩm có bất kỳ lỗi in ấn hay trầy xước nào.",
    why_feat4_badge: "Bảo hành 10 năm",
    why_feat4_extra_sub: "Exclusive Diamond Cut",
    why_feat4_extra_title: "Gia công kim cương CNC độc quyền",
    why_feat4_extra_desc: "Tích hợp công nghệ đánh bóng quang học vát kim cương CNC, bề mặt bóng loáng như pha lê, bắt sáng lung linh dưới mọi góc nhìn.",
    why_feat4_extra_badge: "Độc quyền LADA GIFT",
    why_feat5_sub: "Cyber Luxe Packaging",
    why_feat5_title: "Đóng gói cao cấp làm quà tặng",
    why_feat5_desc: "Mỗi sản phẩm đi kèm hộp quà LADA GIFT sang trọng, túi nhung bảo vệ và thiệp chúc mừng thiết kế riêng. Hoàn hảo để làm quà tặng sinh nhật, kỷ niệm, quà cặp đôi.",
    why_feat5_badge: "Hộp quà chỉn chu",

    // Gallery
    gallery_tag: "LADA GIFT • Showcase Gallery",
    gallery_title: "BỘ SƯU TẬP THÀNH PHẨM THỰC TẾ",
    gallery_desc: "Chiêm ngưỡng hình ảnh các sản phẩm móc khóa, nam châm in hình cá nhân hóa đã được xưởng LADA GIFT hoàn thiện cho khách hàng.",
    gallery_cat_keychain: "Móc khóa",
    gallery_cat_magnet: "Nam châm",
    gallery_cat_mica_magnet: "Mica nam châm",
    gallery_footer_info: "Sản phẩm gia công thực tế tại xưởng LADA GIFT",
    gallery_footer_badge: "Mica trong suốt 99.8%",

    // CTA
    cta_title_1: "BIẾN KHOẢNH KHẮC",
    cta_title_2: "YÊU THÍCH CỦA BẠN",
    cta_title_3: "THÀNH KỶ VẬT",
    cta_title_4: "SANG TRỌNG & Ý NGHĨA",
    cta_desc: "Lưu giữ những khoảnh khắc đặc biệt theo cách độc đáo nhất cùng LADA GIFT — Món quà trao gửi trọn vẹn yêu thương từ trái tim.",
    cta_btn: "Bắt đầu thiết kế ngay",

    // Footer
    footer_desc: "Chuyên thiết kế & sản xuất các sản phẩm mica in hình, móc khóa quà tặng, nam châm cá nhân hóa cao cấp.",
    footer_col_products: "Danh mục sản phẩm",
    footer_col_policies: "Chính sách & Hỗ trợ",
    footer_col_contact: "Liên hệ xưởng LADA GIFT",
    footer_link_keychain: "Móc khóa mica theo yêu cầu",
    footer_link_magnet: "Nam châm in hình tủ lạnh",
    footer_link_mica_magnet: "Mica nam châm vát kim cương",
    footer_link_giftset: "Set quà tặng cá nhân hóa",
    footer_link_warranty: "Chính sách bảo hành 1 đổi 1",
    footer_link_guide: "Hướng dẫn gửi ảnh in nét",
    footer_link_shipping: "Chính sách vận chuyển",
    footer_link_privacy: "Bảo mật thông tin",
    footer_location: "Hà Nội & TP. Hồ Chí Minh (Giao hàng toàn quốc)",
    footer_rights: "Bản quyền thuộc về LADA GIFT. Gift From The Heart.",
    footer_exclusive: "Thiết kế độc quyền từ LADA GIFT",

    // Product Details Modal
    detail_tag: "Chi tiết sản phẩm",
    detail_reviews: "(4.9/5 từ 2,400+ đánh giá)",
    detail_spec_acrylic: "Mica Acrylic đúc siêu trong suốt 3.5mm vát cạnh kim cương CNC",
    detail_spec_print: "In phun kỹ thuật số UV 8 màu độ phân giải cao 2400 DPI",
    detail_spec_ring: "Khoen inox mạ titan chống gỉ sét 100%",
    detail_spec_magnet: "Nam châm vĩnh cửu Neodymium lực hút mạnh, bám chắc",
    detail_spec_warranty: "Bảo hành phai màu 10 năm & 1 đổi 1 nếu lỗi in ấn",
    detail_select_size: "Chọn kích thước:",
    detail_price_label: "Giá sản phẩm:",
    detail_btn_customize: "Tự thiết kế & Đặt hàng",

    // Order Modal / Checkout
    modal_title: "LADA GIFT • 3D Design Studio",
    modal_badge: "Trực quan hóa thời gian thực",
    modal_sub: "Đặt nhiều ảnh & sản phẩm khác nhau trong cùng một đơn hàng tiện lợi",
    modal_3d_mockup: "3D Mockup Trực Quan",
    modal_drag_rotate: "Di chuột để xoay 360°",
    cfg_title: "Cấu hình & Tải ảnh sản phẩm",
    cfg_edit_title: "Đang chỉnh sửa sản phẩm trong giỏ",
    cfg_cancel_edit: "Hủy sửa",
    cfg_step_1: "1. Loại sản phẩm:",
    cfg_step_2: "2. Kích thước mica:",
    cfg_step_3: "3. Ảnh in cho sản phẩm này:",
    cfg_upload_btn: "Tải ảnh riêng từ máy",
    cfg_qty: "Số lượng:",
    cfg_add_btn: "Thêm sản phẩm này vào giỏ",
    cfg_update_btn: "Lưu cập nhật sản phẩm này",
    cfg_base_price: "Giá gốc",
    cfg_tagline_keychain: "Khoen kim loại treo chìa khóa",
    cfg_tagline_magnet: "Dán tủ lạnh, bảng từ, case PC",
    cfg_tagline_mica_magnet: "Vát CNC kim cương + nam châm",
    preset_brand: "LADA GIFT Brand",
    preset_couple: "Couple Kỷ Niệm",
    preset_pet: "Kawaii Pet",
    preset_anime: "Anime Chibi",
    cart_heading: "Giỏ hàng của bạn",
    cart_empty_title: "Giỏ hàng của bạn đang trống",
    cart_empty_desc: "Hãy chọn loại sản phẩm, tải ảnh và nhấn '+ Thêm sản phẩm này vào giỏ' ở trên để lên đơn nhé!",
    cart_freeship: "Freeship toàn quốc từ 2c",
    cart_view_3d: "Xem 3D",
    cart_change_photo: "Đổi ảnh",
    cart_viewing_3d: "Đang xem 3D",
    cart_delete_title: "Xóa sản phẩm này",
    item_unit: "c",
    form_code_prefix: "Mã",
    modal_autorotate_on: "Tự động xoay",
    modal_autorotate_off: "Dừng xoay",
    modal_badge_magnet: "NAM CHÂM DẺO",
    modal_badge_mica_magnet: "MICA + NAM CHÂM",
    modal_viewing_from_cart: "Đang xem từ giỏ:",
    modal_previewing_design: "Xem thử thiết kế:",

    // Checkout Form
    form_heading: "Thông tin nhận hàng (Xác nhận qua Zalo):",
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
    success_title: "ĐẶT HÀNG THÀNH CÔNG!",
    success_desc: "LADA GIFT đã nhận được đơn hàng của bạn. Đội ngũ thiết kế sẽ liên hệ qua Zalo / LINE trong 15 phút để gửi bản demo xem trước!",
    success_order_id: "Mã đơn hàng của bạn",
    success_copy: "Sao chép mã",
    success_copied: "Đã sao chép",
    success_total: "Tổng thanh toán",
    success_btn_new: "Hoàn tất & Tiếp tục mua sắm",
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
    hero_card1_badge: "100% Cast Acrylic",
    hero_card1_title: "Fridge Photo Magnet",
    hero_card1_desc: "Permanent strong magnetic grip",
    hero_card2_badge: "Bestseller #1",
    hero_card2_title: "LADA Acrylic Keychain",
    hero_card2_desc: "Diamond CNC Bevel • 2-Sided Print",
    hero_card3_badge: "Custom Photo Print",
    hero_card3_title: "Personalized Gift Set",
    hero_card3_desc: "For your lover & best friend",

    // Showroom 3D
    showroom_tag: "LADA GIFT • 360° 3D Interactive Experience",
    showroom_title: "360° SHOWROOM",
    showroom_desc: "Products rotate continuously in 360°. The orbit smoothly expands on mouse hover and pauses when focusing on a product.",
    showroom_item1_name: "LADA GIFT Acrylic Keychain",
    showroom_item1_sub: "2-sided vibrant print • Heart ring",
    showroom_item1_badge: "Bestseller #1",
    showroom_item2_name: "Commemorative Photo Magnet",
    showroom_item2_sub: "Ultra strong magnetic grip • Waterproof",
    showroom_item2_badge: "Super Strong",
    showroom_item3_name: "Diamond CNC Beveled Acrylic",
    showroom_item3_sub: "Mirror-like brilliant CNC finish",
    showroom_item3_badge: "VIP Premium",
    showroom_item4_name: "Keychain Gift Set",
    showroom_item4_sub: "Personalized from your photo",
    showroom_item4_badge: "Hot Trend",
    showroom_item5_name: "Favorite Character Keychain",
    showroom_item5_sub: "Grade A 99.8% ultra-clear acrylic",
    showroom_item5_badge: "Exclusive",
    showroom_item6_name: "Souvenir Acrylic Keepsake",
    showroom_item6_sub: "Gift From The Heart",
    showroom_item6_badge: "Gift Edition",

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
    per_size_s: "/ standard size S",

    // Size Guide
    sizes_tag: "LADA GIFT • Standard Sizing Guide",
    sizes_title: "CHOOSE YOUR PERFECT ACRYLIC SIZE",
    sizes_subtitle: "Choose the perfect size",
    sizes_desc: "3.5mm solid cast acrylic with CNC diamond beveled edges for brilliant luxury feel.",
    size_s_name: "Size S (7.5 cm)",
    size_s_desc: "Compact • Convenient",
    size_l_name: "Size L (10 cm)",
    size_l_desc: "Popular • Perfect Fit",
    size_xl_name: "Size XL (15 cm)",
    size_xl_desc: "Standout • Premium",
    size_real_badge: "Actual dimension: Size {size} ({dim}) — 3.5mm cast acrylic with diamond CNC bevel",
    size_cta_btn: "Select Size {size} & Customize Now",

    // Design Process
    process_tag: "LADA GIFT • Simple & Fast Ordering",
    process_title: "ACRYLIC ORDER & PRINTING PROCESS",
    process_step_1: "1. Select Product",
    process_step_1_desc: "Choose the product type you want: keychain, photo magnet, or diamond mica magnet",
    process_step_2: "2. Choose Size",
    process_step_2_desc: "Pick your preferred size: S (7.5cm), L (10cm), or XL (15cm)",
    process_step_3: "3. Upload Photo",
    process_step_3_desc: "Upload your personal photo. Our designers will create and send a free 3D demo proof",
    process_step_4: "4. Confirm & Delivery",
    process_step_4_desc: "Approve the design and confirm. Your crafted order is delivered within 3-5 days",

    // Why Choose Us
    why_tag: "LADA GIFT STANDARD",
    why_title: "WHY OVER 10,000+ CUSTOMERS LOVE LADA?",
    why_subtitle: "Craftsmanship that speaks for itself",
    why_feat1_sub: "Ultra HD UV Print",
    why_feat1_title: "Unmatched Photo Sharpness",
    why_feat1_desc: "8-color ultra-high-resolution UV printing. Japanese archival inks guarantee 10+ years of vibrant, fade-free color without peeling.",
    why_feat1_badge: "2400 DPI Resolution",
    why_feat2_sub: "Grade A Acrylic",
    why_feat2_title: "100% Grade A Cast Acrylic",
    why_feat2_desc: "99.8% ultra-clear virgin acrylic. 3.5mm solid cast thickness, CNC diamond beveled for sparkling crystal brilliance.",
    why_feat2_badge: "Crystal Clear 99.8%",
    why_feat3_sub: "Gift Experience",
    why_feat3_title: "Luxury Gift Packaging",
    why_feat3_desc: "Every order is packaged in a premium kraft gift box with silk ribbon and a heartfelt handwritten card, ready for gifting.",
    why_feat3_badge: "Ready For Gifting",
    why_feat4_sub: "Quality Commitment",
    why_feat4_title: "1-to-1 Replacement Guarantee",
    why_feat4_desc: "Free 3D preview mockup sent within 15 minutes. 100% free instant replacement if there is any printing or surface flaw.",
    why_feat4_badge: "10-Year Warranty",
    why_feat4_extra_sub: "Exclusive Diamond Cut",
    why_feat4_extra_title: "Exclusive Diamond CNC Beveling",
    why_feat4_extra_desc: "Integrated optical CNC polishing with diamond bevel cuts, mirror-like crystal gloss reflecting light brilliantly from every angle.",
    why_feat4_extra_badge: "LADA GIFT Exclusive",
    why_feat5_sub: "Cyber Luxe Packaging",
    why_feat5_title: "Luxury Gift Packaging",
    why_feat5_desc: "Every product includes elegant LADA GIFT packaging, velvet protective pouch, and custom greeting card ready for gifting.",
    why_feat5_badge: "Gift Box Included",

    // Gallery
    gallery_tag: "LADA GIFT • Showcase Gallery",
    gallery_title: "FINISHED PRODUCTS GALLERY",
    gallery_desc: "Explore real finished keychains and custom photo magnets crafted by LADA GIFT studio for happy customers.",
    gallery_cat_keychain: "Keychain",
    gallery_cat_magnet: "Magnet",
    gallery_cat_mica_magnet: "Mica Magnet",
    gallery_footer_info: "Crafted authentically at LADA GIFT workshop",
    gallery_footer_badge: "99.8% Clear Acrylic",

    // CTA
    cta_title_1: "TURN YOUR",
    cta_title_2: "FAVORITE MOMENTS",
    cta_title_3: "INTO SOMETHING",
    cta_title_4: "REAL & TIMELESS",
    cta_desc: "Preserve your precious moments in the most unique way with LADA GIFT — A heartfelt gift that delivers love.",
    cta_btn: "Start Designing Now",

    // Footer
    footer_desc: "Premier studio specialized in custom acrylic photo keychains, gifts, and personalized magnets.",
    footer_col_products: "Product Catalog",
    footer_col_policies: "Policy & Support",
    footer_col_contact: "Contact LADA GIFT",
    footer_link_keychain: "Custom Acrylic Keychains",
    footer_link_magnet: "Fridge Photo Magnets",
    footer_link_mica_magnet: "Diamond Beveled Mica Magnets",
    footer_link_giftset: "Personalized Gift Sets",
    footer_link_warranty: "1-to-1 Replacement Warranty",
    footer_link_guide: "Photo Upload Quality Guide",
    footer_link_shipping: "Shipping & Delivery Policy",
    footer_link_privacy: "Privacy Policy",
    footer_location: "Hanoi & Ho Chi Minh City (Worldwide Shipping)",
    footer_rights: "All rights reserved by LADA GIFT. Gift From The Heart.",
    footer_exclusive: "Exclusive Design by LADA GIFT",

    // Product Details Modal
    detail_tag: "Product Details",
    detail_reviews: "(4.9/5 from 2,400+ reviews)",
    detail_spec_acrylic: "3.5mm ultra-transparent cast acrylic with diamond CNC beveled edges",
    detail_spec_print: "8-color high-resolution Japanese digital UV printing at 2400 DPI",
    detail_spec_ring: "100% rustproof titanium-plated stainless steel connector ring",
    detail_spec_magnet: "Permanent Neodymium magnet with strong, secure adherence",
    detail_spec_warranty: "10-year fade-proof warranty & 1-to-1 instant replacement",
    detail_select_size: "Choose size:",
    detail_price_label: "Product price:",
    detail_btn_customize: "Customize & Order Now",

    // Order Modal / Checkout
    modal_title: "LADA GIFT • 3D Design Studio",
    modal_badge: "Real-time 3D Preview",
    modal_sub: "Order multiple photos and products together in one easy checkout",
    modal_3d_mockup: "3D Interactive Mockup",
    modal_drag_rotate: "Drag mouse to rotate 360°",
    cfg_title: "Configure & Upload Product Photo",
    cfg_edit_title: "Editing cart item",
    cfg_cancel_edit: "Cancel edit",
    cfg_step_1: "1. Product type:",
    cfg_step_2: "2. Acrylic size:",
    cfg_step_3: "3. Photo for this item:",
    cfg_upload_btn: "Upload from your device",
    cfg_qty: "Quantity:",
    cfg_add_btn: "Add this item to cart",
    cfg_update_btn: "Save changes to item",
    cfg_base_price: "Base price",
    cfg_tagline_keychain: "Metal ring for keys",
    cfg_tagline_magnet: "For fridge, magnetic boards, PC case",
    cfg_tagline_mica_magnet: "Diamond CNC bevel + magnet",
    preset_brand: "LADA GIFT Brand",
    preset_couple: "Couple Memory",
    preset_pet: "Kawaii Pet",
    preset_anime: "Anime Chibi",
    cart_heading: "Your Shopping Cart",
    cart_empty_title: "Your cart is currently empty",
    cart_empty_desc: "Choose a product type, upload a photo, and click '+ Add this item to cart' above to begin!",
    cart_freeship: "Free shipping nationwide from 2 items",
    cart_view_3d: "View 3D",
    cart_change_photo: "Change photo",
    cart_viewing_3d: "Viewing in 3D",
    cart_delete_title: "Remove this item",
    item_unit: "pc",
    form_code_prefix: "Code",
    modal_autorotate_on: "Auto Rotate",
    modal_autorotate_off: "Stop Rotate",
    modal_badge_magnet: "FLEXIBLE MAGNET",
    modal_badge_mica_magnet: "ACRYLIC + MAGNET",
    modal_viewing_from_cart: "Viewing from cart:",
    modal_previewing_design: "Previewing design:",

    // Checkout Form
    form_heading: "Delivery Information (Confirmation via LINE/Zalo):",
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
    success_title: "ORDER PLACED SUCCESSFULLY!",
    success_desc: "LADA GIFT has received your order. Our design team will message you via Zalo/LINE within 15 minutes to share the 3D demo proof!",
    success_order_id: "Your Order ID",
    success_copy: "Copy code",
    success_copied: "Copied",
    success_total: "Total Payment",
    success_btn_new: "Complete & Continue Shopping",
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
    hero_card1_badge: "อะคริลิกหล่อ 100%",
    hero_card1_title: "แม่เหล็กติดตู้เย็น",
    hero_card1_desc: "แรงดูดถาวรติดแน่นหนา",
    hero_card2_badge: "ขายดีอันดับ 1",
    hero_card2_title: "พวงกุญแจอะคริลิก LADA",
    hero_card2_desc: "เจียระไนขอบเพชร CNC • พิมพ์ 2 ด้าน",
    hero_card3_badge: "พิมพ์ภาพตามสั่ง",
    hero_card3_title: "เซตของขวัญเฉพาะบุคคล",
    hero_card3_desc: "ของขวัญสำหรับคนรักและเพื่อนสนิท",

    // Showroom 3D
    showroom_tag: "LADA GIFT • ประสบการณ์แบบโต้ตอบ 3D 360°",
    showroom_title: "โชว์รูม 360°",
    showroom_desc: "สินค้าหมุนอัตโนมัติ 360° อย่างต่อเนื่อง วงโคจรจะขยายออกเมื่อเลื่อนเมาส์เข้าใกล้ และหยุดชั่วคราวเมื่อชี้ที่สินค้า",
    showroom_item1_name: "พวงกุญแจอะคริลิก LADA GIFT",
    showroom_item1_sub: "พิมพ์คมชัด 2 ด้าน • ห่วงรูปหัวใจ",
    showroom_item1_badge: "ขายดีอันดับ 1",
    showroom_item2_name: "แม่เหล็กภาพความทรงจำ",
    showroom_item2_sub: "แรงดูดแน่นหนา • กันน้ำ 100%",
    showroom_item2_badge: "แรงดูดแน่นพิเศษ",
    showroom_item3_name: "อะคริลิกเจียระไนขอบเพชร",
    showroom_item3_sub: "ขอบ CNC เงางามดุจกระจก",
    showroom_item3_badge: "ระดับพรีเมียม VIP",
    showroom_item4_name: "เซตของขวัญพวงกุญแจ",
    showroom_item4_sub: "พิมพ์ตามภาพถ่ายเฉพาะตัวคุณ",
    showroom_item4_badge: "ยอดนิยม",
    showroom_item5_name: "พวงกุญแจตัวการ์ตูนและไอดอล",
    showroom_item5_sub: "อะคริลิกใสเกรด A 99.8%",
    showroom_item5_badge: "เอกสิทธิ์เฉพาะ",
    showroom_item6_name: "อะคริลิกของขวัญที่ระลึก",
    showroom_item6_sub: "Gift From The Heart",
    showroom_item6_badge: "Gift Edition",

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
    per_size_s: "/ ไซส์ S มาตรฐาน",

    // Size Guide
    sizes_tag: "LADA GIFT • คู่มือมาตรฐานขนาดสินค้า",
    sizes_title: "เลือกขนาดอะคริลิกที่สมบูรณ์แบบ",
    sizes_subtitle: "เลือกขนาดที่เหมาะกับคุณ",
    sizes_desc: "อะคริลิกหล่อแข็งหนา 3.5 มม. เจียระไนขอบเพชร CNC หรูหราและประณีต",
    size_s_name: "ไซส์ S (7.5 ซม.)",
    size_s_desc: "กะทัดรัด • สะดวก",
    size_l_name: "ไซส์ L (10 ซม.)",
    size_l_desc: "ยอดนิยม • พอดี",
    size_xl_name: "ไซส์ XL (15 ซม.)",
    size_xl_desc: "โดดเด่น • พรีเมียม",
    size_real_badge: "ขนาดจริง: ไซส์ {size} ({dim}) — อะคริลิกหนา 3.5 มม. เจียระไนขอบเพชร CNC",
    size_cta_btn: "เลือกไซส์ {size} & ออกแบบทันที",

    // Design Process
    process_tag: "LADA GIFT • สะดวก ง่าย & รวดเร็ว",
    process_title: "ขั้นตอนการสั่งพิมพ์อะคริลิก",
    process_step_1: "1. เลือกสินค้า",
    process_step_1_desc: "เลือกประเภทสินค้าที่ต้องการ: พวงกุญแจ, แม่เหล็ก หรืออะคริลิกแม่เหล็ก",
    process_step_2: "2. เลือกขนาด",
    process_step_2_desc: "เลือกขนาดที่ต้องการ: S (7.5 ซม.), L (10 ซม.) หรือ XL (15 ซม.)",
    process_step_3: "3. อัปโหลดรูปภาพ",
    process_step_3_desc: "อัปโหลดภาพของคุณ ทีมงานจะจัดวางและส่งแบบ 3D ให้ตรวจสอบฟรี",
    process_step_4: "4. ยืนยันคำสั่งซื้อ",
    process_step_4_desc: "ยืนยันแบบและสั่งซื้อ จัดส่งถึงมือคุณอย่างปลอดภัยภายใน 3-5 วัน",

    // Why Choose Us
    why_tag: "LADA GIFT STANDARD",
    why_title: "ทำไมลูกค้ากว่า 10,000+ ท่านจึงเลือก LADA?",
    why_subtitle: "คุณภาพที่สร้างความไว้วางใจ",
    why_feat1_sub: "Ultra HD UV Print",
    why_feat1_title: "พิมพ์ภาพคมชัดเป็นเลิศ",
    why_feat1_desc: "เทคโนโลยีพิมพ์ UV ญี่ปุ่น 8 สี ความละเอียดสูง สีสันสดใส คงทนนานกว่า 10 ปี ไม่ลอกร่อน ไม่เหลือง",
    why_feat1_badge: "ความละเอียด 2400 DPI",
    why_feat2_sub: "Grade A Acrylic",
    why_feat2_title: "อะคริลิกหล่อเกรด A 100%",
    why_feat2_desc: "อะคริลิกแท้บริสุทธิ์ใส 99.8% หนา 3.5 มม. เจียระไนขอบเพชร CNC สวยเงางามดุจคริสตัล",
    why_feat2_badge: "ใสประกายคริสตัล 99.8%",
    why_feat3_sub: "Gift Experience",
    why_feat3_title: "บรรจุกล่องของขวัญสุดหรู",
    why_feat3_desc: "ทุกคำสั่งซื้อบรรจุในกล่องของขวัญคราฟต์สุดหรู ผูกโบสวยงาม พร้อมการ์ดอวยพรเขียนด้วยใจ",
    why_feat3_badge: "พร้อมมอบเป็นของขวัญ",
    why_feat4_sub: "Quality Commitment",
    why_feat4_title: "รับประกันเปลี่ยนใหม่ 1 ต่อ 1",
    why_feat4_desc: "ส่งตัวอย่างแบบ 3D ให้ดูก่อนพิมพ์ฟรีภายใน 15 นาที เปลี่ยนชิ้นใหม่ให้ทันทีหากพบตำหนิการพิมพ์",
    why_feat4_badge: "รับประกัน 10 ปี",
    why_feat4_extra_sub: "Exclusive Diamond Cut",
    why_feat4_extra_title: "เจียระไนขอบเพชร CNC เอกสิทธิ์เฉพาะ",
    why_feat4_extra_desc: "ผสานเทคนิคขัดเงาออปติคอล เจียระไนขอบมุมดุจเพชร เงางามดุจคริสตัล สะท้อนแสงระยิบระยับทุกองศา",
    why_feat4_extra_badge: "เอกสิทธิ์ LADA GIFT",
    why_feat5_sub: "Cyber Luxe Packaging",
    why_feat5_title: "แพ็กเกจของขวัญสุดหรูหรา",
    why_feat5_desc: "ทุกชิ้นมาพร้อมกล่องของขวัญ LADA GIFT สุดหรู ซองกำมะหยี่ถนอมสินค้า และการ์ดอวยพรดีไซน์เฉพาะ เหมาะสำหรับเป็นของขวัญวันเกิด วันครบรอบ",
    why_feat5_badge: "พร้อมกล่องของขวัญ",

    // Gallery
    gallery_tag: "LADA GIFT • Showcase Gallery",
    gallery_title: "แกลเลอรีผลงานผลิตจริง",
    gallery_desc: "ชมภาพชิ้นงานพวงกุญแจและแม่เหล็กพิมพ์ภาพจริงที่ผลิตและจัดส่งให้แก่ลูกค้าคนสำคัญของ LADA GIFT",
    gallery_cat_keychain: "พวงกุญแจ",
    gallery_cat_magnet: "แม่เหล็ก",
    gallery_cat_mica_magnet: "อะคริลิกแม่เหล็ก",
    gallery_footer_info: "สินค้าผลิตจริงจากโรงงาน LADA GIFT",
    gallery_footer_badge: "อะคริลิกใสพิเศษ 99.8%",

    // CTA
    cta_title_1: "เปลี่ยนช่วงเวลา",
    cta_title_2: "ที่คุณประทับใจ",
    cta_title_3: "สู่ผลงานชิ้นเอก",
    cta_title_4: "เลอค่าเหนือกาลเวลา",
    cta_desc: "เก็บรักษาช่วงเวลาอันแสนพิเศษในแบบที่ไม่เหมือนใครกับ LADA GIFT — ของขวัญที่ส่งมอบความรักจากใจ",
    cta_btn: "เริ่มออกแบบทันที",

    // Footer
    footer_desc: "สตูดิโอผู้เชี่ยวชาญการผลิตพวงกุญแจอะคริลิก ของขวัญ และแม่เหล็กพิมพ์ภาพตามสั่งระดับพรีเมียม",
    footer_col_products: "หมวดหมู่สินค้า",
    footer_col_policies: "นโยบาย & การช่วยเหลือ",
    footer_col_contact: "ติดต่อโรงงาน LADA GIFT",
    footer_link_keychain: "พวงกุญแจอะคริลิกสั่งทำ",
    footer_link_magnet: "แม่เหล็กพิมพ์ภาพติดตู้เย็น",
    footer_link_mica_magnet: "อะคริลิกแม่เหล็กเจียระไนขอบเพชร",
    footer_link_giftset: "เซตของขวัญเฉพาะบุคคล",
    footer_link_warranty: "นโยบายการรับประกัน 1 ต่อ 1",
    footer_link_guide: "คำแนะนำการส่งไฟล์ภาพคมชัด",
    footer_link_shipping: "นโยบายการจัดส่งสินค้า",
    footer_link_privacy: "นโยบายความเป็นส่วนตัว",
    footer_location: "ฮานอย & โฮจิมินห์ (จัดส่งทั่วประเทศและต่างประเทศ)",
    footer_rights: "สงวนลิขสิทธิ์โดย LADA GIFT. Gift From The Heart.",
    footer_exclusive: "ดีไซน์เอกสิทธิ์เฉพาะจาก LADA GIFT",

    // Product Details Modal
    detail_tag: "รายละเอียดสินค้า",
    detail_reviews: "(4.9/5 จาก 2,400+ รีวิว)",
    detail_spec_acrylic: "อะคริลิกหล่อแข็งใสพิเศษ 3.5 มม. เจียระไนขอบเพชร CNC",
    detail_spec_print: "พิมพ์ระบบดิจิทัล UV 8 สี ความละเอียดสูง 2400 DPI จากญี่ปุ่น",
    detail_spec_ring: "ห่วงสเตนเลสสตีลเคลือบไทเทเนียม ไม่เป็นสนิม 100%",
    detail_spec_magnet: "แม่เหล็กนีโอไดเมียมถาวร แรงดูดแน่นหนา ไม่หลุดง่าย",
    detail_spec_warranty: "รับประกันสีไม่ซีดจาง 10 ปี & เปลี่ยนชิ้นใหม่ทันทีหากพิมพ์มีตำหนิ",
    detail_select_size: "เลือกขนาด:",
    detail_price_label: "ราคาสินค้า:",
    detail_btn_customize: "ออกแบบ & สั่งทำทันที",

    // Order Modal / Checkout
    modal_title: "LADA GIFT • สตูดิโอออกแบบ 3D",
    modal_badge: "ดูภาพจำลอง 3D แบบเรียลไทม์",
    modal_sub: "สั่งทำหลายรูปภาพและสินค้าในคำสั่งซื้อเดียวได้อย่างสะดวก",
    modal_3d_mockup: "ม็อกอัป 3D เสมือนจริง",
    modal_drag_rotate: "เลื่อนเมาส์เพื่อหมุน 360°",
    cfg_title: "กำหนดค่าและอัปโหลดรูปภาพ",
    cfg_edit_title: "กำลังแก้ไขสินค้าในตะกร้า",
    cfg_cancel_edit: "ยกเลิกแก้ไข",
    cfg_step_1: "1. ประเภทสินค้า:",
    cfg_step_2: "2. ขนาดอะคริลิก:",
    cfg_step_3: "3. รูปภาพสำหรับสินค้านี้:",
    cfg_upload_btn: "อัปโหลดภาพจากอุปกรณ์",
    cfg_qty: "จำนวน:",
    cfg_add_btn: "เพิ่มสินค้านี้ลงในตะกร้า",
    cfg_update_btn: "บันทึกการแก้ไขสินค้านี้",
    cfg_base_price: "ราคาปกติ",
    cfg_tagline_keychain: "ห่วงโลหะสำหรับคล้องกุญแจ",
    cfg_tagline_magnet: "ติดตู้เย็น กระดานแม่เหล็ก เคสคอมพิวเตอร์",
    cfg_tagline_mica_magnet: "เจียระไนขอบเพชร CNC + แม่เหล็ก",
    preset_brand: "LADA GIFT Brand",
    preset_couple: "คู่รัก & ความทรงจำ",
    preset_pet: "สัตว์เลี้ยงน่ารัก",
    preset_anime: "อนิเมะ ชิบิ",
    cart_heading: "ตะกร้าสินค้าของคุณ",
    cart_empty_title: "ตะกร้าสินค้าของคุณว่างอยู่",
    cart_empty_desc: "เลือกประเภทสินค้า อัปโหลดรูปภาพ แล้วกด '+ เพิ่มสินค้านี้ลงในตะกร้า' ด้านบนเพื่อเริ่มสั่งทำ!",
    cart_freeship: "ส่งฟรีทั่วประเทศเมื่อสั่ง 2 ชิ้นขึ้นไป",
    cart_view_3d: "ดูแบบ 3D",
    cart_change_photo: "เปลี่ยนรูป",
    cart_viewing_3d: "กำลังดูแบบ 3D",
    cart_delete_title: "ลบสินค้านี้",
    item_unit: "ชิ้น",
    form_code_prefix: "รหัส",
    modal_autorotate_on: "หมุนอัตโนมัติ",
    modal_autorotate_off: "หยุดหมุน",
    modal_badge_magnet: "แม่เหล็กติดตู้เย็น",
    modal_badge_mica_magnet: "อะคริลิก + แม่เหล็ก",
    modal_viewing_from_cart: "กำลังดูจากตะกร้า:",
    modal_previewing_design: "ดูตัวอย่างแบบ:",

    // Checkout Form
    form_heading: "ข้อมูลการจัดส่ง (ยืนยันแบบผ่าน LINE):",
    form_country: "ประเทศสั่งซื้อ *",
    form_country_vn: "เวียดนาม (รหัส MC)",
    form_country_th: "ไทย (รหัส TL)",
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
    success_copy: "คัดลอกรหัส",
    success_copied: "คัดลอกแล้ว",
    success_total: "ยอดชำระทั้งหมด",
    success_btn_new: "เสร็จสิ้น & เลือกซื้อต่อ",
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
