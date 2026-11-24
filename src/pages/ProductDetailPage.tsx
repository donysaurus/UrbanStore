import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Check, Heart, Minus, Plus, Ruler, Share2, Star } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { formatIDR } from '../utils/format';

interface ProductDetailPageProps {
  slug?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const resolvedSlug = propSlug ?? paramSlug ?? '';
  const { navigate, addToCart, wishlistIds, toggleWishlist, setSizeGuideOpen, showToast } =
    useStore();

  const product = PRODUCTS.find((p) => p.slug === resolvedSlug);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number>(0);

  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedColorIdx(0);
    setSelectedSize(null);
    setQuantity(1);
    setSizeError(false);
    setOpenAccordion(0);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-2">
          404 · Outfit Tidak Ditemukan
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink mb-3">
          Produk Nggak Ketemu Nih.
        </h1>
        <p className="text-[14px] text-muted-slate mb-8 leading-relaxed">
          Link produk yang lo buka mungkin salah ketik atau koleksinya udah ditarik dari arsip drop.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Kepoin Semua Koleksi ↗
        </button>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const activeVariant = product.variants.find((v) => v.size === selectedSize);
  const selectedColor = product.colors[selectedColorIdx] || product.colors[0];
  const isAllSoldOut = product.isSoldOut || product.variants.every((v) => v.stock <= 0);

  const maxStock = activeVariant ? activeVariant.stock : 1;

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link outfit udah disalin! Tinggal share ke temen lo.', 'success');
    } catch {
      showToast('Gagal menyalin link. Coba salin manual dari address bar ya.', 'error');
    }
  };

  const handleAdd = (goCheckout = false) => {
    if (isAllSoldOut) return;
    if (!selectedSize || !activeVariant) {
      setSizeError(true);
      showToast('Pilih size dulu dong biar fit-nya nggak zonk!', 'error');
      return;
    }

    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        colorName: selectedColor.name,
        colorHex: selectedColor.hex,
        size: activeVariant.size,
        unitPrice: product.price,
        originalPrice: product.originalPrice,
        quantity,
        maxStock: activeVariant.stock,
        measurementSummary: `${activeVariant.measurementLabel}: ${activeVariant.chestOrWaistCm} cm · Panjang: ${activeVariant.lengthCm} cm`,
      },
      !goCheckout
    );

    if (goCheckout) {
      navigate({ page: 'checkout' });
    }
  };

  const relatedProducts = [
    ...PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.department === product.department)
    ),
    ...PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.category !== product.category &&
        p.department !== product.department
    ),
  ].slice(0, 4);

  return (
    <div className="w-full bg-canvas">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-slate mb-8"
        >
          <button
            type="button"
            onClick={() => navigate({ page: 'home' })}
            className="hover:text-ink transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-hairline">/</span>
          <button
            type="button"
            onClick={() =>
              navigate({
                page: 'catalog',
                category: product.category === 'wanita' ? 'wanita' : 'pria',
              })
            }
            className="hover:text-ink transition-colors cursor-pointer"
          >
            {product.category}
          </button>
          <span className="text-hairline">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Main 2-Column PDP Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="relative aspect-[4/5] w-full bg-studio-gray border border-hairline overflow-hidden">
              <EditorialImage
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                priority
                className={isAllSoldOut ? 'grayscale-[30%]' : ''}
              />
              {isAllSoldOut ? (
                <span className="absolute top-4 left-4 bg-ink text-canvas px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest">
                  Habis Duluan · Restock Minggu Depan
                </span>
              ) : product.discountPercent ? (
                <span className="absolute top-4 left-4 bg-terracotta text-canvas px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest tabular-nums">
                  Hemat {product.discountPercent}%
                </span>
              ) : product.badge ? (
                <span className="absolute top-4 left-4 bg-canvas border border-hairline text-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest">
                  {product.badge}
                </span>
              ) : null}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={imgUrl + idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-[3/4] bg-studio-gray border overflow-hidden cursor-pointer transition-colors ${
                      activeImageIdx === idx
                        ? 'border-ink ring-1 ring-ink'
                        : 'border-hairline hover:border-ink/50'
                    }`}
                  >
                    <EditorialImage src={imgUrl} alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-hairline pb-6">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-slate mb-2">
                <span>
                  {product.lookNumber} · {product.department} · {product.fitType}
                </span>
                <span className="inline-flex items-center gap-1 text-ink tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                  {product.rating.toFixed(1)} ({product.reviewCount} ulasan)
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4 tabular-nums">
                <span className="text-2xl font-semibold text-ink">
                  {formatIDR(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-muted-slate line-through">
                      {formatIDR(product.originalPrice)}
                    </span>
                    <span className="text-[12px] font-semibold text-terracotta">
                      Hemat {formatIDR(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-[14px] text-muted-slate leading-relaxed mt-4">
                {product.description}
              </p>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                  Warna: <span className="text-muted-slate">{selectedColor.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    aria-label={`Pilih warna ${color.name}`}
                    onClick={() => setSelectedColorIdx(idx)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 border transition-all cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'border-ink ring-1 ring-ink ring-offset-2'
                        : 'border-hairline hover:border-ink'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector + Live CM Measurement Readout */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                  Pilih Ukuran
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink underline hover:text-terracotta transition-colors cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Cek Size Guide (CM)</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const soldOut = variant.stock <= 0;
                  const active = selectedSize === variant.size;
                  return (
                    <button
                      key={variant.size}
                      type="button"
                      disabled={soldOut}
                      onClick={() => {
                        setSelectedSize(variant.size);
                        setSizeError(false);
                        setQuantity(1);
                      }}
                      className={`relative min-w-[52px] h-11 px-3 border text-[13px] font-semibold transition-colors ${
                        soldOut
                          ? 'border-hairline text-muted-slate/40 cursor-not-allowed overflow-hidden'
                          : active
                            ? 'border-ink bg-ink text-canvas cursor-pointer'
                            : 'border-hairline bg-canvas text-ink hover:border-ink cursor-pointer'
                      }`}
                    >
                      {variant.size}
                      {soldOut && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(to top right, transparent calc(50% - 0.5px), #C4C7C7 50%, transparent calc(50% + 0.5px))',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <p className="text-[12px] font-medium text-terracotta mt-2">
                  Pilih size dulu dong biar fit-nya nggak zonk!
                </p>
              )}

              {/* Live CM Dimension Readout for Selected Size */}
              {activeVariant ? (
                <div className="mt-3 p-3.5 bg-surface-alt border border-hairline flex flex-wrap items-center justify-between gap-2 text-[12px] tabular-nums">
                  <div className="flex flex-wrap items-center gap-4 text-ink">
                    <span>
                      <strong>{activeVariant.measurementLabel}:</strong>{' '}
                      {activeVariant.chestOrWaistCm} cm
                    </span>
                    <span>
                      <strong>Panjang:</strong> {activeVariant.lengthCm} cm
                    </span>
                    <span>
                      <strong>{activeVariant.secondaryLabel}:</strong>{' '}
                      {activeVariant.shoulderOrOpeningCm} cm
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      activeVariant.stock <= 5 ? 'text-terracotta' : 'text-muted-slate'
                    }`}
                  >
                    {activeVariant.stock <= 5
                      ? `Sisa ${activeVariant.stock}, gercep!`
                      : `Stok aman (${activeVariant.stock})`}
                  </span>
                </div>
              ) : (
                <p className="mt-2.5 text-[12px] text-muted-slate">
                  Klik ukuran di atas buat lihat dimensi detail dalam sentimeter (±1 cm).
                </p>
              )}
            </div>

            {/* Quantity & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-hairline h-12">
                  <button
                    type="button"
                    aria-label="Kurangi kuantitas"
                    disabled={quantity <= 1 || isAllSoldOut}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-full flex items-center justify-center text-ink hover:bg-studio-gray disabled:opacity-35 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-[14px] font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Tambah kuantitas"
                    disabled={quantity >= maxStock || isAllSoldOut || !activeVariant}
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    className="w-11 h-full flex items-center justify-center text-ink hover:bg-studio-gray disabled:opacity-35 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`h-12 px-4 border flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-terracotta text-terracotta bg-surface-alt'
                      : 'border-hairline text-ink hover:border-ink'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-terracotta' : ''}`} />
                  <span>{isWishlisted ? 'Tersimpan' : 'Simpan'}</span>
                </button>

                <button
                  type="button"
                  aria-label="Salin Link Outfit"
                  onClick={handleCopyShareLink}
                  className="h-12 px-4 border border-hairline text-ink hover:border-ink flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Salin Link</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isAllSoldOut}
                  onClick={() => handleAdd(false)}
                  className="h-12 px-6 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {isAllSoldOut ? 'Stok Habis Duluan' : 'Masukin Keranjang'}
                </button>
                <button
                  type="button"
                  disabled={isAllSoldOut}
                  onClick={() => handleAdd(true)}
                  className="h-12 px-6 border border-ink bg-canvas text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Gas Beli Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-muted-slate pt-1">
                <Check className="w-4 h-4 text-ink shrink-0" />
                <span>Gratis ongkir Reguler min. belanja Rp499.000 · Tukar size 7 hari</span>
              </div>
            </div>

            {/* Expandable Info Accordions */}
            <div className="border-t border-hairline pt-2">
              {[
                {
                  title: 'Detail Produk & Bahan',
                  content: (
                    <div className="space-y-2 text-[13px] text-muted-slate">
                      <p className="text-ink font-medium">{product.material}</p>
                      <p>{product.shortSpec}</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.careInstructions.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ),
                },
                {
                  title: 'Info Pengiriman',
                  content: (
                    <p className="text-[13px] text-muted-slate leading-relaxed">
                      Order sebelum jam 15:00 WIB dikirim di hari yang sama dari studio Jakarta
                      Selatan. Tersedia JNE/J&amp;T Reguler (2–3 hari), SiCepat Express (1–2 hari),
                      dan Same-Day Jabodetabek.
                    </p>
                  ),
                },
                {
                  title: 'Garansi Retur & Tukar Size 7 Hari',
                  content: (
                    <p className="text-[13px] text-muted-slate leading-relaxed">
                      Kalau ukuran kurang pas di badan, lo bisa tukar size dalam 7 hari kerja sejak
                      paket diterima. Pastikan hangtag utuh, belum dicuci, dan belum dipakai keluar.
                    </p>
                  ),
                },
              ].map((acc, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={acc.title} className="border-b border-hairline">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                      className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-[13px] font-semibold uppercase tracking-wider text-ink">
                        {acc.title}
                      </span>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-ink shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-ink shrink-0" />
                      )}
                    </button>
                    {isOpen && <div className="pb-4">{acc.content}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations: Mungkin Lo Suka Juga */}
        <section className="mt-20 pt-14 border-t border-hairline">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                Lengkapi Fit Lo
              </span>
              <h2 className="font-editorial text-3xl uppercase text-ink">
                Mungkin Lo Suka Juga
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="text-[12px] font-semibold uppercase tracking-widest text-ink hover:text-terracotta cursor-pointer"
            >
              Lihat Semua ↗
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
