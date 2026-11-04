import { NextRequest, NextResponse } from 'next/server';
import { getSupabasePublicClient, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * API KEEP-ALIVE CHỐNG NGỦ ĐÔNG (PAUSE) SUPABASE GÓI FREE SAU 7 NGÀY
 * - Gói Free của Supabase sẽ tạm dừng nếu không có truy vấn trong 7 ngày.
 * - Endpoint này chỉ thực hiện đúng 1 câu lệnh `SELECT id FROM site_settings LIMIT 1` (tốn < 50 bytes Egress).
 * - Có thể gọi tự động từ Vercel Cron (đã cấu hình trong `vercel.json`) hoặc từ `cron-job.org` 3 ngày/lần.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const queryKey = request.nextUrl.searchParams.get('key');
  const cronSecret = process.env.CRON_SECRET;

  // Nếu có cấu hình CRON_SECRET và request truyền sai key (trừ khi gọi từ Vercel Cron nội bộ)
  if (
    cronSecret &&
    queryKey &&
    queryKey !== cronSecret &&
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: 'demo',
      message: 'Supabase chưa được cấu hình biến môi trường (Đang chạy chế độ Demo).',
      timestamp: new Date().toISOString(),
    });
  }

  const supabase = getSupabasePublicClient();
  const start = Date.now();
  const { data, error } = await supabase!
    .from('site_settings')
    .select('id')
    .limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    supabaseAwake: true,
    latencyMs: Date.now() - start,
    recordsChecked: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}

