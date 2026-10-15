/**
 * BỘ DỮ LIỆU ĐẦY ĐỦ 10 MỤC CHI TIẾT SẢN PHẨM & BỘ LỌC TÌM THỨC ĂN PHÙ HỢP
 * Chuẩn hóa theo đặc tả dinh dưỡng thú cưng PetCare
 */

export interface WeightOption {
  label: string;
  weight: string;
  price: number;
  originalPrice: number;
}

export interface ProductImageItem {
  url: string;
  caption: string;
  tag: 'Bao bì' | 'Thức ăn thực tế' | 'Mặt sau bao bì' | 'Bảng thành phần' | 'Hướng dẫn SD';
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  verified: boolean;
  weightBought: string;
  comment: string;
  likes: number;
}

export interface FullProductDetail {
  id: number | string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  description: string;

  // Thuộc tính mở rộng cho cát vệ sinh & sản phẩm chăm sóc
  isNewlyLaunched?: boolean;
  salesCountNote?: string;
  scents?: string[];
  vouchers?: { label: string; desc: string; code?: string }[];
  coupons?: string[];
  serviceCommitments?: string[];
  highlightTags?: string[];
  productType?: 'food' | 'litter' | 'accessory';
  introduction?: string;
  usageInstructions?: string[];
  targetAudience?: string;
  productBenefits?: { title: string; content: string }[];
  storeCommitment?: {
    slogan: string;
    points: string[];
  };

  // 10. Mua hàng & Quy cách
  weightOptions: WeightOption[];
  rewardPoints: number;
  shippingInfo: {
    freeshipThreshold: number;
    estimatedDelivery: string;
  };

  // 9. Bộ sưu tập ảnh
  images: ProductImageItem[];

  // 2. Sản phẩm được làm từ gì?
  whatMadeOf: {
    mainIngredients: string[];
    proteinSources: string[];
    subIngredients: string[];
    fats: string;
    vitamins: string[];
    minerals: string[];
    taurine: string;
    preservatives: string;
    allergens: string[];
  };

  // 3. Thành phần dinh dưỡng
  nutrition: {
    crudeProtein: string;
    crudeProteinNum: number; // để vẽ progress bar
    crudeFat: string;
    crudeFatNum: number;
    crudeFiber: string;
    moisture: string;
    crudeAsh: string;
    carbohydrates: string;
    caloriesKcal: string;
    taurineValue: string;
    calciumPhosphorus: string;
  };

  // 4. Phù hợp với bé nào
  suitability: {
    stages: ('Mèo con' | 'Mèo trưởng thành' | 'Mèo già')[];
    lifestyles: string[];
    suggestedAge: string;
    suggestedWeight: string;
    goals: ('Tăng cân' | 'Kiểm soát cân nặng' | 'Lông đẹp' | 'Tiêu hóa' | 'Mèo kén ăn')[];
    highlights: string[];
  };

  // 5. Cần tránh với bé nào
  warnings: {
    avoidIfAllergic: string[]; // 'Gà', 'Cá', 'Bò', 'Trứng', 'Ngũ cốc gluten'
    ageRestrictions: string;
    sensitiveNotes: string[];
    manufacturerWarning: string;
  };

  // 6. Hướng dẫn cho ăn
  feedingGuide: {
    portionTable: { weight: string; gramsPerDay: string; mealsPerDay: string }[];
    transitionGuide: { days: string; newFoodPercent: number; oldFoodPercent: number; note: string }[];
    waterAdvice: string;
    feedingTips: string;
  };

  // 7. Thông tin sản phẩm & xuất xứ
  specifications: {
    origin: string;
    manufacturer: string;
    mfgDate: string;
    expDate: string;
    packaging: string;
    storage: string;
    afterOpenAdvice: string;
  };

  // 8. Đánh giá khách hàng
  reviews: ReviewItem[];
}

export const DETAILED_PRODUCTS_DATABASE: Record<string, FullProductDetail> = {
  '1': {
    id: 1,
    name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32',
    brand: 'Royal Canin',
    category: 'Thức ăn khô / Hạt dinh dưỡng',
    sku: 'RC-FIT32-VN',
    price: 250000,
    originalPrice: 295000,
    discountPercent: 15,
    stock: 142,
    inStock: true,
    rating: 4.9,
    reviewCount: 384,
    soldCount: 1520,
    description:
      'Công thức dinh dưỡng cân bằng hoàn hảo dành cho mèo trưởng thành từ 1 đến 7 tuổi, bổ sung phức hợp chất xơ hòa tan giúp giảm thiểu búi lông tự nhiên và giữ vóc dáng cân đối.',
    weightOptions: [
      { label: 'Gói dùng thử 400g', weight: '400g', price: 95000, originalPrice: 110000 },
      { label: 'Túi tiêu chuẩn 2.0kg', weight: '2.0kg', price: 250000, originalPrice: 295000 },
      { label: 'Túi tiết kiệm 4.0kg', weight: '4.0kg', price: 475000, originalPrice: 560000 },
      { label: 'Bao lớn 10kg', weight: '10kg', price: 1150000, originalPrice: 1350000 },
    ],
    rewardPoints: 2500,
    shippingInfo: {
      freeshipThreshold: 300000,
      estimatedDelivery: 'Giao nhanh 2 - 4 giờ tại TP.HCM & Hà Nội, 2 ngày toàn quốc',
    },
    images: [
      {
        url: 'http://localhost/petcare-api/uploads/royal_canin_fit32.png',
        caption: 'Bao bì chính hãng Royal Canin Fit 32 có tem chống giả',
        tag: 'Bao bì',
      },
      {
        url: 'http://localhost/petcare-api/uploads/royal_canin_bag.webp',
        caption: 'Túi hạt Royal Canin Fit 32 tiêu chuẩn Pháp nguyên seal',
        tag: 'Bao bì',
      },
      {
        url: 'http://localhost/petcare-api/uploads/royal_canin_detail_sizes.jpg',
        caption: 'Quy cách đóng gói phong phú: 400g dùng thử, 1kg và 2kg tiện lợi',
        tag: 'Hướng dẫn SD',
      },
      {
        url: 'http://localhost/petcare-api/uploads/royal_canin_genuine.jpg',
        caption: '100% Hàng chính hãng Royal Canin đầy đủ hóa đơn kiểm định',
        tag: 'Bảng thành phần',
      },
      {
        url: 'http://localhost/petcare-api/uploads/royal_canin_lineup.jpg',
        caption: 'Hệ sinh thái dinh dưỡng Royal Canin: Fit 32, Kitten, Indoor...',
        tag: 'Thức ăn thực tế',
      },
    ],
    whatMadeOf: {
      mainIngredients: [
        'Protein gia cầm sấy khô (thịt gà & vịt)',
        'Gạo lứt dinh dưỡng',
        'Lúa mì nguyên cám',
        'Protein thực vật cô lập (L.I.P)',
        'Mỡ động vật tinh chế',
      ],
      proteinSources: ['Thịt gà', 'Thịt vịt', 'Men bia thủy phân'],
      subIngredients: [
        'Xơ thực vật (bột củ cải đường)',
        'Khoáng chất vi lượng',
        'Dầu cá hồi giàu EPA/DHA',
        'Men vi sinh đường ruột FOS',
        'Chiết xuất cúc vạn thọ (Lutein)',
      ],
      fats: 'Mỡ gia cầm sạch kết hợp dầu cá hồi Na Uy nguyên chất (giàu Omega 3 & 6)',
      vitamins: [
        'Vitamin A (13.000 IU)',
        'Vitamin D3 (700 IU)',
        'Vitamin E (500 mg)',
        'Vitamin C',
        'Vitamin nhóm B (B1, B2, B6, B12, Biotin, Axit Folic)',
      ],
      minerals: ['Canxi (1.1%)', 'Phốt pho (0.9%)', 'Sắt', 'I-ốt', 'Đồng', 'Mangan', 'Kẽm', 'Selen'],
      taurine: 'Hàm lượng Taurine 0.23% (2.300 mg/kg) - Tăng cường thị lực & cơ tim dẻo dai',
      preservatives: 'Chiết xuất thảo mộc hương thảo & hỗn hợp Tocopherols tự nhiên (Không BHA/BHT)',
      allergens: ['Thịt gà', 'Lúa mì / Gluten'],
    },
    nutrition: {
      crudeProtein: '≥ 32.0%',
      crudeProteinNum: 32,
      crudeFat: '≥ 15.0%',
      crudeFatNum: 15,
      crudeFiber: '≤ 4.6%',
      moisture: '≤ 6.5%',
      crudeAsh: '≤ 7.2%',
      carbohydrates: '~ 34.7%',
      caloriesKcal: '3.860 kcal/kg (386 kcal / 100g)',
      taurineValue: '0.23%',
      calciumPhosphorus: 'Canxi: 1.1% | Phốt pho: 0.9%',
    },
    suitability: {
      stages: ['Mèo trưởng thành'],
      lifestyles: [
        'Mèo nuôi trong nhà (Indoor)',
        'Mèo vận động vừa phải',
        'Mèo hay bị rụng lông / búi lông',
        'Mèo cần giữ cân nặng lý tưởng',
      ],
      suggestedAge: 'Từ 1 đến 7 tuổi',
      suggestedWeight: '2.0 kg – 7.0 kg',
      goals: ['Tiêu hóa', 'Lông đẹp', 'Kiểm soát cân nặng'],
      highlights: [
        'Giảm hình thành búi lông trong dạ dày nhờ chất xơ hòa tan',
        'Duy trì cân nặng chuẩn nhờ lượng calo vừa phải',
        'Hệ tiêu hóa êm ái nhờ protein dễ tiêu hóa L.I.P',
        'Bảo vệ đường tiết niệu với tỷ lệ khoáng chất cân bằng',
      ],
    },
    warnings: {
      avoidIfAllergic: ['Gà', 'Lúa mì / Gluten'],
      ageRestrictions: 'Không phù hợp cho mèo con dưới 12 tháng tuổi hoặc mèo mang thai (nên dùng dòng Mother & Babycat / Kitten)',
      sensitiveNotes: [
        'Mèo có tiền sử sỏi oxalate cấp tính cần có chỉ định của bác sĩ thú y',
        'Bé có tiền sử dị ứng đạm gia cầm nên chọn dòng Protein Thủy Phân hoặc Cá Biển',
      ],
      manufacturerWarning:
        'Luôn chuẩn bị sẵn nước uống sạch mỗi ngày. Khi thay đổi sang hạt mới, hãy chuyển đổi từ từ trong 7 ngày.',
    },
    feedingGuide: {
      portionTable: [
        { weight: '3.0 kg', gramsPerDay: '44 g / ngày', mealsPerDay: '2 - 3 cữ' },
        { weight: '4.0 kg', gramsPerDay: '53 g / ngày', mealsPerDay: '2 - 3 cữ' },
        { weight: '5.0 kg', gramsPerDay: '62 g / ngày', mealsPerDay: '2 - 3 cữ' },
        { weight: '6.0 kg', gramsPerDay: '70 g / ngày', mealsPerDay: '3 cữ' },
      ],
      transitionGuide: [
        { days: 'Ngày 1 - 2', newFoodPercent: 25, oldFoodPercent: 75, note: 'Trộn 25% thức ăn mới với 75% thức ăn cũ' },
        { days: 'Ngày 3 - 4', newFoodPercent: 50, oldFoodPercent: 50, note: 'Trộn tỷ lệ 50/50 giữa thức ăn mới và cũ' },
        { days: 'Ngày 5 - 6', newFoodPercent: 75, oldFoodPercent: 25, note: 'Tăng lên 75% thức ăn mới, mèo đã quen mùi' },
        { days: 'Ngày 7+', newFoodPercent: 100, oldFoodPercent: 0, note: '100% thức ăn mới, chuyển đổi thành công êm ái!' },
      ],
      waterAdvice:
        'Mèo ăn thức ăn hạt khô cần lượng nước gấp 2.5 lần trọng lượng thức ăn. Hãy đặt bát nước cách xa bát thức ăn ít nhất 1 mét hoặc dùng đài phun nước tự động.',
      feedingTips: 'Đo lường lượng hạt bằng cốc đong chuẩn để tránh cho ăn quá mức gây béo phì.',
    },
    specifications: {
      origin: 'Pháp (Nhập khẩu chính ngạch)',
      manufacturer: 'Royal Canin S.A.S (Aimargues, France)',
      mfgDate: '15/01/2026',
      expDate: '15/07/2027 (18 tháng kể từ NSX)',
      packaging: 'Túi zip khóa nhôm đa lớp bảo vệ khí quyển biến đổi, chống ẩm và giữ mùi tối đa',
      storage: 'Bảo quản nơi khô ráo, thoáng mát dưới 28°C, tránh ánh nắng trực tiếp và nơi ẩm ướt',
      afterOpenAdvice: 'Kéo kín miệng túi zip sau mỗi lần lấy thức ăn, nên dùng hết trong 30-45 ngày',
    },
    reviews: [
      {
        id: 'rev-1',
        userName: 'Nguyễn Thảo My',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        rating: 5,
        date: '28/02/2026',
        verified: true,
        weightBought: '2.0kg',
        comment:
          'Bé mèo Anh lông ngắn nhà mình ăn hạt này phân rất đẹp, không còn nôn khan búi lông nữa. Hạt thơm giòn, bé thích mê!',
        likes: 24,
      },
      {
        id: 'rev-2',
        userName: 'Trần Văn Hoàng',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 5,
        date: '15/02/2026',
        verified: true,
        weightBought: '4.0kg',
        comment:
          'Giao hàng siêu nhanh trong 2h! Bao bì nguyên seal chuẩn xịn, có mã cào check chính hãng. Cho 10 sao shop nhiệt tình.',
        likes: 18,
      },
      {
        id: 'rev-3',
        userName: 'Lê Quỳnh Anh',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        rating: 4,
        date: '02/02/2026',
        verified: true,
        weightBought: '400g',
        comment:
          'Chất lượng tốt, bé ăn hợp. Mình trừ 1 sao nhẹ vì túi 400g không có khóa zip như túi 2kg, phải dùng kẹp túi.',
        likes: 9,
      },
    ],
  },

  '2': {
    id: 2,
    name: 'Pate Whiskas Vị Cá Ngừ Tươi & Cá Hồi',
    brand: 'Whiskas',
    category: 'Thức ăn ướt / Pate cho mèo',
    sku: 'WH-TUNA-85G',
    price: 35000,
    originalPrice: 42000,
    discountPercent: 16,
    stock: 280,
    inStock: true,
    rating: 4.8,
    reviewCount: 512,
    soldCount: 3400,
    description:
      'Pate cá ngừ hảo hạng tươi ngon kết hợp cá hồi giàu axit béo Omega-3 tự nhiên, cung cấp độ ẩm dồi dào giúp bảo vệ hệ tiết niệu của mèo và kích thích vị giác mèo kén ăn.',
    weightOptions: [
      { label: 'Gói đơn 85g', weight: '85g', price: 35000, originalPrice: 42000 },
      { label: 'Lốc 6 gói (85g x 6)', weight: '510g', price: 195000, originalPrice: 240000 },
      { label: 'Hộp 12 gói (85g x 12)', weight: '1.02kg', price: 375000, originalPrice: 480000 },
      { label: 'Thùng 24 gói siêu rẻ', weight: '2.04kg', price: 720000, originalPrice: 960000 },
    ],
    rewardPoints: 350,
    shippingInfo: {
      freeshipThreshold: 300000,
      estimatedDelivery: 'Giao nhanh 2 - 4 giờ tại TP.HCM & Hà Nội, 2 ngày toàn quốc',
    },
    images: [
      {
        url: 'http://localhost/petcare-api/uploads/whiskas_ocean_fish.png',
        caption: 'Bộ 3 gói Pate Whiskas vị cá biển thơm ngon ngất ngây',
        tag: 'Bao bì',
      },
      {
        url: 'http://localhost/petcare-api/uploads/whiskas_pouch.webp',
        caption: 'Gói đơn 85g Pate cá biển tươi giàu nước bảo vệ thận mèo',
        tag: 'Bao bì',
      },
      {
        url: 'http://localhost/petcare-api/uploads/whiskas_back.webp',
        caption: 'Mặt sau gói in rõ hướng dẫn khẩu phần và ngày sản xuất',
        tag: 'Mặt sau bao bì',
      },
      {
        url: 'http://localhost/petcare-api/uploads/whiskas_can.webp',
        caption: 'Dòng sản phẩm lon Whiskas Tuna sốt thịt cá thơm ngon',
        tag: 'Thức ăn thực tế',
      },
      {
        url: 'http://localhost/petcare-api/uploads/whiskas_flavors.webp',
        caption: 'Bộ sưu tập trọn vị Whiskas phong phú cho mèo đổi bữa',
        tag: 'Bảng thành phần',
      },
    ],
    whatMadeOf: {
      mainIngredients: [
        'Thịt cá ngừ đại dương tươi (45%)',
        'Thịt cá hồi phi lê (15%)',
        'Nước luộc cá giàu collagen',
        'Chất tạo gel gốc rong biển tự nhiên',
        'Dầu đậu nành tinh luyện',
      ],
      proteinSources: ['Cá ngừ', 'Cá hồi', 'Cá biển tươi'],
      subIngredients: ['Dầu cá biển', 'Nước dùng cá tự nhiên', 'Khoáng chất và chất chống oxy hóa tự nhiên'],
      fats: 'Axit béo Omega 3 & 6 tự nhiên từ mỡ cá ngừ và cá hồi biển lạnh',
      vitamins: ['Vitamin E', 'Vitamin B1 (Thiamine)', 'Vitamin B12', 'Axit folic'],
      minerals: ['Kẽm sulfat', 'Mangan', 'Canxi cacbonat', 'Kali Clorua'],
      taurine: 'Bổ sung Taurine 0.15% - Phòng ngừa suy thoái võng mạc và bệnh cơ tim ở mèo',
      preservatives: 'Hoàn toàn không dùng chất bảo quản nhân tạo, thanh trùng nhiệt kín',
      allergens: ['Cá biển / Hải sản'],
    },
    nutrition: {
      crudeProtein: '≥ 9.0%',
      crudeProteinNum: 9,
      crudeFat: '≥ 2.0%',
      crudeFatNum: 5,
      crudeFiber: '≤ 1.0%',
      moisture: '≤ 85.0% (Giàu nước)',
      crudeAsh: '≤ 3.0%',
      carbohydrates: '~ 1.5%',
      caloriesKcal: '75 kcal / gói 85g (880 kcal/kg)',
      taurineValue: '0.15%',
      calciumPhosphorus: 'Canxi: 0.3% | Phốt pho: 0.25%',
    },
    suitability: {
      stages: ['Mèo con', 'Mèo trưởng thành', 'Mèo già'],
      lifestyles: [
        'Mèo lười uống nước',
        'Mèo kén ăn hạt khô',
        'Mèo đang hồi phục sức khỏe',
        'Mèo già răng yếu khó nhai hạt',
      ],
      suggestedAge: 'Mọi lứa tuổi (Từ 2 tháng tuổi trở lên)',
      suggestedWeight: '1.0 kg – 8.0 kg',
      goals: ['Mèo kén ăn', 'Tiêu hóa', 'Tăng cân'],
      highlights: [
        'Bổ sung lượng nước lớn tự nhiên chống sỏi bàng quang',
        'Mùi vị cá tươi kích thích khứu giác mèo kén ăn',
        'Kết cấu sốt mềm mượt dễ liếm và dễ hấp thu dinh dưỡng',
      ],
    },
    warnings: {
      avoidIfAllergic: ['Cá / Hải sản'],
      ageRestrictions: 'Thích hợp cho mèo từ 2 tháng tuổi trở lên',
      sensitiveNotes: ['Mèo bị dị ứng hải sản hoặc bệnh phong ngứa ngoài da không nên sử dụng'],
      manufacturerWarning: 'Bảo quản gói chưa mở ở nhiệt độ phòng. Sau khi mở cần bảo quản tủ lạnh.',
    },
    feedingGuide: {
      portionTable: [
        { weight: '1 - 2 kg', gramsPerDay: '1 - 2 gói / ngày', mealsPerDay: '2 - 3 cữ' },
        { weight: '3 - 4 kg', gramsPerDay: '3 - 4 gói / ngày', mealsPerDay: '2 cữ' },
        { weight: '5 kg+', gramsPerDay: '4 - 5 gói / ngày', mealsPerDay: '2 cữ' },
      ],
      transitionGuide: [
        { days: 'Ngày 1 - 2', newFoodPercent: 30, oldFoodPercent: 70, note: 'Trộn 1 thìa pate vào hạt cũ' },
        { days: 'Ngày 3 - 4', newFoodPercent: 50, oldFoodPercent: 50, note: 'Tăng lượng pate để kích thích ăn' },
        { days: 'Ngày 5+', newFoodPercent: 100, oldFoodPercent: 0, note: 'Có thể cho ăn nguyên gói hoặc trộn hạt đều đặn' },
      ],
      waterAdvice: 'Sản phẩm có độ ẩm lên tới 85%, là nguồn cấp nước lý tưởng cho các bé mèo lười uống nước.',
      feedingTips: 'Nên hâm ấm nhẹ nếu lấy từ tủ lạnh ra để pate dậy mùi thơm kích thích bé ăn ngon.',
    },
    specifications: {
      origin: 'Thái Lan (Công nghệ Mars Petcare Hoa Kỳ)',
      manufacturer: 'Mars Petcare (Thailand) Co., Ltd.',
      mfgDate: '10/02/2026',
      expDate: '10/02/2028 (24 tháng)',
      packaging: 'Túi nhôm tiệt trùng chân không retort cao cấp, xé dễ dàng',
      storage: 'Nơi khô ráo thoáng mát, tránh ánh nắng trực tiếp',
      afterOpenAdvice: 'Sau khi mở gói, bọc kín bảo quản ngăn mát tủ lạnh và dùng hết trong 48 giờ',
    },
    reviews: [
      {
        id: 'wh-rev-1',
        userName: 'Trịnh Bảo Trâm',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        rating: 5,
        date: '25/02/2026',
        verified: true,
        weightBought: 'Lốc 6 gói',
        comment:
          'Bé mèo xiêm nhà mình cực kỳ kén ăn mà thấy gói pate này là kêu meo meo chạy lại ngay. Nước sốt sánh quyện thơm lừng!',
        likes: 19,
      },
      {
        id: 'wh-rev-2',
        userName: 'Phạm Đức Anh',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        rating: 5,
        date: '19/02/2026',
        verified: true,
        weightBought: 'Thùng 24 gói',
        comment: 'Mua nguyên thùng date mới tinh 2028, giá rẻ hơn mua lẻ nhiều. Shop đóng thùng xốp kỹ lưỡng.',
        likes: 14,
      },
    ],
  },

  '3': {
    id: 3,
    name: 'Hạt Dinh Dưỡng Minino Plus Cá Biển & Taurine',
    brand: 'Minino',
    category: 'Thức ăn khô / Hạt dinh dưỡng',
    sku: 'MIN-PLUS-1.3K',
    price: 120000,
    originalPrice: 145000,
    discountPercent: 17,
    stock: 95,
    inStock: true,
    rating: 4.7,
    reviewCount: 220,
    soldCount: 980,
    description:
      'Dinh dưỡng tiêu chuẩn từ Pháp với hương vị cá biển hấp dẫn, tăng cường hàm lượng Taurine tự nhiên giúp mắt mèo sáng tinh anh, giảm rụng lông và hỗ trợ cơ tim khỏe mạnh.',
    weightOptions: [
      { label: 'Gói nhỏ 450g', weight: '450g', price: 45000, originalPrice: 55000 },
      { label: 'Túi vừa 1.3kg', weight: '1.3kg', price: 120000, originalPrice: 145000 },
      { label: 'Túi lớn 3.0kg', weight: '3.0kg', price: 265000, originalPrice: 320000 },
      { label: 'Bao tiết kiệm 10kg', weight: '10kg', price: 790000, originalPrice: 950000 },
    ],
    rewardPoints: 1200,
    shippingInfo: {
      freeshipThreshold: 300000,
      estimatedDelivery: 'Giao nhanh 2 - 4 giờ tại TP.HCM & Hà Nội, 2 ngày toàn quốc',
    },
    images: [
      {
        url: 'http://localhost/petcare-api/uploads/minino_plus.png',
        caption: 'Bao bì Minino Plus thiết kế màu cam nổi bật, công thức từ Pháp',
        tag: 'Bao bì',
      },
      {
        url: 'http://localhost/petcare-api/uploads/minino_bag_1300g.webp',
        caption: 'Túi hạt Minino vị cá ngừ 1.3kg dinh dưỡng toàn diện',
        tag: 'Thức ăn thực tế',
      },
      {
        url: 'http://localhost/petcare-api/uploads/minino_tuna_flavor.jpg',
        caption: 'Hương cá ngừ thơm lừng, đạm chất lượng kích thích vị giác',
        tag: 'Bảng thành phần',
      },
      {
        url: 'http://localhost/petcare-api/uploads/minino_front.webp',
        caption: 'Mặt trước bao bì chính hãng công thức Neovia Pháp',
        tag: 'Mặt sau bao bì',
      },
    ],
    whatMadeOf: {
      mainIngredients: [
        'Bột cá biển nguyên chất',
        'Bột thịt gia cầm',
        'Gạo tấm xuất khẩu',
        'Bắp nguyên cám',
        'Bột đậu nành khử vỏ',
      ],
      proteinSources: ['Cá biển', 'Thịt gà'],
      subIngredients: ['Dầu cá mòi', 'Chiết xuất nấm men FOS', 'Chiết xuất cây ngọc giá Yucca giúp khử mùi phân mèo'],
      fats: 'Dầu cá ngừ và dầu cọ tinh luyện, giàu Omega 3 & 6',
      vitamins: ['Vitamin A', 'Vitamin D3', 'Vitamin E', 'Vitamin K3', 'Vitamin B-complex'],
      minerals: ['Canxi', 'Phốt pho', 'Kẽm hữu cơ', 'Sắt', 'Mangan', 'Selen'],
      taurine: 'Hàm lượng Taurine 0.20% giúp mắt mèo sáng rõ trong bóng tối và phản xạ nhạy bén',
      preservatives: 'Chất chống oxy hóa tự nhiên chuẩn châu Âu',
      allergens: ['Cá biển', 'Thịt gà', 'Ngô'],
    },
    nutrition: {
      crudeProtein: '≥ 30.0%',
      crudeProteinNum: 30,
      crudeFat: '≥ 10.0%',
      crudeFatNum: 10,
      crudeFiber: '≤ 5.0%',
      moisture: '≤ 10.0%',
      crudeAsh: '≤ 9.0%',
      carbohydrates: '~ 36.0%',
      caloriesKcal: '3.650 kcal/kg (365 kcal / 100g)',
      taurineValue: '0.20%',
      calciumPhosphorus: 'Canxi: 1.2% | Phốt pho: 0.9%',
    },
    suitability: {
      stages: ['Mèo trưởng thành'],
      lifestyles: [
        'Mèo hoạt động nhiều',
        'Mèo nhà chung cư',
        'Gia đình nuôi nhiều bé (kinh tế, tiết kiệm)',
      ],
      suggestedAge: 'Mèo từ 1 tuổi trở lên',
      suggestedWeight: '2.0 kg – 6.5 kg',
      goals: ['Lông đẹp', 'Tiêu hóa'],
      highlights: [
        'Hạt kích thước nhỏ dễ nhai và bảo vệ men răng',
        'Chiết xuất Yucca Schidigera giảm mùi hôi khay cát vệ sinh hiệu quả',
        'Cung cấp đầy đủ năng lượng cho mèo vận động linh hoạt cả ngày',
      ],
    },
    warnings: {
      avoidIfAllergic: ['Cá biển', 'Ngô / Bắp'],
      ageRestrictions: 'Dành cho mèo trưởng thành trên 12 tháng tuổi',
      sensitiveNotes: ['Mèo có dạ dày quá nhạy cảm nên chuyển đổi từ từ trong 10 ngày'],
      manufacturerWarning: 'Bảo quản kín miệng bao để tránh ẩm mốc và mất mùi hương.',
    },
    feedingGuide: {
      portionTable: [
        { weight: '2 - 3 kg', gramsPerDay: '40 - 55 g / ngày', mealsPerDay: '2 bữa' },
        { weight: '3 - 5 kg', gramsPerDay: '55 - 75 g / ngày', mealsPerDay: '2 bữa' },
        { weight: '5 kg+', gramsPerDay: '75 - 95 g / ngày', mealsPerDay: '2 - 3 bữa' },
      ],
      transitionGuide: [
        { days: 'Ngày 1 - 2', newFoodPercent: 25, oldFoodPercent: 75, note: 'Bắt đầu làm quen với hạt mới' },
        { days: 'Ngày 3 - 4', newFoodPercent: 50, oldFoodPercent: 50, note: 'Tăng lượng hạt lên phân nửa' },
        { days: 'Ngày 5 - 6', newFoodPercent: 75, oldFoodPercent: 25, note: 'Mèo ăn quen và ngon miệng' },
        { days: 'Ngày 7+', newFoodPercent: 100, oldFoodPercent: 0, note: 'Thay thế hoàn toàn thức ăn mới' },
      ],
      waterAdvice: 'Đảm bảo khay nước luôn đầy và sạch để mèo uống thoải mái.',
      feedingTips: 'Có thể trộn thêm chút nước ấm hoặc sốt pate để tăng vị thơm ngon.',
    },
    specifications: {
      origin: 'Việt Nam (Công nghệ và công thức tập đoàn Neovia / ADM Pháp)',
      manufacturer: 'Tập đoàn ADM Animal Nutrition',
      mfgDate: '01/03/2026',
      expDate: '01/09/2027 (18 tháng)',
      packaging: 'Bao bì tráng màng phức hợp khóa nhiệt kín khí',
      storage: 'Nơi khô mát dưới 30°C, tránh côn trùng và ánh nắng mặt trời',
      afterOpenAdvice: 'Nên cho vào hộp bảo quản thực phẩm có nắp cao su hoặc cuộn chặt mép túi',
    },
    reviews: [
      {
        id: 'min-1',
        userName: 'Đỗ Minh Tuấn',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
        rating: 5,
        date: '20/02/2026',
        verified: true,
        weightBought: '1.3kg',
        comment: 'Giá cả quá hợp lý cho chất lượng chuẩn Pháp. 3 bé mèo nhà mình đều ăn sạch bát.',
        likes: 12,
      },
    ],
  },

  '4': {
    id: 4,
    name: 'Thức Ăn Hạt Orijen Cat & Kitten Thịt Tươi 6 Loại Đạm',
    brand: 'Orijen',
    category: 'Thức ăn khô siêu cao cấp (Holistic / Grain-Free)',
    sku: 'ORJ-CAT-KIT-1.8K',
    price: 490000,
    originalPrice: 560000,
    discountPercent: 12,
    stock: 64,
    inStock: true,
    rating: 5.0,
    reviewCount: 168,
    soldCount: 650,
    description:
      'Thức ăn chuẩn sinh học (Biologically Appropriate) không chứa ngũ cốc với 85% thành phần từ thịt tươi nguyên chất: Gà thả vườn, gà tây, cá hồi hoang dã, cá trích và trứng ổ sạch.',
    weightOptions: [
      { label: 'Gói dùng thử 340g', weight: '340g', price: 175000, originalPrice: 195000 },
      { label: 'Túi tiêu chuẩn 1.8kg', weight: '1.8kg', price: 490000, originalPrice: 560000 },
      { label: 'Túi lớn 5.4kg', weight: '5.4kg', price: 1350000, originalPrice: 1550000 },
    ],
    rewardPoints: 4900,
    shippingInfo: {
      freeshipThreshold: 300000,
      estimatedDelivery: 'Giao nhanh hỏa tốc 2 giờ tại TP.HCM & Hà Nội, 2 ngày toàn quốc',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800',
        caption: 'Bao bì sang trọng đẳng cấp Orijen từ Canada, cam kết 85% thịt tươi',
        tag: 'Bao bì',
      },
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
        caption: 'Viên hạt màu sẫm tự nhiên, sấy lạnh lưu giữ trọn vẹn chất đạm nguyên bản',
        tag: 'Thức ăn thực tế',
      },
      {
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800',
        caption: 'Mặt sau chi tiết danh sách 15 nguyên liệu tươi đầu tiên',
        tag: 'Mặt sau bao bì',
      },
      {
        url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
        caption: 'Bảng tỷ lệ dinh dưỡng vượt trội 40% đạm thô tự nhiên',
        tag: 'Bảng thành phần',
      },
      {
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
        caption: 'Hướng dẫn cho mèo con và mèo trưởng thành theo tiêu chuẩn Canada',
        tag: 'Hướng dẫn SD',
      },
    ],
    whatMadeOf: {
      mainIngredients: [
        'Thịt gà tươi thả vườn không kháng sinh (18%)',
        'Thịt gà tây tươi (7%)',
        'Trứng ổ tươi nguyên quả (5%)',
        'Gan gà tươi (5%)',
        'Cá bơn hoang dã tươi (4%)',
        'Cá trích nguyên con (4%)',
      ],
      proteinSources: ['Gà thả vườn', 'Gà tây', 'Cá trích', 'Cá bơn', 'Trứng gà'],
      subIngredients: ['Đậu lăng đỏ', 'Đậu gà', 'Táo đỏ', 'Lê Bartlett', 'Cải xoăn', 'Rong biển sấy'],
      fats: 'Mỡ gà tươi và dầu cá minh thái tự nhiên giàu DHA/EPA',
      vitamins: ['Hỗn hợp Vitamin tự nhiên chiết xuất từ hoa quả và thảo mộc hữu cơ'],
      minerals: ['Kẽm proteinate', 'Đồng proteinate', 'Choline Clorua'],
      taurine: 'Hàm lượng Taurine tự nhiên dồi dào từ tim gà và gan gà (0.2%)',
      preservatives: 'Hoàn toàn tự nhiên bằng Tocopherols hỗn hợp và sấy lạnh chân không',
      allergens: ['Gà', 'Cá', 'Trứng'],
    },
    nutrition: {
      crudeProtein: '≥ 40.0% (Siêu giàu đạm)',
      crudeProteinNum: 40,
      crudeFat: '≥ 20.0%',
      crudeFatNum: 20,
      crudeFiber: '≤ 3.0%',
      moisture: '≤ 10.0%',
      crudeAsh: '≤ 8.0%',
      carbohydrates: '~ 19.0% (Cực thấp, không độn tinh bột)',
      caloriesKcal: '4.160 kcal/kg (416 kcal / 100g)',
      taurineValue: '0.20%',
      calciumPhosphorus: 'Canxi: 1.4% | Phốt pho: 1.1%',
    },
    suitability: {
      stages: ['Mèo con', 'Mèo trưởng thành'],
      lifestyles: [
        'Mèo con đang phát triển khung xương',
        'Mèo cần tăng cân và phát triển cơ bắp',
        'Mèo kén ăn hạt thông thường',
        'Mèo lông dài cần lông bóng mượt',
      ],
      suggestedAge: 'Mọi lứa tuổi (Mèo con & Mèo lớn)',
      suggestedWeight: '1.0 kg – 9.0 kg',
      goals: ['Tăng cân', 'Lông đẹp', 'Mèo kén ăn'],
      highlights: [
        '85% thịt tươi đạt tiêu chuẩn tiêu thụ của con người',
        'Hoàn toàn không ngũ cốc (Grain-Free), không gluten',
        'Tăng cơ bắp rõ rệt sau 4 tuần, phân chắc và ít mùi',
      ],
    },
    warnings: {
      avoidIfAllergic: ['Gà', 'Cá', 'Trứng'],
      ageRestrictions: 'Thích hợp cho cả mèo con và mèo trưởng thành',
      sensitiveNotes: [
        'Hàm lượng đạm rất cao (40%), mèo già suy thận nặng cần tham khảo bác sĩ thú y trước khi dùng',
      ],
      manufacturerWarning: 'Đóng kín túi và không để hở khí để giữ được độ tươi giòn.',
    },
    feedingGuide: {
      portionTable: [
        { weight: '2 - 3 kg', gramsPerDay: '35 - 45 g / ngày', mealsPerDay: '2 - 3 cữ' },
        { weight: '4 - 5 kg', gramsPerDay: '55 - 65 g / ngày', mealsPerDay: '2 cữ' },
        { weight: '6 kg+', gramsPerDay: '70 - 85 g / ngày', mealsPerDay: '2 cữ' },
      ],
      transitionGuide: [
        { days: 'Ngày 1 - 3', newFoodPercent: 20, oldFoodPercent: 80, note: 'Do đạm cao, cần chuyển đổi chậm rãi' },
        { days: 'Ngày 4 - 6', newFoodPercent: 50, oldFoodPercent: 50, note: 'Quan sát phân của bé mèo' },
        { days: 'Ngày 7 - 9', newFoodPercent: 80, oldFoodPercent: 20, note: 'Bé đã quen với lượng đạm dồi dào' },
        { days: 'Ngày 10+', newFoodPercent: 100, oldFoodPercent: 0, note: 'Chuyển đổi hoàn tất thành công' },
      ],
      waterAdvice: 'Đạm cao đòi hỏi thận làm việc tích cực, hãy luôn khuyến khích mèo uống đủ nước mỗi ngày.',
      feedingTips: 'Vì hạt rất giàu dinh dưỡng, chỉ cần cho ăn lượng vừa đủ là bé đã no lâu.',
    },
    specifications: {
      origin: 'Canada (Nhập khẩu nguyên bao)',
      manufacturer: 'Champion Petfoods LP (Morinville, Alberta, Canada)',
      mfgDate: '15/01/2026',
      expDate: '15/07/2027 (18 tháng)',
      packaging: 'Túi chân không tráng màng kim loại cao cấp có khóa zip tiện dụng',
      storage: 'Bảo quản nơi khô ráo thoáng mát, nhiệt độ dưới 25°C',
      afterOpenAdvice: 'Khuyên dùng trong vòng 30 ngày sau khi xé bao để hương vị thịt tươi thơm nhất',
    },
    reviews: [
      {
        id: 'orj-1',
        userName: 'Ngô Kiến Huy',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        rating: 5,
        date: '27/02/2026',
        verified: true,
        weightBought: '1.8kg',
        comment:
          'Đắt xắt ra miếng! Bé Maine Coon nhà mình ăn vào tăng cơ vù vù, lông óng ánh mềm như lụa. Rất đáng đồng tiền.',
        likes: 31,
      },
    ],
  },

  '19': {
    id: 19,
    name: 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà',
    brand: 'Inaba Nhật Bản',
    category: 'Bánh thưởng & Snack cho mèo',
    sku: 'PET-19-408',
    price: 16800,
    originalPrice: 20160,
    discountPercent: 15,
    stock: 140,
    inStock: true,
    rating: 4.9,
    reviewCount: 384,
    soldCount: 1520,
    highlightTags: ['Chính hãng Inaba', 'Bổ sung Collagen', 'Kích thích vị giác'],
    description:
      'Dạng kem lỏng thơm ngậy chiết xuất từ thịt gà phi lê tươi ngon, bổ sung trà xanh tinh khiết giúp tiêu hóa tốt, khử mùi hôi chất thải và cung cấp collagen nuôi dưỡng lông mèo mượt mà.',
    weightOptions: [
      { label: 'Gói nhỏ 400g (4x14g)', weight: '400g', price: 16800, originalPrice: 20160 },
      { label: 'Túi lớn 1.5kg (Gia đình)', weight: '1.5kg', price: 42000, originalPrice: 50400 },
      { label: 'Xô siêu tiết kiệm 3.5kg', weight: '3.5kg', price: 88200, originalPrice: 105840 },
    ],
    rewardPoints: 168,
    shippingInfo: {
      freeshipThreshold: 200000,
      estimatedDelivery: 'Giao hỏa tốc 2 giờ tại nội thành Hà Nội & TP.HCM',
    },
    images: [
      {
        url: 'http://localhost/petcare-api/uploads/ciao_churu.png',
        caption: 'Hũ lớn 50 thanh Ciao Churu vị gà chính hãng Inaba Nhật Bản',
        tag: 'Bao bì',
      },
      {
        url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
        caption: 'Bánh thưởng sốt kem Ciao Churu vị gà chính hãng Inaba Nhật Bản',
        tag: 'Bao bì',
      },
      {
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
        caption: 'Mèo cưng liếm kem ngon lành, kích thích vị giác tối đa',
        tag: 'Thức ăn thực tế',
      },
      {
        url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
        caption: 'Mặt sau bao bì in rõ nguồn gốc xuất xứ Inaba Foods Japan',
        tag: 'Mặt sau bao bì',
      },
    ],
    whatMadeOf: {
      mainIngredients: [
        'Thịt ức gà tươi nuôi trang trại',
        'Chiết xuất sò điệp Hokkaido',
        'Men bia thủy phân giàu đạm',
        'Tinh bột sắn biến tính',
        'Collagen peptide biển sâu',
      ],
      proteinSources: ['Thịt gà', 'Sò điệp', 'Men bia thủy phân'],
      subIngredients: ['Chiết xuất trà xanh kháng khuẩn', 'Vitamin E chống oxy hóa', 'Taurine tự nhiên'],
      fats: 'Dầu cá ngừ tinh khiết và mỡ gà tươi',
      vitamins: ['Vitamin E', 'Vitamin B-Complex', 'Vitamin D3'],
      minerals: ['Kẽm hữu cơ', 'Sắt', 'Canxi'],
      taurine: 'Hàm lượng Taurine 0.15% hỗ trợ thị lực và cơ tim',
      preservatives: 'Hoàn toàn không chất bảo quản tổng hợp',
      allergens: ['Thịt gà'],
    },
    nutrition: {
      crudeProtein: '≥ 32.0%',
      crudeProteinNum: 32,
      crudeFat: '≥ 15.0%',
      crudeFatNum: 15,
      crudeFiber: '≤ 0.5%',
      moisture: '≤ 88.0%',
      crudeAsh: '≤ 1.5%',
      carbohydrates: '≤ 2.0%',
      caloriesKcal: '85 kcal / 100g',
      taurineValue: '0.15%',
      calciumPhosphorus: 'Canxi: 0.8% | Phốt pho: 0.6%',
    },
    suitability: {
      stages: ['Mèo con', 'Mèo trưởng thành', 'Mèo già'],
      lifestyles: [
        'Mèo lười uống nước',
        'Mèo kén ăn cần đổi vị',
        'Mèo cần huấn luyện và thưởng vâng lời',
        'Mèo đang hồi phục thể trạng',
      ],
      suggestedAge: 'Mèo từ 3 tháng tuổi trở lên',
      suggestedWeight: '2.0 kg – 7.0 kg',
      goals: ['Mèo kén ăn', 'Lông đẹp', 'Tiêu hóa'],
      highlights: [
        'Dạng kem lỏng cấp nước tức thì cho đường tiết niệu',
        'Hương vị thịt gà thơm ngậy khó cưỡng',
        'Chiết xuất trà xanh giúp khử mùi hôi miệng và phân',
      ],
    },
    warnings: {
      avoidIfAllergic: ['Gà'],
      ageRestrictions: 'Không dùng cho mèo sơ sinh dưới 2 tháng tuổi',
      sensitiveNotes: ['Nên dùng làm thức ăn bổ sung, không thay thế 100% bữa chính'],
      manufacturerWarning: 'Bảo quản ngăn mát sau khi mở nắp và dùng hết trong 24h.',
    },
    feedingGuide: {
      portionTable: [
        { weight: '1 - 2 kg', gramsPerDay: '1 - 2 tuýp / ngày', mealsPerDay: '1 cữ thưởng' },
        { weight: '2 - 4 kg', gramsPerDay: '2 - 3 tuýp / ngày', mealsPerDay: '1 - 2 cữ thưởng' },
        { weight: '4 - 6 kg', gramsPerDay: '3 - 4 tuýp / ngày', mealsPerDay: '2 cữ thưởng' },
      ],
      transitionGuide: [
        { days: 'Ngày 1', newFoodPercent: 20, oldFoodPercent: 80, note: 'Cho nếm thử 1/2 tuýp' },
        { days: 'Ngày 2 - 3', newFoodPercent: 50, oldFoodPercent: 50, note: 'Trộn cùng hạt khô' },
        { days: 'Ngày 4+', newFoodPercent: 100, oldFoodPercent: 0, note: 'Cho ăn trực tiếp làm món thưởng' },
      ],
      waterAdvice: 'Hàm lượng nước tự nhiên cao (88%) giúp bổ sung nước rất tốt cho mèo lười uống.',
      feedingTips: 'Bóp trực tiếp từ tuýp để gắn kết tình cảm với bé cưng.',
    },
    specifications: {
      origin: 'Nhật Bản (Inaba Foods Tokyo)',
      manufacturer: 'Inaba Petfood Co., Ltd. (Shizuoka, Japan)',
      mfgDate: '20/01/2026',
      expDate: '20/01/2028 (Hạn dùng 24 tháng)',
      packaging: 'Túi nhôm vô trùng 4 lớp kháng khuẩn tiện lợi',
      storage: 'Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp',
      afterOpenAdvice: 'Nếu chưa dùng hết, gấp mép cất ngăn mát tủ lạnh tối đa 24 giờ',
    },
    reviews: [
      {
        id: 'churu-1',
        userName: 'Nguyễn Thị Hoa',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        rating: 5,
        date: '02/10/2026',
        verified: true,
        weightBought: '400g',
        comment: 'Bé Miu nhà mình mê tít vị gà này! Cứ thấy cầm tuýp kem là chạy lại nũng nịu liếm sạch bóng.',
        likes: 24,
      },
      {
        id: 'churu-2',
        userName: 'Phạm Thu Trang',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        rating: 5,
        date: '05/10/2026',
        verified: true,
        weightBought: '1.5kg',
        comment: 'Date mới tinh 2026-2028, đóng gói cực kỳ đẹp và cẩn thận. Mua xô 1.5kg tiết kiệm được nhiều tiền.',
        likes: 15,
      },
    ],
  },

  '8': {
    id: 8,
    name: '(1 tải 6 bao) Cát Nhật đen MoonCat 9L chính hãng, Cát vệ sinh cho mèo khử mùi, vón cục tốt',
    brand: 'Khác',
    category: 'Cát vệ sinh cho mèo',
    sku: 'Đang cập nhật',
    price: 434000,
    originalPrice: 510000,
    discountPercent: 15,
    stock: 88,
    inStock: true,
    rating: 5.0,
    reviewCount: 15,
    soldCount: 15,
    isNewlyLaunched: true,
    salesCountNote: '15',
    description:
      'Cát Nhật đen MoonCat 9L chính hãng là dòng sản phẩm cao cấp giá bình dân, siêu khử mùi hôi, vón cục nhanh cứng và lượng bụi cực thấp an toàn cho sen và boss.',
    highlightTags: ['Khử mùi', 'Vón cục tốt', 'Ít bụi', 'Vừa mở bán'],
    scents: [
      'Mooncat-Táo 9L',
      'Mooncat-Phấn 9L',
      'Mooncat-Cafe 9L',
      'MoonCat-Chanh 9L',
    ],
    vouchers: [
      { label: 'Voucher 15k', desc: 'Cho đơn 300k', code: 'VC15K' },
      { label: 'Voucher 30k', desc: 'Cho đơn 500k', code: 'VC30K' },
      { label: 'Voucher 80k', desc: 'Cho đơn 1000k', code: 'VC80K' },
      { label: 'Voucher 160k', desc: 'Cho đơn 2000k', code: 'VC160K' },
    ],
    coupons: ['FS20K', 'FS30K'],
    serviceCommitments: [
      'Giao hàng miễn phí trong 24h (chỉ áp dụng khu vực nội thành)',
      'Trả góp lãi suất 0% qua thẻ tín dụng Visa, Master, JCB',
      'Đổi trả miễn phí trong 30 ngày',
    ],
    productType: 'litter',
    introduction:
      'Cát Nhật Đen là dòng sản phẩm cao cấp nhưng giá thành lại rất bình dân, vừa an toàn mà lại có thể xóa tan đi nỗi ám ảnh của bạn khi dọn dẹp chất thải của những chú mèo cưng với hương chanh và các hương thơm tự nhiên dễ chịu.',
    usageInstructions: [
      '– Đổ Cát Vệ Sinh vào khay, chậu với độ dày khoảng 5 – 6 cm;',
      '– Dùng Xẻng dọn phần vón cục cho vào thùng rác;',
      '– Bổ sung thêm Cát Vệ Sinh vào khay, chậu để duy trì lượng cát trong khay 5 – 6 cm',
    ],
    targetAudience: 'Sản phẩm sử dụng được cho tất cả những chú mèo con và mèo trưởng thành.',
    productBenefits: [
      {
        title: 'Đặc biệt khử mùi rất tốt',
        content:
          'Như các bạn đã biết cà phê có khả năng hút ẩm và khử mùi rất tốt cho nên cát hương cà phê khử mùi tốt nhất trong các mùi còn lại.',
      },
      {
        title: 'Hương thơm tự nhiên dễ chịu',
        content:
          'Tuy nhiên nếu các sen nuôi ít mèo thì có thể lựa chọn các mùi khác, tuy mùi thơm nhẹ hơn nhưng khử mùi vẫn rất ok đi vào nhà lúc nào cũng có mùi thơm nhẹ.',
      },
      {
        title: 'Vón cục nhanh và cứng',
        content:
          'Vón cục nhanh và cứng giúp sen dọn dẹp nhanh chóng, tiết kiệm cát và tiết kiệm thời gian.',
      },
      {
        title: 'Lượng bụi trong cát cực thấp',
        content: 'Lượng bụi trong cát thấp nên không ảnh hưởng đến sen và boss nhé.',
      },
    ],
    storeCommitment: {
      slogan:
        'Vũ Trụ Thú Cưng nơi giúp chia sẻ niềm vui nuôi thú cưng đến tất cả mọi người. Vũ trụ thú cưng luôn mang đến cho khách hàng những sản phẩm tốt nhất với giá rẻ nhất.',
      points: [
        '⚡️Hàng thật giống hình.',
        '⚡️100/100 hàng chính hãng.',
        '⚡️Đổi trả miễn phí tận nhà nếu hàng hóa lỗi do nhà sản xuất, nhà bán hàng giống như này',
      ],
    },
    weightOptions: [
      { label: '1 tải 6 bao', weight: '1 tải 6 bao', price: 434000, originalPrice: 510000 },
      { label: 'Bao lẻ 9L', weight: '1 bao 9L', price: 75000, originalPrice: 90000 },
      { label: 'Combo 2 bao 9L', weight: '2 bao 9L', price: 148000, originalPrice: 175000 },
    ],
    rewardPoints: 4340,
    shippingInfo: {
      freeshipThreshold: 300000,
      estimatedDelivery: 'Giao hàng miễn phí trong 24h nội thành',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        caption: '(1 tải 6 bao) Cát Nhật đen MoonCat 9L chính hãng',
        tag: 'Bao bì',
      },
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
        caption: 'Hạt cát vón cục nhanh và cứng, khóa ẩm siêu tốc',
        tag: 'Thức ăn thực tế',
      },
      {
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
        caption: '4 mùi hương thơm ngát: Táo, Phấn, Cafe, Chanh',
        tag: 'Mặt sau bao bì',
      },
      {
        url: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800',
        caption: 'Công nghệ khử bụi triệt để, an toàn tuyệt đối cho mèo',
        tag: 'Bảng thành phần',
      },
      {
        url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800',
        caption: 'Hướng dẫn sử dụng khay cát độ dày 5 - 6 cm',
        tag: 'Hướng dẫn SD',
      },
    ],
    whatMadeOf: {
      mainIngredients: [
        'Khoáng sét Bentonite tự nhiên cao cấp',
        'Than hoạt tính khử mùi Carbon Active',
        'Hạt lưu hương tự nhiên chiết xuất Táo, Phấn, Cafe, Chanh',
        'Hợp chất chống vi khuẩn thân thiện với môi trường',
      ],
      proteinSources: ['Khoáng sét tự nhiên 100%'],
      subIngredients: ['Hạt lưu hương thực vật', 'Khoáng silicat hút ẩm'],
      fats: 'Không chứa chất độc hại, an toàn tuyệt đối',
      vitamins: [],
      minerals: ['Bentonite khoáng sét'],
      taurine: '',
      preservatives: 'Hoàn toàn tự nhiên không hóa chất bảo quản độc hại',
      allergens: [],
    },
    nutrition: {
      crudeProtein: 'N/A',
      crudeProteinNum: 0,
      crudeFat: 'N/A',
      crudeFatNum: 0,
      crudeFiber: 'N/A',
      moisture: '< 4% (Hút ẩm cực mạnh)',
      crudeAsh: 'N/A',
      carbohydrates: 'N/A',
      caloriesKcal: 'N/A',
      taurineValue: 'N/A',
      calciumPhosphorus: 'Khoáng tự nhiên',
    },
    suitability: {
      stages: ['Mèo con', 'Mèo trưởng thành', 'Mèo già'],
      lifestyles: [
        'Mèo nuôi trong phòng kín, căn hộ',
        'Mèo nhạy cảm với mùi hôi',
        'Nhà nuôi nhiều bé mèo',
      ],
      suggestedAge: 'Mọi lứa tuổi',
      suggestedWeight: 'Tất cả các dòng mèo',
      goals: ['Tiêu hóa'],
      highlights: [
        'Khử mùi hôi chất thải vượt trội',
        'Vón cục siêu cứng, không vỡ vụn khi xúc',
        'Lượng bụi cực thấp, bảo vệ đường hô hấp',
      ],
    },
    warnings: {
      avoidIfAllergic: [],
      ageRestrictions: 'Thích hợp cho cả mèo con và mèo trưởng thành',
      sensitiveNotes: ['Không xả vào bồn cầu để tránh tắc nghẽn đường ống'],
      manufacturerWarning: 'Đổ cát vào khay tối thiểu 5 – 6 cm để đạt hiệu quả vón cục tốt nhất.',
    },
    feedingGuide: {
      portionTable: [
        { weight: '1 bé mèo', gramsPerDay: '1 bao 9L dùng ~ 3 - 4 tuần', mealsPerDay: 'Dọn 1 lần/ngày' },
        { weight: '2 bé mèo', gramsPerDay: '2 bao 9L dùng ~ 3 tuần', mealsPerDay: 'Dọn 2 lần/ngày' },
        { weight: 'Tải 6 bao', gramsPerDay: 'Dùng thoải mái 4 - 6 tháng', mealsPerDay: 'Siêu tiết kiệm' },
      ],
      transitionGuide: [
        { days: 'Ngày 1 - 2', newFoodPercent: 30, oldFoodPercent: 70, note: 'Trộn 30% cát MoonCat với cát cũ' },
        { days: 'Ngày 3 - 4', newFoodPercent: 60, oldFoodPercent: 40, note: 'Tăng lượng cát MoonCat' },
        { days: 'Ngày 5+', newFoodPercent: 100, oldFoodPercent: 0, note: 'Chuyển hoàn toàn sang MoonCat' },
      ],
      waterAdvice: 'Đặt chậu cát ở nơi khô ráo, thoáng khí.',
      feedingTips: 'Xúc bỏ chất thải mỗi ngày để chậu cát luôn sạch thơm.',
    },
    specifications: {
      origin: 'Công nghệ Nhật Bản (Chính hãng MoonCat)',
      manufacturer: 'MoonCat Petcare Japan',
      mfgDate: '10/02/2026',
      expDate: '10/02/2029 (Hạn dùng 3 năm)',
      packaging: '1 tải gồm 6 bao 9L có quai xách tiện lợi',
      storage: 'Bảo quản nơi khô ráo thoáng mát, tránh ẩm ướt',
      afterOpenAdvice: 'Kẹp kín miệng bao sau khi dùng để tránh cát hút ẩm không khí',
    },
    reviews: [
      {
        id: 'mooncat-rev-1',
        userName: 'Nguyễn Bích Phương',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        rating: 5,
        date: '08/10/2026',
        verified: true,
        weightBought: '1 tải 6 bao (Mùi Cafe)',
        comment:
          'Cát MoonCat mùi cafe khử mùi cực đỉnh! Phòng ngủ kín mà không hề có mùi gì luôn. Vón cục chắc nịch không bị vỡ vụn khi xúc, 1 tải 6 bao dùng được cả mấy tháng.',
        likes: 24,
      },
      {
        id: 'mooncat-rev-2',
        userName: 'Trần Văn Hoàng',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 5,
        date: '05/10/2026',
        verified: true,
        weightBought: '1 tải 6 bao (Mùi Chanh)',
        comment:
          'Giao hàng siêu nhanh trong 24h, bác shipper mang lên tận cửa chung cư. Cát siêu ít bụi, mèo nhà mình đi vệ sinh xong chân không bị dính bụi trắng. 10/10 điểm!',
        likes: 18,
      },
      {
        id: 'mooncat-rev-3',
        userName: 'Lê Quỳnh Anh',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        rating: 5,
        date: '02/10/2026',
        verified: true,
        weightBought: 'Combo 2 bao (Mùi Phấn)',
        comment:
          'Hương phấn thơm nhẹ thoang thoảng như phấn em bé. Khử mùi tốt, vón cục nhanh. Hàng chính hãng chuẩn xịn, có voucher giảm giá rất hời.',
        likes: 12,
      },
    ],
  },
};

/**
 * Trả về thông tin chi tiết đầy đủ 10 mục của sản phẩm.
 * Nếu ID chưa có sẵn trong DB, tự động ánh xạ thông minh từ dữ liệu cơ bản hoặc sản phẩm mẫu.
 */
function getCleanFoodImage(name: string, rawUrl?: string): string {
  // Ưu tiên 100% link ảnh thực tế từ DB hoặc người dùng tải lên từ máy tính
  if (rawUrl && rawUrl.trim()) {
    return rawUrl.trim();
  }
  const n = (name || '').toLowerCase();
  if (n.includes('cát') || n.includes('mooncat') || n.includes('tofu') || n.includes('vệ sinh')) {
    return 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800';
  }
  if (n.includes('churu') || n.includes('bánh thưởng') || n.includes('snack') || n.includes('thưởng')) {
    return 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800';
  }
  if (n.includes('pate') || n.includes('whiskas') || n.includes('me-o') || n.includes('ướt') || n.includes('sốt')) {
    return 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800';
  }
  if (n.includes('xương') || n.includes('pedigree') || n.includes('gặm') || n.includes('dentastix')) {
    return 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800';
  }
  if (n.includes('orijen') || n.includes('grain-free') || n.includes('cao cấp')) {
    return 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800';
  }
  if (n.includes('mèo') || n.includes('fit 32') || n.includes('royal canin')) {
    return 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800';
  }
  return rawUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800';
}

export function parseSafeArray(val: any, defaultArr: string[] = []): string[] {
  if (Array.isArray(val)) {
    const filtered = val.filter(Boolean).map((s) => String(s).trim()).filter(Boolean);
    return filtered.length > 0 ? filtered : defaultArr;
  }
  if (typeof val === 'string' && val.trim()) {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(Boolean).map((s) => String(s).trim()).filter(Boolean);
          return filtered.length > 0 ? filtered : defaultArr;
        }
      } catch {}
    }
    if (trimmed.includes(',')) {
      const splitArr = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      return splitArr.length > 0 ? splitArr : defaultArr;
    }
    return [trimmed];
  }
  return defaultArr;
}

export function getProductFullDetails(
  id: string | number,
  fallbackBase?: {
    name?: string;
    price?: number;
    originalPrice?: number;
    discountPercent?: number;
    image?: string;
    description?: string;
    category?: string;
    stock?: number;
    inStock?: boolean;
    brand?: string;
    galleryImages?: string[];
    weightOptions?: any[];
    proteinSources?: string;
    targetPet?: string;
    crudeProtein?: string;
    crudeFat?: string;
    crudeFiber?: string;
    caloriesKcal?: string;
    highlightTags?: string[];
    scents?: string[];
  }
): FullProductDetail {
  const strId = String(id);
  if (DETAILED_PRODUCTS_DATABASE[strId]) {
    const existing = DETAILED_PRODUCTS_DATABASE[strId];
    if (fallbackBase) {
      const cleanImg = fallbackBase.image && fallbackBase.image.trim() ? fallbackBase.image.trim() : existing.images[0]?.url;
      const updatedPrice = Number(fallbackBase.price) > 0 ? Number(fallbackBase.price) : existing.price;
      const updatedOrig = Number(fallbackBase.originalPrice) > 0 ? Number(fallbackBase.originalPrice) : existing.originalPrice;
      const updatedName = fallbackBase.name || existing.name;
      const updatedDesc = fallbackBase.description !== undefined ? fallbackBase.description : existing.description;
      const updatedStock = fallbackBase.stock !== undefined ? Number(fallbackBase.stock) : existing.stock;
      const updatedInStock = fallbackBase.inStock !== undefined ? fallbackBase.inStock : updatedStock > 0;

      let newImages = existing.images;
      const safeGallery = Array.isArray(fallbackBase.galleryImages)
        ? fallbackBase.galleryImages.filter(Boolean)
        : typeof fallbackBase.galleryImages === 'string' && fallbackBase.galleryImages
        ? [fallbackBase.galleryImages]
        : [];
      if (safeGallery.length > 0) {
        const uniqueUrls = Array.from(new Set([cleanImg, ...safeGallery].filter(Boolean))) as string[];
        newImages = uniqueUrls.map((url, i) => {
          const matchExisting = existing.images.find((img) => img.url === url);
          return {
            url,
            caption: matchExisting?.caption || `${updatedName} - Ảnh ${i + 1}`,
            tag: matchExisting?.tag || (i === 0 ? ('Bao bì' as const) : ('Thức ăn thực tế' as const)),
          };
        });
      } else if (cleanImg) {
        newImages = [
          { url: cleanImg, caption: `${updatedName} - Ảnh chính`, tag: 'Bao bì' as const },
        ];
      }

      const fbWeights = (fallbackBase as any).weightOptions;
      const updatedWeights = fbWeights && Array.isArray(fbWeights) && fbWeights.length > 0
        ? fbWeights
        : existing.weightOptions.map((opt) => {
            const ratio = existing.price > 0 ? updatedPrice / existing.price : 1;
            return {
              ...opt,
              price: Math.round(opt.price * ratio),
              originalPrice: Math.round(opt.originalPrice * ratio),
            };
          });

      return {
        ...existing,
        name: updatedName,
        price: updatedPrice,
        originalPrice: updatedOrig,
        discountPercent: fallbackBase.discountPercent !== undefined ? fallbackBase.discountPercent : existing.discountPercent,
        description: updatedDesc,
        category: fallbackBase.category || existing.category,
        brand: fallbackBase.brand || existing.brand,
        stock: updatedStock,
        inStock: updatedInStock,
        images: newImages,
        weightOptions: updatedWeights,
        whatMadeOf: {
          ...existing.whatMadeOf,
          proteinSources: (fallbackBase as any).proteinSources ? parseSafeArray((fallbackBase as any).proteinSources) : existing.whatMadeOf.proteinSources,
        },
        nutrition: {
          ...existing.nutrition,
          crudeProtein: (fallbackBase as any).crudeProtein || existing.nutrition.crudeProtein,
          crudeFat: (fallbackBase as any).crudeFat || existing.nutrition.crudeFat,
          crudeFiber: (fallbackBase as any).crudeFiber || existing.nutrition.crudeFiber,
          caloriesKcal: (fallbackBase as any).caloriesKcal || existing.nutrition.caloriesKcal,
        },
        highlightTags: parseSafeArray((fallbackBase as any).highlightTags, existing.highlightTags || []),
        scents: parseSafeArray((fallbackBase as any).scents, existing.scents || []),
      };
    }
    return existing;
  }

  // Nếu là sản phẩm mới hoặc chưa có cấu hình chi tiết, tạo ra bản chi tiết đầy đủ chuẩn hóa
  const defaultTemplate = DETAILED_PRODUCTS_DATABASE['1'];
  const baseName = fallbackBase?.name || `Sản phẩm #${id}`;
  const basePrice = Number(fallbackBase?.price) || 180000;
  const baseOrig = Number(fallbackBase?.originalPrice) || Math.round(basePrice * 1.18);
  const isCat = (baseName || '').toLowerCase().includes('mèo') || (baseName || '').toLowerCase().includes('cat') || (baseName || '').toLowerCase().includes('churu');
  const baseImg =
    fallbackBase?.image ||
    (isCat
      ? 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800'
      : 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800');

  const safeBaseGallery = Array.isArray(fallbackBase?.galleryImages)
    ? fallbackBase.galleryImages
    : typeof fallbackBase?.galleryImages === 'string' && fallbackBase.galleryImages
    ? [fallbackBase.galleryImages]
    : [];
  const gallery = safeBaseGallery.length > 0
    ? safeBaseGallery.map((g, idx) => ({ url: g, caption: `${baseName} - Ảnh ${idx + 1}`, tag: 'Thức ăn thực tế' as const }))
    : [
        { url: baseImg, caption: `${baseName} - Bao bì chính hãng`, tag: 'Bao bì' as const },
        {
          url: isCat ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800' : 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800',
          caption: 'Thức ăn thơm ngon giàu đạm tự nhiên',
          tag: 'Thức ăn thực tế' as const,
        },
        {
          url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
          caption: 'Mặt sau bao bì in rõ nguồn gốc xuất xứ',
          tag: 'Mặt sau bao bì' as const,
        },
        {
          url: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800',
          caption: 'Bảng thành phần dinh dưỡng chuẩn thú y',
          tag: 'Bảng thành phần' as const,
        },
        {
          url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800',
          caption: 'Hướng dẫn cho ăn chuẩn khoa học',
          tag: 'Hướng dẫn SD' as const,
        },
      ];

  return {
    ...defaultTemplate,
    id: id,
    name: baseName,
    sku: `PET-${id}-${Math.floor(100 + Math.random() * 900)}`,
    brand: fallbackBase?.brand || 'PetCare Official',
    category: fallbackBase?.category || 'Thức ăn dinh dưỡng',
    price: basePrice,
    originalPrice: baseOrig,
    discountPercent: fallbackBase?.discountPercent !== undefined ? fallbackBase.discountPercent : 15,
    stock: fallbackBase?.stock !== undefined ? Number(fallbackBase.stock) : 100,
    inStock: fallbackBase?.inStock !== undefined ? fallbackBase.inStock : true,
    description:
      fallbackBase?.description ||
      `Thức ăn dinh dưỡng chuyên biệt dành cho thú cưng, bổ sung các dưỡng chất vi lượng thiết yếu và đạm chất lượng cao giúp bé khỏe mạnh toàn diện.`,
    highlightTags: parseSafeArray((fallbackBase as any)?.highlightTags, defaultTemplate.highlightTags || []),
    scents: parseSafeArray((fallbackBase as any)?.scents, defaultTemplate.scents || []),
    weightOptions: [
      { label: 'Gói nhỏ 400g', weight: '400g', price: Math.round(basePrice * 0.4), originalPrice: Math.round(baseOrig * 0.4) },
      { label: 'Túi tiêu chuẩn 1.5kg', weight: '1.5kg', price: basePrice, originalPrice: baseOrig },
      { label: 'Túi lớn 3.5kg', weight: '3.5kg', price: Math.round(basePrice * 2.1), originalPrice: Math.round(baseOrig * 2.1) },
    ],
    images: gallery,
  };
}

/**
 * THUẬT TOÁN BỘ LỌC “TÌM THỨC ĂN PHÙ HỢP CHO BÉ” (PET FOOD MATCHER)
 * Lọc chính xác 3 sản phẩm phù hợp nhất dựa trên:
 * - Tuổi: Mèo con / Mèo trưởng thành / Mèo già
 * - Cân nặng: < 2kg / 2-4kg / 4-6kg / > 6kg
 * - Mục tiêu: Tăng cân / Kiểm soát cân nặng / Lông đẹp / Tiêu hóa / Mèo kén ăn
 * - Thành phần cần tránh: Gà / Cá / Bò / Trứng / Ngũ cốc gluten...
 */
export interface PetMatchCriteria {
  ageStage: 'Mèo con' | 'Mèo trưởng thành' | 'Mèo già';
  weightRange: '1 - 2 kg' | '2 - 4 kg' | '4 - 6 kg' | 'Trên 6 kg';
  primaryGoal: 'Tăng cân' | 'Kiểm soát cân nặng' | 'Lông đẹp' | 'Tiêu hóa' | 'Mèo kén ăn';
  avoidAllergens: string[]; // ví dụ ['Gà', 'Cá']
}

export interface MatchedProductResult {
  product: FullProductDetail;
  matchScore: number; // 0 - 100%
  matchedReasons: string[];
  warningNote?: string;
}

export function findTop3MatchingPetFoods(criteria: PetMatchCriteria): MatchedProductResult[] {
  const allProducts = Object.values(DETAILED_PRODUCTS_DATABASE);

  const scoredList = allProducts.map((prod) => {
    let score = 50; // Điểm cơ sở
    const reasons: string[] = [];
    let warning: string | undefined = undefined;

    // 1. Kiểm tra thành phần cần tránh (Dị ứng)
    let hasAllergen = false;
    for (const allergen of criteria.avoidAllergens) {
      const match = prod.warnings.avoidIfAllergic.some(
        (a) => a.toLowerCase().includes(allergen.toLowerCase()) || allergen.toLowerCase().includes(a.toLowerCase())
      );
      if (match) {
        hasAllergen = true;
        score -= 60; // Trừ điểm nặng nếu dính thành phần dị ứng
        warning = `⚠️ Cảnh báo: Chứa ${allergen} có thể gây dị ứng cho bé!`;
        break;
      }
    }

    if (!hasAllergen && criteria.avoidAllergens.length > 0) {
      score += 15;
      reasons.push(`An toàn tuyệt đối: Không chứa ${criteria.avoidAllergens.join(', ')}`);
    }

    // 2. Kiểm tra độ tuổi (Stage)
    if (prod.suitability.stages.includes(criteria.ageStage)) {
      score += 25;
      reasons.push(`Thiết kế chuyên biệt cho giai đoạn ${criteria.ageStage}`);
    } else {
      score -= 20;
    }

    // 3. Kiểm tra mục tiêu chăm sóc (Goal)
    if (prod.suitability.goals.includes(criteria.primaryGoal)) {
      score += 20;
      reasons.push(`Tối ưu cho mục tiêu: ${criteria.primaryGoal}`);
    }

    // 4. Kiểm tra cân nặng & lối sống
    if (criteria.primaryGoal === 'Kiểm soát cân nặng' && criteria.weightRange.includes('6 kg')) {
      if (prod.suitability.goals.includes('Kiểm soát cân nặng')) {
        score += 10;
        reasons.push('Lượng calo vừa phải hỗ trợ bé quá cân lấy lại vóc dáng');
      }
    }

    if (criteria.primaryGoal === 'Mèo kén ăn' && prod.category.includes('Pate')) {
      score += 15;
      reasons.push('Dạng sốt ướt cá tươi kích thích khứu giác mèo kén ăn vượt trội');
    }

    // Chuẩn hóa điểm từ 10% đến 99%
    const finalScore = Math.max(10, Math.min(99, score));

    return {
      product: prod,
      matchScore: finalScore,
      matchedReasons: reasons.length > 0 ? reasons : ['Cân bằng dinh dưỡng cho thú cưng'],
      warningNote: warning,
    };
  });

  // Sắp xếp theo điểm giảm dần và lấy top 3
  scoredList.sort((a, b) => b.matchScore - a.matchScore);
  return scoredList.slice(0, 3);
}
