'use client';

import { useRef, useState } from 'react';
import {
  Bold,
  Columns2,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  PenLine,
  Quote,
  Table,
} from 'lucide-react';
import { htmlToMarkdown, renderMarkdownOrHtml } from '@/lib/markdown';
import { compressImageToWebP } from '@/lib/image-compressor';

interface MarkdownEditorProps {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  compact?: boolean;
  helperText?: string;
  folder?: 'posts' | 'products' | 'uploads';
}

export default function MarkdownEditor({
  name,
  label,
  defaultValue = '',
  placeholder = 'Nhập nội dung bằng Markdown (Hỗ trợ ## Tiêu đề, **in đậm**, - danh sách, bảng, chèn ảnh...)',
  rows = 8,
  required = false,
  compact = false,
  helperText,
  folder = 'posts',
}: MarkdownEditorProps) {
  const [value, setValue] = useState<string>(() =>
    htmlToMarkdown(defaultValue)
  );
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [uploadingInline, setUploadingInline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function insertAtCursor(before: string, after = '', sample = '') {
    const el = textareaRef.current;
    if (!el) {
      setValue((prev) => `${prev}${before}${sample}${after}`);
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || sample;
    const replacement = `${before}${selected}${after}`;
    const nextValue = value.slice(0, start) + replacement + value.slice(end);

    setValue(nextValue);

    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  async function handleInlineImageUpload(file: File) {
    setUploadingInline(true);
    try {
      const compressed = await compressImageToWebP(file, 1200, 150);
      const fd = new FormData();
      fd.append('file', compressed.blob, compressed.fileName);
      fd.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        insertAtCursor(`\n![Mô tả ảnh](${data.url})\n`, '', '');
      }
    } catch {
      // ignore error
    } finally {
      setUploadingInline(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {helperText && (
          <span className="text-[11px] text-slate-400">{helperText}</span>
        )}
      </div>

      <div className="rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-500/15 transition">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-2.5 py-1.5 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-0.5">
            {!compact && (
              <>
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() =>
                    insertAtCursor('\n## ', '\n', 'Tiêu đề mục chính')
                  }
                  title="Tiêu đề H2 (## )"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => insertAtCursor('\n### ', '\n', 'Tiêu đề phụ')}
                  title="Tiêu đề H3 (### )"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-0.5" />
              </>
            )}

            <button
              suppressHydrationWarning
              type="button"
              onClick={() => insertAtCursor('**', '**', 'chữ in đậm')}
              title="In đậm (**text**)"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => insertAtCursor('*', '*', 'chữ in nghiêng')}
              title="In nghiêng (*text*)"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
            >
              <Italic className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-200 mx-0.5" />

            <button
              suppressHydrationWarning
              type="button"
              onClick={() =>
                insertAtCursor(
                  '\n- ',
                  '',
                  'Ý chính thứ nhất\n- Ý chính thứ hai'
                )
              }
              title="Danh sách gạch đầu dòng (- )"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() =>
                insertAtCursor('\n1. ', '', 'Bước 1\n2. Bước 2')
              }
              title="Danh sách đánh số (1. )"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {!compact && (
              <>
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() =>
                    insertAtCursor('\n> ', '\n', 'Ghi chú quan trọng / Cam kết')
                  }
                  title="Trích dẫn (> )"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() =>
                    insertAtCursor('[', '](https://mangcopvc.com)', 'Xem thêm')
                  }
                  title="Chèn liên kết [Tên](URL)"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() =>
                    insertAtCursor(
                      '\n| Quy cách | Độ dày | Ứng dụng |\n| --- | --- | --- |\n| Khổ 20cm | 25 mic | Bọc hộp mỹ phẩm |\n| Khổ 40cm | 30 mic | Bọc giỏ quà Tết |\n',
                      '',
                      ''
                    )
                  }
                  title="Chèn bảng quy cách Markdown"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] transition"
                >
                  <Table className="w-4 h-4" />
                </button>

                <label
                  title="Tải ảnh lên (Tự nén .webp & chèn Markdown)"
                  className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-[#2563eb] hover:bg-blue-100 border border-blue-200/80 ml-1 transition"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{uploadingInline ? 'Đang tải...' : 'Chèn ảnh .webp'}</span>
                  <input
                    suppressHydrationWarning
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleInlineImageUpload(f);
                    }}
                  />
                </label>
              </>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex items-center rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-bold">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setMode('edit')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition ${
                mode === 'edit'
                  ? 'bg-white text-[#2563eb] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenLine className="w-3 h-3" />
              <span>Markdown</span>
            </button>
            {!compact && (
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setMode('split')}
                className={`hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-md transition ${
                  mode === 'split'
                    ? 'bg-white text-[#2563eb] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns2 className="w-3 h-3" />
                <span>Song song</span>
              </button>
            )}
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setMode('preview')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition ${
                mode === 'preview'
                  ? 'bg-white text-[#2563eb] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Xem trước</span>
            </button>
          </div>
        </div>

        {/* Editor / Preview Body */}
        <div
          className={
            mode === 'split'
              ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200'
              : 'block'
          }
        >
          {/* Textarea (Always rendered so FormData picks up `name`, hidden only when mode === 'preview') */}
          <div className={mode === 'preview' ? 'hidden' : 'block'}>
            <textarea
              suppressHydrationWarning
              ref={textareaRef}
              name={name}
              rows={rows}
              required={required}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3.5 py-2.5 text-sm font-sans text-slate-800 leading-relaxed focus:outline-none resize-y border-0"
            />
          </div>

          {/* Live Markdown Preview */}
          {(mode === 'preview' || mode === 'split') && (
            <div className="px-4 py-3 bg-slate-50/40 max-h-[380px] overflow-y-auto">
              {value.trim() ? (
                <div
                  className="prose-content text-sm text-slate-800 space-y-2"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownOrHtml(value),
                  }}
                />
              ) : (
                <p className="text-xs italic text-slate-400">
                  Chưa có nội dung để xem trước...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
