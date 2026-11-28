import React, { useEffect, useState } from 'react';
import { Heart, Menu, Search, Shield, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    route,
    navigate,
    cartCount,
    wishlistIds,
    setCartDrawerOpen,
    setSearchOpen,
    setSizeGuideOpen,
  } = useStore();
  const { isAuthenticated, isAdmin, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const isNavActive = (target: string) => {
    if (target === 'pria') {
      return route.page === 'catalog' && route.category === 'pria';
    }
    if (target === 'wanita') {
      return route.page === 'catalog' && route.category === 'wanita';
    }
    if (target === 'lookbook') {
      return route.page === 'lookbook';
    }
    if (target === 'all') {
      return route.page === 'catalog' && (!route.category || route.category === 'all');
    }
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-canvas border-b border-hairline">
        <div className="h-16 max-w-[1440px] mx-auto px-4 lg:px-12 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Buka Menu"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-ink hover:text-muted-slate transition-colors"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'home' })}
              className="font-editorial text-2xl uppercase tracking-wider text-ink whitespace-nowrap shrink-0 cursor-pointer"
            >
              URBANSTORE.
            </button>
          </div>

          {/* Zone 2: Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'pria' })}
              className={`text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 pb-1 transition-colors cursor-pointer ${
                isNavActive('pria')
                  ? 'text-ink border-b-2 border-ink'
                  : 'text-muted-slate hover:text-ink'
              }`}
            >
              Pria
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'wanita' })}
              className={`text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 pb-1 transition-colors cursor-pointer ${
                isNavActive('wanita')
                  ? 'text-ink border-b-2 border-ink'
                  : 'text-muted-slate hover:text-ink'
              }`}
            >
              Wanita
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'lookbook' })}
              className={`text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 pb-1 transition-colors cursor-pointer ${
                isNavActive('lookbook')
                  ? 'text-ink border-b-2 border-ink'
                  : 'text-muted-slate hover:text-ink'
              }`}
            >
              Lookbook
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className={`text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 pb-1 transition-colors cursor-pointer ${
                isNavActive('all')
                  ? 'text-ink border-b-2 border-ink'
                  : 'text-muted-slate hover:text-ink'
              }`}
            >
              Semua Produk
            </button>
          </nav>

          {/* Zone 3: Compact Utility & Shopping Bag */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              aria-label="Cari Produk"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-ink hover:text-muted-slate transition-colors cursor-pointer"
            >
              <Search className="w-[19px] h-[19px] stroke-[1.5]" />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => navigate({ page: 'wishlist' })}
              className="inline-flex items-center gap-1 p-2 text-ink hover:text-terracotta transition-colors cursor-pointer relative"
            >
              <Heart className="w-[19px] h-[19px] stroke-[1.5]" />
              {wishlistIds.length > 0 && (
                <span className="text-[10px] font-semibold tabular-nums text-muted-slate">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                type="button"
                aria-label="Admin Dashboard"
                onClick={() => navigate({ page: 'admin' })}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-terracotta text-terracotta text-[11px] font-semibold uppercase tracking-wider hover:bg-terracotta hover:text-canvas transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            <button
              type="button"
              aria-label={isAuthenticated ? 'Akun Saya' : 'Masuk Akun'}
              onClick={() => navigate({ page: isAuthenticated ? 'account' : 'login' })}
              className="hidden sm:inline-flex items-center gap-1.5 p-2 text-ink hover:text-terracotta transition-colors cursor-pointer"
            >
              <User className="w-[19px] h-[19px] stroke-[1.5]" />
              {isAuthenticated && (
                <span className="hidden lg:inline text-[11px] font-semibold uppercase tracking-wider max-w-[90px] truncate">
                  {profile?.fullName?.split(' ')[0] || 'Akun'}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Keranjang Belanja"
              onClick={() => setCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-ink bg-canvas text-ink hover:bg-ink hover:text-canvas transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-[17px] h-[17px] stroke-[1.5]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest tabular-nums">
                Bag ({cartCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-ink/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-80 max-w-[85vw] bg-canvas h-full border-r border-hairline flex flex-col justify-between p-6 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                <span className="font-editorial text-xl uppercase tracking-wider text-ink">
                  URBANSTORE.
                </span>
                <button
                  type="button"
                  aria-label="Tutup Menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-ink hover:text-terracotta"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col divide-y divide-hairline">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'home' });
                  }}
                  className="py-4 text-left font-editorial text-xl uppercase tracking-wide text-ink hover:text-terracotta"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'catalog', category: 'pria' });
                  }}
                  className="py-4 text-left font-editorial text-xl uppercase tracking-wide text-ink hover:text-terracotta"
                >
                  Koleksi Pria
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'catalog', category: 'wanita' });
                  }}
                  className="py-4 text-left font-editorial text-xl uppercase tracking-wide text-ink hover:text-terracotta"
                >
                  Koleksi Wanita
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'lookbook' });
                  }}
                  className="py-4 text-left font-editorial text-xl uppercase tracking-wide text-ink hover:text-terracotta"
                >
                  Editorial Lookbook
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'catalog', category: 'all' });
                  }}
                  className="py-4 text-left font-editorial text-xl uppercase tracking-wide text-ink hover:text-terracotta"
                >
                  Semua Produk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'wishlist' });
                  }}
                  className="py-4 text-left font-editorial text-xl uppercase tracking-wide text-ink hover:text-terracotta flex items-center justify-between"
                >
                  <span>Wishlist Lo</span>
                  <span className="font-sans text-xs tabular-nums text-muted-slate">
                    ({wishlistIds.length})
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-hairline space-y-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ page: 'admin' });
                  }}
                  className="w-full py-3 bg-terracotta text-canvas text-xs font-semibold uppercase tracking-widest transition-colors"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ page: isAuthenticated ? 'account' : 'login' });
                }}
                className="w-full py-3 border border-hairline text-ink text-xs font-semibold uppercase tracking-widest hover:border-ink transition-colors"
              >
                {isAuthenticated ? `Akun (${profile?.fullName || 'Member'})` : 'Masuk / Daftar Akun'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSizeGuideOpen(true);
                }}
                className="w-full py-3 border border-ink text-ink text-xs font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors"
              >
                Panduan Size Guide (CM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ page: 'cart' });
                }}
                className="w-full py-3 bg-ink text-canvas text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Lihat Keranjang ({cartCount})
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
