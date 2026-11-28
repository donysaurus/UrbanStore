export interface CompressedImageResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  compressedSize: number;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DIMENSION_PX = 1400;
const WEBP_QUALITY = 0.82;

/**
 * Validates any image format up to 5 MB, resizes if needed,
 * compresses it, and converts it to WebP in the browser.
 */
export async function compressImageToWebP(file: File): Promise<CompressedImageResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File harus berupa gambar (JPG, PNG, WebP, GIF, dll).');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Gagal membaca file gambar.'));
      image.src = objectUrl;
    });

    let { width, height } = img;
    if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
      const ratio = Math.min(MAX_DIMENSION_PX / width, MAX_DIMENSION_PX / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser tidak mendukung canvas untuk kompresi gambar.');
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error('Gagal mengonversi gambar ke format WebP.'));
        },
        'image/webp',
        WEBP_QUALITY
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-') || 'product';
    const fileName = `${baseName}-${Date.now()}.webp`;

    return {
      blob,
      fileName,
      originalSize: file.size,
      compressedSize: blob.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
