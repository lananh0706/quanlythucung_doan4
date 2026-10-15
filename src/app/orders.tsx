import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCart, Order } from '@/context/cart-context';
import { OrdersIcon, TruckIcon } from '@/components/icons';

const STEPS = ['Đã đặt', 'Đóng gói', 'Đang giao', 'Đã nhận'];

const API_ORDERS =
  Platform.OS === 'web'
    ? 'http://localhost/petcare-api/get_admin_orders.php'
    : 'http://192.168.1.8/petcare-api/get_admin_orders.php';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orders } = useCart();

  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'delivering' | 'completed'>('all');

  React.useEffect(() => {
    fetch(API_ORDERS)
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const mapped: Order[] = resData.data.map((item: any) => {
            const rawStatus = (item.status || '').toLowerCase();
            let st: 'processing' | 'delivering' | 'completed' = 'processing';
            let stText = 'Đang Xử Lý';
            let sIdx = 1;
            if (rawStatus === 'completed' || rawStatus === 'delivered') {
              st = 'completed';
              stText = 'Giao Thành Công';
              sIdx = 3;
            } else if (rawStatus === 'delivering' || rawStatus === 'shipping') {
              st = 'delivering';
              stText = 'Đang Giao Hàng';
              sIdx = 2;
            }

            return {
              id: item.order_code || `PET-${item.id}`,
              orderDate: item.created_at || 'Gần đây',
              status: st,
              statusText: stText,
              totalAmount: `${Number(item.total_amount || 0).toLocaleString('vi-VN')} đ`,
              stepIndex: sIdx,
              items: [
                {
                  name: `Đơn hàng #${item.order_code || item.id} (${item.customer_name || 'Khách hàng'})`,
                  quantity: 1,
                  price: `${Number(item.total_amount || 0).toLocaleString('vi-VN')} đ`,
                  image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400',
                },
              ],
            };
          });
          setDbOrders(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const currentOrders = dbOrders.length > 0 ? dbOrders : orders;

  const filteredOrders = currentOrders.filter((order) => {
    if (activeTab === 'delivering') return order.status === 'delivering' || order.status === 'processing';
    if (activeTab === 'completed') return order.status === 'completed';
    return true;
  });

  const handleReorder = (orderId: string) => {
    if (Platform.OS !== 'web') {
      Alert.alert('Mua lại', `Đã chuyển đến giỏ hàng để mua lại đơn #${orderId}!`);
    }
    router.push('/cart');
  };

  const bottomInset = insets.bottom + BottomTabInset + Spacing.four;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.headerBar}>
          <View style={styles.headerIconCircle}>
            <OrdersIcon size={20} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Quản Lý Đơn Hàng</Text>
            <Text style={styles.headerSubtitle}>
              Theo dõi vận chuyển thức ăn & dinh dưỡng thú cưng
            </Text>
          </View>
        </View>

        {/* TAB LỌC TRẠNG THÁI */}
        <View style={styles.filterTabs}>
          {[
            { key: 'all', label: 'Tất cả đơn hàng' },
            { key: 'delivering', label: 'Đang vận chuyển' },
            { key: 'completed', label: 'Đã hoàn thành' },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={[
                styles.filterTabBtn,
                activeTab === tab.key && styles.filterTabBtnActive,
              ]}>
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab.key && styles.filterTabTextActive,
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.ordersList}>
            {filteredOrders.length === 0 ? (
              <View style={styles.emptyCard}>
                <OrdersIcon size={40} color="#0EA5E9" />
                <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
                <Text style={styles.emptySubtitle}>
                  Bạn chưa có đơn hàng trong mục này. Hãy chọn mua thức ăn thơm ngon cho bé cưng nhé!
                </Text>
                <Pressable
                  onPress={() => router.push('/')}
                  style={styles.shopNowBtn}>
                  <Text style={styles.shopNowBtnText}>Khám phá thức ăn ngay</Text>
                </Pressable>
              </View>
            ) : (
              filteredOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  {/* HEADER ĐƠN */}
                  <View style={styles.orderCardHeader}>
                    <View>
                      <Text style={styles.orderId}>Mã đơn #{order.id}</Text>
                      <Text style={styles.orderDate}>{order.orderDate}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        order.status === 'delivering'
                          ? styles.statusPillDelivering
                          : styles.statusPillDone,
                      ]}>
                      <Text
                        style={[
                          styles.statusPillText,
                          order.status === 'delivering'
                            ? styles.statusTextDelivering
                            : styles.statusTextDone,
                        ]}>
                        ● {order.statusText}
                      </Text>
                    </View>
                  </View>

                  {/* THANH TIMELINE TIẾN TRÌNH */}
                  <View style={styles.timelineContainer}>
                    {STEPS.map((stepName, idx) => {
                      const isDone = idx <= order.stepIndex;
                      const isCurrent = idx === order.stepIndex;
                      return (
                        <View key={stepName} style={styles.timelineStep}>
                          <View
                            style={[
                              styles.stepDot,
                              isDone ? styles.stepDotDone : styles.stepDotPending,
                              isCurrent && styles.stepDotActive,
                            ]}>
                            <Text style={styles.stepDotText}>{isDone ? '✓' : idx + 1}</Text>
                          </View>
                          <Text
                            style={[
                              styles.stepLabel,
                              isCurrent && styles.stepLabelActive,
                            ]}>
                            {stepName}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* THÔNG TIN SHIPPER */}
                  {order.shipper && (
                    <View style={styles.shipperBox}>
                      <TruckIcon size={20} color="#0284C7" />
                      <View style={styles.shipperInfo}>
                        <Text style={styles.shipperName}>
                          Shipper: {order.shipper.name}
                        </Text>
                        <Text style={styles.shipperSub}>
                          {order.shipper.vehicle} • SĐT: {order.shipper.phone}
                        </Text>
                        <Text style={styles.shipperEta}>
                          Dự kiến: {order.shipper.eta}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* DANH SÁCH MÓN */}
                  <View style={styles.orderItemsList}>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.orderItemRow}>
                        <Image source={{ uri: item.image }} style={styles.itemThumb} contentFit="cover" />
                        <View style={styles.itemTextGroup}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemSub}>
                            Số lượng: x{item.quantity}
                          </Text>
                        </View>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                      </View>
                    ))}
                  </View>

                  {/* FOOTER ĐƠN */}
                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.totalPrompt}>Tổng thanh toán</Text>
                      <Text style={styles.totalAmount}>{order.totalAmount}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleReorder(order.id)}
                      style={styles.reorderBtn}>
                      <Text style={styles.reorderBtnText}>Mua lại đơn</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  filterTabBtnActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 18,
    gap: 14,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
    paddingBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusPillDelivering: {
    backgroundColor: '#E0F2FE',
  },
  statusPillDone: {
    backgroundColor: '#ECFDF5',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextDelivering: {
    color: '#0284C7',
  },
  statusTextDone: {
    color: '#16A34A',
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  timelineStep: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#0EA5E9',
  },
  stepDotPending: {
    backgroundColor: '#CBD5E1',
  },
  stepDotActive: {
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  stepDotText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  stepLabelActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  shipperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  shipperInfo: {
    flex: 1,
    gap: 2,
  },
  shipperName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  shipperSub: {
    fontSize: 11,
    color: '#64748B',
  },
  shipperEta: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  orderItemsList: {
    gap: 10,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
  },
  itemTextGroup: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  itemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0F2FE',
    paddingTop: 12,
  },
  totalPrompt: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 2,
  },
  reorderBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 400,
  },
  shopNowBtn: {
    marginTop: 8,
    backgroundColor: '#0EA5E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shopNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
