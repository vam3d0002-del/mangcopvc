/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';

const nextConfig = {
  images: {
    // Tắt Image Optimization của Vercel để KHÔNG tốn quota Fast Origin Transfer & Image Optimization
    // Vì ảnh đã được tự động nén sang chuẩn WebP (<150KB) ngay trên trình duyệt lúc Admin upload
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Proxy toàn bộ ảnh từ Supabase Storage qua Vercel Edge CDN (/media/...)
        // Giúp dùng 100GB Fast Data Transfer của Vercel để gánh thay cho 5GB Egress của Supabase Free!
        source: '/media/:path*',
        destination: `${supabaseUrl}/storage/v1/object/public/media/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Cache 1 năm trên cả Trình duyệt (max-age) và Vercel Edge CDN (s-maxage)
            value: 'public, max-age=31536000, s-maxage=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

