'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import { SiteSettings } from '@/types/database';

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/mang-co-nhiet', label: 'Màng Co Nhiệt' },
  { href: '/mang-co-pvc', label: 'Màng Co PVC' },
  { href: '/mang-co-pof', label: 'Màng Co POF' },
  { href: '/kien-thuc-mang-co-nhiet', label: 'Kiến thức màng co nhiệt' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const cleanPhone = settings.hotline.replace(/\s|\./g, '');

  // Không hiển thị Header công khai khi đang ở trong Portal /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      id="masthead"
      className="bg-[#f6f7f8]"
      suppressHydrationWarning
    >
      {/* ================= ROW 1: ABOVE HEADER BAR (CHUẨN ASTRA MANGCOPVC.COM) ================= */}
      <div className="border-b border-black/10 bg-[#f6f7f8] py-[14px] lg:py-[20px]">
        <div className="w-full max-w-full mx-auto px-5 lg:px-[35px] grid grid-cols-2 lg:grid-cols-3 items-center min-h-[40px]">
          {/* Left: Social Icons (Desktop) */}
          <div className="hidden lg:flex items-center">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="mx-[10px] text-[#404040] hover:text-[#2563eb] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="mx-[10px] text-[#404040] hover:text-[#2563eb] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@mangcopvc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="mx-[10px] text-[#404040] hover:text-[#2563eb] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 32 32">
                <path d="M16.708 0.027c1.745-0.027 3.48-0.011 5.213-0.027 0.105 2.041 0.839 4.12 2.333 5.563 1.491 1.479 3.6 2.156 5.652 2.385v5.369c-1.923-0.063-3.855-0.463-5.6-1.291-0.76-0.344-1.468-0.787-2.161-1.24-0.009 3.896 0.016 7.787-0.025 11.667-0.104 1.864-0.719 3.719-1.803 5.255-1.744 2.557-4.771 4.224-7.88 4.276-1.907 0.109-3.812-0.411-5.437-1.369-2.693-1.588-4.588-4.495-4.864-7.615-0.032-0.667-0.043-1.333-0.016-1.984 0.24-2.537 1.495-4.964 3.443-6.615 2.208-1.923 5.301-2.839 8.197-2.297 0.027 1.975-0.052 3.948-0.052 5.923-1.323-0.428-2.869-0.308-4.025 0.495-0.844 0.547-1.485 1.385-1.819 2.333-0.276 0.676-0.197 1.427-0.181 2.145 0.317 2.188 2.421 4.027 4.667 3.828 1.489-0.016 2.916-0.88 3.692-2.145 0.251-0.443 0.532-0.896 0.547-1.417 0.131-2.385 0.079-4.76 0.095-7.145 0.011-5.375-0.016-10.735 0.025-16.093z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/mangconhietpvcpof/?locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="mx-[10px] text-[#404040] hover:text-[#2563eb] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 320 512">
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@mangconhietcvt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="mx-[10px] text-[#404040] hover:text-[#2563eb] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 576 512">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </a>
          </div>

          {/* Center on Desktop / Left on Mobile: Brand Logo */}
          <div className="flex items-center lg:justify-center">
            <Link
              href="/"
              className="inline-flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/logo.webp"
                alt={settings.company_name}
                width={150}
                height={33}
                className="h-[38px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: Theo dõi + Search + Mobile Hamburger */}
          <div className="flex items-center justify-end gap-5">
            <a
              href="https://www.youtube.com/@caovanthinhmangco2868"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center text-[#2563eb] hover:text-black text-[15px] font-medium transition-colors"
            >
              Theo dõi
            </a>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Nút tìm kiếm"
              className="p-1 text-[#404040] hover:text-[#2563eb] transition-colors"
            >
              <Search className="w-[16px] h-[16px]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Chuyển đổi menu chính"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-1.5 text-[#2563eb] hover:opacity-80"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Optional Quick Search Bar */}
        {searchOpen && (
          <div className="max-w-[1200px] mx-auto px-5 pt-3">
            <form
              suppressHydrationWarning
              action="/kien-thuc-mang-co-nhiet"
              method="get"
              className="flex gap-2"
            >
              <input
                suppressHydrationWarning
                type="search"
                name="q"
                placeholder="Search..."
                className="flex-1 rounded border border-[#dddddd] bg-white px-3.5 py-2 text-sm focus:border-[#2563eb] focus:outline-none"
              />
              <button
                suppressHydrationWarning
                type="submit"
                className="px-4 py-2 rounded bg-[#2563eb] text-white text-xs font-bold uppercase"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= ROW 2: PRIMARY NAVIGATION BAR (DESKTOP) ================= */}
      <div className="hidden lg:block bg-[#f6f7f8] border-b border-black/10 py-[10px]">
        <div className="w-full max-w-full mx-auto px-[35px]">
          <nav
            id="primary-site-navigation-desktop"
            aria-label="Điều hướng trang web chính"
            className="flex items-center justify-center min-h-[50px]"
          >
            <ul className="flex items-center justify-center flex-wrap list-none m-0 p-0">
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(item.href);
                return (
                  <li key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      className={`px-[16px] py-2 text-[16px] font-medium uppercase tracking-normal transition-colors whitespace-nowrap ${
                        isActive
                          ? 'text-[#2563eb]'
                          : 'text-[#000000] hover:text-[#2563eb]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* ================= MOBILE DROPDOWN DRAWER (< lg) ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-black/10 bg-white shadow-lg">
          <nav aria-label="Menu di động">
            <ul className="list-none m-0 p-0 border-t border-[#eaeaea]">
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(item.href);
                return (
                  <li key={item.href} className="border-b border-[#eaeaea]">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-5 py-2.5 text-[15px] font-medium uppercase transition-colors ${
                        isActive
                          ? 'text-[#2563eb]'
                          : 'text-[#000000] hover:text-[#2563eb]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 flex items-center justify-between bg-[#f6f7f8]">
            <a
              href="https://www.youtube.com/@caovanthinhmangco2868"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563eb] font-medium text-sm"
            >
              Theo dõi
            </a>
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3.5 rounded bg-[#2563eb] text-white font-bold text-xs"
            >
              📞 {settings.hotline}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
