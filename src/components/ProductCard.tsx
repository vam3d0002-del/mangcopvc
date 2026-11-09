import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { ProductListItem } from '@/types/database';

export default function ProductCard({ product }: { product: ProductListItem }) {
  const specEntries = Object.entries(product.specs || {}).slice(0, 2);

  return (
    <article className="relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col group">
      {/* Thanh chạy ngang ở trên đỉnh khi hover - Màu xanh chủ đạo */}
      <span
        className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#0284c7] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left z-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Hiệu ứng vệt sáng bóng loáng (Glossy Shine Sweep) lướt qua khi hover */}
      <span
        className="pointer-events-none absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 group-hover:left-[140%] transition-all duration-700 ease-out z-20"
        aria-hidden="true"
      />

      <Link href={`/san-pham/${product.slug}`} className="relative block aspect-square bg-[#f1f4f9] overflow-hidden flex items-center justify-center border-b border-slate-100">
        <img
          src={product.thumbnail_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-[#0f2d59] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
            Bán chạy tại xưởng
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-semibold text-brand-600 mb-1">
          Giá tham khảo: {product.price_label}
        </div>
        <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug mb-2 line-clamp-2 min-h-[44px] md:min-h-[50px] flex items-start hover:text-[#0284c7] transition">
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {product.short_description}
        </p>

        {specEntries.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-slate-600 mt-auto">
            {specEntries.map(([key, val]) => (
              <div key={key} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2563eb] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">{key}:</strong> {val}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/san-pham/${product.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0f2d59] hover:bg-[#2563eb] text-white font-semibold text-sm transition mt-auto shadow-xs"
        >
          <span>Xem quy cách & Báo giá</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

