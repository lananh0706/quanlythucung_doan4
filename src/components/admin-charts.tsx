import React from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';

export interface PieSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
  icon?: string;
}

// ============================================================
// 1. BIỂU ĐỒ TRÒN / DONUT SVG CHUẨN XÁC VÀ ĐẸP MẮT
// ============================================================
export function SvgDonutChart({
  slices,
  centerTitle,
  centerSubtitle,
  size = 190,
}: {
  slices: PieSlice[];
  centerTitle: string;
  centerSubtitle: string;
  size?: number;
}) {
  const radius = 38;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~238.76

  // Tính toán stroke-dasharray & stroke-dashoffset cho từng lát cắt
  let accumulatedPercent = 0;
  const calculatedSegments = slices.map((slice) => {
    const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += slice.percent;
    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  if (Platform.OS === 'web') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Vòng nền mờ */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {calculatedSegments.map((seg, idx) => (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          ))}
        </svg>

        {/* Nội dung trung tâm tâm vòng tròn */}
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', textAlign: 'center' }}>
            {centerTitle}
          </Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textAlign: 'center', marginTop: 1 }}>
            {centerSubtitle}
          </Text>
        </View>
      </View>
    );
  }

  // Fallback trên Native
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#F8FAFC', borderWidth: 8, borderColor: slices[0]?.color || '#0284C7', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A' }}>{centerTitle}</Text>
      <Text style={{ fontSize: 10, color: '#64748B' }}>{centerSubtitle}</Text>
    </View>
  );
}

// ============================================================
// 2. BIỂU ĐỒ CỘT DOANH THU 7 NGÀY
// ============================================================
export function RevenueBarChart({
  revenueData,
}: {
  revenueData: { day: string; amount: number; display: string }[];
}) {
  const maxVal = Math.max(...revenueData.map((d) => d.amount), 1);

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>📊 Biểu Đồ Doanh Thu & Xu Hướng 7 Ngày</Text>
          <Text style={styles.chartSub}>Số liệu bán hàng thực tế theo chu kỳ tuần</Text>
        </View>
        <View style={styles.badgeSuccess}>
          <Text style={styles.badgeSuccessText}>+18.4% so với tuần trước</Text>
        </View>
      </View>

      <View style={styles.barChartContainer}>
        {revenueData.map((item, idx) => {
          const heightPercent = Math.max(15, Math.round((item.amount / maxVal) * 100));
          const isHighest = item.amount === maxVal;
          return (
            <View key={idx} style={styles.barCol}>
              <Text style={[styles.barValText, isHighest && { color: '#0284C7', fontWeight: '800' }]}>
                {item.display}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: isHighest ? '#0284C7' : idx % 2 === 0 ? '#38BDF8' : '#7DD3FC',
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barDayText, isHighest && { color: '#0284C7', fontWeight: '800' }]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// 3. KHỐI 2 BIỂU ĐỒ TRÒN (DANH MỤC THỨC ĂN & CỔNG THANH TOÁN)
// ============================================================
export function DualPieChartsSection({
  categorySlices,
  paymentSlices,
  totalRevenueStr,
  totalOrdersStr,
}: {
  categorySlices: PieSlice[];
  paymentSlices: PieSlice[];
  totalRevenueStr: string;
  totalOrdersStr: string;
}) {
  return (
    <View style={styles.twoColRow}>
      {/* BIỂU ĐỒ TRÒN 1: TỶ TRỌNG THEO DANH MỤC */}
      <View style={styles.halfCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>🥧 Cơ Cấu Doanh Số Theo Danh Mục</Text>
            <Text style={styles.chartSub}>Tỷ trọng các nhóm thức ăn & chăm sóc</Text>
          </View>
          <View style={styles.badgePrimary}>
            <Text style={styles.badgePrimaryText}>100% CSDL</Text>
          </View>
        </View>

        <View style={styles.pieContentRow}>
          <SvgDonutChart
            slices={categorySlices}
            centerTitle={totalRevenueStr}
            centerSubtitle="Doanh Thu"
            size={180}
          />

          <View style={styles.legendCol}>
            {categorySlices.map((item, idx) => (
              <View key={idx} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.legendLabel}>{item.icon || '•'} {item.label}</Text>
                    <Text style={styles.legendPercent}>{item.percent}%</Text>
                  </View>
                  <View style={styles.miniProgressTrack}>
                    <View style={[styles.miniProgressFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* BIỂU ĐỒ TRÒN 2: PHƯƠNG THỨC THANH TOÁN */}
      <View style={styles.halfCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>💳 Tỷ Lệ Phương Thức Thanh Toán</Text>
            <Text style={styles.chartSub}>Phân bổ kênh VietQR, MoMo và Tiền mặt COD</Text>
          </View>
          <View style={styles.badgeWarning}>
            <Text style={styles.badgeWarningText}>30 GD</Text>
          </View>
        </View>

        <View style={styles.pieContentRow}>
          <SvgDonutChart
            slices={paymentSlices}
            centerTitle={totalOrdersStr}
            centerSubtitle="Đơn Hàng"
            size={180}
          />

          <View style={styles.legendCol}>
            {paymentSlices.map((item, idx) => (
              <View key={idx} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.legendLabel}>{item.icon || '•'} {item.label}</Text>
                    <Text style={styles.legendPercent}>{item.percent}%</Text>
                  </View>
                  <View style={styles.miniProgressTrack}>
                    <View style={[styles.miniProgressFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.paymentSummaryBox}>
              <Text style={styles.paymentSummaryText}>
                ⚡ <Text style={{ fontWeight: '800' }}>Không dùng tiền mặt đạt 75%</Text> (VietQR + MoMo) giúp kiểm soát dòng tiền tự động.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// 4. BẢNG TOP SẢN PHẨM BÁN CHẠY & CẢNH BÁO KHO
// ============================================================
export function TopProductsAndWarehouseSection({
  topProducts,
  inventoryWarnings,
}: {
  topProducts: {
    id: string | number;
    name: string;
    brand: string;
    price: number;
    soldCount: number | string;
    image: string;
    rating: number;
    sharePercent: number;
  }[];
  inventoryWarnings: {
    productName: string;
    sku: string;
    stockQty: number;
    location: string;
    level: 'critical' | 'warning' | 'normal';
  }[];
}) {
  return (
    <View style={styles.twoColRow}>
      {/* BẢNG TOP BÁN CHẠY */}
      <View style={styles.halfCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>🏆 Top 5 Sản Phẩm Bán Chạy Nhất</Text>
            <Text style={styles.chartSub}>Dẫn đầu doanh số theo dữ liệu bán lẻ</Text>
          </View>
          <View style={styles.badgeSuccess}>
            <Text style={styles.badgeSuccessText}>Doanh số cao</Text>
          </View>
        </View>

        <View style={{ gap: 10, marginTop: 4 }}>
          {topProducts.slice(0, 5).map((prod, idx) => {
            const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
            return (
              <View key={idx} style={styles.topProdRow}>
                <Text style={styles.medalText}>{medals[idx] || '⭐'}</Text>
                <Image source={{ uri: prod.image }} style={styles.topProdThumb} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.topProdTitle} numberOfLines={1}>
                    {prod.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Text style={styles.topProdBrand}>{prod.brand}</Text>
                    <Text style={styles.topProdSold}>• Đã bán: {prod.soldCount}</Text>
                  </View>
                  <View style={styles.miniProgressTrack}>
                    <View
                      style={[
                        styles.miniProgressFill,
                        {
                          width: `${prod.sharePercent}%`,
                          backgroundColor: idx === 0 ? '#0284C7' : idx === 1 ? '#10B981' : '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.topProdPrice}>{Number(prod.price).toLocaleString('vi-VN')} đ</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* CẢNH BÁO KHO & LÔ HÀNG */}
      <View style={styles.halfCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>⚠️ Cảnh Báo Tồn Kho & Hạn Dùng</Text>
            <Text style={styles.chartSub}>Các mặt hàng cần nhập thêm hoặc kiểm tra hạn</Text>
          </View>
          <View style={styles.badgeDanger}>
            <Text style={styles.badgeDangerText}>Cần chú ý</Text>
          </View>
        </View>

        <View style={{ gap: 10, marginTop: 4 }}>
          {inventoryWarnings.map((inv, idx) => (
            <View
              key={idx}
              style={[
                styles.alertRow,
                inv.level === 'critical'
                  ? { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }
                  : { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
              ]}
            >
              <Text style={{ fontSize: 22 }}>{inv.level === 'critical' ? '🔴' : '🟡'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle} numberOfLines={1}>
                  {inv.productName}
                </Text>
                <Text style={styles.alertSub}>
                  Mã: {inv.sku} • Vị trí: {inv.location}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '900',
                    color: inv.level === 'critical' ? '#DC2626' : '#D97706',
                  }}
                >
                  {inv.stockQty} gói
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B' }}>
                  {inv.level === 'critical' ? 'Sắp hết' : 'Tồn thấp'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ============================================================
// STYLES CHO BỘ BIỂU ĐỒ ADMIN
// ============================================================
const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  halfCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  chartTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  chartSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  badgePrimary: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeWarningText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  badgeDanger: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeDangerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    maxWidth: 36,
    height: 110,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginVertical: 6,
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barValText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  barDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  pieContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  legendCol: {
    flex: 1,
    minWidth: 160,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  legendPercent: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  miniProgressTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  paymentSummaryBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  paymentSummaryText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  topProdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medalText: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  topProdThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  topProdTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  topProdBrand: {
    fontSize: 10.5,
    color: '#0284C7',
    fontWeight: '700',
  },
  topProdSold: {
    fontSize: 10.5,
    color: '#64748B',
  },
  topProdPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  alertSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
});
