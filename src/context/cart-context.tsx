import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  weight: string;
  image: string;
  quantity: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  image: string;
}

export interface Order {
  id: string;
  orderDate: string;
  status: 'processing' | 'delivering' | 'completed';
  statusText: string;
  totalAmount: string;
  stepIndex: number;
  shipper?: {
    name: string;
    phone: string;
    vehicle: string;
    eta: string;
  };
  items: OrderItem[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { id: number; name: string; numericPrice: number; weight: string; image: string }, quantity?: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32',
      price: 350000,
      weight: '2.0 kg',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Pate Cho Chó Pedigree Vị Thịt Bò Và Rau Củ',
      price: 28000,
      weight: '130 g',
      image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
      quantity: 3,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'PET-829142',
      orderDate: 'Hôm nay, 08:30',
      status: 'delivering',
      statusText: 'Đang Giao Hàng',
      totalAmount: '378.000 đ',
      stepIndex: 2,
      shipper: {
        name: 'Nguyễn Văn Minh (Shipper PetCare)',
        phone: '0982.345.678',
        vehicle: 'Yamaha Grande - 29-X1 482.19',
        eta: 'Dự kiến tới trong 25 phút',
      },
      items: [
        {
          name: 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32 (2kg)',
          quantity: 1,
          price: '350.000 đ',
          image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      id: 'PET-719304',
      orderDate: 'Hôm qua, 14:15',
      status: 'completed',
      statusText: 'Giao Thành Công',
      totalAmount: '145.000 đ',
      stepIndex: 3,
      items: [
        {
          name: 'Hạt Dinh Dưỡng Cho Mèo Whiskas Vị Cá Biển (1.2kg)',
          quantity: 1,
          price: '145.000 đ',
          image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  ]);

  const addToCart = (product: { id: number; name: string; numericPrice: number; weight: string; image: string }, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.numericPrice,
          weight: product.weight,
          image: product.image,
          quantity: quantity,
        },
      ];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        orders,
        addOrder,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
