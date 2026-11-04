import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Màng Co PVC Dạng Cuộn, Túi Cắt Sẵn Ép Ngang/Ép Cong & In Nhãn Giá Xưởng',
  description:
    'Chuyên sản xuất màng co PVC dạng cuộn, túi màng co PVC cắt ép ngang, ép cong bọc giỏ quà, màng co áo bình nước 21L và in tem nhãn tại TP.HCM.',
  alternates: { canonical: '/mang-co-pvc' },
};

export default async function MangCoPvcPage() {
  const [settings, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPostsList(),
  ]);

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const pvcPosts = posts.filter((p) => p.category_name === 'Màng Co PVC');

  return (
    <div className="mcvt-pvc">
      {/* 1. HERO + THÔNG SỐ NHANH */}
      <section className="mcvt-hero">
        <div className="mcvt-wrap mcvt-hero-grid">
          <div>
            <nav className="mcvt-bc" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link> › <span>Màng Co PVC</span>
            </nav>
            <span className="mcvt-eyebrow">
              SẢN PHẨM CHỦ LỰC · POLYVINYL CHLORIDE SHRINK FILM
            </span>
            <h1>
              <span>Màng Co PVC</span> – Cuộn, túi cắt ép theo mẫu &amp; in tem
              nhãn theo quy cách
            </h1>
            <p className="mcvt-lead">
              Độ trong suốt cao, cứng cáp giữ form hộp đẹp, co nhanh ở nhiệt độ
              thấp bằng cả máy khò cầm tay và buồng co nhiệt. Phù hợp đóng gói
              hộp cứng, chai lọ, văn phòng phẩm, bình nước 21L và giỏ quà Tết.
            </p>
            <div className="mcvt-cta-row">
              <a className="mcvt-btn mcvt-btn--pri" href="#bao-gia">
                Nhận báo giá Màng Co PVC →
              </a>
              <a className="mcvt-btn mcvt-btn--sec" href="#san-pham-pvc">
                Xem 4 dòng PVC đang cung cấp
              </a>
            </div>
          </div>

          <aside className="mcvt-card bg-white shadow-lg border-blue-200">
            <span className="mcvt-cat-tag">Thông số kỹ thuật chuẩn</span>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">
              Thông số nhanh Màng Co PVC
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Độ dày phổ biến</dt>
                <dd className="font-extrabold text-slate-900">15 – 40 µm</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Khổ màng</dt>
                <dd className="font-extrabold text-slate-900">80 – 800 mm</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Nhiệt độ co</dt>
                <dd className="font-extrabold text-slate-900">130 – 160 °C</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Tỷ lệ co rút</dt>
                <dd className="font-extrabold text-slate-900">40% – 55%</dd>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <dt className="text-xs text-blue-700 font-bold">
                  Quy cách giao hàng
                </dt>
                <dd className="font-bold text-slate-900">
                  Cuộn nguyên · Túi cắt ép ngang / ép cong · Nhãn in
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
          <a href="#la-gi">Màng co PVC là gì?</a>
          <a href="#uu-nhuoc">Ưu &amp; nhược điểm</a>
          <a href="#san-pham-pvc">4 dòng PVC chủ lực</a>
          <a href="#phan-loai">Phân loại</a>
          <a href="#ung-dung">Ứng dụng</a>
          <a href="#bang-gia">Báo giá</a>
          <a href="#hoi-dap">FAQ</a>
        </div>
      </div>

      {/* 3. MÀNG CO PVC LÀ GÌ? */}
      <section className="mcvt-sec" id="la-gi">
        <div className="mcvt-wrap mcvt-grid-2">
          <div>
            <span className="mcvt-eyebrow">Tổng quan chất liệu</span>
            <h2 className="mcvt-h2">Màng co PVC là gì?</h2>
            <p className="text-slate-700 mb-4">
              <strong>Màng co PVC (Polyvinyl Chloride Shrink Film)</strong> là
              loại màng nhựa nhiệt dẻo được sản xuất từ hạt nhựa PVC nguyên sinh
              bằng phương pháp thổi màng định hướng. Khi gặp nguồn nhiệt từ
              130°C – 160°C, màng sẽ co rút nhanh và ôm khít lấy hình dáng của
              vật thể bên trong.
            </p>
            <p className="text-slate-700">
              Nhờ bề mặt bóng sáng như kính, độ cứng cáp tốt và chi phí đầu tư
              thấp, màng co PVC là lựa chọn số 1 cho các cơ sở đóng gói hộp mỹ
              phẩm, hộp trà, nhang, văn phòng phẩm, bình nước lọc 20L và giỏ quà
              Tết.
            </p>
          </div>

          <div className="mcvt-card bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-xs font-bold mb-3">
                Khi nào nên chọn Màng Co PVC?
              </span>
              <h3 className="text-xl font-extrabold mb-3">
                3 trường hợp tối ưu nhất để dùng PVC
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-200">
                <li>
                  ✓ <strong>Đóng gói bằng súng khò nhiệt cầm tay</strong> hoặc
                  buồng co nhiệt công suất vừa và nhỏ.
                </li>
                <li>
                  ✓ Cần lớp màng <strong>cứng cáp, giữ form</strong> cho hộp
                  giấy, giỏ quà Tết hoặc làm tem nhãn thân chai.
                </li>
                <li>
                  ✓ Cần đặt <strong>túi cắt sẵn theo kích thước riêng</strong>{' '}
                  với chi phí tiết kiệm và thời gian giao hàng nhanh.
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-300">
                Cần tư vấn khổ túi chuẩn?
              </span>
              <a
                href={`tel:${cleanPhone}`}
                className="text-sm font-extrabold text-amber-300"
              >
                📞 Gọi {settings.hotline}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ƯU ĐIỂM & NHƯỢC ĐIỂM */}
      <section className="mcvt-sec mcvt-sec--soft" id="uu-nhuoc">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Đánh giá khách quan</span>
            <h2 className="mcvt-h2">Ưu điểm và lưu ý khi dùng Màng Co PVC</h2>
          </div>

          <div className="mcvt-grid-2">
            <div className="mcvt-card border-blue-200">
              <h3 className="text-xl font-extrabold text-blue-700 mb-3">
                ✓ Ưu điểm nổi bật của Màng Co PVC
              </h3>
              <ul className="mcvt-Checklist" style={{ margin: 0 }}>
                <li>
                  <strong>Độ bóng và độ trong suốt cao:</strong> Giúp bao bì
                  sản phẩm trông mới và bắt mắt hơn hẳn.
                </li>
                <li>
                  <strong>Dễ co nhiệt:</strong> Co nhanh ở nhiệt độ thấp, thao
                  tác cực dễ kể cả với nhân công mới dùng máy khò tay.
                </li>
                <li>
                  <strong>Đa dạng kiểu gia công:</strong> Dễ dàng cắt túi đáy
                  thẳng, ép cong vòng cung, làm màng chụp vòi bình nước hoặc in
                  ống đồng nhiều màu.
                </li>
                <li>
                  <strong>Đơn giá hợp lý:</strong> Chi phí đầu tư ban đầu thấp,
                  phù hợp mọi quy mô xưởng.
                </li>
              </ul>
            </div>

            <div className="mcvt-card">
              <h3 className="text-xl font-extrabold text-slate-800 mb-3">
                ⚠️ Nhược điểm &amp; Lưu ý bảo quản
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>1. Nhạy cảm với nhiệt độ kho:</strong> Không để cuộn
                  hoặc túi màng PVC sát mái tôn nóng trên 35°C hoặc dưới nắng
                  trực tiếp vì màng có thể tự co rút nhẹ ở mép.
                </li>
                <li className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>2. Không tiếp xúc trực tiếp thực phẩm trần:</strong>{' '}
                  Chỉ dùng bọc bên ngoài vỏ hộp, hũ nhựa, lọ thủy tinh. Nếu bọc
                  trực tiếp thực phẩm hoặc cấp đông sâu, hãy chọn{' '}
                  <Link
                    href="/mang-co-pof"
                    className="text-blue-700 font-bold underline"
                  >
                    Màng Co POF
                  </Link>
                  .
                </li>
                <li className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>3. Có mùi nhẹ khi hàn nhiệt:</strong> Nên bố trí khu
                  vực khò/hàn màng thông thoáng gió.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4 DÒNG MÀNG CO PVC ĐANG CUNG CẤP */}
      <section className="mcvt-sec" id="san-pham-pvc">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Quy cách thành phẩm</span>
            <h2 className="mcvt-h2">Các dòng Màng Co PVC đang cung cấp</h2>
            <p className="mcvt-sub">
              Gia công trực tiếp theo khổ rộng, chiều dài cắt và độ dày yêu cầu
              của từng khách hàng.
            </p>
          </div>

          <div className="mcvt-cats">
            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Dòng 01</span>
              <h3>Màng Co PVC Hàng Cuộn</h3>
              <p>
                Cuộn màng ống đôi (hoặc xẻ 1 bên / xếp hông) khổ từ 80mm đến
                800mm, chuyên chạy máy bọc tự động hoặc cắt thủ công tại xưởng.
              </p>
              <ul>
                <li>Độ dày: 15 – 40 micron</li>
                <li>Trọng lượng: 15 – 25kg/cuộn</li>
                <li>Màng mềm hoặc màng cứng theo yêu cầu</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá PVC hàng cuộn →
              </a>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Dòng 02</span>
              <h3>Túi PVC Cắt Ép Ngang / Ép Cong</h3>
              <p>
                Cắt rời từng túi theo kích thước hộp: túi hàn đáy thẳng, túi hở
                2 đầu hoặc túi ép cong vòng cung bọc giỏ quà Tết, hộp tròn.
              </p>
              <ul>
                <li>Cắt chính xác theo mẫu hộp</li>
                <li>Có đục lỗ thoát khí chống phồng</li>
                <li>Chỉ cần bỏ sản phẩm vào và khò nhiệt</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá túi PVC cắt sẵn →
              </a>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Dòng 03</span>
              <h3>Màng Co Áo Nước Suối 21L</h3>
              <p>
                Màng co PVC trơn hoặc in thương hiệu chuyên bọc thân bình nước
                lọc 19L – 21L, màng co chụp nắp vòi và cổ bình.
              </p>
              <ul>
                <li>Có sẵn quy cách bình 20L chuẩn</li>
                <li>Đường răng cưa dễ xé mở vòi</li>
                <li>Màu trắng trong hoặc xanh dương</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá màng co bình 21L →
              </a>
            </article>

            <article className="mcvt-cat">
              <span className="mcvt-cat-tag">Dòng 04</span>
              <h3>Màng Co PVC In Tem Nhãn</h3>
              <p>
                In ống đồng từ 1 đến 8 màu sắc nét làm nhãn thân chai nước giải
                khát, hũ yến, lọ gia vị, hộp mỹ phẩm và hóa mỹ phẩm.
              </p>
              <ul>
                <li>Giao dạng cuộn phóng nhãn hoặc cắt rời</li>
                <li>Độ co ngang chuẩn ôm sát cổ chai</li>
                <li>Hỗ trợ tư vấn bình trục in</li>
              </ul>
              <a className="mcvt-cat-link" href="#bao-gia">
                Báo giá in nhãn PVC →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* 6. PHÂN LOẠI & ỨNG DỤNG THEO NGÀNH HÀNG */}
      <section className="mcvt-sec mcvt-sec--soft" id="phan-loai">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Phân loại &amp; Ứng dụng</span>
            <h2 className="mcvt-h2" id="ung-dung">
              Phân loại PVC cứng / mềm &amp; Ứng dụng theo ngành hàng
            </h2>
          </div>

          <div className="mcvt-grid-2 mb-8">
            <div className="mcvt-card">
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                1. Phân theo độ cứng: PVC Mềm vs PVC Cứng
              </h3>
              <p className="text-sm text-slate-600">
                <strong>PVC mềm (dẻo):</strong> Dễ lồng hộp, ít bị rách mép,
                chuyên dùng bọc hộp giấy mỹ phẩm, sách vở, giỏ quà.{' '}
                <strong>PVC cứng:</strong> Độ đanh cao, chuyên dùng làm tem nhãn
                in ống đồng phóng tự động lên thân chai nhựa/thủy tinh.
              </p>
            </div>
            <div className="mcvt-card">
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                2. Phân theo bề mặt: PVC Không In vs PVC Có In
              </h3>
              <p className="text-sm text-slate-600">
                <strong>PVC trắng trong không in:</strong> Khoe trọn thiết kế vỏ
                hộp bên trong, tiết kiệm chi phí trục in.{' '}
                <strong>PVC có in:</strong> Vừa làm lớp màng bảo vệ vừa thay thế
                tem nhãn dán truyền thống.
              </p>
            </div>
          </div>

          <div className="mcvt-grid-4">
            <div className="mcvt-card">
              <h4 className="font-extrabold text-slate-900 mb-1">
                💄 Mỹ phẩm &amp; Dược phẩm
              </h4>
              <p className="text-sm text-slate-600">
                Bọc seal hộp kem, serum, nước hoa, hộp thuốc, thực phẩm chức
                năng chống bóc mở.
              </p>
            </div>
            <div className="mcvt-card">
              <h4 className="font-extrabold text-slate-900 mb-1">
                🎁 Giỏ quà Tết &amp; Quà tặng
              </h4>
              <p className="text-sm text-slate-600">
                Túi PVC ép cong khổ lớn 50x70, 60x80, 70x90cm cố định giỏ quà
                chắc chắn, bóng đẹp.
              </p>
            </div>
            <div className="mcvt-card">
              <h4 className="font-extrabold text-slate-900 mb-1">
                💧 Nước uống &amp; Đồ hộp
              </h4>
              <p className="text-sm text-slate-600">
                Áo bình nước 20L, seal nắp chai, màng bọc ngoài hũ hạt khô, hộp
                trà, cà phê.
              </p>
            </div>
            <div className="mcvt-card">
              <h4 className="font-extrabold text-slate-900 mb-1">
                🛠️ Gia dụng &amp; Công nghiệp
              </h4>
              <p className="text-sm text-slate-600">
                Bọc lốc móc áo, thanh nhôm, phào chỉ, linh kiện điện tử, văn
                phòng phẩm, tập vở.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BẢNG BÁO GIÁ THAM KHẢO */}
      <section className="mcvt-sec" id="bang-gia">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Báo giá tại xưởng</span>
            <h2 className="mcvt-h2">
              Bảng quy cách &amp; yếu tố tính giá Màng Co PVC
            </h2>
            <p className="mcvt-sub">
              Đơn giá tính theo kg hoặc theo 1.000 túi tùy quy cách gia công và
              số lượng đặt hàng.
            </p>
          </div>

          <div className="mcvt-table-wrap">
            <table className="mcvt-table">
              <thead>
                <tr>
                  <th>Dòng sản phẩm</th>
                  <th className="is-hi">Quy cách phổ biến</th>
                  <th>Độ dày</th>
                  <th>Đơn vị tính</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Màng co PVC dạng cuộn</td>
                  <td>Khổ 80mm – 800mm (ống đôi / xẻ)</td>
                  <td>15 – 40 micron</td>
                  <td>Theo Kg (Cuộn 15–25kg)</td>
                </tr>
                <tr>
                  <td>Túi PVC cắt ép ngang đáy thẳng</td>
                  <td>Cắt theo kích thước hộp (VD: 12×20cm, 15×25cm)</td>
                  <td>18 – 30 micron</td>
                  <td>Theo Kg</td>
                </tr>
                <tr>
                  <td>Túi PVC ép cong bọc giỏ quà Tết</td>
                  <td>45×60cm, 50×70cm, 55×75cm, 60×80cm, 70×90cm</td>
                  <td>30 – 40 micron</td>
                  <td>Theo Kg / Bịch</td>
                </tr>
                <tr>
                  <td>Màng co áo bình nước 20L &amp; nắp vòi</td>
                  <td>Quy cách chuẩn bình tròn / bình vòi</td>
                  <td>30 – 35 micron</td>
                  <td>Theo Kg / Cái</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. 8 BÀI VIẾT SẢN PHẨM MÀNG CO PVC */}
      <section className="mcvt-sec mcvt-sec--soft">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Bài viết chuyên sâu</span>
            <h2 className="mcvt-h2">
              Tư vấn &amp; ứng dụng thực tế Màng Co PVC
            </h2>
          </div>

          <div className="mcvt-pgrid">
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

      {/* 9. FAQ */}
      <section className="mcvt-sec" id="hoi-dap">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Giải đáp thắc mắc</span>
            <h2 className="mcvt-h2">Câu hỏi thường gặp về Màng Co PVC</h2>
          </div>

          <div className="mcvt-faq">
            <details open>
              <summary>1kg túi màng co PVC được khoảng bao nhiêu cái?</summary>
              <div className="mcvt-faq-a">
                Số lượng túi trên 1kg phụ thuộc vào kích thước (Rộng × Dài) và
                độ dày micron. Ví dụ túi size nhỏ bọc hộp mỹ phẩm có thể được
                400–800 cái/kg, trong khi túi lớn bọc giỏ quà Tết được khoảng
                25–45 cái/kg. Hãy gửi kích thước hộp để chúng tôi tính số cái/kg
                chính xác cho bạn.
              </div>
            </details>
            <details>
              <summary>
                Làm sao tính khổ túi màng co PVC vừa khít cho hộp chữ nhật?
              </summary>
              <div className="mcvt-faq-a">
                Công thức nhanh: <strong>Khổ rộng túi = Rộng + Cao + 1cm đến 1.5cm</strong>;{' '}
                <strong>Chiều dài túi = Dài + Cao + 2cm đến 3cm</strong>. Bạn
                cũng có thể dùng công cụ{' '}
                <Link
                  href="/#uoc-tinh"
                  className="text-blue-700 font-bold underline"
                >
                  Ước tính nhanh khổ màng co
                </Link>{' '}
                ngay trên trang chủ.
              </div>
            </details>
            <details>
              <summary>
                Xưởng có giao hàng đi tỉnh không?
              </summary>
              <div className="mcvt-faq-a">
                Có. Chúng tôi giao tận nơi tại TP.HCM và hỗ trợ giao ra các
                chành xe đi Bình Dương, Đồng Nai, Long An, miền Tây, miền Trung,
                Tây Nguyên và miền Bắc.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* 10. FORM BÁO GIÁ */}
      <QuoteSection settings={settings} defaultFilmType="Màng co PVC" />
    </div>
  );
}

