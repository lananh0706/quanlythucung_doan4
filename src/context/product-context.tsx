import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { BASE_URL, getProducts } from '@/services/api';

export interface ProductWeightVariant {
  weight: string;
  price: number;
  originalPrice: number;
}

export interface ProductItem {
  id: number | string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  category_slug?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  discount?: string;
  stock: number;
  soldCount: number | string;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  weightOptions: ProductWeightVariant[];
  proteinSources?: string;
  targetPet?: string;
  crudeProtein?: string;
  crudeFat?: string;
  crudeFiber?: string;
  caloriesKcal?: string;
  productType?: 'food' | 'litter' | 'accessory';
  scents?: string[];
  highlightTags?: string[];
  badge?: string;
  tags?: string[];
  inStock?: boolean;
  isNewlyLaunched?: boolean;
  _edited?: boolean;
}

import { INITIAL_PRODUCTS_SEED } from '@/constants/initial-products-data';

export const INITIAL_PRODUCTS: ProductItem[] = INITIAL_PRODUCTS_SEED;

const STORAGE_KEY = 'petcare_shared_products_v4';
const CUSTOM_IMAGES_STORAGE_KEY = 'petcare_custom_product_images_v2';

// Helper chuẩn hóa galleryImages luôn luôn là string[] tuyệt đối an toàn
export const normalizeGalleryImages = (rawGallery: any, fallbackImage?: string): string[] => {
  if (Array.isArray(rawGallery)) {
    const list = rawGallery.map((item) => (item ? String(item).trim() : '')).filter(Boolean);
    if (list.length > 0) return list;
  } else if (typeof rawGallery === 'string') {
    const trimmed = rawGallery.trim();
    if (trimmed) {
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            const list = parsed.map((item) => (item ? String(item).trim() : '')).filter(Boolean);
            if (list.length > 0) return list;
          }
        } catch (e) {}
      }
      if (trimmed.includes(',')) {
        const list = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        if (list.length > 0) return list;
      }
      return [trimmed];
    }
  }
  return fallbackImage ? [fallbackImage] : [];
};

// Lấy bộ nhớ ảnh tùy chỉnh đã sửa đổi để không bao giờ bị mất
const getCustomImagesMap = (): Record<string, { image: string; galleryImages?: string[] }> => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(CUSTOM_IMAGES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return {};
};

// Lưu ảnh tùy chỉnh lâu dài
const saveCustomImage = (id: number | string, image?: string, galleryImages?: string[]) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && image) {
    try {
      const cur = getCustomImagesMap();
      cur[String(id)] = {
        image,
        galleryImages: galleryImages && galleryImages.length > 0 ? galleryImages : cur[String(id)]?.galleryImages,
      };
      window.localStorage.setItem(CUSTOM_IMAGES_STORAGE_KEY, JSON.stringify(cur));
    } catch (e) {
      try {
        if (!image.startsWith('data:image')) {
          const cur = getCustomImagesMap();
          cur[String(id)] = { image, galleryImages };
          window.localStorage.setItem(CUSTOM_IMAGES_STORAGE_KEY, JSON.stringify(cur));
        }
      } catch (e2) {}
    }
  }
};

interface ProductContextType {
  products: ProductItem[];
  loading: boolean;
  addProduct: (productData: Partial<ProductItem>) => Promise<ProductItem>;
  updateProduct: (id: number | string, updatedData: Partial<ProductItem>) => Promise<void>;
  deleteProduct: (id: number | string) => Promise<void>;
  getProductById: (id: number | string) => ProductItem | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const customImages = getCustomImagesMap();
    let initialList = INITIAL_PRODUCTS;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = parsed;
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    return initialList.map((p) => {
      const cust = customImages[String(p.id)];
      const chosenImg = cust && cust.image ? cust.image : p.image;
      const rawGallery = cust?.galleryImages ?? p.galleryImages;
      return {
        ...p,
        image: chosenImg,
        galleryImages: normalizeGalleryImages(rawGallery, chosenImg),
        _edited: cust ? true : p._edited,
      };
    });
  });

  const [loading, setLoading] = useState(false);

  // Helper lưu localStorage với cơ chế chống tràn quota bộ nhớ trình duyệt
  const saveToStorage = (newProducts: ProductItem[]) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      } catch (e) {
        try {
          const stripped = newProducts.map((p) => ({
            ...p,
            image: p.image && p.image.startsWith('data:image') ? '' : p.image,
            galleryImages: Array.isArray(p.galleryImages)
              ? p.galleryImages.filter((g) => !g.startsWith('data:image'))
              : [],
          }));
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
        } catch (e2) {}
      }
    }
  };

  const isRefreshingRef = useRef(false);

  // Đồng bộ từ MySQL backend khi khởi động - LUÔN BẢO TOÀN HÌNH ẢNH NGƯỜI DÙNG ĐÃ ĐỔI
  const refreshProducts = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    try {
      setLoading(true);
      const data = await getProducts();
      if (data && data.length > 0) {
        setProducts((currentProducts) => {
          const customImages = getCustomImagesMap();
          const map = new Map<string, ProductItem>();
          currentProducts.forEach((p) => map.set(String(p.id), p));
          data.forEach((p: any) => {
            const strId = String(p.id);
            const existing = map.get(strId);
            const customForThis = customImages[strId];

            // Ưu tiên ảnh: 1. Đã tùy chỉnh Admin trong customImages -> 2. Ảnh từ MySQL -> 3. Ảnh hiện tại
            const chosenImage =
              (customForThis && customForThis.image ? customForThis.image : '') ||
              (p.image ? p.image : '') ||
              (existing && existing.image ? existing.image : '');

            const rawGallery =
              (customForThis && customForThis.galleryImages && customForThis.galleryImages.length > 0)
                ? customForThis.galleryImages
                : (p.gallery_images && p.gallery_images.length > 0)
                ? p.gallery_images
                : (p.galleryImages && p.galleryImages.length > 0)
                ? p.galleryImages
                : (existing?.galleryImages || []);
            const chosenGallery = normalizeGalleryImages(rawGallery, chosenImage);

            map.set(strId, {
              ...existing,
              ...p,
              id: p.id,
              name: p.name || existing?.name || `Sản phẩm #${p.id}`,
              price: Number(p.price) || existing?.price || 50000,
              originalPrice: Number(p.originalPrice || p.original_price) || existing?.originalPrice || Math.round(Number(p.price || 50000) * 1.2),
              discountPercent: p.discount_percent !== undefined ? Number(p.discount_percent) : (p.discountPercent !== undefined ? Number(p.discountPercent) : existing?.discountPercent || 0),
              image: chosenImage,
              galleryImages: chosenGallery,
              category: p.category_slug || p.category || existing?.category || 'hat',
              category_slug: p.category_slug || existing?.category_slug || 'hat',
              stock: p.stock !== undefined ? Number(p.stock) : (existing?.stock !== undefined ? existing.stock : 100),
              description: p.description !== undefined ? p.description : existing?.description,
              brand: p.brand || existing?.brand,
              productType: p.product_type || p.productType || existing?.productType || 'food',
              weightOptions: p.weight_options || p.weightOptions || existing?.weightOptions,
              scents: Array.isArray(p.scents)
                ? p.scents
                : typeof p.scents === 'string' && p.scents.trim()
                ? p.scents.split(',').map((s: string) => s.trim()).filter(Boolean)
                : (existing?.scents || []),
              highlightTags: Array.isArray(p.highlightTags)
                ? p.highlightTags
                : typeof p.highlightTags === 'string' && p.highlightTags.trim()
                ? p.highlightTags.split(',').map((s: string) => s.trim()).filter(Boolean)
                : (existing?.highlightTags || []),
              inStock: p.in_stock !== undefined ? Boolean(p.in_stock) : (p.inStock !== undefined ? Boolean(p.inStock) : true),
              _edited: Boolean(customForThis) || existing?._edited,
            } as ProductItem);
          });
          const merged = Array.from(map.values());
          saveToStorage(merged);
          return merged;
        });
      }
    } catch (e) {
      console.log('Chưa kết nối MySQL XAMPP hoặc dùng offline:', e);
    } finally {
      setLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // 1. THÊM SẢN PHẨM MỚI (Admin) -> Phản chiếu ngay lập tức sang trang Khách hàng
  const addProduct = async (productData: Partial<ProductItem>): Promise<ProductItem> => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
    const catSlug = (productData.category || '').toLowerCase().includes('pate')
      ? 'pate'
      : (productData.category || '').toLowerCase().includes('cát')
      ? 'vesinh'
      : (productData.category || '').toLowerCase().includes('xương')
      ? 'xuong'
      : (productData.category || '').toLowerCase().includes('cao cấp')
      ? 'caocap'
      : (productData.category || '').toLowerCase().includes('y tế')
      ? 'yte'
      : 'hat';

    const newProd: ProductItem = {
      id: newId,
      name: productData.name || 'Sản phẩm mới',
      sku: productData.sku || `PET-${newId}-408`,
      brand: productData.brand || 'Chính hãng',
      category: productData.category || 'Thức ăn khô / Hạt dinh dưỡng',
      category_slug: productData.category_slug || catSlug,
      price: Number(productData.price) || 50000,
      originalPrice: Number(productData.originalPrice) || Math.round((Number(productData.price) || 50000) * 1.2),
      discountPercent: Number(productData.discountPercent) || 0,
      discount: productData.discountPercent ? `-${productData.discountPercent}%` : '',
      stock: Number(productData.stock) || 100,
      soldCount: productData.soldCount || '0 đã bán',
      rating: Number(productData.rating) || 5.0,
      reviewCount: Number(productData.reviewCount) || 1,
      image: productData.image || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800',
      galleryImages: normalizeGalleryImages(productData.galleryImages || (productData as any)?.gallery_images, productData.image),
      description: productData.description || 'Thức ăn thơm ngon giàu dinh dưỡng cho thú cưng.',
      weightOptions: productData.weightOptions || [
        { weight: '400g', price: Number(productData.price) || 50000, originalPrice: Number(productData.originalPrice) || 60000 },
      ],
      proteinSources: productData.proteinSources || 'Thịt gia cầm tươi & men vi sinh',
      targetPet: productData.targetPet || 'Chó mèo mọi lứa tuổi',
      crudeProtein: productData.crudeProtein || '≥ 30.0%',
      crudeFat: productData.crudeFat || '≥ 12.0%',
      productType: productData.productType || 'food',
      scents: productData.scents || [],
      highlightTags: productData.highlightTags || [],
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      isNewlyLaunched: productData.isNewlyLaunched || false,
      _edited: true,
    };

    if (newProd.image) {
      saveCustomImage(newId, newProd.image, newProd.galleryImages);
    }

    setProducts((prev) => {
      const updated = [newProd, ...prev];
      saveToStorage(updated);
      return updated;
    });

    // Gửi API lưu MySQL
    fetch(`${BASE_URL}/manage_products.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success && res.data && res.data.image) {
          saveCustomImage(newId, res.data.image, res.data.gallery_images);
          setProducts((prev) => {
            const updated = prev.map((p) => {
              if (String(p.id) === String(newId)) {
                return {
                  ...p,
                  image: res.data.image,
                  galleryImages: res.data.gallery_images && res.data.gallery_images.length > 0 ? res.data.gallery_images : p.galleryImages,
                };
              }
              return p;
            });
            saveToStorage(updated);
            return updated;
          });
        }
      })
      .catch(() => {});

    return newProd;
  };

  // 2. CẬP NHẬT SẢN PHẨM (Admin) -> Cả Admin & Trang Khách Hàng đổi ngay lập tức 100%
  const updateProduct = async (id: number | string, updatedData: Partial<ProductItem>): Promise<void> => {
    const normalizedData = { ...updatedData };
    if ('galleryImages' in updatedData || 'gallery_images' in (updatedData as any)) {
      normalizedData.galleryImages = normalizeGalleryImages(
        updatedData.galleryImages || (updatedData as any)?.gallery_images,
        updatedData.image
      );
    }

    if (normalizedData.image) {
      saveCustomImage(id, normalizedData.image, normalizedData.galleryImages);
    }
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (String(p.id) === String(id)) {
          const discountVal =
            normalizedData.discountPercent !== undefined
              ? normalizedData.discountPercent
              : p.discountPercent;
          return {
            ...p,
            ...normalizedData,
            image: normalizedData.image || p.image,
            galleryImages: normalizedData.galleryImages || p.galleryImages,
            _edited: true,
            id: p.id,
            discount: discountVal ? `-${discountVal}%` : p.discount,
          };
        }
        return p;
      });
      saveToStorage(updated);
      return updated;
    });

    // Gửi API lưu MySQL và cập nhật lại URL tệp ảnh từ server (nếu đã lưu từ base64)
    fetch(`${BASE_URL}/manage_products.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...normalizedData }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success && res.data && res.data.image) {
          const srvImg = res.data.image;
          const srvGal = res.data.gallery_images;
          saveCustomImage(id, srvImg, srvGal);
          setProducts((prev) => {
            const updated = prev.map((p) => {
              if (String(p.id) === String(id)) {
                return {
                  ...p,
                  image: srvImg,
                  galleryImages: srvGal && srvGal.length > 0 ? srvGal : p.galleryImages,
                };
              }
              return p;
            });
            saveToStorage(updated);
            return updated;
          });
        }
      })
      .catch((err) => {
        console.log('Lỗi cập nhật MySQL:', err);
      });
  };

  // 3. XÓA SẢN PHẨM (Admin)
  const deleteProduct = async (id: number | string): Promise<void> => {
    setProducts((prev) => {
      const updated = prev.filter((p) => String(p.id) !== String(id));
      saveToStorage(updated);
      return updated;
    });

    // Gửi API xóa MySQL
    fetch(`${BASE_URL}/manage_products.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  // 4. LẤY SẢN PHẨM THEO ID
  const getProductById = (id: number | string): ProductItem | undefined => {
    return products.find((p) => String(p.id) === String(id));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
