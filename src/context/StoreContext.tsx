import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { AppRoute, CartItem, OrderRecord } from '../types';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextValue {
  route: AppRoute;
  navigate: (next: AppRoute) => void;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  promoCode: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  removePromoCode: () => void;
  addToCart: (item: CartItem, openDrawer?: boolean) => void;
  updateCartQty: (productId: string, size: string, colorName: string, delta: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  clearCart: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: ToastState['type']) => void;
  orders: OrderRecord[];
  saveOrder: (order: OrderRecord) => void;
  getOrder: (orderNumber: string) => OrderRecord | undefined;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = 'urbanstore_cart_v1';
const WISHLIST_STORAGE_KEY = 'urbanstore_wishlist_v1';
const ORDERS_STORAGE_KEY = 'urbanstore_orders_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>({ page: 'home' });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = useCallback((next: AppRoute) => {
    setRoute(next);
    setCartDrawerOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = useCallback(
    (incoming: CartItem, openDrawer = false) => {
      setCart((prev) => {
        const idx = prev.findIndex(
          (item) =>
            item.productId === incoming.productId &&
            item.size === incoming.size &&
            item.colorName === incoming.colorName
        );
        if (idx >= 0) {
          const updated = [...prev];
          const existing = updated[idx];
          const nextQty = Math.min(existing.quantity + incoming.quantity, existing.maxStock);
          updated[idx] = { ...existing, quantity: nextQty };
          return updated;
        }
        return [...prev, incoming];
      });

      if (openDrawer) {
        setCartDrawerOpen(true);
      } else {
        showToast(
          `Mantap, ${incoming.name} (Size ${incoming.size}) udah masuk keranjang!`,
          'success'
        );
      }
    },
    [showToast]
  );

  const updateCartQty = useCallback(
    (productId: string, size: string, colorName: string, delta: number) => {
      setCart((prev) =>
        prev.map((item) => {
          if (item.productId === productId && item.size === size && item.colorName === colorName) {
            const nextQty = Math.max(1, Math.min(item.quantity + delta, item.maxStock));
            return { ...item, quantity: nextQty };
          }
          return item;
        })
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, size: string, colorName: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.size === size && item.colorName === colorName)
        )
      );
      showToast('Item udah dihapus dari keranjang.', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode(null);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(`${product?.name ?? 'Item'} dihapus dari wishlist.`, 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast(`${product?.name ?? 'Item'} disimpan ke wishlist lo!`, 'success');
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!promoCode || subtotal === 0) return 0;
    if (promoCode === 'URBAN10') {
      return Math.round(subtotal * 0.1);
    }
    if (promoCode === 'HEMAT50') {
      return Math.min(50000, subtotal);
    }
    return 0;
  }, [promoCode, subtotal]);

  const applyPromoCode = useCallback(
    (rawCode: string): { ok: boolean; message: string } => {
      const code = rawCode.trim().toUpperCase();
      if (!code) {
        return { ok: false, message: 'Masukin kode promo dulu ya!' };
      }
      if (code === 'URBAN10') {
        setPromoCode('URBAN10');
        return { ok: true, message: 'Kode URBAN10 aktif — potongan 10% langsung jalan!' };
      }
      if (code === 'HEMAT50') {
        setPromoCode('HEMAT50');
        return { ok: true, message: 'Kode HEMAT50 aktif — hemat Rp50.000!' };
      }
      return {
        ok: false,
        message: 'Kode promo nggak valid nih. Coba pakai URBAN10 atau HEMAT50!',
      };
    },
    []
  );

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const saveOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const getOrder = useCallback(
    (orderNumber: string) => orders.find((o) => o.orderNumber === orderNumber),
    [orders]
  );

  return (
    <StoreContext.Provider
      value={{
        route,
        navigate,
        cart,
        cartCount,
        subtotal,
        promoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        wishlistIds,
        toggleWishlist,
        isCartDrawerOpen,
        setCartDrawerOpen,
        isSizeGuideOpen,
        setSizeGuideOpen,
        isSearchOpen,
        setSearchOpen,
        toast,
        showToast,
        orders,
        saveOrder,
        getOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
