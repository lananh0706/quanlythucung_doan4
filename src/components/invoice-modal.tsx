import React from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number | string;
  packaging?: string;
}

export interface InvoiceData {
  orderCode: string;
  date?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  shippingFee?: number;
  discountAmount?: number;
  voucherCode?: string;
  totalAmount: number | string;
  items: InvoiceItem[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
}

function formatCurrency(val: any): string {
  if (val === undefined || val === null) return '0 ₫';
  if (typeof val === 'string' && val.includes('₫')) return val;
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '0 ₫';
  return num.toLocaleString('vi-VN') + ' ₫';
}

function parseNumber(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const n = Number(String(val).replace(/[^0-9]/g, ''));
  return isNaN(n) ? 0 : n;
}

export default function InvoiceModal({ visible, onClose, invoice }: Props) {
  if (!invoice) return null;

  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    }
  };

  const totalNum = parseNumber(invoice.totalAmount);
  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [
    { name: 'Sản phẩm thức ăn thú cưng PetCare', quantity: 1, price: totalNum, packaging: 'Gói tiêu chuẩn' }
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* HEADER TOOLBAR (ẨN KHI IN) */}
          <View style={styles.toolbarRow}>
            <Text style={styles.toolbarTitle}>🧾 HÓA ĐƠN ĐIỆN TỬ BÁN LẺ</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {Platform.OS === 'web' && (
                <TouchableOpacity style={styles.btnPrint} onPress={handlePrint}>
                  <Text style={styles.btnPrintText}>🖨️ In Hóa Đơn (PDF)</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                <Text style={styles.btnCloseText}>✕ Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* NỘI DUNG HÓA ĐƠN IN */}
          <ScrollView contentContainerStyle={styles.invoiceSheet}>
            {/* THÔNG TIN DOANH NGHIỆP */}
            <View style={styles.invoiceHeader}>
              <View style={styles.brandBox}>
                <Text style={styles.brandLogo}>🐾 PETCARE SHOP</Text>
                <Text style={styles.brandTagline}>Hệ Thống Dinh Dưỡng & Phụ Kiện Thú Cưng Chính Hãng</Text>
                <Text style={styles.brandInfo}>📍 120 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội</Text>
                <Text style={styles.brandInfo}>📞 Hotline: 1900 8899 • 🌐 Website: petcare.vn</Text>
                <Text style={styles.brandInfo}>🏛️ MST: 0108899888 - Tài khoản: 0982112233 (MB Bank)</Text>
              </View>
              <View style={styles.stampBox}>
                <Text style={styles.stampText}>ĐÃ THANH TOÁN</Text>
                <Text style={styles.stampSub}>PETCARE VERIFIED</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* TIÊU ĐỀ HÓA ĐƠN */}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Text style={styles.invoiceTitle}>HÓA ĐƠN BÁN HÀNG</Text>
              <Text style={styles.invoiceSubCode}>Mã đơn hàng: {invoice.orderCode}</Text>
              <Text style={styles.invoiceDate}>
                Ngày lập: {invoice.date || new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}
              </Text>
            </View>

            {/* THÔNG TIN KHÁCH HÀNG */}
            <View style={styles.customerBox}>
              <View style={styles.customerRow}>
                <Text style={styles.customerLabel}>Khách hàng:</Text>
                <Text style={styles.customerValue}>{invoice.customerName || 'Khách hàng thân thiết'}</Text>
              </View>
              <View style={styles.customerRow}>
                <Text style={styles.customerLabel}>Số điện thoại:</Text>
                <Text style={styles.customerValue}>{invoice.customerPhone || '0982.xxx.xxx'}</Text>
              </View>
              <View style={styles.customerRow}>
                <Text style={styles.customerLabel}>Địa chỉ giao hàng:</Text>
                <Text style={[styles.customerValue, { flex: 1 }]}>{invoice.customerAddress || 'Giao tại cửa hàng'}</Text>
              </View>
              <View style={styles.customerRow}>
                <Text style={styles.customerLabel}>Hình thức thanh toán:</Text>
                <Text style={[styles.customerValue, { color: '#0284C7', fontWeight: '800' }]}>
                  {invoice.paymentMethod || 'Chuyển khoản VietQR / COD'}
                </Text>
              </View>
            </View>

            {/* BẢNG SẢN PHẨM */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { width: 32 }]}>#</Text>
                <Text style={[styles.th, { flex: 2 }]}>Tên Sản Phẩm / Quy Cách</Text>
                <Text style={[styles.th, { width: 40, textAlign: 'center' }]}>SL</Text>
                <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>Đơn Giá</Text>
                <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>Thành Tiền</Text>
              </View>

              {items.map((it, idx) => {
                const itemPrice = parseNumber(it.price);
                const itemQty = it.quantity || 1;
                const lineTotal = itemPrice * itemQty;
                return (
                  <View key={idx} style={[styles.tableRow, idx % 2 === 1 && { backgroundColor: '#F8FAFC' }]}>
                    <Text style={[styles.td, { width: 32, color: '#64748B' }]}>{idx + 1}</Text>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.td, { fontWeight: '700', color: '#0F172A' }]}>{it.name}</Text>
                      {it.packaging && (
                        <Text style={{ fontSize: 11, color: '#64748B' }}>Quy cách: {it.packaging}</Text>
                      )}
                    </View>
                    <Text style={[styles.td, { width: 40, textAlign: 'center', fontWeight: '700' }]}>
                      {itemQty}
                    </Text>
                    <Text style={[styles.td, { width: 90, textAlign: 'right' }]}>
                      {formatCurrency(itemPrice)}
                    </Text>
                    <Text style={[styles.td, { width: 100, textAlign: 'right', fontWeight: '800', color: '#0F172A' }]}>
                      {formatCurrency(lineTotal)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* TỔNG KẾT TIỀN */}
            <View style={styles.summaryWrap}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalNum)}</Text>
                </View>
                {invoice.discountAmount ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Giảm giá voucher:</Text>
                    <Text style={[styles.summaryValue, { color: '#16A34A' }]}>
                      -{formatCurrency(invoice.discountAmount)}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Thuế VAT (8%):</Text>
                  <Text style={styles.summaryValue}>Đã bao gồm</Text>
                </View>
                <View style={styles.summaryRowDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>TỔNG CỘNG THANH TOÁN:</Text>
                  <Text style={styles.summaryTotalValue}>{formatCurrency(totalNum)}</Text>
                </View>
              </View>
            </View>

            {/* CHỮ KÝ & LỜI CẢM ƠN */}
            <View style={styles.footerSignRow}>
              <View style={styles.signCol}>
                <Text style={styles.signTitle}>Khách Hàng</Text>
                <Text style={styles.signNote}>(Ký và ghi rõ họ tên)</Text>
              </View>
              <View style={styles.signCol}>
                <Text style={styles.signTitle}>Đại Diện PetCare Shop</Text>
                <Text style={styles.signNote}>(Đã ký điện tử)</Text>
                <Text style={styles.signName}>Hệ thống PetCare Auto-Sign</Text>
              </View>
            </View>

            <View style={styles.thankYouBox}>
              <Text style={styles.thankYouText}>❤️ Cảm ơn Quý khách đã mua sắm tại PetCare Shop!</Text>
              <Text style={styles.thankYouSub}>Chúc bé cưng của bạn luôn khỏe mạnh, ăn ngon chóng lớn!</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  toolbarTitle: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 15,
  },
  btnPrint: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnPrintText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  btnClose: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnCloseText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 13,
  },
  invoiceSheet: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandBox: {
    flex: 1,
  },
  brandLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  brandInfo: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  stampBox: {
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  stampText: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  stampSub: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 9,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  invoiceSubCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  invoiceDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  customerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  customerLabel: {
    width: 140,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  customerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  table: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  th: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  td: {
    fontSize: 12,
    color: '#334155',
  },
  summaryWrap: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  summaryBox: {
    width: '100%',
    maxWidth: 320,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryRowDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
  },
  summaryTotalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#DC2626',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
  },
  footerSignRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 30,
  },
  signCol: {
    alignItems: 'center',
  },
  signTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  signNote: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  signName: {
    marginTop: 36,
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  thankYouBox: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  thankYouSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
