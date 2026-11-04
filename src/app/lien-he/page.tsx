import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Liên Hệ & Nhận Báo Giá Màng Co PVC, POF, PE | Công Ty TNHH Màng Co Việt Thành',
  description:
    'Liên hệ Công ty TNHH Màng Co Việt Thành tại Số 4A Đường số 6, P. An Lạc A, Q. Bình Tân, TP.HCM. Hotline/Zalo: 0932 636 239 nhận báo giá màng co nhanh.',
  alternates: { canonical: '/lien-he' },
};

export default async function ContactPage() {
  const settings = await getCachedSiteSettings();
  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo =
    !rawZalo ||
    ((rawZalo === '0907616611' || rawZalo === '0932636239') &&
      cleanPhone !== rawZalo)
      ? cleanPhone
      : rawZalo;
  const encodedAddress = encodeURIComponent(settings.address);

  return (
    <div className="mcvt-gt">
      {/* 1. HERO */}
      <section className="mcvt-hero">
        <div className="mcvt-wrap">
          <nav className="mcvt-bc" aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link> › <span>Liên hệ</span>
          </nav>
          <span className="mcvt-eyebrow">
            LIÊN HỆ TRỰC TIẾP · HỖ TRỢ NHANH 24/7
          </span>
          <h1>
            Liên hệ <span>{settings.company_name}</span>
          </h1>
          <p className="mcvt-lead" style={{ maxWidth: '780px' }}>
            Quý khách cần tư vấn chọn loại màng co, tính khổ túi chuẩn theo mẫu
            hộp hoặc nhận báo giá sỉ cho nhà máy — hãy liên hệ với các bộ phận
            chuyên trách bên dưới.
          </p>
        </div>
      </section>

      {/* 2. 4 PHÒNG BAN CHUYÊN TRÁCH (GIỐNG MANGCOPVC.COM/LIEN-HE/) */}
      <section className="mcvt-sec">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Kết nối đúng bộ phận</span>
            <h2 className="mcvt-h2">Các kênh hỗ trợ khách hàng &amp; đối tác</h2>
          </div>

          <div className="mcvt-grid-4">
            <div className="mcvt-card flex flex-col justify-between">
              <div>
                <span className="mcvt-cat-tag">Phòng Kinh Doanh</span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  BÁO GIÁ ĐƠN HÀNG
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Tiếp nhận kích thước sản phẩm, tính khổ màng và gửi báo giá
                  sỉ/lẻ màng co PVC, POF, PE theo số lượng.
                </p>
              </div>
              <a
                href={`tel:${cleanPhone}`}
                className="mcvt-cat-link"
              >
                📞 Gọi {settings.hotline} →
              </a>
            </div>

            <div className="mcvt-card flex flex-col justify-between">
              <div>
                <span className="mcvt-cat-tag">Kỹ Thuật Đóng Gói</span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  HỖ TRỢ KỸ THUẬT
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Hướng dẫn chỉnh nhiệt độ buồng co, tốc độ băng tải, xử lý lỗi
                  nhăn góc hoặc phồng khí khi bọc màng.
                </p>
              </div>
              <a
                href={`https://zalo.me/${cleanZalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mcvt-cat-link"
              >
                💬 Chat Zalo Kỹ Thuật →
              </a>
            </div>

            <div className="mcvt-card flex flex-col justify-between">
              <div>
                <span className="mcvt-cat-tag">Hợp Tác Phân Phối</span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  TRỞ THÀNH ĐẠI LÝ
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Chính sách chiết khấu và nguồn hàng ổn định cho đại lý vật tư
                  đóng gói, cửa hàng bao bì tại các tỉnh.
                </p>
              </div>
              <a href="#bao-gia" className="mcvt-cat-link">
                📋 Đăng ký đại lý →
              </a>
            </div>

            <div className="mcvt-card flex flex-col justify-between">
              <div>
                <span className="mcvt-cat-tag">Truyền Thông &amp; In Ấn</span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  LIÊN HỆ MARKETING
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Hợp tác truyền thông, cung cấp hồ sơ năng lực và thiết kế trục
                  in ống đồng tem nhãn màng co.
                </p>
              </div>
              <a href={`mailto:${settings.email}`} className="mcvt-cat-link">
                ✉️ {settings.email} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORM YÊU CẦU BÁO GIÁ CHÍNH */}
      <QuoteSection settings={settings} />

      {/* 4. XƯỞNG SẢN XUẤT & BẢN ĐỒ */}
      <section className="mcvt-sec" id="ban-do">
        <div className="mcvt-wrap">
          <div className="mcvt-sec-head">
            <span className="mcvt-eyebrow">Văn phòng &amp; Xưởng</span>
            <h2 className="mcvt-h2">Địa chỉ văn phòng &amp; xưởng sản xuất</h2>
          </div>

          <div className="mcvt-map">
            <div className="mcvt-map-card">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  {settings.company_name}
                </h3>
                <p className="text-sm text-slate-700 mb-2.5">
                  📍 <strong>Địa chỉ:</strong> {settings.address}
                </p>
                <p className="text-sm text-slate-700 mb-2.5">
                  📞 <strong>Hotline / Zalo:</strong>{' '}
                  <a
                    href={`tel:${cleanPhone}`}
                    className="font-extrabold text-blue-700"
                  >
                    {settings.hotline}
                  </a>
                </p>
                <p className="text-sm text-slate-700 mb-2.5">
                  ✉️ <strong>Email:</strong>{' '}
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-semibold text-slate-900"
                  >
                    {settings.email}
                  </a>
                </p>
                <p className="text-sm text-slate-700 mb-4">
                  ⏰ <strong>Giờ làm việc:</strong> Thứ 2 – Thứ 7 (08:00 – 17:30)
                </p>
              </div>

              <div className="mcvt-cta-row" style={{ marginBottom: 0 }}>
                <a
                  className="mcvt-btn mcvt-btn--pri"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mở Google Maps →
                </a>
                <a
                  className="mcvt-btn mcvt-btn--sec"
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat Zalo nhận ưu đãi
                </a>
              </div>
            </div>

            <div className="mcvt-map-frame">
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodedAddress}&t=m&z=16&hl=vi&output=embed`}
                title={`Bản đồ ${settings.company_name}`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
