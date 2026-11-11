import Link from 'next/link';
import {
  Factory,
  CheckCircle2,
  FileSearch,
  Boxes,
  Printer,
  Flame,
  Scissors,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Phone,
} from 'lucide-react';
import {
  getCachedCategories,
  getCachedIndustries,
  getCachedPostsList,
  getCachedProductsList,
  getCachedSiteSettings,
} from '@/lib/cache';
import QuoteSection from '@/components/QuoteSection';
import SolarHeroBanner from '@/components/SolarHeroBanner';

// Tối ưu hóa ISR 24 giờ cho Vercel Edge CDN: Không tốn CPU & Fast Origin Transfer khi khách truy cập
export const revalidate = 86400;

function toYouTubeEmbedUrl(url: string | null | undefined): string {
  if (!url) return 'https://www.youtube.com/embed/lDzM8QeIuGs?si=6N-vPjF-LDRJ9N42';
  if (url.includes('/embed/')) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export default async function HomePage() {
  const [settings, categories, industriesData, products, posts] =
    await Promise.all([
      getCachedSiteSettings(),
      getCachedCategories(),
      getCachedIndustries(),
      getCachedProductsList(),
      getCachedPostsList(),
    ]);

  const cleanPhone = settings.hotline.replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo =
    !rawZalo ||
    ((rawZalo === '0907616611' || rawZalo === '0932636239') &&
      cleanPhone !== rawZalo)
      ? cleanPhone
      : rawZalo;
  const encodedAddress = encodeURIComponent(settings.address);
  const addressParts = settings.address
    .split(/[,.]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const shortLocationTitle =
    addressParts.length > 0
      ? `Tại ${addressParts[addressParts.length - 1]}`
      : 'Địa chỉ xưởng';
  const shortLocationSub =
    addressParts.length > 1
      ? addressParts.slice(0, -1).join(', ')
      : settings.address;

  // 8 Sản phẩm hiển thị ở Trang chủ (Tự động lấy từ các sản phẩm bật is_featured theo đúng thứ tự home_order 1..8)
  const homeFeaturedProducts = products
    .filter((p) => p.is_featured)
    .sort((a, b) => (a.home_order || 999999) - (b.home_order || 999999))
    .slice(0, 8);

  const activeProducts =
    homeFeaturedProducts.length > 0
      ? homeFeaturedProducts
      : products.slice(0, 8);

  const packagingShapes = activeProducts.map((p) => ({
    id: p.id,
    name: p.name.toUpperCase(),
    desc: p.short_description,
    img: p.thumbnail_url,
    link: `/san-pham/${p.slug}`,
    badge: 'Bán chạy',
  }));

  // 8 Ngành nghề ứng dụng thực tế (Đồng bộ 100% từ bảng industries trên Supabase)
  const industriesList = (industriesData.length > 0 ? industriesData : categories).map((ind: any) => ({
    name: ind.name,
    desc:
      ind.description ||
      'Giải pháp bao bì màng co chuyên biệt cho từng đặc thù sản phẩm.',
    icon: ind.icon || '📦',
    tag: ind.tag || 'Tiêu Chuẩn Cao',
    image_url: ind.image_url || settings.hero_banner_url || '/media/banners/banner-mang-co.webp',
    link: ind.icon ? `/san-pham?nganh=${ind.slug}` : `/san-pham?category=${ind.slug}`,
  }));

  // Đối tác tiêu biểu chạy Marquee
  const partners = [
    'VINAMILK',
    'TH TRUE MILK',
    'ORION FOOD',
    'MASAN CONSUMER',
    'KIDO GROUP',
    'TRUNG NGUYEN LEGEND',
    'HIGHLANDS COFFEE',
    'OCOP VIỆT NAM',
    'NÔNG LÂM FOOD',
    'HÀ ANH FOOD',
    'VIFON',
    'ACECOOK VIETNAM',
  ];

  // Câu hỏi thường gặp FAQ (Chuẩn theo baobidonggoi)
  const faqs = [
    {
      q: `Giá sản xuất màng co và bao bì tại ${settings.short_name} được tính như thế nào?`,
      a: 'Giá sản xuất được tính toán tối ưu dựa trên 4 yếu tố chính: Loại vật liệu màng (PVC, POF, PE, màng ghép PA/PET/AL), kích thước và độ dày (mic/gauge), số lượng đặt hàng mỗi đợt, và quy cách gia công (dạng cuộn, cắt túi, dập nhiệt, in trục đồng). Chúng tôi là xưởng sản xuất trực tiếp nên luôn có mức giá sỉ tốt nhất cho khách hàng doanh nghiệp.',
    },
    {
      q: 'Số lượng tối thiểu (MOQ) khi đặt hàng bao bì là bao nhiêu?',
      a: 'Đối với các dòng màng co cuộn PVC, POF, PE quy cách phổ thông có sẵn, chúng tôi hỗ trợ đơn hàng từ 1 cuộn hoặc từ 25kg để khách hàng thử nghiệm. Đối với quy cách cắt túi hoặc in ấn trục đồng theo kích thước riêng, số lượng tối thiểu từ 100kg - 300kg tùy cấu trúc màng.',
    },
    {
      q: 'Sản phẩm bao bì của công ty đạt những chứng nhận chất lượng nào?',
      a: `Toàn bộ sản phẩm màng co và bao bì của ${settings.short_name} đều được sản xuất từ hạt nhựa nguyên sinh cao cấp, đạt các chứng nhận an toàn tiếp xúc thực phẩm của FDA (Hoa Kỳ), RoHS, chứng nhận hệ thống quản lý chất lượng ISO 9001:2015, an toàn tuyệt đối cho người tiêu dùng và đủ điều kiện xuất khẩu.`,
    },
    {
      q: 'Công ty có hỗ trợ xuất khẩu bao bì ra nước ngoài không?',
      a: 'Có. Chúng tôi thường xuyên sản xuất và xuất khẩu các dòng màng co POF, túi PA hút chân không và màng ghép cho các đối tác tại Nhật Bản, Hàn Quốc, Mỹ và các nước Đông Nam Á với đầy đủ chứng từ CO, CQ và chứng nhận kiểm nghiệm quốc tế.',
    },
    {
      q: 'Thời gian sản xuất và giao hàng tại xưởng là bao lâu?',
      a: 'Đối với hàng có sẵn trong kho: giao hàng trong 2 - 24 giờ và 1 - 3 ngày trên toàn quốc. Đối với đơn hàng đặt sản xuất theo quy cách riêng: thời gian từ 3 - 5 ngày làm việc. Đối với đơn hàng in ống đồng: từ 7 - 12 ngày (bao gồm thời gian khắc trục và duyệt mẫu).',
    },
    {
      q: 'Khách hàng có được nhận mẫu thử (sample) trước khi đặt hàng không?',
      a: `Hoàn toàn được! ${settings.short_name} sẵn sàng gửi mẫu màng co cắt sẵn hoặc màng cuộn mẫu miễn phí đến tận nơi để quý khách test thử trên máy co màng hoặc sản phẩm thực tế trước khi ký hợp đồng sản xuất.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.company_name,
    description: settings.seo_description,
    telephone: settings.hotline,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white text-slate-800">
        {/* ================= 1. HERO BANNER HỆ MẶT TRỜI ================= */}
        <SolarHeroBanner products={products} settings={settings} />

        {/* ================= 2. VỀ BAO BÌ THÀNH PHÁT (2 CỘT GIỚI THIỆU + VIDEO XƯỞNG) ================= */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tiêu đề chính căn giữa + Gạch chân ngắn */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal">
                Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] to-[#2563eb]">{settings.short_name || 'Bao Bì Thành Phát'}</span>
              </h2>
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#0284c7] to-[#2563eb] mx-auto mt-3.5"></div>
            </div>

            {/* Bố cục 2 cột: Cột Trái (Nội dung + Nút) & Cột Phải (Video Xưởng) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* CỘT TRÁI: VĂN BẢN GIỚI THIỆU & NÚT CHI TIẾT */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <p className="text-slate-700 text-[15px] md:text-[15.5px] leading-[1.85] text-justify">
                  <strong className="text-[#0f2d59]">{settings.short_name || 'Bao Bì Thành Phát'}</strong> là thương hiệu thuộc{' '}
                  <strong className="text-[#0f2d59]">{settings.company_name}</strong>, chuyên sản xuất và in ấn màng co nhiệt PVC, POF, PE và bao bì màng ghép theo yêu cầu. Với hơn 15 năm kinh nghiệm, chúng tôi đồng hành cùng các thương hiệu trong và ngoài nước trong quá trình phát triển giải pháp bao bì sản phẩm.{' '}
                  <strong className="text-[#0f2d59]">{settings.short_name || 'Bao Bì Thành Phát'}</strong> sở hữu nhà máy 10.000m², hệ thống in trục đồng lên đến 10 màu, công nghệ thổi màng &amp; ghép màng hiện đại cùng dây chuyền máy móc phục vụ sản xuất quy mô lớn, đáp ứng nhu cầu của nhiều ngành hàng như nước giải khát, thực phẩm, đông lạnh, nông sản, hóa mỹ phẩm, dược phẩm và công nghiệp. Sản phẩm đáp ứng các tiêu chuẩn Quatest 3, ISO 22000:2018 và ATVSTP, đồng thời áp dụng chính sách hàng lỗi 1 đổi 1, giá trực tiếp tại xưởng và hỗ trợ giao hàng toàn quốc.
                </p>

                <div className="mt-8 text-center">
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center justify-center px-9 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] shadow-md hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Giới Thiệu Chi Tiết
                  </Link>
                </div>
              </div>

              {/* CỘT PHẢI: KHUNG VIDEO GIỚI THIỆU XƯỞNG */}
              <div className="lg:col-span-6">
                <a
                  href={settings.video_intro_url || settings.youtube_url || 'https://www.youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 group cursor-pointer"
                >
                  {/* Ảnh nền dây chuyền nhà xưởng */}
                  <img
                    src={settings.about_banner_url || settings.banner_url || '/media/banners/banner-mang-co.webp'}
                    alt={`Giới Thiệu Xưởng ${settings.short_name || 'Bao Bì Thành Phát'}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Lớp phủ tối nhẹ trên đỉnh và dưới đáy chuẩn YouTube */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-black/60 group-hover:via-black/5 transition-colors duration-300" />

                  {/* Header Video: Avatar Logo + Tiêu đề kênh */}
                  <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
                    <div className="w-10 h-10 rounded-full bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src="/logo.webp"
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-white drop-shadow-sm overflow-hidden">
                      <div className="text-sm md:text-base font-bold truncate">
                        Giới Thiệu Xưởng {settings.short_name || 'Bao Bì Thành Phát'}
                      </div>
                      <div className="text-xs text-white/85 truncate">
                        {settings.short_name || 'Bao Bì Thành Phát'}
                      </div>
                    </div>
                  </div>

                  {/* Nút Play YouTube ở chính giữa */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-16 h-11 md:w-[68px] md:h-[48px] rounded-2xl bg-[#ff0000] group-hover:bg-[#dc2626] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                      <svg className="w-7 h-7 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Footer Video Trái: Nút Chia sẻ & Xem sau */}
                  <div className="absolute bottom-3.5 left-4 flex items-center gap-2.5 z-10">
                    <span className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                      </svg>
                    </span>
                    <span className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                      </svg>
                    </span>
                  </div>

                  {/* Footer Video Phải: Huy hiệu Xem trên YouTube */}
                  <div className="absolute bottom-3.5 right-4 z-10">
                    <div className="bg-black/75 hover:bg-black/90 backdrop-blur-xs text-white text-xs font-semibold px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-md transition">
                      <span>Xem trên</span>
                      <span className="inline-flex items-center gap-1 font-bold tracking-tight">
                        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>YouTube</span>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. CHỌN KIỂU DÁNG BAO BÌ ĐÓNG GÓI ================= */}
        <section className="py-16 md:py-20 bg-[#f4f8fc]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white shadow-xs mb-3">
                Sản Phẩm Bán Chạy
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal mb-3">
                Chọn Kiểu Dáng Bao Bì Đóng Gói
              </h2>
              <p className="text-slate-600 text-base">
                Đa dạng kiểu dáng, đáp ứng chính xác yêu cầu bao bọc, bảo quản và nhận diện thương hiệu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {packagingShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-4 shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-sky-500/15 hover:-translate-y-2 hover:border-sky-400 transition-all duration-300 ease-out flex flex-col items-center text-center overflow-hidden"
                >
                  {/* Thanh chạy ngang màu xanh da trời chủ đạo trên đỉnh khi hover (giống Header) */}
                  <span
                    className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#0284c7] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left z-30 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Hiệu ứng vệt sáng bóng loáng (Glossy Shine Sweep) lướt qua khi hover */}
                  <span
                    className="pointer-events-none absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/65 to-transparent -skew-x-12 group-hover:left-[140%] transition-all duration-700 ease-out z-20"
                    aria-hidden="true"
                  />

                  {/* Khung ảnh vuông có sẵn khung thương hiệu chuẩn */}
                  <Link
                    href={shape.link}
                    className="w-full max-w-[260px] sm:max-w-none aspect-square rounded-xl bg-[#f1f4f9] overflow-hidden mb-4 relative block border border-slate-100 mx-auto"
                  >
                    <img
                      src={shape.img}
                      alt={shape.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  <h3 className="text-base sm:text-sm md:text-[15px] font-extrabold text-[#0f2d59] group-hover:text-[#0284c7] transition-colors uppercase tracking-wide mb-2 sm:mb-3.5 line-clamp-1">
                    <Link href={shape.link}>{shape.name}</Link>
                  </h3>

                  {shape.desc && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3.5 max-w-xs sm:max-w-none">
                      {shape.desc}
                    </p>
                  )}

                  <Link
                    href={shape.link}
                    className="mt-auto inline-flex items-center justify-center px-7 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] shadow-sm group-hover:shadow-md group-hover:shadow-sky-500/30 transition-all duration-300"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. BAO BÌ ĐÓNG GÓI THEO NGÀNH HÀNG ================= */}
        <section className="py-16 md:py-20 bg-[#f4f8fc]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white shadow-xs mb-3">
                Phân Loại Ứng Dụng
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal mb-3">
                Bao Bì Đóng Gói Theo Ngành Hàng
              </h2>
              <p className="text-slate-600 text-base">
                Giải pháp được nghiên cứu cấu trúc tối ưu cho từng đặc thù bảo quản và chuỗi cung ứng thực tế.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industriesList.map((ind: any, iIdx: number) => (
                <div
                  key={`ind-${iIdx}`}
                  className="group relative rounded-2xl bg-white border border-slate-200/80 p-4 shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-sky-500/15 hover:-translate-y-2 hover:border-sky-400 transition-all duration-300 ease-out flex flex-col items-center text-center justify-between overflow-hidden"
                >
                  {/* Thanh chạy ngang màu xanh da trời trên đỉnh khi hover */}
                  <span
                    className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#0284c7] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left z-30 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Hiệu ứng vệt sáng bóng loáng (Glossy Shine Sweep) lướt qua khi hover */}
                  <span
                    className="pointer-events-none absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/65 to-transparent -skew-x-12 group-hover:left-[140%] transition-all duration-700 ease-out z-20"
                    aria-hidden="true"
                  />

                  <div className="w-full">
                    {/* Ảnh bao bì thực tế của ngành hàng */}
                    <Link
                      href={ind.link}
                      className="w-full aspect-square rounded-xl bg-[#f1f4f9] relative overflow-hidden flex items-center justify-center border border-slate-100 mb-4 block"
                    >
                      <img
                        src={ind.image_url}
                        alt={ind.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    <div className="px-2 mb-4">
                      <h3 className="text-base font-extrabold text-[#0f2d59] group-hover:text-[#0284c7] transition-colors mb-2 line-clamp-1 uppercase tracking-wide">
                        <Link href={ind.link}>{ind.name}</Link>
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {ind.desc}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={ind.link}
                    className="mt-auto inline-flex items-center justify-center px-8 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] shadow-sm group-hover:shadow-md group-hover:shadow-sky-500/30 transition-all duration-300"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. 10.000+ DOANH NGHIỆP ĐÃ HỢP TÁC (2 HÀNG MARQUEE NGƯỢC CHIỀU) ================= */}
        <section className="py-14 md:py-16 bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-4 mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-[#0f2d59] tracking-normal">
              10.000+ Doanh Nghiệp Đã Hợp Tác Cùng{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] to-[#2563eb]">
                {settings.short_name || 'Bao Bì Thành Phát'}
              </span>
            </h2>
            <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#0284c7] to-[#2563eb] mx-auto mt-3"></div>
          </div>

          <div className="relative w-full overflow-hidden space-y-8">
            {/* Lớp mờ 2 bên tạo hiệu ứng fade mượt */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

            {/* HÀNG 1: CHẠY TỪ PHẢI SANG TRÁI */}
            <div className="animate-marquee-left flex items-center">
              {[0, 1].map((dupIdx) => (
                <div
                  key={`marquee-row1-${dupIdx}`}
                  className="flex items-center gap-14 md:gap-20 pr-14 md:pr-20 shrink-0"
                >
                  {/* 1. PETROLIMEX */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="w-11 h-11 rounded-lg bg-[#00549a] flex items-center justify-center shadow-xs relative overflow-hidden">
                      <span className="text-2xl font-black text-[#f58220] italic leading-none drop-shadow-xs">P</span>
                    </div>
                    <span className="text-[9px] font-black tracking-wider text-[#00549a] mt-1">PETROLIMEX</span>
                  </div>

                  {/* 2. VINHOMES */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <svg className="w-8 h-6 mb-0.5" viewBox="0 0 48 30" fill="none">
                      <path d="M24 22 C18 12 10 8 4 10 C12 6 19 9 24 16 C29 8 36 3 44 4 C36 8 29 14 24 22 Z" fill="#c59b27" />
                      <path d="M24 27 C20 19 14 15 8 16 C14 13 20 15 24 21 C28 14 34 10 40 11 C34 14 28 20 24 27 Z" fill="#d4af37" />
                    </svg>
                    <div className="text-sm font-serif tracking-widest font-bold leading-none">
                      <span className="text-[#c59b27]">VIN</span>
                      <span className="text-[#1b365d]">HOMES</span>
                    </div>
                  </div>

                  {/* 3. VIAGS */}
                  <div className="flex items-center gap-2.5 h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-full bg-[#006884] flex items-center justify-center shrink-0">
                      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                        <path d="M16 7 L19 15 L25 11 L21 19 L27 19 L20 23 L12 23 L5 19 L11 19 L7 11 L13 15 Z" fill="#eab308" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-serif font-extrabold tracking-wide text-[#006884] leading-none">VIAGS</span>
                      <span className="text-[7px] uppercase tracking-wider text-[#006884]/80 font-semibold mt-0.5">Vietnam Airport Ground Services</span>
                    </div>
                  </div>

                  {/* 4. TNG */}
                  <div className="flex items-center gap-2 h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <svg className="w-7 h-7 -mt-2" viewBox="0 0 32 32" fill="none">
                      <g stroke="#f37021" strokeWidth="3.2" strokeLinecap="round">
                        <line x1="16" y1="3" x2="16" y2="29" />
                        <line x1="3" y1="16" x2="29" y2="16" />
                        <line x1="6.8" y1="6.8" x2="25.2" y2="25.2" />
                        <line x1="25.2" y1="6.8" x2="6.8" y2="25.2" />
                      </g>
                      <circle cx="16" cy="16" r="3.5" fill="#ffffff" />
                    </svg>
                    <span className="text-3xl font-black tracking-tight text-[#e31b23] leading-none">TNG</span>
                  </div>

                  {/* 5. HABECO */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-black tracking-tight text-[#2e6b34] leading-none">HABECO</span>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z" fill="#d4af37" opacity="0.85" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-semibold text-[#b48a28] tracking-wide">Sức bật Việt Nam</span>
                  </div>

                  {/* 6. VINAMILK */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <span className="text-xl font-black tracking-tight text-[#0033a0] leading-none">VINAMILK</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#0284c7] mt-1">EST 1976</span>
                  </div>

                  {/* 7. MASAN */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#e31b23] to-[#f58220]"></div>
                      <span className="text-xl font-black tracking-wider text-[#004b87] leading-none">MASAN</span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">CONSUMER</span>
                  </div>
                </div>
              ))}
            </div>

            {/* HÀNG 2: CHẠY TỪ TRÁI SANG PHẢI (NGƯỢC CHIỀU HÀNG 1) */}
            <div className="animate-marquee-right flex items-center">
              {[0, 1].map((dupIdx) => (
                <div
                  key={`marquee-row2-${dupIdx}`}
                  className="flex items-center gap-14 md:gap-20 pr-14 md:pr-20 shrink-0"
                >
                  {/* 1. SABECO */}
                  <div className="flex items-center gap-2 h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full border-2 border-[#d49a2a] flex items-center justify-center text-[#d49a2a] font-black text-xs">
                      龍
                    </div>
                    <span className="text-lg font-extrabold tracking-wide text-[#d49a2a]">SABECO</span>
                  </div>

                  {/* 2. SKODA */}
                  <div className="flex items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <span className="text-xl font-black tracking-[0.22em] text-[#114b3a] uppercase">SKODA</span>
                  </div>

                  {/* 3. DELTA */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <svg className="w-10 h-9" viewBox="0 0 40 34" fill="none">
                      <polygon points="20,2 6,32 20,32" fill="#1d70b8" />
                      <polygon points="20,2 34,32 20,32" fill="#003d73" />
                      <polygon points="14,16 6,32 22,32" fill="#38bdf8" opacity="0.85" />
                    </svg>
                    <span className="text-xs font-black tracking-widest text-[#003d73] leading-none mt-0.5">DELTA</span>
                  </div>

                  {/* 4. Vietcombank */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="flex items-end gap-1">
                      <span className="text-lg font-serif font-extrabold text-[#005a2b] leading-none">Vietcombank</span>
                      <svg className="w-6 h-6 -mb-0.5" viewBox="0 0 24 24" fill="none">
                        <path d="M4 8 C4 4 10 4 12 9 C14 4 20 4 20 8 C20 14 12 20 12 20 C12 20 4 14 4 8 Z" fill="#007f3e" />
                        <path d="M8 9 L12 16 L16 9 Z" fill="#84bd00" />
                      </svg>
                    </div>
                  </div>

                  {/* 5. BAOVIET Bank */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-[#00468c] tracking-tight">BAOVIET</span>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#eab308] to-[#a16207] flex items-center justify-center text-white text-[9px] font-bold">
                        BV
                      </div>
                      <span className="text-sm font-bold text-[#00468c]">Bank</span>
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-[#00468c]/80 mt-0.5">NGÂN HÀNG BẢO VIỆT</span>
                  </div>

                  {/* 6. TH true MILK */}
                  <div className="flex items-center gap-1.5 h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <span className="text-2xl font-black text-[#003da5] tracking-tighter">TH</span>
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] italic font-bold text-[#0284c7]">true</span>
                      <span className="text-xs font-extrabold text-[#003da5] tracking-wider">MILK</span>
                    </div>
                  </div>

                  {/* 7. ACECOOK */}
                  <div className="flex flex-col items-center justify-center h-16 shrink-0 select-none hover:scale-105 transition-transform">
                    <div className="px-3 py-0.5 rounded-full bg-[#e60012] text-white font-black text-xs tracking-wider">
                      ACECOOK
                    </div>
                    <span className="text-[8px] font-bold text-slate-600 tracking-widest mt-0.5">VIETNAM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>





        {/* ================= 11. THAM QUAN NHÀ XƯỞNG & QUY TRÌNH SẢN XUẤT ================= */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/60 relative overflow-hidden border-t border-slate-100">
          {/* Ambient decorative lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-sky-100/40 to-blue-100/30 blur-3xl rounded-full pointer-events-none -z-0" />

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header section */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <Factory className="w-3.5 h-3.5 text-blue-600" />
                <span>Tiêu Chuẩn Xưởng &amp; Dây Chuyền Khép Kín</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072554] tracking-tight mb-3">
                Quy Trình 6 Bước Sản Xuất Tại Xưởng{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8]">
                  {settings.short_name || 'Bao Bì Thành Phát'}
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Khép kín từ khâu tư vấn cấu trúc màng đến kiểm tra KCS chất lượng trước khi bàn giao.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  100% Hạt Nhựa Nguyên Sinh
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  Kiểm Định KCS Độ Bền Kéo Đứt
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  Đổi Trả 100% Nếu Sai Quy Cách
                </span>
              </div>
            </div>

            {/* Desktop Step Roadmap Timeline */}
            <div className="hidden lg:flex items-center justify-between max-w-5xl mx-auto mb-10 px-5 py-3.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 shadow-xs">
              {[
                { num: '01', title: 'Khảo Sát & Đo Mẫu' },
                { num: '02', title: 'Thiết Kế 3D Tối Ưu' },
                { num: '03', title: 'Chế Bản Khắc Trục' },
                { num: '04', title: 'Thổi Màng & In' },
                { num: '05', title: 'Chia Cuộn / Cắt Túi' },
                { num: '06', title: 'KCS & Giao Hàng' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white text-[11px] font-black font-mono flex items-center justify-center shadow-xs">
                      {step.num}
                    </span>
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                  {idx < 5 && (
                    <div className="w-5 xl:w-9 h-0.5 bg-gradient-to-r from-blue-300 to-slate-200 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {/* 6 Bước Quy Trình Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  step: '01',
                  badge: 'Bước 01',
                  tag: 'Khảo sát tận nơi',
                  title: 'Tiếp Nhận & Khảo Sát Sản Phẩm',
                  desc: 'Tìm hiểu kích thước, trọng lượng, tính chất sản phẩm cần bọc và loại máy co/hút khách hàng đang sử dụng.',
                  highlight: 'Đo mẫu thực tế & test thử màng miễn phí',
                  gradient: 'from-[#0284c7] to-[#0369a1]',
                  bgSoft: 'bg-sky-50',
                  borderSoft: 'border-sky-200',
                  textAccent: 'text-sky-600',
                  iconShadow: 'shadow-sky-500/30',
                  icon: FileSearch,
                },
                {
                  step: '02',
                  badge: 'Bước 02',
                  tag: 'Tối ưu chi phí',
                  title: 'Tư Vấn Quy Cách & Thiết Kế 3D',
                  desc: 'Tư vấn chất liệu (PVC, POF, PE, ghép nhôm), tính toán khổ màng, độ dày tối ưu và dựng mẫu thiết kế.',
                  highlight: 'Tính đúng khổ màng, tránh lãng phí 15-20%',
                  gradient: 'from-[#2563eb] to-[#1d4ed8]',
                  bgSoft: 'bg-blue-50',
                  borderSoft: 'border-blue-200',
                  textAccent: 'text-blue-600',
                  iconShadow: 'shadow-blue-500/30',
                  icon: Boxes,
                },
                {
                  step: '03',
                  badge: 'Bước 03',
                  tag: 'Độ nét 100%',
                  title: 'Chế Bản & Khắc Trục Ống Đồng',
                  desc: 'Chế tạo trục in điện tử siêu mịn, duyệt màu Cromalin chuẩn xác trước khi đưa vào dây chuyền in chính thức.',
                  highlight: 'Khắc điện tử vi điểm, màu sắc chân thực',
                  gradient: 'from-[#4f46e5] to-[#4338ca]',
                  bgSoft: 'bg-indigo-50',
                  borderSoft: 'border-indigo-200',
                  textAccent: 'text-indigo-600',
                  iconShadow: 'shadow-indigo-500/30',
                  icon: Printer,
                },
                {
                  step: '04',
                  badge: 'Bước 04',
                  tag: 'Công nghệ cao',
                  title: 'Thổi Màng & In Tự Động Tốc Độ Cao',
                  desc: 'Thổi màng từ hạt nhựa nguyên sinh cao cấp và in ống đồng tự động với độ ổn định màu sắc tuyệt đối.',
                  highlight: 'Nhựa nguyên sinh, màng dẻo dai không mùi',
                  gradient: 'from-[#0d9488] to-[#0f766e]',
                  bgSoft: 'bg-teal-50',
                  borderSoft: 'border-teal-200',
                  textAccent: 'text-teal-600',
                  iconShadow: 'shadow-teal-500/30',
                  icon: Flame,
                },
                {
                  step: '05',
                  badge: 'Bước 05',
                  tag: 'Đa quy cách',
                  title: 'Ghép Phức Hợp & Chia Cuộn / Cắt Túi',
                  desc: 'Ghép màng đa lớp không dung môi, chia cuộn theo mét hoặc dập đáy, cắt túi theo đúng quy cách đặt hàng.',
                  highlight: 'Đường hàn nhiệt sắc nét, chịu lực vượt trội',
                  gradient: 'from-[#d97706] to-[#b45309]',
                  bgSoft: 'bg-amber-50',
                  borderSoft: 'border-amber-200',
                  textAccent: 'text-amber-600',
                  iconShadow: 'shadow-amber-500/30',
                  icon: Scissors,
                },
                {
                  step: '06',
                  badge: 'Bước 06',
                  tag: 'Chuẩn ISO/KCS',
                  title: 'Kiểm Tra KCS & Giao Hàng Tận Nơi',
                  desc: 'Kiểm định độ bền kéo đứt, độ chịu lực đường hàn và đóng gói pallet giao tận kho khách hàng đúng hẹn.',
                  highlight: 'Bảo hành đổi trả 100% nếu lỗi kỹ thuật',
                  gradient: 'from-[#16a34a] to-[#15803d]',
                  bgSoft: 'bg-emerald-50',
                  borderSoft: 'border-emerald-200',
                  textAccent: 'text-emerald-600',
                  iconShadow: 'shadow-emerald-500/30',
                  icon: ShieldCheck,
                },
              ].map((st) => {
                const StepIcon = st.icon;
                return (
                  <div
                    key={`step-${st.step}`}
                    className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-400/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top Gradient Accent Bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${st.gradient} opacity-90 group-hover:h-1.5 group-hover:opacity-100 transition-all duration-300`}
                    />

                    {/* Background Big Number Watermark */}
                    <span className="absolute -top-3 -right-2 text-7xl font-black font-mono text-slate-100/90 group-hover:text-blue-100/70 transition-colors pointer-events-none select-none tracking-tighter">
                      {st.step}
                    </span>

                    <div>
                      {/* Card Top: Icon + Step Badge */}
                      <div className="flex items-center justify-between mb-5 relative z-10">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${st.gradient} text-white flex items-center justify-center shadow-md ${st.iconShadow} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}
                        >
                          <StepIcon className="w-6 h-6 stroke-[2.2]" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            {st.badge}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${st.bgSoft} ${st.textAccent} border ${st.borderSoft}`}
                          >
                            {st.tag}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                        {st.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                        {st.desc}
                      </p>
                    </div>

                    {/* Bottom Highlight Tag */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${st.textAccent}`} />
                        <span className="truncate">{st.highlight}</span>
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex items-center shrink-0">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Support & Sample Testing Callout */}
            <div className="bg-gradient-to-r from-[#072554] via-[#0b3874] to-[#072554] rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 mb-14 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800/40 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
                  Hỗ Trợ Kỹ Thuật &amp; Test Mẫu Miễn Phí
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">
                  Bạn cần tư vấn kích thước và nhận mẫu màng co thực tế tận xưởng?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Đội ngũ kỹ thuật viên {settings.short_name || 'Bao Bì Thành Phát'} sẵn sàng khảo sát kích thước hộp/sản phẩm tận nơi, hỗ trợ thử nghiệm đường co đẹp mắt trước khi đặt sản xuất hàng loạt.
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
                  <span>Nhận Báo Giá &amp; Test Mẫu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Video Tham Quan Nhà Xưởng */}
            <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900">
              <div className="p-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 shadow-2xs"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs"></span>
                  <span className="text-xs font-bold text-slate-300 ml-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Video Vận Hành Nhà Xưởng Sản Xuất
                  </span>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline-block">
                  {settings.company_name}
                </span>
              </div>
              <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src={toYouTubeEmbedUrl(settings.video_factory_url || '')}
                  title="Quy trình vận hành tại xưởng sản xuất"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 13. BANNER CTA "BẠN CHƯA TÌM ĐƯỢC BAO BÌ PHÙ HỢP?" ================= */}
        <section className="py-14 bg-gradient-to-r from-[#0f2d59] to-[#1e3a8a] text-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
                  Tư Vấn Chuyên Sâu 24/7
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
                  Bạn Chưa Tìm Được Bao Bì Phù Hợp Cho Sản Phẩm Của Mình?
                </h2>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                  Mọi sự hợp tác tốt đẹp đều bắt đầu từ một cuộc trò chuyện. Hãy liên hệ với chúng tôi để đội ngũ kỹ thuật tư vấn quy cách và gửi mẫu thử nghiệm tận nơi!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Gọi Hotline: {settings.hotline}</span>
                </a>
                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-white text-[#0f2d59] hover:bg-slate-100 font-extrabold text-sm shadow-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Nhắn Zalo Tư Vấn</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 14. KIẾN THỨC VỀ BAO BÌ (BLOG POSTS) ================= */}
        {posts && posts.length > 0 && (
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0f2d59] border border-blue-200/70 mb-2">
                    Kiến Thức &amp; Cẩm Nang
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal">
                    Kiến Thức Chuyên Sâu Về Bao Bì &amp; Màng Co
                  </h2>
                </div>
                <Link
                  href="/tin-tuc"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-[#0f2d59] transition-colors"
                >
                  <span>Xem tất cả bài viết</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 6).map((post) => (
                  <article
                    key={`post-${post.id}`}
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

                      {/* Badge thương hiệu nhỏ góc trên bên trái chuẩn theo Ảnh 2 */}
                      <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-[#0f2d59]/90 backdrop-blur-xs text-[10px] font-bold text-amber-300 tracking-wider uppercase border border-amber-300/30 shadow-xs">
                        {settings.short_name || 'Bao Bì Thành Phát'}
                      </div>

                      {/* Lớp phủ gradient xanh: Đáy xanh đậm, càng lên cao càng mờ dần đến trong suốt/trắng */}
                      <div className="absolute inset-x-0 bottom-0 z-10 pt-28 pb-3.5 px-4 sm:px-5 bg-gradient-to-t from-[#0f2d59] via-[#0f2d59]/85 via-45% via-[#0f2d59]/20 to-transparent flex items-end">
                        <h3 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight line-clamp-2 min-h-[40px] sm:min-h-[48px] flex items-end drop-shadow-sm group-hover:text-sky-200 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </Link>

                    {/* Phần nội dung tóm tắt & Nút Xem chi tiết màu chủ đạo › */}
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

        {/* ================= 15. NHỮNG ĐIỀU CẦN BIẾT TRƯỚC KHI HỢP TÁC (FAQ ACCORDION) ================= */}
        <section className="py-16 md:py-20 bg-slate-50/70 border-t border-slate-100">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
                Hỏi &amp; Đáp
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0f2d59] tracking-normal mb-3">
                Những Điều Cần Biết Trước Khi Hợp Tác Cùng{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] to-[#2563eb]">
                  {settings.short_name || 'Bao Bì Thành Phát'}
                </span>
              </h2>
              <p className="text-slate-600 text-base">
                Giải đáp nhanh chóng các thắc mắc phổ biến nhất về đặt hàng, giá cả và bảo hành sản phẩm.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, fIdx) => (
                <details
                  key={`faq-${fIdx}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 transition-all duration-300 shadow-sm shadow-slate-200/80 hover:shadow-md open:shadow-lg open:border-blue-400"
                >
                  <summary className="font-bold text-slate-900 text-base md:text-lg cursor-pointer list-none flex items-center justify-between gap-4 select-none">
                    <span className="group-hover:text-[#0f2d59] transition-colors">{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-slate-100 group-open:bg-[#0f2d59] group-open:text-white flex items-center justify-center shrink-0 transition-all text-slate-600 font-bold text-lg">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 pt-4 border-t border-slate-100 text-slate-600 text-sm md:text-base leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 16. FORM YÊU CẦU BÁO GIÁ (#bao-gia) ================= */}
        <QuoteSection settings={settings} />

        {/* ================= 17. BẢN ĐỒ (#ban-do) ================= */}
        <section
          className="py-12 md:py-16 bg-white border-t border-slate-100"
          id="ban-do"
          aria-label={`Bản đồ ${settings.company_name} – ${settings.address}`}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
              <iframe
                title={`Bản đồ ${settings.company_name} – ${settings.address}`}
                src={`https://www.google.com/maps?q=${encodedAddress}&t=m&z=16&hl=vi&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
