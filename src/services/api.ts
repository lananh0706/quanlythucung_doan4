import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { INITIAL_PRODUCTS_SEED } from '@/constants/initial-products-data';

// ============================================================
// 1. TỰ ĐỘNG NHẬN DIỆN IP MÁY CHỦ (DYNAMIC LAN HOST DETECTION)
// ============================================================
export const getBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return `${window.location.protocol}//${window.location.hostname}/petcare-api`;
    }
    return 'http://localhost/petcare-api';
  }

  // Tự động bóc tách IP từ Metro Bundler khi chạy trên thiết bị di động (Expo Go)
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any)?.manifest?.debuggerHost ||
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}/petcare-api`;
    }
  }

  // Fallback IP khi offline hoặc môi trường độc lập
  return 'http://192.168.1.10/petcare-api';
};

export const BASE_URL = getBaseUrl();

// ============================================================
// 2. TYPES VÀ INTERFACES
// ============================================================
export interface ProductItem {
  id: number | string;
  name: string;
  price: number;
  description: string;
  image: string;
  brand?: string;
  originalPrice?: number;
  original_price?: number;
  discount?: string;
  discount_percent?: number;
  category?: string;
  category_slug?: string;
  rating?: number;
  soldCount?: string | number;
  sold_count?: number;
}

export interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  productCount?: number;
  product_count?: number;
  status: 'active' | 'hidden';
}

export interface AuthUser {
  id: number;
  code?: string;
  username?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  membershipRank?: string;
  petXu?: number;
  type: 'admin' | 'customer';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}

// ============================================================
// 3. TẦNG BỘ NHỚ ĐỆM (IN-MEMORY CACHE & OFFLINE RESILIENCE)
// ============================================================
let cachedProducts: ProductItem[] | null = null;
let cachedCategories: CategoryItem[] | null = null;
let currentUserSession: { token: string; user: AuthUser } | null = null;

// ============================================================
// 4. API XÁC THỰC (AUTHENTICATION & JWT SESSIONS)
// ============================================================
export const loginApi = async (credentials: {
  username?: string;
  email?: string;
  password?: string;
}): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/auth_login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (json.success && json.token) {
      currentUserSession = { token: json.token, user: json.user };
    }
    return json;
  } catch (error) {
    console.warn('Lỗi kết nối auth_login:', error);
    // Hỗ trợ đăng nhập offline dự phòng nếu mất kết nối mạng
    if (
      (credentials.username === 'admin' || credentials.email === 'admin@petcare.vn') &&
      credentials.password === '123'
    ) {
      return {
        success: true,
        message: 'Đăng nhập Quản trị viên (Chế độ Offline)',
        token: 'PETCARE_OFFLINE_ADMIN_TOKEN',
        user: {
          id: 1,
          username: 'admin',
          name: 'Quản trị viên PetCare',
          email: 'admin@petcare.vn',
          role: 'Quản trị viên tối cao',
          type: 'admin',
        },
      };
    }
    return { success: false, message: 'Không thể kết nối đến máy chủ xác thực!' };
  }
};

export const registerApi = async (data: {
  name: string;
  phone: string;
  email?: string;
  password?: string;
}): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/auth_register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success && json.token) {
      currentUserSession = { token: json.token, user: json.user };
    }
    return json;
  } catch (error) {
    console.warn('Lỗi kết nối auth_register:', error);
    return { success: false, message: 'Lỗi kết nối đến máy chủ đăng ký!' };
  }
};

export const getCurrentSession = () => currentUserSession;

export const logoutApi = () => {
  currentUserSession = null;
};

// ============================================================
// 5. API SẢN PHẨM (PRODUCTS VỚI CACHE OFFLINE)
// ============================================================
export const getProducts = async (forceRefresh = false): Promise<ProductItem[]> => {
  if (!forceRefresh && cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }
  try {
    const res = await fetch(`${BASE_URL}/get_products.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      cachedProducts = json.data;
      return json.data;
    }
  } catch (error) {
    console.warn('Lỗi kết nối API getProducts, chuyển sang cache dự phòng:', error);
  }
  // Fallback an toàn, app không bao giờ bị trắng trang
  return (INITIAL_PRODUCTS_SEED as any) || [];
};

// ============================================================
// 6. API DANH MỤC
// ============================================================
export const getCategories = async (forceRefresh = false): Promise<CategoryItem[]> => {
  if (!forceRefresh && cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }
  try {
    const res = await fetch(`${BASE_URL}/get_categories.php?all=1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      cachedCategories = json.data;
      return json.data;
    }
  } catch (error) {
    console.warn('Lỗi kết nối API getCategories:', error);
  }
  return cachedCategories || [];
};

export const createCategoryApi = async (category: Partial<CategoryItem>): Promise<any> => {
  try {
    const res = await fetch(`${BASE_URL}/manage_categories.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) return { success: false };
    const json = await res.json();
    cachedCategories = null; // Invalidate cache
    return json;
  } catch (error) {
    console.warn('Lỗi kết nối tạo danh mục:', error);
    return { success: false };
  }
};

export const updateCategoryApi = async (category: Partial<CategoryItem>): Promise<any> => {
  try {
    const res = await fetch(`${BASE_URL}/manage_categories.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) return { success: false };
    const json = await res.json();
    cachedCategories = null;
    return json;
  } catch (error) {
    console.warn('Lỗi kết nối cập nhật danh mục:', error);
    return { success: false };
  }
};

export const deleteCategoryApi = async (id: string | number, slug?: string): Promise<any> => {
  try {
    const res = await fetch(`${BASE_URL}/manage_categories.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, slug }),
    });
    if (!res.ok) return { success: false };
    const json = await res.json();
    cachedCategories = null;
    return json;
  } catch (error) {
    console.warn('Lỗi kết nối xóa danh mục:', error);
    return { success: false };
  }
};

// ============================================================
// 7. API ĐẶT LỊCH HẸN & ĐĂNG KÝ KHÁCH HÀNG
// ============================================================
export const createAppointmentApi = async (data: {
  customerName?: string;
  customerPhone: string;
  petName?: string;
  petType?: string;
  issue?: string;
  doctor?: string;
  date?: string;
  time?: string;
}): Promise<any> => {
  try {
    const res = await fetch(`${BASE_URL}/create_appointment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false };
    return await res.json();
  } catch (error) {
    console.warn('Lỗi kết nối đặt lịch hẹn:', error);
    return { success: false };
  }
};

export const registerCustomerApi = async (data: {
  name: string;
  phone: string;
  email?: string;
}): Promise<any> => {
  return registerApi({ ...data, password: '123' });
};