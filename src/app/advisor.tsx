import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { AdvisorIcon, CheckIcon } from '@/components/icons';

type PetType = 'dog' | 'cat';
type AgeGroup = 'puppy' | 'adult' | 'senior';
type HealthNeed = 'hair' | 'digestion' | 'weight_gain' | 'weight_loss' | 'bone';

interface RecommendedProductItem {
  id: number;
  name: string;
  badge: string;
  price: string;
  numericPrice: number;
  weight: string;
  image: string;
  reason: string;
  matchScore: number;
}

interface ComprehensiveRecommendation {
  title: string;
  petTypeLabel: string;
  ageLabel: string;
  healthLabel: string;
  caloricNeed: number;
  dailyGrams: number;
  waterMl: number;
  mealsPerDay: number;
  mealPortionGrams: number;
  vetAdvice: string;
  warningNote: string;
  products: RecommendedProductItem[];
}

export default function PetAdvisorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { addToCart } = useCart();

  const isDesktop = width >= 860;

  // TIÊU CHÍ DINH DƯỠNG
  const [petType, setPetType] = useState<PetType>('dog');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [healthNeed, setHealthNeed] = useState<HealthNeed>('hair');

  // TOAST THÔNG BÁO THÊM GIỎ HÀNG
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // HÀM TÍNH TOÁN & GỢI Ý REALTIME THEO BẤT KỲ LỰA CHỌN NÀO
  const calculateComprehensiveRecommendation = (): ComprehensiveRecommendation => {
    // 1. Tính toán nhu cầu năng lượng chuẩn thú y RER & MER
    const rer = 70 * Math.pow(weightKg, 0.75);

    let multiplier = 1.6;
    if (ageGroup === 'puppy') multiplier = petType === 'dog' ? 2.5 : 2.2;
    else if (ageGroup === 'senior') multiplier = 1.2;
    else {
      if (healthNeed === 'weight_loss') multiplier = 1.1;
      else if (healthNeed === 'weight_gain') multiplier = 1.9;
      else multiplier = 1.5;
    }

    const dailyCalories = Math.round(rer * multiplier);
    // Hạt chuẩn ~3.8 kcal/g
    const dailyGrams = Math.round(dailyCalories / 3.8);
    const waterMl = Math.round(dailyCalories * 1.0);
    const meals = ageGroup === 'puppy' ? 3 : 2;
    const portionGrams = Math.round(dailyGrams / meals);

    const petNameStr = petType === 'dog' ? 'Chó Cưng' : 'Mèo Cưng';
    const ageNameStr =
      ageGroup === 'puppy'
        ? 'Bé con (< 1 tuổi)'
        : ageGroup === 'senior'
        ? 'Lớn tuổi (> 7 tuổi)'
        : 'Trưởng thành (1-7 tuổi)';

    const healthNameStr =
      healthNeed === 'hair'
        ? 'Dưỡng mượt lông, giảm rụng lông'
        : healthNeed === 'digestion'
        ? 'Tiêu hóa êm, ngừa búi lông'
        : healthNeed === 'weight_gain'
        ? 'Bổ sung đạm, tăng cơ bắp'
        : healthNeed === 'weight_loss'
        ? 'Kiểm soát calo, giữ dáng'
        : 'Xương khớp chắc khỏe linh hoạt';

    const title = `Thực đơn vàng cho ${petNameStr} • ${ageNameStr} (${weightKg}kg)`;
    let vetAdvice = '';
    let warningNote = '';
    let products: RecommendedProductItem[] = [];

    if (petType === 'cat') {
      // DÀNH CHO MÈO
      if (healthNeed === 'hair') {
        vetAdvice =
          'Bổ sung Omega-3 & Omega-6 từ dầu cá biển giúp nang lông chắc khỏe. Chải lông 2 lần/tuần để hạn chế nuốt lông vào ruột.';
        warningNote = 'Không nên tắm quá nhiều làm mất đi lớp dầu tự nhiên bảo vệ da lông của bé.';
        products = [
          {
            id: 1,
            name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32',
            badge: 'Món chính (Hạt khô)',
            price: '350.000 ₫',
            numericPrice: 350000,
            weight: '2.0 kg',
            image:
              'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
            reason:
              'Phức hợp chất xơ hòa tan giúp đẩy búi lông qua đường tiêu hóa, Omega-6 hỗ trợ lông sáng bóng.',
            matchScore: 99,
          },
          {
            id: 101,
            name: 'Pate Whiskas Vị Cá Ngừ Tươi & Cá Hồi Cấp Nước',
            badge: 'Món ướt (Bổ sung)',
            price: '22.000 ₫',
            numericPrice: 22000,
            weight: '85 g',
            image:
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
            reason:
              'Cung cấp 80% độ ẩm tự nhiên giúp mượt lông, chống sỏi thận và kích thích vị giác bé ăn ngon.',
            matchScore: 96,
          },
          {
            id: 6,
            name: 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà & Sò Điệp',
            badge: 'Thưởng & Khen ngợi',
            price: '38.000 ₫',
            numericPrice: 38000,
            weight: '4 thanh / gói',
            image:
              'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
            reason:
              'Bổ sung Collagen và tinh chất trà xanh khử mùi hôi miệng, nuôi dưỡng lớp lông óng ả.',
            matchScore: 92,
          },
        ];
      } else if (healthNeed === 'digestion') {
        vetAdvice =
          'Hệ tiêu hóa mèo rất nhạy cảm với tinh bột độn. Ưu tiên đạm cao cấp từ thịt tươi nguyên chất và chia nhỏ bữa ăn.';
        warningNote = 'Luôn chuẩn bị bát nước sạch cách xa bát thức ăn ít nhất 1m để mèo uống nhiều nước.';
        products = [
          {
            id: 5,
            name: 'Hạt Orijen Cat & Kitten 85% Đạm Thịt Cá Tươi',
            badge: 'Món chính (Hạt cao cấp)',
            price: '480.000 ₫',
            numericPrice: 480000,
            weight: '1.8 kg',
            image:
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
            reason:
              'Hoàn toàn không ngũ cốc độn bắp ngô, 85% thịt cá thật giúp đường ruột hấp thu trọn vẹn không đầy bụng.',
            matchScore: 98,
          },
          {
            id: 101,
            name: 'Pate Whiskas Mèo Vị Cá Thu Dễ Tiêu Hóa',
            badge: 'Món ướt (Êm ruột)',
            price: '22.000 ₫',
            numericPrice: 22000,
            weight: '85 g',
            image:
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
            reason:
              'Dạng xốt mịn bổ sung prebiotic tự nhiên, bảo vệ niêm mạc ruột non và ngăn ngừa táo bón.',
            matchScore: 95,
          },
          {
            id: 7,
            name: 'Gel Dinh Dưỡng Nourse 21 Bổ Sung Lợi Khuẩn & Vitamin',
            badge: 'Bổ trợ tiêu hóa',
            price: '185.000 ₫',
            numericPrice: 185000,
            weight: '120 g',
            image:
              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            reason:
              'Tăng cường enzym tiêu hóa và năng lượng nhanh, rất tốt cho mèo hấp thu kém hoặc sau ốm.',
            matchScore: 91,
          },
        ];
      } else if (healthNeed === 'weight_gain') {
        vetAdvice =
          'Để mèo tăng cân khỏe mạnh không tích mỡ thừa, cần tập trung nguồn đạm sinh học 40% kết hợp bữa phụ dinh dưỡng cao.';
        warningNote = 'Không ép mèo ăn quá nhiều trong 1 cữ, hãy chia làm 3-4 bữa để đường ruột chuyển hóa tốt.';
        products = [
          {
            id: 5,
            name: 'Hạt Orijen Cat & Kitten 40% Đạm Tăng Cân Nở Cơ',
            badge: 'Món chính (Đạm đậm đặc)',
            price: '480.000 ₫',
            numericPrice: 480000,
            weight: '1.8 kg',
            image:
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
            reason:
              'Hàm lượng đạm cao từ thịt tươi nguyên chất giúp mèo tăng cân săn chắc, má phính tròn xinh.',
            matchScore: 99,
          },
          {
            id: 7,
            name: 'Gel Dinh Dưỡng Nourse 21 Năng Lượng Đậm Đặc',
            badge: 'Phục hồi thể trạng',
            price: '185.000 ₫',
            numericPrice: 185000,
            weight: '120 g',
            image:
              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            reason:
              'Cung cấp năng lượng tức thì, kích thích vị giác ăn khỏe và tăng hấp thụ dinh dưỡng.',
            matchScore: 96,
          },
          {
            id: 6,
            name: 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà Thơm Ngon',
            badge: 'Thưởng & Kích thích ăn',
            price: '38.000 ₫',
            numericPrice: 38000,
            weight: '4 thanh / gói',
            image:
              'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
            reason:
              'Trộn trực tiếp vào bát hạt để lôi cuốn mèo biếng ăn ăn sạch khẩu phần.',
            matchScore: 93,
          },
        ];
      } else if (healthNeed === 'weight_loss') {
        vetAdvice =
          'Giảm 15-20% khẩu phần hạt khô, tăng cường thức ăn ướt giàu nước và chơi đùa với cần câu mèo 20 phút mỗi ngày.';
        warningNote = 'Không cắt giảm thức ăn quá đột ngột vì mèo có nguy cơ nhiễm độc gan.';
        products = [
          {
            id: 3,
            name: 'Thức Ăn Hạt Cho Mèo Whiskas Vị Cá Biển Cân Bằng Calo',
            badge: 'Món chính (Hạt khô)',
            price: '145.000 ₫',
            numericPrice: 145000,
            weight: '1.2 kg',
            image:
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
            reason:
              'Năng lượng kiểm soát vừa phải, giàu Taurine sáng mắt mà không gây tích tụ mỡ bụng.',
            matchScore: 96,
          },
          {
            id: 101,
            name: 'Pate Whiskas Vị Cá Ngừ Tươi Ít Calo No Lâu',
            badge: 'Món ướt (No lâu)',
            price: '22.000 ₫',
            numericPrice: 22000,
            weight: '85 g',
            image:
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
            reason:
              'Thể tích lớn chứa 80% nước giúp mèo no bụng, giảm đòi ăn vặt mà không lo dư calo.',
            matchScore: 94,
          },
          {
            id: 1,
            name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32',
            badge: 'Kiểm soát cân nặng',
            price: '350.000 ₫',
            numericPrice: 350000,
            weight: '2.0 kg',
            image:
              'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
            reason:
              'Công thức chất xơ và L-carnitine hỗ trợ chuyển hóa mỡ thừa thành năng lượng vận động.',
            matchScore: 91,
          },
        ];
      } else {
        // bone
        vetAdvice =
          'Tỷ lệ Canxi và Photpho đạt chuẩn 1.2:1 cùng Vitamin D3 giúp xương khớp mèo dẻo dai, hỗ trợ bật nhảy linh hoạt.';
        warningNote = 'Chỉ bổ sung canxi theo đúng liều lượng khuyến cáo, tránh lắng đọng sỏi đường tiểu.';
        products = [
          {
            id: 1,
            name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32 Khung Xương Khỏe',
            badge: 'Món chính (Hạt khô)',
            price: '350.000 ₫',
            numericPrice: 350000,
            weight: '2.0 kg',
            image:
              'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
            reason:
              'Cân đối khoáng chất và bổ sung Canxi/Phốt pho chuẩn AAFCO giúp khung xương chắc chắn.',
            matchScore: 97,
          },
          {
            id: 7,
            name: 'Gel Dinh Dưỡng Nourse 21 Bổ Sung Khoáng & Vitamin D',
            badge: 'Bổ trợ sụn khớp',
            price: '185.000 ₫',
            numericPrice: 185000,
            weight: '120 g',
            image:
              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            reason:
              'Canxi sinh học dễ hấp thụ kết hợp Vitamin D3 giúp tăng cường mật độ xương và dẻo dai khớp.',
            matchScore: 93,
          },
          {
            id: 101,
            name: 'Pate Whiskas Vị Cá Hồi Giàu Omega-3 Chống Viêm Khớp',
            badge: 'Món ướt (Bổ sung)',
            price: '22.000 ₫',
            numericPrice: 22000,
            weight: '85 g',
            image:
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
            reason:
              'EPA & DHA tự nhiên từ cá hồi giúp bôi trơn các khớp gối khi mèo leo trèo.',
            matchScore: 90,
          },
        ];
      }
    } else {
      // DÀNH CHO CHÓ
      if (healthNeed === 'bone') {
        vetAdvice =
          'Khung xương cún cần nâng đỡ toàn bộ cơ thể. Bổ sung Canxi, Phốt pho cân bằng và cho cún phơi nắng sớm 15 phút mỗi ngày.';
        warningNote = 'Không nên cho cún leo cầu thang liên tục khi dưới 6 tháng tuổi.';
        products = [
          {
            id: 4,
            name: 'Thức Ăn Khô Cho Chó SmartHeart Vị Thịt Bò Chắc Xương',
            badge: 'Món chính (Hạt khô)',
            price: '220.000 ₫',
            numericPrice: 220000,
            weight: '3.0 kg',
            image:
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
            reason:
              'Tỷ lệ Canxi và Photpho cân đối giúp xương chắc khỏe, bổ sung DHA hỗ trợ hệ thần kinh.',
            matchScore: 99,
          },
          {
            id: 404,
            name: 'Xương Gặm Sạch Răng Khử Mùi Hôi Pedigree DentaStix',
            badge: 'Răng & Khung hàm',
            price: '45.000 ₫',
            numericPrice: 45000,
            weight: '112 g (7 que)',
            image:
              'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=80',
            reason:
              'Rãnh chữ X làm sạch 80% cao răng, bổ sung Canxi giúp hàm răng cún luôn chắc khỏe.',
            matchScore: 96,
          },
          {
            id: 2,
            name: 'Pate Cho Chó Pedigree Vị Thịt Bò Và Rau Củ',
            badge: 'Món ướt (Bổ sung)',
            price: '28.000 ₫',
            numericPrice: 28000,
            weight: '130 g',
            image:
              'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
            reason:
              'Độ ẩm cao kích thích vị giác và chứa khoáng chất hữu cơ giúp cún hấp thu Canxi tối đa.',
            matchScore: 92,
          },
        ];
      } else if (healthNeed === 'hair') {
        vetAdvice =
          'Lông chó rụng nhiều thường do thiếu kẽm và acid béo thiết yếu. Cho ăn hạt giàu Omega-3 từ cá hồi kết hợp chải lông hàng ngày.';
        warningNote = 'Không dùng dầu gội đầu người tắm cho cún vì độ pH da cún kiềm hơn da người.';
        products = [
          {
            id: 201,
            name: 'Thức Ăn Hạt SmartHeart Cá Hồi & Dầu Gạo Dưỡng Lông',
            badge: 'Món chính (Hạt khô)',
            price: '265.000 ₫',
            numericPrice: 265000,
            weight: '3.0 kg',
            image:
              'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
            reason:
              'Dầu cá hồi giàu Omega-3 & Omega-6 nuôi dưỡng chân lông, giảm rụng lông rõ rệt sau 3 tuần.',
            matchScore: 98,
          },
          {
            id: 7,
            name: 'Gel Dinh Dưỡng Nourse 21 Bổ Sung Vitamin & Biotin',
            badge: 'Bổ trợ mượt lông',
            price: '185.000 ₫',
            numericPrice: 185000,
            weight: '120 g',
            image:
              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            reason:
              'Biotin và Kẽm nồng độ cao kích thích mọc lông tơ mới óng mượt và bảo vệ biểu bì da.',
            matchScore: 95,
          },
          {
            id: 2,
            name: 'Pate Cho Chó Pedigree Vị Thịt Bò Và Rau Củ',
            badge: 'Món ướt (Bổ sung)',
            price: '28.000 ₫',
            numericPrice: 28000,
            weight: '130 g',
            image:
              'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
            reason:
              'Vitamin tự nhiên từ cà rốt và đậu hà lan giúp da mềm mịn, giảm khô ráp bong vảy.',
            matchScore: 91,
          },
        ];
      } else if (healthNeed === 'weight_gain') {
        vetAdvice =
          'Để cún tăng cơ bắp chứ không tích mỡ, cần nguồn đạm thịt bò tinh khiết và cho cún chạy nhảy sau bữa ăn 45 phút.';
        warningNote = 'Không cho ăn mỡ thừa từ thức ăn thừa của người vì dễ gây viêm tụy cấp.',
        products = [
          {
            id: 4,
            name: 'Thức Ăn Khô Cho Chó SmartHeart Vị Thịt Bò Tăng Cơ',
            badge: 'Món chính (Đạm cao)',
            price: '220.000 ₫',
            numericPrice: 220000,
            weight: '3.0 kg',
            image:
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
            reason:
              'Đạm động vật nguyên chất kích thích phát triển khối cơ săn chắc và nâng cao thể lực.',
            matchScore: 98,
          },
          {
            id: 2,
            name: 'Pate Cho Chó Pedigree Vị Thịt Bò Hầm Rau Củ Đậm Đà',
            badge: 'Món ướt (Năng lượng)',
            price: '28.000 ₫',
            numericPrice: 28000,
            weight: '130 g',
            image:
              'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
            reason:
              'Mùi thơm thịt hầm hấp dẫn giúp cún ăn nhiều hơn, trộn hạt tăng khả năng chuyển hóa calo.',
            matchScore: 95,
          },
          {
            id: 7,
            name: 'Gel Dinh Dưỡng Nourse 21 Năng Lượng Đậm Đặc',
            badge: 'Phục hồi thể trạng',
            price: '185.000 ₫',
            numericPrice: 185000,
            weight: '120 g',
            image:
              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            reason:
              'Cung cấp calo cao sinh học tức thời, rất thích hợp cho cún gầy gò hoặc kén ăn.',
            matchScore: 92,
          },
        ];
      } else if (healthNeed === 'weight_loss') {
        vetAdvice =
          'Giảm 15% khẩu phần hạt khô, chia làm 2 cữ đều đặn và dắt cún đi dạo 30 phút mỗi ngày vào sáng sớm.';
        warningNote = 'Không cho ăn xúc xích hay bánh ngọt của người vì lượng muối và đường quá lớn.',
        products = [
          {
            id: 4,
            name: 'Thức Ăn Khô Cho Chó SmartHeart Kiểm Soát Calo',
            badge: 'Món chính (Hạt khô)',
            price: '220.000 ₫',
            numericPrice: 220000,
            weight: '3.0 kg',
            image:
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
            reason:
              'Tăng cường chất xơ tự nhiên giúp cún no bụng lâu, hạn chế tích tụ mỡ thừa dưới da.',
            matchScore: 97,
          },
          {
            id: 404,
            name: 'Xương Gặm Sạch Răng Pedigree DentaStix Ít Calo',
            badge: 'Snack không béo',
            price: '45.000 ₫',
            numericPrice: 45000,
            weight: '112 g (7 que)',
            image:
              'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=80',
            reason:
              'Giải tỏa năng lượng cắn phá và làm sạch răng miệng mà không gây dư calo.',
            matchScore: 94,
          },
          {
            id: 2,
            name: 'Pate Cho Chó Pedigree Vị Rau Củ Thanh Đạm',
            badge: 'Món ướt (Nhiều xơ)',
            price: '28.000 ₫',
            numericPrice: 28000,
            weight: '130 g',
            image:
              'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
            reason:
              'Độ ẩm 82% cùng chất xơ rau củ giúp cún nhanh no bụng, giảm thói quen xin ăn giữa cữ.',
            matchScore: 90,
          },
        ];
      } else {
        // digestion
        vetAdvice =
          'Hệ tiêu hóa cún cần thức ăn mềm, dễ hấp thụ, không chứa gia vị cay nóng hay vụn xương gà sắc nhọn.';
        warningNote = 'Áp dụng quy tắc chuyển đổi thức ăn 7 ngày để hệ vi sinh đường ruột thích nghi ổn định.',
        products = [
          {
            id: 2,
            name: 'Pate Cho Chó Pedigree Vị Thịt Bò Và Rau Củ',
            badge: 'Món chính (Pate ướt)',
            price: '28.000 ₫',
            numericPrice: 28000,
            weight: '130 g',
            image:
              'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
            reason:
              'Dễ nuốt, dễ tiêu, bảo vệ thành dạ dày và chống táo bón nhờ hàm lượng ẩm cao tự nhiên.',
            matchScore: 99,
          },
          {
            id: 4,
            name: 'Thức Ăn Khô Cho Chó SmartHeart Vị Thịt Bò Dễ Tiêu',
            badge: 'Hạt dinh dưỡng',
            price: '220.000 ₫',
            numericPrice: 220000,
            weight: '3.0 kg',
            image:
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
            reason:
              'Tinh bột nấu chín kỹ dễ hấp thu, bổ sung men vi sinh giảm mùi hôi chất thải đáng kể.',
            matchScore: 95,
          },
          {
            id: 7,
            name: 'Gel Dinh Dưỡng Nourse 21 Bổ Sung Lợi Khuẩn Đường Ruột',
            badge: 'Bổ trợ tiêu hóa',
            price: '185.000 ₫',
            numericPrice: 185000,
            weight: '120 g',
            image:
              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            reason:
              'Tái lập cân bằng vi sinh ruột, giúp phân thành khuôn đẹp và hấp thu dưỡng chất tốt hơn.',
            matchScore: 92,
          },
        ];
      }
    }

    return {
      title,
      petTypeLabel: petNameStr,
      ageLabel: ageNameStr,
      healthLabel: healthNameStr,
      caloricNeed: dailyCalories,
      dailyGrams,
      waterMl,
      mealsPerDay: meals,
      mealPortionGrams: portionGrams,
      vetAdvice,
      warningNote,
      products,
    };
  };

  // KẾT QUẢ ĐƯỢC TÍNH TOÁN REALTIME MỖI KHI BẤM BẤT KỲ LỰA CHỌN NÀO
  const rec = calculateComprehensiveRecommendation();
  const bottomInset = insets.bottom + BottomTabInset + Spacing.four;

  const handleAddToCart = (product: RecommendedProductItem) => {
    addToCart({
      id: product.id,
      name: product.name,
      numericPrice: product.numericPrice,
      weight: product.weight,
      image: product.image,
    });
    setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER BAR */}
        <View style={styles.headerBar}>
          <Pressable
            onPress={() => router.push('/')}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <View style={styles.headerIconCircle}>
            <AdvisorIcon size={20} color="#0284C7" />
          </View>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>Tư Vấn Khẩu Phần Dinh Dưỡng</Text>
            <Text style={styles.headerSubtitle}>
              Gợi ý định lượng ăn uống và sản phẩm phù hợp cho bé
            </Text>
          </View>
        </View>

        {/* TOAST THÔNG BÁO THÊM GIỎ HÀNG */}
        {toastMessage && (
          <View style={styles.floatingToast}>
            <Text style={styles.floatingToastText}>✅ {toastMessage}</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
          showsVerticalScrollIndicator={false}>
          
          {/* BỐ CỤC 2 CỘT RESPONSIVE (MÁY TÍNH: SONG SONG | MOBILE: DỌC) */}
          <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
            {/* ======================================================== */}
            {/* CỘT TRÁI: BỘ CHỌN TIÊU CHÍ */}
            {/* ======================================================== */}
            <View style={[styles.columnWrapper, isDesktop && styles.leftColumnDesktop]}>
              <View style={styles.inputCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardHeaderTitle}>🎯 Thể Trạng Bé Cưng</Text>
                </View>

                {/* 1. LOÀI (CHÓ / MÈO) */}
                <View style={styles.fieldSection}>
                  <Text style={styles.label}>1. Loài thú cưng</Text>
                  <View style={styles.rowChoices}>
                    <Pressable
                      onPress={() => setPetType('dog')}
                      style={[
                        styles.choiceButton,
                        petType === 'dog' && styles.choiceButtonActive,
                      ]}>
                      <Text
                        style={[
                          styles.choiceText,
                          petType === 'dog' && styles.choiceTextActive,
                        ]}>
                        🐶 Chó cưng
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setPetType('cat')}
                      style={[
                        styles.choiceButton,
                        petType === 'cat' && styles.choiceButtonActive,
                      ]}>
                      <Text
                        style={[
                          styles.choiceText,
                          petType === 'cat' && styles.choiceTextActive,
                        ]}>
                        🐱 Mèo cưng
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* 2. ĐỘ TUỔI */}
                <View style={styles.fieldSection}>
                  <Text style={styles.label}>2. Độ tuổi</Text>
                  <View style={styles.rowChoices}>
                    {[
                      { key: 'puppy', label: 'Bé con (< 1 tuổi)' },
                      { key: 'adult', label: 'Trưởng thành (1-7 tuổi)' },
                      { key: 'senior', label: 'Lớn tuổi (> 7 tuổi)' },
                    ].map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => setAgeGroup(item.key as any)}
                        style={[
                          styles.choicePill,
                          ageGroup === item.key && styles.choicePillActive,
                        ]}>
                        <Text
                          style={[
                            styles.pillText,
                            ageGroup === item.key && styles.pillTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* 3. CÂN NẶNG */}
                <View style={styles.fieldSection}>
                  <View style={styles.weightHeaderRow}>
                    <Text style={styles.label}>3. Cân nặng</Text>
                    <Text style={styles.weightValueDisplay}>{weightKg} kg</Text>
                  </View>
                  <View style={styles.weightSelector}>
                    {[2, 4, 6, 10, 15, 25].map((w) => (
                      <Pressable
                        key={w}
                        onPress={() => setWeightKg(w)}
                        style={[
                          styles.weightBadge,
                          weightKg === w && styles.weightBadgeActive,
                        ]}>
                        <Text
                          style={[
                            styles.weightBadgeText,
                            weightKg === w && styles.weightBadgeTextActive,
                          ]}>
                          {w} kg
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* 4. NHU CẦU CHĂM SÓC CHÍNH */}
                <View style={styles.fieldSection}>
                  <Text style={styles.label}>4. Nhu cầu chăm sóc</Text>
                  <View style={styles.healthOptions}>
                    {[
                      { key: 'hair', label: '✨ Dưỡng lông mượt mà' },
                      { key: 'digestion', label: '🌿 Tiêu hóa, ngừa búi lông' },
                      { key: 'weight_gain', label: '🍖 Tăng cơ, phát triển thể trạng' },
                      { key: 'weight_loss', label: '🥗 Kiểm soát cân nặng' },
                      { key: 'bone', label: '🦴 Xương khớp linh hoạt' },
                    ].map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => setHealthNeed(item.key as HealthNeed)}
                        style={[
                          styles.healthItem,
                          healthNeed === item.key && styles.healthItemActive,
                        ]}>
                        <Text
                          style={[
                            styles.healthItemText,
                            healthNeed === item.key && styles.healthItemTextActive,
                          ]}>
                          {item.label}
                        </Text>
                        {healthNeed === item.key && <CheckIcon size={14} color="#0284C7" />}
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* ======================================================== */}
            {/* CỘT PHẢI: KẾT QUẢ GỢI Ý ĐỘNG (REALTIME RECOMMENDATIONS) */}
            {/* ======================================================== */}
            <View style={[styles.columnWrapper, isDesktop && styles.rightColumnDesktop]}>
              <View style={styles.resultCard}>
                {/* HEADER KẾT QUẢ */}
                <View style={styles.resultHeader}>
                  <View style={styles.resultBadgeRow}>
                    <Text style={styles.resultBadge}>⚡ KHẨU PHẦN ĐỀ XUẤT</Text>
                  </View>
                  <Text style={styles.resultTitle}>
                    Khẩu phần chuẩn: {petType === 'dog' ? 'Cún' : 'Mèo'} ({weightKg}kg)
                  </Text>
                </View>

                {/* 4 THÔNG SỐ DINH DƯỠNG CỐT LÕI */}
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statIcon}>⚡</Text>
                    <Text style={styles.statValue}>{rec.caloricNeed}</Text>
                    <Text style={styles.statUnit}>kcal / ngày</Text>
                    <Text style={styles.statLabel}>Năng lượng</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statIcon}>🥣</Text>
                    <Text style={styles.statValue}>{rec.dailyGrams}g</Text>
                    <Text style={styles.statUnit}>/ ngày</Text>
                    <Text style={styles.statLabel}>Thức ăn</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statIcon}>💧</Text>
                    <Text style={styles.statValue}>{rec.waterMl}ml</Text>
                    <Text style={styles.statUnit}>/ ngày</Text>
                    <Text style={styles.statLabel}>Nước uống</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statIcon}>🕒</Text>
                    <Text style={styles.statValue}>{rec.mealsPerDay}</Text>
                    <Text style={styles.statUnit}>cữ / ngày</Text>
                    <Text style={styles.statLabel}>~{rec.mealPortionGrams}g / cữ</Text>
                  </View>
                </View>

                {/* DANH SÁCH CÁC SẢN PHẨM GỢI Ý */}
                <View style={styles.recProductsSection}>
                  <View style={styles.recSectionHeader}>
                    <Text style={styles.recSectionTitle}>
                      🐾 Món ăn đề xuất ({rec.products.length} món)
                    </Text>
                  </View>

                  <View style={styles.productListStack}>
                    {rec.products.map((item) => (
                      <View key={item.id} style={styles.productItemCard}>
                        <View style={styles.productBadgeTopRow}>
                          <View style={styles.typeTag}>
                            <Text style={styles.typeTagText}>{item.badge}</Text>
                          </View>
                          <View style={styles.matchScoreTag}>
                            <Text style={styles.matchScoreText}>⭐ Phù hợp {item.matchScore}%</Text>
                          </View>
                        </View>

                        <View style={styles.productMainRow}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.productItemImg}
                            contentFit="cover"
                          />
                          <View style={styles.productItemDetails}>
                            <Text style={styles.productItemName} numberOfLines={2}>
                              {item.name}
                            </Text>
                            <View style={styles.priceRow}>
                              <Text style={styles.productItemPrice}>{item.price}</Text>
                              <Text style={styles.productItemWeight}>• {item.weight}</Text>
                            </View>
                            <Text style={styles.productItemReason} numberOfLines={2}>
                              ✨ {item.reason.split('.')[0] + '.'}
                            </Text>
                          </View>
                        </View>

                        {/* NÚT THAO TÁC CỦA TỪNG SẢN PHẨM */}
                        <View style={styles.productBtnRow}>
                          <Pressable
                            onPress={() =>
                              router.push({
                                pathname: '/detail',
                                params: { id: item.id },
                              } as any)
                            }
                            style={styles.itemDetailBtn}>
                            <Text style={styles.itemDetailBtnText}>Chi Tiết →</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => handleAddToCart(item)}
                            style={styles.itemAddToCartBtn}>
                            <Text style={styles.itemAddToCartBtnText}>🛒 Thêm Vào Giỏ</Text>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* HỘP LỜI KHUYÊN TỪ BÁC SĨ THÚ Y */}
                <View style={styles.vetAdviceBox}>
                  <View style={styles.vetAdviceHeader}>
                    <Text style={styles.vetIconBadge}>💡</Text>
                    <Text style={styles.vetTitle}>Lưu ý dinh dưỡng từ bác sĩ:</Text>
                  </View>
                  <Text style={styles.vetText}>• {rec.vetAdvice}</Text>
                  {rec.warningNote ? (
                    <Text style={[styles.vetText, { marginTop: 4, color: '#D97706' }]}>
                      • {rec.warningNote}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284C7',
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  floatingToast: {
    position: 'absolute',
    top: 60,
    zIndex: 99999,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  floatingToastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  liveStatusBar: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0284C7',
  },
  liveStatusText: {
    fontSize: 12.5,
    color: '#0369A1',
    flex: 1,
  },
  liveHighlight: {
    fontWeight: '700',
    color: '#0284C7',
  },
  mainLayout: {
    flexDirection: 'column',
    gap: 16,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  columnWrapper: {
    width: '100%',
    gap: 16,
  },
  leftColumnDesktop: {
    width: '42%',
    flex: 0.9,
  },
  rightColumnDesktop: {
    width: '58%',
    flex: 1.1,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 18,
    gap: 16,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  cardHeaderHint: {
    fontSize: 11,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  fieldSection: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectedInlineText: {
    color: '#0284C7',
    fontWeight: '600',
    fontSize: 12,
  },
  rowChoices: {
    flexDirection: 'row',
    gap: 8,
  },
  choiceButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    backgroundColor: '#F8FAFC',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  choiceButtonActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0284C7',
  },
  choiceText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0369A1',
  },
  choiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  choicePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  choicePillActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369A1',
    textAlign: 'center',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  weightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightValueDisplay: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  weightSelector: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  weightBadge: {
    flex: 1,
    minWidth: 46,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  weightBadgeActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  weightBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0369A1',
  },
  weightBadgeTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  healthOptions: {
    gap: 8,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  healthItemActive: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  healthItemText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
    fontWeight: '500',
  },
  healthItemTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 18,
    gap: 16,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  resultHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    gap: 4,
  },
  resultBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  autoUpdatedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoUpdatedBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#166534',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  resultSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statBox: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 15,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0284C7',
  },
  statUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369A1',
    marginTop: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  recProductsSection: {
    gap: 12,
  },
  recSectionHeader: {
    gap: 2,
  },
  recSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  recSectionSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  productListStack: {
    gap: 12,
  },
  productItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 10,
  },
  productBadgeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  matchScoreTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matchScoreText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
  },
  productMainRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productItemImg: {
    width: 78,
    height: 78,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  productItemDetails: {
    flex: 1,
    gap: 3,
  },
  productItemName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productItemPrice: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  productItemWeight: {
    fontSize: 11,
    color: '#64748B',
  },
  productItemReason: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
    marginTop: 2,
  },
  productBtnRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  itemDetailBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  itemDetailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  itemAddToCartBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  itemAddToCartBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vetAdviceBox: {
    backgroundColor: '#FEFCE8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF08A',
    padding: 14,
    gap: 6,
  },
  vetAdviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vetIconBadge: {
    fontSize: 16,
  },
  vetTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#854D0E',
  },
  vetText: {
    fontSize: 11.5,
    color: '#713F12',
    lineHeight: 17,
  },
  warningNoteRow: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FEF08A',
  },
  warningNoteText: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '600',
  },
});
