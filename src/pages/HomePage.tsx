import React, { useState } from 'react';
import { ArrowUpRight, Minus, Plus, Ruler } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { HERO_MEDIA, PRODUCTS } from '../data/products';

type HomeFilter = 'all' | 'pria' | 'wanita';

export const HomePage: React.FC = () => {
  const { navigate, setSizeGuideOpen, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<HomeFilter>('all');
  const [openAccordion, setOpenAccordion] = useState<number>(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredProducts = PRODUCTS.filter((p) => p.homeFeatured);
  const visibleProducts =
    activeTab === 'all'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === activeTab);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Masukin alamat email yang valid dulu ya!', 'error');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast('Sip! Email lo udah masuk daftar early access drop tiap Jumat.', 'success');
  };

  return (
    <div className="flex flex-col w-full bg-canvas">
      {/* Slim Curated Drop Notice */}
      <div className="w-full bg-studio-gray px-4 lg:px-12 py-2.5 border-b border-hairline flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-ink min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap">
            Drop 04 · Spring Summer &apos;26 Live
          </span>
          <span className="hidden md:inline text-[12px] text-muted-slate truncate">
            · Gratis ongkir se-Jabodetabek min. belanja Rp499.000
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-slate shrink-0">
          <span className="text-ink hidden sm:inline">ID / IDR (Rp)</span>
          <span className="hidden sm:inline">·</span>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="hover:text-ink transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Size Guide Visual <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Editorial Asymmetric Hero */}
      <section className="relative w-full bg-canvas overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28 border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 relative">
          {/* Left Tilted Look Card (Desktop) */}
          <button
            type="button"
            onClick={() => navigate({ page: 'product', slug: 'oversized-cotton-work-shirt' })}
            className="hidden lg:block absolute left-6 xl:left-10 top-4 w-[240px] xl:w-[270px] z-10 text-left -rotate-6 hover:-rotate-3 transition-transform duration-300 cursor-pointer group"
          >
            <div className="bg-studio-gray p-2 border border-hairline">
              <div className="w-full aspect-[3/4] bg-studio-gray overflow-hidden">
                <EditorialImage
                  src={HERO_MEDIA.look01}
                  alt="Look Nº 01 Chore Overshirt"
                  priority
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-2 px-1 flex justify-between items-center text-ink">
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  Look Nº 01
                </span>
                <span className="text-[12px] text-muted-slate">Chore Overshirt</span>
              </div>
            </div>
          </button>

          {/* Right Tilted Look Card (Desktop) */}
          <button
            type="button"
            onClick={() => navigate({ page: 'product', slug: 'wide-leg-pleated-trouser' })}
            className="hidden lg:block absolute right-6 xl:right-10 bottom-0 w-[240px] xl:w-[270px] z-10 text-left rotate-6 hover:rotate-3 transition-transform duration-300 cursor-pointer group"
          >
            <div className="bg-studio-gray p-2 border border-hairline">
              <div className="w-full aspect-[3/4] bg-studio-gray overflow-hidden">
                <EditorialImage
                  src={HERO_MEDIA.look07}
                  alt="Look Nº 07 Washed Slate Set"
                  priority
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-2 px-1 flex justify-between items-center text-ink">
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  Look Nº 07
                </span>
                <span className="text-[12px] text-muted-slate">Washed Slate Set</span>
              </div>
            </div>
          </button>

          {/* Central Typographic Statement (Safely padded away from side look cards on lg+) */}
          <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto lg:px-[240px] xl:px-[250px] py-4 lg:py-10">
            <div className="inline-flex items-center gap-2 mb-5 border border-hairline px-3 py-1 bg-surface-alt">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                Curated Fashion System
              </span>
            </div>

            <h1 className="font-editorial text-[46px] leading-[48px] sm:text-[64px] sm:leading-[66px] lg:text-[82px] lg:leading-[84px] tracking-tight uppercase text-ink font-normal [text-wrap:balance]">
              FIT CHECK <br />
              <span className="italic font-normal">STARTS</span> HERE
              <span className="text-terracotta">.</span>
            </h1>

            {/* Mobile/Tablet Collage Preview */}
            <div className="lg:hidden w-full max-w-md my-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate({ page: 'product', slug: 'oversized-cotton-work-shirt' })}
                className="bg-studio-gray p-1.5 border border-hairline -rotate-2 text-left"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <EditorialImage src={HERO_MEDIA.look01} alt="Look Nº 01 Chore Overshirt" priority />
                </div>
                <div className="pt-1.5 flex justify-between text-[10px] font-semibold uppercase text-ink">
                  <span>Look Nº 01</span>
                  <span className="text-muted-slate font-normal">Overshirt</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => navigate({ page: 'product', slug: 'wide-leg-pleated-trouser' })}
                className="bg-studio-gray p-1.5 border border-hairline rotate-2 text-left"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <EditorialImage src={HERO_MEDIA.look07} alt="Look Nº 07 Washed Slate Set" priority />
                </div>
                <div className="pt-1.5 flex justify-between text-[10px] font-semibold uppercase text-ink">
                  <span>Look Nº 07</span>
                  <span className="text-muted-slate font-normal">Slate Set</span>
                </div>
              </button>
            </div>

            <p className="text-[15px] sm:text-[16px] leading-relaxed text-muted-slate max-w-lg mt-6 mb-8">
              Kurasi outfit paling masuk buat gaya lo. Size jelas dalam sentimeter, checkout sat-set
              anti drama.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate({ page: 'catalog', category: 'all' })}
                className="w-full sm:w-auto px-8 py-4 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Kepoin Koleksinya</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <a
                href="#categories"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-ink text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors inline-flex items-center justify-center whitespace-nowrap"
              >
                Browse Categories
              </a>
            </div>

            {/* Metric Micro-Strip */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-12 pt-8 border-t border-hairline w-full max-w-lg text-left">
              <div>
                <p className="text-[14px] font-bold text-ink tabular-nums">100%</p>
                <p className="text-[12px] text-muted-slate">Terkurasi ketat</p>
              </div>
              <div>
                <p className="text-[14px] font-bold text-ink tabular-nums">±1 CM</p>
                <p className="text-[12px] text-muted-slate">Akurasi ukuran</p>
              </div>
              <div>
                <p className="text-[14px] font-bold text-ink tabular-nums">&lt; 2 MIN</p>
                <p className="text-[12px] text-muted-slate">Checkout instan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Browse by Categories */}
      <section id="categories" className="w-full bg-canvas py-16 border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="flex items-baseline justify-between mb-10 border-b border-hairline pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                Kurasi Departemen
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
                Browse by Categories
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="text-[12px] font-semibold uppercase tracking-widest text-ink hover:text-terracotta transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1: Pria */}
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'pria' })}
              className="group block text-left cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] bg-studio-gray overflow-hidden border border-hairline mb-3">
                <EditorialImage
                  src={HERO_MEDIA.catPria}
                  alt="Koleksi Pria UrbanStore"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 bg-canvas px-2.5 py-1 text-ink text-[11px] font-semibold uppercase tracking-wider border border-hairline">
                  Nº 01
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h3 className="font-editorial text-xl uppercase text-ink group-hover:text-terracotta transition-colors">
                    Pria
                  </h3>
                  <p className="text-[12px] text-muted-slate mt-0.5">
                    Oversized silhouettes, work shirts &amp; pleated trousers
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-ink uppercase tracking-widest shrink-0 ml-2">
                  Lihat Semua ↗
                </span>
              </div>
            </button>

            {/* Category 2: Wanita */}
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'wanita' })}
              className="group block text-left cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] bg-studio-gray overflow-hidden border border-hairline mb-3">
                <EditorialImage
                  src={HERO_MEDIA.catWanita}
                  alt="Koleksi Wanita UrbanStore"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 bg-canvas px-2.5 py-1 text-ink text-[11px] font-semibold uppercase tracking-wider border border-hairline">
                  Nº 02
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h3 className="font-editorial text-xl uppercase text-ink group-hover:text-terracotta transition-colors">
                    Wanita
                  </h3>
                  <p className="text-[12px] text-muted-slate mt-0.5">
                    Structured essentials, relaxed blazers &amp; fluid drape cuts
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-ink uppercase tracking-widest shrink-0 ml-2">
                  Lihat Semua ↗
                </span>
              </div>
            </button>

            {/* Category 3: Outerwear & Essentials */}
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'outerwear' })}
              className="group block text-left cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] bg-studio-gray overflow-hidden border border-hairline mb-3">
                <EditorialImage
                  src={HERO_MEDIA.catOuterwear}
                  alt="Outerwear & Essentials UrbanStore"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 bg-canvas px-2.5 py-1 text-ink text-[11px] font-semibold uppercase tracking-wider border border-hairline">
                  Nº 03
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h3 className="font-editorial text-xl uppercase text-ink group-hover:text-terracotta transition-colors">
                    Outerwear &amp; Essentials
                  </h3>
                  <p className="text-[12px] text-muted-slate mt-0.5">
                    Utility jackets, chore coats &amp; heavyweight cotton tees
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-ink uppercase tracking-widest shrink-0 ml-2">
                  Lihat Semua ↗
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Size Confidence Banner */}
      <section className="w-full bg-surface-alt py-10 border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <span className="font-editorial text-2xl uppercase text-ink whitespace-nowrap">
              Biar Nggak Salah Ukuran, Cek Size Guide Dulu.
            </span>
            <p className="text-[14px] text-muted-slate max-w-md">
              Tiap helai diukur manual sentimeter demi sentimeter. Nggak ada tebak-tebakan, siluet
              boxy &amp; loose pas sejak unboxing pertama.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="px-5 py-3 bg-canvas border border-ink text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <Ruler className="w-4 h-4" />
            <span>Buka Panduan Size Guide (CM)</span>
          </button>
        </div>
      </section>

      {/* Section: New Arrival (Asymmetric Lookbook Grid) */}
      <section className="w-full bg-canvas py-16 border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-hairline pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                Kurasi Terkini 2026
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl uppercase text-ink">
                New Arrival
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {(
                [
                  { id: 'all', label: `Semua (${featuredProducts.length})` },
                  {
                    id: 'pria',
                    label: `Pria (${featuredProducts.filter((p) => p.category === 'pria').length})`,
                  },
                  {
                    id: 'wanita',
                    label: `Wanita (${featuredProducts.filter((p) => p.category === 'wanita').length})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-ink text-canvas'
                      : 'bg-canvas border border-hairline text-muted-slate hover:text-ink hover:border-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {visibleProducts.map((product) => {
              const colSpanClass =
                activeTab === 'all' && product.homeSpan === 'spotlight-5'
                  ? 'lg:col-span-5'
                  : activeTab === 'all' && product.homeSpan === 'spotlight-7'
                    ? 'lg:col-span-7'
                    : 'lg:col-span-4';

              const aspectClass =
                activeTab === 'all' && product.homeSpan === 'spotlight-7'
                  ? 'aspect-[4/5] lg:aspect-[16/11]'
                  : 'aspect-[3/4]';

              return (
                <div key={product.id} className={colSpanClass}>
                  <ProductCard product={product} aspectClass={aspectClass} />
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted-slate">
              Menampilkan {visibleProducts.length} kurasi highlight dari {PRODUCTS.length} koleksi
              aktif.
            </p>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="px-8 py-3.5 bg-canvas border border-ink text-ink text-[12px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-canvas transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Kepoin Semua Koleksi ({PRODUCTS.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Section: Editorial Brand Pillars & Accordion */}
      <section className="w-full bg-studio-gray py-16 border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Visual Frame */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full aspect-[4/3] bg-studio-gray overflow-hidden border border-hairline">
                <EditorialImage
                  src={HERO_MEDIA.rackEditorial}
                  alt="Kurasi Pakaian Minimalis UrbanStore"
                />
                <div className="absolute bottom-4 left-4 bg-canvas/95 p-5 border border-hairline max-w-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-1">
                    Pilar Kualitas
                  </span>
                  <p className="font-editorial text-lg uppercase text-ink leading-snug">
                    Bahan Berkualitas. Jahitan Presisi.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Accordion Pillars */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate block mb-1">
                  Standardisasi Kami
                </span>
                <h2 className="font-editorial text-3xl uppercase text-ink mb-3">
                  Kenapa Harus Belanja di UrbanStore?
                </h2>
                <p className="text-[14px] text-muted-slate leading-relaxed">
                  Kami pangkas ribuan katalog jadi kurasi yang bener-bener masuk buat gaya lo. No
                  generic items, bahan berkelas, cuttingan paten.
                </p>
              </div>

              <div className="border-t border-hairline">
                {[
                  {
                    title: '1. Transparansi Dimensi (CM)',
                    body: 'Lebar dada, panjang baju, bukaan lengan, hingga leg opening celana diukur manual. Nggak pakai perkiraan S/M/L universal yang bikin ragu.',
                  },
                  {
                    title: '2. Checkout Sat-Set Tanpa Wajib Akun',
                    body: 'Nggak perlu bikin password ribet. Cukup isi nama penerima, nomor WhatsApp buat info resi, dan alamat lengkap. Beres dalam 3 langkah.',
                  },
                  {
                    title: '3. Garansi Tukar Size 7 Hari',
                    body: 'Kalau potongan kurang klik di badan, tukar size dalam 7 hari kerja dengan proses pickup kurir yang ringkas.',
                  },
                ].map((item, idx) => {
                  const isOpen = openAccordion === idx;
                  return (
                    <div key={item.title} className="border-b border-hairline">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                        className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
                      >
                        <span className="text-[14px] font-semibold uppercase tracking-wide text-ink">
                          {item.title}
                        </span>
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-ink shrink-0" />
                        ) : (
                          <Plus className="w-4 h-4 text-ink shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="text-[13px] text-muted-slate pb-4 leading-relaxed">
                          {item.body}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Bar */}
      <section className="w-full bg-canvas py-12">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-1">
              Akses Drop Eksklusif
            </span>
            <h3 className="font-editorial text-2xl uppercase text-ink">
              Daftar Newsletter UrbanStore.
            </h3>
            <p className="text-[13px] text-muted-slate mt-1">
              Biar nggak ketinggalan drop terbaru tiap Jumat jam 19:00 WIB langsung ke inbox lo.
            </p>
          </div>

          {subscribed ? (
            <div className="px-6 py-4 bg-surface-alt border border-ink text-[13px] font-medium text-ink">
              Udah terdaftar! Cek inbox lo tiap Jumat sore buat link early access.
            </div>
          ) : (
            <form
              onSubmit={handleNewsletter}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email lo..."
                className="w-full sm:w-80 px-4 py-3.5 bg-canvas border border-hairline text-[14px] text-ink placeholder:text-muted-slate focus:outline-none focus:border-ink"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Langganan</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
