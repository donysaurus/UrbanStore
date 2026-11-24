import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Copy, PackageCheck } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useStore } from '../context/StoreContext';
import { formatIDR } from '../utils/format';

interface OrderSuccessPageProps {
  orderNumber?: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderNumber: propOrderNumber,
}) => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber: string }>();
  const resolvedOrderNumber = propOrderNumber ?? paramOrderNumber ?? '';
  const { getOrder, navigate, showToast } = useStore();
  const order = getOrder(resolvedOrderNumber);

  const handleCopyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label} berhasil disalin!`, 'success');
    } catch {
      showToast(`Gagal menyalin ${label}.`, 'error');
    }
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl uppercase text-ink mb-3">
          Order Nggak Ditemukan.
        </h1>
        <p className="text-[14px] text-muted-slate mb-6">
          Pastikan lo mengakses halaman konfirmasi dari browser yang sama saat checkout ya.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest cursor-pointer"
        >
          Balik ke Katalog ↗
        </button>
      </div>
    );
  }

  const demoVaNumber = `8801${order.orderNumber.replace(/[^0-9]/g, '').slice(-8).padEnd(8, '0')}`;

  return (
    <div className="w-full bg-canvas py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="border border-hairline bg-canvas p-6 sm:p-10">
          {/* Status Banner */}
          <div className="border-b border-hairline pb-8 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-terracotta">
                <CheckCircle2 className="w-4 h-4" />
                <span>Order Confirmed · #{order.orderNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(order.orderNumber, 'Nomor Order')}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink border border-hairline px-2.5 py-1 hover:border-ink cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Salin No. Order</span>
              </button>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink leading-tight">
              Orderan Lo Udah Masuk!
            </h1>
            <p className="text-[14px] text-muted-slate mt-2 leading-relaxed">
              Simpan nomor pesanan{' '}
              <strong className="text-ink tabular-nums">#{order.orderNumber}</strong> di atas.
              Detail pengiriman tercatat untuk WhatsApp{' '}
              <strong className="text-ink">{order.customer.whatsapp}</strong> dan email{' '}
              <strong className="text-ink">{order.customer.email}</strong>.
            </p>
          </div>

          {/* Payment / Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-hairline text-[13px]">
            <div className="bg-surface-alt border border-hairline p-4 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block">
                Status &amp; Pembayaran
              </span>
              <p className="font-semibold text-ink">{order.paymentMethod.name}</p>
              <p className="text-muted-slate">Status: {order.status}</p>
              {order.paymentMethod.id === 'cod' ? (
                <p className="text-[12px] text-terracotta font-medium pt-1">
                  Siapkan uang pas sejumlah {formatIDR(order.total)} saat kurir tiba ya.
                </p>
              ) : (
                <div className="pt-2 border-t border-hairline space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-slate block">
                    Referensi Bayar (Simulasi Frontend):
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-canvas border border-hairline px-2.5 py-1.5">
                    <span className="font-semibold text-ink tabular-nums text-[12px]">
                      {order.paymentMethod.id === 'va' ? `VA ${demoVaNumber}` : `QRIS-${order.orderNumber}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          order.paymentMethod.id === 'va' ? demoVaNumber : order.orderNumber,
                          'Kode Pembayaran'
                        )
                      }
                      className="text-[11px] font-semibold uppercase text-terracotta hover:underline cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-slate">
                    Catatan: Mode prototipe lokal — gateway pembayaran riil &amp; pengiriman email
                    otomatis akan aktif setelah integrasi backend.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-surface-alt border border-hairline p-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block">
                Alamat &amp; Kurir
              </span>
              <p className="font-semibold text-ink">{order.customer.fullName}</p>
              <p className="text-muted-slate">
                {order.customer.address}, Kec. {order.customer.district}, {order.customer.city},{' '}
                {order.customer.province} {order.customer.postalCode}
              </p>
              {order.customer.notes && (
                <p className="text-[12px] text-muted-slate italic">
                  Catatan: &ldquo;{order.customer.notes}&rdquo;
                </p>
              )}
              <p className="text-ink font-medium pt-1 inline-flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5" />
                {order.shippingMethod.name}
              </p>
            </div>
          </div>

          {/* Receipt Items */}
          <div className="space-y-4 mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate">
              Ringkasan Item ({order.items.length})
            </h2>
            <div className="divide-y divide-hairline border-t border-b border-hairline">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.colorName}`}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-18 bg-studio-gray border border-hairline shrink-0 overflow-hidden">
                      <EditorialImage src={item.image} alt={item.name} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-[12px] text-muted-slate">
                        Size {item.size} · {item.colorName} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-ink tabular-nums shrink-0">
                    {formatIDR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="space-y-2 text-[14px] mb-8">
            <div className="flex justify-between text-muted-slate">
              <span>Subtotal</span>
              <span className="text-ink tabular-nums">{formatIDR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-terracotta">
                <span>Diskon ({order.promoCode})</span>
                <span className="tabular-nums">-{formatIDR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-slate">
              <span>Ongkir</span>
              <span className="text-ink tabular-nums">
                {order.shippingFee === 0 ? 'GRATIS' : formatIDR(order.shippingFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-hairline flex justify-between items-baseline">
              <span className="text-[15px] font-semibold text-ink">Total Pembayaran</span>
              <span className="text-xl font-semibold text-ink tabular-nums">
                {formatIDR(order.total)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="flex-1 py-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Kepoin Koleksi Lainnya</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'home' })}
              className="py-4 px-8 border border-ink text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
            >
              Balik ke Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
