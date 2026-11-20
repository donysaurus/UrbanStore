# Product Requirements Document (PRD)

## UrbanStore — Curated Fashion E-commerce Web App

**Dokumen:** Product Requirements Document

**Versi:** 1.2 (Revisi Copywriting Gen Z)

**Status:** Draft untuk validasi dan perencanaan MVP

**Tanggal:** 20 November 2026

**Platform:** Responsive Web App

**Target pasar awal:** Indonesia

**Bahasa:** Bahasa Indonesia (Tone: Kasual / Gaul Gen Z)

**Pemilik produk:** UrbanStore

## 1. Ringkasan Produk

UrbanStore adalah online store fashion pria dan wanita yang mengkurasi produk agar pengguna Gen Z usia 18–30 tahun dapat menemukan outfit stylish sesuai selera dan budget tanpa harus menelusuri katalog yang terlalu luas. Pengalaman berbelanja dirancang mobile-first, cepat, visual, editorial, dan transparan—terutama pada informasi ukuran, stok, serta biaya pesanan.

**Nilai utama:** curated fashion, size confidence, dan checkout yang ringkas.

### 1.1 Masalah pengguna

1. Katalog fashion online yang terlalu padat membuat produk relevan sulit ditemukan.

2. Informasi ukuran sering tidak konsisten sehingga pengguna ragu memilih size.

3. Alur checkout yang panjang dan biaya yang baru terlihat di akhir meningkatkan risiko batal membeli.

### 1.2 Solusi

* Katalog terkurasi dengan navigasi kategori Pria dan Wanita serta filter yang mudah digunakan.

* Halaman detail dengan size guide visual, pengukuran dalam sentimeter, dan instruksi mengukur tubuh.

* Keranjang yang mudah diedit dan total biaya yang diperbarui langsung.

* Checkout tiga langkah dengan validasi yang jelas dan ringkasan biaya transparan.

### 1.3 Tujuan produk

* **G1 — Discovery:** membantu pengguna menemukan outfit stylish tanpa tersesat di katalog.

* **G2 — Size confidence:** menyediakan panduan ukuran visual yang jelas dan dapat dipercaya.

* **G3 — Conversion:** menyelesaikan checkout mobile dengan cepat dan minim hambatan.

## 2. Sasaran, Non-Sasaran, dan Prinsip

### 2.1 Sasaran MVP

* Menampilkan katalog produk yang terkurasi dalam grid responsif bergaya editorial.

* Menyediakan pencarian dan filter kategori Pria/Wanita.

* Menyajikan halaman detail produk dengan foto, harga, status stok, pilihan varian, dan size guide.

* Memungkinkan pengguna menambah, mengubah kuantitas, dan menghapus item keranjang.

* Menghitung subtotal, ongkir, diskon (jika ada), dan total secara konsisten.

* Menyediakan checkout tiga langkah dan konfirmasi pesanan.

* Menyediakan pengalaman yang usable di mobile, tablet, dan desktop.

### 2.2 Non-sasaran MVP

* Marketplace multi-penjual.

* Program loyalty, poin, referral, dan gamifikasi.

* Personalisasi berbasis machine learning.

* Aplikasi native iOS/Android.

* Live shopping, chat penjual, dan review foto/video.

* Multi-negara, multi-mata uang, dan multi-bahasa.

* Sistem rekomendasi outfit kompleks.

### 2.3 Prinsip produk

1. **Editorial clarity over clutter:** tampilkan informasi penting dengan ruang bernapas (*whitespace*) yang luas dan estetika *lookbook* tanpa dekorasi berlebihan.

2. **Mobile-first:** alur utama harus nyaman dengan satu tangan.

3. **No surprise costs:** biaya ditampilkan sebelum pengguna membuat pesanan.

4. **Size confidence:** ukuran produk harus spesifik per produk, bukan hanya label S/M/L.

5. **Fast feedback:** setiap aksi penting memberi respons langsung.

6. **Accessible by default:** kontras monokrom tinggi, fokus keyboard, label, dan pesan error harus jelas.

## 3. Target Pengguna dan Jobs To Be Done

### Persona utama — The Mobile Fashion Explorer

* Usia: 18–30 tahun.

* Perilaku: menemukan inspirasi fashion melalui media sosial/editorial lookbook dan berbelanja lewat smartphone.

* Motivasi: tampil stylish dengan estetika modern-clean, menemukan item yang cocok, dan tetap sesuai budget.

* Friksi: terlalu banyak pilihan, takut salah ukuran, biaya akhir tidak jelas, checkout bertele-tele.

**Job To Be Done:**

“Ketika saya ingin membeli outfit yang sesuai gaya dan budget, bantu saya menemukan produk yang relevan, yakin dengan ukurannya, dan menyelesaikan pembelian tanpa proses yang melelahkan.”

### Kebutuhan pengguna

* Melihat katalog produk terkini dengan tampilan visual yang bersih dan jelas.

* Menelusuri kategori Pria dan Wanita.

* Mencari produk berdasarkan nama atau kata kunci.

* Memahami harga, varian warna/ukuran, stok, dan detail produk.

* Melihat panduan ukuran sebelum memilih.

* Mengelola keranjang dan memahami total biaya.

* Checkout tanpa wajib membuat akun.

## 4. Ruang Lingkup dan Prioritas

| Fitur | Prioritas | Rilis | 
| ----- | ----- | ----- | 
| Homepage, navigasi, dan editorial hero | Must | MVP | 
| Katalog grid responsif (termasuk asymmetric spotlight) | Must | MVP | 
| Filter kategori Pria/Wanita | Must | MVP | 
| Pencarian produk | Should | MVP bila kapasitas memungkinkan | 
| Detail produk dan galeri foto | Must | MVP | 
| Size guide visual per produk | Must | MVP | 
| Pemilihan ukuran/varian dan validasi stok | Must | MVP | 
| Shopping cart dan edit qty | Must | MVP | 
| Perhitungan subtotal dan total realtime | Must | MVP | 
| Checkout tiga langkah | Must | MVP | 
| Order confirmation | Must | MVP | 
| Wishlist dan akun pengguna | Could | Pasca-MVP | 
| Review/rating produk | Could | Pasca-MVP | 
| Rekomendasi personal | Won't | Bukan MVP | 

**Catatan:** “1-click cart” diartikan sebagai aksi tambah ke keranjang yang ringkas dari halaman detail, bukan checkout satu klik. Checkout tetap tiga langkah sesuai scope.

## 5. Arsitektur Informasi dan Navigasi

### 5.1 Struktur halaman

* `/` — Homepage

* `/products` — Semua produk

* `/products?category=men` — Kategori Pria

* `/products?category=women` — Kategori Wanita

* `/product/:slug` — Detail produk

* `/cart` — Keranjang

* `/checkout` — Checkout tiga langkah

* `/order/success/:orderId` — Konfirmasi pesanan

### 5.2 Navigasi utama

* **Top Header Minimalis:** Dibatasi garis *hairline* tipis (`1px`).

* **Kiri:** Wordmark/Logo UrbanStore dengan sentuhan tipografi editorial.

* **Kanan:** Utilitas ringkas berupa ikon Search, Cart (dengan indikator jumlah), dan Menu/Drawer trigger.

* Pada mobile dan desktop, menu kategori utama (Pria, Wanita, Semua Produk) dapat diakses cepat melalui slide-out drawer atau bar navigasi bersih agar header tetap lapang.

### 5.3 Alur utama pengguna

1. Pengguna masuk ke homepage.

2. Memilih kategori, menggunakan search, atau membuka produk pilihan dari kurasi *New Arrival* / *Latest Arrivals*.

3. Membuka detail produk dan memeriksa galeri foto, harga, pilihan warna/ukuran, serta size guide.

4. Memilih ukuran/varian yang tersedia dan menambahkan produk ke keranjang.

5. Mengubah qty atau menghapus item di halaman keranjang dengan ringkasan biaya di sisi kanan (desktop) atau bawah (mobile).

6. Memilih checkout.

7. Menyelesaikan tiga langkah: informasi pengiriman, metode pengiriman/pembayaran, tinjau pesanan.

8. Mendapat halaman konfirmasi setelah pesanan berhasil dibuat.

## 6. Persyaratan Fungsional

### FR-01 — Homepage dan editorial hero

**Deskripsi:** halaman utama memperkenalkan identitas UrbanStore layaknya majalah fashion digital dan mengarahkan pengguna ke katalog.

**Persyaratan**

* Menampilkan **Editorial Hero**: komposisi tipografi *display* berukuran besar yang berpadu dengan kolase foto lookbook yang sedikit miring (*tilted cards*) di atas kanvas putih bersih.

* Menampilkan bagian **Browse by Categories** dengan kartu foto vertikal bersih dan tautan `Lihat Semua ↗`.

* Menampilkan bagian kurasi **New Arrival / Latest Arrivals** dengan tata letak grid editorial.

* Menampilkan footer terstruktur dengan kolom tautan (Quick Links, Info & Bantuan, Sosmed) berdampingan dengan foto visual suasana toko/gantungan pakaian (*split visual footer*).

**Kriteria penerimaan**

* Pengguna dapat membuka kategori dari homepage.

* Tautan `Lihat Semua ↗` dan hero mengarah ke halaman katalog yang benar.

* Layout tidak menyebabkan horizontal scroll pada viewport yang didukung.

### FR-02 — Katalog dan filter

**Deskripsi:** pengguna dapat menjelajahi daftar produk melalui grid responsif bergaya lookbook.

**Persyaratan**

* Setiap kartu menampilkan foto studio berlatar netral (abu-abu muda/off-white), nama produk, dan harga.

* Mendukung variasi ukuran kartu (grid standar dan *featured large card*) pada bagian kurasi homepage untuk memecah monotonitas visual.

* Produk tanpa stok menampilkan badge **“Sold Out / Habis Duluan”** yang terlihat jelas tanpa merusak estetika foto.

* Pengguna dapat memfilter kategori Pria dan Wanita.

* Filter aktif harus terlihat dan dapat dihapus/reset.

* Kartu produk dapat dibuka menuju detail produk.

* State kosong menampilkan pesan gaul Gen Z dan aksi untuk menghapus filter.

**Kriteria penerimaan**

* Filter kategori menghasilkan produk sesuai kategori.

* Status habis terlihat tanpa perlu membuka detail.

* Grid menyesuaikan lebar layar tanpa memotong konten.

### FR-03 — Pencarian

**Deskripsi:** membantu pengguna menemukan produk berdasarkan kata kunci.

**Persyaratan**

* Search menerima nama produk dan kata kunci relevan.

* Search dapat diakses dari ikon kaca pembesar di header pada semua halaman.

* Hasil pencarian tetap dapat digabungkan dengan filter kategori.

* Jika tidak ada hasil, tampilkan pesan santai dan saran untuk mengubah kata kunci.

**Kriteria penerimaan**

* Enter atau aksi search memicu pencarian.

* Tombol clear menghapus kata kunci.

* Hasil kosong tidak menampilkan layar kosong tanpa penjelasan.

### FR-04 — Detail produk dan size guide

**Deskripsi:** memberi informasi yang cukup untuk keputusan pembelian dengan tata letak 2 kolom (desktop) dan stacked (mobile).

**Persyaratan**

* **Kolom Kiri:** Galeri foto utama berukuran besar dengan deretan thumbnail persegi di bagian bawah.

* **Kolom Kanan:** Breadcrumb navigasi (`Home > Koleksi > Kategori`), nama produk, harga, pemilih varian warna (*square color swatches* dengan indikator aktif), *dropdown/selector* ukuran, pemilih kuantitas (`+ 1 -`), serta tautan **Cek Size Guide**.

* **Hierarki Tombol Aksi:** Tombol utama solid hitam (`Masukin Keranjang`) dan tombol sekunder *outlined* putih berbingkai hitam (`Beli Langsung`).

* **Accordion Informasi:** Bagian lipat (`+` / `-`) untuk *Detail Produk* (bahan, perawatan, ukuran), *Info Retur & Tukar Size*, dan *Info Pengiriman*.

* Menampilkan size guide visual dalam tabel atau diagram yang mudah dibaca dengan satuan **cm** yang konsisten.

* Ukuran/varian yang tidak tersedia harus dinonaktifkan dan diberi label.

**Kriteria penerimaan**

* Pengguna dapat membuka dan menutup size guide.

* Ukuran yang tidak tersedia tidak dapat dipilih.

* Pengguna tidak dapat menambahkan produk tanpa memilih ukuran jika ukuran diwajibkan.

* Kuantitas tidak dapat melebihi stok yang tersedia.

### FR-05 — Shopping cart

**Deskripsi:** pengguna dapat memeriksa dan mengelola item sebelum checkout dengan tata letak split (daftar item di kiri, *Ringkasan Order* di kanan).

**Persyaratan**

* Menampilkan header jumlah item, misal: `Keranjang Lo (4 item)`.

* Kartu item berbingkai garis tipis menampilkan thumbnail, nama produk, detail varian (`Size`, `Warna`), harga, kontrol kuantitas (`+ 1 -`), dan ikon hapus di sudut kanan atas item.

* Panel **Ringkasan Order** menampilkan rincian *Subtotal*, *Diskon* (dengan aksen teks merah bata/terracotta bila ada), *Ongkir*, dan *Total*, dilengkapi kolom kode promo (`Punya kode promo?` + tombol hitam `Pakai`) serta tombol penuh `Lanjut Checkout →`.

* Tampilkan bagian rekomendasi *“Mungkin Lo Suka Juga”* di bawah keranjang bila relevan dengan kurasi MVP.

* Tampilkan empty state dengan CTA kembali ke katalog jika keranjang kosong.

**Aturan perhitungan**

* `item_total = unit_price × quantity`

* `subtotal = jumlah seluruh item_total`

* `total = subtotal + shipping_fee - discount`

* Jangan menampilkan ongkir nol jika ongkir sebenarnya belum dihitung; tampilkan “Dihitung pas checkout ya”.

**Kriteria penerimaan**

* Qty tidak boleh kurang dari 1 untuk item yang masih ada.

* Menghapus item langsung memperbarui subtotal.

* Total yang tampil sama dengan total yang diteruskan ke checkout.

### FR-06 — Checkout tiga langkah

**Deskripsi:** menyelesaikan pembelian dalam tiga tahap yang jelas dengan estetika form yang bersih.

**Langkah 1 — Info Pengiriman**

* Nama penerima, nomor WhatsApp/telepon, email, alamat lengkap, provinsi, kota/kabupaten, kecamatan, kode pos.

* Validasi inline dengan pesan spesifik dan solusi dalam bahasa yang ramah.

**Langkah 2 — Kurir & Pembayaran**

* Pilihan metode pengiriman beserta estimasi dan biaya.

* Pilihan metode pembayaran yang benar-benar didukung oleh integrasi.

* Ringkasan biaya diperbarui setelah pilihan dibuat.

**Langkah 3 — Cek Lagi & Bayar**

* Ringkasan item, ukuran, qty, alamat, pengiriman, dan metode pembayaran.

* Rincian subtotal, ongkir, diskon, dan total.

* Tombol buat pesanan solid hitam dengan loading state dan pencegahan submit ganda.

**Kriteria penerimaan**

* Pengguna dapat kembali ke langkah sebelumnya tanpa kehilangan data yang sudah diisi.

* Pesanan hanya dibuat setelah validasi server berhasil.

* Total dihitung ulang di server.

### FR-07 — Konfirmasi pesanan

**Deskripsi:** memberi kepastian bahwa pesanan telah diterima sistem.

**Persyaratan**

* Menampilkan status berhasil, nomor pesanan, ringkasan pembelian, total, dan instruksi pembayaran/pengiriman.

* Menyediakan CTA kembali berbelanja.

* Halaman konfirmasi hanya dapat ditampilkan untuk pesanan yang valid.

## 7. Aturan Bisnis dan Data

### 7.1 Entitas data inti

**Product**

* `id`, `slug`, `name`, `description`, `category` (`men`/`women`), `price`, `images[]`, `is_active`.

**ProductVariant**

* `id`, `product_id`, `size`, `color`, `color_hex`, `sku`, `stock_quantity`, `measurements`.

**CartItem**

* `product_id`, `variant_id`, `quantity`, `unit_price_snapshot`.

**Order**

* `id`, `order_number`, `customer_details`, `shipping_address`, `items[]`, `subtotal`, `shipping_fee`, `discount`, `total`, `payment_method`, `shipping_method`, `status`, `created_at`.

### 7.2 Aturan stok dan harga

* Stok dikelola per varian (ukuran dan warna).

* Status “Habis Duluan” pada kartu produk tampil bila seluruh varian yang dapat dibeli tidak memiliki stok.

* Harga dan stok wajib diverifikasi kembali di server saat checkout.

* Pengurangan/reservasi stok harus atomik untuk mencegah overselling.

### 7.3 Format mata uang

* Gunakan Rupiah (IDR) dengan format lokal, misalnya `Rp125.000`.

* Simpan nilai uang sebagai integer dalam satuan rupiah, bukan floating point.

## 8. Persyaratan Non-Fungsional

### 8.1 Responsiveness

* Mobile: mulai dari lebar 320 px; prioritas desain 360–430 px.

* Tablet: layout menyesuaikan grid dan navigasi.

* Desktop: gunakan ruang layar secara efisien dengan margin luar yang proporsional (editorial framing).

* Tidak boleh ada horizontal scrolling pada halaman utama.

### 8.2 Performance

* Target katalog: tampil bermakna dalam **< 2 detik**.

* Target Core Web Vitals: LCP ≤ 2,5 detik, INP ≤ 200 ms, CLS ≤ 0,1.

* Gunakan gambar WebP/AVIF, ukuran responsif, lazy loading untuk gambar di bawah fold, dan caching.

### 8.3 Accessibility

* Target WCAG 2.2 AA.

* Kontras teks normal minimal 4.5:1 (terjamin oleh kombinasi hitam pekat `#111111` di atas putih `#FFFFFF`).

* Semua kontrol dan accordion dapat dioperasikan dengan keyboard.

* Ukuran target sentuh ideal minimal 44 × 44 CSS px.

### 8.4 Security dan privacy

* Gunakan HTTPS, validasi input di client dan server, proteksi submit ganda, dan rate limiting.

* Ikuti ketentuan perlindungan data pribadi di Indonesia.

## 9. UX/UI dan Design Direction

### 9.1 Arah visual

**Editorial Luxury Minimalist × Contemporary Lookbook**

* **Filosofi Tata Letak:** Estetika majalah fashion independen dengan *whitespace* putih yang sangat dominan, *grid* presisi, dan pembatas garis tipis (*hairline borders*) yang tegas tanpa bayangan (*drop-shadow*) yang berat.

* **Komposisi Dinamis:** Memadukan struktur grid teratur dengan elemen editorial asimetris—seperti kolase foto miring (*tilted lookbook cards*) pada hero section dan variasi ukuran kartu produk (kombinasi kartu standar dan kartu *spotlight* besar) pada bagian kurasi.

* **Fotografi Dominan:** Foto produk menggunakan latar belakang studio netral (abu-abu lembut/off-white) dengan pencahayaan bersih agar siluet dan tekstur pakaian menjadi pusat perhatian utama.

* **Aksen Monokrom:** Dominasi hitam pekat dan putih bersih, dengan sentuhan warna hangat (terracotta/merah bata) yang digunakan sangat hemat hanya untuk indikator diskon, peringatan, atau aksi hapus.

### 9.2 Tipografi

* **Display & Headings:** Font **High-Contrast Editorial Serif / Display** (seperti *Cinzel*, *Cormorant Garamond*, atau *Playfair Display* bergaya modern dengan lengkungan/ekor huruf artistik) dalam format huruf kapital (*ALL CAPS*) untuk judul bagian utama (*Hero Headline*, *Browse by Categories*, *New Arrival*, *May Be You Like Too*).

* **Body, UI & Pricing:** Font **Clean Geometric / Neo-Grotesque Sans-Serif** (seperti *Plus Jakarta Sans*, *Inter*, atau *DM Sans*) untuk keterbacaan optimal pada nama produk, harga, deskripsi, navigasi, dan form checkout.

### 9.3 Palet warna

| Token | Warna | Penggunaan | 
| ----- | ----- | ----- | 
| Canvas | `#FFFFFF` | Latar belakang utama halaman dan kartu | 
| Ink | `#111111` | Teks utama, tipografi display, tombol CTA solid utama | 
| Studio Gray | `#EFEFEF` | Latar belakang foto produk studio dan kotak *placeholder* | 
| Surface Alt | `#F7F7F5` | Latar belakang kotak *Ringkasan Order* dan panel sekunder | 
| Hairline | `#E2E2E2` | Garis pembatas tipis (*1px border*) antar section, header, dan kartu | 
| Muted | `#6E6E6E` | Teks sekunder, label varian, harga coret, breadcrumb | 
| Terracotta | `#C84B31` | Aksen hemat untuk label diskon, potongan harga, dan ikon hapus | 

### 9.4 Komponen UI penting

1. **Editorial Hero Banner:** Tipografi *serif* berukuran besar di tengah yang saling tumpang-tindih (*overlapping*) secara artistik dengan dua foto model miring berlatar studio.

2. **Product Card (Lookbook Style):**

   * Rasio foto konsisten tanpa sudut membulat berlebihan (*sharp* atau *minimal radius* `0px–2px`).

   * Tanpa bingkai tebal; informasi (nama produk, harga, badge stok) diletakkan rapi rata kiri di bawah foto.

   * Mendukung ukuran *Standard* (1 kolom grid) dan *Spotlight* (2 kolom lebar/tinggi) pada halaman depan.

3. **Color Swatch & Size Selector:**

   * Pilihan warna berupa kotak persegi kecil (`20×20px`) bersebelahan dengan garis tepi aktif.

   * Pilihan ukuran berupa *dropdown* atau tombol kotak minimalis dengan garis tepi `1px`.

4. **Dual-Hierarchy Buttons:**

   * *Primary CTA:* Latar `#111111`, teks `#FFFFFF`, sudut tajam (`0px` radius).

   * *Secondary CTA:* Latar `#FFFFFF`, border `1px solid #111111`, teks `#111111`.

5. **Expandable Info Accordion:** Daftar informasi (Detail Produk, Info Retur, Pengiriman) yang dipisahkan garis *hairline* horizontal dengan indikator ikon `+` dan `-`.

6. **Split Editorial Footer:** Area kiri berisi 3 kolom tautan navigasi berlatar putih bersih, berdampingan langsung (50:50 pada desktop) dengan foto editorial gantungan koleksi pakaian di sisi kanan.

### 9.5 Copywriting & Tone of Voice (Bahasa Indonesia Gaul ala Gen Z)

Seluruh *microcopy*, CTA, notifikasi, dan pesan error wajib menggunakan **Bahasa Indonesia gaul ala Gen Z** (santai, percaya diri, ekspresif, *to-the-point*, namun tetap *clean* dan tidak alay/kaku).

**Aturan Gaya Bahasa:**
* Gunakan kata sapaan kasual seperti *"lo"*, *"buat lo"*, atau kalimat langsung tanpa subjek kaku (hindari *"Anda"* atau *"Pelanggan yang terhormat"*).
* Gunakan istilah yang akrab di telinga anak muda Indonesia (misal: *fit check, drop, zonk, gas, aman, kepoin, spill, gercep, sat-set*).
* Kontraskan tipografi *Editorial Serif* yang mewah dengan *copywriting* Gen Z yang *relatable* untuk menciptakan karakter brand yang unik dan *memorable*.
* Hindari klaim mutlak seperti *"pasti muat"* karena preferensi *fit* tiap orang berbeda (misal: *oversized* vs *regular fit*).

**Panduan Microcopy per Komponen:**
* **Hero Headline (Editorial Serif):** **“FIT CHECK STARTS HERE.”** atau **“OUTFIT AUTO KECE, NO RIBET.”**
* **Hero Subcopy:** “Kurasi outfit paling masuk buat gaya lo. Size jelas dalam cm, checkout sat-set anti drama.”
* **CTA Utama:** `Kepoin Koleksinya ↗` / `Lihat Semua ↗`
* **Add to Cart & Buy Now:** `Masukin Keranjang` / `Gas Beli Sekarang`
* **Toast Berhasil Add to Cart:** “Mantap, udah masuk keranjang! Mau lanjut checkout atau nambah lagi?”
* **Size Guide Trigger:** `Biar nggak salah ukuran, cek Size Guide dulu →`
* **Validasi Belum Pilih Ukuran:** “Pilih size dulu dong biar fit-nya nggak zonk!”
* **Stok Habis (Badge):** `Habis Duluan` / `Sold Out`
* **Stok Terbatas:** `Sisa dikit, gercep!`
* **Empty Cart:** “Keranjang lo masih kosong nih. Yuk, cari outfit yang paling klik sama gaya lo!”
* **Search Tidak Ditemukan:** “Waduh, barang yang lo cari nggak ketemu. Coba kata kunci lain atau cek koleksi terbaru kita!”
* **Checkout Stepper:** `1. Alamat Lo` → `2. Pengiriman & Bayar` → `3. Cek Lagi & Gas`
* **Order Success:** “Orderan lo udah masuk! Tinggal duduk manis, paket kece segera meluncur.”

## 10. Analytics dan Pengukuran Keberhasilan

### 10.1 North Star Metric

**Checkout completion rate:** persentase sesi checkout yang menghasilkan pesanan berhasil.

### 10.2 KPI

| KPI | Definisi | Target awal (hipotesis) | 
| ----- | ----- | ----- | 
| Product discovery rate | Sesi katalog yang membuka detail produk | Baseline lalu naik 15% | 
| Add-to-cart rate | Sesi produk yang menambahkan item ke cart | Baseline lalu naik 10% | 
| Size guide engagement | Pengguna detail yang membuka size guide | Dipantau; bukan target tunggal | 
| Cart-to-checkout rate | Sesi cart yang memulai checkout | ≥ 35% | 
| Checkout completion | Checkout berhasil / checkout dimulai | ≥ 50% | 
| Mobile conversion share | Kontribusi pesanan dari mobile | Dipantau menurut device | 
| Catalog load time | Waktu render katalog bermakna | < 2 detik pada skenario uji | 

### 10.3 Event analytics

* `view_home`, `view_category`, `search_submitted`, `filter_applied`

* `view_product`, `size_guide_opened`, `variant_selected`, `add_to_cart`

* `cart_quantity_updated`, `cart_item_removed`, `begin_checkout`, `checkout_step_completed`

* `purchase_succeeded`, `checkout_error`

Jangan kirim nama, nomor telepon, alamat, atau informasi pembayaran ke analytics.

## 11. Risiko, Asumsi, dan Mitigasi

| Risiko/asumsi | Dampak | Mitigasi | 
| ----- | ----- | ----- | 
| Data ukuran produk tidak akurat | Retur dan hilangnya kepercayaan | Standar pengukuran, verifikasi supplier, QA sampel | 
| Foto studio tidak seragam | Merusak estetika editorial lookbook | Panduan fotografi wajib (latar abu-abu/netral, pencahayaan seragam) | 
| Stok berubah saat checkout | Overselling | Validasi stok server dan reservasi atomik | 
| Ongkir/pembayaran belum terintegrasi | Checkout tidak dapat diselesaikan | Tentukan provider dan scope integrasi sebelum development | 
| Bahasa gaul terlalu berlebihan (*cringe*) | Menurunkan kesan *editorial luxury* | Terapkan *copywriting guidelines* secara konsisten dan lakukan *review* bahasa sebelum rilis | 

### Asumsi yang harus divalidasi

* Pelanggan bersedia checkout sebagai guest.

* Kategori Pria/Wanita cukup sebagai filter utama untuk MVP.

* Setiap produk memiliki ukuran dan stok per varian.

* Operasional dapat menyediakan foto produk dengan latar belakang bersih yang seragam.

## 12. Dependensi dan Keputusan yang Masih Terbuka

Sebelum development dimulai, product owner perlu menetapkan:

1. Sumber katalog dan siapa yang mengelola produk, foto studio, harga, size chart, dan stok.

2. Provider pembayaran dan metode yang akan diaktifkan.

3. Provider ongkir/pengiriman, cakupan wilayah, dan aturan biaya.

4. Kebijakan retur, penukaran ukuran, pembatalan, dan refund.

5. Apakah checkout guest menjadi default (rekomendasi MVP: ya).

6. Apakah fitur kode promo (`Punya kode promo?` di Ringkasan Order) masuk MVP atau ditunda.

7. Apakah notifikasi pesanan dikirim melalui email, WhatsApp, atau keduanya.

8. Minimum jumlah SKU dan kelengkapan konten sebelum launch.

## 13. Rencana Rilis MVP

### Tahap 0 — Discovery dan validasi

* Wawancara 5–8 calon pengguna.

* Uji prototipe alur kategori → detail → size guide → cart → checkout.

* Validasi pemahaman size chart dan respons terhadap *tone of voice* Gen Z.

* Tetapkan provider pembayaran/pengiriman dan kebijakan operasional.

### Tahap 1 — Foundation

* Setup design system (tipografi Serif + Sans-serif, palet monokrom, komponen garis hairline), struktur data produk, varian, dan stok.

* Implementasi navigasi minimalis, editorial homepage, dan katalog.

### Tahap 2 — Shopping flow

* Detail produk (galeri, color swatches, accordion info) dan size guide.

* Cart (split layout dengan Ringkasan Order) dan kalkulasi biaya.

* Checkout tiga langkah dan integrasi pembayaran/pengiriman.

### Tahap 3 — Quality dan launch

* QA responsive, accessibility, security, dan performance.

* Uji skenario stok habis, stok berubah, pembayaran gagal, refresh, dan double submit.

* Soft launch, pantau funnel, perbaiki hambatan terbesar.

## 14. Definition of Done

MVP dinyatakan siap rilis ketika:

* Semua fitur Must pada scope MVP telah lolos acceptance criteria.

* Tidak ada bug blocker/critical pada alur pembelian.

* Total checkout diverifikasi ulang di server.

* Produk habis dan varian tidak tersedia ditangani dengan benar.

* Size guide dapat digunakan di mobile dan keyboard.

* Seluruh *microcopy* UI sudah mengikuti panduan Bahasa Indonesia gaul Gen Z secara konsisten.

* Layout lulus pengujian pada mobile, tablet, dan desktop tanpa kerusakan pada komposisi tipografi maupun grid.

* Target performa katalog diuji dengan skenario dan perangkat yang disepakati.

* Event analytics utama tercatat tanpa data pribadi.

## 15. User Stories dan Acceptance Criteria Ringkas

1. **Sebagai pengunjung**, saya ingin melihat produk terbaru dalam tampilan editorial yang bersih agar bisa menemukan inspirasi outfit.

   *Given* homepage dibuka, *when* konten selesai dimuat, *then* editorial hero, kategori, dan kurasi *New Arrival* terlihat serta dapat dibuka.

2. **Sebagai pengunjung**, saya ingin memfilter Pria/Wanita agar katalog lebih relevan.

   *Given* katalog tampil, *when* kategori dipilih, *then* hanya produk kategori tersebut yang ditampilkan.

3. **Sebagai calon pembeli**, saya ingin melihat size guide agar lebih yakin memilih ukuran.

   *Given* detail produk dibuka, *when* size guide dipilih, *then* tabel ukuran dalam cm dan instruksi pengukuran tampil.

4. **Sebagai pembeli**, saya ingin memilih warna dan ukuran lalu menambahkannya ke keranjang.

   *Given* varian tersedia, *when* warna/ukuran dipilih dan tombol *Masukin Keranjang* ditekan, *then* item masuk keranjang dan jumlah item di header diperbarui.

5. **Sebagai pembeli**, saya ingin mengubah qty dan melihat total baru secara langsung di *Ringkasan Order*.

   *Given* item ada di cart, *when* qty diubah atau item dihapus, *then* subtotal dan total diperbarui secara realtime.

6. **Sebagai pembeli**, saya ingin checkout dalam tiga langkah.

   *Given* cart berisi item valid, *when* checkout diselesaikan dan server menerima transaksi, *then* nomor pesanan dan konfirmasi tampil.

## 16. Rekomendasi Product Manager

Kombinasi visual **Editorial Luxury Minimalist** dengan *copywriting* **Bahasa Indonesia gaul Gen Z** memberikan kontras yang menarik dan relevan dengan target pasar 18–30 tahun. Pastikan bahasa tetap natural dan tidak berlebihan agar kesan kurasi yang rapi tetap terjaga.

Urutan keputusan paling penting:

1. Kunci standar pengukuran size chart dan pedoman fotografi produk agar visual katalog konsisten seperti referensi desain.

2. Tentukan provider pembayaran, pengiriman, dan kebijakan retur.

3. Pastikan model stok per ukuran dan warna (*color swatches*).

4. Uji prototipe alur belanja dengan pengguna mobile (terutama keterbacaan judul serif, posisi *Ringkasan Order*, dan *vibe* copywriting-nya).

5. Finalisasi implementasi.