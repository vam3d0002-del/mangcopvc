/**
 * Bộ chuyển đổi Markdown <-> HTML nhẹ, an toàn, hỗ trợ cả dữ liệu HTML cũ
 * và văn bản Markdown mới (Tiêu đề, In đậm, Danh sách, Bảng, Ảnh, Link, Trích dẫn).
 */

export function htmlToMarkdown(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Nếu không chứa thẻ HTML phổ biến thì giữ nguyên Markdown
  if (!/<(p|h[1-6]|ul|ol|li|strong|b|em|i|a|img|blockquote|br|div|table)\b/i.test(trimmed)) {
    return trimmed;
  }

  let md = trimmed;

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n\n');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const clean = inner.replace(/<\/?p[^>]*>/gi, '').trim();
    return `\n> ${clean}\n\n`;
  });

  // Images
  md = md.replace(
    /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi,
    '![$2]($1)'
  );
  md = md.replace(
    /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*\/?>/gi,
    '![$1]($2)'
  );
  md = md.replace(/<img[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)');

  // Links
  md = md.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Bold & Italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = inner.replace(
      /<li[^>]*>([\s\S]*?)<\/li>/gi,
      (__: string, item: string) => `- ${item.replace(/<\/?p[^>]*>/gi, '').trim()}\n`
    );
    return `\n${items}\n`;
  });

  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 1;
    const items = inner.replace(
      /<li[^>]*>([\s\S]*?)<\/li>/gi,
      (__: string, item: string) =>
        `${idx++}. ${item.replace(/<\/?p[^>]*>/gi, '').trim()}\n`
    );
    return `\n${items}\n`;
  });

  // Paragraphs & line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Strip remaining simple wrapper tags
  md = md.replace(/<\/?(div|section|article|span)[^>]*>/gi, '');

  // Decode basic HTML entities
  md = md
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  return md.replace(/\n{3,}/g, '\n\n').trim();
}

function formatInlineMarkdown(text: string): string {
  let out = text;

  // Images: ![alt](url)
  out = out.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full h-auto border border-slate-200" loading="lazy" />'
  );

  // Links: [text](url)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#2563eb] font-semibold underline hover:text-[#1d4ed8]">$1</a>'
  );

  // Bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  // Inline code: `code`
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs">$1</code>'
  );

  return out;
}

export function renderMarkdownOrHtml(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // Nếu dữ liệu thuần HTML (bắt đầu bằng thẻ block HTML và không có cú pháp Markdown)
  if (
    /^<(p|h[1-6]|div|section|article|ul|ol|table)\b/i.test(trimmed) &&
    !/^(#{1,6}\s|-\s|\*\s|\d+\.\s|>\s)/m.test(trimmed)
  ) {
    return trimmed;
  }

  const lines = trimmed.replace(/\r\n/g, '\n').split('\n');
  const htmlBlocks: string[] = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;
  let tableHeaderDone = false;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const joined = paragraphBuffer.join('<br />');
      htmlBlocks.push(`<p>${formatInlineMarkdown(joined)}</p>`);
      paragraphBuffer = [];
    }
  };

  const closeLists = () => {
    if (inUl) {
      htmlBlocks.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      htmlBlocks.push('</ol>');
      inOl = false;
    }
    if (inTable) {
      htmlBlocks.push('</tbody></table></div>');
      inTable = false;
      tableHeaderDone = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeLists();
      continue;
    }

    // Markdown Table row: | col1 | col2 |
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph();
      if (inUl || inOl) closeLists();

      // Skip separator row | --- | --- |
      if (/^\|[\s\-:|]+\|$/.test(line)) {
        continue;
      }

      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => formatInlineMarkdown(c.trim()));

      if (!inTable) {
        inTable = true;
        tableHeaderDone = false;
        htmlBlocks.push(
          '<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm">'
        );
      }

      if (!tableHeaderDone) {
        htmlBlocks.push(
          `<thead class="bg-slate-100"><tr>${cells
            .map(
              (c) =>
                `<th class="border border-slate-200 px-3.5 py-2 text-left font-bold text-slate-900">${c}</th>`
            )
            .join('')}</tr></thead><tbody>`
        );
        tableHeaderDone = true;
      } else {
        htmlBlocks.push(
          `<tr>${cells
            .map((c) => `<td class="border border-slate-200 px-3.5 py-2">${c}</td>`)
            .join('')}</tr>`
        );
      }
      continue;
    } else if (inTable) {
      closeLists();
    }

    // Horizontal Rule
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      flushParagraph();
      closeLists();
      htmlBlocks.push('<hr class="my-6 border-slate-200" />');
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      flushParagraph();
      closeLists();
      const level = Math.min(Math.max(hMatch[1].length, 2), 4);
      htmlBlocks.push(
        `<h${level}>${formatInlineMarkdown(hMatch[2].trim())}</h${level}>`
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushParagraph();
      closeLists();
      htmlBlocks.push(
        `<blockquote class="border-l-4 border-[#2563eb] bg-blue-50/50 pl-4 py-2 my-3 italic text-slate-700">${formatInlineMarkdown(
          line.slice(2).trim()
        )}</blockquote>`
      );
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (inOl) {
        htmlBlocks.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        htmlBlocks.push('<ul>');
        inUl = true;
      }
      htmlBlocks.push(`<li>${formatInlineMarkdown(ulMatch[1].trim())}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (inUl) {
        htmlBlocks.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        htmlBlocks.push('<ol>');
        inOl = true;
      }
      htmlBlocks.push(`<li>${formatInlineMarkdown(olMatch[1].trim())}</li>`);
      continue;
    }

    // Raw HTML block line passthrough
    if (/^<(h[1-6]|div|p|ul|ol|li|table|blockquote|figure)\b/i.test(line)) {
      flushParagraph();
      closeLists();
      htmlBlocks.push(line);
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  closeLists();

  return htmlBlocks.join('\n');
}

export function stripMarkdownToPlainText(input: string): string {
  if (!input) return '';
  return htmlToMarkdown(input)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[#>*\-•\d.]+\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatSpecsToLines(specs?: Record<string, string>): string {
  if (!specs || Object.keys(specs).length === 0) {
    return [
      'Chất liệu: Nhựa PVC nguyên sinh 100%',
      'Độ dày phổ biến: 15 – 40 micron',
      'Khổ rộng cuộn: 80mm – 800mm',
    ].join('\n');
  }
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
}

export function parseSpecsFromInput(raw: string): Record<string, string> | undefined {
  if (!raw || !raw.trim()) return undefined;
  const trimmed = raw.trim();

  // Nếu người dùng vẫn dán JSON thì parse JSON
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // fallback sang parse theo dòng
    }
  }

  const result: Record<string, string> = {};
  const lines = trimmed.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    const clean = line.replace(/^[-*•]\s*/, '').trim();
    if (!clean) continue;
    const colonIdx = clean.indexOf(':');
    if (colonIdx > 0) {
      const key = clean.slice(0, colonIdx).replace(/[*_]/g, '').trim();
      const val = clean.slice(colonIdx + 1).trim();
      if (key && val) {
        result[key] = val;
      }
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

