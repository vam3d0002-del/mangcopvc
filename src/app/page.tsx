import Link from 'next/link';
import {
  getCachedCategories,
  getCachedProductsList,
  getCachedSiteSettings,
} from '@/lib/cache';
import ShrinkFilmCalculator from '@/components/ShrinkFilmCalculator';
import QuoteSection from '@/components/QuoteSection';

// Cache tĩnh 30 ngày trên Vercel CDN -> Không tốn ISR Writes & Function Invocations
export const revalidate = 2592000;

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    getCachedSiteSettings(),
    getCachedCategories(),
    getCachedProductsList(),
  ]);

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo =
    !rawZalo ||
    ((rawZalo === '0907616611' || rawZalo === '0932636239') &&
      cleanPhone !== rawZalo)
      ? cleanPhone
      : rawZalo;
  const encodedAddress = encodeURIComponent(settings.address);
  const addressParts = settings.address
    .split(/[,.]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const shortLocationTitle =
    addressParts.length > 0
      ? `Tại ${addressParts[addressParts.length - 1]}`
      : 'Địa chỉ xưởng';
  const shortLocationSub =
    addressParts.length > 1
      ? addressParts.slice(0, -1).join(', ')
      : settings.address;

  // 4 sản phẩm Màng Co PVC mới nhất
  const pvcProducts = products
    .filter(
      (p) =>
        p.category_id === 'cat-pvc' ||
        p.category_id === 'pvc' ||
        p.slug.includes('pvc')
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  // 4 sản phẩm Màng Co POF mới nhất
  const pofProducts = products
    .filter(
      (p) =>
        p.category_id === 'cat-pof' ||
        p.category_id === 'pof' ||
        p.slug.includes('pof')
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  // 4 sản phẩm Màng Co Nhiệt / PE mới nhất
  const nhietProducts = products
    .filter(
      (p) =>
        p.category_id === 'cat-nhiet' ||
        p.category_id === 'cat-pe' ||
        p.category_id === 'nhiet' ||
        p.category_id === 'pe' ||
        p.slug.includes('pe') ||
        p.slug.includes('nhiet')
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.company_name,
    description: settings.seo_description,
    telephone: settings.hotline,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mcvt-home">
        {/* ================= 1. HERO ================= */}
        <section className="mcvt-hero" aria-labelledby="mcvt-h1">
          <div className="mcvt-wrap mcvt-hero__grid">
            <div className="mcvt-hero__text">
              <p className="mcvt-eyebrow">
                {settings.company_name} · Màng co &amp; vật liệu đóng gói
              </p>
              <h1 id="mcvt-h1">
                Màng Co PVC, POF, PE – Cung cấp màng co nhiệt cho đóng gói
              </h1>
              <p className="mcvt-lead">
                Tư vấn chọn đúng loại màng, khổ và độ dày theo sản phẩm và máy
                co bạn đang dùng. Gửi quy cách – nhận báo giá.
              </p>
              <div className="mcvt-btns">
                <a className="mcvt-btn mcvt-btn--primary" href="#bao-gia">
                  Yêu cầu báo giá
                </a>
                <a className="mcvt-btn mcvt-btn--ghost" href="#danh-muc">
                  Xem danh mục sản phẩm
                </a>
              </div>
              <ul className="mcvt-hero__contact">
                <li>
                  <a href={`tel:${cleanPhone}`}>
                    Hotline: <strong>{settings.hotline}</strong>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://zalo.me/${cleanZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat Zalo
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              </ul>
            </div>

            <figure className="mcvt-hero__media">
              <img
                src={settings.hero_banner_url || '/media/products/hero-mang-co.webp'}
                alt={`Các loại màng co PVC, POF, PE của ${settings.company_name}`}
                width={960}
                height={720}
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        {/* ================= 2. TRUST STRIP ================= */}
        <section className="mcvt-trust" aria-label="Điểm nổi bật">
          <div className="mcvt-wrap">
            <ul className="mcvt-trust__list">
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
                <div>
                  <strong>4 dòng màng co</strong>
                  <span>PVC · POF · Nhiệt · PE</span>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 20V8l8-4 8 4v12M9 20v-6h6v6" />
                </svg>
                <div>
                  <strong>{shortLocationTitle}</strong>
                  <span>{shortLocationSub}</span>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 6h18M7 6v12M17 6v12M3 18h18" />
                </svg>
                <div>
                  <strong>Tư vấn quy cách</strong>
                  <span>Khổ, độ dày, dạng màng</span>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
                <div>
                  <strong>Báo giá nhanh</strong>
                  <span>Qua điện thoại &amp; Zalo</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* ================= 3. DANH MỤC MÀNG CO (4 SQUARE IMAGE CARDS) ================= */}
        <section
          className="mcvt-section"
          id="danh-muc"
          aria-labelledby="mcvt-dm"
        >
          <div className="mcvt-wrap">
            <div className="mcvt-head">
              <h2 id="mcvt-dm">Danh mục màng co</h2>
              <p>Chọn nhóm màng phù hợp với sản phẩm cần đóng gói.</p>
            </div>

            <div className="mcvt-cards">
              {categories
                .slice()
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .slice(0, 4)
                .map((cat) => {
                const img =
                  cat.image_url ||
                  (cat.slug === 'mang-co-pvc'
                    ? '/media/categories/mang-co-pvc.webp'
                    : cat.slug === 'mang-co-pof'
                    ? '/media/categories/mang-co-pof.webp'
                    : cat.slug === 'mang-co-nhiet'
                    ? '/media/categories/mang-co-nhiet.webp'
                    : '/media/categories/mang-co-pe.webp');

                return (
                  <article key={cat.id || cat.slug} className="mcvt-card">
                    <Link
                      className="mcvt-card__img"
                      href={`/${cat.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img
                        src={img}
                        alt={`Ứng dụng màng co ${cat.name} - ${settings.company_name}`}
                        width={600}
                        height={600}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                    <div className="mcvt-card__body">
                      <h3>
                        <Link href={`/${cat.slug}`}>{cat.name}</Link>
                      </h3>
                      <p>
                        {cat.description ||
                          `Cung cấp ${cat.name} chất lượng cao, đúng khổ và quy cách theo yêu cầu đóng gói.`}
                      </p>
                      <Link className="mcvt-link" href={`/${cat.slug}`}>
                        Xem {cat.name.toLowerCase()} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 4. 3 KHỐI SẢN PHẨM THEO DÒNG MÀNG ================= */}
        <section className="mcvt-section mcvt-section--alt">
          <div className="mcvt-wrap">
            {/* ROW 1: SẢN PHẨM MÀNG CO PVC */}
            <div className="mcvt-rowhead">
              <h2>Sản phẩm màng co PVC</h2>
              <Link className="mcvt-link" href="/mang-co-pvc">
                Xem tất cả màng co PVC →
              </Link>
            </div>
            <div className="mcvt-post-grid">
              {pvcProducts.map((prod) => (
                <article key={`pvc-${prod.id}`} className="mcvt-post-card">
                  <Link
                    href={`/san-pham/${prod.slug}`}
                    className="mcvt-post-card__img"
                  >
                    <img
                      src={prod.thumbnail_url}
                      alt={prod.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="mcvt-post-card__body">
                    <h3 className="mcvt-post-card__title">
                      <Link href={`/san-pham/${prod.slug}`}>{prod.name}</Link>
                    </h3>
                    <div className="text-xs text-blue-600 font-bold mb-3 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{prod.price_label || 'Liên hệ báo giá sỉ'}</span>
                    </div>
                    <div className="mcvt-post-card__cta">
                      <Link
                        className="mcvt-post-card__btn"
                        href={`/san-pham/${prod.slug}`}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ROW 2: SẢN PHẨM MÀNG CO POF */}
            <div className="mcvt-rowhead">
              <h2>Sản phẩm màng co POF</h2>
              <Link className="mcvt-link" href="/mang-co-pof">
                Xem tất cả màng co POF →
              </Link>
            </div>
            <div className="mcvt-post-grid">
              {pofProducts.map((prod) => (
                <article key={`pof-${prod.id}`} className="mcvt-post-card">
                  <Link
                    href={`/san-pham/${prod.slug}`}
                    className="mcvt-post-card__img"
                  >
                    <img
                      src={prod.thumbnail_url}
                      alt={prod.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="mcvt-post-card__body">
                    <h3 className="mcvt-post-card__title">
                      <Link href={`/san-pham/${prod.slug}`}>{prod.name}</Link>
                    </h3>
                    <div className="text-xs text-blue-600 font-bold mb-3 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{prod.price_label || 'Liên hệ báo giá sỉ'}</span>
                    </div>
                    <div className="mcvt-post-card__cta">
                      <Link
                        className="mcvt-post-card__btn"
                        href={`/san-pham/${prod.slug}`}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ROW 3: SẢN PHẨM MÀNG CO NHIỆT */}
            <div className="mcvt-rowhead">
              <h2>Sản phẩm màng co nhiệt</h2>
              <Link className="mcvt-link" href="/mang-co-nhiet">
                Xem tất cả màng co nhiệt →
              </Link>
            </div>
            <div className="mcvt-post-grid mcvt-post-grid--last">
              {nhietProducts.map((prod) => (
                <article key={`nhiet-${prod.id}`} className="mcvt-post-card">
                  <Link
                    href={`/san-pham/${prod.slug}`}
                    className="mcvt-post-card__img"
                  >
                    <img
                      src={prod.thumbnail_url}
                      alt={prod.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="mcvt-post-card__body">
                    <h3 className="mcvt-post-card__title">
                      <Link href={`/san-pham/${prod.slug}`}>{prod.name}</Link>
                    </h3>
                    <div className="text-xs text-blue-600 font-bold mb-3 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{prod.price_label || 'Liên hệ báo giá sỉ'}</span>
                    </div>
                    <div className="mcvt-post-card__cta">
                      <Link
                        className="mcvt-post-card__btn"
                        href={`/san-pham/${prod.slug}`}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. BẢNG SO SÁNH PVC vs POF vs PE ================= */}
        <section className="mcvt-section" aria-labelledby="mcvt-ss">
          <div className="mcvt-wrap">
            <div className="mcvt-head">
              <h2 id="mcvt-ss">So sánh màng co PVC, POF và PE</h2>
              <p>
                Bảng tham khảo nhanh để chọn loại màng. Mỗi dòng sản phẩm còn có
                nhiều độ dày và quy cách – liên hệ để được tư vấn cụ thể.
              </p>
            </div>

            <div
              className="mcvt-table-wrap"
              role="region"
              aria-label="Bảng so sánh màng co"
              tabIndex={0}
            >
              <table className="mcvt-table">
                <thead>
                  <tr>
                    <th scope="col">Tiêu chí</th>
                    <th scope="col">
                      <Link href="/mang-co-pvc">Màng co PVC</Link>
                    </th>
                    <th scope="col">
                      <Link href="/mang-co-pof">Màng co POF</Link>
                    </th>
                    <th scope="col">
                      <Link href="/mang-co-pe">Màng co PE</Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Độ trong</th>
                    <td>Cao</td>
                    <td>Rất cao, bóng</td>
                    <td>Trung bình</td>
                  </tr>
                  <tr>
                    <th scope="row">Độ dai, chịu lực</th>
                    <td>Trung bình, dễ giòn khi lạnh</td>
                    <td>Cao, mềm dẻo</td>
                    <td>Rất cao, chịu tải nặng</td>
                  </tr>
                  <tr>
                    <th scope="row">Mùi khi gia nhiệt</th>
                    <td>Có mùi</td>
                    <td>Ít mùi</td>
                    <td>Ít mùi</td>
                  </tr>
                  <tr>
                    <th scope="row">Nhiệt độ co</th>
                    <td>Thấp, co nhanh</td>
                    <td>Trung bình</td>
                    <td>Cao hơn</td>
                  </tr>
                  <tr>
                    <th scope="row">Chi phí</th>
                    <td>Kinh tế</td>
                    <td>Trung bình</td>
                    <td>Tuỳ độ dày</td>
                  </tr>
                  <tr>
                    <th scope="row">Phù hợp</th>
                    <td>Chai, nắp, hộp phổ thông</td>
                    <td>Thực phẩm, mỹ phẩm, hàng trưng bày</td>
                    <td>Bó lốc chai, kiện hàng, hàng cồng kềnh</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mcvt-note">
              Màng co nhiệt là tên gọi chung cho các loại màng co lại khi gặp
              nhiệt – xem thêm tại{' '}
              <Link href="/mang-co-nhiet">màng co nhiệt</Link>.
            </p>
          </div>
        </section>

        {/* ================= 6. CÔNG CỤ ƯỚC TÍNH KHỔ MÀNG CO (#uoc-tinh) ================= */}
        <section
          className="mcvt-section mcvt-section--alt"
          id="uoc-tinh"
          aria-labelledby="mcvt-calc-h"
        >
          <ShrinkFilmCalculator
            hotline={settings.hotline}
            companyName={settings.company_name}
          />
        </section>

        {/* ================= 7. VIDEO + ỨNG DỤNG ================= */}
        <section className="mcvt-section" aria-labelledby="mcvt-ud">
          <div className="mcvt-wrap mcvt-split">
            <div className="mcvt-split__media">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/media/products/ung-dung-mang-co-pvc.webp"
                width={720}
                height={1280}
                src="https://mangcopvc.com/wp-content/uploads/2025/07/mua-mang-co-pvc-hcm.mp4"
              />
            </div>

            <div className="mcvt-split__text">
              <p className="mcvt-eyebrow">Video thực tế</p>
              <h2 id="mcvt-ud">Ứng dụng của màng co trong đóng gói</h2>
              <p>
                Màng co ôm sát sản phẩm sau khi gia nhiệt, giúp bảo vệ hàng khỏi
                bụi, ẩm, trầy xước và giữ bao bì gọn gàng khi trưng bày.
              </p>
              <ul className="mcvt-checklist">
                <li>
                  Bọc chai, lọ, nắp – mỹ phẩm, nước uống, dược phẩm:{' '}
                  <Link href="/mang-co-pvc">màng co PVC</Link>,{' '}
                  <Link href="/mang-co-pof">màng co POF</Link>
                </li>
                <li>
                  Đóng gói thực phẩm, bánh kẹo, hộp quà:{' '}
                  <Link href="/mang-co-pof">màng co POF</Link>
                </li>
                <li>
                  Bọc sách, khung tranh, đồ gỗ, hộp giấy:{' '}
                  <Link href="/mang-co-nhiet">màng co nhiệt</Link>
                </li>
                <li>
                  Bó lốc chai, kiện hàng nặng:{' '}
                  <Link href="/mang-co-pe">màng co PE</Link>
                </li>
              </ul>
              <a className="mcvt-btn mcvt-btn--primary" href="#bao-gia">
                Nhận tư vấn chọn màng
              </a>
            </div>
          </div>
        </section>

        {/* ================= 8. LÀM VIỆC VỚI CAO VẠN THỊNH (4 BƯỚC) ================= */}
        <section
          className="mcvt-section mcvt-section--alt"
          aria-labelledby="mcvt-why"
        >
          <div className="mcvt-wrap">
            <div className="mcvt-head">
              <h2 id="mcvt-why">Làm việc với {settings.company_name}</h2>
              <p>
                Quy trình đơn giản cho khách hàng doanh nghiệp và cơ sở sản
                xuất.
              </p>
            </div>

            <ol className="mcvt-steps">
              <li>
                <h3>Tư vấn chọn loại màng</h3>
                <p>
                  Dựa trên sản phẩm, cách đóng gói và máy co đang dùng, gợi ý
                  PVC, POF, PE hay loại phù hợp.
                </p>
              </li>
              <li>
                <h3>Xác định quy cách</h3>
                <p>
                  Hỗ trợ tính khổ màng, độ dày và dạng màng theo kích thước thực
                  tế của sản phẩm.
                </p>
              </li>
              <li>
                <h3>Báo giá theo nhu cầu</h3>
                <p>
                  Gửi quy cách và số lượng qua form, điện thoại hoặc Zalo để
                  nhận báo giá.
                </p>
              </li>
              <li>
                <h3>Hỗ trợ khách doanh nghiệp</h3>
                <p>
                  Tiếp nhận đơn hàng định kỳ và trao đổi thông số kỹ thuật cho
                  bộ phận sản xuất.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ================= 9. CÂU HỎI THƯỜNG GẶP VỀ MÀNG CO (FAQ) ================= */}
        <section className="mcvt-section" aria-labelledby="mcvt-faq">
          <div className="mcvt-wrap mcvt-narrow">
            <div className="mcvt-head">
              <h2 id="mcvt-faq">Câu hỏi thường gặp về màng co</h2>
            </div>

            <div className="mcvt-faq">
              <details>
                <summary>
                  Màng co PVC và màng co POF khác nhau như thế nào?
                </summary>
                <p>
                  Màng co PVC thường có giá thành thấp hơn, cứng và co nhanh,
                  nhưng dễ giòn khi trời lạnh và có mùi khi gia nhiệt. Màng co
                  POF mềm, trong và dai hơn, ít mùi khi co nên thường được ưu
                  tiên cho thực phẩm, mỹ phẩm và hàng cần trưng bày. Xem chi
                  tiết tại <Link href="/mang-co-pvc">màng co PVC</Link> và{' '}
                  <Link href="/mang-co-pof">màng co POF</Link>.
                </p>
              </details>

              <details>
                <summary>
                  Nên chọn loại màng co nào cho sản phẩm của tôi?
                </summary>
                <p>
                  Tuỳ vào loại hàng, yêu cầu thẩm mỹ, ngân sách và thiết bị co.
                  Hàng thông thường cần tối ưu chi phí có thể dùng PVC; hàng
                  thực phẩm, mỹ phẩm, cần độ trong và bền thường dùng POF; hàng
                  nặng, bó lốc dùng PE. Gửi mô tả sản phẩm để được tư vấn cụ
                  thể.
                </p>
              </details>

              <details>
                <summary>
                  Làm thế nào để chọn quy cách màng co phù hợp?
                </summary>
                <p>
                  Cần xác định kích thước sản phẩm để tính khổ màng, chọn độ dày
                  theo trọng lượng và mức bảo vệ mong muốn, và chọn dạng màng
                  (cuộn đơn, cuộn ống, túi) theo cách đóng gói và máy co đang
                  dùng. Có thể dùng{' '}
                  <a href="#uoc-tinh">công cụ ước tính khổ màng</a> để tham khảo
                  trước.
                </p>
              </details>

              <details>
                <summary>
                  Cần cung cấp thông tin gì khi đặt hàng hoặc xin báo giá?
                </summary>
                <p>
                  Loại màng, dạng màng, khổ, độ dày, số lượng dự kiến, loại máy
                  co hoặc súng khò đang dùng và địa chỉ nhận hàng. Có ảnh sản
                  phẩm cần đóng gói sẽ giúp tư vấn nhanh và chính xác hơn.
                </p>
              </details>

              <details>
                <summary>Làm thế nào để yêu cầu báo giá?</summary>
                <p>
                  Điền form <a href="#bao-gia">yêu cầu báo giá</a> bên dưới, gọi
                  hotline <a href={`tel:${cleanPhone}`}>{settings.hotline}</a>,
                  nhắn{' '}
                  <a
                    href={`https://zalo.me/${cleanZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Zalo
                  </a>{' '}
                  hoặc gửi email{' '}
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ================= 10. FORM YÊU CẦU BÁO GIÁ (#bao-gia) ================= */}
        <QuoteSection settings={settings} />

        {/* ================= 11. ĐỊA CHỈ & BẢN ĐỒ (#ban-do) ================= */}
        <section
          className="mcvt-section mcvt-mapsec"
          id="ban-do"
          aria-labelledby="mcvt-map-h"
        >
          <div className="mcvt-wrap mcvt-mapsec__grid">
            <div className="mcvt-mapsec__card">
              <p className="mcvt-eyebrow">Địa chỉ</p>
              <h2 id="mcvt-map-h">Ghé {settings.company_name}</h2>
              <address>{settings.address}</address>
              <p className="mcvt-mapsec__note">
                Gọi trước để được hỗ trợ xem hàng và nhận báo giá nhanh.
              </p>
              <div className="mcvt-btns">
                <a
                  className="mcvt-btn mcvt-btn--primary"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chỉ đường
                </a>
                <a
                  className="mcvt-btn mcvt-btn--ghost"
                  href={`tel:${cleanPhone}`}
                >
                  Gọi {settings.hotline}
                </a>
              </div>
            </div>

            <div className="mcvt-mapsec__map">
              <iframe
                title={`Bản đồ ${settings.company_name} – ${settings.address}`}
                src={`https://www.google.com/maps?q=${encodedAddress}&t=m&z=16&hl=vi&output=embed`}
                width="100%"
                height={420}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
