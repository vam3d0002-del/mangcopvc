import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  dbGetCategories,
  dbGetIndustries,
  dbGetInquiries,
  dbGetLinks,
  dbGetPosts,
  dbGetProducts,
  dbGetSiteSettings,
} from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản Trị Database (CRUD) & Nén Ảnh WebP | Hệ Thống Quản Trị',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get('admin_session')?.value === 'authenticated';

  if (!isAuthenticated) {
    redirect('/thanhphat/login');
  }

  const supabaseConfigured = isSupabaseConfigured();

  const [siteSettings, categories, industries, products, posts, inquiries, links] =
    await Promise.all([
      dbGetSiteSettings(),
      dbGetCategories(),
      dbGetIndustries(),
      dbGetProducts(),
      dbGetPosts(),
      dbGetInquiries(),
      dbGetLinks(),
    ]);

  return (
    <AdminDashboardClient
      isAuthenticated={isAuthenticated}
      supabaseConfigured={supabaseConfigured}
      siteSettings={siteSettings}
      categories={categories}
      industries={industries}
      products={products}
      posts={posts}
      inquiries={inquiries}
      links={links}
    />
  );
}
