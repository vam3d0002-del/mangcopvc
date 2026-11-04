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
} from 'lucide-react';
import { getCachedSiteSettings } from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';

export const revalidate = 2592000;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  return {
    title: `Giới Thiệu ${settings.company_name} | Nhà Sản Xuất Màng Co PVC, POF, PE`,
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
      <section className="py-8 lg:py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Giới thiệu</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="w-10 h-1 bg-blue-600 rounded-full mb-2.5"></div>
                <span className="text-xs font-black tracking-wider text-blue-600 uppercase">
                  VỀ CHÚNG TÔI
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {settings.company_name} – Nhà sản xuất màng co nhiệt PVC, POF, PE
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Được thành lập với hơn 10 năm kinh nghiệm trong ngành sản xuất và gia công màng co nhiệt. Chúng tôi chuyên cung cấp màng co chất lượng cao, độ co ổn định, phục vụ cho mọi ngành hàng từ thực phẩm, đồ uống, mỹ phẩm, dược phẩm cho đến đóng gói công nghiệp xuất khẩu.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#bao-gia"
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
                >
                  YÊU CẦU BÁO GIÁ
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-6 py-3 rounded-lg bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wide transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>GỌI {settings.hotline}</span>
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 group">
                <img
                  src="/media/products/hero-mang-co.webp"
                  alt={`Xưởng sản xuất màng co ${settings.company_name}`}
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                  width={640}
                  height={420}
                />
                <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                  <span>Trực tiếp tại xưởng</span>
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
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="w-10 h-1 bg-blue-600 rounded-full mb-2"></div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                Nhà sản xuất màng co nhiệt trực tiếp
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>{settings.company_name}</strong> chuyên sản xuất và cung ứng các loại{' '}
                <strong className="text-blue-600">màng co PVC, màng co POF, màng co PE</strong> cho đa dạng ngành hàng. Chúng tôi cam kết chất lượng sản phẩm chuẩn xác, giá thành hợp lý và giao hàng nhanh chóng trên toàn quốc.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Được trang bị hệ thống máy móc sản xuất hiện đại và đội ngũ kỹ thuật viên lành nghề, chúng tôi tự hào cung cấp các giải pháp đóng gói màng co toàn diện, từ khổ cuộn công nghiệp, màng dạng ống, xếp hông cho đến gia công cắt túi theo kích thước chính xác từng milimet.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Mỗi cuộn màng xuất xưởng đều được kiểm định chặt chẽ về độ dày, độ dẻo dai và lực co nhiệt đồng đều, giúp ôm sát sản phẩm, tạo độ bóng đẹp và bảo vệ tối đa trong quá trình lưu trữ, vận chuyển.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sử dụng 100% hạt nhựa nguyên sinh</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cắt túi ép ngang, cong theo mẫu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Đầy đủ chứng nhận an toàn CO/CQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Giao hàng nhanh chóng tận nơi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Company Info Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Thông tin doanh nghiệp</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="block text-slate-400 font-semibold uppercase text-[10px]">
                      Tên công ty
                    </span>
                    <strong className="text-slate-900 text-sm font-extrabold">
                      {settings.company_name}
                    </strong>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-semibold uppercase text-[10px]">
                      Lĩnh vực hoạt động
                    </span>
                    <span className="text-slate-700 font-medium">
                      Sản xuất &amp; gia công màng co nhiệt PVC, POF, PE, tem nhãn màng co
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-semibold uppercase text-[10px]">
                      Địa chỉ xưởng &amp; văn phòng
                    </span>
                    <span className="text-slate-700 font-medium flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{settings.address}</span>
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-semibold uppercase text-[10px]">
                      Hotline tư vấn
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-blue-600 hover:text-blue-700 font-extrabold text-base flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{settings.hotline}</span>
                    </a>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-semibold uppercase text-[10px]">
                      Zalo hỗ trợ
                    </span>
                    <a
                      href={`https://zalo.me/${settings.zalo.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {settings.zalo}
                    </a>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-semibold uppercase text-[10px]">
                      Email
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-700 hover:text-blue-600 font-medium flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{settings.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. NĂNG LỰC SẢN XUẤT (4 CARDS)
         ================================================================= */}
      <section className="py-14 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="w-10 h-1 bg-blue-600 rounded-full mb-2.5 mx-auto"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
              Năng lực sản xuất
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Khả năng cung ứng ổn định với hệ thống máy móc sản xuất hiện đại tại xưởng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Sản xuất trực tiếp
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Không qua trung gian, chủ động tiến độ và kiểm soát chất lượng từ hạt nhựa nguyên sinh cao cấp.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Quy cách theo yêu cầu
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhận sản xuất đa dạng quy cách: màng dạng cuộn, túi cắt sẵn, màng co dán nhiệt, tem nhãn màng co.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Kiểm soát chất lượng
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Từng cuộn màng kiểm tra độ dày, độ dẻo dai và lực co nhiệt đồng đều trước khi bàn giao cho đối tác.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Đa ngành nghề
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đáp ứng nhu cầu đóng gói cho thực phẩm, đồ uống, mỹ phẩm, dược phẩm, văn phòng phẩm và hàng tiêu dùng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. SẢN PHẨM CỦA CHÚNG TÔI (PROMOTIONAL BANNER & PILLS)
         ================================================================= */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-10 h-1 bg-blue-600 rounded-full mb-2.5 mx-auto"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
              Sản phẩm của chúng tôi
            </h2>
          </div>

          {/* Banner quảng cáo màng co */}
          {(settings.about_banner_url || settings.banner_url) ? (
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
              <a href={`tel:${cleanPhone}`} title={`Gọi tư vấn báo giá màng co: ${settings.hotline}`}>
                <img
                  src={settings.about_banner_url || settings.banner_url || ''}
                  alt={`Banner sản phẩm màng co ${settings.company_name}`}
                  className="w-full h-auto object-cover max-h-[280px] sm:max-h-[340px] hover:opacity-95 transition"
                  loading="lazy"
                />
              </a>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white p-6 sm:p-10 shadow-lg relative border border-blue-800/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-cyan-300">
                    CHUYÊN SẢN XUẤT &amp; CUNG CẤP SỈ
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
                    MÀNG CO PVC • POF • PE • NHIỆT
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
                    Đầy đủ các khổ màng từ 80mm đến 800mm, độ dày từ 15 đến 120 micron. Cắt túi theo yêu cầu và giao hàng nhanh.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-black text-xs uppercase tracking-wide hover:bg-blue-50 transition shadow"
                    >
                      MUA NGAY: {settings.hotline}
                    </a>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center md:justify-end">
                  <div className="grid grid-cols-3 gap-2.5 bg-black/25 p-2.5 rounded-xl backdrop-blur-xs border border-white/10">
                    <div className="text-center">
                      <img
                        src="/media/categories/mang-co-pvc.webp"
                        alt="Màng co PVC"
                        className="w-20 h-20 rounded-lg object-cover bg-white"
                      />
                      <span className="block text-[10px] font-bold mt-1 text-white">Màng PVC</span>
                    </div>
                    <div className="text-center">
                      <img
                        src="/media/categories/mang-co-pof.webp"
                        alt="Màng co POF"
                        className="w-20 h-20 rounded-lg object-cover bg-white"
                      />
                      <span className="block text-[10px] font-bold mt-1 text-white">Màng POF</span>
                    </div>
                    <div className="text-center">
                      <img
                        src="/media/categories/mang-co-pe.webp"
                        alt="Màng co PE"
                        className="w-20 h-20 rounded-lg object-cover bg-white"
                      />
                      <span className="block text-[10px] font-bold mt-1 text-white">Màng PE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4 Category Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <Link
              href="/mang-co-pvc"
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs transition"
            >
              Màng co PVC
            </Link>
            <Link
              href="/mang-co-pof"
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs transition"
            >
              Màng co POF
            </Link>
            <Link
              href="/mang-co-pe"
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs transition"
            >
              Màng co PE
            </Link>
            <Link
              href="/mang-co-nhiet"
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-blue-600 hover:text-blue-600 font-extrabold text-xs text-slate-700 bg-white shadow-2xs transition"
            >
              Màng co nhiệt
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. GIÁ TRỊ CỐT LÕI (3 CARDS VỚI SỐ LỚN 01, 02, 03)
         ================================================================= */}
      <section className="py-14 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="w-10 h-1 bg-blue-600 rounded-full mb-2.5 mx-auto"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
              Giá trị cốt lõi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-blue-600/20 block mb-3 font-mono">
                  01
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Uy tín
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Giữ đúng cam kết về chất lượng màng, đúng độ dày micron, đủ số mét cuộn và tiến độ giao hàng cho mọi đối tác.
                </p>
              </div>
              <div className="w-12 h-1 bg-blue-600 rounded-full mt-6"></div>
            </div>

            {/* Card 02 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-blue-600/20 block mb-3 font-mono">
                  02
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Chất lượng
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Luôn sử dụng nguồn hạt nhựa nguyên sinh cao cấp, màng trong suốt, không mùi, độ co ôm sát và đường hàn chắc chắn.
                </p>
              </div>
              <div className="w-12 h-1 bg-blue-600 rounded-full mt-6"></div>
            </div>

            {/* Card 03 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-blue-600/20 block mb-3 font-mono">
                  03
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Đồng hành lâu dài
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tư vấn giải pháp tiết kiệm chi phí, hỗ trợ kỹ thuật máy co nhiệt tận tâm và cung cấp mẫu thử miễn phí cho khách hàng.
                </p>
              </div>
              <div className="w-12 h-1 bg-blue-600 rounded-full mt-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. QUY TRÌNH HỢP TÁC (4 STEP CARDS)
         ================================================================= */}
      <section className="py-14 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <div className="w-10 h-1 bg-blue-600 rounded-full mb-2.5"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
              Quy trình hợp tác
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Quy trình làm việc chuyên nghiệp, nhanh chóng từ tư vấn đến giao hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
              <span className="text-2xl font-black text-blue-600 font-mono block mb-2">
                01
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                Tiếp nhận nhu cầu
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tiếp nhận thông tin về sản phẩm cần bọc, kích thước, số lượng và loại máy co nhiệt đang sử dụng.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
              <span className="text-2xl font-black text-blue-600 font-mono block mb-2">
                02
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                Tư vấn &amp; báo giá
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tư vấn chọn màng PVC, POF hay PE, tính khổ và độ dày tối ưu nhất, gửi bảng báo giá sỉ cạnh tranh.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
              <span className="text-2xl font-black text-blue-600 font-mono block mb-2">
                03
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                Sản xuất theo quy cách
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tiến hành thổi màng, chia cuộn hoặc gia công cắt túi theo đúng kích thước và thông số kỹ thuật cam kết.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
              <span className="text-2xl font-black text-blue-600 font-mono block mb-2">
                04
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                Giao hàng tận nơi
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đóng gói cẩn thận, hỗ trợ giao hàng nhanh chóng tận xưởng và gửi chành xe đi các tỉnh thành toàn quốc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          7. FULL-WIDTH BLUE CTA BANNER
         ================================================================= */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-12 lg:py-14 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
                Cùng {settings.company_name} mang giải pháp đóng gói chất lượng đến khách hàng của bạn
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                Liên hệ ngay hôm nay để nhận mẫu thử màng co và tư vấn kỹ thuật đóng gói miễn phí.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="#bao-gia"
                className="px-6 py-3 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-black text-xs sm:text-sm uppercase tracking-wide transition shadow-sm"
              >
                YÊU CẦU BÁO GIÁ
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="px-6 py-3 rounded-xl bg-transparent border-2 border-white text-white hover:bg-white/10 font-black text-xs sm:text-sm uppercase tracking-wide transition"
              >
                GỌI {settings.hotline}
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
