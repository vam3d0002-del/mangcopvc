-- ==============================================================================
-- SCRIPT TẠO BẢNG & ĐỒNG BỘ DỮ LIỆU ĐẦY ĐỦ TRÊN SUPABASE (POSTGRESQL)
-- Copy toàn bộ nội dung file này dán vào: Supabase Dashboard -> SQL Editor -> Bấm "Run"
-- ==============================================================================

-- 1. BẢNG CẤU HÌNH WEBSITE (public.site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  company_name TEXT NOT NULL DEFAULT 'CÔNG TY TNHH BAO BÌ THÀNH PHÁT',
  short_name TEXT NOT NULL DEFAULT 'Bao Bì Thành Phát',
  hotline TEXT NOT NULL DEFAULT '0935 909 747',
  zalo TEXT NOT NULL DEFAULT '0935909747',
  email TEXT NOT NULL DEFAULT 'caovanthinh2012@gmail.com',
  address TEXT NOT NULL DEFAULT '12 Hà Đông 2, Phường Thanh Khê, TP Đà Nẵng',
  seo_title TEXT NOT NULL DEFAULT 'Xưởng Sản Xuất Màng Co PVC, POF, PE | Bao Bì Thành Phát',
  seo_description TEXT NOT NULL DEFAULT 'Chuyên sản xuất và gia công màng co PVC dạng cuộn, túi cắt sẵn, màng co POF, PE, tem nhãn màng co chất lượng cao.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 2. BẢNG DANH MỤC DÒNG MÀNG (public.categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BẢNG SẢN PHẨM MÀNG CO (public.products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  price_label TEXT NOT NULL DEFAULT 'Liên hệ báo giá sỉ',
  short_description TEXT NOT NULL,
  content TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  thumbnail_url TEXT NOT NULL,
  gallery_urls TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- 4. BẢNG BÀI VIẾT BLOG SEO (public.posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category_name TEXT NOT NULL DEFAULT 'Màng Co PVC',
  reading_time INT NOT NULL DEFAULT 4,
  is_published BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published, created_at DESC);

-- 5. BẢNG YÊU CẦU BÁO GIÁ (public.inquiries)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  product_interest TEXT,
  quantity_note TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PHÂN QUYỀN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai (Public Read)
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read published products" ON public.products;
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read published posts" ON public.posts;
CREATE POLICY "Public read published posts" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read inquiries" ON public.inquiries;
CREATE POLICY "Public read inquiries" ON public.inquiries FOR SELECT USING (true);

-- Cho phép Service Role / Anon quản trị toàn quyền CRUD
DROP POLICY IF EXISTS "Admin all site_settings" ON public.site_settings;
CREATE POLICY "Admin all site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all categories" ON public.categories;
CREATE POLICY "Admin all categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all products" ON public.products;
CREATE POLICY "Admin all products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all posts" ON public.posts;
CREATE POLICY "Admin all posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all inquiries" ON public.inquiries;
CREATE POLICY "Admin all inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- NẠP DỮ LIỆU THỰC TẾ BAN ĐẦU VÀO CÁC BẢNG SUPABASE
-- ==============================================================================

-- 1. Site Settings (Lấy đúng tên công ty & địa chỉ mới nhất)
INSERT INTO public.site_settings (id, company_name, short_name, hotline, zalo, email, address, seo_title, seo_description)
VALUES (
  1,
  'CÔNG TY TNHH BAO BÌ THÀNH PHÁT',
  'Bao Bì Thành Phát',
  '0935 909 747',
  '0935909747',
  'caovanthinh2012@gmail.com',
  '12 Hà Đông 2, Phường Thanh Khê, TP Đà Nẵng',
  'Xưởng Sản Xuất Màng Co PVC, POF, PE | Bao Bì Thành Phát',
  'Cung cấp màng co PVC, màng co POF, màng co PE và màng co nhiệt cho đóng gói. Tư vấn chọn đúng loại màng, khổ và độ dày theo sản phẩm và máy co bạn đang dùng.'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  short_name = EXCLUDED.short_name,
  hotline = EXCLUDED.hotline,
  zalo = EXCLUDED.zalo,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();


-- 2. Nạp Categories (4 danh mục)
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES ('cat-pvc', 'Màng Co PVC', 'mang-co-pvc', 'Độ trong cao, cứng vừa, dễ co nhiệt — thường dùng cho hộp cứng, chai lọ, văn phòng phẩm, giỏ quà.', '/media/categories/mang-co-pvc.webp', 1)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES ('cat-pof', 'Màng Co POF', 'mang-co-pof', 'Mềm, dai, không mùi khi hàn — phù hợp thực phẩm, mỹ phẩm, dược phẩm và hàng xuất khẩu.', '/media/categories/mang-co-pof.webp', 2)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES ('cat-nhiet', 'Màng Co Nhiệt', 'mang-co-nhiet', 'Tổng hợp các giải pháp màng co nhiệt đóng gói công nghiệp, buồng co nhiệt và quy cách theo ngành hàng.', '/media/categories/mang-co-nhiet.webp', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES ('cat-pe', 'Màng Co PE', 'mang-co-pe', 'Dày, chịu lực kéo tốt — dùng bó lốc chai nước, lon nước giải khát, kiện hàng nặng và quấn pallet.', '/media/categories/mang-co-pe.webp', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- 3. Nạp Products (6 sản phẩm)
INSERT INTO public.products (id, category_id, name, slug, sku, price_label, short_description, content, specs, thumbnail_url, is_featured, is_published, seo_title, seo_description)
VALUES (
  'prod-1',
  'cat-pvc',
  'Màng Co PVC Dạng Cuộn Nguyên Sinh',
  'mang-co-pvc-dang-cuon-nguyen-sinh',
  'PVC-CUON-01',
  '38.000đ - 45.000đ / kg',
  'Màng co nhiệt PVC dạng cuộn ống hoặc xếp hông, độ dày từ 18 mic đến 50 mic, chuyên dùng cho máy bọc màng co tự động và bán tự động.',
  '
      <h2>Đặc điểm nổi bật của Màng Co PVC Dạng Cuộn</h2>
      <p><strong>Màng co PVC dạng cuộn</strong> được thổi trực tiếp từ hạt nhựa Polyvinyl Clorua (PVC) nguyên sinh kết hợp phụ gia tăng độ bóng và độ dẻo. Sản phẩm có độ trong suốt vượt trội, giúp tôn lên vẻ đẹp của bao bì hộp giấy, hộp mỹ phẩm, dược phẩm bên trong.</p>
      <h3>Ưu điểm khi đặt hàng tại xưởng</h3>
      <ul>
        <li><strong>Độ co rút đồng đều (45% - 53%):</strong> Co ôm sát góc cạnh sản phẩm chỉ sau 2-3 giây qua buồng nhiệt 130°C - 160°C.</li>
        <li><strong>Đa dạng khổ rộng:</strong> Sẵn kho các khổ từ 80mm đến 800mm (dạng ống đôi hoặc xẻ 1 bên).</li>
        <li><strong>Lõi giấy mỏng nhẹ:</strong> Cam kết trừ bì lõi chuẩn xác, giúp khách hàng tối ưu chi phí trên từng mét màng.</li>
      </ul>
      <h3>Ứng dụng thực tế</h3>
      <p>Phù hợp bọc hộp trà, hộp cà phê, hộp mỹ phẩm, sách vở, linh kiện điện tử, thanh nhôm định hình và đồ gỗ nội thất.</p>
    ',
  '{"Chất liệu":"Nhựa PVC nguyên sinh 100%","Độ dày phổ biến":"15 – 40 micron (µm)","Khổ rộng cuộn":"80mm – 800mm (Cắt theo yêu cầu)","Nhiệt độ co tiêu chuẩn":"130°C – 160°C","Tỷ lệ co ngang / dọc":"40% – 55%","Quy cách đóng gói":"15kg – 25kg / cuộn"}'::jsonb,
  '/media/products/mang-co-pvc-cuon.webp',
  TRUE,
  TRUE,
  'Màng Co PVC Dạng Cuộn Giá Sỉ Tận Xưởng - Đủ Khổ 8cm Đến 80cm',
  'Cung cấp màng co PVC dạng cuộn nguyên sinh trong suốt, độ dày 15-40 mic, giá sỉ tận xưởng. Cắt khổ theo yêu cầu, giao hàng nhanh toàn quốc.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  price_label = EXCLUDED.price_label,
  short_description = EXCLUDED.short_description,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_featured = EXCLUDED.is_featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.products (id, category_id, name, slug, sku, price_label, short_description, content, specs, thumbnail_url, is_featured, is_published, seo_title, seo_description)
VALUES (
  'prod-2',
  'cat-pvc',
  'Túi Màng Co PVC Cắt Ép Ngang / Ép Cong Theo Mẫu',
  'tui-mang-co-pvc-cat-san-theo-kich-thuoc',
  'PVC-TUI-02',
  '42.000đ - 49.000đ / kg',
  'Túi màng co PVC ép đáy thẳng hoặc ép cong vòng cung (dùng cho giỏ quà Tết, hộp yến, hộp mỹ phẩm), tiện lợi chỉ cần lồng hộp vào và khò nhiệt.',
  '
      <h2>Túi Màng Co PVC Cắt Sẵn – Giải pháp đóng gói siêu tốc</h2>
      <p>Không cần đầu tư máy cắt hàn phức tạp, với <strong>túi màng co PVC cắt sẵn</strong>, nhân công chỉ cần bỏ hộp sản phẩm vào túi và dùng súng khò nhiệt cầm tay hoặc cho chạy qua buồng co nhiệt mini là hoàn tất.</p>
      <h3>Các kiểu gia công túi tại xưởng</h3>
      <ul>
        <li><strong>Túi ép ngang đáy thẳng:</strong> Chuyên bọc hộp chữ nhật, hộp thuốc, hộp kem dưỡng da, lốc sản phẩm khuyến mãi.</li>
        <li><strong>Túi màng co ép cong (Bán nguyệt):</strong> Thiết kế ôm trọn các hộp tròn, hộp yến sào, giỏ quà Tết mà không bị dư góc nhọn ("tai mèo").</li>
        <li><strong>Đục lỗ thoát khí siêu nhỏ:</strong> Giúp không khí thoát ra tức thì khi gặp nhiệt, bề mặt căng bóng không bị phồng rộp.</li>
      </ul>
    ',
  '{"Kiểu túi":"Hàn đáy thẳng / Hàn cong vòng cung / Hở 2 đầu","Độ dày":"18 mic – 35 mic","Kích thước":"Gia công chính xác từng milimet theo mẫu hộp","Đục lỗ thoát hơi":"Có (Theo yêu cầu miễn phí)","Số lượng đặt tối thiểu":"Từ 10kg / quy cách"}'::jsonb,
  '/media/products/tui-mang-co-pvc-cat-san.webp',
  TRUE,
  TRUE,
  'Túi Màng Co PVC Cắt Sẵn Ép Đáy Thẳng & Ép Cong Theo Yêu Cầu',
  'Xưởng gia công cắt túi màng co PVC bọc hộp mỹ phẩm, hộp trà, giỏ quà Tết, hộp yến sào. Đường hàn chắc chắn, đục lỗ thoát khí miễn phí.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  price_label = EXCLUDED.price_label,
  short_description = EXCLUDED.short_description,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_featured = EXCLUDED.is_featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.products (id, category_id, name, slug, sku, price_label, short_description, content, specs, thumbnail_url, is_featured, is_published, seo_title, seo_description)
VALUES (
  'prod-3',
  'cat-pof',
  'Màng Co Nhiệt POF 5 Lớp An Toàn Thực Phẩm',
  'mang-co-nhiet-pof-da-lop-an-toan-thuc-pham',
  'POF-5LOP-03',
  '62.000đ - 70.000đ / kg',
  'Màng co POF (Polyolefin) 5 lớp siêu dai, mỏng nhẹ (12-25 mic), không mùi, không độc hại, đạt chứng nhận tiếp xúc thực phẩm trực tiếp.',
  '
      <h2>Tại sao các thương hiệu thực phẩm chuyển sang dùng Màng Co POF?</h2>
      <p><strong>Màng co POF (Polyolefin Shrink Film)</strong> được cấu tạo từ 5 lớp nhựa PP và PE đồng đùn. Khác với màng PVC, màng POF hoàn toàn không chứa chất hóa dẻo độc hại, không sinh khí mùi khi hàn cắt và giữ được độ mềm dẻo ngay cả trong môi trường kho đông lạnh -40°C.</p>
      <h3>Lợi ích kinh tế vượt trội</h3>
      <p>Do tỷ trọng nhẹ (0.92 g/cm³ so với 1.38 g/cm³ của PVC) và độ dày chỉ cần 15 mic là đã bền hơn màng PVC 25 mic, <strong>1kg màng POF cho diện tích bọc nhiều hơn gấp 2 lần so với 1kg màng PVC</strong>, giúp tiết kiệm chi phí thực tế trên từng đơn vị sản phẩm.</p>
    ',
  '{"Cấu trúc":"5 lớp đồng đùn (PP/PE/LLDPE)","Độ dày chuẩn":"12 mic, 15 mic, 19 mic, 25 mic","Dạng thành phẩm":"Cuộn màng đôi (Centerfold) / Màng đơn / Túi cắt sẵn","Tỷ lệ co":"60% – 68% cả chiều dọc và ngang","Tiêu chuẩn an toàn":"FDA, RoHS, ISO 9001"}'::jsonb,
  '/media/products/mang-co-pof-5-lop.webp',
  TRUE,
  TRUE,
  'Màng Co POF Thực Phẩm (12mic, 15mic, 19mic) Nhập Khẩu & Gia Công',
  'Chuyên phân phối và cắt túi màng co nhiệt POF 5 lớp bọc mì ly, bánh kẹo, thực phẩm xuất khẩu. Có đầy đủ giấy chứng nhận ATVSTP.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  price_label = EXCLUDED.price_label,
  short_description = EXCLUDED.short_description,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_featured = EXCLUDED.is_featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.products (id, category_id, name, slug, sku, price_label, short_description, content, specs, thumbnail_url, is_featured, is_published, seo_title, seo_description)
VALUES (
  'prod-4',
  'cat-pe',
  'Màng Co Nhiệt PE Quấn Lốc Chai Nước & Đồ Uống',
  'mang-co-nhiet-pe-quan-loc-chai-nuoc',
  'PE-LOC-04',
  '39.000đ - 44.000đ / kg',
  'Màng co nhiệt PE độ dày cao (40 mic - 120 mic), chịu tải trọng nặng từ 5kg - 30kg, chuyên dùng đóng lốc 6 chai, 12 chai, 24 lon nước giải khát.',
  '
      <h2>Màng Co Nhiệt PE – Chịu lực căng kéo & va đập cực cao</h2>
      <p>Đối với các sản phẩm có trọng lượng lớn như lốc 6 chai nước suối 1.5L, lốc bia lon, nước ngọt hay gạch men, màng PVC hoặc POF mỏng không thể chịu lực khi bốc xếp. <strong>Màng co nhiệt LDPE</strong> với độ dẻo dai và độ dày từ 40 mic đến 120 mic là giải pháp tối ưu thay thế thùng giấy carton.</p>
    ',
  '{"Chất liệu":"LDPE nguyên sinh pha phụ gia tăng dai","Độ dày":"40 mic – 120 mic","Khả năng chịu tải":"5kg – 35kg / lốc","Màu sắc":"Trắng trong hoặc in logo thương hiệu 1-4 màu"}'::jsonb,
  '/media/products/mang-co-pe-quan-loc.webp',
  TRUE,
  TRUE,
  'Màng Co Nhiệt PE Đóng Lốc Nước Suối, Bia, Nước Ngọt Chịu Lực Cao',
  'Sản xuất màng co nhiệt PE quấn lốc chai nước, thùng bia, vật liệu xây dựng. Độ dẻo dai cao, bám sát lốc chai, giá xuất xưởng.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  price_label = EXCLUDED.price_label,
  short_description = EXCLUDED.short_description,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_featured = EXCLUDED.is_featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.products (id, category_id, name, slug, sku, price_label, short_description, content, specs, thumbnail_url, is_featured, is_published, seo_title, seo_description)
VALUES (
  'prod-5',
  'cat-pvc',
  'Màng Co Áo Bình Nước Suối 20L - 21L & Màng Co Nắp Vòi',
  'tem-nhan-mang-co-in-ong-dong-seal-nap-chai',
  'PVC-IN-05',
  'Báo giá theo mẫu thiết kế',
  'Màng co áo thân bình nước lọc 20L/21L, màng co nắp vòi in ống đồng sắc nét kèm đường răng cưa xé mở tiện lợi.',
  '
      <h2>Nâng tầm thương hiệu với Tem Nhãn Màng Co In Ống Đồng & Áo Bình 20L</h2>
      <p>Chúng tôi cung cấp dịch vụ trọn gói từ khâu thiết kế bình trục, khắc trục ống đồng, in màng co từ 1 đến 8 màu, dán ống tự động và cắt rời từng con nhãn hoặc giao dạng cuộn cho máy phóng nhãn tự động.</p>
    ',
  '{"Công nghệ in":"In ống đồng 1 – 8 màu tốc độ cao","Chất liệu màng":"PVC in hoặc PETG cao cấp","Gia công đi kèm":"Đườngằn răng cưa (Perforation) mở nắp nhanh","Hình thức giao":"Dạng cuộn phóng nhãn máy hoặc cắt rời từng tem"}'::jsonb,
  '/media/products/tem-nhan-mang-co-in.webp',
  FALSE,
  TRUE,
  'In Tem Nhãn Màng Co Chai Nước, Màng Co Áo Bình 20L Sắc Nét',
  'Nhận in tem nhãn màng co PVC, PETG, màng co nắp chai, màng co vòi bình nước 20L bằng công nghệ trục ống đồng hiện đại.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  price_label = EXCLUDED.price_label,
  short_description = EXCLUDED.short_description,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_featured = EXCLUDED.is_featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.products (id, category_id, name, slug, sku, price_label, short_description, content, specs, thumbnail_url, is_featured, is_published, seo_title, seo_description)
VALUES (
  'prod-6',
  'cat-pvc',
  'Túi Màng Co PVC Bọc Giỏ Quà Tết & Hộp Quà Cao Cấp',
  'mang-co-pvc-boc-gio-qua-tet-hop-qua',
  'PVC-TET-06',
  '43.000đ - 48.000đ / kg',
  'Túi màng co PVC khổ lớn ép cong đầu chuyên dụng bọc giỏ quà Tết, giữ cố định chai rượu, hộp bánh kẹo chắc chắn và sáng bóng sang trọng.',
  '
      <h2>Giải pháp đóng gói Giỏ Quà Tết chuyên nghiệp</h2>
      <p>Túi màng co PVC bọc giỏ quà Tết giúp cố định toàn bộ vật phẩm trong giỏ không bị xô lệch khi vận chuyển đi xa, đồng thời lớp màng căng bóng như kính giúp giỏ quà trông sang trọng và bắt mắt hơn gấp nhiều lần.</p>
    ',
  '{"Kích thước thông dụng":"45x60cm, 50x70cm, 55x75cm, 60x80cm, 70x90cm","Độ dày khuyên dùng":"30 mic – 40 mic (Đảm bảo độ căng cứng)","Kiểu dáng":"Túi ép cong vòng cung trên đỉnh giỏ quà"}'::jsonb,
  '/media/products/mang-co-boc-gio-qua-tet.webp',
  TRUE,
  TRUE,
  'Túi Màng Co Bọc Giỏ Quà Tết Đủ Kích Thước Có Sẵn Giao Ngay',
  'Chuyên sỉ lẻ túi màng co PVC bọc giỏ quà Tết ép cong đầu các size 50x70, 60x80, 70x90. Màng dày dặn, trong suốt, dễ khò nhiệt.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  price_label = EXCLUDED.price_label,
  short_description = EXCLUDED.short_description,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_featured = EXCLUDED.is_featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();

-- 4. Nạp Posts (23 bài viết SEO)
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-1',
  'Vì Sao Nên Đặt Màng Bọc Giỏ Quà Tết Sớm? | Cao Vạn Thịnh',
  'dat-mang-boc-gio-qua-tet-som',
  'Từ tháng 10–11 âm lịch mỗi năm, nhu cầu túi màng co PVC ép cong bọc giỏ quà Tết tăng đột biến. Đặt sớm giúp chủ động khổ túi, độ dày chuẩn và giá sỉ tốt nhất.',
  '
      <h2>1. Vì sao nên đặt túi màng co bọc giỏ quà Tết sớm?</h2>
      <p>Vào giai đoạn cận Tết Nguyên Đán, các đơn vị đóng gói quà tặng doanh nghiệp, siêu thị và cửa hàng bánh kẹo đều đồng loạt tăng công suất. Việc đặt <strong>màng bọc giỏ quà Tết</strong> từ sớm giúp bạn:</p>
      <ul>
        <li><strong>Chủ động kích thước riêng:</strong> Cắt chuẩn theo mẫu khay gỗ, giỏ mây hoặc hộp quà đặc thù (45x60cm, 50x70cm, 60x80cm, 70x90cm).</li>
        <li><strong>Đường hàn ép cong thẩm mỹ:</strong> Khi khò nhiệt không bị dư hai góc nhọn ("tai mèo") trên đỉnh giỏ quà.</li>
        <li><strong>Ổn định giá nguyên liệu:</strong> Tránh biến động giá hạt nhựa và tình trạng quá tải lịch chạy máy cuối năm.</li>
      </ul>
      <h2>2. Độ dày màng co PVC khuyên dùng cho giỏ quà</h2>
      <p>Với giỏ quà có nhiều chai rượu nặng và góc cạnh sắc, nên chọn màng co PVC độ dày từ <strong>30 mic đến 40 mic</strong> để màng căng cứng, nâng đỡ toàn bộ vật phẩm bên trong không bị xô lệch khi vận chuyển.</p>
    ',
  '/media/products/post-gio-qua-tet.webp',
  'Màng Co PVC',
  4,
  TRUE,
  'Vì Sao Nên Đặt Màng Bọc Giỏ Quà Tết Sớm? | Cao Vạn Thịnh',
  'Kinh nghiệm đặt túi màng co PVC bọc giỏ quà Tết sớm giúp chủ động kích thước ép cong, độ dày chuẩn 30-40 mic và tránh thiếu hàng mùa cao điểm.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-2',
  'Màng Co Bọc Móc Áo — Giải Pháp Đóng Gói',
  'mang-co-boc-moc-ao',
  'Sử dụng túi màng co PVC bọc lốc 10 chiếc móc áo nhôm, móc nhựa hoặc móc gỗ giúp chống trầy xước, chống bung và định hình kiện hàng chuyên nghiệp.',
  '
      <h2>Ưu điểm khi dùng màng co PVC bọc lốc móc áo</h2>
      <p>Các xưởng sản xuất móc nhôm, móc nhựa và móc gỗ thường đóng từng bó 10 cái. Thay vì quấn dây thun dễ bung và trầy xước, <strong>màng co PVC bọc móc áo</strong> giúp cố định chặt phần thân móc, giữ lớp xi mạ sáng bóng và nâng cao giá trị sản phẩm khi trưng bày tại siêu thị.</p>
      <h2>Quy cách phổ biến</h2>
      <ul>
        <li><strong>Khổ màng:</strong> 22cm – 30cm (hoặc cắt túi ép xéo theo dáng vai móc).</li>
        <li><strong>Độ dày:</strong> 25 mic – 30 mic để chịu được đầu móc kim loại không bị thủng.</li>
      </ul>
    ',
  '/media/products/post-moc-ao.webp',
  'Màng Co PVC',
  4,
  TRUE,
  'Màng Co Bọc Móc Áo — Giải Pháp Đóng Gói',
  'Giải pháp đóng gói lốc 10 móc áo bằng màng co nhiệt PVC gọn đẹp, chống trầy xước, định hình chắc chắn cho xưởng sản xuất móc áo.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-3',
  'So Sánh Màng Co PVC, PE, OPS, PET – Nên Chọn Loại Nào?',
  'so-sanh-mang-co-pvc-pe-ops-pet',
  'Phân tích chi tiết đặc tính kỹ thuật, tỷ lệ co rút, độ trong suốt và chi phí giữa 4 dòng màng co công nghiệp phổ biến: PVC, PE, OPS và PETG.',
  '
      <h2>Tổng quan 4 loại màng co nhiệt phổ biến hiện nay</h2>
      <p>Mỗi chất liệu nhựa nhiệt dẻo có tỷ lệ co ngang/dọc và mức chi phí rất khác nhau:</p>
      <ul>
        <li><strong>Màng co PVC:</strong> Giá thành hợp lý nhất, dễ co nhiệt bằng cả máy khò cầm tay lẫn buồng nhiệt, rất phổ biến cho hộp cứng và tem nhãn chai nước.</li>
        <li><strong>Màng co PE:</strong> Độ dày lớn (40–120 mic), chuyên chịu tải nặng cho lốc nước ngọt, bia, kiện hàng công nghiệp.</li>
        <li><strong>Màng co OPS & PETG:</strong> Tỷ lệ co ngang rất cao (lên tới 70–75%), chuyên dùng làm nhãn in ống đồng cho các loại chai có đường cong phức tạp.</li>
      </ul>
    ',
  '/media/products/post-so-sanh-pvc-pe-ops-pet.webp',
  'Màng Co PVC',
  5,
  TRUE,
  'So Sánh Màng Co PVC, PE, OPS, PET – Nên Chọn Loại Nào?',
  'Bảng so sánh chi tiết màng co PVC, PE, OPS và PET về tỷ lệ co nhiệt, độ trong, ứng dụng in nhãn và tối ưu chi phí cho doanh nghiệp.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-4',
  'Bọc Màng Co PVC Theo Yêu Cầu Cho Khăn, Vải, Đồ Handmade',
  'boc-mang-co-pvc-theo-yeu-cau',
  'Hướng dẫn chi tiết các thông số cần chuẩn bị (kích thước Dài x Rộng x Cao, loại máy đóng gói, số lượng dự kiến) để đặt cắt màng co PVC chuẩn xác ngay từ lần đầu.',
  '
      <h2>3 thông tin cần chuẩn bị khi đặt màng co PVC theo yêu cầu</h2>
      <ol>
        <li><strong>Kích thước thực tế của sản phẩm:</strong> Đo chính xác Chiều Dài x Chiều Rộng x Chiều Cao (với hộp chữ nhật) hoặc Đường kính x Chiều cao (với chai lọ tròn).</li>
        <li><strong>Thiết bị đóng gói hiện có:</strong> Bạn đang dùng máy khò nhiệt cầm tay, máy hàn cắt chữ L bán tự động hay buồng co nhiệt tự động?</li>
        <li><strong>Yêu cầu đặc biệt:</strong> Có cần đục lỗ thoát khí, ép cong vòng cung hay xẻ rãnh răng cưa dễ bóc hay không?</li>
      </ol>
    ',
  '/media/products/post-boc-mang-co-pvc-theo-yeu-cau.webp',
  'Màng Co PVC',
  4,
  TRUE,
  'Bọc Màng Co PVC Theo Yêu Cầu Cho Khăn, Vải, Đồ Handmade',
  'Hướng dẫn quy trình đặt sản xuất cuộn và cắt túi màng co PVC theo yêu cầu riêng của doanh nghiệp, chuẩn kích thước không lo nhăn góc.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-5',
  'Quy Trình Đóng Gói Hộp Sản Phẩm Bằng Màng Co PVC Từ A Đến Z',
  'quy-trinh-dong-goi-hop-bang-mang-co-pvc',
  'Các bước chuẩn bị túi màng co, lồng hộp, hàn kín miệng và điều chỉnh nhiệt độ buồng co để bề mặt hộp mỹ phẩm, dược phẩm căng bóng như gương.',
  '
      <h2>4 bước đóng gói hộp bằng màng co PVC đạt độ thẩm mỹ cao nhất</h2>
      <ul>
        <li><strong>Bước 1:</strong> Chọn khổ màng lớn hơn Chu vi chia đôi khoảng 10–15mm để thao tác lồng hộp nhanh.</li>
        <li><strong>Bước 2:</strong> Hàn kín miệng túi bằng máy hàn dập tay hoặc máy cắt chữ L.</li>
        <li><strong>Bước 3:</strong> Đảm bảo túi có lỗ thoát hơi nhỏ ở cạnh hông để không bị phồng bong bóng khí.</li>
        <li><strong>Bước 4:</strong> Đưa qua buồng nhiệt 130°C – 160°C trong 2–4 giây hoặc khò đều từ các góc trước rồi mới lướt qua mặt phẳng lớn.</li>
      </ul>
    ',
  '/media/products/mang-co-pvc-cuon.webp',
  'Màng Co PVC',
  5,
  TRUE,
  'Quy Trình Đóng Gói Hộp Sản Phẩm Bằng Màng Co PVC Chuẩn Đẹp',
  'Hướng dẫn từ A đến Z kỹ thuật bọc màng co PVC cho hộp giấy, hộp mỹ phẩm không bị nhăn góc hay rách đường hàn.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-6',
  'Giải Pháp Đóng Gói Tiết Kiệm Với Màng Co PVC Cho Xưởng Sản Xuất Vừa Và Nhỏ',
  'giai-phap-dong-goi-tiet-kiem-mang-co-pvc',
  'Làm sao tối ưu số cái túi trên mỗi kg màng co PVC? Bí quyết chọn đúng độ dày micron và khổ màng vừa khít giúp giảm 15-20% chi phí bao bì.',
  '
      <h2>Cách giảm 15–20% chi phí màng co cho xưởng vừa và nhỏ</h2>
      <p>Nhiều cơ sở sản xuất thường chọn màng quá dày hoặc dư chiều dài cắt không cần thiết. Chỉ cần giảm độ dày từ 30 mic xuống 22–25 mic cho các loại hộp giấy nhẹ dưới 300g, số lượng túi thu được trên mỗi kg màng sẽ tăng thêm tới 20% mà vẫn đảm bảo độ căng bóng và chống bụi ẩm tuyệt đối.</p>
    ',
  '/media/products/mang-co-pof-5-lop.webp',
  'Màng Co PVC',
  4,
  TRUE,
  'Giải Pháp Đóng Gói Tiết Kiệm Với Màng Co PVC Cho Xưởng Sản Xuất',
  'Bí quyết tối ưu độ dày và khổ túi màng co PVC giúp tiết kiệm 15-20% chi phí đóng gói cho các xưởng sản xuất vừa và nhỏ.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-7',
  'Ứng Dụng Túi Màng Co PVC Trong Đời Sống & Sản Xuất Hàng Tiêu Dùng',
  'ung-dung-tui-mang-co-pvc-trong-doi-song',
  'Điểm danh những ứng dụng phổ biến nhất của túi màng co PVC: từ bọc hộp mỹ phẩm, sách vở, nến thơm, xà phòng handmade đến linh kiện điện tử.',
  '
      <h2>Túi màng co PVC hiện diện ở đâu?</h2>
      <p>Nhờ sự tiện lợi chỉ cần một máy sấy nhiệt cầm tay là có thể đóng gói ngay tại nhà hoặc cửa hàng, túi màng co PVC được ứng dụng rộng rãi cho hộp kem body, nước hoa, sách truyện, bộ bài boardgame, nến thơm, hộp trà biếu và điều khiển tivi.</p>
    ',
  '/media/products/tui-mang-co-pvc-cat-san.webp',
  'Màng Co PVC',
  3,
  TRUE,
  'Ứng Dụng Túi Màng Co PVC Trong Đời Sống & Sản Xuất Tiêu Dùng',
  'Khám phá các ứng dụng thực tế của túi màng co nhiệt PVC cắt sẵn trong đóng gói mỹ phẩm, quà tặng, văn phòng phẩm và gia dụng.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pvc-8',
  'Màng Co PVC Bọc Bánh Kẹo, Thực Phẩm Khô: Lưu Ý Quan Trọng Khi Sử Dụng',
  'mang-co-pvc-boc-banh-keo-thuc-pham-kho',
  'Khi nào được dùng màng co PVC cho ngành bánh kẹo, trà, cà phê? Nguyên tắc chỉ bọc bên ngoài vỏ hộp/hũ đã kín và không tiếp xúc trực tiếp với thực phẩm.',
  '
      <h2>Nguyên tắc an toàn khi dùng màng co PVC cho bánh kẹo, trà, cà phê</h2>
      <p>Màng co PVC có ưu điểm tạo form cứng cáp, bóng đẹp và chống ẩm mốc rất tốt cho <strong>bên ngoài vỏ hộp giấy, lon thiếc, hũ nhựa hoặc lọ thủy tinh</strong> đựng bánh quy, hạt điều, trà, cà phê, yến sào. Tuy nhiên, nếu cần bọc tiếp xúc trực tiếp với thực phẩm hoặc hàng xuất khẩu, doanh nghiệp nên chuyển sang dùng <strong>màng co POF</strong> đạt chuẩn FDA.</p>
    ',
  '/media/products/mang-co-boc-gio-qua-tet.webp',
  'Màng Co PVC',
  4,
  TRUE,
  'Màng Co PVC Bọc Hộp Bánh Kẹo, Thực Phẩm Khô & Lưu Ý An Toàn',
  'Hướng dẫn sử dụng màng co PVC bọc ngoài hộp bánh kẹo, hũ hạt khô, hộp trà cà phê đúng chuẩn thẩm mỹ và an toàn.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-1',
  'Chuyển Từ Màng Co PVC Sang POF: Câu Hỏi Doanh Nghiệp Hay Thắc Mắc | Cao Vạn Thịnh',
  'chuyen-tu-mang-co-pvc-sang-pof',
  'Nhiều doanh nghiệp muốn nâng cấp từ màng PVC sang màng POF không mùi, an toàn thực phẩm. Đây là cách điều chỉnh nhiệt độ buồng co và dao hàn.',
  '
      <h2>Những thay đổi kỹ thuật khi chuyển từ PVC sang POF</h2>
      <ul>
        <li><strong>Nhiệt độ buồng co:</strong> Màng POF cần nhiệt độ cao hơn một chút (khoảng 160°C – 190°C so với 130°C – 160°C của PVC) và luồng gió tuần hoàn đều trong buồng co.</li>
        <li><strong>Kim đục lỗ thoát hơi:</strong> Vì màng POF rất kín và dai, bắt buộc phải có bánh răng châm lỗ thoát khí siêu nhỏ (micro-perforation) trên máy bọc để màng không bị phồng hơi.</li>
        <li><strong>Giảm độ dày tương đương:</strong> Nếu đang dùng PVC 25 mic, bạn chỉ cần chuyển sang POF 15 mic là đã đạt độ bền xé cao hơn.</li>
      </ul>
    ',
  '/media/products/post-chuyen-tu-pvc-sang-pof.webp',
  'Màng Co POF',
  5,
  TRUE,
  'Chuyển Từ Màng Co PVC Sang POF: Câu Hỏi Doanh Nghiệp Hay Thắc Mắc | Cao Vạn Thịnh',
  'Hướng dẫn kỹ thuật chuyển đổi từ màng co PVC sang màng co POF trên dây chuyền đóng gói: cách chỉnh nhiệt độ, tốc độ băng tải và chọn độ dày.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-2',
  'Màng Co POF Có Tái Chế Được Không? Giải Đáp Thắc Mắc Về Môi Trường | Cao Vạn Thịnh',
  'mang-co-pof-co-tai-che-duoc-khong',
  'Tìm hiểu cấu tạo Polyolefin (PP/PE) thân thiện môi trường, khả năng tái chế 100% và lý do các thị trường Mỹ, EU, Nhật Bản yêu cầu bao bì POF.',
  '
      <h2>Khả năng tái chế của màng co POF</h2>
      <p>Màng co POF được cấu tạo từ Polypropylene (PP) và Polyethylene (PE) thuộc nhóm nhựa số 4/5 hoàn toàn không chứa gốc Clo. Do đó, màng POF <strong>có thể tái chế 100%</strong>, không phát sinh khí Dioxin hay HCl khi xử lý nhiệt, đáp ứng tiêu chuẩn RoHS và REACH khi xuất khẩu sang Châu Âu, Mỹ và Nhật Bản.</p>
    ',
  '/media/products/post-pof-tai-che.webp',
  'Màng Co POF',
  4,
  TRUE,
  'Màng Co POF Có Tái Chế Được Không? Giải Đáp Thắc Mắc Về Môi Trường | Cao Vạn Thịnh',
  'Giải đáp khả năng tái chế và tính thân thiện môi trường của màng co nhiệt POF đối với doanh nghiệp sản xuất hàng xuất khẩu.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-3',
  'Màng Co POF Cho Ngành Dược Phẩm: Tiêu Chuẩn Cần Biết | Cao Vạn Thịnh',
  'mang-co-pof-cho-nganh-duoc-pham',
  'Vì sao các nhà máy dược phẩm GMP ưu tiên sử dụng màng co POF để bọc hộp thuốc, thực phẩm chức năng và bộ kit y tế?',
  '
      <h2>Yêu cầu khắt khe của phòng đóng gói dược phẩm</h2>
      <p>Trong môi trường phòng sạch đóng gói dược phẩm và thực phẩm chức năng, việc hàn cắt màng không được phép sinh khói hay mùi khó chịu. Màng co POF đáp ứng hoàn hảo tiêu chí <strong>không mùi, không bám bụi tĩnh điện và đường hàn mịn chắc</strong> giúp niêm phong hộp thuốc chống hàng giả hiệu quả.</p>
    ',
  '/media/products/post-pof-duoc-pham.webp',
  'Màng Co POF',
  4,
  TRUE,
  'Màng Co POF Cho Ngành Dược Phẩm: Tiêu Chuẩn Cần Biết | Cao Vạn Thịnh',
  'Ứng dụng màng co POF 5 lớp không mùi, an toàn cao trong dây chuyền đóng gói hộp thuốc, dược phẩm và vật tư y tế.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-4',
  'Cách Nhận Biết Màng Co POF Chất Lượng Cao Ngay Khi Kiểm Tra Mẫu',
  'cach-nhan-biet-mang-co-pof-chat-luong',
  '5 tiêu chí kiểm tra nhanh cuộn màng co POF: độ trong suốt của lốc cuộn, độ dẻo khi kéo giãn tay, độ bền đường hàn và khả năng co góc.',
  '
      <h2>5 cách kiểm tra nhanh chất lượng màng co POF</h2>
      <ol>
        <li><strong>Quan sát mặt cắt ngang cuộn màng:</strong> Cuộn POF nguyên sinh có màu trắng trong đồng đều, không bị đục hay ố vàng.</li>
        <li><strong>Thử độ dai bằng ngón tay:</strong> Ấn mạnh ngón tay vào màng, POF 5 lớp chuẩn sẽ giãn ra mà không bị rách toạc.</li>
        <li><strong>Kiểm tra mùi khi hàn nhiệt:</strong> Hoàn toàn không có mùi khét hắc.</li>
        <li><strong>Độ mịn của góc hộp sau khi co:</strong> Góc co mềm mại, không bị cứng nhọn gây xước tay người tiêu dùng.</li>
      </ol>
    ',
  '/media/products/mang-co-pof-5-lop.webp',
  'Màng Co POF',
  4,
  TRUE,
  'Cách Nhận Biết Màng Co POF Chất Lượng Cao Khi Test Mẫu',
  'Hướng dẫn 5 bước kiểm tra chất lượng màng co nhiệt POF 5 lớp nguyên sinh: độ trong, độ dai, đường hàn và tỷ lệ co nhiệt.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-5',
  'Màng Co POF Cho Thực Phẩm Đông Lạnh: Không Giòn Vỡ Ở Nhiệt Độ Âm',
  'mang-co-pof-cho-thuc-pham-dong-lanh',
  'Khác với màng PVC dễ bị cứng giòn khi cấp đông, màng co POF giữ nguyên độ mềm dẻo ở -40°C, lý tưởng cho thủy hải sản, pizza và há cảo đông lạnh.',
  '
      <h2>Giải pháp bọc màng co cho kho lạnh -18°C đến -40°C</h2>
      <p>Khi bảo quản trong kho cấp đông, màng PVC thông thường sẽ bị mất chất hóa dẻo và trở nên giòn, dễ nứt vỡ khi va chạm. Ngược lại, <strong>màng co POF</strong> duy trì độ đàn hồi tuyệt vời ở nhiệt độ âm sâu tới -40°C, giúp bảo vệ khay thủy sản, thịt cấp đông, bánh bao và kem hộp nguyên vẹn suốt chuỗi cung ứng lạnh.</p>
    ',
  '/media/products/mang-co-pe-quan-loc.webp',
  'Màng Co POF',
  4,
  TRUE,
  'Màng Co POF Cho Thực Phẩm Đông Lạnh Chịu Nhiệt Độ Âm Sâu',
  'Tại sao thực phẩm cấp đông, thủy sản xuất khẩu phải dùng màng co POF? Khả năng chống giòn rách ở nhiệt độ -40 độ C.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-6',
  'Màng Co POF Đóng Gói Mỹ Phẩm Cao Cấp: Bóng Đẹp, Đường Hàn Mảnh Tinh Tế',
  'mang-co-pof-dong-goi-my-pham-cao-cap',
  'Tạo lớp seal niêm phong sang trọng như các thương hiệu mỹ phẩm quốc tế nhờ màng co POF siêu mỏng 12-15 micron.',
  '
      <h2>Nâng tầm diện mạo hộp mỹ phẩm với màng POF siêu mỏng</h2>
      <p>Các thương hiệu mỹ phẩm, nước hoa cao cấp luôn yêu cầu lớp màng seal bên ngoài phải mỏng nhẹ như vô hình, ôm sát hộp giấy mỹ thuật mà không làm cong vênh hộp và có đường hàn mảnh như sợi chỉ. Màng co POF 12 mic và 15 mic chính là tiêu chuẩn vàng cho phân khúc này.</p>
    ',
  '/media/products/tui-mang-co-pvc-cat-san.webp',
  'Màng Co POF',
  4,
  TRUE,
  'Màng Co POF Đóng Gói Mỹ Phẩm Cao Cấp Đường Hàn Mảnh Đẹp',
  'Giải pháp bọc seal hộp mỹ phẩm, nước hoa, serum bằng màng co POF 12-15 mic siêu trong suốt, đường hàn tinh tế.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-pof-7',
  'Cách Chọn Độ Dày Màng Co POF (12mic, 15mic, 19mic, 25mic) Chuẩn Theo Sản Phẩm',
  'cach-chon-do-day-mang-co-pof',
  'Bảng tra cứu nhanh độ dày màng co POF theo trọng lượng và hình dáng sản phẩm để vừa tiết kiệm chi phí vừa đạt tốc độ đóng gói cao nhất.',
  '
      <h2>Bảng chọn độ dày màng co POF thực tế</h2>
      <ul>
        <li><strong>12 micron (1kg dài ~1.300m đơn):</strong> Hộp mỹ phẩm nhỏ, hộp trà nhẹ, mì ly, khăn giấy.</li>
        <li><strong>15 micron (Thông dụng nhất):</strong> Hộp bánh kẹo, hộp dược phẩm, sách vở, khay thực phẩm.</li>
        <li><strong>19 micron – 25 micron:</strong> Lốc nhiều hộp ghép lại, hộp quà nặng hoặc sản phẩm có góc cạnh cứng.</li>
      </ul>
    ',
  '/media/products/mang-co-pof-5-lop.webp',
  'Màng Co POF',
  4,
  TRUE,
  'Cách Chọn Độ Dày Màng Co POF 12mic, 15mic, 19mic, 25mic',
  'Hướng dẫn chọn độ dày màng co nhiệt POF phù hợp với từng loại sản phẩm giúp tối ưu số mét trên mỗi kg màng.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-1',
  'Màng Co Nhiệt Trong Ngành Nội Thất, Đồ Gỗ: Ứng Dụng Và Lưu Ý | Cao Vạn Thịnh',
  'mang-co-nhiet-cho-nganh-noi-that-do-go',
  'Giải pháp bọc thanh gỗ, phào chỉ, ván sàn, khung tranh và phụ kiện nội thất bằng màng co nhiệt khổ lớn giúp chống ẩm và chống trầy xước.',
  '
      <h2>Bảo vệ bề mặt sơn PU và ván gỗ công nghiệp</h2>
      <p>Trong ngành sản xuất đồ gỗ nội thất lắp ráp (knock-down furniture), phào chỉ nhựa và thanh nhôm định hình, việc sử dụng màng co nhiệt PVC hoặc PE chạy qua buồng co dài giúp cố định chặt các thanh rời thành một kiện thống nhất, không bị ma sát làm trầy lớp sơn bề mặt trong quá trình vận chuyển.</p>
    ',
  '/media/products/post-nhiet-noi-that-do-go.webp',
  'Màng Co Nhiệt',
  4,
  TRUE,
  'Màng Co Nhiệt Trong Ngành Nội Thất, Đồ Gỗ: Ứng Dụng Và Lưu Ý | Cao Vạn Thịnh',
  'Cung cấp màng co nhiệt khổ lớn bọc ván sàn, phào chỉ, đồ gỗ nội thất và thanh nhôm định hình chống trầy xước hiệu quả.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-2',
  'Kinh Nghiệm Chọn Máy Co Nhiệt Cho Xưởng Mới Mở | Cao Vạn Thịnh',
  'kinh-nghiem-chon-may-co-nhiet-cho-xuong-moi-mo',
  'Phân tích chi phí đầu tư và năng suất thực tế của súng khò nhiệt cầm tay, buồng co nhiệt BS-4020 và máy cắt màng chữ L tự động.',
  '
      <h2>Lộ trình đầu tư thiết bị co màng theo sản lượng</h2>
      <ul>
        <li><strong>Dưới 300 sản phẩm/ngày:</strong> Dùng túi màng co PVC cắt sẵn + Súng khò nhiệt cầm tay (vốn đầu tư chỉ từ vài trăm nghìn đồng).</li>
        <li><strong>Từ 500 – 3.000 sản phẩm/ngày:</strong> Kết hợp máy hàn dập chân/chữ L bán tự động + Buồng co nhiệt băng tải (như BS-4020).</li>
        <li><strong>Trên 5.000 sản phẩm/ngày:</strong> Đầu tư dây chuyền máy cắt hàn chữ L tự động hoàn toàn dùng cuộn màng đôi POF hoặc PVC.</li>
      </ul>
    ',
  '/media/products/post-chon-may-co-nhiet.webp',
  'Màng Co Nhiệt',
  5,
  TRUE,
  'Kinh Nghiệm Chọn Máy Co Nhiệt Cho Xưởng Mới Mở | Cao Vạn Thịnh',
  'Tư vấn chọn mua súng khò nhiệt cầm tay, buồng co nhiệt hay máy bọc màng co tự động phù hợp với quy mô sản lượng của xưởng.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-3',
  'Xu Hướng Đóng Gói Xanh: Màng Co Nhiệt Có Thân Thiện Môi Trường Không? | Cao Vạn Thịnh',
  'mang-co-nhiet-co-than-thien-moi-truong-khong',
  'Tìm hiểu xu hướng giảm độ dày màng (downgauging) và sử dụng màng co POF/PE tái chế trong ngành đóng gói hiện đại.',
  '
      <h2>2 giải pháp giúp bao bì màng co thân thiện môi trường hơn</h2>
      <p>Thứ nhất là xu hướng <strong>Downgauging (Giảm độ dày màng)</strong>: sử dụng màng công nghệ đa lớp mỏng hơn nhưng vẫn giữ nguyên độ bền cơ học, giúp giảm lượng nhựa tiêu thụ trên mỗi đơn vị sản phẩm. Thứ hai là ưu tiên chuyển đổi sang các dòng nhựa đơn chất dễ tái chế như POF và PE.</p>
    ',
  '/media/products/post-nhiet-than-thien-moi-truong.webp',
  'Màng Co Nhiệt',
  4,
  TRUE,
  'Xu Hướng Đóng Gói Xanh: Màng Co Nhiệt Có Thân Thiện Môi Trường Không? | Cao Vạn Thịnh',
  'Đánh giá mức độ thân thiện môi trường của các loại màng co nhiệt PVC, POF, PE và giải pháp tối ưu lượng nhựa bao bì.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-4',
  'Cách Tính Lượng Màng Co Nhiệt Cần Dùng & Dự Toán Chi Phí Đóng Gói Chính Xác',
  'cach-tinh-luong-mang-co-nhiet-can-dung',
  'Công thức quy đổi từ kích thước túi (Dài x Rộng x Độ dày micron x Tỷ trọng nhựa) ra số lượng túi trên 1kg màng co PVC, POF, PE.',
  '
      <h2>Công thức tính trọng lượng 1.000 túi màng co</h2>
      <p>Để biết 1kg màng co cắt được bao nhiêu túi, bạn áp dụng tỷ trọng chuẩn của từng loại nhựa:</p>
      <ul>
        <li><strong>Tỷ trọng nhựa PVC:</strong> ~1.38 g/cm³</li>
        <li><strong>Tỷ trọng nhựa POF / PE:</strong> ~0.92 g/cm³</li>
      </ul>
      <p>Khối lượng 1 túi (gram) = <code>Chiều rộng (m) × Chiều dài (m) × 2 (màng đôi) × Độ dày (micron) × Tỷ trọng</code>. Từ đó bạn dễ dàng tính được chi phí bao bì chính xác đến từng đồng cho mỗi hộp sản phẩm!</p>
    ',
  '/media/products/tui-mang-co-pvc-cat-san.webp',
  'Màng Co Nhiệt',
  5,
  TRUE,
  'Cách Tính Lượng Màng Co Nhiệt Cần Dùng (1Kg Được Bao Nhiêu Túi?)',
  'Công thức tính 1kg màng co PVC, POF cắt được bao nhiêu cái túi hoặc dài bao nhiêu mét để dự toán chi phí đóng gói chuẩn xác.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-5',
  '7 Lỗi Thường Gặp Khi Đóng Gói Bằng Máy Co Nhiệt & Cách Khắc Phục Tức Thì',
  'loi-thuong-gap-khi-dong-goi-may-co-nhiet',
  'Màng bị phồng bóng khí, nhăn góc "tai mèo", bục đường hàn hay thủng lỗ khi qua buồng nhiệt? Xem ngay nguyên nhân và cách chỉnh máy.',
  '
      <h2>Cách xử lý nhanh các lỗi co màng phổ biến</h2>
      <ul>
        <li><strong>Màng bị phồng như quả bóng:</strong> Do thiếu lỗ thoát khí hoặc lỗ thoát khí bị bịt kín. Hãy châm thêm lỗ kim nhỏ ở cạnh hông túi.</li>
        <li><strong>Màng bị nhăn chùng ở các mặt:</strong> Do chọn khổ màng quá rộng hoặc nhiệt độ buồng co chưa đủ, hoặc tốc độ băng tải chạy quá nhanh.</li>
        <li><strong>Màng bị thủng lỗ tròn:</strong> Nhiệt độ quá cao hoặc gió thổi trực tiếp quá mạnh vào một điểm, cần giảm nhiệt hoặc tăng tốc độ băng tải.</li>
      </ul>
    ',
  '/media/products/mang-co-pvc-cuon.webp',
  'Màng Co Nhiệt',
  5,
  TRUE,
  '7 Lỗi Thường Gặp Khi Đóng Gói Máy Co Nhiệt & Cách Khắc Phục',
  'Hướng dẫn khắc phục lỗi màng co bị nhăn góc, phồng khí, rách đường hàn và thủng lỗ khi chạy qua buồng co nhiệt.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-6',
  'Nên Dùng Máy Co Màng Nhiệt Tự Động Hay Súng Khò Cầm Tay?',
  'may-co-mang-nhiet-tu-dong-hay-sung-kho-tay',
  'Đặt lên bàn cân ưu nhược điểm của súng khò nhiệt cầm tay linh hoạt và buồng co nhiệt băng tải công nghiệp.',
  '
      <h2>Khi nào súng khò tay tốt hơn, khi nào bắt buộc dùng buồng co?</h2>
      <p>Súng khò nhiệt cầm tay cực kỳ linh hoạt khi bọc giỏ quà Tết cỡ lớn, nắp bình nước 20L hoặc sản lượng ít dưới vài trăm hộp/ngày. Tuy nhiên, nếu bạn cần bọc hàng ngàn hộp mỹ phẩm, hộp trà mỗi ngày với độ phẳng đồng đều 100% ở cả 6 mặt hộp, buồng co nhiệt băng tải là khoản đầu tư bắt buộc để tiết kiệm nhân công.</p>
    ',
  '/media/products/tem-nhan-mang-co-in.webp',
  'Màng Co Nhiệt',
  4,
  TRUE,
  'So Sánh Máy Co Màng Nhiệt Tự Động Và Súng Khò Nhiệt Cầm Tay',
  'Tư vấn nên chọn súng khò màng co cầm tay hay buồng co nhiệt băng tải tự động cho xưởng đóng gói.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-7',
  'Hướng Dẫn Bảo Quản Màng Co PVC, POF Đúng Cách Không Bị Tự Co Trong Kho',
  'bao-quan-mang-co-pvc-pof-dung-cach',
  'Màng co nhiệt rất nhạy cảm với nhiệt độ môi trường và ánh nắng mặt trời. Lưu ý ngay 4 nguyên tắc lưu kho để màng không bị giòn hay tự rút khổ.',
  '
      <h2>4 nguyên tắc vàng khi lưu kho màng co nhiệt</h2>
      <ol>
        <li><strong>Nhiệt độ kho dưới 32°C:</strong> Đặc biệt với màng co PVC, nếu để gần mái tôn nóng hoặc sát tường hướng Tây nắng chiếu trực tiếp, cuộn màng có thể bị tự co rút mép làm kẹt giấy lõi.</li>
        <li><strong>Đặt dựng đứng hoặc kê pallet phẳng:</strong> Tránh xếp chồng chéo làm móp lõi giấy.</li>
        <li><strong>Bọc kín túi PE bảo vệ ngoài:</strong> Sau khi lấy bớt màng, hãy buộc kín bao ngoài để tránh bụi bẩn bám vào mép cuộn gây đứt đường hàn.</li>
      </ol>
    ',
  '/media/products/mang-co-pvc-cuon.webp',
  'Màng Co Nhiệt',
  4,
  TRUE,
  'Cách Bảo Quản Màng Co PVC, POF Trong Kho Không Bị Tự Co Rút',
  'Hướng dẫn cách bảo quản cuộn và túi màng co nhiệt PVC, POF trong kho xưởng mùa nắng nóng để không bị biến dạng hay tự co.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
INSERT INTO public.posts (id, title, slug, excerpt, content, thumbnail_url, category_name, reading_time, is_published, seo_title, seo_description)
VALUES (
  'post-nhiet-8',
  'Hướng Dẫn Chọn Khổ Màng Co Phù Hợp Cho Hộp Chữ Nhật Và Chai Lọ Tròn',
  'huong-dan-chon-kho-mang-co-phu-hop',
  'Công thức chuẩn từ kỹ thuật viên nhà máy giúp bạn tự tính khổ màng co ống đôi và chiều dài cắt cho bất kỳ sản phẩm nào trong 30 giây.',
  '
      <h2>Công thức tính khổ màng co chuẩn xác</h2>
      <ul>
        <li><strong>Đối với hộp chữ nhật (Dài × Rộng × Cao):</strong> Khổ màng ống đôi = <code>(Rộng + Cao) × 1.1</code> (hoặc cộng thêm 10–15mm). Chiều dài túi cắt = <code>(Dài + Cao) × 1.1</code>.</li>
        <li><strong>Đối với chai / lọ trụ tròn (Đường kính D × Cao H):</strong> Khổ màng ống đôi = <code>(3.14 × D ÷ 2) + 8mm đến 12mm</code>.</li>
      </ul>
    ',
  '/media/products/tui-mang-co-pvc-cat-san.webp',
  'Màng Co Nhiệt',
  4,
  TRUE,
  'Hướng Dẫn Chọn Khổ Màng Co Phù Hợp Cho Hộp Và Chai Lọ',
  'Công thức tính khổ rộng màng co và chiều dài túi cắt cho hộp chữ nhật, hũ tròn chuẩn kỹ thuật.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category_name = EXCLUDED.category_name,
  reading_time = EXCLUDED.reading_time,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
