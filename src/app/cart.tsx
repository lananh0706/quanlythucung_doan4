import { useCart } from '@/context/cart-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  CloseIcon,
  SearchIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '@/components/icons';

import {
  VIETNAM_PROVINCES,
  INTERNATIONAL_COUNTRIES,
  ProvinceItem,
  DistrictItem,
  WardItem,
  CountryItem,
} from '@/constants/vietnam-addresses';

const API_CREATE_ORDER =
  Platform.OS === 'web'
    ? 'http://localhost/petcare-api/create_order.php'
    : 'http://192.168.1.8/petcare-api/create_order.php';

type PaymentMethodType = 'COD' | 'BANK' | 'MOMO';
type ShippingMethodType = 'standard' | 'express';

const LOCAL_QR_IMAGE = require('@/assets/images/vietqr-mb-phamthilananh.png');
const LOCAL_MOMO_QR_IMAGE = require('@/assets/images/momo-qr-phamthilananh.png');

function getVietQrUrl(amount?: number, memo?: string) {
  const amt = amount && amount > 0 ? `&amount=${Math.round(amount)}` : '';
  const info = memo ? `&addInfo=${encodeURIComponent(memo)}` : '&addInfo=PETCARE';
  return `https://img.vietqr.io/image/MB-0911191720-compact2.png?accountName=PHAM%20THI%20LAN%20ANH${amt}${info}`;
}

function getMomoQrUrl(amount?: number, memo?: string) {
  const amt = amount && amount > 0 ? `&amount=${Math.round(amount)}` : '';
  const info = memo ? `&addInfo=${encodeURIComponent(memo)}` : '&addInfo=PETCARE';
  return `https://img.vietqr.io/image/MOMO-PSP2601016000000499-compact2.png?accountName=PHAM%20THI%20LAN%20ANH${amt}${info}`;
}

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalItems } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalChannel, setQrModalChannel] = useState<'bank' | 'momo'>('bank');
  const [copiedStk, setCopiedStk] = useState(false);
  const [copiedMomo, setCopiedMomo] = useState(false);

  const handleCopyStk = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('0911191720');
      setCopiedStk(true);
      setTimeout(() => setCopiedStk(false), 2000);
    } else {
      alert('Đã sao chép STK: 0911191720 (MB Bank - PHAM THI LAN ANH)');
    }
  };

  const handleCopyMomo = (text = '0911191720') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMomo(true);
      setTimeout(() => setCopiedMomo(false), 2000);
    } else {
      alert(`Đã sao chép: ${text} (Ví MoMo - PHAM THI LAN ANH)`);
    }
  };

  // ==========================================
  // ĐỊA CHỈ NHẬN HÀNG (TRONG NƯỚC & QUỐC TẾ)
  // ==========================================
  const [addressRegion, setAddressRegion] = useState<'domestic' | 'international'>('domestic');

  // Trong nước: Tỉnh/TP -> Quận/Huyện -> Phường/Xã -> Số nhà/xóm thôn
  const [selectedProvince, setSelectedProvince] = useState<ProvinceItem | null>(
    VIETNAM_PROVINCES[0] // Mặc định: Hà Nội
  );
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem | null>(
    VIETNAM_PROVINCES[0].districts[0] // Mặc định: Quận Cầu Giấy
  );
  const [selectedWard, setSelectedWard] = useState<WardItem | null>(
    VIETNAM_PROVINCES[0].districts[0].wards[0] // Mặc định: Phường Dịch Vọng Hậu
  );
  const [streetAddress, setStreetAddress] = useState(''); // Ô nhập số nhà, xóm thôn, ngõ ngách, tên đường

  // Nước ngoài (Quốc tế):
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(INTERNATIONAL_COUNTRIES[0]);
  const [foreignCustomCountry, setForeignCustomCountry] = useState('');
  const [foreignState, setForeignState] = useState(''); // Bang / Tỉnh
  const [foreignCity, setForeignCity] = useState(''); // Thành phố
  const [foreignZipCode, setForeignZipCode] = useState(''); // Mã bưu chính
  const [foreignStreet, setForeignStreet] = useState(''); // Số nhà, tên đường chi tiết

  // Modal chọn danh sách (Picker Modal)
  const [pickerModalType, setPickerModalType] = useState<
    'province' | 'district' | 'ward' | 'country' | null
  >(null);
  const [pickerSearch, setPickerSearch] = useState('');

  // Tự động ghép nối địa chỉ hoàn chỉnh
  const computedAddress = useMemo(() => {
    if (addressRegion === 'domestic') {
      const parts: string[] = [];
      if (streetAddress.trim()) parts.push(streetAddress.trim());
      if (selectedWard) parts.push(selectedWard.name);
      if (selectedDistrict) parts.push(selectedDistrict.name);
      if (selectedProvince) parts.push(selectedProvince.name);
      return parts.join(', ');
    } else {
      const parts: string[] = [];
      if (foreignStreet.trim()) parts.push(foreignStreet.trim());
      if (foreignCity.trim()) parts.push(foreignCity.trim());
      if (foreignState.trim()) parts.push(foreignState.trim());
      if (foreignZipCode.trim()) parts.push(`Zip: ${foreignZipCode.trim()}`);
      const countryName =
        selectedCountry.code === 'OTHER' && foreignCustomCountry.trim()
          ? foreignCustomCountry.trim()
          : selectedCountry.name;
      parts.push(countryName);
      return parts.join(', ');
    }
  }, [
    addressRegion,
    streetAddress,
    selectedWard,
    selectedDistrict,
    selectedProvince,
    foreignStreet,
    foreignCity,
    foreignState,
    foreignZipCode,
    selectedCountry,
    foreignCustomCountry,
  ]);

  const openPickerModal = (type: 'province' | 'district' | 'ward' | 'country') => {
    if (type === 'district' && !selectedProvince) {
      alert('Vui lòng chọn Tỉnh / Thành phố trước!');
      return;
    }
    if (type === 'ward' && !selectedDistrict) {
      alert('Vui lòng chọn Quận / Huyện trước!');
      return;
    }
    setPickerSearch('');
    setPickerModalType(type);
  };

  const handleSelectPickerItem = (item: any) => {
    if (pickerModalType === 'province') {
      setSelectedProvince(item);
      const firstDist = item.districts && item.districts.length > 0 ? item.districts[0] : null;
      setSelectedDistrict(firstDist);
      setSelectedWard(firstDist && firstDist.wards && firstDist.wards.length > 0 ? firstDist.wards[0] : null);
    } else if (pickerModalType === 'district') {
      setSelectedDistrict(item);
      setSelectedWard(item.wards && item.wards.length > 0 ? item.wards[0] : null);
    } else if (pickerModalType === 'ward') {
      setSelectedWard(item);
    } else if (pickerModalType === 'country') {
      setSelectedCountry(item);
    }
    setPickerModalType(null);
  };

  const filteredPickerItems = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    let list: any[] = [];
    if (pickerModalType === 'province') {
      list = VIETNAM_PROVINCES;
    } else if (pickerModalType === 'district') {
      list = selectedProvince?.districts || [];
    } else if (pickerModalType === 'ward') {
      list = selectedDistrict?.wards || [];
    } else if (pickerModalType === 'country') {
      list = INTERNATIONAL_COUNTRIES;
    }

    if (!q) return list;
    return list.filter((item: any) => (item.name || '').toLowerCase().includes(q));
  }, [pickerModalType, pickerSearch, selectedProvince, selectedDistrict]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('COD');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>('standard');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  // Phí ship
  const baseShipping = subtotal >= 300000 ? 0 : 25000;
  const shippingFee = shippingMethod === 'express' ? (baseShipping + 20000) : baseShipping;

  // Giảm giá voucher
  let voucherDiscount = 0;
  if (appliedVoucher) {
    voucherDiscount = appliedVoucher.discount;
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const handleApplyVoucher = (codeToApply?: string) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    setVoucherError('');
    if (!code) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      return;
    }

    if (code === 'PETCARE10') {
      const discount = Math.min(50000, Math.round(subtotal * 0.1));
      setAppliedVoucher({ code, discount, label: 'Giảm 10% (Tối đa 50k)' });
      setVoucherInput('');
    } else if (code === 'FREESHIP') {
      const discount = shippingFee;
      setAppliedVoucher({ code, discount, label: 'Miễn phí giao hàng' });
      setVoucherInput('');
    } else if (code === 'PETVIP50') {
      if (subtotal < 200000) {
        setVoucherError('Mã PETVIP50 áp dụng cho đơn từ 200.000₫');
        return;
      }
      setAppliedVoucher({ code, discount: 50000, label: 'Giảm ngay 50.000₫' });
      setVoucherInput('');
    } else {
      setVoucherError('Mã không hợp lệ hoặc đã hết lượt dùng');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
  };

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    const finalAddress = computedAddress.trim();
    if (!name.trim() || !phone.trim() || !finalAddress) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_CREATE_ORDER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: finalAddress,
          customer_note: note,
          shipping_method: shippingMethod,
          payment_method: paymentMethod,
          voucher_code: appliedVoucher ? appliedVoucher.code : '',
          discount_amount: voucherDiscount,
          shipping_fee: shippingFee,
          total_amount: finalTotal,
          items: cartItems.map((ci) => ({
            id: ci.id,
            name: ci.name,
            price: ci.price,
            quantity: ci.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        const orderData = result.data || {
          order_code: 'PC' + Math.floor(100000 + Math.random() * 900000),
          total_amount: finalTotal,
        };
        setQrModalChannel(paymentMethod === 'MOMO' ? 'momo' : 'bank');
        setSuccessOrder({
          code: orderData.order_code,
          total: finalTotal,
          name,
          phone,
          address: finalAddress,
          paymentMethod,
          shippingMethod,
          itemsCount: cartItems.length,
        });
        clearCart();
      } else {
        alert(result.message || 'Lỗi khi tạo đơn hàng!');
      }
    } catch (error) {
      console.error('Lỗi checkout:', error);
      const mockCode = 'PC' + Math.floor(100000 + Math.random() * 900000);
      setQrModalChannel(paymentMethod === 'MOMO' ? 'momo' : 'bank');
      setSuccessOrder({
        code: mockCode,
        total: finalTotal,
        name,
        phone,
        address: finalAddress,
        paymentMethod,
        shippingMethod,
        itemsCount: cartItems.length,
      });
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Tiếp tục mua sắm</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Giỏ Hàng Của Bạn ({totalItems})</Text>
            <Text style={styles.headerSub}>Đảm bảo an toàn • Đổi trả dễ dàng</Text>
          </View>
          <View style={{ width: 80 }} />
        </View>
      </View>

      {!cartItems || cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <CartIcon size={34} color="#0EA5E9" />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Chưa có món ăn nào được chọn cho bé cưng.
          </Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/')}>
            <Text style={styles.shopNowText}>Chọn món ngon cho bé ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.layoutRow}>
            {/* CỘT MÓN HÀNG */}
            <View style={styles.itemsColumn}>
              {/* Danh sách món hàng */}
              <View style={styles.cardBox}>
                <View style={styles.boxHeaderRow}>
                  <Text style={styles.boxTitle}>Món ăn đã chọn ({cartItems.length})</Text>
                </View>

                {cartItems.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      contentFit="cover"
                    />

                    <View style={styles.itemInfo}>
                      <View>
                        {/* TÊN SẢN PHẨM CHỮ ĐẬM MÀU XANH */}
                        <Text style={styles.itemName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        {/* GIÁ SẢN PHẨM CHỮ ĐỎ TÔ ĐẬM */}
                        <Text style={styles.itemPrice}>
                          {Number(item.price).toLocaleString('vi-VN')} ₫
                        </Text>
                      </View>

                      <View style={styles.itemControlsRow}>
                        <View style={styles.stepper}>
                          <TouchableOpacity
                            style={styles.stepBtn}
                            onPress={() => updateQuantity(item.id, -1)}
                          >
                            <Text style={styles.stepBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.stepVal}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.stepBtn}
                            onPress={() => updateQuantity(item.id, 1)}
                          >
                            <Text style={styles.stepBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          onPress={() => removeFromCart(item.id)}
                          style={styles.deleteBtn}
                        >
                          <Text style={styles.deleteText}>Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Lựa chọn phương thức giao nhận */}
              <View style={styles.cardBox}>
                <View style={styles.boxHeaderRow}>
                  <Text style={styles.boxTitle}>Phương thức vận chuyển</Text>
                </View>
                <View style={styles.shippingOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.shippingOptionCard,
                      shippingMethod === 'standard' && styles.shippingOptionCardActive,
                    ]}
                    onPress={() => setShippingMethod('standard')}
                    activeOpacity={0.85}
                  >
                    <View style={styles.shippingRadioCircle}>
                      {shippingMethod === 'standard' && <View style={styles.shippingRadioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.shippingOptionTitle}>Giao Tiêu Chuẩn (1 - 2 ngày)</Text>
                      <Text style={styles.shippingOptionDesc}>
                        {subtotal >= 300000 ? 'Miễn phí (Đơn từ 300k)' : 'Phí 25.000₫ toàn quốc'}
                      </Text>
                    </View>
                    <Text style={styles.shippingOptionPrice}>
                      {subtotal >= 300000 ? '0₫' : '25.000₫'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.shippingOptionCard,
                      shippingMethod === 'express' && styles.shippingOptionCardActive,
                    ]}
                    onPress={() => setShippingMethod('express')}
                    activeOpacity={0.85}
                  >
                    <View style={styles.shippingRadioCircle}>
                      {shippingMethod === 'express' && <View style={styles.shippingRadioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.shippingOptionTitle}>Giao Hỏa Tốc 2H (Nội thành)</Text>
                      <Text style={styles.shippingOptionDesc}>Đóng gói giữ lạnh & giao hỏa tốc tận nhà</Text>
                    </View>
                    <Text style={styles.shippingOptionPrice}>
                      {subtotal >= 300000 ? '20.000₫' : '45.000₫'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mã giảm giá */}
              <View style={styles.cardBox}>
                <View style={styles.boxHeaderRow}>
                  <Text style={styles.boxTitle}>Mã giảm giá (Voucher)</Text>
                </View>

                {appliedVoucher ? (
                  <View style={styles.appliedVoucherBox}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appliedVoucherCode}>Mã: {appliedVoucher.code}</Text>
                      <Text style={styles.appliedVoucherLabel}>{appliedVoucher.label}</Text>
                    </View>
                    <TouchableOpacity onPress={handleRemoveVoucher} style={styles.removeVoucherBtn}>
                      <Text style={styles.removeVoucherText}>Gỡ bỏ ✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.voucherInputRow}>
                      <TextInput
                        style={styles.voucherInput}
                        placeholder="Nhập mã voucher (VD: PETCARE10)"
                        placeholderTextColor="#94A3B8"
                        value={voucherInput}
                        onChangeText={setVoucherInput}
                        autoCapitalize="characters"
                      />
                      <TouchableOpacity
                        style={styles.applyVoucherBtn}
                        onPress={() => handleApplyVoucher()}
                      >
                        <Text style={styles.applyVoucherBtnText}>Áp dụng</Text>
                      </TouchableOpacity>
                    </View>
                    {voucherError ? (
                      <Text style={styles.voucherErrorText}>{voucherError}</Text>
                    ) : null}

                    <Text style={styles.quickVoucherLabel}>Mã ưu đãi gợi ý:</Text>
                    <View style={styles.quickVoucherWrap}>
                      {[
                        { code: 'PETCARE10', desc: 'Giảm 10%' },
                        { code: 'FREESHIP', desc: 'Freeship' },
                        { code: 'PETVIP50', desc: 'Giảm 50k' },
                      ].map((v) => (
                        <TouchableOpacity
                          key={v.code}
                          style={styles.quickVoucherChip}
                          onPress={() => handleApplyVoucher(v.code)}
                        >
                          <Text style={styles.quickVoucherChipCode}>{v.code}</Text>
                          <Text style={styles.quickVoucherChipDesc}>• {v.desc}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Cam kết */}
              <View style={styles.guaranteeBox}>
                <View style={styles.guaranteeItem}>
                  <ShieldCheckIcon size={16} color="#0EA5E9" />
                  <Text style={styles.guaranteeText}>100% Chính hãng có tem thú y</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <TruckIcon size={16} color="#059669" />
                  <Text style={styles.guaranteeText}>Đóng gói an toàn chống ẩm</Text>
                </View>
              </View>
            </View>

            {/* CỘT THÔNG TIN NGƯỜI NHẬN & THANH TOÁN */}
            <View style={styles.checkoutColumn}>
              <View style={styles.cardBox}>
                <Text style={styles.boxTitle}>Thông tin nhận hàng</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Họ và tên người nhận *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Số điện thoại liên hệ *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: 0988 123 456"
                    placeholderTextColor="#94A3B8"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* ============================================================ */}
                {/* ĐỊA CHỈ NHẬN HÀNG: TRONG NƯỚC (VIỆT NAM) & NƯỚC NGOÀI */}
                {/* ============================================================ */}
                <View style={styles.inputGroup}>
                  <View style={styles.addressSectionHeader}>
                    <Text style={styles.label}>Khu vực nhận hàng *</Text>
                    <View style={styles.addressRegionBadge}>
                      <Text style={styles.addressRegionBadgeText}>
                        {addressRegion === 'domestic' ? '🇻🇳 Toàn quốc' : '✈️ Quốc tế'}
                      </Text>
                    </View>
                  </View>

                  {/* TAB CHUYỂN ĐỔI: TRONG NƯỚC VS NƯỚC NGOÀI */}
                  <View style={styles.addressTypeSelector}>
                    <TouchableOpacity
                      style={[
                        styles.addressTypeTab,
                        addressRegion === 'domestic' && styles.addressTypeTabActive,
                      ]}
                      onPress={() => setAddressRegion('domestic')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.addressTypeTabText,
                          addressRegion === 'domestic' && styles.addressTypeTabTextActive,
                        ]}
                      >
                        🇻🇳 Trong nước (Việt Nam)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.addressTypeTab,
                        addressRegion === 'international' && styles.addressTypeTabActive,
                      ]}
                      onPress={() => setAddressRegion('international')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.addressTypeTabText,
                          addressRegion === 'international' && styles.addressTypeTabTextActive,
                        ]}
                      >
                        🌍 Nước ngoài (Quốc tế)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* FORM 1: ĐỊA CHỈ TRONG NƯỚC (VIỆT NAM) */}
                  {addressRegion === 'domestic' ? (
                    <View style={styles.domesticAddressBox}>
                      {/* CHỌN TỈNH / THÀNH PHỐ */}
                      <View style={styles.subInputGroup}>
                        <Text style={styles.subLabel}>Tỉnh / Thành phố *</Text>
                        <TouchableOpacity
                          style={styles.dropdownTrigger}
                          onPress={() => openPickerModal('province')}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.dropdownTriggerValue}>
                            {selectedProvince ? selectedProvince.name : 'Chọn Tỉnh / Thành phố'}
                          </Text>
                          <Text style={styles.dropdownChevron}>▼</Text>
                        </TouchableOpacity>
                      </View>

                      {/* CHỌN QUẬN / HUYỆN & PHƯỜNG / XÃ */}
                      <View style={styles.districtWardRow}>
                        <View style={[styles.subInputGroup, { flex: 1 }]}>
                          <Text style={styles.subLabel}>Quận / Huyện *</Text>
                          <TouchableOpacity
                            style={styles.dropdownTrigger}
                            onPress={() => openPickerModal('district')}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.dropdownTriggerValue} numberOfLines={1}>
                              {selectedDistrict ? selectedDistrict.name : 'Chọn Quận / Huyện'}
                            </Text>
                            <Text style={styles.dropdownChevron}>▼</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.subInputGroup, { flex: 1 }]}>
                          <Text style={styles.subLabel}>Phường / Xã *</Text>
                          <TouchableOpacity
                            style={styles.dropdownTrigger}
                            onPress={() => openPickerModal('ward')}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.dropdownTriggerValue} numberOfLines={1}>
                              {selectedWard ? selectedWard.name : 'Chọn Phường / Xã'}
                            </Text>
                            <Text style={styles.dropdownChevron}>▼</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* SỐ NHÀ, TÊN ĐƯỜNG, XÓM THÔN, NGÕ NGÁCH */}
                      <View style={styles.subInputGroup}>
                        <Text style={styles.subLabel}>Số nhà, tên ngõ, xóm thôn, tên đường *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="VD: Số 12 ngõ 4 xóm Thôn, tổ 5, ngách 15..."
                          placeholderTextColor="#94A3B8"
                          value={streetAddress}
                          onChangeText={setStreetAddress}
                        />
                      </View>

                      {/* XEM TRƯỚC ĐỊA CHỈ HOÀN CHỈNH */}
                      {computedAddress ? (
                        <View style={styles.addressPreviewBox}>
                          <Text style={styles.addressPreviewIcon}>📍</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.addressPreviewTitle}>Địa chỉ giao hàng hoàn chỉnh:</Text>
                            <Text style={styles.addressPreviewText}>{computedAddress}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    /* FORM 2: ĐỊA CHỈ NƯỚC NGOÀI (QUỐC TẾ) */
                    <View style={styles.internationalAddressBox}>
                      {/* QUỐC GIA */}
                      <View style={styles.subInputGroup}>
                        <Text style={styles.subLabel}>Quốc gia (Country) *</Text>
                        <TouchableOpacity
                          style={styles.dropdownTrigger}
                          onPress={() => openPickerModal('country')}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.dropdownTriggerValue}>
                            {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Chọn Quốc gia'}
                          </Text>
                          <Text style={styles.dropdownChevron}>▼</Text>
                        </TouchableOpacity>
                      </View>

                      {selectedCountry?.code === 'OTHER' && (
                        <View style={styles.subInputGroup}>
                          <Text style={styles.subLabel}>Tên quốc gia của bạn *</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Nhập tên quốc gia..."
                            placeholderTextColor="#94A3B8"
                            value={foreignCustomCountry}
                            onChangeText={setForeignCustomCountry}
                          />
                        </View>
                      )}

                      {/* BANG / TỈNH & THÀNH PHỐ */}
                      <View style={styles.districtWardRow}>
                        <View style={[styles.subInputGroup, { flex: 1 }]}>
                          <Text style={styles.subLabel}>Bang / Tỉnh (State/Province) *</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="VD: California, Tokyo..."
                            placeholderTextColor="#94A3B8"
                            value={foreignState}
                            onChangeText={setForeignState}
                          />
                        </View>
                        <View style={[styles.subInputGroup, { flex: 1 }]}>
                          <Text style={styles.subLabel}>Thành phố (City) *</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="VD: Los Angeles, Sydney..."
                            placeholderTextColor="#94A3B8"
                            value={foreignCity}
                            onChangeText={setForeignCity}
                          />
                        </View>
                      </View>

                      {/* MÃ BƯU CHÍNH */}
                      <View style={styles.subInputGroup}>
                        <Text style={styles.subLabel}>Mã bưu chính (Zip / Postal Code) *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="VD: 90001, 100-0001..."
                          placeholderTextColor="#94A3B8"
                          value={foreignZipCode}
                          onChangeText={setForeignZipCode}
                        />
                      </View>

                      {/* ĐỊA CHỈ CHI TIẾT */}
                      <View style={styles.subInputGroup}>
                        <Text style={styles.subLabel}>Số nhà, tên đường, căn hộ (Street & Apt/Suite) *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="VD: 123 Main Street, Apt 4B..."
                          placeholderTextColor="#94A3B8"
                          value={foreignStreet}
                          onChangeText={setForeignStreet}
                        />
                      </View>

                      {/* XEM TRƯỚC ĐỊA CHỈ QUỐC TẾ */}
                      {computedAddress ? (
                        <View style={styles.addressPreviewBox}>
                          <Text style={styles.addressPreviewIcon}>🌍</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.addressPreviewTitle}>Địa chỉ nhận hàng quốc tế:</Text>
                            <Text style={styles.addressPreviewText}>{computedAddress}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ghi chú (Tùy chọn)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="VD: Giao giờ hành chính, gọi trước khi tới..."
                    placeholderTextColor="#94A3B8"
                    value={note}
                    onChangeText={setNote}
                  />
                </View>
              </View>

              {/* Phương thức thanh toán */}
              <View style={styles.cardBox}>
                <Text style={styles.boxTitle}>Phương thức thanh toán</Text>

                <TouchableOpacity
                  style={[
                    styles.paymentMethodOption,
                    paymentMethod === 'COD' && styles.paymentMethodOptionActive,
                  ]}
                  onPress={() => setPaymentMethod('COD')}
                >
                  <View style={styles.shippingRadioCircle}>
                    {paymentMethod === 'COD' && <View style={styles.shippingRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentMethodTitle}>Tiền mặt khi nhận hàng (COD)</Text>
                    <Text style={styles.paymentMethodSub}>Kiểm tra hàng trước khi thanh toán</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethodOption,
                    paymentMethod === 'BANK' && styles.paymentMethodOptionActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod('BANK');
                    setQrModalChannel('bank');
                  }}
                >
                  <View style={styles.shippingRadioCircle}>
                    {paymentMethod === 'BANK' && <View style={styles.shippingRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentMethodTitle}>Chuyển khoản Ngân hàng (VietQR MB Bank)</Text>
                    <Text style={styles.paymentMethodSub}>Quét mã QR tự động xác nhận đơn nhanh</Text>
                  </View>
                </TouchableOpacity>

                {/* THẺ PREVIEW MÃ QR KHI CHỌN VIETQR */}
                {paymentMethod === 'BANK' && (
                  <View style={styles.vietQrInlineCard}>
                    <View style={styles.vietQrCardTop}>
                      <View style={styles.vietQrBadgeRow}>
                        <Text style={styles.vietQrBadgeText}>⚡ MB Bank • Quét tự động điền tiền & nội dung</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.vietQrZoomTrigger}
                        onPress={() => {
                          setQrModalChannel('bank');
                          setShowQrModal(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.vietQrZoomTriggerText}>🔍 Phóng to QR</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.vietQrCardBody}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setQrModalChannel('bank');
                          setShowQrModal(true);
                        }}
                        style={styles.vietQrThumbWrapper}
                      >
                        <Image
                          source={{ uri: getVietQrUrl(finalTotal, name ? `PETCARE ${name}` : 'PETCARE') }}
                          defaultSource={LOCAL_QR_IMAGE}
                          style={styles.vietQrThumbImage}
                          contentFit="contain"
                        />
                        <View style={styles.vietQrClickHint}>
                          <Text style={styles.vietQrClickHintText}>Bấm để phóng to</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.vietQrDetailsCol}>
                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Ngân hàng:</Text>
                          <Text style={styles.bankDetailValBold}>MB Bank (Quân Đội)</Text>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Chủ tài khoản:</Text>
                          <Text style={styles.bankDetailValBold}>PHAM THI LAN ANH</Text>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Số tài khoản:</Text>
                          <View style={styles.stkRow}>
                            <Text style={styles.bankDetailStk}>0911191720</Text>
                            <TouchableOpacity
                              style={styles.copyStkBtn}
                              onPress={handleCopyStk}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.copyStkBtnText}>
                                {copiedStk ? '✓ Đã chép' : 'Sao chép'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Số tiền:</Text>
                          <Text style={styles.bankDetailAmount}>
                            {Number(finalTotal).toLocaleString('vi-VN')} ₫
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.paymentMethodOption,
                    paymentMethod === 'MOMO' && styles.paymentMethodOptionActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod('MOMO');
                    setQrModalChannel('momo');
                  }}
                >
                  <View style={styles.shippingRadioCircle}>
                    {paymentMethod === 'MOMO' && <View style={styles.shippingRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentMethodTitle}>Ví điện tử MoMo (Napas 247)</Text>
                    <Text style={styles.paymentMethodSub}>Quét mã MoMo hoặc chuyển khoản siêu tốc</Text>
                  </View>
                </TouchableOpacity>

                {/* THẺ PREVIEW MÃ QR KHI CHỌN MOMO */}
                {paymentMethod === 'MOMO' && (
                  <View style={styles.momoInlineCard}>
                    <View style={styles.momoCardTop}>
                      <View style={styles.momoBadgeRow}>
                        <Text style={styles.momoBadgeText}>🦩 MoMo • Quét mã chuyển tiền siêu tốc</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.momoZoomTrigger}
                        onPress={() => {
                          setQrModalChannel('momo');
                          setShowQrModal(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.momoZoomTriggerText}>🔍 Phóng to QR</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.momoCardBody}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setQrModalChannel('momo');
                          setShowQrModal(true);
                        }}
                        style={styles.momoThumbWrapper}
                      >
                        <Image
                          source={{ uri: getMomoQrUrl(finalTotal, name ? `PETCARE ${name}` : 'PETCARE') }}
                          defaultSource={LOCAL_MOMO_QR_IMAGE}
                          style={styles.momoThumbImage}
                          contentFit="contain"
                        />
                        <View style={styles.momoClickHint}>
                          <Text style={styles.momoClickHintText}>Bấm để phóng to</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.momoDetailsCol}>
                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Kênh thụ hưởng:</Text>
                          <Text style={styles.momoValBold}>Ví MoMo (Napas 247)</Text>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Chủ tài khoản:</Text>
                          <Text style={styles.momoValBold}>PHAM THI LAN ANH</Text>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Số điện thoại:</Text>
                          <View style={styles.stkRow}>
                            <Text style={styles.momoDetailStk}>0911191720</Text>
                            <TouchableOpacity
                              style={styles.copyMomoBtn}
                              onPress={() => handleCopyMomo('0911191720')}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.copyMomoBtnText}>
                                {copiedMomo ? '✓ Đã chép' : 'Sao chép'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Số tài khoản MoMo:</Text>
                          <View style={styles.stkRow}>
                            <Text style={[styles.momoDetailStk, { fontSize: 11 }]}>PSP2601016000000499</Text>
                            <TouchableOpacity
                              style={styles.copyMomoBtn}
                              onPress={() => handleCopyMomo('PSP2601016000000499')}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.copyMomoBtnText}>
                                {copiedMomo ? '✓ Đã chép' : 'Sao chép'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.bankDetailItem}>
                          <Text style={styles.bankDetailLabel}>Số tiền:</Text>
                          <Text style={styles.bankDetailAmount}>
                            {Number(finalTotal).toLocaleString('vi-VN')} ₫
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* Bảng kê chi tiết */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryHeading}>Chi tiết đơn hàng</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tiền hàng ({cartItems.length} món):</Text>
                  <Text style={styles.summaryValue}>
                    {Number(subtotal).toLocaleString('vi-VN')} ₫
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                  <Text style={[styles.summaryValue, shippingFee === 0 && { color: '#059669' }]}>
                    {shippingFee === 0 ? 'Miễn phí' : `${Number(shippingFee).toLocaleString('vi-VN')} ₫`}
                  </Text>
                </View>

                {appliedVoucher ? (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: '#0284C7' }]}>
                      Khuyến mại ({appliedVoucher.code}):
                    </Text>
                    <Text style={[styles.summaryValue, { color: '#0284C7', fontWeight: '800' }]}>
                      -{Number(voucherDiscount).toLocaleString('vi-VN')} ₫
                    </Text>
                  </View>
                ) : null}

                <View style={styles.summaryDivider} />

                <View style={styles.summaryTotalRow}>
                  <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                  <Text style={styles.totalPrice}>
                    {Number(finalTotal).toLocaleString('vi-VN')} ₫
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.checkoutBtn, isSubmitting && { opacity: 0.7 }]}
                  onPress={handleCheckout}
                  disabled={isSubmitting}
                  activeOpacity={0.88}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.checkoutText}>ĐẶT HÀNG NGAY ➔</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.codNote}>
                  Giao dịch an toàn và hỗ trợ đổi trả miễn phí trong 7 ngày nếu không ưng ý.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* MODAL HOÀN TẤT */}
      <Modal visible={!!successOrder} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSuccessCard}>
            <View style={styles.modalIconWrap}>
              <Text style={{ fontSize: 32 }}>🎉</Text>
            </View>
            <Text style={styles.modalSuccessTitle}>Đặt Hàng Thành Công!</Text>
            <Text style={styles.modalSuccessSub}>
              Đơn hàng thức ăn cho bé đã được tiếp nhận và đang chuẩn bị giao.
            </Text>

            <View style={styles.modalInvoiceBox}>
              <View style={styles.modalInvoiceRow}>
                <Text style={styles.modalInvoiceLabel}>Mã đơn hàng:</Text>
                <Text style={styles.modalInvoiceValBold}>#{successOrder?.code}</Text>
              </View>
              <View style={styles.modalInvoiceRow}>
                <Text style={styles.modalInvoiceLabel}>Người nhận:</Text>
                <Text style={styles.modalInvoiceVal}>{successOrder?.name} ({successOrder?.phone})</Text>
              </View>
              <View style={styles.modalInvoiceRow}>
                <Text style={styles.modalInvoiceLabel}>Địa chỉ:</Text>
                <Text style={[styles.modalInvoiceVal, { flex: 1, textAlign: 'right' }]} numberOfLines={2}>
                  {successOrder?.address}
                </Text>
              </View>
              <View style={styles.modalInvoiceRow}>
                <Text style={styles.modalInvoiceLabel}>Thanh toán:</Text>
                <Text style={styles.modalInvoiceVal}>
                  {successOrder?.paymentMethod === 'COD' ? 'Tiền mặt COD' : successOrder?.paymentMethod === 'BANK' ? 'Chuyển khoản QR' : 'Ví MoMo'}
                </Text>
              </View>
              <View style={[styles.modalInvoiceRow, { borderTopWidth: 1, borderTopColor: '#BAE6FD', paddingTop: 8, marginTop: 4 }]}>
                <Text style={styles.modalInvoiceLabelBold}>Tổng tiền:</Text>
                <Text style={styles.modalInvoicePrice}>
                  {Number(successOrder?.total || 0).toLocaleString('vi-VN')} ₫
                </Text>
              </View>
            </View>

            {/* MÃ QR THANH TOÁN TRONG HÓA ĐƠN HOÀN TẤT */}
            <View style={styles.invoiceQrCardBox}>
              <View style={styles.invoiceQrCardHead}>
                <Text style={styles.invoiceQrCardTitle}>
                  📲 Quét mã QR thanh toán nhanh:
                </Text>
                <TouchableOpacity
                  style={styles.invoiceQrZoomBtn}
                  onPress={() => setShowQrModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.invoiceQrZoomBtnText}>🔍 Phóng to QR</Text>
                </TouchableOpacity>
              </View>

              {/* TABS CHUYỂN ĐỔI NGÂN HÀNG MB VÀ VÍ MOMO */}
              <View style={styles.invoiceQrTabRow}>
                <TouchableOpacity
                  style={[
                    styles.invoiceQrTabBtn,
                    qrModalChannel === 'bank' && styles.invoiceQrTabBtnActiveBank,
                  ]}
                  onPress={() => setQrModalChannel('bank')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.invoiceQrTabText,
                      qrModalChannel === 'bank' && styles.invoiceQrTabTextActiveBank,
                    ]}
                  >
                    🏦 MB Bank (VietQR)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.invoiceQrTabBtn,
                    qrModalChannel === 'momo' && styles.invoiceQrTabBtnActiveMomo,
                  ]}
                  onPress={() => setQrModalChannel('momo')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.invoiceQrTabText,
                      qrModalChannel === 'momo' && styles.invoiceQrTabTextActiveMomo,
                    ]}
                  >
                    🦩 Ví MoMo
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowQrModal(true)}
                style={[
                  styles.invoiceQrCardImageWrap,
                  qrModalChannel === 'momo' && { borderColor: '#FBCFE8' },
                ]}
              >
                <Image
                  source={{
                    uri:
                      qrModalChannel === 'momo'
                        ? getMomoQrUrl(successOrder?.total, successOrder?.code)
                        : getVietQrUrl(successOrder?.total, successOrder?.code),
                  }}
                  defaultSource={qrModalChannel === 'momo' ? LOCAL_MOMO_QR_IMAGE : LOCAL_QR_IMAGE}
                  style={styles.invoiceQrCardImage}
                  contentFit="contain"
                />
                <View
                  style={[
                    styles.invoiceQrCardTapHint,
                    qrModalChannel === 'momo' && { backgroundColor: 'rgba(216, 45, 139, 0.85)' },
                  ]}
                >
                  <Text style={styles.invoiceQrCardTapHintText}>🔍 Chạm vào ảnh để phóng to mã QR</Text>
                </View>
              </TouchableOpacity>

              {qrModalChannel === 'bank' ? (
                <View style={styles.invoiceQrBankSummary}>
                  <Text style={styles.invoiceQrBankLine}>
                    🏦 Ngân hàng MB • STK:{' '}
                    <Text style={{ fontWeight: '800', color: '#0284C7' }}>0911191720</Text>
                  </Text>
                  <Text style={styles.invoiceQrBankLine}>
                    👤 Chủ TK: <Text style={{ fontWeight: '800' }}>PHAM THI LAN ANH</Text>
                  </Text>
                  <Text style={styles.invoiceQrBankLine}>
                    📝 Nội dung:{' '}
                    <Text style={{ fontWeight: '800', color: '#DC2626' }}>#{successOrder?.code}</Text>
                  </Text>
                </View>
              ) : (
                <View style={[styles.invoiceQrBankSummary, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
                  <Text style={styles.invoiceQrBankLine}>
                    🦩 Ví MoMo • SĐT:{' '}
                    <Text style={{ fontWeight: '800', color: '#D82D8B' }}>0911191720</Text>
                  </Text>
                  <Text style={styles.invoiceQrBankLine}>
                    💳 STK MoMo:{' '}
                    <Text style={{ fontWeight: '800', color: '#A50064', fontSize: 10.5 }}>PSP2601016000000499</Text>
                  </Text>
                  <Text style={styles.invoiceQrBankLine}>
                    👤 Chủ TK: <Text style={{ fontWeight: '800' }}>PHAM THI LAN ANH</Text>
                  </Text>
                  <Text style={styles.invoiceQrBankLine}>
                    📝 Lời nhắn:{' '}
                    <Text style={{ fontWeight: '800', color: '#DC2626' }}>#{successOrder?.code}</Text>
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => {
                  setSuccessOrder(null);
                  router.push('/');
                }}
              >
                <Text style={styles.modalBtnSecondaryText}>Về cửa hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={() => {
                  setSuccessOrder(null);
                  router.push('/orders');
                }}
              >
                <Text style={styles.modalBtnPrimaryText}>Xem đơn hàng ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* MODAL CHỌN ĐỊA DANH / QUỐC GIA (TỈNH, HUYỆN, XÃ, NƯỚC) */}
      <Modal visible={!!pickerModalType} transparent animationType="slide">
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                {pickerModalType === 'province' && '🏢 Chọn Tỉnh / Thành phố'}
                {pickerModalType === 'district' && `🏘️ Chọn Quận / Huyện (${selectedProvince?.name || ''})`}
                {pickerModalType === 'ward' && `🏡 Chọn Phường / Xã (${selectedDistrict?.name || ''})`}
                {pickerModalType === 'country' && '🌍 Chọn Quốc gia'}
              </Text>
              <TouchableOpacity
                onPress={() => setPickerModalType(null)}
                style={styles.pickerModalCloseBtn}
              >
                <CloseIcon size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Ô TÌM KIẾM NHANH */}
            <View style={styles.pickerSearchBox}>
              <SearchIcon size={16} color="#94A3B8" />
              <TextInput
                style={styles.pickerSearchInput}
                placeholder="Gõ để tìm kiếm nhanh..."
                placeholderTextColor="#94A3B8"
                value={pickerSearch}
                onChangeText={setPickerSearch}
                autoFocus
              />
              {pickerSearch.length > 0 && (
                <TouchableOpacity onPress={() => setPickerSearch('')}>
                  <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* DANH SÁCH CUỘN */}
            <ScrollView style={styles.pickerScrollList} keyboardShouldPersistTaps="handled">
              {filteredPickerItems.map((item: any) => {
                const isSelected =
                  (pickerModalType === 'province' && selectedProvince?.id === item.id) ||
                  (pickerModalType === 'district' && selectedDistrict?.id === item.id) ||
                  (pickerModalType === 'ward' && selectedWard?.id === item.id) ||
                  (pickerModalType === 'country' && selectedCountry?.code === item.code);

                return (
                  <TouchableOpacity
                    key={item.id || item.code}
                    style={[styles.pickerItemRow, isSelected && styles.pickerItemRowActive]}
                    onPress={() => handleSelectPickerItem(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        isSelected && styles.pickerItemTextActive,
                      ]}
                    >
                      {item.flag ? `${item.flag} ` : ''}{item.name}
                    </Text>
                    {isSelected && <Text style={styles.pickerItemCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
              {filteredPickerItems.length === 0 && (
                <View style={styles.pickerEmpty}>
                  <Text style={styles.pickerEmptyText}>Không tìm thấy kết quả phù hợp</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* MODAL PHÓNG TO MÃ QR THANH TOÁN TOÀN MÀN HÌNH */}
      <Modal visible={showQrModal} transparent animationType="fade">
        <View style={styles.qrZoomModalOverlay}>
          <View style={styles.qrZoomModalCard}>
            <View style={styles.qrZoomModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.qrZoomModalTitle}>
                  {qrModalChannel === 'momo' ? 'Mã QR Thanh Toán MoMo' : 'Mã QR Thanh Toán MB Bank'}
                </Text>
                <Text style={styles.qrZoomModalSub}>
                  {qrModalChannel === 'momo'
                    ? 'Quét mã bằng App MoMo hoặc App Ngân hàng bất kỳ'
                    : 'Quét mã bằng App Ngân hàng bất kỳ (MB, VCB, MoMo...)'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.qrZoomModalCloseBtn}
                onPress={() => setShowQrModal(false)}
              >
                <CloseIcon size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* TAB CHUYỂN KÊNH TRONG MODAL ZOOM */}
            <View style={styles.qrZoomTabRow}>
              <TouchableOpacity
                style={[
                  styles.qrZoomTabBtn,
                  qrModalChannel === 'bank' && styles.qrZoomTabBtnActiveBank,
                ]}
                onPress={() => setQrModalChannel('bank')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.qrZoomTabText,
                    qrModalChannel === 'bank' && styles.qrZoomTabTextActiveBank,
                  ]}
                >
                  🏦 MB Bank (VietQR)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.qrZoomTabBtn,
                  qrModalChannel === 'momo' && styles.qrZoomTabBtnActiveMomo,
                ]}
                onPress={() => setQrModalChannel('momo')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.qrZoomTabText,
                    qrModalChannel === 'momo' && styles.qrZoomTabTextActiveMomo,
                  ]}
                >
                  🦩 Ví MoMo
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.qrZoomImageCard,
                qrModalChannel === 'momo' && { borderColor: '#FBCFE8' },
              ]}
            >
              <Image
                source={{
                  uri:
                    qrModalChannel === 'momo'
                      ? getMomoQrUrl(
                          successOrder?.total || finalTotal,
                          successOrder?.code || (name ? `PETCARE ${name}` : 'PETCARE')
                        )
                      : getVietQrUrl(
                          successOrder?.total || finalTotal,
                          successOrder?.code || (name ? `PETCARE ${name}` : 'PETCARE')
                        ),
                }}
                defaultSource={qrModalChannel === 'momo' ? LOCAL_MOMO_QR_IMAGE : LOCAL_QR_IMAGE}
                style={styles.qrZoomBigImage}
                contentFit="contain"
              />
            </View>

            {qrModalChannel === 'bank' ? (
              <View style={styles.qrZoomInfoBox}>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Ngân hàng:</Text>
                  <Text style={styles.qrZoomInfoValBold}>MB Bank (Ngân hàng Quân Đội)</Text>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Chủ tài khoản:</Text>
                  <Text style={styles.qrZoomInfoValBold}>PHAM THI LAN ANH</Text>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Số tài khoản:</Text>
                  <View style={styles.stkRow}>
                    <Text style={styles.qrZoomStkHighlight}>0911191720</Text>
                    <TouchableOpacity
                      style={styles.copyStkBtn}
                      onPress={handleCopyStk}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.copyStkBtnText}>
                        {copiedStk ? '✓ Đã sao chép' : 'Sao chép'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Số tiền:</Text>
                  <Text style={styles.qrZoomAmount}>
                    {Number(successOrder?.total || finalTotal).toLocaleString('vi-VN')} ₫
                  </Text>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Nội dung chuyển khoản:</Text>
                  <Text style={styles.qrZoomMemo}>
                    {successOrder?.code ? `#${successOrder.code}` : (name ? `PETCARE ${name}` : 'PETCARE')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.qrZoomInfoBox, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Ví điện tử:</Text>
                  <Text style={[styles.qrZoomInfoValBold, { color: '#D82D8B' }]}>MoMo (Napas 247)</Text>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Chủ tài khoản:</Text>
                  <Text style={styles.qrZoomInfoValBold}>PHAM THI LAN ANH</Text>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Số điện thoại:</Text>
                  <View style={styles.stkRow}>
                    <Text style={[styles.qrZoomStkHighlight, { color: '#D82D8B' }]}>0911191720</Text>
                    <TouchableOpacity
                      style={styles.copyMomoBtn}
                      onPress={() => handleCopyMomo('0911191720')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.copyMomoBtnText}>
                        {copiedMomo ? '✓ Đã sao chép' : 'Sao chép'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Số tài khoản MoMo:</Text>
                  <View style={styles.stkRow}>
                    <Text style={[styles.qrZoomStkHighlight, { color: '#A50064', fontSize: 11 }]}>
                      PSP2601016000000499
                    </Text>
                    <TouchableOpacity
                      style={styles.copyMomoBtn}
                      onPress={() => handleCopyMomo('PSP2601016000000499')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.copyMomoBtnText}>
                        {copiedMomo ? '✓ Đã sao chép' : 'Sao chép'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Số tiền:</Text>
                  <Text style={styles.qrZoomAmount}>
                    {Number(successOrder?.total || finalTotal).toLocaleString('vi-VN')} ₫
                  </Text>
                </View>
                <View style={styles.qrZoomInfoRow}>
                  <Text style={styles.qrZoomInfoLabel}>Lời nhắn:</Text>
                  <Text style={[styles.qrZoomMemo, { color: '#D82D8B' }]}>
                    {successOrder?.code ? `#${successOrder.code}` : (name ? `PETCARE ${name}` : 'PETCARE')}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.qrZoomConfirmBtn,
                qrModalChannel === 'momo' && { backgroundColor: '#D82D8B' },
              ]}
              onPress={() => setShowQrModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.qrZoomConfirmBtnText}>✓ Đã xem xong / Đã chuyển khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF', // Xanh nhạt dịu mát
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  backBtnText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  content: {
    padding: 16,
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 70,
  },
  layoutRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  itemsColumn: {
    flex: 1.2,
    minWidth: 320,
    gap: 14,
  },
  checkoutColumn: {
    flex: 1,
    minWidth: 320,
    gap: 14,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  boxHeaderRow: {
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 16,
  },
  shopNowBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopNowText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0284C7', // Chữ đậm màu xanh
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626', // Giá chữ đỏ tô đậm
    marginTop: 2,
  },
  itemControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  stepBtn: {
    width: 26,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  stepVal: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  deleteBtn: {
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  deleteText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  shippingOptionsRow: {
    gap: 8,
  },
  shippingOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    gap: 8,
  },
  shippingOptionCardActive: {
    borderColor: '#0EA5E9',
    backgroundColor: '#E0F2FE',
  },
  shippingRadioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shippingRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0EA5E9',
  },
  shippingOptionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  shippingOptionDesc: {
    fontSize: 10.5,
    color: '#64748B',
  },
  shippingOptionPrice: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  voucherInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voucherInput: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12.5,
    color: '#1E293B',
  },
  applyVoucherBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 14,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyVoucherBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11.5,
  },
  voucherErrorText: {
    fontSize: 10.5,
    color: '#DC2626',
    marginTop: 4,
    fontWeight: '600',
  },
  quickVoucherLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
    marginBottom: 4,
  },
  quickVoucherWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickVoucherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  quickVoucherChipCode: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  quickVoucherChipDesc: {
    fontSize: 9.5,
    color: '#64748B',
  },
  appliedVoucherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  appliedVoucherCode: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  appliedVoucherLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  removeVoucherBtn: {
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  removeVoucherText: {
    fontSize: 11.5,
    color: '#DC2626',
    fontWeight: '700',
  },
  guaranteeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guaranteeText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  inputGroup: {
    marginTop: 8,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 3,
  },
  input: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12.5,
    color: '#1E293B',
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    gap: 8,
    marginTop: 6,
  },
  paymentMethodOptionActive: {
    borderColor: '#0EA5E9',
    backgroundColor: '#E0F2FE',
  },
  paymentMethodTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  paymentMethodSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  summaryHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F0F9FF',
    marginVertical: 10,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#DC2626', // Giá tổng chữ đỏ tô đậm
  },
  checkoutBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  codNote: {
    fontSize: 10.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalSuccessCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  modalIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalSuccessTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0284C7',
  },
  modalSuccessSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  modalInvoiceBox: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 5,
  },
  modalInvoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalInvoiceLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  modalInvoiceLabelBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalInvoiceVal: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalInvoiceValBold: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0284C7',
  },
  modalInvoicePrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtnSecondary: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  modalBtnPrimary: {
    flex: 1.2,
    backgroundColor: '#0EA5E9',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // ==========================================
  // STYLES ĐỊA CHỈ TRONG NƯỚC & NƯỚC NGOÀI
  // ==========================================
  addressSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressRegionBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  addressRegionBadgeText: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '700',
  },
  addressTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 3,
    borderRadius: 8,
    gap: 4,
    marginBottom: 10,
  },
  addressTypeTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTypeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressTypeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  addressTypeTabTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  domesticAddressBox: {
    gap: 8,
  },
  internationalAddressBox: {
    gap: 8,
  },
  subInputGroup: {
    marginTop: 2,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 3,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  dropdownTriggerValue: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
  },
  dropdownChevron: {
    fontSize: 10,
    color: '#0284C7',
    marginLeft: 6,
  },
  districtWardRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addressPreviewBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#7DD3FC',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginTop: 4,
  },
  addressPreviewIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  addressPreviewTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 2,
  },
  addressPreviewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C4A6E',
    lineHeight: 16,
  },
  // PICKER MODAL
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  pickerModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    maxWidth: 520,
    width: '100%',
    maxHeight: '82%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerModalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  pickerModalCloseBtn: {
    padding: 4,
  },
  pickerSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  pickerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  pickerScrollList: {
    maxHeight: 360,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  pickerItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  pickerItemRowActive: {
    backgroundColor: '#E0F2FE',
  },
  pickerItemText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  pickerItemTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  pickerItemCheck: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  pickerEmpty: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  pickerEmptyText: {
    fontSize: 12.5,
    color: '#94A3B8',
  },
  // ==========================================
  // STYLES MÃ QR VIETQR MB BANK
  // ==========================================
  vietQrInlineCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  vietQrCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vietQrBadgeRow: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  vietQrBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  vietQrZoomTrigger: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vietQrZoomTriggerText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vietQrCardBody: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  vietQrThumbWrapper: {
    width: 110,
    height: 110,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  vietQrThumbImage: {
    width: 106,
    height: 106,
  },
  vietQrClickHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(2, 132, 199, 0.85)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  vietQrClickHintText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  vietQrDetailsCol: {
    flex: 1,
    gap: 5,
  },
  bankDetailItem: {
    flexDirection: 'column',
  },
  bankDetailLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  bankDetailValBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  stkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankDetailStk: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  copyStkBtn: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  copyStkBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  bankDetailAmount: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#DC2626',
  },
  // INVOICE QR CARD
  invoiceQrCardBox: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  invoiceQrCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  invoiceQrCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
    flex: 1,
  },
  invoiceQrZoomBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  invoiceQrZoomBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  invoiceQrCardImageWrap: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 4,
    position: 'relative',
  },
  invoiceQrCardImage: {
    width: 136,
    height: 136,
  },
  invoiceQrCardTapHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  invoiceQrCardTapHintText: {
    fontSize: 8.5,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  invoiceQrBankSummary: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    gap: 3,
  },
  invoiceQrBankLine: {
    fontSize: 11,
    color: '#334155',
  },
  // QR FULLSCREEN MODAL
  qrZoomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  qrZoomModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxWidth: 420,
    width: '100%',
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  qrZoomModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  qrZoomModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  qrZoomModalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  qrZoomModalCloseBtn: {
    padding: 4,
  },
  qrZoomImageCard: {
    width: 250,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  qrZoomBigImage: {
    width: 240,
    height: 240,
  },
  qrZoomInfoBox: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 12,
    gap: 6,
    marginVertical: 8,
  },
  qrZoomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrZoomInfoLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  qrZoomInfoValBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  qrZoomStkHighlight: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  qrZoomAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
  },
  qrZoomMemo: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  qrZoomConfirmBtn: {
    backgroundColor: '#0EA5E9',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  qrZoomConfirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // MOMO STYLES
  momoInlineCard: {
    backgroundColor: '#FDF2F8',
    borderWidth: 1,
    borderColor: '#FBCFE8',
    borderRadius: 12,
    padding: 12,
    marginTop: -4,
    marginBottom: 6,
  },
  momoCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  momoBadgeRow: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  momoBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D82D8B',
  },
  momoZoomTrigger: {
    backgroundColor: '#D82D8B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  momoZoomTriggerText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  momoCardBody: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  momoThumbWrapper: {
    width: 110,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  momoThumbImage: {
    width: 106,
    height: 106,
  },
  momoClickHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(216, 45, 139, 0.85)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  momoClickHintText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  momoDetailsCol: {
    flex: 1,
    gap: 5,
  },
  momoValBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  momoDetailStk: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D82D8B',
    letterSpacing: 0.5,
  },
  copyMomoBtn: {
    backgroundColor: '#FCE7F3',
    borderWidth: 1,
    borderColor: '#FBCFE8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  copyMomoBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D82D8B',
  },
  // INVOICE TABS
  invoiceQrTabRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginVertical: 6,
  },
  invoiceQrTabBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  invoiceQrTabBtnActiveBank: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  invoiceQrTabBtnActiveMomo: {
    borderColor: '#D82D8B',
    backgroundColor: '#FCE7F3',
  },
  invoiceQrTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  invoiceQrTabTextActiveBank: {
    color: '#0284C7',
  },
  invoiceQrTabTextActiveMomo: {
    color: '#D82D8B',
  },
  // QR ZOOM TABS
  qrZoomTabRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginVertical: 4,
  },
  qrZoomTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  qrZoomTabBtnActiveBank: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  qrZoomTabBtnActiveMomo: {
    borderColor: '#D82D8B',
    backgroundColor: '#FCE7F3',
  },
  qrZoomTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  qrZoomTabTextActiveBank: {
    color: '#0284C7',
  },
  qrZoomTabTextActiveMomo: {
    color: '#D82D8B',
  },
});