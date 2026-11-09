import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, PhoneCall, ShieldCheck } from 'lucide-react';
import {
  getCachedProductBySlug,
  getCachedProductsList,
  getCachedSiteSettings,
} from '@/lib/cache';
import QuoteForm from '@/components/QuoteForm';
import ProductCard from '@/components/ProductCard';
import { renderMarkdownOrHtml } from '@/lib/markdown';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getCachedProductsList();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  const title = product.seo_title || product.name;
  const description = product.seo_description || product.short_description;

  return {
    title,
    description,
    alternates: {
      canonical: `/san-pham/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: product.thumbnail_url }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings, allProducts] = await Promise.all([
    getCachedProductBySlug(slug),
    getCachedSiteSettings(),
    getCachedProductsList(),
  ]);

  if (!product) {
    notFound();
  }

  const sameCat = allProducts.filter(
    (p) => p.slug !== product.slug && p.category_id === product.category_id
  );
  const otherCat = allProducts.filter(
    (p) => p.slug !== product.slug && p.category_id !== product.category_id
  );
  const relatedProducts = [...sameCat, ...otherCat].slice(0, 4);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.thumbnail_url,
    description: product.short_description,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: settings.short_name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: '38000',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-brand-600">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-brand-600">
          Sản phẩm Màng Co
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#f1f4f9] border border-slate-200/90 shadow-sm relative group">
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Hàng sản xuất trực tiếp tại xưởng • Mã SP: {product.sku || 'PVC-PRO'}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {product.name}
          </h1>

          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="block text-xs text-slate-500">Đơn giá sỉ xuất xưởng tham khảo:</span>
              <span className="text-xl md:text-2xl font-extrabold text-brand-700">
                {product.price_label}
              </span>
            </div>
            <a
              href={`tel:${settings.hotline.replace(/\./g, '')}`}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline/Zalo: {settings.hotline}</span>
            </a>
          </div>

          <p className="text-slate-700 text-sm md:text-base leading-relaxed">
            {product.short_description}
          </p>

          {/* Bảng thông số kỹ thuật */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
              Thông số kỹ thuật tiêu chuẩn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-slate-50 rounded-lg px-3.5 py-2.5 border border-slate-200/70"
                >
                  <span className="block text-xs text-slate-500">{key}</span>
                  <span className="font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Hỗ trợ gửi mẫu test máy miễn phí
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Đổi trả 100% nếu lỗi đường hàn hoặc thiếu mic
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Content + Quote Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div
            className="prose-content overflow-x-auto max-w-full"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownOrHtml(product.content),
            }}
          />
        </div>

        <div className="lg:col-span-5">
          <QuoteForm defaultProduct={product.name} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-14 pt-8 border-t border-slate-200">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Sản Phẩm Màng Co Cùng Danh Mục
            </h2>
            <Link
              href="/san-pham"
              className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={`related-${prod.id}`} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

