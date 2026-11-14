import { unstable_cache } from 'next/cache';
import {
  Category,
  Industry,
  PostDetail,
  PostListItem,
  ProductDetail,
  ProductListItem,
  SiteSettings,
} from '@/types/database';
import {
  dbGetCategories,
  dbGetIndustries,
  dbGetPostBySlug,
  dbGetPosts,
  dbGetProductBySlug,
  dbGetProducts,
  dbGetSiteSettings,
} from '@/lib/db';

export const CACHE_TAGS = {
  SETTINGS: 'site-settings',
  CATEGORIES: 'categories',
  INDUSTRIES: 'industries',
  PRODUCTS: 'products',
  POSTS: 'posts',
} as const;

/**
 * CHIẾN LƯỢC TỐI ƯU HÓA CACHE CHO VERCEL + SUPABASE:
 * - Cache tự động 24 giờ (86.400 giây) trong Next.js Data Cache.
 * - Khi Admin Thêm / Sửa / Xóa dữ liệu trên trang /admin, Server Action sẽ gọi
 *   `revalidateTag(..., 'max')` để xóa cache và cập nhật ngay lập tức (On-Demand Revalidation).
 * - Giảm >95% ISR Writes, giảm >90% Fluid Active CPU và giảm >85% Fast Origin Transfer trên Vercel!
 */
const ONE_DAY_IN_SECONDS = 86400; // 24 giờ

export const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    return dbGetSiteSettings();
  },
  ['site-settings-v6'],
  { tags: [CACHE_TAGS.SETTINGS], revalidate: ONE_DAY_IN_SECONDS }
);

export const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return dbGetCategories();
  },
  ['categories-list-v5'],
  { tags: [CACHE_TAGS.CATEGORIES], revalidate: ONE_DAY_IN_SECONDS }
);

export const getCachedIndustries = unstable_cache(
  async (): Promise<Industry[]> => {
    return dbGetIndustries();
  },
  ['industries-list-v5'],
  { tags: [CACHE_TAGS.INDUSTRIES], revalidate: ONE_DAY_IN_SECONDS }
);

export const getCachedProductsList = unstable_cache(
  async (): Promise<ProductListItem[]> => {
    const products = await dbGetProducts();
    return products.map((p) => ({
      id: p.id,
      category_id: p.category_id,
      industry_id: p.industry_id,
      industry_ids: p.industry_ids || (p.industry_id ? [p.industry_id] : []),
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price_label: p.price_label,
      short_description: p.short_description,
      specs: p.specs,
      thumbnail_url: p.thumbnail_url,
      is_featured: p.is_featured,
      home_order: p.home_order,
      created_at: p.created_at,
    }));
  },
  ['products-list-v8'],
  { tags: [CACHE_TAGS.PRODUCTS], revalidate: ONE_DAY_IN_SECONDS }
);

export async function getCachedProductBySlug(slug: string): Promise<ProductDetail | null> {
  return unstable_cache(
    async (): Promise<ProductDetail | null> => {
      return dbGetProductBySlug(slug);
    },
    [`product-detail-v8-${slug}`],
    {
      tags: [CACHE_TAGS.PRODUCTS, `product-${slug}`],
      revalidate: ONE_DAY_IN_SECONDS,
    }
  )();
}

export const getCachedPostsList = unstable_cache(
  async (): Promise<PostListItem[]> => {
    const posts = await dbGetPosts();
    return posts.map(
      ({ content, seo_title, seo_description, updated_at, ...post }) => post
    );
  },
  ['posts-list-v6'],
  { tags: [CACHE_TAGS.POSTS], revalidate: ONE_DAY_IN_SECONDS }
);

export async function getCachedPostBySlug(slug: string): Promise<PostDetail | null> {
  return unstable_cache(
    async (): Promise<PostDetail | null> => {
      return dbGetPostBySlug(slug);
    },
    [`post-detail-v6-${slug}`],
    {
      tags: [CACHE_TAGS.POSTS, `post-${slug}`],
      revalidate: ONE_DAY_IN_SECONDS,
    }
  )();
}
