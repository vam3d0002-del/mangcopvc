'use client';

import React, { useState, useMemo } from 'react';
import { Category, ProductListItem } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface Props {
  categories: Category[];
  products: ProductListItem[];
}

export default function ProductCatalogClient({ categories, products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Lọc sản phẩm theo search query và category
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      const catName = cat?.name || '';

      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        catName.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' ||
        p.category_id === selectedCategory ||
        (selectedCategory === 'cat-nhiet' && (p.category_id === 'cat-nhiet' || p.category_id === 'nhiet')) ||
        (selectedCategory === 'cat-pvc' && (p.category_id === 'cat-pvc' || p.category_id === 'pvc')) ||
        (selectedCategory === 'cat-pof' && (p.category_id === 'cat-pof' || p.category_id === 'pof')) ||
        (selectedCategory === 'cat-pe' && (p.category_id === 'cat-pe' || p.category_id === 'pe'));

      return matchesSearch && matchesCategory;
    });
  }, [products, categories, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  // Cắt sản phẩm theo trang hiện tại
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  function handleSelectCategory(catId: string) {
    setSelectedCategory(catId);
    setCurrentPage(1);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    const el = document.getElementById('catalog-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const startIdx = filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredProducts.length);

  return (
    <div id="catalog-top" className="space-y-8">
      {/* Thanh công cụ: Lọc thể loại & Tìm kiếm */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs thể loại */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Tất cả</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {products.length}
              </span>
            </button>

            {categories.map((cat) => {
              const count = products.filter(
                (p) =>
                  p.category_id === cat.id ||
                  (cat.id === 'cat-nhiet' && (p.category_id === 'cat-nhiet' || p.category_id === 'nhiet')) ||
                  (cat.id === 'cat-pvc' && (p.category_id === 'cat-pvc' || p.category_id === 'pvc')) ||
                  (cat.id === 'cat-pof' && (p.category_id === 'cat-pof' || p.category_id === 'pof')) ||
                  (cat.id === 'cat-pe' && (p.category_id === 'cat-pe' || p.category_id === 'pe'))
              ).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative min-w-[240px] md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm theo tên màng, quy cách..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Thanh trạng thái bộ lọc */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            {filteredProducts.length === 0 ? (
              <span className="text-rose-500 font-semibold">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </span>
            ) : (
              <span>
                Hiển thị <strong className="text-slate-800">{startIdx}</strong> –{' '}
                <strong className="text-slate-800">{endIdx}</strong> trong{' '}
                <strong className="text-slate-800">{filteredProducts.length}</strong> sản phẩm
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
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value={6}>6 sản phẩm</option>
              <option value={9}>9 sản phẩm</option>
              <option value={12}>12 sản phẩm</option>
              <option value={18}>18 sản phẩm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid danh sách sản phẩm */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Vui lòng thử tìm từ khóa khác hoặc chọn xem &quot;Tất cả&quot; thể loại màng co.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      )}

      {/* Thanh phân trang Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Trang <strong className="text-slate-800">{currentPage}</strong> /{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`min-w-[36px] h-9 px-3 rounded-xl font-bold text-xs transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Trang kế tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

