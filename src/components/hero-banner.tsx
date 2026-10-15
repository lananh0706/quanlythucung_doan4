import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';

interface HeroBannerProps {
  onPress?: () => void;
}

const HERO_BANNER_IMG = require('@/assets/images/main_hero_banner.png');

export default function HeroBanner({ onPress }: HeroBannerProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.container,
          isMobile ? styles.containerMobile : styles.containerDesktop,
        ]}
        activeOpacity={0.92}
        onPress={onPress}
      >
        {/* ẢNH BANNER PANORAMIC MỚI - CHUẨN TỶ LỆ 1024x343 - NHỎ NHẮN XINH XẮN */}
        <Image
          source={HERO_BANNER_IMG}
          style={styles.bannerImage}
          contentFit="cover"
          priority="high"
          cachePolicy="memory-disk"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  container: {
    width: '100%',
    aspectRatio: 1024 / 343, // Tỷ lệ chuẩn xác 2.99:1 theo kích thước ảnh thật
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  containerDesktop: {
    maxWidth: 960,
  },
  containerMobile: {
    width: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
