import { SiteSettings } from '@/types/database';

function ZaloLogoSvg({ size = 20 }: { size?: number }) {
  return (
    <svg
      suppressHydrationWarning
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden="true"
    >
      {/* Bong bóng chat Zalo màu trắng chuẩn nhận diện */}
      <path
        fill="#ffffff"
        d="M24 4C12.95 4 4 12.16 4 22.22c0 5.42 2.61 10.29 6.76 13.63-.42 2.27-1.45 4.86-2.99 6.53-.44.48-.09 1.25.56 1.22 3.51-.15 7.42-1.49 9.89-2.6 1.85.5 3.79.77 5.78.77 11.05 0 20-8.16 20-18.22C44 12.16 35.05 4 24 4z"
      />
      {/* Chữ Zalo vector sắc nét màu xanh Zalo #0068ff */}
      <g transform="translate(0.45, 0)">
        <path
          d="M10 18.2H16.5L10 26.8H16.7"
          stroke="#0068ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle
          cx="22.7"
          cy="24.65"
          r="2.2"
          stroke="#0068ff"
          strokeWidth="2.1"
          fill="none"
        />
        <path
          d="M24.9 22.2V26.8"
          stroke="#0068ff"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M28.8 18.1V26.8"
          stroke="#0068ff"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <circle
          cx="34.9"
          cy="24.45"
          r="2.35"
          stroke="#0068ff"
          strokeWidth="2.2"
          fill="none"
        />
      </g>
    </svg>
  );
}

export default function FloatingContact({
  settings,
}: {
  settings: SiteSettings;
}) {
  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo = rawZalo || cleanPhone;
  const encodedAddress = encodeURIComponent(settings.address);

  return (
    <>
      <div
        className="ux-contact-btns"
        aria-label="Liên hệ nhanh"
        suppressHydrationWarning
      >
        {/* 1. Google Maps */}
        <div className="ux-cb-item" suppressHydrationWarning>
          <div className="ux-cb-tooltip" aria-hidden="true">
            <span>📍 Chỉ đường tới xưởng</span>
            <div className="ux-cb-tooltip-arrow" />
          </div>
          <span className="ux-cb-pulse ux-pulse-maps" />
          <span className="ux-cb-pulse ux-cb-pulse--delay ux-pulse-maps" />
          <a
            suppressHydrationWarning
            href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ux-cb-btn ux-btn-maps"
            aria-label={`Chỉ đường tới ${settings.company_name}: ${settings.address}`}
            title={`Chỉ đường tới ${settings.company_name}: ${settings.address}`}
          >
            <div className="ux-icon-wrap ux-anim-maps">
              <svg
                suppressHydrationWarning
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="#fff"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
          </a>
        </div>

        {/* 2. Zalo */}
        <div className="ux-cb-item" suppressHydrationWarning>
          <div className="ux-cb-tooltip" aria-hidden="true">
            <span>💬 Chat Zalo tư vấn 24/7</span>
            <div className="ux-cb-tooltip-arrow" />
          </div>
          <span className="ux-cb-pulse ux-pulse-zalo" />
          <span className="ux-cb-pulse ux-cb-pulse--delay ux-pulse-zalo" />
          <a
            suppressHydrationWarning
            href={`https://zalo.me/${cleanZalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ux-cb-btn ux-btn-zalo"
            aria-label={`Chat Zalo với ${settings.company_name} (${cleanZalo})`}
            title={`Chat Zalo với ${settings.company_name} (${cleanZalo})`}
          >
            <div className="ux-icon-wrap ux-anim-zalo">
              <ZaloLogoSvg size={34} />
            </div>
          </a>
        </div>

        {/* 3. Phone Hotline */}
        <div className="ux-cb-item" suppressHydrationWarning>
          <div className="ux-cb-tooltip" aria-hidden="true">
            <span>📞 Hotline: <strong className="text-amber-500 font-extrabold">{settings.hotline}</strong></span>
            <div className="ux-cb-tooltip-arrow" />
          </div>
          <span className="ux-cb-pulse ux-pulse-phone" />
          <span className="ux-cb-pulse ux-cb-pulse--delay ux-pulse-phone" />
          <a
            suppressHydrationWarning
            href={`tel:${cleanPhone}`}
            className="ux-cb-btn ux-btn-phone"
            aria-label={`Gọi ${settings.company_name}: ${settings.hotline}`}
            title={`Gọi ${settings.company_name}: ${settings.hotline}`}
          >
            <div className="ux-icon-wrap ux-anim-phone">
              <svg
                suppressHydrationWarning
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="#fff"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
            </div>
          </a>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div
        className="mcvt-sticky"
        aria-label="Liên hệ nhanh trên điện thoại"
        suppressHydrationWarning
      >
        <a
          suppressHydrationWarning
          className="s-call"
          href={`tel:${cleanPhone}`}
        >
          <svg
            suppressHydrationWarning
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            className="shrink-0"
            aria-hidden="true"
          >
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
          </svg>
          <span>Gọi {settings.hotline}</span>
        </a>
        <a
          suppressHydrationWarning
          className="s-zalo"
          href={`https://zalo.me/${cleanZalo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ZaloLogoSvg size={20} />
          <span>Zalo</span>
        </a>
        <a suppressHydrationWarning className="s-quote" href="#bao-gia">
          <svg
            suppressHydrationWarning
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>Báo giá</span>
        </a>
      </div>
    </>
  );
}
