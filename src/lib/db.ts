import {
  Category,
  HeroSlide,
  Industry,
  Inquiry,
  PostDetail,
  ProductDetail,
  SiteSettings,
  WebLink,
} from '@/types/database';
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  toCdnMediaUrl,
} from '@/lib/supabase';
const DB_BUCKET = 'app-db';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [];
export const DEFAULT_WEB_LINKS: WebLink[] = [];

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  id: 1,
  company_name: '',
  short_name: '',
  hotline: '0935 909 747',
  zalo: '0935909747',
  email: '',
  address: '',
  seo_title: '',
  seo_description: '',
  banner_url: null,
  hero_banner_url: null,
  about_banner_url: null,
  hero_slides: [],
  facebook_url: '',
  tiktok_url: '',
  youtube_url: '',
  twitter_url: '',
  video_intro_url: '',
  video_factory_url: '',
  links: [],
  updated_at: new Date().toISOString(),
};

interface CloudDbState {
  site_settings: SiteSettings;
  categories: Category[];
  industries?: Industry[];
  products: ProductDetail[];
  posts: PostDetail[];
  inquiries: Inquiry[];
  links?: WebLink[];
}

function getInitialSeedState(): CloudDbState {
  return {
    site_settings: FALLBACK_SITE_SETTINGS,
    categories: [],
    industries: [],
    products: [],
    posts: [],
    inquiries: [],
    links: DEFAULT_WEB_LINKS,
  };
}

/**
 * Đọc lưu trữ dự phòng từ Supabase Cloud Storage (nếu có)
 */
async function readSupabaseCloudStore(): Promise<CloudDbState> {
  const admin = getSupabaseAdminClient();
  if (!admin) return getInitialSeedState();

  const { data, error } = await admin.storage
    .from(DB_BUCKET)
    .download('database.json');

  if (error || !data) {
    return getInitialSeedState();
  }

  try {
    const text = await data.text();
    const parsed = JSON.parse(text) as CloudDbState;
    if (!parsed.categories) parsed.categories = [];
    if (!parsed.products) parsed.products = [];
    if (!parsed.posts) parsed.posts = [];
    if (!parsed.inquiries) parsed.inquiries = [];
    if (!parsed.industries) parsed.industries = [];
    return parsed;
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
// 1. SITE SETTINGS (READ & UPDATE ĐỘNG TỪ BẢNG SUPABASE)
// ============================================================================
export async function dbGetSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  let dbRecord: SiteSettings | null = null;
  if (supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      dbRecord = data as SiteSettings;
      if (dbRecord.hotline && dbRecord.hotline.includes('0236')) {
        dbRecord.hotline = '0935 909 747';
      }
      // Nếu bản ghi DB đã đầy đủ và có hero_slides thì trả về ngay, không cần đọc storage file
      if (dbRecord.hero_slides && dbRecord.hero_slides.length > 0) {
        return dbRecord;
      }
    }
  }

  const store = await readSupabaseCloudStore();
  const cloudSettings = store.site_settings || FALLBACK_SITE_SETTINGS;

  const baseSettings = dbRecord ? { ...cloudSettings, ...dbRecord } : cloudSettings;

  if (baseSettings.hotline && baseSettings.hotline.includes('0236')) {
    baseSettings.hotline = '0935 909 747';
  }
  if (!baseSettings.hotline) {
    baseSettings.hotline = '0935 909 747';
  }
  if (!baseSettings.zalo) {
    baseSettings.zalo = '0935909747';
  }

  // Luôn lấy hero_slides từ Cloud Store nếu Postgres chưa lưu hoặc trống
  if (!baseSettings.hero_slides || baseSettings.hero_slides.length === 0) {
    baseSettings.hero_slides =
      cloudSettings.hero_slides && cloudSettings.hero_slides.length > 0
        ? cloudSettings.hero_slides
        : DEFAULT_HERO_SLIDES;
  }

  return baseSettings;
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

  // Tách riêng hero_slides và links để upsert vào bảng Postgres không bị lỗi thiếu cột
  const { hero_slides, links, ...postgresPayload } = updated;
  try {
    await admin
      .from('site_settings')
      .upsert(postgresPayload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Postgres site_settings upsert warning:', err);
  }

  // Luôn ghi toàn bộ dữ liệu (kèm trọn vẹn hero_slides & links) vào Cloud Storage database.json
  const store = await readSupabaseCloudStore();
  store.site_settings = updated;
  if (updated.links) {
    store.links = updated.links;
  }
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã lưu Cấu hình Website & Banner lên Database thành công!' };
}

// ============================================================================
// 1.1 LINKS & VIDEO MANAGEMENT (4 LINKS MẠNG XÃ HỘI & 2 VIDEO XƯỞNG)
// ============================================================================
export async function dbGetLinks(): Promise<WebLink[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as WebLink[];
      }
    } catch {
      // Bảng links chưa có trong Postgres, tiếp tục lấy từ store
    }
  }

  const store = await readSupabaseCloudStore();
  if (store.links && store.links.length > 0) {
    return store.links;
  }

  const settings = await dbGetSiteSettings();
  if (settings.links && settings.links.length > 0) {
    return settings.links;
  }

  return DEFAULT_WEB_LINKS;
}

export async function dbUpdateLinks(
  links: WebLink[]
): Promise<{ ok: boolean; message: string }> {
  // Lấy các giá trị liên kết
  const fb = links.find((l) => l.id === 'facebook')?.url || '';
  const tt = links.find((l) => l.id === 'tiktok')?.url || '';
  const yt = links.find((l) => l.id === 'youtube')?.url || '';
  const tw = links.find((l) => l.id === 'twitter')?.url || '';
  const v1 = links.find((l) => l.id === 'video_intro')?.url || '';
  const v2 = links.find((l) => l.id === 'video_factory')?.url || '';

  // 1. Cập nhật vào Cloud Storage database.json
  const store = await readSupabaseCloudStore();
  store.links = links;
  if (!store.site_settings) {
    store.site_settings = FALLBACK_SITE_SETTINGS;
  }
  store.site_settings.facebook_url = fb;
  store.site_settings.tiktok_url = tt;
  store.site_settings.youtube_url = yt;
  store.site_settings.twitter_url = tw;
  store.site_settings.video_intro_url = v1;
  store.site_settings.video_factory_url = v2;
  store.site_settings.links = links;
  store.site_settings.updated_at = new Date().toISOString();
  await writeSupabaseCloudStore(store);

  // 2. Cập nhật vào bảng Postgres 'links' và 'site_settings' (nếu kết nối Supabase)
  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      await admin.from('links').upsert(links, { onConflict: 'id' });
    } catch (e) {
      console.warn('Upsert into links table warning:', e);
    }

    try {
      await admin
        .from('site_settings')
        .update({
          facebook_url: fb,
          tiktok_url: tt,
          youtube_url: yt,
          twitter_url: tw,
          video_intro_url: v1,
          video_factory_url: v2,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);
    } catch (e) {
      console.warn('Update site_settings links columns warning:', e);
    }
  }

  return {
    ok: true,
    message: 'Đã cập nhật thành công 4 link & 2 video vào Database!',
  };
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
    { onConflict: 'id' }
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
// 2.1 INDUSTRIES / NGÀNH NGHỀ ỨNG DỤNG (FULL CRUD)
// ============================================================================
export async function dbGetIndustries(): Promise<Industry[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('industries')
      .select('id, name, slug, icon, tag, description, image_url, sort_order')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Industry[];
    }
  }

  const store = await readSupabaseCloudStore();
  const list = store.industries || [];
  return list.slice().sort((a, b) => a.sort_order - b.sort_order);
}

export async function dbUpsertIndustry(
  ind: Partial<Industry> & { name: string; slug: string }
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  if (!store.industries) store.industries = [];

  const existingIdx = store.industries.findIndex(
    (i) => i.id === ind.id || i.slug === ind.slug
  );

  const record: Industry = {
    id:
      ind.id ||
      (existingIdx >= 0 ? store.industries[existingIdx].id : `ind-${Date.now()}`),
    name: ind.name,
    slug: ind.slug,
    icon: ind.icon || null,
    tag: ind.tag || null,
    description: ind.description || null,
    image_url: ind.image_url || null,
    sort_order: Number(ind.sort_order ?? store.industries.length + 1),
  };

  const { error } = await admin.from('industries').upsert(
    {
      id: record.id,
      name: record.name,
      slug: record.slug,
      icon: record.icon,
      tag: record.tag,
      description: record.description,
      image_url: record.image_url,
      sort_order: record.sort_order,
    },
    { onConflict: 'id' }
  );

  if (error && !isTableMissingError(error)) {
    return { ok: false, message: `Lỗi Supabase: ${error.message}` };
  }

  if (existingIdx >= 0) {
    store.industries[existingIdx] = record;
  } else {
    store.industries.push(record);
  }
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã lưu Ngành nghề lên Database thành công!' };
}

export async function dbDeleteIndustry(
  id: string
): Promise<{ ok: boolean; message: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const store = await readSupabaseCloudStore();
  if (!store.industries) store.industries = [];
  const target = store.industries.find((i) => i.id === id);

  if (target) {
    await admin.from('industries').delete().eq('slug', target.slug);
  }
  await admin.from('industries').delete().eq('id', id);

  store.industries = store.industries.filter((i) => i.id !== id);
  await writeSupabaseCloudStore(store);

  return { ok: true, message: 'Đã xóa Ngành nghề khỏi Database!' };
}

// ============================================================================
// 3. PRODUCTS (FULL CRUD)
// ============================================================================
export const MAX_HOME_PRODUCTS = 8;

export async function dbGetProducts(): Promise<ProductDetail[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item) => {
        const specs = { ...(item.specs || {}) };
        const industry_id = (item.industry_id || (specs as Record<string, any>).__industry_id || null) as string | null;
        const rawIndIds = item.industry_ids || (specs as Record<string, any>).__industry_ids;
        const industry_ids: string[] = Array.isArray(rawIndIds)
          ? rawIndIds
          : industry_id
          ? [industry_id]
          : [];
        const rawHomeOrder = item.home_order ?? (specs as Record<string, any>).__home_order;
        const home_order =
          typeof rawHomeOrder === 'number'
            ? rawHomeOrder
            : item.is_featured
            ? 999
            : 0;

        delete (specs as Record<string, any>).__industry_id;
        delete (specs as Record<string, any>).__industry_ids;
        delete (specs as Record<string, any>).__home_order;

        return {
          ...item,
          industry_id,
          industry_ids,
          home_order,
          specs,
          thumbnail_url: toCdnMediaUrl(item.thumbnail_url),
          gallery_urls: (item.gallery_urls || []).map(toCdnMediaUrl),
        };
      }) as ProductDetail[];
    }
  }

  const store = await readSupabaseCloudStore();
  return store.products
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((item) => {
      const specs = { ...(item.specs || {}) };
      const industry_id = (item.industry_id || (specs as Record<string, any>).__industry_id || null) as string | null;
      const rawIndIds = item.industry_ids || (specs as Record<string, any>).__industry_ids;
      const industry_ids: string[] = Array.isArray(rawIndIds)
        ? rawIndIds
        : industry_id
        ? [industry_id]
        : [];
      const rawHomeOrder = item.home_order ?? (specs as Record<string, any>).__home_order;
      const home_order =
        typeof rawHomeOrder === 'number'
          ? rawHomeOrder
          : item.is_featured
          ? 999
          : 0;

      delete (specs as Record<string, any>).__industry_id;
      delete (specs as Record<string, any>).__industry_ids;
      delete (specs as Record<string, any>).__home_order;

      return {
        ...item,
        industry_id,
        industry_ids,
        home_order,
        specs,
        thumbnail_url: toCdnMediaUrl(item.thumbnail_url),
        gallery_urls: (item.gallery_urls || []).map(toCdnMediaUrl),
      };
    }) as ProductDetail[];
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
  // Đảm bảo store.products đồng bộ với danh sách hiện tại
  if (!store.products || store.products.length === 0) {
    store.products = await dbGetProducts();
  }

  const existingIdx = store.products.findIndex(
    (p) => (input.id && p.id === input.id) || p.slug === input.slug
  );
  const prev = existingIdx >= 0 ? store.products[existingIdx] : null;
  const now = new Date().toISOString();

  const wantFeatured =
    input.is_featured !== undefined
      ? input.is_featured
      : (prev?.is_featured ?? false);

  // Tính thứ tự home_order và kiểm tra giới hạn 8 sản phẩm hiển thị trang chủ
  const maxHomeOrder = Math.max(
    0,
    ...store.products.map((p) => {
      const sp = (p.specs || {}) as Record<string, any>;
      return Number(p.home_order ?? sp.__home_order ?? 0);
    })
  );

  let nextHomeOrder = 0;
  const autoTurnedOffNames: string[] = [];

  if (wantFeatured) {
    // Giữ nguyên home_order nếu sản phẩm vốn đã bật, hoặc cấp số thứ tự mới lớn nhất nếu vừa bật
    const prevOrder = Number(
      prev?.home_order ?? (prev?.specs as Record<string, any>)?.__home_order ?? 0
    );
    nextHomeOrder = prev?.is_featured && prevOrder > 0 ? prevOrder : maxHomeOrder + 1;

    // Tìm các sản phẩm khác đang bật hiển thị trang chủ, sắp xếp theo thứ tự bật từ cũ đến mới
    const otherFeatured = store.products
      .filter(
        (p) =>
          p.is_featured &&
          p.id !== (input.id || prev?.id) &&
          p.slug !== input.slug
      )
      .sort((a, b) => {
        const orderA = Number(
          a.home_order ?? (a.specs as Record<string, any>)?.__home_order ?? 999999
        );
        const orderB = Number(
          b.home_order ?? (b.specs as Record<string, any>)?.__home_order ?? 999999
        );
        return orderA - orderB;
      });

    // Nếu đã đủ 8 sản phẩm (hoặc hơn), tự động tắt sản phẩm đứng đầu hàng đợi để nhường chỗ cho sản phẩm thứ 9
    if (otherFeatured.length >= MAX_HOME_PRODUCTS) {
      const toDisableCount = otherFeatured.length - (MAX_HOME_PRODUCTS - 1);
      const toDisable = otherFeatured.slice(0, toDisableCount);

      for (const oldProd of toDisable) {
        oldProd.is_featured = false;
        oldProd.home_order = 0;
        const cleanOldSpecs = { ...(oldProd.specs || {}) } as Record<string, any>;
        delete cleanOldSpecs.__home_order;
        oldProd.specs = cleanOldSpecs;
        autoTurnedOffNames.push(oldProd.name);

        await admin.from('products').upsert(
          {
            id: oldProd.id,
            category_id: oldProd.category_id,
            name: oldProd.name,
            slug: oldProd.slug,
            sku: oldProd.sku,
            price_label: oldProd.price_label,
            short_description: oldProd.short_description,
            content: oldProd.content,
            specs: {
              ...cleanOldSpecs,
              __industry_id: oldProd.industry_id,
              __industry_ids: oldProd.industry_ids,
              __home_order: 0,
            },
            thumbnail_url: oldProd.thumbnail_url,
            gallery_urls: oldProd.gallery_urls,
            is_featured: false,
            is_published: true,
            seo_title: oldProd.seo_title,
            seo_description: oldProd.seo_description,
            updated_at: now,
          },
          { onConflict: 'id' }
        );
      }
    }
  }

  const cleanInputSpecs = {
    ...(input.specs ||
      prev?.specs || {
        'Chất liệu': 'Nhựa nguyên sinh 100%',
        'Quy cách': 'Gia công cắt theo yêu cầu',
        'Giao hàng': 'Toàn quốc 24-48h',
      }),
  } as Record<string, any>;
  delete cleanInputSpecs.__industry_id;
  delete cleanInputSpecs.__industry_ids;
  delete cleanInputSpecs.__home_order;

  const record: ProductDetail = {
    id: input.id || prev?.id || `prod-${Date.now()}`,
    category_id: input.category_id ?? prev?.category_id ?? 'cat-thuc-pham',
    industry_id: input.industry_id ?? prev?.industry_id ?? null,
    industry_ids: input.industry_ids ?? prev?.industry_ids ?? [],
    name: input.name,
    slug: input.slug,
    sku: input.sku ?? prev?.sku ?? `SKU-${Date.now().toString().slice(-4)}`,
    price_label: input.price_label || prev?.price_label || 'Liên hệ báo giá sỉ',
    short_description: input.short_description ?? prev?.short_description ?? '',
    content:
      input.content ||
      prev?.content ||
      `<p>${input.short_description || input.name}</p>`,
    specs: cleanInputSpecs,
    thumbnail_url: toCdnMediaUrl(
      input.thumbnail_url ||
        prev?.thumbnail_url ||
        '/media/products/mang-co-pvc-cuon.webp'
    ),
    gallery_urls: input.gallery_urls || prev?.gallery_urls || [],
    is_featured: wantFeatured,
    home_order: nextHomeOrder,
    created_at: prev?.created_at || now,
    updated_at: now,
    seo_title: input.seo_title || prev?.seo_title || input.name,
    seo_description:
      input.seo_description ||
      prev?.seo_description ||
      input.short_description ||
      input.name,
  };

  // Chuẩn bị specs có lưu tạm industry_id / industry_ids / home_order để tương thích cả khi SQL chưa có cột riêng
  const specsToSave = {
    ...record.specs,
    __industry_id: record.industry_id,
    __industry_ids: record.industry_ids,
    __home_order: record.home_order || 0,
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
      specs: specsToSave,
      thumbnail_url: record.thumbnail_url,
      gallery_urls: record.gallery_urls,
      is_featured: record.is_featured,
      is_published: true,
      seo_title: record.seo_title,
      seo_description: record.seo_description,
      updated_at: record.updated_at,
    },
    { onConflict: 'id' }
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

  const rotateNote =
    autoTurnedOffNames.length > 0
      ? ` (Đã tự động tắt hiển thị trang chủ của "${autoTurnedOffNames.join(', ')}" theo thứ tự xoay vòng 8 sản phẩm)`
      : '';

  return {
    ok: true,
    slug: record.slug,
    message:
      (existingIdx >= 0
        ? 'Đã cập nhật sản phẩm trên Database thành công!'
        : 'Đã thêm sản phẩm mới vào Database thành công!') + rotateNote,
  };
}

export async function dbToggleProductHomeDisplay(
  idOrSlug: string,
  targetState?: boolean
): Promise<{
  ok: boolean;
  message: string;
  is_featured?: boolean;
  home_order?: number;
  disabledIds?: string[];
}> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: 'Chưa kết nối Supabase Admin' };

  const allProducts = await dbGetProducts();
  const target = allProducts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  if (!target) {
    return { ok: false, message: 'Không tìm thấy sản phẩm cần bật/tắt!' };
  }

  const nextFeatured =
    targetState !== undefined ? targetState : !target.is_featured;

  const store = await readSupabaseCloudStore();
  store.products = allProducts;

  const maxHomeOrder = Math.max(
    0,
    ...store.products.map((p) => Number(p.home_order || 0))
  );

  const now = new Date().toISOString();
  const disabledIds: string[] = [];
  const disabledNames: string[] = [];

  if (nextFeatured) {
    // Lọc các sản phẩm khác đang bật trên trang chủ, sắp xếp tăng dần theo thứ tự bật (home_order)
    const otherFeatured = store.products
      .filter((p) => p.is_featured && p.id !== target.id)
      .sort((a, b) => (a.home_order || 999999) - (b.home_order || 999999));

    if (otherFeatured.length >= MAX_HOME_PRODUCTS) {
      const toDisableCount = otherFeatured.length - (MAX_HOME_PRODUCTS - 1);
      const toDisable = otherFeatured.slice(0, toDisableCount);

      for (const oldProd of toDisable) {
        oldProd.is_featured = false;
        oldProd.home_order = 0;
        oldProd.updated_at = now;
        disabledIds.push(oldProd.id);
        disabledNames.push(oldProd.name);

        await admin.from('products').upsert(
          {
            id: oldProd.id,
            category_id: oldProd.category_id,
            name: oldProd.name,
            slug: oldProd.slug,
            sku: oldProd.sku,
            price_label: oldProd.price_label,
            short_description: oldProd.short_description,
            content: oldProd.content,
            specs: {
              ...oldProd.specs,
              __industry_id: oldProd.industry_id,
              __industry_ids: oldProd.industry_ids,
              __home_order: 0,
            },
            thumbnail_url: oldProd.thumbnail_url,
            gallery_urls: oldProd.gallery_urls,
            is_featured: false,
            is_published: true,
            seo_title: oldProd.seo_title,
            seo_description: oldProd.seo_description,
            updated_at: now,
          },
          { onConflict: 'id' }
        );
      }
    }

    target.is_featured = true;
    target.home_order = maxHomeOrder + 1;
    target.updated_at = now;
  } else {
    target.is_featured = false;
    target.home_order = 0;
    target.updated_at = now;
  }

  await admin.from('products').upsert(
    {
      id: target.id,
      category_id: target.category_id,
      name: target.name,
      slug: target.slug,
      sku: target.sku,
      price_label: target.price_label,
      short_description: target.short_description,
      content: target.content,
      specs: {
        ...target.specs,
        __industry_id: target.industry_id,
        __industry_ids: target.industry_ids,
        __home_order: target.home_order || 0,
      },
      thumbnail_url: target.thumbnail_url,
      gallery_urls: target.gallery_urls,
      is_featured: target.is_featured,
      is_published: true,
      seo_title: target.seo_title,
      seo_description: target.seo_description,
      updated_at: now,
    },
    { onConflict: 'id' }
  );

  await writeSupabaseCloudStore(store);

  if (nextFeatured) {
    const msg =
      disabledNames.length > 0
        ? `Đã bật "${target.name}" hiển thị Trang chủ và tự động tắt "${disabledNames.join(', ')}" (xoay vòng theo thứ tự 8 sản phẩm)!`
        : `Đã bật hiển thị Trang chủ cho "${target.name}"!`;
    return {
      ok: true,
      message: msg,
      is_featured: true,
      home_order: target.home_order,
      disabledIds,
    };
  }

  return {
    ok: true,
    message: `Đã tắt hiển thị Trang chủ cho "${target.name}".`,
    is_featured: false,
    home_order: 0,
    disabledIds: [],
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
  const cleanSlug = slug.replace(/\.html$/, '');
  return posts.find((p) => p.slug === slug || p.slug === cleanSlug) || null;
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

  const targetId = input.id || prev?.id;

  const record: PostDetail = {
    id: targetId || `post-${Date.now()}`,
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

  const payload = {
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
  };

  let sqlError: any = null;

  if (targetId) {
    // 1. CẬP NHẬT: Thử update theo ID trước để không bao giờ vi phạm posts_pkey
    const { error: updateErr, data } = await admin
      .from('posts')
      .update(payload)
      .eq('id', targetId)
      .select('id');

    if (updateErr) {
      sqlError = updateErr;
    } else if (!data || data.length === 0) {
      // Nếu chưa có row trong SQL table (chỉ có trong JSON), upsert theo ID
      const { error: upsertErr } = await admin
        .from('posts')
        .upsert(payload, { onConflict: 'id' });
      sqlError = upsertErr;
    }
  } else {
    // 2. TẠO MỚI: Upsert theo ID
    const { error: insertErr } = await admin
      .from('posts')
      .upsert(payload, { onConflict: 'id' });
    sqlError = insertErr;
  }

  if (sqlError && !isTableMissingError(sqlError)) {
    return { ok: false, message: `Lỗi Supabase SQL: ${sqlError.message}` };
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
    message: targetId
      ? 'Đã cập nhật bài viết thành công!'
      : 'Đã tạo bài viết mới thành công!',
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
    links: TableStatusInfo;
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
        links: { ready: false, count: 0, error: 'Chưa cấu hình Supabase' },
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

  const [site_settings, categories, products, posts, inquiries, links] =
    await Promise.all([
      check('site_settings'),
      check('categories'),
      check('products'),
      check('posts'),
      check('inquiries'),
      check('links'),
    ]);

  const allReady =
    site_settings.ready &&
    categories.ready &&
    products.ready &&
    posts.ready &&
    inquiries.ready &&
    links.ready;

  return {
    isConfigured: true,
    allReady,
    tables: {
      site_settings,
      categories,
      products,
      posts,
      inquiries,
      links,
    },
  };
}


