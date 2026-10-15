import { INITIAL_PRODUCTS_SEED } from '@/constants/initial-products-data';
import { getProducts, createAppointmentApi, registerCustomerApi } from '@/services/api';
import { useCart } from '@/context/cart-context';
import { useCategory } from '@/context/category-context';
import { useProduct } from '@/context/product-context';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

import {
  CartIcon,
  CheckCircleIcon,
  CloseIcon,
  SearchIcon,
  StarIcon,
  StethoscopeIcon,
  UserIcon,
} from '@/components/icons';
import HeroBanner from '@/components/hero-banner';

// ============================================================
// URL API MYSQL / PHP
// ============================================================
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost/petcare-api/get_products.php'
    : 'http://192.168.1.8/petcare-api/get_products.php';

// ============================================================
// HÌNH ẢNH BAO BÌ THỨC ĂN THỰC TẾ
// ============================================================
function getProductFoodImage(name: string, fallback?: string): string {
  // Ưu tiên tuyệt đối 100% hình ảnh do Admin cập nhật, tải lên hoặc từ CSDL
  if (fallback && fallback.trim()) {
    return fallback.trim();
  }
  const n = (name || '').toLowerCase();
  if (n.includes('churu') || n.includes('bánh thưởng') || n.includes('snack') || n.includes('thưởng')) {
    return 'http://localhost/petcare-api/uploads/ciao_churu.png';
  }
  if (n.includes('pate') || n.includes('whiskas') || n.includes('me-o') || n.includes('ướt') || n.includes('sốt')) {
    return 'http://localhost/petcare-api/uploads/whiskas_ocean_fish.png';
  }
  if (n.includes('xương') || n.includes('pedigree') || n.includes('gặm') || n.includes('dentastix')) {
    return 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=80';
  }
  if (n.includes('orijen') || n.includes('grain-free') || n.includes('cao cấp')) {
    return 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80';
  }
  if (n.includes('nourse') || n.includes('gel') || n.includes('vitamin') || n.includes('men')) {
    return 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80';
  }
  if (n.includes('cát') || n.includes('tofu') || n.includes('vệ sinh')) {
    return 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&auto=format&fit=crop&q=80';
  }
  if (n.includes('minino') || n.includes('cá ngừ')) {
    return 'http://localhost/petcare-api/uploads/minino_plus.png';
  }
  if (n.includes('royal') || n.includes('fit 32')) {
    return 'http://localhost/petcare-api/uploads/royal_canin_fit32.png';
  }
  return 'http://localhost/petcare-api/uploads/royal_canin_fit32.png';
}

// ============================================================
// INTERFACE PRODUCT
// ============================================================
export interface Product {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount?: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  soldCount: string;
}

// ============================================================
// DỮ LIỆU ĐỒ ĂN UỐNG THÚ CƯNG MẪU (CHỌN LỌC, ÍT CHỮ, THỰC TẾ)
// ============================================================
const DEFAULT_PRODUCTS: Product[] = INITIAL_PRODUCTS_SEED.map((p) => ({
  id: String(p.id),
  name: p.name,
  brand: p.brand,
  price: p.price,
  originalPrice: p.originalPrice,
  discount: p.discount || `-${p.discountPercent}%`,
  description: p.description,
  image: p.image,
  category: p.category_slug || p.category,
  rating: p.rating,
  soldCount: typeof p.soldCount === 'string' ? p.soldCount : `${p.soldCount} đã bán`,
}));

const FOOD_CATEGORIES = [
  { id: 'all', name: 'Tất cả món ngon', keyword: '' },
  { id: 'hat', name: 'Thức ăn hạt khô', keyword: 'hạt' },
  { id: 'pate', name: 'Pate & Soup ướt', keyword: 'pate' },
  { id: 'xuong', name: 'Bánh thưởng & Gặm', keyword: 'xương' },
  { id: 'caocap', name: 'Dinh dưỡng cao cấp', keyword: 'orijen' },
  { id: 'vesinh', name: 'Cát & Chăm sóc', keyword: 'cát' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const { activeCategories } = useCategory();
  const { products: rawProducts, loading: productLoading, refreshProducts } = useProduct();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AUTH STATE
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  // FORM ĐĂNG KÝ
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // PHẦN PHỤ: ĐẶT LỊCH THĂM KHÁM / TƯ VẤN NHANH
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingPetName, setBookingPetName] = useState('Miu Miu');
  const [bookingPhone, setBookingPhone] = useState('0982345678');
  const [bookingDate, setBookingDate] = useState('12/10/2026');
  const [bookingNote, setBookingNote] = useState('Nhờ bác sĩ tư vấn đổi hạt ngừa sỏi thận cho mèo');

  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  // TỰ ĐỘNG ĐỒNG BỘ 100% VỚI DỮ LIỆU ADMIN & CSDL
  const products: Product[] = React.useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) {
      return DEFAULT_PRODUCTS;
    }
    return rawProducts.map((item: any, idx: number) => {
      const rawName = item.name || `Sản phẩm #${item.id || idx + 1}`;
      const rawPrice = Number(item.price) || 120000;
      const rawOrig = Number(item.originalPrice || item.original_price) || Math.round(rawPrice * 1.18);
      const discountStr =
        item.discount ||
        (item.discountPercent ? `-${item.discountPercent}%` : item.discount_percent ? `-${item.discount_percent}%` : '-15%');
      const rawImg = item.image || '';

      const catSlug = (item.category_slug || item.category || '').toLowerCase();
      let normCat = catSlug;
      if (catSlug.includes('pate')) normCat = 'pate';
      else if (catSlug.includes('cát') || catSlug.includes('vesinh')) normCat = 'vesinh';
      else if (catSlug.includes('xương') || catSlug.includes('xuong')) normCat = 'xuong';
      else if (catSlug.includes('cao cấp') || catSlug.includes('caocap')) normCat = 'caocap';
      else if (catSlug.includes('y tế') || catSlug.includes('yte')) normCat = 'yte';
      else if (catSlug.includes('hạt') || catSlug.includes('hat')) normCat = 'hat';

      return {
        id: String(item.id || idx + 1),
        name: rawName,
        brand: item.brand || 'PetCare Food',
        price: rawPrice,
        originalPrice: rawOrig,
        discount: discountStr,
        description: item.description || 'Thức ăn dinh dưỡng thơm ngon giúp bé cưng mau lớn, khỏe mạnh.',
        image: getProductFoodImage(rawName, rawImg),
        category: normCat,
        rating: Number(item.rating) || 4.9,
        soldCount: typeof item.soldCount === 'string' ? item.soldCount : (item.soldCount ? `${item.soldCount} đã bán` : `${idx * 150 + 320} đã bán`),
      };
    });
  }, [rawProducts]);

  useFocusEffect(
    React.useCallback(() => {
      refreshProducts();
    }, [refreshProducts])
  );

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleFocus = () => {
        refreshProducts();
      };
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [refreshProducts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(
      {
        id: Number(product.id) || Date.now(),
        name: product.name,
        numericPrice: Number(product.price),
        weight: 'Tiêu chuẩn',
        image: product.image,
      },
      1
    );
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/detail?id=${product.id}`);
  };

  const handleLoginSubmit = () => {
    const u = authEmail.trim().toLowerCase();
    const p = authPassword.trim();
    if (!u || !p) {
      showToast('Vui lòng nhập tài khoản và mật khẩu');
      return;
    }
    if (u === 'admin' && p === '123') {
      setCurrentUser({ name: 'Quản Trị Viên', email: 'admin@petcare.vn' });
      setIsLoggedIn(true);
      setShowAuthModal(false);
      showToast('Đăng nhập Quản Trị Viên thành công!');
      router.push('/admin');
      return;
    }
    setCurrentUser({ name: u.includes('@') ? u.split('@')[0] : u, email: u });
    setIsLoggedIn(true);
    setShowAuthModal(false);
    showToast('Đăng nhập thành công!');
  };

  const handleRegisterSubmit = () => {
    const name = regName.trim();
    const phone = regPhone.trim();
    const email = regEmail.trim();
    const pass = regPassword.trim();
    const confirm = regConfirmPassword.trim();

    if (!name) {
      showToast('Vui lòng nhập họ và tên');
      return;
    }
    if (!phone) {
      showToast('Vui lòng nhập số điện thoại');
      return;
    }
    if (!email) {
      showToast('Vui lòng nhập email hoặc tên tài khoản');
      return;
    }
    if (!pass) {
      showToast('Vui lòng nhập mật khẩu');
      return;
    }
    if (pass.length < 3) {
      showToast('Mật khẩu cần tối thiểu 3 ký tự');
      return;
    }
    if (pass !== confirm) {
      showToast('Mật khẩu xác nhận không khớp!');
      return;
    }

    setCurrentUser({ name, email, phone });
    setIsLoggedIn(true);
    setShowAuthModal(false);
    showToast(`🎉 Đăng ký thành công! Chào mừng ${name}!`);
    registerCustomerApi({ name, phone, email }).catch((err) => console.warn(err));
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
  };

  const handleBookingSubmit = () => {
    if (!bookingPhone.trim()) {
      showToast('Vui lòng nhập số điện thoại');
      return;
    }
    createAppointmentApi({
      customerName: currentUser?.name || 'Khách hàng',
      customerPhone: bookingPhone.trim(),
      petName: bookingPetName.trim() || 'Bé cưng',
      petType: 'cat',
      issue: bookingNote.trim() || 'Tư vấn chế độ dinh dưỡng',
      date: bookingDate || '12/10/2026',
    }).catch((err) => console.warn(err));

    showToast(`🎉 Đã đặt lịch hẹn tư vấn cho ${bookingPetName}! Bác sĩ sẽ gọi lại sớm.`);
    setShowBookingModal(false);
  };

  // LỌC SẢN PHẨM (ĐỒNG BỘ ĐỘNG THEO DANH MỤC CỦA ADMIN)
  const filteredProducts = products.filter((p) => {
    let matchCat = true;
    if (selectedCategory !== 'all') {
      const targetCat = activeCategories.find(
        (c) => String(c.id) === selectedCategory || c.slug === selectedCategory
      );
      const targetSlug = targetCat?.slug || selectedCategory;
      const targetName = (targetCat?.name || '').toLowerCase();

      const pCat = (p.category || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();

      // Khớp theo category / slug
      const isDirect =
        p.category === targetSlug ||
        p.category === selectedCategory ||
        (p as any).category_slug === targetSlug ||
        (p as any).category_slug === selectedCategory;

      // Khớp theo từ khóa tên hoặc mô tả
      const isKw =
        (targetName && (pCat.includes(targetName) || pName.includes(targetName) || pDesc.includes(targetName))) ||
        (targetSlug !== 'all' && (pCat.includes(targetSlug) || pName.includes(targetSlug)));

      matchCat = isDirect || isKw;
    }

    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const brandStr = p.brand ? p.brand.toLowerCase() : '';
      matchSearch = p.name.toLowerCase().includes(q) || brandStr.includes(q);
    }
    return matchCat && matchSearch;
  });

  if (productLoading && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Đang tải đồ ăn ngon cho bé cưng...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* ============================================================ */}
      {/* 1. HEADER CHÍNH (TÔNG XANH NHẠT DỊU MẮT, THOÁNG MẮT) */}
      {/* ============================================================ */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          {/* LOGO SHOP */}
          <TouchableOpacity
            style={styles.logoRow}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 20 }}>🐾</Text>
            </View>
            <View>
              <Text style={styles.logoTitle}>PetCare</Text>
              <Text style={styles.logoSubtitle}>SHOP ĐỒ ĂN THÚ CƯNG</Text>
            </View>
          </TouchableOpacity>

          {/* THANH TÌM KIẾM ĐỒ ĂN */}
          <View style={styles.searchBar}>
            <SearchIcon size={16} color="#0284C7" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm hạt Royal Canin, Pate Whiskas, Snack gặm..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <CloseIcon size={14} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>

          {/* HEADER ACTIONS: [Đăng ký] -> [Giỏ hàng (dịch xuống)] -> [Admin (lùi về sau)] */}
          <View style={styles.headerActionRow}>
            {isLoggedIn && currentUser ? (
              <TouchableOpacity
                style={styles.userBadgePill}
                onPress={() => {
                  Alert.alert(
                    'Tài Khoản',
                    `Chào ${currentUser.name}!`,
                    [
                      { text: 'Đóng', style: 'cancel' },
                      {
                        text: 'Đăng xuất',
                        style: 'destructive',
                        onPress: () => {
                          setIsLoggedIn(false);
                          setCurrentUser(null);
                        },
                      },
                    ]
                  );
                }}
              >
                <UserIcon size={14} color="#0284C7" />
                <Text style={styles.userBadgeName}>{currentUser.name}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.authBtnSmall}
                onPress={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
              >
                <UserIcon size={14} color="#0284C7" />
                <Text style={styles.authBtnSmallText}>Đăng ký</Text>
              </TouchableOpacity>
            )}

            {/* NÚT GIỎ HÀNG: DỊCH XUỐNG MỘT CHÚT */}
            <TouchableOpacity
              style={styles.cartButtonSky}
              activeOpacity={0.85}
              onPress={() => router.push('/cart')}
            >
              <CartIcon size={18} color="#FFFFFF" />
              <Text style={styles.cartBtnText}>Giỏ hàng</Text>
              {totalItems > 0 && (
                <View style={styles.cartBadgeRed}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* NÚT ADMIN: LÙI VỀ SAU GIỎ HÀNG */}
            <TouchableOpacity
              style={styles.blogBtnSmall}
              onPress={() => router.push('/admin')}
            >
              <Text style={styles.blogBtnSmallText}>⚙️ Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <View style={styles.toastCard}>
          <CheckCircleIcon size={15} color="#0EA5E9" />
          <Text style={styles.toastCardText}>{toastMessage}</Text>
        </View>
      )}

      {/* ============================================================ */}
      {/* NỘI DUNG CHÍNH (TẬP TRUNG VÀO ĐỒ ĂN & BÁN HÀNG) */}
      {/* ============================================================ */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* ============================================================ */}
          {/* 3. HERO BANNER CHÍNH TO LỚN (1 CÁI DUY NHẤT)                */}
          {/* ============================================================ */}
          <HeroBanner
            onPress={() => {
              setSelectedCategory('all');
              if (typeof document !== 'undefined') {
                const el = document.getElementById('shop-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* ============================================================ */}
          {/* 4. THANH CHỌN DANH MỤC ĐỒ ĂN (ĐỒNG BỘ ĐỘNG THEO ADMIN & CSDL) */}
          {/* ============================================================ */}
          <View id="shop-section" style={styles.categoryTabsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryTabsScroll}
            >
              {/* Tab tất cả món ngon */}
              <TouchableOpacity
                style={[styles.categoryTab, selectedCategory === 'all' && styles.categoryTabActive]}
                onPress={() => setSelectedCategory('all')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    selectedCategory === 'all' && styles.categoryTabTextActive,
                  ]}
                >
                  🥣 Tất cả món ngon
                </Text>
              </TouchableOpacity>

              {/* Các danh mục động được quản lý bởi Admin */}
              {activeCategories.map((cat) => {
                const catKey = cat.slug || String(cat.id);
                const isActive = selectedCategory === catKey || selectedCategory === String(cat.id);
                return (
                  <TouchableOpacity
                    key={String(cat.id)}
                    style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                    onPress={() => setSelectedCategory(catKey)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoryTabText,
                        isActive && styles.categoryTabTextActive,
                      ]}
                    >
                      {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ============================================================ */}
          {/* 5. DANH SÁCH SẢN PHẨM (MỤC TIÊU CHÍNH: BÁN ĐỒ ĂN) */}
          {/* ĐÁP ỨNG ĐÚNG 100% ĐẶC TẢ ĐỀ TÀI:
              - Bên trái: Ảnh rõ nét, bo góc
              - Bên phải:
                + Dòng 1: Tên sản phẩm chữ đậm màu xanh (#0284C7)
                + Dòng tiếp theo: Mô tả súc tích
                + Dòng cuối: Giá sản phẩm chữ đỏ tô đậm (#DC2626) */}
          {/* ============================================================ */}
          <View style={styles.productsSection}>
            <View style={styles.productsHeaderRow}>
              <Text style={styles.productsSectionTitle}>
                Món Ngon Cho Thú Cưng ({filteredProducts.length} sản phẩm)
              </Text>
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchLink}>Xóa tìm kiếm</Text>
                </TouchableOpacity>
              )}
            </View>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={{ fontSize: 28 }}>🥣</Text>
                <Text style={styles.emptyTitle}>Chưa tìm thấy món ăn phù hợp</Text>
                <TouchableOpacity
                  style={styles.emptyResetBtn}
                  onPress={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.emptyResetBtnText}>Xem tất cả đồ ăn</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.productsGridTwoCol}>
                {filteredProducts.map((item) => (
                  <TouchableOpacity
                    key={String(item.id)}
                    style={styles.productCard}
                    activeOpacity={0.9}
                    onPress={() => handleProductPress(item)}
                  >
                    {/* BÊN TRÁI: ẢNH RÕ NÉT, BO GÓC */}
                    <View style={styles.imageColLeft}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.productThumb}
                        contentFit="cover"
                        transition={200}
                      />
                      {item.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountBadgeText}>{item.discount}</Text>
                        </View>
                      )}
                    </View>

                    {/* BÊN PHẢI:
                        - DÒNG 1: TÊN SẢN PHẨM CHỮ ĐẬM MÀU XANH
                        - DÒNG TIẾP THEO: MÔ TẢ SÚC TÍCH
                        - DÒNG CUỐI: GIÁ SẢN PHẨM CHỮ ĐỎ TÔ ĐẬM */}
                    <View style={styles.infoColRight}>
                      <View>
                        {/* BRAND VÀ SAO */}
                        <View style={styles.metaTopLine}>
                          <Text style={styles.brandNameText}>{item.brand}</Text>
                          <View style={styles.ratingInline}>
                            <StarIcon size={11} color="#F59E0B" />
                            <Text style={styles.ratingNumber}>{item.rating}</Text>
                          </View>
                        </View>

                        {/* DÒNG 1: TÊN SẢN PHẨM CHỮ ĐẬM MÀU XANH (XANH DƯƠNG RÕ NÉT) */}
                        <Text style={styles.productTitleBlue} numberOfLines={2}>
                          {item.name}
                        </Text>

                        {/* DÒNG TIẾP THEO: MÔ TẢ SÚC TÍCH (GỌN GÀNG, KHÔNG DÀI DÒNG) */}
                        <Text style={styles.productDescShort} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </View>

                      {/* DÒNG CUỐI: GIÁ CHỮ ĐỎ TÔ ĐẬM & NÚT THÊM GIỎ */}
                      <View style={styles.priceRowBottom}>
                        <View>
                          <Text style={styles.originalPriceText}>
                            {Number(item.originalPrice).toLocaleString('vi-VN')} ₫
                          </Text>
                          {/* GIÁ SẢN PHẨM CHỮ ĐỎ TÔ ĐẬM */}
                          <Text style={styles.priceRedBold}>
                            {Number(item.price).toLocaleString('vi-VN')} ₫
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.addCartBtnSky}
                          activeOpacity={0.8}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                        >
                          <CartIcon size={13} color="#0284C7" />
                          <Text style={styles.addCartBtnSkyText}>Thêm vào giỏ</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ============================================================ */}
          {/* 6. PHẦN PHỤ: THĂM KHÁM & TƯ VẤN BÁC SĨ (NHẸ NHÀNG, KHÔNG LẤN ÁT) */}
          {/* ============================================================ */}
          <TouchableOpacity
            style={styles.clinicSubBanner}
            activeOpacity={0.88}
            onPress={() => router.push('/advisor')}
          >
            <View style={styles.clinicSubIconWrap}>
              <StethoscopeIcon size={24} color="#0284C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.clinicSubTitle}>
                Cần tư vấn chọn thức ăn phù hợp cho bé cưng?
              </Text>
              <Text style={styles.clinicSubDesc}>
                Bác sĩ thú y PetCare hỗ trợ kiểm tra thể trạng và tư vấn khẩu phần dinh dưỡng miễn phí.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.clinicBookBtn}
              onPress={() => router.push('/advisor')}
            >
              <Text style={styles.clinicBookBtnText}>Tư Vấn ➔</Text>
            </TouchableOpacity>
          </TouchableOpacity>


          {/* ============================================================ */}
          {/* 7. PHẢN HỒI KHÁCH HÀNG (NGẮN GỌN, 3 ĐÁNH GIÁ THỰC TẾ) */}
          {/* ============================================================ */}
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsHeading}>Khách Hàng Nói Về Đồ Ăn PetCare</Text>
            <View style={styles.reviewsGrid}>
              <View style={styles.reviewCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={12} color="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.reviewText}>
                  "Hạt Royal Canin date mới tinh, bé mèo ăn ngon miệng và lông mượt hẳn ra. Giao hàng 2 tiếng là tới nơi rồi!"
                </Text>
                <Text style={styles.reviewAuthor}>— Chị Hoa (Nuôi bé Miu 4kg)</Text>
              </View>

              <View style={styles.reviewCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={12} color="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.reviewText}>
                  "Xương gặm Pedigree bé Lu cún nhà mình mê tít. Răng miệng sạch mùi hôi hẳn, giá cả lại rất phải chăng."
                </Text>
                <Text style={styles.reviewAuthor}>— Anh Minh (Nuôi bé Lu Corgi)</Text>
              </View>

              <View style={styles.reviewCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={12} color="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.reviewText}>
                  "Được bác sĩ tư vấn đổi qua hạt Minino cho bé đỡ nôn trớ, thấy cải thiện rất rõ rệt. Cửa hàng phục vụ rất tận tình!"
                </Text>
                <Text style={styles.reviewAuthor}>— Bạn Yến (Nuôi Poodle)</Text>
              </View>
            </View>
          </View>

          {/* ============================================================ */}
          {/* 8. FOOTER XANH NHẠT (GỌN GÀNG, THOÁNG MẮT, KHÔNG DÀI DÒNG) */}
          {/* ============================================================ */}
          <View style={styles.simpleFooter}>
            <View style={styles.footerRow}>
              <View style={{ flex: 1, minWidth: 200, gap: 4 }}>
                <Text style={styles.footerBrand}>PetCare - Thức Ăn Thú Cưng Chính Hãng</Text>
                <Text style={styles.footerText}>
                  Chuyên hạt dinh dưỡng, pate, bánh thưởng chất lượng cao cho chó mèo.
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 180, gap: 4 }}>
                <Text style={styles.footerHeading}>Liên hệ hỗ trợ</Text>
                <Text style={styles.footerText}>Hotline: 1900 6868 (08:00 - 21:00)</Text>
                <Text style={styles.footerText}>Cửa hàng: 120 Cầu Giấy, Hà Nội</Text>
              </View>
              <View style={{ flex: 1, minWidth: 160, gap: 4 }}>
                <Text style={styles.footerHeading}>Hệ thống</Text>
                <TouchableOpacity onPress={() => router.push('/admin')}>
                  <Text style={[styles.footerText, { color: '#0284C7', fontWeight: '700' }]}>⚙️ Trang Quản Trị (Admin)</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/advisor')}>
                  <Text style={[styles.footerText, { color: '#64748B' }]}>🩺 Tư Vấn Dinh Dưỡng</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>Giao hàng hỏa tốc 2 giờ</Text>
                <Text style={styles.footerText}>Đổi trả trong 7 ngày</Text>
              </View>
            </View>
            <View style={styles.footerBottomLine}>
              <Text style={styles.footerCopyright}>
                © 2026 PetCare. Bài tập lớn Lập trình di động React Native & Expo Router.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ============================================================ */}
      {/* MODAL ĐẶT LỊCH HẸN BÁC SĨ (ĐƠN GIẢN, GỌN NHẸ) */}
      {/* ============================================================ */}
      <Modal
        visible={showBookingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardSky}>
            <View style={styles.modalHeaderSky}>
              <Text style={styles.modalTitleSky}>Đặt Lịch Tư Vấn Dinh Dưỡng Thú Cưng</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16, gap: 10 }}>
              <Text style={styles.inputLabelSky}>Tên bé cưng:</Text>
              <TextInput
                style={styles.inputFieldSky}
                value={bookingPetName}
                onChangeText={setBookingPetName}
                placeholder="VD: Miu Miu, Cún Lu..."
              />

              <Text style={styles.inputLabelSky}>Số điện thoại của bạn:</Text>
              <TextInput
                style={styles.inputFieldSky}
                value={bookingPhone}
                onChangeText={setBookingPhone}
                keyboardType="phone-pad"
                placeholder="0982..."
              />

              <Text style={styles.inputLabelSky}>Ngày hẹn mong muốn:</Text>
              <TextInput
                style={styles.inputFieldSky}
                value={bookingDate}
                onChangeText={setBookingDate}
              />

              <Text style={styles.inputLabelSky}>Nội dung cần bác sĩ tư vấn:</Text>
              <TextInput
                style={[styles.inputFieldSky, { height: 60, textAlignVertical: 'top' }]}
                value={bookingNote}
                onChangeText={setBookingNote}
                multiline
              />

              <View style={styles.modalBtnRowSky}>
                <TouchableOpacity
                  style={styles.modalCancelBtnSky}
                  onPress={() => setShowBookingModal(false)}
                >
                  <Text style={styles.modalCancelBtnTextSky}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSubmitBtnSky}
                  onPress={handleBookingSubmit}
                >
                  <Text style={styles.modalSubmitBtnTextSky}>Gửi Đặt Lịch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL XÁC THỰC (2 GIAO DIỆN: ĐĂNG KÝ VÀ ĐĂNG NHẬP) */}
      {/* ============================================================ */}
      <Modal
        visible={showAuthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCardSky, { maxWidth: 420 }]}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeaderSky}>
              <Text style={styles.modalTitleSky}>
                {authMode === 'register' ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Tài Khoản'}
              </Text>
              <TouchableOpacity onPress={() => setShowAuthModal(false)}>
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* TAB CHUYỂN ĐỔI 2 GIAO DIỆN: ĐĂNG KÝ VÀ ĐĂNG NHẬP */}
            <View style={styles.authTabSwitchRow}>
              <TouchableOpacity
                style={[
                  styles.authTabSwitchBtn,
                  authMode === 'register' && styles.authTabSwitchBtnActive,
                ]}
                onPress={() => setAuthMode('register')}
              >
                <Text
                  style={[
                    styles.authTabSwitchText,
                    authMode === 'register' && styles.authTabSwitchTextActive,
                  ]}
                >
                  📝 Đăng Ký
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.authTabSwitchBtn,
                  authMode === 'login' && styles.authTabSwitchBtnActive,
                ]}
                onPress={() => setAuthMode('login')}
              >
                <Text
                  style={[
                    styles.authTabSwitchText,
                    authMode === 'login' && styles.authTabSwitchTextActive,
                  ]}
                >
                  🔑 Đăng Nhập
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 480 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
              {authMode === 'register' ? (
                /* GIAO DIỆN 1: ĐĂNG KÝ */
                <View style={{ gap: 10 }}>
                  <Text style={styles.authSubDesc}>
                    🎉 Tạo tài khoản PetCare để tích điểm và nhận ưu đãi độc quyền!
                  </Text>

                  <Text style={styles.inputLabelSky}>Họ và tên:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={regName}
                    onChangeText={setRegName}
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />

                  <Text style={styles.inputLabelSky}>Số điện thoại:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={regPhone}
                    onChangeText={setRegPhone}
                    placeholder="Ví dụ: 0912 345 678"
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.inputLabelSky}>Email / Tên tài khoản:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={regEmail}
                    onChangeText={setRegEmail}
                    placeholder="Ví dụ: petlover@gmail.com"
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabelSky}>Mật khẩu:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={regPassword}
                    onChangeText={setRegPassword}
                    placeholder="Tối thiểu 3 ký tự"
                    secureTextEntry
                  />

                  <Text style={styles.inputLabelSky}>Xác nhận mật khẩu:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={regConfirmPassword}
                    onChangeText={setRegConfirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={styles.authSubmitSky}
                    onPress={handleRegisterSubmit}
                  >
                    <Text style={styles.authSubmitSkyText}>✨ Đăng Ký Ngay</Text>
                  </TouchableOpacity>

                  <View style={styles.switchAuthRow}>
                    <Text style={styles.switchAuthText}>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => setAuthMode('login')}>
                      <Text style={styles.switchAuthLink}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* GIAO DIỆN 2: ĐĂNG NHẬP */
                <View style={{ gap: 10 }}>
                  <Text style={styles.authSubDesc}>
                    👋 Chào mừng bạn quay trở lại với PetCare Mart!
                  </Text>

                  <Text style={styles.inputLabelSky}>Tài khoản / Email:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={authEmail}
                    onChangeText={setAuthEmail}
                    placeholder="admin hoặc email..."
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabelSky}>Mật khẩu:</Text>
                  <TextInput
                    style={styles.inputFieldSky}
                    value={authPassword}
                    onChangeText={setAuthPassword}
                    placeholder="123"
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={styles.authSubmitSky}
                    onPress={handleLoginSubmit}
                  >
                    <Text style={styles.authSubmitSkyText}>🚀 Đăng Nhập</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setAuthEmail('admin');
                      setAuthPassword('123');
                    }}
                    style={styles.adminQuickFillCard}
                  >
                    <Text style={styles.adminQuickFillText}>
                      💡 Nhấn để tự điền Admin: <Text style={{ fontWeight: '800', color: '#0284C7' }}>admin</Text> | Mật khẩu: <Text style={{ fontWeight: '800', color: '#0284C7' }}>123</Text>
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.switchAuthRow}>
                    <Text style={styles.switchAuthText}>Chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => setAuthMode('register')}>
                      <Text style={styles.switchAuthLink}>Đăng ký tài khoản mới</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================
// STYLESHEET: MÀU XANH NHẠT CHỦ ĐẠO, GỌN GÀNG, THOÁNG MẮT
// ============================================================
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F9FF', // Xanh nhạt dịu mát
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  loadingText: {
    marginTop: 12,
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '600',
  },

  // 1. MAIN HEADER
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    zIndex: 100,
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)',
      },
    }),
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7', // Xanh dương
    letterSpacing: -0.2,
  },
  logoSubtitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0EA5E9',
    letterSpacing: 0.5,
  },
  searchBar: {
    flex: 1,
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#1E293B',
    padding: 0,
    outlineWidth: 0 as any,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userBadgeName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
    maxWidth: 90,
  },
  authBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  authBtnSmallText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  cartButtonSky: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0EA5E9', // Xanh nhạt chủ đạo
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    position: 'relative',
    marginTop: 6, // Giỏ hàng dịch xuống một chút theo yêu cầu
  },
  cartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cartBadgeRed: {
    backgroundColor: '#DC2626',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },

  // TOAST
  toastCard: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 9999,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  toastCardText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },

  // SCROLL BODY
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 1140,
    paddingHorizontal: 14,
    gap: 16,
  },

  // 3. HERO SKY BANNER
  heroSkyBanner: {
    backgroundColor: '#E0F2FE', // Nền xanh nhạt pastel
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 24,
    justifyContent: 'space-between',
  },
  heroBannerContent: {
    flex: 1,
    maxWidth: 580,
    gap: 8,
  },
  heroTagBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0369A1',
    lineHeight: 28,
  },
  heroSubHeading: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  heroOrderBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  heroOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  heroBannerImg: {
    width: 200,
    height: 140,
    borderRadius: 12,
  },

  // 4. DANH MỤC TABS
  categoryTabsWrapper: {
    marginTop: 4,
  },
  categoryTabsScroll: {
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  categoryTabActive: {
    backgroundColor: '#0EA5E9', // Xanh nhạt chủ đạo khi chọn
    borderColor: '#0EA5E9',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // 5. PRODUCTS SECTION
  productsSection: {
    gap: 12,
  },
  productsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  productsSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284C7',
  },
  clearSearchLink: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
  },
  productsGridTwoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // PRODUCT CARD CHUẨN ĐẶC TẢ ĐỀ TÀI:
  // - Bên trái: Ảnh rõ nét, bo góc
  // - Bên phải:
  //   + Dòng 1: Tên sản phẩm chữ đậm màu xanh (#0284C7)
  //   + Dòng tiếp theo: Mô tả súc tích
  //   + Dòng cuối: Giá sản phẩm chữ đỏ tô đậm (#DC2626)
  productCard: {
    flex: 1,
    minWidth: 320,
    maxWidth: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD', // Viền xanh nhạt
    shadowColor: '#BAE6FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      },
    }),
  },
  imageColLeft: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F9FF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  productThumb: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  infoColRight: {
    flex: 1,
    justifyContent: 'space-between',
  },
  metaTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  brandNameText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '700',
  },

  // DÒNG 1: TÊN SẢN PHẨM CHỮ ĐẬM MÀU XANH
  productTitleBlue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7', // Chữ đậm màu xanh theo đặc tả
    lineHeight: 19,
  },

  // DÒNG TIẾP THEO: MÔ TẢ SÚC TÍCH
  productDescShort: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },

  // DÒNG CUỐI: GIÁ CHỮ ĐỎ TÔ ĐẬM & NÚT THÊM GIỎ
  priceRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F9FF',
  },
  originalPriceText: {
    fontSize: 10.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  // GIÁ CHỮ ĐỎ TÔ ĐẬM
  priceRedBold: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626', // Chữ đỏ tô đậm theo đặc tả
  },
  addCartBtnSky: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addCartBtnSkyText: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '800',
  },

  // EMPTY
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyResetBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  emptyResetBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // 6. PHẦN PHỤ: THĂM KHÁM / TƯ VẤN (GỌN GÀNG, NHẸ NHÀNG)
  clinicSubBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  clinicSubIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicSubTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  clinicSubDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  clinicBookBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  clinicBookBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // 6.5. BLOG PREVIEW STYLES
  blogBtnSmall: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  blogBtnSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  blogPreviewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 18,
    gap: 14,
  },
  blogPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  blogPreviewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  blogPreviewSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  viewAllBlogBtn: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewAllBlogBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  blogCardRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  blogMiniCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  blogMiniThumb: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0F2FE',
  },
  blogMiniBody: {
    padding: 12,
    gap: 4,
  },
  blogMiniCat: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  blogMiniTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  blogMiniDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  // 7. PHẢN HỒI KHÁCH HÀNG
  reviewsSection: {
    gap: 10,
  },
  reviewsHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0284C7',
  },
  reviewsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reviewCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 4,
  },
  reviewText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  reviewAuthor: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },

  // 8. FOOTER XANH NHẠT GỌN GÀNG
  simpleFooter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 14,
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  footerBrand: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
  },
  footerHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  footerBottomLine: {
    borderTopWidth: 1,
    borderTopColor: '#F0F9FF',
    paddingTop: 10,
  },
  footerCopyright: {
    fontSize: 10.5,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // MODAL STYLES (XANH NHẠT GỌN GÀNG)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 132, 199, 0.25)', // Xanh nhạt mờ mờ dịu mắt
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCardSky: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 440,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  modalHeaderSky: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
    backgroundColor: '#F0F9FF',
  },
  modalTitleSky: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0284C7',
  },
  inputLabelSky: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  inputFieldSky: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12.5,
    color: '#1E293B',
  },
  modalBtnRowSky: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  modalCancelBtnSky: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  modalCancelBtnTextSky: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modalSubmitBtnSky: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#0EA5E9',
  },
  modalSubmitBtnTextSky: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  authSubmitSky: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  authSubmitSkyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  authTabSwitchRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
    backgroundColor: '#F8FAFC',
  },
  authTabSwitchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  authTabSwitchBtnActive: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#0EA5E9',
  },
  authTabSwitchText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  authTabSwitchTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  authSubDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 2,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  switchAuthText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  switchAuthLink: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  adminQuickFillCard: {
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 2,
  },
  adminQuickFillText: {
    fontSize: 11,
    color: '#0369A1',
    textAlign: 'center',
  },
});