import { Platform } from 'react-native';

// Đường dẫn API trỏ tới backend XAMPP (hỗ trợ cả Web localhost và Điện thoại Expo)
export const BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost/petcare-api'
    : 'http://192.168.1.8/petcare-api';

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
    soldCount?: string;
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

// 1. API SẢN PHẨM
export const getProducts = async (): Promise<ProductItem[]> => {
    try {
        const res = await fetch(`${BASE_URL}/get_products.php`);
        if (!res.ok) return [];
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            return json.data;
        }
        return [];
    } catch (error) {
        console.warn("Lỗi khi kết nối tới API XAMPP (getProducts):", error);
        return [];
    }
};

// 2. API DANH MỤC
export const getCategories = async (): Promise<CategoryItem[]> => {
    try {
        const res = await fetch(`${BASE_URL}/get_categories.php?all=1`);
        if (!res.ok) return [];
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            return json.data;
        }
        return [];
    } catch (error) {
        console.warn("Lỗi khi kết nối tới API XAMPP (getCategories):", error);
        return [];
    }
};

export const createCategoryApi = async (category: Partial<CategoryItem>): Promise<any> => {
    try {
        const res = await fetch(`${BASE_URL}/manage_categories.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!res.ok) return { success: false };
        return await res.json();
    } catch (error) {
        console.warn("Lỗi kết nối tạo danh mục:", error);
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
        return await res.json();
    } catch (error) {
        console.warn("Lỗi kết nối cập nhật danh mục:", error);
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
        return await res.json();
    } catch (error) {
        console.warn("Lỗi kết nối xóa danh mục:", error);
        return { success: false };
    }
};

// 3. API ĐẶT LỊCH HẸN TƯ VẤN (Khách hàng -> MySQL -> Admin)
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
        console.warn("Lỗi kết nối đặt lịch hẹn:", error);
        return { success: false };
    }
};

// 4. API ĐĂNG KÝ THÀNH VIÊN KHÁCH HÀNG (Khách hàng -> MySQL -> Admin)
export const registerCustomerApi = async (data: {
    name: string;
    phone: string;
    email?: string;
}): Promise<any> => {
    try {
        const res = await fetch(`${BASE_URL}/register_customer.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) return { success: false };
        return await res.json();
    } catch (error) {
        console.warn("Lỗi kết nối đăng ký khách hàng:", error);
        return { success: false };
    }
};