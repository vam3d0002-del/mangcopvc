import { unstable_cache } from 'next/cache';
import {
  Category,
  PostDetail,
  PostListItem,
  ProductDetail,
  ProductListItem,
  SiteSettings,
} from '@/types/database';
import {
  dbGetCategories,
  dbGetPostBySlug,
  dbGetPosts,
  dbGetProductBySlug,
  dbGetProducts,
  dbGetSiteSettings,
} from '@/lib/db';

/**
 * CHIẾN LƯỢC ZERO-WASTE CACHING CHO VERCEL FREE + SUPABASE FREE:
 * - Toàn bộ dữ liệu đọc trực tiếp từ Supabase Database (thông qua lớp db.ts).
 * - Thời gian cache mặc định: 30 ngày (2.592.000 giây) -> Giảm 99.9% ISR Writes và Function Invocations!
 * - Khi Admin Thêm / Sửa / Xóa trên trang /admin, Server Action sẽ gọi `revalidateTag(..., 'max')` để cập nhật ngay lập tức.
 */
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30; // 2,592,000s

export const CACHE_TAGS = {
  SETTINGS: 'site-settings',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  POSTS: 'posts',
} as const;

export const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    return dbGetSiteSettings();
  },
  ['site-settings-v4'],
  { tags: [CACHE_TAGS.SETTINGS], revalidate: THIRTY_DAYS_IN_SECONDS }
);

export const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return dbGetCategories();
  },
  ['categories-list-v4'],
  { tags: [CACHE_TAGS.CATEGORIES], revalidate: THIRTY_DAYS_IN_SECONDS }
);

export const getCachedProductsList = unstable_cache(
  async (): Promise<ProductListItem[]> => {
    const products = await dbGetProducts();
    return products.map(
      ({ content, gallery_urls, seo_title, seo_description, updated_at, ...item }) =>
        item
    );
  },
  ['products-list-v7'],
  { tags: [CACHE_TAGS.PRODUCTS], revalidate: THIRTY_DAYS_IN_SECONDS }
);

export const getCachedProductBySlug = (slug: string) =>
  unstable_cache(
    async (): Promise<ProductDetail | null> => {
      return dbGetProductBySlug(slug);
    },
    [`product-detail-v7-${slug}`],
    {
      tags: [CACHE_TAGS.PRODUCTS, `product-${slug}`],
      revalidate: THIRTY_DAYS_IN_SECONDS,
    }
  )();

export const getCachedPostsList = unstable_cache(
  async (): Promise<PostListItem[]> => {
    const posts = await dbGetPosts();
    return posts.map(
      ({ content, seo_title, seo_description, updated_at, ...post }) => post
    );
  },
  ['posts-list-v4'],
  { tags: [CACHE_TAGS.POSTS], revalidate: THIRTY_DAYS_IN_SECONDS }
);

export const getCachedPostBySlug = (slug: string) =>
  unstable_cache(
    async (): Promise<PostDetail | null> => {
      return dbGetPostBySlug(slug);
    },
    [`post-detail-v4-${slug}`],
    {
      tags: [CACHE_TAGS.POSTS, `post-${slug}`],
      revalidate: THIRTY_DAYS_IN_SECONDS,
    }
  )();
