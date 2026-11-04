/**
 * Tiện ích nén ảnh tự động sang định dạng WebP (< 150KB) ngay trên trình duyệt của Admin
 * trước khi upload lên Supabase Storage.
 * -> Giúp 1GB Storage Free của Supabase chứa được hơn 8.000 tấm ảnh sản phẩm!
 */
export interface CompressedImageResult {
  blob: Blob;
  fileName: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  width: number;
  height: number;
}

export async function compressImageToWebP(
  file: File,
  maxWidth = 1200,
  maxSizeKB = 150
): Promise<CompressedImageResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Không thể khởi tạo bộ xử lý ảnh Canvas'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Giảm dần chất lượng từ 0.82 xuống đến khi đạt ngưỡng < maxSizeKB (150KB)
      let quality = 0.82;
      let blob: Blob | null = null;

      while (quality >= 0.4) {
        blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob((b) => res(b), 'image/webp', quality)
        );
        if (blob && blob.size / 1024 <= maxSizeKB) {
          break;
        }
        quality -= 0.1;
      }

      if (!blob) {
        reject(new Error('Lỗi khi nén ảnh sang định dạng WebP'));
        return;
      }

      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const fileName = `${cleanBaseName || 'mang-co-pvc'}-${Date.now()}.webp`;

      resolve({
        blob,
        fileName,
        originalSizeKB,
        compressedSizeKB: Math.max(1, Math.round(blob.size / 1024)),
        width,
        height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc file hình ảnh'));
    };

    img.src = objectUrl;
  });
}

