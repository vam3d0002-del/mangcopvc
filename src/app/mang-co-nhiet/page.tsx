import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Màng Co Nhiệt (Shrink Film) – Phân Loại PVC, POF, PE & Báo Giá Tại Xưởng',
  description:
    'Tìm hiểu màng co nhiệt là gì, phân loại màng co nhiệt PVC, POF, PE, quy trình đóng gói và bảng so sánh chi tiết giúp chọn đúng loại màng co cho sản phẩm.',
  alternates: { canonical: '/mang-co-nhiet' },
};

export default async function MangCoNhietPage() {
  const [settings, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPostsList(),
  ]);

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const nhietPosts = posts.filter((p) => p.category_name === 'Màng Co Nhiệt');

  return (
    <div className="mcvt-mcn">
      {/* 1. HERO + QUICK INDUSTRY PICKER */}
      <section className="mcvt-hero">
        <div className="mcvt-wrap mcvt-hero-grid">
          <div>
            <nav className="mcvt-bc" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link> › <span>Màng Co Nhiệt</span>
            </nav>
            <span className="mcvt-eyebrow">
              GIẢI PHÁP ĐÓNG GÓI BẰNG NHIỆT · SHRINK FILM
            </span>
            <h1>
              <span>Màng Co Nhiệt</span> – Bọc bảo vệ, niêm phong &amp; đóng lốc
              sản phẩm chuyên nghiệp
            </h1>
            <p className="mcvt-lead">
              Cung cấp đầy đủ 3 dòng <strong>màng co nhiệt PVC, POF, PE</strong>{' '}
              dạng cuộn, dạng túi cắt sẵn ép ngang / ép cong và màng in tem nhãn
              theo quy cách riêng tại TP. Hồ Chí Minh.
            </p>
            <div className="mcvt-cta-row">
              <a className="mcvt-btn mcvt-btn--pri" href="#bao-gia">
                Yêu cầu báo giá màng co nhiệt →
              </a>
              <a className="mcvt-btn mcvt-btn--sec" href="#cac-loai">
                Xem 3 loại màng co nhiệt
              </a>
            </div>
          </div>

          <aside className="mcvt-card bg-white shadow-lg border-blue-200">
            <span className="mcvt-cat-tag">Gợi ý nhanh</span>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">
              Chọn nhanh theo ngành hàng
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                📦 <strong>Hộp cứng, chai lọ, giỏ quà Tết:</strong> Chọn{' '}
                <Link
                  href="/mang-co-pvc"
                  className="text-blue-700 font-bold underline"
                >
                  Màng Co PVC
                </Link>{' '}
                (dễ khò tay, cứng bóng, tiết kiệm).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                🥐 <strong>Thực phẩm, dược phẩm, mỹ phẩm, xuất khẩu:</strong>{' '}
                Chọn{' '}
                <Link
                  href="/mang-co-pof"
                  className="text-blue-700 font-bold underline"
                >
                  Màng Co POF
                </Link>{' '}
                (5 lớp, mềm dai, không mùi).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                🍾 <strong>Lốc nước suối, lon bia, kiện hàng nặng:</strong> Chọn{' '}
                <Link
                  href="/mang-co-pe"
                  className="text-blue-700 font-bold underline"
                >
                  Màng Co PE
                </Link>{' '}
                (dày 40–120 mic, chịu tải cao).
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* 2. STICKY CHIP TOC */}
      <div className="mcvt-toc-bar">
        <div className="mcvt-wrap mcvt-toc-chips">
          <span>Nội dung chính:</span>
          <a href="#la-gi">Màng co nhiệt là gì?</a>
          <a href="#cac-loai">3 loại phổ biến</a>
          <a href="#so-sanh">Bảng so sánh</a>
          <a href="#quy-trinh">Quy trình đóng gói</a>
          <a href="#san-pham">Ứng dụng thực tế</a>
          <a href="#hoi-dap">Câu hỏi thường gặp</a>
          <a href="#bao-gia">Nhận báo giá</a>
        </div>
      </div>

      {/* 3. MÀNG CO NHIỆT LÀ GÌ? & VÌ SAO NÊN DÙNG */}
      <section className="mcvt-sec" id="la-gi">
        <div className="mcvt-wrap mcvt-grid-2">
          <div>
            <span className="mcvt-eyebrow">Khái niệm cơ bản</span>
            <h2 className="mcvt-h2">Màng co nhiệt là gì?</h2>
            <p className="text-slate-700 mb-4">
              <strong>Màng co nhiệt (Heat Shrink Film)</strong> là loại màng
              nhựa tổng hợp có đặc tính co rút lại theo cả chiều ngang và chiều
              dọc khi tiếp xúc với nguồn nhiệt độ thích hợp (từ súng khò nhiệt
              cầm tay hoặc buồng co nhiệt băng tải).
            </p>
            <p className="text-slate-700">
              Sau khi co, lớp màng ôm sát đường viền bề mặt sản phẩm, tạo thành
              một lớp vỏ trong suốt vừa giúp bảo vệ hàng hóa khỏi bụi ẩm, trầy
              xước, vừa đóng vai trò như lớp tem niêm phong chống bóc mở trước
              khi đến tay người tiêu dùng.
            </p>
          </div>

          <div className="mcvt-card bg-blue-50/50 border-blue-200">
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">
              Vì sao doanh nghiệp ưu tiên dùng màng co nhiệt?
            </h3>
            <ul className="mcvt-Checklist" style={{ margin: 0 }}>
              <li>
                <strong>Tiết kiệm chi phí bao bì:</strong> Giá thành thấp hơn
                nhiều so với hộp nhựa định hình hay thùng carton phụ.
              </li>
              <li>
                <strong>Đa dạng hình dáng:</strong> Ôm gọn từ hộp vuông, chai
                tròn, hũ lục giác cho đến giỏ quà Tết bất đối xứng.
              </li>
              <li>
                <strong>Gom lốc khuyến mãi nhanh:</strong> Dễ dàng bó 2–6 sản
                phẩm tặng kèm thành một khối chắc chắn.
              </li>
              <li>
                <strong>Tăng giá trị cảm quan:</strong> Độ bóng cao giúp màu sắc
                in ấn trên vỏ hộp nổi bật hơn trên kệ trưng bày.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. CÁC LOẠI MÀNG CO NHIỆT PHỔ BIẾN (3 CARDS) */}
      <section className="mcvt-sec mcvt-sec--soft" id="cac-loai">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Phân loại theo chất liệu</span>
            <h2 className="mcvt-h2">Các loại màng co nhiệt phổ biến hiện nay</h2>
            <p className="mcvt-sub">
              3 dòng chất liệu chiếm hơn 95% nhu cầu đóng gói màng co trên thị
              trường.
            </p>
          </div>

          <div className="mcvt-grid-3">
            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Polyvinyl Clorua</span>
              <h3>
                <Link href="/mang-co-pvc">1. Màng Co PVC</Link>
              </h3>
              <p>
                Dòng màng phổ thông nhất, có độ cứng vừa phải, dễ co ở nhiệt độ
                thấp (130–160°C) bằng cả máy khò cầm tay lẫn buồng nhiệt.
              </p>
              <ul>
                <li>Độ dày: 15 – 40 micron</li>
                <li>Tỷ lệ co: 40% – 55%</li>
                <li>Ứng dụng: Hộp cứng, giỏ quà, áo bình 21L, nhãn chai</li>
              </ul>
              <Link className="mcvt-cat-link" href="/mang-co-pvc">
                Xem chi tiết Màng Co PVC →
              </Link>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Polyolefin 5 lớp</span>
              <h3>
                <Link href="/mang-co-pof">2. Màng Co POF</Link>
              </h3>
              <p>
                Dòng màng cao cấp an toàn thực phẩm, mềm dẻo, chịu lực xé tốt,
                không sinh mùi khói khi hàn cắt và không giòn ở kho lạnh.
              </p>
              <ul>
                <li>Độ dày: 12, 15, 19, 25 micron</li>
                <li>Tỷ lệ co: 60% – 68%</li>
                <li>Ứng dụng: Thực phẩm, mì ly, dược phẩm, mỹ phẩm</li>
              </ul>
              <Link className="mcvt-cat-link" href="/mang-co-pof">
                Xem chi tiết Màng Co POF →
              </Link>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Polyethylene</span>
              <h3>
                <Link href="/mang-co-pe">3. Màng Co PE</Link>
              </h3>
              <p>
                Dòng màng dày chịu lực kéo căng và va đập mạnh, chuyên dùng để
                bó lốc sản phẩm nặng thay thế thùng carton.
              </p>
              <ul>
                <li>Độ dày: 40 – 120 micron</li>
                <li>Chịu tải: 5kg – 35kg / kiện</li>
                <li>Ứng dụng: Lốc 6 chai nước, lốc 24 lon bia, gỗ nội thất</li>
              </ul>
              <Link className="mcvt-cat-link" href="/mang-co-pe">
                Xem chi tiết Màng Co PE →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 5. BẢNG SO SÁNH CHI TIẾT */}
      <section className="mcvt-sec" id="so-sanh">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Đối chiếu thông số</span>
            <h2 className="mcvt-h2">
              So sánh chi tiết Màng Co PVC, POF và PE
            </h2>
          </div>

          <div className="mcvt-table-wrap">
            <table className="mcvt-table">
              <thead>
                <tr>
                  <th>Thông số kỹ thuật</th>
                  <th className="is-hi">Màng Co PVC</th>
                  <th>Màng Co POF</th>
                  <th>Màng Co PE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Độ dày thông dụng</td>
                  <td>15 – 40 micron</td>
                  <td>12 – 25 micron</td>
                  <td>40 – 120 micron</td>
                </tr>
                <tr>
                  <td>Tỷ trọng nhựa</td>
                  <td>~1.38 g/cm³</td>
                  <td>~0.92 g/cm³ (Nhẹ, lợi mét)</td>
                  <td>~0.92 – 0.94 g/cm³</td>
                </tr>
                <tr>
                  <td>Nhiệt độ buồng co</td>
                  <td>130°C – 160°C</td>
                  <td>160°C – 190°C</td>
                  <td>170°C – 210°C</td>
                </tr>
                <tr>
                  <td>Độ bền ở kho lạnh</td>
                  <td>Kém (dễ giòn khi âm sâu)</td>
                  <td>Rất tốt (chịu tới -40°C)</td>
                  <td>Tốt</td>
                </tr>
                <tr>
                  <td>Tiếp xúc thực phẩm</td>
                  <td>Chỉ bọc ngoài vỏ hộp/chai</td>
                  <td>Đạt chuẩn an toàn thực phẩm</td>
                  <td>An toàn, không độc</td>
                </tr>
                <tr>
                  <td>Thiết bị phù hợp</td>
                  <td>Khò tay, buồng co mini &amp; tự động</td>
                  <td>Máy cắt chữ L + Buồng co nhiệt</td>
                  <td>Buồng co nhiệt công suất lớn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. QUY TRÌNH ĐÓNG GÓI 3 BƯỚC */}
      <section className="mcvt-sec mcvt-sec--soft" id="quy-trinh">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Cách sử dụng</span>
            <h2 className="mcvt-h2">Quy trình đóng gói màng co nhiệt 3 bước</h2>
          </div>

          <div className="mcvt-grid-3">
            <div className="mcvt-step">
              <span className="mcvt-step-num">Bước 01 · Bọc màng</span>
              <h3>Đưa sản phẩm vào túi hoặc cuộn màng</h3>
              <p>
                Lồng sản phẩm vào túi màng co cắt sẵn (hoặc đưa qua rãnh gấp của
                cuộn màng đôi Centerfold trên máy).
              </p>
            </div>
            <div className="mcvt-step">
              <span className="mcvt-step-num">Bước 02 · Hàn cắt kín</span>
              <h3>Hàn miệng túi &amp; tạo lỗ thoát khí</h3>
              <p>
                Dùng máy hàn dập tay hoặc dao cắt chữ L hàn kín các cạnh dư, đảm
                bảo có lỗ kim nhỏ để thoát hơi khi gặp nhiệt.
              </p>
            </div>
            <div className="mcvt-step">
              <span className="mcvt-step-num">Bước 03 · Gia nhiệt co</span>
              <h3>Khò nhiệt hoặc chạy qua buồng co</h3>
              <p>
                Dưới tác động nhiệt trong 2–4 giây, màng tự động co rút ôm căng
                bóng toàn bộ bề mặt sản phẩm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BÀI VIẾT & ỨNG DỤNG MÀNG CO NHIỆT */}
      <section className="mcvt-sec" id="san-pham">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Kiến thức &amp; Ứng dụng</span>
            <h2 className="mcvt-h2">
              Hướng dẫn sử dụng &amp; kinh nghiệm chọn màng co nhiệt
            </h2>
          </div>

          <div className="mcvt-pgrid">
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
            <span className="mcvt-eyebrow">Hỏi – Đáp</span>
            <h2 className="mcvt-h2">Câu hỏi thường gặp về màng co nhiệt</h2>
          </div>

          <div className="mcvt-faq">
            <details open>
              <summary>
                Màng co nhiệt có dùng máy sấy tóc thông thường để co được không?
              </summary>
              <div className="mcvt-faq-a">
                Máy sấy tóc gia đình thường chỉ đạt 60–80°C nên không đủ nhiệt
                để màng co căng đẹp. Bạn nên trang bị{' '}
                <strong>súng khò nhiệt cầm tay chuyên dụng</strong> (giá chỉ khoảng
                250.000đ – 450.000đ, nhiệt độ điều chỉnh 100–300°C) để màng co
                tức thì và phẳng mịn.
              </div>
            </details>
            <details>
              <summary>
                Tại sao sau khi co nhiệt hộp lại bị phồng hơi hoặc dư góc nhọn?
              </summary>
              <div className="mcvt-faq-a">
                Hiện tượng phồng hơi là do túi kín hoàn toàn không có lỗ thoát
                khí. Còn dư góc nhọn (&ldquo;tai mèo&rdquo;) thường do chọn khổ
                túi quá rộng hoặc dùng túi đáy thẳng cho vật tròn (nên chuyển
                sang túi ép cong bán nguyệt).
              </div>
            </details>
            <details>
              <summary>
                Số lượng đặt hàng tối thiểu tại Màng Co Việt Thành là bao nhiêu?
              </summary>
              <div className="mcvt-faq-a">
                Với các khổ cuộn và size túi thông dụng có sẵn tại kho Bình Tân,
                quý khách có thể lấy từ 1 cuộn hoặc 10–20kg. Với quy cách cắt
                riêng hoặc in ấn, vui lòng gọi{' '}
                <a
                  href={`tel:${cleanPhone}`}
                  className="text-blue-700 font-bold"
                >
                  {settings.hotline}
                </a>{' '}
                để được báo mức MOQ tối ưu nhất.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* 9. FORM BÁO GIÁ */}
      <QuoteSection settings={settings} defaultFilmType="Màng co nhiệt" />
    </div>
  );
}

