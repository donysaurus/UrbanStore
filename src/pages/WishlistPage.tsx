import React from 'react';
import { Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, navigate, products } = useStore();
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="w-full bg-canvas">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-12">
        <div className="border-b border-hairline pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
              Kurasi Pribadi
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
              Wishlist Lo ({savedProducts.length})
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate({ page: 'catalog', category: 'all' })}
            className="text-[12px] font-semibold uppercase tracking-widest text-ink underline hover:text-terracotta cursor-pointer"
          >
            Kepoin Koleksi Lainnya ↗
          </button>
        </div>

        {savedProducts.length === 0 ? (
          <div className="border border-hairline bg-surface-alt py-16 px-6 text-center max-w-xl mx-auto">
            <Heart className="w-9 h-9 text-muted-slate stroke-[1.25] mx-auto mb-4" />
            <h2 className="font-editorial text-2xl uppercase text-ink mb-2">
              Belum Ada Item Disimpan.
            </h2>
            <p className="text-[14px] text-muted-slate mb-6">
              Klik ikon hati di produk mana aja buat nyimpen outfit inceran lo di sini.
            </p>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest cursor-pointer"
            >
              Lihat Semua Produk ↗
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
