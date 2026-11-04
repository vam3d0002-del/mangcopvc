import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Màng Co PE (LDPE Shrink Film) Quấn Lốc Chai Nước, Bia & Kiện Hàng Nặng',
  description:
    'Sản xuất và cung cấp màng co nhiệt PE độ dày 40–120 micron chuyên đóng lốc 6–24 chai nước giải khát, lon bia, đồ gỗ nội thất và kiện hàng nặng tại TP.HCM.',
  alternates: { canonical: '/mang-co-pe' },
};

export default async function MangCoPePage() {
  const settings = await getCachedSiteSettings();

  return (
    <div className="mcvt-pof">
      {/* 1. HERO */}
      <section className="mcvt-hero">
        <div className="mcvt-wrap mcvt-hero-grid">
          <div>
            <nav className="mcvt-bc" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link> › <span>Màng Co PE</span>
            </nav>
            <span className="mcvt-eyebrow">
              CHỊU LỰC KÉO CAO · ĐÓNG LỐC &amp; KIỆN HÀNG NẶNG
            </span>
            <h1>
              <span>Màng Co PE</span> – Giải pháp bó lốc nước giải khát &amp;
              bảo vệ kiện hàng công nghiệp
            </h1>
            <p className="mcvt-lead">
              Được thổi từ hạt nhựa LDPE nguyên sinh với độ dày lớn (40 – 120
              micron), chịu lực căng kéo và va đập vượt trội — thay thế hiệu quả
              thùng carton khi đóng lốc 6–24 chai nước, lon bia và kiện hàng
              nặng.
            </p>
            <div className="mcvt-cta-row">
              <a className="mcvt-btn mcvt-btn--pri" href="#bao-gia">
                Nhận báo giá Màng Co PE →
              </a>
              <a className="mcvt-btn mcvt-btn--sec" href="#ung-dung">
                Xem ứng dụng Màng Co PE
              </a>
            </div>
          </div>

          <aside className="mcvt-card bg-white shadow-lg border-blue-200">
            <span className="mcvt-cat-tag">Thông số kỹ thuật PE</span>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">
              Thông số nhanh Màng Co PE
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Độ dày phổ biến</dt>
                <dd className="font-extrabold text-slate-900">40 – 120 µm</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Chịu tải kiện</dt>
                <dd className="font-extrabold text-slate-900">5 – 35 kg</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Nhiệt độ co</dt>
                <dd className="font-extrabold text-slate-900">170 – 210 °C</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs text-slate-500">Dạng cung cấp</dt>
                <dd className="font-extrabold text-slate-900">
                  Cuộn đơn / Cuộn ống
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* 2. ĐẶC ĐIỂM & ỨNG DỤNG */}
      <section className="mcvt-sec" id="ung-dung">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Ưu điểm &amp; Ứng dụng</span>
            <h2 className="mcvt-h2">
              Khi nào doanh nghiệp cần dùng Màng Co Nhiệt PE?
            </h2>
          </div>

          <div className="mcvt-grid-3">
            <div className="mcvt-card">
              <div className="mcvt-trust-ic mb-3">🍾</div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                Đóng lốc nước suối, nước ngọt, bia
              </h3>
              <p className="text-sm text-slate-600">
                Bó chặt lốc 6 chai 1.5L, 12 chai 500ml hoặc khay 24 lon. Khi
                nguội, màng PE siết cứng tạo thành tay xách tự nhiên ở hai đầu
                mắt trâu mà không bị đứt khi bê vác.
              </p>
            </div>

            <div className="mcvt-card">
              <div className="mcvt-trust-ic mb-3">🪵</div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                Bọc gỗ nội thất, ván sàn, gạch men
              </h3>
              <p className="text-sm text-slate-600">
                Chống trầy xước, chống ẩm mốc và giữ cố định các tấm ván gỗ,
                thanh nhôm định hình, phụ kiện kim khí nặng trong quá trình bốc
                xếp.
              </p>
            </div>

            <div className="mcvt-card">
              <div className="mcvt-trust-ic mb-3">📦</div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                Tiết kiệm 40–60% so với thùng carton
              </h3>
              <p className="text-sm text-slate-600">
                Thay thế hoàn toàn thùng giấy carton ngoài cùng, đồng thời giúp
                nhân viên kho và đại lý nhìn thấy rõ sản phẩm bên trong ngay lập
                tức.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BẢNG SO SÁNH NHANH */}
      <section className="mcvt-sec mcvt-sec--soft">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Thông số tham khảo</span>
            <h2 className="mcvt-h2">Gợi ý chọn độ dày Màng Co PE theo tải trọng</h2>
          </div>

          <div className="mcvt-table-wrap">
            <table className="mcvt-table">
              <thead>
                <tr>
                  <th>Trọng lượng kiện hàng</th>
                  <th className="is-hi">Độ dày PE khuyên dùng</th>
                  <th>Ứng dụng tiêu biểu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dưới 5 kg</td>
                  <td>40 – 55 micron</td>
                  <td>Lốc 6 chai nước 350ml – 500ml, lốc hộp sữa, cuộn giấy</td>
                </tr>
                <tr>
                  <td>Từ 5 kg – 12 kg</td>
                  <td>60 – 80 micron</td>
                  <td>Lốc 6 chai 1.5L, khay 24 lon nước giải khát, đồ gia dụng</td>
                </tr>
                <tr>
                  <td>Trên 12 kg – 35 kg</td>
                  <td>85 – 120 micron</td>
                  <td>Ván sàn gỗ, gạch men, kiện cơ khí, phụ tùng công nghiệp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. FORM BÁO GIÁ */}
      <QuoteSection settings={settings} defaultFilmType="Màng co PE" />
    </div>
  );
}

