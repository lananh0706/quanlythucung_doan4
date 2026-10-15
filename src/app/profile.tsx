import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import {
  CartIcon,
  CheckIcon,
  CloseIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/icons';
import { pickImageFromFile } from '@/utils/imagePicker';

// Component icon an toàn trực tiếp trong file
function EditIcon({ size = 12, color = '#0284C7' }: { size?: number; color?: string }) {
  if (Platform.OS === 'web') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          lineHeight: 1,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </span>
    );
  }
  return <Text style={{ fontSize: size * 0.9, color }}>✏️</Text>;
}

function BellIcon({ size = 12, color = '#0284C7' }: { size?: number; color?: string }) {
  if (Platform.OS === 'web') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          lineHeight: 1,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </span>
    );
  }
  return <Text style={{ fontSize: size * 0.9, color }}>🔔</Text>;
}
import {
  DewormRecord,
  Pet,
  useCustomerPet,
  VaccineRecord,
  WeightLog,
} from '@/context/customer-pet-context';
import { useCart } from '@/context/cart-context';

const PRESET_CAT_AVATARS = [
  { label: 'Mèo Anh', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
  { label: 'Tabby Vàng', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80' },
  { label: 'Mèo Ngầu', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80' },
  { label: 'Mèo Trắng', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80' },
  { label: 'Mèo Con', url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80' },
];

const PRESET_DOG_AVATARS = [
  { label: 'Corgi', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' },
  { label: 'Golden', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Husky', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Poodle', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Shiba', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80' },
];

const QUICK_CAT_BREEDS = [
  'Mèo Anh Lông Ngắn',
  'Mèo Ba Tư',
  'Mèo Xiêm',
  'Mèo Mướp Ta',
  'Scottish Fold',
  'Mèo Ragdoll',
];

const QUICK_DOG_BREEDS = [
  'Corgi Pembroke',
  'Poodle',
  'Golden Retriever',
  'Husky Sibir',
  'Phốc Sóc (Pomeranian)',
  'Chó Cỏ Ta',
];

export default function PetProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addToCart } = useCart();

  // ĐỒNG BỘ VỚI HỆ THỐNG QUẢN LÝ KHÁCH HÀNG & BÉ CƯNG
  const {
    currentCustomer,
    currentCustomerPets,
    customers,
    currentCustomerId,
    setCurrentCustomerId,
    addPetForCurrentCustomer,
    updatePet,
    deletePet,
  } = useCustomerPet();

  const [selectedPetId, setSelectedPetId] = useState<number>(1);
  const [healthTab, setHealthTab] = useState<'vaccine' | 'deworm' | 'allergies' | 'weight'>('vaccine');

  // Đảm bảo khi đổi khách hàng thì chọn đúng bé đầu tiên của khách đó
  useEffect(() => {
    if (currentCustomerPets.length > 0) {
      if (!currentCustomerPets.some((p) => p.id === selectedPetId)) {
        setSelectedPetId(currentCustomerPets[0].id);
      }
    }
  }, [currentCustomerPets, selectedPetId]);

  // TOAST STATE
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // ==========================================
  // MODAL STATE: THÊM BÉ CƯNG MỚI
  // ==========================================
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'cat' | 'dog'>('cat');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('1 tuổi');
  const [petWeight, setPetWeight] = useState('3.8 kg');
  const [petFavoriteFood, setPetFavoriteFood] = useState('Pate cá ngừ & Hạt dinh dưỡng');
  const [petAvatar, setPetAvatar] = useState(PRESET_CAT_AVATARS[0].url);
  const [petGender, setPetGender] = useState<'male' | 'female'>('male');
  const [petIsNeutered, setPetIsNeutered] = useState<boolean>(true);
  const [petBirthDate, setPetBirthDate] = useState('15/06/2023');
  const [petCoatColor, setPetCoatColor] = useState('Vàng cam trắng');
  const [petAllergies, setPetAllergies] = useState('');
  const [petMedicalNotes, setPetMedicalNotes] = useState('');

  // ==========================================
  // MODAL STATE: CHỈNH SỬA HỒ SƠ BÉ CƯNG
  // ==========================================
  const [showEditPetModal, setShowEditPetModal] = useState(false);
  const [editPetName, setEditPetName] = useState('');
  const [editPetType, setEditPetType] = useState<'cat' | 'dog'>('cat');
  const [editPetBreed, setEditPetBreed] = useState('');
  const [editPetAge, setEditPetAge] = useState('');
  const [editPetWeight, setEditPetWeight] = useState('');
  const [editPetFavoriteFood, setEditPetFavoriteFood] = useState('');
  const [editPetAvatar, setEditPetAvatar] = useState('');
  const [editPetGender, setEditPetGender] = useState<'male' | 'female'>('male');
  const [editPetIsNeutered, setEditPetIsNeutered] = useState<boolean>(false);
  const [editPetBirthDate, setEditPetBirthDate] = useState('');
  const [editPetCoatColor, setEditPetCoatColor] = useState('');
  const [editPetAllergies, setEditPetAllergies] = useState('');
  const [editPetMedicalNotes, setEditPetMedicalNotes] = useState('');

  // ==========================================
  // MODAL STATE: THÊM MŨI TIÊM VACCINE
  // ==========================================
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [vacName, setVacName] = useState('Vaccine phòng dại (Rabies)');
  const [vacDate, setVacDate] = useState('12/03/2025');
  const [vacNextDate, setVacNextDate] = useState('12/03/2026');
  const [vacClinic, setVacClinic] = useState('Phòng khám Thú Y PetCare');

  // ==========================================
  // MODAL STATE: THÊM LỊCH TẨY GIUN / NHỎ GÁY
  // ==========================================
  const [showAddDewormModal, setShowAddDewormModal] = useState(false);
  const [dewormName, setDewormName] = useState('Tẩy giun định kỳ Drontal');
  const [dewormType, setDewormType] = useState<'deworm' | 'flea'>('deworm');
  const [dewormDate, setDewormDate] = useState('15/03/2025');
  const [dewormNextDate, setDewormNextDate] = useState('15/06/2025');

  // ==========================================
  // MODAL STATE: GHI NHẬN CÂN NẶNG MỚI
  // ==========================================
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [weightValue, setWeightValue] = useState('4.3');
  const [weightDate, setWeightDate] = useState('03/2025');
  const [weightNote, setWeightNote] = useState('Thể trạng khỏe mạnh, lông mượt');

  const currentPet =
    currentCustomerPets.find((p) => p.id === selectedPetId) || currentCustomerPets[0];
  const bottomInset = insets.bottom + BottomTabInset + Spacing.four;

  // Mở modal thêm bé
  const handleOpenAddPetModal = () => {
    setPetName('');
    setPetType('cat');
    setPetBreed('Mèo Anh Lông Ngắn');
    setPetAge('1 tuổi');
    setPetWeight('3.8 kg');
    setPetFavoriteFood('Pate cá ngừ & Hạt dinh dưỡng');
    setPetAvatar(PRESET_CAT_AVATARS[0].url);
    setPetGender('male');
    setPetIsNeutered(true);
    setPetBirthDate('15/06/2023');
    setPetCoatColor('Xám xanh ánh bạc');
    setPetAllergies('Không dị ứng thức ăn');
    setPetMedicalNotes('Sức khỏe bình thường');
    setShowAddPetModal(true);
  };

  // Lưu bé mới
  const handleSavePet = () => {
    const trimmedName = petName.trim();
    if (!trimmedName) {
      showToast('⚠️ Vui lòng nhập tên bé cưng!');
      return;
    }

    const defaultAvatar =
      petType === 'cat' ? PRESET_CAT_AVATARS[0].url : PRESET_DOG_AVATARS[0].url;

    const newPet = addPetForCurrentCustomer({
      name: trimmedName,
      type: petType,
      breed: petBreed.trim() || (petType === 'cat' ? 'Mèo Cưng' : 'Cún Cưng'),
      age: petAge.trim() || '1 tuổi',
      weight: petWeight.trim().includes('kg') ? petWeight.trim() : `${petWeight.trim()} kg`,
      favoriteFood:
        petFavoriteFood.trim() ||
        (petType === 'cat' ? 'Royal Canin & Pate cá' : 'SmartHeart & Pate thịt bò'),
      avatar: petAvatar.trim() || defaultAvatar,
      gender: petGender,
      isNeutered: petIsNeutered,
      birthDate: petBirthDate.trim() || '15/06/2023',
      coatColor: petCoatColor.trim() || 'Vàng trắng',
      allergies: petAllergies.trim() || 'Chưa ghi nhận dị ứng',
      medicalNotes: petMedicalNotes.trim() || 'Sức khỏe tốt',
      vaccines: [
        {
          id: `v-${Date.now()}`,
          name: petType === 'cat' ? 'Vaccine 4 trong 1 cho mèo' : 'Vaccine 7 trong 1 cho cún',
          date: '01/01/2025',
          nextDate: '01/01/2026',
          status: 'done',
          clinic: 'Phòng khám PetCare',
        },
      ],
      deworming: [
        {
          id: `d-${Date.now()}`,
          name: 'Tẩy giun định kỳ',
          date: '10/01/2025',
          nextDate: '10/04/2025',
          type: 'deworm',
        },
      ],
      weightLogs: [
        {
          id: `w-${Date.now()}`,
          date: '01/2025',
          weight: parseFloat(petWeight) || 4.0,
          note: 'Khởi tạo hồ sơ',
        },
      ],
    });

    setSelectedPetId(newPet.id);
    setShowAddPetModal(false);
    showToast(`🎉 Đã thêm bé "${trimmedName}" vào hồ sơ chủ nuôi ${currentCustomer?.name}!`);
  };

  // Mở modal sửa thông tin bé hiện tại
  const handleOpenEditPetModal = () => {
    if (!currentPet) return;
    setEditPetName(currentPet.name);
    setEditPetType(currentPet.type);
    setEditPetBreed(currentPet.breed);
    setEditPetAge(currentPet.age);
    setEditPetWeight(currentPet.weight);
    setEditPetFavoriteFood(currentPet.favoriteFood);
    setEditPetAvatar(currentPet.avatar);
    setEditPetGender(currentPet.gender || 'male');
    setEditPetIsNeutered(currentPet.isNeutered ?? true);
    setEditPetBirthDate(currentPet.birthDate || '15/06/2023');
    setEditPetCoatColor(currentPet.coatColor || 'Vàng trắng');
    setEditPetAllergies(currentPet.allergies || 'Chưa ghi nhận dị ứng thức ăn');
    setEditPetMedicalNotes(currentPet.medicalNotes || 'Sức khỏe bình thường');
    setShowEditPetModal(true);
  };

  // Lưu chỉnh sửa bé
  const handleSaveEditPet = () => {
    if (!currentPet) return;
    const trimmedName = editPetName.trim();
    if (!trimmedName) {
      showToast('⚠️ Vui lòng nhập tên bé cưng!');
      return;
    }

    updatePet(currentPet.id, {
      name: trimmedName,
      type: editPetType,
      breed: editPetBreed.trim() || currentPet.breed,
      age: editPetAge.trim() || currentPet.age,
      weight: editPetWeight.trim().includes('kg') ? editPetWeight.trim() : `${editPetWeight.trim()} kg`,
      favoriteFood: editPetFavoriteFood.trim() || currentPet.favoriteFood,
      avatar: editPetAvatar.trim() || currentPet.avatar,
      gender: editPetGender,
      isNeutered: editPetIsNeutered,
      birthDate: editPetBirthDate.trim() || currentPet.birthDate,
      coatColor: editPetCoatColor.trim() || currentPet.coatColor,
      allergies: editPetAllergies.trim() || 'Chưa ghi nhận dị ứng',
      medicalNotes: editPetMedicalNotes.trim() || 'Sức khỏe bình thường',
    });

    setShowEditPetModal(false);
    showToast(`✓ Đã cập nhật hồ sơ cho bé "${trimmedName}" thành công!`);
  };

  // Xóa bé
  const handleDeletePet = (id: number) => {
    if (currentCustomerPets.length <= 1) {
      showToast('⚠️ Khách hàng cần giữ lại ít nhất 1 hồ sơ bé cưng!');
      return;
    }

    const target = currentCustomerPets.find((p) => p.id === id);
    const confirmMsg = `Bạn có chắc muốn xóa hồ sơ bé "${target?.name}" khỏi tài khoản ${currentCustomer?.name}?`;

    const executeDelete = () => {
      deletePet(id);
      const remaining = currentCustomerPets.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setSelectedPetId(remaining[0].id);
      }
      showToast(`Đã xóa hồ sơ bé "${target?.name}"`);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        executeDelete();
      }
    } else {
      Alert.alert('Xác nhận xóa', confirmMsg, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: executeDelete },
      ]);
    }
  };

  // GỢI Ý MUA LẠI MÓN KHOÁI KHẨU
  const handleBuyFavoriteFood = () => {
    if (!currentPet) return;
    const foodName = currentPet.favoriteFood || 'Thức ăn dinh dưỡng cho bé';
    addToCart({
      id: Date.now(),
      name: foodName,
      numericPrice: 185000,
      weight: '1.5 kg',
      image: currentPet.avatar,
    }, 1);

    showToast(`🛒 Đã thêm "${foodName}" vào giỏ hàng!`);
  };

  // BẬT NHẮC NHỞ
  const handleSetReminder = (title: string, date: string) => {
    showToast(`🔔 Đã bật nhắc nhở: "${title}" vào ngày ${date}. PetCare sẽ gửi thông báo đến bạn!`);
  };

  // THÊM MŨI TIÊM
  const handleAddVaccine = () => {
    if (!currentPet) return;
    const newRecord: VaccineRecord = {
      id: `v-${Date.now()}`,
      name: vacName.trim() || 'Vaccine phòng bệnh',
      date: vacDate.trim() || 'Hôm nay',
      nextDate: vacNextDate.trim() || 'Sau 12 tháng',
      status: 'done',
      clinic: vacClinic.trim() || 'Phòng khám PetCare',
    };

    const currentList = currentPet.vaccines || [];
    updatePet(currentPet.id, {
      vaccines: [newRecord, ...currentList],
    });

    setShowAddVaccineModal(false);
    showToast(`💉 Đã ghi nhận mũi tiêm "${newRecord.name}" cho bé ${currentPet.name}!`);
  };

  // THÊM TẨY GIUN / NHỎ GÁY
  const handleAddDeworm = () => {
    if (!currentPet) return;
    const newRecord: DewormRecord = {
      id: `d-${Date.now()}`,
      name: dewormName.trim() || 'Lịch phòng ký sinh trùng',
      date: dewormDate.trim() || 'Hôm nay',
      nextDate: dewormNextDate.trim() || 'Sau 3 tháng',
      type: dewormType,
    };

    const currentList = currentPet.deworming || [];
    updatePet(currentPet.id, {
      deworming: [newRecord, ...currentList],
    });

    setShowAddDewormModal(false);
    showToast(`💊 Đã ghi nhận lịch "${newRecord.name}" cho bé ${currentPet.name}!`);
  };

  // GHI NHẬN CÂN NẶNG MỚI
  const handleAddWeightLog = () => {
    if (!currentPet) return;
    const val = parseFloat(weightValue) || 4.0;
    const newLog: WeightLog = {
      id: `w-${Date.now()}`,
      date: weightDate.trim() || '03/2025',
      weight: val,
      note: weightNote.trim() || 'Cân định kỳ',
    };

    const currentLogs = currentPet.weightLogs || [];
    updatePet(currentPet.id, {
      weight: `${val} kg`,
      weightLogs: [...currentLogs, newLog],
    });

    setShowAddWeightModal(false);
    showToast(`⚖️ Đã cập nhật cân nặng mới (${val} kg) cho bé ${currentPet.name}!`);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.headerBar}>
          <View style={styles.headerIconCircle}>
            <ProfileIcon size={20} color="#0284C7" />
          </View>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>Hồ Sơ Sức Khỏe & Bé Cưng</Text>
            <Text style={styles.headerSubtitle}>
              Sổ tiêm chủng • Lịch tẩy giun & ve rận • Cảnh báo dị ứng • Thể trạng
            </Text>
          </View>
        </View>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <View style={styles.toastCard}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
          showsVerticalScrollIndicator={false}>

          {/* BANNER THÔNG TIN CHỦ NUÔI (KHÁCH HÀNG) */}
          <View style={styles.customerBannerCard}>
            <View style={styles.customerBannerLeft}>
              <View style={styles.customerAvatarCircle}>
                <Text style={{ fontSize: 22 }}>👤</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text style={styles.customerName}>{currentCustomer?.name}</Text>
                  <View style={styles.customerTierBadge}>
                    <Text style={styles.customerTierText}>⭐ Hạng {currentCustomer?.tier}</Text>
                  </View>
                </View>
                <Text style={styles.customerMeta}>
                  SĐT: {currentCustomer?.phone} • {currentCustomerPets.length} bé cưng • {currentCustomer?.petXu} PetXu
                </Text>
              </View>
            </View>

            {/* CHUYỂN TÀI KHOẢN KHÁCH ĐỂ TEST */}
            <View style={styles.switchAccountWrap}>
              <Text style={styles.switchAccountLabel}>Chủ nuôi khác:</Text>
              <View style={styles.switchAccountBtnRow}>
                {customers.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.switchCusPill,
                      currentCustomerId === c.id && styles.switchCusPillActive,
                    ]}
                    onPress={() => {
                      setCurrentCustomerId(c.id);
                      showToast(`Chuyển sang tài khoản: ${c.name}`);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.switchCusPillText,
                        currentCustomerId === c.id && styles.switchCusPillTextActive,
                      ]}
                    >
                      {c.name.split(' ').slice(-2).join(' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* PET SELECTOR PILLS */}
          <View style={styles.petsSelectorRow}>
            {currentCustomerPets.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPetId(p.id)}
                style={[
                  styles.petTabPill,
                  selectedPetId === p.id && styles.petTabPillActive,
                ]}>
                <Image source={{ uri: p.avatar }} style={styles.petTabAvatar} contentFit="cover" />
                <Text
                  style={[
                    styles.petTabName,
                    selectedPetId === p.id && styles.petTabNameActive,
                  ]}>
                  {p.name}
                </Text>
              </Pressable>
            ))}

            {/* NÚT + THÊM BÉ */}
            <Pressable onPress={handleOpenAddPetModal} style={styles.addPetBtn}>
              <PlusIcon size={14} color="#0284C7" />
              <Text style={styles.addPetText}>+ Thêm bé</Text>
            </Pressable>
          </View>

          {/* PET PROFILE CARD CHÍNH */}
          {currentPet ? (
            <View style={styles.profileCard}>
              <View style={styles.profileTop}>
                <TouchableOpacity
                  onPress={() => {
                    pickImageFromFile((uri, name) => {
                      updatePet(currentPet.id, { avatar: uri });
                      Alert.alert('Thành công', `Đã cập nhật ảnh đại diện bé ${currentPet.name} từ máy tính/điện thoại!`);
                    });
                  }}
                  activeOpacity={0.8}
                  style={styles.profileAvatarTouchable}
                >
                  <Image source={{ uri: currentPet.avatar }} style={styles.profileAvatarLarge} contentFit="cover" />
                  <View style={styles.avatarCameraBadge}>
                    <Text style={styles.avatarCameraBadgeText}>📷</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.profileBio}>
                  <View style={styles.petNameRow}>
                    <Text style={styles.petName}>{currentPet.name}</Text>
                    <View style={styles.petActionRow}>
                      {/* NÚT SỬA HỒ SƠ */}
                      <TouchableOpacity
                        onPress={handleOpenEditPetModal}
                        style={styles.editPetBtn}
                        activeOpacity={0.7}
                      >
                        <EditIcon size={12} color="#0284C7" />
                        <Text style={styles.editPetBtnText}>Sửa</Text>
                      </TouchableOpacity>

                      {/* NÚT XÓA BÉ NẾU CÓ TRÊN 1 BÉ */}
                      {currentCustomerPets.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleDeletePet(currentPet.id)}
                          style={styles.deletePetSmallBtn}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.deletePetSmallText}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <Text style={styles.petBreed}>
                    {currentPet.breed} • {currentPet.type === 'cat' ? '🐱 Mèo cưng' : '🐶 Cún cưng'}
                  </Text>

                  {/* THÔNG TIN SINH HỌC & CƠ BẢN: GIỚI TÍNH, TRIỆT SẢN, TUỔI, CÂN NẶNG */}
                  <View style={styles.badgeRow}>
                    <View style={[styles.miniBadge, { backgroundColor: currentPet.gender === 'male' ? '#E0F2FE' : '#FCE7F3' }]}>
                      <Text style={[styles.miniBadgeText, { color: currentPet.gender === 'male' ? '#0369A1' : '#DB2777' }]}>
                        {currentPet.gender === 'male' ? '♂ Đực' : '♀ Cái'}
                      </Text>
                    </View>

                    <View style={[styles.miniBadge, { backgroundColor: currentPet.isNeutered ? '#F0FDF4' : '#FEF3C7' }]}>
                      <Text style={[styles.miniBadgeText, { color: currentPet.isNeutered ? '#16A34A' : '#D97706' }]}>
                        {currentPet.isNeutered ? '✂️ Đã triệt sản' : '⏳ Chưa triệt sản'}
                      </Text>
                    </View>

                    <View style={styles.miniBadge}>
                      <Text style={styles.miniBadgeText}>🎂 {currentPet.age}</Text>
                    </View>

                    <View style={styles.miniBadge}>
                      <Text style={styles.miniBadgeText}>⚖️ {currentPet.weight}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* CHI TIẾT ĐẶC ĐIỂM NHẬN DẠNG & NGÀY SINH NHẬN NUÔI */}
              <View style={styles.bioDetailsGrid}>
                <View style={styles.bioDetailItem}>
                  <Text style={styles.bioDetailLabel}>🗓️ Ngày sinh / Nhận nuôi:</Text>
                  <Text style={styles.bioDetailVal}>{currentPet.birthDate || 'Chưa cập nhật'}</Text>
                </View>
                <View style={styles.bioDetailItem}>
                  <Text style={styles.bioDetailLabel}>🎨 Màu lông & Nhận dạng:</Text>
                  <Text style={styles.bioDetailVal}>{currentPet.coatColor || 'Chưa cập nhật'}</Text>
                </View>
              </View>

              {/* BANNER GỢI Ý VOUCHER SINH NHẬT BÉ */}
              <View style={styles.birthdayNoticeBox}>
                <Text style={styles.birthdayNoticeEmoji}>🎁</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.birthdayNoticeTitle}>Sinh nhật bé cưng {currentPet.name}: {currentPet.birthDate || 'Sắp tới'}</Text>
                  <Text style={styles.birthdayNoticeSub}>
                    PetCare tự động gửi quà tặng & mã giảm giá 15% gói Spa / Bánh sinh nhật vào tháng sinh của bé!
                  </Text>
                </View>
              </View>

              {/* KHỐI MÓN KHOÁI KHẨU & NÚT GỢI Ý MUA LẠI / TỚI CỬA HÀNG */}
              <View style={styles.favoriteBox}>
                <View style={styles.favoriteHead}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.favLabel}>🍽️ Món khoái khẩu của bé:</Text>
                    <Text style={styles.favVal}>{currentPet.favoriteFood}</Text>
                  </View>
                </View>

                <View style={styles.favActionRow}>
                  <TouchableOpacity
                    style={styles.favBuyNowBtn}
                    onPress={handleBuyFavoriteFood}
                    activeOpacity={0.8}
                  >
                    <CartIcon size={14} color="#FFFFFF" />
                    <Text style={styles.favBuyNowText}>Thêm vào giỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.favExploreBtn}
                    onPress={() => router.push('/explore')}
                    activeOpacity={0.8}
                  >
                    <SearchIcon size={14} color="#0284C7" />
                    <Text style={styles.favExploreText}>Đến Cửa Hàng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.profileCard, { alignItems: 'center', paddingVertical: 30 }]}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>🐾</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>
                Chủ nuôi {currentCustomer?.name} chưa có hồ sơ bé cưng nào
              </Text>
              <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 14 }}>
                Bấm nút bên dưới để tạo hồ sơ chăm sóc cho bé ngay!
              </Text>
              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleOpenAddPetModal}
              >
                <Text style={styles.submitModalText}>+ Thêm Bé Cưng Ngay</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ============================================================ */}
          {/* HỒ SƠ SỨC KHỎE & Y TẾ (HEALTH & MEDICAL DOSSIER) */}
          {/* ============================================================ */}
          <View style={styles.healthCard}>
            <View style={styles.healthCardHead}>
              <View>
                <Text style={styles.healthTitle}>🩺 Hồ Sơ Sức Khỏe & Y Tế</Text>
                <Text style={styles.healthSubtitle}>
                  Sổ tiêm chủng • Ký sinh trùng • Cảnh báo dị ứng • Thể trạng {currentPet?.name}
                </Text>
              </View>
            </View>

            {/* TABS CHUYỂN ĐỔI CHUYÊN MỤC Y TẾ */}
            <View style={styles.healthTabsRow}>
              <TouchableOpacity
                style={[styles.healthTabBtn, healthTab === 'vaccine' && styles.healthTabBtnActive]}
                onPress={() => setHealthTab('vaccine')}
                activeOpacity={0.8}
              >
                <Text style={[styles.healthTabText, healthTab === 'vaccine' && styles.healthTabTextActive]}>
                  💉 Sổ Tiêm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.healthTabBtn, healthTab === 'deworm' && styles.healthTabBtnActive]}
                onPress={() => setHealthTab('deworm')}
                activeOpacity={0.8}
              >
                <Text style={[styles.healthTabText, healthTab === 'deworm' && styles.healthTabTextActive]}>
                  💊 Tẩy Giun / Rận
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.healthTabBtn, healthTab === 'allergies' && styles.healthTabBtnActive]}
                onPress={() => setHealthTab('allergies')}
                activeOpacity={0.8}
              >
                <Text style={[styles.healthTabText, healthTab === 'allergies' && styles.healthTabTextActive]}>
                  ⚠️ Dị Ứng & Bệnh
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.healthTabBtn, healthTab === 'weight' && styles.healthTabBtnActive]}
                onPress={() => setHealthTab('weight')}
                activeOpacity={0.8}
              >
                <Text style={[styles.healthTabText, healthTab === 'weight' && styles.healthTabTextActive]}>
                  📊 Cân Nặng
                </Text>
              </TouchableOpacity>
            </View>

            {/* NỘI DUNG TAB 1: SỔ TIÊM CHỦNG */}
            {healthTab === 'vaccine' && (
              <View style={styles.tabContentContainer}>
                <View style={styles.subTabHeader}>
                  <Text style={styles.subTabHeading}>Sổ Tiêm Chủng Điện Tử</Text>
                  <TouchableOpacity
                    style={styles.addRecordBtn}
                    onPress={() => setShowAddVaccineModal(true)}
                    activeOpacity={0.8}
                  >
                    <PlusIcon size={12} color="#0284C7" />
                    <Text style={styles.addRecordText}>Thêm mũi tiêm</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.recordList}>
                  {(currentPet?.vaccines && currentPet.vaccines.length > 0) ? (
                    currentPet.vaccines.map((v) => (
                      <View key={v.id} style={styles.recordItem}>
                        <View style={styles.recordItemLeft}>
                          <Text style={styles.recordItemName}>{v.name}</Text>
                          <Text style={styles.recordItemClinic}>🏥 {v.clinic || 'Phòng khám PetCare'}</Text>
                          <View style={styles.recordDateRow}>
                            <Text style={styles.recordDateText}>Ngày tiêm: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{v.date}</Text></Text>
                            <Text style={styles.recordDateText}>Nhắc lại: <Text style={{ fontWeight: '700', color: '#DC2626' }}>{v.nextDate}</Text></Text>
                          </View>
                        </View>

                        <View style={styles.recordItemRight}>
                          <View style={[styles.statusBadge, v.status === 'done' ? styles.statusBadgeDone : styles.statusBadgeUpcoming]}>
                            <Text style={[styles.statusBadgeText, v.status === 'done' ? styles.statusBadgeTextDone : styles.statusBadgeTextUpcoming]}>
                              {v.status === 'done' ? '✓ Đã tiêm' : '⏳ Sắp tới'}
                            </Text>
                          </View>

                          <TouchableOpacity
                            style={styles.remindBtn}
                            onPress={() => handleSetReminder(v.name, v.nextDate)}
                            activeOpacity={0.7}
                          >
                            <BellIcon size={12} color="#0284C7" />
                            <Text style={styles.remindBtnText}>Nhắc lịch</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyRecordText}>Chưa có mũi tiêm nào được ghi nhận cho bé.</Text>
                  )}
                </View>
              </View>
            )}

            {/* NỘI DUNG TAB 2: LỊCH TẨY GIUN & NHỎ GÁY */}
            {healthTab === 'deworm' && (
              <View style={styles.tabContentContainer}>
                <View style={styles.subTabHeader}>
                  <View>
                    <Text style={styles.subTabHeading}>Lịch Tẩy Giun & Phòng Ký Sinh Trùng</Text>
                    <Text style={styles.subTabSub}>Khuyến nghị định kỳ: 1 - 3 tháng/lần</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addRecordBtn}
                    onPress={() => setShowAddDewormModal(true)}
                    activeOpacity={0.8}
                  >
                    <PlusIcon size={12} color="#0284C7" />
                    <Text style={styles.addRecordText}>Ghi nhận mới</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.recordList}>
                  {(currentPet?.deworming && currentPet.deworming.length > 0) ? (
                    currentPet.deworming.map((d) => (
                      <View key={d.id} style={styles.recordItem}>
                        <View style={styles.recordItemLeft}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ fontSize: 14 }}>{d.type === 'deworm' ? '💊' : '💧'}</Text>
                            <Text style={styles.recordItemName}>{d.name}</Text>
                          </View>
                          <View style={styles.recordDateRow}>
                            <Text style={styles.recordDateText}>Đã dùng: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{d.date}</Text></Text>
                            <Text style={styles.recordDateText}>Đợt tiếp theo: <Text style={{ fontWeight: '700', color: '#DC2626' }}>{d.nextDate}</Text></Text>
                          </View>
                        </View>

                        <View style={styles.recordItemRight}>
                          <TouchableOpacity
                            style={styles.remindBtn}
                            onPress={() => handleSetReminder(d.name, d.nextDate)}
                            activeOpacity={0.7}
                          >
                            <BellIcon size={12} color="#0284C7" />
                            <Text style={styles.remindBtnText}>Đặt nhắc</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyRecordText}>Chưa có dữ liệu tẩy giun hoặc nhỏ gáy.</Text>
                  )}
                </View>
              </View>
            )}

            {/* NỘI DUNG TAB 3: TIỀN SỬ DỊ ỨNG & BỆNH LÝ NỀN */}
            {healthTab === 'allergies' && (
              <View style={styles.tabContentContainer}>
                <View style={styles.subTabHeader}>
                  <Text style={styles.subTabHeading}>Cảnh Báo Dị Ứng & Bệnh Lý Nền</Text>
                  <TouchableOpacity
                    style={styles.addRecordBtn}
                    onPress={handleOpenEditPetModal}
                    activeOpacity={0.8}
                  >
                    <EditIcon size={12} color="#0284C7" />
                    <Text style={styles.addRecordText}>Chỉnh sửa</Text>
                  </TouchableOpacity>
                </View>

                {/* THẺ DỊ ỨNG */}
                <View style={styles.allergyWarningCard}>
                  <View style={styles.allergyWarningHeader}>
                    <Text style={styles.allergyWarningIcon}>🚫</Text>
                    <Text style={styles.allergyWarningTitle}>Tiền sử dị ứng thức ăn:</Text>
                  </View>
                  <Text style={styles.allergyWarningBody}>
                    {currentPet?.allergies || 'Chưa ghi nhận dị ứng cụ thể. An toàn với các loại thực phẩm phổ thông.'}
                  </Text>
                  <View style={styles.allergyTipBox}>
                    <Text style={styles.allergyTipText}>
                      🛡️ Hệ thống Cửa hàng PetCare sẽ đối soát cảnh báo khi bạn chọn các sản phẩm chứa thành phần dị ứng trên!
                    </Text>
                  </View>
                </View>

                {/* THẺ BỆNH LÝ NỀN */}
                <View style={styles.medicalConditionCard}>
                  <View style={styles.allergyWarningHeader}>
                    <Text style={styles.allergyWarningIcon}>🩺</Text>
                    <Text style={styles.medicalConditionTitle}>Bệnh lý & Lưu ý chăm sóc:</Text>
                  </View>
                  <Text style={styles.medicalConditionBody}>
                    {currentPet?.medicalNotes || 'Bé khỏe mạnh, không có bệnh mãn tính hoặc dị ứng thời tiết.'}
                  </Text>
                </View>
              </View>
            )}

            {/* NỘI DUNG TAB 4: BIỂU ĐỒ & THEO DÕI CÂN NẶNG */}
            {healthTab === 'weight' && (
              <View style={styles.tabContentContainer}>
                <View style={styles.subTabHeader}>
                  <View>
                    <Text style={styles.subTabHeading}>Theo Dõi Cân Nặng & Thể Trạng</Text>
                    <Text style={styles.subTabSub}>Cân nặng hiện tại: <Text style={{ fontWeight: '800', color: '#0284C7' }}>{currentPet?.weight}</Text></Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addRecordBtn}
                    onPress={() => setShowAddWeightModal(true)}
                    activeOpacity={0.8}
                  >
                    <PlusIcon size={12} color="#0284C7" />
                    <Text style={styles.addRecordText}>+ Ghi cân mới</Text>
                  </TouchableOpacity>
                </View>

                {/* THƯỚC ĐO THỂ TRẠNG (BCS) */}
                <View style={styles.bcsBarContainer}>
                  <Text style={styles.bcsBarLabel}>Đánh giá thể trạng (Body Condition):</Text>
                  <View style={styles.bcsSegmentsRow}>
                    <View style={[styles.bcsSegment, { backgroundColor: '#FDE68A' }]}>
                      <Text style={styles.bcsSegmentText}>Thon gọn</Text>
                    </View>
                    <View style={[styles.bcsSegment, styles.bcsSegmentActive, { backgroundColor: '#86EFAC' }]}>
                      <Text style={[styles.bcsSegmentText, { fontWeight: '800', color: '#166534' }]}>✓ Chuẩn thể trạng</Text>
                    </View>
                    <View style={[styles.bcsSegment, { backgroundColor: '#FECACA' }]}>
                      <Text style={styles.bcsSegmentText}>Hơi béo</Text>
                    </View>
                  </View>
                  <Text style={styles.bcsAssessment}>
                    🎯 Cân đối lý tưởng. Nhu cầu calo ổn định, tiếp tục duy trì chế độ dinh dưỡng hiện tại.
                  </Text>
                </View>

                {/* NHẬT KÝ CÂN NẶNG */}
                <View style={styles.weightLogList}>
                  <Text style={styles.weightLogListTitle}>Lịch sử cân đo theo tháng:</Text>
                  {(currentPet?.weightLogs && currentPet.weightLogs.length > 0) ? (
                    currentPet.weightLogs.map((w) => (
                      <View key={w.id} style={styles.weightLogRow}>
                        <View style={styles.weightLogLeft}>
                          <Text style={styles.weightLogDate}>Tháng {w.date}</Text>
                          {w.note && <Text style={styles.weightLogNote}>{w.note}</Text>}
                        </View>
                        <View style={styles.weightLogRight}>
                          <Text style={styles.weightLogVal}>{w.weight} kg</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyRecordText}>Chưa có lịch sử cân nặng.</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* VET TIPS */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Lời Khuyên Dinh Dưỡng & Sức Khỏe</Text>
            <Text style={styles.tipsBody}>
              • Thú cưng đã triệt sản có nhu cầu năng lượng giảm ~25-30%, nên chọn thức ăn có hàm lượng chất xơ cao để tránh béo phì.{'\n'}
              • Kiểm tra tiêm chủng định kỳ hàng năm và tẩy giun mỗi 3 tháng giúp phòng ngừa 99% các bệnh truyền nhiễm nguy hiểm.{'\n'}
              • Luôn chuẩn bị nước sạch tinh khiết cách xa khay ăn ít nhất 1 mét để kích thích thói quen uống nước của bé.
            </Text>
          </View>

          {/* ADMIN PORTAL LINK */}
          <Pressable
            onPress={() => router.push('/admin')}
            style={styles.adminBanner}>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheckIcon size={16} color="#38BDF8" />
                <Text style={styles.adminBannerTitle}>Trang Quản Trị Hệ Thống (Admin)</Text>
              </View>
              <Text style={styles.adminBannerSub}>
                Quản lý tài khoản khách hàng, hồ sơ bé cưng, đơn hàng và kho thức ăn
              </Text>
            </View>
            <Text style={styles.adminArrow}>→</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      {/* ============================================================ */}
      {/* MODAL 1: THÊM BÉ CƯNG MỚI (ĐẦY ĐỦ TRƯỜNG SINH HỌC & CƠ BẢN) */}
      {/* ============================================================ */}
      <Modal
        visible={showAddPetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddPetModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Text style={styles.modalHeaderIcon}>🐾</Text>
                <View>
                  <Text style={styles.modalTitle}>Thêm Hồ Sơ Bé Cưng</Text>
                  <Text style={styles.modalSubtitle}>
                    Chủ nuôi: <Text style={{ fontWeight: '700', color: '#0284C7' }}>{currentCustomer?.name}</Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddPetModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollArea}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* CHỌN LOÀI */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Loài thú cưng: <Text style={styles.requiredStar}>*</Text></Text>
                <View style={styles.typeSelectorRow}>
                  <TouchableOpacity
                    style={[styles.typeBtn, petType === 'cat' && styles.typeBtnActive]}
                    onPress={() => {
                      setPetType('cat');
                      setPetBreed('Mèo Anh Lông Ngắn');
                      setPetAvatar(PRESET_CAT_AVATARS[0].url);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.typeEmoji}>🐱</Text>
                    <Text style={[styles.typeText, petType === 'cat' && styles.typeTextActive]}>Mèo Cưng (Cat)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.typeBtn, petType === 'dog' && styles.typeBtnActive]}
                    onPress={() => {
                      setPetType('dog');
                      setPetBreed('Corgi Pembroke');
                      setPetAvatar(PRESET_DOG_AVATARS[0].url);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.typeEmoji}>🐶</Text>
                    <Text style={[styles.typeText, petType === 'dog' && styles.typeTextActive]}>Cún Cưng (Dog)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* TÊN BÉ */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tên bé cưng: <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.inputField}
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="Ví dụ: Bé Lu, Kem, Miu Miu, Cún Bông..."
                />
              </View>

              {/* ẢNH ĐẠI DIỆN BÉ CƯNG */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ảnh đại diện bé cưng:</Text>
                <View style={styles.petAvatarUploadRow}>
                  {petAvatar ? (
                    <Image source={{ uri: petAvatar }} style={styles.petAvatarPreviewCircle} contentFit="cover" />
                  ) : (
                    <View style={styles.petAvatarPlaceholderCircle}>
                      <Text style={{ fontSize: 24 }}>🐾</Text>
                    </View>
                  )}
                  <View style={{ flex: 1, gap: 6 }}>
                    <TouchableOpacity
                      style={styles.btnUploadDevicePet}
                      onPress={() => {
                        pickImageFromFile((uri, name) => {
                          setPetAvatar(uri);
                          Alert.alert('Thành công', `Đã tải ảnh "${name || 'bé cưng'}" từ máy tính/điện thoại!`);
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnUploadDevicePetText}>📁 Tải ảnh bé từ máy tính / điện thoại</Text>
                    </TouchableOpacity>
                    <Text style={styles.petUploadNote}>
                      Chọn ảnh chụp của bé có sẵn trong máy tính hoặc điện thoại
                    </Text>
                  </View>
                </View>

                {/* HOẶC CHỌN NHANH MẪU AVATAR CÓ SẴN */}
                <Text style={[styles.fieldSubLabel, { marginTop: 8, marginBottom: 4 }]}>
                  Hoặc chọn nhanh mẫu có sẵn:
                </Text>
                <View style={styles.presetAvatarRow}>
                  {(petType === 'cat' ? PRESET_CAT_AVATARS : PRESET_DOG_AVATARS).map((pAv, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.presetAvatarBtn,
                        petAvatar === pAv.url && styles.presetAvatarBtnActive,
                      ]}
                      onPress={() => setPetAvatar(pAv.url)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: pAv.url }} style={styles.presetAvatarImg} contentFit="cover" />
                      <Text style={styles.presetAvatarName} numberOfLines={1}>{pAv.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* GIỚI TÍNH & TRIỆT SẢN */}
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Giới tính:</Text>
                  <View style={styles.switchOptionRow}>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, petGender === 'male' && styles.switchOptionBtnActive]}
                      onPress={() => setPetGender('male')}
                    >
                      <Text style={[styles.switchOptionText, petGender === 'male' && styles.switchOptionTextActive]}>♂ Đực</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, petGender === 'female' && styles.switchOptionBtnActive]}
                      onPress={() => setPetGender('female')}
                    >
                      <Text style={[styles.switchOptionText, petGender === 'female' && styles.switchOptionTextActive]}>♀ Cái</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Trạng thái triệt sản:</Text>
                  <View style={styles.switchOptionRow}>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, petIsNeutered && styles.switchOptionBtnActive]}
                      onPress={() => setPetIsNeutered(true)}
                    >
                      <Text style={[styles.switchOptionText, petIsNeutered && styles.switchOptionTextActive]}>✂️ Đã triệt sản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, !petIsNeutered && styles.switchOptionBtnActive]}
                      onPress={() => setPetIsNeutered(false)}
                    >
                      <Text style={[styles.switchOptionText, !petIsNeutered && styles.switchOptionTextActive]}>Chưa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* NGÀY SINH & MÀU LÔNG */}
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Ngày sinh / Nhận nuôi:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={petBirthDate}
                    onChangeText={setPetBirthDate}
                    placeholder="15/06/2023"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Màu lông / Nhận diện:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={petCoatColor}
                    onChangeText={setPetCoatColor}
                    placeholder="Vàng cam trắng, mắt 2 màu..."
                  />
                </View>
              </View>

              {/* GIỐNG LOÀI & GỢI Ý NHANH */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Giống loài:</Text>
                <TextInput
                  style={styles.inputField}
                  value={petBreed}
                  onChangeText={setPetBreed}
                  placeholder={petType === 'cat' ? 'Ví dụ: Mèo Anh Lông Ngắn, Ba Tư...' : 'Ví dụ: Corgi, Poodle, Golden...'}
                />
                <View style={styles.quickBreedsRow}>
                  {(petType === 'cat' ? QUICK_CAT_BREEDS : QUICK_DOG_BREEDS).map((b) => (
                    <TouchableOpacity
                      key={b}
                      style={[styles.quickBreedPill, petBreed === b && styles.quickBreedPillActive]}
                      onPress={() => setPetBreed(b)}
                    >
                      <Text style={[styles.quickBreedText, petBreed === b && styles.quickBreedTextActive]}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* TUỔI & CÂN NẶNG */}
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Độ tuổi:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={petAge}
                    onChangeText={setPetAge}
                    placeholder="1.5 tuổi, 8 tháng"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Cân nặng:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={petWeight}
                    onChangeText={setPetWeight}
                    placeholder="4.2 kg"
                  />
                </View>
              </View>

              {/* MÓN KHOÁI KHẨU */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Món khoái khẩu của bé:</Text>
                <TextInput
                  style={styles.inputField}
                  value={petFavoriteFood}
                  onChangeText={setPetFavoriteFood}
                  placeholder="Royal Canin Fit 32 & Pate cá ngừ"
                />
              </View>

              {/* DỊ ỨNG & BỆNH LÝ */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tiền sử dị ứng thức ăn (nếu có):</Text>
                <TextInput
                  style={styles.inputField}
                  value={petAllergies}
                  onChangeText={setPetAllergies}
                  placeholder="Dị ứng đạm bò, gluten, hải sản..."
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bệnh lý nền / Lưu ý chăm sóc:</Text>
                <TextInput
                  style={styles.inputField}
                  value={petMedicalNotes}
                  onChangeText={setPetMedicalNotes}
                  placeholder="Viêm da cơ địa, dạ dày nhạy cảm..."
                />
              </View>

              {/* NÚT THAO TÁC */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setShowAddPetModal(false)}
                >
                  <Text style={styles.cancelModalText}>Hủy bỏ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitModalBtn}
                  onPress={handleSavePet}
                >
                  <Text style={styles.submitModalText}>✨ Lưu Hồ Sơ Bé Cưng</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: CHỈNH SỬA HỒ SƠ BÉ CƯNG (CÂY BÚT ✏️) */}
      {/* ============================================================ */}
      <Modal
        visible={showEditPetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditPetModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Text style={styles.modalHeaderIcon}>✏️</Text>
                <View>
                  <Text style={styles.modalTitle}>Chỉnh Sửa Hồ Sơ Bé {currentPet?.name}</Text>
                  <Text style={styles.modalSubtitle}>Cập nhật thông tin sinh học, cân nặng và y tế</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowEditPetModal(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollArea}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* TÊN BÉ */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tên bé cưng: <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.inputField}
                  value={editPetName}
                  onChangeText={setEditPetName}
                  placeholder="Tên bé cưng..."
                />
              </View>

              {/* ẢNH ĐẠI DIỆN */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ảnh đại diện của bé:</Text>
                <View style={styles.petAvatarUploadRow}>
                  {editPetAvatar ? (
                    <Image source={{ uri: editPetAvatar }} style={styles.petAvatarPreviewCircle} contentFit="cover" />
                  ) : (
                    <View style={styles.petAvatarPlaceholderCircle}>
                      <Text style={{ fontSize: 24 }}>🐾</Text>
                    </View>
                  )}
                  <View style={{ flex: 1, gap: 6 }}>
                    <TouchableOpacity
                      style={styles.btnUploadDevicePet}
                      onPress={() => {
                        pickImageFromFile((uri, name) => {
                          setEditPetAvatar(uri);
                          Alert.alert('Thành công', `Đã tải ảnh "${name || 'bé cưng'}" từ máy tính/điện thoại!`);
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnUploadDevicePetText}>📁 Tải ảnh bé từ máy tính / điện thoại</Text>
                    </TouchableOpacity>
                    <Text style={styles.petUploadNote}>
                      Bấm vào nút trên để mở ảnh bé cưng trong máy tính hoặc điện thoại
                    </Text>
                  </View>
                </View>

                {/* Ô DÁN LINK URL PHỤ */}
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  value={editPetAvatar}
                  onChangeText={setEditPetAvatar}
                  placeholder="Hoặc dán link ảnh Web URL nếu có..."
                />
              </View>

              {/* GIỚI TÍNH & TRIỆT SẢN */}
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Giới tính:</Text>
                  <View style={styles.switchOptionRow}>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, editPetGender === 'male' && styles.switchOptionBtnActive]}
                      onPress={() => setEditPetGender('male')}
                    >
                      <Text style={[styles.switchOptionText, editPetGender === 'male' && styles.switchOptionTextActive]}>♂ Đực</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, editPetGender === 'female' && styles.switchOptionBtnActive]}
                      onPress={() => setEditPetGender('female')}
                    >
                      <Text style={[styles.switchOptionText, editPetGender === 'female' && styles.switchOptionTextActive]}>♀ Cái</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Trạng thái triệt sản:</Text>
                  <View style={styles.switchOptionRow}>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, editPetIsNeutered && styles.switchOptionBtnActive]}
                      onPress={() => setEditPetIsNeutered(true)}
                    >
                      <Text style={[styles.switchOptionText, editPetIsNeutered && styles.switchOptionTextActive]}>✂️ Đã triệt sản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.switchOptionBtn, !editPetIsNeutered && styles.switchOptionBtnActive]}
                      onPress={() => setEditPetIsNeutered(false)}
                    >
                      <Text style={[styles.switchOptionText, !editPetIsNeutered && styles.switchOptionTextActive]}>Chưa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* NGÀY SINH & MÀU LÔNG */}
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Ngày sinh / Nhận nuôi:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editPetBirthDate}
                    onChangeText={setEditPetBirthDate}
                    placeholder="15/06/2023"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Màu lông / Nhận diện:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editPetCoatColor}
                    onChangeText={setEditPetCoatColor}
                    placeholder="Vàng cam trắng, mắt hổ phách..."
                  />
                </View>
              </View>

              {/* GIỐNG LOÀI */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Giống loài:</Text>
                <TextInput
                  style={styles.inputField}
                  value={editPetBreed}
                  onChangeText={setEditPetBreed}
                  placeholder="Giống loài của bé..."
                />
              </View>

              {/* TUỔI & CÂN NẶNG */}
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Tuổi:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editPetAge}
                    onChangeText={setEditPetAge}
                    placeholder="2 tuổi"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Cân nặng:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editPetWeight}
                    onChangeText={setEditPetWeight}
                    placeholder="4.2 kg"
                  />
                </View>
              </View>

              {/* MÓN KHOÁI KHẨU */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Món khoái khẩu của bé:</Text>
                <TextInput
                  style={styles.inputField}
                  value={editPetFavoriteFood}
                  onChangeText={setEditPetFavoriteFood}
                  placeholder="Món ăn bé thích nhất..."
                />
              </View>

              {/* DỊ ỨNG */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tiền sử dị ứng thức ăn:</Text>
                <TextInput
                  style={styles.inputField}
                  value={editPetAllergies}
                  onChangeText={setEditPetAllergies}
                  placeholder="Ví dụ: Dị ứng thịt gà, dị ứng ngũ cốc gluten..."
                />
              </View>

              {/* BỆNH LÝ NỀN */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bệnh lý nền & Lưu ý chăm sóc:</Text>
                <TextInput
                  style={styles.inputField}
                  value={editPetMedicalNotes}
                  onChangeText={setEditPetMedicalNotes}
                  placeholder="Ví dụ: Viêm da cơ địa, dạ dày nhạy cảm..."
                />
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setShowEditPetModal(false)}
                >
                  <Text style={styles.cancelModalText}>Hủy bỏ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitModalBtn}
                  onPress={handleSaveEditPet}
                >
                  <Text style={styles.submitModalText}>✓ Lưu Thay Đổi</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 3: THÊM MŨI TIÊM VACCINE */}
      {/* ============================================================ */}
      <Modal
        visible={showAddVaccineModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddVaccineModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Text style={styles.modalHeaderIcon}>💉</Text>
                <View>
                  <Text style={styles.modalTitle}>Thêm Mũi Tiêm Chủng</Text>
                  <Text style={styles.modalSubtitle}>Ghi nhận vào sổ tiêm điện tử của {currentPet?.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddVaccineModal(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalScrollContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tên loại vaccine:</Text>
                <TextInput
                  style={styles.inputField}
                  value={vacName}
                  onChangeText={setVacName}
                  placeholder="Vaccine 7 trong 1, Vaccine Dại..."
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Ngày tiêm:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={vacDate}
                    onChangeText={setVacDate}
                    placeholder="12/03/2025"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Ngày nhắc lại:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={vacNextDate}
                    onChangeText={setVacNextDate}
                    placeholder="12/03/2026"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phòng khám thực hiện:</Text>
                <TextInput
                  style={styles.inputField}
                  value={vacClinic}
                  onChangeText={setVacClinic}
                  placeholder="Phòng khám PetCare"
                />
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setShowAddVaccineModal(false)}
                >
                  <Text style={styles.cancelModalText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitModalBtn}
                  onPress={handleAddVaccine}
                >
                  <Text style={styles.submitModalText}>+ Thêm Vào Sổ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 4: THÊM LỊCH TẨY GIUN / NHỎ GÁY */}
      {/* ============================================================ */}
      <Modal
        visible={showAddDewormModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddDewormModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Text style={styles.modalHeaderIcon}>💊</Text>
                <View>
                  <Text style={styles.modalTitle}>Ghi Nhận Tẩy Giun / Trị Ve Rận</Text>
                  <Text style={styles.modalSubtitle}>Bảo vệ định kỳ cho bé {currentPet?.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddDewormModal(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalScrollContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Hình thức phòng bệnh:</Text>
                <View style={styles.switchOptionRow}>
                  <TouchableOpacity
                    style={[styles.switchOptionBtn, dewormType === 'deworm' && styles.switchOptionBtnActive]}
                    onPress={() => setDewormType('deworm')}
                  >
                    <Text style={[styles.switchOptionText, dewormType === 'deworm' && styles.switchOptionTextActive]}>💊 Tẩy giun sán</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.switchOptionBtn, dewormType === 'flea' && styles.switchOptionBtnActive]}
                    onPress={() => setDewormType('flea')}
                  >
                    <Text style={[styles.switchOptionText, dewormType === 'flea' && styles.switchOptionTextActive]}>💧 Nhỏ gáy diệt rận</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tên thuốc sử dụng:</Text>
                <TextInput
                  style={styles.inputField}
                  value={dewormName}
                  onChangeText={setDewormName}
                  placeholder="NexGard, Drontal, Milbemax, Revolution..."
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Ngày dùng:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={dewormDate}
                    onChangeText={setDewormDate}
                    placeholder="15/03/2025"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Đợt nhắc tới (+3 tháng):</Text>
                  <TextInput
                    style={styles.inputField}
                    value={dewormNextDate}
                    onChangeText={setDewormNextDate}
                    placeholder="15/06/2025"
                  />
                </View>
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setShowAddDewormModal(false)}
                >
                  <Text style={styles.cancelModalText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitModalBtn}
                  onPress={handleAddDeworm}
                >
                  <Text style={styles.submitModalText}>+ Lưu Hồ Sơ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 5: GHI NHẬN CÂN NẶNG MỚI */}
      {/* ============================================================ */}
      <Modal
        visible={showAddWeightModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddWeightModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Text style={styles.modalHeaderIcon}>⚖️</Text>
                <View>
                  <Text style={styles.modalTitle}>Ghi Nhận Cân Nặng Mới</Text>
                  <Text style={styles.modalSubtitle}>Cập nhật thể trạng cho {currentPet?.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddWeightModal(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalScrollContent}>
              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Cân nặng (kg):</Text>
                  <TextInput
                    style={styles.inputField}
                    value={weightValue}
                    onChangeText={setWeightValue}
                    placeholder="Ví dụ: 4.3"
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Tháng / Ngày ghi:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={weightDate}
                    onChangeText={setWeightDate}
                    placeholder="03/2025"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ghi chú thể trạng:</Text>
                <TextInput
                  style={styles.inputField}
                  value={weightNote}
                  onChangeText={setWeightNote}
                  placeholder="Khỏe mạnh, chuẩn phom, tăng cơ tốt..."
                />
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setShowAddWeightModal(false)}
                >
                  <Text style={styles.cancelModalText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitModalBtn}
                  onPress={handleAddWeightLog}
                >
                  <Text style={styles.submitModalText}>✓ Cập Nhật Cân Nặng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  toastCard: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 9999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },

  // CUSTOMER BANNER CARD
  customerBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 14,
    gap: 10,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  customerBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerTierBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  customerTierText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
  },
  customerMeta: {
    fontSize: 11.5,
    color: '#64748B',
  },
  switchAccountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexWrap: 'wrap',
    gap: 8,
  },
  switchAccountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  switchAccountBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  switchCusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  switchCusPillActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  switchCusPillText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  switchCusPillTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },

  // PETS SELECTOR ROW
  petsSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  petTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#FFFFFF',
  },
  petTabPillActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  petTabAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  petTabName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0369A1',
  },
  petTabNameActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addPetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    borderStyle: 'dashed',
    backgroundColor: '#F0F9FF',
  },
  addPetText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },

  // PROFILE CARD
  profileCard: {
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
  profileTop: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  profileAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: '#BAE6FD',
  },
  profileBio: {
    flex: 1,
    gap: 4,
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  petActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editPetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  editPetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  deletePetSmallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deletePetSmallText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  petBreed: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0284C7',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  miniBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
  },
  miniBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },

  // GRID THÔNG TIN SINH HỌC
  bioDetailsGrid: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bioDetailItem: {
    flex: 1,
    gap: 2,
  },
  bioDetailLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  bioDetailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  // BANNER SINH NHẬT
  birthdayNoticeBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  birthdayNoticeEmoji: {
    fontSize: 22,
  },
  birthdayNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  birthdayNoticeSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 1,
  },

  // KHỐI MÓN KHOÁI KHẨU
  favoriteBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 8,
  },
  favoriteHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2,
  },
  favActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  favBuyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0EA5E9',
    paddingVertical: 8,
    borderRadius: 6,
  },
  favBuyNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  favExploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  favExploreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },

  // ==========================================
  // HỒ SƠ SỨC KHỎE STYLES
  // ==========================================
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 16,
    gap: 12,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  healthCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
    paddingBottom: 10,
  },
  healthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  healthSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  healthTabsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  healthTabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  healthTabBtnActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  healthTabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  healthTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tabContentContainer: {
    paddingTop: 4,
    gap: 10,
  },
  subTabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subTabHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTabSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  addRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  addRecordText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  recordList: {
    gap: 8,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordItemLeft: {
    flex: 1,
    gap: 3,
  },
  recordItemName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordItemClinic: {
    fontSize: 11,
    color: '#64748B',
  },
  recordDateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  recordDateText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  recordItemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeDone: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeUpcoming: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  statusBadgeTextDone: {
    color: '#16A34A',
  },
  statusBadgeTextUpcoming: {
    color: '#D97706',
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#E0F2FE',
  },
  remindBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  emptyRecordText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 8,
  },

  // CẢNH BÁO DỊ ỨNG & BỆNH LÝ
  allergyWarningCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  allergyWarningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allergyWarningIcon: {
    fontSize: 16,
  },
  allergyWarningTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#C2410C',
  },
  allergyWarningBody: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9A3412',
    lineHeight: 18,
  },
  allergyTipBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 6,
    padding: 6,
    marginTop: 2,
  },
  allergyTipText: {
    fontSize: 10.5,
    color: '#7C2D12',
    fontStyle: 'italic',
  },
  medicalConditionCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  medicalConditionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803D',
  },
  medicalConditionBody: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },

  // THƯỚC ĐO CÂN NẶNG BCS
  bcsBarContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  bcsBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  bcsSegmentsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 26,
    alignItems: 'center',
  },
  bcsSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bcsSegmentActive: {
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  bcsSegmentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  bcsAssessment: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
    marginTop: 2,
  },
  weightLogList: {
    gap: 6,
    marginTop: 4,
  },
  weightLogListTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  weightLogRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  weightLogLeft: {
    gap: 2,
  },
  weightLogDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  weightLogNote: {
    fontSize: 10.5,
    color: '#64748B',
  },
  weightLogRight: {
    alignItems: 'flex-end',
  },
  weightLogVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
  },

  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 16,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  tipsBody: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  adminBanner: {
    backgroundColor: '#0369A1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  adminBannerSub: {
    color: '#BAE6FD',
    fontSize: 11,
  },
  adminArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ==========================================
  // MODAL STYLES CHUNG
  // ==========================================
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 132, 199, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
    backgroundColor: '#F0F9FF',
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalHeaderIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0284C7',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
  },
  modalScrollArea: {
    maxHeight: 520,
  },
  modalScrollContent: {
    padding: 18,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  requiredStar: {
    color: '#EF4444',
  },
  fieldSubLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  typeBtnActive: {
    borderColor: '#0EA5E9',
    backgroundColor: '#E0F2FE',
  },
  typeEmoji: {
    fontSize: 18,
  },
  typeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  typeTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  switchOptionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  switchOptionBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  switchOptionBtnActive: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  switchOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  switchOptionTextActive: {
    color: '#0284C7',
  },
  quickBreedsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  quickBreedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickBreedPillActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  quickBreedText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  quickBreedTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelModalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelModalText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  submitModalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#0EA5E9',
  },
  submitModalText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // UPLOAD AVATAR STYLES TỪ THIẾT BỊ
  profileAvatarTouchable: {
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#0284C7',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarCameraBadgeText: {
    fontSize: 12,
  },
  petAvatarUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  petAvatarPreviewCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  petAvatarPlaceholderCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnUploadDevicePet: {
    backgroundColor: '#0284C7',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  btnUploadDevicePetText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  petUploadNote: {
    fontSize: 10.5,
    color: '#64748B',
  },
  presetAvatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetAvatarBtn: {
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  presetAvatarBtnActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  presetAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  presetAvatarName: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#334155',
    maxWidth: 60,
  },
});
