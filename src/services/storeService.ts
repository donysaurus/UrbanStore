import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  CartItem,
  OrderRecord,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductColor,
  PromoCodeRecord,
  ShippingAddress,
  ShippingMethod,
  SizeMeasurement,
  UserProfile,
  UserRole,
} from '../types';

interface DbProductVariantRow {
  id: string;
  product_id: string;
  sku: string | null;
  size: string;
  stock: number;
  chest_or_waist_cm: number;
  length_cm: number;
  shoulder_or_opening_cm: number;
  measurement_label: 'Lebar Dada' | 'Lingkar Pinggang';
  secondary_label: 'Bahu' | 'Leg Opening';
  sort_order: number;
}

interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  category: Product['category'];
  department: Product['department'];
  look_number: string;
  price: number;
  original_price: number | null;
  discount_percent: number | null;
  badge: Product['badge'] | null;
  rating: number | string;
  review_count: number;
  short_spec: string;
  description: string;
  material: string;
  care_instructions: string[];
  fit_type: Product['fitType'];
  colors: ProductColor[];
  images: string[];
  home_featured: boolean;
  home_span: Product['homeSpan'] | null;
  is_sold_out: boolean;
  is_active: boolean;
  sort_order: number;
  product_variants?: DbProductVariantRow[];
}

function mapDbProduct(row: DbProductRow): Product {
  const variants: SizeMeasurement[] = (row.product_variants ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      sku: v.sku ?? undefined,
      size: v.size,
      stock: v.stock,
      chestOrWaistCm: v.chest_or_waist_cm,
      lengthCm: v.length_cm,
      shoulderOrOpeningCm: v.shoulder_or_opening_cm,
      measurementLabel: v.measurement_label,
      secondaryLabel: v.secondary_label,
    }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    department: row.department,
    lookNumber: row.look_number,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    discountPercent: row.discount_percent ?? undefined,
    badge: row.badge ?? undefined,
    rating: Number(row.rating ?? 5),
    reviewCount: row.review_count ?? 0,
    shortSpec: row.short_spec,
    description: row.description,
    material: row.material,
    careInstructions: row.care_instructions ?? [],
    fitType: row.fit_type,
    colors: row.colors ?? [],
    variants,
    images: row.images ?? [],
    homeFeatured: row.home_featured,
    homeSpan: row.home_span ?? undefined,
    isSoldOut: row.is_sold_out,
    isActive: row.is_active,
  };
}

export async function fetchCatalogFromSupabase(includeInactive = false): Promise<{
  ok: boolean;
  products: Product[];
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { ok: false, products: [], shippingMethods: [], paymentMethods: [], error: 'Not configured' };
  }

  let prodQuery = supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('sort_order', { ascending: true });

  if (!includeInactive) {
    prodQuery = prodQuery.eq('is_active', true);
  }

  const [prodRes, shipRes, payRes] = await Promise.all([
    prodQuery,
    supabase.from('shipping_methods').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('payment_methods').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
  ]);

  if (prodRes.error || shipRes.error || payRes.error) {
    return {
      ok: false,
      products: [],
      shippingMethods: [],
      paymentMethods: [],
      error: prodRes.error?.message || shipRes.error?.message || payRes.error?.message,
    };
  }

  const products = ((prodRes.data ?? []) as DbProductRow[]).map(mapDbProduct);
  const shippingMethods: ShippingMethod[] = (shipRes.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    eta: s.eta,
    fee: s.fee,
    freeThreshold: s.free_threshold,
    description: s.description,
  }));
  const paymentMethods: PaymentMethod[] = (payRes.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    badge: p.badge ?? undefined,
    maxOrderAmount: p.max_order_amount,
  }));

  return { ok: true, products, shippingMethods, paymentMethods };
}

export async function fetchProfileById(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name ?? '',
    phoneWhatsapp: data.phone_whatsapp ?? null,
    role: (data.role as UserRole) ?? 'pelanggan',
    defaultAddress: (data.default_address as ShippingAddress | null) ?? null,
    createdAt: data.created_at,
  };
}

export async function validatePromoViaSupabase(
  code: string,
  subtotal: number
): Promise<{ ok: boolean; code?: string; discount: number; message: string } | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc('validate_promo_code', {
    p_code: code,
    p_subtotal: Math.round(subtotal),
  });
  if (error || !data) return null;
  return data as { ok: boolean; code?: string; discount: number; message: string };
}

export async function createOrderViaSupabase(params: {
  customer: ShippingAddress;
  items: CartItem[];
  shippingMethodId: string;
  paymentMethodId: string;
  promoCode: string | null;
}): Promise<{ ok: true; order: OrderRecord } | { ok: false; error: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase belum dikonfigurasi.' };
  }

  const payloadItems = params.items.map((item) => ({
    product_id: item.productId,
    size: item.size,
    color_name: item.colorName,
    color_hex: item.colorHex,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc('create_order', {
    p_customer: params.customer,
    p_items: payloadItems,
    p_shipping_method_id: params.shippingMethodId,
    p_payment_method_id: params.paymentMethodId,
    p_promo_code: params.promoCode,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, order: data as OrderRecord };
}

export async function fetchOrderByNumberViaSupabase(orderNumber: string): Promise<OrderRecord | null> {
  if (!isSupabaseConfigured || !orderNumber) return null;
  const { data, error } = await supabase.rpc('get_order_by_number', {
    p_order_number: orderNumber,
  });
  if (error || !data) return null;
  return data as OrderRecord;
}

export async function fetchMyOrdersViaSupabase(userId: string): Promise<OrderRecord[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapDbOrderRow);
}

interface DbOrderItemRow {
  product_id: string;
  slug: string;
  product_name: string;
  image_url: string;
  color_name: string;
  color_hex: string;
  size: string;
  unit_price: number;
  original_price: number | null;
  quantity: number;
  measurement_summary: string;
}

interface DbOrderRow {
  id: string;
  order_number: string;
  created_at: string;
  user_id: string | null;
  shipping_address: ShippingAddress;
  subtotal: number;
  discount_amount: number;
  promo_code: string | null;
  shipping_method_id: string;
  shipping_method_name: string;
  shipping_fee: number;
  payment_method_id: string;
  payment_method_name: string;
  total: number;
  status: OrderStatus;
  tracking_number: string | null;
  order_items?: DbOrderItemRow[];
}

function mapDbOrderRow(row: DbOrderRow): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    userId: row.user_id,
    customer: row.shipping_address,
    items: (row.order_items ?? []).map((oi) => ({
      productId: oi.product_id,
      slug: oi.slug,
      name: oi.product_name,
      image: oi.image_url,
      colorName: oi.color_name,
      colorHex: oi.color_hex,
      size: oi.size,
      unitPrice: oi.unit_price,
      originalPrice: oi.original_price ?? undefined,
      quantity: oi.quantity,
      maxStock: oi.quantity,
      measurementSummary: oi.measurement_summary,
    })),
    subtotal: row.subtotal,
    discount: row.discount_amount,
    promoCode: row.promo_code,
    shippingMethod: {
      id: row.shipping_method_id,
      name: row.shipping_method_name,
      eta: '',
      fee: row.shipping_fee,
      description: '',
    },
    shippingFee: row.shipping_fee,
    paymentMethod: {
      id: row.payment_method_id,
      name: row.payment_method_name,
      subtitle: '',
    },
    total: row.total,
    status: row.status,
    trackingNumber: row.tracking_number,
  };
}

export async function subscribeNewsletterViaSupabase(
  email: string
): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { ok: true, message: 'Sip! Email lo udah masuk daftar early access drop tiap Jumat.' };
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.trim().toLowerCase() });

  if (error) {
    if (error.code === '23505') {
      return { ok: true, message: 'Email lo udah terdaftar sebelumnya. Aman!' };
    }
    return { ok: false, message: error.message };
  }

  return { ok: true, message: 'Sip! Email lo udah masuk daftar early access drop tiap Jumat.' };
}

export async function syncWishlistFromSupabase(
  userId: string,
  guestWishlistIds: string[]
): Promise<string[]> {
  if (!isSupabaseConfigured) return guestWishlistIds;

  const { data: existing, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId);

  if (error) return guestWishlistIds;

  const dbIds = (existing ?? []).map((r) => r.product_id as string);
  const toInsert = guestWishlistIds.filter((id) => !dbIds.includes(id));

  if (toInsert.length > 0) {
    await supabase
      .from('wishlists')
      .upsert(
        toInsert.map((product_id) => ({ user_id: userId, product_id })),
        { onConflict: 'user_id,product_id', ignoreDuplicates: true }
      );
  }

  return Array.from(new Set([...dbIds, ...guestWishlistIds]));
}

export async function toggleWishlistInSupabase(
  userId: string,
  productId: string,
  shouldExist: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;
  if (shouldExist) {
    await supabase
      .from('wishlists')
      .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' });
  } else {
    await supabase.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId);
  }
}

export async function syncCartFromSupabase(
  userId: string,
  guestCart: CartItem[],
  catalogProducts: Product[]
): Promise<CartItem[]> {
  if (!isSupabaseConfigured) return guestCart;

  // Merge guest items into server cart first
  if (guestCart.length > 0) {
    for (const item of guestCart) {
      await supabase.from('cart_items').upsert(
        {
          user_id: userId,
          product_id: item.productId,
          size: item.size,
          color_name: item.colorName,
          color_hex: item.colorHex,
          quantity: item.quantity,
        },
        { onConflict: 'user_id,product_id,size,color_name' }
      );
    }
  }

  const { data, error } = await supabase.from('cart_items').select('*').eq('user_id', userId);
  if (error || !data) return guestCart;

  const mapped: CartItem[] = [];
  for (const row of data) {
    const product = catalogProducts.find((p) => p.id === row.product_id);
    const variant = product?.variants.find((v) => v.size === row.size);
    if (!product || !variant || variant.stock <= 0 || product.isSoldOut) continue;

    mapped.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || '',
      colorName: row.color_name,
      colorHex: row.color_hex,
      size: row.size,
      unitPrice: product.price,
      originalPrice: product.originalPrice,
      quantity: Math.min(row.quantity, variant.stock),
      maxStock: variant.stock,
      measurementSummary: `${variant.measurementLabel}: ${variant.chestOrWaistCm} cm · Panjang: ${variant.lengthCm} cm`,
    });
  }

  return mapped;
}

export async function upsertCartItemInSupabase(userId: string, item: CartItem): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('cart_items').upsert(
    {
      user_id: userId,
      product_id: item.productId,
      size: item.size,
      color_name: item.colorName,
      color_hex: item.colorHex,
      quantity: item.quantity,
    },
    { onConflict: 'user_id,product_id,size,color_name' }
  );
}

export async function removeCartItemInSupabase(
  userId: string,
  productId: string,
  size: string,
  colorName: string
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size)
    .eq('color_name', colorName);
}

export async function clearCartInSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('cart_items').delete().eq('user_id', userId);
}

// ============================================================================
// ADMIN-ONLY OPERATIONS (Protected by Supabase RLS is_admin())
// ============================================================================

export async function adminFetchAllOrders(): Promise<{ orders: OrderRecord[]; error?: string }> {
  if (!isSupabaseConfigured) return { orders: [], error: 'Supabase belum terkonfigurasi.' };
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) return { orders: [], error: error.message };
  return { orders: (data ?? []).map(mapDbOrderRow) };
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber: string | null
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('orders')
    .update({ status, tracking_number: trackingNumber?.trim() || null })
    .eq('id', orderId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminUpdateVariantStock(
  variantId: string,
  stock: number,
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  const safeStock = Math.max(0, Math.floor(stock));
  const { error } = await supabase
    .from('product_variants')
    .update({ stock: safeStock })
    .eq('id', variantId);

  if (error) return { ok: false, error: error.message };

  // Re-evaluate product is_sold_out flag
  const { data: variants } = await supabase
    .from('product_variants')
    .select('stock')
    .eq('product_id', productId);

  const totalStock = (variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
  await supabase
    .from('products')
    .update({ is_sold_out: totalStock <= 0 })
    .eq('id', productId);

  return { ok: true };
}

export async function adminToggleProductSoldOut(
  productId: string,
  isSoldOut: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('products')
    .update({ is_sold_out: isSoldOut })
    .eq('id', productId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminFetchPromoCodes(): Promise<{ promos: PromoCodeRecord[]; error?: string }> {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { promos: [], error: error.message };

  return {
    promos: (data ?? []).map((p) => ({
      code: p.code,
      discountType: p.discount_type,
      discountValue: p.discount_value,
      minSubtotal: p.min_subtotal,
      maxDiscount: p.max_discount,
      usageLimit: p.usage_limit,
      usedCount: p.used_count,
      isActive: p.is_active,
      expiresAt: p.expires_at,
    })),
  };
}

export async function adminTogglePromoCode(
  code: string,
  isActive: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('promo_codes')
    .update({ is_active: isActive })
    .eq('code', code);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminCreatePromoCode(promo: {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal: number;
}): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('promo_codes').insert({
    code: promo.code.trim().toUpperCase(),
    discount_type: promo.discountType,
    discount_value: Math.max(1, Math.floor(promo.discountValue)),
    min_subtotal: Math.max(0, Math.floor(promo.minSubtotal)),
    is_active: true,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
