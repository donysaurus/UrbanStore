-- ============================================================================
-- URBANSTORE — INITIAL REFERENCE SEED DATA
-- Produk dummy dihapus: Admin menambahkan produk real langsung dari /admin.
-- Jalankan setelah supabase/schema.sql di Supabase SQL Editor.
-- ============================================================================

-- 1. SHIPPING METHODS
INSERT INTO public.shipping_methods (id, name, eta, fee, free_threshold, description, is_active, sort_order)
VALUES
  ('reguler', 'Kurir Reguler (JNE / J&T)', 'Estimasi 2–3 hari kerja', 18000, 499000, 'Gratis ongkir otomatis untuk total belanja di atas Rp499.000.', true, 1),
  ('express', 'SiCepat Best / Next Day', 'Estimasi 1–2 hari kerja', 29000, NULL, 'Prioritas kirim cepat dengan tracking real-time via WhatsApp.', true, 2),
  ('instant', 'Instant Same-Day (Jabodetabek)', 'Tiba hari ini (order sebelum 15:00 WIB)', 45000, NULL, 'Dikirim langsung dari studio gudang Jakarta Selatan.', true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  eta = EXCLUDED.eta,
  fee = EXCLUDED.fee,
  free_threshold = EXCLUDED.free_threshold,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

-- 2. PAYMENT METHODS
INSERT INTO public.payment_methods (id, name, subtitle, badge, max_order_amount, is_active, sort_order)
VALUES
  ('qris', 'QRIS Instan', 'Bayar sat-set dari m-Banking, GoPay, OVO, Dana, atau ShopeePay', 'Otomatis Verifikasi', NULL, true, 1),
  ('va', 'Virtual Account (BCA / Mandiri / BNI)', 'Transfer langsung tanpa perlu upload bukti bayar manual', NULL, NULL, true, 2),
  ('cod', 'COD (Bayar di Tempat)', 'Bayar tunai ke kurir saat paket sampai (maks. order Rp1.500.000)', NULL, 1500000, true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  badge = EXCLUDED.badge,
  max_order_amount = EXCLUDED.max_order_amount,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

-- 3. PROMO CODES
INSERT INTO public.promo_codes (code, discount_type, discount_value, min_subtotal, max_discount, usage_limit, is_active)
VALUES
  ('URBAN10', 'percentage', 10, 0, NULL, NULL, true),
  ('HEMAT50', 'fixed', 50000, 350000, NULL, NULL, true)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  min_subtotal = EXCLUDED.min_subtotal,
  max_discount = EXCLUDED.max_discount,
  is_active = EXCLUDED.is_active;
