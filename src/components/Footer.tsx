import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HERO_MEDIA } from '../data/products';
import { EditorialImage } from './EditorialImage';

export const Footer: React.FC = () => {
  const { navigate, setSizeGuideOpen, showToast } = useStore();

  return (
    <footer className="w-full border-t border-hairline bg-canvas">
      <div className="flex flex-col lg:flex-row w-full items-stretch">
        {/* Left Navigation & Brand Info */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-between bg-canvas">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-14">
            <div>
              <h4 className="text-[12px] font-semibold uppercase text-ink mb-4 tracking-widest">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2.5 text-[13px] text-muted-slate">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'home' })}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'catalog', category: 'pria' })}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Koleksi Pria
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'catalog', category: 'wanita' })}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Koleksi Wanita
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'lookbook' })}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Lookbook
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold uppercase text-ink mb-4 tracking-widest">
                Info & Bantuan
              </h4>
              <ul className="flex flex-col gap-2.5 text-[13px] text-muted-slate">
                <li>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Size Guide (CM)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'cart' })}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Keranjang Belanja
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Tukar size bebas ribet 7 hari kerja via kurir pickup!', 'info')
                    }
                    className="hover:text-ink transition-colors cursor-pointer text-left"
                  >
                    Pengiriman & Retur
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'wishlist' })}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    Wishlist Lo
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold uppercase text-ink mb-4 tracking-widest">
                Sosmed
              </h4>
              <ul className="flex flex-col gap-2.5 text-[13px] text-muted-slate">
                <li>
                  <a
                    href="#instagram"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Follow @urbanstore.id untuk spill drop terbaru!', 'info');
                    }}
                    className="hover:text-ink transition-colors inline-flex items-center gap-1"
                  >
                    Instagram <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="#tiktok"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Cek styling fit check harian kita di TikTok @urbanstore.id', 'info');
                    }}
                    className="hover:text-ink transition-colors inline-flex items-center gap-1"
                  >
                    TikTok <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="#twitter"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Update restock real-time di X @urbanstore_id', 'info');
                    }}
                    className="hover:text-ink transition-colors inline-flex items-center gap-1"
                  >
                    Twitter / X <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-muted-slate">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  showToast('Data pesanan lo aman & cuma dipakai buat proses pengiriman.', 'info')
                }
                className="hover:text-ink transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-hairline">|</span>
              <button
                type="button"
                onClick={() =>
                  showToast('Garansi tukar size 7 hari berlaku untuk tag utuh & belum dicuci.', 'info')
                }
                className="hover:text-ink transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>
            <p>© 2026 UrbanStore. Curated Fashion System.</p>
          </div>
        </div>

        {/* Right Split Editorial Photo */}
        <div className="w-full lg:w-1/2 min-h-[380px] lg:min-h-full bg-studio-gray relative overflow-hidden border-t lg:border-t-0 lg:border-l border-hairline flex items-end p-6 lg:p-12">
          <EditorialImage
            src={HERO_MEDIA.footerEditorial}
            alt="UrbanStore Editorial Collection"
            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
          />
          <div className="relative z-10 bg-canvas/95 p-6 max-w-sm border border-hairline">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta mb-1 block">
              Issue Nº 24
            </span>
            <p className="font-editorial text-xl uppercase text-ink leading-snug">
              Form, Shadow, and Movement
            </p>
            <button
              type="button"
              onClick={() => navigate({ page: 'lookbook' })}
              className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-terracotta hover:border-terracotta transition-colors cursor-pointer"
            >
              Buka Lookbook ↗
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
