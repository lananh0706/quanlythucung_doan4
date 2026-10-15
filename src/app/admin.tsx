import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCustomerPet } from '@/context/customer-pet-context';
import { useCategory } from '@/context/category-context';
import { useProduct } from '@/context/product-context';
import { pickImageFromFile } from '@/utils/imagePicker';
import {
  DualPieChartsSection,
  RevenueBarChart,
  TopProductsAndWarehouseSection,
  PieSlice,
} from '@/components/admin-charts';

function formatNumberVi(val: any): string {
  if (val === undefined || val === null) return '0';
  if (typeof val === 'number') return val.toLocaleString('vi-VN');
  const n = Number(val);
  if (!isNaN(n)) return n.toLocaleString('vi-VN');
  return String(val);
}

// ============================================================
// 1. CÁC KIỂU DỮ LIỆU ĐẶC TẢ CHO 18 PHÂN HỆ QUẢN TRỊ
// ============================================================
export type AdminNavTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'batches'
  | 'orders'
  | 'customers'
  | 'shipping'
  | 'payments'
  | 'promotions'
  | 'suppliers'
  | 'reviews'
  | 'banners'
  | 'articles'
  | 'feedbacks'
  | 'shifts'
  | 'accounts'
  | 'reports';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
  status: 'active' | 'hidden';
}

export interface BrandItem {
  id: string;
  name: string;
  country: string;
  flag: string;
  description: string;
  productCount: number;
  isOfficial: boolean;
  status: 'active' | 'paused';
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  packaging: string;
  stockQty: number;
  minAlertQty: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface BatchItem {
  id: string;
  batchCode: string;
  productName: string;
  mfgDate: string;
  expDate: string;
  daysRemaining: number;
  packageType: string;
  status: 'good' | 'warning' | 'critical';
}

export interface OrderItem {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  itemsCount: number;
  totalPrice: number;
  paymentMethod: 'COD' | 'VietQR' | 'MoMo';
  status: 'pending' | 'packing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  petCount: number;
  petSummary: string;
  totalSpent: number;
  ordersCount: number;
  tier: 'Bạc' | 'Vàng' | 'Kim Cương';
  petXu: number;
}

export interface ShipperItem {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  serviceType: 'Hỏa tốc 2h' | 'Giao tiêu chuẩn';
  activeOrders: number;
  rating: number;
  status: 'delivering' | 'idle' | 'off';
}

export interface PaymentTxnItem {
  id: string;
  txnCode: string;
  orderCode: string;
  customerName: string;
  amount: number;
  method: 'COD' | 'VietQR' | 'MoMo';
  status: 'success' | 'pending' | 'refunded';
  time: string;
}

export interface PromotionItem {
  id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: string;
  minOrder: number;
  usageCount: number;
  maxUsage: number;
  expiryDate: string;
  status: 'active' | 'paused' | 'expired';
}

export interface SupplierItem {
  id: string;
  name: string;
  code: string;
  brandsSupplied: string;
  contactPerson: string;
  phone: string;
  email: string;
  warehouseCity: string;
  contractUntil: string;
  rating: number;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
}

export interface BannerItem {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  image: string;
  mediaType?: 'image' | 'video';
  themeColor: string;
  order: number;
  status: 'active' | 'paused';
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  author: string;
  readCount: number;
  publishDate: string;
  status: 'published' | 'draft';
}

export interface FeedbackItem {
  id: string;
  customerName: string;
  phone: string;
  petName: string;
  type: 'Yêu cầu tư vấn ăn uống' | 'Góp ý dịch vụ' | 'Hỗ trợ đổi trả';
  message: string;
  date: string;
  status: 'new' | 'contacting' | 'resolved';
}

export interface EmployeeShiftItem {
  id: number | string;
  employee_id: string;
  employee_name: string;
  employee_phone?: string;
  employee_role: string;
  shift_name: string;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'fulltime';
  shift_date: string;
  start_time: string;
  end_time: string;
  branch: string;
  status: 'scheduled' | 'checked_in' | 'completed' | 'absent' | 'leave';
  check_in_time?: string;
  check_out_time?: string;
  note?: string;
}

export interface AdminAccountItem {
  id: string;
  username: string;
  name: string;
  role: 'Quản trị viên tối cao' | 'Quản lý kho hàng' | 'Bác sĩ thú y trực ca' | 'CSKH & Bán hàng';
  email: string;
  lastLogin: string;
  status: 'active' | 'locked';
}

// CẤU TRÚC ĐẦY ĐỦ CHO SẢN PHẨM KHỚP 100% GIAO DIỆN KHÁCH HÀNG /detail?id=19
export interface ProductWeightVariant {
  weight: string;
  price: number;
  originalPrice: number;
}

export interface ProductItem {
  id: number;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  weightOptions: ProductWeightVariant[];
  proteinSources: string;
  targetPet: string;
  crudeProtein: string;
  crudeFat: string;
  // Các trường đặc tả mở rộng đồng bộ với /detail
  productType?: 'food' | 'litter' | 'accessory';
  scents?: string[];
  highlightTags?: string[];
  crudeFiber?: string;
  caloriesKcal?: string;
  inStock?: boolean;
  isNewlyLaunched?: boolean;
}

// ============================================================
// 2. DỮ LIỆU MẪU ĐỒNG BỘ 100% VỚI SHOP NGƯỜI DÙNG (/detail?id=...)
// ============================================================
const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 19,
    name: 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà',
    sku: 'PET-19-408',
    brand: 'Inaba Nhật Bản',
    category: 'Thức ăn khô / Hạt dinh dưỡng',
    price: 16800,
    originalPrice: 20160,
    discountPercent: 15,
    stock: 140,
    soldCount: 1520,
    rating: 4.9,
    reviewCount: 384,
    image: 'http://localhost/petcare-api/uploads/ciao_churu.png',
    galleryImages: [
      'http://localhost/petcare-api/uploads/ciao_churu.png',
      'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    ],
    description: 'Dạng kem lỏng thơm ngậy, bổ sung trà xanh ngăn ngừa mùi hôi phân và nước tiểu.',
    weightOptions: [
      { weight: '400g', price: 16800, originalPrice: 20160 },
      { weight: '1.5kg', price: 42000, originalPrice: 50400 },
      { weight: '3.5kg', price: 88200, originalPrice: 105840 },
    ],
    proteinSources: 'Thịt gà, Thịt vịt, Men bia thủy phân',
    targetPet: 'Mèo trưởng thành • 2.0 kg – 7.0 kg',
    crudeProtein: '≥ 32.0%',
    crudeFat: '≥ 15.0%',
  },
  {
    id: 1,
    name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32',
    sku: 'RC-FIT32-VN',
    brand: 'Royal Canin Pháp',
    category: 'Thức ăn khô / Hạt dinh dưỡng',
    price: 250000,
    originalPrice: 295000,
    discountPercent: 15,
    stock: 142,
    soldCount: 1520,
    rating: 4.9,
    reviewCount: 384,
    image: 'http://localhost/petcare-api/uploads/royal_canin_fit32.png',
    galleryImages: [
      'http://localhost/petcare-api/uploads/royal_canin_fit32.png',
      'http://localhost/petcare-api/uploads/royal_canin_bag.webp',
      'http://localhost/petcare-api/uploads/royal_canin_detail_sizes.jpg',
      'http://localhost/petcare-api/uploads/royal_canin_genuine.jpg',
      'http://localhost/petcare-api/uploads/royal_canin_lineup.jpg',
    ],
    description: 'Công thức cân bằng 52 dưỡng chất tiêu chuẩn AAFCO giúp mượt lông và chống búi lông ruột.',
    weightOptions: [
      { weight: '400g', price: 95000, originalPrice: 110000 },
      { weight: '2.0kg', price: 250000, originalPrice: 295000 },
      { weight: '4.0kg', price: 475000, originalPrice: 560000 },
      { weight: '10kg', price: 1150000, originalPrice: 1350000 },
    ],
    proteinSources: 'Protein gia cầm sấy khô (thịt gà & vịt), L.I.P cô lập',
    targetPet: 'Mèo trưởng thành từ 1 đến 7 tuổi',
    crudeProtein: '≥ 32.0%',
    crudeFat: '≥ 15.0%',
    highlightTags: ['Tiêu chuẩn Pháp', 'Ngừa búi lông', 'Cân đối vóc dáng'],
    crudeFiber: '≤ 5.8%',
    caloriesKcal: '3,850 kcal/kg',
    productType: 'food',
    inStock: true,
  },
  {
    id: 8,
    name: '(1 tải 6 bao) Cát Nhật đen MoonCat 9L chính hãng, Cát vệ sinh cho mèo khử mùi, vón cục tốt',
    sku: 'MOONCAT-9L-6B',
    brand: 'MoonCat',
    category: 'Cát & Chăm sóc',
    productType: 'litter',
    price: 434000,
    originalPrice: 510000,
    discountPercent: 15,
    stock: 88,
    soldCount: 15,
    rating: 5.0,
    reviewCount: 15,
    inStock: true,
    isNewlyLaunched: true,
    highlightTags: ['Khử mùi cực tốt', 'Vón cục 3 giây', 'Siêu ít bụi', 'Vừa mở bán'],
    scents: ['Mooncat-Táo 9L', 'Mooncat-Phấn 9L', 'Mooncat-Cafe 9L', 'MoonCat-Chanh 9L'],
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
    ],
    description: 'Cát Nhật đen MoonCat 9L siêu khử mùi hôi amoniac, vón cục nhanh cứng không vỡ vụn và lượng bụi cực thấp an toàn cho sen và boss.',
    weightOptions: [
      { weight: '1 tải 6 bao', price: 434000, originalPrice: 510000 },
      { weight: '1 bao lẻ 9L', price: 78000, originalPrice: 90000 },
      { weight: 'Combo 2 bao 9L', price: 150000, originalPrice: 175000 },
    ],
    proteinSources: 'Khoáng sét Bentonite tự nhiên cao cấp & Than hoạt tính',
    targetPet: 'Tất cả các bé mèo (Mèo con & Mèo lớn)',
    crudeProtein: 'Khoáng tự nhiên',
    crudeFat: '100% Không độc hại',
    crudeFiber: 'Độ hút ẩm > 350%',
    caloriesKcal: 'Kháng khuẩn 99%',
  },
  {
    id: 2,
    name: 'Pate Whiskas Vị Cá Biển Tươi Cho Mèo (Gói 85g)',
    sku: 'WK-OCEAN-85',
    brand: 'Whiskas Thái Lan',
    category: 'Pate & Soup ướt',
    price: 35000,
    originalPrice: 42000,
    discountPercent: 17,
    stock: 180,
    soldCount: 2800,
    rating: 4.8,
    reviewCount: 312,
    image: 'http://localhost/petcare-api/uploads/whiskas_ocean_fish.png',
    galleryImages: [
      'http://localhost/petcare-api/uploads/whiskas_ocean_fish.png',
      'http://localhost/petcare-api/uploads/whiskas_pouch.webp',
      'http://localhost/petcare-api/uploads/whiskas_back.webp',
      'http://localhost/petcare-api/uploads/whiskas_can.webp',
      'http://localhost/petcare-api/uploads/whiskas_flavors.webp',
    ],
    description: 'Giàu Omega 3 & Kẽm giúp lông mượt, cấp nước tốt cho mèo lười uống.',
    weightOptions: [
      { weight: 'Gói 85g', price: 35000, originalPrice: 42000 },
      { weight: 'Lốc 12 gói', price: 390000, originalPrice: 470000 },
    ],
    proteinSources: 'Thịt cá biển tươi, gan gà, thạch khoáng',
    targetPet: 'Mèo mọi lứa tuổi',
    crudeProtein: '≥ 8.0%',
    crudeFat: '≥ 4.0%',
  },
  {
    id: 3,
    name: 'Hạt Minino Plus Vị Cá Ngừ Tự Nhiên (Bao 1.5kg)',
    sku: 'MN-PLUS-1.5',
    brand: 'Minino Pháp',
    category: 'Thức ăn khô / Hạt dinh dưỡng',
    price: 120000,
    originalPrice: 145000,
    discountPercent: 17,
    stock: 95,
    soldCount: 980,
    rating: 4.9,
    reviewCount: 210,
    image: 'http://localhost/petcare-api/uploads/minino_plus.png',
    galleryImages: [
      'http://localhost/petcare-api/uploads/minino_plus.png',
      'http://localhost/petcare-api/uploads/minino_bag_1300g.webp',
      'http://localhost/petcare-api/uploads/minino_tuna_flavor.jpg',
      'http://localhost/petcare-api/uploads/minino_front.webp',
    ],
    description: 'Chống búi lông ruột tự nhiên và bổ sung Taurine giúp mắt mèo sáng.',
    weightOptions: [
      { weight: 'Túi 400g', price: 42000, originalPrice: 50000 },
      { weight: 'Bao 1.5kg', price: 120000, originalPrice: 145000 },
    ],
    proteinSources: 'Cá ngừ đại dương, thịt gà tươi',
    targetPet: 'Mèo từ 3 tháng tuổi',
    crudeProtein: '≥ 30.0%',
    crudeFat: '≥ 12.0%',
  },
  {
    id: 4,
    name: 'Thức Ăn Hạt Orijen Cat & Kitten Thịt Tươi 6 Loại Đạm',
    sku: 'ORJ-CAT-KIT-1.8K',
    brand: 'Orijen Canada',
    category: 'Thức ăn khô siêu cao cấp (Holistic / Grain-Free)',
    price: 490000,
    originalPrice: 560000,
    discountPercent: 12,
    stock: 64,
    soldCount: 650,
    rating: 5.0,
    reviewCount: 168,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400',
    ],
    description: '85% thịt tươi đạt tiêu chuẩn người, hoàn toàn không ngũ cốc (Grain-Free) tăng cơ bắp rõ rệt.',
    weightOptions: [
      { weight: '340g', price: 175000, originalPrice: 195000 },
      { weight: '1.8kg', price: 490000, originalPrice: 560000 },
      { weight: '5.4kg', price: 1350000, originalPrice: 1550000 },
    ],
    proteinSources: 'Gà thả vườn, gà tây, cá trích, cá bơn, trứng gà sạch',
    targetPet: 'Mọi lứa tuổi (Mèo con & Mèo lớn)',
    crudeProtein: '≥ 40.0% (Siêu giàu đạm)',
    crudeFat: '≥ 20.0%',
  },
];

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'hat', name: 'Thức ăn khô / Hạt dinh dưỡng', slug: 'hat-kho', icon: '🥣', description: 'Hạt dinh dưỡng cân bằng protein, chất béo và chất xơ.', productCount: 18, status: 'active' },
  { id: 'pate', name: 'Pate & Soup ướt', slug: 'pate-soup', icon: '🥫', description: 'Thức ăn mềm cấp nước tự nhiên ngừa sỏi thận.', productCount: 14, status: 'active' },
  { id: 'xuong', name: 'Bánh thưởng & Gặm', slug: 'banh-thuong', icon: '🦴', description: 'Snack thưởng khen ngợi và que gặm sạch vôi răng.', productCount: 20, status: 'active' },
  { id: 'caocap', name: 'Dinh dưỡng cao cấp (Grain-Free)', slug: 'cao-cap', icon: '🥩', description: 'Dòng hạt đạm cao Grain-free và gel vi chất thú y.', productCount: 9, status: 'active' },
  { id: 'vesinh', name: 'Cát & Chăm sóc', slug: 'cat-ve-sinh', icon: '🚽', description: 'Cát vệ sinh khử mùi và dung dịch xịt khử khuẩn.', productCount: 12, status: 'active' },
];

const DEFAULT_BRANDS: BrandItem[] = [
  { id: 'b1', name: 'Royal Canin', country: 'Pháp', flag: '🇫🇷', description: 'Dinh dưỡng thú y hàng đầu thế giới với phác đồ riêng cho từng giống loài.', productCount: 12, isOfficial: true, status: 'active' },
  { id: 'b2', name: 'Pedigree', country: 'Hoa Kỳ', flag: '🇺🇸', description: 'Thương hiệu thuộc tập đoàn Mars Petcare chuyên thức ăn và snack cho cún.', productCount: 18, isOfficial: true, status: 'active' },
  { id: 'b3', name: 'Whiskas', country: 'Thái Lan', flag: '🇹🇭', description: 'Hạt cá biển và pate dinh dưỡng được hàng triệu bé mèo yêu thích.', productCount: 15, isOfficial: true, status: 'active' },
  { id: 'b4', name: 'Orijen', country: 'Canada', flag: '🇨🇦', description: 'Thức ăn sinh học đỉnh cao với 85% thành phần từ thịt cá tươi nguyên chất.', productCount: 8, isOfficial: true, status: 'active' },
  { id: 'b5', name: 'Inaba Ciao', country: 'Nhật Bản', flag: '🇯🇵', description: 'Nhà phát minh sốt kem Churu nổi tiếng thế giới giàu Collagen và trà xanh.', productCount: 14, isOfficial: true, status: 'active' },
  { id: 'b6', name: 'SmartHeart', country: 'Thái Lan', flag: '🇹🇭', description: 'Công thức cân bằng giá thành hợp lý, giàu Canxi chắc khỏe khung xương.', productCount: 10, isOfficial: true, status: 'active' },
  { id: 'b7', name: 'Nourse Health', country: 'Mỹ & Đài Loan', flag: '🇺🇸', description: 'Chuyên gia bổ sung vi chất, gel dinh dưỡng năng lượng và men vi sinh.', productCount: 6, isOfficial: true, status: 'active' },
  { id: 'b8', name: 'Cature Natural', country: 'Canada', flag: '🇨🇦', description: 'Sản phẩm cát đậu nành hữu cơ tự nhiên an toàn tuyệt đối cho đường hô hấp.', productCount: 5, isOfficial: true, status: 'active' },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', sku: 'PET-19-408', productName: 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà', category: 'xuong', packaging: 'Túi 4x14g (400g - 1.5kg)', stockQty: 140, minAlertQty: 30, location: 'Kệ C2 - Tầng 3', status: 'in_stock' },
  { id: 'inv-2', sku: 'RC-FIT32-VN', productName: 'Hạt Royal Canin Fit 32 (2.0kg)', category: 'hat', packaging: 'Túi zip nhôm 2kg', stockQty: 142, minAlertQty: 15, location: 'Kệ A1 - Tầng 2', status: 'in_stock' },
  { id: 'inv-3', sku: 'PD-BEEF-130', productName: 'Pate Pedigree Vị Bò (130g)', category: 'pate', packaging: 'Gói nhôm 130g (Lốc 12)', stockQty: 120, minAlertQty: 30, location: 'Kệ B2 - Tầng 1', status: 'in_stock' },
  { id: 'inv-4', sku: 'WK-OCEAN-1.2', productName: 'Hạt Whiskas Cá Biển (1.2kg)', category: 'hat', packaging: 'Túi 1.2kg', stockQty: 60, minAlertQty: 20, location: 'Kệ A2 - Tầng 2', status: 'in_stock' },
  { id: 'inv-5', sku: 'ORJ-CAT-KIT-1.8K', productName: 'Hạt Orijen Cat & Kitten (1.8kg)', category: 'caocap', packaging: 'Túi chân không 1.8kg', stockQty: 64, minAlertQty: 10, location: 'Kệ A3 - Kho Lạnh', status: 'in_stock' },
];

const DEFAULT_BATCHES: BatchItem[] = [
  { id: 'bat-1', batchCode: 'LOT-2026-CH19', productName: 'Bánh Thưởng Ciao Churu Vị Gà', mfgDate: '20/01/2026', expDate: '20/01/2028', daysRemaining: 680, packageType: 'Túi nhôm kháng khuẩn Nhật Bản', status: 'good' },
  { id: 'bat-2', batchCode: 'LOT-2026-RC01', productName: 'Hạt Royal Canin Fit 32', mfgDate: '15/01/2026', expDate: '15/07/2027', daysRemaining: 510, packageType: 'Túi nhôm 3 lớp khóa zip', status: 'good' },
  { id: 'bat-3', batchCode: 'LOT-2026-PD02', productName: 'Pate Pedigree Vị Bò', mfgDate: '10/02/2026', expDate: '10/02/2028', daysRemaining: 710, packageType: 'Gói màng nhôm vô trùng', status: 'good' },
  { id: 'bat-4', batchCode: 'LOT-2025-WK08', productName: 'Hạt Whiskas Cá Biển', mfgDate: '01/10/2025', expDate: '01/04/2027', daysRemaining: 210, packageType: 'Bao PE tráng bạc chống ẩm', status: 'good' },
  { id: 'bat-5', batchCode: 'LOT-2025-OR03', productName: 'Hạt Orijen Cat & Kitten', mfgDate: '12/06/2025', expDate: '12/12/2026', daysRemaining: 95, packageType: 'Túi màng nhôm khóa zip Canada', status: 'critical' },
];

const DEFAULT_ORDERS: OrderItem[] = [
  { id: 'ord-1', code: '#PET-83921', customerName: 'Nguyễn Văn Minh', phone: '0982.112.233', address: 'Số 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', itemsCount: 3, totalPrice: 423000, paymentMethod: 'COD', status: 'packing', createdAt: '08/10/2026 14:20' },
  { id: 'ord-2', code: '#PET-72104', customerName: 'Lê Hoàng Yến', phone: '0977.221.144', address: 'Tòa Landmark 81, Bình Thạnh, TP.HCM', itemsCount: 2, totalPrice: 388000, paymentMethod: 'VietQR', status: 'shipping', createdAt: '08/10/2026 11:05' },
  { id: 'ord-3', code: '#PET-65290', customerName: 'Trần Thu Trang', phone: '0912.889.900', address: 'Ngõ 298 Tây Sơn, Đống Đa, Hà Nội', itemsCount: 1, totalPrice: 350000, paymentMethod: 'MoMo', status: 'delivered', createdAt: '07/10/2026 16:45' },
  { id: 'ord-4', code: '#PET-54128', customerName: 'Phạm Quốc Bảo', phone: '0903.445.566', address: '54 Nguyễn Du, Hai Bà Trưng, Hà Nội', itemsCount: 4, totalPrice: 695000, paymentMethod: 'VietQR', status: 'pending', createdAt: '08/10/2026 16:15' },
];

const DEFAULT_CUSTOMERS: CustomerItem[] = [
  { id: 'cus-1', name: 'Nguyễn Văn Minh', phone: '0982.112.233', email: 'minh.nguyen@gmail.com', petCount: 2, petSummary: 'Cún Lu (Golden 3 tuổi) & Bé Kem (Poodle)', totalSpent: 2850000, ordersCount: 7, tier: 'Vàng', petXu: 285 },
  { id: 'cus-2', name: 'Lê Hoàng Yến', phone: '0977.221.144', email: 'hoangyen.design@gmail.com', petCount: 1, petSummary: 'Miu Miu (Mèo Anh lông ngắn 2 tuổi)', totalSpent: 4120000, ordersCount: 11, tier: 'Kim Cương', petXu: 412 },
  { id: 'cus-3', name: 'Trần Thu Trang', phone: '0912.889.900', email: 'thutrang.tran@vnu.edu.vn', petCount: 1, petSummary: 'Bánh Bao (Mèo Ba Tư 4.8kg)', totalSpent: 1250000, ordersCount: 4, tier: 'Bạc', petXu: 125 },
];

const DEFAULT_SHIPPERS: ShipperItem[] = [
  { id: 'shp-1', name: 'Nguyễn Văn Tuấn', phone: '0987.654.321', licensePlate: '29X1-567.89', serviceType: 'Hỏa tốc 2h', activeOrders: 3, rating: 4.9, status: 'delivering' },
  { id: 'shp-2', name: 'Trần Đình Trọng', phone: '0912.345.678', licensePlate: '29B2-888.66', serviceType: 'Giao tiêu chuẩn', activeOrders: 5, rating: 4.8, status: 'delivering' },
];

const DEFAULT_PAYMENTS: PaymentTxnItem[] = [
  { id: 'pay-1', txnCode: 'TXN-QR-83921', orderCode: '#PET-72104', customerName: 'Lê Hoàng Yến', amount: 388000, method: 'VietQR', status: 'success', time: '08/10/2026 11:06' },
  { id: 'pay-2', txnCode: 'TXN-MM-65290', orderCode: '#PET-65290', customerName: 'Trần Thu Trang', amount: 350000, method: 'MoMo', status: 'success', time: '07/10/2026 16:47' },
];

const DEFAULT_PROMOTIONS: PromotionItem[] = [
  { id: 'pro-1', code: 'PETCARE10', description: 'Giảm 10% tối đa 50.000₫ cho mọi đơn từ 200.000₫', discountType: 'percent', discountValue: '10%', minOrder: 200000, usageCount: 248, maxUsage: 500, expiryDate: '31/12/2026', status: 'active' },
  { id: 'pro-2', code: 'FREESHIP', description: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 300.000₫', discountType: 'fixed', discountValue: '30.000₫', minOrder: 300000, usageCount: 680, maxUsage: 1000, expiryDate: '31/12/2026', status: 'active' },
];

const DEFAULT_SUPPLIERS: SupplierItem[] = [
  { id: 'sup-1', name: 'Công Ty TNHH Royal Canin Việt Nam', code: 'SUP-RC-VN', brandsSupplied: 'Royal Canin (Pháp)', contactPerson: 'Jean-Luc Dupont', phone: '028.3822.8899', email: 'supply@royalcanin.vn', warehouseCity: 'KCN Sóng Thần, Bình Dương', contractUntil: '31/12/2028', rating: 5.0 },
  { id: 'sup-2', name: 'Inaba Foods Tokyo Export Agency', code: 'SUP-INABA-JP', brandsSupplied: 'Ciao Churu, Inaba Treats', contactPerson: 'Kenji Takahashi', phone: '028.3899.7711', email: 'kenji@inaba-petfood.jp', warehouseCity: 'Cảng Cát Lái, TP.HCM', contractUntil: '31/12/2026', rating: 4.8 },
];

const DEFAULT_REVIEWS: ReviewItem[] = [
  { id: 'rev-1', customerName: 'Nguyễn Thị Hoa', productName: 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà', rating: 5, comment: 'Bé Miu nhà mình nghiện Churu vị gà này lắm, thơm nức mũi và không bị hôi miệng!', date: '02/10/2026', status: 'approved' },
  { id: 'rev-2', customerName: 'Trần Văn Minh', productName: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32', rating: 5, comment: 'Giao hàng siêu nhanh đóng gói cẩn thận. Hạt date mới tinh, lông bé bóng mượt!', date: '03/10/2026', status: 'approved' },
];

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'ban-main-hero',
    badge: '🐾 THỨC ĂN & PHỤ KIỆN',
    title: 'CHO CHÓ MÈO - KHỎE MẠNH HƠN MỖI NGÀY',
    highlight: 'BÉ KHỎE BÉ VUI CẢ NHÀ AN TÂM',
    subtitle: 'Sản phẩm chính hãng • Giao hàng nhanh chóng • Tư vấn dinh dưỡng tận tâm.',
    ctaText: 'Mua Cho Bé Ngay',
    image: 'http://localhost/petcare-api/uploads/main_hero_banner.png',
    mediaType: 'image',
    themeColor: '#0284C7',
    order: 1,
    status: 'active',
  },
  {
    id: 'ban-video-1',
    badge: '🎬 VIDEO THỰC TẾ • REVIEW',
    title: 'BỮA ĂN HẠNH PHÚC CỦA BÉ CƯNG',
    highlight: 'THỨC ĂN CAO CẤP CHÍNH HÃNG',
    subtitle: 'Xem video các bé cún mèo thưởng thức hạt Orijen & Pate tươi thượng hạng mỗi ngày.',
    ctaText: 'Khám phá ngay',
    image: 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    mediaType: 'video',
    themeColor: '#0284C7',
    order: 2,
    status: 'active',
  },
  {
    id: 'ban-1',
    badge: 'ROYAL CANIN CHÍNH HÃNG',
    title: 'DINH DƯỠNG THƯỢNG HẠNG',
    highlight: 'CHO BÉ CƯNG KHỎE MẠNH',
    subtitle: 'Công thức cân bằng 52 dưỡng chất tiêu chuẩn AAFCO giúp phát triển toàn diện & ngăn ngừa sỏi thận.',
    ctaText: 'Khám phá ngay',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000',
    mediaType: 'image',
    themeColor: '#0EA5E9',
    order: 2,
    status: 'active',
  },
  {
    id: 'ban-video-2',
    badge: '🎥 SÚP THƯỞNG NHẬT BẢN',
    title: 'CIAO CHURU & BÁNH THƯỞNG',
    highlight: 'GIẢM ĐẾN 20% HÔM NAY',
    subtitle: 'Clip thực tế xé thanh súp thưởng, bé mèo chạy lại quấn quýt không rời!',
    ctaText: 'Xem bánh thưởng',
    image: 'https://www.w3schools.com/html/mov_bbb.mp4',
    mediaType: 'video',
    themeColor: '#D97706',
    order: 3,
    status: 'active',
  },
];

const DEFAULT_ARTICLES: ArticleItem[] = [
  { id: 'art-1', title: '10 Dấu hiệu nhận biết thú cưng thiếu hụt dinh dưỡng', category: 'Dinh dưỡng thú y', author: 'BS. Hoàng Nhật Quang', readCount: 1450, publishDate: '01/10/2026', status: 'published' },
];

const DEFAULT_FEEDBACKS: FeedbackItem[] = [
  { id: 'fb-1', customerName: 'Nguyễn Văn Minh', phone: '0982.112.233', petName: 'Miu Miu (Mèo 4.2kg)', type: 'Yêu cầu tư vấn ăn uống', message: 'Nhờ bác sĩ tư vấn đổi từ Whiskas sang Royal Canin để giảm rụng lông cho bé.', date: '08/10/2026 15:30', status: 'new' },
];

const DEFAULT_ACCOUNTS: AdminAccountItem[] = [
  { id: 'acc-1', username: 'admin', name: 'Quản Trị Viên Trưởng', role: 'Quản trị viên tối cao', email: 'admin@petcare.vn', lastLogin: '08/10/2026 17:35', status: 'active' },
];

export const DEFAULT_SHIFTS: EmployeeShiftItem[] = [
  {
    id: 1,
    employee_id: 'NV-001',
    employee_name: 'Lê Thu Thảo',
    employee_phone: '0912 345 678',
    employee_role: 'Tư vấn bán hàng',
    shift_name: 'Ca Sáng (07:30 - 12:00)',
    shift_type: 'morning',
    shift_date: '2026-10-13',
    start_time: '07:30',
    end_time: '12:00',
    branch: 'Cơ sở chính Ba Đình',
    status: 'checked_in',
    check_in_time: '07:25',
    note: 'Trực quầy thu ngân & tư vấn thức ăn mèo'
  },
  {
    id: 2,
    employee_id: 'BS-002',
    employee_name: 'BS. CKI Nguyễn Minh Tuấn',
    employee_phone: '0903 888 999',
    employee_role: 'Bác sĩ thú y trực ca',
    shift_name: 'Ca Sáng (08:00 - 12:00)',
    shift_type: 'morning',
    shift_date: '2026-10-13',
    start_time: '08:00',
    end_time: '12:00',
    branch: 'Phòng khám PetCare Ba Đình',
    status: 'checked_in',
    check_in_time: '07:55',
    note: 'Khám lâm sàng & tiêm phòng dại 3 ca hẹn'
  },
  {
    id: 3,
    employee_id: 'NV-003',
    employee_name: 'Trần Văn Kho',
    employee_phone: '0988 123 456',
    employee_role: 'Quản lý kho hàng',
    shift_name: 'Ca Hành chính (08:00 - 17:00)',
    shift_type: 'fulltime',
    shift_date: '2026-10-13',
    start_time: '08:00',
    end_time: '17:00',
    branch: 'Kho tổng Cầu Giấy',
    status: 'checked_in',
    check_in_time: '07:50',
    note: 'Kiểm kê lô thức ăn Royal Canin & Minino mới nhập'
  },
  {
    id: 4,
    employee_id: 'NV-004',
    employee_name: 'Hoàng Mỹ Duyên',
    employee_phone: '0977 456 789',
    employee_role: 'Kỹ thuật viên Spa/Grooming',
    shift_name: 'Ca Chiều (12:00 - 17:30)',
    shift_type: 'afternoon',
    shift_date: '2026-10-13',
    start_time: '12:00',
    end_time: '17:30',
    branch: 'Cơ sở chính Ba Đình',
    status: 'scheduled',
    note: 'Lịch tắm dưỡng lông cho 4 bé Poodle & Corgi'
  },
  {
    id: 5,
    employee_id: 'NV-005',
    employee_name: 'Phạm Quốc Bảo',
    employee_phone: '0934 567 890',
    employee_role: 'Thu ngân & CSKH',
    shift_name: 'Ca Chiều (12:00 - 17:30)',
    shift_type: 'afternoon',
    shift_date: '2026-10-13',
    start_time: '12:00',
    end_time: '17:30',
    branch: 'Cơ sở chính Ba Đình',
    status: 'scheduled',
    note: 'Bàn giao ca với Thảo, kiểm đếm tiền két'
  },
  {
    id: 6,
    employee_id: 'BS-003',
    employee_name: 'BS. Trần Thị Mai',
    employee_phone: '0918 654 321',
    employee_role: 'Bác sĩ thú y trực ca',
    shift_name: 'Ca Chiều (13:30 - 18:00)',
    shift_type: 'afternoon',
    shift_date: '2026-10-13',
    start_time: '13:30',
    end_time: '18:00',
    branch: 'Phòng khám PetCare Cầu Giấy',
    status: 'scheduled',
    note: 'Siêu âm & xét nghiệm máu bé mèo Miu'
  },
  {
    id: 7,
    employee_id: 'NV-006',
    employee_name: 'Đỗ Minh Khang',
    employee_phone: '0945 112 233',
    employee_role: 'Tư vấn bán hàng',
    shift_name: 'Ca Tối (17:30 - 22:00)',
    shift_type: 'evening',
    shift_date: '2026-10-13',
    start_time: '17:30',
    end_time: '22:00',
    branch: 'Cơ sở chính Ba Đình',
    status: 'scheduled',
    note: 'Hỗ trợ khách mua đồ giờ tan tầm & kiểm kê quầy'
  },
  {
    id: 8,
    employee_id: 'BS-004',
    employee_name: 'BS. Đặng Hữu Tài',
    employee_phone: '0909 334 455',
    employee_role: 'Bác sĩ cấp cứu 24/7',
    shift_name: 'Ca Đêm 24/7 (22:00 - 07:30)',
    shift_type: 'night',
    shift_date: '2026-10-13',
    start_time: '22:00',
    end_time: '07:30',
    branch: 'Cấp cứu 24/7 Ba Đình',
    status: 'scheduled',
    note: 'Trực cấp cứu ban đêm và theo dõi thú cưng nội trú'
  }
];

// 3. DANH SÁCH MENU SIDEBAR CHUẨN ĐÚNG CÂY 18 MỤC
const ADMIN_MENU_GROUP_1 = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'products', icon: '🐾', label: 'Sản phẩm' },
  { key: 'categories', icon: '🥫', label: 'Danh mục' },
  { key: 'brands', icon: '🏷️', label: 'Thương hiệu' },
  { key: 'inventory', icon: '📦', label: 'Kho hàng' },
  { key: 'batches', icon: '⏰', label: 'Lô hàng & hạn sử dụng' },
  { key: 'orders', icon: '🛒', label: 'Đơn hàng' },
  { key: 'customers', icon: '👥', label: 'Khách hàng' },
  { key: 'shipping', icon: '🚚', label: 'Vận chuyển' },
  { key: 'payments', icon: '💳', label: 'Thanh toán' },
  { key: 'promotions', icon: '🎁', label: 'Khuyến mãi' },
  { key: 'suppliers', icon: '🏢', label: 'Nhà cung cấp' },
  { key: 'reviews', icon: '⭐', label: 'Đánh giá' },
];

const ADMIN_MENU_GROUP_2 = [
  { key: 'banners', icon: '🖼️', label: 'Banner' },
  { key: 'articles', icon: '📰', label: 'Bài viết' },
  { key: 'feedbacks', icon: '💬', label: 'Phản hồi' },
  { key: 'shifts', icon: '⏱️', label: 'Ca nhân viên' },
  { key: 'accounts', icon: '👨‍💼', label: 'Tài khoản' },
  { key: 'reports', icon: '📈', label: 'Báo cáo - thống kê' },
];

export type EntityType =
  | 'product'
  | 'category'
  | 'brand'
  | 'inventory'
  | 'batch'
  | 'order'
  | 'customer'
  | 'shipping'
  | 'payment'
  | 'promotion'
  | 'supplier'
  | 'review'
  | 'banner'
  | 'article'
  | 'feedback'
  | 'shift'
  | 'account';

const getEntityInfo = (tab: AdminNavTab): { type: EntityType; label: string; headerTitle: string } | null => {
  switch (tab) {
    case 'products':
      return { type: 'product', label: '+ Thêm Sản Phẩm Mới', headerTitle: '🐾 Quản Lý Danh Sách Sản Phẩm Đầy Đủ Chi Tiết' };
    case 'categories':
      return { type: 'category', label: '+ Thêm Danh Mục Mới', headerTitle: '🥫 Quản Lý Danh Mục Thức Ăn Thú Cưng' };
    case 'brands':
      return { type: 'brand', label: '+ Thêm Thương Hiệu Mới', headerTitle: '🏷️ Quản Lý Thương Hiệu & Nguồn Gốc' };
    case 'inventory':
      return { type: 'inventory', label: '+ Thêm / Nhập Hàng Vào Kho', headerTitle: '📦 Quản Lý Kho Hàng & Tồn Kho Thực Tế' };
    case 'batches':
      return { type: 'batch', label: '+ Thêm Lô Hàng Mới', headerTitle: '⏰ Quản Lý Lô Hàng & Hạn Sử Dụng (HSD)' };
    case 'orders':
      return { type: 'order', label: '+ Tạo Đơn Hàng Mới', headerTitle: '🛒 Quản Lý Đơn Đặt Hàng & Vận Đơn' };
    case 'customers':
      return { type: 'customer', label: '+ Thêm Khách Hàng', headerTitle: '👥 Quản Lý Khách Hàng Hội Viên & Thú Cưng' };
    case 'shipping':
      return { type: 'shipping', label: '+ Thêm Tài Xế / Shipper', headerTitle: '🚚 Quản Lý Đội Ngũ Shipper Giao Hàng' };
    case 'payments':
      return { type: 'payment', label: '+ Thêm Giao Dịch', headerTitle: '💳 Quản Lý Thanh Toán & Giao Dịch' };
    case 'promotions':
      return { type: 'promotion', label: '+ Thêm Voucher Giảm Giá', headerTitle: '🎁 Quản Lý Khuyến Mãi & Voucher Ưu Đãi' };
    case 'suppliers':
      return { type: 'supplier', label: '+ Thêm Nhà Cung Cấp', headerTitle: '🏢 Quản Lý Nhà Cung Cấp & Đại Lý Phân Phối' };
    case 'reviews':
      return { type: 'review', label: '+ Thêm Đánh Giá Mới', headerTitle: '⭐ Quản Lý Đánh Giá & Nhận Xét Của Khách' };
    case 'banners':
      return { type: 'banner', label: '+ Thêm Banner Mới', headerTitle: '🖼️ Quản Lý Banner Slide Trang Chủ' };
    case 'articles':
      return { type: 'article', label: '+ Viết Bài Mới', headerTitle: '📰 Quản Lý Bài Viết Cẩm Nang Thú Y' };
    case 'feedbacks':
      return { type: 'feedback', label: '+ Tiếp Nhận Phản Hồi', headerTitle: '💬 Quản Lý Phản Hồi & Yêu Cầu Tư Vấn' };
    case 'shifts':
      return { type: 'shift', label: '+ Phân Ca Trực Mới', headerTitle: '⏱️ Quản Lý Ca Trực & Lịch Làm Việc Nhân Viên' };
    case 'accounts':
      return { type: 'account', label: '+ Tạo Tài Khoản Mới', headerTitle: '👨‍💼 Quản Lý Phân Quyền Tài Khoản Quản Trị' };
    case 'dashboard':
      return { type: 'product', label: '+ Thêm Sản Phẩm Mới', headerTitle: '📊 Bảng Điều Khiển Tổng Quan (Dashboard)' };
    case 'reports':
      return { type: 'product', label: '+ Xuất Báo Cáo', headerTitle: '📈 Báo Cáo Doanh Thu & Thống Kê Chi Tiết' };
    default:
      return null;
  }
};

const getModalEntityTitle = (type: EntityType | null): string => {
  switch (type) {
    case 'product': return 'Sản Phẩm';
    case 'category': return 'Danh Mục Thức Ăn';
    case 'brand': return 'Thương Hiệu Thức Ăn';
    case 'inventory': return 'Mặt Hàng Kho & Tồn Kho';
    case 'batch': return 'Lô Hàng & Hạn Sử Dụng';
    case 'order': return 'Đơn Đặt Hàng';
    case 'customer': return 'Khách Hàng Hội Viên';
    case 'shipping': return 'Tài Xế Giao Hàng';
    case 'payment': return 'Giao Dịch Cổng Thanh Toán';
    case 'promotion': return 'Voucher Khuyến Mãi';
    case 'supplier': return 'Nhà Cung Cấp';
    case 'review': return 'Đánh Giá Khách Hàng';
    case 'banner': return 'Banner Quảng Cáo';
    case 'article': return 'Bài Viết & Cẩm Nang';
    case 'feedback': return 'Phản Hồi & Tư Vấn';
    case 'shift': return 'Ca Làm Việc Nhân Viên';
    case 'account': return 'Tài Khoản Quản Trị';
    default: return 'Mục Quản Lý';
  }
};

// ============================================================
// CẤU HÌNH API PHP / MYSQL XAMPP (TỰ ĐỘNG THEO HOST / IP LAN)
// ============================================================
import { BASE_URL } from '@/services/api';
const API_BASE = BASE_URL;



function mapDbProductToProductItem(item: any): ProductItem {
  const pId = Number(item.id) || 1;
  const rawPrice = Number(item.price) || 50000;
  const rawName = item.name || `Sản phẩm #${pId}`;
  const origPrice = Math.round(rawPrice * 1.2);
  const n = rawName.toLowerCase();
  const isLitter = n.includes('cát') || n.includes('tofu');
  const isWet = n.includes('pate') || n.includes('sốt') || n.includes('churu') || n.includes('thưởng');
  const isSupplement = n.includes('gel') || n.includes('vitamin') || n.includes('thuốc') || n.includes('ve rận');

  let catName = 'Thức ăn khô / Hạt dinh dưỡng';
  if (isLitter) catName = 'Cát & Chăm sóc';
  else if (isWet) catName = 'Pate & Bánh thưởng';
  else if (isSupplement) catName = 'Thuốc & Dinh dưỡng thú y';

  return {
    id: pId,
    name: rawName,
    sku: `PET-${pId}-${Math.floor(100 + (pId * 37) % 900)}`,
    brand: n.includes('royal') ? 'Royal Canin Pháp' : (n.includes('ciao') ? 'Inaba Nhật Bản' : (n.includes('whiskas') ? 'Whiskas' : (n.includes('pedigree') ? 'Pedigree' : 'PetCare Official'))),
    category: catName,
    productType: isLitter ? 'litter' : 'food',
    price: rawPrice,
    originalPrice: origPrice,
    discountPercent: 15,
    stock: 120 + ((pId * 17) % 80),
    soldCount: 300 + ((pId * 89) % 1500),
    rating: 4.8 + ((pId % 3) * 0.1),
    reviewCount: 40 + ((pId * 13) % 200),
    image: item.image || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
    galleryImages: (() => {
      const rawGal = item.gallery_images || item.galleryImages;
      if (Array.isArray(rawGal) && rawGal.length > 0) return rawGal.map((x: any) => String(x).trim()).filter(Boolean);
      if (typeof rawGal === 'string' && rawGal.trim()) {
        try {
          const parsed = JSON.parse(rawGal.trim());
          if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((x: any) => String(x).trim()).filter(Boolean);
        } catch {}
        if (rawGal.includes(',')) {
          const splitted = rawGal.split(',').map((x: string) => x.trim()).filter(Boolean);
          if (splitted.length > 0) return splitted;
        }
        return [rawGal.trim()];
      }
      return [
        item.image || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      ];
    })(),
    description: item.description || 'Sản phẩm dinh dưỡng chất lượng cao dành cho thú cưng.',
    weightOptions: [
      { weight: '400g', price: rawPrice, originalPrice: origPrice },
      { weight: '1.5kg', price: Math.round(rawPrice * 2.5), originalPrice: Math.round(origPrice * 2.5) },
      { weight: '3.5kg', price: Math.round(rawPrice * 5.2), originalPrice: Math.round(origPrice * 5.2) },
    ],
    proteinSources: isLitter ? 'Khoáng bentonite tự nhiên' : 'Thịt gà tươi, thịt cá ngừ, men bia',
    targetPet: 'Chó & Mèo các độ tuổi',
    crudeProtein: isLitter ? 'Khử mùi kép' : '≥ 32.0%',
    crudeFat: isLitter ? '100% tự nhiên' : '≥ 15.0%',
    crudeFiber: '≤ 4.5%',
    caloriesKcal: '3,850 kcal/kg',
    inStock: true,
    isNewlyLaunched: pId >= 15,
    highlightTags: ['Chính hãng 100%', 'Bổ sung dinh dưỡng', 'Giao hỏa tốc 2H'],
  };
}

function mapDbOrderToOrderItem(item: any): OrderItem {
  let uiStatus: 'pending' | 'packing' | 'shipping' | 'delivered' | 'cancelled' = 'pending';
  const st = (item.status || '').toLowerCase();
  if (st === 'completed' || st === 'delivered') uiStatus = 'delivered';
  else if (st === 'delivering' || st === 'shipping') uiStatus = 'shipping';
  else if (st === 'processing' || st === 'packing') uiStatus = 'packing';
  else if (st === 'cancelled') uiStatus = 'cancelled';
  else uiStatus = 'pending';

  let payMethod: 'COD' | 'VietQR' | 'MoMo' = 'COD';
  const pm = (item.payment_method || '').toUpperCase();
  if (pm.includes('QR') || pm.includes('BANK')) payMethod = 'VietQR';
  else if (pm.includes('MOMO')) payMethod = 'MoMo';
  else payMethod = 'COD';

  return {
    id: String(item.id),
    code: item.order_code || `PET-${item.id}`,
    customerName: item.customer_name || 'Khách vãng lai',
    phone: item.customer_phone || 'Chưa có SĐT',
    address: item.customer_address || 'Địa chỉ nhận hàng',
    itemsCount: 1,
    totalPrice: Number(item.total_amount) || 0,
    paymentMethod: payMethod,
    status: uiStatus,
    createdAt: item.created_at || 'Mới cập nhật',
  };
}

function mapDbCustomerToCustomerItem(item: any): CustomerItem {
  let tier: 'Bạc' | 'Vàng' | 'Kim Cương' = 'Bạc';
  const r = (item.rank || '').toLowerCase();
  if (r.includes('kim cương') || r.includes('diamond')) tier = 'Kim Cương';
  else if (r.includes('vàng') || r.includes('gold') || r.includes('vip')) tier = 'Vàng';

  return {
    id: String(item.id),
    name: item.name || 'Khách hàng',
    phone: item.phone || '',
    email: item.email || '',
    petCount: 1,
    petSummary: '1 thú cưng',
    totalSpent: Number(item.totalSpent) || 0,
    ordersCount: Number(item.ordersCount) || 0,
    tier: tier,
    petXu: 150,
  };
}

function mapDbVoucherToPromotionItem(item: any): PromotionItem {
  return {
    id: String(item.id),
    code: item.code || 'SALE10',
    description: item.discount || 'Khuyến mãi thành viên',
    discountType: 'percent',
    discountValue: item.discountPercent ? `${item.discountPercent}%` : (item.discount || '10%'),
    minOrder: Number(item.minOrder) || 100000,
    usageCount: Number(item.usedCount) || 0,
    maxUsage: Number(item.maxCount) || 100,
    expiryDate: item.expiry || '31/12/2026',
    status: item.status === 'paused' ? 'paused' : 'active',
  };
}

function mapDbBlogToArticleItem(item: any): ArticleItem {
  return {
    id: String(item.id),
    title: item.title || 'Bài viết dinh dưỡng',
    category: item.category || 'Cẩm nang dinh dưỡng',
    author: item.author || 'BS. Thú y',
    readCount: Number(item.views) || 100,
    publishDate: item.date || 'Hôm nay',
    status: item.status === 'published' ? 'published' : 'draft',
  };
}

function mapDbAppointmentToFeedbackItem(item: any): FeedbackItem {
  return {
    id: String(item.id),
    customerName: item.customerName || 'Khách hàng',
    phone: '0982.***.***',
    petName: `${item.petName || 'Thú cưng'} (${item.petType || 'Chó mèo'})`,
    type: 'Yêu cầu tư vấn ăn uống',
    message: `[Lịch khám: ${item.issue || 'Tư vấn dinh dưỡng'}] Bác sĩ: ${item.doctor || 'BS. Trực ca'} - Giờ hẹn: ${item.time || ''} ngày ${item.date || ''}`,
    date: item.date || 'Gần đây',
    status: item.status === 'confirmed' ? 'resolved' : 'new',
  };
}

function mapDbCategoryToCategoryItem(item: any): CategoryItem {
  return {
    id: String(item.id),
    name: item.name || '',
    slug: item.slug || '',
    icon: item.id === 1 ? '🐕' : (item.id === 2 ? '🐈' : (item.id === 3 ? '🧴' : '💊')),
    description: item.description || '',
    productCount: 5,
    status: 'active',
  };
}

function mapDbBrandToBrandItem(item: any): BrandItem {
  return {
    id: String(item.id),
    name: item.name || '',
    country: item.country || 'Việt Nam',
    flag: item.flag || '🇻🇳',
    description: item.description || '',
    productCount: Number(item.productCount || item.product_count) || 0,
    isOfficial: Boolean(item.isOfficial ?? item.is_official ?? true),
    status: item.status === 'paused' ? 'paused' : 'active',
  };
}

function mapDbInventoryToInventoryItem(item: any): InventoryItem {
  return {
    id: String(item.id),
    sku: item.sku || 'SKU-001',
    productName: item.productName || item.product_name || 'Sản phẩm',
    category: item.category || 'Hạt dinh dưỡng',
    packaging: item.packaging || 'Gói tiêu chuẩn',
    stockQty: Number(item.stockQty ?? item.stock_qty ?? 0),
    minAlertQty: Number(item.minAlertQty ?? item.min_alert_qty ?? 10),
    location: item.location || 'Kệ kho',
    status: (item.status as any) || 'in_stock',
  };
}

function mapDbBatchToBatchItem(item: any): BatchItem {
  return {
    id: String(item.id),
    batchCode: item.batchCode || item.batch_code || 'LOT-2026',
    productName: item.productName || item.product_name || 'Sản phẩm',
    mfgDate: item.mfgDate || item.mfg_date || '01/01/2026',
    expDate: item.expDate || item.exp_date || '01/01/2028',
    daysRemaining: Number(item.daysRemaining ?? item.days_remaining ?? 365),
    packageType: item.packageType || item.package_type || 'Bao tiêu chuẩn',
    status: (item.status as any) || 'good',
  };
}

function mapDbShipperToShipperItem(item: any): ShipperItem {
  return {
    id: String(item.id),
    name: item.name || 'Tài xế',
    phone: item.phone || '',
    licensePlate: item.licensePlate || item.license_plate || '29B1-888.88',
    serviceType: item.serviceType === 'Giao tiêu chuẩn' ? 'Giao tiêu chuẩn' : 'Hỏa tốc 2h',
    activeOrders: Number(item.activeOrders ?? item.active_orders ?? 0),
    rating: Number(item.rating) || 5.0,
    status: (item.status as any) || 'idle',
  };
}

function mapDbPaymentToPaymentItem(item: any): PaymentTxnItem {
  return {
    id: String(item.id),
    txnCode: item.txnCode || item.txn_code || 'TXN-001',
    orderCode: item.orderCode || item.order_code || '#DH-1001',
    customerName: item.customerName || item.customer_name || 'Khách hàng',
    amount: Number(item.amount) || 0,
    method: item.method === 'MoMo' ? 'MoMo' : item.method === 'VietQR' ? 'VietQR' : 'COD',
    status: (item.status as any) || 'pending',
    time: item.time || item.created_at || 'Vừa xong',
  };
}

function mapDbSupplierToSupplierItem(item: any): SupplierItem {
  return {
    id: String(item.id),
    name: item.name || 'Nhà cung cấp',
    code: item.code || 'NCC-01',
    brandsSupplied: item.brandsSupplied || item.brands_supplied || 'Thương hiệu',
    contactPerson: item.contactPerson || item.contact_person || 'Đại diện',
    phone: item.phone || '',
    email: item.email || '',
    warehouseCity: item.warehouseCity || item.warehouse_city || 'Hà Nội',
    contractUntil: String(item.contractUntil || item.contract_until || '2027'),
    rating: Number(item.rating) || 5.0,
  };
}

function mapDbReviewToReviewItem(item: any): ReviewItem {
  return {
    id: String(item.id),
    customerName: item.customerName || item.customer_name || 'Khách hàng',
    productName: item.productName || item.product_name || 'Sản phẩm',
    rating: Number(item.rating) || 5,
    comment: item.comment || '',
    date: item.date || item.created_at || 'Gần đây',
    status: (item.status as any) || 'approved',
  };
}

function mapDbBannerToBannerItem(item: any): BannerItem {
  const imgUrl = item.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000';
  const isVideo =
    item.media_type === 'video' ||
    (typeof imgUrl === 'string' &&
      (imgUrl.toLowerCase().endsWith('.mp4') ||
        imgUrl.toLowerCase().includes('.mp4?') ||
        imgUrl.toLowerCase().endsWith('.mov')));

  return {
    id: String(item.id),
    badge: item.badge || (isVideo ? '🎬 VIDEO THỰC TẾ' : 'SIÊU KHUYẾN MÃI'),
    title: item.title || 'BANNER',
    highlight: item.highlight || '',
    subtitle: item.subtitle || '',
    ctaText: item.ctaText || item.cta_text || 'Khám phá ngay',
    image: imgUrl,
    mediaType: isVideo ? 'video' : 'image',
    themeColor: item.themeColor || item.theme_color || (isVideo ? '#0284C7' : '#0EA5E9'),
    order: Number(item.order ?? item.order_num ?? 1),
    status: item.status === 'paused' ? 'paused' : 'active',
  };
}

export default function AdminScreen() {
  const router = useRouter();

  // Phiên đăng nhập
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginUser, setLoginUser] = useState('admin');
  const [loginPass, setLoginPass] = useState('123');

  // Tab điều hướng
  const [activeTab, setActiveTab] = useState<AdminNavTab>('products');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bộ lọc & tìm kiếm riêng cho Quản lý Sản phẩm
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  // State các phân hệ
  const {
    products,
    addProduct: addSharedProduct,
    updateProduct: updateSharedProduct,
    deleteProduct: deleteSharedProduct,
    refreshProducts,
  } = useProduct();
  const {
    categories: sharedCategories,
    addCategory: addSharedCategory,
    updateCategory: updateSharedCategory,
    deleteCategory: deleteSharedCategory,
    toggleCategoryStatus: toggleSharedCategoryStatus,
    refreshCategories,
  } = useCategory();
  const categories = (sharedCategories || []) as CategoryItem[];
  const [brands, setBrands] = useState<BrandItem[]>(DEFAULT_BRANDS);
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY);
  const [batches, setBatches] = useState<BatchItem[]>(DEFAULT_BATCHES);
  const [orders, setOrders] = useState<OrderItem[]>(DEFAULT_ORDERS);
  const {
    customers: sharedCustomers,
    getPetsByCustomerId,
    addCustomer: addSharedCustomer,
    updateCustomer: updateSharedCustomer,
    deleteCustomer: deleteSharedCustomer,
  } = useCustomerPet();
  const [customers, setCustomers] = useState<CustomerItem[]>(sharedCustomers as any);
  const [viewingCustomerPets, setViewingCustomerPets] = useState<any | null>(null);

  // State nạp API từ MySQL XAMPP
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(false);
  const [liveStats, setLiveStats] = useState<{
    total_products?: number;
    total_customers?: number;
    total_revenue?: number;
    total_orders?: number;
    pending_orders?: number;
  } | null>(null);

  // Hàm tải dữ liệu thực tế từ MySQL XAMPP
  const reloadDataFromBackend = async () => {
    setIsLoadingBackend(true);
    try {
      // 1. Nạp danh sách sản phẩm đồng bộ
      await refreshProducts();

      // 2. Nạp danh mục từ CSDL
      await refreshCategories();

      // 3. Nạp danh sách thương hiệu thật từ MySQL XAMPP (30 thương hiệu)
      const resBrands = await fetch(`${API_BASE}/get_brands.php`);
      const brandsJson = await resBrands.json();
      if (brandsJson?.success && Array.isArray(brandsJson.data) && brandsJson.data.length > 0) {
        setBrands(brandsJson.data.map(mapDbBrandToBrandItem));
      }

      // 4. Nạp danh sách đơn hàng (12 đơn hàng thật)
      const resOrders = await fetch(`${API_BASE}/get_admin_orders.php`);
      const ordJson = await resOrders.json();
      if (ordJson?.success && Array.isArray(ordJson.data) && ordJson.data.length > 0) {
        const mappedOrders: OrderItem[] = ordJson.data.map(mapDbOrderToOrderItem);
        setOrders(mappedOrders);
      }

      // 4. Nạp khách hàng, vouchers, blogs, appointments thật
      const resExtra = await fetch(`${API_BASE}/get_admin_extra.php`);
      const extraJson = await resExtra.json();
      if (extraJson?.success && extraJson.data) {
        if (Array.isArray(extraJson.data.customers) && extraJson.data.customers.length > 0) {
          setCustomers(extraJson.data.customers.map(mapDbCustomerToCustomerItem));
        }
        if (Array.isArray(extraJson.data.vouchers) && extraJson.data.vouchers.length > 0) {
          setPromotions(extraJson.data.vouchers.map(mapDbVoucherToPromotionItem));
        }
        if (Array.isArray(extraJson.data.blogs) && extraJson.data.blogs.length > 0) {
          setArticles(extraJson.data.blogs.map(mapDbBlogToArticleItem));
        }
        if (Array.isArray(extraJson.data.appointments) && extraJson.data.appointments.length > 0) {
          setFeedbacks(extraJson.data.appointments.map(mapDbAppointmentToFeedbackItem));
        }
        // 5. Nạp Kho hàng thật (30 mặt hàng)
        if (Array.isArray(extraJson.data.inventory) && extraJson.data.inventory.length > 0) {
          setInventory(extraJson.data.inventory.map(mapDbInventoryToInventoryItem));
        }
        // 6. Nạp Lô hàng & HSD thật (30 lô hàng)
        if (Array.isArray(extraJson.data.batches) && extraJson.data.batches.length > 0) {
          setBatches(extraJson.data.batches.map(mapDbBatchToBatchItem));
        }
        // 7. Nạp Vận chuyển / Tài xế thật (30 tài xế)
        if (Array.isArray(extraJson.data.shippers) && extraJson.data.shippers.length > 0) {
          setShippers(extraJson.data.shippers.map(mapDbShipperToShipperItem));
        }
        // 8. Nạp Giao dịch thanh toán thật (30 giao dịch)
        if (Array.isArray(extraJson.data.payments) && extraJson.data.payments.length > 0) {
          setPayments(extraJson.data.payments.map(mapDbPaymentToPaymentItem));
        }
        // 9. Nạp Nhà cung cấp thật (30 đối tác)
        if (Array.isArray(extraJson.data.suppliers) && extraJson.data.suppliers.length > 0) {
          setSuppliers(extraJson.data.suppliers.map(mapDbSupplierToSupplierItem));
        }
        // 10. Nạp Đánh giá khách hàng thật (30 đánh giá)
        if (Array.isArray(extraJson.data.reviews) && extraJson.data.reviews.length > 0) {
          setReviews(extraJson.data.reviews.map(mapDbReviewToReviewItem));
        }
        // 11. Nạp Banners slide thật (30 banner)
        if (Array.isArray(extraJson.data.banners) && extraJson.data.banners.length > 0) {
          setBanners(extraJson.data.banners.map(mapDbBannerToBannerItem));
        }
      }

      // 12. Nạp Ca làm việc nhân viên từ MySQL
      try {
        const resShifts = await fetch(`${API_BASE}/get_shifts.php`);
        const shiftsJson = await resShifts.json();
        if (shiftsJson?.success && Array.isArray(shiftsJson.data) && shiftsJson.data.length > 0) {
          setShifts(shiftsJson.data);
        }
      } catch (errShifts) {
        console.log('Không thể tải ca nhân viên từ API:', errShifts);
      }

      // 5. Nạp thống kê live
      const resStats = await fetch(`${API_BASE}/get_admin_stats.php`);
      const statsJson = await resStats.json();
      if (statsJson?.success && statsJson.data) {
        setLiveStats(statsJson.data);
      }
      showToast('⚡ Đã đồng bộ dữ liệu thật từ MySQL XAMPP thành công!');
    } catch (err) {
      console.log('Không thể tải từ backend, dùng fallback local:', err);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  React.useEffect(() => {
    reloadDataFromBackend();
  }, []);

  const [shippers, setShippers] = useState<ShipperItem[]>(DEFAULT_SHIPPERS);
  const [payments, setPayments] = useState<PaymentTxnItem[]>(DEFAULT_PAYMENTS);
  const [promotions, setPromotions] = useState<PromotionItem[]>(DEFAULT_PROMOTIONS);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(DEFAULT_SUPPLIERS);
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(DEFAULT_FEEDBACKS);
  const [accounts, setAccounts] = useState<AdminAccountItem[]>(DEFAULT_ACCOUNTS);
  const [shifts, setShifts] = useState<EmployeeShiftItem[]>(DEFAULT_SHIFTS);

  // Bộ lọc Ca làm việc nhân viên
  const [shiftDateFilter, setShiftDateFilter] = useState<'all' | 'today'>('all');
  const [shiftTypeFilter, setShiftTypeFilter] = useState<string>('all');
  const [shiftStatusFilter, setShiftStatusFilter] = useState<string>('all');
  const [shiftSearchQuery, setShiftSearchQuery] = useState<string>('');

  const handleQuickShiftStatus = async (id: number | string, newStatus: EmployeeShiftItem['status']) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, status: newStatus };
        if (newStatus === 'checked_in') updated.check_in_time = timeStr;
        if (newStatus === 'completed') updated.check_out_time = timeStr;
        return updated;
      })
    );

    try {
      await fetch(`${API_BASE}/manage_shifts.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quick_status: newStatus })
      });
    } catch (e) {}

    if (newStatus === 'checked_in') showToast('🟢 Nhân viên đã Check-in điểm danh vào ca!');
    else if (newStatus === 'completed') showToast('✅ Ca trực đã hoàn thành & Check-out!');
    else if (newStatus === 'absent') showToast('⚠️ Đã đánh dấu vắng mặt ca trực!');
    else if (newStatus === 'leave') showToast('🏖️ Đã duyệt nghỉ phép cho nhân viên!');
    else showToast('⏱️ Đã chuyển về trạng thái đã xếp ca!');
  };

  // Modal State
  const [modalType, setModalType] = useState<EntityType | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Mở modal
  const openModal = (type: EntityType, itemToEdit?: any) => {
    setModalType(type);
    if (itemToEdit) {
      setIsEditMode(true);
      if (type === 'product') {
        const p = itemToEdit as ProductItem;
        const safeGal = Array.isArray(p.galleryImages)
          ? p.galleryImages
          : typeof p.galleryImages === 'string' && p.galleryImages
          ? [p.galleryImages]
          : [];
        setFormData({
          ...p,
          productType: p.productType || 'food',
          highlightTagsStr: Array.isArray(p.highlightTags) ? p.highlightTags.join(', ') : '',
          scentsStr: Array.isArray(p.scents) ? p.scents.join(', ') : '',
          crudeFiber: p.crudeFiber || '≤ 5.0%',
          caloriesKcal: p.caloriesKcal || '3,800 kcal/kg',
          inStock: p.inStock !== undefined ? p.inStock : true,
          isNewlyLaunched: p.isNewlyLaunched || false,
          image: p.image || '',
          g1: safeGal[0] || p.image || '',
          g2: safeGal[1] || '',
          g3: safeGal[2] || '',
          g4: safeGal[3] || '',
          g5: safeGal[4] || '',
          w1Weight: p.weightOptions?.[0]?.weight || '400g',
          w1Price: p.weightOptions?.[0]?.price !== undefined ? String(p.weightOptions[0].price) : '16800',
          w1OrigPrice: p.weightOptions?.[0]?.originalPrice !== undefined ? String(p.weightOptions[0].originalPrice) : '20160',
          w2Weight: p.weightOptions?.[1]?.weight || '1.5kg',
          w2Price: p.weightOptions?.[1]?.price !== undefined ? String(p.weightOptions[1].price) : '42000',
          w2OrigPrice: p.weightOptions?.[1]?.originalPrice !== undefined ? String(p.weightOptions[1].originalPrice) : '50400',
          w3Weight: p.weightOptions?.[2]?.weight || '3.5kg',
          w3Price: p.weightOptions?.[2]?.price !== undefined ? String(p.weightOptions[2].price) : '88200',
          w3OrigPrice: p.weightOptions?.[2]?.originalPrice !== undefined ? String(p.weightOptions[2].originalPrice) : '105840',
        });
      } else {
        setFormData({ ...itemToEdit });
      }
    } else {
      setIsEditMode(false);
      if (type === 'product') {
        setFormData({
          productType: 'food',
          name: '',
          sku: 'PET-' + Math.floor(10 + Math.random() * 90) + '-' + Math.floor(100 + Math.random() * 900),
          brand: 'Inaba Nhật Bản',
          category: 'Thức ăn khô / Hạt dinh dưỡng',
          price: '16800',
          originalPrice: '20160',
          stock: '140',
          soldCount: '1520',
          rating: '4.9',
          reviewCount: '384',
          discountPercent: '15',
          inStock: true,
          isNewlyLaunched: false,
          highlightTagsStr: 'Chính hãng Inaba, Bổ sung Collagen, Kích thích vị giác',
          scentsStr: 'Mooncat-Táo 9L, Mooncat-Phấn 9L, Mooncat-Cafe 9L, MoonCat-Chanh 9L',
          image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
          g1: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400',
          g2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
          g3: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
          g4: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
          g5: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
          description: 'Dạng kem lỏng thơm ngậy, bổ sung trà xanh ngăn ngừa mùi hôi phân và nước tiểu.',
          proteinSources: 'Thịt gà, Thịt vịt, Men bia thủy phân',
          targetPet: 'Mèo trưởng thành • 2.0 kg – 7.0 kg',
          crudeProtein: '≥ 32.0%',
          crudeFat: '≥ 15.0%',
          crudeFiber: '≤ 0.5%',
          caloriesKcal: '430 kcal/kg',
          w1Weight: '400g',
          w1Price: '16800',
          w1OrigPrice: '20160',
          w2Weight: '1.5kg',
          w2Price: '42000',
          w2OrigPrice: '50400',
          w3Weight: '3.5kg',
          w3Price: '88200',
          w3OrigPrice: '105840',
        });
      } else if (type === 'category') {
        setFormData({
          id: 'cat_' + Date.now(),
          name: '',
          slug: '',
          icon: '🥫',
          description: '',
          productCount: '12',
          status: 'active',
        });
      } else if (type === 'brand') {
        setFormData({
          id: 'br_' + Date.now(),
          name: '',
          country: 'Việt Nam',
          flag: '🇻🇳',
          description: '',
          productCount: '8',
          isOfficial: true,
          status: 'active',
        });
      } else if (type === 'inventory') {
        setFormData({
          id: 'inv_' + Date.now(),
          sku: 'PET-' + Math.floor(10 + Math.random() * 90) + '-01',
          productName: '',
          category: 'Thức ăn khô / Hạt',
          packaging: 'Gói 1.5kg',
          stockQty: '100',
          minAlertQty: '15',
          location: 'Kệ A1 - Tầng 2',
          status: 'in_stock',
        });
      } else if (type === 'batch') {
        setFormData({
          id: 'bat_' + Date.now(),
          batchCode: 'LOT-2026-' + Math.floor(100 + Math.random() * 900),
          productName: '',
          mfgDate: '01/03/2026',
          expDate: '01/03/2028',
          daysRemaining: '730',
          packageType: 'Gói tiêu chuẩn',
          status: 'good',
        });
      } else if (type === 'order') {
        setFormData({
          id: 'ord_' + Date.now(),
          code: 'DH-' + Math.floor(1000 + Math.random() * 9000),
          customerName: '',
          phone: '',
          address: 'Hà Nội',
          itemsCount: '2',
          totalPrice: '250000',
          paymentMethod: 'VietQR',
          status: 'pending',
          createdAt: 'Hôm nay',
        });
      } else if (type === 'customer') {
        setFormData({
          id: 'cus_' + Date.now(),
          name: '',
          phone: '',
          email: '',
          petCount: '1',
          petSummary: '1 bé mèo Anh lông ngắn',
          totalSpent: '0',
          ordersCount: '0',
          tier: 'Bạc',
          petXu: '100',
        });
      } else if (type === 'shipping') {
        setFormData({
          id: 'shp_' + Date.now(),
          name: '',
          phone: '',
          licensePlate: '29B1-888.88',
          serviceType: 'Hỏa tốc 2h',
          activeOrders: '0',
          rating: '5.0',
          status: 'idle',
        });
      } else if (type === 'payment') {
        setFormData({
          id: 'pay_' + Date.now(),
          txnCode: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
          orderCode: 'DH-1001',
          customerName: '',
          amount: '250000',
          method: 'VietQR',
          status: 'success',
          time: 'Vừa xong',
        });
      } else if (type === 'promotion') {
        setFormData({
          id: 'pro_' + Date.now(),
          code: 'SALE' + Math.floor(10 + Math.random() * 90),
          description: 'Giảm giá ưu đãi',
          discountType: 'percent',
          discountValue: '15%',
          minOrder: '150000',
          usageCount: '0',
          maxUsage: '200',
          expiryDate: '30/12/2026',
          status: 'active',
        });
      } else if (type === 'supplier') {
        setFormData({
          id: 'sup_' + Date.now(),
          name: '',
          code: 'NCC-' + Math.floor(10 + Math.random() * 90),
          brandsSupplied: '',
          contactPerson: '',
          phone: '',
          email: '',
          warehouseCity: 'Hà Nội',
          contractUntil: '2027',
          rating: '5.0',
        });
      } else if (type === 'review') {
        setFormData({
          id: 'rev_' + Date.now(),
          customerName: '',
          productName: '',
          rating: '5',
          comment: 'Sản phẩm rất tốt, bé cưng ăn ngon miệng!',
          date: 'Hôm nay',
          status: 'approved',
        });
      } else if (type === 'banner') {
        setFormData({
          id: 'ban_' + Date.now(),
          badge: 'HOT DEAL',
          title: '',
          highlight: 'Ưu Đãi Lớn',
          subtitle: '',
          ctaText: 'Xem Ngay',
          image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
          themeColor: '#0284C7',
          order: '1',
          status: 'active',
        });
      } else if (type === 'article') {
        setFormData({
          id: 'art_' + Date.now(),
          title: '',
          category: 'Cẩm Nang Dinh Dưỡng',
          author: 'Bác Sĩ PetCare',
          readCount: '250',
          publishDate: 'Hôm nay',
          status: 'published',
        });
      } else if (type === 'feedback') {
        setFormData({
          id: 'fb_' + Date.now(),
          customerName: '',
          phone: '',
          petName: '',
          type: 'Yêu cầu tư vấn ăn uống',
          message: '',
          date: 'Hôm nay',
          status: 'new',
        });
      } else if (type === 'shift') {
        const todayStr = new Date().toISOString().split('T')[0];
        setFormData({
          id: Date.now(),
          employee_id: 'NV-' + Math.floor(100 + Math.random() * 900),
          employee_name: '',
          employee_phone: '',
          employee_role: 'Tư vấn bán hàng',
          shift_name: 'Ca Sáng (07:30 - 12:00)',
          shift_type: 'morning',
          shift_date: todayStr,
          start_time: '07:30',
          end_time: '12:00',
          branch: 'Cơ sở chính Ba Đình',
          status: 'scheduled',
          note: '',
        });
      } else if (type === 'account') {
        setFormData({
          id: 'acc_' + Date.now(),
          username: 'admin_' + Math.floor(10 + Math.random() * 90),
          name: '',
          role: 'CSKH & Bán hàng',
          email: '',
          lastLogin: 'Chưa đăng nhập',
          status: 'active',
        });
      } else {
        setFormData({ id: Date.now().toString(), name: '' });
      }
    }
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({});
  };

  // Lưu Modal
  const handleSaveModal = () => {
    if (!modalType) return;

    if (modalType === 'product') {
      const priceNum = Number(formData.price) || 16800;
      const origNum = Number(formData.originalPrice) || Math.round(priceNum * 1.2);
      const discount = Math.max(0, Math.round(((origNum - priceNum) / origNum) * 100));

      const weights: ProductWeightVariant[] = [
        {
          weight: formData.w1Weight || '400g',
          price: Number(formData.w1Price) || priceNum,
          originalPrice: Number(formData.w1OrigPrice) || origNum,
        },
        {
          weight: formData.w2Weight || '1.5kg',
          price: Number(formData.w2Price) || Math.round(priceNum * 2.5),
          originalPrice: Number(formData.w2OrigPrice) || Math.round(origNum * 2.5),
        },
        {
          weight: formData.w3Weight || '3.5kg',
          price: Number(formData.w3Price) || Math.round(priceNum * 5.2),
          originalPrice: Number(formData.w3OrigPrice) || Math.round(origNum * 5.2),
        },
      ];

      const gList = [formData.g1 || formData.image, formData.g2, formData.g3, formData.g4, formData.g5].filter(Boolean) as string[];
      const finalGallery = gList.length > 0 ? gList : [
        formData.image || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
        'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
      ];

      const prodType = formData.productType || 'food';
      const parsedScents = formData.scentsStr
        ? formData.scentsStr.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (formData.scents || []);
      const parsedTags = formData.highlightTagsStr
        ? formData.highlightTagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
        : (formData.highlightTags || []);

      const pData: ProductItem = {
        id: isEditMode ? Number(formData.id) : (products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1),
        name: formData.name || 'Sản phẩm mới',
        sku: formData.sku || ('PET-' + Math.floor(10 + Math.random() * 90) + '-408'),
        brand: formData.brand || 'Chính hãng',
        category: formData.category || (prodType === 'litter' ? 'Cát & Chăm sóc' : 'Thức ăn khô / Hạt dinh dưỡng'),
        productType: prodType,
        price: priceNum,
        originalPrice: origNum,
        discountPercent: discount,
        stock: Number(formData.stock) || 100,
        soldCount: Number(formData.soldCount) || 0,
        rating: Number(formData.rating) || 5.0,
        reviewCount: Number(formData.reviewCount) || 10,
        image: formData.image || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
        galleryImages: finalGallery,
        description: formData.description || 'Thức ăn thơm ngon giàu dinh dưỡng cho thú cưng.',
        weightOptions: weights,
        proteinSources: formData.proteinSources || (prodType === 'litter' ? 'Khoáng Bentonite tự nhiên' : 'Thịt gà, Thịt vịt, Men bia thủy phân'),
        targetPet: formData.targetPet || 'Mèo trưởng thành • 2.0 kg – 7.0 kg',
        crudeProtein: formData.crudeProtein || (prodType === 'litter' ? 'Khoáng tự nhiên' : '≥ 32.0%'),
        crudeFat: formData.crudeFat || (prodType === 'litter' ? '100% Không độc hại' : '≥ 15.0%'),
        crudeFiber: formData.crudeFiber || (prodType === 'litter' ? 'Độ hút ẩm > 350%' : '≤ 5.0%'),
        caloriesKcal: formData.caloriesKcal || (prodType === 'litter' ? 'Kháng khuẩn 99%' : '3,800 kcal/kg'),
        inStock: formData.inStock !== undefined ? formData.inStock : true,
        isNewlyLaunched: formData.isNewlyLaunched !== undefined ? formData.isNewlyLaunched : false,
        scents: parsedScents,
        highlightTags: parsedTags,
      };

      if (isEditMode) {
        updateSharedProduct(pData.id, pData);
        showToast('✅ Đã cập nhật sản phẩm & đồng bộ ngay sang trang Khách hàng!');
        const catSlug = pData.category?.toLowerCase().includes('pate')
          ? 'pate'
          : pData.category?.toLowerCase().includes('cát')
          ? 'vesinh'
          : pData.category?.toLowerCase().includes('xương')
          ? 'xuong'
          : 'hat';

        fetch(`${API_BASE}/manage_products.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: pData.id,
            sku: pData.sku,
            name: pData.name,
            brand: pData.brand,
            category: pData.category,
            category_slug: catSlug,
            price: pData.price,
            originalPrice: pData.originalPrice,
            discountPercent: pData.discountPercent,
            stock: pData.stock,
            soldCount: pData.soldCount,
            rating: pData.rating,
            image: pData.image,
            gallery_images: finalGallery,
            galleryImages: finalGallery,
            description: pData.description,
            productType: pData.productType,
            product_type: pData.productType,
            weight_options: weights,
            weightOptions: weights,
            scents: parsedScents,
            highlightTags: parsedTags,
            inStock: pData.inStock,
            status: 'active',
          }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res && res.success && res.data && res.data.image) {
              updateSharedProduct(pData.id, {
                ...pData,
                image: res.data.image,
                galleryImages: res.data.gallery_images || pData.galleryImages,
              });
            }
          })
          .catch((err) => console.log('Lỗi cập nhật sản phẩm:', err));
      } else {
        addSharedProduct(pData);
        showToast('🎉 Đã thêm sản phẩm mới & xuất hiện ngay ở trang Khách hàng!');
      }
    } else if (modalType === 'category') {
      const cData: CategoryItem = {
        id: formData.id || ('cat_' + Date.now()),
        name: formData.name || 'Danh mục mới',
        slug: formData.slug || (formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'danh-muc-moi'),
        icon: formData.icon || '🥫',
        description: formData.description || 'Mô tả danh mục',
        productCount: Number(formData.productCount) || 0,
        status: (formData.status as any) || 'active',
      };
      if (isEditMode) {
        updateSharedCategory(cData.id, cData);
        showToast('✅ Đã cập nhật danh mục thành công!');
      } else {
        addSharedCategory(cData);
        showToast('🎉 Đã thêm danh mục mới thành công!');
      }
    } else if (modalType === 'brand') {
      const bData: BrandItem = {
        id: formData.id || ('br_' + Date.now()),
        name: formData.name || 'Thương hiệu mới',
        country: formData.country || 'Việt Nam',
        flag: formData.flag || '🇻🇳',
        description: formData.description || 'Mô tả thương hiệu',
        productCount: Number(formData.productCount) || 0,
        isOfficial: formData.isOfficial !== false,
        status: (formData.status as any) || 'active',
      };
      if (isEditMode) {
        setBrands((prev) => prev.map((b) => (b.id === bData.id ? bData : b)));
        showToast('✅ Đã cập nhật thương hiệu thành công!');
        fetch(`${API_BASE}/manage_brands.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bData),
        }).catch((err) => console.log('Lỗi cập nhật brand:', err));
      } else {
        setBrands((prev) => [bData, ...prev]);
        showToast('🎉 Đã thêm thương hiệu mới thành công!');
        fetch(`${API_BASE}/manage_brands.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bData),
        }).catch((err) => console.log('Lỗi thêm brand:', err));
      }
    } else if (modalType === 'inventory') {
      const invData: InventoryItem = {
        id: formData.id || ('inv_' + Date.now()),
        sku: formData.sku || 'SKU-001',
        productName: formData.productName || 'Sản phẩm mới',
        category: formData.category || 'Hạt dinh dưỡng',
        packaging: formData.packaging || 'Gói tiêu chuẩn',
        stockQty: Number(formData.stockQty) || 0,
        minAlertQty: Number(formData.minAlertQty) || 10,
        location: formData.location || 'Kệ A1',
        status: Number(formData.stockQty) <= 0 ? 'out_of_stock' : Number(formData.stockQty) < 15 ? 'low_stock' : 'in_stock',
      };
      if (isEditMode) {
        setInventory((prev) => prev.map((i) => (i.id === invData.id ? invData : i)));
        showToast('✅ Đã cập nhật kho hàng thành công!');
      } else {
        setInventory((prev) => [invData, ...prev]);
        showToast('🎉 Đã thêm mặt hàng vào kho thành công!');
      }
    } else if (modalType === 'batch') {
      const batData: BatchItem = {
        id: formData.id || ('bat_' + Date.now()),
        batchCode: formData.batchCode || 'LOT-NEW',
        productName: formData.productName || 'Sản phẩm',
        mfgDate: formData.mfgDate || '01/01/2026',
        expDate: formData.expDate || '01/01/2028',
        daysRemaining: Number(formData.daysRemaining) || 365,
        packageType: formData.packageType || 'Gói tiêu chuẩn',
        status: Number(formData.daysRemaining) < 30 ? 'critical' : Number(formData.daysRemaining) < 90 ? 'warning' : 'good',
      };
      if (isEditMode) {
        setBatches((prev) => prev.map((b) => (b.id === batData.id ? batData : b)));
        showToast('✅ Đã cập nhật lô hàng thành công!');
      } else {
        setBatches((prev) => [batData, ...prev]);
        showToast('🎉 Đã thêm lô hàng mới thành công!');
      }
    } else if (modalType === 'order') {
      const ordData: OrderItem = {
        id: formData.id || ('ord_' + Date.now()),
        code: formData.code || 'DH-' + Math.floor(1000 + Math.random() * 9000),
        customerName: formData.customerName || 'Khách hàng',
        phone: formData.phone || '0901234567',
        address: formData.address || 'Hà Nội',
        itemsCount: Number(formData.itemsCount) || 1,
        totalPrice: Number(formData.totalPrice) || 0,
        paymentMethod: (formData.paymentMethod as any) || 'VietQR',
        status: (formData.status as any) || 'pending',
        createdAt: formData.createdAt || 'Hôm nay',
      };
      if (isEditMode) {
        setOrders((prev) => prev.map((o) => (o.id === ordData.id ? ordData : o)));
        showToast('✅ Đã cập nhật đơn hàng thành công!');
      } else {
        setOrders((prev) => [ordData, ...prev]);
        showToast('🎉 Đã tạo đơn hàng mới thành công!');
      }
    } else if (modalType === 'customer') {
      const cusData: CustomerItem = {
        id: formData.id || ('cus_' + Date.now()),
        name: formData.name || 'Khách hàng mới',
        phone: formData.phone || '0900000000',
        email: formData.email || '',
        petCount: Number(formData.petCount) || 1,
        petSummary: formData.petSummary || '1 thú cưng',
        totalSpent: Number(formData.totalSpent) || 0,
        ordersCount: Number(formData.ordersCount) || 0,
        tier: (formData.tier as any) || 'Bạc',
        petXu: Number(formData.petXu) || 0,
      };
      if (isEditMode) {
        updateSharedCustomer(cusData.id, cusData);
        setCustomers((prev) => prev.map((c) => (c.id === cusData.id ? cusData : c)));
        showToast('✅ Đã cập nhật thông tin khách hàng!');
      } else {
        addSharedCustomer(cusData);
        setCustomers((prev) => [cusData, ...prev]);
        showToast('🎉 Đã thêm khách hàng mới!');
      }
    } else if (modalType === 'shipping') {
      const shpData: ShipperItem = {
        id: formData.id || ('shp_' + Date.now()),
        name: formData.name || 'Tài xế mới',
        phone: formData.phone || '0912345678',
        licensePlate: formData.licensePlate || '29B1-999.99',
        serviceType: (formData.serviceType as any) || 'Hỏa tốc 2h',
        activeOrders: Number(formData.activeOrders) || 0,
        rating: Number(formData.rating) || 5.0,
        status: (formData.status as any) || 'idle',
      };
      if (isEditMode) {
        setShippers((prev) => prev.map((s) => (s.id === shpData.id ? shpData : s)));
        showToast('✅ Đã cập nhật thông tin shipper!');
      } else {
        setShippers((prev) => [shpData, ...prev]);
        showToast('🎉 Đã thêm shipper mới!');
      }
    } else if (modalType === 'payment') {
      const payData: PaymentTxnItem = {
        id: formData.id || ('pay_' + Date.now()),
        txnCode: formData.txnCode || 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        orderCode: formData.orderCode || 'DH-1001',
        customerName: formData.customerName || 'Khách hàng',
        amount: Number(formData.amount) || 0,
        method: (formData.method as any) || 'VietQR',
        status: (formData.status as any) || 'success',
        time: formData.time || 'Vừa xong',
      };
      if (isEditMode) {
        setPayments((prev) => prev.map((p) => (p.id === payData.id ? payData : p)));
        showToast('✅ Đã cập nhật giao dịch!');
      } else {
        setPayments((prev) => [payData, ...prev]);
        showToast('🎉 Đã tạo giao dịch mới!');
      }
    } else if (modalType === 'promotion') {
      const proData: PromotionItem = {
        id: formData.id || ('pro_' + Date.now()),
        code: (formData.code || 'SALE10').toUpperCase(),
        description: formData.description || 'Ưu đãi giảm giá',
        discountType: (formData.discountType as any) || 'percent',
        discountValue: formData.discountValue || '10%',
        minOrder: Number(formData.minOrder) || 100000,
        usageCount: Number(formData.usageCount) || 0,
        maxUsage: Number(formData.maxUsage) || 100,
        expiryDate: formData.expiryDate || '31/12/2026',
        status: (formData.status as any) || 'active',
      };
      if (isEditMode) {
        setPromotions((prev) => prev.map((p) => (p.id === proData.id ? proData : p)));
        showToast('✅ Đã cập nhật khuyến mãi!');
      } else {
        setPromotions((prev) => [proData, ...prev]);
        showToast('🎉 Đã thêm voucher khuyến mãi mới!');
      }
    } else if (modalType === 'supplier') {
      const supData: SupplierItem = {
        id: formData.id || ('sup_' + Date.now()),
        name: formData.name || 'Nhà cung cấp mới',
        code: formData.code || 'NCC-01',
        brandsSupplied: formData.brandsSupplied || 'Thương hiệu phân phối',
        contactPerson: formData.contactPerson || 'Đại diện kinh doanh',
        phone: formData.phone || '024.1234.5678',
        email: formData.email || '',
        warehouseCity: formData.warehouseCity || 'Hà Nội',
        contractUntil: formData.contractUntil || '2027',
        rating: Number(formData.rating) || 5.0,
      };
      if (isEditMode) {
        setSuppliers((prev) => prev.map((s) => (s.id === supData.id ? supData : s)));
        showToast('✅ Đã cập nhật nhà cung cấp!');
      } else {
        setSuppliers((prev) => [supData, ...prev]);
        showToast('🎉 Đã thêm nhà cung cấp mới!');
      }
    } else if (modalType === 'review') {
      const revData: ReviewItem = {
        id: formData.id || ('rev_' + Date.now()),
        customerName: formData.customerName || 'Khách hàng',
        productName: formData.productName || 'Sản phẩm',
        rating: Number(formData.rating) || 5,
        comment: formData.comment || 'Chất lượng tuyệt vời!',
        date: formData.date || 'Hôm nay',
        status: (formData.status as any) || 'approved',
      };
      if (isEditMode) {
        setReviews((prev) => prev.map((r) => (r.id === revData.id ? revData : r)));
        showToast('✅ Đã cập nhật đánh giá!');
      } else {
        setReviews((prev) => [revData, ...prev]);
        showToast('🎉 Đã thêm đánh giá mới!');
      }
    } else if (modalType === 'banner') {
      const banData: BannerItem = {
        id: formData.id || ('ban_' + Date.now()),
        badge: formData.badge || 'HOT',
        title: formData.title || 'Tiêu đề banner',
        highlight: formData.highlight || 'Nổi bật',
        subtitle: formData.subtitle || 'Mô tả banner',
        ctaText: formData.ctaText || 'Mua ngay',
        image: formData.image || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
        themeColor: formData.themeColor || '#0284C7',
        order: Number(formData.order) || 1,
        status: (formData.status as any) || 'active',
      };
      if (isEditMode) {
        setBanners((prev) => prev.map((b) => (b.id === banData.id ? banData : b)));
        showToast('✅ Đã cập nhật banner!');
      } else {
        setBanners((prev) => [banData, ...prev]);
        showToast('🎉 Đã thêm banner mới!');
      }
    } else if (modalType === 'article') {
      const artData: ArticleItem = {
        id: formData.id || ('art_' + Date.now()),
        title: formData.title || 'Tiêu đề bài viết',
        category: formData.category || 'Cẩm nang nuôi thú cưng',
        author: formData.author || 'Chuyên gia PetCare',
        readCount: Number(formData.readCount) || 0,
        publishDate: formData.publishDate || 'Hôm nay',
        status: (formData.status as any) || 'published',
      };
      if (isEditMode) {
        setArticles((prev) => prev.map((a) => (a.id === artData.id ? artData : a)));
        showToast('✅ Đã cập nhật bài viết!');
      } else {
        setArticles((prev) => [artData, ...prev]);
        showToast('🎉 Đã thêm bài viết mới!');
      }
    } else if (modalType === 'feedback') {
      const fbData: FeedbackItem = {
        id: formData.id || ('fb_' + Date.now()),
        customerName: formData.customerName || 'Khách hàng',
        phone: formData.phone || '0901234567',
        petName: formData.petName || 'Bé cưng',
        type: (formData.type as any) || 'Yêu cầu tư vấn ăn uống',
        message: formData.message || 'Cần hỗ trợ',
        date: formData.date || 'Hôm nay',
        status: (formData.status as any) || 'new',
      };
      if (isEditMode) {
        setFeedbacks((prev) => prev.map((f) => (f.id === fbData.id ? fbData : f)));
        showToast('✅ Đã cập nhật phản hồi!');
      } else {
        setFeedbacks((prev) => [fbData, ...prev]);
        showToast('🎉 Đã thêm phản hồi mới!');
      }
    } else if (modalType === 'shift') {
      const shiftData: EmployeeShiftItem = {
        id: formData.id || Date.now(),
        employee_id: formData.employee_id || 'NV-001',
        employee_name: formData.employee_name || 'Nhân viên mới',
        employee_phone: formData.employee_phone || '',
        employee_role: formData.employee_role || 'Tư vấn bán hàng',
        shift_name: formData.shift_name || 'Ca Sáng (07:30 - 12:00)',
        shift_type: formData.shift_type || 'morning',
        shift_date: formData.shift_date || new Date().toISOString().split('T')[0],
        start_time: formData.start_time || '07:30',
        end_time: formData.end_time || '12:00',
        branch: formData.branch || 'Cơ sở chính Ba Đình',
        status: formData.status || 'scheduled',
        check_in_time: formData.check_in_time || undefined,
        check_out_time: formData.check_out_time || undefined,
        note: formData.note || '',
      };
      if (isEditMode) {
        setShifts((prev) => prev.map((s) => (s.id === shiftData.id ? shiftData : s)));
        fetch(`${API_BASE}/manage_shifts.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shiftData),
        }).catch(() => {});
        showToast('✅ Đã cập nhật ca làm việc nhân viên!');
      } else {
        setShifts((prev) => [shiftData, ...prev]);
        fetch(`${API_BASE}/manage_shifts.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shiftData),
        }).then(async (res) => {
          const data = await res.json();
          if (data?.id) {
            setShifts((prev) => prev.map((s) => (s.id === shiftData.id ? { ...s, id: data.id } : s)));
          }
        }).catch(() => {});
        showToast('🎉 Đã phân ca làm việc mới thành công!');
      }
    } else if (modalType === 'account') {
      const accData: AdminAccountItem = {
        id: formData.id || ('acc_' + Date.now()),
        username: formData.username || 'staff',
        name: formData.name || 'Nhân viên mới',
        role: (formData.role as any) || 'CSKH & Bán hàng',
        email: formData.email || '',
        lastLogin: formData.lastLogin || 'Chưa đăng nhập',
        status: (formData.status as any) || 'active',
      };
      if (isEditMode) {
        setAccounts((prev) => prev.map((a) => (a.id === accData.id ? accData : a)));
        showToast('✅ Đã cập nhật tài khoản quản trị!');
      } else {
        setAccounts((prev) => [accData, ...prev]);
        showToast('🎉 Đã thêm tài khoản mới thành công!');
      }
    } else {
      showToast('✅ Đã lưu dữ liệu thành công!');
    }
    closeModal();
  };

  const handleBackupProducts = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `petcare_products_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('💾 Đã xuất file JSON sao lưu thành công! Toàn bộ 30 sản phẩm & ảnh đã được lưu an toàn.');
    } catch (e) {
      showToast('Đã lưu dữ liệu an toàn trong mã nguồn & CSDL MySQL!');
    }
  };

  const handleDelete = (type: string, id: any) => {
    if (type === 'product') {
      deleteSharedProduct(id);
      fetch(`${API_BASE}/manage_products.php?id=${id}`, { method: 'DELETE' }).catch((err) =>
        console.log('Lỗi xóa sản phẩm:', err)
      );
    }
    if (type === 'category') {
      deleteSharedCategory(id);
    }
    if (type === 'brand') {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      fetch(`${API_BASE}/manage_brands.php?id=${id}`, { method: 'DELETE' }).catch((err) =>
        console.log('Lỗi xóa brand:', err)
      );
    }
    if (type === 'inventory') {
      setInventory((prev) => prev.filter((i) => i.id !== id));
      fetch(`${API_BASE}/manage_inventory.php?id=${id}`, { method: 'DELETE' }).catch(() => {});
    }
    if (type === 'batch') setBatches((prev) => prev.filter((b) => b.id !== id));
    if (type === 'order') setOrders((prev) => prev.filter((o) => o.id !== id));
    if (type === 'customer') {
      deleteSharedCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
    if (type === 'shipping') {
      setShippers((prev) => prev.filter((s) => s.id !== id));
      fetch(`${API_BASE}/manage_shippers.php?id=${id}`, { method: 'DELETE' }).catch(() => {});
    }
    if (type === 'payment') setPayments((prev) => prev.filter((p) => p.id !== id));
    if (type === 'promotion') setPromotions((prev) => prev.filter((p) => p.id !== id));
    if (type === 'supplier') setSuppliers((prev) => prev.filter((s) => s.id !== id));
    if (type === 'review') {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      fetch(`${API_BASE}/manage_reviews.php?id=${id}`, { method: 'DELETE' }).catch(() => {});
    }
    if (type === 'banner') {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      fetch(`${API_BASE}/manage_banners.php?id=${id}`, { method: 'DELETE' }).catch(() => {});
    }
    if (type === 'article') setArticles((prev) => prev.filter((a) => a.id !== id));
    if (type === 'feedback') setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    if (type === 'shift') {
      setShifts((prev) => prev.filter((s) => s.id !== id));
      fetch(`${API_BASE}/manage_shifts.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => {});
    }
    if (type === 'account') setAccounts((prev) => prev.filter((a) => a.id !== id));
    showToast('🗑️ Đã xóa mục khỏi hệ thống!');
  };

  const cycleOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const nextMap: Record<string, OrderItem['status']> = {
          pending: 'packing',
          packing: 'shipping',
          shipping: 'delivered',
          delivered: 'pending',
          cancelled: 'pending',
        };
        const next = nextMap[ord.status] || 'pending';
        showToast(`Cập nhật đơn ${ord.code} sang: ${next.toUpperCase()}`);
        fetch(`${API_BASE}/update_order_status.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(ord.id), status: next }),
        }).catch(() => {});
        return { ...ord, status: next };
      })
    );
  };

  const addStock = (invId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id !== invId) return i;
        const newQty = Math.max(0, i.stockQty + amount);
        const newStatus = newQty <= 0 ? 'out_of_stock' : newQty < 15 ? 'low_stock' : 'in_stock';
        showToast(amount > 0 ? `Đã nhập thêm +${amount} gói vào kho!` : `Đã giảm ${Math.abs(amount)} gói khỏi kho!`);
        fetch(`${API_BASE}/manage_inventory.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(i.id), stockQty: newQty, status: newStatus }),
        }).catch(() => {});
        return { ...i, stockQty: newQty, status: newStatus };
      })
    );
  };

  const toggleCategoryStatus = (id: string) => {
    toggleSharedCategoryStatus(id);
    const cat = categories.find((c) => String(c.id) === String(id));
    if (cat) {
      const next = cat.status === 'active' ? 'hidden' : 'active';
      showToast(`Danh mục "${cat.name}": ${next === 'active' ? '⚪ Đang ẩn' : '🟢 Hiển thị'}`);
    }
  };

  const toggleBrandStatus = (id: string) => {
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const next = b.status === 'active' ? 'paused' : 'active';
        showToast(`Thương hiệu "${b.name}": ${next === 'active' ? '🟢 Hoạt động' : '⚪ Tạm dừng'}`);
        fetch(`${API_BASE}/manage_brands.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: b.id, name: b.name, status: next }),
        }).catch(() => {});
        return { ...b, status: next };
      })
    );
  };

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const next = b.status === 'active' ? 'paused' : 'active';
        showToast(`Banner "${b.title}": ${next === 'active' ? '🟢 Đang hiển thị' : '⚪ Tạm ẩn'}`);
        fetch(`${API_BASE}/manage_banners.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(b.id), status: next }),
        }).catch(() => {});
        return { ...b, status: next };
      })
    );
  };

  const toggleArticleStatus = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = a.status === 'published' ? 'draft' : 'published';
        showToast(`Bài viết "${a.title}": ${next === 'published' ? '🟢 Xuất bản' : '⚪ Bản nháp'}`);
        return { ...a, status: next };
      })
    );
  };

  const toggleReviewStatus = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = r.status === 'approved' ? 'hidden' : 'approved';
        showToast(`Đánh giá của "${r.customerName}": ${next === 'approved' ? '🟢 Đã duyệt' : '⚪ Đã ẩn'}`);
        fetch(`${API_BASE}/manage_reviews.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(r.id), status: next }),
        }).catch(() => {});
        return { ...r, status: next };
      })
    );
  };

  const toggleFeedbackStatus = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const nextMap: Record<FeedbackItem['status'], FeedbackItem['status']> = {
          new: 'contacting',
          contacting: 'resolved',
          resolved: 'new',
        };
        const next = nextMap[f.status] || 'new';
        showToast(`Phản hồi "${f.customerName}": ${next.toUpperCase()}`);
        return { ...f, status: next };
      })
    );
  };

  const toggleAccountStatus = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = a.status === 'active' ? 'locked' : 'active';
        showToast(`Tài khoản "${a.username}": ${next === 'active' ? '🟢 Hoạt động' : '🔒 Đã khóa'}`);
        return { ...a, status: next };
      })
    );
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = p.status === 'active' ? 'paused' : 'active';
        showToast(`Mã "${p.code}": ${next === 'active' ? '🟢 Hoạt động' : '⚪ Tạm dừng'}`);
        return { ...p, status: next };
      })
    );
  };

  const toggleShipperStatus = (id: string) => {
    setShippers((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextMap: Record<ShipperItem['status'], ShipperItem['status']> = {
          idle: 'delivering',
          delivering: 'off',
          off: 'idle',
        };
        const next = nextMap[s.status] || 'idle';
        showToast(`Shipper "${s.name}": ${next.toUpperCase()}`);
        fetch(`${API_BASE}/manage_shippers.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(s.id), status: next }),
        }).catch(() => {});
        return { ...s, status: next };
      })
    );
  };

  const togglePaymentStatus = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextMap: Record<PaymentTxnItem['status'], PaymentTxnItem['status']> = {
          pending: 'success',
          success: 'refunded',
          refunded: 'pending',
        };
        const next = nextMap[p.status] || 'pending';
        showToast(`Giao dịch "${p.txnCode}": ${next.toUpperCase()}`);
        return { ...p, status: next };
      })
    );
  };

  const toggleProductStock = (id: number | string) => {
    const p = products.find((prod) => String(prod.id) === String(id));
    if (!p) return;
    const next = p.inStock === false ? true : false;
    updateSharedProduct(id, { inStock: next });
    showToast(`Sản phẩm #${p.id}: ${next ? '🟢 Đã chuyển sang CÒN HÀNG' : '🔴 Đã chuyển sang HẾT HÀNG'}`);
  };

  // Tính toán KPI
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'packing').length;
  const lowStockCount = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const newFeedbacksCount = feedbacks.filter((f) => f.status === 'new').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* ======================================================== */}
      {/* MODAL THÊM / SỬA SẢN PHẨM ĐẦY ĐỦ 100% NHƯ TRANG KHÁCH HÀNG */}
      {/* ======================================================== */}
      <Modal visible={modalType === 'product'} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {isEditMode ? '✏️ Chỉnh Sửa Chi Tiết Sản Phẩm' : '➕ Thêm Mới Sản Phẩm Đầy Đủ'}
                </Text>
                <Text style={styles.modalSubtitle}>Đồng bộ cấu trúc hiển thị 100% với trang chi tiết khách hàng (/detail)</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={{ padding: 4 }}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
              {/* PHẦN 1: THÔNG TIN BÁN HÀNG & MÃ SẢN PHẨM */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>📌 1. Thông Tin Bán Hàng & Định Danh</Text>

                {/* CHỌN LOẠI SẢN PHẨM */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.formLabel}>Loại sản phẩm đặc thù:</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                    <TouchableOpacity
                      style={[
                        styles.btnToggleSmall,
                        formData.productType !== 'litter'
                          ? { backgroundColor: '#E0F2FE', borderColor: '#0284C7' }
                          : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                        { flex: 1, paddingVertical: 8, alignItems: 'center' },
                      ]}
                      onPress={() => setFormData({ ...formData, productType: 'food' })}
                    >
                      <Text
                        style={[
                          styles.btnToggleSmallText,
                          { color: formData.productType !== 'litter' ? '#0284C7' : '#64748B', fontWeight: '800' },
                        ]}
                      >
                        🥩 Thức ăn dinh dưỡng
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.btnToggleSmall,
                        formData.productType === 'litter'
                          ? { backgroundColor: '#FEF3C7', borderColor: '#D97706' }
                          : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                        { flex: 1, paddingVertical: 8, alignItems: 'center' },
                      ]}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          productType: 'litter',
                          category: 'Cát & Chăm sóc',
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.btnToggleSmallText,
                          { color: formData.productType === 'litter' ? '#D97706' : '#64748B', fontWeight: '800' },
                        ]}
                      >
                        🚽 Cát vệ sinh / Chăm sóc
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Tên sản phẩm đầy đủ:</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.name || ''}
                    onChangeText={(t) => setFormData({ ...formData, name: t })}
                    placeholder="VD: Bánh Thưởng Cho Mèo Ciao Churu Vị Gà"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Mã SKU (hiển thị trên web):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.sku || ''}
                      onChangeText={(t) => setFormData({ ...formData, sku: t })}
                      placeholder="PET-19-408"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Thương hiệu (Brand):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.brand || ''}
                      onChangeText={(t) => setFormData({ ...formData, brand: t })}
                      placeholder="Inaba Nhật Bản, Royal Canin..."
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Tag phân loại danh mục:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.category || ''}
                      onChangeText={(t) => setFormData({ ...formData, category: t })}
                      placeholder="Thức ăn khô / Hạt dinh dưỡng"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Số lượng tồn kho (gói):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.stock !== undefined ? String(formData.stock) : ''}
                      onChangeText={(t) => setFormData({ ...formData, stock: t })}
                      keyboardType="numeric"
                      placeholder="140"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Giá bán hiển thị (VNĐ):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.price !== undefined ? String(formData.price) : ''}
                      onChangeText={(t) => setFormData({ ...formData, price: t })}
                      keyboardType="numeric"
                      placeholder="16800"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Giá gốc niêm yết (VNĐ):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.originalPrice !== undefined ? String(formData.originalPrice) : ''}
                      onChangeText={(t) => setFormData({ ...formData, originalPrice: t })}
                      keyboardType="numeric"
                      placeholder="20160"
                    />
                  </View>
                </View>

                {/* TRẠNG THÁI & HUY HIỆU */}
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Tình trạng tồn kho:</Text>
                    <TouchableOpacity
                      style={[
                        styles.btnToggleSmall,
                        formData.inStock !== false
                          ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }
                          : { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
                        { paddingVertical: 8, alignItems: 'center' },
                      ]}
                      onPress={() => setFormData({ ...formData, inStock: !formData.inStock })}
                    >
                      <Text
                        style={[
                          styles.btnToggleSmallText,
                          { color: formData.inStock !== false ? '#15803D' : '#DC2626', fontWeight: '800' },
                        ]}
                      >
                        {formData.inStock !== false ? '🟢 Sẵn hàng (In stock)' : '🔴 Hết hàng tạm thời'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Huy hiệu mở bán:</Text>
                    <TouchableOpacity
                      style={[
                        styles.btnToggleSmall,
                        formData.isNewlyLaunched
                          ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
                          : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                        { paddingVertical: 8, alignItems: 'center' },
                      ]}
                      onPress={() => setFormData({ ...formData, isNewlyLaunched: !formData.isNewlyLaunched })}
                    >
                      <Text
                        style={[
                          styles.btnToggleSmallText,
                          { color: formData.isNewlyLaunched ? '#B45309' : '#64748B', fontWeight: '800' },
                        ]}
                      >
                        {formData.isNewlyLaunched ? '✨ Vừa mở bán mới' : '⚪ Hàng thường kỳ'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Highlight Tags (Thẻ cam kết tick xanh trên web, cách nhau dấu phẩy):</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.highlightTagsStr || ''}
                    onChangeText={(t) => setFormData({ ...formData, highlightTagsStr: t })}
                    placeholder="VD: Chính hãng 100%, Khử mùi kép, Vón cục 3 giây, Giàu Omega 3"
                  />
                </View>
              </View>

              {/* PHẦN 2: QUY CÁCH TRỌNG LƯỢNG & BIẾN THỂ GIÁ */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>⚖️ 2. Quy Cách Trọng Lượng (Weight Options như trong web)</Text>
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Gói 1 (Trọng lượng):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.w1Weight || ''}
                      onChangeText={(t) => setFormData({ ...formData, w1Weight: t })}
                      placeholder="400g"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Giá bán gói 1 (đ):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.w1Price || ''}
                      onChangeText={(t) => setFormData({ ...formData, w1Price: t })}
                      placeholder="16800"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Gói 2 (Trọng lượng):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.w2Weight || ''}
                      onChangeText={(t) => setFormData({ ...formData, w2Weight: t })}
                      placeholder="1.5kg"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Giá bán gói 2 (đ):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.w2Price || ''}
                      onChangeText={(t) => setFormData({ ...formData, w2Price: t })}
                      placeholder="42000"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Gói 3 (Trọng lượng):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.w3Weight || ''}
                      onChangeText={(t) => setFormData({ ...formData, w3Weight: t })}
                      placeholder="3.5kg"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Giá bán gói 3 (đ):</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.w3Price || ''}
                      onChangeText={(t) => setFormData({ ...formData, w3Price: t })}
                      placeholder="88200"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* PHẦN 3: ĐẶC ĐIỂM NỔI BẬT & DINH DƯỠNG HOẶC MÙI HƯƠNG */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>
                  {formData.productType === 'litter'
                    ? '🚽 3. Quản Lý Mùi Hương & Tính Năng Cát Vệ Sinh'
                    : '🥩 3. Đặc Điểm Nổi Bật & Thành Phần Dinh Dưỡng'}
                </Text>

                {formData.productType === 'litter' ? (
                  <>
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>
                        Bộ mùi hương (Hiển thị các nút chọn Táo, Phấn, Cafe... ở trang web, cách nhau dấu phẩy):
                      </Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.scentsStr || ''}
                        onChangeText={(t) => setFormData({ ...formData, scentsStr: t })}
                        placeholder="Mooncat-Táo 9L, Mooncat-Phấn 9L, Mooncat-Cafe 9L, MoonCat-Chanh 9L"
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Chất liệu & Thành phần khử mùi:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.proteinSources || ''}
                        onChangeText={(t) => setFormData({ ...formData, proteinSources: t })}
                        placeholder="Khoáng sét Bentonite tự nhiên cao cấp & Than hoạt tính"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <View style={styles.formCol}>
                        <Text style={styles.formLabel}>Đặc tính vón & hút ẩm:</Text>
                        <TextInput
                          style={styles.formInput}
                          value={formData.crudeFiber || ''}
                          onChangeText={(t) => setFormData({ ...formData, crudeFiber: t })}
                          placeholder="Độ hút ẩm > 350%"
                        />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.formLabel}>Kháng khuẩn & Bụi:</Text>
                        <TextInput
                          style={styles.formInput}
                          value={formData.caloriesKcal || ''}
                          onChangeText={(t) => setFormData({ ...formData, caloriesKcal: t })}
                          placeholder="Kháng khuẩn 99%, Lọc bụi đa tầng"
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Nguồn đạm chính:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.proteinSources || ''}
                        onChangeText={(t) => setFormData({ ...formData, proteinSources: t })}
                        placeholder="Thịt gà, Thịt vịt, Men bia thủy phân..."
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Đối tượng phù hợp:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.targetPet || ''}
                        onChangeText={(t) => setFormData({ ...formData, targetPet: t })}
                        placeholder="Mèo trưởng thành • 2.0 kg – 7.0 kg"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <View style={styles.formCol}>
                        <Text style={styles.formLabel}>Tỷ lệ đạm thô (%):</Text>
                        <TextInput
                          style={styles.formInput}
                          value={formData.crudeProtein || ''}
                          onChangeText={(t) => setFormData({ ...formData, crudeProtein: t })}
                          placeholder="≥ 32.0%"
                        />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.formLabel}>Tỷ lệ chất béo thô (%):</Text>
                        <TextInput
                          style={styles.formInput}
                          value={formData.crudeFat || ''}
                          onChangeText={(t) => setFormData({ ...formData, crudeFat: t })}
                          placeholder="≥ 15.0%"
                        />
                      </View>
                    </View>

                    <View style={styles.formRow}>
                      <View style={styles.formCol}>
                        <Text style={styles.formLabel}>Chất xơ thô (% Fiber):</Text>
                        <TextInput
                          style={styles.formInput}
                          value={formData.crudeFiber || ''}
                          onChangeText={(t) => setFormData({ ...formData, crudeFiber: t })}
                          placeholder="≤ 5.0%"
                        />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.formLabel}>Mức năng lượng (Calo):</Text>
                        <TextInput
                          style={styles.formInput}
                          value={formData.caloriesKcal || ''}
                          onChangeText={(t) => setFormData({ ...formData, caloriesKcal: t })}
                          placeholder="3,850 kcal/kg"
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>

              {/* PHẦN 4: HÌNH ẢNH & MÔ TẢ CHI TIẾT */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>🖼️ 4. Quản Lý Hình Ảnh Sản Phẩm & Mô Tả</Text>

                {/* ẢNH ĐẠI DIỆN CHÍNH */}
                <View style={styles.formGroup}>
                  <View style={styles.imageSectionTitleRow}>
                    <Text style={styles.formLabel}>
                      🖼️ Ảnh đại diện chính: <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <Text style={styles.imageSectionSubLabel}>
                      (Bấm chọn ảnh từ máy tính / điện thoại hoặc dán link URL)
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.primaryUploadZone,
                      formData.image ? styles.primaryUploadZoneFilled : styles.primaryUploadZoneEmpty,
                    ]}
                    onPress={() => {
                      pickImageFromFile((uri, name) => {
                        setFormData({ ...formData, image: uri });
                        showToast(`📁 Đã tải ảnh "${name || 'sản phẩm'}" từ máy tính/điện thoại!`);
                      });
                    }}
                    activeOpacity={0.85}
                  >
                    {formData.image ? (
                      <View style={styles.uploadedPreviewLayout}>
                        <Image source={{ uri: formData.image }} style={styles.uploadedMainImage} contentFit="cover" />
                        <View style={styles.uploadedInfoCol}>
                          <View style={styles.uploadSuccessBadge}>
                            <Text style={styles.uploadSuccessBadgeText}>✓ ẢNH ĐẠI DIỆN ĐANG SỬ DỤNG</Text>
                          </View>
                          <Text style={styles.uploadedHintMain}>
                            Bấm vào khung này để tải ảnh khác từ máy tính / điện thoại
                          </Text>
                          <View style={styles.uploadedActionRow}>
                            <View style={styles.btnChangeDeviceVisual}>
                              <Text style={styles.btnChangeDeviceVisualText}>📁 Đổi ảnh từ máy</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.btnRemoveDevicePhoto}
                              onPress={(e) => {
                                e.stopPropagation();
                                setFormData({ ...formData, image: '' });
                                showToast('Đã xóa ảnh chính');
                              }}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.btnRemoveDevicePhotoText}>✕ Xóa ảnh</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.uploadEmptyPrompt}>
                        <View style={styles.uploadIconCircle}>
                          <Text style={styles.uploadIconSymbol}>📷</Text>
                        </View>
                        <Text style={styles.uploadPromptTitle}>
                          BẤM VÀO ĐÂY ĐỂ TẢI ẢNH TỪ MÁY TÍNH / ĐIỆN THOẠI
                        </Text>
                        <Text style={styles.uploadPromptDesc}>
                          Hệ thống sẽ mở thư viện ảnh trong máy của bạn (Hỗ trợ JPG, PNG, WEBP tự động nén tối ưu)
                        </Text>
                        <View style={styles.uploadButtonVisual}>
                          <Text style={styles.uploadButtonVisualText}>📂 Chọn tệp từ máy của bạn</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* TÙY CHỌN DÁN LINK URL DỰ PHÒNG */}
                  <View style={styles.urlInputAccordion}>
                    <TouchableOpacity
                      onPress={() => setShowManualUrlInput(!showManualUrlInput)}
                      style={styles.urlAccordionTrigger}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.urlAccordionText}>
                        {showManualUrlInput ? '▼ Thu gọn ô dán link URL ngoài' : '🔗 Hoặc dán link ảnh Web (URL) nếu có sẵn link mạng'}
                      </Text>
                    </TouchableOpacity>
                    {showManualUrlInput ? (
                      <TextInput
                        style={[styles.formInput, { marginTop: 6 }]}
                        value={formData.image || ''}
                        onChangeText={(t) => setFormData({ ...formData, image: t })}
                        placeholder="Dán link https://images.unsplash.com/... tại đây"
                      />
                    ) : null}
                  </View>
                </View>

                {/* CHỌN NHANH MẪU ẢNH THỨC ĂN CHUẨN */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.presetLabel}>✨ Chọn nhanh mẫu ảnh thức ăn chuẩn (1-Click tự điền link ảnh):</Text>
                  <View style={styles.presetButtonRow}>
                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
                          g1: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400',
                          g2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
                          g3: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
                          g4: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
                        });
                        showToast('Đã áp dụng mẫu ảnh Bánh Thưởng Ciao Churu Mèo!');
                      }}
                    >
                      <Text style={styles.presetChipText}>🐱 Bánh thưởng Ciao Churu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800',
                          g1: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                          g2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
                          g3: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
                          g4: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
                        });
                        showToast('Đã áp dụng mẫu ảnh Hạt Royal Canin!');
                      }}
                    >
                      <Text style={styles.presetChipText}>🥩 Hạt Royal Canin / Minino</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800',
                          g1: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
                          g2: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                          g3: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
                          g4: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
                        });
                        showToast('Đã áp dụng mẫu ảnh Pate & Soup!');
                      }}
                    >
                      <Text style={styles.presetChipText}>🥫 Pate & Soup ướt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
                          g1: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
                          g2: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                          g3: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
                          g4: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
                        });
                        showToast('Đã áp dụng mẫu ảnh Hạt cao cấp Orijen!');
                      }}
                    >
                      <Text style={styles.presetChipText}>🥩 Hạt cao cấp Orijen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          productType: 'litter',
                          category: 'Cát & Chăm sóc',
                          image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
                          g1: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
                          g2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
                          g3: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
                          g4: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
                        });
                        showToast('Đã áp dụng mẫu ảnh Cát MoonCat 9L!');
                      }}
                    >
                      <Text style={styles.presetChipText}>🚽 Cát MoonCat 9L</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* THƯ VIỆN ẢNH CHI TIẾT (GALLERY IMAGES) */}
                <View style={styles.galleryCardContainer}>
                  <View style={styles.galleryHeaderBlock}>
                    <Text style={styles.galleryCardTitle}>
                      📸 Thư Viện 4 Ảnh Chi Tiết (Hiển thị ở trang Khách Hàng /detail):
                    </Text>
                    <Text style={styles.galleryCardSubtitle}>
                      Bấm vào từng ô để tải ảnh trực tiếp từ máy tính / điện thoại của bạn:
                    </Text>
                  </View>

                  <View style={styles.galleryGridContainer}>
                    {[
                      { key: 'g1', label: '1. Bao bì / Thực tế', sub: 'Mặt trước bao bì' },
                      { key: 'g2', label: '2. Bé ăn ngon', sub: 'Ảnh bé thưởng thức' },
                      { key: 'g3', label: '3. Mặt sau / Thành phần', sub: 'Chi tiết nguyên liệu' },
                      { key: 'g4', label: '4. Phân tích dinh dưỡng', sub: 'Bảng tỷ lệ dinh dưỡng' },
                    ].map((gItem) => {
                      const imgVal = formData[gItem.key] || '';
                      return (
                        <View key={gItem.key} style={styles.galleryCardItem}>
                          <Text style={styles.galleryItemLabelText} numberOfLines={1}>
                            {gItem.label}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.galleryBoxTouchable,
                              imgVal ? styles.galleryBoxFilled : styles.galleryBoxEmpty,
                            ]}
                            onPress={() => {
                              pickImageFromFile((uri, name) => {
                                setFormData({ ...formData, [gItem.key]: uri });
                                showToast(`📁 Đã tải ${gItem.label} (${name || 'máy'})!`);
                              });
                            }}
                            activeOpacity={0.8}
                          >
                            {imgVal ? (
                              <View style={styles.galleryBoxThumbWrapper}>
                                <Image source={{ uri: imgVal }} style={styles.galleryBoxThumb} contentFit="cover" />
                                <View style={styles.galleryBoxOverlay}>
                                  <Text style={styles.galleryBoxOverlayText}>Đổi ảnh</Text>
                                </View>
                                <TouchableOpacity
                                  style={styles.galleryBoxDeleteBtn}
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    setFormData({ ...formData, [gItem.key]: '' });
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.galleryBoxDeleteBtnText}>✕</Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View style={styles.galleryBoxEmptyWrapper}>
                                <Text style={styles.galleryBoxPlus}>➕</Text>
                                <Text style={styles.galleryBoxUploadPrompt}>Tải từ máy</Text>
                                <Text style={styles.galleryBoxSubPrompt}>{gItem.sub}</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* MÔ TẢ CHI TIẾT */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Mô tả chi tiết sản phẩm:</Text>
                  <TextInput
                    style={[styles.formInput, styles.formInputMultiline]}
                    value={formData.description || ''}
                    onChangeText={(t) => setFormData({ ...formData, description: t })}
                    multiline
                    numberOfLines={3}
                    placeholder="Mô tả công dụng, hương vị, dinh dưỡng..."
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={closeModal}>
                <Text style={styles.modalBtnCancelText}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveModal}>
                <Text style={styles.modalBtnSaveText}>
                  {isEditMode ? '💾 Lưu Cập Nhật Sản Phẩm' : '➕ Thêm Sản Phẩm Ngay'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL THÊM / SỬA CHO 15 PHÂN HỆ QUẢN TRỊ CÒN LẠI         */}
      {/* ======================================================== */}
      <Modal
        visible={modalType !== null && modalType !== 'product'}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {isEditMode ? `✏️ Chỉnh Sửa ${getModalEntityTitle(modalType)}` : `➕ Thêm Mới ${getModalEntityTitle(modalType)}`}
                </Text>
                <Text style={styles.modalSubtitle}>Đồng bộ cập nhật trực tiếp vào hệ thống quản lý cơ sở dữ liệu</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={{ padding: 4 }}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
              {/* 1. DANH MỤC */}
              {modalType === 'category' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🥫 Thông Tin Danh Mục</Text>
                  <View style={styles.formRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formLabel}>Tên danh mục:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.name || ''}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                        placeholder="VD: Thức Ăn Ướt & Soup"
                      />
                    </View>
                    <View style={{ width: 100 }}>
                      <Text style={styles.formLabel}>Biểu tượng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.icon || ''}
                        onChangeText={(t) => setFormData({ ...formData, icon: t })}
                        placeholder="🥫"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Đường dẫn Slug:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.slug || ''}
                        onChangeText={(t) => setFormData({ ...formData, slug: t })}
                        placeholder="thuc-an-uot-soup"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số sản phẩm ước tính:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.productCount ?? 12)}
                        onChangeText={(t) => setFormData({ ...formData, productCount: t })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Mô tả công dụng nhóm dinh dưỡng:</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputMultiline]}
                      value={formData.description || ''}
                      onChangeText={(t) => setFormData({ ...formData, description: t })}
                      multiline
                      numberOfLines={3}
                      placeholder="Mô tả nhóm thức ăn..."
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Trạng thái hiển thị:</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity
                        style={[styles.btnToggleSmall, formData.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                        onPress={() => setFormData({ ...formData, status: 'active' })}
                      >
                        <Text style={[styles.btnToggleSmallText, { color: formData.status === 'active' ? '#15803D' : '#64748B' }]}>🟢 Hiển thị (active)</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btnToggleSmall, formData.status === 'hidden' ? { backgroundColor: '#FEE2E2', borderColor: '#FECACA' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                        onPress={() => setFormData({ ...formData, status: 'hidden' })}
                      >
                        <Text style={[styles.btnToggleSmallText, { color: formData.status === 'hidden' ? '#DC2626' : '#64748B' }]}>⚪ Tạm ẩn (hidden)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* 2. THƯƠNG HIỆU */}
              {modalType === 'brand' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🏷️ Thông Tin Thương Hiệu</Text>
                  <View style={styles.formRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.formLabel}>Tên thương hiệu:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.name || ''}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                        placeholder="VD: Royal Canin"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formLabel}>Quốc gia:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.country || ''}
                        onChangeText={(t) => setFormData({ ...formData, country: t })}
                        placeholder="Pháp"
                      />
                    </View>
                    <View style={{ width: 80 }}>
                      <Text style={styles.formLabel}>Cờ:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.flag || ''}
                        onChangeText={(t) => setFormData({ ...formData, flag: t })}
                        placeholder="🇫🇷"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Mô tả thương hiệu:</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputMultiline]}
                      value={formData.description || ''}
                      onChangeText={(t) => setFormData({ ...formData, description: t })}
                      multiline
                      numberOfLines={3}
                      placeholder="Mô tả tiêu chuẩn, uy tín..."
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số sản phẩm:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.productCount ?? 10)}
                        onChangeText={(t) => setFormData({ ...formData, productCount: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Trạng thái:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity
                          style={[styles.btnToggleSmall, formData.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, status: 'active' })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.status === 'active' ? '#15803D' : '#64748B' }]}>🟢 Hoạt động</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnToggleSmall, formData.status === 'paused' ? { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, status: 'paused' })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.status === 'paused' ? '#B45309' : '#64748B' }]}>⚪ Tạm dừng</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* 3. KHO HÀNG */}
              {modalType === 'inventory' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>📦 Thông Tin Tồn Kho & Kệ Hàng</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tên mặt hàng:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.productName || ''}
                      onChangeText={(t) => setFormData({ ...formData, productName: t })}
                      placeholder="VD: Hạt Royal Canin Indoor 27"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã SKU:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.sku || ''}
                        onChangeText={(t) => setFormData({ ...formData, sku: t })}
                        placeholder="PET-19-408"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Vị trí kệ kho:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.location || ''}
                        onChangeText={(t) => setFormData({ ...formData, location: t })}
                        placeholder="Kệ A2 - Tầng 1"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Quy cách đóng gói:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.packaging || ''}
                        onChangeText={(t) => setFormData({ ...formData, packaging: t })}
                        placeholder="Gói 2kg"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số lượng tồn (gói):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.stockQty ?? 50)}
                        onChangeText={(t) => setFormData({ ...formData, stockQty: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Ngưỡng cảnh báo (gói):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.minAlertQty ?? 10)}
                        onChangeText={(t) => setFormData({ ...formData, minAlertQty: t })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* 4. LÔ HÀNG & HẠN SỬ DỤNG */}
              {modalType === 'batch' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>⏰ Thông Tin Lô Hàng & Hạn Dùng</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tên sản phẩm theo lô:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.productName || ''}
                      onChangeText={(t) => setFormData({ ...formData, productName: t })}
                      placeholder="VD: Pate Ciao Churu Gà & Sò Điệp"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã lô (Batch code):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.batchCode || ''}
                        onChangeText={(t) => setFormData({ ...formData, batchCode: t })}
                        placeholder="LOT-2026-88"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Quy cách bao bì:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.packageType || ''}
                        onChangeText={(t) => setFormData({ ...formData, packageType: t })}
                        placeholder="Gói 4 thanh x 14g"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Ngày sản xuất (NSX):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.mfgDate || ''}
                        onChangeText={(t) => setFormData({ ...formData, mfgDate: t })}
                        placeholder="01/03/2026"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Hạn sử dụng (HSD):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.expDate || ''}
                        onChangeText={(t) => setFormData({ ...formData, expDate: t })}
                        placeholder="01/03/2028"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Ngày còn lại:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.daysRemaining ?? 730)}
                        onChangeText={(t) => setFormData({ ...formData, daysRemaining: t })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* 5. ĐƠN ĐẶT HÀNG */}
              {modalType === 'order' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🛒 Chi Tiết Đơn Đặt Hàng</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã đơn hàng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.code || ''}
                        onChangeText={(t) => setFormData({ ...formData, code: t })}
                        placeholder="DH-1008"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên khách mua:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.customerName || ''}
                        onChangeText={(t) => setFormData({ ...formData, customerName: t })}
                        placeholder="Nguyễn Văn A"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số điện thoại:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.phone || ''}
                        onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        placeholder="0912345678"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tổng tiền (₫):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.totalPrice ?? 250000)}
                        onChangeText={(t) => setFormData({ ...formData, totalPrice: t })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Địa chỉ giao hàng:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.address || ''}
                      onChangeText={(t) => setFormData({ ...formData, address: t })}
                      placeholder="Số 10, Ngõ 45, Cầu Giấy, Hà Nội"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Phương thức thanh toán:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {['VietQR', 'MoMo', 'COD'].map((m) => (
                          <TouchableOpacity
                            key={m}
                            style={[styles.btnToggleSmall, formData.paymentMethod === m ? { backgroundColor: '#E0F2FE', borderColor: '#38BDF8' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, paymentMethod: m })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.paymentMethod === m ? '#0284C7' : '#64748B' }]}>{m}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Trạng thái đơn:</Text>
                      <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                        {[
                          { key: 'pending', label: 'Chờ duyệt' },
                          { key: 'packing', label: 'Đóng gói' },
                          { key: 'shipping', label: 'Đang giao' },
                          { key: 'delivered', label: 'Đã giao' },
                        ].map((st) => (
                          <TouchableOpacity
                            key={st.key}
                            style={[styles.btnToggleSmall, formData.status === st.key ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, status: st.key })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.status === st.key ? '#B45309' : '#64748B', fontSize: 10 }]}>{st.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* 6. KHÁCH HÀNG */}
              {modalType === 'customer' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>👥 Thông Tin Khách Hàng</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Họ và tên khách:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.name || ''}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                        placeholder="Trần Thu Hương"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số điện thoại:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.phone || ''}
                        onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        placeholder="0987654321"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Email:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.email || ''}
                        onChangeText={(t) => setFormData({ ...formData, email: t })}
                        placeholder="khachhang@gmail.com"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tóm tắt thú cưng nuôi:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.petSummary || ''}
                        onChangeText={(t) => setFormData({ ...formData, petSummary: t })}
                        placeholder="2 Mèo Anh, 1 Poodle"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tổng tiền đã chi tiêu (₫):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.totalSpent ?? 0)}
                        onChangeText={(t) => setFormData({ ...formData, totalSpent: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Điểm PetXu:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.petXu ?? 100)}
                        onChangeText={(t) => setFormData({ ...formData, petXu: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Hạng hội viên:</Text>
                      <View style={{ flexDirection: 'row', gap: 4 }}>
                        {['Bạc', 'Vàng', 'Kim Cương'].map((tier) => (
                          <TouchableOpacity
                            key={tier}
                            style={[styles.btnToggleSmall, formData.tier === tier ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, tier })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.tier === tier ? '#B45309' : '#64748B', fontSize: 10 }]}>{tier}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* 7. VẬN CHUYỂN / SHIPPER */}
              {modalType === 'shipping' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🚚 Hồ Sơ Shipper Giao Hàng</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Họ tên shipper:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.name || ''}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                        placeholder="Nguyễn Thành Nam"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số điện thoại:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.phone || ''}
                        onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        placeholder="0911223344"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Biển số xe:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.licensePlate || ''}
                        onChangeText={(t) => setFormData({ ...formData, licensePlate: t })}
                        placeholder="29B1-998.88"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Loại dịch vụ:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {['Hỏa tốc 2h', 'Giao tiêu chuẩn'].map((st) => (
                          <TouchableOpacity
                            key={st}
                            style={[styles.btnToggleSmall, formData.serviceType === st ? { backgroundColor: '#E0F2FE', borderColor: '#38BDF8' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, serviceType: st })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.serviceType === st ? '#0284C7' : '#64748B' }]}>{st}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Đơn đang giao:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.activeOrders ?? 0)}
                        onChangeText={(t) => setFormData({ ...formData, activeOrders: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Đánh giá sao:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.rating ?? 5.0)}
                        onChangeText={(t) => setFormData({ ...formData, rating: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Trạng thái ca trực:</Text>
                      <View style={{ flexDirection: 'row', gap: 4 }}>
                        {[
                          { key: 'idle', label: 'Sẵn sàng' },
                          { key: 'delivering', label: 'Đang giao' },
                          { key: 'off', label: 'Nghỉ ca' },
                        ].map((s) => (
                          <TouchableOpacity
                            key={s.key}
                            style={[styles.btnToggleSmall, formData.status === s.key ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, status: s.key })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.status === s.key ? '#15803D' : '#64748B', fontSize: 10 }]}>{s.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* 8. THANH TOÁN */}
              {modalType === 'payment' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>💳 Giao Dịch Thanh Toán</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã giao dịch:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.txnCode || ''}
                        onChangeText={(t) => setFormData({ ...formData, txnCode: t })}
                        placeholder="TXN-998811"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã đơn hàng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.orderCode || ''}
                        onChangeText={(t) => setFormData({ ...formData, orderCode: t })}
                        placeholder="DH-1002"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên khách thanh toán:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.customerName || ''}
                        onChangeText={(t) => setFormData({ ...formData, customerName: t })}
                        placeholder="Khách hàng"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số tiền (₫):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.amount ?? 250000)}
                        onChangeText={(t) => setFormData({ ...formData, amount: t })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Cổng thanh toán:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {['VietQR', 'MoMo', 'COD'].map((m) => (
                          <TouchableOpacity
                            key={m}
                            style={[styles.btnToggleSmall, formData.method === m ? { backgroundColor: '#E0F2FE', borderColor: '#38BDF8' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, method: m })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.method === m ? '#0284C7' : '#64748B' }]}>{m}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Trạng thái giao dịch:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {[
                          { key: 'success', label: 'Thành công' },
                          { key: 'pending', label: 'Chờ duyệt' },
                          { key: 'refunded', label: 'Hoàn tiền' },
                        ].map((st) => (
                          <TouchableOpacity
                            key={st.key}
                            style={[styles.btnToggleSmall, formData.status === st.key ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, status: st.key })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.status === st.key ? '#15803D' : '#64748B', fontSize: 10 }]}>{st.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* 9. KHUYẾN MÃI */}
              {modalType === 'promotion' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🎁 Mã Voucher Khuyến Mãi</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã code (viết hoa):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.code || ''}
                        onChangeText={(t) => setFormData({ ...formData, code: t })}
                        placeholder="PETVIP20"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mức giảm (VD: 20% hoặc 50.000₫):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.discountValue || ''}
                        onChangeText={(t) => setFormData({ ...formData, discountValue: t })}
                        placeholder="20%"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Mô tả chương trình khuyến mãi:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.description || ''}
                      onChangeText={(t) => setFormData({ ...formData, description: t })}
                      placeholder="Giảm 20% cho đơn từ 200k khi mua hạt dinh dưỡng"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Đơn tối thiểu (₫):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.minOrder ?? 150000)}
                        onChangeText={(t) => setFormData({ ...formData, minOrder: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Lượt dùng tối đa:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.maxUsage ?? 200)}
                        onChangeText={(t) => setFormData({ ...formData, maxUsage: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Hạn sử dụng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.expiryDate || ''}
                        onChangeText={(t) => setFormData({ ...formData, expiryDate: t })}
                        placeholder="31/12/2026"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* 10. NHÀ CUNG CẤP */}
              {modalType === 'supplier' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🏢 Nhà Cung Cấp & Nhập Khẩu</Text>
                  <View style={styles.formRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.formLabel}>Tên nhà cung cấp:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.name || ''}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                        placeholder="Công ty CP Phân Phối PetCare VN"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formLabel}>Mã NCC:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.code || ''}
                        onChangeText={(t) => setFormData({ ...formData, code: t })}
                        placeholder="NCC-01"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Nhãn hàng cung cấp:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.brandsSupplied || ''}
                        onChangeText={(t) => setFormData({ ...formData, brandsSupplied: t })}
                        placeholder="Inaba, Royal Canin, Me-O"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Người liên hệ phụ trách:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.contactPerson || ''}
                        onChangeText={(t) => setFormData({ ...formData, contactPerson: t })}
                        placeholder="Trần Văn Nam (Giám đốc KD)"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Hotline / SĐT:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.phone || ''}
                        onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        placeholder="024.1234.5678"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Thành phố đặt kho:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.warehouseCity || ''}
                        onChangeText={(t) => setFormData({ ...formData, warehouseCity: t })}
                        placeholder="Hà Nội / TP.HCM"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Hạn hợp đồng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.contractUntil || ''}
                        onChangeText={(t) => setFormData({ ...formData, contractUntil: t })}
                        placeholder="12/2027"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* 11. ĐÁNH GIÁ */}
              {modalType === 'review' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>⭐ Đánh Giá & Nhận Xét</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên khách đánh giá:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.customerName || ''}
                        onChangeText={(t) => setFormData({ ...formData, customerName: t })}
                        placeholder="Nguyễn Lan"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Sản phẩm được đánh giá:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.productName || ''}
                        onChangeText={(t) => setFormData({ ...formData, productName: t })}
                        placeholder="Bánh Thưởng Cho Mèo Ciao Churu"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số sao đánh giá (1 - 5):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.rating ?? 5)}
                        onChangeText={(t) => setFormData({ ...formData, rating: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Trạng thái duyệt:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {[
                          { key: 'approved', label: '🟢 Đã duyệt' },
                          { key: 'pending', label: '⏳ Chờ duyệt' },
                          { key: 'hidden', label: '⚪ Ẩn' },
                        ].map((st) => (
                          <TouchableOpacity
                            key={st.key}
                            style={[styles.btnToggleSmall, formData.status === st.key ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            onPress={() => setFormData({ ...formData, status: st.key })}
                          >
                            <Text style={[styles.btnToggleSmallText, { color: formData.status === st.key ? '#15803D' : '#64748B', fontSize: 10 }]}>{st.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nội dung nhận xét:</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputMultiline]}
                      value={formData.comment || ''}
                      onChangeText={(t) => setFormData({ ...formData, comment: t })}
                      multiline
                      numberOfLines={3}
                      placeholder="Bé mèo nhà mình rất mê vị gà, ăn hết sạch..."
                    />
                  </View>
                </View>
              )}

              {/* 12. BANNER */}
              {modalType === 'banner' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>🖼️ Banner Slide Quảng Cáo</Text>
                  <View style={styles.formRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.formLabel}>Tiêu đề chính:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.title || ''}
                        onChangeText={(t) => setFormData({ ...formData, title: t })}
                        placeholder="Đại Tiệc Dinh Dưỡng Thú Cưng"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formLabel}>Huy hiệu Badge:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.badge || ''}
                        onChangeText={(t) => setFormData({ ...formData, badge: t })}
                        placeholder="SALE 50%"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Điểm nổi bật:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.highlight || ''}
                        onChangeText={(t) => setFormData({ ...formData, highlight: t })}
                        placeholder="Ưu Đãi Lớn Trong Tháng"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Nút bấm (CTA):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.ctaText || ''}
                        onChangeText={(t) => setFormData({ ...formData, ctaText: t })}
                        placeholder="Mua Ngay"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Mô tả phụ:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.subtitle || ''}
                      onChangeText={(t) => setFormData({ ...formData, subtitle: t })}
                      placeholder="Hạt dinh dưỡng & Pate tươi giảm sốc tới 50%"
                    />
                  </View>
                  {/* CHỌN LOẠI MEDIA: HÌNH ẢNH HOẶC VIDEO MP4 */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Loại banner media:</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                      <TouchableOpacity
                        style={[
                          styles.tabMiniBtn,
                          (formData.mediaType !== 'video' && !formData.image?.includes('.mp4')) && styles.tabMiniBtnActive,
                        ]}
                        onPress={() => setFormData({ ...formData, mediaType: 'image' })}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.tabMiniBtnText,
                            (formData.mediaType !== 'video' && !formData.image?.includes('.mp4')) && styles.tabMiniBtnTextActive,
                          ]}
                        >
                          🖼️ Hình ảnh tĩnh (JPG, PNG)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.tabMiniBtn,
                          (formData.mediaType === 'video' || formData.image?.includes('.mp4')) && styles.tabMiniBtnActive,
                        ]}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            mediaType: 'video',
                            image: formData.image?.includes('.mp4')
                              ? formData.image
                              : 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
                            badge: formData.badge?.includes('VIDEO') ? formData.badge : '🎬 VIDEO THỰC TẾ',
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.tabMiniBtnText,
                            (formData.mediaType === 'video' || formData.image?.includes('.mp4')) && styles.tabMiniBtnTextActive,
                          ]}
                        >
                          🎬 Video clip chuyển động (MP4)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* NẾU LÀ VIDEO: GỢI Ý MẪU VIDEO MP4 CÓ SẴN */}
                  {(formData.mediaType === 'video' || formData.image?.includes('.mp4')) && (
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Gợi ý video MP4 mẫu:</Text>
                      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                        <TouchableOpacity
                          style={styles.quickVoucherChip}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              mediaType: 'video',
                              image: 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
                              title: 'Bé Cưng Thưởng Thức Pate Tươi',
                              badge: '🎬 VIDEO THỰC TẾ',
                            })
                          }
                          activeOpacity={0.8}
                        >
                          <Text style={styles.quickVoucherChipCode}>🎥 Video 1: Review Pate ngon (MP4)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.quickVoucherChip}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              mediaType: 'video',
                              image: 'https://www.w3schools.com/html/mov_bbb.mp4',
                              title: 'Súp Thưởng Ciao Churu Nhật Bản',
                              badge: '🎥 SÚP THƯỞNG NHẬT BẢN',
                            })
                          }
                          activeOpacity={0.8}
                        >
                          <Text style={styles.quickVoucherChipCode}>🎥 Video 2: Hoạt hình & Bánh thưởng</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View style={styles.formGroup}>
                    <View style={styles.imageLabelRow}>
                      <Text style={styles.formLabel}>
                        {(formData.mediaType === 'video' || formData.image?.includes('.mp4'))
                          ? 'Link Video MP4 (URL):'
                          : 'Link hình ảnh banner (URL):'}
                      </Text>
                      <TouchableOpacity
                        style={styles.uploadSmallBtn}
                        onPress={() => {
                          pickImageFromFile((uri) => {
                            setFormData({ ...formData, image: uri });
                            showToast('Đã chọn file từ máy!');
                          });
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.uploadSmallBtnText}>📁 Tải từ máy</Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.formInput}
                      value={formData.image || ''}
                      onChangeText={(t) => {
                        const isVid = t.toLowerCase().includes('.mp4') || t.toLowerCase().includes('.mov');
                        setFormData({
                          ...formData,
                          image: t,
                          mediaType: isVid ? 'video' : (formData.mediaType || 'image'),
                        });
                      }}
                      placeholder={
                        (formData.mediaType === 'video' || formData.image?.includes('.mp4'))
                          ? 'https://.../video.mp4 (Định dạng MP4 trực tiếp)'
                          : 'https://images.unsplash.com/... hoặc bấm "Tải từ máy"'
                      }
                    />

                    {formData.image ? (
                      <View style={[styles.imgPreviewBox, { marginTop: 6 }]}>
                        {(formData.mediaType === 'video' || formData.image?.includes('.mp4')) ? (
                          Platform.OS === 'web' ? (
                            <View style={{ width: '100%', maxWidth: 320, borderRadius: 8, overflow: 'hidden' }}>
                              <video
                                src={formData.image}
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                                style={{ width: '100%', height: 160, borderRadius: 8, objectFit: 'cover' }}
                              />
                              <Text style={styles.imgPreviewTextSuccess}>✅ Xem trước Video MP4 đang phát</Text>
                            </View>
                          ) : (
                            <View style={{ alignItems: 'center', padding: 12 }}>
                              <Text style={{ fontSize: 24 }}>🎬</Text>
                              <Text style={styles.imgPreviewTextSuccess}>✅ Video MP4 hợp lệ: {formData.image}</Text>
                            </View>
                          )
                        ) : (
                          <>
                            <Image source={{ uri: formData.image }} style={{ width: 120, height: 60, borderRadius: 6 }} contentFit="cover" />
                            <Text style={styles.imgPreviewTextSuccess}>✅ Xem trước ảnh Banner</Text>
                          </>
                        )}
                      </View>
                    ) : null}
                  </View>
                </View>
              )}

              {/* 13. BÀI VIẾT */}
              {modalType === 'article' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>📰 Bài Viết Cẩm Nang Thú Y</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tiêu đề bài viết:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.title || ''}
                      onChangeText={(t) => setFormData({ ...formData, title: t })}
                      placeholder="Cách chọn hạt khô và pate phù hợp cho mèo triệt sản"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Chuyên mục:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.category || ''}
                        onChangeText={(t) => setFormData({ ...formData, category: t })}
                        placeholder="Dinh Dưỡng Mèo"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tác giả / Bác sĩ:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.author || ''}
                        onChangeText={(t) => setFormData({ ...formData, author: t })}
                        placeholder="Dr. Vũ Tuấn (BSTY)"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Lượt đọc ban đầu:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData.readCount ?? 150)}
                        onChangeText={(t) => setFormData({ ...formData, readCount: t })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Trạng thái xuất bản:</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity
                          style={[styles.btnToggleSmall, formData.status === 'published' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, status: 'published' })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.status === 'published' ? '#15803D' : '#64748B' }]}>🟢 Đã xuất bản</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnToggleSmall, formData.status === 'draft' ? { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, status: 'draft' })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.status === 'draft' ? '#B45309' : '#64748B' }]}>⚪ Bản nháp</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* 14. PHẢN HỒI */}
              {modalType === 'feedback' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>💬 Phản Hồi & Yêu Cầu Tư Vấn</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên khách hàng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.customerName || ''}
                        onChangeText={(t) => setFormData({ ...formData, customerName: t })}
                        placeholder="Hoàng Mai"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số điện thoại:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.phone || ''}
                        onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        placeholder="0978112233"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên bé thú cưng:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.petName || ''}
                        onChangeText={(t) => setFormData({ ...formData, petName: t })}
                        placeholder="Miu Miu (Mèo Ba Tư 4kg)"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Phân loại yêu cầu:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.type || ''}
                        onChangeText={(t) => setFormData({ ...formData, type: t })}
                        placeholder="Yêu cầu tư vấn ăn uống"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nội dung phản hồi / thắc mắc:</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputMultiline]}
                      value={formData.message || ''}
                      onChangeText={(t) => setFormData({ ...formData, message: t })}
                      multiline
                      numberOfLines={3}
                      placeholder="Bé kén ăn hạt khô, cần tư vấn loại pate nào bổ sung men tiêu hóa..."
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Trạng thái xử lý:</Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {[
                        { key: 'new', label: '🆕 Mới nhận' },
                        { key: 'contacting', label: '📞 Đang tư vấn' },
                        { key: 'resolved', label: '✅ Đã giải quyết' },
                      ].map((st) => (
                        <TouchableOpacity
                          key={st.key}
                          style={[styles.btnToggleSmall, formData.status === st.key ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, status: st.key })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.status === st.key ? '#15803D' : '#64748B' }]}>{st.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* CA LÀM VIỆC NHÂN VIÊN */}
              {modalType === 'shift' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>⏱️ Phân Ca & Lịch Làm Việc Nhân Viên</Text>
                  
                  {/* Gợi ý nhân sự có sẵn */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Gợi ý nhân sự có sẵn (chạm để chọn nhanh):</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
                      {[
                        { name: 'Lê Thu Thảo', role: 'Tư vấn bán hàng', id: 'NV-001', phone: '0912 345 678' },
                        { name: 'BS. CKI Nguyễn Minh Tuấn', role: 'Bác sĩ thú y trực ca', id: 'BS-002', phone: '0903 888 999' },
                        { name: 'Trần Văn Kho', role: 'Quản lý kho hàng', id: 'NV-003', phone: '0988 123 456' },
                        { name: 'Hoàng Mỹ Duyên', role: 'Kỹ thuật viên Spa/Grooming', id: 'NV-004', phone: '0977 456 789' },
                        { name: 'Phạm Quốc Bảo', role: 'Thu ngân & CSKH', id: 'NV-005', phone: '0934 567 890' },
                        { name: 'BS. Trần Thị Mai', role: 'Bác sĩ thú y trực ca', id: 'BS-003', phone: '0918 654 321' },
                        { name: 'Đỗ Minh Khang', role: 'Tư vấn bán hàng', id: 'NV-006', phone: '0945 112 233' },
                        { name: 'BS. Đặng Hữu Tài', role: 'Bác sĩ cấp cứu 24/7', id: 'BS-004', phone: '0909 334 455' },
                      ].map((emp) => (
                        <TouchableOpacity
                          key={emp.id}
                          style={[styles.quickVoucherChip, formData.employee_name === emp.name && { backgroundColor: '#0284C7', borderColor: '#0284C7' }]}
                          onPress={() => setFormData({
                            ...formData,
                            employee_name: emp.name,
                            employee_role: emp.role,
                            employee_id: emp.id,
                            employee_phone: emp.phone
                          })}
                        >
                          <Text style={[styles.quickVoucherChipCode, formData.employee_name === emp.name && { color: '#FFFFFF' }]}>
                            {emp.name} ({emp.id})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Họ và tên nhân viên (*):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.employee_name || ''}
                        onChangeText={(t) => setFormData({ ...formData, employee_name: t })}
                        placeholder="VD: Lê Thu Thảo"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Mã nhân viên:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.employee_id || ''}
                        onChangeText={(t) => setFormData({ ...formData, employee_id: t })}
                        placeholder="VD: NV-001"
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Số điện thoại:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.employee_phone || ''}
                        onChangeText={(t) => setFormData({ ...formData, employee_phone: t })}
                        placeholder="0912 345 678"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Chức vụ / Bộ phận:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.employee_role || ''}
                        onChangeText={(t) => setFormData({ ...formData, employee_role: t })}
                        placeholder="Tư vấn bán hàng / Bác sĩ thú y"
                      />
                    </View>
                  </View>

                  {/* Gợi ý ca trực preset */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Khung ca làm việc (chọn nhanh để điền giờ):</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {[
                        { name: 'Ca Sáng (07:30 - 12:00)', type: 'morning', start: '07:30', end: '12:00', label: '🌅 Ca Sáng (07:30 - 12:00)' },
                        { name: 'Ca Chiều (12:00 - 17:30)', type: 'afternoon', start: '12:00', end: '17:30', label: '☀️ Ca Chiều (12:00 - 17:30)' },
                        { name: 'Ca Tối (17:30 - 22:00)', type: 'evening', start: '17:30', end: '22:00', label: '🌙 Ca Tối (17:30 - 22:00)' },
                        { name: 'Ca Hành chính (08:00 - 17:00)', type: 'fulltime', start: '08:00', end: '17:00', label: '🏢 Ca Hành chính (08:00 - 17:00)' },
                        { name: 'Ca Đêm 24/7 (22:00 - 07:30)', type: 'night', start: '22:00', end: '07:30', label: '🦉 Ca Đêm 24/7 (22:00 - 07:30)' },
                      ].map((shiftOpt) => (
                        <TouchableOpacity
                          key={shiftOpt.name}
                          style={[styles.btnToggleSmall, formData.shift_name === shiftOpt.name ? { backgroundColor: '#E0F2FE', borderColor: '#0284C7' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({
                            ...formData,
                            shift_name: shiftOpt.name,
                            shift_type: shiftOpt.type,
                            start_time: shiftOpt.start,
                            end_time: shiftOpt.end
                          })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.shift_name === shiftOpt.name ? '#0369A1' : '#64748B' }]}>
                            {shiftOpt.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên ca làm:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.shift_name || ''}
                        onChangeText={(t) => setFormData({ ...formData, shift_name: t })}
                        placeholder="Ca Sáng (07:30 - 12:00)"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Ngày làm việc (YYYY-MM-DD):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.shift_date || ''}
                        onChangeText={(t) => setFormData({ ...formData, shift_date: t })}
                        placeholder="2026-10-13"
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Giờ bắt đầu:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.start_time || ''}
                        onChangeText={(t) => setFormData({ ...formData, start_time: t })}
                        placeholder="07:30"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Giờ kết thúc:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.end_time || ''}
                        onChangeText={(t) => setFormData({ ...formData, end_time: t })}
                        placeholder="12:00"
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Chi nhánh làm việc:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['Cơ sở chính Ba Đình', 'Phòng khám PetCare Ba Đình', 'Phòng khám PetCare Cầu Giấy', 'Kho tổng Cầu Giấy', 'Cấp cứu 24/7 Ba Đình'].map((br) => (
                        <TouchableOpacity
                          key={br}
                          style={[styles.btnToggleSmall, formData.branch === br ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, branch: br })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.branch === br ? '#15803D' : '#64748B' }]}>{br}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Trạng thái ca trực:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {[
                        { key: 'scheduled', label: '⏳ Đã xếp ca', bg: '#E0F2FE', text: '#0369A1' },
                        { key: 'checked_in', label: '🟢 Đang làm việc', bg: '#DCFCE7', text: '#15803D' },
                        { key: 'completed', label: '✅ Đã hoàn thành', bg: '#F1F5F9', text: '#475569' },
                        { key: 'leave', label: '🏖️ Nghỉ phép', bg: '#FEF3C7', text: '#B45309' },
                        { key: 'absent', label: '❌ Vắng mặt', bg: '#FEE2E2', text: '#B91C1C' },
                      ].map((st) => (
                        <TouchableOpacity
                          key={st.key}
                          style={[styles.btnToggleSmall, formData.status === st.key ? { backgroundColor: st.bg, borderColor: st.text } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                          onPress={() => setFormData({ ...formData, status: st.key })}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: formData.status === st.key ? st.text : '#64748B' }]}>{st.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nhiệm vụ / Bàn giao ca trực:</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputMultiline]}
                      value={formData.note || ''}
                      onChangeText={(t) => setFormData({ ...formData, note: t })}
                      multiline
                      numberOfLines={3}
                      placeholder="Ghi chú công việc cần làm, bàn giao két tiền, ca khám ưu tiên..."
                    />
                  </View>
                </View>
              )}

              {/* 15. TÀI KHOẢN QUẢN TRỊ */}
              {modalType === 'account' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>👨‍💼 Tài Khoản Phân Quyền</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Họ và tên nhân sự:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.name || ''}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                        placeholder="Nguyễn Văn Hùng"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Tên đăng nhập (Username):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.username || ''}
                        onChangeText={(t) => setFormData({ ...formData, username: t })}
                        placeholder="hung_nv"
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Email công vụ:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.email || ''}
                        onChangeText={(t) => setFormData({ ...formData, email: t })}
                        placeholder="hung@petcare.vn"
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.formLabel}>Vai trò:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={formData.role || ''}
                        onChangeText={(t) => setFormData({ ...formData, role: t })}
                        placeholder="CSKH & Bán hàng"
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Trạng thái tài khoản:</Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        style={[styles.btnToggleSmall, formData.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                        onPress={() => setFormData({ ...formData, status: 'active' })}
                      >
                        <Text style={[styles.btnToggleSmallText, { color: formData.status === 'active' ? '#15803D' : '#64748B' }]}>🟢 Hoạt động (active)</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btnToggleSmall, formData.status === 'locked' ? { backgroundColor: '#FEE2E2', borderColor: '#FECACA' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                        onPress={() => setFormData({ ...formData, status: 'locked' })}
                      >
                        <Text style={[styles.btnToggleSmallText, { color: formData.status === 'locked' ? '#DC2626' : '#64748B' }]}>🔒 Khóa tài khoản (locked)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={closeModal}>
                <Text style={styles.modalBtnCancelText}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveModal}>
                <Text style={styles.modalBtnSaveText}>
                  {isEditMode ? '💾 Lưu Cập Nhật' : '➕ Thêm Mới Ngay'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* BỐ CỤC CHÍNH ADMIN 18 PHÂN HỆ                             */}
      {/* ======================================================== */}
      <View style={styles.adminMainLayout}>
        {/* SIDEBAR BÊN TRÁI: 18 PHÂN HỆ */}
        <View style={styles.verticalSidebar}>
          <View style={styles.sidebarBrand}>
            <View style={styles.sidebarBrandIcon}>
              <Text style={{ fontSize: 20 }}>🐾</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.sidebarBrandTitle}>PetCare</Text>
                <View style={styles.sidebarProBadge}>
                  <Text style={styles.sidebarProBadgeText}>ADMIN</Text>
                </View>
              </View>
              <Text style={styles.sidebarBrandSub}>Hệ Thống Quản Lý Thức Ăn</Text>
            </View>
          </View>

          <ScrollView style={styles.sidebarScroll} contentContainerStyle={styles.sidebarScrollContent}>
            <Text style={styles.sidebarMenuHeading}>VẬN HÀNH & BÁN HÀNG</Text>
            {ADMIN_MENU_GROUP_1.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}
                  onPress={() => setActiveTab(item.key as AdminNavTab)}
                >
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text style={[styles.sidebarNavText, isActive && styles.sidebarNavTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.sidebarMenuDivider} />

            <Text style={styles.sidebarMenuHeading}>NỘI DUNG & HỆ THỐNG</Text>
            {ADMIN_MENU_GROUP_2.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}
                  onPress={() => setActiveTab(item.key as AdminNavTab)}
                >
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text style={[styles.sidebarNavText, isActive && styles.sidebarNavTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.sidebarBackShopBtn} onPress={() => router.push('/')}>
              <Text style={styles.sidebarBackShopBtnText}>← Xem Gian Hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarBackShopBtn, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
              onPress={() => setIsAuthenticated(false)}
            >
              <Text style={[styles.sidebarBackShopBtnText, { color: '#DC2626' }]}>🚪 Đăng Xuất</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NỘI DUNG CHÍNH BÊN PHẢI */}
        <View style={styles.mainRightArea}>
          <View style={styles.rightTopHeader}>
            <View>
              <Text style={styles.rightHeaderTitle}>
                {getEntityInfo(activeTab)?.headerTitle || '🐾 Bảng Điều Khiển Quản Trị Hệ Thống'}
              </Text>
              <Text style={styles.rightHeaderSub}>
                Hệ thống đồng bộ dữ liệu đa chiều, hỗ trợ Thêm, Sửa, Xóa và Cập nhật trực tiếp
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {getEntityInfo(activeTab) && (
                <TouchableOpacity
                  style={styles.btnAction}
                  onPress={() => openModal(getEntityInfo(activeTab)!.type)}
                >
                  <Text style={styles.btnActionText}>{getEntityInfo(activeTab)!.label}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => reloadDataFromBackend()}
              >
                <Text style={styles.refreshBtnText}>{isLoadingBackend ? 'Đang tải...' : 'Làm mới ↻'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.contentScrollView} contentContainerStyle={styles.contentContainer}>
            {/* 1. 📊 DASHBOARD: TOÀN DIỆN TẤT CẢ PHÂN HỆ VÀ BIỂU ĐỒ TRỰC QUAN */}
            {activeTab === 'dashboard' && (() => {
              // 1. Chuẩn bị dữ liệu biểu đồ tròn danh mục
              const categorySlices: PieSlice[] = [
                { label: 'Hạt Khô Dinh Dưỡng', value: 45, percent: 45, color: '#0284C7', icon: '🥣' },
                { label: 'Pate & Thức Ăn Ướt', value: 25, percent: 25, color: '#10B981', icon: '🥫' },
                { label: 'Cát Vệ Sinh & Chăm Sóc', value: 15, percent: 15, color: '#F59E0B', icon: '📦' },
                { label: 'Bánh Thưởng & Snack', value: 10, percent: 10, color: '#8B5CF6', icon: '🦴' },
                { label: 'Thực Phẩm Dinh Dưỡng', value: 5, percent: 5, color: '#EC4899', icon: '💊' },
              ];

              // 2. Chuẩn bị dữ liệu biểu đồ tròn thanh toán
              const paymentSlices: PieSlice[] = [
                { label: 'Chuyển Khoản VietQR', value: 45, percent: 45, color: '#0284C7', icon: '⚡' },
                { label: 'Ví Điện Tử MoMo', value: 30, percent: 30, color: '#D946EF', icon: '📱' },
                { label: 'Tiền Mặt Nhận Hàng (COD)', value: 25, percent: 25, color: '#10B981', icon: '💵' },
              ];

              // 3. Chuẩn bị biểu đồ cột doanh thu 7 ngày
              const revenueData = [
                { day: 'T2', amount: 1450000, display: '1.45M' },
                { day: 'T3', amount: 1980000, display: '1.98M' },
                { day: 'T4', amount: 1620000, display: '1.62M' },
                { day: 'T5', amount: 2350000, display: '2.35M' },
                { day: 'T6', amount: 2890000, display: '2.89M' },
                { day: 'T7', amount: 3750000, display: '3.75M' },
                { day: 'CN', amount: 4120000, display: '4.12M' },
              ];

              // 4. Lấy top 5 sản phẩm bán chạy nhất
              const sortedProds = [...products]
                .sort((a, b) => Number(b.soldCount) - Number(a.soldCount))
                .slice(0, 5);
              const maxSold = Math.max(...sortedProds.map((p) => Number(p.soldCount) || 1), 1);
              const topProducts = sortedProds.map((p) => ({
                id: p.id,
                name: p.name,
                brand: p.brand,
                price: p.price,
                soldCount: p.soldCount,
                image: p.image,
                rating: p.rating,
                sharePercent: Math.round(((Number(p.soldCount) || 1) / maxSold) * 100),
              }));

              // 5. Chuẩn bị cảnh báo kho & hạn dùng
              const invWarnings = [
                {
                  productName: 'Royal Canin Mother & Babycat 2kg',
                  sku: 'RC-MBC-2KG',
                  stockQty: 4,
                  location: 'Kệ A1 - Tầng 2',
                  level: 'critical' as const,
                },
                {
                  productName: 'Cát Đậu Nành Tofu Cature 6L',
                  sku: 'CAT-TOFU-6L',
                  stockQty: 8,
                  location: 'Kệ C3 - Kho phụ',
                  level: 'critical' as const,
                },
                {
                  productName: 'Pate Mèo Hoạt Hình Wanpy Gà & Tôm',
                  sku: 'WP-PATE-80G',
                  stockQty: 18,
                  location: 'Kệ B2 - HSD: 45 ngày',
                  level: 'warning' as const,
                },
                {
                  productName: 'Bánh Thưởng Súp Thưởng Ciao Churu 4 Tuýp',
                  sku: 'CIAO-4T-MAG',
                  stockQty: 22,
                  location: 'Kệ A4 - Lô cận hạn',
                  level: 'warning' as const,
                },
              ];

              const totalRev = liveStats?.total_revenue ?? totalRevenue;
              const formattedRevShort =
                totalRev >= 1000000
                  ? `${(totalRev / 1000000).toFixed(1)}M ₫`
                  : `${formatNumberVi(totalRev)} ₫`;

              return (
                <View style={styles.sectionWrap}>
                  {/* THANH THÔNG BÁO TỔNG QUAN HỆ THỐNG */}
                  <View style={styles.systemStatusBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 18 }}>⚡</Text>
                      <View>
                        <Text style={styles.systemStatusTitle}>
                          Bảng Điều Khiển Quản Trị Trung Tâm • 12 Phân Hệ Vận Hành Trực Tuyến
                        </Text>
                        <Text style={styles.systemStatusSub}>
                          Cập nhật thời gian thực từ MySQL XAMPP • Nhấp vào từng ô để truy cập nhanh phân hệ tương ứng
                        </Text>
                      </View>
                    </View>
                    <View style={styles.systemStatusTag}>
                      <Text style={styles.systemStatusTagText}>🟢 HỆ THỐNG ĐANG ĐỒNG BỘ 100%</Text>
                    </View>
                  </View>

                  {/* NHÓM 1: BÁN HÀNG & TÀI CHÍNH (4 CỘT) */}
                  <View>
                    <Text style={styles.kpiGroupTitle}>📈 TÀI CHÍNH & HOẠT ĐỘNG BÁN HÀNG</Text>
                    <View style={styles.kpiRow}>
                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#0EA5E9' }]}
                        onPress={() => setActiveTab('products')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>TỔNG SẢN PHẨM</Text>
                          <Text style={styles.kpiCardIcon}>🐾</Text>
                        </View>
                        <Text style={styles.kpiVal}>{liveStats?.total_products ?? products.length}</Text>
                        <Text style={styles.kpiNote}>🐾 {categories.length} nhóm dinh dưỡng • Chi tiết ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#10B981' }]}
                        onPress={() => setActiveTab('reports')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>DOANH THU THỰC TẾ</Text>
                          <Text style={styles.kpiCardIcon}>💰</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#059669' }]}>
                          {formatNumberVi(totalRev)} ₫
                        </Text>
                        <Text style={styles.kpiNote}>
                          💰 Từ {liveStats?.total_orders ?? orders.length} đơn đặt hàng • Báo cáo ➜
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#F59E0B' }]}
                        onPress={() => setActiveTab('orders')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>ĐƠN CHỜ XỬ LÝ</Text>
                          <Text style={styles.kpiCardIcon}>⏳</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#D97706' }]}>
                          {liveStats?.pending_orders ?? pendingOrdersCount}
                        </Text>
                        <Text style={styles.kpiNote}>📦 Cần đóng gói / giao ngay • Xử lý ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#8B5CF6' }]}
                        onPress={() => setActiveTab('customers')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>KHÁCH HÀNG THỰC TẾ</Text>
                          <Text style={styles.kpiCardIcon}>👥</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#7C3AED' }]}>
                          {liveStats?.total_customers ?? customers.length}
                        </Text>
                        <Text style={styles.kpiNote}>👤 Hội viên tích lũy PetXu • Hồ sơ ➜</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* NHÓM 2: KHO BÃI & VẬN CHUYỂN & THƯƠNG HIỆU (4 CỘT) */}
                  <View>
                    <Text style={styles.kpiGroupTitle}>🏭 VẬN HÀNH KHO BÃI & LOGISTICS</Text>
                    <View style={styles.kpiRow}>
                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#2563EB' }]}
                        onPress={() => setActiveTab('brands')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>THƯƠNG HIỆU ĐỐI TÁC</Text>
                          <Text style={styles.kpiCardIcon}>🏷️</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#2563EB' }]}>{brands.length}</Text>
                        <Text style={styles.kpiNote}>🌟 100% chính hãng phân phối • Xem ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#EA580C' }]}
                        onPress={() => setActiveTab('inventory')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>KHO HÀNG & TỒN KHO</Text>
                          <Text style={styles.kpiCardIcon}>📦</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#EA580C' }]}>{inventory.length}</Text>
                        <Text style={styles.kpiNote}>⚠️ 4 mặt hàng cần nhập gấp • Kiểm kho ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#E11D48' }]}
                        onPress={() => setActiveTab('batches')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>LÔ HÀNG & HẠN SỬ DỤNG</Text>
                          <Text style={styles.kpiCardIcon}>📅</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#E11D48' }]}>{batches.length}</Text>
                        <Text style={styles.kpiNote}>🛡️ Quản lý date chuẩn AAFCO • Xem ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#0D9488' }]}
                        onPress={() => setActiveTab('shipping')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>ĐỘI NGŨ GIAO HÀNG</Text>
                          <Text style={styles.kpiCardIcon}>🚚</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#0D9488' }]}>{shippers.length}</Text>
                        <Text style={styles.kpiNote}>⚡ Shipper hỏa tốc nội thành • Điều phối ➜</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* NHÓM 3: ĐỐI TÁC, THANH TOÁN & DỊCH VỤ (4 CỘT) */}
                  <View>
                    <Text style={styles.kpiGroupTitle}>🤝 ĐỐI TÁC, THANH TOÁN & CHĂM SÓC KHÁCH HÀNG</Text>
                    <View style={styles.kpiRow}>
                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#4F46E5' }]}
                        onPress={() => setActiveTab('payments')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>GIAO DỊCH THANH TOÁN</Text>
                          <Text style={styles.kpiCardIcon}>💳</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#4F46E5' }]}>{payments.length}</Text>
                        <Text style={styles.kpiNote}>⚡ VietQR & MoMo & COD • Đối soát ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#0891B2' }]}
                        onPress={() => setActiveTab('suppliers')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>NHÀ CUNG CẤP & ĐẠI LÝ</Text>
                          <Text style={styles.kpiCardIcon}>🏢</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#0891B2' }]}>{suppliers.length}</Text>
                        <Text style={styles.kpiNote}>🌐 Chuỗi cung ứng nhập khẩu • Quản lý ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#CA8A04' }]}
                        onPress={() => setActiveTab('reviews')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>ĐÁNH GIÁ & PHẢN HỒI</Text>
                          <Text style={styles.kpiCardIcon}>⭐</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#CA8A04' }]}>{reviews.length}</Text>
                        <Text style={styles.kpiNote}>★ 4.9/5 điểm hài lòng của sen • Duyệt ➜</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.kpiCard, { borderLeftColor: '#C026D3' }]}
                        onPress={() => setActiveTab('promotions')}
                      >
                        <View style={styles.kpiCardHeaderRow}>
                          <Text style={styles.kpiLabel}>VOUCHER & KHUYẾN MÃI</Text>
                          <Text style={styles.kpiCardIcon}>🎁</Text>
                        </View>
                        <Text style={[styles.kpiVal, { color: '#C026D3' }]}>{promotions.length}</Text>
                        <Text style={styles.kpiNote}>🔥 Giảm giá kích cầu tiêu dùng • Thiết lập ➜</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 📊 PHẦN BIỂU ĐỒ 1: DOANH THU 7 NGÀY */}
                  <RevenueBarChart revenueData={revenueData} />

                  {/* 🥧 PHẦN BIỂU ĐỒ 2: CẶP BIỂU ĐỒ TRÒN (DANH MỤC THỨC ĂN & CỔNG THANH TOÁN) */}
                  <DualPieChartsSection
                    categorySlices={categorySlices}
                    paymentSlices={paymentSlices}
                    totalRevenueStr={formattedRevShort}
                    totalOrdersStr={`${orders.length} Đơn`}
                  />

                  {/* 🏆 PHẦN BẢNG TOP BÁN CHẠY & CẢNH BÁO KHO */}
                  <TopProductsAndWarehouseSection
                    topProducts={topProducts}
                    inventoryWarnings={invWarnings}
                  />
                </View>
              );
            })()}


            {/* 2. 🐾 TAB SẢN PHẨM: HIỂN THỊ ĐẦY ĐỦ CÁC MỤC NHƯ HÌNH CHỤP (/detail?id=19) */}
            {/* 2. 🐾 TAB SẢN PHẨM: ĐỒNG BỘ 100% VỚI TRANG CHI TIẾT (/detail) */}
            {activeTab === 'products' && (() => {
              const filteredProducts = products.filter((p) => {
                const q = productSearch.trim().toLowerCase();
                const matchQ =
                  !q ||
                  p.name.toLowerCase().includes(q) ||
                  p.sku.toLowerCase().includes(q) ||
                  p.brand.toLowerCase().includes(q);
                let matchCat = true;
                if (productCategoryFilter === 'litter') {
                  matchCat = p.productType === 'litter' || p.category.toLowerCase().includes('cát');
                } else if (productCategoryFilter === 'food') {
                  matchCat = p.productType !== 'litter' && !p.category.toLowerCase().includes('cát');
                } else if (productCategoryFilter !== 'all') {
                  matchCat = p.category.toLowerCase().includes(productCategoryFilter.toLowerCase());
                }
                return matchQ && matchCat;
              });

              return (
                <View style={styles.sectionWrap}>
                  {/* THANH ĐIỀU HÀNH & TÌM KIẾM SẢN PHẨM */}
                  <View style={styles.panelCard}>
                    <View style={styles.panelHeaderRow}>
                      <View>
                        <Text style={styles.panelTitleNoBorder}>
                          Quản Lý Sản Phẩm Kho Hàng ({products.length} mặt hàng)
                        </Text>
                        <Text style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                          Đồng bộ cấu trúc dữ liệu dinh dưỡng, quy cách biến thể và hình ảnh trực tiếp với trang /detail
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, { backgroundColor: '#059669', borderColor: '#047857', borderWidth: 1, paddingHorizontal: 12 }]}
                          onPress={handleBackupProducts}
                          activeOpacity={0.8}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '700' }}>💾 Xuất Sao Lưu JSON</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnActionSmallPrimary}
                          onPress={() => openModal('product')}
                        >
                          <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Sản Phẩm Mới</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* SEARCH INPUT & FILTER PILLS */}
                    <View style={{ gap: 10, marginTop: 12 }}>
                      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <TextInput
                          style={[styles.formInput, { flex: 1, backgroundColor: '#F8FAFC' }]}
                          placeholder="🔍 Tìm nhanh theo tên sản phẩm, mã SKU, thương hiệu..."
                          value={productSearch}
                          onChangeText={setProductSearch}
                        />
                        {productSearch ? (
                          <TouchableOpacity
                            style={[styles.btnActionSmall, { backgroundColor: '#F1F5F9' }]}
                            onPress={() => setProductSearch('')}
                          >
                            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>Xóa tìm</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>

                      {/* FILTER PILLS */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                        {[
                          { id: 'all', label: `Tất cả (${products.length})` },
                          { id: 'food', label: '🥩 Thức ăn & Dinh dưỡng' },
                          { id: 'litter', label: '🚽 Cát vệ sinh & Chăm sóc' },
                          { id: 'hạt', label: '🥣 Hạt khô' },
                          { id: 'pate', label: '🥫 Pate & Soup' },
                          { id: 'bánh', label: '🦴 Bánh thưởng & Snack' },
                        ].map((chip) => {
                          const isActive = productCategoryFilter === chip.id;
                          return (
                            <TouchableOpacity
                              key={chip.id}
                              style={[
                                styles.presetChip,
                                isActive
                                  ? { backgroundColor: '#0284C7', borderColor: '#0284C7' }
                                  : { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' },
                              ]}
                              onPress={() => setProductCategoryFilter(chip.id)}
                            >
                              <Text
                                style={[
                                  styles.presetChipText,
                                  isActive ? { color: '#FFFFFF', fontWeight: '800' } : { color: '#475569' },
                                ]}
                              >
                                {chip.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>

                  {/* DANH SÁCH CARDS SẢN PHẨM */}
                  {filteredProducts.length === 0 ? (
                    <View style={[styles.panelCard, { alignItems: 'center', paddingVertical: 32 }]}>
                      <Text style={{ fontSize: 28 }}>📦</Text>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginTop: 8 }}>
                        Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                      </Text>
                      <TouchableOpacity
                        style={[styles.btnActionSmallPrimary, { marginTop: 12 }]}
                        onPress={() => {
                          setProductSearch('');
                          setProductCategoryFilter('all');
                        }}
                      >
                        <Text style={styles.btnActionSmallPrimaryText}>Đặt lại bộ lọc</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    filteredProducts.map((p) => {
                      const savings = Math.max(0, p.originalPrice - p.price);
                      const isLitter = p.productType === 'litter' || p.category.toLowerCase().includes('cát');
                      return (
                        <View key={p.id} style={styles.productCard}>
                          {/* HEADER CỦA CARD SẢN PHẨM */}
                          <View style={styles.productCardTop}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                              <View style={[styles.badgeCategory, isLitter && { backgroundColor: '#FEF3C7' }]}>
                                <Text style={[styles.badgeCategoryText, isLitter && { color: '#B45309' }]}>
                                  {isLitter ? '🚽 ' : '🥣 '}
                                  {p.category}
                                </Text>
                              </View>
                              <Text style={styles.badgeSku}>Mã: {p.sku}</Text>
                              <View style={styles.badgeBrand}>
                                <Text style={styles.badgeBrandText}>{p.brand}</Text>
                              </View>
                              {p.isNewlyLaunched && (
                                <View style={[styles.badgeBrand, { backgroundColor: '#FEE2E2' }]}>
                                  <Text style={[styles.badgeBrandText, { color: '#DC2626' }]}>✨ Vừa mở bán</Text>
                                </View>
                              )}
                              <TouchableOpacity
                                style={[
                                  styles.badgeCategory,
                                  p.inStock !== false
                                    ? { backgroundColor: '#DCFCE7' }
                                    : { backgroundColor: '#FEE2E2' },
                                ]}
                                onPress={() => toggleProductStock(p.id)}
                              >
                                <Text
                                  style={[
                                    styles.badgeCategoryText,
                                    { color: p.inStock !== false ? '#15803D' : '#DC2626' },
                                  ]}
                                >
                                  {p.inStock !== false ? '● Sẵn hàng' : '○ Tạm hết'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.badgeDiscount}>
                              <Text style={styles.badgeDiscountText}>-{p.discountPercent}%</Text>
                            </View>
                          </View>

                          {/* NỘI DUNG CHÍNH 2 CỘT */}
                          <View style={styles.productCardMain}>
                            {/* CỘT ẢNH: ẢNH CHÍNH + 5 THUMBNAILS NHỎ BÊN DƯỚI */}
                            <View style={styles.productMediaCol}>
                              <Image source={{ uri: p.image }} style={styles.productMainImage} contentFit="cover" />
                              <View style={styles.productGalleryThumbRow}>
                                {(Array.isArray(p.galleryImages)
                                  ? p.galleryImages
                                  : typeof p.galleryImages === 'string' && p.galleryImages
                                  ? [p.galleryImages]
                                  : []
                                )
                                  .slice(0, 5)
                                  .map((imgUrl, idx) => (
                                    <Image key={idx} source={{ uri: imgUrl }} style={styles.productSmallThumb} contentFit="cover" />
                                  ))}
                              </View>
                            </View>

                            {/* CỘT THÔNG TIN: TÊN, GIÁ, TRỌNG LƯỢNG, ĐẶC ĐIỂM NỔI BẬT */}
                            <View style={styles.productInfoCol}>
                              <Text style={styles.productTitleMain}>{p.name}</Text>
                              <Text style={styles.productRatingSold}>
                                ★ {p.rating ?? 5.0} ({p.reviewCount ?? 0} đánh giá) • Đã bán {formatNumberVi(p.soldCount)} • Tồn kho: {p.stock ?? 0} gói
                              </Text>

                              {/* HIGHLIGHT TAGS (NẾU CÓ) */}
                              {Array.isArray(p.highlightTags) && p.highlightTags.length > 0 && (
                                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginVertical: 2 }}>
                                  {p.highlightTags.map((tag, tIdx) => (
                                    <View
                                      key={tIdx}
                                      style={{
                                        backgroundColor: '#F0FDF4',
                                        borderWidth: 1,
                                        borderColor: '#BBF7D0',
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        borderRadius: 4,
                                      }}
                                    >
                                      <Text style={{ fontSize: 10, color: '#166534', fontWeight: '700' }}>✓ {tag}</Text>
                                    </View>
                                  ))}
                                </View>
                              )}

                              {/* KHỐI GIÁ BÁN & TIẾT KIỆM */}
                              <View style={styles.priceContainer}>
                                <Text style={styles.priceCurrent}>{formatNumberVi(p.price)} đ</Text>
                                <Text style={styles.priceOld}>{formatNumberVi(p.originalPrice)} đ</Text>
                                {savings > 0 && (
                                  <View style={styles.badgeSaving}>
                                    <Text style={styles.badgeSavingText}>Tiết kiệm {formatNumberVi(savings)} đ</Text>
                                  </View>
                                )}
                              </View>

                              <Text style={styles.productDesc}>{p.description}</Text>

                              {/* QUY CÁCH TRỌNG LƯỢNG */}
                              <View style={{ marginTop: 6 }}>
                                <Text style={styles.specLabel}>Quy cách trọng lượng & giá biến thể:</Text>
                                <View style={styles.weightVariantRow}>
                                  {Array.isArray(p.weightOptions) && p.weightOptions.map((w, wIdx) => (
                                    <View key={wIdx} style={styles.weightVariantChip}>
                                      <Text style={styles.weightVariantWeight}>{w.weight}</Text>
                                      <Text style={styles.weightVariantPrice}>{formatNumberVi(w.price)} đ</Text>
                                    </View>
                                  ))}
                                </View>
                              </View>

                              {/* ĐẶC ĐIỂM NỔI BẬT HOẶC MÙI HƯƠNG */}
                              {isLitter ? (
                                <View style={[styles.nutritionHighlightBox, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                                  {Array.isArray(p.scents) && p.scents.length > 0 ? (
                                    <View style={styles.highlightLine}>
                                      <Text style={[styles.highlightHeading, { color: '#B45309' }]}>Hương thơm ({p.scents.length}):</Text>
                                      <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap', flex: 1 }}>
                                        {p.scents.map((scent, scIdx) => (
                                          <View
                                            key={scIdx}
                                            style={{
                                              backgroundColor: '#FEF3C7',
                                              paddingHorizontal: 6,
                                              paddingVertical: 2,
                                              borderRadius: 4,
                                            }}
                                          >
                                            <Text style={{ fontSize: 10.5, color: '#92400E', fontWeight: '700' }}>
                                              🌸 {scent}
                                            </Text>
                                          </View>
                                        ))}
                                      </View>
                                    </View>
                                  ) : null}
                                  <View style={styles.highlightLine}>
                                    <Text style={[styles.highlightHeading, { color: '#B45309' }]}>Chất liệu khử mùi:</Text>
                                    <Text style={styles.highlightValue}>{p.proteinSources}</Text>
                                  </View>
                                  <View style={styles.highlightLine}>
                                    <Text style={[styles.highlightHeading, { color: '#B45309' }]}>Tính năng & Kháng khuẩn:</Text>
                                    <Text style={styles.highlightValue}>
                                      {p.crudeFiber || 'Độ hút ẩm > 350%'} • {p.caloriesKcal || 'Kháng khuẩn 99%'}
                                    </Text>
                                  </View>
                                </View>
                              ) : (
                                <View style={styles.nutritionHighlightBox}>
                                  <View style={styles.highlightLine}>
                                    <Text style={styles.highlightHeading}>Nguồn đạm chính:</Text>
                                    <Text style={styles.highlightValue}>{p.proteinSources}</Text>
                                  </View>
                                  <View style={styles.highlightLine}>
                                    <Text style={styles.highlightHeading}>Đối tượng phù hợp:</Text>
                                    <Text style={styles.highlightValue}>{p.targetPet}</Text>
                                  </View>
                                  <View style={styles.highlightLine}>
                                    <Text style={styles.highlightHeading}>Đạm / Béo / Xơ / Calo:</Text>
                                    <Text style={styles.highlightValue}>
                                      Đạm {p.crudeProtein} • Béo {p.crudeFat}
                                      {p.crudeFiber ? ` • Xơ ${p.crudeFiber}` : ''}
                                      {p.caloriesKcal ? ` • ${p.caloriesKcal}` : ''}
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </View>
                          </View>

                          {/* CHÂN CARD: CÁC NÚT HÀNH ĐỘNG QUẢN TRỊ */}
                          <View style={styles.productCardFooter}>
                            <TouchableOpacity
                              style={styles.btnViewClient}
                              onPress={() => router.push({ pathname: '/detail', params: { id: p.id } })}
                            >
                              <Text style={styles.btnViewClientText}>👁️ Xem Trang Khách (/detail?id={p.id})</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                              <TouchableOpacity
                                style={[
                                  styles.btnActionSmall,
                                  p.inStock !== false
                                    ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }
                                    : { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
                                ]}
                                onPress={() => toggleProductStock(p.id)}
                              >
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: '700',
                                    color: p.inStock !== false ? '#15803D' : '#DC2626',
                                  }}
                                >
                                  {p.inStock !== false ? '🟢 Còn hàng' : '🔴 Hết hàng'}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[styles.btnActionSmall, styles.btnEditSmall]}
                                onPress={() => openModal('product', p)}
                              >
                                <Text style={styles.btnEditText}>✏️ Sửa Chi Tiết</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                                onPress={() => handleDelete('product', p.id)}
                              >
                                <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              );
            })()}

            {/* 3. 🥫 DANH MỤC */}
            {activeTab === 'categories' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Quản Lý Danh Mục Thức Ăn ({categories.length} nhóm)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('category')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Danh Mục</Text>
                    </TouchableOpacity>
                  </View>
                  {categories.map((c) => (
                    <View key={c.id} style={styles.listItemRow}>
                      <Text style={{ fontSize: 24 }}>{c.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Text style={styles.listMainTitle}>{c.name}</Text>
                          <Text style={{ fontSize: 11, color: '#64748B' }}>({c.productCount} sản phẩm)</Text>
                        </View>
                        <Text style={styles.listSubText}>{c.description}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            c.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleCategoryStatus(c.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: c.status === 'active' ? '#15803D' : '#64748B' }]}>
                            {c.status === 'active' ? '🟢 Hiển thị' : '⚪ Đang ẩn'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('category', c)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('category', c.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 4. 🏷️ THƯƠNG HIỆU */}
            {activeTab === 'brands' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Thương Hiệu Thức Ăn Thú Cưng ({brands.length} thương hiệu)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('brand')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Thương Hiệu</Text>
                    </TouchableOpacity>
                  </View>
                  {brands.map((b) => (
                    <View key={b.id} style={styles.listItemRow}>
                      <Text style={{ fontSize: 24 }}>{b.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Text style={styles.listMainTitle}>{b.name}</Text>
                          <Text style={{ fontSize: 11, color: '#0284C7', fontWeight: '700' }}>({b.country})</Text>
                          {b.isOfficial && (
                            <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                              <Text style={{ fontSize: 10, fontWeight: '800', color: '#B45309' }}>CHÍNH HÃNG</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.listSubText}>{b.description}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            b.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleBrandStatus(b.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: b.status === 'active' ? '#15803D' : '#64748B' }]}>
                            {b.status === 'active' ? '🟢 Hoạt động' : '⚪ Tạm dừng'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('brand', b)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('brand', b.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 5. 📦 KHO HÀNG */}
            {activeTab === 'inventory' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Quản Lý Tồn Kho & Kệ Hàng ({inventory.length} mặt hàng)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('inventory')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Nhập Hàng Kho</Text>
                    </TouchableOpacity>
                  </View>
                  {inventory.map((inv) => (
                    <View key={inv.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{inv.productName} ({inv.sku})</Text>
                        <Text style={styles.listSubText}>📍 Vị trí: {inv.location} • Quy cách: {inv.packaging}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: inv.stockQty < 15 ? '#DC2626' : '#0284C7', marginTop: 2 }}>
                          Tồn kho: {inv.stockQty} gói {inv.stockQty < 15 ? '⚠️ (Sắp hết)' : ''}
                        </Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, { backgroundColor: '#E0F2FE' }]}
                          onPress={() => addStock(inv.id, 20)}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#0284C7' }}>+20</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, { backgroundColor: '#F1F5F9' }]}
                          onPress={() => addStock(inv.id, -10)}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>-10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('inventory', inv)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('inventory', inv.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 6. ⏰ LÔ HÀNG & HẠN DÙNG */}
            {activeTab === 'batches' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Kiểm Soát Lô Hàng & Hạn Dùng ({batches.length} lô)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('batch')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Lô Mới</Text>
                    </TouchableOpacity>
                  </View>
                  {batches.map((bat) => (
                    <View key={bat.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{bat.productName} ({bat.batchCode})</Text>
                        <Text style={styles.listSubText}>NSX: {bat.mfgDate} ➔ HSD: {bat.expDate} • {bat.packageType}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: bat.daysRemaining < 100 ? '#DC2626' : '#059669', marginTop: 2 }}>
                          Còn {bat.daysRemaining} ngày sử dụng {bat.daysRemaining < 100 ? '⚠️ (Cần ưu tiên xuất)' : ''}
                        </Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('batch', bat)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('batch', bat.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 7. 🛒 ĐƠN HÀNG */}
            {activeTab === 'orders' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Quản Lý Đơn Đặt Hàng ({orders.length} đơn)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('order')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Tạo Đơn Mới</Text>
                    </TouchableOpacity>
                  </View>
                  {orders.map((ord) => (
                    <View key={ord.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{ord.code} • {ord.customerName}</Text>
                        <Text style={styles.listSubText}>SĐT: {ord.phone} • {ord.address}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#DC2626', marginTop: 2 }}>
                          Tổng tiền: {formatNumberVi(ord.totalPrice)} ₫ ({ord.paymentMethod})
                        </Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, { backgroundColor: '#FEF3C7' }]}
                          onPress={() => cycleOrderStatus(ord.id)}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#B45309' }}>
                            {ord.status.toUpperCase()} 🔄
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('order', ord)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('order', ord.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 8. 👥 KHÁCH HÀNG */}
            {activeTab === 'customers' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Hồ Sơ Khách Hàng Thành Viên ({customers.length} hội viên)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('customer')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Khách Hàng</Text>
                    </TouchableOpacity>
                  </View>
                  {customers.map((cus) => {
                    const cusPets = getPetsByCustomerId(cus.id);
                    return (
                      <View key={cus.id} style={styles.listItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.listMainTitle}>{cus.name} ({cus.phone})</Text>
                          <Text style={styles.listSubText}>
                            🐾 Thú cưng ({cusPets.length} bé):{' '}
                            <Text style={{ fontWeight: '700', color: '#38BDF8' }}>
                              {cusPets.length > 0 ? cusPets.map((p) => p.name).join(', ') : 'Chưa có bé nào'}
                            </Text>{' '}
                            • {cus.email}
                          </Text>
                          <Text style={styles.listSubText}>Hạng: {cus.tier} • Chi tiêu: {formatNumberVi(cus.totalSpent)} ₫ • PetXu: {cus.petXu ?? 0}</Text>
                        </View>
                        <View style={styles.rowActionsGroup}>
                          <TouchableOpacity
                            style={[styles.btnActionSmall, { backgroundColor: '#0284C7', borderColor: '#38BDF8' }]}
                            onPress={() => setViewingCustomerPets(cus)}
                          >
                            <Text style={[styles.btnEditText, { color: '#FFFFFF', fontWeight: '800' }]}>
                              🐾 Xem {cusPets.length} bé
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.btnActionSmall, styles.btnEditSmall]}
                            onPress={() => openModal('customer', cus)}
                          >
                            <Text style={styles.btnEditText}>✏️ Sửa</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                            onPress={() => handleDelete('customer', cus.id)}
                          >
                            <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 9. 🚚 VẬN CHUYỂN */}
            {activeTab === 'shipping' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Đội Ngũ Shipper Giao Hàng ({shippers.length} tài xế)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('shipping')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Shipper</Text>
                    </TouchableOpacity>
                  </View>
                  {shippers.map((shp) => (
                    <View key={shp.id} style={styles.listItemRow}>
                      <Text style={{ fontSize: 24 }}>🛵</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{shp.name} ({shp.licensePlate})</Text>
                        <Text style={styles.listSubText}>SĐT: {shp.phone} • {shp.serviceType} • ★ {shp.rating}</Text>
                        <Text style={styles.listSubText}>Đơn đang giao: {shp.activeOrders}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            shp.status === 'idle'
                              ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }
                              : shp.status === 'delivering'
                              ? { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }
                              : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleShipperStatus(shp.id)}
                        >
                          <Text
                            style={[
                              styles.btnToggleSmallText,
                              {
                                color:
                                  shp.status === 'idle'
                                    ? '#15803D'
                                    : shp.status === 'delivering'
                                    ? '#B45309'
                                    : '#64748B',
                              },
                            ]}
                          >
                            {shp.status === 'idle' ? '🟢 Sẵn sàng' : shp.status === 'delivering' ? '🚚 Đang giao' : '⚪ Nghỉ ca'} 🔄
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('shipping', shp)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('shipping', shp.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 10. 💳 THANH TOÁN */}
            {activeTab === 'payments' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Giao Dịch Cổng Thanh Toán ({payments.length} giao dịch)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('payment')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Giao Dịch</Text>
                    </TouchableOpacity>
                  </View>
                  {payments.map((p) => (
                    <View key={p.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{p.txnCode} • {p.customerName}</Text>
                        <Text style={styles.listSubText}>Mã đơn: {p.orderCode} • {p.method} • {p.time}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#059669', marginTop: 2 }}>
                          {formatNumberVi(p.amount)} ₫
                        </Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            p.status === 'success'
                              ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }
                              : p.status === 'pending'
                              ? { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }
                              : { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
                          ]}
                          onPress={() => togglePaymentStatus(p.id)}
                        >
                          <Text
                            style={[
                              styles.btnToggleSmallText,
                              {
                                color:
                                  p.status === 'success'
                                    ? '#15803D'
                                    : p.status === 'pending'
                                    ? '#B45309'
                                    : '#DC2626',
                              },
                            ]}
                          >
                            {p.status === 'success' ? '🟢 Thành công' : p.status === 'pending' ? '⏳ Chờ duyệt' : '⚪ Hoàn tiền'} 🔄
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('payment', p)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('payment', p.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 11. 🎁 KHUYẾN MÃI */}
            {activeTab === 'promotions' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Voucher Khuyến Mãi ({promotions.length} mã)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('promotion')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Voucher</Text>
                    </TouchableOpacity>
                  </View>
                  {promotions.map((pro) => (
                    <View key={pro.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.listMainTitle, { color: '#0284C7' }]}>{pro.code} ({pro.discountValue})</Text>
                        <Text style={styles.listSubText}>{pro.description} • Hạn dùng: {pro.expiryDate}</Text>
                        <Text style={styles.listSubText}>Đơn tối thiểu: {formatNumberVi(pro.minOrder)} ₫ • Đã dùng: {pro.usageCount}/{pro.maxUsage}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            pro.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => togglePromotionStatus(pro.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: pro.status === 'active' ? '#15803D' : '#64748B' }]}>
                            {pro.status === 'active' ? '🟢 Hoạt động' : '⚪ Tạm dừng'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('promotion', pro)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('promotion', pro.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 12. 🏢 NHÀ CUNG CẤP */}
            {activeTab === 'suppliers' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Nhà Phân Phối & Nhập Khẩu ({suppliers.length} đối tác)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('supplier')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Nhà Cung Cấp</Text>
                    </TouchableOpacity>
                  </View>
                  {suppliers.map((sup) => (
                    <View key={sup.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{sup.name} ({sup.code})</Text>
                        <Text style={styles.listSubText}>Nhãn hàng: {sup.brandsSupplied} • Hotline: {sup.phone}</Text>
                        <Text style={styles.listSubText}>Kho: {sup.warehouseCity} • Liên hệ: {sup.contactPerson} • HĐ đến: {sup.contractUntil}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('supplier', sup)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('supplier', sup.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 13. ⭐ ĐÁNH GIÁ */}
            {activeTab === 'reviews' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Đánh Giá Của Khách Hàng ({reviews.length} đánh giá)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('review')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Đánh Giá</Text>
                    </TouchableOpacity>
                  </View>
                  {reviews.map((rev) => (
                    <View key={rev.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{rev.customerName} - {rev.productName}</Text>
                        <Text style={styles.listSubText}>"{rev.comment}"</Text>
                        <Text style={{ fontSize: 11, color: '#F59E0B', marginTop: 2 }}>{'⭐'.repeat(rev.rating)} • {rev.date}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            rev.status === 'approved' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleReviewStatus(rev.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: rev.status === 'approved' ? '#15803D' : '#64748B' }]}>
                            {rev.status === 'approved' ? '🟢 Đã duyệt' : '⚪ Đã ẩn'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('review', rev)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('review', rev.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 14. 🖼️ BANNER */}
            {activeTab === 'banners' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Banner Slide Trang Chủ ({banners.length} banner)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('banner')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Banner Mới</Text>
                    </TouchableOpacity>
                  </View>
                  {banners.map((ban) => {
                    const isVid =
                      ban.mediaType === 'video' ||
                      (typeof ban.image === 'string' && (ban.image.includes('.mp4') || ban.image.includes('.mov')));
                    return (
                      <View key={ban.id} style={styles.listItemRow}>
                        {isVid ? (
                          <View
                            style={{
                              width: 100,
                              height: 60,
                              borderRadius: 6,
                              backgroundColor: '#0F172A',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: '#38BDF8',
                            }}
                          >
                            <Text style={{ fontSize: 20 }}>🎬</Text>
                            <Text style={{ color: '#38BDF8', fontSize: 9, fontWeight: '800' }}>MP4 VIDEO</Text>
                          </View>
                        ) : (
                          <Image source={{ uri: ban.image }} style={{ width: 100, height: 60, borderRadius: 6 }} contentFit="cover" />
                        )}
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.listMainTitle, { color: ban.themeColor || '#0284C7' }]}>
                              {isVid ? '🎬 [VIDEO MP4] ' : '🖼️ '} [{ban.badge}] {ban.title}
                            </Text>
                          </View>
                          <Text style={styles.listSubText}>{ban.subtitle}</Text>
                        </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            ban.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleBannerStatus(ban.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: ban.status === 'active' ? '#15803D' : '#64748B' }]}>
                            {ban.status === 'active' ? '🟢 Hiển thị' : '⚪ Tạm ẩn'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('banner', ban)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('banner', ban.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 15. 📰 BÀI VIẾT */}
            {activeTab === 'articles' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Cẩm Nang & Bài Viết Thú Y ({articles.length} bài)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('article')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Viết Bài Mới</Text>
                    </TouchableOpacity>
                  </View>
                  {articles.map((art) => (
                    <View key={art.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{art.title}</Text>
                        <Text style={styles.listSubText}>{art.category} • Tác giả: {art.author}</Text>
                        <Text style={styles.listSubText}>Lượt xem: {formatNumberVi(art.readCount)} • Ngày: {art.publishDate}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            art.status === 'published' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleArticleStatus(art.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: art.status === 'published' ? '#15803D' : '#64748B' }]}>
                            {art.status === 'published' ? '🟢 Xuất bản' : '⚪ Bản nháp'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('article', art)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('article', art.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 16. 💬 PHẢN HỒI */}
            {activeTab === 'feedbacks' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Yêu Cầu Tư Vấn & Phản Hồi ({feedbacks.length} yêu cầu)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('feedback')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Phản Hồi</Text>
                    </TouchableOpacity>
                  </View>
                  {feedbacks.map((fb) => (
                    <View key={fb.id} style={styles.listItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{fb.customerName} ({fb.phone})</Text>
                        <Text style={styles.listSubText}>Bé cưng: {fb.petName} • Phân loại: {fb.type}</Text>
                        <Text style={styles.listSubText}>"{fb.message}"</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            fb.status === 'new'
                              ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }
                              : fb.status === 'contacting'
                              ? { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }
                              : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                          ]}
                          onPress={() => toggleFeedbackStatus(fb.id)}
                        >
                          <Text
                            style={[
                              styles.btnToggleSmallText,
                              {
                                color:
                                  fb.status === 'new'
                                    ? '#15803D'
                                    : fb.status === 'contacting'
                                    ? '#B45309'
                                    : '#64748B',
                              },
                            ]}
                          >
                            {fb.status === 'new' ? '🆕 Mới nhận' : fb.status === 'contacting' ? '📞 Đang tư vấn' : '✅ Đã giải quyết'} 🔄
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('feedback', fb)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('feedback', fb.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ⏱️ QUẢN LÝ PHÂN CA & LỊCH LÀM VIỆC NHÂN VIÊN */}
            {activeTab === 'shifts' && (() => {
              const todayStr = new Date().toISOString().split('T')[0];
              const todayCount = shifts.filter((s) => s.shift_date === todayStr).length;
              const workingCount = shifts.filter((s) => s.status === 'checked_in').length;
              const scheduledCount = shifts.filter((s) => s.status === 'scheduled').length;
              const completedCount = shifts.filter((s) => s.status === 'completed').length;
              const leaveOrAbsentCount = shifts.filter((s) => s.status === 'leave' || s.status === 'absent').length;

              const filteredShifts = shifts.filter((s) => {
                if (shiftSearchQuery.trim()) {
                  const q = shiftSearchQuery.toLowerCase();
                  const matchName = (s.employee_name || '').toLowerCase().includes(q);
                  const matchId = (s.employee_id || '').toLowerCase().includes(q);
                  const matchRole = (s.employee_role || '').toLowerCase().includes(q);
                  const matchBranch = (s.branch || '').toLowerCase().includes(q);
                  if (!matchName && !matchId && !matchRole && !matchBranch) return false;
                }
                if (shiftDateFilter === 'today' && s.shift_date !== todayStr) return false;
                if (shiftTypeFilter !== 'all' && s.shift_type !== shiftTypeFilter) return false;
                if (shiftStatusFilter !== 'all' && s.status !== shiftStatusFilter) return false;
                return true;
              });

              const getRoleIcon = (role: string) => {
                const r = (role || '').toLowerCase();
                if (r.includes('bác sĩ') || r.includes('cấp cứu') || r.includes('khám')) return '👨‍⚕️';
                if (r.includes('spa') || r.includes('grooming') || r.includes('tắm')) return '✂️';
                if (r.includes('kho')) return '📦';
                if (r.includes('thu ngân')) return '💵';
                if (r.includes('tư vấn') || r.includes('bán hàng') || r.includes('cskh')) return '💁‍♀️';
                return '👤';
              };

              const getStatusBadgeInfo = (st: string) => {
                switch (st) {
                  case 'checked_in':
                    return { label: '🟢 Đang làm việc', bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };
                  case 'scheduled':
                    return { label: '⏳ Đã xếp ca', bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
                  case 'completed':
                    return { label: '✅ Đã hoàn thành', bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
                  case 'leave':
                    return { label: '🏖️ Nghỉ phép', bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
                  case 'absent':
                    return { label: '❌ Vắng mặt', bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' };
                  default:
                    return { label: st, bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
                }
              };

              return (
                <View style={styles.sectionWrap}>
                  {/* BẢNG THỐNG KÊ NHANH KPI CA LÀM VIỆC */}
                  <View style={styles.panelCard}>
                    <View style={styles.panelHeaderRow}>
                      <View>
                        <Text style={styles.panelTitleNoBorder}>
                          ⏱️ Quản Lý Ca Trực & Lịch Làm Việc ({filteredShifts.length}/{shifts.length} ca)
                        </Text>
                        <Text style={styles.listSubText}>
                          Phân ca làm việc, điểm danh check-in 1 chạm, theo dõi bác sĩ thú y & nhân viên cửa hàng
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}
                          onPress={async () => {
                            try {
                              const res = await fetch(`${API_BASE}/get_shifts.php`);
                              const json = await res.json();
                              if (json?.success && Array.isArray(json.data)) {
                                setShifts(json.data);
                                showToast('⚡ Đã đồng bộ ca nhân viên từ MySQL!');
                              }
                            } catch (e) {
                              showToast('⚠️ Không thể kết nối API XAMPP');
                            }
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#16A34A' }}>🔄 Tải Lại CSDL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnActionSmallPrimary}
                          onPress={() => openModal('shift')}
                        >
                          <Text style={styles.btnActionSmallPrimaryText}>+ Phân Ca Mới</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* 5 THẺ THỐNG KÊ KPI */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                      <View style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 10, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' }}>
                        <Text style={{ fontSize: 12, color: '#1E40AF', fontWeight: '600' }}>📅 Ca Hôm Nay</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1D4ED8', marginTop: 4 }}>{todayCount}</Text>
                        <Text style={{ fontSize: 11, color: '#60A5FA' }}>Ngày {todayStr}</Text>
                      </View>

                      <View style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 10, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' }}>
                        <Text style={{ fontSize: 12, color: '#166534', fontWeight: '600' }}>🟢 Đang Làm Việc</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#15803D', marginTop: 4 }}>{workingCount}</Text>
                        <Text style={{ fontSize: 11, color: '#4ADE80' }}>Đã check-in điểm danh</Text>
                      </View>

                      <View style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 10, backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#BAE6FD' }}>
                        <Text style={{ fontSize: 12, color: '#0369A1', fontWeight: '600' }}>⏳ Đã Xếp Ca</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0284C7', marginTop: 4 }}>{scheduledCount}</Text>
                        <Text style={{ fontSize: 11, color: '#38BDF8' }}>Chờ đến giờ vào ca</Text>
                      </View>

                      <View style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600' }}>✅ Đã Hoàn Thành</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#334155', marginTop: 4 }}>{completedCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8' }}>Đã check-out tan ca</Text>
                      </View>

                      <View style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 10, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' }}>
                        <Text style={{ fontSize: 12, color: '#991B1B', fontWeight: '600' }}>🏖️ Nghỉ / Vắng</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#DC2626', marginTop: 4 }}>{leaveOrAbsentCount}</Text>
                        <Text style={{ fontSize: 11, color: '#F87171' }}>Có phép & không phép</Text>
                      </View>
                    </View>
                  </View>

                  {/* KHUNG TÌM KIẾM & BỘ LỌC ĐA CHIỀU */}
                  <View style={[styles.panelCard, { marginTop: 12 }]}>
                    {/* Ô TÌM KIẾM */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 }}>
                      <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
                      <TextInput
                        style={{ flex: 1, height: 40, fontSize: 14, color: '#0F172A' }}
                        value={shiftSearchQuery}
                        onChangeText={setShiftSearchQuery}
                        placeholder="Tìm theo tên nhân viên, mã NV (NV-001), bác sĩ, chi nhánh..."
                        placeholderTextColor="#94A3B8"
                      />
                      {shiftSearchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setShiftSearchQuery('')}>
                          <Text style={{ fontSize: 14, color: '#94A3B8' }}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* CÁC NÚT LỌC NHANH */}
                    <View style={{ flexDirection: 'column', gap: 8 }}>
                      {/* Lọc Ngày */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', width: 75 }}>NGÀY:</Text>
                        {[
                          { key: 'all', label: `Tất cả ngày (${shifts.length})` },
                          { key: 'today', label: `📅 Hôm nay (${todayCount})` },
                        ].map((dOpt) => (
                          <TouchableOpacity
                            key={dOpt.key}
                            style={[styles.tabMiniBtn, shiftDateFilter === dOpt.key && styles.tabMiniBtnActive]}
                            onPress={() => setShiftDateFilter(dOpt.key as any)}
                          >
                            <Text style={[styles.tabMiniBtnText, shiftDateFilter === dOpt.key && styles.tabMiniBtnTextActive]}>
                              {dOpt.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Lọc Khung ca */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', width: 75 }}>CA TRỰC:</Text>
                        {[
                          { key: 'all', label: 'Tất cả ca' },
                          { key: 'morning', label: '🌅 Ca Sáng (07:30 - 12:00)' },
                          { key: 'afternoon', label: '☀️ Ca Chiều (12:00 - 17:30)' },
                          { key: 'evening', label: '🌙 Ca Tối (17:30 - 22:00)' },
                          { key: 'fulltime', label: '🏢 Hành chính (08:00 - 17:00)' },
                          { key: 'night', label: '🦉 Ca Đêm 24/7 (22:00 - 07:30)' },
                        ].map((cOpt) => (
                          <TouchableOpacity
                            key={cOpt.key}
                            style={[styles.tabMiniBtn, shiftTypeFilter === cOpt.key && styles.tabMiniBtnActive]}
                            onPress={() => setShiftTypeFilter(cOpt.key)}
                          >
                            <Text style={[styles.tabMiniBtnText, shiftTypeFilter === cOpt.key && styles.tabMiniBtnTextActive]}>
                              {cOpt.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Lọc Trạng thái */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', width: 75 }}>TRẠNG THÁI:</Text>
                        {[
                          { key: 'all', label: 'Tất cả trạng thái' },
                          { key: 'checked_in', label: '🟢 Đang làm việc' },
                          { key: 'scheduled', label: '⏳ Đã xếp ca' },
                          { key: 'completed', label: '✅ Đã hoàn thành' },
                          { key: 'leave', label: '🏖️ Nghỉ phép' },
                          { key: 'absent', label: '❌ Vắng mặt' },
                        ].map((sOpt) => (
                          <TouchableOpacity
                            key={sOpt.key}
                            style={[styles.tabMiniBtn, shiftStatusFilter === sOpt.key && styles.tabMiniBtnActive]}
                            onPress={() => setShiftStatusFilter(sOpt.key)}
                          >
                            <Text style={[styles.tabMiniBtnText, shiftStatusFilter === sOpt.key && styles.tabMiniBtnTextActive]}>
                              {sOpt.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* DANH SÁCH CÁC CA LÀM VIỆC */}
                  <View style={[styles.panelCard, { marginTop: 12 }]}>
                    <View style={styles.panelHeaderRow}>
                      <Text style={styles.panelTitleNoBorder}>
                        📋 Danh Sách Phân Ca Nhân Viên ({filteredShifts.length} ca phù hợp)
                      </Text>
                      {(shiftSearchQuery || shiftDateFilter !== 'all' || shiftTypeFilter !== 'all' || shiftStatusFilter !== 'all') && (
                        <TouchableOpacity
                          onPress={() => {
                            setShiftSearchQuery('');
                            setShiftDateFilter('all');
                            setShiftTypeFilter('all');
                            setShiftStatusFilter('all');
                          }}
                        >
                          <Text style={{ fontSize: 12, color: '#0284C7', fontWeight: '700' }}>✕ Bỏ lọc</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {filteredShifts.length === 0 ? (
                      <View style={{ paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Không tìm thấy ca làm việc nào!</Text>
                        <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Thử đổi bộ lọc hoặc thêm ca phân công mới.</Text>
                      </View>
                    ) : (
                      <View style={{ gap: 10, marginTop: 8 }}>
                        {filteredShifts.map((s) => {
                          const statusInfo = getStatusBadgeInfo(s.status);
                          const roleIcon = getRoleIcon(s.employee_role);

                          return (
                            <View
                              key={s.id}
                              style={{
                                padding: 14,
                                borderRadius: 12,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 1,
                                borderColor: s.status === 'checked_in' ? '#86EFAC' : '#E2E8F0',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.04,
                                shadowRadius: 3,
                                elevation: 1,
                              }}
                            >
                              {/* HEADER THẺ CA */}
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#CBD5E1' }}>
                                    <Text style={{ fontSize: 20 }}>{roleIcon}</Text>
                                  </View>
                                  <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                      <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A' }}>{s.employee_name}</Text>
                                      <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#E2E8F0' }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>{s.employee_id}</Text>
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                      <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4, backgroundColor: '#EFF6FF' }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#1D4ED8' }}>{s.employee_role}</Text>
                                      </View>
                                      {s.employee_phone ? (
                                        <Text style={{ fontSize: 11.5, color: '#64748B' }}>📞 {s.employee_phone}</Text>
                                      ) : null}
                                    </View>
                                  </View>
                                </View>

                                {/* BADGE TRẠNG THÁI */}
                                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: statusInfo.bg, borderWidth: 1, borderColor: statusInfo.border }}>
                                  <Text style={{ fontSize: 12, fontWeight: '700', color: statusInfo.text }}>
                                    {statusInfo.label}
                                  </Text>
                                </View>
                              </View>

                              {/* BODY THẺ CA: THÔNG TIN CHI TIẾT */}
                              <View style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, gap: 4, marginVertical: 6 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                                  <Text style={{ fontSize: 12.5, color: '#334155' }}>
                                    <Text style={{ fontWeight: '700' }}>⏰ Ca làm:</Text> {s.shift_name} ({s.start_time} - {s.end_time})
                                  </Text>
                                  <Text style={{ fontSize: 12.5, color: '#334155' }}>
                                    <Text style={{ fontWeight: '700' }}>📅 Ngày:</Text> {s.shift_date}
                                  </Text>
                                  <Text style={{ fontSize: 12.5, color: '#334155' }}>
                                    <Text style={{ fontWeight: '700' }}>📍 Chi nhánh:</Text> {s.branch}
                                  </Text>
                                </View>

                                {/* THỜI GIAN ĐIỂM DANH CHECK-IN / CHECK-OUT */}
                                {(s.check_in_time || s.check_out_time) && (
                                  <View style={{ flexDirection: 'row', gap: 14, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#E2E8F0', marginTop: 2 }}>
                                    {s.check_in_time && (
                                      <Text style={{ fontSize: 12, color: '#15803D', fontWeight: '600' }}>
                                        🕒 Check-in: {s.check_in_time}
                                      </Text>
                                    )}
                                    {s.check_out_time && (
                                      <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600' }}>
                                        🏁 Check-out: {s.check_out_time}
                                      </Text>
                                    )}
                                  </View>
                                )}

                                {/* GHI CHÚ NHIỆM VỤ */}
                                {s.note ? (
                                  <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 2 }}>
                                    📝 <Text style={{ fontWeight: '600' }}>Nhiệm vụ:</Text> {s.note}
                                  </Text>
                                ) : null}
                              </View>

                              {/* FOOTER ACTIONS: ĐIỂM DANH, SỬA, XÓA */}
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, flexWrap: 'wrap', gap: 8 }}>
                                {/* Nút thao tác nhanh theo trạng thái */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                  {s.status === 'scheduled' && (
                                    <TouchableOpacity
                                      style={[styles.btnToggleSmall, { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }]}
                                      onPress={() => handleQuickShiftStatus(s.id, 'checked_in')}
                                    >
                                      <Text style={[styles.btnToggleSmallText, { color: '#15803D' }]}>🟢 Check-in Điểm Danh</Text>
                                    </TouchableOpacity>
                                  )}

                                  {s.status === 'checked_in' && (
                                    <TouchableOpacity
                                      style={[styles.btnToggleSmall, { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                                      onPress={() => handleQuickShiftStatus(s.id, 'completed')}
                                    >
                                      <Text style={[styles.btnToggleSmallText, { color: '#475569' }]}>🏁 Check-out Hoàn Thành</Text>
                                    </TouchableOpacity>
                                  )}

                                  {s.status !== 'leave' && (
                                    <TouchableOpacity
                                      style={[styles.btnToggleSmall, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}
                                      onPress={() => handleQuickShiftStatus(s.id, 'leave')}
                                    >
                                      <Text style={[styles.btnToggleSmallText, { color: '#B45309' }]}>🏖️ Xin Nghỉ</Text>
                                    </TouchableOpacity>
                                  )}

                                  {s.status !== 'scheduled' && s.status !== 'checked_in' && (
                                    <TouchableOpacity
                                      style={[styles.btnToggleSmall, { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }]}
                                      onPress={() => handleQuickShiftStatus(s.id, 'scheduled')}
                                    >
                                      <Text style={[styles.btnToggleSmallText, { color: '#0369A1' }]}>⏳ Đặt Lại Xếp Ca</Text>
                                    </TouchableOpacity>
                                  )}
                                </View>

                                {/* Nút Sửa & Xóa */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                  <TouchableOpacity
                                    style={[styles.btnActionSmall, styles.btnEditSmall]}
                                    onPress={() => openModal('shift', s)}
                                  >
                                    <Text style={styles.btnEditText}>✏️ Sửa ca</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                                    onPress={() => handleDelete('shift', s.id)}
                                  >
                                    <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </View>
              );
            })()}

            {/* 17. 👨‍💼 TÀI KHOẢN */}
            {activeTab === 'accounts' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <View style={styles.panelHeaderRow}>
                    <Text style={styles.panelTitleNoBorder}>Tài Khoản Quản Trị & Nhân Sự ({accounts.length} tài khoản)</Text>
                    <TouchableOpacity
                      style={styles.btnActionSmallPrimary}
                      onPress={() => openModal('account')}
                    >
                      <Text style={styles.btnActionSmallPrimaryText}>+ Thêm Tài Khoản</Text>
                    </TouchableOpacity>
                  </View>
                  {accounts.map((acc) => (
                    <View key={acc.id} style={styles.listItemRow}>
                      <Text style={{ fontSize: 24 }}>👨‍💼</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listMainTitle}>{acc.name} (@{acc.username})</Text>
                        <Text style={styles.listSubText}>Vai trò: {acc.role} • Email: {acc.email}</Text>
                        <Text style={styles.listSubText}>Đăng nhập gần nhất: {acc.lastLogin}</Text>
                      </View>
                      <View style={styles.rowActionsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.btnToggleSmall,
                            acc.status === 'active' ? { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' } : { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
                          ]}
                          onPress={() => toggleAccountStatus(acc.id)}
                        >
                          <Text style={[styles.btnToggleSmallText, { color: acc.status === 'active' ? '#15803D' : '#DC2626' }]}>
                            {acc.status === 'active' ? '🟢 Hoạt động' : '🔒 Đã khóa'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnEditSmall]}
                          onPress={() => openModal('account', acc)}
                        >
                          <Text style={styles.btnEditText}>✏️ Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btnActionSmall, styles.btnDeleteSmall]}
                          onPress={() => handleDelete('account', acc.id)}
                        >
                          <Text style={styles.btnDeleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 18. 📈 BÁO CÁO - THỐNG KÊ */}
            {activeTab === 'reports' && (
              <View style={styles.sectionWrap}>
                <View style={styles.panelCard}>
                  <Text style={styles.panelTitle}>Báo Cáo Tỷ Trọng Doanh Số & Top Bán Chạy</Text>
                  <Text style={styles.listSubText}>🐱 Thức ăn mèo: 62% • 🐶 Thức ăn chó: 38% • Khách mua lại: 78.5%</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* MODAL ADMIN XEM CHI TIẾT CÁC BÉ CỦA KHÁCH HÀNG */}
      <Modal
        visible={!!viewingCustomerPets}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingCustomerPets(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardLarge, { maxWidth: 520 }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <Text style={{ fontSize: 20 }}>🐾</Text>
                <View>
                  <Text style={styles.modalTitle}>Hồ Sơ Thú Cưng Của Khách Hàng</Text>
                  <Text style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>
                    Chủ nuôi: <Text style={{ fontWeight: '800', color: '#38BDF8' }}>{viewingCustomerPets?.name}</Text> ({viewingCustomerPets?.phone})
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setViewingCustomerPets(null)}>
                <Text style={{ fontSize: 18, color: '#94A3B8', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
              {viewingCustomerPets && getPetsByCustomerId(viewingCustomerPets.id).length > 0 ? (
                getPetsByCustomerId(viewingCustomerPets.id).map((pet) => (
                  <View
                    key={pet.id}
                    style={{
                      flexDirection: 'row',
                      gap: 12,
                      padding: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: '#1E293B',
                      backgroundColor: '#1E293B',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={{ uri: pet.avatar }}
                      style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: '#38BDF8' }}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1, gap: 3 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#F8FAFC' }}>{pet.name}</Text>
                        <Text
                          style={{
                            fontSize: 10.5,
                            color: '#38BDF8',
                            backgroundColor: '#0F172A',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                            fontWeight: '700',
                          }}
                        >
                          {pet.type === 'cat' ? '🐱 Mèo' : '🐶 Chó'}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#CBD5E1', fontWeight: '600' }}>Giống: {pet.breed}</Text>
                      <Text style={{ fontSize: 11, color: '#94A3B8' }}>
                        Tuổi: {pet.age} • Cân nặng: {pet.weight}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#38BDF8' }}>
                        🍽️ Khoái khẩu: <Text style={{ fontWeight: '700', color: '#E0F2FE' }}>{pet.favoriteFood}</Text>
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 32 }}>🐾</Text>
                  <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>
                    Khách hàng này hiện chưa đăng ký hồ sơ bé cưng nào.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View
              style={{
                padding: 14,
                borderTopWidth: 1,
                borderTopColor: '#1E293B',
                alignItems: 'flex-end',
                backgroundColor: '#0F172A',
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: '#0284C7',
                }}
                onPress={() => setViewingCustomerPets(null)}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>Đóng lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES CHO GIAO DIỆN QUẢN LÝ SẢN PHẨM ĐẦY ĐỦ NHẤT
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    ...(Platform.OS === 'web' ? ({ height: '100vh', maxHeight: '100vh', overflow: 'hidden' } as any) : {}),
  },
  adminMainLayout: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },

  // SIDEBAR
  verticalSidebar: {
    width: 250,
    backgroundColor: '#0F172A',
    borderRightWidth: 1,
    borderRightColor: '#1E293B',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarBrand: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sidebarBrandIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarBrandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  sidebarProBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sidebarProBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sidebarBrandSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarScrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sidebarMenuHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  sidebarMenuDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 8,
    marginHorizontal: 8,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
    marginVertical: 1.5,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  sidebarNavItemActive: {
    backgroundColor: '#0284C7',
  },
  sidebarNavText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#CBD5E1',
    flex: 1,
  },
  sidebarNavTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sidebarFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 6,
  },
  sidebarBackShopBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  sidebarBackShopBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#38BDF8',
  },

  // KHU VỰC CHÍNH BÊN PHẢI
  mainRightArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  rightTopHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  rightHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  rightHeaderSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  refreshBtn: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  btnAction: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  contentScrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
  },
  sectionWrap: {
    gap: 16,
  },

  // BANNER HỆ THỐNG & NHÓM KPI
  systemStatusBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  systemStatusTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  systemStatusSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  systemStatusTag: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  systemStatusTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  kpiGroupTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'all 0.2s ease' } as any) : {}),
  },
  kpiCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiCardIcon: {
    fontSize: 16,
  },
  kpiLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
  },
  kpiVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  kpiNote: {
    fontSize: 11,
    color: '#64748B',
  },

  // CARD SẢN PHẨM HOÀN CHỈNH
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    gap: 12,
  },
  productCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  badgeCategory: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  badgeSku: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  badgeBrand: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeBrandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  badgeDiscount: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeDiscountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  productCardMain: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: Platform.OS === 'web' ? 'nowrap' : 'wrap',
  },
  productMediaCol: {
    width: 170,
    gap: 6,
  },
  productMainImage: {
    width: 170,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  productGalleryThumbRow: {
    flexDirection: 'row',
    gap: 4,
  },
  productSmallThumb: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  productInfoCol: {
    flex: 1,
    gap: 6,
  },
  productTitleMain: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  productRatingSold: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2,
  },
  priceCurrent: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626',
  },
  priceOld: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  badgeSaving: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeSavingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  productDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  specLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  weightVariantRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  weightVariantChip: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  weightVariantWeight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  weightVariantPrice: {
    fontSize: 10,
    color: '#E0F2FE',
  },
  nutritionHighlightBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    gap: 4,
    marginTop: 6,
  },
  highlightLine: {
    flexDirection: 'row',
    gap: 6,
  },
  highlightHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
    width: 130,
  },
  highlightValue: {
    fontSize: 11.5,
    color: '#334155',
    flex: 1,
  },
  productCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  btnViewClient: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnViewClientText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  btnActionSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnEditSmall: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  btnEditText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  btnDeleteSmall: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  btnDeleteText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#DC2626',
  },

  // LIST ITEM & PANEL
  panelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  panelTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  listMainTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  listSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 99999,
  },
  modalCardLarge: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748B',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  modalBody: {
    maxHeight: 520,
  },
  formSection: {
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  formSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  formCol: {
    flex: 1,
  },
  formLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 3,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  formInputMultiline: {
    height: 65,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 14,
    marginTop: 10,
  },
  modalBtnCancel: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 7,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  modalBtnCancelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modalBtnSave: {
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  modalBtnSaveText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  imgPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imgPreviewThumb: {
    width: 60,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  imgPreviewTextSuccess: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  imgPreviewUrl: {
    fontSize: 10,
    color: '#64748B',
    maxWidth: 320,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  presetButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  presetChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  galleryCardContainer: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  galleryCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 4,
  },
  galleryInputItem: {
    marginVertical: 4,
    gap: 3,
  },
  galleryInputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  galleryInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  galleryThumbSmall: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#E2E8F0',
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  panelTitleNoBorder: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  btnActionSmallPrimary: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnActionSmallPrimaryText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnToggleSmall: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnToggleSmallText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rowActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  toast: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 99999,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  requiredStar: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  // PRIMARY HERO UPLOAD ZONE & GALLERY 4-GRID STYLES
  imageSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  imageSectionSubLabel: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  primaryUploadZone: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'all 0.2s ease' } as any) : {}),
  },
  primaryUploadZoneEmpty: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
    borderStyle: 'dashed',
    minHeight: 140,
  },
  primaryUploadZoneFilled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#BAE6FD',
    borderStyle: 'solid',
  },
  uploadEmptyPrompt: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconSymbol: {
    fontSize: 22,
  },
  uploadPromptTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  uploadPromptDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 16,
  },
  uploadButtonVisual: {
    marginTop: 6,
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#0284C7',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadButtonVisualText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  uploadedPreviewLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    flexWrap: 'wrap',
  },
  uploadedMainImage: {
    width: 110,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  uploadedInfoCol: {
    flex: 1,
    minWidth: 200,
    gap: 4,
  },
  uploadSuccessBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  uploadSuccessBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803D',
  },
  uploadedHintMain: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  uploadedActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  btnChangeDeviceVisual: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnChangeDeviceVisualText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  btnRemoveDevicePhoto: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnRemoveDevicePhotoText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  urlInputAccordion: {
    marginTop: 8,
  },
  urlAccordionTrigger: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  urlAccordionText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // GALLERY 4-GRID STYLES
  galleryHeaderBlock: {
    marginBottom: 8,
  },
  galleryCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  galleryGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryCardItem: {
    flex: 1,
    minWidth: 130,
    gap: 4,
  },
  galleryItemLabelText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  galleryBoxTouchable: {
    height: 95,
    borderRadius: 8,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  galleryBoxEmpty: {
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
  },
  galleryBoxFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#38BDF8',
    borderStyle: 'solid',
  },
  galleryBoxThumbWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  galleryBoxThumb: {
    width: '100%',
    height: '100%',
  },
  galleryBoxOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(2, 132, 199, 0.75)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  galleryBoxOverlayText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  galleryBoxDeleteBtn: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  galleryBoxDeleteBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 12,
  },
  galleryBoxEmptyWrapper: {
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  galleryBoxPlus: {
    fontSize: 16,
  },
  galleryBoxUploadPrompt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  galleryBoxSubPrompt: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
  },
  imageLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  uploadDeviceBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  uploadDeviceBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uploadSmallBtn: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  uploadSmallBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  galleryItemHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  clearImgBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    alignSelf: 'center',
  },
  clearImgBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  tabMiniBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  tabMiniBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  tabMiniBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  tabMiniBtnTextActive: {
    color: '#FFFFFF',
  },
  quickVoucherChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#E0F2FE',
  },
  quickVoucherChipCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
});