import React from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatIDR } from '../utils/format';
import { EditorialImage } from './EditorialImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setCartDrawerOpen,
    cart,
    cartCount,
    subtotal,
    discountAmount,
    updateCartQty,
    removeFromCart,
    navigate,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 499000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const netSubtotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/55 transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      {/* Panel */}
      <aside className="relative z-10 w-full max-w-md bg-canvas h-full border-l border-hairline flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-hairline flex items-center justify-between bg-canvas">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block">
              Tas Belanja
            </span>
            <h2 className="font-editorial text-xl uppercase text-ink">
              Keranjang Lo ({cartCount} item)
            </h2>
          </div>
          <button
            type="button"
            aria-label="Tutup Keranjang"
            onClick={() => setCartDrawerOpen(false)}
            className="p-2 text-ink hover:text-terracotta transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Micro-Progress */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-surface-alt border-b border-hairline">
            {remainingForFreeShipping === 0 ? (
              <p className="text-[12px] font-medium text-ink">
                Mantap! Order lo udah dapet{' '}
                <strong className="text-terracotta">Gratis Ongkir Reguler</strong> se-Jabodetabek.
              </p>
            ) : (
              <p className="text-[12px] text-muted-slate">
                Tambah{' '}
                <strong className="text-ink tabular-nums">
                  {formatIDR(remainingForFreeShipping)}
                </strong>{' '}
                lagi buat dapetin Gratis Ongkir Reguler.
              </p>
            )}
            <div className="w-full h-1 bg-hairline mt-2">
              <div
                className="h-full bg-ink transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-hairline">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-muted-slate stroke-[1.25] mb-4" />
              <h3 className="font-editorial text-xl uppercase text-ink mb-2">
                Keranjang Lo Masih Kosong
              </h3>
              <p className="text-[13px] text-muted-slate max-w-xs mb-6">
                Keranjang lo masih kosong nih. Yuk, cari outfit yang paling klik sama gaya lo!
              </p>
              <button
                type="button"
                onClick={() => navigate({ page: 'catalog', category: 'all' })}
                className="px-6 py-3 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Kepoin Koleksi ↗
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.colorName}`}
                className="py-4 flex gap-4"
              >
                <button
                  type="button"
                  onClick={() => navigate({ page: 'product', slug: item.slug })}
                  className="w-20 h-26 bg-studio-gray border border-hairline shrink-0 overflow-hidden cursor-pointer"
                >
                  <EditorialImage src={item.image} alt={item.name} />
                </button>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => navigate({ page: 'product', slug: item.slug })}
                        className="text-[14px] font-semibold text-ink hover:underline text-left truncate block w-full cursor-pointer"
                      >
                        {item.name}
                      </button>
                      <p className="text-[12px] text-muted-slate mt-0.5">
                        Size {item.size} · {item.colorName}
                      </p>
                      <p className="text-[11px] text-muted-slate mt-0.5">
                        {item.measurementSummary}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Hapus ${item.name}`}
                      onClick={() => removeFromCart(item.productId, item.size, item.colorName)}
                      className="text-muted-slate hover:text-terracotta p-1 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-hairline">
                      <button
                        type="button"
                        aria-label="Kurangi jumlah"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateCartQty(item.productId, item.size, item.colorName, -1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-ink hover:bg-studio-gray disabled:opacity-35 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[12px] font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Tambah jumlah"
                        disabled={item.quantity >= item.maxStock}
                        onClick={() =>
                          updateCartQty(item.productId, item.size, item.colorName, 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-ink hover:bg-studio-gray disabled:opacity-35 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[14px] font-semibold text-ink tabular-nums">
                      {formatIDR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 bg-surface-alt border-t border-hairline space-y-4">
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between text-muted-slate">
                <span>Subtotal</span>
                <span className="text-ink font-semibold tabular-nums">
                  {formatIDR(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-terracotta">
                  <span>Diskon Promo</span>
                  <span className="font-semibold tabular-nums">
                    -{formatIDR(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-muted-slate">
                <span>Ongkir</span>
                <span>Dihitung pas checkout ya</span>
              </div>
              <div className="pt-2 border-t border-hairline flex justify-between text-[15px] font-semibold text-ink">
                <span>Estimasi Total</span>
                <span className="tabular-nums">{formatIDR(netSubtotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate({ page: 'cart' })}
                className="py-3 px-4 border border-ink bg-canvas text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
              >
                Lihat Keranjang
              </button>
              <button
                type="button"
                onClick={() => navigate({ page: 'checkout' })}
                className="py-3 px-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Gas Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
