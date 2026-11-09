import { SiteSettings } from '@/types/database';

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
              <span
                suppressHydrationWarning
                className="bg-white text-[#0068ff] font-black text-[12px] px-2 py-1 rounded-full leading-none tracking-tight shadow-sm inline-block"
              >
                Zalo
              </span>
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
          📞 Gọi {settings.hotline}
        </a>
        <a
          suppressHydrationWarning
          className="s-zalo"
          href={`https://zalo.me/${cleanZalo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Zalo
        </a>
        <a suppressHydrationWarning className="s-quote" href="#bao-gia">
          📋 Báo giá
        </a>
      </div>
    </>
  );
}
