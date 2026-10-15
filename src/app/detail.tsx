import {
  FullProductDetail,
  getProductFullDetails,
} from '@/constants/product-detail-data';
import { useCart } from '@/context/cart-context';
import { useProduct } from '@/context/product-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  CartIcon,
  CheckCircleIcon,
  CloseIcon,
  StarIcon,
} from '@/components/icons';
import { BASE_URL } from '@/services/api';

const API_DETAIL_URL = `${BASE_URL}/get_product_detail.php`;

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { addToCart, totalItems } = useCart();

  const isDesktop = width >= 768;
  const { getProductById } = useProduct();

  const [product, setProduct] = useState<FullProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [selectedScentIndex, setSelectedScentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'nutrition' | 'reviews'>('info');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  useEffect(() => {
    if (!id) return;

    // 1. Ưu tiên dữ liệu từ Context dùng chung (đã được Admin chỉnh sửa thời gian thực)
    const localShared = getProductById(String(id));
    if (localShared) {
      setProduct(getProductFullDetails(String(id), localShared));
      setLoading(false);
      return;
    }

    // 2. Dự phòng nạp từ API
    fetch(`${API_DETAIL_URL}?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const rawG = json.data.gallery_images || json.data.galleryImages;
          let safeGal: string[] = [];
          if (Array.isArray(rawG)) safeGal = rawG.filter(Boolean);
          else if (typeof rawG === 'string' && rawG.trim()) {
            try {
              const parsed = JSON.parse(rawG.trim());
              safeGal = Array.isArray(parsed) ? parsed.filter(Boolean) : [rawG.trim()];
            } catch {
              if (rawG.includes(',')) {
                safeGal = rawG.split(',').map((s: string) => s.trim()).filter(Boolean);
              } else {
                safeGal = [rawG.trim()];
              }
            }
          }
          const apiItem = {
            ...json.data,
            galleryImages: safeGal,
          };
          setProduct(getProductFullDetails(String(id), apiItem));
        } else {
          setProduct(getProductFullDetails(String(id)));
        }
      })
      .catch(() => {
        setProduct(getProductFullDetails(String(id)));
      })
      .finally(() => setLoading(false));
  }, [id, getProductById]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F172A" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundTitle}>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.push('/')}>
          <Text style={styles.backHomeBtnText}>Quay lại cửa hàng</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const safeImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ url: (product as any).image || '', caption: product.name, tag: 'Bao bì' as const }];
  const currentImage = safeImages[selectedImageIndex] || safeImages[0];
  const safeWeights = Array.isArray(product.weightOptions) && product.weightOptions.length > 0 ? product.weightOptions : [{ weight: 'Tiêu chuẩn', price: Number(product.price) || 0, originalPrice: Number(product.originalPrice) || 0 }];
  const currentWeightOption = safeWeights[selectedWeightIndex] || safeWeights[0];
  const currentPrice = currentWeightOption.price;
  const currentOriginalPrice = currentWeightOption.originalPrice;
  const totalPrice = currentPrice * quantity;

  const isLitter =
    product.productType === 'litter' ||
    (product.category && product.category.toLowerCase().includes('cát')) ||
    (product.name && product.name.toLowerCase().includes('cát'));

  const safeScents = Array.isArray(product.scents) ? product.scents : [];
  const selectedScent =
    safeScents.length > 0
      ? safeScents[selectedScentIndex] || safeScents[0]
      : undefined;

  const itemFullName = selectedScent
    ? `${product.name} [${selectedScent}] - ${currentWeightOption.weight}`
    : `${product.name} (${currentWeightOption.weight})`;

  const handleAddToCart = () => {
    addToCart(
      {
        id: Number(product.id),
        name: itemFullName,
        price: currentPrice,
        numericPrice: currentPrice,
        image: currentImage.url,
        category: product.category,
        weight: currentWeightOption.weight,
      } as any,
      quantity
    );
    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleShare = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('Đã sao chép liên kết sản phẩm!');
  };

  const handleCopyCoupon = (code: string) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCoupon(code);
    showToast(`Đã lưu mã giảm giá: ${code}`);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toastCard}>
          <CheckCircleIcon size={14} color="#059669" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.headerBtnIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBrand}>{product.brand}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {product.name}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerCartBtn}
            onPress={() => router.push('/cart')}
            activeOpacity={0.8}
          >
            <CartIcon size={18} color="#0284C7" />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* RESPONSIVE TOP SECTION */}
        <View style={styles.topSection}>
          {/* LEFT: IMAGE GALLERY (Gọn gàng, sạch sẽ) */}
          <View style={styles.leftCol}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: currentImage.url }}
                style={styles.mainImage}
                contentFit="cover"
                transition={200}
              />
              {product.discountPercent > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>-{product.discountPercent}%</Text>
                </View>
              )}

              {/* Floating Quick Action Buttons */}
              <View style={styles.floatingActions}>
                <TouchableOpacity
                  style={styles.floatingActionBtn}
                  onPress={() => {
                    setIsLiked(!isLiked);
                    showToast(!isLiked ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 14 }}>{isLiked ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.floatingActionBtn}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 13 }}>🔗</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Thumbnails */}
            {safeImages.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailList}
              >
                {safeImages.map((img, idx) => {
                  const isSelected = idx === selectedImageIndex;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.thumbnailWrap, isSelected && styles.thumbnailWrapActive]}
                      onPress={() => setSelectedImageIndex(idx)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: img.url }} style={styles.thumbnailImg} contentFit="cover" />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* RIGHT: THÔNG TIN SẢN PHẨM & CỤM CHỐT ĐƠN */}
          <View style={styles.rightCol}>
            {/* THƯƠNG HIỆU & MÃ SKU NHẸ NHÀNG */}
            <View style={styles.brandRow}>
              <View style={styles.brandPill}>
                <Text style={styles.brandPillText}>{product.brand}</Text>
              </View>
              {product.sku ? <Text style={styles.skuText}>Mã: {product.sku}</Text> : null}
            </View>

            {/* TÊN SẢN PHẨM (MÀU ĐEN THAN SANG TRỌNG) */}
            <Text style={styles.productTitle}>{product.name}</Text>

            {/* SOCIAL PROOF (ĐÁNH GIÁ, ĐÃ BÁN, CÒN HÀNG) */}
            <View style={styles.socialProofRow}>
              <View style={styles.ratingBadge}>
                <StarIcon size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Text style={styles.reviewCountText}>({product.reviewCount} đánh giá)</Text>
              </View>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.soldText}>
                {product.isNewlyLaunched ? 'Vừa mở bán: ' : 'Đã bán: '}
                <Text style={styles.soldNumber}>
                  {product.salesCountNote || product.soldCount}
                </Text>
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <View style={styles.stockBadge}>
                <View style={styles.stockDot} />
                <Text style={styles.stockText}>Sẵn hàng</Text>
              </View>
            </View>

            {/* CÁC TAG ĐẶC TRƯNG (CHỈ HIỂN THỊ ĐÚNG THEO SẢN PHẨM) */}
            {Array.isArray(product.highlightTags) && product.highlightTags.length > 0 && (
              <View style={styles.tagsRow}>
                {product.highlightTags.map((tag, idx) => (
                  <View key={idx} style={styles.tagBadge}>
                    <Text style={styles.tagText}>✓ {tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* KHỐI GIÁ BÁN NỔI BẬT (PRICE ANCHOR) */}
            <View style={styles.priceContainer}>
              <View style={styles.priceMainRow}>
                <Text style={styles.currentPrice}>
                  {currentPrice.toLocaleString('vi-VN')} <Text style={styles.currencySymbol}>₫</Text>
                </Text>
                {currentOriginalPrice > currentPrice && (
                  <Text style={styles.originalPrice}>
                    {currentOriginalPrice.toLocaleString('vi-VN')} ₫
                  </Text>
                )}
                {currentOriginalPrice > currentPrice && (
                  <View style={styles.discountTag}>
                    <Text style={styles.discountTagText}>
                      -
                      {product.discountPercent ||
                        Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}
                      %
                    </Text>
                  </View>
                )}
              </View>
              {currentOriginalPrice > currentPrice && (
                <Text style={styles.savingNote}>
                  Tiết kiệm: {(currentOriginalPrice - currentPrice).toLocaleString('vi-VN')} ₫ khi mua hôm nay
                </Text>
              )}
            </View>

            {/* THANH ƯU ĐÃI & VOUCHER GỌN GÀNG (1 DÒNG DUY NHẤT) */}
            <View style={styles.dealBar}>
              <View style={styles.dealBarLeft}>
                <Text style={styles.dealIcon}>🎟️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dealTitle}>Ưu đãi đơn hàng:</Text>
                  <Text style={styles.dealSub}>Voucher đến 160k • Mã FS20K, FS30K</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.dealActionBtn}
                onPress={() => setShowPromoModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dealActionText}>Xem ưu đãi ›</Text>
              </TouchableOpacity>
            </View>

            {/* BỘ CHỌN MÙI HƯƠNG (NẾU CÓ - VÍ DỤ CÁT MOONCAT) */}
            {safeScents.length > 0 && (
              <View style={styles.variantGroup}>
                <View style={styles.variantHeader}>
                  <Text style={styles.variantLabel}>Mùi hương:</Text>
                  <Text style={styles.variantSelectedValue}>
                    {safeScents[selectedScentIndex] || safeScents[0]}
                  </Text>
                </View>
                <View style={styles.variantsGrid}>
                  {safeScents.map((scent, sIdx) => {
                    const isSelected = sIdx === selectedScentIndex;
                    let icon = '🌿';
                    if (typeof scent === 'string') {
                      if (scent.toLowerCase().includes('táo')) icon = '🍏';
                      else if (scent.toLowerCase().includes('phấn')) icon = '🌸';
                      else if (scent.toLowerCase().includes('cafe')) icon = '☕';
                      else if (scent.toLowerCase().includes('chanh')) icon = '🍋';
                    }

                    return (
                      <TouchableOpacity
                        key={sIdx}
                        style={[styles.scentBtn, isSelected && styles.scentBtnActive]}
                        onPress={() => setSelectedScentIndex(sIdx)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.scentBtnIcon}>{icon}</Text>
                        <Text style={[styles.scentBtnText, isSelected && styles.scentBtnTextActive]}>
                          {scent}
                        </Text>
                        {isSelected && <Text style={styles.scentCheck}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* QUY CÁCH / TRỌNG LƯỢNG */}
            <View style={styles.variantGroup}>
              <View style={styles.variantHeader}>
                <Text style={styles.variantLabel}>Quy cách đóng gói:</Text>
                <Text style={styles.variantSelectedValue}>
                  {(currentWeightOption as any).label || currentWeightOption.weight}
                </Text>
              </View>
              <View style={styles.variantsGrid}>
                {safeWeights.map((opt: any, index: number) => {
                  const isSelected = index === selectedWeightIndex;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.weightBtn, isSelected && styles.weightBtnActive]}
                      onPress={() => setSelectedWeightIndex(index)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.weightBtnLabel, isSelected && styles.weightBtnLabelActive]}>
                        {opt.label || opt.weight}
                      </Text>
                      <Text style={[styles.weightBtnPrice, isSelected && styles.weightBtnPriceActive]}>
                        {Number(opt.price || 0).toLocaleString('vi-VN')} ₫
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* BỘ ĐẾM SỐ LƯỢNG */}
            <View style={styles.quantityRow}>
              <Text style={styles.variantLabel}>Số lượng:</Text>
              <View style={styles.stepperWrap}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnSymbol}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValueText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setQuantity((q) => Math.min(20, q + 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnSymbol}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CỤM NÚT MUA HÀNG TRỌNG TÂM (CALL TO ACTION - KÍCH THÍCH CHUYỂN ĐỔI) */}
            <View style={styles.ctaButtonRow}>
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={handleAddToCart}
                activeOpacity={0.85}
              >
                <CartIcon size={18} color="#0284C7" />
                <Text style={styles.addToCartBtnText}>Thêm vào giỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buyNowPrimaryBtn}
                onPress={handleBuyNow}
                activeOpacity={0.85}
              >
                <Text style={styles.buyNowPrimaryBtnText}>MUA NGAY</Text>
              </TouchableOpacity>
            </View>

            {/* BẢO CHỨNG NIỀM TIN (TRUST BADGES) NGAY DƯỚI NÚT MUA HÀNG */}
            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>⚡</Text>
                <Text style={styles.trustText}>Giao 24h</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>🛡️</Text>
                <Text style={styles.trustText}>100% Chính hãng</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>🔄</Text>
                <Text style={styles.trustText}>Đổi trả 30 ngày</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>💳</Text>
                <Text style={styles.trustText}>Kiểm hàng khi nhận</Text>
              </View>
            </View>
          </View>
        </View>

        {/* THÔNG TIN CHI TIẾT SẢN PHẨM (TABS THIẾT KẾ MẠCH LẠC, THOÁNG MẮT) */}
        <View style={styles.detailsCard}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'info' && styles.tabItemActive]}
              onPress={() => setActiveTab('info')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
                Đặc điểm nổi bật
              </Text>
            </TouchableOpacity>

            {!isLitter && (
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'nutrition' && styles.tabItemActive]}
                onPress={() => setActiveTab('nutrition')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'nutrition' && styles.tabTextActive]}>
                  Thành phần dinh dưỡng
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'reviews' && styles.tabItemActive]}
              onPress={() => setActiveTab('reviews')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
                Đánh giá khách hàng ({product.reviewCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* NỘI DUNG TAB 1: ĐẶC ĐIỂM NỔI BẬT */}
          {activeTab === 'info' && (
            <View style={styles.tabContent}>
              {isLitter ? (
                /* GIAO DIỆN CÁT VỆ SINH MOONCAT SẠCH SẼ, CHUYÊN NGHIỆP */
                <View style={styles.cleanDetailWrap}>
                  {/* GIỚI THIỆU */}
                  <View style={styles.cleanCard}>
                    <Text style={styles.cardSectionTitle}>Giới thiệu sản phẩm</Text>
                    <Text style={styles.cardParagraph}>
                      Cát Nhật Đen là dòng sản phẩm cao cấp nhưng giá thành rất bình dân, an toàn, xóa tan nỗi ám ảnh khi dọn dẹp chất thải cho mèo cưng với hương thơm tự nhiên dễ chịu.
                    </Text>
                  </View>

                  {/* CÔNG DỤNG & TÍNH NĂNG NỔI BẬT */}
                  <View style={styles.cleanCard}>
                    <Text style={styles.cardSectionTitle}>Công dụng & Tính năng vượt trội</Text>
                    <View style={styles.featureGrid}>
                      <View style={styles.featureItemBox}>
                        <Text style={styles.featureItemTitle}>✨ Khử mùi cực tốt</Text>
                        <Text style={styles.featureItemDesc}>
                          Hạt cát khóa ẩm tức thì, khử sạch mùi amoniac khó chịu, giữ không gian phòng luôn thơm mát.
                        </Text>
                      </View>

                      <View style={styles.featureItemBox}>
                        <Text style={styles.featureItemTitle}>⚡ Vón cục nhanh & cứng</Text>
                        <Text style={styles.featureItemDesc}>
                          Vón thành khối rắn chắc chỉ trong 3 giây, không bị vỡ vụn khi dùng xẻng xúc, tiết kiệm tối đa lượng cát.
                        </Text>
                      </View>

                      <View style={styles.featureItemBox}>
                        <Text style={styles.featureItemTitle}>🛡️ Siêu ít bụi</Text>
                        <Text style={styles.featureItemDesc}>
                          Quy trình lọc bụi đa tầng hiện đại, an toàn tuyệt đối cho hệ hô hấp của sen và boss.
                        </Text>
                      </View>

                      <View style={styles.featureItemBox}>
                        <Text style={styles.featureItemTitle}>🌸 Hương thơm nhẹ dịu</Text>
                        <Text style={styles.featureItemDesc}>
                          Đa dạng 4 mùi hương dễ chịu (Táo, Phấn, Cafe, Chanh) giúp phòng luôn thoang thoảng mùi thơm thư giãn.
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* HƯỚNG DẪN SỬ DỤNG CHUẨN */}
                  <View style={styles.cleanCard}>
                    <Text style={styles.cardSectionTitle}>Hướng dẫn sử dụng hiệu quả</Text>
                    <View style={styles.stepsList}>
                      <View style={styles.stepRow}>
                        <View style={styles.stepNumWrap}>
                          <Text style={styles.stepNum}>1</Text>
                        </View>
                        <Text style={styles.stepContentText}>
                          Đổ cát vào khay vệ sinh với độ dày tiêu chuẩn khoảng 5 – 6 cm.
                        </Text>
                      </View>

                      <View style={styles.stepRow}>
                        <View style={styles.stepNumWrap}>
                          <Text style={styles.stepNum}>2</Text>
                        </View>
                        <Text style={styles.stepContentText}>
                          Dùng xẻng dọn phần cát đã vón cục cho vào thùng rác hằng ngày.
                        </Text>
                      </View>

                      <View style={styles.stepRow}>
                        <View style={styles.stepNumWrap}>
                          <Text style={styles.stepNum}>3</Text>
                        </View>
                        <Text style={styles.stepContentText}>
                          Bổ sung thêm cát mới để duy trì độ dày 5 – 6 cm giúp cát luôn vón cục tốt nhất.
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ĐỐI TƯỢNG SỬ DỤNG */}
                  <View style={styles.cleanCard}>
                    <Text style={styles.cardSectionTitle}>Đối tượng sử dụng</Text>
                    <Text style={styles.cardParagraph}>
                      Sản phẩm an toàn và phù hợp cho tất cả các bé mèo (từ mèo con đến mèo trưởng thành).
                    </Text>
                  </View>

                  {/* CAM KẾT VŨ TRỤ THÚ CƯNG */}
                  <View style={styles.storeGuaranteeCard}>
                    <Text style={styles.storeGuaranteeTitle}>🏢 Cam kết từ Vũ Trụ Thú Cưng</Text>
                    <Text style={styles.storeGuaranteeSub}>
                      Nơi chia sẻ niềm vui nuôi thú cưng đến mọi nhà, luôn cam kết sản phẩm chất lượng cao với giá tốt nhất:
                    </Text>
                    <View style={styles.guaranteePointsList}>
                      <Text style={styles.guaranteePoint}>✓ Hàng thật 100% đúng mô tả và hình ảnh.</Text>
                      <Text style={styles.guaranteePoint}>✓ 100% hàng chính hãng nhập khẩu nguyên bao.</Text>
                      <Text style={styles.guaranteePoint}>✓ Đổi trả miễn phí tận nhà trong 30 ngày nếu phát sinh lỗi từ nhà sản xuất.</Text>
                    </View>
                  </View>
                </View>
              ) : (
                /* GIAO DIỆN THỨC ĂN KHÔ / BÁNH THƯỞNG / PATE */
                <View style={styles.cleanDetailWrap}>
                  <View style={styles.cleanCard}>
                    <Text style={styles.cardSectionTitle}>Mô tả sản phẩm</Text>
                    <Text style={styles.cardParagraph}>{product.description}</Text>
                  </View>

                  <View style={styles.cleanCard}>
                    <Text style={styles.cardSectionTitle}>Điểm nổi bật</Text>
                    <View style={styles.foodPointsGrid}>
                      <View style={styles.foodPointBox}>
                        <Text style={styles.foodPointLabel}>Nguồn đạm chính</Text>
                        <Text style={styles.foodPointValue}>
                          {product.whatMadeOf?.proteinSources?.join(', ') || 'Thịt tươi tự nhiên'}
                        </Text>
                      </View>
                      <View style={styles.foodPointBox}>
                        <Text style={styles.foodPointLabel}>Đối tượng phù hợp</Text>
                        <Text style={styles.foodPointValue}>
                          {product.suitability?.stages?.join(', ')} • {product.suitability?.suggestedWeight}
                        </Text>
                      </View>
                      <View style={styles.foodPointBox}>
                        <Text style={styles.foodPointLabel}>Lợi ích sức khỏe</Text>
                        <Text style={styles.foodPointValue}>
                          {product.suitability?.goals?.join(', ')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* NỘI DUNG TAB 2: THÀNH PHẦN DINH DƯỠNG */}
          {activeTab === 'nutrition' && !isLitter && (
            <View style={styles.tabContent}>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Đạm thô (Protein)</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.crudeProtein}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Chất béo (Fat)</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.crudeFat}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Chất xơ (Fiber)</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.crudeFiber}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Năng lượng (Calo)</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.caloriesKcal}</Text>
                </View>
              </View>
            </View>
          )}

          {/* NỘI DUNG TAB 3: ĐÁNH GIÁ KHÁCH HÀNG */}
          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              <View style={styles.reviewsWrap}>
                {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                  product.reviews.slice(0, 3).map((rev) => (
                    <View key={rev.id} style={styles.cleanReviewCard}>
                      <View style={styles.reviewHeaderRow}>
                        <Text style={styles.reviewAuthor}>{rev.userName}</Text>
                        <Text style={styles.reviewDate}>{rev.date}</Text>
                      </View>
                      {rev.weightBought ? (
                        <View style={styles.verifiedBadgeRow}>
                          <Text style={styles.verifiedText}>✓ Đã mua hàng: {rev.weightBought}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.reviewComment}>{rev.comment}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: '#64748B', fontSize: 13, fontStyle: 'italic', paddingVertical: 12 }}>
                    Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={{ height: isDesktop ? 40 : 100 }} />
      </ScrollView>

      {/* MODAL CHI TIẾT VOUCHER & MÃ GIẢM GIÁ (POPUP GỌN GÀNG, KHÔNG LÀM RỐI TRANG CHÍNH) */}
      <Modal
        visible={showPromoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎁 Ưu Đãi Đơn Hàng</Text>
              <TouchableOpacity
                onPress={() => setShowPromoModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {/* Vouchers theo giá trị đơn */}
              <Text style={styles.modalSectionLabel}>Voucher giảm giá tự động:</Text>
              <View style={styles.voucherListWrap}>
                <View style={styles.voucherCardItem}>
                  <Text style={styles.voucherAmount}>Giảm 15.000 ₫</Text>
                  <Text style={styles.voucherCondition}>Áp dụng cho đơn từ 300k</Text>
                </View>
                <View style={styles.voucherCardItem}>
                  <Text style={styles.voucherAmount}>Giảm 30.000 ₫</Text>
                  <Text style={styles.voucherCondition}>Áp dụng cho đơn từ 500k</Text>
                </View>
                <View style={styles.voucherCardItem}>
                  <Text style={styles.voucherAmount}>Giảm 80.000 ₫</Text>
                  <Text style={styles.voucherCondition}>Áp dụng cho đơn từ 1.000k</Text>
                </View>
                <View style={styles.voucherCardItem}>
                  <Text style={styles.voucherAmount}>Giảm 160.000 ₫</Text>
                  <Text style={styles.voucherCondition}>Áp dụng cho đơn từ 2.000k</Text>
                </View>
              </View>

              {/* Mã giảm giá áp dụng */}
              <Text style={[styles.modalSectionLabel, { marginTop: 14 }]}>Mã Freeship & Khuyến mãi:</Text>
              <View style={styles.couponListWrap}>
                {['FS20K', 'FS30K'].map((code) => {
                  const isCopied = copiedCoupon === code;
                  return (
                    <View key={code} style={styles.couponRowItem}>
                      <View>
                        <Text style={styles.couponCodeName}>{code}</Text>
                        <Text style={styles.couponCodeDesc}>Giảm phí vận chuyển đơn hàng</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.copyBtn, isCopied && styles.copyBtnActive]}
                        onPress={() => handleCopyCoupon(code)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.copyBtnText, isCopied && styles.copyBtnTextActive]}>
                          {isCopied ? 'Đã lưu' : 'Lưu mã'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setShowPromoModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDoneBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* STICKY BOTTOM BAR (CHỈ HIỂN THỊ TRÊN MOBILE ĐỂ KHÔNG BỊ TRÙNG LẶP NÚT TRÊN DESKTOP) */}
      {!isDesktop && (
        <View style={styles.bottomBarMobile}>
          <View style={styles.bottomPriceCol}>
            <Text style={styles.bottomPriceLabel}>Tổng thanh toán:</Text>
            <Text style={styles.bottomPriceValue}>
              {totalPrice.toLocaleString('vi-VN')} <Text style={styles.bottomCurrency}>₫</Text>
            </Text>
          </View>

          <View style={styles.bottomActionButtons}>
            <TouchableOpacity
              style={styles.mobileAddCartBtn}
              onPress={handleAddToCart}
              activeOpacity={0.85}
            >
              <CartIcon size={16} color="#0284C7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mobileBuyNowBtn}
              onPress={handleBuyNow}
              activeOpacity={0.85}
            >
              <Text style={styles.mobileBuyNowBtnText}>MUA NGAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // NỀN TRẮNG TINH TẾ, SẠCH SẼ
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  backHomeBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  /* TOAST NOTIFICATION */
  toastCard: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 16 : 45,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  headerBtnIcon: {
    fontSize: 22,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: -2,
  },
  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#0284C7',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  /* CONTENT SCROLL */
  contentScroll: {
    flex: 1,
  },
  contentInner: {
    maxWidth: 1040,
    width: '100%',
    alignSelf: 'center',
    padding: 16,
    gap: 20,
  },

  /* TOP SECTION (2 COLUMNS) */
  topSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  leftCol: {
    flex: 1,
    minWidth: 320,
    gap: 12,
  },
  rightCol: {
    flex: 1.3,
    minWidth: 340,
    gap: 12,
  },

  /* IMAGE CONTAINER */
  imageContainer: {
    width: '100%',
    height: 340,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 2,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  floatingActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    gap: 8,
  },
  floatingActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },

  thumbnailList: {
    gap: 8,
  },
  thumbnailWrap: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
  },
  thumbnailWrapActive: {
    borderColor: '#0284C7',
    borderWidth: 2,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },

  /* BRAND & SKU ROW */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandPill: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  brandPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  skuText: {
    fontSize: 11,
    color: '#64748B',
  },

  /* TÊN SẢN PHẨM: XANH DƯƠNG CHỦ ĐẠO GIỐNG WEB CHÍNH */
  productTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0284C7',
    lineHeight: 27,
  },

  /* SOCIAL PROOF ROW */
  socialProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  reviewCountText: {
    fontSize: 12,
    color: '#64748B',
  },
  dotSeparator: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  soldText: {
    fontSize: 12,
    color: '#64748B',
  },
  soldNumber: {
    fontWeight: '800',
    color: '#0F172A',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  stockText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },

  /* TAGS ĐẶC TRƯNG */
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },

  /* KHỐI GIÁ BÁN (THE PRICE ANCHOR) */
  priceContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 3,
  },
  priceMainRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0284C7', // XANH DƯƠNG CHỦ ĐẠO HÀI HOÀ, DỄ NHÌN
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284C7',
  },
  originalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountTag: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountTagText: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '800',
  },
  savingNote: {
    fontSize: 11.5,
    color: '#0369A1',
    fontWeight: '700',
  },

  /* THANH ƯU ĐÃI GỌN GÀNG (1 DÒNG DUY NHẤT) */
  dealBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dealBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dealIcon: {
    fontSize: 16,
  },
  dealTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  dealSub: {
    fontSize: 11,
    color: '#0284C7',
  },
  dealActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dealActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },

  /* BIẾN THỂ (MÙI HƯƠNG / QUY CÁCH) */
  variantGroup: {
    gap: 6,
  },
  variantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  variantLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  variantSelectedValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  variantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  scentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  scentBtnActive: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  scentBtnIcon: {
    fontSize: 12,
  },
  scentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  scentBtnTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  scentCheck: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0284C7',
  },

  weightBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
  },
  weightBtnActive: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  weightBtnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  weightBtnLabelActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  weightBtnPrice: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  weightBtnPriceActive: {
    color: '#0284C7',
    fontWeight: '700',
  },

  /* SỐ LƯỢNG */
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  stepperBtn: {
    width: 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  stepperBtnSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284C7',
  },
  stepperValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
    minWidth: 32,
    textAlign: 'center',
  },

  /* CỤM NÚT MUA HÀNG (TRỌNG TÂM KÍCH THÍCH CHUYỂN ĐỔI) */
  ctaButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  addToCartBtn: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addToCartBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  buyNowPrimaryBtn: {
    flex: 1.3,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#0284C7', // XANH DƯƠNG CHỦ ĐẠO GIỐNG WEB CHÍNH
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  buyNowPrimaryBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  /* TRUST BADGES DƯỚI NÚT MUA HÀNG */
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#BAE6FD',
    marginTop: 4,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustIcon: {
    fontSize: 12,
  },
  trustText: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '600',
  },
  trustDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#BAE6FD',
  },

  /* DETAILS CARD */
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    gap: 20,
  },
  tabItem: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabItemActive: {
    borderBottomColor: '#0284C7',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  tabContent: {
    marginTop: 16,
  },

  /* CLEAN DETAIL SECTIONS */
  cleanDetailWrap: {
    gap: 16,
  },
  cleanCard: {
    gap: 8,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
  },
  cardParagraph: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },

  /* FEATURE GRID */
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItemBox: {
    width: '48%',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 4,
  },
  featureItemTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  featureItemDesc: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },

  /* STEPS LIST */
  stepsList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  stepNumWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  stepContentText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },

  /* GUARANTEE BLOCK */
  storeGuaranteeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 6,
  },
  storeGuaranteeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  storeGuaranteeSub: {
    fontSize: 12,
    color: '#15803D',
    lineHeight: 16,
  },
  guaranteePointsList: {
    gap: 4,
    marginTop: 4,
  },
  guaranteePoint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },

  /* FOOD POINTS GRID */
  foodPointsGrid: {
    gap: 8,
  },
  foodPointBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  foodPointLabel: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  foodPointValue: {
    fontSize: 12.5,
    color: '#0369A1',
    fontWeight: '700',
    marginTop: 2,
  },

  /* NUTRITION GRID */
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '700',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2,
  },

  /* REVIEWS */
  reviewsWrap: {
    gap: 10,
  },
  cleanReviewCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 4,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0369A1',
  },
  reviewDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  verifiedBadgeRow: {
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 10.5,
    color: '#059669',
    fontWeight: '700',
  },
  reviewComment: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },

  /* MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0284C7',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 6,
  },
  voucherListWrap: {
    gap: 6,
  },
  voucherCardItem: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    padding: 10,
  },
  voucherAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  voucherCondition: {
    fontSize: 11,
    color: '#0369A1',
    marginTop: 1,
  },
  couponListWrap: {
    gap: 6,
  },
  couponRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    padding: 10,
  },
  couponCodeName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  couponCodeDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  copyBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyBtnActive: {
    backgroundColor: '#059669',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  copyBtnTextActive: {
    color: '#FFFFFF',
  },
  modalDoneBtn: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  modalDoneBtnText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 12.5,
  },

  /* BOTTOM BAR MOBILE ONLY */
  bottomBarMobile: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#BAE6FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  bottomPriceValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0284C7',
  },
  bottomCurrency: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  bottomActionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mobileAddCartBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileBuyNowBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mobileBuyNowBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});