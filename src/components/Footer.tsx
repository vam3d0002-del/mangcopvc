'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteSettings } from '@/types/database';
import FloatingContact from '@/components/FloatingContact';

export default function Footer({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo =
    !rawZalo ||
    ((rawZalo === '0907616611' || rawZalo === '0932636239') &&
      cleanPhone !== rawZalo)
      ? cleanPhone
      : rawZalo;

  // Không hiển thị Footer công khai khi đang ở trong Portal /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <footer
        className="site-footer"
        role="contentinfo"
        suppressHydrationWarning
      >
        <div className="site-primary-footer-wrap">
          <div className="mcvt-wrap">
            <div className="mcvt-ft">
              {/* CỘT 1 */}
              <div className="mcvt-ft__col1">
                <p className="mcvt-ft__brand">{settings.company_name}</p>
                <p className="mcvt-ft__tag">Màng co PVC · POF · PE</p>
                <p className="mcvt-ft__desc">
                  Cung cấp màng co PVC, màng co POF, màng co PE và màng co nhiệt
                  cho đóng gói. Tư vấn chọn loại màng và quy cách theo nhu cầu.
                </p>
                <ul className="mcvt-ft__contact">
                  <li>
                    <span className="mcvt-ft__ico mcvt-ft__ico--pin" />
                    <div>
                      <small>Địa chỉ</small>
                      <address>{settings.address}</address>
                    </div>
                  </li>
                  <li>
                    <span className="mcvt-ft__ico mcvt-ft__ico--tel" />
                    <div>
                      <small>Hotline</small>
                      <a href={`tel:${cleanPhone}`}>
                        <strong>{settings.hotline}</strong>
                      </a>
                    </div>
                  </li>
                  <li>
                    <span className="mcvt-ft__ico mcvt-ft__ico--mail" />
                    <div>
                      <small>Email</small>
                      <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* CỘT 2 */}
              <div>
                <p className="mcvt-ft__title">Sản phẩm</p>
                <ul className="mcvt-ft__links">
                  <li>
                    <Link href="/mang-co-pvc">Màng co PVC</Link>
                  </li>
                  <li>
                    <Link href="/mang-co-pof">Màng co POF</Link>
                  </li>
                  <li>
                    <Link href="/mang-co-nhiet">Màng co nhiệt</Link>
                  </li>
                  <li>
                    <Link href="/mang-co-pe">Màng co PE</Link>
                  </li>
                </ul>

                <p className="mcvt-ft__title mcvt-ft__gap">Hỗ trợ</p>
                <ul className="mcvt-ft__links">
                  <li>
                    <a href="#bao-gia">Yêu cầu báo giá</a>
                  </li>
                  <li>
                    <Link href="/#uoc-tinh">Ước tính khổ màng</Link>
                  </li>
                  <li>
                    <Link href="/kien-thuc-mang-co-nhiet">
                      Tin tức &amp; kiến thức
                    </Link>
                  </li>
                </ul>
              </div>

              {/* CỘT 3 */}
              <div className="mcvt-ft__cta">
                <p className="mcvt-ft__title">Nhận báo giá nhanh</p>
                <p className="mcvt-ft__desc">
                  Gửi loại màng, khổ, độ dày và số lượng – chúng tôi phản hồi
                  qua điện thoại hoặc Zalo.
                </p>
                <p>
                  <a className="mcvt-ft__hotline" href={`tel:${cleanPhone}`}>
                    {settings.hotline}
                  </a>
                </p>
                <p className="mcvt-ft__small">
                  Gọi hoặc nhắn Zalo để được tư vấn
                </p>
                <div className="mcvt-ft__btns">
                  <a className="mcvt-ft__btn" href={`tel:${cleanPhone}`}>
                    Gọi ngay
                  </a>
                  <a
                    className="mcvt-ft__btn mcvt-ft__btn--zalo"
                    href={`https://zalo.me/${cleanZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat Zalo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="site-below-footer-wrap">
          <div className="mcvt-wrap py-4 text-center">
            <p className="m-0">
              Copyright &copy; {new Date().getFullYear()} {settings.company_name}{' '}
              - Màng Co Nhiệt PVC, PE, POF | Powered by{' '}
              <Link href="/">Công ty sản xuất màng co pvc {settings.company_name}</Link>
            </p>
          </div>
        </div>
      </footer>

      <FloatingContact settings={settings} />
    </>
  );
}
