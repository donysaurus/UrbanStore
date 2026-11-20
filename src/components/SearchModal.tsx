import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { formatIDR } from '../utils/format';
import { EditorialImage } from './EditorialImage';

const QUICK_KEYWORDS = ['Oversized', 'Blazer', 'Trouser', 'Boxy', 'Denim', 'Cropped'];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, navigate } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.shortSpec.toLowerCase().includes(trimmed) ||
          p.department.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.fitType.toLowerCase().includes(trimmed)
      )
    : PRODUCTS.slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ page: 'catalog', category: 'all', search: query.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-[2px] flex flex-col">
      <div className="bg-canvas border-b border-hairline w-full max-h-[85vh] overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-6">
          {/* Search Input Row */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-ink pb-3">
            <Search className="w-5 h-5 text-ink shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kemeja boxy, blazer, pleated trouser..."
              className="w-full text-base sm:text-lg bg-transparent text-ink placeholder:text-muted-slate focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate hover:text-ink cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              aria-label="Tutup Pencarian"
              onClick={() => setSearchOpen(false)}
              className="p-1.5 text-ink hover:text-terracotta cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Keyword Suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate mr-1">
              Populer:
            </span>
            {QUICK_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setQuery(kw)}
                className="px-3 py-1 border border-hairline text-[11px] font-semibold uppercase tracking-wider text-ink hover:border-ink transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Results Preview */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate">
                {trimmed ? `Hasil untuk "${query}" (${matches.length})` : 'Kurasi Pilihan'}
              </span>
              {trimmed && matches.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate({ page: 'catalog', category: 'all', search: query.trim() })}
                  className="text-[11px] font-semibold uppercase tracking-widest text-ink inline-flex items-center gap-1 hover:text-terracotta cursor-pointer"
                >
                  Lihat di Katalog <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {matches.length === 0 ? (
              <div className="py-10 text-center border border-hairline bg-surface-alt">
                <p className="font-editorial text-xl uppercase text-ink mb-1">
                  Waduh, Nggak Ketemu Nih.
                </p>
                <p className="text-[13px] text-muted-slate mb-4">
                  Coba kata kunci lain kayak "Boxy", "Trouser", atau kepoin semua koleksi kita.
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'catalog', category: 'all' })}
                  className="px-5 py-2.5 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
                >
                  Buka Semua Koleksi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {matches.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate({ page: 'product', slug: item.slug })}
                    className="group text-left border border-hairline bg-canvas hover:border-ink transition-colors cursor-pointer"
                  >
                    <div className="aspect-[3/4] bg-studio-gray overflow-hidden">
                      <EditorialImage
                        src={item.images[0]}
                        alt={item.name}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 border-t border-hairline">
                      <p className="text-[13px] font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-[12px] text-muted-slate tabular-nums mt-0.5">
                        {formatIDR(item.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="flex-1" onClick={() => setSearchOpen(false)} />
    </div>
  );
};
