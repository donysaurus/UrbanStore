import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useStore } from '../context/StoreContext';
import { PAYMENT_METHODS, SHIPPING_METHODS } from '../data/products';
import { OrderRecord, ShippingAddress } from '../types';
import { formatIDR } from '../utils/format';

const INDONESIAN_PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Kepulauan Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua Barat',
  'Papua Barat Daya',
  'Papua',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Selatan',
];

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    promoCode,
    discountAmount,
    clearCart,
    saveOrder,
    navigate,
    showToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    whatsapp: '',
    email: '',
    address: '',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: '',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [shippingId, setShippingId] = useState<string>(SHIPPING_METHODS[0].id);
  const [paymentId, setPaymentId] = useState<string>(PAYMENT_METHODS[0].id);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl uppercase text-ink mb-3">
          Keranjang Lo Masih Kosong.
        </h1>
        <p className="text-[14px] text-muted-slate mb-6">
          Pilih outfit dulu sebelum lanjut ke halaman checkout ya!
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest cursor-pointer"
        >
          Kepoin Koleksi ↗
        </button>
      </div>
    );
  }

  const selectedShipping =
    SHIPPING_METHODS.find((m) => m.id === shippingId) || SHIPPING_METHODS[0];
  const selectedPayment =
    PAYMENT_METHODS.find((m) => m.id === paymentId) || PAYMENT_METHODS[0];

  const isFreeRegular = selectedShipping.id === 'reguler' && subtotal >= 499000;
  const effectiveShippingFee = isFreeRegular ? 0 : selectedShipping.fee;
  const grandTotal = Math.max(0, subtotal - discountAmount + effectiveShippingFee);

  const validateStep1 = (): boolean => {
    const nextErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!address.fullName.trim()) nextErrors.fullName = 'Nama lengkap penerima wajib diisi ya.';
    if (!address.whatsapp.trim() || address.whatsapp.replace(/\D/g, '').length < 9) {
      nextErrors.whatsapp = 'Nomor WhatsApp aktif wajib diisi buat update resi.';
    }
    if (!address.email.trim() || !address.email.includes('@')) {
      nextErrors.email = 'Masukin email yang valid buat kirim invoice.';
    }
    if (!address.address.trim() || address.address.trim().length < 10) {
      nextErrors.address = 'Tulis alamat lengkap (jalan, nomor rumah/patokan) biar kurir nggak nyasar.';
    }
    if (!address.city.trim()) nextErrors.city = 'Kota / Kabupaten wajib diisi.';
    if (!address.district.trim()) nextErrors.district = 'Kecamatan wajib diisi.';
    if (!address.postalCode.trim() || !/^\d{5}$/.test(address.postalCode.trim())) {
      nextErrors.postalCode = 'Kode pos harus 5 digit angka yang valid.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Ada beberapa data pengiriman yang belum lengkap nih.', 'error');
    }
  };

  const handlePlaceOrder = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const randomSuffix = `${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const orderNumber = `US-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrder: OrderRecord = {
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: address,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      promoCode,
      shippingMethod: selectedShipping,
      shippingFee: effectiveShippingFee,
      paymentMethod: selectedPayment,
      total: grandTotal,
      status: selectedPayment.id === 'cod' ? 'Diproses Kurator' : 'Menunggu Pembayaran',
    };

    window.setTimeout(() => {
      saveOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      navigate({ page: 'order-success', orderNumber });
    }, 550);
  };

  return (
    <div className="w-full bg-canvas">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-10 lg:py-14">
        {/* Stepper Header */}
        <div className="border-b border-hairline pb-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                Guest Checkout · Tanpa Wajib Akun
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
                Checkout Sat-Set
              </h1>
            </div>

            {/* 3-Step Indicator */}
            <div className="flex items-center gap-2 sm:gap-4 text-[11px] font-semibold uppercase tracking-widest">
              {(
                [
                  { num: 1, label: '1. Alamat Lo' },
                  { num: 2, label: '2. Pengiriman & Bayar' },
                  { num: 3, label: '3. Cek Lagi & Gas' },
                ] as const
              ).map((s, idx) => {
                const active = step === s.num;
                const done = step > s.num;
                return (
                  <React.Fragment key={s.num}>
                    <button
                      type="button"
                      disabled={s.num > step}
                      onClick={() => {
                        if (s.num < step) setStep(s.num);
                      }}
                      className={`pb-1 transition-colors whitespace-nowrap ${
                        active
                          ? 'text-ink border-b-2 border-ink'
                          : done
                            ? 'text-terracotta cursor-pointer'
                            : 'text-muted-slate/50 cursor-default'
                      }`}
                    >
                      {s.label}
                    </button>
                    {idx < 2 && <span className="text-hairline">/</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Step Forms */}
          <div className="lg:col-span-7">
            {/* STEP 1: Info Pengiriman */}
            {step === 1 && (
              <form onSubmit={handleNextFromStep1} className="space-y-6">
                <h2 className="font-editorial text-2xl uppercase text-ink">
                  1. Info Penerima &amp; Alamat
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                      Nama Lengkap Penerima *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="Contoh: Raka Pratama"
                      className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.fullName && (
                      <p className="text-[12px] text-terracotta mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={address.whatsapp}
                      onChange={(e) => setAddress({ ...address, whatsapp: e.target.value })}
                      placeholder="0812xxxxxxxx"
                      className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.whatsapp && (
                      <p className="text-[12px] text-terracotta mt-1">{errors.whatsapp}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                    Alamat Email (Buat Kirim Invoice) *
                  </label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.email && (
                    <p className="text-[12px] text-terracotta mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                    Alamat Lengkap (Jalan, Nomor, Patokan) *
                  </label>
                  <textarea
                    rows={3}
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="Jl. Kemang Raya No. 24, Blok B, dekat coffee shop..."
                    className="w-full p-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.address && (
                    <p className="text-[12px] text-terracotta mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                      Provinsi *
                    </label>
                    <select
                      value={address.province}
                      onChange={(e) => setAddress({ ...address, province: e.target.value })}
                      className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                    >
                      {INDONESIAN_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Jakarta Selatan"
                      className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.city && (
                      <p className="text-[12px] text-terracotta mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                      Kecamatan *
                    </label>
                    <input
                      type="text"
                      value={address.district}
                      onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      placeholder="Mampang Prapatan"
                      className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.district && (
                      <p className="text-[12px] text-terracotta mt-1">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                      Kode Pos *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="12730"
                      className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink tabular-nums"
                    />
                    {errors.postalCode && (
                      <p className="text-[12px] text-terracotta mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                    Catatan untuk Kurir (Opsional)
                  </label>
                  <input
                    type="text"
                    value={address.notes ?? ''}
                    onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                    placeholder="Contoh: Titip di pos satpam atau pagar hitam sebelah kafe..."
                    className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'cart' })}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-muted-slate hover:text-ink cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Balik ke Keranjang</span>
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Pilih Kurir &amp; Bayar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Kurir & Pembayaran */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-editorial text-2xl uppercase text-ink mb-4">
                    2A. Pilih Metode Pengiriman
                  </h2>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => {
                      const active = shippingId === method.id;
                      const free = method.id === 'reguler' && subtotal >= 499000;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setShippingId(method.id)}
                          className={`w-full text-left p-4 border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                            active
                              ? 'border-ink bg-surface-alt'
                              : 'border-hairline bg-canvas hover:border-ink/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-semibold text-ink">
                                {method.name}
                              </span>
                              <span className="text-[11px] text-muted-slate">· {method.eta}</span>
                            </div>
                            <p className="text-[12px] text-muted-slate mt-1">{method.description}</p>
                          </div>
                          <div className="text-right shrink-0 tabular-nums">
                            {free ? (
                              <div>
                                <span className="text-[14px] font-semibold text-terracotta block">
                                  GRATIS
                                </span>
                                <span className="text-[11px] text-muted-slate line-through">
                                  {formatIDR(method.fee)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[14px] font-semibold text-ink">
                                {formatIDR(method.fee)}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="font-editorial text-2xl uppercase text-ink mb-4">
                    2B. Pilih Metode Pembayaran
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((pm) => {
                      const active = paymentId === pm.id;
                      const disabledCod = pm.id === 'cod' && grandTotal > 1500000;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          disabled={disabledCod}
                          onClick={() => setPaymentId(pm.id)}
                          className={`w-full text-left p-4 border transition-colors flex items-center justify-between gap-4 ${
                            disabledCod
                              ? 'border-hairline opacity-40 cursor-not-allowed'
                              : active
                                ? 'border-ink bg-surface-alt cursor-pointer'
                                : 'border-hairline bg-canvas hover:border-ink/50 cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-semibold text-ink">{pm.name}</span>
                              {pm.badge && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                                  · {pm.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-muted-slate mt-1">{pm.subtitle}</p>
                          </div>
                          <div
                            className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                              active ? 'bg-ink border-ink text-canvas' : 'border-hairline'
                            }`}
                          >
                            {active && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-muted-slate hover:text-ink cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Edit Alamat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Cek Lagi Pesanan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Cek Lagi & Gas */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-editorial text-2xl uppercase text-ink">
                  3. Cek Lagi Sebelum Order
                </h2>

                <div className="border border-hairline bg-surface-alt p-5 space-y-4 text-[13px]">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-hairline">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                        Dikirim Ke
                      </span>
                      <p className="font-semibold text-ink">
                        {address.fullName} · {address.whatsapp}
                      </p>
                      <p className="text-muted-slate mt-0.5">
                        {address.address}, Kec. {address.district}, {address.city},{' '}
                        {address.province} {address.postalCode}
                      </p>
                      <p className="text-muted-slate mt-0.5">{address.email}</p>
                      {address.notes?.trim() && (
                        <p className="text-[12px] text-muted-slate italic mt-1">
                          Catatan: &ldquo;{address.notes.trim()}&rdquo;
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] font-semibold uppercase tracking-wider text-ink underline cursor-pointer shrink-0"
                    >
                      Ubah
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                          Kurir Pilihan
                        </span>
                        <p className="font-semibold text-ink">{selectedShipping.name}</p>
                        <p className="text-muted-slate">{selectedShipping.eta}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[11px] font-semibold uppercase tracking-wider text-ink underline cursor-pointer shrink-0"
                      >
                        Ubah
                      </button>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                        Metode Pembayaran
                      </span>
                      <p className="font-semibold text-ink">{selectedPayment.name}</p>
                      <p className="text-muted-slate">{selectedPayment.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Items Review */}
                <div className="border border-hairline divide-y divide-hairline">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.colorName}`}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-16 bg-studio-gray border border-hairline shrink-0 overflow-hidden">
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

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-muted-slate hover:text-ink cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full sm:w-auto px-10 py-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isSubmitting
                        ? 'Lagi Memproses Pesanan...'
                        : `Gas Buat Pesanan (${formatIDR(grandTotal)})`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Persistent Cost Summary */}
          <aside className="lg:col-span-5 bg-surface-alt border border-hairline p-6 lg:p-8 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-editorial text-2xl uppercase text-ink border-b border-hairline pb-4">
              Ringkasan Biaya ({cartCount} item)
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.colorName}`}
                  className="flex items-center justify-between gap-3 text-[13px]"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">
                      {item.name} × {item.quantity}
                    </p>
                    <p className="text-[11px] text-muted-slate">
                      Size {item.size} · {item.colorName}
                    </p>
                  </div>
                  <span className="font-semibold text-ink tabular-nums shrink-0">
                    {formatIDR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-hairline space-y-2.5 text-[14px]">
              <div className="flex justify-between text-muted-slate">
                <span>Subtotal</span>
                <span className="text-ink font-semibold tabular-nums">{formatIDR(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-terracotta">
                  <span>Diskon ({promoCode})</span>
                  <span className="font-semibold tabular-nums">-{formatIDR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-slate">
                <span>Ongkir ({selectedShipping.name.split(' ')[0]})</span>
                <span className="text-ink font-semibold tabular-nums">
                  {effectiveShippingFee === 0 ? 'GRATIS' : formatIDR(effectiveShippingFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-hairline flex justify-between items-baseline">
                <span className="text-[15px] font-semibold text-ink">Total Akhir</span>
                <span className="text-xl font-semibold text-ink tabular-nums">
                  {formatIDR(grandTotal)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
