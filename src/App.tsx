import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { Toast } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { HomePage } from './pages/HomePage';

const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const LookbookPage = lazy(() =>
  import('./pages/LookbookPage').then((m) => ({ default: m.LookbookPage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const OrderSuccessPage = lazy(() =>
  import('./pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const AccountPage = lazy(() =>
  import('./pages/AccountPage').then((m) => ({ default: m.AccountPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);

const PageFallback: React.FC = () => (
  <div className="w-full py-28 flex flex-col items-center justify-center bg-canvas">
    <div className="w-6 h-6 border-2 border-ink border-t-transparent animate-spin mb-3" />
    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate">
      Memuat Koleksi...
    </span>
  </div>
);

const NotFoundPage: React.FC = () => {
  const { navigate } = useStore();
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-2">
        404 · Halaman Tidak Ditemukan
      </span>
      <h1 className="font-editorial text-4xl uppercase text-ink mb-3">
        Waduh, Rutenya Nyasar Nih.
      </h1>
      <p className="text-[14px] text-muted-slate mb-8 leading-relaxed">
        Halaman yang lo cari nggak tersedia atau udah dipindahin. Yuk balik ke beranda atau
        langsung kepoin koleksi terbaru kita.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Kepoin Koleksi ↗
        </button>
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="px-8 py-3.5 border border-ink text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
        >
          Balik ke Home
        </button>
      </div>
    </div>
  );
};

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar />

      <main className="flex-1 pt-16">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Global Overlays */}
      <CartDrawer />
      <SizeGuideModal />
      <SearchModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <AppShell />
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
