'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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
        company: String(fd.get('company') || ''),
        product_interest: String(fd.get('company') || defaultFilmType),
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
      id="bao-gia"
      aria-labelledby="mcvt-bg"
      className="relative py-16 md:py-20 bg-gradient-to-r from-[#072554] via-[#0c4a8a] to-[#0284c7] overflow-hidden"
    >
      {/* Hiệu ứng ánh sáng nền nhẹ nhàng */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ================= CỘT TRÁI: THÔNG TIN TỪ SUPABASE DATABASE ================= */}
          <div className="lg:col-span-7 text-white">
            <h2
              id="mcvt-bg"
              className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-white leading-[1.28] tracking-tight"
            >
              Bạn chưa tìm được bao bì phù hợp <br className="hidden sm:inline" />
              với sản phẩm của mình ?
            </h2>

            {/* Gạch chân ngắn màu xanh sáng */}
            <div className="w-12 h-[3px] rounded-full bg-sky-300 mt-3.5 mb-5" />

            <p className="text-white/90 text-sm md:text-[15px] leading-relaxed max-w-xl mb-7">
              Cho chúng tôi biết sản phẩm, quy cách túi/màng và số lượng dự kiến. Đội ngũ kỹ
              thuật của{' '}
              <strong className="font-bold text-white">
                {settings.short_name || settings.company_name}
              </strong>{' '}
              sẽ tư vấn cấu trúc màng ghép &amp; màng co phù hợp và gửi báo giá tận xưởng.
            </p>

            {/* 2 Khung thông tin kính mờ lấy trực tiếp từ Supabase Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
              <div className="rounded-xl bg-white/15 backdrop-blur-xs border border-white/30 p-4 shadow-sm">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#fde047] mb-1.5">
                  VĂN PHÒNG &amp; NHÀ MÁY
                </span>
                <p className="text-xs md:text-[13px] font-bold text-white leading-relaxed">
                  {settings.address}
                </p>
              </div>

              <div className="rounded-xl bg-white/15 backdrop-blur-xs border border-white/30 p-4 shadow-sm">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#fde047] mb-1.5">
                  LIÊN HỆ TRỰC TIẾP
                </span>
                <p className="text-xs md:text-[13px] font-bold text-white leading-relaxed">
                  <span className="block">Hotline/Zalo: {settings.hotline}</span>
                  <span className="block mt-0.5 truncate">Email: {settings.email}</span>
                </p>
              </div>
            </div>

            {/* Nút Gọi Hotline & Zalo theo tông màu xanh chủ đạo */}
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href={`tel:${cleanPhone}`}
                className="group relative overflow-hidden inline-flex items-center justify-center px-7 py-3 rounded-full text-xs md:text-sm font-extrabold text-white bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] border border-sky-300/40 shadow-lg shadow-blue-950/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span
                  className="pointer-events-none absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/55 to-transparent -skew-x-12 group-hover:left-[140%] transition-all duration-700 ease-out"
                  aria-hidden="true"
                />
                <span>Gọi {settings.hotline}</span>
              </a>

              <a
                href={`https://zalo.me/${cleanZalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs md:text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/35 backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Chat Zalo Ngay</span>
              </a>
            </div>
          </div>

          {/* ================= CỘT PHẢI: CARD FORM TRẮNG NỔI BẬT ================= */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              suppressHydrationWarning
              className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-7 md:p-8 shadow-2xl shadow-blue-950/35 max-w-[430px] mx-auto w-full"
            >
              <h3 className="text-lg md:text-xl font-extrabold text-[#0f2d59] text-center">
                Nhận tư vấn bao bì
              </h3>
              <p className="text-[11.5px] md:text-xs text-slate-600 text-center leading-relaxed mt-2 mb-5">
                Để nhận báo giá phù hợp, vui lòng cho biết sản phẩm cần đóng gói, kích thước
                hoặc dung tích túi và số lượng dự kiến. Nếu chưa có quy cách, hãy mô tả nhu
                cầu để được tư vấn.
              </p>

              {notice && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-bold border flex items-start gap-2 ${
                    notice.ok
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {notice.ok ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  )}
                  <span>{notice.text}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <input
                    suppressHydrationWarning
                    id="q_name"
                    name="name"
                    type="text"
                    required
                    placeholder="Họ và tên *"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    suppressHydrationWarning
                    id="q_company"
                    name="company"
                    type="text"
                    placeholder="Công ty / Sản phẩm quan tâm"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    suppressHydrationWarning
                    id="q_qty"
                    name="qty"
                    type="text"
                    placeholder="Email / Số lượng"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-none transition"
                  />
                  <input
                    suppressHydrationWarning
                    id="q_phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="SĐT / Zalo *"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <textarea
                    suppressHydrationWarning
                    id="q_spec"
                    name="spec"
                    rows={4}
                    placeholder="Nội dung (Quy cách, kích thước, loại màng...)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-none transition resize-y"
                  />
                </div>

                <div className="pt-1">
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={loading}
                    className="group relative overflow-hidden w-full py-3 px-6 rounded-full text-xs md:text-sm font-extrabold text-white bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300 disabled:opacity-60 cursor-pointer"
                  >
                    <span
                      className="pointer-events-none absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/55 to-transparent -skew-x-12 group-hover:left-[140%] transition-all duration-700 ease-out"
                      aria-hidden="true"
                    />
                    <span>{loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu báo giá'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
