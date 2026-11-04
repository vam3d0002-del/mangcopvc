import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import JSZip from 'jszip';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import {
  dbUpdateSiteSettings,
  dbUpsertCategory,
  dbUpsertPost,
  dbUpsertProduct,
} from '@/lib/db';
import { triggerOnDemandRevalidationAction } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

function getContentTypeByFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'webp':
      return 'image/webp';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'gif':
      return 'image/gif';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: 'Bạn cần đăng nhập quyền Admin để khôi phục dữ liệu.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: 'Vui lòng chọn file backup .zip cần khôi phục' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Kiểm tra và giải nén database.json
    const dbFile = zip.file('database.json');
    if (!dbFile) {
      return NextResponse.json(
        { ok: false, error: 'File sao lưu không hợp lệ (Không tìm thấy tệp database.json bên trong).' },
        { status: 400 }
      );
    }

    const dbText = await dbFile.async('text');
    const databaseData = JSON.parse(dbText);

    // 2. Khôi phục 5 bảng dữ liệu
    let restoredCategories = 0;
    let restoredProducts = 0;
    let restoredPosts = 0;

    if (databaseData.site_settings) {
      await dbUpdateSiteSettings(databaseData.site_settings);
    }

    if (Array.isArray(databaseData.categories)) {
      for (const cat of databaseData.categories) {
        await dbUpsertCategory(cat);
        restoredCategories++;
      }
    }

    if (Array.isArray(databaseData.products)) {
      for (const prod of databaseData.products) {
        await dbUpsertProduct(prod);
        restoredProducts++;
      }
    }

    if (Array.isArray(databaseData.posts)) {
      for (const post of databaseData.posts) {
        await dbUpsertPost(post);
        restoredPosts++;
      }
    }

    // 3. Khôi phục toàn bộ hình ảnh vào Supabase Storage
    let restoredImages = 0;
    const supabase = getSupabaseAdminClient();

    if (supabase && isSupabaseConfigured()) {
      const mediaFileEntries = Object.keys(zip.files).filter((name) => {
        return name.startsWith('media/') && !zip.files[name].dir;
      });

      for (const rawName of mediaFileEntries) {
        // Tách bỏ tiền tố 'media/' để lấy path trong bucket 'media'
        const storagePath = rawName.replace(/^media\//, '').trim();
        if (!storagePath) continue;

        const fileObj = zip.file(rawName);
        if (!fileObj) continue;

        const imgBuffer = await fileObj.async('nodebuffer');
        const contentType = getContentTypeByFileName(storagePath);

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storagePath, imgBuffer, {
            upsert: true,
            contentType,
            cacheControl: '31536000',
          });

        if (!uploadError) {
          restoredImages++;
        }
      }
    }

    // 4. Xóa cache CDN và làm mới toàn bộ website
    try {
      await triggerOnDemandRevalidationAction('all');
    } catch {
      // ignore
    }

    return NextResponse.json({
      ok: true,
      message: `Khôi phục thành công! Đã nạp lại ${restoredCategories} danh mục, ${restoredProducts} sản phẩm, ${restoredPosts} bài viết và ${restoredImages} tệp hình ảnh vào hệ thống!`,
      details: {
        categories: restoredCategories,
        products: restoredProducts,
        posts: restoredPosts,
        images: restoredImages,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `Lỗi khôi phục sao lưu: ${message}` },
      { status: 500 }
    );
  }
}

