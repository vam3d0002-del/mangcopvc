import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles,
  Handshake,
  Sliders,
  Home,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Zap,
  Store,
  Printer,
  Factory,
  PhoneCall,
} from 'lucide-react';
import { getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  return {
    title: `Liên Hệ & Báo Giá ${settings.short_name || settings.company_name} | Nhà Sản Xuất Màng Co`,
    description: `Liên hệ ${settings.company_name} tại ${settings.address}. Hotline / Zalo: ${settings.hotline}. Tư vấn kỹ thuật máy co nhiệt, tính khổ màng chuẩn xác và nhận báo giá sỉ tận xưởng.`,
    alternates: { canonical: '/lien-he' },
  };
}

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
    <div className="bg-white text-slate-800">
      {/* =================================================================
          1. HERO & BREADCRUMB
         ================================================================= */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white border-b border-slate-100 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-br from-sky-200/35 to-blue-200/20 blur-3xl rounded-full pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[250px] bg-gradient-to-tr from-cyan-100/40 to-blue-100/10 blur-2xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Pill */}
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs text-xs text-slate-500 mb-8 backdrop-blur-xs" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 font-bold transition flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-blue-700 font-extrabold">Liên hệ trực tiếp nhà máy</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Liên Hệ Trực Tiếp · Hỗ Trợ Nhanh 24/7</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#072554] tracking-tight leading-[1.2]">
              Liên Hệ{' '}
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {settings.company_name}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Quý khách cần tư vấn chọn chất liệu màng co (PVC, POF, PE), tính khổ túi chuẩn theo mẫu hộp hoặc nhận bảng báo giá sỉ cho nhà máy — hãy kết nối trực tiếp với các bộ phận chuyên trách bên dưới.
            </p>

            {/* 4 Trust Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Zap className="w-4 h-4 fill-current text-amber-500" />
                  <span className="text-xs font-black">Phản Hồi 5 Phút</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Báo giá &amp; tư vấn kỹ thuật ngay</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-black">Mẫu Thử Miễn Phí</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Gửi cuộn mẫu test máy tận nơi</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Factory className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black">Giá Gốc Tận Xưởng</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Không qua trung gian thương mại</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-black">Đổi Trả 100%</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Cam kết đúng quy cách &amp; độ dày</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. KẾT NỐI ĐÚNG BỘ PHẬN (4 CHUYÊN TRÁCH CARDS)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Kết Nối Đúng Bộ Phận</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              Các Kênh Hỗ Trợ Khách Hàng &amp; Đối Tác
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Đội ngũ nhân sự chuyên môn cao sẵn sàng hỗ trợ kỹ thuật và báo giá nhanh chóng cho từng nhu cầu cụ thể.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* CARD 1: Phòng Kinh Doanh */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                01
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <PhoneCall className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    Kinh Doanh
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  BÁO GIÁ ĐƠN HÀNG
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Tiếp nhận kích thước sản phẩm, tính khổ màng chuẩn xác và gửi bảng báo giá sỉ/lẻ màng co PVC, POF, PE theo từng số lượng.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 flex items-center justify-center gap-2 group/btn transition-all"
                >
                  <Phone className="w-4 h-4 fill-current animate-pulse" />
                  <span>GỌI {settings.hotline}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* CARD 2: Kỹ Thuật Đóng Gói */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                02
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Sliders className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    Kỹ Thuật
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  HỖ TRỢ KỸ THUẬT
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Hướng dẫn chỉnh nhiệt độ buồng co, tốc độ băng tải máy nhiệt, xử lý triệt để lỗi nhăn góc, rách mép hoặc phồng khí khi bọc.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 flex items-center justify-center gap-2 group/btn transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>CHAT ZALO KỸ THUẬT</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* CARD 3: Hợp Tác Đại Lý */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d9488] to-[#059669] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                03
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Store className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    Đại Lý
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  TRỞ THÀNH ĐẠI LÝ
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Chính sách chiết khấu giá sỉ cao, hỗ trợ công nợ linh hoạt và nguồn hàng cung ứng ổn định cho đại lý, cửa hàng bao bì các tỉnh.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href="#bao-gia"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 flex items-center justify-center gap-2 group/btn transition-all"
                >
                  <Handshake className="w-4 h-4" />
                  <span>ĐĂNG KÝ ĐẠI LÝ</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* CARD 4: Truyền Thông & In Ấn */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ea580c] to-[#c2410c] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                04
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Printer className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-mono">
                    Truyền Thông
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  LIÊN HỆ MARKETING
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Hợp tác truyền thông, cung cấp hồ sơ năng lực xưởng, hợp đồng pháp nhân VAT và thiết kế trục in ống đồng tem nhãn màng co.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href={`mailto:${settings.email}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn transition-all truncate"
                >
                  <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="truncate">{settings.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. FORM YÊU CẦU BÁO GIÁ CHÍNH (QUOTESECTION)
         ================================================================= */}
      <QuoteSection settings={settings} />

      {/* =================================================================
          4. XƯỞNG SẢN XUẤT & BẢN ĐỒ GOOGLE MAPS
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80" id="ban-do">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Văn Phòng &amp; Xưởng Sản Xuất</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              Địa Chỉ Văn Phòng &amp; Nhà Xưởng
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Trân trọng kính mời quý đối tác đến trực tiếp văn phòng và xưởng để khảo sát năng lực sản xuất, duyệt mẫu màng và thảo luận hợp đồng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left: Office & Factory Details Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_8px_30px_-6px_rgba(2,132,199,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8]" />

              <div>
                <div className="pb-5 border-b border-slate-100 flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#072554] tracking-tight">
                        {settings.company_name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        Nhà máy sản xuất trực tiếp
                      </p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                        Địa chỉ xưởng &amp; văn phòng
                      </span>
                      <strong className="text-slate-800 leading-snug block font-bold">
                        {settings.address}
                      </strong>
                    </div>
                  </div>

                  {/* Hotline */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Hotline tư vấn 24/7
                        </span>
                        <a
                          href={`tel:${cleanPhone}`}
                          className="text-base font-black text-blue-700 hover:text-blue-800"
                        >
                          {settings.hotline}
                        </a>
                      </div>
                    </div>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-black hover:bg-emerald-700 transition shadow-2xs"
                    >
                      Gọi ngay
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                        Email tiếp nhận đơn hàng
                      </span>
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                        Thời gian hoạt động xưởng
                      </span>
                      <span className="font-bold text-slate-800">
                        Thứ 2 – Thứ 7 (07:30 – 18:00) · Chủ nhật hỗ trợ Hotline 24/7
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-500/25 hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>MỞ GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black shadow-md shadow-sky-500/25 hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>CHAT ZALO TƯ VẤN</span>
                </a>
              </div>
            </div>

            {/* Right: Embedded Google Maps Iframe */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-200/90 relative min-h-[380px] lg:min-h-[480px] bg-slate-100 group">
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodedAddress}&t=m&z=16&hl=vi&output=embed`}
                title={`Bản đồ nhà xưởng ${settings.company_name}`}
                className="w-full h-full min-h-[380px] lg:min-h-[480px] border-0"
              />

              {/* Map Floating Header Pill */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-blue-900 text-xs font-black px-4 py-2 rounded-full shadow-lg border border-white/80 flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Vị Trí Xưởng Sản Xuất Trên Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
