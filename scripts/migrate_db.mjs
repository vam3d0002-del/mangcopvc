import fs from 'fs';
import pg from 'pg';

const { Client } = pg;

const schemaSql = fs.readFileSync('./supabase/schema.sql', 'utf8');

let dbPassword = process.env.PGPASSWORD || process.env.DATABASE_PASSWORD || '';
if (!dbPassword && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const [k, ...v] = line.trim().split('=');
    if (k === 'DATABASE_PASSWORD' || k === 'PGPASSWORD') {
      dbPassword = v.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

const client = new Client({
  user: process.env.PGUSER || 'postgres.kmtwbimhwnndpuwrmmoo',
  password: dbPassword,
  host: process.env.PGHOST || 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: Number(process.env.PGPORT || 6543),
  database: process.env.PGDATABASE || 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

async function run() {
  console.log('Đang kết nối tới Supabase Postgres (ap-northeast-2)...');
  await client.connect();
  console.log('=> Kết nối database thành công!');

  console.log('Đang thực thi mã schema.sql để tạo toàn bộ bảng và nạp dữ liệu...');
  await client.query(schemaSql);
  console.log('=> Thực thi schema.sql thành công 100%!');

  // Kiểm tra số lượng bản ghi các bảng vừa tạo
  const r1 = await client.query('SELECT count(*) FROM public.site_settings');
  const r2 = await client.query('SELECT count(*) FROM public.categories');
  const r3 = await client.query('SELECT count(*) FROM public.products');
  const r4 = await client.query('SELECT count(*) FROM public.posts');
  const r5 = await client.query('SELECT count(*) FROM public.inquiries');

  console.log('\n--- KẾT QUẢ KIỂM TRA BẢNG DATABASE SUPABASE ---');
  console.log(`1. site_settings: ${r1.rows[0].count} bản ghi`);
  console.log(`2. categories:    ${r2.rows[0].count} bản ghi`);
  console.log(`3. products:      ${r3.rows[0].count} bản ghi`);
  console.log(`4. posts:         ${r4.rows[0].count} bản ghi`);
  console.log(`5. inquiries:     ${r5.rows[0].count} bản ghi`);
  console.log('------------------------------------------------\n');

  await client.end();
}

run().catch((err) => {
  console.error('Lỗi khi chạy migration:', err);
  process.exit(1);
});
