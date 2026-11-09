import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Màng Co POF 5 Lớp An Toàn Thực Phẩm (12mic, 15mic, 19mic, 25mic) Giá Sỉ',
  description:
    'Cung cấp màng co nhiệt POF (Polyolefin) 5 lớp dạng cuộn đôi, cuộn đơn và túi cắt sẵn. Mềm dai, không mùi, đạt chuẩn an toàn thực phẩm & xuất khẩu.',
  alternates: { canonical: '/mang-co-pof' },
};

export default async function MangCoPofPage() {
  const [settings, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPostsList(),
  ]);

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const pofPosts = posts.filter((p) => p.category_name === 'Màng Co POF');

  return (
    <div className="mcvt-pof">
      {/* 1. HERO + THÔNG SỐ NHANH */}
      <section className="mcvt-hero">
        <div className="mcvt-wrap mcvt-hero-grid">
          <div>
            <nav className="mcvt-bc" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link> › <span>Màng Co POF</span>
            </nav>
            <span className="mcvt-eyebrow">
              AN TOÀN THỰC PHẨM · POLYOLEFIN 5 LỚP CAO CẤP
            </span>
            <h1>
              <span>Màng Co POF</span> – Mềm dai, không mùi, đạt chuẩn đóng gói
              thực phẩm &amp; xuất khẩu
            </h1>
            <p className="mcvt-lead">
              Cấu tạo 5 lớp đồng đùn (PP/PE) siêu trong suốt, chịu lực xé vượt
              trội, không phát sinh khói mùi khi hàn nhiệt và giữ nguyên độ dẻo
              dai trong kho đông lạnh -40°C.
            </p>
            <div className="mcvt-cta-row">
              <a className="mcvt-btn mcvt-btn--pri" href="#bao-gia">
                Nhận báo giá Màng Co POF →
              </a>
              <a className="mcvt-btn mcvt-btn--sec" href="#so-sanh">
                So sánh POF và PVC
              </a>
            </div>
          </div>

          <aside className="mcvt-card bg-white shadow-lg border-blue-200">
            <span className="mcvt-cat-tag">Thông số kỹ thuật POF</span>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">
              Thông số nhanh Màng Co POF
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Độ dày chuẩn</dt>
                <dd className="font-extrabold text-slate-900">
                  12, 15, 19, 25 µm
                </dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Tỷ trọng</dt>
                <dd className="font-extrabold text-slate-900">0.92 g/cm³</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Tỷ lệ co nhiệt</dt>
                <dd className="font-extrabold text-slate-900">60% – 68%</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Chịu nhiệt lạnh</dt>
                <dd className="font-extrabold text-slate-900">Đến -40 °C</dd>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <dt className="text-xs text-blue-700 font-bold">
                  Quy cách cung cấp
                </dt>
                <dd className="font-bold text-slate-900">
                  Cuộn màng đôi (Centerfold) · Cuộn màng đơn · Túi POF cắt sẵn
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* 2. CHIP TOC */}
      <div className="mcvt-toc-bar">
        <div className="mcvt-wrap mcvt-toc-chips">
          <span>Mục lục:</span>
          <a href="#la-gi">Màng co POF là gì?</a>
          <a href="#so-sanh">So sánh POF &amp; PVC</a>
          <a href="#san-pham-pof">Quy cách cuộn &amp; túi</a>
          <a href="#ung-dung">Ứng dụng</a>
          <a href="#bang-gia">Chọn độ dày</a>
          <a href="#hoi-dap">FAQ</a>
        </div>
      </div>

      {/* 3. MÀNG CO POF LÀ GÌ & ĐẶC TÍNH NỔI BẬT */}
      <section className="mcvt-sec" id="la-gi">
        <div className="mcvt-wrap mcvt-grid-2">
          <div>
            <span className="mcvt-eyebrow">Chất liệu Polyolefin</span>
            <h2 className="mcvt-h2">Màng co POF là gì?</h2>
            <p className="text-slate-700 mb-4">
              <strong>Màng co POF (Polyolefin Shrink Film)</strong> là dòng màng
              co nhiệt đa lớp cao cấp được đồng đùn từ hạt nhựa Polypropylene
              (PP) và Polyethylene (LLDPE). Đây là vật liệu thay thế hoàn hảo
              cho màng PVC trong các ngành hàng đòi hỏi tiêu chuẩn an toàn vệ
              sinh thực phẩm và xuất khẩu quốc tế.
            </p>
            <p className="text-slate-700">
              Đặc biệt, vì tỷ trọng nhựa POF rất nhẹ (0.92 g/cm³) và có thể cán
              mỏng tới 12–15 micron mà vẫn dai hơn PVC 25 micron,{' '}
              <strong>
                cùng 1kg màng POF sẽ bọc được số lượng sản phẩm nhiều hơn gấp
                đôi
              </strong>{' '}
              so với màng PVC.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#072554] via-[#0b3874] to-[#072554] text-white p-6 sm:p-7 shadow-xl border border-sky-400/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-bold mb-3 tracking-wide">
                Ưu Điểm Vượt Trội
              </span>
              <h3 className="text-xl font-extrabold text-white mb-4">
                5 đặc tính vượt trội của Màng Co POF
              </h3>
              <ul className="space-y-3 text-sm text-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    ✓
                  </span>
                  <span className="leading-relaxed">
                    <strong>Không mùi, không khói độc:</strong> An toàn tuyệt đối cho thực phẩm và công nhân đứng máy.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    ✓
                  </span>
                  <span className="leading-relaxed">
                    <strong>Mềm dẻo &amp; chống đâm thủng:</strong> Góc hộp sau khi co mềm mại, không sắc nhọn, dai khó rách.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    ✓
                  </span>
                  <span className="leading-relaxed">
                    <strong>Không bị giòn rách ở nhiệt độ âm:</strong> Lý tưởng cho thực phẩm đông lạnh, thủy hải sản.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    ✓
                  </span>
                  <span className="leading-relaxed">
                    <strong>Đường hàn siêu mảnh, thẩm mỹ:</strong> Chạy êm ái trên các dòng máy đóng gói tự động tốc độ cao.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    ✓
                  </span>
                  <span className="leading-relaxed">
                    <strong>Thân thiện môi trường, tái chế 100%:</strong> Đạt chứng nhận FDA và tiêu chuẩn xuất khẩu EU, Mỹ.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between relative z-10">
              <span className="text-xs text-sky-200">Tư vấn chọn micron chuẩn</span>
              <a
                href={`tel:${cleanPhone}`}
                className="text-sm font-extrabold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <span>📞 Gọi {settings.hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BẢNG SO SÁNH POF VÀ PVC */}
      <section className="mcvt-sec mcvt-sec--soft" id="so-sanh">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Đặt lên bàn cân</span>
            <h2 className="mcvt-h2">So sánh Màng Co POF và Màng Co PVC</h2>
          </div>

          <div className="mcvt-table-wrap">
            <table className="mcvt-table">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th className="is-hi">Màng Co POF (5 lớp)</th>
                  <th>Màng Co PVC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thành phần nhựa</td>
                  <td>Polyolefin (PP + PE) không chứa Clo</td>
                  <td>Polyvinyl Clorua (PVC)</td>
                </tr>
                <tr>
                  <td>Độ mềm dẻo</td>
                  <td>Rất mềm, dẻo dai, không bị giòn theo thời gian</td>
                  <td>Cứng cáp hơn, có thể giòn nếu gặp lạnh sâu</td>
                </tr>
                <tr>
                  <td>Mùi khi hàn cắt</td>
                  <td>Hoàn toàn không mùi</td>
                  <td>Có mùi nhựa nhẹ khi khò/hàn</td>
                </tr>
                <tr>
                  <td>Diện tích màng trên 1Kg</td>
                  <td>Rất lớn (lợi mét gấp ~1.8 – 2 lần PVC)</td>
                  <td>Trung bình</td>
                </tr>
                <tr>
                  <td>Chứng nhận thực phẩm</td>
                  <td>Đạt chuẩn tiếp xúc thực phẩm &amp; xuất khẩu</td>
                  <td>Dùng bọc ngoài vỏ hộp/chai lọ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. CÁC DẠNG MÀNG CO POF CUNG CẤP */}
      <section className="mcvt-sec" id="san-pham-pof">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Chủng loại &amp; Quy cách</span>
            <h2 className="mcvt-h2">Các dạng Màng Co POF đang cung cấp</h2>
          </div>

          <div className="mcvt-grid-3">
            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Thông dụng nhất</span>
              <h3>1. Cuộn POF Gấp Đôi (Centerfold)</h3>
              <p>
                Màng được gấp đôi sẵn theo chiều dọc cuộn. Khi chạy máy bọc chữ
                L, sản phẩm đi vào giữa 2 lớp màng và chỉ cần hàn 3 cạnh còn
                lại.
              </p>
              <ul>
                <li>Khổ cuộn: 150mm – 650mm</li>
                <li>Chiều dài chuẩn: 1.067m – 1.330m / cuộn</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá cuộn POF gấp đôi →
              </a>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Dây chuyền tốc độ cao</span>
              <h3>2. Cuộn POF Màng Đơn (Singlewound)</h3>
              <p>
                Cuộn màng 1 lớp phẳng chuyên dùng cho máy đóng gói dạng dòng
                chảy ngang (Flow-pack / Pillow-pack) bọc mì ly, bánh kẹo, cuộn
                giấy.
              </p>
              <ul>
                <li>Khổ cuộn: Theo máy đóng gói</li>
                <li>Chiều dài gấp đôi cuộn Centerfold</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá cuộn POF đơn →
              </a>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Gia công theo mẫu</span>
              <h3>3. Túi Màng Co POF Cắt Sẵn</h3>
              <p>
                Gia công cắt rời từng túi POF theo kích thước hộp và đục lỗ
                thoát hơi sẵn, phù hợp cho xưởng chưa đầu tư máy cắt tự động.
              </p>
              <ul>
                <li>Cắt chuẩn theo Dài × Rộng hộp</li>
                <li>Đường hàn đáy mảnh và chắc</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá túi POF cắt sẵn →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* 6. BẢNG CHỌN ĐỘ DÀY POF */}
      <section className="mcvt-sec mcvt-sec--soft" id="bang-gia">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Tra cứu kỹ thuật</span>
            <h2 className="mcvt-h2" id="ung-dung">
              Bảng chọn độ dày Màng Co POF theo ngành hàng
            </h2>
          </div>

          <div className="mcvt-table-wrap">
            <table className="mcvt-table">
              <thead>
                <tr>
                  <th>Độ dày</th>
                  <th className="is-hi">Chiều dài cuộn đôi chuẩn</th>
                  <th>Sản phẩm khuyên dùng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12 micron (µm)</td>
                  <td>1.667 mét / cuộn</td>
                  <td>Mì ly, hộp trà nhẹ, hộp mỹ phẩm nhỏ, khăn giấy</td>
                </tr>
                <tr>
                  <td>15 micron (µm)</td>
                  <td>1.332 mét / cuộn</td>
                  <td>
                    Hộp bánh kẹo, hộp thuốc dược phẩm, thực phẩm đông lạnh, sách
                    vở (Phổ biến nhất)
                  </td>
                </tr>
                <tr>
                  <td>19 micron (µm)</td>
                  <td>1.067 mét / cuộn</td>
                  <td>Lốc nhiều hộp ghép lại, hộp quà, đồ chơi, linh kiện</td>
                </tr>
                <tr>
                  <td>25 micron (µm)</td>
                  <td>800 mét / cuộn</td>
                  <td>Hộp kích thước lớn, sản phẩm nặng hoặc có cạnh sắc</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. BÀI VIẾT SẢN PHẨM MÀNG CO POF */}
      <section className="py-16 md:py-20 bg-slate-50/70 border-t border-slate-200/70">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/60 mb-2">
              Kiến Thức POF
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal mb-3">
              Bài Viết Hướng Dẫn &amp; Ứng Dụng Màng Co POF
            </h2>
            <p className="text-slate-600 text-base">
              Cẩm nang thực tế về tiêu chuẩn an toàn thực phẩm, nhiệt độ buồng co và giải pháp màng co mềm dai cao cấp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pofPosts.slice(0, 6).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col group"
              >
                <Link
                  href={`/tin-tuc/${post.slug}`}
                  className="relative aspect-[16/10] bg-slate-100 overflow-hidden block"
                >
                  <img
                    src={post.thumbnail_url || '/media/categories/mang-co-pof.webp'}
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
                    <h3 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight line-clamp-2 drop-shadow-sm group-hover:text-sky-200 transition-colors">
                      {post.title}
                    </h3>
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
      </section>

      {/* 8. FAQ */}
      <section className="mcvt-sec mcvt-sec--soft" id="hoi-dap">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Giải đáp nhanh</span>
            <h2 className="mcvt-h2">Câu hỏi thường gặp về Màng Co POF</h2>
          </div>

          <div className="mcvt-faq">
            <details open>
              <summary>
                Màng co POF có dùng súng khò nhiệt cầm tay để co được không?
              </summary>
              <div className="mcvt-faq-a">
                Màng POF được thiết kế tối ưu nhất cho{' '}
                <strong>buồng co nhiệt có gió tuần hoàn</strong> (160–190°C).
                Nếu dùng súng khò tay thủ công, màng POF đòi hỏi người thợ phải
                đều tay hơn so với màng PVC. Nếu bạn chỉ khò tay thủ công số
                lượng ít, nên ưu tiên dùng{' '}
                <Link
                  href="/mang-co-pvc"
                  className="text-blue-700 font-bold underline"
                >
                  Màng Co PVC
                </Link>
                .
              </div>
            </details>
            <details>
              <summary>
                Nên chọn POF 15 micron hay 19 micron cho hộp sản phẩm thông
                thường?
              </summary>
              <div className="mcvt-faq-a">
                Khoảng 80% khách hàng đóng gói hộp bánh, hộp trà, mỹ phẩm, dược
                phẩm chọn độ dày <strong>15 micron</strong> vì vừa đủ độ bền dai
                vừa tiết kiệm diện tích màng trên mỗi cuộn.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* 9. FORM BÁO GIÁ */}
      <QuoteSection settings={settings} defaultFilmType="Màng co POF" />
    </div>
  );
}

