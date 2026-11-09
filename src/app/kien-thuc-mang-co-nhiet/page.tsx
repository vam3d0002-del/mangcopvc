import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';
import { PostListItem } from '@/types/database';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Kiến Thức Màng Co Nhiệt – Hướng Dẫn Chọn Màng Co PVC, POF, PE Chuẩn Kỹ Thuật',
  description:
    'Chuyên mục kiến thức màng co nhiệt: hướng dẫn cách tính khổ màng co, chọn độ dày micron, chỉnh nhiệt độ máy co và kinh nghiệm đóng gói tiết kiệm chi phí.',
  alternates: { canonical: '/kien-thuc-mang-co-nhiet' },
};

export default async function KienThucMangCoNhietPage() {
  const [settings, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPostsList(),
  ]);

  const pvcPosts = posts.filter((p) => p.category_name === 'Màng Co PVC');
  const pofPosts = posts.filter((p) => p.category_name === 'Màng Co POF');
  const nhietPosts = posts.filter((p) => p.category_name === 'Màng Co Nhiệt');

  const renderPostCard = (post: PostListItem) => (
    <article
      key={`post-${post.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
    >
      <Link
        href={`/tin-tuc/${post.slug}`}
        className="relative aspect-[16/10] bg-slate-100 overflow-hidden block"
      >
        <img
          src={post.thumbnail_url || '/media/categories/mang-co-pvc.webp'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge thương hiệu nhỏ góc trên bên trái */}
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-[#0f2d59]/90 backdrop-blur-xs text-[10px] font-bold text-amber-300 tracking-wider uppercase border border-amber-300/30 shadow-xs">
          {settings.short_name || 'Bao Bì Thành Phát'}
        </div>

        {/* Lớp phủ gradient xanh: Đáy xanh đậm, càng lên cao càng mờ dần đến trong suốt */}
        <div className="absolute inset-x-0 bottom-0 z-10 pt-28 pb-3.5 px-4 sm:px-5 bg-gradient-to-t from-[#0f2d59] via-[#0f2d59]/85 via-45% via-[#0f2d59]/20 to-transparent flex items-end">
          <h4 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight line-clamp-2 drop-shadow-sm group-hover:text-sky-200 transition-colors">
            {post.title}
          </h4>
        </div>
      </Link>

      {/* Phần nội dung tóm tắt & Nút Xem chi tiết màu chủ đạo › */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {post.excerpt ||
            'Cẩm nang hướng dẫn chi tiết quy chuẩn màng co đóng gói và giải pháp tối ưu chi phí.'}
        </p>
        <Link
          href={`/tin-tuc/${post.slug}`}
          className="text-[#0284c7] hover:text-[#2563eb] font-bold text-xs sm:text-sm inline-flex items-center gap-1 transition-colors mt-auto group/btn"
        >
          <span>Xem chi tiết</span>
          <span className="text-base font-black leading-none group-hover/btn:translate-x-1 transition-transform">›</span>
        </Link>
      </div>
    </article>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="bg-white border-b border-slate-200/80 py-10 lg:py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-slate-500 mb-4 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition">
              Trang chủ
            </Link>
            <span>›</span>
            <span className="text-slate-900 font-semibold">Kiến thức màng co nhiệt</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/70 mb-3">
            CẨM NANG ĐÓNG GÓI · KIẾN THỨC MÀNG CO NHIỆT
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-normal mb-3">
            Kiến Thức Màng Co Nhiệt – Hướng Dẫn Kỹ Thuật &amp; Kinh Nghiệm Chọn Màng Co
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            Tổng hợp bài viết chuyên sâu về cách tính khổ màng co, so sánh chất liệu PVC – POF – PE, xử lý lỗi nhăn góc khi khò nhiệt và tối ưu chi phí đóng gói cho xưởng sản xuất.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <span className="text-slate-400 uppercase tracking-wider shrink-0 text-[11px]">Chuyên mục:</span>
          <a
            href="#tat-ca"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white text-slate-700 transition shrink-0"
          >
            Tất cả ({posts.length})
          </a>
          <a
            href="#nhom-nhiet"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white text-slate-700 transition shrink-0"
          >
            Kỹ thuật Màng Co Nhiệt ({nhietPosts.length})
          </a>
          <a
            href="#nhom-pvc"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white text-slate-700 transition shrink-0"
          >
            Màng Co PVC ({pvcPosts.length})
          </a>
          <a
            href="#nhom-pof"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white text-slate-700 transition shrink-0"
          >
            Màng Co POF ({pofPosts.length})
          </a>
          <Link
            href="/#uoc-tinh"
            className="ml-auto px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0284c7] border border-blue-200/60 hover:bg-blue-600 hover:text-white transition shrink-0 flex items-center gap-1.5"
          >
            <span>📐 Công cụ tính khổ màng</span>
          </Link>
        </div>
      </div>

      {/* ALL POSTS BY GROUP (MỖI LOẠI 6 TIN MỚI NHẤT) */}
      <section className="py-12 lg:py-16" id="tat-ca">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Group 1: Màng Co Nhiệt & Kỹ thuật */}
          <div className="mb-14" id="nhom-nhiet">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/60 mb-1.5">
                  Chuyên mục
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0f2d59] tracking-normal">
                  Kỹ thuật đóng gói &amp; Màng co nhiệt
                </h3>
              </div>
              <Link
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0284c7] hover:text-[#2563eb] transition-colors"
                href="/mang-co-nhiet"
              >
                <span>Trang trụ cột Màng Co Nhiệt</span>
                <span className="text-base">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nhietPosts.slice(0, 6).map(renderPostCard)}
            </div>
          </div>

          {/* Group 2: Màng Co PVC */}
          <div className="mb-14" id="nhom-pvc">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/60 mb-1.5">
                  Chuyên mục
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0f2d59] tracking-normal">
                  Kiến thức &amp; Ứng dụng Màng Co PVC
                </h3>
              </div>
              <Link
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0284c7] hover:text-[#2563eb] transition-colors"
                href="/mang-co-pvc"
              >
                <span>Trang trụ cột Màng Co PVC</span>
                <span className="text-base">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pvcPosts.slice(0, 6).map(renderPostCard)}
            </div>
          </div>

          {/* Group 3: Màng Co POF */}
          <div className="mb-14" id="nhom-pof">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/60 mb-1.5">
                  Chuyên mục
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0f2d59] tracking-normal">
                  Kiến thức &amp; Ứng dụng Màng Co POF
                </h3>
              </div>
              <Link
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0284c7] hover:text-[#2563eb] transition-colors"
                href="/mang-co-pof"
              >
                <span>Trang trụ cột Màng Co POF</span>
                <span className="text-base">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pofPosts.slice(0, 6).map(renderPostCard)}
            </div>
          </div>
        </div>
      </section>

      {/* FORM BÁO GIÁ */}
      <QuoteSection settings={settings} />
    </div>
  );
}
