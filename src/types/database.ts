export interface GoogleDriveBackupConfig {
  enabled: boolean;
  frequency_days: number; // Mặc định 5 ngày
  folder_id?: string;
  // Phương thức 1: Webhook Apps Script (khuyên dùng)
  webhook_url?: string;
  // Phương thức 2: Service Account (nâng cao)
  auth_type?: 'webhook' | 'service_account';
  client_email?: string;
  private_key?: string;
  // Lịch sử sao lưu
  last_backup_at?: string | null;
  last_backup_status?: string | null;
  last_backup_file?: string | null;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  short_name: string;
  hotline: string;
  zalo: string;
  email: string;
  address: string;
  seo_title: string;
  seo_description: string;
  banner_url?: string | null;
  hero_banner_url?: string | null;
  about_banner_url?: string | null;
  drive_backup_config?: GoogleDriveBackupConfig | null;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url?: string | null;
  sort_order: number;
}

export interface ProductListItem {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string | null;
  price_label: string;
  short_description: string;
  specs: Record<string, string>;
  thumbnail_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface ProductDetail extends ProductListItem {
  content: string;
  gallery_urls: string[];
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  category_name: string;
  reading_time: number;
  created_at: string;
}

export interface PostDetail extends PostListItem {
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  customer_name: string;
  phone: string;
  company: string | null;
  product_interest: string | null;
  quantity_note: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'completed';
  created_at: string;
}

