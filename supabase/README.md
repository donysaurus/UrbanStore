# Panduan Setup Database Supabase — UrbanStore

Dokumen ini berisi panduan langkah demi langkah bagi Database Administrator (DBA) dan developer untuk mengaktifkan skema database, Row Level Security (RLS), transaksi stok atomik, serta autentikasi berbasis peran (`admin` dan `pelanggan`) di Supabase.

## 1. Struktur File
- `supabase/schema.sql`: Skema lengkap PostgreSQL (enum, tabel, indeks, trigger profil otomatis, proteksi eskalasi role, fungsi RPC atomik `create_order`, `validate_promo_code`, `get_order_by_number`, dan RLS policies).
- `supabase/seed.sql`: Data awal 12 produk kurasi beserta varian ukuran (cm), metode pengiriman, metode pembayaran, dan kode promo (`URBAN10`, `HEMAT50`).

## 2. Langkah Eksekusi di Supabase Dashboard
1. Buka **Supabase Dashboard** project Anda (`eupbvvjdwgpdveznvxlq`).
2. Masuk ke menu **SQL Editor** → klik **New query**.
3. Salin dan jalankan seluruh isi `supabase/schema.sql`. Pastikan statusnya `Success`.
4. Buat query baru, salin dan jalankan seluruh isi `supabase/seed.sql`.

## 3. Pengaturan Autentikasi (Email + Password)
1. Masuk ke menu **Authentication → Providers → Email** di Supabase Dashboard.
2. Pastikan **Enable Email provider** aktif.
3. *(Opsional untuk Development/Testing)* Jika ingin pengguna bisa langsung login setelah mendaftar tanpa menunggu verifikasi email inbox, matikan sementara opsi **Confirm email**.

## 4. Membuat Akun Role `admin` dan `pelanggan`
Secara keamanan standar, setiap registrasi baru melalui aplikasi otomatis mendapatkan role **`pelanggan`** melalui trigger `public.handle_new_user()` (dan trigger `prevent_role_self_escalation()` memblokir user mengubah rolenya sendiri).

Untuk membuat akun **Admin**:
1. Daftarkan akun melalui halaman `/login` (tab **Daftar Akun**) di aplikasi, atau buat melalui **Authentication → Users → Add User** di Supabase Dashboard.
2. Jalankan query SQL berikut di **SQL Editor**:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'email-admin-anda@domain.com';
   ```
3. Login kembali di aplikasi menggunakan email & password tersebut; pengguna akan otomatis diarahkan ke **Admin Dashboard (`/admin`)**.
