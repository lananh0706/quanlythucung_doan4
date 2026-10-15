import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';

export interface BannerItem {
  id: string;
  badge: string;
  title: string;
  highlight?: string;
  subtitle: string;
  ctaText?: string;
  image: string; // URL ảnh hoặc video mp4
  localSource?: any; // require local asset
  mediaType?: 'image' | 'video';
  isGraphicBanner?: boolean; // Banner đồ họa full-bleed kích thước lớn
  themeColor?: string;
  order?: number;
  status?: 'active' | 'paused';
}

interface BannerSliderProps {
  banners?: BannerItem[];
  onCtaPress?: (banner: BannerItem) => void;
}

const LOCAL_MAIN_BANNER = require('@/assets/images/main_hero_banner.png');

export const DEFAULT_SLIDER_BANNERS: BannerItem[] = [
  {
    id: 'ban-main-hero',
    badge: '🐾 PETCARE SHOP • THỨC ĂN & PHỤ KIỆN',
    title: 'Thức Ăn & Phụ Kiện Cho Chó Mèo',
    highlight: 'KHỎE MẠNH HƠN MỖI NGÀY',
    subtitle: 'Bé khỏe Bé vui Cả nhà an tâm • Ăn ngon Vui khỏe Lớn nhanh.',
    ctaText: 'Mua Cho Bé Ngay',
    image: 'http://localhost/petcare-api/uploads/main_hero_banner.png',
    localSource: LOCAL_MAIN_BANNER,
    isGraphicBanner: true,
    mediaType: 'image',
    themeColor: '#0284C7',
  },
  {
    id: 'ban-video-1',
    badge: '🎬 VIDEO THỰC TẾ • REVIEW TẬN TAY',
    title: 'Bữa Ăn Hạnh Phúc Của Bé Cưng',
    highlight: 'THỨC ĂN CAO CẤP CHÍNH HÃNG',
    subtitle: 'Xem video các bé cún mèo thưởng thức hạt Orijen & Pate tươi thượng hạng mỗi ngày.',
    ctaText: 'Khám Phá Món Ngon',
    image: 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    mediaType: 'video',
    themeColor: '#0284C7',
  },
  {
    id: 'ban-img-royal',
    badge: 'ROYAL CANIN CHÍNH HÃNG',
    title: 'Dinh Dưỡng Thượng Hạng Cho Bé Cưng',
    highlight: 'PHÁT TRIỂN TOÀN DIỆN',
    subtitle: 'Công thức cân bằng 52 dưỡng chất giúp lông bóng mượt & ngăn ngừa sỏi tiết niệu.',
    ctaText: 'Mua Đồ Cho Bé',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    themeColor: '#0EA5E9',
  },
  {
    id: 'ban-video-2',
    badge: '🎥 SÚP THƯỞNG NHẬT BẢN',
    title: 'Ciao Churu & Bánh Thưởng Thần Thánh',
    highlight: 'GIẢM ĐẾN 20% HÔM NAY',
    subtitle: 'Clip thực tế xé thanh súp thưởng, bé mèo chạy lại quấn quýt không rời!',
    ctaText: 'Xem Bánh Thưởng',
    image: 'https://www.w3schools.com/html/mov_bbb.mp4',
    mediaType: 'video',
    themeColor: '#D97706',
  },
];

export default function BannerSlider({ banners = DEFAULT_SLIDER_BANNERS, onCtaPress }: BannerSliderProps) {
  const activeBanners = banners.filter((b) => b.status !== 'paused');
  const items = activeBanners.length > 0 ? activeBanners : DEFAULT_SLIDER_BANNERS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const currentBanner = items[currentIndex] || items[0];
  const isVideo =
    currentBanner.mediaType === 'video' ||
    (typeof currentBanner.image === 'string' &&
      (currentBanner.image.toLowerCase().endsWith('.mp4') ||
        currentBanner.image.toLowerCase().includes('.mp4?') ||
        currentBanner.image.toLowerCase().endsWith('.mov')));

  const isGraphicBanner =
    currentBanner.isGraphicBanner ||
    (typeof currentBanner.image === 'string' && currentBanner.image.includes('main_hero_banner')) ||
    Boolean(currentBanner.localSource);

  // Tự động chuyển slide sau mỗi 6 giây
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <View style={styles.container}>
      {/* ======================================================== */}
      {/* 1. TRƯỜNG HỢP BANNER ĐỒ HỌA TO LỚN (FULL GRAPHIC BANNER) */}
      {/* ======================================================== */}
      {isGraphicBanner ? (
        <TouchableOpacity
          style={[
            styles.graphicBannerCard,
            isMobile ? styles.graphicBannerCardMobile : styles.graphicBannerCardDesktop,
          ]}
          activeOpacity={0.92}
          onPress={() => onCtaPress && onCtaPress(currentBanner)}
        >
          {/* ẢNH BANNER TO FULL-BLEED */}
          <Image
            source={currentBanner.localSource || { uri: currentBanner.image }}
            style={styles.graphicFullImage}
            contentFit="cover"
            priority="high"
          />

          {/* LỚP PHỦ GRADIENT NHẸ TRANG TRÍ */}
          <View style={styles.graphicOverlayRow}>
            <View style={styles.graphicBadgePill}>
              <Text style={styles.graphicBadgeText}>🐾 PETCARE CHÍNH HÃNG 100%</Text>
            </View>

            <TouchableOpacity
              style={styles.graphicCtaBtn}
              activeOpacity={0.85}
              onPress={() => onCtaPress && onCtaPress(currentBanner)}
            >
              <Text style={styles.graphicCtaBtnText}>Mua Đồ Cho Bé Ngay →</Text>
            </TouchableOpacity>
          </View>

          {/* NÚT ĐIỀU HƯỚNG PREV / NEXT */}
          {items.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.arrowBtn, styles.arrowBtnLeft]}
                onPress={handlePrev}
                activeOpacity={0.8}
              >
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.arrowBtn, styles.arrowBtnRight]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
      ) : (
        /* ======================================================== */
        /* 2. TRƯỜNG HỢP BANNER DẠNG THẺ (SPLIT TEXT + VIDEO/ẢNH)  */
        /* ======================================================== */
        <View
          style={[
            styles.bannerCard,
            { borderColor: currentBanner.themeColor ? `${currentBanner.themeColor}55` : '#BAE6FD' },
            isMobile ? styles.bannerCardMobile : styles.bannerCardDesktop,
          ]}
        >
          {/* NỘI DUNG VĂN BẢN TRÁI */}
          <View style={[styles.textCol, isMobile && styles.textColMobile]}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: currentBanner.themeColor || '#0284C7' },
                ]}
              >
                <Text style={styles.badgeText}>{currentBanner.badge}</Text>
              </View>

              {isVideo && (
                <View style={styles.videoIndicatorBadge}>
                  <Text style={styles.videoIndicatorText}>🎬 MP4 Video</Text>
                </View>
              )}
            </View>

            <Text style={[styles.title, !isMobile && styles.titleDesktop]} numberOfLines={2}>
              {currentBanner.title}
            </Text>

            {currentBanner.highlight ? (
              <Text
                style={[
                  styles.highlightText,
                  { color: currentBanner.themeColor || '#0369A1' },
                ]}
                numberOfLines={1}
              >
                ★ {currentBanner.highlight}
              </Text>
            ) : null}

            <Text style={[styles.subtitle, !isMobile && styles.subtitleDesktop]} numberOfLines={isMobile ? 2 : 3}>
              {currentBanner.subtitle}
            </Text>

            {/* HÀNG NÚT BẤM CTA */}
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={[
                  styles.ctaBtn,
                  { backgroundColor: currentBanner.themeColor || '#0284C7' },
                ]}
                activeOpacity={0.85}
                onPress={() => onCtaPress && onCtaPress(currentBanner)}
              >
                <Text style={styles.ctaBtnText}>
                  {currentBanner.ctaText || 'Khám Phá Ngay'} →
                </Text>
              </TouchableOpacity>

              {/* NẾU LÀ VIDEO: HIỂN THỊ NÚT BẬT TIẾNG & TẠM DỪNG */}
              {isVideo && (
                <View style={styles.videoQuickControls}>
                  <TouchableOpacity
                    style={styles.soundToggleBtn}
                    onPress={() => setIsMuted(!isMuted)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.soundToggleText}>
                      {isMuted ? '🔇 Bật tiếng' : '🔊 Đang bật'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.soundToggleBtn}
                    onPress={() => setIsPlaying(!isPlaying)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.soundToggleText}>
                      {isPlaying ? '⏸ Dừng' : '▶ Phát'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* CỘT PHẢI: KHUNG MEDIA (VIDEO MP4 HOẶC HÌNH ẢNH) */}
          <View style={[styles.mediaCol, isMobile ? styles.mediaColMobile : styles.mediaColDesktop]}>
            {isVideo ? (
              <View style={styles.videoPlayerContainer}>
                {Platform.OS === 'web' ? (
                  <video
                    key={currentBanner.image}
                    src={currentBanner.image}
                    autoPlay={isPlaying}
                    loop
                    muted={isMuted}
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <View style={styles.nativeVideoPlaceholder}>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
                      }}
                      style={styles.mediaCover}
                      contentFit="cover"
                    />
                    <View style={styles.videoOverlayBackdrop}>
                      <View style={styles.playCircleBtn}>
                        <Text style={styles.playIconText}>▶</Text>
                      </View>
                      <Text style={styles.videoMobileTag}>🎬 Clip MP4 Siêu Nét</Text>
                    </View>
                  </View>
                )}

                <View style={styles.videoCornerTag}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.videoCornerText}>MP4 LIVE</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentBanner.image }}
                  style={styles.mediaCover}
                  contentFit="cover"
                  transition={300}
                />
              </View>
            )}
          </View>

          {/* NÚT ĐIỀU HƯỚNG PREV / NEXT */}
          {items.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.arrowBtn, styles.arrowBtnLeft]}
                onPress={handlePrev}
                activeOpacity={0.8}
              >
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.arrowBtn, styles.arrowBtnRight]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ======================================================== */}
      {/* THANH CHẤM PHÂN TRANG (DOTS INDICATOR)                   */}
      {/* ======================================================== */}
      {items.length > 1 && (
        <View style={styles.dotsRow}>
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            const itemIsVideo =
              item.mediaType === 'video' ||
              (typeof item.image === 'string' && item.image.toLowerCase().includes('.mp4'));
            return (
              <TouchableOpacity
                key={item.id || idx}
                style={[
                  styles.dot,
                  isActive && [
                    styles.dotActive,
                    { backgroundColor: item.themeColor || '#0284C7' },
                  ],
                ]}
                onPress={() => setCurrentIndex(idx)}
                activeOpacity={0.8}
              >
                {isActive && (
                  <Text style={styles.dotIconText}>{itemIsVideo ? '🎬' : '•'}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },

  // 1. GRAPHIC BANNER FULL-BLEED (TO LỚN, RÕ NÉT)
  graphicBannerCard: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#BAE6FD',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  graphicBannerCardDesktop: {
    height: 380, // Chiều cao to lớn trên Desktop
  },
  graphicBannerCardMobile: {
    height: 220, // Chiều cao chuẩn 16:9 to rõ ràng trên iPhone 13
  },
  graphicFullImage: {
    width: '100%',
    height: '100%',
  },
  graphicOverlayRow: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  graphicBadgePill: {
    backgroundColor: 'rgba(2, 132, 199, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  graphicBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  graphicCtaBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  graphicCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // 2. BANNER DẠNG THẺ (SPLIT TEXT + MEDIA)
  bannerCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  bannerCardDesktop: {
    minHeight: 320, // To lớn hơn hẳn trên máy tính
  },
  bannerCardMobile: {
    flexDirection: 'column',
    padding: 16,
    minHeight: 340,
    gap: 14,
  },
  textCol: {
    flex: 1.15,
    paddingRight: 20,
    gap: 8,
    zIndex: 2,
  },
  textColMobile: {
    width: '100%',
    paddingRight: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  videoIndicatorBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  videoIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 28,
  },
  titleDesktop: {
    fontSize: 26,
    lineHeight: 34,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  subtitleDesktop: {
    fontSize: 14,
    lineHeight: 22,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  ctaBtn: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  videoQuickControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soundToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  soundToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  mediaCol: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  mediaColDesktop: {
    height: 250, // Khung media to lớn 250pt
  },
  mediaColMobile: {
    width: '100%',
    height: 190,
  },
  videoPlayerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  nativeVideoPlaceholder: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlayBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  playCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(2, 132, 199, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 3,
  },
  videoMobileTag: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoCornerTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  videoCornerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  mediaCover: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  arrowBtnLeft: {
    left: 8,
  },
  arrowBtnRight: {
    right: 8,
  },
  arrowText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0284C7',
    lineHeight: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: {
    width: 26,
    height: 9,
    borderRadius: 4.5,
  },
  dotIconText: {
    fontSize: 6,
    color: '#FFFFFF',
  },
});
