import React, { createContext, useContext, useEffect, useState } from 'react';

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  status: 'done' | 'due' | 'upcoming';
  clinic?: string;
}

export interface DewormRecord {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  type: 'deworm' | 'flea';
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface Pet {
  id: number;
  customerId: string; // Liên kết trực tiếp với mã khách hàng
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: string;
  weight: string;
  favoriteFood: string;
  avatar: string;
  // BỔ SUNG THEO YÊU CẦU:
  gender?: 'male' | 'female'; // Đực / Cái
  isNeutered?: boolean; // Đã triệt sản (Yes/No)
  birthDate?: string; // Ngày sinh hoặc Ngày nhận nuôi
  coatColor?: string; // Màu lông / Đặc điểm nhận dạng
  allergies?: string; // Tiền sử dị ứng (ví dụ: Dị ứng thịt gà, ngũ cốc...)
  medicalNotes?: string; // Bệnh lý nền (ví dụ: Viêm da cơ địa, dạ dày nhạy cảm)
  vaccines?: VaccineRecord[]; // Sổ tiêm chủng
  deworming?: DewormRecord[]; // Lịch tẩy giun / Nhỏ gáy diệt ve rận
  weightLogs?: WeightLog[]; // Lịch sử cân nặng theo tháng
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'Bạc' | 'Vàng' | 'Kim Cương';
  petXu: number;
  totalSpent: number;
  ordersCount: number;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cus-1',
    name: 'Nguyễn Văn Minh',
    phone: '0982.112.233',
    email: 'minh.nguyen@gmail.com',
    tier: 'Vàng',
    petXu: 285,
    totalSpent: 2850000,
    ordersCount: 7,
  },
  {
    id: 'cus-2',
    name: 'Lê Hoàng Yến',
    phone: '0977.221.144',
    email: 'hoangyen.design@gmail.com',
    tier: 'Kim Cương',
    petXu: 412,
    totalSpent: 4120000,
    ordersCount: 11,
  },
  {
    id: 'cus-3',
    name: 'Trần Thu Trang',
    phone: '0912.889.900',
    email: 'thutrang.tran@vnu.edu.vn',
    tier: 'Bạc',
    petXu: 125,
    totalSpent: 1250000,
    ordersCount: 4,
  },
];

const INITIAL_PETS: Pet[] = [
  {
    id: 1,
    customerId: 'cus-1',
    name: 'Bé Lu',
    type: 'dog',
    breed: 'Corgi Pembroke',
    age: '1.5 tuổi',
    weight: '11.5 kg',
    favoriteFood: 'SmartHeart bò nướng & Pate thịt bò',
    avatar:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    gender: 'male',
    isNeutered: true,
    birthDate: '15/06/2023',
    coatColor: 'Vàng cam trắng, mông trái tim đặc trưng',
    allergies: 'Không ghi nhận dị ứng thức ăn',
    medicalNotes: 'Từng viêm tai ngoài nhẹ (đã khỏi hoàn toàn), xương khớp hông tốt',
    vaccines: [
      { id: 'v1', name: 'Vaccine 7 trong 1 (DHPPi+L)', date: '15/07/2024', nextDate: '15/07/2025', status: 'done', clinic: 'PetCare Cầu Giấy' },
      { id: 'v2', name: 'Vaccine Phòng Dại (Rabies)', date: '20/08/2024', nextDate: '20/08/2025', status: 'done', clinic: 'PetCare Cầu Giấy' },
      { id: 'v3', name: 'Nhắc lại 7 trong 1 định kỳ', date: 'Đang chờ', nextDate: '15/07/2025', status: 'upcoming' },
    ],
    deworming: [
      { id: 'd1', name: 'Tẩy giun định kỳ Sanpet', date: '10/01/2025', nextDate: '10/04/2025', type: 'deworm' },
      { id: 'd2', name: 'Nhỏ gáy diệt ve rận NexGard Spectra', date: '01/02/2025', nextDate: '01/03/2025', type: 'flea' },
    ],
    weightLogs: [
      { id: 'w1', date: '10/2024', weight: 10.8, note: 'Khỏe mạnh, năng động' },
      { id: 'w2', date: '12/2024', weight: 11.2, note: 'Tăng cơ tốt sau khi đổi hạt' },
      { id: 'w3', date: '02/2025', weight: 11.5, note: 'Cân đối, chuẩn phom Corgi' },
    ],
  },
  {
    id: 2,
    customerId: 'cus-1',
    name: 'Bé Kem',
    type: 'dog',
    breed: 'Poodle Nâu Xoăn',
    age: '2 tuổi',
    weight: '4.2 kg',
    favoriteFood: 'Hạt dinh dưỡng & Bánh thưởng ức gà',
    avatar:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    gender: 'female',
    isNeutered: false,
    birthDate: '20/11/2022',
    coatColor: 'Nâu đỏ xoăn, ngực có yếm trắng xinh',
    allergies: 'Dị ứng đạm bò (dễ nổi mề đay ngứa tai)',
    medicalNotes: 'Dạ dày nhạy cảm, dễ nôn khan khi ăn đồ lạnh',
    vaccines: [
      { id: 'v1', name: 'Vaccine 5 trong 1 Vanguard', date: '05/06/2024', nextDate: '05/06/2025', status: 'done', clinic: 'PetCare Center' },
      { id: 'v2', name: 'Vaccine Phòng Dại', date: '12/07/2024', nextDate: '12/07/2025', status: 'done' },
    ],
    deworming: [
      { id: 'd1', name: 'Tẩy giun định kỳ Drontal', date: '15/12/2024', nextDate: '15/03/2025', type: 'deworm' },
      { id: 'd2', name: 'Nhỏ gáy trị ve rận Revolution', date: '15/01/2025', nextDate: '15/02/2025', type: 'flea' },
    ],
    weightLogs: [
      { id: 'w1', date: '10/2024', weight: 3.9 },
      { id: 'w2', date: '12/2024', weight: 4.0 },
      { id: 'w3', date: '02/2025', weight: 4.2, note: 'Cân nặng lý tưởng' },
    ],
  },
  {
    id: 3,
    customerId: 'cus-2',
    name: 'Miu Miu',
    type: 'cat',
    breed: 'Mèo Anh Lông Ngắn',
    age: '2 tuổi',
    weight: '4.2 kg',
    favoriteFood: 'Royal Canin Fit 32 & Pate cá ngừ',
    avatar:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    gender: 'female',
    isNeutered: true,
    birthDate: '08/03/2023',
    coatColor: 'Xám xanh ánh bạc (Blue BSH), mắt hổ phách',
    allergies: 'Dị ứng ngũ cốc (Gluten), cần ăn hạt Grain-free',
    medicalNotes: 'Ít chịu uống nước, cần bổ sung pate ướt phòng sỏi thận',
    vaccines: [
      { id: 'v1', name: 'Vaccine 4 bệnh mèo PureVax', date: '10/05/2024', nextDate: '10/05/2025', status: 'done' },
      { id: 'v2', name: 'Vaccine Dại Nobivac Rabies', date: '10/05/2024', nextDate: '10/05/2025', status: 'done' },
    ],
    deworming: [
      { id: 'd1', name: 'Tẩy giun Milbemax cho mèo', date: '05/01/2025', nextDate: '05/04/2025', type: 'deworm' },
      { id: 'd2', name: 'Nhỏ gáy Broadline phòng ve rận & sán', date: '20/01/2025', nextDate: '20/02/2025', type: 'flea' },
    ],
    weightLogs: [
      { id: 'w1', date: '09/2024', weight: 3.8 },
      { id: 'w2', date: '11/2024', weight: 4.0 },
      { id: 'w3', date: '01/2025', weight: 4.2, note: 'Hơi mũm mĩm, thể trạng tốt' },
    ],
  },
  {
    id: 4,
    customerId: 'cus-3',
    name: 'Bánh Bao',
    type: 'cat',
    breed: 'Mèo Ba Tư Trắng Tuyết',
    age: '3 tuổi',
    weight: '4.8 kg',
    favoriteFood: 'Pate Me-O cá hồi & Bánh thưởng sữa dê',
    avatar:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80',
    gender: 'male',
    isNeutered: true,
    birthDate: '12/01/2022',
    coatColor: 'Trắng tuyết tinh khôi, mắt 2 màu xanh-vàng',
    allergies: 'Dị ứng hải sản tôm cua (dễ tiêu chảy)',
    medicalNotes: 'Tuyến lệ nhạy cảm, dễ chảy nước mắt vàng, cần vệ sinh hàng ngày',
    vaccines: [
      { id: 'v1', name: 'Vaccine 4 bệnh mèo Felocell', date: '18/04/2024', nextDate: '18/04/2025', status: 'done' },
      { id: 'v2', name: 'Vaccine Phòng Dại', date: '18/04/2024', nextDate: '18/04/2025', status: 'done' },
    ],
    deworming: [
      { id: 'd1', name: 'Tẩy giun định kỳ', date: '02/11/2024', nextDate: '02/02/2025', type: 'deworm' },
      { id: 'd2', name: 'Nhỏ gáy Advocate mèo', date: '15/12/2024', nextDate: '15/01/2025', type: 'flea' },
    ],
    weightLogs: [
      { id: 'w1', date: '08/2024', weight: 4.5 },
      { id: 'w2', date: '11/2024', weight: 4.7 },
      { id: 'w3', date: '01/2025', weight: 4.8, note: 'Chuẩn thể trạng lông xù' },
    ],
  },
];

interface CustomerPetContextType {
  customers: Customer[];
  pets: Pet[];
  currentCustomerId: string;
  currentCustomer: Customer | undefined;
  currentCustomerPets: Pet[];
  setCurrentCustomerId: (id: string) => void;
  addPetForCurrentCustomer: (pet: Omit<Pet, 'id' | 'customerId'>) => Pet;
  updatePet: (id: number, updated: Partial<Pet>) => void;
  deletePet: (id: number) => void;
  getPetsByCustomerId: (customerId: string) => Pet[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

const CustomerPetContext = createContext<CustomerPetContextType | undefined>(undefined);

export function CustomerPetProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [currentCustomerId, setCurrentCustomerId] = useState<string>('cus-1');

  const currentCustomer = customers.find((c) => c.id === currentCustomerId) || customers[0];
  const currentCustomerPets = pets.filter((p) => p.customerId === (currentCustomer?.id || 'cus-1'));

  const getPetsByCustomerId = (customerId: string): Pet[] => {
    return pets.filter((p) => p.customerId === customerId);
  };

  const addPetForCurrentCustomer = (petData: Omit<Pet, 'id' | 'customerId'>): Pet => {
    const newPet: Pet = {
      ...petData,
      id: Date.now(),
      customerId: currentCustomer?.id || 'cus-1',
    };
    setPets((prev) => [...prev, newPet]);
    return newPet;
  };

  const updatePet = (id: number, updated: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deletePet = (id: number) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const addCustomer = (customerData: Omit<Customer, 'id'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cus-${Date.now()}`,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    // Xóa toàn bộ các bé thuộc về khách hàng bị xóa
    setPets((prev) => prev.filter((p) => p.customerId !== id));
  };

  return (
    <CustomerPetContext.Provider
      value={{
        customers,
        pets,
        currentCustomerId,
        currentCustomer,
        currentCustomerPets,
        setCurrentCustomerId,
        addPetForCurrentCustomer,
        updatePet,
        deletePet,
        getPetsByCustomerId,
        addCustomer,
        updateCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </CustomerPetContext.Provider>
  );
}

export function useCustomerPet() {
  const context = useContext(CustomerPetContext);
  if (!context) {
    throw new Error('useCustomerPet must be used within a CustomerPetProvider');
  }
  return context;
}
