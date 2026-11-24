import React, { useEffect, useState } from 'react';
import { Ruler, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setSizeGuideOpen } = useStore();
  const [tab, setTab] = useState<'tops' | 'bottoms'>('tops');

  useEffect(() => {
    if (!isSizeGuideOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSizeGuideOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSizeGuideOpen, setSizeGuideOpen]);

  if (!isSizeGuideOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Ukuran Visual"
      onClick={() => setSizeGuideOpen(false)}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-canvas w-full max-w-2xl border border-hairline max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline flex items-center justify-between sticky top-0 bg-canvas z-10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-0.5">
              Size Confidence Standard
            </span>
            <h3 className="font-editorial text-xl uppercase text-ink">
              Panduan Ukuran Visual (CM)
            </h3>
          </div>
          <button
            type="button"
            aria-label="Tutup Panduan Ukuran"
            onClick={() => setSizeGuideOpen(false)}
            className="p-2 text-ink hover:text-terracotta transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-[13px] text-muted-slate leading-relaxed">
            Semua produk UrbanStore diukur mendatar (flat measurement) dengan toleransi ±1 cm.
            Biar fit-nya nggak zonk, ukur baju atau celana favorit lo yang paling nyaman di lemari,
            lalu cocokkan sama tabel di bawah.
          </p>

          {/* Switcher */}
          <div className="flex border border-hairline w-fit">
            <button
              type="button"
              onClick={() => setTab('tops')}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                tab === 'tops' ? 'bg-ink text-canvas' : 'bg-canvas text-muted-slate hover:text-ink'
              }`}
            >
              Atasan & Outerwear
            </button>
            <button
              type="button"
              onClick={() => setTab('bottoms')}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                tab === 'bottoms'
                  ? 'bg-ink text-canvas'
                  : 'bg-canvas text-muted-slate hover:text-ink'
              }`}
            >
              Celana & Trousers
            </button>
          </div>

          {/* Measurement Table */}
          {tab === 'tops' ? (
            <div className="overflow-x-auto border border-hairline">
              <table className="w-full text-left text-[13px] tabular-nums">
                <thead className="bg-studio-gray text-[11px] font-semibold uppercase tracking-wider text-ink border-b border-hairline">
                  <tr>
                    <th className="p-3">Size Tag</th>
                    <th className="p-3">Lebar Dada (cm)</th>
                    <th className="p-3">Panjang Baju (cm)</th>
                    <th className="p-3">Lebar Bahu (cm)</th>
                    <th className="p-3">Rekomendasi Tinggi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <td className="p-3 font-semibold">Small (S)</td>
                    <td className="p-3">54 – 56</td>
                    <td className="p-3">68 – 70</td>
                    <td className="p-3">48</td>
                    <td className="p-3 text-muted-slate">160 – 170 cm</td>
                  </tr>
                  <tr className="bg-surface-alt">
                    <td className="p-3 font-semibold">Medium (M)</td>
                    <td className="p-3">57 – 59</td>
                    <td className="p-3">71 – 73</td>
                    <td className="p-3">50</td>
                    <td className="p-3 text-muted-slate">168 – 178 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Large (L)</td>
                    <td className="p-3">60 – 62</td>
                    <td className="p-3">74 – 75</td>
                    <td className="p-3">52</td>
                    <td className="p-3 text-muted-slate">175 – 185 cm</td>
                  </tr>
                  <tr className="bg-surface-alt">
                    <td className="p-3 font-semibold">X-Large (XL)</td>
                    <td className="p-3">64 – 65</td>
                    <td className="p-3">77 – 78</td>
                    <td className="p-3">55</td>
                    <td className="p-3 text-muted-slate">180 – 192 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto border border-hairline">
              <table className="w-full text-left text-[13px] tabular-nums">
                <thead className="bg-studio-gray text-[11px] font-semibold uppercase tracking-wider text-ink border-b border-hairline">
                  <tr>
                    <th className="p-3">Size Tag</th>
                    <th className="p-3">Lingkar Pinggang (cm)</th>
                    <th className="p-3">Panjang Celana (cm)</th>
                    <th className="p-3">Leg Opening (cm)</th>
                    <th className="p-3">Setara Jeans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <td className="p-3 font-semibold">28</td>
                    <td className="p-3">72 – 74</td>
                    <td className="p-3">100 – 101</td>
                    <td className="p-3">24</td>
                    <td className="p-3 text-muted-slate">S / 27–28</td>
                  </tr>
                  <tr className="bg-surface-alt">
                    <td className="p-3 font-semibold">30</td>
                    <td className="p-3">77 – 79</td>
                    <td className="p-3">102 – 103</td>
                    <td className="p-3">25</td>
                    <td className="p-3 text-muted-slate">M / 29–30</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">32</td>
                    <td className="p-3">82 – 84</td>
                    <td className="p-3">103 – 104</td>
                    <td className="p-3">26</td>
                    <td className="p-3 text-muted-slate">L / 31–32</td>
                  </tr>
                  <tr className="bg-surface-alt">
                    <td className="p-3 font-semibold">34</td>
                    <td className="p-3">87 – 89</td>
                    <td className="p-3">105</td>
                    <td className="p-3">27</td>
                    <td className="p-3 text-muted-slate">XL / 33–34</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Visual Guide Diagram Box */}
          <div className="bg-surface-alt border border-hairline p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[12px]">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-ink uppercase tracking-wider mb-1">
                <Ruler className="w-3.5 h-3.5 text-terracotta" />
                <span>01. Lebar Dada</span>
              </div>
              <p className="text-muted-slate">
                Ukur mendatar dari jahitan ketiak kiri ke ketiak kanan. Kalikan 2 untuk lingkar dada.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-ink uppercase tracking-wider mb-1">
                <Ruler className="w-3.5 h-3.5 text-terracotta" />
                <span>02. Panjang</span>
              </div>
              <p className="text-muted-slate">
                Ukur lurus dari titik bahu tertinggi dekat kerah hingga ujung hem paling bawah.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-ink uppercase tracking-wider mb-1">
                <Ruler className="w-3.5 h-3.5 text-terracotta" />
                <span>03. Garansi Tukar</span>
              </div>
              <p className="text-muted-slate">
                Kurang pas di badan? Bisa tukar size 7 hari kerja bebas ribet asalkan tag masih utuh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
