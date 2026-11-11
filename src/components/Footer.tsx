'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { SiteSettings } from '@/types/database';
import FloatingContact from '@/components/FloatingContact';

export default function Footer({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo = rawZalo || cleanPhone;

  // Không hiển thị Footer công khai khi đang ở trong Portal /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <footer className="relative bg-gradient-to-b from-[#071f43] via-[#092b5e] to-[#041329] text-slate-300 overflow-hidden border-t-2 border-sky-500/30">
        {/* Subtle decorative background light / glow effect */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-sky-500/10 blur-[130px] pointer-events-none" />

        {/* Top Accent Line */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80" />

        {/* Main Footer Content */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* CỘT 1: THƯƠNG HIỆU & THÔNG TIN NHÀ MÁY (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Logo & Tên Công Ty */}
              <div className="space-y-3">
                <Link href="/" className="inline-block group">
                  <div className="bg-white/95 hover:bg-white p-2.5 rounded-xl shadow-md inline-flex items-center transition-all duration-200 border border-white/20">
                    <img
                      src="/logo.webp"
                      alt={settings.company_name}
                      width={220}
                      height={55}
                      className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                    />
                  </div>
                </Link>
                <h3 className="text-white font-extrabold text-base sm:text-lg tracking-wide uppercase">
                  {settings.company_name}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Màng Co PVC • POF • PE • In Ống Đồng</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Đơn vị chuyên sản xuất, gia công và phân phối các dòng màng co nhiệt PVC, POF, PE trực tiếp tại xưởng. Tư vấn giải pháp đóng gói chuyên nghiệp, tối ưu chi phí và giao hàng nhanh toàn quốc.
              </p>

              {/* Thông tin liên hệ trực quan */}
              <ul className="space-y-3 text-xs sm:text-sm pt-1">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Địa chỉ nhà xưởng / Kho:
                    </span>
                    <address className="not-italic text-slate-200 font-medium leading-snug">
                      {settings.address}
                    </address>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/30">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Hotline tư vấn 24/7:
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-white font-bold text-base hover:text-sky-300 transition-colors"
                    >
                      {settings.hotline}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Email tiếp nhận báo giá:
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-200 hover:text-sky-300 transition-colors break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* CỘT 2: DANH MỤC SẢN PHẨM CHỦ LỰC (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative pb-2">
                <h4 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider">
                  Sản Phẩm
                </h4>
                <div className="w-10 h-0.5 bg-sky-400 rounded-full mt-2" />
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm">
                {[
                  { title: 'Màng co nhiệt PVC', href: '/mang-co-pvc' },
                  { title: 'Màng co nhiệt POF', href: '/mang-co-pof' },
                  { title: 'Màng co nhiệt PE', href: '/mang-co-pe' },
                  { title: 'Màng co nhiệt tổng hợp', href: '/mang-co-nhiet' },
                  { title: 'Túi màng co cắt sẵn', href: '/san-pham?category=mang-co-pvc' },
                  { title: 'Màng co bọc giỏ quà', href: '/san-pham' },
                  { title: 'Màng co niêm phong chai', href: '/san-pham' },
                  { title: 'Tất cả sản phẩm', href: '/san-pham' },
                ].map((item, idx) => (
                  <li key={`prod-link-${idx}`}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CỘT 3: HỖ TRỢ & DỊCH VỤ (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative pb-2">
                <h4 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider">
                  Hỗ Trợ Khách Hàng
                </h4>
                <div className="w-10 h-0.5 bg-sky-400 rounded-full mt-2" />
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm">
                {[
                  { title: 'Yêu cầu bảng báo giá sỉ', href: '#bao-gia' },
                  { title: 'Giới thiệu về công ty', href: '/gioi-thieu' },
                  { title: 'Tin tức & Cẩm nang đóng gói', href: '/tin-tuc' },
                  { title: 'Quy trình sản xuất nhà xưởng', href: '/gioi-thieu' },
                  { title: 'Chính sách bảo hành & Đổi trả', href: '/chinh-sach-doi-tra' },
                  { title: 'Chính sách bảo mật thông tin', href: '/chinh-sach-bao-mat' },
                ].map((item, idx) => (
                  <li key={`supp-link-${idx}`}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CỘT 4: CARD BÁO GIÁ NHANH GLASSMORPHISM (lg:col-span-3 - GỌN GÀNG, KHÔNG RỚT CHỮ) */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-2xl relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                    <Clock className="w-3 h-3" />
                    <span>Báo Giá Nhanh Trong 5 Phút</span>
                  </div>

                  <div>
                    <h4 className="text-white font-extrabold text-base sm:text-lg tracking-tight">
                      Nhận Báo Giá Xưởng
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Gửi loại màng, khổ, độ dày và số lượng để nhận báo giá sỉ ưu đãi nhất ngay hôm nay!
                    </p>
                  </div>

                  {/* Hotline Display */}
                  <div className="p-3 rounded-xl bg-[#041329]/80 border border-sky-400/30 text-center shadow-inner">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Hotline &amp; Zalo trực tiếp
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="block text-2xl font-black text-amber-300 tracking-wider hover:text-amber-200 transition-colors drop-shadow-sm"
                    >
                      {settings.hotline}
                    </a>
                  </div>

                  {/* Action Buttons: 2 nút nằm gọn gàng trên 1 hàng, hoàn toàn không rớt chữ */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-[11px] sm:text-xs text-center shadow-md hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-1 whitespace-nowrap transform hover:-translate-y-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">GỌI NGAY</span>
                    </a>

                    <a
                      href={`https://zalo.me/${cleanZalo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0068ff] to-[#0052cc] hover:from-[#0077ff] hover:to-[#0060e6] text-white font-black text-[11px] sm:text-xs text-center shadow-md hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-1 whitespace-nowrap transform hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">CHAT ZALO</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="bg-[#030e20] border-t border-white/10 py-5 relative z-10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center md:text-left">
            <div>
              <p className="m-0 leading-relaxed">
                © {new Date().getFullYear()} <strong className="text-slate-200">{settings.company_name}</strong> - Màng Co Nhiệt PVC, PE, POF. Tất cả các quyền được bảo lưu.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Nhựa nguyên sinh 100%</span>
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Đạt chuẩn kiểm định</span>
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Giao hàng toàn quốc</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      <FloatingContact settings={settings} />
    </>
  );
}
