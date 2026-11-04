'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { submitInquiryAction } from '@/app/actions/admin';

export default function QuoteForm({ defaultProduct = '' }: { defaultProduct?: string }) {
  const [status, setStatus] = useState<{ ok?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await submitInquiryAction(formData);
    setStatus(res);
    setLoading(false);
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      suppressHydrationWarning
      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4"
    >
      <div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900">
          Nhận Báo Giá Sỉ & Mẫu Thử Màng Co Miễn Phí
        </h3>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Điền kích thước hộp hoặc quy cách cuộn cần đặt, kỹ thuật viên sẽ tính khổ màng tối ưu và báo giá trong 15 phút.
        </p>
      </div>

      {status?.message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-2.5 ${
            status.ok
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Họ tên Anh/Chị *
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="customer_name"
            required
            placeholder="VD: Anh Nam - Xưởng Trà"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Số điện thoại / Zalo *
          </label>
          <input
            suppressHydrationWarning
            type="tel"
            name="phone"
            required
            placeholder="VD: 0909 123 456"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Loại màng co quan tâm
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="product_interest"
            defaultValue={defaultProduct}
            placeholder="Màng co PVC cuộn / Túi cắt sẵn / POF..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Quy cách & Số lượng dự kiến
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="quantity_note"
            placeholder="VD: Túi 15x25cm, dày 25mic - 100kg"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Ghi chú thêm (Kích thước Dài x Rộng x Cao của hộp sản phẩm)
        </label>
        <textarea
          suppressHydrationWarning
          name="message"
          rows={3}
          placeholder="Nhập kích thước hộp của bạn nếu cần kỹ thuật viên tính giúp khổ túi màng co chuẩn xác..."
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
        />
      </div>

      <button
        suppressHydrationWarning
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-sm transition"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Báo Giá Tận Xưởng'}</span>
      </button>
    </form>
  );
}
