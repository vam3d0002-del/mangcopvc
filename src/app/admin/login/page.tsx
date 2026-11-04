import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng Nhập Quản Trị | Hệ Thống Quản Trị',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get('admin_session')?.value === 'authenticated';

  if (isAuthenticated) {
    redirect('/admin');
  }

  return <AdminLoginForm />;
}

