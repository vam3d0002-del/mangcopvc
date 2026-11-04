import type { Metadata } from 'next';
import Link from 'next/link';
import { getCachedCategories, getCachedProductsList } from '@/lib/cache';
import ProductCatalogClient from '@/components/ProductCatalogClient';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Danh Mục Màng Co Nhiệt PVC, POF, PE & Túi Màng Co Cắt Sẵn Giá Sỉ',
  description:
    'Tổng hợp các dòng màng co nhiệt PVC dạng cuộn, túi màng co PVC cắt sẵn, màng co POF thực phẩm và màng co PE quấn lốc sản xuất trực tiếp tại xưởng.',
  alternates: {
    canonical: '/san-pham',
  },
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCachedCategories(),
    getCachedProductsList(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <div className="mb-8">
        <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Sản phẩm Màng Co</span>
        </nav>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sản Phẩm Màng Co Nhiệt PVC, POF, PE
        </h1>
        <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl">
          Toàn bộ sản phẩm được sản xuất từ hạt nhựa nguyên sinh, kiểm soát chặt chẽ độ dày (mic) và tỷ lệ co nhiệt trước khi xuất xưởng. Nhận cắt túi, đục lỗ thoát khí và chia cuộn theo quy cách yêu cầu.
        </p>
      </div>

      <ProductCatalogClient categories={categories} products={products} />
    </div>
  );
}

