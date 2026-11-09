'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X, ChevronDown, ChevronRight, ArrowRight, Layers, Factory, Phone } from 'lucide-react';
import { Category, Industry, ProductListItem, SiteSettings } from '@/types/database';

interface HeaderProps {
  settings: SiteSettings;
  categories?: Category[];
  industries?: Industry[];
  products?: ProductListItem[];
}

export default function Header({
  settings,
  categories = [],
  industries = [],
  products = [],
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [megaMode, setMegaMode] = useState<'category' | 'industry'>('category');
  const [activeMegaTab, setActiveMegaTab] = useState<string>('best-seller');
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  // Đóng mọi menu khi chuyển trang
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  // Handler hover mượt mà với debounce
  function handleMenuEnter() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  }

  function handleMenuLeave() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  }

  // Danh mục và Ngành nghề trực tiếp từ Supabase
  const resolvedCategories = categories;
  const resolvedIndustries = industries;

  // Khi chuyển mode trong mega menu, tự động chọn mục đầu tiên
  function handleSwitchMegaMode(mode: 'category' | 'industry') {
    setMegaMode(mode);
    if (mode === 'category') {
      setActiveMegaTab(resolvedCategories[0]?.id || 'best-seller');
    } else {
      setActiveMegaTab(resolvedIndustries[0]?.id || 'best-seller');
    }
  }

  // Tab hiện tại đang active trong Mega Menu
  const currentTabInfo = useMemo(() => {
    if (activeMegaTab === 'best-seller') {
      return {
        id: 'best-seller',
        name: 'Sản phẩm bán chạy nhất',
        slug: '',
        icon: '★',
        type: 'special' as const,
      };
    }

    if (megaMode === 'industry') {
      const foundInd = resolvedIndustries.find(
        (ind) => ind.id === activeMegaTab || ind.slug === activeMegaTab
      );
      if (foundInd) {
        return {
          id: foundInd.id,
          name: foundInd.name,
          slug: foundInd.slug,
          icon: foundInd.icon || '🏭',
          tag: foundInd.tag,
          description: foundInd.description,
          type: 'industry' as const,
        };
      }
    }

    const foundCat = resolvedCategories.find(
      (cat) => cat.id === activeMegaTab || cat.slug === activeMegaTab
    );
    if (foundCat) {
      return {
        id: foundCat.id,
        name: foundCat.name,
        slug: foundCat.slug,
        icon: '📦',
        tag: undefined,
        description: foundCat.description,
        type: 'category' as const,
      };
    }

    return {
      id: 'best-seller',
      name: 'Sản phẩm nổi bật',
      slug: '',
      icon: '★',
      type: 'special' as const,
    };
  }, [activeMegaTab, megaMode, resolvedCategories, resolvedIndustries]);

  // Lọc sản phẩm chính xác theo thể loại, ngành nghề hoặc bán chạy
  const activeProducts = useMemo(() => {
    if (activeMegaTab === 'best-seller') {
      const feat = products
        .filter((p) => p.is_featured)
        .sort((a, b) => (a.home_order || 999999) - (b.home_order || 999999));
      return (feat.length > 0 ? feat : products).slice(0, 8);
    }

    if (currentTabInfo.type === 'industry') {
      const targetId = currentTabInfo.id;
      const targetSlug = currentTabInfo.slug;
      const matched = products.filter((p) => {
        return (
          p.industry_id === targetId ||
          p.industry_id === targetSlug ||
          (p.industry_ids &&
            (p.industry_ids.includes(targetId) || p.industry_ids.includes(targetSlug)))
        );
      });
      return matched.slice(0, 8);
    }

    // Default: category
    const targetId = currentTabInfo.id;
    const targetSlug = currentTabInfo.slug;
    const matched = products.filter((p) => {
      const pCat = p.category_id || '';
      return pCat === targetId || pCat === targetSlug;
    });

    return matched.slice(0, 8);
  }, [products, activeMegaTab, currentTabInfo]);

  // Đếm tổng số sản phẩm trong tab active
  const totalTabProductsCount = useMemo(() => {
    if (activeMegaTab === 'best-seller') {
      const featCount = products.filter((p) => p.is_featured).length;
      return featCount > 0 ? featCount : products.length;
    }

    if (currentTabInfo.type === 'industry') {
      const targetId = currentTabInfo.id;
      const targetSlug = currentTabInfo.slug;
      return products.filter((p) => {
        return (
          p.industry_id === targetId ||
          p.industry_id === targetSlug ||
          Boolean(
            p.industry_ids &&
              (p.industry_ids.includes(targetId) || p.industry_ids.includes(targetSlug))
          )
        );
      }).length;
    }

    const targetId = currentTabInfo.id;
    const targetSlug = currentTabInfo.slug;
    return products.filter((p) => {
      const pCat = p.category_id || '';
      return pCat === targetId || pCat === targetSlug;
    }).length;
  }, [products, activeMegaTab, currentTabInfo]);

  // Link "Xem tất cả sản phẩm"
  const viewAllLink = useMemo(() => {
    if (activeMegaTab === 'best-seller' || !currentTabInfo.slug) {
      return '/san-pham?filter=featured';
    }
    if (currentTabInfo.type === 'industry') {
      return `/san-pham?nganh=${currentTabInfo.slug}`;
    }
    return `/san-pham?category=${currentTabInfo.slug}`;
  }, [activeMegaTab, currentTabInfo]);

  // Không hiển thị Header công khai khi đang ở trong Portal /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header id="masthead" className="bg-white relative z-40 shadow-xs" suppressHydrationWarning>
      {/* ================= ROW 1: ABOVE HEADER BAR ================= */}
      <div className="border-b border-slate-100 bg-white py-2.5 lg:py-3.5">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-[35px] grid grid-cols-2 lg:grid-cols-3 items-center min-h-[48px]">
          {/* Left: Social Icons (Desktop - Full Brand Colors) */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={settings.facebook_url || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="w-8 h-8 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white border border-[#1877f2] shadow-xs shadow-blue-500/30 hover:shadow-md hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 320 512">
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
              </svg>
            </a>
            <a
              href={settings.tiktok_url || 'https://tiktok.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              title="TikTok"
              className="w-8 h-8 rounded-full bg-[#010101] hover:bg-[#181818] text-white border border-slate-900 shadow-xs shadow-slate-900/30 hover:shadow-md hover:shadow-slate-900/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512">
                <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h.06a122.18 122.18 0 0 0 38.06 63.85 120.7 120.7 0 0 0 82.79 33.89z" />
              </svg>
            </a>
            <a
              href={settings.youtube_url || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
              className="w-8 h-8 rounded-full bg-[#ff0000] hover:bg-[#e60000] text-white border border-[#ff0000] shadow-xs shadow-red-500/30 hover:shadow-md hover:shadow-red-500/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 576 512">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </a>
            <a
              href={settings.twitter_url || 'https://twitter.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              title="Twitter"
              className="w-8 h-8 rounded-full bg-[#1da1f2] hover:bg-[#0c85d0] text-white border border-[#1da1f2] shadow-xs shadow-sky-400/30 hover:shadow-md hover:shadow-sky-400/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </svg>
            </a>
          </div>

          {/* Center on Desktop / Left on Mobile: Brand Logo (Enlarged) */}
          <div className="flex items-center lg:justify-center">
            <Link href="/" className="inline-flex items-center group py-0.5" onClick={() => setMobileMenuOpen(false)}>
              <img
                src="/logo.webp"
                alt={settings.company_name}
                width={260}
                height={70}
                className="h-[48px] sm:h-[58px] lg:h-[68px] max-h-[74px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>
          </div>

          {/* Right: Hotline CTA + Search + Mobile Hamburger */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 lg:gap-3.5">
            <a
              href={`tel:${settings.hotline.replace(/\s|\./g, '')}`}
              className="ux-btn-hotline-glow hidden sm:inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-white shadow-md group shrink-0"
              title={`Hotline Báo Giá: ${settings.hotline}`}
            >
              <span className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition shadow-inner">
                <span className="ux-btn-hotline-icon">
                  <Phone className="w-3.5 h-3.5 text-white fill-current" />
                </span>
              </span>
              <span className="text-left leading-tight">
                <span className="text-[10px] text-sky-100 font-bold block uppercase tracking-wider">Hotline Báo Giá</span>
                <span className="text-[13px] lg:text-[14px] font-black tracking-wide text-white drop-shadow-xs">{settings.hotline}</span>
              </span>
            </a>

            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Nút tìm kiếm"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 transition-all flex items-center justify-center shadow-2xs hover:scale-105 shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Chuyển đổi menu chính"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-9 h-9 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-2xs"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Optional Quick Search Bar */}
        {searchOpen && (
          <div className="max-w-[1200px] mx-auto px-5 pt-3 pb-1">
            <form suppressHydrationWarning action="/san-pham" method="get" className="flex gap-2">
              <input
                suppressHydrationWarning
                type="search"
                name="q"
                placeholder="Tìm sản phẩm, quy cách màng co..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-inner"
              />
              <button
                suppressHydrationWarning
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= ROW 2: PRIMARY NAVIGATION BAR (DESKTOP) ================= */}
      <div className="hidden lg:block bg-gradient-to-r from-[#072554] via-[#0c4a8a] to-[#072554] border-t border-sky-400/20 border-b border-[#041733] py-1.5 relative shadow-md">
        <div className="w-full max-w-[1280px] mx-auto px-6">
          <nav
            id="primary-site-navigation-desktop"
            aria-label="Điều hướng trang web chính"
            className="flex items-center justify-center min-h-[46px]"
          >
            <ul className="flex items-center justify-center flex-wrap list-none m-0 p-0 gap-1.5">
              {/* Trang chủ */}
              <li>
                <Link
                  href="/"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname === '/'
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Trang chủ
                </Link>
              </li>

              {/* Giới thiệu */}
              <li>
                <Link
                  href="/gioi-thieu"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname?.startsWith('/gioi-thieu')
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Giới Thiệu
                </Link>
              </li>

              {/* SẢN PHẨM (KÈM MEGA MENU HOVER) */}
              <li
                className="relative group"
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href="/san-pham"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap inline-flex items-center gap-1.5 ${
                    pathname?.startsWith('/san-pham') || megaMenuOpen
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <span>Sản Phẩm</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      megaMenuOpen
                        ? 'rotate-180 text-white'
                        : pathname?.startsWith('/san-pham')
                        ? 'text-white'
                        : 'text-sky-200/80 group-hover:text-white'
                    }`}
                  />
                </Link>

                {/* Khoảng đệm vô hình (Hover Bridge) ngăn rớt chuột khi di từ nav xuống mega menu */}
                <div
                  className={`absolute top-full left-0 right-0 h-4 z-50 ${
                    megaMenuOpen ? 'block' : 'hidden'
                  }`}
                />
              </li>

              {/* Màng Co Nhiệt */}
              <li>
                <Link
                  href="/mang-co-nhiet"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname?.startsWith('/mang-co-nhiet')
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Màng Co Nhiệt
                </Link>
              </li>

              {/* Màng Co PVC */}
              <li>
                <Link
                  href="/mang-co-pvc"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname?.startsWith('/mang-co-pvc')
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Màng Co PVC
                </Link>
              </li>

              {/* Màng Co POF */}
              <li>
                <Link
                  href="/mang-co-pof"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname?.startsWith('/mang-co-pof')
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Màng Co POF
                </Link>
              </li>

              {/* Tin tức / Kiến thức */}
              <li>
                <Link
                  href="/kien-thuc-mang-co-nhiet"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname?.startsWith('/kien-thuc-mang-co-nhiet') || pathname?.startsWith('/tin-tuc')
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Tin Tức
                </Link>
              </li>

              {/* Liên hệ */}
              <li>
                <Link
                  href="/lien-he"
                  className={`px-4 py-2 rounded-xl text-[14px] lg:text-[14.5px] tracking-tight transition-all duration-200 whitespace-nowrap ${
                    pathname?.startsWith('/lien-he')
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* =========================================================================
            MEGA MENU MODAL (DESKTOP) - BUNG RA KHI HOVER VÀO SẢN PHẨM
           ========================================================================= */}
        <div
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
          className={`absolute left-0 right-0 top-full w-full z-50 transition-all duration-300 ease-out origin-top ${
            megaMenuOpen
              ? 'opacity-100 visible translate-y-0 pointer-events-auto'
              : 'opacity-0 invisible -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="w-full max-w-[1260px] mx-auto px-4 pt-1 pb-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex min-h-[480px]">
              {/* CỘT TRÁI: CHUYỂN ĐỔI THEO THỂ LOẠI HOẶC THEO NGÀNH NGHỀ */}
              <div className="w-[300px] bg-slate-50/90 border-r border-slate-200/80 p-3 flex flex-col shrink-0">
                {/* Switch Mode: Thể loại vs Ngành nghề */}
                <div className="grid grid-cols-2 gap-1 bg-slate-200/70 p-1 rounded-xl mb-2.5">
                  <button
                    type="button"
                    onClick={() => handleSwitchMegaMode('category')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      megaMode === 'category'
                        ? 'bg-white text-[#0f2d59] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thể Loại ({resolvedCategories.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchMegaMode('industry')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      megaMode === 'industry'
                        ? 'bg-white text-[#0f2d59] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Factory className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ngành Nghề ({resolvedIndustries.length})</span>
                  </button>
                </div>

                {/* Mục Nổi Bật: Sản phẩm bán chạy */}
                <button
                  type="button"
                  onMouseEnter={() => setActiveMegaTab('best-seller')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-bold text-xs mb-2 transition shadow-2xs ${
                    activeMegaTab === 'best-seller'
                      ? 'bg-amber-400 text-amber-950 font-black ring-2 ring-amber-400/50'
                      : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">★</span>
                    <span>Sản phẩm bán chạy</span>
                  </span>
                  {activeMegaTab === 'best-seller' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {/* Danh sách Thể loại hoặc Ngành nghề */}
                <div className="space-y-1 flex-1 overflow-y-auto pr-1">
                  {megaMode === 'category' ? (
                    resolvedCategories.map((cat) => {
                      const isActive =
                        activeMegaTab === cat.id || activeMegaTab === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setActiveMegaTab(cat.id)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition border-l-4 ${
                            isActive
                              ? 'bg-white text-[#0f2d59] font-extrabold shadow-xs border-[#0f2d59]'
                              : 'border-transparent text-slate-700 font-semibold hover:bg-slate-200/60 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-1">{cat.name}</span>
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    resolvedIndustries.map((ind) => {
                      const isActive =
                        activeMegaTab === ind.id || activeMegaTab === ind.slug;
                      return (
                        <button
                          key={ind.id}
                          type="button"
                          onMouseEnter={() => setActiveMegaTab(ind.id)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition border-l-4 ${
                            isActive
                              ? 'bg-white text-[#0f2d59] font-extrabold shadow-xs border-[#0f2d59]'
                              : 'border-transparent text-slate-700 font-semibold hover:bg-slate-200/60 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-1 flex items-center gap-1.5">
                            <span>{ind.icon || '🏭'}</span>
                            <span className="truncate">{ind.name}</span>
                          </span>
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* CỘT PHẢI: LƯỚI SẢN PHẨM TƯƠNG ỨNG KHI HOVER */}
              <div className="flex-1 p-5 md:p-6 bg-white flex flex-col justify-between">
                <div>
                  {/* Header tiêu đề danh mục & Link xem tất cả */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#0f2d59] flex items-center gap-1.5">
                        {currentTabInfo.icon && <span>{currentTabInfo.icon}</span>}
                        <span>{currentTabInfo.name}</span>
                        {currentTabInfo.tag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {currentTabInfo.tag}
                          </span>
                        )}
                      </h3>
                      <span className="text-slate-300">|</span>
                      <Link
                        href={viewAllLink}
                        className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition inline-flex items-center gap-1 group"
                      >
                        <span>Xem tất cả {totalTabProductsCount} sản phẩm</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <Link
                      href="/san-pham"
                      className="text-xs font-bold text-slate-500 hover:text-[#0f2d59] transition"
                    >
                      Tất cả sản phẩm →
                    </Link>
                  </div>

                  {/* Lưới sản phẩm (Tối đa 8 sản phẩm - 4 cột x 2 hàng) */}
                  {activeProducts.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3.5 mt-4">
                      {activeProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="relative bg-white border border-slate-200/80 rounded-xl text-center flex flex-col justify-between items-center group overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200"
                        >
                          {/* Thanh chạy ngang màu xanh chủ đạo ở trên đỉnh khi hover */}
                          <span
                            className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#0284c7] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left z-30 pointer-events-none"
                            aria-hidden="true"
                          />

                          {/* Hiệu ứng vệt sáng bóng loáng (Glossy Shine Sweep) lướt qua khi hover */}
                          <span
                            className="pointer-events-none absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 group-hover:left-[140%] transition-all duration-700 ease-out z-20"
                            aria-hidden="true"
                          />

                          {/* Khung ảnh sản phẩm tràn kín viền trên, trái, phải không viền đệm */}
                          <Link
                            href={`/san-pham/${prod.slug}`}
                            className="w-full aspect-square bg-[#f1f4f9] overflow-hidden relative block border-b border-slate-100"
                          >
                            <img
                              src={prod.thumbnail_url}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </Link>

                          {/* Nội dung bên dưới */}
                          <div className="p-2.5 pt-2 w-full flex flex-col items-center justify-between flex-1">
                            {/* Tên sản phẩm in hoa */}
                            <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-[#2563eb] transition-colors line-clamp-1 uppercase tracking-tight w-full px-0.5">
                              <Link href={`/san-pham/${prod.slug}`}>{prod.name}</Link>
                            </h4>

                            {/* Nút Xem chi tiết - Tông xanh chủ đạo */}
                            <Link
                              href={`/san-pham/${prod.slug}`}
                              className="inline-block px-3.5 py-1 rounded-full bg-[#0f2d59] hover:bg-[#2563eb] text-white text-[10px] font-bold mt-2 shadow-2xs transition group-hover:shadow-md"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center">
                      <p className="font-semibold text-sm">
                        Đang cập nhật thêm sản phẩm cho mục này...
                      </p>
                      <Link
                        href="/san-pham"
                        className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1 font-bold"
                      >
                        <span>Xem toàn bộ kho sản phẩm</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DROPDOWN DRAWER (< lg) ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav aria-label="Menu di động">
            <ul className="list-none m-0 p-0 border-t border-slate-100">
              {/* Nút gọi hotline nổi bật ngay đầu menu mobile */}
              <li className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-blue-100">
                <a
                  href={`tel:${settings.hotline.replace(/\s|\./g, '')}`}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white text-xs font-black shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <span>GỌI HOTLINE BÁO GIÁ: {settings.hotline}</span>
                </a>
              </li>

              <li className="border-b border-slate-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname === '/'
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Trang chủ
                </Link>
              </li>

              <li className="border-b border-slate-100">
                <Link
                  href="/gioi-thieu"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname?.startsWith('/gioi-thieu')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Giới Thiệu
                </Link>
              </li>

              {/* Sản phẩm Accordion trên Mobile */}
              <li className="border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-sm font-bold uppercase text-left transition ${
                    pathname?.startsWith('/san-pham')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  <span>Sản Phẩm</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileProductsOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {mobileProductsOpen && (
                  <div className="bg-slate-50 px-5 py-3 space-y-3 border-t border-slate-100">
                    <Link
                      href="/san-pham?filter=featured"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-amber-700 hover:text-amber-800 py-1 font-bold"
                    >
                      ★ Sản phẩm bán chạy nhất
                    </Link>

                    {/* Danh mục Thể loại */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-blue-600" />
                        <span>Dòng Màng Co &amp; Bao Bì</span>
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {resolvedCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/san-pham?category=${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-slate-700 hover:text-blue-600 py-1 font-semibold truncate"
                          >
                            • {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Ngành nghề ứng dụng */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Factory className="w-3 h-3 text-emerald-600" />
                        <span>Ngành Nghề Ứng Dụng</span>
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {resolvedIndustries.map((ind) => (
                          <Link
                            key={ind.id}
                            href={`/san-pham?nganh=${ind.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-slate-700 hover:text-blue-600 py-1 font-semibold truncate flex items-center gap-1"
                          >
                            <span>{ind.icon || '🏭'}</span>
                            <span className="truncate">{ind.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <Link
                        href="/san-pham"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs text-[#0f2d59] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Xem toàn bộ sản phẩm kho</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              <li className="border-b border-slate-100">
                <Link
                  href="/mang-co-nhiet"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname?.startsWith('/mang-co-nhiet')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Màng Co Nhiệt
                </Link>
              </li>

              <li className="border-b border-slate-100">
                <Link
                  href="/mang-co-pvc"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname?.startsWith('/mang-co-pvc')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Màng Co PVC
                </Link>
              </li>

              <li className="border-b border-slate-100">
                <Link
                  href="/mang-co-pof"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname?.startsWith('/mang-co-pof')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Màng Co POF
                </Link>
              </li>

              <li className="border-b border-slate-100">
                <Link
                  href="/kien-thuc-mang-co-nhiet"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname?.startsWith('/kien-thuc-mang-co-nhiet') || pathname?.startsWith('/tin-tuc')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Tin Tức
                </Link>
              </li>

              <li>
                <Link
                  href="/lien-he"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-sm font-bold uppercase transition ${
                    pathname?.startsWith('/lien-he')
                      ? 'text-blue-600 bg-blue-50/70 border-l-4 border-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Liên Hệ
                </Link>
              </li>

              {/* Social icons trong menu mobile */}
              <li className="p-4 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Kết nối mạng xã hội:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={settings.facebook_url || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 320 512">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </a>
                  <a
                    href={settings.tiktok_url || 'https://tiktok.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-8 h-8 rounded-full bg-[#010101] text-white flex items-center justify-center shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512">
                      <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h.06a122.18 122.18 0 0 0 38.06 63.85 120.7 120.7 0 0 0 82.79 33.89z" />
                    </svg>
                  </a>
                  <a
                    href={settings.youtube_url || 'https://youtube.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 576 512">
                      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                    </svg>
                  </a>
                  <a
                    href={settings.twitter_url || 'https://twitter.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 512 512">
                      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
