import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import JSZip from 'jszip';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import {
  dbGetCategories,
  dbGetInquiries,
  dbGetPosts,
  dbGetProducts,
  dbGetSiteSettings,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

async function listAllMediaFiles(supabase: ReturnType<typeof getSupabaseAdminClient>): Promise<string[]> {
  if (!supabase) return [];
  const filePaths: string[] = [];

  async function scanDirectory(prefix: string) {
    if (!supabase) return;
    const { data: items, error } = await supabase.storage.from('media').list(prefix, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error || !items) return;

    for (const item of items) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        // Thư mục con (ví dụ: categories/2026-11-03)
        await scanDirectory(fullPath);
      } else {
        filePaths.push(fullPath);
      }
    }
  }

  // Quét các thư mục lưu ảnh chính
  const mainFolders = ['categories', 'products', 'posts', 'banners', 'uploads'];
  for (const folder of mainFolders) {
    await scanDirectory(folder);
  }

  // Quét các file gốc nếu có
  const { data: rootItems } = await supabase.storage.from('media').list('', { limit: 1000 });
  if (rootItems) {
    for (const item of rootItems) {
      if (item.id !== null) {
        filePaths.push(item.name);
      }
    }
  }

  return Array.from(new Set(filePaths));
}

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: 'Bạn cần đăng nhập quyền Admin để tải bản sao lưu.' },
      { status: 401 }
    );
  }

  try {
    const zip = new JSZip();

    // 1. Thu thập toàn bộ 5 bảng Database
    const [siteSettings, categories, products, posts, inquiries] = await Promise.all([
      dbGetSiteSettings(),
      dbGetCategories(),
      dbGetProducts(),
      dbGetPosts(),
      dbGetInquiries(),
    ]);

    const databaseData = {
      site_settings: siteSettings,
      categories,
      products,
      posts,
      inquiries,
    };

    zip.file('database.json', JSON.stringify(databaseData, null, 2));

    // 2. Thu thập toàn bộ hình ảnh trong Supabase Storage
    let totalImages = 0;
    const supabase = getSupabaseAdminClient();
    if (supabase && isSupabaseConfigured()) {
      const allFiles = await listAllMediaFiles(supabase);
      totalImages = allFiles.length;

      // Tải và đóng gói từng ảnh vào thư mục media/
      for (const filePath of allFiles) {
        const { data: blob, error } = await supabase.storage.from('media').download(filePath);
        if (!error && blob) {
          const arrayBuffer = await blob.arrayBuffer();
          zip.file(`media/${filePath}`, Buffer.from(arrayBuffer));
        }
      }
    }

    // 3. Metadata bản sao lưu
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now).replace(/:/g, '-').replace(/ /g, '_');

    zip.file(
      'metadata.json',
      JSON.stringify(
        {
          project: 'mangcopvc-seo',
          backup_at: now.toISOString(),
          stats: {
            categories: categories.length,
            products: products.length,
            posts: posts.length,
            inquiries: inquiries.length,
            images: totalImages,
          },
        },
        null,
        2
      )
    );

    // 4. Nén file ZIP
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    const filename = `backup-mangcopvc-${dateStr}.zip`;

    return new Response(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `Lỗi tạo bản sao lưu: ${message}` },
      { status: 500 }
    );
  }
}

