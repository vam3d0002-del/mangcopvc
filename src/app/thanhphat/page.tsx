import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ThanhPhatIndexPage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get('admin_session')?.value === 'authenticated';

  if (isAuthenticated) {
    redirect('/admin');
  }

  redirect('/thanhphat/login');
}
