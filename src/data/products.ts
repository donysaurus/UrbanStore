import { PaymentMethod, Product, ShippingMethod } from '../types';

export const HERO_MEDIA = {
  look01:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAPcyrLq0siuedj3fuqXjUMOwtJ7aBCuJUxL-hCpDQctSG1XOkT1CPXVxGesfFMyWpoobZYcnKqCVzbYd7spsjnNqk-Os2wcbaazzkLZwWntpfUUk6VdsI4lXDF8zVJxccL-VkdfU9xiQU-xnXD2shISRq2PYSAYj4fq5rdcSu1FQTYzXWR0_Ly3qUDMLVaX84F9fCnJvxmmY-sI92-SJnLdrs_8gDe_hWPdi8bT-c',
  look07:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCRBDv4dtAIb3kKpIGgXrWii11VWRv4T3PBVhQm3n-tYc4DunPTfiALWHIZsjkTsS44NvmVjRqDpEkrv0kcCHx_uDIaOQiIpJdz0gw8-0nozfebnAVElhP5P6y-ZcSbcaFVJOj7PFPxtWWdR7muFmOI8XGY-xz_iMY_a9YXjqWkoH3TF-kM8eXWhUjevNNB1oPlykM6CSU4wqH8an2hWGauTigof3wINT8sogSscrk',
  rackEditorial:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCMp9yHmivn9LsKLRhg6C0WPPcEiktuUYHYV_jD9uiXsmnopk_cboG91Js0cvqUZmoSnqIHFDrQH0WVwVwyAJXvvU_XRdXe1UsCSAplE8vGCkAqg84rR7K1VYkUZQL2tkjDvEQuMCSPCxopLYj0r6S-i_QOKcW3AQrPkjNKMqAne1GSv1fJYIIlhU6J0g_0ox6YmVTgy7zknTaavm1fg7yVKhOKHpwrCB0fzLr3ubo',
  footerEditorial:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCLVqaCar976PapTyi46rHJqHWICCO-5QFWIznjs8iAboS4FthBB-h0svBAF2qirpJj7EZJvpJpTGm4G8FmFe8Ml5wSVr1AB85B4IOtoX97i9kaZYM4qGQmMruei4pWMseQor4jOuEZ5Svfv3TpIFm9NejjrD0lPhSLleGo4i0HOqOXEsKW5fHoFSLZZ-E-fP8eLuIRthpoejC3SqmdeYzHBitYggLHmAky9G84yWg',
  catPria:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAqgwpOFPDPdoIkxgrqftv1Q7GEAGf5lwggcb_qzC-26hB5fdbutl_-gpI2N5NQYRaKAI8kqPoHPn5qeABduYiAW3-W05O4LfMjYF8yMs8iALW2iMdNGYXrXSOSNgbkockKyUGcBBtqv7nmn5vWfVqZumf07LECMtLK9WZQre8Z3Xz6sWhp6s7sh7b5q2RgFFDhYQpbrX3iXvbF8j7IzyfT5qWw0XhnbYTNlHCTj-g',
  catWanita:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPi7SxrImWcIMaLZATfH2fv45FgMp3N7V87G7MPjTHdrMCPemqHwMhRNpRkDOkkEPKrzZizusD0-3L_g25lQZyAbe_QWoXs0vD0UqXlMLL9ngZF3yB4rCwCjwebhJy6_wu3y6PZhptxBENjql4QQNH8YeBIJyzJr1OZohuiHD163Fk23doEktn2353Hih57a5be0k6rYuGQ2RmxPhg2moFf1b66Vbmwf0SVbClvSA',
  catOuterwear:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCCcgXQAA_4UFi4DBjWrIMQJjTs4VcVDcDUOTtjZGJLVjYmmSD8ReXR0Dx8CWI4MBEjJmKvAPv_Q3KaDhDxDrUv01WpWJnHWOOruExJaWmbFXH4uNe4-gxtmflZDKBfrZd4HVxMi1Pj1Um-NhngyGRSMGiU76kViJEZaVNobW2DRgj9l5V572KWoSe8xv4P6Ps9UfOJaqzhxUiT2c1vO63mQI_4R3eB9YVI1QV0KWI',
};

// Produk dikosongkan — seluruh produk real dikelola oleh Admin melalui Supabase.
export const PRODUCTS: Product[] = [];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'reguler',
    name: 'Kurir Reguler (JNE / J&T)',
    eta: 'Estimasi 2–3 hari kerja',
    fee: 18000,
    description: 'Gratis ongkir otomatis untuk total belanja di atas Rp499.000.',
  },
  {
    id: 'express',
    name: 'SiCepat Best / Next Day',
    eta: 'Estimasi 1–2 hari kerja',
    fee: 29000,
    description: 'Prioritas kirim cepat dengan tracking real-time via WhatsApp.',
  },
  {
    id: 'instant',
    name: 'Instant Same-Day (Jabodetabek)',
    eta: 'Tiba hari ini (order sebelum 15:00 WIB)',
    fee: 45000,
    description: 'Dikirim langsung dari studio gudang Jakarta Selatan.',
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS Instan',
    subtitle: 'Bayar sat-set dari m-Banking, GoPay, OVO, Dana, atau ShopeePay',
    badge: 'Otomatis Verifikasi',
  },
  {
    id: 'va',
    name: 'Virtual Account (BCA / Mandiri / BNI)',
    subtitle: 'Transfer langsung tanpa perlu upload bukti bayar manual',
  },
  {
    id: 'cod',
    name: 'COD (Bayar di Tempat)',
    subtitle: 'Bayar tunai ke kurir saat paket sampai (maks. order Rp1.500.000)',
  },
];
