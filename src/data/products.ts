export interface Product {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  price: number;
  sizes: ProductSize[];
  category: 'keychain' | 'magnet' | 'mica-magnet';
  features: string[];
  gradient: string;
}

export interface ProductSize {
  label: string;
  dimension: string;
  price: number;
}

export const products: Product[] = [
  {
    id: 'keychain',
    name: 'LADA GIFT Keychain',
    nameVi: 'Móc khóa mica in hình LADA GIFT',
    description: 'Transparent premium acrylic keychain with custom print. Crystal clear glossy surface and sturdy metal ring.',
    descriptionVi: 'Móc khóa mica trong suốt cao cấp, in hình cá nhân, idol, thú cưng hoặc kỷ niệm. Bề mặt sáng bóng, chống xước, có khoen kim loại sang trọng.',
    price: 35000,
    sizes: [
      { label: 'S', dimension: '7.5 cm', price: 35000 },
      { label: 'L', dimension: '10 cm', price: 45000 },
      { label: 'XL', dimension: '15 cm', price: 65000 },
    ],
    category: 'keychain',
    features: ['Mica trong suốt 99.8%', 'In UV sắc nét', 'Khoen kim loại bền đẹp', 'Chống trầy xước'],
    gradient: 'from-pink-500 via-purple-600 to-sky-500',
  },
  {
    id: 'magnet',
    name: 'LADA GIFT Photo Magnet',
    nameVi: 'Nam châm in hình LADA GIFT',
    description: 'Custom photo magnet for your fridge or metal surface. Available in square, rectangle or custom die-cut shapes.',
    descriptionVi: 'Nam châm in hình cá nhân hóa lưu giữ khoảnh khắc ngọt ngào. Thiết kế hình vuông, chữ nhật hoặc cắt theo form hình, gắn tủ lạnh và bề mặt kim loại.',
    price: 25000,
    sizes: [
      { label: 'S', dimension: '7.5 cm', price: 25000 },
      { label: 'L', dimension: '10 cm', price: 35000 },
      { label: 'XL', dimension: '15 cm', price: 55000 },
    ],
    category: 'magnet',
    features: ['Nam châm lực hút mạnh', 'In HD chuẩn màu', 'Chống nước tuyệt đối', 'Cắt viền tự do'],
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
  },
  {
    id: 'mica-magnet',
    name: 'LADA GIFT Diamond Mica Magnet',
    nameVi: 'Mica nam châm vát kim cương LADA GIFT',
    description: 'Premium crystal acrylic with integrated neodymium magnet backing. Polished diamond bevel edges.',
    descriptionVi: 'Mica acrylic đúc nguyên khối siêu trong suốt, mặt sau tích hợp nam châm vĩnh cửu. Vát cạnh kim cương CNC bóng loáng, sang trọng làm quà tặng.',
    price: 45000,
    sizes: [
      { label: 'S', dimension: '7.5 cm', price: 45000 },
      { label: 'L', dimension: '10 cm', price: 55000 },
      { label: 'XL', dimension: '15 cm', price: 75000 },
    ],
    category: 'mica-magnet',
    features: ['Mica Acrylic đúc Grade A', 'Nam châm chìm tinh tế', 'Vát kim cương CNC', 'Bề mặt bóng gương'],
    gradient: 'from-sky-400 via-purple-500 to-pink-500',
  },
];

export const galleryItems = [
  { id: 1, title: 'Móc khóa LADA GIFT anime', category: 'keychain', span: 'col-span-2 row-span-2' },
  { id: 2, title: 'Nam châm gia đình hạnh phúc', category: 'magnet', span: 'col-span-1 row-span-1' },
  { id: 3, title: 'Mica thú cưng đáng yêu', category: 'mica-magnet', span: 'col-span-1 row-span-2' },
  { id: 4, title: 'Móc khóa couple kỷ niệm', category: 'keychain', span: 'col-span-1 row-span-1' },
  { id: 5, title: 'Nam châm phong cảnh du lịch', category: 'magnet', span: 'col-span-2 row-span-1' },
  { id: 6, title: 'Mica sự kiện LADA GIFT', category: 'mica-magnet', span: 'col-span-1 row-span-1' },
  { id: 7, title: 'Móc khóa Chibi dễ thương', category: 'keychain', span: 'col-span-1 row-span-1' },
  { id: 8, title: 'Nam châm bé yêu LADA GIFT', category: 'magnet', span: 'col-span-1 row-span-1' },
];

export const whyChooseUs = [
  { icon: 'Sparkles', title: 'In hình sắc nét', description: 'Công nghệ in UV hiện đại, hình ảnh sắc nét, màu sắc rực rỡ không phai theo thời gian.' },
  { icon: 'Diamond', title: 'Mica chất lượng cao', description: 'Sử dụng mica trong suốt cao cấp, độ bền cao, chống trầy xước và chống nước.' },
  { icon: 'Palette', title: 'Cá nhân hóa theo yêu cầu', description: 'Tự do sáng tạo với hình ảnh và thiết kế của riêng bạn. Mỗi sản phẩm là duy nhất.' },
  { icon: 'Crown', title: 'Thiết kế độc quyền', description: 'Đội ngũ thiết kế LADA GIFT hỗ trợ tạo mẫu miễn phí, đảm bảo sản phẩm hoàn hảo nhất.' },
  { icon: 'Gift', title: 'Phù hợp làm quà tặng', description: 'Món quà ý nghĩa cho người thân, bạn bè. Đóng gói đẹp, sẵn sàng làm quà.' },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};
