import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Factory,
  Sliders,
  ShieldCheck,
  Layers,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Award,
  Sparkles,
  Handshake,
  Clock,
  FileText,
  ReceiptText,
  Boxes,
  Truck,
  Home,
  Users,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  return {
    title: `Giới Thiệu ${settings.short_name || settings.company_name} | Nhà Sản Xuất Màng Co PVC, POF, PE`,
    description: `Giới thiệu ${settings.company_name} – Nhà sản xuất và cung cấp màng co nhiệt PVC, POF, PE trực tiếp tại xưởng. Đa dạng quy cách cuộn, túi cắt sẵn và in tem nhãn.`,
    alternates: { canonical: '/gioi-thieu' },
  };
}

export default async function AboutPage() {
  const settings = await getCachedSiteSettings();
  const cleanPhone = settings.hotline.replace(/\s|\./g, '');

  return (
    <div className="bg-white text-slate-800">
      {/* =================================================================
          1. HERO & BREADCRUMB
         ================================================================= */}
      <section className="py-10 lg:py-16 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white border-b border-slate-100 relative overflow-hidden">
        {/* Subtle grid background pattern */}
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
            <span className="text-blue-700 font-extrabold">Giới thiệu năng lực doanh nghiệp</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hồ Sơ Năng Lực Doanh Nghiệp</span>
                </div>

                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-600 mb-1.5">
                  {settings.company_name}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black text-[#072554] tracking-tight leading-[1.2]">
                  Nhà Sản Xuất{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    Màng Co Nhiệt PVC, POF, PE
                  </span>{' '}
                  Trực Tiếp Tại Xưởng
                </h1>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Được thành lập với <strong>hơn 10 năm kinh nghiệm</strong> chuyên sâu trong ngành sản xuất và gia công màng co nhiệt công nghiệp. Chúng tôi tự hào cung ứng giải pháp đóng gói chất lượng cao, độ co ôm sát ổn định, đáp ứng tiêu chuẩn khắt khe cho hơn 1.500+ doanh nghiệp trên toàn quốc.
              </p>

              {/* 4 Trust Stat Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl sm:text-2xl font-black font-mono text-blue-600 block group-hover:scale-105 transition-transform">10+ Năm</span>
                    <Clock className="w-4 h-4 text-blue-500/70" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Kinh nghiệm xưởng</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl sm:text-2xl font-black font-mono text-blue-600 block group-hover:scale-105 transition-transform">1.500+</span>
                    <Users className="w-4 h-4 text-blue-500/70" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Khách hàng tin chọn</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 block group-hover:scale-105 transition-transform">50+ Tấn</span>
                    <Factory className="w-4 h-4 text-indigo-500/70" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Cung ứng mỗi tháng</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 block group-hover:scale-105 transition-transform">100%</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Nhựa nguyên sinh</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#bao-gia"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-100" />
                  <span>YÊU CẦU BÁO GIÁ NHANH</span>
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 fill-current animate-pulse" />
                  <span>HOTLINE: {settings.hotline}</span>
                </a>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/20 border-4 border-white bg-slate-900 group ring-1 ring-slate-200/90">
                <img
                  src={settings.hero_banner_url || settings.banner_url || '/media/banners/banner-mang-co.webp'}
                  alt={`Xưởng sản xuất màng co ${settings.company_name}`}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
                  width={640}
                  height={420}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-blue-900 text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-md border border-white/80 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Dây Chuyền Thổi Màng Trực Tiếp</span>
                </div>

                {/* Floating Bottom Left Badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Công suất 50+ tấn/tháng</span>
                </div>

                {/* Floating Bottom Right Button */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Khám phá xưởng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. NHÀ SẢN XUẤT MÀNG CO TRỰC TIẾP (2 COLUMNS)
         ================================================================= */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Description & Value Props */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/70">
                <Factory className="w-3.5 h-3.5 text-blue-600" />
                <span>Năng Lực Sản Xuất Thực Tế</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight leading-tight">
                Nhà Sản Xuất Màng Co Nhiệt Trực Tiếp Tại Xưởng
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                <strong>{settings.company_name}</strong> chuyên sản xuất và phân phối trực tiếp các dòng{' '}
                <strong className="text-blue-700 font-black">Màng Co PVC, Màng Co POF, Màng Co PE</strong> cho thị trường đóng gói toàn quốc. Chúng tôi cam kết chất lượng sản phẩm chuẩn xác đến từng micron, giá thành gốc tận xưởng và giao hàng đúng tiến độ.
              </p>

              {/* Quote callout box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-slate-50 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium shadow-2xs">
                &ldquo;Được trang bị hệ thống máy thổi màng nhiều tầng tự động, máy chia cuộn chính xác và dàn máy cắt túi dập đáy tốc độ cao, chúng tôi tự hào cung cấp giải pháp đóng gói toàn diện, hạn chế hao hụt màng tối đa cho đối tác.&rdquo;
              </div>

              {/* 4 Feature Advantages with colorful gradient icon badges */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/25">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 mb-0.5">100% Nhựa Nguyên Sinh</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">Không pha tạp, không mùi khét, màng trong suốt và co ôm khít.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/25">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 mb-0.5">Quy Cách Chuẩn Milimet</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">Cắt túi ép ngang, dập cong hình cung, chia cuộn theo đúng yêu cầu.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/25">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 mb-0.5">Chứng Nhận An Toàn CO/CQ</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">Đầy đủ hồ sơ kiểm định an toàn đóng gói tiếp xúc thực phẩm.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/20 transition-all flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/25">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 mb-0.5">Giao Hỏa Tốc Toàn Quốc</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">Đóng pallet cẩn thận, giao nhanh trong ngày và gửi chành xe toàn quốc.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Executive Company Profile Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_8px_30px_-6px_rgba(2,132,199,0.12)] relative overflow-hidden">
                {/* Top gradient border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8]" />

                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#072554] tracking-tight">Thông Tin Doanh Nghiệp</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hồ Sơ Năng Lực Pháp Lý</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-3">
                    <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">
                      Tên pháp nhân công ty
                    </span>
                    <strong className="text-slate-900 text-sm font-black block leading-snug">
                      {settings.company_name}
                    </strong>
                  </div>

                  <div className="py-3">
                    <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">
                      Lĩnh vực hoạt động chính
                    </span>
                    <span className="text-slate-700 font-semibold leading-relaxed block">
                      Sản xuất &amp; gia công màng co nhiệt PVC, POF, PE, tem nhãn màng co công nghiệp
                    </span>
                  </div>

                  <div className="py-3">
                    <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">
                      Địa chỉ nhà xưởng &amp; văn phòng
                    </span>
                    <span className="text-slate-800 font-medium flex items-start gap-2 mt-0.5 leading-relaxed">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{settings.address}</span>
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">
                        Hotline kỹ thuật 24/7
                      </span>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="text-blue-600 hover:text-blue-700 font-black text-base flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4 fill-current animate-pulse text-emerald-600" />
                        <span>{settings.hotline}</span>
                      </a>
                    </div>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 transition-opacity text-[11px] font-black shadow-xs flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 fill-current" />
                      <span>Gọi ngay</span>
                    </a>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">
                        Zalo tư vấn báo giá
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{settings.zalo}</span>
                    </div>
                    <a
                      href={`https://zalo.me/${settings.zalo.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors text-[11px] font-bold shadow-xs flex items-center gap-1"
                    >
                      <span>Chat Zalo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="py-3">
                    <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">
                      Email liên hệ &amp; đặt hàng
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-700 hover:text-blue-600 font-bold flex items-center gap-1.5"
                    >
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>{settings.email}</span>
                    </a>
                  </div>
                </div>

                {/* Trust footer stamp */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 -mx-6 -mb-6 px-6 py-3 rounded-b-3xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cam kết nhà sản xuất trực tiếp — Giá gốc không trung gian</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. NĂNG LỰC SẢN XUẤT (4 CARDS)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-y border-slate-200/80 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-sky-100/30 to-blue-100/20 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <Factory className="w-3.5 h-3.5 text-blue-600" />
              <span>Hệ Thống Dây Chuyền Nhà Máy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              Năng Lực Cung Ứng &amp; Sản Xuất Vượt Trội
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Khả năng cung ứng ổn định 50+ tấn/tháng với hệ thống máy móc sản xuất hiện đại và quy trình kiểm định chất lượng khắt khe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Sản xuất trực tiếp */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284c7] to-[#0369a1] opacity-90 group-hover:h-1.5 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                01
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Factory className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                    100% Tại Xưởng
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Sản Xuất Trực Tiếp
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Không qua bất kỳ trung gian thương mại nào. Khách hàng nhận giá gốc tận xưởng, chủ động 100% tiến độ và chất lượng nguyên sinh.
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Giá sỉ gốc tận nhà máy</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Card 2: Quy cách theo yêu cầu */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] opacity-90 group-hover:h-1.5 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                02
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Sliders className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    Đa Quy Cách
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Gia Công Theo Đơn
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Nhận sản xuất màng dạng cuộn, túi cắt sẵn ép ngang, dập cong hình cung, màng co dán nhiệt và in ấn tem nhãn màng co sắc nét.
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Chuẩn xác từng milimet</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Card 3: Kiểm soát chất lượng */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0d9488] to-[#059669] opacity-90 group-hover:h-1.5 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                03
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    Chuẩn KCS 100%
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Kiểm Định Khắt Khe
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Từng cuộn màng xuất xưởng được đo độ dày micron, kiểm tra độ bền kéo đứt và lực co nhiệt đồng đều trước khi bàn giao cho đối tác.
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bảo hành đổi trả nếu lỗi</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Card 4: Đa ngành nghề */}
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ea580c] to-[#c2410c] opacity-90 group-hover:h-1.5 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                04
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Layers className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-mono">
                    Mọi Ngành Hàng
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Đa Ngành Đóng Gói
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Đáp ứng tối ưu nhu cầu đóng gói cho thực phẩm, nước giải khát, mỹ phẩm, dược phẩm, văn phòng phẩm, linh kiện và hàng tiêu dùng.
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>1.500+ Doanh nghiệp tin dùng</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. FULL-WIDTH BLUE CTA BANNER
         ================================================================= */}
      <section className="bg-gradient-to-r from-[#072554] via-[#0c4a8a] to-[#072554] text-white py-12 lg:py-14 shadow-lg border-y border-sky-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-400/20 text-sky-300 border border-sky-400/30 mb-1">
                Giải Pháp Đóng Gói Tiết Kiệm Chi Phí
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight">
                Cùng{' '}
                <span className="text-sky-300">
                  {settings.short_name || 'Bao Bì Thành Phát'}
                </span>{' '}
                nâng tầm chất lượng đóng gói cho thương hiệu của bạn
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
                Liên hệ ngay hôm nay để nhận cuộn mẫu test thực tế miễn phí và tư vấn kỹ thuật đóng gói tối ưu 15-20% chi phí.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="#bao-gia"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm uppercase tracking-wide transition shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95"
              >
                YÊU CẦU BÁO GIÁ NHANH
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="px-6 py-3.5 rounded-xl bg-white/10 border-2 border-white/60 text-white hover:bg-white/20 font-black text-xs sm:text-sm uppercase tracking-wide transition hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-sky-300" />
                <span>GỌI {settings.hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. SẢN PHẨM CỦA CHÚNG TÔI (4 KEY PRODUCT CARDS)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              <span>Danh Mục Sản Phẩm Chủ Lực</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              Các Dòng Màng Co Sản Xuất Tại Xưởng
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Đáp ứng đầy đủ quy cách dạng cuộn công nghiệp, túi cắt sẵn ép nhiệt và in ấn tem nhãn màng co sắc nét.
            </p>
          </div>

          {/* 4 Rich Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Product 1: Màng Co PVC */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src="/media/categories/mang-co-pvc.webp"
                    alt="Màng co PVC dạng cuộn và cắt túi"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    Bán chạy nhất
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    Màng Co PVC
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Độ bóng sáng vượt trội, co nhanh ở 110-130°C. Thích hợp bọc hộp mỹ phẩm, bánh kẹo, trà, nắp bình 20L.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Khổ 80 - 800mm</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Dày 25 - 60µm</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  href="/mang-co-pvc"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Xem Chi Tiết &amp; Giá Sỉ</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Product 2: Màng Co POF */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src="/media/categories/mang-co-pof.webp"
                    alt="Màng co POF chuẩn FDA an toàn thực phẩm"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    Chuẩn FDA Thực Phẩm
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    Màng Co POF 5 Lớp
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Mềm mịn, không mùi độc hại, chịu âm sâu không giòn gãy. Đạt chứng nhận FDA tiếp xúc trực tiếp thực phẩm.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Khổ 150 - 600mm</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Dày 12 - 25µm</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  href="/mang-co-pof"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Xem Chi Tiết &amp; Giá Sỉ</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Product 3: Màng Co PE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src="/media/categories/mang-co-pe.webp"
                    alt="Màng co PE bọc lốc chai lọ và kiện hàng"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    Chịu Lực Siêu Bền
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    Màng Co PE (Nhiệt)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Chuyên bọc lốc lon nước ngọt, lốc chai nước, bia và kiện hàng nặng. Độ dai cực lớn, chống bục rách tối đa.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Khổ 200 - 1200mm</span>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Dày 40 - 120µm</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  href="/mang-co-pe"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Xem Chi Tiết &amp; Giá Sỉ</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Product 4: Túi Cắt Sẵn & Màng Co Nhiệt */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src="/media/banners/banner-mang-co.webp"
                    alt="Gia công cắt túi màng co và in tem nhãn"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    Gia Công Đa Dạng
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    Màng Co Nhiệt &amp; Cắt Túi
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Gia công cắt túi ép ngang, dập cong hình cung, màng co dán nhiệt và in ấn tem nhãn màng co thương hiệu.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Cắt túi theo yêu cầu</span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">In ấn 1 - 8 màu</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  href="/mang-co-nhiet"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Xem Chi Tiết &amp; Giá Sỉ</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Category Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            <span className="text-xs font-bold text-slate-400 mr-1">Xem nhanh danh mục:</span>
            <Link
              href="/mang-co-pvc"
              className="px-4 py-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs hover:shadow-xs transition"
            >
              Màng co PVC
            </Link>
            <Link
              href="/mang-co-pof"
              className="px-4 py-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs hover:shadow-xs transition"
            >
              Màng co POF
            </Link>
            <Link
              href="/mang-co-pe"
              className="px-4 py-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs hover:shadow-xs transition"
            >
              Màng co PE
            </Link>
            <Link
              href="/mang-co-nhiet"
              className="px-4 py-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs hover:shadow-xs transition"
            >
              Màng co nhiệt
            </Link>
            <Link
              href="/san-pham"
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs hover:shadow transition flex items-center gap-1"
            >
              <span>Tất cả sản phẩm</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. GIÁ TRỊ CỐT LÕI (3 CARDS VỚI SỐ LỚN 01, 02, 03)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-t border-slate-200/80 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-100/40 to-blue-100/30 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Cam Kết &amp; Triết Lý Hoạt Động</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              3 Trụ Cột Giá Trị Cốt Lõi
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nền tảng vững chắc giúp {settings.short_name || 'Bao Bì Thành Phát'} trở thành đối tác tin cậy hàng đầu của hơn 1.500+ doanh nghiệp đóng gói trên toàn quốc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 01: Uy Tín */}
            <div className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-blue-400 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284c7] to-[#0369a1] opacity-90 group-hover:h-2 transition-all duration-300" />

              {/* Background watermark */}
              <span className="absolute -top-3 -right-2 text-7xl font-black font-mono text-slate-100 group-hover:text-blue-100/80 transition-colors pointer-events-none select-none tracking-tighter">
                01
              </span>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                    Bảo chứng vàng
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5">
                  Uy Tín &amp; Trách Nhiệm
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Giữ đúng 100% cam kết về chất lượng màng, đúng độ dày micron, đủ số mét cuộn và tiến độ giao hàng cho mọi đối tác.
                </p>

                {/* Commitments checklist */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Đúng độ dày micron theo hợp đồng</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Đủ 100% số mét cuộn (không hao hụt)</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Giao hàng đúng tiến độ cam kết</span>
                  </li>
                </ul>
              </div>

              {/* Bottom tag */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg">
                  Đổi trả 100% nếu sai quy cách
                </span>
                <div className="w-8 h-1 bg-gradient-to-r from-[#0284c7] to-[#38bdf8] rounded-full group-hover:w-14 transition-all duration-300" />
              </div>
            </div>

            {/* Card 02: Chất Lượng */}
            <div className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-blue-400 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] opacity-90 group-hover:h-2 transition-all duration-300" />

              {/* Background watermark */}
              <span className="absolute -top-3 -right-2 text-7xl font-black font-mono text-slate-100 group-hover:text-blue-100/80 transition-colors pointer-events-none select-none tracking-tighter">
                02
              </span>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <Sparkles className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    Chuẩn nguyên sinh
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5">
                  Chất Lượng Vượt Trội
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Luôn sử dụng nguồn hạt nhựa nguyên sinh cao cấp, màng trong suốt bóng kính, không mùi độc hại, độ co ôm sát và đường hàn chắc chắn.
                </p>

                {/* Commitments checklist */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>100% hạt nhựa nguyên sinh cao cấp</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Màng trong suốt, bóng loáng, không ố vàng</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Mối hàn kín khít, chịu lực kéo căng lớn</span>
                  </li>
                </ul>
              </div>

              {/* Bottom tag */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg">
                  Kiểm định KCS từng lô hàng
                </span>
                <div className="w-8 h-1 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] rounded-full group-hover:w-14 transition-all duration-300" />
              </div>
            </div>

            {/* Card 03: Đồng Hành Lâu Dài */}
            <div className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-blue-400 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d9488] to-[#059669] opacity-90 group-hover:h-2 transition-all duration-300" />

              {/* Background watermark */}
              <span className="absolute -top-3 -right-2 text-7xl font-black font-mono text-slate-100 group-hover:text-blue-100/80 transition-colors pointer-events-none select-none tracking-tighter">
                03
              </span>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <Handshake className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    Hợp tác bền vững
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5">
                  Đồng Hành Lâu Dài
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Tư vấn giải pháp tiết kiệm chi phí, hỗ trợ kỹ thuật máy co nhiệt tận tâm và cung cấp mẫu thử miễn phí tận nơi cho mọi khách hàng.
                </p>

                {/* Commitments checklist */}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Gửi cuộn mẫu test thực tế miễn phí</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hỗ trợ căn chỉnh thông số máy co 24/7</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Chính sách chiết khấu giá sỉ tốt nhất</span>
                  </li>
                </ul>
              </div>

              {/* Bottom tag */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
                  Hỗ trợ kỹ thuật viên trọn đời
                </span>
                <div className="w-8 h-1 bg-gradient-to-r from-[#0d9488] to-[#059669] rounded-full group-hover:w-14 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          7. QUY TRÌNH HỢP TÁC (4 STEP CARDS)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Quy Trình Làm Việc Chuẩn Hóa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              Quy Trình 4 Bước Hợp Tác Nhanh Chóng
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Quy trình làm việc chuyên nghiệp, khép kín và minh bạch từ khâu tiếp nhận thông số đến khi bàn giao tận kho xưởng.
            </p>
          </div>

          {/* Desktop Step Flow Connector Line */}
          <div className="hidden lg:flex items-center justify-between max-w-4xl mx-auto mb-10 px-6 py-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
            {[
              { num: '01', title: 'Tiếp Nhận Yêu Cầu' },
              { num: '02', title: 'Tư Vấn & Báo Giá' },
              { num: '03', title: 'Sản Xuất Theo Đơn' },
              { num: '04', title: 'Giao Hàng Tận Nơi' },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black font-mono flex items-center justify-center shadow-xs">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                    {step.title}
                  </span>
                </div>
                {idx < 3 && (
                  <div className="w-10 xl:w-16 h-0.5 bg-gradient-to-r from-blue-400 to-slate-200 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* 4 Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                step: '01',
                badge: 'Phản hồi 5 phút',
                title: 'Tiếp Nhận Nhu Cầu',
                desc: 'Tiếp nhận thông tin chi tiết về sản phẩm cần bọc, kích thước hộp, sản lượng và loại máy co nhiệt đang sử dụng.',
                highlight: 'Khảo sát & tư vấn mẫu tận nơi',
                gradient: 'from-[#0284c7] to-[#0369a1]',
                shadow: 'shadow-sky-500/25',
                icon: FileText,
              },
              {
                step: '02',
                badge: 'Giá sỉ tận xưởng',
                title: 'Tư Vấn & Báo Giá Sỉ',
                desc: 'Tư vấn chọn loại màng tối ưu (PVC, POF, PE), tính đúng khổ màng giúp tiết kiệm 15-20% chi phí và gửi báo giá sỉ.',
                highlight: 'Báo giá sỉ trực tiếp tại nhà máy',
                gradient: 'from-[#2563eb] to-[#1d4ed8]',
                shadow: 'shadow-blue-500/25',
                icon: ReceiptText,
              },
              {
                step: '03',
                badge: 'Tự động hóa',
                title: 'Sản Xuất Theo Đơn',
                desc: 'Tiến hành thổi màng, chia cuộn hoặc gia công cắt túi theo đúng kích thước và thông số kỹ thuật đã cam kết trong hợp đồng.',
                highlight: 'Kiểm định KCS độ bền kéo đứt',
                gradient: 'from-[#0d9488] to-[#059669]',
                shadow: 'shadow-teal-500/25',
                icon: Boxes,
              },
              {
                step: '04',
                badge: 'Đúng tiến độ',
                title: 'Giao Hàng Tận Nơi',
                desc: 'Đóng gói kiện pallet cẩn thận, hỗ trợ giao hàng nhanh chóng tận xưởng và gửi chành xe đi khắp các tỉnh thành toàn quốc.',
                highlight: 'Giao hỏa tốc nội thành trong ngày',
                gradient: 'from-[#ea580c] to-[#c2410c]',
                shadow: 'shadow-orange-500/25',
                icon: Truck,
              },
            ].map((st) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={`partner-step-${st.step}`}
                  className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Gradient Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${st.gradient} opacity-90 group-hover:h-1.5 transition-all duration-300`}
                  />

                  {/* Watermark Number */}
                  <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                    {st.step}
                  </span>

                  <div>
                    {/* Header: Icon + Step Badge */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${st.gradient} text-white flex items-center justify-center shadow-md ${st.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <StepIcon className="w-6 h-6 stroke-[2.2]" />
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        BƯỚC {st.step}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                      {st.desc}
                    </p>
                  </div>

                  {/* Bottom Highlight Tag */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{st.highlight}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consultation Callout Banner */}
          <div className="bg-gradient-to-r from-[#072554] via-[#0b3874] to-[#072554] rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800/40 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
                Hợp Tác Trực Tiếp Với Xưởng
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">
                Bạn cần tư vấn giải pháp bao bì &amp; nhận bảng báo giá sỉ cạnh tranh?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Đội ngũ kỹ thuật viên {settings.short_name || 'Bao Bì Thành Phát'} luôn sẵn sàng khảo sát kích thước hộp, gửi cuộn test mẫu miễn phí và cam kết mức giá tối ưu nhất.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <a
                href={`tel:${cleanPhone}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0284c7] hover:to-[#1d4ed8] text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-current animate-pulse" />
                <span>GỌI HOTLINE: {settings.hotline}</span>
              </a>
              <a
                href="#bao-gia"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Yêu Cầu Báo Giá</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. BÁO GIÁ & LIÊN HỆ (QUOTE SECTION)
         ================================================================= */}
      <QuoteSection settings={settings} />
    </div>
  );
}
