-- ============================================================================
-- URBANSTORE — SUPABASE POSTGRESQL SCHEMA, RLS, TRIGGERS & ATOMIC RPCs
-- Role Support: 'admin' & 'customer' (Email + Password Auth)
-- Execute this script in Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CUSTOM ENUM TYPES (Idempotent creation + safe migration from 'pelanggan' -> 'customer')
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'customer');
EXCEPTION WHEN duplicate_object THEN
  IF EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typname = 'user_role' AND e.enumlabel = 'pelanggan'
  ) THEN
    ALTER TYPE public.user_role RENAME VALUE 'pelanggan' TO 'customer';
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE public.gender_category AS ENUM ('pria', 'wanita', 'unisex');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.department_category AS ENUM (
    'Outerwear',
    'T-Shirts & Tops',
    'Pants & Trousers',
    'Blazers & Tailoring'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.silhouette_fit AS ENUM (
    'Boxy Fit',
    'Relaxed Wide',
    'Cropped Hem',
    'Tailored Relaxed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'Menunggu Pembayaran',
    'Diproses Kurator',
    'Dikirim',
    'Selesai',
    'Dibatalkan'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. SEQUENCE FOR COLLISION-FREE ORDER NUMBERS
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1001 INCREMENT BY 1;

-- 4. CORE TABLES

-- 4.1 User Profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT '',
  phone_whatsapp text,
  role public.user_role NOT NULL DEFAULT 'customer',
  default_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.2 Products
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY DEFAULT ('prod-' || substr(gen_random_uuid()::text, 1, 8)),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category public.gender_category NOT NULL,
  department public.department_category NOT NULL,
  look_number text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  original_price integer CHECK (original_price IS NULL OR original_price >= price),
  discount_percent integer CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),
  badge text CHECK (badge IS NULL OR badge IN ('NEW DROP', 'EXCLUSIVE', 'RESTOCK', 'LIMITED RUN')),
  rating numeric(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  short_spec text NOT NULL,
  description text NOT NULL,
  material text NOT NULL,
  care_instructions text[] NOT NULL DEFAULT '{}',
  fit_type public.silhouette_fit NOT NULL,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  images text[] NOT NULL DEFAULT '{}',
  home_featured boolean NOT NULL DEFAULT false,
  home_span text CHECK (home_span IS NULL OR home_span IN ('spotlight-5', 'spotlight-7', 'col-4')),
  is_sold_out boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.3 Product Variants (Size & Flat CM Measurements + Stock)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text UNIQUE,
  size text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  chest_or_waist_cm integer NOT NULL CHECK (chest_or_waist_cm > 0),
  length_cm integer NOT NULL CHECK (length_cm > 0),
  shoulder_or_opening_cm integer NOT NULL CHECK (shoulder_or_opening_cm > 0),
  measurement_label text NOT NULL CHECK (measurement_label IN ('Lebar Dada', 'Lingkar Pinggang')),
  secondary_label text NOT NULL CHECK (secondary_label IN ('Bahu', 'Leg Opening')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, size)
);

-- 4.4 Shipping Methods
CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id text PRIMARY KEY,
  name text NOT NULL,
  eta text NOT NULL,
  fee integer NOT NULL CHECK (fee >= 0),
  free_threshold integer CHECK (free_threshold IS NULL OR free_threshold >= 0),
  description text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

-- 4.5 Payment Methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id text PRIMARY KEY,
  name text NOT NULL,
  subtitle text NOT NULL,
  badge text,
  max_order_amount integer CHECK (max_order_amount IS NULL OR max_order_amount > 0),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

-- 4.6 Promo Codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  code text PRIMARY KEY,
  discount_type public.discount_type NOT NULL,
  discount_value integer NOT NULL CHECK (discount_value > 0),
  min_subtotal integer NOT NULL DEFAULT 0 CHECK (min_subtotal >= 0),
  max_discount integer CHECK (max_discount IS NULL OR max_discount > 0),
  usage_limit integer CHECK (usage_limit IS NULL OR usage_limit > 0),
  used_count integer NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4.7 Wishlists (Authenticated User Sync)
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- 4.8 Cart Items (Authenticated User Persistent Cart)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  color_name text NOT NULL,
  color_hex text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id, size, color_name)
);

-- 4.9 Orders (Supports both Authenticated Customer & Guest Checkout)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_whatsapp text NOT NULL,
  customer_email text NOT NULL,
  shipping_address jsonb NOT NULL,
  subtotal integer NOT NULL CHECK (subtotal >= 0),
  discount_amount integer NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  promo_code text REFERENCES public.promo_codes(code) ON DELETE SET NULL,
  shipping_method_id text NOT NULL REFERENCES public.shipping_methods(id),
  shipping_method_name text NOT NULL,
  shipping_fee integer NOT NULL CHECK (shipping_fee >= 0),
  payment_method_id text NOT NULL REFERENCES public.payment_methods(id),
  payment_method_name text NOT NULL,
  total integer NOT NULL CHECK (total >= 0),
  status public.order_status NOT NULL DEFAULT 'Menunggu Pembayaran',
  tracking_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4.10 Order Items (Price & Measurement Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id),
  slug text NOT NULL,
  product_name text NOT NULL,
  image_url text NOT NULL,
  color_name text NOT NULL,
  color_hex text NOT NULL,
  size text NOT NULL,
  unit_price integer NOT NULL CHECK (unit_price >= 0),
  original_price integer,
  quantity integer NOT NULL CHECK (quantity > 0),
  measurement_summary text NOT NULL
);

-- 4.11 Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4.12 Product Reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  size_purchased text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. INDEXES FOR QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category_active ON public.products(category, is_active);
CREATE INDEX IF NOT EXISTS idx_products_department ON public.products(department);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);

-- 6. HELPER FUNCTIONS & TRIGGERS

-- 6.1 Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_variants_updated_at ON public.product_variants;
CREATE TRIGGER trg_variants_updated_at BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON public.cart_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6.2 Role Check Helper (Used in RLS Policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 6.3 Auto-create Profile on Auth User Sign Up (Always assigns 'customer' by default)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_whatsapp, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'phone_whatsapp',
    'customer'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
      phone_whatsapp = COALESCE(EXCLUDED.phone_whatsapp, public.profiles.phone_whatsapp);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6.4 Prevent Privilege Escalation (Non-admin users cannot change their own role)
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Forbidden: hanya admin yang dapat mengubah role pengguna.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_escalation();

-- 7. SERVER-SIDE ATOMIC BUSINESS RPCs

-- 7.1 Validate Promo Code
CREATE OR REPLACE FUNCTION public.validate_promo_code(
  p_code text,
  p_subtotal integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo public.promo_codes%ROWTYPE;
  v_discount integer := 0;
  v_clean_code text := upper(trim(coalesce(p_code, '')));
BEGIN
  IF v_clean_code = '' THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Masukin kode promo dulu ya!', 'discount', 0);
  END IF;

  SELECT * INTO v_promo
  FROM public.promo_codes
  WHERE code = v_clean_code AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Kode promo nggak valid atau udah nonaktif nih.', 'discount', 0);
  END IF;

  IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Yah, masa berlaku kode promo ini udah habis.', 'discount', 0);
  END IF;

  IF v_promo.usage_limit IS NOT NULL AND v_promo.used_count >= v_promo.usage_limit THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Kuota pemakaian kode promo ini udah habis.', 'discount', 0);
  END IF;

  IF p_subtotal < v_promo.min_subtotal THEN
    RETURN jsonb_build_object(
      'ok', false,
      'message', format('Minimal belanja Rp%s buat pakai kode ini.', v_promo.min_subtotal),
      'discount', 0
    );
  END IF;

  IF v_promo.discount_type = 'percentage' THEN
    v_discount := round((p_subtotal::numeric * v_promo.discount_value) / 100.0)::integer;
  ELSE
    v_discount := v_promo.discount_value;
  END IF;

  IF v_promo.max_discount IS NOT NULL THEN
    v_discount := least(v_discount, v_promo.max_discount);
  END IF;
  v_discount := least(v_discount, greatest(p_subtotal, 0));

  RETURN jsonb_build_object(
    'ok', true,
    'code', v_promo.code,
    'discount', v_discount,
    'message', format('Kode %s aktif — hemat Rp%s!', v_promo.code, v_discount)
  );
END;
$$;

-- 7.2 Atomic Order Creation (Server-side Price, Stock Lock, Promo & Shipping Calculation)
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer jsonb,
  p_items jsonb,
  p_shipping_method_id text,
  p_payment_method_id text,
  p_promo_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_item jsonb;
  v_prod public.products%ROWTYPE;
  v_var public.product_variants%ROWTYPE;
  v_ship public.shipping_methods%ROWTYPE;
  v_pay public.payment_methods%ROWTYPE;
  v_promo_res jsonb;
  v_qty integer;
  v_subtotal integer := 0;
  v_discount integer := 0;
  v_applied_promo text := NULL;
  v_shipping_fee integer := 0;
  v_total integer := 0;
  v_order_id uuid;
  v_order_number text;
  v_order_status public.order_status;
  v_remaining_stock integer;
  v_items_out jsonb := '[]'::jsonb;
  v_summary text;
  v_img text;
BEGIN
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Keranjang belanja kosong.';
  END IF;

  -- Validate shipping & payment methods
  SELECT * INTO v_ship FROM public.shipping_methods WHERE id = p_shipping_method_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Metode pengiriman tidak valid.';
  END IF;

  SELECT * INTO v_pay FROM public.payment_methods WHERE id = p_payment_method_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Metode pembayaran tidak valid.';
  END IF;

  -- Lock variants & compute authoritative subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := coalesce((v_item ->> 'quantity')::integer, 0);
    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Kuantitas item harus lebih dari 0.';
    END IF;

    SELECT * INTO v_prod
    FROM public.products
    WHERE id = (v_item ->> 'product_id') AND is_active = true;

    IF NOT FOUND OR v_prod.is_sold_out THEN
      RAISE EXCEPTION 'Produk % sedang tidak tersedia atau sudah habis.', coalesce(v_item ->> 'product_id', '');
    END IF;

    SELECT * INTO v_var
    FROM public.product_variants
    WHERE product_id = v_prod.id AND size = (v_item ->> 'size')
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Ukuran % untuk % tidak ditemukan.', (v_item ->> 'size'), v_prod.name;
    END IF;

    IF v_var.stock < v_qty THEN
      RAISE EXCEPTION 'Stok % ukuran % tinggal % pcs.', v_prod.name, v_var.size, v_var.stock;
    END IF;

    -- Decrement stock atomically
    UPDATE public.product_variants
    SET stock = stock - v_qty
    WHERE id = v_var.id;

    -- Check remaining total stock for product
    SELECT coalesce(sum(stock), 0) INTO v_remaining_stock
    FROM public.product_variants
    WHERE product_id = v_prod.id;

    IF v_remaining_stock <= 0 THEN
      UPDATE public.products SET is_sold_out = true WHERE id = v_prod.id;
    END IF;

    v_subtotal := v_subtotal + (v_prod.price * v_qty);
  END LOOP;

  -- Validate promo server-side
  IF p_promo_code IS NOT NULL AND trim(p_promo_code) <> '' THEN
    v_promo_res := public.validate_promo_code(p_promo_code, v_subtotal);
    IF (v_promo_res ->> 'ok')::boolean THEN
      v_discount := (v_promo_res ->> 'discount')::integer;
      v_applied_promo := v_promo_res ->> 'code';
      UPDATE public.promo_codes SET used_count = used_count + 1 WHERE code = v_applied_promo;
    ELSE
      RAISE EXCEPTION '%', (v_promo_res ->> 'message');
    END IF;
  END IF;

  -- Compute shipping fee
  IF v_ship.free_threshold IS NOT NULL AND v_subtotal >= v_ship.free_threshold THEN
    v_shipping_fee := 0;
  ELSE
    v_shipping_fee := v_ship.fee;
  END IF;

  v_total := greatest(0, v_subtotal - v_discount + v_shipping_fee);

  IF v_pay.max_order_amount IS NOT NULL AND v_total > v_pay.max_order_amount THEN
    RAISE EXCEPTION 'Total pesanan melebihi batas maksimal untuk metode pembayaran %.', v_pay.name;
  END IF;

  v_order_status := CASE
    WHEN v_pay.id = 'cod' THEN 'Diproses Kurator'::public.order_status
    ELSE 'Menunggu Pembayaran'::public.order_status
  END;

  v_order_number := format(
    'US-%s-%s%s',
    extract(year FROM now())::integer,
    lpad(nextval('public.order_number_seq')::text, 4, '0'),
    upper(substr(md5(random()::text), 1, 2))
  );

  INSERT INTO public.orders (
    order_number,
    user_id,
    customer_name,
    customer_whatsapp,
    customer_email,
    shipping_address,
    subtotal,
    discount_amount,
    promo_code,
    shipping_method_id,
    shipping_method_name,
    shipping_fee,
    payment_method_id,
    payment_method_name,
    total,
    status
  ) VALUES (
    v_order_number,
    v_user_id,
    coalesce(p_customer ->> 'fullName', ''),
    coalesce(p_customer ->> 'whatsapp', ''),
    coalesce(p_customer ->> 'email', ''),
    p_customer,
    v_subtotal,
    v_discount,
    v_applied_promo,
    v_ship.id,
    v_ship.name,
    v_shipping_fee,
    v_pay.id,
    v_pay.name,
    v_total,
    v_order_status
  )
  RETURNING id INTO v_order_id;

  -- Insert order items snapshot
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item ->> 'quantity')::integer;
    SELECT * INTO v_prod FROM public.products WHERE id = (v_item ->> 'product_id');
    SELECT * INTO v_var FROM public.product_variants WHERE product_id = v_prod.id AND size = (v_item ->> 'size');
    v_img := coalesce(v_prod.images[1], '');
    v_summary := format('%s: %s cm · Panjang: %s cm', v_var.measurement_label, v_var.chest_or_waist_cm, v_var.length_cm);

    INSERT INTO public.order_items (
      order_id, product_id, slug, product_name, image_url,
      color_name, color_hex, size, unit_price, original_price,
      quantity, measurement_summary
    ) VALUES (
      v_order_id, v_prod.id, v_prod.slug, v_prod.name, v_img,
      coalesce(v_item ->> 'color_name', 'Default'),
      coalesce(v_item ->> 'color_hex', '#111111'),
      v_var.size, v_prod.price, v_prod.original_price,
      v_qty, v_summary
    );

    v_items_out := v_items_out || jsonb_build_object(
      'productId', v_prod.id,
      'slug', v_prod.slug,
      'name', v_prod.name,
      'image', v_img,
      'colorName', coalesce(v_item ->> 'color_name', 'Default'),
      'colorHex', coalesce(v_item ->> 'color_hex', '#111111'),
      'size', v_var.size,
      'unitPrice', v_prod.price,
      'originalPrice', v_prod.original_price,
      'quantity', v_qty,
      'maxStock', v_var.stock,
      'measurementSummary', v_summary
    );
  END LOOP;

  -- Clear persistent cart if authenticated
  IF v_user_id IS NOT NULL THEN
    DELETE FROM public.cart_items WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'orderNumber', v_order_number,
    'createdAt', now(),
    'customer', p_customer,
    'items', v_items_out,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'promoCode', v_applied_promo,
    'shippingMethod', jsonb_build_object(
      'id', v_ship.id, 'name', v_ship.name, 'eta', v_ship.eta,
      'fee', v_ship.fee, 'description', v_ship.description
    ),
    'shippingFee', v_shipping_fee,
    'paymentMethod', jsonb_build_object(
      'id', v_pay.id, 'name', v_pay.name, 'subtitle', v_pay.subtitle, 'badge', v_pay.badge
    ),
    'total', v_total,
    'status', v_order_status::text
  );
END;
$$;

-- 7.3 Guest & Customer Order Lookup by Exact Order Number
CREATE OR REPLACE FUNCTION public.get_order_by_number(p_order_number text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_ship public.shipping_methods%ROWTYPE;
  v_pay public.payment_methods%ROWTYPE;
  v_items jsonb;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE order_number = p_order_number;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_ship FROM public.shipping_methods WHERE id = v_order.shipping_method_id;
  SELECT * INTO v_pay FROM public.payment_methods WHERE id = v_order.payment_method_id;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'productId', oi.product_id,
    'slug', oi.slug,
    'name', oi.product_name,
    'image', oi.image_url,
    'colorName', oi.color_name,
    'colorHex', oi.color_hex,
    'size', oi.size,
    'unitPrice', oi.unit_price,
    'originalPrice', oi.original_price,
    'quantity', oi.quantity,
    'maxStock', oi.quantity,
    'measurementSummary', oi.measurement_summary
  )), '[]'::jsonb) INTO v_items
  FROM public.order_items oi
  WHERE oi.order_id = v_order.id;

  RETURN jsonb_build_object(
    'orderNumber', v_order.order_number,
    'createdAt', v_order.created_at,
    'customer', v_order.shipping_address,
    'items', v_items,
    'subtotal', v_order.subtotal,
    'discount', v_order.discount_amount,
    'promoCode', v_order.promo_code,
    'shippingMethod', jsonb_build_object(
      'id', v_ship.id, 'name', coalesce(v_ship.name, v_order.shipping_method_name),
      'eta', coalesce(v_ship.eta, ''), 'fee', coalesce(v_ship.fee, v_order.shipping_fee),
      'description', coalesce(v_ship.description, '')
    ),
    'shippingFee', v_order.shipping_fee,
    'paymentMethod', jsonb_build_object(
      'id', v_pay.id, 'name', coalesce(v_pay.name, v_order.payment_method_name),
      'subtitle', coalesce(v_pay.subtitle, ''), 'badge', v_pay.badge
    ),
    'total', v_order.total,
    'status', v_order.status::text,
    'trackingNumber', v_order.tracking_number
  );
END;
$$;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Products & Variants (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
CREATE POLICY "Public can view variants" ON public.product_variants
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage variants" ON public.product_variants;
CREATE POLICY "Admins manage variants" ON public.product_variants
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Shipping & Payment Methods (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public view shipping methods" ON public.shipping_methods;
CREATE POLICY "Public view shipping methods" ON public.shipping_methods
FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage shipping methods" ON public.shipping_methods;
CREATE POLICY "Admins manage shipping methods" ON public.shipping_methods
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public view payment methods" ON public.payment_methods;
CREATE POLICY "Public view payment methods" ON public.payment_methods
FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage payment methods" ON public.payment_methods;
CREATE POLICY "Admins manage payment methods" ON public.payment_methods
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Promo Codes (Admin manages; customers validate via RPC)
DROP POLICY IF EXISTS "Admins manage promo codes" ON public.promo_codes;
CREATE POLICY "Admins manage promo codes" ON public.promo_codes
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Wishlists (Own user only)
DROP POLICY IF EXISTS "Users manage own wishlists" ON public.wishlists;
CREATE POLICY "Users manage own wishlists" ON public.wishlists
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Cart Items (Own user only)
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_items;
CREATE POLICY "Users manage own cart" ON public.cart_items
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders & Order Items (Customer views own, Admin views & updates all; creation via create_order RPC)
DROP POLICY IF EXISTS "Users view own orders and admins view all" ON public.orders;
CREATE POLICY "Users view own orders and admins view all" ON public.orders
FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders" ON public.orders
FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users view own order items and admins view all" ON public.order_items;
CREATE POLICY "Users view own order items and admins view all" ON public.order_items
FOR SELECT USING (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  )
);

-- Newsletter (Public insert, Admin read)
DROP POLICY IF EXISTS "Public subscribe newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public subscribe newsletter" ON public.newsletter_subscribers
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins view newsletter subscribers" ON public.newsletter_subscribers
FOR SELECT USING (public.is_admin());

-- Product Reviews (Public read, Authenticated insert own, Admin manage)
DROP POLICY IF EXISTS "Public view reviews" ON public.product_reviews;
CREATE POLICY "Public view reviews" ON public.product_reviews
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users create reviews" ON public.product_reviews;
CREATE POLICY "Authenticated users create reviews" ON public.product_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage reviews" ON public.product_reviews;
CREATE POLICY "Admins manage reviews" ON public.product_reviews
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9. GRANT SCHEMA, TABLE & RPC PRIVILEGES (Required alongside RLS)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public catalog & reference tables (RLS restricts writes to admin)
GRANT SELECT ON public.products, public.product_variants, public.shipping_methods, public.payment_methods, public.product_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products, public.product_variants, public.shipping_methods, public.payment_methods, public.promo_codes, public.product_reviews TO authenticated;

-- Authenticated user tables (RLS restricts to own rows or admin)
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists, public.cart_items TO authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;

-- Newsletter (public insert, admin select via RLS)
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;

-- RPC functions
GRANT EXECUTE ON FUNCTION public.validate_promo_code(text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(jsonb, jsonb, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_by_number(text) TO anon, authenticated;
