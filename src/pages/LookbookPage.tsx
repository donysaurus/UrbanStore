import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useStore } from '../context/StoreContext';
import { HERO_MEDIA, PRODUCTS } from '../data/products';
import { formatIDR } from '../utils/format';

export const LookbookPage: React.FC = () => {
  const { navigate } = useStore();

  const lookPairs = [
    {
      issue: 'LOOK N° 01 — MONOLITH CHORE',
      caption: 'Struktur twill 290 GSM berpadu siluet boxy yang tajam di atas kemeja kerah putih.',
      image: HERO_MEDIA.look01,
      product: PRODUCTS[0],
    },
    {
      issue: 'LOOK N° 02 — TROPICAL TAILORING',
      caption: 'Blazer potongan rileks tanpa furing berat. Effortless buat kerja maupun galeri.',
      image: PRODUCTS[1].images[0],
      product: PRODUCTS[1],
    },
    {
      issue: 'LOOK N° 07 — WASHED SLATE SET',
      caption: 'Proporsi wide-leg pleated dengan drape lurus menyentuh upper sneakers.',
      image: HERO_MEDIA.look07,
      product: PRODUCTS[2],
    },
    {
      issue: 'LOOK N° 12 — INDIGO WORKWEAR',
      caption: 'Denim 13.5 oz stone-wash yang terasa langsung nyaman dipakai dari hari pertama.',
      image: PRODUCTS[8].images[0],
      product: PRODUCTS[8],
    },
    {
      issue: 'LOOK N° 15 — SOFT FRENCH TERRY',
      caption: 'Katun 420 GSM dengan drop-shoulder yang menjaga bentuk bahu tetap clean.',
      image: PRODUCTS[10].images[0],
      product: PRODUCTS[10],
    },
    {
      issue: 'LOOK N° 22 — DOUBLE KNEE UTILITY',
      caption: 'Kanvas 12 oz garment-washed dengan detail jahitan arsip workwear.',
      image: PRODUCTS[11].images[0],
      product: PRODUCTS[11],
    },
  ];

  return (
    <div className="w-full bg-canvas">
      {/* Header */}
      <section className="border-b border-hairline py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-2">
              Issue Nº 24 · Spring Summer &apos;26
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl uppercase text-ink leading-none">
              Form, Shadow, &amp; <span className="italic">Movement</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[14px] text-muted-slate leading-relaxed">
              Eksplorasi proporsi boxy, pleats, dan material alami dalam satu kesatuan editorial
              lookbook. Klik tiap look buat langsung kepoin detail ukuran dalam cm.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Look Grid */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lookPairs.map((look) => (
            <article
              key={look.issue}
              onClick={() => navigate({ page: 'product', slug: look.product.slug })}
              className="group border border-hairline bg-canvas cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[3/4] bg-studio-gray overflow-hidden relative">
                <EditorialImage
                  src={look.image}
                  alt={look.issue}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-canvas/95 border border-hairline px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
                  {look.issue}
                </span>
              </div>

              <div className="p-5 border-t border-hairline space-y-3">
                <p className="text-[13px] text-muted-slate leading-relaxed">{look.caption}</p>
                <div className="pt-3 border-t border-hairline flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{look.product.name}</p>
                    <p className="text-[12px] text-muted-slate tabular-nums">
                      {formatIDR(look.product.price)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-ink group-hover:text-terracotta transition-colors">
                    Shop Look <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
