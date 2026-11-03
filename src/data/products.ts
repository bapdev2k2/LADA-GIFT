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
    descriptionVi: 'Móc khóa mica trong suốt cao cấp, in hình toàn thân, khuôn mặt hoặc nguyên ảnh. Bề mặt sáng bóng, chống xước, có khoen kim loại sang trọng.',
    price: 20000,
    sizes: [
      { label: 'Khuôn mặt', dimension: '5x5 cm', price: 20000 },
      { label: 'Nguyên ảnh', dimension: '5x7.5 cm', price: 25000 },
      { label: 'Toàn thân', dimension: '5x7.5 cm', price: 30000 },
    ],
    category: 'keychain',
    features: ['Mica trong suốt 99.8%', 'In UV 8 màu sắc nét', 'Khoen kim loại cao cấp', 'Tách nền miễn phí'],
    gradient: 'from-pink-500 via-purple-600 to-sky-500',
  },
  {
    id: 'magnet',
    name: 'LADA GIFT Photo Magnet',
    nameVi: 'Ảnh nam châm dẻo LADA GIFT',
    description: 'Custom photo magnet for your fridge or metal surface. Available in square or rectangle sizes.',
    descriptionVi: 'Ảnh nam châm lưu giữ khoảnh khắc ngọt ngào. Khổ vuông bo tròn góc (5x5cm) hoặc chữ nhật (9x6.5cm), nam châm 5 lớp dính chặt tủ lạnh.',
    price: 25000,
    sizes: [
      { label: 'Ảnh vuông (bo tròn góc)', dimension: '5x5 cm', price: 25000 },
      { label: 'Ảnh chữ nhật', dimension: '9x6.5 cm', price: 25000 },
    ],
    category: 'magnet',
    features: ['Nam châm 5 lớp bền 10 năm', 'In HD chuẩn màu', 'Chống nước tuyệt đối', 'Combo ưu đãi chỉ từ 20k/c'],
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
  },
  {
    id: 'mica-magnet',
    name: 'LADA GIFT Diamond Mica Magnet',
    nameVi: 'Ảnh mica nam châm vát kim cương LADA GIFT',
    description: 'Premium crystal acrylic with integrated neodymium magnet backing. Polished diamond bevel edges.',
    descriptionVi: 'Mica acrylic đúc nguyên khối siêu trong suốt, mặt sau tích hợp nam châm Neodymium cực mạnh. Đa dạng kiểu toàn thân, khuôn mặt hoặc nguyên ảnh.',
    price: 17000,
    sizes: [
      { label: 'Size S (Khuôn mặt / Nguyên ảnh)', dimension: '5x5 / 5x7.5 cm', price: 17000 },
      { label: 'Size S (Toàn thân)', dimension: '5x7.5 cm', price: 22000 },
      { label: 'Size L', dimension: '8x8 / 8x10 cm', price: 37000 },
      { label: 'Size XL', dimension: '10x10 / 10x15 cm', price: 43000 },
    ],
    category: 'mica-magnet',
    features: ['Mica Acrylic đúc Grade A', 'Nam châm Neodymium siêu hút', 'Vát kim cương CNC', 'Bề mặt bóng gương'],
    gradient: 'from-sky-400 via-purple-500 to-pink-500',
  },
];

export const galleryItems = [
  {
    id: 1,
    title: 'Thành phẩm Móc khóa Mica LADA GIFT',
    category: 'keychain',
    image: '/gallery/gallery-1.jpg',
    span: 'col-span-2 row-span-2',
    description: 'Móc khóa mica acrylic đúc trong suốt 99.8%, in UV sắc nét và vát cạnh kim cương CNC bóng loáng.',
  },
  {
    id: 2,
    title: 'Nam châm in hình kỷ niệm',
    category: 'magnet',
    image: '/gallery/gallery-2.jpg',
    span: 'col-span-1 row-span-1',
    description: 'Nam châm lực hút cực mạnh, bề mặt bóng loáng, gắn tủ lạnh và bảng từ sang trọng.',
  },
  {
    id: 3,
    title: 'Mica nam châm vát cạnh kim cương',
    category: 'mica-magnet',
    image: '/gallery/gallery-3.jpg',
    span: 'col-span-1 row-span-1',
    description: 'Độ bóng gương cao cấp, mặt sau nam châm chìm tinh tế, món quà lưu niệm độc đáo.',
  },
  {
    id: 4,
    title: 'Set quà tặng móc khóa cá nhân hóa',
    category: 'keychain',
    image: '/gallery/gallery-4.jpg',
    span: 'col-span-2 row-span-1',
    description: 'Gia công chi tiết sắc nét từng góc cạnh theo yêu cầu thiết kế riêng của khách hàng.',
  },
  {
    id: 5,
    title: 'Móc khóa in hình nhân vật yêu thích',
    category: 'keychain',
    image: '/gallery/gallery-5.jpg',
    span: 'col-span-1 row-span-1',
    description: 'Chuẩn màu 100% so với file thiết kế, mực in UV Nhật Bản bền bỉ không phai.',
  },
  {
    id: 6,
    title: 'Mica quà tặng cao cấp LADA GIFT',
    category: 'mica-magnet',
    image: '/gallery/gallery-6.jpg',
    span: 'col-span-1 row-span-1',
    description: 'Chất liệu mica đúc dày 3.5mm chống trầy xước, viền vát quang học bắt sáng lung linh.',
  },
  {
    id: 7,
    title: 'Khoảnh khắc hoàng hôn kỷ niệm LADA GIFT',
    category: 'magnet',
    image: '/gallery/gallery-7.png',
    span: 'col-span-2 row-span-1',
    description: 'Bản in kỷ niệm gia đình ngọt ngào, lưu giữ trọn vẹn từng khoảnh khắc đáng nhớ nhất.',
  },
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
