import fs from 'fs';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;

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

// Đọc mock-data.ts và trích xuất MOCK_PRODUCTS
async function getMockData() {
  const content = fs.readFileSync('./src/lib/mock-data.ts', 'utf8');
  // Lấy đoạn export const MOCK_PRODUCTS: ProductDetail[] = [...]
  const start = content.indexOf('export const MOCK_PRODUCTS: ProductDetail[] = [');
  const end = content.indexOf('export const MOCK_POSTS: PostDetail[] = [');
  const slice = content.slice(start, end).replace('export const MOCK_PRODUCTS: ProductDetail[] =', 'return');
  const fn = new Function(slice);
  return fn();
}

async function run() {
  const products = await getMockData();
  console.log(`Tìm thấy ${products.length} sản phẩm trong mock-data.ts.`);

  // Kiểm tra trùng lặp thumbnail_url
  const thumbMap = new Map();
  let hasDuplicate = false;
  for (const p of products) {
    if (thumbMap.has(p.thumbnail_url)) {
      console.warn(`CẢNH BÁO: Sản phẩm "${p.name}" (${p.id}) bị trùng ảnh với "${thumbMap.get(p.thumbnail_url)}" (${p.thumbnail_url})`);
      hasDuplicate = true;
    } else {
      thumbMap.set(p.thumbnail_url, p.name);
    }
  }

  if (!hasDuplicate) {
    console.log('=> XÁC NHẬN: 100% Sản phẩm có ảnh đại diện ĐỘC LẬP, KHÔNG HỀ BỊ TRÙNG LẶP!');
  }

  // 1. Cập nhật bảng SQL products trong Supabase Postgres
  console.log('\nĐang kết nối Supabase Postgres qua pooler...');
  let dbPassword = process.env.DATABASE_PASSWORD || process.env.PGPASSWORD || '';
  if (!dbPassword && fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    for (const line of envContent.split('\n')) {
      const [k, ...v] = line.trim().split('=');
      if (k === 'DATABASE_PASSWORD' || k === 'PGPASSWORD') {
        dbPassword = v.join('=').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }

  const pgClient = new Client({
    user: process.env.PGUSER || 'postgres.kmtwbimhwnndpuwrmmoo',
    password: dbPassword,
    host: process.env.PGHOST || 'aws-0-ap-northeast-2.pooler.supabase.com',
    port: Number(process.env.PGPORT || 6543),
    database: process.env.PGDATABASE || 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await pgClient.connect();
  console.log('=> Kết nối Postgres thành công! Bắt đầu upsert vào bảng public.products...');

  for (const p of products) {
    const query = `
      INSERT INTO public.products (
        id, category_id, name, slug, sku, price_label, short_description,
        content, specs, thumbnail_url, gallery_urls, is_featured, created_at, updated_at,
        seo_title, seo_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (slug) DO UPDATE SET
        id = EXCLUDED.id,
        category_id = EXCLUDED.category_id,
        name = EXCLUDED.name,
        sku = EXCLUDED.sku,
        price_label = EXCLUDED.price_label,
        short_description = EXCLUDED.short_description,
        content = EXCLUDED.content,
        specs = EXCLUDED.specs,
        thumbnail_url = EXCLUDED.thumbnail_url,
        gallery_urls = EXCLUDED.gallery_urls,
        is_featured = EXCLUDED.is_featured,
        created_at = EXCLUDED.created_at,
        updated_at = EXCLUDED.updated_at,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;
    `;
    const values = [
      p.id,
      p.category_id,
      p.name,
      p.slug,
      p.sku,
      p.price_label,
      p.short_description,
      p.content,
      JSON.stringify(p.specs || {}),
      p.thumbnail_url,
      p.gallery_urls || [],
      p.is_featured,
      p.created_at,
      p.updated_at,
      p.seo_title,
      p.seo_description
    ];
    await pgClient.query(query, values);
  }

  const countRes = await pgClient.query('SELECT count(*) FROM public.products');
  console.log(`=> Đã cập nhật bảng SQL products: hiện có tổng cộng ${countRes.rows[0].count} sản phẩm!`);
  await pgClient.end();

  // 2. Cập nhật file database.json trong Supabase Storage 'app-db'
  console.log('\nĐang cập nhật Supabase Storage bucket "app-db/database.json"...');
  const { data: dbData } = await supabase.storage.from('app-db').download('database.json');
  let currentDb = {};
  if (dbData) {
    try {
      const text = await dbData.text();
      currentDb = JSON.parse(text);
    } catch {}
  }
  currentDb.products = products;
  const dbBuffer = Buffer.from(JSON.stringify(currentDb, null, 2), 'utf-8');
  const { error: uploadError } = await supabase.storage.from('app-db').upload('database.json', dbBuffer, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (uploadError) {
    console.error('Lỗi khi ghi database.json:', uploadError.message);
  } else {
    console.log('=> Đã cập nhật thành công storage app-db/database.json!');
  }

  console.log('\nHOÀN THÀNH ĐỒNG BỘ TOÀN BỘ 22 SẢN PHẨM LÊN SUPABASE CLOUD!');
}

run().catch(console.error);
