import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCachedPostsList } from '@/lib/cache';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Cẩm Nang Kỹ Thuật Màng Co PVC, POF & Bảng Giá Sỉ Mới Nhất',
  description:
    'Chia sẻ kinh nghiệm chọn độ dày màng co nhiệt, công thức tính kích thước túi màng co PVC chuẩn xác và cập nhật bảng giá màng co tại xưởng.',
  alternates: {
    canonical: '/tin-tuc',
  },
};

export default async function BlogListPage() {
  const posts = await getCachedPostsList();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <div className="mb-10">
        <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-600">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Kỹ thuật & Bảng giá</span>
        </nav>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">
          Kỹ Thuật Đóng Gói Màng Co & Bảng Giá Sỉ
        </h1>
        <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl">
          Kiến thức thực chiến từ kỹ thuật viên nhà máy giúp bạn chọn đúng khổ màng, độ dày (mic) và tiết kiệm tối đa chi phí đóng gói.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col"
          >
            <Link href={`/tin-tuc/${post.slug}`} className="aspect-[16/10] bg-slate-100 overflow-hidden block">
              <img
                src={post.thumbnail_url}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </Link>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-brand-600 mb-2">
                {post.category_name} • {post.reading_time} phút đọc
              </span>
              <h2 className="font-bold text-slate-900 text-lg leading-snug mb-2 hover:text-brand-600">
                <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
              >
                <span>Đọc bài viết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

