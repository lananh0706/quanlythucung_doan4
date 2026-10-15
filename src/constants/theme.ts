/**
 * Bảng màu Light Sky Blue PetCare (Xanh nhạt tươi mát, Dịu mắt, Tinh tế)
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1E293B',              // Slate 800 - Sắc nét, cực kỳ dễ đọc
    textSecondary: '#64748B',     // Slate 500 - Nhẹ nhàng, thanh lịch
    textMuted: '#94A3B8',         // Slate 400
    background: '#F0F9FF',        // Xanh nhạt pastel tươi mát, dịu mắt
    backgroundElement: '#FFFFFF', // Thẻ trắng tinh khôi
    backgroundSelected: '#E0F2FE',// Xanh nhạt khi chọn
    card: '#FFFFFF',
    primary: '#0EA5E9',           // Xanh nhạt Sky Blue chủ đạo
    primaryDark: '#0284C7',       // Xanh dương đậm
    primaryBrand: '#0284C7',      // Thương hiệu xanh dương
    nameBlue: '#0284C7',          // Chữ đậm màu xanh chuẩn đặc tả
    priceRed: '#DC2626',          // Đỏ tô đậm chuẩn đề bài
    border: '#BAE6FD',            // Viền xanh nhạt Sky 200
    borderLight: '#E0F2FE',
    accent: '#38BDF8',            // Xanh da trời dịu dàng
    skyLight: '#F0F9FF',          // Nền xanh nhạt
    emerald: '#10B981',           // Xanh lá tươi
    amber: '#F59E0B',             // Vàng kim
    surfaceHover: '#E0F2FE',
  },
  dark: {
    text: '#F0F9FF',
    textSecondary: '#BAE6FD',
    textMuted: '#7DD3FC',
    background: '#0C1929',
    backgroundElement: '#13283E',
    backgroundSelected: '#1E3A5F',
    card: '#13283E',
    primary: '#38BDF8',
    primaryDark: '#0EA5E9',
    primaryBrand: '#38BDF8',
    nameBlue: '#7DD3FC',
    priceRed: '#F87171',
    border: '#1E3A5F',
    borderLight: '#13283E',
    accent: '#38BDF8',
    skyLight: '#13283E',
    emerald: '#34D399',
    amber: '#FBBF24',
    surfaceHover: '#1E3A5F',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Plus Jakarta Sans',
    serif: 'serif',
    rounded: 'Plus Jakarta Sans',
    mono: 'monospace',
  },
  web: {
    sans: 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, serif',
    rounded: 'Plus Jakarta Sans, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 40,
  six: 48,
} as const;

export const MaxContentWidth = 1140;
export const BottomTabInset = 16;
