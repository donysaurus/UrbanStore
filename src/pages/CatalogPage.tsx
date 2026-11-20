import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  Columns3,
  LayoutGrid,
  Ruler,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { SilhouetteFit } from '../types';

type QuickCategory = 'all' | 'pria' | 'wanita' | 'outerwear' | 'tops' | 'pants';
type SortOption = 'newest' | 'popular' | 'price-asc' | 'price-desc';
type PriceRange = 'all' | 'under250' | '250to500' | 'over500';

const COLOR_SWATCHES = [
  { label: 'Hitam', hex: '#111111', keywords: ['black', 'obsidian', 'onyx'] },
  { label: 'Putih', hex: '#FFFFFF', keywords: ['white', 'ecru', 'oatmeal'] },
  { label: 'Abu-abu', hex: '#6B6B66', keywords: ['grey', 'slate', 'charcoal'] },
  { label: 'Olive', hex: '#5D6354', keywords: ['olive'] },
  { label: 'Khaki / Mocha', hex: '#C4A482', keywords: ['khaki', 'mocha'] },
  { label: 'Terracotta', hex: '#C84B31', keywords: ['terracotta'] },
];

interface CatalogPageProps {
  initialCategory?: QuickCategory;
  initialSearch?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory = 'all',
  initialSearch = '',
}) => {
  const { navigate, setSizeGuideOpen } = useStore();
  const [quickCat, setQuickCat] = useState<QuickCategory>(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFit, setSelectedFit] = useState<SilhouetteFit | null>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    setQuickCat(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Quick category filter
    if (quickCat === 'pria') {
      list = list.filter((p) => p.category === 'pria' || p.category === 'unisex');
    } else if (quickCat === 'wanita') {
      list = list.filter((p) => p.category === 'wanita' || p.category === 'unisex');
    } else if (quickCat === 'outerwear') {
      list = list.filter(
        (p) => p.department === 'Outerwear' || p.department === 'Blazers & Tailoring'
      );
    } else if (quickCat === 'tops') {
      list = list.filter((p) => p.department === 'T-Shirts & Tops');
    } else if (quickCat === 'pants') {
      list = list.filter((p) => p.department === 'Pants & Trousers');
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortSpec.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.fitType.toLowerCase().includes(q)
      );
    }

    // Size filter
    if (selectedSize) {
      list = list.filter((p) =>
        p.variants.some((v) => v.size === selectedSize && v.stock > 0)
      );
    }

    // Price range
    if (priceRange === 'under250') {
      list = list.filter((p) => p.price < 250000);
    } else if (priceRange === '250to500') {
      list = list.filter((p) => p.price >= 250000 && p.price <= 500000);
    } else if (priceRange === 'over500') {
      list = list.filter((p) => p.price > 500000);
    }

    // Color filter
    if (selectedColor) {
      const swatch = COLOR_SWATCHES.find((c) => c.label === selectedColor);
      if (swatch) {
        list = list.filter((p) =>
          p.colors.some((pc) =>
            swatch.keywords.some((kw) => pc.name.toLowerCase().includes(kw))
          )
        );
      }
    }

    // Fit filter
    if (selectedFit) {
      list = list.filter((p) => p.fitType === selectedFit);
    }

    // Ready stock filter
    if (onlyInStock) {
      list = list.filter((p) => !p.isSoldOut && p.variants.some((v) => v.stock > 0));
    }

    // Sort
    if (sortBy === 'popular') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [
    quickCat,
    searchTerm,
    selectedSize,
    priceRange,
    selectedColor,
    selectedFit,
    onlyInStock,
    sortBy,
  ]);

  const activeFilterCount =
    (selectedSize ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedFit ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setQuickCat('all');
    setSearchTerm('');
    setSelectedSize(null);
    setPriceRange('all');
    setSelectedColor(null);
    setSelectedFit(null);
    setOnlyInStock(false);
  };

  const categoryTitle =
    quickCat === 'pria'
      ? 'Koleksi Pria'
      : quickCat === 'wanita'
        ? 'Koleksi Wanita'
        : quickCat === 'outerwear'
          ? 'Outerwear & Blazers'
          : quickCat === 'tops'
            ? 'T-Shirts & Tops'
            : quickCat === 'pants'
              ? 'Pants & Trousers'
              : 'Semua Produk';

  return (
    <div className="flex flex-col w-full bg-canvas">
      {/* Page Title & Breadcrumb Header */}
      <section className="w-full border-b border-hairline bg-canvas">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-slate mb-6"
          >
            <button
              type="button"
              onClick={() => navigate({ page: 'home' })}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-hairline">/</span>
            <span>Koleksi</span>
            <span className="text-hairline">/</span>
            <span className="text-ink">{categoryTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-2">
                Drop Archive · Edition 2026
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[64px] lg:leading-[68px] tracking-tight uppercase text-ink font-normal">
                Curated <span className="italic">Archive</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[14px] text-muted-slate leading-relaxed">
                Katalog kurasi pakaian esensial pria &amp; wanita buat gaya harian lo. Detail dimensi
                presisi dalam sentimeter, cutting kontemporer boxy, dan stok terverifikasi. No
                ribet, no zonk.
              </p>
            </div>
          </div>

          {/* Quick Category Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {(
              [
                { id: 'all', label: `Semua (${PRODUCTS.length})` },
                { id: 'pria', label: 'Pria' },
                { id: 'wanita', label: 'Wanita' },
                { id: 'outerwear', label: 'Outerwear' },
                { id: 'tops', label: 'T-Shirts & Tops' },
                { id: 'pants', label: 'Pants & Trousers' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setQuickCat(cat.id)}
                className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
                  quickCat === cat.id
                    ? 'bg-ink text-canvas'
                    : 'bg-canvas border border-hairline text-ink hover:border-ink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter & Sort Toolbar */}
      <section className="sticky top-16 z-30 w-full bg-canvas/95 backdrop-blur-sm border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Filter Drawer Trigger & Active Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsFilterOpen((v) => !v)}
              className={`flex items-center gap-2 border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                isFilterOpen
                  ? 'bg-ink text-canvas border-ink'
                  : 'bg-canvas text-ink border-ink hover:bg-ink hover:text-canvas'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Lanjutan</span>
              {activeFilterCount > 0 && (
                <span className="bg-terracotta text-canvas text-[10px] px-1.5 py-0.5 tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active filter chips */}
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt border border-hairline text-[11px] font-medium text-ink">
                Cari: &ldquo;{searchTerm}&rdquo;
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => setSearchTerm('')}
                  className="hover:text-terracotta cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt border border-hairline text-[11px] font-medium text-ink">
                Size: {selectedSize}
                <button
                  type="button"
                  onClick={() => setSelectedSize(null)}
                  className="hover:text-terracotta cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt border border-hairline text-[11px] font-medium text-ink">
                Warna: {selectedColor}
                <button
                  type="button"
                  onClick={() => setSelectedColor(null)}
                  className="hover:text-terracotta cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedFit && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt border border-hairline text-[11px] font-medium text-ink">
                {selectedFit}
                <button
                  type="button"
                  onClick={() => setSelectedFit(null)}
                  className="hover:text-terracotta cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt border border-hairline text-[11px] font-medium text-ink">
                Ready Stock
                <button
                  type="button"
                  onClick={() => setOnlyInStock(false)}
                  className="hover:text-terracotta cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {(activeFilterCount > 0 || quickCat !== 'all') && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[12px] text-muted-slate underline hover:text-ink cursor-pointer"
              >
                Reset Semua
              </button>
            )}
          </div>

          {/* Right: Counter, Sort & Density */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[12px] text-muted-slate tabular-nums">
              Menampilkan <strong className="text-ink">{filteredProducts.length}</strong> dari{' '}
              {PRODUCTS.length} produk
            </span>

            <div className="relative flex items-center border border-hairline bg-canvas hover:border-ink transition-colors">
              <span className="pl-3 text-[11px] font-semibold uppercase text-muted-slate hidden sm:inline">
                Urut:
              </span>
              <select
                aria-label="Urutkan produk"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-transparent py-2 pl-2 pr-8 text-[11px] font-semibold uppercase tracking-wider text-ink focus:outline-none cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Paling Populer</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted-slate absolute right-2 pointer-events-none" />
            </div>

            <div className="hidden lg:flex items-center border border-hairline">
              <button
                type="button"
                aria-label="Tampilan 3 Kolom"
                onClick={() => setGridCols(3)}
                className={`p-2 transition-colors cursor-pointer ${
                  gridCols === 3 ? 'bg-studio-gray text-ink' : 'text-muted-slate hover:text-ink'
                }`}
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Tampilan 4 Kolom"
                onClick={() => setGridCols(4)}
                className={`p-2 transition-colors cursor-pointer ${
                  gridCols === 4 ? 'bg-studio-gray text-ink' : 'text-muted-slate hover:text-ink'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filter Drawer */}
        {isFilterOpen && (
          <div className="border-t border-hairline bg-surface-alt">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Size Filter */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-3">
                  Ukuran Tersedia
                </span>
                <div className="grid grid-cols-4 gap-1.5 max-w-[200px]">
                  {['S', 'M', 'L', 'XL', '28', '30', '32', '34'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                      className={`h-9 border text-[11px] font-semibold transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-ink text-canvas border-ink'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-3">
                  Rentang Harga
                </span>
                <div className="space-y-2 text-[13px]">
                  {(
                    [
                      { id: 'all', label: 'Semua Harga' },
                      { id: 'under250', label: '< Rp250.000' },
                      { id: '250to500', label: 'Rp250k – Rp500k' },
                      { id: 'over500', label: '> Rp500.000' },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-ink cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === opt.id}
                        onChange={() => setPriceRange(opt.id)}
                        className="accent-ink"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-3">
                  Warna Kurasi
                </span>
                <div className="flex flex-wrap gap-2.5 max-w-[160px]">
                  {COLOR_SWATCHES.map((sw) => (
                    <button
                      key={sw.label}
                      type="button"
                      title={sw.label}
                      onClick={() =>
                        setSelectedColor(selectedColor === sw.label ? null : sw.label)
                      }
                      style={{ backgroundColor: sw.hex }}
                      className={`w-6 h-6 border border-hairline cursor-pointer ${
                        selectedColor === sw.label ? 'ring-1 ring-ink ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Silhouette & Cut */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-3">
                  Siluet &amp; Potongan
                </span>
                <div className="space-y-2 text-[13px]">
                  {(['Boxy Fit', 'Relaxed Wide', 'Cropped Hem', 'Tailored Relaxed'] as const).map(
                    (fit) => (
                      <label key={fit} className="flex items-center gap-2 text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFit === fit}
                          onChange={() => setSelectedFit(selectedFit === fit ? null : fit)}
                          className="accent-ink"
                        />
                        <span>{fit}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Ready stock & actions */}
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-3">
                    Ketersediaan
                  </span>
                  <label className="flex items-center gap-2 text-[13px] text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="accent-ink"
                    />
                    <span>Hanya Ready Stock</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 bg-ink text-canvas py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer"
                  >
                    Tutup Panel
                  </button>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 border border-hairline bg-canvas py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-slate hover:text-ink hover:border-ink cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Product Grid + Asymmetric Editorial Spotlight */}
      <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-12 py-12">
        {filteredProducts.length === 0 ? (
          <div className="border border-hairline bg-surface-alt py-16 px-6 text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-2">
              Tidak Ditemukan
            </span>
            <h2 className="font-editorial text-3xl uppercase text-ink mb-3">
              Waduh, Barang yang Lo Cari Nggak Ketemu.
            </h2>
            <p className="text-[14px] text-muted-slate mb-6">
              Coba hapus sebagian filter, ganti kata kunci lain, atau cek lagi seluruh koleksi
              kurasi UrbanStore.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-6 py-3 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
            } gap-6`}
          >
            {filteredProducts.map((product, idx) => (
              <React.Fragment key={product.id}>
                <ProductCard product={product} />

                {/* Insert Editorial Spotlight Card after 2nd item when viewing >= 4 items */}
                {idx === 1 && filteredProducts.length >= 4 && (
                  <div className="sm:col-span-2 relative bg-surface-alt border border-hairline p-8 lg:p-10 flex flex-col justify-between min-h-[420px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta">
                        Editorial Note Nº 08
                      </span>
                      <span className="text-[11px] text-muted-slate uppercase tracking-wider">
                        Presisi Dimensi
                      </span>
                    </div>

                    <div className="my-8 max-w-lg">
                      <blockquote className="font-editorial text-2xl sm:text-3xl uppercase text-ink leading-snug">
                        &ldquo;Tiap helai pakaian diukur manual sentimeter demi sentimeter. Tanpa
                        tebak-tebakan, siluet boxy presisi sejak hari pertama.&rdquo;
                      </blockquote>
                      <p className="mt-4 text-[13px] text-muted-slate leading-relaxed">
                        Standar pengukuran UrbanStore menjamin toleransi cutting maksimal ±1 cm
                        dengan material pre-shrunk cotton &amp; structured wool blends. Pas di
                        badan, no drama.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen(true)}
                        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink border-b border-ink pb-1 hover:text-terracotta hover:border-terracotta transition-colors cursor-pointer"
                      >
                        <span>Lihat Fit Guide</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-hairline">|</span>
                      <span className="text-[11px] font-medium text-muted-slate">
                        Garansi Tukar Ukuran 7 Hari
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </section>

      {/* Size Confidence Bottom Callout */}
      <section className="w-full bg-surface-alt border-t border-hairline py-14">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block">
              Fit Confidence Standard
            </span>
            <h2 className="font-editorial text-3xl uppercase text-ink">
              Bingung Memilih Ukuran yang Pas Buat Lo?
            </h2>
            <p className="text-[14px] text-muted-slate max-w-xl leading-relaxed">
              Tiap produk kami sertakan tabel dimensi riil (panjang, lingkar dada, lebar bahu) dalam
              sentimeter. Bukan ukuran generik S/M/L doang, biar lo makin pede pas checkout.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 border-t border-hairline">
              <div>
                <span className="text-[13px] font-bold uppercase text-ink block tabular-nums">
                  ± 1 CM
                </span>
                <span className="text-[12px] text-muted-slate">
                  Toleransi akurasi pola jahit terverifikasi.
                </span>
              </div>
              <div>
                <span className="text-[13px] font-bold uppercase text-ink block tabular-nums">
                  7 HARI
                </span>
                <span className="text-[12px] text-muted-slate">
                  Garansi tukar ukuran bebas ribet.
                </span>
              </div>
              <div>
                <span className="text-[13px] font-bold uppercase text-ink block">FIT CONSULT</span>
                <span className="text-[12px] text-muted-slate">
                  Detail ukuran lengkap tersedia di setiap halaman produk.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-3">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-ink text-canvas px-8 py-4 text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span>Buka Panduan Ukuran &amp; Fit Guide</span>
              <Ruler className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
