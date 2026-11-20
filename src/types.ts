export type GenderCategory = 'pria' | 'wanita' | 'unisex';

export type DepartmentCategory =
  | 'Outerwear'
  | 'T-Shirts & Tops'
  | 'Pants & Trousers'
  | 'Blazers & Tailoring';

export type SilhouetteFit = 'Boxy Fit' | 'Relaxed Wide' | 'Cropped Hem' | 'Tailored Relaxed';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SizeMeasurement {
  size: string;
  stock: number;
  chestOrWaistCm: number;
  lengthCm: number;
  shoulderOrOpeningCm: number;
  measurementLabel: 'Lebar Dada' | 'Lingkar Pinggang';
  secondaryLabel: 'Bahu' | 'Leg Opening';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: GenderCategory;
  department: DepartmentCategory;
  lookNumber: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: 'NEW DROP' | 'EXCLUSIVE' | 'RESTOCK' | 'LIMITED RUN';
  rating: number;
  reviewCount: number;
  shortSpec: string;
  description: string;
  material: string;
  careInstructions: string[];
  fitType: SilhouetteFit;
  colors: ProductColor[];
  variants: SizeMeasurement[];
  images: string[];
  homeFeatured?: boolean;
  homeSpan?: 'spotlight-5' | 'spotlight-7' | 'col-4';
  isSoldOut?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  colorName: string;
  colorHex: string;
  size: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  maxStock: number;
  measurementSummary: string;
}

export interface ShippingAddress {
  fullName: string;
  whatsapp: string;
  email: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  notes?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  eta: string;
  fee: number;
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  shippingMethod: ShippingMethod;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  total: number;
  status: 'Menunggu Pembayaran' | 'Diproses Kurator';
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'catalog'; category?: 'all' | 'pria' | 'wanita' | 'outerwear' | 'tops' | 'pants'; search?: string }
  | { page: 'product'; slug: string }
  | { page: 'lookbook' }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'wishlist' }
  | { page: 'order-success'; orderNumber: string };
