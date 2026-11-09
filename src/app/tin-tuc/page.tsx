import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Cẩm Nang Kỹ Thuật Màng Co PVC, POF & Bảng Giá Sỉ Mới Nhất',
  description:
    'Chia sẻ kinh nghiệm chọn độ dày màng co nhiệt, công thức tính kích thước túi màng co PVC chuẩn xác và cập nhật bảng giá màng co tại xưởng.',
  alternates: {
    canonical: '/tin-tuc',
  },
};

export default async function BlogListPage() {
  const [settings, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPostsList(),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition">
              Trang chủ
            </Link>
            <span>›</span>
            <span className="text-slate-900 font-semibold">Tin tức &amp; Cẩm nang</span>
          </nav>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/70 mb-3">
            KIẾN THỨC &amp; CẨM NANG
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-normal mb-2">
            Kỹ Thuật Đóng Gói Màng Co &amp; Bảng Giá Sỉ
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
            Kiến thức thực chiến từ kỹ thuật viên nhà máy giúp bạn chọn đúng khổ màng, độ dày (mic) và tiết kiệm tối đa chi phí đóng gói.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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
                  <h2 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight line-clamp-2 min-h-[40px] sm:min-h-[48px] flex items-end drop-shadow-sm group-hover:text-sky-200 transition-colors">
                    {post.title}
                  </h2>
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
          ))}
        </div>
      </div>
    </div>
  );
}
