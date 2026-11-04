import {
  Category,
  Inquiry,
  PostDetail,
  ProductDetail,
  SiteSettings,
} from '@/types/database';
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  toCdnMediaUrl,
} from '@/lib/supabase';

const DB_BUCKET = 'app-db';

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  id: 1,
  company_name: 'Cao Vạn Thịnh',
  short_name: 'Cao Vạn Thịnh',
  hotline: '0907 616 611',
  zalo: '0907616611',
  email: 'caovanthinh2012@gmail.com',
  address: '1004/12 Hương Lộ 2, phường Bình Trị Đông, Thành phố Hồ Chí Minh',
  seo_title:
    'Màng Co PVC, POF, PE – Cung cấp màng co nhiệt cho đóng gói | Cao Vạn Thịnh',
  seo_description:
    'Cung cấp màng co PVC, màng co POF, màng co PE và màng co nhiệt cho đóng gói. Tư vấn chọn đúng loại màng, khổ và độ dày theo sản phẩm và máy co bạn đang dùng.',
  banner_url: '/media/banners/banner-mang-co.webp',
  hero_banner_url: '/media/products/hero-mang-co.webp',
  about_banner_url: '/media/banners/banner-mang-co.webp',
  updated_at: new Date().toISOString(),
};

interface CloudDbState {
  site_settings: SiteSettings;
  categories: Category[];
  products: ProductDetail[];
  posts: PostDetail[];
  inquiries: Inquiry[];
}

function getInitialSeedState(): CloudDbState {
  return {
    site_settings: FALLBACK_SITE_SETTINGS,
    categories: [],
    products: [],
    posts: [],
    inquiries: [],
  };
}

/**
 * Đảm bảo bucket lưu trữ dữ liệu trên Supabase hoạt động ngay cả khi bảng SQL chưa chạy
 * và tự động khởi tạo dữ liệu ban đầu trên Supabase Cloud.
 */
async function readSupabaseCloudStore(): Promise<CloudDbState> {
  const admin = getSupabaseAdminClient();
  if (!admin) return getInitialSeedState();

  const { data, error } = await admin.storage
    .from(DB_BUCKET)
    .download('database.json');

  if (error || !data) {
    // Tự động tạo bucket 'app-db' và đẩy dữ liệu gốc lên Supabase lần đầu
    await admin.storage.createBucket(DB_BUCKET, { public: false }).catch(() => {});
    const seed = getInitialSeedState();
    await writeSupabaseCloudStore(seed);
    return seed;
  }

  try {
    const text = await data.text();
    return JSON.parse(text) as CloudDbState;
  } catch {
    return getInitialSeedState();
  }
}

async function writeSupabaseCloudStore(state: CloudDbState): Promise<void> {
  const admin = getSupabaseAdminClient();
  if (!admin) return;

  const buffer = Buffer.from(JSON.stringify(state, null, 2), 'utf-8');
  const { error } = await admin.storage
    .from(DB_BUCKET)
    .upload('database.json', buffer, {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true,
    });

  if (error && error.message.includes('Bucket not found')) {
    await admin.storage.createBucket(DB_BUCKET, { public: false }).catch(() => {});
    await admin.storage.from(DB_BUCKET).upload('database.json', buffer, {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true,
    });
  }
}

function isTableMissingError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === 'PGRST205' ||
    err.code === '42P01' ||
    Boolean(err.message?.includes('Could not find the table'))
  );
}

// ============================================================================
// 1. SITE SETTINGS (READ & UPDATE)
// ============================================================================
export async function dbGetSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      return data as SiteSettings;
    }
    if (!isTableMissingError(error) && error?.code === 'PGRST116') {
      // Bảng đã tạo nhưng chưa có dòng id=1 -> Tự nạp lên bảng SQL
      const seed = FALLBACK_SITE_SETTINGS;
      const admin = getSupabaseAdminClient();
      if (admin) {
        await admin.from('site_settings').upsert(seed, { onConflict: 'id' });
      }
      return seed;
    }
  }

  const store = await readSupabaseCloudStore();
  return store.site_settings;
}

export async function dbUpdateSiteSettings(
  payload: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const current = await dbGetSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...payload,
    id: 1,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from('site_settings')
    .upsert(updated, { onConflict: 'id' });

  if (error && !isTableMissingError(error)) {
    return { ok: false, message: `Lỗi Supabase: ${error.message}` };
  }

  const store = await readSupabaseCloudStore();
  store.site_settings = updated;
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã lưu Cấu hình Website lên Database thành công!' };
}

// ============================================================================
// 2. CATEGORIES (FULL CRUD)
// ============================================================================
export async function dbGetCategories(): Promise<Category[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, sort_order')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      if (data.length === 0) {
        const store = await readSupabaseCloudStore();
        return store.categories;
      }
      return data as Category[];
    }
  }

  const store = await readSupabaseCloudStore();
  return store.categories.sort((a, b) => a.sort_order - b.sort_order);
}

export async function dbUpsertCategory(
  cat: Partial<Category> & { name: string; slug: string }
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  const existingIdx = store.categories.findIndex(
    (c) => c.id === cat.id || c.slug === cat.slug
  );

  const record: Category = {
    id:
      cat.id ||
      (existingIdx >= 0 ? store.categories[existingIdx].id : `cat-${Date.now()}`),
    name: cat.name,
    slug: cat.slug,
    description: cat.description || null,
    image_url: cat.image_url || null,
    sort_order: Number(cat.sort_order ?? store.categories.length + 1),
  };

  const { error } = await admin.from('categories').upsert(
    {
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      image_url: record.image_url,
      sort_order: record.sort_order,
    },
    { onConflict: 'slug' }
  );

  if (error && !isTableMissingError(error)) {
    return { ok: false, message: `Lỗi Supabase: ${error.message}` };
  }

  if (existingIdx >= 0) {
    store.categories[existingIdx] = record;
  } else {
    store.categories.push(record);
  }
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã lưu Danh mục lên Database thành công!' };
}

export async function dbDeleteCategory(
  id: string
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  const target = store.categories.find((c) => c.id === id);

  if (target) {
    await admin.from('categories').delete().eq('slug', target.slug);
  }
  await admin.from('categories').delete().eq('id', id);

  store.categories = store.categories.filter((c) => c.id !== id);
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã xóa Danh mục khỏi Database!' };
}

// ============================================================================
// 3. PRODUCTS (FULL CRUD)
// ============================================================================
export async function dbGetProducts(): Promise<ProductDetail[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        ...item,
        thumbnail_url: toCdnMediaUrl(item.thumbnail_url),
        gallery_urls: (item.gallery_urls || []).map(toCdnMediaUrl),
      })) as ProductDetail[];
    }
  }

  const store = await readSupabaseCloudStore();
  return store.products
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((item) => ({
    ...item,
    thumbnail_url: toCdnMediaUrl(item.thumbnail_url),
    gallery_urls: (item.gallery_urls || []).map(toCdnMediaUrl),
  }));
}

export async function dbGetProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const products = await dbGetProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function dbUpsertProduct(
  input: Partial<ProductDetail> & { name: string; slug: string }
): Promise<{ ok: boolean; message: string; slug?: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  const existingIdx = store.products.findIndex(
    (p) => (input.id && p.id === input.id) || p.slug === input.slug
  );
  const prev = existingIdx >= 0 ? store.products[existingIdx] : null;
  const now = new Date().toISOString();

  const record: ProductDetail = {
    id: input.id || prev?.id || `prod-${Date.now()}`,
    category_id: input.category_id ?? prev?.category_id ?? 'cat-pvc',
    name: input.name,
    slug: input.slug,
    sku: input.sku ?? prev?.sku ?? `SKU-${Date.now().toString().slice(-4)}`,
    price_label: input.price_label || prev?.price_label || 'Liên hệ báo giá sỉ',
    short_description: input.short_description ?? prev?.short_description ?? '',
    content:
      input.content ||
      prev?.content ||
      `<p>${input.short_description || input.name}</p>`,
    specs: input.specs ||
      prev?.specs || {
        'Chất liệu': 'Nhựa nguyên sinh 100%',
        'Quy cách': 'Gia công cắt theo yêu cầu',
        'Giao hàng': 'Toàn quốc 24-48h',
      },
    thumbnail_url: toCdnMediaUrl(
      input.thumbnail_url ||
        prev?.thumbnail_url ||
        '/media/products/mang-co-pvc-cuon.webp'
    ),
    gallery_urls: input.gallery_urls || prev?.gallery_urls || [],
    is_featured:
      input.is_featured !== undefined
        ? input.is_featured
        : (prev?.is_featured ?? true),
    created_at: prev?.created_at || now,
    updated_at: now,
    seo_title: input.seo_title || prev?.seo_title || input.name,
    seo_description:
      input.seo_description ||
      prev?.seo_description ||
      input.short_description ||
      input.name,
  };

  // Ghi lên bảng SQL nếu đã khởi tạo
  const { error } = await admin.from('products').upsert(
    {
      id: record.id,
      category_id: record.category_id,
      name: record.name,
      slug: record.slug,
      sku: record.sku,
      price_label: record.price_label,
      short_description: record.short_description,
      content: record.content,
      specs: record.specs,
      thumbnail_url: record.thumbnail_url,
      gallery_urls: record.gallery_urls,
      is_featured: record.is_featured,
      is_published: true,
      seo_title: record.seo_title,
      seo_description: record.seo_description,
      updated_at: record.updated_at,
    },
    { onConflict: 'slug' }
  );

  if (error && !isTableMissingError(error)) {
    return { ok: false, message: `Lỗi Supabase SQL: ${error.message}` };
  }

  if (existingIdx >= 0) {
    store.products[existingIdx] = record;
  } else {
    store.products.unshift(record);
  }
  await writeSupabaseCloudStore(store);

  return {
    ok: true,
    slug: record.slug,
    message:
      existingIdx >= 0
        ? 'Đã cập nhật sản phẩm trên Database thành công!'
        : 'Đã thêm sản phẩm mới vào Database thành công!',
  };
}

export async function dbDeleteProduct(
  idOrSlug: string
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  const target = store.products.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );

  if (target) {
    await admin.from('products').delete().eq('slug', target.slug);
  }
  await admin.from('products').delete().eq('id', idOrSlug);

  store.products = store.products.filter(
    (p) => p.id !== idOrSlug && p.slug !== idOrSlug
  );
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã xóa sản phẩm khỏi Database!' };
}

// ============================================================================
// 4. POSTS (FULL CRUD)
// ============================================================================
export async function dbGetPosts(): Promise<PostDetail[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((post) => ({
        ...post,
        thumbnail_url: toCdnMediaUrl(post.thumbnail_url),
      })) as PostDetail[];
    }
  }

  const store = await readSupabaseCloudStore();
  return store.posts.map((post) => ({
    ...post,
    thumbnail_url: toCdnMediaUrl(post.thumbnail_url),
  }));
}

export async function dbGetPostBySlug(slug: string): Promise<PostDetail | null> {
  const posts = await dbGetPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function dbUpsertPost(
  input: Partial<PostDetail> & { title: string; slug: string }
): Promise<{ ok: boolean; message: string; slug?: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  const existingIdx = store.posts.findIndex(
    (p) => (input.id && p.id === input.id) || p.slug === input.slug
  );
  const prev = existingIdx >= 0 ? store.posts[existingIdx] : null;
  const now = new Date().toISOString();

  const record: PostDetail = {
    id: input.id || prev?.id || `post-${Date.now()}`,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt ?? prev?.excerpt ?? '',
    content:
      input.content || prev?.content || `<p>${input.excerpt || input.title}</p>`,
    thumbnail_url: toCdnMediaUrl(
      input.thumbnail_url ||
        prev?.thumbnail_url ||
        '/media/products/mang-co-pvc-cuon.webp'
    ),
    category_name: input.category_name || prev?.category_name || 'Màng Co PVC',
    reading_time: Number(input.reading_time ?? prev?.reading_time ?? 4),
    created_at: prev?.created_at || now,
    updated_at: now,
    seo_title: input.seo_title || prev?.seo_title || input.title,
    seo_description:
      input.seo_description || prev?.seo_description || input.excerpt || input.title,
  };

  const { error } = await admin.from('posts').upsert(
    {
      id: record.id,
      title: record.title,
      slug: record.slug,
      excerpt: record.excerpt,
      content: record.content,
      thumbnail_url: record.thumbnail_url,
      category_name: record.category_name,
      reading_time: record.reading_time,
      is_published: true,
      seo_title: record.seo_title,
      seo_description: record.seo_description,
      updated_at: record.updated_at,
    },
    { onConflict: 'slug' }
  );

  if (error && !isTableMissingError(error)) {
    return { ok: false, message: `Lỗi Supabase SQL: ${error.message}` };
  }

  if (existingIdx >= 0) {
    store.posts[existingIdx] = record;
  } else {
    store.posts.unshift(record);
  }
  await writeSupabaseCloudStore(store);

  return {
    ok: true,
    slug: record.slug,
    message:
      existingIdx >= 0
        ? 'Đã cập nhật bài viết trên Database thành công!'
        : 'Đã đăng bài viết mới lên Database thành công!',
  };
}

export async function dbDeletePost(
  idOrSlug: string
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  const target = store.posts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );

  if (target) {
    await admin.from('posts').delete().eq('slug', target.slug);
  }
  await admin.from('posts').delete().eq('id', idOrSlug);

  store.posts = store.posts.filter(
    (p) => p.id !== idOrSlug && p.slug !== idOrSlug
  );
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã xóa bài viết khỏi Database!' };
}

// ============================================================================
// 5. INQUIRIES (CREATE, LIST, UPDATE STATUS, DELETE)
// ============================================================================
export async function dbGetInquiries(): Promise<Inquiry[]> {
  const admin = getSupabaseAdminClient();
  if (admin) {
    const { data, error } = await admin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Inquiry[];
    }
  }

  const store = await readSupabaseCloudStore();
  return store.inquiries;
}

export async function dbCreateInquiry(
  payload: Omit<Inquiry, 'id' | 'status' | 'created_at'>
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  const record: Inquiry = {
    id: `inq-${Date.now()}`,
    customer_name: payload.customer_name,
    phone: payload.phone,
    company: payload.company || null,
    product_interest: payload.product_interest || null,
    quantity_note: payload.quantity_note || null,
    message: payload.message || null,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (admin) {
    await admin.from('inquiries').insert({
      id: record.id,
      customer_name: record.customer_name,
      phone: record.phone,
      company: record.company,
      product_interest: record.product_interest,
      quantity_note: record.quantity_note,
      message: record.message,
      status: record.status,
      created_at: record.created_at,
    });
  }

  const store = await readSupabaseCloudStore();
  store.inquiries.unshift(record);
  await writeSupabaseCloudStore(store);

  return {
    ok: true,
    message:
      'Gửi yêu cầu báo giá thành công! Kỹ thuật viên của xưởng sẽ liên hệ báo giá sỉ cho bạn trong ít phút.',
  };
}

export async function dbUpdateInquiryStatus(
  id: string,
  status: Inquiry['status']
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  await admin.from('inquiries').update({ status }).eq('id', id);

  const store = await readSupabaseCloudStore();
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx >= 0) {
    store.inquiries[idx].status = status;
    await writeSupabaseCloudStore(store);
  }

  return { ok: true, message: 'Đã cập nhật trạng thái xử lý báo giá!' };
}

export async function dbDeleteInquiry(
  id: string
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  await admin.from('inquiries').delete().eq('id', id);

  const store = await readSupabaseCloudStore();
  store.inquiries = store.inquiries.filter((i) => i.id !== id);
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã xóa yêu cầu báo giá!' };
}

// ============================================================================
// 6. KIỂM TRA TRẠNG THÁI CÁC BẢNG TRÊN SUPABASE DATABASE
// ============================================================================
export interface TableStatusInfo {
  ready: boolean;
  count: number;
  error?: string;
}

export interface SupabaseTablesReport {
  isConfigured: boolean;
  allReady: boolean;
  tables: {
    site_settings: TableStatusInfo;
    categories: TableStatusInfo;
    products: TableStatusInfo;
    posts: TableStatusInfo;
    inquiries: TableStatusInfo;
  };
}

export async function dbCheckSupabaseTables(): Promise<SupabaseTablesReport> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return {
      isConfigured: false,
      allReady: false,
      tables: {
        site_settings: { ready: false, count: 0, error: 'Chưa cấu hình Supabase' },
        categories: { ready: false, count: 0, error: 'Chưa cấu hình Supabase' },
        products: { ready: false, count: 0, error: 'Chưa cấu hình Supabase' },
        posts: { ready: false, count: 0, error: 'Chưa cấu hình Supabase' },
        inquiries: { ready: false, count: 0, error: 'Chưa cấu hình Supabase' },
      },
    };
  }

  const check = async (table: string): Promise<TableStatusInfo> => {
    try {
      const { data, count, error } = await admin
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        return {
          ready: false,
          count: 0,
          error: error.message || 'Chưa tồn tại bảng',
        };
      }
      return { ready: true, count: count ?? (data?.length || 0) };
    } catch (e: unknown) {
      return { ready: false, count: 0, error: String(e) };
    }
  };

  const [site_settings, categories, products, posts, inquiries] =
    await Promise.all([
      check('site_settings'),
      check('categories'),
      check('products'),
      check('posts'),
      check('inquiries'),
    ]);

  const allReady =
    site_settings.ready &&
    categories.ready &&
    products.ready &&
    posts.ready &&
    inquiries.ready;

  return {
    isConfigured: true,
    allReady,
    tables: {
      site_settings,
      categories,
      products,
      posts,
      inquiries,
    },
  };
}


