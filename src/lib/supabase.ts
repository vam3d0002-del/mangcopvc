import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Kiểm tra xem người dùng đã điền biến môi trường Supabase chưa.
 * Nếu chưa điền, hệ thống tự động chạy ở chế độ Demo (Mock Data) để không bao giờ bị lỗi crash.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseUrl.startsWith('http') &&
      !supabaseUrl.includes('your-project-id') &&
      supabaseAnonKey
  );
}

let cachedPublicClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

/**
 * Client dùng cho việc đọc dữ liệu công khai (Tuân thủ RLS, an toàn tuyệt đối)
 */
export function getSupabasePublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cachedPublicClient) {
    cachedPublicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return cachedPublicClient;
}

/**
 * Client quyền Admin (Service Role) CHỈ dùng ở Server Actions / API Routes
 * để thêm/sửa/xóa sản phẩm, bài viết và quản lý báo giá.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl, key, {
      auth: { persistSession: false },
    });
  }
  return cachedAdminClient;
}

/**
 * Chuyển đổi link Supabase Storage gốc sang đường dẫn Proxy `/media/...`
 * để tận dụng 100GB băng thông CDN của Vercel thay vì tốn 5GB Egress của Supabase Free.
 */
export function toCdnMediaUrl(url: string): string {
  if (!url) return '';
  const marker = '/storage/v1/object/public/media/';
  const idx = url.indexOf(marker);
  let formatted = url;
  if (idx !== -1) {
    const relativePath = url.substring(idx + marker.length);
    formatted = `/media/${relativePath}`;
  }
  // Safeguard: Tự động chuẩn hóa nếu link bài viết bị lưu nhầm /media/products/post- -> /media/posts/post-
  if (formatted.startsWith('/media/products/post-')) {
    formatted = formatted.replace('/media/products/post-', '/media/posts/post-');
  }
  return formatted;
}

