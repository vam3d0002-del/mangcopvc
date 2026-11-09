import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCachedPostBySlug,
  getCachedPostsList,
  getCachedSiteSettings,
} from '@/lib/cache';
import QuoteForm from '@/components/QuoteForm';
import { renderMarkdownOrHtml } from '@/lib/markdown';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getCachedPostsList();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPostBySlug(slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/tin-tuc/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: post.thumbnail_url }],
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getCachedPostBySlug(slug),
    getCachedSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnail_url,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: settings.company_name,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-brand-600">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/tin-tuc" className="hover:text-brand-600">
          Kỹ thuật & Bảng giá
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <span className="inline-block text-xs font-bold bg-blue-50 text-brand-700 px-3 py-1 rounded-full mb-3">
            {post.category_name} • {post.reading_time} phút đọc
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-slate-600 text-sm md:text-base italic border-l-4 border-brand-500 pl-4 mb-6">
            {post.excerpt}
          </p>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 mb-6">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="prose-content overflow-x-auto max-w-full"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownOrHtml(post.content),
            }}
          />
        </article>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
}

