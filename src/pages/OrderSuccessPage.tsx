import React from 'react';
import { ArrowUpRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useStore } from '../context/StoreContext';
import { formatIDR } from '../utils/format';

interface OrderSuccessPageProps {
  orderNumber: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderNumber }) => {
  const { getOrder, navigate } = useStore();
  const order = getOrder(orderNumber);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl uppercase text-ink mb-3">
          Order Nggak Ditemukan.
        </h1>
        <p className="text-[14px] text-muted-slate mb-6">
          Pastikan lo mengakses halaman konfirmasi dari checkout yang baru selesai ya.
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

  return (
    <div className="w-full bg-canvas py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="border border-hairline bg-canvas p-6 sm:p-10">
          {/* Status Banner */}
          <div className="border-b border-hairline pb-8 mb-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-terracotta mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Order Confirmed · #{order.orderNumber}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink leading-tight">
              Orderan Lo Udah Masuk!
            </h1>
            <p className="text-[14px] text-muted-slate mt-2 leading-relaxed">
              Tinggal duduk manis, paket kece segera meluncur. Update resi dan status pengiriman
              bakal dikirim ke WhatsApp{' '}
              <strong className="text-ink">{order.customer.whatsapp}</strong> dan email{' '}
              <strong className="text-ink">{order.customer.email}</strong>.
            </p>
          </div>

          {/* Payment / Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-hairline text-[13px]">
            <div className="bg-surface-alt border border-hairline p-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block">
                Status &amp; Pembayaran
              </span>
              <p className="font-semibold text-ink">{order.paymentMethod.name}</p>
              <p className="text-muted-slate">Status: {order.status}</p>
              <p className="text-[12px] text-terracotta font-medium pt-1">
                {order.paymentMethod.id === 'cod'
                  ? 'Siapkan uang pas saat kurir tiba ya.'
                  : 'Instruksi QRIS / Virtual Account udah dikirim ke email lo.'}
              </p>
            </div>

            <div className="bg-surface-alt border border-hairline p-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block">
                Alamat &amp; Kurir
              </span>
              <p className="font-semibold text-ink">{order.customer.fullName}</p>
              <p className="text-muted-slate">
                {order.customer.address}, {order.customer.district}, {order.customer.city}{' '}
                {order.customer.postalCode}
              </p>
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
