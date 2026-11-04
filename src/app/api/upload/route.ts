import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';

function sanitizeFileName(name: string): string {
  const withoutExt = name.replace(/\.[^/.]+$/, '');
  const clean = withoutExt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${clean || 'image'}.webp`;
}

function getVietnamDateString(): string {
  // Lấy ngày chuẩn YYYY-MM-DD theo múi giờ Việt Nam (UTC+7)
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * API UPLOAD ẢNH WEBP (<150KB) LÊN SUPABASE STORAGE
 * - Tự động phân tách thư mục theo loại: `products/`, `posts/`, `banners/`, `uploads/`
 * - Tự động tách thư mục con theo ngày đăng: `[loai]/[YYYY-MM-DD]/[ten-file].webp`
 * - Bắt buộc định dạng image/webp (.webp) trước khi đẩy lên Supabase Storage
 * - Thiết lập `cacheControl: '31536000'` (1 năm)
 * - Trả về đường dẫn CDN Proxy `/media/...`
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: 'Bạn cần đăng nhập quyền Admin để upload ảnh.' },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json(
      { ok: false, error: 'Không tìm thấy file ảnh.' },
      { status: 400 }
    );
  }

  // Bắt buộc ảnh phải được nén sang WebP từ webapp trước khi gửi lên
  const isWebP =
    file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
  if (!isWebP) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Chỉ chấp nhận định dạng ảnh WebP (.webp). Hệ thống sẽ tự động đổi ảnh sang WebP trước khi tải lên.',
      },
      { status: 400 }
    );
  }

  // Bảo vệ cứng: Không nhận ảnh vượt quá 500KB (Vì trình duyệt đã tự nén WebP xuống <150KB)
  if (file.size > 512 * 1024) {
    return NextResponse.json(
      { ok: false, error: 'Dung lượng ảnh vượt quá giới hạn 500KB.' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Chưa cấu hình khóa Supabase trong file .env.local',
      },
      { status: 500 }
    );
  }

  const supabase = getSupabaseAdminClient()!;
  const arrayBuffer = await file.arrayBuffer();

  // Xác định thư mục chính (products, posts, banners, uploads)
  const folderInput = (
    (formData.get('folder') as string) ||
    (formData.get('type') as string) ||
    ''
  ).trim().toLowerCase();

  let baseFolder = 'uploads';
  if (['category', 'categories', 'danh-muc'].includes(folderInput)) {
    baseFolder = 'categories';
  } else if (['product', 'products'].includes(folderInput)) {
    baseFolder = 'products';
  } else if (['post', 'posts', 'article', 'blog', 'tin-tuc'].includes(folderInput)) {
    baseFolder = 'posts';
  } else if (['banner', 'banners'].includes(folderInput)) {
    baseFolder = 'banners';
  } else if (folderInput) {
    baseFolder = folderInput.replace(/[^a-z0-9_-]/g, '');
  }

  // Xác định thư mục con theo ngày đăng (YYYY-MM-DD)
  const dateInput = ((formData.get('date') as string) || '').trim();
  let dateFolder = getVietnamDateString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    dateFolder = dateInput;
  } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateInput)) {
    dateFolder = dateInput.replace(/\//g, '-');
  }

  // Tên file sạch không dấu tiếng Việt
  const cleanFileName = sanitizeFileName(file.name);
  const filePath = `${baseFolder}/${dateFolder}/${cleanFileName}`;

  let { error } = await supabase.storage
    .from('media')
    .upload(filePath, arrayBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000', // Cache 1 năm
      upsert: true,
    });

  if (error && error.message.includes('Bucket not found')) {
    await supabase.storage.createBucket('media', {
      public: true,
      fileSizeLimit: 2097152,
      allowedMimeTypes: ['image/webp'],
    });
    const retry = await supabase.storage
      .from('media')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });
    error = retry.error;
  }

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    url: `/media/${filePath}`,
    folder: baseFolder,
    dateFolder: dateFolder,
    filePath: filePath,
    sizeKB: Math.round((file.size / 1024) * 10) / 10,
    message: `Đã lưu ảnh WebP vào Supabase Storage: media/${filePath}`,
  });
}
