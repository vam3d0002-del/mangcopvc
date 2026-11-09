'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, Industry, ProductListItem } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import { Search, Layers, Factory, RotateCcw } from 'lucide-react';

interface Props {
  categories: Category[];
  industries?: Industry[];
  products: ProductListItem[];
}

export default function ProductCatalogClient({
  categories,
  industries = [],
  products,
}: Props) {
  const searchParams = useSearchParams();

  // Chế độ lọc: 'category' (Dòng bao bì) hoặc 'industry' (Ngành ứng dụng)
  const [filterMode, setFilterMode] = useState<'category' | 'industry'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);

  // Đọc query param từ URL khi load trang (VD: /san-pham?nganh=nuoc-giai-khat-do-uong)
  useEffect(() => {
    const nganhSlug = searchParams.get('nganh');
    if (nganhSlug && industries.length > 0) {
      const matchInd = industries.find((i) => i.slug === nganhSlug || i.id === nganhSlug);
      if (matchInd) {
        setFilterMode('industry');
        setSelectedIndustry(matchInd.id);
        setSelectedCategory('all');
      }
    }

    const catSlug =
      searchParams.get('category') ||
      searchParams.get('the-loai') ||
      searchParams.get('danh-muc') ||
      searchParams.get('loai');
    if (catSlug && categories.length > 0) {
      const matchCat = categories.find((c) => c.slug === catSlug || c.id === catSlug);
      if (matchCat) {
        setFilterMode('category');
        setSelectedCategory(matchCat.id);
        setSelectedIndustry('all');
      }
    }
  }, [searchParams, industries, categories]);

  // Lọc sản phẩm đa chiều
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id || c.slug === p.category_id);
      const catName = cat?.name || '';

      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        catName.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterMode === 'category') {
        if (selectedCategory === 'all') return true;
        const targetCat = categories.find((c) => c.id === selectedCategory);
        return (
          p.category_id === selectedCategory ||
          (targetCat && p.category_id === targetCat.slug)
        );
      } else {
        if (selectedIndustry === 'all') return true;
        return (
          p.industry_id === selectedIndustry ||
          (p.industry_ids && p.industry_ids.includes(selectedIndustry))
        );
      }
    });
  }, [products, categories, searchQuery, filterMode, selectedCategory, selectedIndustry]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  function handleSwitchMode(mode: 'category' | 'industry') {
    setFilterMode(mode);
    setCurrentPage(1);
  }

  function handleResetFilter() {
    setSelectedCategory('all');
    setSelectedIndustry('all');
    setSearchQuery('');
    setCurrentPage(1);
  }

  const startIdx = filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredProducts.length);

  return (
    <div id="catalog-top" className="space-y-8">
      {/* Khối Bộ Lọc Hai Chiều Cao Cấp */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-7 shadow-sm space-y-6">
        {/* Hàng 1: Nút chuyển Chế độ lọc & Ô tìm kiếm */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => handleSwitchMode('category')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                filterMode === 'category'
                  ? 'bg-white text-[#0f2d59] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Theo Thể Loại Màng Co ({categories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('industry')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                filterMode === 'industry'
                  ? 'bg-white text-[#0f2d59] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Factory className="w-4 h-4 text-emerald-600" />
              <span>Theo Ngành Nghề ({industries.length})</span>
            </button>
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative min-w-[260px] md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên màng, SKU, quy cách..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Hàng 2: Danh sách Tabs tương ứng theo Chế độ */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>
              {filterMode === 'category'
                ? 'Chọn Thể Loại Bao Bì / Màng Co:'
                : 'Chọn Ngành Hàng Ứng Dụng:'}
            </span>
            {(selectedCategory !== 'all' || selectedIndustry !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại tất cả</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tab Tất Cả */}
            <button
              type="button"
              onClick={() => {
                if (filterMode === 'category') setSelectedCategory('all');
                else setSelectedIndustry('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                (filterMode === 'category' && selectedCategory === 'all') ||
                (filterMode === 'industry' && selectedIndustry === 'all')
                  ? 'bg-[#0f2d59] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Tất cả</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                {products.length}
              </span>
            </button>

            {/* Render các tabs Thể loại */}
            {filterMode === 'category' &&
              categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category_id === cat.id || p.category_id === cat.slug
                ).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

            {/* Render các tabs Ngành nghề */}
            {filterMode === 'industry' &&
              industries.map((ind) => {
                const count = products.filter(
                  (p) =>
                    p.industry_id === ind.id ||
                    (p.industry_ids && p.industry_ids.includes(ind.id))
                ).length;
                const isSelected = selectedIndustry === ind.id;

                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndustry(ind.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ind.icon && <span>{ind.icon}</span>}
                    <span>{ind.name}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Hàng 3: Trạng thái & Phân trang size */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            {filteredProducts.length === 0 ? (
              <span className="text-rose-500 font-bold">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </span>
            ) : (
              <span>
                Hiển thị <strong className="text-slate-900 font-bold">{startIdx}</strong> –{' '}
                <strong className="text-slate-900 font-bold">{endIdx}</strong> trong{' '}
                <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> sản phẩm
                <span className="ml-1 text-slate-400">(Trang {currentPage}/{totalPages})</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Hiển thị mỗi trang:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value={6}>6 sản phẩm</option>
              <option value={9}>9 sản phẩm</option>
              <option value={12}>12 sản phẩm</option>
              <option value={18}>18 sản phẩm</option>
              <option value={24}>24 sản phẩm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lưới Sản Phẩm */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600 font-semibold mb-3">
            Chưa có sản phẩm nào cho tiêu chí tìm kiếm này.
          </p>
          <button
            type="button"
            onClick={handleResetFilter}
            className="px-5 py-2.5 rounded-xl bg-[#0f2d59] text-white text-xs font-bold shadow-sm hover:bg-blue-900 transition"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      )}

      {/* Phân Trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              const el = document.getElementById('catalog-top');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ‹ Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => {
                setCurrentPage(page);
                const el = document.getElementById('catalog-top');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                page === currentPage
                  ? 'bg-[#0f2d59] text-white shadow-sm'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              const el = document.getElementById('catalog-top');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Sau ›
          </button>
        </div>
      )}
    </div>
  );
}
