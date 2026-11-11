import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  Layers,
  Scissors,
  Droplets,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Award,
  Phone,
  Boxes,
  Gift,
  Wrench,
  Tag,
  Flame,
  Home,
  Check,
  Zap,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { getCachedPostsList, getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  return {
    title: `Màng Co PVC Dạng Cuộn, Túi Cắt Sẵn & In Tem Nhãn | ${settings.short_name || settings.company_name}`,
    description: `Chuyên sản xuất màng co PVC dạng cuộn, túi cắt ép ngang, túi ép cong bọc giỏ quà Tết, màng co áo bình nước 21L và in tem nhãn trực tiếp tại xưởng ${settings.company_name}. Giá sỉ cạnh tranh.`,
    alternates: { canonical: '/mang-co-pvc' },
  };
}

export default async function MangCoPvcPage() {
  const [settings, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPostsList(),
  ]);

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const pvcPosts = posts.filter((p) => p.category_name === 'Màng Co PVC');

  return (
    <div className="bg-white text-slate-800">
      {/* =================================================================
          1. HERO & THÔNG SỐ KỸ THUẬT NHANH
         ================================================================= */}
      <section className="py-10 lg:py-16 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white border-b border-slate-100 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-br from-sky-200/35 to-blue-200/20 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Pill */}
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs text-xs text-slate-500 mb-8 backdrop-blur-xs" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 font-bold transition flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-blue-700 font-extrabold">Màng Co PVC</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>SẢN PHẨM CHỦ LỰC · POLYVINYL CHLORIDE SHRINK FILM</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black text-[#072554] tracking-tight leading-[1.2]">
                  <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    Màng Co PVC
                  </span>{' '}
                  – Cuộn, Túi Cắt Ép Theo Mẫu &amp; In Tem Nhãn Quy Cách
                </h1>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Độ bóng sáng như kính, cứng cáp giữ form hộp đứng thẳng đẹp mắt, co nhanh ở nhiệt độ thấp bằng cả súng khò nhiệt cầm tay lẫn buồng co tự động. Phù hợp đóng gói hộp mỹ phẩm, chai lọ, văn phòng phẩm, bình nước 21L và giỏ quà Tết.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#bao-gia"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>NHẬN BÁO GIÁ MÀNG CO PVC</span>
                </a>
                <a
                  href="#san-pham-pvc"
                  className="px-6 py-3.5 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-800 font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>4 DÒNG PVC CHỦ LỰC</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>
              </div>
            </div>

            {/* Right Quick Specs Card */}
            <div className="lg:col-span-5">
              <aside className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_8px_30px_-6px_rgba(2,132,199,0.12)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8]" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#072554] tracking-tight">Thông Số Kỹ Thuật Chuẩn</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tiêu Chuẩn Sản Xuất Tại Xưởng</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs sm:text-sm mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Độ dày phổ biến</dt>
                    <dd className="font-black text-slate-900 text-base font-mono">15 – 40 µm</dd>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Khổ màng xưởng</dt>
                    <dd className="font-black text-slate-900 text-base font-mono">80 – 800 mm</dd>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Nhiệt độ co</dt>
                    <dd className="font-black text-blue-700 text-base font-mono">130 – 160 °C</dd>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tỷ lệ co rút</dt>
                    <dd className="font-black text-emerald-600 text-base font-mono">40% – 55%</dd>
                  </div>
                  <div className="col-span-2 p-3 rounded-2xl bg-blue-50/80 border border-blue-200/80">
                    <dt className="text-[11px] text-blue-700 font-bold uppercase tracking-wider mb-0.5">
                      Quy cách đóng gói giao xưởng
                    </dt>
                    <dd className="font-black text-slate-900 text-xs sm:text-sm">
                      Cuộn nguyên · Túi cắt ép ngang / ép cong · In tem nhãn
                    </dd>
                  </div>
                </dl>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Nhận cắt mẫu thử miễn phí:</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>{settings.hotline}</span>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. CHIP TOC (MỤC LỤC ĐIỀU HƯỚNG NHANH)
         ================================================================= */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar text-xs">
          <span className="font-black text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">Mục lục:</span>
          <a href="#la-gi" className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-slate-700 transition whitespace-nowrap">
            Màng co PVC là gì?
          </a>
          <a href="#uu-nhuoc" className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-slate-700 transition whitespace-nowrap">
            Ưu &amp; nhược điểm
          </a>
          <a href="#san-pham-pvc" className="px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 hover:bg-blue-200 font-black transition whitespace-nowrap">
            4 dòng PVC chủ lực
          </a>
          <a href="#phan-loai" className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-slate-700 transition whitespace-nowrap">
            Phân loại &amp; Ứng dụng
          </a>
          <a href="#bang-gia" className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-slate-700 transition whitespace-nowrap">
            Bảng quy cách giá
          </a>
          <a href="#hoi-dap" className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-slate-700 transition whitespace-nowrap">
            Câu hỏi thường gặp
          </a>
        </div>
      </div>

      {/* =================================================================
          3. MÀNG CO PVC LÀ GÌ?
         ================================================================= */}
      <section className="py-14 lg:py-20 bg-white" id="la-gi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/70">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Tổng Quan Về Chất Liệu</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight leading-tight">
                Màng Co PVC Là Gì?
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                <strong>Màng co PVC (Polyvinyl Chloride Shrink Film)</strong> là loại màng nhựa nhiệt dẻo được sản xuất từ hạt nhựa PVC nguyên sinh bằng phương pháp thổi màng định hướng. Khi gặp nguồn nhiệt từ 130°C – 160°C, màng sẽ co rút nhanh và ôm khít lấy hình dáng của vật thể bên trong.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Nhờ bề mặt bóng sáng như kính, độ cứng cáp tốt và chi phí đầu tư ban đầu thấp, màng co PVC là lựa chọn hàng đầu cho các cơ sở đóng gói hộp mỹ phẩm, hộp trà, nhang, văn phòng phẩm, bình nước lọc 20L và giỏ quà Tết.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-br from-[#072554] via-[#0b3874] to-[#072554] text-white p-7 sm:p-8 shadow-xl shadow-blue-950/20 border border-sky-400/30 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/25 border border-sky-400/40 text-sky-200 text-xs font-bold mb-3 tracking-wide">
                    Khi nào nên chọn Màng Co PVC?
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-4">
                    3 trường hợp tối ưu nhất để dùng PVC
                  </h3>
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-100">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/40">
                        ✓
                      </span>
                      <span className="leading-relaxed">
                        <strong>Đóng gói bằng súng khò nhiệt cầm tay</strong> hoặc buồng co nhiệt công suất vừa và nhỏ.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/40">
                        ✓
                      </span>
                      <span className="leading-relaxed">
                        Cần lớp màng <strong>cứng cáp, giữ form</strong> cho hộp giấy, giỏ quà Tết hoặc làm tem nhãn thân chai.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 mt-0.5 border border-emerald-400/40">
                        ✓
                      </span>
                      <span className="leading-relaxed">
                        Cần đặt <strong>túi cắt sẵn theo kích thước riêng</strong> với chi phí tiết kiệm và thời gian giao hàng nhanh.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between relative z-10">
                  <span className="text-xs text-sky-200">Cần tư vấn khổ túi chuẩn?</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-xs sm:text-sm font-extrabold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Gọi {settings.hotline}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. ƯU ĐIỂM & NHƯỢC ĐIỂM
         ================================================================= */}
      <section className="py-14 lg:py-18 bg-slate-50/60 border-y border-slate-200/80" id="uu-nhuoc">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-2.5">
              <span>Đánh Giá Khách Quan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072554] tracking-tight">
              Ưu Điểm &amp; Lưu Ý Khi Dùng Màng Co PVC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ưu điểm card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-black text-emerald-800">
                  Ưu Điểm Nổi Bật Của Màng Co PVC
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Độ bóng sáng như kính:</strong> Tăng tính thẩm mỹ, giúp sản phẩm trông mới và bắt mắt hơn hẳn.</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dễ co nhiệt:</strong> Co rút nhanh ở nhiệt độ thấp, cực kỳ dễ thao tác bằng súng khò nhiệt cầm tay.</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Đa dạng kiểu gia công:</strong> Cắt túi ép đáy thẳng, ép cong vòng cung, áo bình nước hoặc in tem nhãn.</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Chi phí đầu tư tiết kiệm:</strong> Đơn giá hợp lý, phù hợp cho mọi quy mô sản xuất từ nhỏ lẻ đến nhà máy.</span>
                </li>
              </ul>
            </div>

            {/* Nhược điểm card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  ⚠️
                </div>
                <h3 className="text-lg font-black text-amber-900">
                  Nhược Điểm &amp; Lưu Ý Bảo Quản
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80">
                  <strong className="text-amber-950 block mb-0.5">1. Nhạy cảm với nhiệt độ kho:</strong>
                  Không để cuộn hoặc túi màng PVC sát mái tôn nóng trên 35°C hoặc dưới nắng trực tiếp vì màng có thể tự co rút nhẹ ở mép.
                </li>
                <li className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80">
                  <strong className="text-amber-950 block mb-0.5">2. Không tiếp xúc trực tiếp thực phẩm trần:</strong>
                  Chỉ dùng bọc ngoài vỏ hộp, hũ nhựa, lọ thủy tinh. Nếu cần bọc tiếp xúc trực tiếp thực phẩm hoặc cấp đông sâu, hãy chọn{' '}
                  <Link href="/mang-co-pof" className="text-blue-600 font-black underline hover:text-blue-700">
                    Màng Co POF
                  </Link>.
                </li>
                <li className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80">
                  <strong className="text-amber-950 block mb-0.5">3. Có mùi nhẹ khi hàn nhiệt:</strong>
                  Nên bố trí khu vực khò nhiệt/hàn màng thông thoáng gió để đảm bảo môi trường làm việc thoải mái.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. 4 DÒNG MÀNG CO PVC ĐANG CUNG CẤP (NÂNG CẤP THIẾT KẾ ĐẸP MẮT)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-white" id="san-pham-pvc">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              <span>Quy Cách Thành Phẩm Tại Xưởng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
              Các Dòng Màng Co PVC Đang Cung Cấp
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Gia công trực tiếp theo khổ rộng, chiều dài cắt và độ dày yêu cầu của từng khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* DÒNG 01: Màng Co PVC Hàng Cuộn */}
            <div className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                01
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Layers className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    DÒNG 01
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Màng Co PVC Hàng Cuộn
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Cuộn màng ống đôi (hoặc xẻ 1 bên / xếp hông) khổ từ 80mm đến 800mm, chuyên chạy máy bọc tự động hoặc cắt thủ công tại xưởng.
                </p>

                {/* Specs list with icons */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Độ dày:</strong> 15 – 40 micron</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Trọng lượng:</strong> 15 – 25kg/cuộn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Màng mềm hoặc màng cứng theo yêu cầu</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href="#bao-gia"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Báo giá PVC hàng cuộn</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* DÒNG 02: Túi PVC Cắt Ép Ngang / Ép Cong */}
            <div className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                02
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Scissors className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    DÒNG 02
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Túi PVC Cắt Ép Ngang / Ép Cong
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Cắt rời từng túi theo kích thước hộp: túi hàn đáy thẳng, túi hở 2 đầu hoặc túi ép cong vòng cung bọc giỏ quà Tết, hộp tròn.
                </p>

                {/* Specs list with icons */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Cắt chính xác theo mẫu hộp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Có đục lỗ thoát khí chống phồng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Chỉ cần bỏ sản phẩm vào và khò nhiệt</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href="#bao-gia"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Báo giá túi PVC cắt sẵn</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* DÒNG 03: Màng Co Áo Nước Suối 21L */}
            <div className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d9488] to-[#059669] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                03
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Droplets className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    DÒNG 03
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Màng Co Áo Nước Suối 21L
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Màng co PVC trơn hoặc in thương hiệu chuyên bọc thân bình nước lọc 19L – 21L, màng co chụp nắp vòi và cổ bình.
                </p>

                {/* Specs list with icons */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Có sẵn quy cách bình 20L chuẩn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Đường răng cưa dễ xé mở vòi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Màu trắng trong hoặc xanh dương</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href="#bao-gia"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Báo giá màng co bình 21L</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* DÒNG 04: Màng Co PVC In Tem Nhãn */}
            <div className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ea580c] to-[#c2410c] opacity-90 group-hover:h-2 transition-all" />
              <span className="absolute -top-3 -right-2 text-6xl font-black font-mono text-slate-100 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                04
              </span>

              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Sparkles className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-mono">
                    DÒNG 04
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  Màng Co PVC In Tem Nhãn
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  In ống đồng từ 1 đến 8 màu sắc nét làm nhãn thân chai nước giải khát, hũ yến, lọ gia vị, hộp mỹ phẩm và hóa mỹ phẩm.
                </p>

                {/* Specs list with icons */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Giao dạng cuộn phóng nhãn hoặc cắt rời</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Độ co ngang chuẩn ôm sát cổ chai</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Hỗ trợ tư vấn bình trục in</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 relative z-10">
                <a
                  href="#bao-gia"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Báo giá in nhãn PVC</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. PHÂN LOẠI & ỨNG DỤNG THEO NGÀNH HÀNG (NÂNG CẤP THIẾT KẾ ĐẸP MẮT)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200/80" id="phan-loai">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Phân Loại &amp; Ứng Dụng Thực Tế</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3" id="ung-dung">
              Phân Loại PVC Cứng / Mềm &amp; Ứng Dụng Theo Ngành Hàng
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Lựa chọn đúng quy cách giúp tối ưu hóa chi phí đóng gói và mang lại tính thẩm mỹ cao nhất cho sản phẩm.
            </p>
          </div>

          {/* 2 Big Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: PVC Mềm vs PVC Cứng */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">1</span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Phân theo độ cứng: PVC Mềm vs PVC Cứng
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase">
                        PVC Mềm (Dẻo)
                      </span>
                      <strong className="text-slate-900">Dễ lồng hộp &amp; ít rách mép</strong>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Được thêm phụ gia dẻo hóa, màng mềm dai, dễ lồng hộp thủ công, không bị giòn rách ở mép gấp. Chuyên dùng bọc hộp giấy mỹ phẩm, sách vở, giỏ quà Tết, hộp trà.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase">
                        PVC Cứng (Độ Đanh Cao)
                      </span>
                      <strong className="text-slate-900">Độ căng phẳng &amp; bóng kính cao</strong>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Độ đanh cao, bề mặt căng phẳng, chuyên dùng làm tem nhãn in ống đồng phóng tự động tốc độ cao lên thân chai nhựa, chai thủy tinh và hũ thực phẩm.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: PVC Không In vs PVC Có In */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">2</span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Phân theo bề mặt: PVC Không In vs PVC Có In
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase">
                        PVC Trắng Trong Không In
                      </span>
                      <strong className="text-slate-900">Khoe trọn thiết kế vỏ hộp</strong>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Độ trong suốt bóng kính, tôn lên mẫu mã vỏ bao bì sẵn có của sản phẩm, không phát sinh chi phí chế bản trục in. Phù hợp cho đa số sản phẩm đóng hộp.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-black uppercase">
                        PVC Có In Tem Nhãn
                      </span>
                      <strong className="text-slate-900">In 1 - 8 màu sắc sảo</strong>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Vừa làm lớp màng bảo vệ, vừa thay thế tem decal dán truyền thống. Niêm phong chắc chắn, chống hàng giả và nâng cao mức độ nhận diện thương hiệu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Industry Application Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Industry 1: Mỹ phẩm & Dược phẩm */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                    Seal Chống Giả
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors">
                  Mỹ Phẩm &amp; Dược Phẩm
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Bọc seal hộp kem dưỡng, serum, nước hoa, hộp thuốc và thực phẩm chức năng chống bóc mở tráo ruột.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Khổ màng: 80 – 250mm</span>
            </div>

            {/* Industry 2: Giỏ Quà Tết */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Gift className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Ép Cong Đáy Lớn
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors">
                  Giỏ Quà Tết &amp; Quà Tặng
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Túi PVC ép cong đáy lớn khổ 50x70, 60x80, 70x90cm cố định giỏ quà chắc chắn, sáng bóng như bọc kính.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Khổ túi: 50x70 – 70x90cm</span>
            </div>

            {/* Industry 3: Nước Uống & Đồ Hộp */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    Bình Nước 20L
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors">
                  Nước Uống &amp; Đồ Hộp
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Áo bình nước 20L, seal nắp vòi có đường xé răng cưa, màng bọc ngoài hũ yến, hạt sấy khô, hộp trà, cà phê.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Có răng cưa xé mở</span>
            </div>

            {/* Industry 4: Gia Dụng & Công Nghiệp */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Chống Trầy Xước
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors">
                  Gia Dụng &amp; Công Nghiệp
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Bọc lốc móc áo, thanh nhôm, phào chỉ, linh kiện điện tử, phụ tùng, văn phòng phẩm, tập vở chống ẩm ướt.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Khổ màng: 150 – 800mm</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          7. BẢNG BÁO GIÁ THAM KHẢO
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-white" id="bang-gia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-2.5">
              <span>Báo Giá Tại Xưởng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072554] tracking-tight mb-2">
              Bảng Quy Cách &amp; Yếu Tố Tính Giá Màng Co PVC
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Đơn giá tính theo kg hoặc theo 1.000 túi tùy quy cách gia công và số lượng đặt hàng.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700">
                  <tr>
                    <th className="py-4 px-5 font-black uppercase text-[11px] tracking-wider">Dòng sản phẩm</th>
                    <th className="py-4 px-5 font-black uppercase text-[11px] tracking-wider text-blue-700">Quy cách phổ biến</th>
                    <th className="py-4 px-5 font-black uppercase text-[11px] tracking-wider">Độ dày</th>
                    <th className="py-4 px-5 font-black uppercase text-[11px] tracking-wider">Đơn vị tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">Màng co PVC dạng cuộn</td>
                    <td className="py-4 px-5 text-slate-700">Khổ 80mm – 800mm (ống đôi / xẻ / xếp hông)</td>
                    <td className="py-4 px-5 font-mono font-bold text-blue-600">15 – 40 micron</td>
                    <td className="py-4 px-5 text-slate-600">Theo Kg (Cuộn 15–25kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">Túi PVC cắt ép ngang đáy thẳng</td>
                    <td className="py-4 px-5 text-slate-700">Cắt theo kích thước hộp (VD: 12×20cm, 15×25cm, 20×30cm)</td>
                    <td className="py-4 px-5 font-mono font-bold text-blue-600">18 – 30 micron</td>
                    <td className="py-4 px-5 text-slate-600">Theo Kg</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">Túi PVC ép cong bọc giỏ quà Tết</td>
                    <td className="py-4 px-5 text-slate-700">45×60cm, 50×70cm, 55×75cm, 60×80cm, 70×90cm</td>
                    <td className="py-4 px-5 font-mono font-bold text-blue-600">30 – 40 micron</td>
                    <td className="py-4 px-5 text-slate-600">Theo Kg / Bịch</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">Màng co áo bình nước 20L &amp; nắp vòi</td>
                    <td className="py-4 px-5 text-slate-700">Quy cách chuẩn bình tròn / bình vòi, răng cưa mở nắp</td>
                    <td className="py-4 px-5 font-mono font-bold text-blue-600">30 – 35 micron</td>
                    <td className="py-4 px-5 text-slate-600">Theo Kg / Cái</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. BÀI VIẾT CHUYÊN SÂU MÀNG CO PVC
         ================================================================= */}
      {pvcPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-50/70 border-t border-slate-200/70">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0284c7] border border-blue-200/60 mb-2">
                Bài Viết Chuyên Sâu
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal mb-3">
                Tư Vấn &amp; Ứng Dụng Thực Tế Màng Co PVC
              </h2>
              <p className="text-slate-600 text-base">
                Kinh nghiệm thực tiễn giúp xưởng gia công và doanh nghiệp chọn đúng quy cách màng co PVC đạt hiệu quả kinh tế cao nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pvcPosts.slice(0, 6).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col group"
                >
                  <Link
                    href={`/tin-tuc/${post.slug}`}
                    className="relative aspect-[16/10] bg-slate-100 overflow-hidden block"
                  >
                    <img
                      src={post.thumbnail_url || '/media/categories/mang-co-pvc.webp'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-[#0f2d59]/90 backdrop-blur-xs text-[10px] font-bold text-amber-300 tracking-wider uppercase border border-amber-300/30 shadow-xs">
                      {settings.short_name || 'Bao Bì Thành Phát'}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-10 pt-28 pb-3.5 px-4 sm:px-5 bg-gradient-to-t from-[#0f2d59] via-[#0f2d59]/85 via-45% via-[#0f2d59]/20 to-transparent flex items-end">
                      <h3 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight line-clamp-2 drop-shadow-sm group-hover:text-sky-200 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {post.excerpt ||
                        'Cẩm nang hướng dẫn chi tiết quy chuẩn màng co đóng gói và giải pháp tối ưu chi phí.'}
                    </p>
                    <Link
                      href={`/tin-tuc/${post.slug}`}
                      className="text-[#0284c7] hover:text-[#2563eb] font-bold text-xs sm:text-sm inline-flex items-center gap-1 transition-colors mt-auto group/btn"
                    >
                      <span>Xem chi tiết</span>
                      <span className="text-base font-black leading-none group-hover/btn:translate-x-1 transition-transform">›</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
          9. FAQ (CÂU HỎI THƯỜNG GẶP)
         ================================================================= */}
      <section className="py-16 sm:py-20 bg-white" id="hoi-dap">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Giải Đáp Thắc Mắc</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072554] tracking-tight">
              Câu Hỏi Thường Gặp Về Màng Co PVC
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-slate-50 rounded-2xl p-5 border border-slate-200/80 [&_summary::-webkit-details-marker]:hidden" open>
              <summary className="flex items-center justify-between cursor-pointer font-black text-slate-900 text-sm sm:text-base">
                <span>1kg túi màng co PVC được khoảng bao nhiêu cái?</span>
                <span className="ml-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-200/70">
                Số lượng túi trên 1kg phụ thuộc vào kích thước (Rộng × Dài) và độ dày micron. Ví dụ túi size nhỏ bọc hộp mỹ phẩm có thể được 400–800 cái/kg, trong khi túi lớn bọc giỏ quà Tết được khoảng 25–45 cái/kg. Hãy gửi kích thước hộp để chúng tôi tính số cái/kg chính xác cho bạn.
              </div>
            </details>

            <details className="group bg-slate-50 rounded-2xl p-5 border border-slate-200/80 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-black text-slate-900 text-sm sm:text-base">
                <span>Làm sao tính khổ túi màng co PVC vừa khít cho hộp chữ nhật?</span>
                <span className="ml-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-200/70">
                Công thức nhanh: <strong>Khổ rộng túi = Rộng + Cao + 1cm đến 1.5cm</strong>; <strong>Chiều dài túi = Dài + Cao + 2cm đến 3cm</strong>. Hoặc gửi kích thước hộp qua{' '}
                <a href="#bao-gia" className="text-blue-600 font-bold underline hover:text-blue-700">
                  Form yêu cầu báo giá
                </a>{' '}
                bên dưới để kỹ thuật viên tính chính xác và gửi mẫu test miễn phí.
              </div>
            </details>

            <details className="group bg-slate-50 rounded-2xl p-5 border border-slate-200/80 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-black text-slate-900 text-sm sm:text-base">
                <span>Xưởng có giao hàng đi tỉnh không?</span>
                <span className="ml-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-200/70">
                Có. Chúng tôi giao tận nơi tại xưởng/kho và hỗ trợ đóng pallet gửi ra các chành xe đi khắp các tỉnh thành miền Trung, Tây Nguyên, miền Nam và miền Bắc đúng tiến độ.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* =================================================================
          10. FORM YÊU CẦU BÁO GIÁ
         ================================================================= */}
      <QuoteSection settings={settings} defaultFilmType="Màng co PVC" />
    </div>
  );
}
