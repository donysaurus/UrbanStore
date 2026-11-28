import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAYMENT_METHODS, PRODUCTS, SHIPPING_METHODS } from '../data/products';
import {
  clearCartInSupabase,
  createOrderViaSupabase,
  fetchCatalogFromSupabase,
  fetchMyOrdersViaSupabase,
  fetchOrderByNumberViaSupabase,
  removeCartItemInSupabase,
  syncCartFromSupabase,
  syncWishlistFromSupabase,
  toggleWishlistInSupabase,
  upsertCartItemInSupabase,
  validatePromoViaSupabase,
} from '../services/storeService';
import {
  AppRoute,
  CartItem,
  OrderRecord,
  PaymentMethod,
  Product,
  ShippingAddress,
  ShippingMethod,
} from '../types';
import { useAuth } from './useAuth';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextValue {
  route: AppRoute;
  navigate: (next: AppRoute) => void;
  products: Product[];
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  isSupabaseSynced: boolean;
  dbSyncError: string | null;
  refreshCatalog: () => Promise<void>;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  promoCode: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => Promise<{ ok: boolean; message: string }>;
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
  placeOrder: (params: {
    customer: ShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    shippingFee: number;
    total: number;
  }) => Promise<{ ok: true; order: OrderRecord } | { ok: false; error: string }>;
  getOrder: (orderNumber: string) => OrderRecord | undefined;
  fetchOrderByNumber: (orderNumber: string) => Promise<OrderRecord | null>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = 'urbanstore_cart_v1';
const WISHLIST_STORAGE_KEY = 'urbanstore_wishlist_v1';
const ORDERS_STORAGE_KEY = 'urbanstore_orders_v1';
const PROMO_STORAGE_KEY = 'urbanstore_promo_v1';

type CatalogCategoryParam = 'all' | 'pria' | 'wanita' | 'outerwear' | 'tops' | 'pants';

function normalizeCatalogCategory(raw: string | null): CatalogCategoryParam {
  if (!raw) return 'all';
  const lower = raw.toLowerCase();
  if (lower === 'men' || lower === 'pria') return 'pria';
  if (lower === 'women' || lower === 'wanita') return 'wanita';
  if (lower === 'outerwear' || lower === 'tops' || lower === 'pants' || lower === 'all') {
    return lower;
  }
  return 'all';
}

function parseRouteFromLocation(pathname: string, search: string): AppRoute {
  if (pathname === '/' || pathname === '') return { page: 'home' };
  if (pathname === '/catalog' || pathname === '/products') {
    const params = new URLSearchParams(search);
    return {
      page: 'catalog',
      category: normalizeCatalogCategory(params.get('category')),
      search: params.get('search') || '',
    };
  }
  if (pathname.startsWith('/product/')) {
    return { page: 'product', slug: decodeURIComponent(pathname.slice('/product/'.length)) };
  }
  if (pathname === '/lookbook') return { page: 'lookbook' };
  if (pathname === '/cart') return { page: 'cart' };
  if (pathname === '/checkout') return { page: 'checkout' };
  if (pathname === '/wishlist') return { page: 'wishlist' };
  if (pathname.startsWith('/order-success/')) {
    return {
      page: 'order-success',
      orderNumber: decodeURIComponent(pathname.slice('/order-success/'.length)),
    };
  }
  if (pathname === '/login' || pathname === '/register') return { page: 'login' };
  if (pathname === '/account') return { page: 'account' };
  if (pathname === '/admin') return { page: 'admin' };
  return { page: 'home' };
}

function buildPathFromRoute(next: AppRoute): string {
  switch (next.page) {
    case 'home':
      return '/';
    case 'catalog': {
      const params = new URLSearchParams();
      if (next.category && next.category !== 'all') params.set('category', next.category);
      if (next.search && next.search.trim()) params.set('search', next.search.trim());
      const qs = params.toString();
      return qs ? `/catalog?${qs}` : '/catalog';
    }
    case 'product':
      return `/product/${encodeURIComponent(next.slug)}`;
    case 'lookbook':
      return '/lookbook';
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    case 'wishlist':
      return '/wishlist';
    case 'order-success':
      return `/order-success/${encodeURIComponent(next.orderNumber)}`;
    case 'login':
      return '/login';
    case 'account':
      return '/account';
    case 'admin':
      return '/admin';
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const route = useMemo(
    () => parseRouteFromLocation(location.pathname, location.search),
    [location.pathname, location.search]
  );

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(SHIPPING_METHODS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [isSupabaseSynced, setIsSupabaseSynced] = useState(false);
  const [dbSyncError, setDbSyncError] = useState<string | null>(null);

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

  const [promoCode, setPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [serverDiscountAmount, setServerDiscountAmount] = useState<number>(0);

  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const refreshCatalog = useCallback(async () => {
    const res = await fetchCatalogFromSupabase(false);
    if (res.ok && res.products.length > 0) {
      setProducts(res.products);
      if (res.shippingMethods.length > 0) setShippingMethods(res.shippingMethods);
      if (res.paymentMethods.length > 0) setPaymentMethods(res.paymentMethods);
      setIsSupabaseSynced(true);
      setDbSyncError(null);
    } else if (res.error) {
      setDbSyncError(res.error);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Sync user wishlist, cart, and order history when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user || !isSupabaseSynced) return;
    let cancelled = false;

    (async () => {
      const [mergedWishlist, mergedCart, myOrders] = await Promise.all([
        syncWishlistFromSupabase(user.id, wishlistIds),
        syncCartFromSupabase(user.id, cart, products),
        fetchMyOrdersViaSupabase(user.id),
      ]);

      if (cancelled) return;
      setWishlistIds(mergedWishlist);
      setCart(mergedCart);
      if (myOrders.length > 0) {
        setOrders((prev) => {
          const seen = new Set(myOrders.map((o) => o.orderNumber));
          return [...myOrders, ...prev.filter((o) => !seen.has(o.orderNumber))];
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // Only trigger sync on login/session change or initial Supabase catalog sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isSupabaseSynced]);

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

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [promoCode]);

  useEffect(() => {
    setCartDrawerOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = useCallback(
    (next: AppRoute) => {
      const targetPath = buildPathFromRoute(next);
      setCartDrawerOpen(false);
      setSearchOpen(false);
      routerNavigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [routerNavigate]
  );

  const addToCart = useCallback(
    (incoming: CartItem, openDrawer = false) => {
      let syncedItem: CartItem = incoming;

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
          syncedItem = { ...existing, quantity: nextQty };
          updated[idx] = syncedItem;
          return updated;
        }
        return [...prev, incoming];
      });

      if (user && isSupabaseSynced) {
        upsertCartItemInSupabase(user.id, syncedItem);
      }

      if (openDrawer) {
        setCartDrawerOpen(true);
      } else {
        showToast(
          `Mantap, ${incoming.name} (Size ${incoming.size}) udah masuk keranjang!`,
          'success'
        );
      }
    },
    [isSupabaseSynced, showToast, user]
  );

  const updateCartQty = useCallback(
    (productId: string, size: string, colorName: string, delta: number) => {
      let updatedItem: CartItem | null = null;
      setCart((prev) =>
        prev.map((item) => {
          if (item.productId === productId && item.size === size && item.colorName === colorName) {
            const nextQty = Math.max(1, Math.min(item.quantity + delta, item.maxStock));
            updatedItem = { ...item, quantity: nextQty };
            return updatedItem;
          }
          return item;
        })
      );
      if (user && isSupabaseSynced && updatedItem) {
        upsertCartItemInSupabase(user.id, updatedItem);
      }
    },
    [isSupabaseSynced, user]
  );

  const removeFromCart = useCallback(
    (productId: string, size: string, colorName: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.size === size && item.colorName === colorName)
        )
      );
      if (user && isSupabaseSynced) {
        removeCartItemInSupabase(user.id, productId, size, colorName);
      }
      showToast('Item udah dihapus dari keranjang.', 'info');
    },
    [isSupabaseSynced, showToast, user]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode(null);
    setServerDiscountAmount(0);
    if (user && isSupabaseSynced) {
      clearCartInSupabase(user.id);
    }
  }, [isSupabaseSynced, user]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (user && isSupabaseSynced) {
          toggleWishlistInSupabase(user.id, productId, !exists);
        }
        if (exists) {
          showToast(`${product?.name ?? 'Item'} dihapus dari wishlist.`, 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast(`${product?.name ?? 'Item'} disimpan ke wishlist lo!`, 'success');
        return [...prev, productId];
      });
    },
    [isSupabaseSynced, products, showToast, user]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  // Re-evaluate discount whenever subtotal or promoCode changes
  useEffect(() => {
    if (!promoCode || subtotal === 0) {
      setServerDiscountAmount(0);
      return;
    }

    if (isSupabaseSynced) {
      validatePromoViaSupabase(promoCode, subtotal).then((res) => {
        if (res?.ok) {
          setServerDiscountAmount(res.discount);
        } else if (res && !res.ok) {
          setServerDiscountAmount(0);
        }
      });
    } else {
      if (promoCode === 'URBAN10') setServerDiscountAmount(Math.round(subtotal * 0.1));
      else if (promoCode === 'HEMAT50') setServerDiscountAmount(Math.min(50000, subtotal));
      else setServerDiscountAmount(0);
    }
  }, [isSupabaseSynced, promoCode, subtotal]);

  const applyPromoCode = useCallback(
    async (rawCode: string): Promise<{ ok: boolean; message: string }> => {
      const code = rawCode.trim().toUpperCase();
      if (!code) {
        return { ok: false, message: 'Masukin kode promo dulu ya!' };
      }

      if (isSupabaseSynced) {
        const res = await validatePromoViaSupabase(code, subtotal);
        if (res) {
          if (res.ok && res.code) {
            setPromoCode(res.code);
            setServerDiscountAmount(res.discount);
          }
          return { ok: res.ok, message: res.message };
        }
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
    [isSupabaseSynced, subtotal]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
    setServerDiscountAmount(0);
  }, []);

  const placeOrder = useCallback(
    async (params: {
      customer: ShippingAddress;
      shippingMethod: ShippingMethod;
      paymentMethod: PaymentMethod;
      shippingFee: number;
      total: number;
    }): Promise<{ ok: true; order: OrderRecord } | { ok: false; error: string }> => {
      if (isSupabaseSynced) {
        const res = await createOrderViaSupabase({
          customer: params.customer,
          items: cart,
          shippingMethodId: params.shippingMethod.id,
          paymentMethodId: params.paymentMethod.id,
          promoCode,
        });

        if (!res.ok) {
          return res;
        }

        setOrders((prev) => [res.order, ...prev]);
        clearCart();
        await refreshCatalog();
        return { ok: true, order: res.order };
      }

      // Offline / Pre-migration local fallback
      const randomSuffix = `${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(
        10 + Math.random() * 90
      )}`;
      const fallbackOrder: OrderRecord = {
        orderNumber: `US-${new Date().getFullYear()}-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        userId: user?.id ?? null,
        customer: params.customer,
        items: [...cart],
        subtotal,
        discount: serverDiscountAmount,
        promoCode,
        shippingMethod: params.shippingMethod,
        shippingFee: params.shippingFee,
        paymentMethod: params.paymentMethod,
        total: params.total,
        status: params.paymentMethod.id === 'cod' ? 'Diproses Kurator' : 'Menunggu Pembayaran',
      };

      setOrders((prev) => [fallbackOrder, ...prev]);
      clearCart();
      return { ok: true, order: fallbackOrder };
    },
    [
      cart,
      clearCart,
      isSupabaseSynced,
      promoCode,
      refreshCatalog,
      serverDiscountAmount,
      subtotal,
      user?.id,
    ]
  );

  const getOrder = useCallback(
    (orderNumber: string) => orders.find((o) => o.orderNumber === orderNumber),
    [orders]
  );

  const fetchOrderByNumber = useCallback(
    async (orderNumber: string) => {
      const local = orders.find((o) => o.orderNumber === orderNumber);
      if (local) return local;
      const remote = await fetchOrderByNumberViaSupabase(orderNumber);
      if (remote) {
        setOrders((prev) => [remote, ...prev.filter((o) => o.orderNumber !== remote.orderNumber)]);
      }
      return remote;
    },
    [orders]
  );

  return (
    <StoreContext.Provider
      value={{
        route,
        navigate,
        products,
        shippingMethods,
        paymentMethods,
        isSupabaseSynced,
        dbSyncError,
        refreshCatalog,
        cart,
        cartCount,
        subtotal,
        promoCode,
        discountAmount: serverDiscountAmount,
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
        placeOrder,
        getOrder,
        fetchOrderByNumber,
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
