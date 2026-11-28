import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, Database, Package, RefreshCw, ShieldAlert, Tag } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useStore } from '../context/StoreContext';
import {
  adminCreateProduct,
  adminCreatePromoCode,
  adminDeleteProduct,
  adminFetchAllOrders,
  adminFetchPromoCodes,
  adminToggleProductSoldOut,
  adminTogglePromoCode,
  adminUpdateOrderStatus,
  adminUpdateProduct,
  adminUpdateVariantStock,
  fetchCatalogFromSupabase,
  uploadProductImageToSupabase,
} from '../services/storeService';
import { OrderRecord, OrderStatus, Product, PromoCodeRecord } from '../types';
import { formatIDR } from '../utils/format';

type AdminTab = 'orders' | 'inventory' | 'promos';

const ORDER_STATUSES: OrderStatus[] = [
  'Menunggu Pembayaran',
  'Diproses Kurator',
  'Dikirim',
  'Selesai',
  'Dibatalkan',
];

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading, profile } = useAuth();
  const { isSupabaseSynced, dbSyncError, refreshCatalog, navigate, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<PromoCodeRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Order edits map
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [orderEdits, setOrderEdits] = useState<
    Record<string, { status: OrderStatus; trackingNumber: string }>
  >({});

  // Stock edits map (variantId -> number)
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  // New promo form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState('15');
  const [newPromoMin, setNewPromoMin] = useState('0');

  // New product form
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'pria' | 'wanita' | 'unisex'>('pria');
  const [prodDept, setProdDept] = useState<
    'Outerwear' | 'T-Shirts & Tops' | 'Pants & Trousers' | 'Blazers & Tailoring'
  >('Outerwear');
  const [prodPrice, setProdPrice] = useState('249000');
  const [prodSpec, setProdSpec] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStockM, setProdStockM] = useState('10');
  const [prodStockL, setProdStockL] = useState('10');
  const [creatingProd, setCreatingProd] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<string | null>(null);

  // Edit product state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<'pria' | 'wanita' | 'unisex'>('pria');
  const [editProdDept, setEditProdDept] = useState<
    'Outerwear' | 'T-Shirts & Tops' | 'Pants & Trousers' | 'Blazers & Tailoring'
  >('Outerwear');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdSpec, setEditProdSpec] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [savingEditProd, setSavingEditProd] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    try {
      const [ordersRes, catalogRes, promosRes] = await Promise.all([
        adminFetchAllOrders(),
        fetchCatalogFromSupabase(true),
        adminFetchPromoCodes(),
      ]);

      setOrders(ordersRes.orders);
      const nextOrderEdits: Record<string, { status: OrderStatus; trackingNumber: string }> = {};
      for (const o of ordersRes.orders) {
        if (o.id) {
          nextOrderEdits[o.id] = {
            status: o.status,
            trackingNumber: o.trackingNumber ?? '',
          };
        }
      }
      setOrderEdits(nextOrderEdits);

      if (catalogRes.ok) {
        setAdminProducts(catalogRes.products);
        const nextStock: Record<string, number> = {};
        for (const p of catalogRes.products) {
          for (const v of p.variants) {
            if (v.id) nextStock[v.id] = v.stock;
          }
        }
        setStockEdits(nextStock);
      }

      setPromos(promosRes.promos);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && isSupabaseSynced) {
      loadAdminData();
    }
  }, [isAdmin, isSupabaseSynced, loadAdminData]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'Dibatalkan')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(
      (o) => o.status === 'Menunggu Pembayaran' || o.status === 'Diproses Kurator'
    ).length;
    const lowStockCount = adminProducts.reduce(
      (count, p) => count + p.variants.filter((v) => v.stock <= 3).length,
      0
    );
    return {
      totalOrders: orders.length,
      pendingOrders,
      totalRevenue,
      lowStockCount,
    };
  }, [adminProducts, orders]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-[12px] uppercase tracking-widest text-muted-slate">
        Memverifikasi hak akses...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShieldAlert className="w-10 h-10 text-terracotta mx-auto mb-4 stroke-[1.25]" />
        <h1 className="font-editorial text-3xl uppercase text-ink mb-3">
          Login Diperlukan.
        </h1>
        <p className="text-[14px] text-muted-slate mb-6">
          Masuk dengan akun berstatus Admin untuk mengelola pesanan, stok produk, dan promo.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'login' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest cursor-pointer"
        >
          Masuk ke Portal ↗
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShieldAlert className="w-10 h-10 text-terracotta mx-auto mb-4 stroke-[1.25]" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-2">
          403 · Akses Ditolak
        </span>
        <h1 className="font-editorial text-3xl uppercase text-ink mb-3">
          Area Khusus Admin / Kurator.
        </h1>
        <p className="text-[14px] text-muted-slate mb-6">
          Akun lo ({profile?.email}) saat ini memiliki role <strong>{profile?.role}</strong>.
          Halaman ini hanya dapat diakses oleh akun dengan role <strong>admin</strong>.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="px-8 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest cursor-pointer"
        >
          Balik ke Home ↗
        </button>
      </div>
    );
  }

  const handleSaveOrder = async (orderId: string) => {
    const edit = orderEdits[orderId];
    if (!edit) return;
    const res = await adminUpdateOrderStatus(orderId, edit.status, edit.trackingNumber);
    if (res.ok) {
      showToast('Status pesanan & nomor resi berhasil disimpan!', 'success');
      await loadAdminData();
    } else {
      showToast(res.error || 'Gagal memperbarui pesanan.', 'error');
    }
  };

  const handleSaveVariantStock = async (variantId: string, productId: string) => {
    const nextStock = stockEdits[variantId] ?? 0;
    const res = await adminUpdateVariantStock(variantId, nextStock, productId);
    if (res.ok) {
      showToast('Stok varian berhasil diperbarui!', 'success');
      await Promise.all([loadAdminData(), refreshCatalog()]);
    } else {
      showToast(res.error || 'Gagal memperbarui stok.', 'error');
    }
  };

  const handleToggleSoldOut = async (productId: string, current: boolean) => {
    const res = await adminToggleProductSoldOut(productId, !current);
    if (res.ok) {
      showToast('Status ketersediaan produk diperbarui.', 'success');
      await Promise.all([loadAdminData(), refreshCatalog()]);
    } else {
      showToast(res.error || 'Gagal mengubah status.', 'error');
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const res = await adminCreatePromoCode({
      code: newPromoCode,
      discountType: newPromoType,
      discountValue: Number(newPromoValue) || 10,
      minSubtotal: Number(newPromoMin) || 0,
    });
    if (res.ok) {
      showToast(`Kode promo ${newPromoCode.toUpperCase()} dibuat!`, 'success');
      setNewPromoCode('');
      await loadAdminData();
    } else {
      showToast(res.error || 'Gagal membuat kode promo.', 'error');
    }
  };

  const handleTogglePromo = async (code: string, currentActive: boolean) => {
    const res = await adminTogglePromoCode(code, !currentActive);
    if (res.ok) {
      showToast(`Status promo ${code} diperbarui.`, 'info');
      await loadAdminData();
    }
  };

  const visibleOrders =
    statusFilter === 'ALL' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="w-full bg-canvas py-10 lg:py-14">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="border-b border-hairline pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-1">
              Curator Operations · Role: Admin
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
              UrbanStore Admin Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={loadAdminData}
            disabled={loadingData}
            className="px-4 py-2.5 border border-ink text-[11px] font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-canvas transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Sinkron Ulang DB</span>
          </button>
        </div>

        {/* Supabase Schema Warning Banner if DB not yet initialized */}
        {!isSupabaseSynced && (
          <div className="mb-8 border border-terracotta bg-surface-alt p-5 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="text-[13px] space-y-1">
              <p className="font-semibold text-ink uppercase tracking-wider text-[12px]">
                Database Supabase Belum Diinisialisasi / Tabel Belum Ditemukan
              </p>
              <p className="text-muted-slate">
                Jalankan file <code>supabase/schema.sql</code> dan <code>supabase/seed.sql</code> di
                Supabase Dashboard → SQL Editor terlebih dahulu untuk mengaktifkan data produk,
                pesanan, dan stok riil.
                {dbSyncError ? ` (Detail: ${dbSyncError})` : ''}
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="border border-hairline bg-surface-alt p-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
              Total Pesanan
            </span>
            <p className="font-editorial text-3xl text-ink tabular-nums">{stats.totalOrders}</p>
          </div>
          <div className="border border-hairline bg-surface-alt p-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
              Perlu Diproses
            </span>
            <p className="font-editorial text-3xl text-terracotta tabular-nums">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="border border-hairline bg-surface-alt p-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
              Total Omzet
            </span>
            <p className="font-editorial text-2xl sm:text-3xl text-ink tabular-nums">
              {formatIDR(stats.totalRevenue)}
            </p>
          </div>
          <div className="border border-hairline bg-surface-alt p-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
              Varian Stok Kritis (≤3)
            </span>
            <p className="font-editorial text-3xl text-ink tabular-nums">{stats.lowStockCount}</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex flex-wrap border-b border-hairline mb-8 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-ink text-ink'
                : 'border-transparent text-muted-slate hover:text-ink'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pesanan ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer border-b-2 transition-colors ${
              activeTab === 'inventory'
                ? 'border-ink text-ink'
                : 'border-transparent text-muted-slate hover:text-ink'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Inventori &amp; Stok ({adminProducts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('promos')}
            className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer border-b-2 transition-colors ${
              activeTab === 'promos'
                ? 'border-ink text-ink'
                : 'border-transparent text-muted-slate hover:text-ink'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Kode Promo ({promos.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {(['ALL', ...ORDER_STATUSES] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                    statusFilter === st
                      ? 'bg-ink text-canvas border-ink'
                      : 'bg-canvas text-muted-slate border-hairline hover:border-ink'
                  }`}
                >
                  {st === 'ALL' ? 'Semua Status' : st}
                </button>
              ))}
            </div>

            {visibleOrders.length === 0 ? (
              <div className="border border-hairline bg-surface-alt p-10 text-center text-[13px] text-muted-slate">
                Belum ada pesanan di kategori status ini.
              </div>
            ) : (
              <div className="space-y-4">
                {visibleOrders.map((order) => {
                  const oid = order.id || order.orderNumber;
                  const edit = orderEdits[oid] || {
                    status: order.status,
                    trackingNumber: order.trackingNumber ?? '',
                  };

                  return (
                    <div key={oid} className="border border-hairline bg-canvas p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-3">
                        <div>
                          <span className="font-semibold text-ink text-[14px] tabular-nums">
                            #{order.orderNumber}
                          </span>
                          <span className="text-[12px] text-muted-slate ml-3">
                            {new Date(order.createdAt).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-[15px] font-semibold text-ink tabular-nums">
                          {formatIDR(order.total)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-[13px]">
                        <div className="lg:col-span-5 space-y-1">
                          <p className="font-semibold text-ink">
                            {order.customer.fullName} · {order.customer.whatsapp}
                          </p>
                          <p className="text-muted-slate">{order.customer.email}</p>
                          <p className="text-muted-slate">
                            {order.customer.address}, Kec. {order.customer.district},{' '}
                            {order.customer.city}, {order.customer.province}{' '}
                            {order.customer.postalCode}
                          </p>
                        </div>

                        <div className="lg:col-span-4 space-y-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-slate block">
                            Item ({order.items.length}) · {order.shippingMethod.name}
                          </span>
                          {order.items.map((item) => (
                            <p key={`${item.productId}-${item.size}`} className="text-ink">
                              {item.name} ({item.size}, {item.colorName}) ×{item.quantity}
                            </p>
                          ))}
                        </div>

                        <div className="lg:col-span-3 space-y-2">
                          <select
                            value={edit.status}
                            onChange={(e) =>
                              setOrderEdits((prev) => ({
                                ...prev,
                                [oid]: { ...edit, status: e.target.value as OrderStatus },
                              }))
                            }
                            className="w-full h-9 px-2.5 border border-hairline bg-canvas text-[12px] font-semibold text-ink"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Input No. Resi (AWB)..."
                            value={edit.trackingNumber}
                            onChange={(e) =>
                              setOrderEdits((prev) => ({
                                ...prev,
                                [oid]: { ...edit, trackingNumber: e.target.value },
                              }))
                            }
                            className="w-full h-9 px-2.5 border border-hairline bg-canvas text-[12px] text-ink"
                          />
                          {order.id && (
                            <button
                              type="button"
                              onClick={() => handleSaveOrder(order.id!)}
                              className="w-full h-9 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer inline-flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Simpan Update</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!prodName.trim()) return;
                setCreatingProd(true);
                const res = await adminCreateProduct({
                  name: prodName,
                  category: prodCategory,
                  department: prodDept,
                  price: Number(prodPrice) || 0,
                  shortSpec: prodSpec,
                  description: prodSpec,
                  material: '100% Cotton',
                  fitType: 'Boxy Fit',
                  imageUrl: prodImage,
                  colorName: 'Onyx Black',
                  colorHex: '#111111',
                  sizes: [
                    { size: 'M', stock: Number(prodStockM) || 0, chestOrWaistCm: 58, lengthCm: 71, shoulderOrOpeningCm: 50 },
                    { size: 'L', stock: Number(prodStockL) || 0, chestOrWaistCm: 61, lengthCm: 74, shoulderOrOpeningCm: 52 },
                  ],
                });
                setCreatingProd(false);
                if (res.ok) {
                  showToast('Produk baru berhasil ditambahkan!', 'success');
                  setProdName('');
                  setProdSpec('');
                  setProdImage('');
                  await loadAdminData();
                  await refreshCatalog();
                } else {
                  showToast(res.error || 'Gagal menambah produk.', 'error');
                }
              }}
              className="border border-hairline bg-surface-alt p-5 space-y-4"
            >
              <h3 className="text-[12px] font-semibold uppercase tracking-widest text-ink">
                + Tambah Produk Real Baru
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama Produk *"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                />
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as 'pria' | 'wanita' | 'unisex')}
                  className="h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                >
                  <option value="pria">Kategori: Pria</option>
                  <option value="wanita">Kategori: Wanita</option>
                  <option value="unisex">Kategori: Unisex</option>
                </select>
                <select
                  value={prodDept}
                  onChange={(e) =>
                    setProdDept(
                      e.target.value as
                        | 'Outerwear'
                        | 'T-Shirts & Tops'
                        | 'Pants & Trousers'
                        | 'Blazers & Tailoring'
                    )
                  }
                  className="h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="T-Shirts & Tops">T-Shirts &amp; Tops</option>
                  <option value="Pants & Trousers">Pants &amp; Trousers</option>
                  <option value="Blazers & Tailoring">Blazers &amp; Tailoring</option>
                </select>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="Harga (IDR) *"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                />
                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label className="h-10 px-3 bg-canvas border border-hairline text-[12px] font-semibold uppercase tracking-wider text-ink inline-flex items-center cursor-pointer hover:border-ink shrink-0">
                      <span>{uploadingImage ? 'Mengompres WebP...' : 'Upload Foto (Max 5MB)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingImage(true);
                          setUploadInfo(null);
                          const res = await uploadProductImageToSupabase(file);
                          setUploadingImage(false);
                          if (res.ok && res.url) {
                            setProdImage(res.url);
                            const origKb = Math.round((res.originalSize ?? 0) / 1024);
                            const compKb = Math.round((res.compressedSize ?? 0) / 1024);
                            setUploadInfo(`WebP siap (${origKb} KB → ${compKb} KB)`);
                            showToast('Gambar dikompres ke WebP & berhasil diupload!', 'success');
                          } else {
                            showToast(res.error || 'Gagal upload gambar.', 'error');
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Atau tempel URL Foto (https://...)"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="flex-1 h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                    />
                  </div>
                  {uploadInfo && (
                    <p className="text-[11px] text-emerald-700 font-medium">{uploadInfo}</p>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Spesifikasi Singkat"
                  value={prodSpec}
                  onChange={(e) => setProdSpec(e.target.value)}
                  className="h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Stok M"
                    value={prodStockM}
                    onChange={(e) => setProdStockM(e.target.value)}
                    className="w-1/2 h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Stok L"
                    value={prodStockL}
                    onChange={(e) => setProdStockL(e.target.value)}
                    className="w-1/2 h-10 px-3 bg-canvas border border-hairline text-[13px] text-ink"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creatingProd}
                className="px-6 py-2.5 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-400 cursor-pointer"
              >
                {creatingProd ? 'Menyimpan...' : 'Simpan Produk ke Supabase'}
              </button>
            </form>

            {adminProducts.length === 0 ? (
              <div className="border border-hairline bg-surface-alt p-10 text-center text-[13px] text-muted-slate">
                Belum ada produk di database. Gunakan form di atas untuk menambahkan produk real pertama.
              </div>
            ) : (
              adminProducts.map((prod) => (
              <div key={prod.id} className="border border-hairline bg-canvas p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-hairline">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-slate">
                      {prod.lookNumber} · {prod.department}
                    </span>
                    <h3 className="text-[16px] font-semibold text-ink">
                      {prod.name} — {formatIDR(prod.price)}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSoldOut(prod.id, Boolean(prod.isSoldOut))}
                    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                      prod.isSoldOut
                        ? 'bg-terracotta text-canvas border-terracotta'
                        : 'bg-surface-alt text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {prod.isSoldOut ? 'Status: Habis Duluan (Klik Ubah)' : 'Status: Tersedia'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {prod.variants.map((v) => {
                    const vid = v.id || `${prod.id}-${v.size}`;
                    const currentVal = stockEdits[vid] ?? v.stock;
                    return (
                      <div
                        key={vid}
                        className="border border-hairline bg-surface-alt p-3 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-[13px] font-semibold text-ink block">
                            Size {v.size}
                          </span>
                          <span className="text-[11px] text-muted-slate">{v.sku}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            value={currentVal}
                            onChange={(e) =>
                              setStockEdits((prev) => ({
                                ...prev,
                                [vid]: Math.max(0, Number(e.target.value)),
                              }))
                            }
                            className="w-16 h-8 px-2 bg-canvas border border-hairline text-[13px] text-center tabular-nums"
                          />
                          {v.id && (
                            <button
                              type="button"
                              onClick={() => handleSaveVariantStock(v.id!, prod.id)}
                              className="h-8 px-2.5 bg-ink text-canvas text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PROMO CODES */}
        {activeTab === 'promos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 border border-hairline bg-surface-alt p-6 space-y-4">
              <h2 className="font-editorial text-xl uppercase text-ink border-b border-hairline pb-3">
                Buat Kode Promo Baru
              </h2>
              <form onSubmit={handleCreatePromo} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1">
                    Kode Promo
                  </label>
                  <input
                    type="text"
                    required
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    placeholder="MISAL: DROP20"
                    className="w-full h-10 px-3 bg-canvas border border-hairline text-[13px] uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1">
                      Tipe
                    </label>
                    <select
                      value={newPromoType}
                      onChange={(e) =>
                        setNewPromoType(e.target.value as 'percentage' | 'fixed')
                      }
                      className="w-full h-10 px-2.5 bg-canvas border border-hairline text-[13px]"
                    >
                      <option value="percentage">Persentase (%)</option>
                      <option value="fixed">Nominal (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1">
                      Nilai
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newPromoValue}
                      onChange={(e) => setNewPromoValue(e.target.value)}
                      className="w-full h-10 px-3 bg-canvas border border-hairline text-[13px] tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1">
                    Min. Belanja (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newPromoMin}
                    onChange={(e) => setNewPromoMin(e.target.value)}
                    className="w-full h-10 px-3 bg-canvas border border-hairline text-[13px] tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-10 bg-ink text-canvas text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer"
                >
                  Simpan Promo
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {promos.map((p) => (
                <div
                  key={p.code}
                  className="border border-hairline bg-canvas p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-semibold text-ink text-[15px] tracking-wider">
                      {p.code}
                    </span>
                    <p className="text-[12px] text-muted-slate">
                      Diskon:{' '}
                      {p.discountType === 'percentage'
                        ? `${p.discountValue}%`
                        : formatIDR(p.discountValue)}{' '}
                      · Min. {formatIDR(p.minSubtotal)} · Dipakai {p.usedCount}×
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePromo(p.code, p.isActive)}
                    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                      p.isActive
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-surface-alt text-muted-slate border-hairline'
                    }`}
                  >
                    {p.isActive ? 'Aktif (Klik Nonaktifkan)' : 'Nonaktif'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
