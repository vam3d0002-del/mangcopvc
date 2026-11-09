-- ==============================================================================
-- SCHEMA MIGRATION: BẢNG LINKS & CỘT VIDEO / MẠNG XÃ HỘI
-- Hệ thống: Quản lý 4 liên kết Mạng Xã Hội (Header) & 2 Video Nhà Xưởng (Trang Chủ)
-- ==============================================================================

-- 1. Tạo bảng links nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS public.links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'social',
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Thêm dữ liệu mặc định 6 bản ghi (4 Social + 2 Video) nếu bảng chưa có dữ liệu
INSERT INTO public.links (id, title, url, type, description, updated_at)
VALUES
    ('facebook', 'Facebook Fanpage', 'https://facebook.com', 'social', 'Nút icon Facebook trên thanh đầu trang (Header)', NOW()),
    ('tiktok', 'Kênh TikTok Xưởng', 'https://tiktok.com', 'social', 'Nút icon TikTok trên thanh đầu trang (Header)', NOW()),
    ('youtube', 'Kênh YouTube Doanh Nghiệp', 'https://youtube.com', 'social', 'Nút icon YouTube trên thanh đầu trang (Header)', NOW()),
    ('twitter', 'Twitter / X', 'https://twitter.com', 'social', 'Nút icon Twitter/X trên thanh đầu trang (Header)', NOW()),
    ('video_intro', 'Video 1: Giới Thiệu Xưởng (Mục Về Chúng Tôi)', 'https://www.youtube.com/watch?v=lDzM8QeIuGs', 'video', 'Video giới thiệu xưởng sản xuất ở Mục 2 trên Trang Chủ', NOW()),
    ('video_factory', 'Video 2: Vận Hành Nhà Xưởng (Mục Quy Trình)', 'https://www.youtube.com/embed/lDzM8QeIuGs?si=6N-vPjF-LDRJ9N42', 'video', 'Khung video nhúng phát trực tiếp ở Mục 11 trên Trang Chủ', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Bổ sung các cột liên kết & video vào bảng site_settings (nếu tồn tại)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_settings') THEN
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT 'https://facebook.com';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT 'https://tiktok.com';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT 'https://youtube.com';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT 'https://twitter.com';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_intro_url TEXT DEFAULT 'https://www.youtube.com/watch?v=lDzM8QeIuGs';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_factory_url TEXT DEFAULT 'https://www.youtube.com/embed/lDzM8QeIuGs?si=6N-vPjF-LDRJ9N42';
    END IF;
END $$;

-- 4. Phân quyền Row Level Security (RLS) cho bảng links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép đọc công khai bảng links" ON public.links;
CREATE POLICY "Cho phép đọc công khai bảng links"
    ON public.links
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Cho phép Admin toàn quyền cập nhật bảng links" ON public.links;
CREATE POLICY "Cho phép Admin toàn quyền cập nhật bảng links"
    ON public.links
    FOR ALL
    USING (true);

