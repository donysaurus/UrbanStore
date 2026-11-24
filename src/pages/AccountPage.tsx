import React, { useEffect, useState } from 'react';
import { ArrowUpRight, LogOut, Package, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { fetchMyOrdersViaSupabase } from '../services/storeService';
import { OrderRecord } from '../types';
import { formatIDR } from '../utils/format';

export const AccountPage: React.FC = () => {
  const { user, profile, isAdmin, isAuthenticated, isLoading, signOut, updateProfile } = useAuth();
  const { orders: contextOrders, isSupabaseSynced, navigate, showToast } = useStore();

  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(profile?.phoneWhatsapp ?? '');
  const [saving, setSaving] = useState(false);
  const [myOrders, setMyOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    setFullName(profile?.fullName ?? '');
    setPhoneWhatsapp(profile?.phoneWhatsapp ?? '');
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    if (isSupabaseSynced) {
      setLoadingOrders(true);
      fetchMyOrdersViaSupabase(user.id)
        .then((res) => setMyOrders(res))
        .finally(() => setLoadingOrders(false));
    } else {
      setMyOrders(contextOrders);
    }
  }, [contextOrders, isSupabaseSynced, user]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-[12px] uppercase tracking-widest text-muted-slate">
        Memuat profil akun...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <User className="w-10 h-10 text-muted-slate mx-auto mb-4 stroke-[1.25]" />
        <h1 className="font-editorial text-3xl uppercase text-ink mb-3">
          Lo Belum Masuk Akun.
        </h1>
        <p className="text-[14px] text-muted-slate mb-6">
          Masuk dulu buat lihat profil, simpan alamat pengiriman, dan pantau status pesanan lo.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'login' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer"
        >
          Masuk / Daftar Akun ↗
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ fullName, phoneWhatsapp });
    setSaving(false);
    if (res.ok) {
      showToast('Profil lo berhasil diperbarui!', 'success');
    } else {
      showToast(res.error || 'Gagal update profil.', 'error');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Lo udah keluar dari akun.', 'info');
    navigate({ page: 'home' });
  };

  return (
    <div className="w-full bg-canvas py-10 lg:py-14">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="border-b border-hairline pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest border ${
                  isAdmin
                    ? 'bg-terracotta text-canvas border-terracotta'
                    : 'bg-surface-alt text-ink border-hairline'
                }`}
              >
                Role: {profile?.role ?? 'pelanggan'}
              </span>
              <span className="text-[11px] text-muted-slate">{user.email}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
              Akun Saya
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate({ page: 'admin' })}
                className="px-5 py-2.5 bg-terracotta text-canvas text-[11px] font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Buka Admin Dashboard</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="px-5 py-2.5 border border-ink text-ink text-[11px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Profile Form */}
          <div className="lg:col-span-4 border border-hairline bg-surface-alt p-6 space-y-5">
            <h2 className="font-editorial text-2xl uppercase text-ink border-b border-hairline pb-3">
              Detail Profil
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                  Email Terdaftar
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email ?? ''}
                  className="w-full h-11 px-3.5 bg-studio-gray border border-hairline text-[13px] text-muted-slate cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap lo"
                  className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={phoneWhatsapp}
                  onChange={(e) => setPhoneWhatsapp(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors cursor-pointer"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>

          {/* Right: Order History */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h2 className="font-editorial text-2xl uppercase text-ink">
                Riwayat Pesanan ({myOrders.length})
              </h2>
              <button
                type="button"
                onClick={() => navigate({ page: 'catalog', category: 'all' })}
                className="text-[11px] font-semibold uppercase tracking-widest text-ink hover:text-terracotta inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Belanja Lagi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-[13px] text-muted-slate border border-hairline">
                Mengambil riwayat pesanan dari server...
              </div>
            ) : myOrders.length === 0 ? (
              <div className="border border-hairline bg-surface-alt p-10 text-center">
                <Package className="w-8 h-8 text-muted-slate mx-auto mb-3 stroke-[1.25]" />
                <p className="font-editorial text-xl uppercase text-ink mb-1">
                  Belum Ada Pesanan Nih.
                </p>
                <p className="text-[13px] text-muted-slate mb-5">
                  Begitu lo checkout, semua riwayat transaksi dan nomor resi bakal muncul di sini.
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'catalog', category: 'all' })}
                  className="px-6 py-3 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
                >
                  Kepoin Koleksinya ↗
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="border border-hairline bg-canvas p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-hairline">
                      <div>
                        <span className="text-[12px] font-semibold text-ink tabular-nums">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[12px] text-muted-slate ml-3">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-surface-alt border border-hairline text-[10px] font-semibold uppercase tracking-widest text-ink">
                          {order.status}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            navigate({ page: 'order-success', orderNumber: order.orderNumber })
                          }
                          className="text-[11px] font-semibold uppercase tracking-widest text-terracotta hover:underline cursor-pointer"
                        >
                          Detail Struk ↗
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px]">
                      <div className="space-y-1">
                        <p className="text-ink font-medium">
                          {order.items.map((i) => `${i.name} (${i.size}) ×${i.quantity}`).join(', ')}
                        </p>
                        <p className="text-[12px] text-muted-slate">
                          {order.shippingMethod.name} · {order.paymentMethod.name}
                          {order.trackingNumber && (
                            <span className="ml-2 text-ink font-semibold">
                              · Resi: {order.trackingNumber}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-[15px] font-semibold text-ink tabular-nums shrink-0">
                        {formatIDR(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
