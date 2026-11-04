import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if ((!supabaseUrl || !serviceKey) && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const [k, ...v] = line.trim().split('=');
    if (k === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = v.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (k === 'SUPABASE_SERVICE_ROLE_KEY') serviceKey = v.join('=').trim().replace(/^['"]|['"]$/g, '');
  }
}

const supabase = createClient(supabaseUrl, serviceKey);

const uploads = [
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/mang-co-ao-binh-20l-21l-19l-1.webp',
    storagePath: 'products/mang-co-ao-binh-20l.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-22/0baaf752-e02a-4fe2-a266-e2ce688c0ec0.webp',
    storagePath: 'products/mang-co-pof-cuon-gap-doi.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/mang-co-pof.webp',
    storagePath: 'products/tui-mang-co-pof-cat-san.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-25/0cbc3308-59cc-41a4-afa8-53d5a660b991.webp',
    storagePath: 'products/mang-co-pof-hop-my-pham.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-25/0deabf0b-73bc-4c73-9796-857c72fd66ea.webp',
    storagePath: 'products/mang-co-pe-boc-kien-hang.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-22/a21e2208-d594-4a58-90aa-ce5680818188.webp',
    storagePath: 'products/mang-co-pe-cuon-cong-nghiep.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/mang-co-loc-1.webp',
    storagePath: 'products/mang-co-nhiet-boc-loc-bia.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-25/00024032-9101-4ca4-b238-ee51e53baa2e.webp',
    storagePath: 'products/mang-co-boc-nen-nuoc-yen.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/in-mang-co-pvc.webp',
    storagePath: 'products/mang-co-cuon-in-ong-dong.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-25/60c99d7e-563c-49e9-b2d6-1e69ddcd42ac.webp',
    storagePath: 'products/mang-co-pet-nhan-than-chai.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/nap-binh.webp',
    storagePath: 'products/mang-co-seal-nap-binh-21l.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-22/86c75263-a3e4-4d66-b93e-6908b5659086.webp',
    storagePath: 'products/mang-pe-quan-pallet-cuon.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/may-kho-mang-co-cam-tay.webp',
    storagePath: 'products/may-kho-mang-co-cam-tay.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/legacy/mang-co-nap-chai.webp',
    storagePath: 'products/mang-co-seal-nap-chai.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-12/aaa0a0d0-6727-42be-921a-64592d23001f.webp',
    storagePath: 'products/mang-co-dong-loc-chai.webp'
  },
  {
    fromUrl: 'https://uvlqnvzulrmgjysboktg.supabase.co/storage/v1/object/public/products/catalog/2026-10-22/be67b732-b131-41c6-9b30-a2fa8a9de5d1.webp',
    storagePath: 'products/mang-co-in-toan-than-chai.webp'
  }
];

async function syncImages() {
  console.log('Bắt đầu tải và đồng bộ ảnh vào Supabase storage "media"...');
  for (const item of uploads) {
    try {
      console.log(`Đang tải: ${item.fromUrl} -> ${item.storagePath}`);
      const res = await fetch(item.fromUrl);
      if (!res.ok) {
        console.error(`Lỗi HTTP ${res.status} khi tải ${item.fromUrl}`);
        continue;
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage.from('media').upload(item.storagePath, buffer, {
        contentType: 'image/webp',
        cacheControl: 'max-age=31536000',
        upsert: true,
      });

      if (error) {
        console.error(`Lỗi upload Supabase cho ${item.storagePath}:`, error.message);
      } else {
        console.log(`=> Đã upload thành công: /media/${item.storagePath} (${buffer.length} bytes)`);
      }
    } catch (err) {
      console.error(`Lỗi xử lý ${item.storagePath}:`, err.message);
    }
  }
  console.log('Hoàn thành tải và upload ảnh!');
}

syncImages();

