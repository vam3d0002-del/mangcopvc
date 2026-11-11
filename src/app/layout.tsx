import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getCachedCategories,
  getCachedIndustries,
  getCachedProductsList,
  getCachedSiteSettings,
} from '@/lib/cache';



export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mangcopvc.vercel.app';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.seo_title,
      template: `%s | ${settings.short_name}`,
    },
    description: settings.seo_description,
    icons: {
      icon: [{ url: '/icon_logo.webp', type: 'image/webp' }],
      shortcut: [{ url: '/icon_logo.webp', type: 'image/webp' }],
      apple: [{ url: '/icon_logo.webp', type: 'image/webp' }],
    },
    keywords: [
      'màng co pvc',
      'màng co nhiệt pvc',
      'túi màng co pvc cắt sẵn',
      'màng co pof',
      'màng co pe quấn lốc',
      'xưởng sản xuất màng co pvc',
      'in tem nhãn màng co',
      'màng co bọc giỏ quà tết',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: baseUrl,
      siteName: settings.short_name,
      title: settings.seo_title,
      description: settings.seo_description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories, industries, products] = await Promise.all([
    getCachedSiteSettings(),
    getCachedCategories(),
    getCachedIndustries(),
    getCachedProductsList(),
  ]);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Header
          settings={settings}
          categories={categories}
          industries={industries}
          products={products}
        />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

