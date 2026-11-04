import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

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

          <div className="mcvt-card bg-blue-50/50 border-blue-200">
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">
              5 đặc tính vượt trội của Màng Co POF
            </h3>
            <ul className="mcvt-Checklist" style={{ margin: 0 }}>
              <li>
                <strong>Không mùi, không khói độc:</strong> An toàn cho công
                nhân đứng máy hàn nhiệt trong phòng kín.
              </li>
              <li>
                <strong>Mềm dẻo &amp; chống đâm thủng:</strong> Góc hộp sau khi
                co mềm mại, không sắc nhọn.
              </li>
              <li>
                <strong>Không bị giòn rách ở nhiệt độ âm:</strong> Lý tưởng cho
                thực phẩm cấp đông, thủy sản xuất khẩu.
              </li>
              <li>
                <strong>Đường hàn mảnh, chắc chắn:</strong> Chạy mượt trên các
                máy cắt hàn chữ L tốc độ cao.
              </li>
              <li>
                <strong>Có thể tái chế 100%:</strong> Đáp ứng tiêu chuẩn môi
                trường của thị trường Mỹ, EU, Nhật Bản.
              </li>
            </ul>
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
      <section className="mcvt-sec">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Kiến thức POF</span>
            <h2 className="mcvt-h2">
              Bài viết hướng dẫn &amp; ứng dụng Màng Co POF
            </h2>
          </div>

          <div className="mcvt-pgrid">
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
                  <h3 className="mcvt-pcard-title">
                    <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mcvt-pcard-ex">{post.excerpt}</p>
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

