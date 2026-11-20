import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { formatIDR } from '../utils/format';
import { EditorialImage } from './EditorialImage';

interface ProductCardProps {
  product: Product;
  aspectClass?: string;
  showSpecFooter?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectClass = 'aspect-[3/4]',
  showSpecFooter = true,
}) => {
  const { navigate, addToCart, wishlistIds, toggleWishlist } = useStore();
  const isWishlisted = wishlistIds.includes(product.id);
  const availableVariants = product.variants.filter((v) => v.stock > 0);
  const isAllSoldOut = product.isSoldOut || availableVariants.length === 0;
  const defaultVariant = product.variants[1] || product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    const variant = product.variants.find((v) => v.size === size);
    if (!variant || variant.stock <= 0) return;

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      colorName: product.colors[0].name,
      colorHex: product.colors[0].hex,
      size: variant.size,
      unitPrice: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      maxStock: variant.stock,
      measurementSummary: `${variant.measurementLabel}: ${variant.chestOrWaistCm} cm · Panjang: ${variant.lengthCm} cm`,
    });
  };

  return (
    <article
      onClick={() => navigate({ page: 'product', slug: product.slug })}
      className={`group flex flex-col justify-between bg-canvas border border-hairline cursor-pointer transition-colors hover:border-ink/40 ${
        isAllSoldOut ? 'opacity-90' : ''
      }`}
    >
      {/* Image Frame */}
      <div className={`relative w-full ${aspectClass} bg-studio-gray overflow-hidden`}>
        <EditorialImage
          src={product.images[0]}
          alt={product.name}
          className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
            isAllSoldOut ? 'grayscale-[35%]' : ''
          }`}
        />

        {/* Top-Left Tag (Max 1 crisp tag or discount indicator) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {isAllSoldOut ? (
            <span className="bg-ink text-canvas px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
              Habis Duluan
            </span>
          ) : product.discountPercent ? (
            <span className="bg-terracotta text-canvas px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider tabular-nums">
              -{product.discountPercent}%
            </span>
          ) : product.badge ? (
            <span className="bg-canvas text-ink border border-hairline px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Wishlist Toggle */}
        <button
          type="button"
          aria-label={isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 bg-canvas/90 border border-hairline flex items-center justify-center transition-colors cursor-pointer ${
            isWishlisted ? 'text-terracotta border-terracotta' : 'text-ink hover:text-terracotta'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-terracotta' : ''}`} />
        </button>

        {/* Restock Overlay or Quick Add Bar */}
        {isAllSoldOut ? (
          <div className="absolute inset-0 bg-canvas/35 flex items-center justify-center pointer-events-none">
            <span className="bg-ink text-canvas px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest">
              Restock Segera
            </span>
          </div>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 bg-canvas/95 border-t border-hairline px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-between gap-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-slate whitespace-nowrap">
              Tambah Cepat:
            </span>
            <div className="flex items-center gap-1">
              {product.variants.map((v) => {
                const disabled = v.stock <= 0;
                return (
                  <button
                    key={v.size}
                    type="button"
                    disabled={disabled}
                    onClick={(e) => handleQuickAdd(e, v.size)}
                    className={`min-w-[28px] h-7 px-1.5 text-[11px] font-semibold border transition-colors ${
                      disabled
                        ? 'border-hairline text-muted-slate/40 line-through cursor-not-allowed'
                        : 'border-hairline text-ink hover:bg-ink hover:text-canvas hover:border-ink cursor-pointer'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Metadata Stack */}
      <div className="p-4 flex flex-col gap-1.5 border-t border-hairline bg-canvas flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-slate mb-1">
            <span>
              {product.category.toUpperCase()} · {product.lookNumber}
            </span>
            <span className="inline-flex items-center gap-1 text-ink tabular-nums">
              <Star className="w-3 h-3 fill-terracotta text-terracotta" />
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>

          <h3
            className={`text-[15px] font-semibold tracking-tight leading-snug group-hover:text-muted-slate transition-colors ${
              isAllSoldOut ? 'text-muted-slate line-through' : 'text-ink'
            }`}
          >
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-1 tabular-nums">
            <span
              className={`text-[14px] font-semibold ${
                isAllSoldOut ? 'text-muted-slate' : 'text-ink'
              }`}
            >
              {formatIDR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[12px] text-muted-slate line-through">
                {formatIDR(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && !isAllSoldOut && (
              <span className="text-[11px] font-semibold text-terracotta">
                Hemat {formatIDR(product.originalPrice - product.price)}
              </span>
            )}
          </div>
        </div>

        {showSpecFooter && (
          <div className="pt-2.5 mt-2 border-t border-hairline flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className="w-3.5 h-3.5 border border-hairline inline-block"
                />
              ))}
            </div>
            {defaultVariant && (
              <span className="text-[11px] font-medium text-muted-slate uppercase tracking-wider tabular-nums">
                {defaultVariant.measurementLabel}: {defaultVariant.chestOrWaistCm}cm
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
