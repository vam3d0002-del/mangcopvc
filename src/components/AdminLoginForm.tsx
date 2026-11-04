'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { loginAdminAction } from '@/app/actions/admin';

export default function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    const formData = new FormData(e.currentTarget);
    const res = await loginAdminAction(formData);
    setNotice(res);

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-blue-200/40 p-7 sm:p-9 shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <Link href="/" className="inline-flex items-center mb-3">
            <img
              src="/logo.webp"
              alt="Logo Hệ Thống Quản Trị"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            HỆ THỐNG QUẢN TRỊ v2.0
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4">
            Đăng nhập Quản Trị Viên
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nhập Email và Mật khẩu quản trị để truy cập bảng điều khiển
          </p>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold mb-5 ${
              notice.ok
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {notice.message}
          </div>
        )}

        {/* Login Form */}
        <form
          suppressHydrationWarning
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Email quản trị <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                suppressHydrationWarning
                id="admin-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@mangcopvc.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#2563eb] focus:ring-3 focus:ring-blue-500/15 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                suppressHydrationWarning
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-10 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#2563eb] focus:ring-3 focus:ring-blue-500/15 focus:outline-none transition"
              />
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            suppressHydrationWarning
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-sm transition cursor-pointer mt-2"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập vào Hệ Thống →'}
          </button>
        </form>

        {/* Default Account Hint Box */}
        <div className="mt-5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-600 space-y-0.5">
          <div className="font-bold text-slate-700">Tài khoản mặc định:</div>
          <div>
            Email: <code className="font-bold text-[#2563eb]">admin@mangcopvc.com</code>
          </div>
          <div>
            Mật khẩu: <code className="font-bold text-[#2563eb]">admin123</code>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-[#2563eb] transition-colors"
          >
            ← Quay về trang chủ website
          </Link>
        </div>
      </div>
    </div>
  );
}

