import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

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

  return (
    <div className="mcvt-mcn">
      {/* HERO */}
      <section className="mcvt-hero">
        <div className="mcvt-wrap">
          <nav className="mcvt-bc" aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link> ›{' '}
            <span>Kiến thức màng co nhiệt</span>
          </nav>
          <span className="mcvt-eyebrow">
            CẨM NANG ĐÓNG GÓI · KIẾN THỨC MÀNG CO NHIỆT
          </span>
          <h1>
            <span>Kiến Thức Màng Co Nhiệt</span> – Hướng dẫn kỹ thuật &amp; kinh
            nghiệm chọn màng co
          </h1>
          <p className="mcvt-lead" style={{ maxWidth: '820px' }}>
            Tổng hợp bài viết chuyên sâu về cách tính khổ màng co, so sánh chất
            liệu PVC – POF – PE, xử lý lỗi nhăn góc khi khò nhiệt và tối ưu chi
            phí đóng gói cho xưởng sản xuất.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="mcvt-toc-bar">
        <div className="mcvt-wrap mcvt-toc-chips">
          <span>Chuyên mục:</span>
          <a href="#tat-ca">Tất cả ({posts.length})</a>
          <a href="#nhom-pvc">Màng Co PVC ({pvcPosts.length})</a>
          <a href="#nhom-pof">Màng Co POF ({pofPosts.length})</a>
          <a href="#nhom-nhiet">Kỹ thuật Màng Co Nhiệt ({nhietPosts.length})</a>
          <Link href="/#uoc-tinh">📐 Công cụ tính khổ màng</Link>
        </div>
      </div>

      {/* ALL POSTS BY GROUP */}
      <section className="mcvt-sec" id="tat-ca">
        <div className="mcvt-wrap">
          {/* Group 1: Màng Co Nhiệt & Kỹ thuật */}
          <div className="mcvt-pblock" id="nhom-nhiet">
            <div className="mcvt-pblock-head">
              <h3>Kỹ thuật đóng gói &amp; Màng co nhiệt</h3>
              <Link className="mcvt-more" href="/mang-co-nhiet">
                Trang trụ cột Màng Co Nhiệt →
              </Link>
            </div>
            <div className="mcvt-grid-3">
              {nhietPosts.map((post) => (
                <article key={post.id} className="mcvt-pcard">
                  <Link
                    className="mcvt-pcard-thumb"
                    href={`/tin-tuc/${post.slug}`}
                  >
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      loading="lazy"
                    />
                  </Link>
                  <div className="mcvt-pcard-body">
                    <span className="text-xs font-bold text-blue-700 mb-1">
                      {post.category_name} · {post.reading_time} phút đọc
                    </span>
                    <h4 className="mcvt-pcard-title">
                      <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="mcvt-pcard-ex">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Group 2: Màng Co PVC */}
          <div className="mcvt-pblock" id="nhom-pvc">
            <div className="mcvt-pblock-head">
              <h3>Kiến thức &amp; Ứng dụng Màng Co PVC</h3>
              <Link className="mcvt-more" href="/mang-co-pvc">
                Trang trụ cột Màng Co PVC →
              </Link>
            </div>
            <div className="mcvt-grid-3">
              {pvcPosts.map((post) => (
                <article key={post.id} className="mcvt-pcard">
                  <Link
                    className="mcvt-pcard-thumb"
                    href={`/tin-tuc/${post.slug}`}
                  >
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      loading="lazy"
                    />
                  </Link>
                  <div className="mcvt-pcard-body">
                    <span className="text-xs font-bold text-blue-700 mb-1">
                      {post.category_name} · {post.reading_time} phút đọc
                    </span>
                    <h4 className="mcvt-pcard-title">
                      <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="mcvt-pcard-ex">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Group 3: Màng Co POF */}
          <div className="mcvt-pblock" id="nhom-pof">
            <div className="mcvt-pblock-head">
              <h3>Kiến thức &amp; Ứng dụng Màng Co POF</h3>
              <Link className="mcvt-more" href="/mang-co-pof">
                Trang trụ cột Màng Co POF →
              </Link>
            </div>
            <div className="mcvt-grid-3">
              {pofPosts.map((post) => (
                <article key={post.id} className="mcvt-pcard">
                  <Link
                    className="mcvt-pcard-thumb"
                    href={`/tin-tuc/${post.slug}`}
                  >
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      loading="lazy"
                    />
                  </Link>
                  <div className="mcvt-pcard-body">
                    <span className="text-xs font-bold text-blue-700 mb-1">
                      {post.category_name} · {post.reading_time} phút đọc
                    </span>
                    <h4 className="mcvt-pcard-title">
                      <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="mcvt-pcard-ex">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteSection settings={settings} />
    </div>
  );
}

