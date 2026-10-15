import { Platform, Alert, Share } from 'react-native';

export function downloadCsv(filename: string, csvContent: string) {
  // Thêm BOM (\uFEFF) để Microsoft Excel hiển thị đúng 100% tiếng Việt có dấu
  const bomCsv = '\uFEFF' + csvContent;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([bomCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Trên thiết bị di động
    Share.share({
      title: filename,
      message: csvContent,
    }).catch(() => {
      Alert.alert('Xuất Báo Cáo', 'Đã tạo báo cáo thành công!');
    });
  }
}

// 1. XUẤT BÁO CÁO ĐƠN HÀNG RA EXCEL
export function exportOrdersToExcel(orders: any[]) {
  const headers = [
    'Mã Đơn Hàng',
    'Khách Hàng',
    'Số Điện Thoại',
    'Địa Chỉ Giao Hàng',
    'Phương Thức Thanh Toán',
    'Trạng Thái',
    'Tổng Tiền (VNĐ)',
  ];

  const rows = orders.map((o) => {
    const code = `"${o.code || o.order_code || ''}"`;
    const name = `"${(o.customerName || o.customer_name || '').replace(/"/g, '""')}"`;
    const phone = `"${o.phone || o.customer_phone || ''}"`;
    const addr = `"${(o.address || o.customer_address || '').replace(/"/g, '""')}"`;
    const payment = `"${o.paymentMethod || o.payment_method || 'COD'}"`;
    const status = `"${o.status || 'processing'}"`;
    const total = o.totalPrice || o.total_amount || 0;
    return [code, name, phone, addr, payment, status, total].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  downloadCsv(`Bao_Cao_Don_Hang_PetCare_${dateStr}.csv`, csv);
}

// 2. XUẤT BÁO CÁO TỒN KHO & LÔ HÀNG RA EXCEL
export function exportInventoryToExcel(inventory: any[]) {
  const headers = [
    'Mã Kệ / Vị Trí',
    'Tên Sản Phẩm',
    'Số Lượng Tồn Thực Tế',
    'Định Mức Tối Thiểu',
    'Trạng Thái Tồn Kho',
  ];

  const rows = inventory.map((inv) => {
    const shelf = `"${inv.shelf || inv.sku || ''}"`;
    const name = `"${(inv.productName || inv.name || '').replace(/"/g, '""')}"`;
    const qty = inv.actualStock || inv.stock || 0;
    const minAlert = inv.minThreshold || 20;
    const status = qty <= minAlert ? '"CẢNH BÁO: TỒN THẤP"' : '"ỔN ĐỊNH"';
    return [shelf, name, qty, minAlert, status].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  downloadCsv(`Bao_Cao_Ton_Kho_PetCare_${dateStr}.csv`, csv);
}
