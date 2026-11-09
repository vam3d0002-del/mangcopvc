'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HeroSlide, ProductListItem, SiteSettings } from '@/types/database';

interface SolarHeroBannerProps {
  products?: ProductListItem[];
  settings: SiteSettings;
}

export default function SolarHeroBanner({ products = [], settings }: SolarHeroBannerProps) {
  // Lấy danh sách 5 slide sản phẩm trực tiếp từ database Supabase
  const slides: HeroSlide[] = React.useMemo(() => {
    return settings.hero_slides || [];
  }, [settings.hero_slides]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // Nếu chưa có slide nào trong database, không render
  if (!slides || slides.length === 0) return null;

  // Chuyển slide tức thì, mượt mà không nháy: sản phẩm cũ trượt lên ẩn nhanh (200ms), sản phẩm mới từ dưới trượt lên xuất hiện (300ms)
  const goToSlide = React.useCallback(
    (targetIdx: number) => {
      if (targetIdx === activeIndex) return;
      setPrevIndex(activeIndex);
      setActiveIndex(targetIdx);
    },
    [activeIndex]
  );

  // Tự động chuyển sản phẩm sau mỗi 5 giây (Auto-play slider)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    autoSlideRef.current = setTimeout(() => {
      const nextIdx = (activeIndex + 1) % slides.length;
      goToSlide(nextIdx);
    }, 5000);

    return () => {
      if (autoSlideRef.current) clearTimeout(autoSlideRef.current);
    };
  }, [activeIndex, isPaused, slides.length, goToSlide]);

  const activeSlide = slides[activeIndex] || slides[0];

  const cleanPhone = (settings.hotline || '').replace(/\s|\./g, '');
  const rawZalo = (settings.zalo || '').replace(/\s|\./g, '');
  const cleanZalo = rawZalo || cleanPhone;

  return (
    <section
      suppressHydrationWarning
      className="solar-hero-banner relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] py-6 sm:py-10 lg:py-16 select-none border-b border-slate-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Banner Sản Phẩm Màng Co"
    >
      {/* Container chính */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
          
          {/* ================= CỘT 1 (TRÊN CÙNG Ở MOBILE, GIỮA Ở DESKTOP): NỀN HỆ MẶT TRỜI & SẢN PHẨM TRUNG TÂM ================= */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
            
            {/* === HỆ MẶT TRỜI: CÁC VÒNG TRÒN ĐỒNG TÂM & HÀNH TINH QUỸ ĐẠO === */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
              
              {/* Vòng quỹ đạo 1 (Trong cùng) */}
              <div className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full border border-slate-300/60" />

              {/* Vòng quỹ đạo 2 (Có hành tinh vàng/cam) */}
              <div className="absolute w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] rounded-full border border-slate-300/50 solar-orbit-spin-slow">
                {/* Hành tinh vàng/cam ở góc trên bên phải */}
                <span 
                  className="absolute top-[8%] right-[22%] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#f59e0b] shadow-[0_0_12px_#f59e0b] border-2 border-white ring-2 ring-amber-200/50"
                  title="Hành tinh quỹ đạo vàng"
                />
              </div>

              {/* Vòng quỹ đạo 3 (Có hành tinh xanh lá) */}
              <div className="absolute w-[440px] h-[440px] sm:w-[580px] sm:h-[580px] rounded-full border border-slate-300/40 solar-orbit-spin-reverse">
                {/* Hành tinh xanh lá ở vòng ngoài bên trái */}
                <span 
                  className="absolute top-[48%] left-[-8px] w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#10b981] shadow-[0_0_14px_#10b981] border-2 border-white ring-2 ring-emerald-200/50"
                  title="Hành tinh quỹ đạo xanh lá"
                />
              </div>

              {/* Vòng quỹ đạo 4 (Có hành tinh xanh dương) */}
              <div className="absolute w-[560px] h-[560px] sm:w-[740px] sm:h-[740px] rounded-full border border-slate-200/50 solar-orbit-spin-slow">
                {/* Hành tinh xanh dương */}
                <span 
                  className="absolute bottom-[24%] right-[4%] w-3.5 h-3.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] border-2 border-white"
                  title="Hành tinh quỹ đạo xanh dương"
                />
              </div>

              {/* Vòng ngoài cùng tỏa rộng */}
              <div className="absolute w-[680px] h-[680px] sm:w-[900px] sm:h-[900px] rounded-full border border-slate-200/30" />
            </div>

            {/* === SẢN PHẨM TRUNG TÂM (HIỆU ỨNG THAY THẾ NHANH MƯỢT, HOÀN TOÀN KHÔNG BỊ NHÁY) === */}
            <div className="relative z-10 flex flex-col items-center justify-center my-2 sm:my-4 group">
              <Link
                href={activeSlide.link_url || '#danh-muc'}
                className="relative block transform transition-all duration-300 ease-out hover:scale-105"
                title={`Xem chi tiết ${activeSlide.name}`}
              >
                {/* Khung chứa ảnh sản phẩm xếp chồng với CSS Transition mượt mà */}
                <div className="relative w-[220px] h-[280px] sm:w-[300px] sm:h-[390px] lg:w-[330px] lg:h-[430px] flex items-center justify-center overflow-visible">
                  {slides.map((s, idx) => {
                    const isActive = idx === activeIndex;
                    const isPrev = idx === prevIndex;

                    return (
                      <div
                        key={s.id || idx}
                        className={`absolute inset-0 flex items-center justify-center transform-gpu transition-all ${
                          isActive
                            ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto duration-300 ease-out'
                            : isPrev
                            ? 'opacity-0 -translate-y-8 scale-95 z-10 pointer-events-none duration-200 ease-in'
                            : 'opacity-0 translate-y-8 scale-95 z-0 pointer-events-none duration-0'
                        }`}
                      >
                        <img
                          src={s.image_url}
                          alt={s.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(15,23,42,0.25)]"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          fetchPriority={idx === 0 ? 'high' : 'auto'}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Bóng đổ mặt sàn 3D chân thực dưới đáy sản phẩm */}
                <div className="w-[160px] sm:w-[220px] h-[16px] sm:h-[22px] mx-auto mt-2 rounded-[50%] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent blur-md transform scale-y-75" />
              </Link>

              {/* Tên sản phẩm nhỏ gọn tinh tế phía dưới */}
              <div
                key={`label-${activeIndex}`}
                className="mt-3 text-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm max-w-xs animate-solarTextSlideUp"
              >
                <Link
                  href={activeSlide.link_url || '#danh-muc'}
                  className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#0284c7] line-clamp-1 transition-colors"
                >
                  {activeSlide.name}
                </Link>
              </div>

              {/* Chấm tròn Pagination Dots (Chuyển slide) */}
              <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
                {slides.map((s, idx) => (
                  <button
                    suppressHydrationWarning
                    key={s.id || idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activeIndex
                        ? 'w-7 h-2.5 bg-gradient-to-r from-[#0284c7] to-[#2563eb]'
                        : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Xem banner ${s.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ================= CỘT 2 (GIỮA Ở MOBILE, PHẢI Ở DESKTOP): DÃI 5 SẢN PHẨM THUMBNAIL ================= */}
          <div className="order-2 lg:order-3 lg:col-span-2 relative z-20 flex lg:flex-col items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-visible py-2 px-1 max-w-full no-scrollbar">
            {slides.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  suppressHydrationWarning
                  key={item.id || idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 lg:w-20 lg:h-24 rounded-xl bg-white/95 p-1.5 border-2 transition-all duration-300 ease-out transform ${
                    isActive
                      ? 'border-[#0284c7] ring-4 ring-[#0284c7]/20 shadow-lg scale-105 z-10'
                      : 'border-slate-200/80 hover:border-slate-400 hover:shadow-md hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                  title={item.name}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />

                  {/* Indicator chấm màu nhỏ khi active */}
                  {isActive && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gradient-to-r from-[#0284c7] to-[#2563eb] rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ================= CỘT 3 (DƯỚI CÙNG Ở MOBILE, TRÁI Ở DESKTOP): TEXT & CTA ================= */}
          <div className="order-3 lg:order-1 lg:col-span-5 text-left z-20">
            {/* Tag thương hiệu / Dòng sản phẩm */}
            <div
              key={`tag-${activeIndex}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 font-bold text-xs sm:text-sm tracking-wide mb-3 sm:mb-4 shadow-xs animate-solarTextSlideUp"
            >
              <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
              <span>{activeSlide.category_name || 'Bao Bì Đóng Gói Cao Cấp'}</span>
            </div>

            {/* Tiêu đề chính cập nhật theo slide */}
            <h1
              key={`title-${activeIndex}`}
              className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#0f2d59] leading-[1.2] tracking-tight mb-3 sm:mb-4 min-h-[58px] sm:min-h-[75px] lg:min-h-[96px] flex items-center animate-solarTextSlideUp"
            >
              {activeSlide.title || 'Hơn 10 Năm Sản Xuất Bao Bì Cho Thương Hiệu Việt'}
            </h1>

            {/* Mô tả ngắn gọn cập nhật theo slide */}
            <p
              key={`desc-${activeIndex}`}
              className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl min-h-[44px] sm:min-h-[55px] lg:min-h-[78px] animate-solarTextSlideUp"
            >
              {activeSlide.description || 'Chuyên sản xuất và gia công màng co PVC, POF, PE, in trục đồng sắc nét số lượng lớn cho doanh nghiệp.'}
            </p>

            {/* Cặp nút bấm chuẩn phong cách: Nút Zalo đổi sang màu xanh chủ đạo website */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Nút 1: Nhận báo giá qua Zalo - Màu xanh chủ đạo website */}
              <a
                href={`https://zalo.me/${cleanZalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.07l-.98 3.56c-.1.35.24.66.57.53l4.02-1.63c.82.23 1.68.37 2.55.37 5.52 0 10-4.03 10-9s-4.48-9-10-9zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
                <span>Nhận báo giá qua Zalo</span>
              </a>

              {/* Nút 2: Gửi yêu cầu báo giá hoặc Xem chi tiết */}
              <Link
                href={activeSlide.link_url || '#bao-gia'}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0f2d59] font-bold text-sm sm:text-base border-2 border-[#0f2d59]/30 hover:border-[#0f2d59] transition-all duration-200 shadow-xs"
              >
                {activeSlide.link_url && activeSlide.link_url.startsWith('/') ? 'Xem chi tiết dòng này' : 'Gửi yêu cầu báo giá'}
              </Link>
            </div>

            {/* Thông tin nhanh */}
            <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:items-center sm:gap-6 pt-4 border-t border-slate-200/80 text-[11px] sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span className="truncate">Giá sỉ tận xưởng</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 border-x sm:border-x-0 border-slate-200 px-0.5 sm:px-0">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span className="truncate">{activeSlide.badge || 'Đủ mọi quy cách'}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span className="truncate">Giao hàng toàn quốc</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hiệu ứng tia sáng mờ công nghệ phía sau */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
    </section>
  );
}
