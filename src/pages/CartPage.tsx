import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { formatIDR } from '../utils/format';

export const CartPage: React.FC = () => {
  const {
    products,
    cart,
    cartCount,
    subtotal,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    updateCartQty,
    removeFromCart,
    navigate,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyPromoCode(promoInput);
    setPromoFeedback({ ok: res.ok, text: res.message });
    if (res.ok) setPromoInput('');
  };

  const netTotal = Math.max(0, subtotal - discountAmount);
  const recommendations = products.filter(
    (p) => !p.isSoldOut && !cart.some((c) => c.productId === p.id)
  ).slice(0, 4);

  return (
    <div className="w-full bg-canvas">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-10 lg:py-14">
        {/* Page Header */}
        <div className="border-b border-hairline pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
              Review Belanjaan
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
              Keranjang Lo ({cartCount} item)
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate({ page: 'catalog', category: 'all' })}
            className="text-[12px] font-semibold uppercase tracking-widest text-ink underline hover:text-terracotta transition-colors cursor-pointer"
          >
            Lanjut Kepoin Koleksi ↗
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="border border-hairline bg-surface-alt py-16 px-6 text-center max-w-2xl mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-slate stroke-[1.25] mx-auto mb-4" />
            <h2 className="font-editorial text-2xl sm:text-3xl uppercase text-ink mb-2">
              Keranjang Lo Masih Kosong Nih.
            </h2>
            <p className="text-[14px] text-muted-slate mb-6 max-w-md mx-auto">
              Yuk, cari outfit yang paling klik sama gaya lo! Semua produk dilengkapi detail ukuran
              dalam cm biar nggak salah pilih.
            </p>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Kepoin Koleksinya ↗
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Itemized Cart Cards */}
            <div className="lg:col-span-7 divide-y divide-hairline border-t border-b border-hairline">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.colorName}`}
                  className="py-6 flex gap-4 sm:gap-6"
                >
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'product', slug: item.slug })}
                    className="w-24 sm:w-28 aspect-[3/4] bg-studio-gray border border-hairline shrink-0 overflow-hidden cursor-pointer"
                  >
                    <EditorialImage src={item.image} alt={item.name} />
                  </button>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <button
                          type="button"
                          onClick={() => navigate({ page: 'product', slug: item.slug })}
                          className="text-[16px] font-semibold text-ink hover:underline text-left cursor-pointer"
                        >
                          {item.name}
                        </button>
                        <p className="text-[13px] text-muted-slate mt-1">
                          Size <strong className="text-ink">{item.size}</strong> · Warna{' '}
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              style={{ backgroundColor: item.colorHex }}
                              className="w-2.5 h-2.5 border border-hairline inline-block"
                            />
                            {item.colorName}
                          </span>
                        </p>
                        <p className="text-[12px] text-muted-slate mt-0.5 tabular-nums">
                          {item.measurementSummary}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={`Hapus ${item.name}`}
                        onClick={() => removeFromCart(item.productId, item.size, item.colorName)}
                        className="p-1.5 text-muted-slate hover:text-terracotta transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      <div className="inline-flex items-center border border-hairline">
                        <button
                          type="button"
                          aria-label="Kurangi kuantitas"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateCartQty(item.productId, item.size, item.colorName, -1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-ink hover:bg-studio-gray disabled:opacity-35 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-[13px] font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Tambah kuantitas"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            updateCartQty(item.productId, item.size, item.colorName, 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-ink hover:bg-studio-gray disabled:opacity-35 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right tabular-nums">
                        <span className="text-[15px] font-semibold text-ink block">
                          {formatIDR(item.unitPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-muted-slate">
                            {formatIDR(item.unitPrice)} / pcs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Ringkasan Order Panel (#F7F7F5) */}
            <aside className="lg:col-span-5 bg-surface-alt border border-hairline p-6 lg:p-8 space-y-6 lg:sticky lg:top-24">
              <h2 className="font-editorial text-2xl uppercase text-ink border-b border-hairline pb-4">
                Ringkasan Order
              </h2>

              {/* Promo Code Input */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-2">
                  Punya kode promo?
                </label>
                {promoCode ? (
                  <div className="flex items-center justify-between px-3 py-2.5 bg-canvas border border-ink text-[12px]">
                    <span className="inline-flex items-center gap-2 font-semibold text-ink">
                      <Tag className="w-3.5 h-3.5 text-terracotta" />
                      Kode {promoCode} aktif
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removePromoCode();
                        setPromoFeedback(null);
                      }}
                      className="text-muted-slate hover:text-terracotta cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Coba: URBAN10 atau HEMAT50"
                      className="flex-1 px-3.5 py-2.5 bg-canvas border border-hairline text-[13px] text-ink placeholder:text-muted-slate focus:outline-none focus:border-ink"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Pakai
                    </button>
                  </form>
                )}
                {promoFeedback && (
                  <p
                    className={`text-[12px] mt-1.5 ${
                      promoFeedback.ok ? 'text-ink' : 'text-terracotta'
                    }`}
                  >
                    {promoFeedback.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-hairline text-[14px]">
                <div className="flex justify-between text-muted-slate">
                  <span>Subtotal ({cartCount} item)</span>
                  <span className="text-ink font-semibold tabular-nums">
                    {formatIDR(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-terracotta">
                    <span>Diskon ({promoCode})</span>
                    <span className="font-semibold tabular-nums">
                      -{formatIDR(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-muted-slate">
                  <span>Ongkir</span>
                  <span className="text-[13px]">Dihitung pas checkout ya</span>
                </div>

                <div className="pt-4 border-t border-hairline flex justify-between items-baseline">
                  <span className="text-[15px] font-semibold text-ink">Total Sementara</span>
                  <span className="text-xl font-semibold text-ink tabular-nums">
                    {formatIDR(netTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate({ page: 'checkout' })}
                className="w-full py-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lanjut Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[12px] text-muted-slate text-center">
                Checkout sat-set tanpa wajib buat akun · Garansi tukar size 7 hari
              </p>
            </aside>
          </div>
        )}

        {/* Mungkin Lo Suka Juga */}
        {recommendations.length > 0 && (
          <section className="mt-20 pt-14 border-t border-hairline">
            <div className="mb-8">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                Tambahan Pas Buat Gaya Lo
              </span>
              <h2 className="font-editorial text-3xl uppercase text-ink">
                Mungkin Lo Suka Juga
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
