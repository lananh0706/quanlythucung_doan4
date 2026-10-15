import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CategoryItem,
  createCategoryApi,
  deleteCategoryApi,
  getCategories,
  updateCategoryApi,
} from '@/services/api';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'hat', slug: 'hat', name: 'Thức ăn hạt khô', icon: '🥣', description: 'Hạt dinh dưỡng cân bằng AAFCO ngừa sỏi thận & búi lông', productCount: 14, status: 'active' },
  { id: 'pate', slug: 'pate', name: 'Pate & Thức ăn ướt', icon: '🥫', description: 'Sốt & pate mọng nước cấp ẩm tự nhiên cho chó mèo lười uống', productCount: 9, status: 'active' },
  { id: 'xuong', slug: 'xuong', name: 'Snack & Xương gặm', icon: '🦴', description: 'Bánh thưởng & xương gặm sạch mảng bám vôi răng, thơm miệng', productCount: 7, status: 'active' },
  { id: 'caocap', slug: 'caocap', name: 'Dòng cao cấp Grain-Free', icon: '🥩', description: 'Đạm động vật tươi thuần khiết 100%, không độn ngũ cốc bắp ngô', productCount: 5, status: 'active' },
  { id: 'vesinh', slug: 'vesinh', name: 'Cát vệ sinh & Khử mùi', icon: '🚽', description: 'Cát đậu nành, bentonite vón siêu tốc & khử trùng an toàn', productCount: 6, status: 'active' },
  { id: 'yte', slug: 'yte', name: 'Dinh dưỡng & Y tế thú cưng', icon: '💊', description: 'Gel dinh dưỡng, men vi sinh, thuốc trị ve rận và vitamin cao cấp', productCount: 4, status: 'active' },
];

interface CategoryContextType {
  categories: CategoryItem[];
  activeCategories: CategoryItem[];
  loading: boolean;
  addCategory: (categoryData: Omit<CategoryItem, 'id'>) => Promise<CategoryItem>;
  updateCategory: (id: string | number, updatedData: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string | number) => Promise<void>;
  toggleCategoryStatus: (id: string | number) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const isRefreshingRef = useRef(false);

  // NẠP DANH MỤC TỪ BACKEND MYSQL XAMPP KHI KHỞI ĐỘNG
  const refreshCategories = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    try {
      const data = await getCategories();
      if (data && data.length > 0) {
        const formatted: CategoryItem[] = data.map((item: any) => ({
          id: item.id || item.slug,
          slug: item.slug || String(item.id),
          name: item.name || 'Danh mục',
          icon: item.icon || '🥣',
          description: item.description || '',
          productCount: Number(item.product_count || item.productCount || 0),
          status: item.status === 'hidden' ? 'hidden' : 'active',
        }));
        setCategories(formatted);
      }
    } catch (error) {
      console.error('Lỗi khi nạp danh mục:', error);
    } finally {
      setLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // THÊM DANH MỤC MỚI (Admin) -> Cập nhật CSDL + Đồng bộ ngay sang trang Khách hàng
  const addCategory = async (categoryData: Omit<CategoryItem, 'id'>): Promise<CategoryItem> => {
    const newId = String(categoryData.slug || `cat-${Date.now()}`);
    const newCategory: CategoryItem = {
      ...categoryData,
      id: newId,
      productCount: categoryData.productCount || 0,
      status: categoryData.status || 'active',
    };

    // 1. Cập nhật state ngay lập tức để trang khách hàng thấy ngay
    setCategories((prev) => [newCategory, ...prev]);

    // 2. Gửi API lưu vào MySQL
    try {
      const res = await createCategoryApi(newCategory);
      if (res?.data?.id) {
        setCategories((prev) =>
          prev.map((c) => (c.id === newId ? { ...c, id: res.data.id } : c))
        );
      }
    } catch (e) {
      console.warn('Lỗi ghi API tạo danh mục:', e);
    }

    return newCategory;
  };

  // CẬP NHẬT DANH MỤC (Admin) -> Cập nhật CSDL + Trang Khách hàng đổi ngay lập tức
  const updateCategory = async (id: string | number, updatedData: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (String(c.id) === String(id) || c.slug === id ? { ...c, ...updatedData } : c))
    );

    try {
      await updateCategoryApi({ id, ...updatedData });
    } catch (e) {
      console.warn('Lỗi ghi API cập nhật danh mục:', e);
    }
  };

  // XÓA DANH MỤC (Admin) -> Xóa khỏi CSDL + Biến mất ngay trên trang Khách hàng
  const deleteCategory = async (id: string | number) => {
    const target = categories.find((c) => String(c.id) === String(id) || c.slug === id);
    setCategories((prev) => prev.filter((c) => String(c.id) !== String(id) && c.slug !== id));

    try {
      await deleteCategoryApi(id, target?.slug);
    } catch (e) {
      console.warn('Lỗi ghi API xóa danh mục:', e);
    }
  };

  // ẨN / HIỆN DANH MỤC (Admin)
  const toggleCategoryStatus = async (id: string | number) => {
    const current = categories.find((c) => String(c.id) === String(id) || c.slug === id);
    if (!current) return;
    const newStatus = current.status === 'active' ? 'hidden' : 'active';
    await updateCategory(id, { status: newStatus });
  };

  // DANH MỤC ĐANG HIỂN THỊ (cho khách hàng)
  const activeCategories = categories.filter((c) => c.status === 'active');

  return (
    <CategoryContext.Provider
      value={{
        categories,
        activeCategories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        refreshCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
