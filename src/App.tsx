import React from 'react';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { Toast } from './components/Toast';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { LookbookPage } from './pages/LookbookPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';

const AppShell: React.FC = () => {
  const { route } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar />

      <main className="flex-1 pt-16">
        {route.page === 'home' && <HomePage />}
        {route.page === 'catalog' && (
          <CatalogPage
            initialCategory={route.category || 'all'}
            initialSearch={route.search || ''}
          />
        )}
        {route.page === 'product' && <ProductDetailPage slug={route.slug} />}
        {route.page === 'lookbook' && <LookbookPage />}
        {route.page === 'cart' && <CartPage />}
        {route.page === 'checkout' && <CheckoutPage />}
        {route.page === 'wishlist' && <WishlistPage />}
        {route.page === 'order-success' && (
          <OrderSuccessPage orderNumber={route.orderNumber} />
        )}
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
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
