'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types/database';
import { submitCustomerInquiry } from '@/app/actions/admin';

interface QuoteSectionProps {
  settings: SiteSettings;
  defaultFilmType?: string;
}

export default function QuoteSection({
  settings,
  defaultFilmType = 'Màng co PVC',
}: QuoteSectionProps) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo =
    !rawZalo ||
    ((rawZalo === '0907616611' || rawZalo === '0932636239') &&
      cleanPhone !== rawZalo)
      ? cleanPhone
      : rawZalo;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await submitCustomerInquiry({
        customer_name: String(fd.get('name') || ''),
        phone: String(fd.get('phone') || ''),
        company: '',
        product_interest: String(fd.get('type') || defaultFilmType),
        quantity_note: String(fd.get('qty') || ''),
        message: String(fd.get('spec') || ''),
      });

      setNotice({ ok: res.ok, text: res.message });
      if (res.ok) form.reset();
    } catch {
      setNotice({
        ok: false,
        text: `Có lỗi xảy ra. Vui lòng gọi trực tiếp Hotline ${settings.hotline}.`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="mcvt-section mcvt-quote"
      id="bao-gia"
      aria-labelledby="mcvt-bg"
    >
      <div className="mcvt-wrap mcvt-quote__grid">
        <div className="mcvt-quote__info">
          <p className="mcvt-eyebrow">Liên hệ báo giá</p>
          <h2 id="mcvt-bg">Gửi quy cách – nhận báo giá màng co</h2>
          <p>
            Cho chúng tôi biết loại màng, khổ, độ dày và số lượng bạn cần. Chưa
            rõ quy cách? Mô tả sản phẩm, chúng tôi tư vấn giúp.
          </p>
          <ul className="mcvt-contact">
            <li>
              <span>Hotline</span>
              <a href={`tel:${cleanPhone}`}>{settings.hotline}</a>
            </li>
            <li>
              <span>Zalo</span>
              <a
                href={`https://zalo.me/${cleanZalo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.hotline}
              </a>
            </li>
            <li>
              <span>Email</span>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <span>Địa chỉ</span>
              <address>{settings.address}</address>
            </li>
          </ul>
        </div>

        <form
          className="mcvt-quote__form"
          onSubmit={handleSubmit}
          suppressHydrationWarning
        >
          <h3 className="mcvt-quote__formtitle">Form yêu cầu báo giá</h3>
          <p className="mcvt-quote__formsub">
            Phản hồi qua điện thoại hoặc Zalo theo số bạn để lại.
          </p>

          {notice && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '14px',
                fontSize: '14px',
                fontWeight: 600,
                background: notice.ok ? '#eff6ff' : '#fef2f2',
                color: notice.ok ? '#1d4ed8' : '#991b1b',
                border: `1px solid ${notice.ok ? '#bfdbfe' : '#fecaca'}`,
              }}
            >
              {notice.text}
            </div>
          )}

          <div className="mcvt-qgrid">
            <div className="mcvt-field">
              <label htmlFor="q_name">
                Họ và tên <span className="text-[#2563eb]">*</span>
              </label>
              <input
                suppressHydrationWarning
                id="q_name"
                name="name"
                type="text"
                required
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="mcvt-field">
              <label htmlFor="q_phone">
                Số điện thoại / Zalo <span className="text-[#2563eb]">*</span>
              </label>
              <input
                suppressHydrationWarning
                id="q_phone"
                name="phone"
                type="tel"
                required
                placeholder="0907 xxx xxx"
              />
            </div>

            <div className="mcvt-field">
              <label htmlFor="q_type">
                Loại màng quan tâm <span className="text-[#2563eb]">*</span>
              </label>
              <select
                suppressHydrationWarning
                id="q_type"
                name="type"
                defaultValue={defaultFilmType}
              >
                <option value="Màng co PVC">Màng co PVC</option>
                <option value="Màng co POF">Màng co POF</option>
                <option value="Màng co nhiệt">Màng co nhiệt</option>
                <option value="Màng co PE">Màng co PE</option>
                <option value="Chưa rõ – cần tư vấn">
                  Chưa rõ – cần tư vấn
                </option>
              </select>
            </div>

            <div className="mcvt-field">
              <label htmlFor="q_qty">Số lượng dự kiến</label>
              <input
                suppressHydrationWarning
                id="q_qty"
                name="qty"
                type="text"
                placeholder="vd 20 cuộn / tháng"
              />
            </div>

            <div className="mcvt-field full">
              <label htmlFor="q_spec">Quy cách / nhu cầu</label>
              <textarea
                suppressHydrationWarning
                id="q_spec"
                name="spec"
                rows={4}
                placeholder="Khổ, độ dày, sản phẩm cần đóng gói, máy co đang dùng…"
              />
            </div>

            <div className="full">
              <button
                suppressHydrationWarning
                type="submit"
                disabled={loading}
                className="mcvt-btn mcvt-btn--primary"
                style={{ width: '100%' }}
              >
                {loading ? 'ĐANG GỬI...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
