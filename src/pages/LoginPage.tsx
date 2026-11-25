import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export const LoginPage: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { showToast, navigate: storeNavigate } = useStore();
  const routerNavigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (redirectTarget) {
        routerNavigate(redirectTarget, { replace: true });
      } else if (isAdmin) {
        routerNavigate('/admin', { replace: true });
      } else {
        routerNavigate('/account', { replace: true });
      }
    }
  }, [isAdmin, isAuthenticated, isLoading, redirectTarget, routerNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Masukin alamat email yang valid dulu ya.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter biar aman.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await signInWithEmail(email, password);
        if (!res.ok) {
          setErrorMsg(res.error || 'Gagal masuk. Coba cek email & password.');
          return;
        }
        showToast(
          res.role === 'admin'
            ? 'Selamat datang kembali, Admin UrbanStore!'
            : 'Berhasil masuk! Selamat berbelanja.',
          'success'
        );
        if (redirectTarget) {
          routerNavigate(redirectTarget, { replace: true });
        } else {
          routerNavigate(res.role === 'admin' ? '/admin' : '/account', { replace: true });
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Nama lengkap wajib diisi buat daftar akun.');
          return;
        }
        const res = await signUpWithEmail({
          email,
          password,
          fullName,
          phoneWhatsapp,
        });
        if (!res.ok) {
          setErrorMsg(res.error || 'Gagal mendaftar. Coba lagi nanti.');
          return;
        }
        if (res.needsEmailConfirmation) {
          setInfoMsg(
            'Akun berhasil dibuat! Cek inbox atau folder spam email lo untuk klik link verifikasi sebelum login.'
          );
          setMode('login');
          setPassword('');
        } else {
          showToast('Akun customer berhasil dibuat & otomatis login!', 'success');
          routerNavigate(redirectTarget || '/account', { replace: true });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-canvas py-12 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Editorial Value Prop */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta block mb-2">
              UrbanStore Access · Supabase Auth
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl uppercase text-ink leading-none">
              Member &amp; <span className="italic">Curator</span> Portal.
            </h1>
          </div>

          <p className="text-[14px] text-muted-slate leading-relaxed">
            Masuk dengan email dan password untuk menyinkronkan keranjang, wishlist, serta melacak
            riwayat pesanan lo lintas perangkat secara real-time.
          </p>

          <div className="border border-hairline bg-surface-alt p-5 space-y-4 text-[13px]">
            <div className="flex items-start gap-3">
              <UserCheck className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink uppercase text-[11px] tracking-wider">
                  Role Customer
                </p>
                <p className="text-muted-slate mt-0.5">
                  Otomatis aktif saat daftar. Simpan wishlist, sinkron keranjang, auto-fill alamat
                  checkout, dan pantau status resi pengiriman.
                </p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink uppercase text-[11px] tracking-wider">
                  Role Admin / Kurator
                </p>
                <p className="text-muted-slate mt-0.5">
                  Akses khusus pengelola untuk memproses pesanan, input nomor resi, kelola stok per
                  ukuran, dan atur kode promo.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => storeNavigate({ page: 'catalog', category: 'all' })}
              className="text-[12px] font-semibold uppercase tracking-widest text-ink underline hover:text-terracotta cursor-pointer"
            >
              Atau Lanjut Guest Browsing Tanpa Akun ↗
            </button>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="lg:col-span-7 border border-hairline bg-canvas p-6 sm:p-10">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 border border-hairline mb-8">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-ink text-canvas'
                  : 'bg-canvas text-muted-slate hover:text-ink'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-ink text-canvas'
                  : 'bg-canvas text-muted-slate hover:text-ink'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 border border-terracotta bg-surface-alt text-[13px] text-terracotta font-medium">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="mb-6 p-4 border border-ink bg-surface-alt text-[13px] text-ink font-medium">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Raka Pratama"
                    className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                    No. WhatsApp (Opsional)
                  </label>
                  <input
                    type="tel"
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                Alamat Email *
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-11 px-3.5 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-ink block mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-11 pl-3.5 pr-11 bg-canvas border border-hairline text-[14px] text-ink focus:outline-none focus:border-ink"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-slate hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-ink text-canvas text-[12px] font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {submitting
                  ? 'Memproses...'
                  : mode === 'login'
                    ? 'Masuk ke UrbanStore'
                    : 'Buat Akun Customer'}
              </span>
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
