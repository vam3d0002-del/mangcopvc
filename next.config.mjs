/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';

const nextConfig = {
  images: {
    // Tắt Image Optimization của Vercel để KHÔNG tốn quota Fast Origin Transfer & Image Optimization
    // Vì ảnh đã được tự động nén sang chuẩn WebP (<150KB) ngay trên trình duyệt lúc Admin upload
    unoptimized: true,
  },
  async redirects() {
    return [
      // 1. Tin tức cũ (chuyển hướng sang bài viết chuẩn)
      {
        source: '/tintuc',
        destination: '/tin-tuc',
        permanent: true,
      },
      {
        source: '/tintuc/:slug.html',
        destination: '/tin-tuc/:slug',
        permanent: true,
      },
      {
        source: '/tintuc/:path*',
        destination: '/tin-tuc/:path*',
        permanent: true,
      },
      {
        source: '/tin-tuc.html',
        destination: '/tin-tuc',
        permanent: true,
      },
      {
        source: '/tin-tuc/:slug.html',
        destination: '/tin-tuc/:slug',
        permanent: true,
      },

      // 2. Trang tĩnh & Dịch vụ cũ
      {
        source: '/gioi-thieu.html',
        destination: '/gioi-thieu',
        permanent: true,
      },
      {
        source: '/gioi-thieu/:path*',
        destination: '/gioi-thieu',
        permanent: true,
      },
      {
        source: '/lien-he.html',
        destination: '/lien-he',
        permanent: true,
      },
      {
        source: '/bao-gia.html',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/san-pham.html',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/tuyen-dung.html',
        destination: '/gioi-thieu',
        permanent: true,
      },
      {
        source: '/dich-vu.html',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/dich-vu/:path*',
        destination: '/san-pham',
        permanent: true,
      },

      // 3. Máy móc & Dụng cụ đóng gói
      {
        source: '/may-in-date-nhiet-208.html',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/may-thoi-nhiet-kho-mang-co-209.html',
        destination: '/san-pham',
        permanent: true,
      },

      // 4. Màng PE & Quấn Pallet
      {
        source: '/mang-co-pe-192.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-co-pe-loc-193.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-co-pe-mang-pe-25',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-co-pet-195.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-co-pet-28',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang-194.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-pe-quan-pallet-197.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-pe-quan-pallet-197.html&p=5',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-pe-quan-pallet-198.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-pe-quan-pallet-199.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-quan-pallet-197.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-quan-pallet-198.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-quan-pallet-199.html',
        destination: '/mang-co-pe',
        permanent: true,
      },
      {
        source: '/mang-quan-pallet-29',
        destination: '/mang-co-pe',
        permanent: true,
      },

      // 5. Màng POF
      {
        source: '/mang-co-pof-27',
        destination: '/mang-co-pof',
        permanent: true,
      },
      {
        source: '/mang-co-pof-181.html',
        destination: '/mang-co-pof',
        permanent: true,
      },
      {
        source: '/mang-co-pof-183.html',
        destination: '/mang-co-pof',
        permanent: true,
      },
      {
        source: '/mang-co-pof-186.html',
        destination: '/mang-co-pof',
        permanent: true,
      },

      // 6. Màng PVC & Bọc Giỏ Quà
      {
        source: '/mang-co-pvc-26',
        destination: '/mang-co-pvc',
        permanent: true,
      },
      {
        source: '/mang-co-boc-gio-qua-tet-mang-co-boc-hop-qua-da-nang-184.html&p=2',
        destination: '/mang-co-pvc',
        permanent: true,
      },
      {
        source: '/mang-co-boc-gio-qua-tet-mang-co-boc-hop-qua-da-nang-184.html&p=5',
        destination: '/mang-co-pvc',
        permanent: true,
      },
      {
        source: '/mang-co-cuon-pvc-chuyen-dung-cho-in-30',
        destination: '/mang-co-pvc',
        permanent: true,
      },
      {
        source: '/mang-co-pvc-in-dang-cuon-190.html',
        destination: '/mang-co-pvc',
        permanent: true,
      },
      {
        source: '/mang-co-ep-182.html',
        destination: '/mang-co-pvc',
        permanent: true,
      },
      {
        source: '/in-mang-co-nhan-chai-187.html&p=1',
        destination: '/mang-co-pvc',
        permanent: true,
      },

      // 7. Xốp hơi & Túi khí chống sốc
      {
        source: '/xop-goi-hang-xop-bop-no-xop-khi-goi-hang-da-nang-203.html&p=4',
        destination: '/tin-tuc/dia-chi-ban-xop-hoi-boc-hang-tai-da-nang-165',
        permanent: true,
      },
      {
        source: '/mang-xop-hoi-xop-khi-xop-boc-hang-31',
        destination: '/tin-tuc/dia-chi-ban-xop-hoi-boc-hang-tai-da-nang-165',
        permanent: true,
      },
      {
        source: '/mang-xop-khi-goi-hang-xop-bop-no-xop-bong-bong-da-nang-202.html',
        destination: '/tin-tuc/mang-xop-hoi-xop-bop-no-xop-khi-xop-goi-hang-da-nang-quang-nam-154',
        permanent: true,
      },
      {
        source: '/mang-xop-khi-goi-hang-xop-bop-no-xop-bong-bong-da-nang-202.html&p=1',
        destination: '/tin-tuc/mang-xop-hoi-xop-bop-no-xop-khi-xop-goi-hang-da-nang-quang-nam-154',
        permanent: true,
      },

      // 8. Băng keo, Màng ép ly & Phụ kiện
      {
        source: '/bang-keo-hang-de-vo-34',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/bang-keo-hang-de-vo-da-nang-kiem-chu-in-truoc-nhan-lo-216.html',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/mang-ep-ly-nhua-32',
        destination: '/san-pham/cuon-mang-dan-ly-tra-sua',
        permanent: true,
      },
      {
        source: '/cuon-mang-ep-ly-tron-214.html&p=4',
        destination: '/san-pham/cuon-mang-dan-ly-tra-sua',
        permanent: true,
      },
      {
        source: '/phu-kien-nuoc-uong-dong-chai-33',
        destination: '/san-pham',
        permanent: true,
      },
      {
        source: '/yem-day-phu-kien-nganh-nuoc-uong-212.html&p=4',
        destination: '/san-pham',
        permanent: true,
      },

      // 9. Lưới lọc fallback cho các URL đuôi .html cũ ở trang chủ
      {
        source: '/:slug.html',
        destination: '/san-pham',
        permanent: true,
      },
    ];
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

