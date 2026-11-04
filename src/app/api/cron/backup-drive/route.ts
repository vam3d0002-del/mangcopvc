import { NextRequest, NextResponse } from 'next/server';
import { dbGetSiteSettings, dbUpdateSiteSettings } from '@/lib/db';
import {
  generateFullBackupZipBuffer,
  uploadBackupToGoogleDrive,
} from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleBackupDrive(request);
}

export async function POST(request: NextRequest) {
  return handleBackupDrive(request);
}

async function handleBackupDrive(request: NextRequest) {
  // Xác thực cron token nếu cấu hình CRON_SECRET trên Vercel
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await dbGetSiteSettings();
    const config = settings.drive_backup_config;

    if (!config || !config.enabled) {
      return NextResponse.json({
        ok: true,
        message: 'Tự động sao lưu Google Drive đang ở trạng thái Tắt (disabled)',
      });
    }

    // Kiểm tra tần suất ngày (mặc định 5 ngày)
    const frequencyDays = config.frequency_days || 5;
    if (config.last_backup_at) {
      const lastDate = new Date(config.last_backup_at).getTime();
      const now = Date.now();
      const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);

      // Nếu được gọi từ cron tự động và chưa đủ số ngày cấu hình
      const isManual = request.nextUrl.searchParams.get('manual') === 'true';
      if (!isManual && diffDays < frequencyDays - 0.1) {
        return NextResponse.json({
          ok: true,
          message: `Chưa đến chu kỳ ${frequencyDays} ngày (Lần cuối sao lưu: ${config.last_backup_at}, cách đây: ${diffDays.toFixed(1)} ngày)`,
        });
      }
    }

    // Tiến hành tạo bản sao lưu ZIP gồm 5 bảng và toàn bộ ảnh
    const { zipBuffer, filename, stats } = await generateFullBackupZipBuffer();

    // Upload lên Google Drive
    const uploadRes = await uploadBackupToGoogleDrive(config, zipBuffer, filename);

    const nowIso = new Date().toISOString();
    const newConfig = {
      ...config,
      last_backup_at: nowIso,
      last_backup_status: uploadRes.ok ? 'success' : 'failed',
      last_backup_file: filename,
    };

    await dbUpdateSiteSettings({
      drive_backup_config: newConfig,
    });

    if (!uploadRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Upload lên Google Drive thất bại: ${uploadRes.error}`,
          file: filename,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Đã tự động sao lưu thành công lên Google Drive: ${filename}`,
      stats,
      fileUrl: uploadRes.fileUrl,
      time: nowIso,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `Lỗi trong tiến trình sao lưu định kỳ: ${message}` },
      { status: 500 }
    );
  }
}

