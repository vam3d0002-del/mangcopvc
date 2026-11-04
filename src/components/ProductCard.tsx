import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { ProductListItem } from '@/types/database';

export default function ProductCard({ product }: { product: ProductListItem }) {
  const specEntries = Object.entries(product.specs || {}).slice(0, 2);

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <Link href={`/san-pham/${product.slug}`} className="relative block aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={product.thumbnail_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-brand-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            Bán chạy tại xưởng
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-semibold text-brand-600 mb-1">
          Giá tham khảo: {product.price_label}
        </div>
        <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug mb-2 hover:text-brand-600 transition">
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {product.short_description}
        </p>

        {specEntries.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-slate-600 mt-auto">
            {specEntries.map(([key, val]) => (
              <div key={key} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">{key}:</strong> {val}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/san-pham/${product.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-semibold text-sm transition mt-auto"
        >
          <span>Xem quy cách & Báo giá</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

