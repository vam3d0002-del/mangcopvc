'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { CACHE_TAGS } from '@/lib/cache';
import {
  dbCheckSupabaseTables,
  dbCreateInquiry,
  dbDeleteCategory,
  dbDeleteInquiry,
  dbDeletePost,
  dbDeleteProduct,
  dbGetSiteSettings,
  dbUpdateInquiryStatus,
  dbUpdateSiteSettings,
  dbUpsertCategory,
  dbUpsertPost,
  dbUpsertProduct,
  SupabaseTablesReport,
} from '@/lib/db';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { GoogleDriveBackupConfig } from '@/types/database';
import {
  generateFullBackupZipBuffer,
  testGoogleDriveConnection,
  uploadBackupToGoogleDrive,
} from '@/lib/google-drive';
import {
  parseSpecsFromInput,
  renderMarkdownOrHtml,
  stripMarkdownToPlainText,
} from '@/lib/markdown';

function slugifyVi(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function ensureAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

export async function loginAdminAction(formData: FormData) {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase();
  const password = ((formData.get('password') as string) || '').trim();

  if (!email || !password) {
    return {
      ok: false,
      message: 'Vui lòng nhập đầy đủ Email và Mật khẩu quản trị!',
    };
  }

  const expectedEmail = (
    process.env.ADMIN_EMAIL || 'admin@mangcopvc.com'
  )
    .trim()
    .toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const validEmails = new Set([
    expectedEmail,
    'admin@mangcopvc.com',
    'caovanthinh2012@gmail.com',
  ]);

  let isValid = validEmails.has(email) && password === expectedPassword;

  // Hỗ trợ thêm đăng nhập qua tài khoản Supabase Auth nếu có
  if (!isValid && isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error && data?.user) {
          isValid = true;
        }
      }
    } catch {
      // Bỏ qua lỗi nếu Supabase Auth chưa bật
    }
  }

  if (!isValid) {
    return {
      ok: false,
      message: 'Email hoặc mật khẩu quản trị không chính xác!',
    };
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });
  cookieStore.set('admin_email', email, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true, message: 'Đăng nhập thành công!' };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  cookieStore.delete('admin_email');
  return { ok: true };
}

export async function triggerOnDemandRevalidationAction(
  target: 'all' | 'products' | 'posts' | 'categories' | 'settings' = 'all'
) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Chưa đăng nhập quyền Admin' };
  }

  if (target === 'all' || target === 'products') {
    revalidateTag(CACHE_TAGS.PRODUCTS, 'max');
    revalidatePath('/san-pham');
  }

  if (target === 'all' || target === 'categories') {
    revalidateTag(CACHE_TAGS.CATEGORIES, 'max');
  }

  if (target === 'all' || target === 'posts') {
    revalidateTag(CACHE_TAGS.POSTS, 'max');
    revalidatePath('/tin-tuc');
    revalidatePath('/kien-thuc-mang-co-nhiet');
    revalidatePath('/mang-co-nhiet');
    revalidatePath('/mang-co-pvc');
    revalidatePath('/mang-co-pof');
    revalidatePath('/mang-co-pe');
  }

  if (target === 'all' || target === 'settings') {
    revalidateTag(CACHE_TAGS.SETTINGS, 'max');
    revalidatePath('/gioi-thieu');
    revalidatePath('/lien-he');
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/sitemap.xml');

  return {
    ok: true,
    message:
      'Đã xóa Cache cũ và đồng bộ dữ liệu mới từ Database lên toàn bộ Website tức thì!',
  };
}

// ============================================================================
// 1. CRUD SẢN PHẨM (CREATE + UPDATE + DELETE)
// ============================================================================
export async function saveProductAction(formData: FormData) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const id = (formData.get('id') as string)?.trim() || undefined;
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { ok: false, message: 'Tên sản phẩm không được để trống' };
  }

  const slug =
    (formData.get('slug') as string)?.trim() || slugifyVi(name);
  const category_id =
    (formData.get('category_id') as string)?.trim() || 'cat-pvc';
  const sku = (formData.get('sku') as string)?.trim() || undefined;
  const price_label =
    (formData.get('price_label') as string)?.trim() || 'Liên hệ báo giá sỉ';
  const rawShortDesc =
    (formData.get('short_description') as string)?.trim() || '';
  const rawContent = (formData.get('content') as string)?.trim() || '';

  const short_description =
    stripMarkdownToPlainText(rawShortDesc) ||
    stripMarkdownToPlainText(rawContent).slice(0, 180) ||
    name;

  const content = renderMarkdownOrHtml(rawContent || rawShortDesc || name);
  const thumbnail_url =
    (formData.get('thumbnail_url') as string)?.trim() ||
    '/media/products/mang-co-pvc-cuon.webp';
  const is_featured = formData.get('is_featured') === 'true';
  const seo_title = (formData.get('seo_title') as string)?.trim() || name;
  const seo_description =
    (formData.get('seo_description') as string)?.trim() || short_description;

  const specsRaw = (formData.get('specs_json') as string)?.trim() || '';
  const specs = parseSpecsFromInput(specsRaw);

  const res = await dbUpsertProduct({
    id,
    category_id,
    name,
    slug,
    sku,
    price_label,
    short_description,
    content,
    specs,
    thumbnail_url,
    is_featured,
    seo_title,
    seo_description,
  });

  if (res.ok) {
    await triggerOnDemandRevalidationAction('products');
    revalidatePath(`/san-pham/${slug}`);
  }

  return res;
}

export const createProductAction = saveProductAction;

export async function deleteProductAction(idOrSlug: string) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const res = await dbDeleteProduct(idOrSlug);
  if (res.ok) {
    await triggerOnDemandRevalidationAction('products');
  }
  return res;
}

// ============================================================================
// 2. CRUD BÀI VIẾT SEO (CREATE + UPDATE + DELETE)
// ============================================================================
export async function savePostAction(formData: FormData) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const id = (formData.get('id') as string)?.trim() || undefined;
  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { ok: false, message: 'Tiêu đề bài viết không được để trống' };
  }

  const slug =
    (formData.get('slug') as string)?.trim() || slugifyVi(title);
  const category_name =
    (formData.get('category_name') as string)?.trim() || 'Màng Co PVC';
  const rawExcerpt = (formData.get('excerpt') as string)?.trim() || '';
  const rawContent = (formData.get('content') as string)?.trim() || '';

  const excerpt =
    stripMarkdownToPlainText(rawExcerpt) ||
    stripMarkdownToPlainText(rawContent).slice(0, 180) ||
    title;
  const content = renderMarkdownOrHtml(rawContent || rawExcerpt || title);
  const thumbnail_url =
    (formData.get('thumbnail_url') as string)?.trim() ||
    '/media/products/mang-co-pvc-cuon.webp';
  const reading_time = Number(formData.get('reading_time') || 4);
  const seo_title = (formData.get('seo_title') as string)?.trim() || title;
  const seo_description =
    (formData.get('seo_description') as string)?.trim() || excerpt;

  const res = await dbUpsertPost({
    id,
    title,
    slug,
    category_name,
    excerpt,
    content,
    thumbnail_url,
    reading_time,
    seo_title,
    seo_description,
  });

  if (res.ok) {
    await triggerOnDemandRevalidationAction('posts');
    revalidatePath(`/tin-tuc/${slug}`);
  }

  return res;
}

export const createPostAction = savePostAction;

export async function deletePostAction(idOrSlug: string) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const res = await dbDeletePost(idOrSlug);
  if (res.ok) {
    await triggerOnDemandRevalidationAction('posts');
  }
  return res;
}

// ============================================================================
// 3. CRUD DANH MỤC (CREATE + UPDATE + DELETE)
// ============================================================================
export async function saveCategoryAction(formData: FormData) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const id = (formData.get('id') as string)?.trim() || undefined;
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { ok: false, message: 'Tên danh mục không được để trống' };
  }

  const slug =
    (formData.get('slug') as string)?.trim() || slugifyVi(name);
  const description = (formData.get('description') as string)?.trim() || null;
  const image_url = (formData.get('image_url') as string)?.trim() || null;
  const sort_order = Number(formData.get('sort_order') || 1);

  const res = await dbUpsertCategory({
    id,
    name,
    slug,
    description,
    image_url,
    sort_order,
  });

  if (res.ok) {
    await triggerOnDemandRevalidationAction('categories');
  }
  return res;
}

export async function deleteCategoryAction(id: string) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const res = await dbDeleteCategory(id);
  if (res.ok) {
    await triggerOnDemandRevalidationAction('categories');
  }
  return res;
}

// ============================================================================
// 4. CẤU HÌNH WEBSITE (SITE SETTINGS)
// ============================================================================
export async function saveSiteSettingsAction(formData: FormData) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const hotline = (formData.get('hotline') as string)?.trim() || '';
  const cleanPhone = hotline.replace(/\s|\./g, '');
  const rawZalo = ((formData.get('zalo') as string)?.trim() || '').replace(
    /\s|\./g,
    ''
  );
  const zalo =
    !rawZalo ||
    ((rawZalo === '0907616611' || rawZalo === '0932636239') &&
      cleanPhone !== rawZalo)
      ? cleanPhone
      : rawZalo;

  const res = await dbUpdateSiteSettings({
    company_name: (formData.get('company_name') as string)?.trim(),
    short_name: (formData.get('short_name') as string)?.trim(),
    hotline,
    zalo,
    email: (formData.get('email') as string)?.trim(),
    address: (formData.get('address') as string)?.trim(),
    seo_title: (formData.get('seo_title') as string)?.trim(),
    seo_description: (formData.get('seo_description') as string)?.trim(),
    banner_url: (formData.get('banner_url') as string)?.trim() || null,
  });

  if (res.ok) {
    await triggerOnDemandRevalidationAction('settings');
  }
  return res;
}

export async function saveBannersAction(formData: FormData): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }

  const hero_banner_url =
    (formData.get('hero_banner_url') as string)?.trim() || null;
  const about_banner_url =
    (formData.get('about_banner_url') as string)?.trim() || null;

  const res = await dbUpdateSiteSettings({
    hero_banner_url,
    about_banner_url,
    banner_url: about_banner_url,
  });

  if (res.ok) {
    await triggerOnDemandRevalidationAction('settings');
    revalidatePath('/');
    revalidatePath('/gioi-thieu');
  }
  return {
    ok: res.ok,
    message: res.ok
      ? 'Đã cập nhật thành công cả 2 vị trí Banner (Trang chủ & Trang giới thiệu)!'
      : res.message,
  };
}

// ============================================================================
// 5. QUẢN LÝ YÊU CẦU BÁO GIÁ (INQUIRIES)
// ============================================================================
export async function submitInquiryAction(formData: FormData) {
  const customer_name = (formData.get('customer_name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const company = (formData.get('company') as string)?.trim() || null;
  const product_interest =
    (formData.get('product_interest') as string)?.trim() || null;
  const quantity_note =
    (formData.get('quantity_note') as string)?.trim() || null;
  const message = (formData.get('message') as string)?.trim() || null;

  if (!customer_name || !phone) {
    return {
      ok: false,
      message: 'Vui lòng nhập Họ tên và Số điện thoại liên hệ.',
    };
  }

  return dbCreateInquiry({
    customer_name,
    phone,
    company,
    product_interest,
    quantity_note,
    message,
  });
}

export async function submitCustomerInquiry(payload: {
  customer_name: string;
  phone: string;
  company?: string;
  product_interest?: string;
  quantity_note?: string;
  message?: string;
}) {
  const fd = new FormData();
  fd.set('customer_name', payload.customer_name || '');
  fd.set('phone', payload.phone || '');
  fd.set('company', payload.company || '');
  fd.set('product_interest', payload.product_interest || '');
  fd.set('quantity_note', payload.quantity_note || '');
  fd.set('message', payload.message || '');
  return submitInquiryAction(fd);
}

export async function updateInquiryStatusAction(
  id: string,
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'completed'
) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }
  const res = await dbUpdateInquiryStatus(id, status);
  revalidatePath('/admin');
  return res;
}

export async function deleteInquiryAction(id: string) {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Không có quyền thực hiện' };
  }
  const res = await dbDeleteInquiry(id);
  revalidatePath('/admin');
  return res;
}

// ============================================================================
// 6. ĐỒNG BỘ DỮ LIỆU TỪ SUPABASE STORAGE SANG CÁC BẢNG SQL
// ============================================================================
export async function seedInitialDataAction() {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Chưa đăng nhập quyền Admin' };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: 'Chưa cấu hình khóa Supabase trong file .env.local',
    };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  // Đọc dữ liệu backup từ Supabase Storage 'app-db/database.json'
  const { data, error } = await supabase.storage
    .from('app-db')
    .download('database.json');

  if (error || !data) {
    return {
      ok: false,
      message: 'Không tìm thấy dữ liệu trên Supabase Storage app-db/database.json',
    };
  }

  try {
    const text = await data.text();
    const cloud = JSON.parse(text);

    if (cloud.site_settings) {
      await dbUpdateSiteSettings(cloud.site_settings);
    }
    if (Array.isArray(cloud.categories)) {
      for (const cat of cloud.categories) {
        await dbUpsertCategory(cat);
      }
    }
    if (Array.isArray(cloud.products)) {
      for (const prod of cloud.products) {
        await dbUpsertProduct(prod);
      }
    }
    if (Array.isArray(cloud.posts)) {
      for (const post of cloud.posts) {
        await dbUpsertPost(post);
      }
    }

    await triggerOnDemandRevalidationAction('all');

    return {
      ok: true,
      message: `Đã đồng bộ trực tiếp ${cloud.categories?.length || 0} danh mục, ${cloud.products?.length || 0} sản phẩm và ${cloud.posts?.length || 0} bài viết từ Supabase Storage sang các bảng SQL!`,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      message: `Lỗi đồng bộ: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ============================================================================
// 7. KIỂM TRA TRẠNG THÁI CÁC BẢNG SUPABASE
// ============================================================================
export async function checkSupabaseTablesAction(): Promise<SupabaseTablesReport> {
  return dbCheckSupabaseTables();
}

// ============================================================================
// 8. TỔ CHỨC CÂY THƯ MỤC STORAGE THEO LOẠI VÀ THEO NGÀY ĐĂNG
// ============================================================================
export interface StorageFileItem {
  name: string;
  url: string;
  size?: number;
  updated_at?: string | null;
}

export interface StorageFolderGroup {
  folder: string; // "categories" | "posts" | "products" | "banners" | "uploads"
  dates: {
    date: string; // "YYYY-MM-DD"
    files: StorageFileItem[];
  }[];
  rootFiles: StorageFileItem[];
}

export async function getSupabaseStorageOverviewAction(): Promise<StorageFolderGroup[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const mainFolders = ['categories', 'products', 'posts', 'banners', 'uploads'];
  const result: StorageFolderGroup[] = [];

  for (const f of mainFolders) {
    const { data: items } = await supabase.storage.from('media').list(f, {
      sortBy: { column: 'name', order: 'desc' },
    });

    const rootFiles: StorageFileItem[] = [];
    const dates: { date: string; files: StorageFileItem[] }[] = [];

    for (const item of items || []) {
      if (item.id === null) {
        // Đây là thư mục con theo ngày (ví dụ: YYYY-MM-DD)
        const subfolder = `${f}/${item.name}`;
        const { data: subItems } = await supabase.storage
          .from('media')
          .list(subfolder, {
            sortBy: { column: 'name', order: 'desc' },
          });

        dates.push({
          date: item.name,
          files: (subItems || []).map((sf) => ({
            name: sf.name,
            url: `/media/${subfolder}/${sf.name}`,
            size: sf.metadata?.size,
            updated_at: sf.updated_at,
          })),
        });
      } else {
        rootFiles.push({
          name: item.name,
          url: `/media/${f}/${item.name}`,
          size: item.metadata?.size,
          updated_at: item.updated_at,
        });
      }
    }

    result.push({
      folder: f,
      dates,
      rootFiles,
    });
  }

  return result;
}

/**
 * Xóa vĩnh viễn 1 file khỏi Supabase Storage bucket 'media'
 */
export async function deleteSupabaseStorageFileAction(
  fileUrlOrPath: string
): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, message: 'Chưa kết nối Supabase Admin' };
  }

  let cleanPath = (fileUrlOrPath || '').trim();
  const marker = '/storage/v1/object/public/media/';
  const markerIdx = cleanPath.indexOf(marker);
  if (markerIdx !== -1) {
    cleanPath = cleanPath.substring(markerIdx + marker.length);
  } else if (cleanPath.startsWith('/media/')) {
    cleanPath = cleanPath.substring('/media/'.length);
  } else if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.substring('media/'.length);
  }

  // Bỏ gạch chéo đầu nếu có
  cleanPath = cleanPath.replace(/^\/+/, '');

  if (!cleanPath) {
    return { ok: false, message: 'Đường dẫn file ảnh không hợp lệ' };
  }

  const { error } = await supabase.storage.from('media').remove([cleanPath]);

  if (error) {
    return { ok: false, message: `Lỗi Supabase khi xóa ảnh: ${error.message}` };
  }

  return { ok: true, message: `Đã xóa ảnh "${cleanPath}" thành công khỏi Storage!` };
}

/**
 * Lưu cấu hình tự động sao lưu lên Google Drive
 */
export async function saveGoogleDriveConfigAction(
  config: GoogleDriveBackupConfig
): Promise<{ ok: boolean; message: string }> {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Chưa đăng nhập quyền Admin' };
  }

  const res = await dbUpdateSiteSettings({
    drive_backup_config: config,
  });

  return res;
}

/**
 * Kiểm tra kết nối tới Google Drive
 */
export async function testGoogleDriveConnectionAction(
  config: GoogleDriveBackupConfig
): Promise<{ ok: boolean; message: string; fileUrl?: string }> {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Chưa đăng nhập quyền Admin' };
  }

  return testGoogleDriveConnection(config);
}

/**
 * Kích hoạt sao lưu ngay lập tức lên Google Drive từ Admin Dashboard
 */
export async function triggerManualDriveBackupAction(): Promise<{
  ok: boolean;
  message: string;
  fileUrl?: string;
}> {
  if (!(await ensureAdmin())) {
    return { ok: false, message: 'Chưa đăng nhập quyền Admin' };
  }

  const settings = await dbGetSiteSettings();
  const config = settings.drive_backup_config;

  if (!config) {
    return { ok: false, message: 'Chưa thiết lập cấu hình Google Drive' };
  }

  try {
    const { zipBuffer, filename } = await generateFullBackupZipBuffer();
    const uploadRes = await uploadBackupToGoogleDrive(config, zipBuffer, filename);

    const nowIso = new Date().toISOString();
    const newConfig: GoogleDriveBackupConfig = {
      ...config,
      last_backup_at: nowIso,
      last_backup_status: uploadRes.ok ? 'success' : 'failed',
      last_backup_file: filename,
    };

    await dbUpdateSiteSettings({
      drive_backup_config: newConfig,
    });

    if (!uploadRes.ok) {
      return { ok: false, message: uploadRes.error || 'Lỗi tải file lên Google Drive' };
    }

    return {
      ok: true,
      message: `Đã sao lưu thành công tệp "${filename}" lên Google Drive!`,
      fileUrl: uploadRes.fileUrl,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Lỗi trong quá trình sao lưu',
    };
  }
}




