'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Code,
  Copy,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Factory,
  FileText,
  Folder,
  FolderTree,
  Image as ImageIcon,
  Key,
  Layers,
  LayoutGrid,
  Lock,
  LogOut,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  UploadCloud,
  Users,
  Video,
  Play,
  Share2,
  Globe,
  X,
  Zap,
} from 'lucide-react';
import {
  checkSupabaseTablesAction,
  deleteCategoryAction,
  deleteIndustryAction,
  deleteInquiryAction,
  deletePostAction,
  deleteProductAction,
  deleteSupabaseStorageFileAction,
  getSupabaseStorageOverviewAction,
  StorageFolderGroup,
  loginAdminAction,
  logoutAdminAction,
  saveCategoryAction,
  saveIndustryAction,
  savePostAction,
  saveProductAction,
  saveSiteSettingsAction,
  saveWebsiteLinksAction,
  saveBannersAction,
  updateHeroSlidesAction,
  saveGoogleDriveConfigAction,
  testGoogleDriveConnectionAction,
  triggerManualDriveBackupAction,
  seedInitialDataAction,
  toggleProductHomeAction,
  triggerOnDemandRevalidationAction,
  updateInquiryStatusAction,
} from '@/app/actions/admin';
import { SupabaseTablesReport } from '@/lib/db';
import { compressImageToWebP } from '@/lib/image-compressor';
import { formatSpecsToLines } from '@/lib/markdown';
import AdminLoginForm from '@/components/AdminLoginForm';
import MarkdownEditor from '@/components/MarkdownEditor';
import {
  Category,
  GoogleDriveBackupConfig,
  HeroSlide,
  Industry,
  Inquiry,
  PostDetail,
  ProductDetail,
  SiteSettings,
  WebLink,
} from '@/types/database';

interface Props {
  isAuthenticated: boolean;
  supabaseConfigured: boolean;
  siteSettings: SiteSettings;
  categories: Category[];
  industries?: Industry[];
  products: ProductDetail[];
  posts: PostDetail[];
  inquiries: Inquiry[];
  links?: WebLink[];
}

type AdminSection =
  | 'dashboard'
  | 'leads'
  | 'products'
  | 'categories'
  | 'industries'
  | 'posts'
  | 'sliders'
  | 'banners'
  | 'webp'
  | 'settings'
  | 'cache';

function AdminPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 8, 12, 20],
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          {totalItems === 0 ? (
            <span className="text-slate-400 italic">Không tìm thấy mục nào phù hợp</span>
          ) : (
            <>
              Hiển thị <strong className="text-slate-800">{startIdx}</strong> –{' '}
              <strong className="text-slate-800">{endIdx}</strong> trên tổng số{' '}
              <strong className="text-slate-800">{totalItems}</strong> mục
              <span className="text-slate-400 ml-1.5 font-medium">(Trang {currentPage} / {totalPages})</span>
            </>
          )}
        </div>

        {onPageSizeChange && totalItems > 0 && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-slate-400">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-200 rounded-md font-bold text-slate-700 text-xs focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 rounded-lg font-bold transition text-xs ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Trang kế tiếp"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboardClient({
  isAuthenticated,
  supabaseConfigured,
  siteSettings,
  categories,
  industries = [],
  products,
  posts,
  inquiries,
  links = [],
}: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [selectedProductIndustry, setSelectedProductIndustry] = useState<string>('all');
  const [selectedHomeFilter, setSelectedHomeFilter] = useState<'all' | 'home' | 'hidden'>('all');
  const [selectedPostCategory, setSelectedPostCategory] = useState<string>('all');

  // Links & Videos state - Lấy trực tiếp từ database Supabase
  const [linksList, setLinksList] = useState<WebLink[]>(() => {
    if (links && links.length > 0) return links;
    if (siteSettings.links && siteSettings.links.length > 0) return siteSettings.links;
    return [];
  });

  useEffect(() => {
    if (links && links.length > 0) {
      setLinksList(links);
    }
  }, [links]);

  // Products & Industries states
  const [productsList, setProductsList] = useState<ProductDetail[]>(products);
  const [togglingHomeId, setTogglingHomeId] = useState<string | null>(null);
  const [industriesList, setIndustriesList] = useState<Industry[]>(industries);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [industryThumbUrl, setIndustryThumbUrl] = useState<string>('');
  const [indFormKey, setIndFormKey] = useState(0);

  // Pagination states
  const [prodPage, setProdPage] = useState(1);
  const [prodPageSize, setProdPageSize] = useState(6);
  const [postPage, setPostPage] = useState(1);
  const [postPageSize, setPostPageSize] = useState(6);
  const [catPage, setCatPage] = useState(1);
  const [indPage, setIndPage] = useState(1);
  const [inqPage, setInqPage] = useState(1);

  const CAT_PAGE_SIZE = 5;
  const IND_PAGE_SIZE = 6;
  const INQ_PAGE_SIZE = 8;

  function selectSection(section: AdminSection) {
    setActiveSection(section);
    setMobileSidebarOpen(false);
    if (section === 'webp') {
      loadStorageOverview();
    }
  }

  // Modal / Form states for CRUD
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(
    null
  );
  const [productThumbUrl, setProductThumbUrl] = useState<string>(
    '/media/products/mang-co-pvc-cuon.webp'
  );

  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDetail | null>(null);
  const [postThumbUrl, setPostThumbUrl] = useState<string>(
    '/media/products/mang-co-pvc-cuon.webp'
  );

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryThumbUrl, setCategoryThumbUrl] = useState<string>('');
  const [catFormKey, setCatFormKey] = useState(0);

  const [heroBannerUrl, setHeroBannerUrl] = useState<string>(
    siteSettings.hero_banner_url || '/media/products/hero-mang-co.webp'
  );
  const [aboutBannerUrl, setAboutBannerUrl] = useState<string>(
    siteSettings.about_banner_url || siteSettings.banner_url || '/media/banners/banner-mang-co.webp'
  );

  // Hero Slides state - Lấy trực tiếp từ database Supabase
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    return siteSettings.hero_slides || [];
  });

  // WebP compression & upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalKB: number;
    compressedKB: number;
    width: number;
    height: number;
    url: string;
  } | null>(null);

  // Supabase Storage folder tree & date state
  const [storageFolders, setStorageFolders] = useState<StorageFolderGroup[] | null>(null);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [selectedStorageFolder, setSelectedStorageFolder] = useState<
    'categories' | 'posts' | 'products' | 'banners' | 'uploads'
  >('categories');
  const [selectedStorageDate, setSelectedStorageDate] = useState(() => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    setProductsList(products);
  }, [products]);

  useEffect(() => {
    if (industries) setIndustriesList(industries);
  }, [industries]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get('section') || params.get('tab');
      if (
        sec &&
        ['dashboard', 'leads', 'products', 'categories', 'industries', 'posts', 'banners', 'webp', 'settings', 'cache'].includes(sec)
      ) {
        setActiveSection(sec as AdminSection);
      }
      if (window.location.hash === '#banners') {
        setActiveSection('banners');
      }
    }
  }, []);

  async function loadStorageOverview() {
    setLoadingStorage(true);
    try {
      const data = await getSupabaseStorageOverviewAction();
      setStorageFolders(data);
    } catch {
      // ignore
    } finally {
      setLoadingStorage(false);
    }
  }

  function handleCopyUrl(url: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  }

  const [deletingStorageUrl, setDeletingStorageUrl] = useState<string | null>(null);
  const [storageFilter, setStorageFilter] = useState<'all' | 'unused' | 'used'>('all');

  // Quét toàn bộ ảnh đang được sử dụng trong hệ thống
  const usedImagesMap = useMemo(() => {
    const map = new Map<string, string[]>();

    function registerUsage(urlOrPath: string | null | undefined, desc: string) {
      if (!urlOrPath) return;
      const clean = urlOrPath.trim();
      const fileName = clean.split('/').pop()?.split('?')[0];
      if (!fileName) return;

      const prevByFile = map.get(fileName) || [];
      if (!prevByFile.includes(desc)) prevByFile.push(desc);
      map.set(fileName, prevByFile);

      const prevByUrl = map.get(clean) || [];
      if (!prevByUrl.includes(desc)) prevByUrl.push(desc);
      map.set(clean, prevByUrl);
    }

    // 1. Ảnh mặc định của hệ thống
    registerUsage('/media/banners/banner-mang-co.webp', 'Banner giới thiệu mặc định');
    registerUsage('/media/products/hero-mang-co.webp', 'Banner hero trang chủ mặc định');
    registerUsage('/media/categories/mang-co-pvc.webp', 'Ảnh danh mục PVC mặc định');
    registerUsage('/media/categories/mang-co-pof.webp', 'Ảnh danh mục POF mặc định');
    registerUsage('/media/categories/mang-co-pe.webp', 'Ảnh danh mục PE mặc định');
    registerUsage('/media/categories/mang-co-nhiet.webp', 'Ảnh danh mục Nhiệt mặc định');

    // 2. Banner và Site Settings
    if (siteSettings.banner_url) registerUsage(siteSettings.banner_url, 'Banner thương hiệu');
    if (siteSettings.hero_banner_url) registerUsage(siteSettings.hero_banner_url, 'Ảnh Hero Trang Giới Thiệu');
    if (siteSettings.about_banner_url) registerUsage(siteSettings.about_banner_url, 'Banner Dải Ngang Giới Thiệu');
    (siteSettings.hero_slides || heroSlides || []).forEach((slide) => {
      if (slide.image_url) registerUsage(slide.image_url, `Banner Hệ Mặt Trời: ${slide.name}`);
    });

    // 3. Danh mục
    categories.forEach((cat) => {
      if (cat.image_url) registerUsage(cat.image_url, `Danh mục: ${cat.name}`);
    });

    // 4. Sản phẩm
    products.forEach((p) => {
      if (p.thumbnail_url) registerUsage(p.thumbnail_url, `Sản phẩm: ${p.name}`);
      (p.gallery_urls || []).forEach((u, idx) => {
        registerUsage(u, `Gallery ảnh #${idx + 1} của: ${p.name}`);
      });
      if (p.content) {
        const matches = p.content.match(/\/media\/[^\s"')]+/g);
        matches?.forEach((m) => registerUsage(m, `Nội dung sản phẩm: ${p.name}`));
      }
    });

    // 5. Bài viết SEO / Tin tức
    posts.forEach((post) => {
      if (post.thumbnail_url) registerUsage(post.thumbnail_url, `Bài viết: ${post.title}`);
      if (post.content) {
        const matches = post.content.match(/\/media\/[^\s"')]+/g);
        matches?.forEach((m) => registerUsage(m, `Nội dung bài viết: ${post.title}`));
      }
    });

    return map;
  }, [siteSettings, categories, products, posts]);

  function checkImageUsage(url: string, fileName: string): { inUse: boolean; usedBy: string[] } {
    const list1 = usedImagesMap.get(fileName) || [];
    const list2 = usedImagesMap.get(url) || [];
    const merged = Array.from(new Set([...list1, ...list2]));
    return {
      inUse: merged.length > 0,
      usedBy: merged,
    };
  }

  async function handleDeleteStorageFile(fileUrl: string, fileName: string) {
    const usage = checkImageUsage(fileUrl, fileName);
    let confirmPrompt = `Bạn có chắc muốn xóa vĩnh viễn ảnh này khỏi Supabase Storage?\n\nTên file: ${fileName}`;
    if (usage.inUse) {
      confirmPrompt = `⚠️ CẢNH BÁO: Ảnh này ĐANG ĐƯỢC DÙNG trên website tại:\n- ${usage.usedBy.join('\n- ')}\n\nNếu xóa, vị trí tương ứng sẽ bị lỗi ảnh! Bạn vẫn muốn xóa vĩnh viễn?`;
    }

    if (!window.confirm(confirmPrompt)) return;

    setDeletingStorageUrl(fileUrl);
    try {
      const res = await deleteSupabaseStorageFileAction(fileUrl);
      setNotice(res);
      if (res.ok) {
        await loadStorageOverview();
      }
    } catch {
      setNotice({ ok: false, message: 'Lỗi khi gửi yêu cầu xóa ảnh' });
    } finally {
      setDeletingStorageUrl(null);
    }
  }

  const storageStats = useMemo(() => {
    if (!storageFolders) return { total: 0, used: 0, unused: 0 };
    let total = 0;
    let used = 0;
    let unused = 0;

    for (const grp of storageFolders) {
      for (const f of grp.rootFiles) {
        total++;
        if (checkImageUsage(f.url, f.name).inUse) used++;
        else unused++;
      }
      for (const d of grp.dates) {
        for (const f of d.files) {
          total++;
          if (checkImageUsage(f.url, f.name).inUse) used++;
          else unused++;
        }
      }
    }
    return { total, used, unused };
  }, [storageFolders, usedImagesMap]);


  // KPI calculations
  const totalLeads = inquiries.length;
  const newLeadsCount = inquiries.filter(
    (i) => !i.status || i.status === 'new'
  ).length;
  const completedLeadsCount = inquiries.filter(
    (i) =>
      i.status === 'quoted' ||
      i.status === 'closed' ||
      i.status === 'completed'
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((completedLeadsCount / totalLeads) * 100) : 0;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await loginAdminAction(new FormData(e.currentTarget));
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      router.refresh();
    }
  }

  async function handleLogout() {
    await logoutAdminAction();
    router.push('/thanhphat/login');
    router.refresh();
  }

  async function handleRevalidate(
    target: 'all' | 'products' | 'posts' | 'categories' | 'settings' = 'all'
  ) {
    setLoading(true);
    const res = await triggerOnDemandRevalidationAction(target);
    setNotice(res);
    setLoading(false);
    router.refresh();
  }

  /**
   * Tự động đổi mọi ảnh sang .webp (<150KB) trên trình duyệt trước khi upload lên Supabase Storage
   * Tự động phân tách thư mục theo loại (products, posts, banners, uploads)
   * và theo từng ngày đăng (YYYY-MM-DD).
   */
  async function convertAndUploadWebP(
    file: File,
    targetField:
      | 'product'
      | 'post'
      | 'category'
      | 'industry'
      | 'hero-banner'
      | 'about-banner'
      | 'standalone'
      | `slide-${number}`,
    customFolder?: string,
    customDate?: string
  ) {
    setUploadingImage(true);
    setNotice(null);
    try {
      const compressed = await compressImageToWebP(file, 1400, 150);
      const formData = new FormData();
      formData.append(
        'file',
        new File([compressed.blob], compressed.fileName, {
          type: 'image/webp',
        })
      );

      const folder =
        customFolder ||
        (targetField === 'category'
          ? 'categories'
          : targetField === 'industry'
          ? 'industries'
          : targetField === 'product'
          ? 'products'
          : targetField === 'post'
          ? 'posts'
          : targetField === 'hero-banner' || targetField === 'about-banner' || targetField.startsWith('slide-')
          ? 'banners'
          : selectedStorageFolder || 'uploads');
      formData.append('folder', folder);

      const dateVal =
        customDate ||
        (targetField === 'standalone' ? selectedStorageDate : undefined);
      if (dateVal) {
        formData.append('date', dateVal);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.ok) {
        setCompressionStats({
          originalKB: compressed.originalSizeKB,
          compressedKB: compressed.compressedSizeKB,
          width: compressed.width,
          height: compressed.height,
          url: data.url,
        });
        if (targetField === 'product') setProductThumbUrl(data.url);
        if (targetField === 'post') setPostThumbUrl(data.url);
        if (targetField === 'category') setCategoryThumbUrl(data.url);
        if (targetField === 'industry') setIndustryThumbUrl(data.url);
        if (targetField === 'hero-banner') setHeroBannerUrl(data.url);
        if (targetField === 'about-banner') setAboutBannerUrl(data.url);
        if (targetField.startsWith('slide-')) {
          const slideIdx = parseInt(targetField.replace('slide-', ''), 10);
          if (!isNaN(slideIdx)) {
            setHeroSlides((prev) => {
              const next = [...prev];
              if (next[slideIdx]) next[slideIdx] = { ...next[slideIdx], image_url: data.url };
              return next;
            });
          }
        }

        setNotice({
          ok: true,
          message: `Đã tự động đổi sang WebP (${compressed.originalSizeKB}KB → ${compressed.compressedSizeKB}KB) và lưu vào [${data.folder || folder}/${data.dateFolder || ''}] trên Supabase: ${data.url}`,
        });
        loadStorageOverview();
      } else {
        setNotice({ ok: false, message: data.error || 'Lỗi upload ảnh WebP' });
      }
    } catch (err) {
      setNotice({
        ok: false,
        message: err instanceof Error ? err.message : 'Lỗi nén ảnh WebP',
      });
    }
    setUploadingImage(false);
  }

  // --- CRUD HANDLERS ---
  async function handleSaveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await saveProductAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      setEditingProduct(null);
      setShowProductForm(false);
      router.refresh();
    }
  }

  async function handleDeleteProduct(idOrSlug: string, name: string) {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi Database?`
      )
    )
      return;
    setLoading(true);
    const res = await deleteProductAction(idOrSlug);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      if (editingProduct?.id === idOrSlug) setEditingProduct(null);
      router.refresh();
    }
  }

  async function handleToggleProductHome(targetProd: ProductDetail) {
    const nextState = !targetProd.is_featured;
    setTogglingHomeId(targetProd.id);

    // Cập nhật optimistic ngay lập tức theo đúng quy tắc tối đa 8 sản phẩm (FIFO tuần tự)
    setProductsList((prev) => {
      if (!nextState) {
        return prev.map((item) =>
          item.id === targetProd.id
            ? { ...item, is_featured: false, home_order: 0 }
            : item
        );
      }

      const activeList = prev
        .filter((item) => item.is_featured && item.id !== targetProd.id)
        .sort((a, b) => (a.home_order || 999999) - (b.home_order || 999999));

      const maxHomeOrder = prev.reduce(
        (max, item) => Math.max(max, Number(item.home_order) || 0),
        0
      );
      const nextHomeOrder = maxHomeOrder + 1;

      const idsToDisable = new Set<string>();
      if (activeList.length >= 8) {
        const overflowCount = activeList.length - 8 + 1;
        for (let i = 0; i < overflowCount; i++) {
          idsToDisable.add(activeList[i].id);
        }
      }

      return prev.map((item) => {
        if (item.id === targetProd.id) {
          return { ...item, is_featured: true, home_order: nextHomeOrder };
        }
        if (idsToDisable.has(item.id)) {
          return { ...item, is_featured: false, home_order: 0 };
        }
        return item;
      });
    });

    try {
      const res = await toggleProductHomeAction(targetProd.id, nextState);
      setNotice(res);
      if (res.ok) {
        router.refresh();
      }
    } catch {
      setNotice({
        ok: false,
        message: 'Lỗi khi cập nhật trạng thái hiển thị Trang chủ',
      });
    } finally {
      setTogglingHomeId(null);
    }
  }

  async function handleSavePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await savePostAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      setEditingPost(null);
      setShowPostForm(false);
      router.refresh();
    }
  }

  async function handleDeletePost(idOrSlug: string, title: string) {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa bài viết "${title}" khỏi Database?`
      )
    )
      return;
    setLoading(true);
    const res = await deletePostAction(idOrSlug);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      if (editingPost?.id === idOrSlug) setEditingPost(null);
      router.refresh();
    }
  }

  async function handleSaveCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setLoading(true);
    const fd = new FormData(formElement);
    const res = await saveCategoryAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      try {
        formElement.reset();
      } catch {}
      setEditingCategory(null);
      setCategoryThumbUrl('');
      setCatFormKey((k) => k + 1);
      router.refresh();
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!window.confirm(`Xóa danh mục "${name}" khỏi Database?`)) return;
    setLoading(true);
    const res = await deleteCategoryAction(id);
    setNotice(res);
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function handleSaveIndustry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setLoading(true);
    const fd = new FormData(formElement);
    const res = await saveIndustryAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      try {
        formElement.reset();
      } catch {}
      setEditingIndustry(null);
      setIndustryThumbUrl('');
      setIndFormKey((k) => k + 1);
      router.refresh();
    }
  }

  async function handleDeleteIndustry(id: string, name: string) {
    if (!window.confirm(`Xóa ngành nghề "${name}" khỏi Database?`)) return;
    setLoading(true);
    const res = await deleteIndustryAction(id);
    setNotice(res);
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await saveSiteSettingsAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function handleSaveLinks(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await saveWebsiteLinksAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) {
      const fb = (fd.get('link_facebook') as string)?.trim() || 'https://facebook.com';
      const tt = (fd.get('link_tiktok') as string)?.trim() || 'https://tiktok.com';
      const yt = (fd.get('link_youtube') as string)?.trim() || 'https://youtube.com';
      const tw = (fd.get('link_twitter') as string)?.trim() || 'https://twitter.com';
      const v1 = (fd.get('video_intro_url') as string)?.trim() || 'https://www.youtube.com/watch?v=lDzM8QeIuGs';
      const v2 = (fd.get('video_factory_url') as string)?.trim() || 'https://www.youtube.com/embed/lDzM8QeIuGs?si=6N-vPjF-LDRJ9N42';
      setLinksList([
        { id: 'facebook', title: 'Facebook Fanpage', url: fb, type: 'social', description: 'Nút icon Facebook trên thanh đầu trang (Header)', updated_at: new Date().toISOString() },
        { id: 'tiktok', title: 'Kênh TikTok Xưởng', url: tt, type: 'social', description: 'Nút icon TikTok trên thanh đầu trang (Header)', updated_at: new Date().toISOString() },
        { id: 'youtube', title: 'Kênh YouTube Doanh Nghiệp', url: yt, type: 'social', description: 'Nút icon YouTube trên thanh đầu trang (Header)', updated_at: new Date().toISOString() },
        { id: 'twitter', title: 'Twitter / X', url: tw, type: 'social', description: 'Nút icon Twitter/X trên thanh đầu trang (Header)', updated_at: new Date().toISOString() },
        { id: 'video_intro', title: 'Video 1: Giới Thiệu Xưởng (Mục Về Chúng Tôi)', url: v1, type: 'video', description: 'Video giới thiệu xưởng sản xuất ở Mục 2 trên Trang Chủ', updated_at: new Date().toISOString() },
        { id: 'video_factory', title: 'Video 2: Vận Hành Nhà Xưởng (Mục Quy Trình)', url: v2, type: 'video', description: 'Khung video nhúng phát trực tiếp ở Mục 11 trên Trang Chủ', updated_at: new Date().toISOString() },
      ]);
      router.refresh();
    }
  }

  async function handleSaveBanners(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('hero_banner_url', heroBannerUrl);
    fd.set('about_banner_url', aboutBannerUrl);
    const res = await saveBannersAction(fd);
    setNotice(res);
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function handleSaveSliders(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await updateHeroSlidesAction(heroSlides);
    setNotice(res);
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function handleInquiryStatus(
    id: string,
    status: 'new' | 'contacted' | 'quoted' | 'closed' | 'completed'
  ) {
    setLoading(true);
    const res = await updateInquiryStatusAction(id, status);
    setNotice(res);
    setLoading(false);
    router.refresh();
  }

  async function handleDeleteInquiry(id: string) {
    if (!window.confirm('Xóa yêu cầu báo giá này khỏi Database?')) return;
    setLoading(true);
    const res = await deleteInquiryAction(id);
    setNotice(res);
    setLoading(false);
    router.refresh();
  }

  // --- BACKUP & RESTORE HANDLERS ---
  const [downloadingBackup, setDownloadingBackup] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoringBackup, setRestoringBackup] = useState(false);

  async function handleDownloadBackup() {
    setDownloadingBackup(true);
    setNotice(null);
    try {
      const res = await fetch('/api/backup/download');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Lỗi khi tạo bản sao lưu');
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition') || '';
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      const filename = match
        ? match[1]
        : `backup-mangcopvc-${new Date().toISOString().slice(0, 10)}.zip`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setNotice({
        ok: true,
        message: `Đã tải về thành công tệp sao lưu: ${filename} (Gồm dữ liệu 5 bảng + toàn bộ ảnh)`,
      });
    } catch (err: unknown) {
      setNotice({
        ok: false,
        message: err instanceof Error ? err.message : 'Lỗi tải bản sao lưu',
      });
    } finally {
      setDownloadingBackup(false);
    }
  }

  async function handleRestoreBackup(e: React.FormEvent) {
    e.preventDefault();
    if (!restoreFile) {
      setNotice({ ok: false, message: 'Vui lòng chọn file backup .zip cần khôi phục' });
      return;
    }

    if (
      !window.confirm(
        `⚠️ CẢNH BÁO QUAN TRỌNG:\nBạn có chắc chắn muốn khôi phục toàn bộ hệ thống từ file:\n"${restoreFile.name}"?\n\nDữ liệu các bảng và toàn bộ ảnh sẽ được nạp và đồng bộ vào hệ thống!`
      )
    ) {
      return;
    }

    setRestoringBackup(true);
    setNotice(null);

    try {
      const fd = new FormData();
      fd.append('file', restoreFile);

      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || data.message || 'Lỗi khôi phục sao lưu');
      }

      setNotice({
        ok: true,
        message: data.message || 'Khôi phục toàn bộ dữ liệu và ảnh thành công!',
      });
      setRestoreFile(null);
      router.refresh();
      loadStorageOverview();
    } catch (err: unknown) {
      setNotice({
        ok: false,
        message: err instanceof Error ? err.message : 'Lỗi trong quá trình khôi phục',
      });
    } finally {
      setRestoringBackup(false);
    }
  }

  // --- GOOGLE DRIVE BACKUP CONFIG STATE & HANDLERS ---
  const [driveConfig, setDriveConfig] = useState<GoogleDriveBackupConfig>(() => {
    return (
      siteSettings.drive_backup_config || {
        enabled: false,
        frequency_days: 5,
        auth_type: 'webhook',
        webhook_url: '',
        folder_id: '',
        client_email: '',
        private_key: '',
        last_backup_at: null,
        last_backup_status: null,
        last_backup_file: null,
      }
    );
  });
  const [savingDriveConfig, setSavingDriveConfig] = useState(false);
  const [testingDrive, setTestingDrive] = useState(false);
  const [backingUpDrive, setBackingUpDrive] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  async function handleSaveDriveConfig(e: React.FormEvent) {
    e.preventDefault();
    setSavingDriveConfig(true);
    setNotice(null);
    try {
      const res = await saveGoogleDriveConfigAction(driveConfig);
      setNotice(res);
      if (res.ok) router.refresh();
    } catch (err: unknown) {
      setNotice({
        ok: false,
        message: err instanceof Error ? err.message : 'Lỗi lưu cấu hình Google Drive',
      });
    } finally {
      setSavingDriveConfig(false);
    }
  }

  async function handleTestDriveConnection() {
    setTestingDrive(true);
    setNotice(null);
    try {
      const res = await testGoogleDriveConnectionAction(driveConfig);
      setNotice(res);
    } catch (err: unknown) {
      setNotice({
        ok: false,
        message: err instanceof Error ? err.message : 'Lỗi kiểm tra kết nối Google Drive',
      });
    } finally {
      setTestingDrive(false);
    }
  }

  async function handleTriggerDriveBackup() {
    if (
      !window.confirm(
        'Bạn có muốn tiến hành đóng gói toàn bộ Database và ảnh rồi tải lên Google Drive ngay bây giờ không?'
      )
    ) {
      return;
    }

    setBackingUpDrive(true);
    setNotice(null);
    try {
      const res = await triggerManualDriveBackupAction();
      setNotice(res);
      if (res.ok) {
        setDriveConfig((prev) => ({
          ...prev,
          last_backup_at: new Date().toISOString(),
          last_backup_status: 'success',
        }));
        router.refresh();
      }
    } catch (err: unknown) {
      setNotice({
        ok: false,
        message: err instanceof Error ? err.message : 'Lỗi trong quá trình sao lưu lên Drive',
      });
    } finally {
      setBackingUpDrive(false);
    }
  }

  const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var bytes = Utilities.base64Decode(data.fileData);
    var blob = Utilities.newBlob(bytes, data.mimeType || 'application/zip', data.filename);
    var folder = (data.folderId && data.folderId.trim()) 
      ? DriveApp.getFolderById(data.folderId.trim()) 
      : DriveApp.getRootFolder();
    var file = folder.createFile(blob);
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      fileId: file.getId(),
      fileName: file.getName(),
      fileUrl: file.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  function handleCopyAppsScript() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  // Danh sách 8 sản phẩm đang hiển thị ở Trang chủ (sắp xếp theo thứ tự bật home_order tăng dần)
  const featuredHomeProducts = productsList
    .filter((p) => p.is_featured)
    .sort((a, b) => (a.home_order || 999999) - (b.home_order || 999999))
    .slice(0, 8);

  const homeSlotMap = new Map<string, number>();
  featuredHomeProducts.forEach((fp, idx) => {
    homeSlotMap.set(fp.id, idx + 1);
  });

  const filteredProducts = productsList.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const catName = categories.find((c) => c.id === p.category_id)?.name || '';
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      catName.toLowerCase().includes(q) ||
      (p.category_id || '').toLowerCase().includes(q);

    const matchesCategory =
      selectedProductCategory === 'all' ||
      p.category_id === selectedProductCategory;

    const matchesIndustry =
      selectedProductIndustry === 'all' ||
      p.industry_id === selectedProductIndustry ||
      (p.industry_ids && p.industry_ids.includes(selectedProductIndustry));

    const matchesHome =
      selectedHomeFilter === 'all' ||
      (selectedHomeFilter === 'home' && Boolean(p.is_featured)) ||
      (selectedHomeFilter === 'hidden' && !p.is_featured);

    return matchesSearch && matchesCategory && matchesIndustry && matchesHome;
  });
  const paginatedProducts = filteredProducts.slice(
    (prodPage - 1) * prodPageSize,
    prodPage * prodPageSize
  );

  const paginatedIndustries = industriesList.slice(
    (indPage - 1) * IND_PAGE_SIZE,
    indPage * IND_PAGE_SIZE
  );

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category_name.toLowerCase().includes(q);
    const matchesCategory =
      selectedPostCategory === 'all' ||
      p.category_name.toLowerCase().includes(selectedPostCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });
  const paginatedPosts = filteredPosts.slice(
    (postPage - 1) * postPageSize,
    postPage * postPageSize
  );

  const paginatedCategories = categories.slice(
    (catPage - 1) * CAT_PAGE_SIZE,
    catPage * CAT_PAGE_SIZE
  );

  const paginatedInquiries = inquiries.slice(
    (inqPage - 1) * INQ_PAGE_SIZE,
    inqPage * INQ_PAGE_SIZE
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#eff6ff]/70 flex flex-col lg:flex-row overflow-hidden font-sans text-slate-800">
      {/* =====================================================================
          MOBILE & TABLET STICKY TOP BAR (< lg)
         ===================================================================== */}
      <header className="lg:hidden h-14 bg-gradient-to-r from-[#072554] via-[#0c4a8a] to-[#072554] border-b border-[#041733] px-4 flex items-center justify-between shrink-0 z-30 text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Mở menu quản trị"
            className="w-9 h-9 rounded-xl bg-white/15 text-white border border-white/20 flex items-center justify-center hover:bg-white/25 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="bg-white rounded-lg px-2.5 py-1 flex items-center shadow-2xs">
            <img
              src="/logo.webp"
              alt={siteSettings.company_name}
              width={110}
              height={26}
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sky-300/30 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:brightness-110 text-white font-bold text-[11px] transition shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem Web</span>
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* =====================================================================
          LEFT SIDEBAR (DRAWER ON MOBILE, FIXED ON DESKTOP - HOME HEADER THEME)
         ===================================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-gradient-to-b from-[#072554] via-[#0c4a8a] to-[#072554] text-white border-r border-[#041733] flex flex-col justify-between shrink-0 select-none transform transition-transform duration-200 lg:static lg:translate-x-0 shadow-2xl ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto space-y-6">
          {/* Brand Header with /logo.webp */}
          <div className="px-1 pt-1 flex items-start justify-between gap-2">
            <div className="flex-1">
              <Link
                href="/admin"
                className="block bg-white rounded-2xl px-3.5 py-2.5 shadow-md hover:opacity-95 transition"
              >
                <img
                  src="/logo.webp"
                  alt={siteSettings.company_name}
                  width={160}
                  height={38}
                  className="h-9 w-auto object-contain mx-auto"
                />
              </Link>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/15 text-white border border-white/25">
                  HỆ THỐNG QUẢN TRỊ
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950/70 text-sky-200 border border-sky-400/30">
                  v2.0
                </span>
              </div>
            </div>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/15"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group 1: TỔNG QUAN */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-sky-300">
              TỔNG QUAN
            </div>
            <nav className="space-y-1">
              <button
                suppressHydrationWarning
                onClick={() => selectSection('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'dashboard'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('leads')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'leads'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Khách Tư Vấn (Leads)</span>
                </span>
                {newLeadsCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeSection === 'leads'
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-sky-950/70 text-sky-200 border border-sky-400/25'
                    }`}
                  >
                    {newLeadsCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Group 2: SẢN PHẨM & BÁO GIÁ */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-sky-300">
              SẢN PHẨM &amp; QUY CÁCH
            </div>
            <nav className="space-y-1">
              <button
                suppressHydrationWarning
                onClick={() => selectSection('products')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'products'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Sản Phẩm Màng Co</span>
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    activeSection === 'products'
                      ? 'text-white'
                      : 'text-sky-300'
                  }`}
                >
                  {products.length}
                </span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('categories')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'categories'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FolderTree className="w-4 h-4 shrink-0" />
                  <span>Thể Loại / Kiểu Dáng</span>
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    activeSection === 'categories'
                      ? 'text-white'
                      : 'text-sky-300'
                  }`}
                >
                  {categories.length}
                </span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('industries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'industries'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Factory className="w-4 h-4 shrink-0" />
                  <span>Ngành Nghề Ứng Dụng</span>
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    activeSection === 'industries'
                      ? 'text-white'
                      : 'text-sky-300'
                  }`}
                >
                  {industriesList.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Group 3: MARKETING & SHOWCASE */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-sky-300">
              MARKETING &amp; SHOWCASE
            </div>
            <nav className="space-y-1">
              <button
                suppressHydrationWarning
                onClick={() => selectSection('posts')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'posts'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Bài Viết Blog (SEO)</span>
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    activeSection === 'posts'
                      ? 'text-white'
                      : 'text-sky-300'
                  }`}
                >
                  {posts.length}
                </span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('sliders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'sliders'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Quản Lý Slider</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    activeSection === 'sliders'
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-sky-950/70 text-sky-200 border border-sky-400/25'
                  }`}
                >
                  5 slide
                </span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('banners')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'banners'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span>Quản Lý Banner</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    activeSection === 'banners'
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-sky-950/70 text-sky-200 border border-sky-400/25'
                  }`}
                >
                  2 banner
                </span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('webp')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'webp'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Folder className="w-4 h-4 shrink-0" />
                <span>Kho Ảnh WebP (Storage)</span>
              </button>
            </nav>
          </div>

          {/* Group 4: HỆ THỐNG */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-sky-300">
              HỆ THỐNG &amp; CẤU HÌNH
            </div>
            <nav className="space-y-1">
              <button
                suppressHydrationWarning
                onClick={() => selectSection('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'settings'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Cấu Hình Doanh Nghiệp</span>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => selectSection('cache')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === 'cache'
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-black shadow-md shadow-black/25 border border-sky-300/40'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Archive className="w-4 h-4 shrink-0" />
                <span>Sao Lưu &amp; Khôi Phục</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom User Profile & Connection Card */}
        <div className="p-3.5 border-t border-sky-400/20 bg-[#041733]/80 space-y-3">
          <div className="bg-white/10 rounded-xl border border-white/15 p-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs border border-white/40 overflow-hidden">
              <img
                src="/icon_logo.webp"
                alt={siteSettings.short_name || siteSettings.company_name}
                width={32}
                height={35}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold text-white truncate">
                {siteSettings.short_name || siteSettings.company_name}
              </div>
              <div className="text-[10px] font-extrabold text-emerald-300 uppercase">
                ADMIN QUẢN TRỊ
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="text-sky-200 font-medium">Database:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 font-bold border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {supabaseConfigured ? 'Supabase Connected' : 'Local Mode'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              suppressHydrationWarning
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-sky-300/30 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:brightness-110 text-white font-bold text-[11px] transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Web</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          MAIN WORKSPACE AREA
         ===================================================================== */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* TOAST NOTICE */}
          {notice && (
            <div
              className={`p-4 rounded-2xl text-xs md:text-sm font-semibold flex items-center justify-between gap-3 border shadow-sm ${
                notice.ok
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{notice.message}</span>
              </div>
              <button suppressHydrationWarning onClick={() => setNotice(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* =================================================================
              SECTION 1: DASHBOARD TỔNG QUAN (GIỐNG Y HỆT BỐ CỤC ẢNH MẪU)
             ================================================================= */}
          {activeSection === 'dashboard' && (
            <>
              {/* Welcome Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Xin chào, Admin Quản Trị</span>
                    <span>👋</span>
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Hôm nay bạn có{' '}
                    <strong className="text-blue-600 font-bold">
                      {newLeadsCount} khách hàng
                    </strong>{' '}
                    đang chờ được liên hệ tư vấn quy cách &amp; báo giá màng co.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button suppressHydrationWarning onClick={() => handleRevalidate('all')}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                    />
                    <span>Cập nhật</span>
                  </button>
                  <button suppressHydrationWarning onClick={() => setActiveSection('leads')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white text-xs font-black shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                  >
                    <span>Xem tất cả leads</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      TỔNG ĐƠN BÁO GIÁ
                    </div>
                    <div className="text-3xl font-black text-slate-900 my-1.5">
                      {totalLeads}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Tất cả thời gian
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                      CẦN GỌI TƯ VẤN
                    </div>
                    <div className="text-3xl font-black text-blue-600 my-1.5">
                      {newLeadsCount}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Trạng thái Chờ xử lý
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                      ĐÃ BÁO GIÁ / CHỐT
                    </div>
                    <div className="text-3xl font-black text-emerald-600 my-1.5">
                      {completedLeadsCount}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Chốt đơn thành công
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600">
                      TỶ LỆ CHỐT ĐƠN
                    </div>
                    <div className="text-3xl font-black text-teal-700 my-1.5">
                      {conversionRate}%
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Yêu cầu → Khách hàng
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Quản Trị Các Phân Hệ Database (Grid 6 Cards tông Xanh Dương) */}
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 mb-3.5">
                  Quản Trị Các Phân Hệ Database
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button suppressHydrationWarning onClick={() => setActiveSection('products')}
                    className="bg-white rounded-2xl border border-blue-300 hover:border-blue-600 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Sản Phẩm Màng Co
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {products.length} Sản phẩm (.webp)
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 transition" />
                  </button>

                  <button suppressHydrationWarning onClick={() => setActiveSection('categories')}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Thể Loại / Kiểu Dáng
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {categories.length} Nhóm quy cách
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>

                  <button suppressHydrationWarning onClick={() => setActiveSection('industries')}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Factory className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Ngành Nghề Ứng Dụng
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {industriesList.length} Lĩnh vực F&amp;B, OCOP...
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>

                  <button suppressHydrationWarning onClick={() => setActiveSection('webp')}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Kho Ảnh WebP (Storage)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Nén tự động &lt;150KB
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>

                  <button suppressHydrationWarning onClick={() => setActiveSection('posts')}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Bài Viết Blog (SEO)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {posts.length} Bài viết
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>

                  <button suppressHydrationWarning onClick={() => setActiveSection('leads')}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Yêu Cầu Báo Giá (Leads)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {inquiries.length} Khách đăng ký
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>

                  <button suppressHydrationWarning onClick={() => setActiveSection('settings')}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 p-5 flex items-center justify-between text-left transition shadow-2xs hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Cấu Hình &amp; Thông Tin
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Hotline, Địa chỉ &amp; SEO
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>
                </div>
              </div>

              {/* Khách Hàng Đăng Ký Tư Vấn Gần Đây Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Khách Hàng Đăng Ký Tư Vấn Gần Đây
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cần liên hệ trong vòng 15–30 phút để tăng tỉ lệ chốt đơn
                    </p>
                  </div>
                  <button suppressHydrationWarning onClick={() => setActiveSection('leads')}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <th className="py-3.5 px-6">KHÁCH HÀNG</th>
                        <th className="py-3.5 px-4">LIÊN HỆ</th>
                        <th className="py-3.5 px-4">LOẠI MÀNG / QUY CÁCH</th>
                        <th className="py-3.5 px-4">TRẠNG THÁI</th>
                        <th className="py-3.5 px-6 text-right">HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {inquiries.slice(0, 6).map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/80">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {inq.customer_name}
                            <div className="text-[11px] text-slate-400 font-normal">
                              {new Date(inq.created_at).toLocaleString('vi-VN')}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <a
                              href={`tel:${inq.phone}`}
                              className="font-bold text-blue-700 hover:underline"
                            >
                              {inq.phone}
                            </a>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-800">
                              {inq.product_interest || 'Tư vấn màng co'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              SL: {inq.quantity_note || 'Chưa rõ'} ·{' '}
                              {inq.message || ''}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <select suppressHydrationWarning value={inq.status || 'new'}
                              onChange={(e) =>
                                handleInquiryStatus(
                                  inq.id,
                                  e.target.value as
                                    | 'new'
                                    | 'contacted'
                                    | 'quoted'
                                    | 'closed'
                                    | 'completed'
                                )
                              }
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold bg-white"
                            >
                              <option value="new">🟡 Chờ tư vấn</option>
                              <option value="contacted">🔵 Đã liên hệ</option>
                              <option value="quoted">🟢 Đã báo giá</option>
                              <option value="closed">✅ Đã chốt đơn</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button suppressHydrationWarning onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              SECTION 2: KHÁCH TƯ VẤN (LEADS FULL CRUD)
             ================================================================= */}
          {activeSection === 'leads' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Quản Lý Khách Hàng Đăng Ký Tư Vấn &amp; Báo Giá ({inquiries.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dữ liệu đổ trực tiếp từ form Báo giá trên website vào Supabase Database
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-3.5 px-6">KHÁCH HÀNG</th>
                      <th className="py-3.5 px-4">SĐT / ZALO</th>
                      <th className="py-3.5 px-4">NHU CẦU &amp; QUY CÁCH</th>
                      <th className="py-3.5 px-4">TRẠNG THÁI</th>
                      <th className="py-3.5 px-6 text-right">HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/80">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {inq.customer_name}
                          <div className="text-[11px] text-slate-400 font-normal">
                            {new Date(inq.created_at).toLocaleString('vi-VN')}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={`tel:${inq.phone}`}
                            className="font-bold text-blue-700 hover:underline block"
                          >
                            📞 {inq.phone}
                          </a>
                          <a
                            href={`https://zalo.me/${inq.phone.replace(/\s|\./g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-600 font-bold hover:underline"
                          >
                            💬 Mở Zalo
                          </a>
                        </td>
                        <td className="py-4 px-4 max-w-md">
                          <div className="font-bold text-slate-800">
                            {inq.product_interest || 'Tư vấn màng co'} (SL:{' '}
                            {inq.quantity_note || 'Chưa rõ'})
                          </div>
                          {inq.message && (
                            <p className="text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                              {inq.message}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <select suppressHydrationWarning value={inq.status || 'new'}
                            onChange={(e) =>
                              handleInquiryStatus(
                                inq.id,
                                e.target.value as
                                  | 'new'
                                  | 'contacted'
                                  | 'quoted'
                                  | 'closed'
                                  | 'completed'
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold bg-white"
                          >
                            <option value="new">🟡 Chờ tư vấn</option>
                            <option value="contacted">🔵 Đã liên hệ</option>
                            <option value="quoted">🟢 Đã gửi báo giá</option>
                            <option value="closed">✅ Đã chốt đơn</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button suppressHydrationWarning onClick={() => handleDeleteInquiry(inq.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AdminPagination
                currentPage={inqPage}
                totalItems={inquiries.length}
                pageSize={INQ_PAGE_SIZE}
                onPageChange={setInqPage}
              />
            </div>
          )}

          {/* =================================================================
              SECTION 3: SẢN PHẨM MÀNG CO (PRODUCTS FULL CRUD + AUTO WEBP)
             ================================================================= */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              {/* Top Action Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Quản Lý Sản Phẩm Màng Co ({products.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Thêm, sửa, xóa sản phẩm trực tiếp trên Database · Tự động
                    chuyển ảnh sang <code>.webp</code> trước khi lưu
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Lọc theo thể loại */}
                  <select
                    suppressHydrationWarning
                    value={selectedProductCategory}
                    onChange={(e) => {
                      setSelectedProductCategory(e.target.value);
                      setProdPage(1);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">📂 Tất cả thể loại ({products.length})</option>
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category_id === cat.id).length;
                      return (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({count})
                        </option>
                      );
                    })}
                  </select>

                  {/* Lọc theo ngành nghề */}
                  <select
                    suppressHydrationWarning
                    value={selectedProductIndustry}
                    onChange={(e) => {
                      setSelectedProductIndustry(e.target.value);
                      setProdPage(1);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">🏭 Tất cả ngành nghề ({products.length})</option>
                    {industriesList.map((ind) => {
                      const count = products.filter(
                        (p) =>
                          p.industry_id === ind.id ||
                          (p.industry_ids && p.industry_ids.includes(ind.id))
                      ).length;
                      return (
                        <option key={ind.id} value={ind.id}>
                          {ind.icon ? `${ind.icon} ` : ''}{ind.name} ({count})
                        </option>
                      );
                    })}
                  </select>

                  {/* Lọc theo hiển thị Trang chủ */}
                  <select
                    suppressHydrationWarning
                    value={selectedHomeFilter}
                    onChange={(e) => {
                      setSelectedHomeFilter(e.target.value as 'all' | 'home' | 'hidden');
                      setProdPage(1);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-blue-200 text-xs font-extrabold bg-blue-50/70 text-[#1d4ed8] focus:border-blue-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">🏠 Tất cả TT Trang chủ ({productsList.length})</option>
                    <option value="home">
                      ⭐ Đang hiện ở Trang chủ ({featuredHomeProducts.length}/8)
                    </option>
                    <option value="hidden">
                      ⚪ Chưa hiện ở Trang chủ ({productsList.length - featuredHomeProducts.length})
                    </option>
                  </select>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input suppressHydrationWarning type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setProdPage(1);
                      }}
                      placeholder="Tìm tên sản phẩm, mã SKU..."
                      className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-blue-500 focus:outline-none w-56"
                    />
                  </div>
                  <button suppressHydrationWarning onClick={() => {
                      setEditingProduct(null);
                      setProductThumbUrl('/media/products/mang-co-pvc-cuon.webp');
                      setShowProductForm(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white text-xs font-black shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm sản phẩm mới</span>
                  </button>
                </div>
              </div>

              {/* Thanh trạng thái 8 vị trí hiển thị ở Trang chủ (FIFO Queue #1 -> #8) */}
              <div className="bg-gradient-to-r from-[#eff6ff] via-white to-[#f0f9ff] rounded-2xl border border-blue-200/90 p-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#2563eb] text-white text-[11px] font-extrabold shadow-2xs">
                      HIỂN THỊ Ở TRANG CHỦ: {featuredHomeProducts.length} / 8 SẢN PHẨM
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Khi đã đủ 8 sản phẩm, bật sản phẩm thứ 9 sẽ tự động tắt tuần tự sản phẩm đứng vị trí <strong>#1</strong> và đưa sản phẩm mới vào vị trí <strong>#8</strong>.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const slotProd = featuredHomeProducts[idx];
                    return slotProd ? (
                      <div
                        key={slotProd.id}
                        className={`relative group rounded-xl border p-2 bg-white flex flex-col justify-between gap-1.5 transition ${
                          idx === 0
                            ? 'border-amber-300 ring-1 ring-amber-200/70'
                            : 'border-blue-200/80'
                        }`}
                        title={
                          idx === 0
                            ? `Vị trí #1: ${slotProd.name} (Sẽ tự động tắt đầu tiên nếu bật thêm sản phẩm thứ 9)`
                            : `Vị trí #${idx + 1}: ${slotProd.name}`
                        }
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              idx === 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-[#1d4ed8]'
                            }`}
                          >
                            #{idx + 1}
                            {idx === 0 ? ' · Tự tắt tiếp' : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleProductHome(slotProd)}
                            className="text-[10px] font-bold text-slate-400 hover:text-rose-600 transition px-1"
                            title="Tắt hiển thị trang chủ"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={slotProd.thumbnail_url}
                            alt={slotProd.name}
                            className="w-8 h-8 rounded-lg object-contain bg-[#f1f4f9] border border-slate-200 shrink-0"
                          />
                          <div className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                            {slotProd.name}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={`empty-slot-${idx}`}
                        className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-2.5 flex flex-col items-center justify-center text-center min-h-[68px]"
                      >
                        <span className="text-[10px] font-extrabold text-slate-400">
                          Ô #{idx + 1} trống
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Bật công tắc bên dưới
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer / Card Form khi bấm Thêm mới hoặc Sửa */}
              {(showProductForm || editingProduct) && (
                <form suppressHydrationWarning key={editingProduct?.id || 'create-product'}
                  onSubmit={handleSaveProduct}
                  className="bg-white rounded-2xl border-2 border-blue-500 p-6 space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {editingProduct
                        ? `✏️ Chỉnh sửa sản phẩm: ${editingProduct.name}`
                        : '➕ Thêm Sản Phẩm Màng Co Mới Lên Database'}
                    </h3>
                    <button suppressHydrationWarning type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(false);
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Đóng form
                    </button>
                  </div>

                  {editingProduct && (
                    <input suppressHydrationWarning type="hidden" name="id" value={editingProduct.id} />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tên sản phẩm *
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="name"
                        required
                        defaultValue={editingProduct?.name || ''}
                        placeholder="VD: Màng Co PVC Bọc Giỏ Quà Tết"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Thể loại / Kiểu dáng
                      </label>
                      <select suppressHydrationWarning name="category_id"
                        defaultValue={editingProduct?.category_id || categories[0]?.id || 'cat-thuc-pham'}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ngành nghề ứng dụng
                      </label>
                      <select suppressHydrationWarning name="industry_id"
                        defaultValue={editingProduct?.industry_id || ''}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                      >
                        <option value="">-- Chọn ngành nghề --</option>
                        {industriesList.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.icon ? `${ind.icon} ` : ''}{ind.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Đơn giá hiển thị *
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="price_label"
                        required
                        defaultValue={
                          editingProduct?.price_label || '42.000đ - 48.000đ / kg'
                        }
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mã SKU
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="sku"
                        defaultValue={editingProduct?.sku || ''}
                        placeholder="PVC-CUON-01"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Slug URL (Để trống tự tạo)
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="slug"
                        defaultValue={editingProduct?.slug || ''}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* WebP Image Uploader */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                      <img
                        src={productThumbUrl}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-blue-300 bg-white shrink-0"
                      />
                      <div className="flex-1">
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          Ảnh đại diện WebP trên Supabase Storage
                        </label>
                        <input suppressHydrationWarning type="text"
                          name="thumbnail_url"
                          value={productThumbUrl}
                          onChange={(e) => setProductThumbUrl(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingImage
                          ? 'Đang đổi sang .webp...'
                          : 'Tải ảnh mới (Tự đổi sang .webp)'}
                      </span>
                      <input suppressHydrationWarning type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) convertAndUploadWebP(f, 'product');
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MarkdownEditor
                      name="short_description"
                      label="Mô tả ngắn chuẩn SEO (Markdown)"
                      compact
                      rows={3}
                      defaultValue={editingProduct?.short_description || ''}
                      placeholder="Nhập tóm tắt sản phẩm (nếu để trống sẽ tự lấy từ nội dung chi tiết)..."
                      helperText="Hỗ trợ **in đậm**, *in nghiêng*, danh sách"
                      folder="products"
                    />
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Thông số kỹ thuật (Mỗi dòng: Tên: Giá trị)
                        </label>
                        <span className="text-[11px] text-slate-400">
                          VD: Chất liệu: Nhựa PVC
                        </span>
                      </div>
                      <textarea
                        suppressHydrationWarning
                        name="specs_json"
                        rows={4}
                        defaultValue={formatSpecsToLines(editingProduct?.specs)}
                        placeholder={`Chất liệu: Nhựa PVC nguyên sinh 100%\nĐộ dày phổ biến: 15 – 40 micron\nKhổ rộng cuộn: 80mm – 800mm`}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed focus:border-[#2563eb] focus:outline-none"
                      />
                    </div>
                  </div>

                  <MarkdownEditor
                    name="content"
                    label="Mô tả & Nội dung chi tiết sản phẩm (Markdown)"
                    rows={8}
                    defaultValue={editingProduct?.content || ''}
                    placeholder="Soạn mô tả chi tiết bằng Markdown: ## Tiêu đề mục, **in đậm**, - gạch đầu dòng, bảng quy cách, chèn ảnh .webp..."
                    helperText="Có thể bấm 'Song song' hoặc 'Xem trước' để xem kết quả ngay"
                    folder="products"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-blue-50/80 border border-blue-200 px-3.5 py-2.5 rounded-xl cursor-pointer">
                      <input suppressHydrationWarning type="checkbox"
                        name="is_featured"
                        value="true"
                        defaultChecked={
                          editingProduct ? editingProduct.is_featured : false
                        }
                        className="w-4 h-4 accent-[#2563eb] rounded cursor-pointer"
                      />
                      <span>
                        Hiển thị ở Trang chủ (Tối đa 8 SP — Nếu đã mở đủ 8 SP, bật thêm SP thứ 9 sẽ tự động tắt tuần tự SP đầu tiên)
                      </span>
                    </label>

                    <button suppressHydrationWarning type="submit"
                      disabled={loading || uploadingImage}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                    >
                      {loading
                        ? 'Đang lưu vào Database...'
                        : editingProduct
                          ? '💾 Lưu Cập Nhật Sản Phẩm'
                          : '➕ Tạo Sản Phẩm Mới'}
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <th className="py-3.5 px-6">SẢN PHẨM</th>
                        <th className="py-3.5 px-4">THỂ LOẠI</th>
                        <th className="py-3.5 px-4 text-center">HIỂN THỊ TRANG CHỦ (TỐI ĐA 8)</th>
                        <th className="py-3.5 px-4">MÃ SKU</th>
                        <th className="py-3.5 px-4">ĐƠN GIÁ HIỂN THỊ</th>
                        <th className="py-3.5 px-4">FILE ẢNH WEBP</th>
                        <th className="py-3.5 px-6 text-right">HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {paginatedProducts.map((p) => {
                        const homeSlot = homeSlotMap.get(p.id);
                        const isHomeActive = Boolean(p.is_featured && homeSlot);
                        return (
                        <tr key={p.id} className="hover:bg-slate-50/80">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={p.thumbnail_url}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-contain bg-[#f1f4f9] border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  <code>/san-pham/{p.slug}</code>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] whitespace-nowrap border border-blue-100">
                                {categories.find((c) => c.id === p.category_id)?.name || 'Màng co'}
                              </span>
                              {p.industry_id && (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] whitespace-nowrap border border-emerald-100">
                                  {industriesList.find((i) => i.id === p.industry_id)?.icon || '🏭'}{' '}
                                  {industriesList.find((i) => i.id === p.industry_id)?.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex flex-col items-center gap-1">
                              <button
                                suppressHydrationWarning
                                type="button"
                                disabled={togglingHomeId === p.id}
                                onClick={() => handleToggleProductHome(p)}
                                role="switch"
                                aria-checked={isHomeActive}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                                  isHomeActive ? 'bg-[#2563eb]' : 'bg-slate-200'
                                }`}
                                title={
                                  isHomeActive
                                    ? `Đang hiển thị ở Trang chủ (Vị trí #${homeSlot}/8) — Bấm để tắt`
                                    : featuredHomeProducts.length >= 8
                                      ? `Bấm để bật hiển thị ở Trang chủ (Sẽ tự động tắt SP #1: ${featuredHomeProducts[0]?.name || ''})`
                                      : 'Bấm để bật hiển thị ở Trang chủ'
                                }
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                    isHomeActive ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              {isHomeActive ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    homeSlot === 1
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-blue-50 text-[#1d4ed8] border border-blue-200'
                                  }`}
                                >
                                  Vị trí #{homeSlot}/8
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-400">
                                  Đang tắt
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-600">
                            {p.sku || '—'}
                          </td>
                          <td className="py-4 px-4 font-bold text-blue-700">
                            {p.price_label}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px]">
                              .webp
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button suppressHydrationWarning onClick={() => {
                                  setEditingProduct(p);
                                  setProductThumbUrl(p.thumbnail_url);
                                  setShowProductForm(true);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sửa</span>
                              </button>
                              <button suppressHydrationWarning onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <AdminPagination
                  currentPage={prodPage}
                  totalItems={filteredProducts.length}
                  pageSize={prodPageSize}
                  onPageChange={setProdPage}
                  onPageSizeChange={(newSize) => {
                    setProdPageSize(newSize);
                    setProdPage(1);
                  }}
                  pageSizeOptions={[5, 6, 8, 12, 20]}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 4: BÀI VIẾT BLOG SEO (POSTS FULL CRUD + AUTO WEBP)
             ================================================================= */}
          {activeSection === 'posts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Quản Lý Bài Viết Blog SEO ({posts.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Phân nhóm theo 4 trang trụ cột: Màng Co PVC, Màng Co POF,
                    Màng Co Nhiệt, Màng Co PE
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Lọc chuyên mục bài viết */}
                  <select
                    suppressHydrationWarning
                    value={selectedPostCategory}
                    onChange={(e) => {
                      setSelectedPostCategory(e.target.value);
                      setPostPage(1);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">📂 Tất cả chuyên mục ({posts.length})</option>
                    {['Màng Co PVC', 'Màng Co POF', 'Màng Co Nhiệt', 'Màng Co PE'].map((cName) => {
                      const count = posts.filter((p) => p.category_name.toLowerCase() === cName.toLowerCase()).length;
                      return (
                        <option key={cName} value={cName}>
                          {cName} ({count})
                        </option>
                      );
                    })}
                  </select>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input suppressHydrationWarning type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPostPage(1);
                      }}
                      placeholder="Tìm tiêu đề bài viết..."
                      className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:outline-none w-56"
                    />
                  </div>
                  <button suppressHydrationWarning onClick={() => {
                      setEditingPost(null);
                      setPostThumbUrl('/media/products/mang-co-pvc-cuon.webp');
                      setShowPostForm(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white text-xs font-black shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Viết bài SEO mới</span>
                  </button>
                </div>
              </div>

              {(showPostForm || editingPost) && (
                <form suppressHydrationWarning key={editingPost?.id || 'create-post'}
                  onSubmit={handleSavePost}
                  className="bg-white rounded-2xl border-2 border-blue-500 p-6 space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {editingPost
                        ? `✏️ Sửa bài viết: ${editingPost.title}`
                        : '➕ Đăng Bài Viết SEO Mới Lên Database'}
                    </h3>
                    <button suppressHydrationWarning type="button"
                      onClick={() => {
                        setEditingPost(null);
                        setShowPostForm(false);
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Đóng form
                    </button>
                  </div>

                  {editingPost && (
                    <input suppressHydrationWarning type="hidden" name="id" value={editingPost.id} />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tiêu đề bài viết (H1) *
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="title"
                        required
                        defaultValue={editingPost?.title || ''}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chuyên mục trụ cột
                      </label>
                      <select suppressHydrationWarning name="category_name"
                        defaultValue={
                          editingPost?.category_name || 'Màng Co PVC'
                        }
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                      >
                        <option value="Màng Co PVC">Màng Co PVC</option>
                        <option value="Màng Co POF">Màng Co POF</option>
                        <option value="Màng Co Nhiệt">Màng Co Nhiệt</option>
                        <option value="Màng Co PE">Màng Co PE</option>
                      </select>
                    </div>
                  </div>

                  {/* Slug URL & Thời gian đọc */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Đường dẫn URL bài viết (Slug SEO)
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="slug"
                        defaultValue={editingPost?.slug || ''}
                        placeholder="Để trống sẽ tự động tạo theo tiêu đề bài viết"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono text-slate-700 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Thời gian đọc (phút)
                      </label>
                      <input suppressHydrationWarning type="number"
                        name="reading_time"
                        defaultValue={editingPost?.reading_time || 4}
                        min={1}
                        max={60}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono text-slate-700 bg-white"
                      />
                    </div>
                  </div>

                  {/* WebP Uploader */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                      <img
                        src={postThumbUrl}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-blue-300 bg-white shrink-0"
                      />
                      <div className="flex-1">
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          Ảnh đại diện bài viết (.webp trên Supabase Storage)
                        </label>
                        <input suppressHydrationWarning type="text"
                          name="thumbnail_url"
                          value={postThumbUrl}
                          onChange={(e) => setPostThumbUrl(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingImage
                          ? 'Đang đổi sang .webp...'
                          : 'Chọn ảnh từ máy (Tự đổi .webp)'}
                      </span>
                      <input suppressHydrationWarning type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) convertAndUploadWebP(f, 'post');
                        }}
                      />
                    </label>
                  </div>

                  <MarkdownEditor
                    name="excerpt"
                    label="Mô tả ngắn / Đoạn trích dẫn SEO (Markdown)"
                    compact
                    rows={3}
                    defaultValue={editingPost?.excerpt || ''}
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết (nếu để trống sẽ tự trích từ bài viết)..."
                    helperText="Hiển thị ở thẻ bài viết và Meta Description"
                    folder="posts"
                  />

                  <MarkdownEditor
                    name="content"
                    label="Nội dung bài viết chi tiết (Markdown)"
                    rows={10}
                    required
                    defaultValue={editingPost?.content || ''}
                    placeholder="Soạn bài viết bằng Markdown: ## Tiêu đề H2, ### Tiêu đề H3, **in đậm**, - danh sách, bảng so sánh, chèn ảnh .webp..."
                    helperText="Hỗ trợ đầy đủ Markdown + Xem trước trực tiếp"
                    folder="posts"
                  />

                  <div className="flex justify-end">
                    <button suppressHydrationWarning type="submit"
                      disabled={loading || uploadingImage}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                    >
                      {loading
                        ? 'Đang lưu vào Database...'
                        : editingPost
                          ? '💾 Lưu Cập Nhật Bài Viết'
                          : '➕ Xuất Bản Bài Viết'}
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <th className="py-3.5 px-6">BÀI VIẾT</th>
                        <th className="py-3.5 px-4">CHUYÊN MỤC</th>
                        <th className="py-3.5 px-4">ẢNH WEBP</th>
                        <th className="py-3.5 px-6 text-right">HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {paginatedPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={post.thumbnail_url}
                                alt={post.title}
                                className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {post.title}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  <code>/tin-tuc/{post.slug}</code>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                              {post.category_name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px]">
                              .webp
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button suppressHydrationWarning onClick={() => {
                                  setEditingPost(post);
                                  setPostThumbUrl(post.thumbnail_url);
                                  setShowPostForm(true);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sửa</span>
                              </button>
                              <button suppressHydrationWarning onClick={() =>
                                  handleDeletePost(post.id, post.title)
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <AdminPagination
                  currentPage={postPage}
                  totalItems={filteredPosts.length}
                  pageSize={postPageSize}
                  onPageChange={setPostPage}
                  onPageSizeChange={(newSize) => {
                    setPostPageSize(newSize);
                    setPostPage(1);
                  }}
                  pageSizeOptions={[5, 6, 8, 12, 20]}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 5: DANH MỤC DÒNG MÀNG (CATEGORIES CRUD)
             ================================================================= */}
          {activeSection === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form suppressHydrationWarning key={editingCategory ? editingCategory.id : `new-cat-${catFormKey}`}
                onSubmit={handleSaveCategory}
                className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs h-fit"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingCategory
                      ? `✏️ Sửa danh mục: ${editingCategory.name}`
                      : '➕ Thêm Danh Mục Dòng Màng'}
                  </h3>
                  {editingCategory && (
                    <button suppressHydrationWarning type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryThumbUrl('');
                        setCatFormKey((k) => k + 1);
                      }}
                      className="text-xs font-bold text-rose-600"
                    >
                      Hủy
                    </button>
                  )}
                </div>

                {editingCategory && (
                  <input suppressHydrationWarning type="hidden" name="id" value={editingCategory.id} />
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên danh mục *
                  </label>
                  <input suppressHydrationWarning type="text"
                    name="name"
                    required
                    defaultValue={editingCategory?.name || ''}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Slug URL
                    </label>
                    <input suppressHydrationWarning type="text"
                      name="slug"
                      defaultValue={editingCategory?.slug || ''}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thứ tự
                    </label>
                    <input suppressHydrationWarning type="number"
                      name="sort_order"
                      defaultValue={
                        editingCategory?.sort_order ?? categories.length + 1
                      }
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Category Image Uploader */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="flex items-center gap-3">
                    {categoryThumbUrl ? (
                      <img
                        src={categoryThumbUrl}
                        alt="Category preview"
                        className="w-14 h-14 rounded-lg object-cover border border-blue-300 bg-white shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg border border-dashed border-blue-300 bg-white flex items-center justify-center text-blue-400 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Ảnh đại diện danh mục (WebP trên Supabase)
                      </label>
                      <input
                        suppressHydrationWarning
                        type="text"
                        name="image_url"
                        value={categoryThumbUrl}
                        onChange={(e) => setCategoryThumbUrl(e.target.value)}
                        placeholder="/media/posts/ung-dung-mang-co-pvc.webp"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingImage
                        ? 'Đang đổi sang .webp...'
                        : 'Chọn ảnh danh mục (Tự đổi .webp)'}
                    </span>
                    <input
                      suppressHydrationWarning
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) convertAndUploadWebP(f, 'category');
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <textarea suppressHydrationWarning name="description"
                    rows={3}
                    defaultValue={editingCategory?.description || ''}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <button suppressHydrationWarning type="submit"
                  disabled={loading || uploadingImage}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all cursor-pointer"
                >
                  {editingCategory
                    ? '💾 Lưu Cập Nhật Danh Mục'
                    : '➕ Tạo Danh Mục Mới'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <h3 className="text-base font-extrabold text-slate-900 mb-4">
                  Danh Sách Danh Mục Trụ Cột ({categories.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {paginatedCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="py-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {cat.image_url ? (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <Folder className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm text-slate-900">
                            #{cat.sort_order} · {cat.name}{' '}
                            <code className="text-xs text-blue-700 font-normal">
                              /{cat.slug}
                            </code>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button suppressHydrationWarning onClick={() => {
                          setEditingCategory(cat);
                          setCategoryThumbUrl(cat.image_url || '');
                        }}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200"
                        >
                          Sửa
                        </button>
                        <button suppressHydrationWarning onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <AdminPagination
                  currentPage={catPage}
                  totalItems={categories.length}
                  pageSize={CAT_PAGE_SIZE}
                  onPageChange={setCatPage}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 5.1: NGÀNH NGHỀ ỨNG DỤNG (INDUSTRIES CRUD)
             ================================================================= */}
          {activeSection === 'industries' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                suppressHydrationWarning
                key={editingIndustry ? editingIndustry.id : `new-ind-${indFormKey}`}
                onSubmit={handleSaveIndustry}
                className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs h-fit"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingIndustry
                      ? `✏️ Sửa ngành nghề: ${editingIndustry.name}`
                      : '➕ Thêm Ngành Nghề Ứng Dụng'}
                  </h3>
                  {editingIndustry && (
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => {
                        setEditingIndustry(null);
                        setIndustryThumbUrl('');
                        setIndFormKey((k) => k + 1);
                      }}
                      className="text-xs font-bold text-rose-600"
                    >
                      Hủy
                    </button>
                  )}
                </div>

                {editingIndustry && (
                  <input
                    suppressHydrationWarning
                    type="hidden"
                    name="id"
                    value={editingIndustry.id}
                  />
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên ngành nghề ứng dụng *
                  </label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    name="name"
                    required
                    placeholder="VD: Nước Giải Khát & Đồ Uống"
                    defaultValue={editingIndustry?.name || ''}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Slug URL
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      name="slug"
                      placeholder="nuoc-giai-khat-do-uong"
                      defaultValue={editingIndustry?.slug || ''}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Icon phụ (Emoji)
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      name="icon"
                      placeholder="🥤, 🍪, 🌾, 🧊, 💄, 📦..."
                      defaultValue={editingIndustry?.icon || '📦'}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Hình ảnh đại diện ngành nghề */}
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Hình ảnh đại diện bao bì ngành nghề (WebP)
                  </label>

                  <div className="flex items-center gap-3">
                    {industryThumbUrl ? (
                      <img
                        src={industryThumbUrl}
                        alt="Industry preview"
                        className="w-16 h-16 rounded-xl object-cover border border-blue-300 bg-white shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0 text-xl">
                        {editingIndustry?.icon || '🏭'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        suppressHydrationWarning
                        type="text"
                        name="image_url"
                        value={industryThumbUrl}
                        onChange={(e) => setIndustryThumbUrl(e.target.value)}
                        placeholder="/media/categories/mang-co-pvc.webp"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingImage
                        ? 'Đang đổi sang .webp...'
                        : 'Chọn ảnh ngành nghề (Tự đổi .webp)'}
                    </span>
                    <input
                      suppressHydrationWarning
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) convertAndUploadWebP(f, 'industry', 'industries');
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nhãn nổi bật (Badge)
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      name="tag"
                      placeholder="VD: Chống tràn 100%, Chuẩn FDA..."
                      defaultValue={editingIndustry?.tag || ''}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thứ tự
                    </label>
                    <input
                      suppressHydrationWarning
                      type="number"
                      name="sort_order"
                      defaultValue={
                        editingIndustry?.sort_order ?? industriesList.length + 1
                      }
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mô tả đặc thù bảo quản &amp; ứng dụng
                  </label>
                  <textarea
                    suppressHydrationWarning
                    name="description"
                    rows={3}
                    placeholder="Màng co bọc lốc lon, lốc chai nước ngọt..."
                    defaultValue={editingIndustry?.description || ''}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all cursor-pointer"
                >
                  {editingIndustry
                    ? '💾 Lưu Cập Nhật Ngành Nghề'
                    : '➕ Tạo Ngành Nghề Mới'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <h3 className="text-base font-extrabold text-slate-900 mb-4">
                  Danh Sách Ngành Nghề Ứng Dụng ({industriesList.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {paginatedIndustries.map((ind) => {
                    const productCount = products.filter(
                      (p) =>
                        p.industry_id === ind.id ||
                        (p.industry_ids && p.industry_ids.includes(ind.id))
                    ).length;

                    return (
                      <div
                        key={ind.id}
                        className="py-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {ind.image_url ? (
                            <img
                              src={ind.image_url}
                              alt={ind.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-2xl shrink-0">
                              {ind.icon || '📦'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-slate-900">
                                #{ind.sort_order} · {ind.name}
                              </span>
                              {ind.tag && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {ind.tag}
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                {productCount} sản phẩm
                              </span>
                            </div>
                            <div className="text-xs text-blue-700 font-mono mt-0.5">
                              /{ind.slug}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {ind.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            suppressHydrationWarning
                            onClick={() => {
                              setEditingIndustry(ind);
                              setIndustryThumbUrl(ind.image_url || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100"
                          >
                            Sửa
                          </button>
                          <button
                            suppressHydrationWarning
                            onClick={() =>
                              handleDeleteIndustry(ind.id, ind.name)
                            }
                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AdminPagination
                  currentPage={indPage}
                  totalItems={industriesList.length}
                  pageSize={IND_PAGE_SIZE}
                  onPageChange={setIndPage}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 6: KHO ẢNH WEBP (STORAGE)
             ================================================================= */}
          {activeSection === 'webp' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Kho Ảnh WebP &amp; Quản Lý Thư Mục Supabase Storage</span>
                  </h2>
                  <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
                    Tất cả ảnh tải lên được nén chuẩn <strong>WebP (&lt;150KB)</strong> và tự động phân tách vào <strong>thư mục riêng theo loại (posts, products, banners, uploads)</strong> và <strong>thư mục con theo từng ngày đăng (YYYY-MM-DD)</strong>.
                  </p>
                </div>
                <button
                  suppressHydrationWarning
                  onClick={() => loadStorageOverview()}
                  disabled={loadingStorage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingStorage ? 'animate-spin' : ''}`}
                  />
                  <span>Làm mới danh mục Storage</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* UPLOADER VÀ CẤU HÌNH THƯ MỤC NGÀY ĐĂNG */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Tải Ảnh Mới Lên Thư Mục Chỉ Định</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chọn thư mục loại và ngày đăng trước khi chọn ảnh tải lên.
                    </p>
                  </div>

                  {/* Chọn thư mục chính */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-blue-600" />
                      <span>Thư mục chính trên Supabase:</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'categories', label: '🏷️ categories (Danh mục)', desc: 'Ảnh đại diện dòng màng' },
                        { id: 'posts', label: '📝 posts (Bài viết)', desc: 'Ảnh tin tức & blog' },
                        { id: 'products', label: '📦 products (Sản phẩm)', desc: 'Ảnh mẫu bao bì & cuộn' },
                        { id: 'banners', label: '🖼️ banners (Banner)', desc: 'Ảnh trang chủ & logo' },
                        { id: 'uploads', label: '📁 uploads (Chung)', desc: 'Tài nguyên tổng hợp' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          suppressHydrationWarning
                          onClick={() => setSelectedStorageFolder(item.id as any)}
                          className={`text-left p-2.5 rounded-xl border text-xs transition ${
                            selectedStorageFolder === item.id
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <div className="font-extrabold">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chọn ngày đăng */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Thư mục con theo ngày đăng (YYYY-MM-DD):</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        suppressHydrationWarning
                        type="date"
                        value={selectedStorageDate}
                        onChange={(e) => setSelectedStorageDate(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono font-bold text-slate-900 bg-slate-50"
                      />
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          const now = new Date();
                          const today = new Intl.DateTimeFormat('en-CA', {
                            timeZone: 'Asia/Ho_Chi_Minh',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }).format(now);
                          setSelectedStorageDate(today);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-600"
                      >
                        Hôm nay
                      </button>
                    </div>
                  </div>

                  {/* Xem trước đường dẫn lưu */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                    <span className="text-slate-500 font-medium">Đường dẫn tự động lưu trên Supabase Storage:</span>
                    <div className="font-mono text-blue-700 font-bold break-all">
                      media/{selectedStorageFolder}/{selectedStorageDate}/[tên-file].webp
                    </div>
                  </div>

                  {/* Vùng Drop/Upload File */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 hover:bg-blue-50/40 rounded-2xl p-6 cursor-pointer transition text-center">
                    <Upload className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-extrabold text-slate-900">
                      {uploadingImage
                        ? 'Đang nén sang .webp & tải lên Supabase...'
                        : 'Bấm chọn ảnh để nén & lưu vào thư mục trên'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Tự động thu phóng ≤1200px · Đầu ra: chuẩn .webp
                    </span>
                    <input
                      suppressHydrationWarning
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) convertAndUploadWebP(f, 'standalone');
                      }}
                    />
                  </label>

                  {compressionStats && (
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-emerald-800 font-bold">
                        <span>Đã lưu thành công:</span>
                        <span className="text-emerald-600">
                          {compressionStats.originalKB}KB → {compressionStats.compressedKB}KB
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          suppressHydrationWarning
                          type="text"
                          readOnly
                          value={compressionStats.url}
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs text-blue-700"
                        />
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => handleCopyUrl(compressionStats.url)}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 bg-white text-slate-700"
                          title="Sao chép link"
                        >
                          {copiedUrl === compressionStats.url ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* DANH SÁCH THƯ MỤC & ẢNH TRÊN SUPABASE */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-blue-600" />
                        <span>Cây Thư Mục &amp; Ảnh Đang Chạy Trên Supabase</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Phân cấp theo từng loại thư mục và ngày đăng tải
                      </p>
                    </div>

                    {/* Thống kê nhanh & Bộ lọc ảnh */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setStorageFilter('all')}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          storageFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Tất cả ({storageStats.total})
                      </button>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setStorageFilter('unused')}
                        className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                          storageFilter === 'unused'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'text-amber-700 hover:text-amber-800'
                        }`}
                      >
                        <span>⚠️ Chưa dùng</span>
                        <span className="text-[10px] bg-black/10 px-1 py-0.2 rounded-full">
                          {storageStats.unused}
                        </span>
                      </button>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setStorageFilter('used')}
                        className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                          storageFilter === 'used'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-emerald-700 hover:text-emerald-800'
                        }`}
                      >
                        <span>✓ Đang dùng</span>
                        <span className="text-[10px] bg-black/10 px-1 py-0.2 rounded-full">
                          {storageStats.used}
                        </span>
                      </button>
                    </div>
                  </div>

                  {loadingStorage && (
                    <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Đang tải danh sách thư mục từ Supabase Storage...</span>
                    </div>
                  )}

                  {!loadingStorage && (!storageFolders || storageFolders.length === 0) && (
                    <div className="py-8 text-center text-xs text-slate-500">
                      Chưa tải dữ liệu thư mục. Bấm{' '}
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => loadStorageOverview()}
                        className="text-blue-600 underline font-bold"
                      >
                        Làm mới
                      </button>{' '}
                      để nạp danh sách ảnh.
                    </div>
                  )}

                  {!loadingStorage && storageFolders && (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                      {storageFolders.map((grp) => {
                        const filterFn = (f: { url: string; name: string }) => {
                          if (storageFilter === 'all') return true;
                          const inUse = checkImageUsage(f.url, f.name).inUse;
                          return storageFilter === 'unused' ? !inUse : inUse;
                        };

                        const visibleRoot = grp.rootFiles.filter(filterFn);
                        const visibleDates = grp.dates
                          .map((d) => ({
                            ...d,
                            files: d.files.filter(filterFn),
                          }))
                          .filter((d) => (storageFilter === 'all' ? true : d.files.length > 0));

                        const totalVisible =
                          visibleRoot.length +
                          visibleDates.reduce((acc, d) => acc + d.files.length, 0);

                        if (storageFilter !== 'all' && totalVisible === 0) {
                          return null;
                        }

                        return (
                          <div
                            key={grp.folder}
                            className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/30"
                          >
                            {/* Folder Title Header */}
                            <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Folder className="w-4 h-4 text-blue-600" />
                                <span className="font-mono font-bold text-xs text-slate-900">
                                  media/{grp.folder}/
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                {totalVisible} ảnh
                              </span>
                            </div>

                            <div className="p-3 space-y-3">
                              {/* Subfolders by Date */}
                              {visibleDates.map((d) => (
                                <div
                                  key={d.date}
                                  className="rounded-lg border border-blue-200/60 bg-blue-50/40 p-2.5 space-y-2"
                                >
                                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                                    <div className="flex items-center gap-1.5 font-mono">
                                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                      <span>📅 {d.date}/</span>
                                    </div>
                                    <span className="text-[10px] text-blue-700 font-semibold">
                                      {d.files.length} ảnh
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {d.files.map((file) => {
                                      const usage = checkImageUsage(file.url, file.name);
                                      const isDeleting = deletingStorageUrl === file.url;

                                      return (
                                        <div
                                          key={file.url}
                                          className={`p-2 rounded-lg bg-white border flex items-center gap-2 shadow-2xs transition ${
                                            usage.inUse
                                              ? 'border-slate-200'
                                              : 'border-amber-200/80 bg-amber-50/20'
                                          }`}
                                        >
                                          <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-11 h-11 rounded-md object-cover border border-slate-200 bg-slate-50 shrink-0"
                                          />
                                          <div className="min-w-0 flex-1">
                                            <div
                                              className="text-[11px] font-mono text-slate-800 truncate"
                                              title={file.name}
                                            >
                                              {file.name}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                              <span className="text-[10px] text-slate-500 font-medium">
                                                {file.size
                                                  ? `${Math.round(file.size / 1024)} KB`
                                                  : 'WebP'}
                                              </span>
                                              {usage.inUse ? (
                                                <span
                                                  title={`Đang dùng tại:\n- ${usage.usedBy.join('\n- ')}`}
                                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-help"
                                                >
                                                  ✓ Đang dùng
                                                </span>
                                              ) : (
                                                <span
                                                  title="Ảnh này chưa được sử dụng ở bài viết, sản phẩm hay banner nào"
                                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-amber-50 text-amber-700 border border-amber-200/80"
                                                >
                                                  ⚠️ Chưa dùng
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              suppressHydrationWarning
                                              onClick={() => handleCopyUrl(file.url)}
                                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                                              title="Sao chép link ảnh"
                                            >
                                              {copiedUrl === file.url ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                              ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                              )}
                                            </button>

                                            <button
                                              type="button"
                                              suppressHydrationWarning
                                              disabled={isDeleting}
                                              onClick={() => handleDeleteStorageFile(file.url, file.name)}
                                              className={`p-1.5 rounded-md border transition ${
                                                usage.inUse
                                                  ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-700 border-slate-200 hover:border-amber-300'
                                                  : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200 hover:border-rose-300'
                                              }`}
                                              title={
                                                usage.inUse
                                                  ? `⚠️ Đang dùng tại: ${usage.usedBy[0]}`
                                                  : 'Xóa ảnh này khỏi Supabase Storage'
                                              }
                                            >
                                              {isDeleting ? (
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                              ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}

                              {/* Root files in this category */}
                              {visibleRoot.length > 0 && (
                                <div className="space-y-1.5">
                                  {visibleDates.length > 0 && (
                                    <div className="text-[10px] uppercase font-bold text-slate-400 px-1">
                                      Ảnh gốc thư mục:
                                    </div>
                                  )}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {visibleRoot.map((file) => {
                                      const usage = checkImageUsage(file.url, file.name);
                                      const isDeleting = deletingStorageUrl === file.url;

                                      return (
                                        <div
                                          key={file.url}
                                          className={`p-2 rounded-lg bg-white border flex items-center gap-2 shadow-2xs transition ${
                                            usage.inUse
                                              ? 'border-slate-200'
                                              : 'border-amber-200/80 bg-amber-50/20'
                                          }`}
                                        >
                                          <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-11 h-11 rounded-md object-cover border border-slate-200 bg-slate-50 shrink-0"
                                          />
                                          <div className="min-w-0 flex-1">
                                            <div
                                              className="text-[11px] font-mono text-slate-800 truncate"
                                              title={file.name}
                                            >
                                              {file.name}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                              <span className="text-[10px] text-slate-500 font-medium">
                                                {file.size
                                                  ? `${Math.round(file.size / 1024)} KB`
                                                  : 'WebP'}
                                              </span>
                                              {usage.inUse ? (
                                                <span
                                                  title={`Đang dùng tại:\n- ${usage.usedBy.join('\n- ')}`}
                                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-help"
                                                >
                                                  ✓ Đang dùng
                                                </span>
                                              ) : (
                                                <span
                                                  title="Ảnh này chưa được sử dụng ở bài viết, sản phẩm hay banner nào"
                                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-amber-50 text-amber-700 border border-amber-200/80"
                                                >
                                                  ⚠️ Chưa dùng
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              suppressHydrationWarning
                                              onClick={() => handleCopyUrl(file.url)}
                                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                                              title="Sao chép link ảnh"
                                            >
                                              {copiedUrl === file.url ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                              ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                              )}
                                            </button>

                                            <button
                                              type="button"
                                              suppressHydrationWarning
                                              disabled={isDeleting}
                                              onClick={() => handleDeleteStorageFile(file.url, file.name)}
                                              className={`p-1.5 rounded-md border transition ${
                                                usage.inUse
                                                  ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-700 border-slate-200 hover:border-amber-300'
                                                  : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200 hover:border-rose-300'
                                              }`}
                                              title={
                                                usage.inUse
                                                  ? `⚠️ Đang dùng tại: ${usage.usedBy[0]}`
                                                  : 'Xóa ảnh này khỏi Supabase Storage'
                                              }
                                            >
                                              {isDeleting ? (
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                              ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 7: CẤU HÌNH DOANH NGHIỆP, 4 MẠNG XÃ HỘI & 2 VIDEO (LINKS TABLE)
             ================================================================= */}
          {activeSection === 'settings' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* ================= CỘT TRÁI (xl:col-span-6): THÔNG TIN CÔNG TY & SEO ================= */}
              <div className="xl:col-span-6 space-y-6">
                  <form suppressHydrationWarning onSubmit={handleSaveSettings}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-7 shadow-xs space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
                          <Factory className="w-5 h-5 text-blue-600" />
                          <span>Thông Tin Doanh Nghiệp &amp; SEO</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Hiển thị trên Header, Footer, Liên hệ và thẻ Meta Google
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200/80">
                        Cột 1: Công Ty
                      </span>
                    </div>

                    {/* Hàng 1: Tên pháp lý công ty (chiếm trọn 1 hàng) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tên pháp lý công ty *
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="company_name"
                        required
                        defaultValue={siteSettings.company_name}
                        placeholder="CÔNG TY TNHH BAO BÌ THÀNH PHÁT"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>

                    {/* Hàng 2: 3 trường ngắn chia 3 cột */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Tên thương hiệu ngắn *
                        </label>
                        <input suppressHydrationWarning type="text"
                          name="short_name"
                          required
                          defaultValue={siteSettings.short_name}
                          placeholder="Bao Bì Thành Phát"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Số điện thoại &amp; Zalo *
                        </label>
                        <input suppressHydrationWarning type="text"
                          name="zalo"
                          required
                          defaultValue={siteSettings.zalo || '0935909747'}
                          placeholder="0935909747"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email tiếp nhận *
                        </label>
                        <input suppressHydrationWarning type="email"
                          name="email"
                          required
                          defaultValue={siteSettings.email}
                          placeholder="contact@mangcodanang.com"
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Địa chỉ văn phòng &amp; xưởng sản xuất *
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="address"
                        required
                        defaultValue={siteSettings.address}
                        placeholder="12 Hà Đông 2, Phường Thanh Khê, TP Đà Nẵng"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tiêu đề SEO Trang chủ (Title Tag) *
                      </label>
                      <input suppressHydrationWarning type="text"
                        name="seo_title"
                        required
                        defaultValue={siteSettings.seo_title}
                        placeholder="Xưởng Sản Xuất Màng Co PVC, POF, PE Giá Sỉ - Bao Bì Thành Phát"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mô tả SEO Trang chủ (Meta Description) *
                      </label>
                      <textarea suppressHydrationWarning name="seo_description"
                        rows={3}
                        required
                        defaultValue={siteSettings.seo_description}
                        placeholder="Chuyên sản xuất màng co PVC, POF, PE bao bì bánh kẹo, hóa mỹ phẩm, thực phẩm chất lượng cao, giá sỉ tận xưởng..."
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                      />
                    </div>

                    <button suppressHydrationWarning type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading
                        ? 'Đang lưu cấu hình...'
                        : '💾 Lưu Thông Tin Công Ty Lên Database'}
                    </button>
                  </form>
                </div>

                {/* ================= CỘT PHẢI (xl:col-span-6): QUẢN LÝ 4 LINKS & 2 VIDEOS + BẢNG LINKS DATABASE ================= */}
                <div className="xl:col-span-6 space-y-6">
                  {/* FORM SỬA 4 LINK & 2 VIDEO */}
                  <form suppressHydrationWarning onSubmit={handleSaveLinks}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-7 shadow-xs space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-indigo-600" />
                          <span>Quản Lý 4 Liên Kết &amp; 2 Video</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tùy biến 4 icon mạng xã hội và 2 video YouTube trực tiếp
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200/80">
                        Cột 2: Links &amp; Video
                      </span>
                    </div>

                    {/* PHẦN 1: 4 MẠNG XÃ HỘI */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>1. 4 Kênh Mạng Xã Hội (Header &amp; Footer)</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Hiển thị góc trên Header
                        </span>
                      </div>

                      {/* 1. Facebook */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Facebook Fanpage URL
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 fill-[#1877f2]" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </div>
                          <input suppressHydrationWarning type="url"
                            name="link_facebook"
                            required
                            defaultValue={
                              linksList.find((l) => l.id === 'facebook')?.url ||
                              siteSettings.facebook_url ||
                              'https://facebook.com'
                            }
                            placeholder="https://facebook.com/mangcothanhphat"
                            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <a
                            href={
                              linksList.find((l) => l.id === 'facebook')?.url ||
                              siteSettings.facebook_url ||
                              'https://facebook.com'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition shrink-0"
                            title="Mở kiểm tra đường dẫn"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Xem</span>
                          </a>
                        </div>
                      </div>

                      {/* 2. TikTok */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kênh TikTok Xưởng Sản Xuất URL
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                            </svg>
                          </div>
                          <input suppressHydrationWarning type="url"
                            name="link_tiktok"
                            required
                            defaultValue={
                              linksList.find((l) => l.id === 'tiktok')?.url ||
                              siteSettings.tiktok_url ||
                              'https://tiktok.com'
                            }
                            placeholder="https://tiktok.com/@mangcothanhphat"
                            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <a
                            href={
                              linksList.find((l) => l.id === 'tiktok')?.url ||
                              siteSettings.tiktok_url ||
                              'https://tiktok.com'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition shrink-0"
                            title="Mở kiểm tra đường dẫn"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Xem</span>
                          </a>
                        </div>
                      </div>

                      {/* 3. YouTube */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kênh YouTube Doanh Nghiệp URL
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 fill-[#ff0000]" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          </div>
                          <input suppressHydrationWarning type="url"
                            name="link_youtube"
                            required
                            defaultValue={
                              linksList.find((l) => l.id === 'youtube')?.url ||
                              siteSettings.youtube_url ||
                              'https://youtube.com'
                            }
                            placeholder="https://youtube.com/@baobithanhphat"
                            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <a
                            href={
                              linksList.find((l) => l.id === 'youtube')?.url ||
                              siteSettings.youtube_url ||
                              'https://youtube.com'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition shrink-0"
                            title="Mở kiểm tra đường dẫn"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Xem</span>
                          </a>
                        </div>
                      </div>

                      {/* 4. Twitter / X */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tài Khoản Twitter / X URL
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </div>
                          <input suppressHydrationWarning type="url"
                            name="link_twitter"
                            required
                            defaultValue={
                              linksList.find((l) => l.id === 'twitter')?.url ||
                              siteSettings.twitter_url ||
                              'https://twitter.com'
                            }
                            placeholder="https://twitter.com/mangcothanhphat"
                            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <a
                            href={
                              linksList.find((l) => l.id === 'twitter')?.url ||
                              siteSettings.twitter_url ||
                              'https://twitter.com'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition shrink-0"
                            title="Mở kiểm tra đường dẫn"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Xem</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 space-y-4">
                      {/* PHẦN 2: 2 VIDEO TRANG CHỦ */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-red-600" />
                          <span>2. 2 Video YouTube Xưởng Sản Xuất (Trang Chủ)</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Mục 2 &amp; Mục 11
                        </span>
                      </div>

                      {/* Video 1: Giới thiệu xưởng (Mục 2) */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-800">
                            Video 1: Giới Thiệu Xưởng (Mục 2 Trang Chủ - Về Chúng Tôi)
                          </label>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            Mục 2
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Khi khách bấm vào nút Play hoặc ảnh xưởng trên trang chủ, hệ thống sẽ mở link video này.
                        </p>
                        <div className="flex items-center gap-2">
                          <input suppressHydrationWarning type="url"
                            name="video_intro_url"
                            required
                            defaultValue={
                              linksList.find((l) => l.id === 'video_intro')?.url ||
                              siteSettings.video_intro_url ||
                              'https://www.youtube.com/watch?v=lDzM8QeIuGs'
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <a
                            href={
                              linksList.find((l) => l.id === 'video_intro')?.url ||
                              siteSettings.video_intro_url ||
                              'https://www.youtube.com/watch?v=lDzM8QeIuGs'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 transition shrink-0"
                            title="Xem video trên YouTube"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Xem</span>
                          </a>
                        </div>
                      </div>

                      {/* Video 2: Vận hành nhà xưởng (Mục 11 - Video iframe) */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-800">
                            Video 2: Khung Nhúng Trực Tiếp Vận Hành Nhà Xưởng (Mục 11 Trang Chủ)
                          </label>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                            Mục 11
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Dán link YouTube bất kỳ (dạng thường <code>watch?v=...</code> hoặc <code>embed/...</code>). Hệ thống tự động chuẩn hóa để nhúng phát trực tiếp không bị chặn.
                        </p>
                        <div className="flex items-center gap-2">
                          <input suppressHydrationWarning type="url"
                            name="video_factory_url"
                            required
                            defaultValue={
                              linksList.find((l) => l.id === 'video_factory')?.url ||
                              siteSettings.video_factory_url ||
                              'https://www.youtube.com/embed/lDzM8QeIuGs?si=6N-vPjF-LDRJ9N42'
                            }
                            placeholder="https://www.youtube.com/watch?v=... hoặc embed/..."
                            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <a
                            href={
                              linksList.find((l) => l.id === 'video_factory')?.url ||
                              siteSettings.video_factory_url ||
                              'https://www.youtube.com/watch?v=lDzM8QeIuGs'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 transition shrink-0"
                            title="Xem video trên YouTube"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Xem</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* NÚT LƯU 4 LINK & 2 VIDEO */}
                    <button suppressHydrationWarning type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading
                        ? 'Đang lưu liên kết...'
                        : '💾 Cập Nhật 4 Link & 2 Video Lên Database'}
                    </button>
                  </form>
                </div>
              </div>
          )}

          {/* =================================================================
              SECTION 7A: QUẢN LÝ SLIDER HỆ MẶT TRỜI TRANG CHỦ (5 SLIDE)
             ================================================================= */}
          {activeSection === 'sliders' && (
            <form onSubmit={handleSaveSliders} className="space-y-6">
              {/* Quick switch tabs between Sliders and Banners */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-fit shadow-2xs">
                <button
                  type="button"
                  onClick={() => selectSection('sliders')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-white text-[#1d4ed8] shadow-xs"
                >
                  <Layers className="w-4 h-4 text-[#1d4ed8]" />
                  <span>🪐 5 Ảnh Slider Hệ Mặt Trời</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1d4ed8] text-[10px] font-extrabold">5 slide</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectSection('banners')}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span>🖼️ 2 Ảnh Banner Giới Thiệu</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">2 banner</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Trang Chủ · Slider Hệ Mặt Trời</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span>🪐 Quản Lý 5 Ảnh Slider Hệ Mặt Trời (Trang Chủ)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                      Cấu hình 5 sản phẩm xoay quanh hệ mặt trời hiển thị tại Hero Trang chủ. Tự động chuyển đổi mượt mà mỗi 5 giây. Ảnh PNG/WebP đã tách nền trong suốt để hiển thị chân thực trên nền quỹ đạo.
                    </p>
                  </div>

                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Đang lưu...' : '💾 Lưu Cấu Hình 5 Slider'}</span>
                  </button>
                </div>

                {/* Danh sách 5 Card Slider */}
                <div className="grid grid-cols-1 gap-6">
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={slide.id || idx}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 transition hover:border-slate-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0f2d59] text-white font-extrabold text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900">
                            {slide.name}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {slide.badge || 'Đặc điểm nổi bật'}
                          </span>
                        </div>

                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs transition">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Đang tải...' : 'Tải ảnh trong suốt mới (.webp, .png)'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) convertAndUploadWebP(file, `slide-${idx}` as any, 'banners');
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Cột trái: Form thông tin text (8/12) */}
                        <div className="lg:col-span-8 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Tên sản phẩm
                              </label>
                              <input
                                suppressHydrationWarning
                                type="text"
                                value={slide.name}
                                onChange={(e) => {
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], name: e.target.value };
                                  setHeroSlides(next);
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Tag danh mục
                              </label>
                              <input
                                suppressHydrationWarning
                                type="text"
                                value={slide.category_name || ''}
                                onChange={(e) => {
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], category_name: e.target.value };
                                  setHeroSlides(next);
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                                placeholder="Bao Bì Đóng Gói"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Badge cam kết
                              </label>
                              <input
                                suppressHydrationWarning
                                type="text"
                                value={slide.badge || ''}
                                onChange={(e) => {
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], badge: e.target.value };
                                  setHeroSlides(next);
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                                placeholder="Chịu lực cao · Co bền"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Tiêu đề lớn (Headline H1)
                              </label>
                              <input
                                suppressHydrationWarning
                                type="text"
                                value={slide.title}
                                onChange={(e) => {
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  setHeroSlides(next);
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Link điều hướng khi bấm vào
                              </label>
                              <input
                                suppressHydrationWarning
                                type="text"
                                value={slide.link_url || ''}
                                onChange={(e) => {
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], link_url: e.target.value };
                                  setHeroSlides(next);
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800"
                                placeholder="/mang-co-pvc hoặc #bao-gia"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Mô tả ngắn banner
                            </label>
                            <textarea
                              suppressHydrationWarning
                              rows={2}
                              value={slide.description}
                              onChange={(e) => {
                                const next = [...heroSlides];
                                next[idx] = { ...next[idx], description: e.target.value };
                                setHeroSlides(next);
                              }}
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Đường dẫn URL ảnh (Remove background trong suốt)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                suppressHydrationWarning
                                type="text"
                                value={slide.image_url}
                                onChange={(e) => {
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], image_url: e.target.value };
                                  setHeroSlides(next);
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultUrls = [
                                    '/media/categories/mang-co-nhiet.webp',
                                    '/media/categories/mang-co-pvc.webp',
                                    '/media/categories/mang-co-pof.webp',
                                    '/media/categories/mang-co-pe.webp',
                                    '/media/banners/banner-mang-co.webp',
                                  ];
                                  const next = [...heroSlides];
                                  next[idx] = { ...next[idx], image_url: defaultUrls[idx] || defaultUrls[0] };
                                  setHeroSlides(next);
                                }}
                                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 rounded-xl whitespace-nowrap shadow-2xs hover:bg-slate-50"
                              >
                                Mặc định
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Cột phải: Live Preview trên nền Checkerboard trong suốt (4/12) */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center">
                          <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                            <span>Xem trước (Nền Trong Suốt)</span>
                          </div>
                          <div
                            className="w-full h-44 rounded-xl border border-slate-300 flex items-center justify-center p-3 relative overflow-hidden shadow-inner"
                            style={{
                              backgroundImage:
                                'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                              backgroundSize: '16px 16px',
                              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                              backgroundColor: '#f8fafc',
                            }}
                          >
                            {slide.image_url ? (
                              <img
                                src={slide.image_url}
                                alt={slide.name}
                                className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.25)]"
                              />
                            ) : (
                              <span className="text-xs text-slate-400 italic">Chưa có ảnh</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    💡 <em>Gợi ý: Ảnh sản phẩm tách nền (PNG hoặc WebP) sẽ hiển thị đẹp nhất trên hệ mặt trời.</em>
                  </p>
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Đang lưu vào Database...' : '💾 Lưu Cấu Hình 5 Slider Vào Database'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* =================================================================
              SECTION 7B: QUẢN LÝ 2 ẢNH BANNER THƯƠNG HIỆU (TRANG CHỦ & GIỚI THIỆU)
             ================================================================= */}
          {activeSection === 'banners' && (
            <form onSubmit={handleSaveBanners} className="space-y-6">
              {/* Quick switch tabs between Sliders and Banners */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-fit shadow-2xs">
                <button
                  type="button"
                  onClick={() => selectSection('sliders')}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>🪐 5 Ảnh Slider Hệ Mặt Trời</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">5 slide</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectSection('banners')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-white text-[#1d4ed8] shadow-xs"
                >
                  <ImageIcon className="w-4 h-4 text-[#1d4ed8]" />
                  <span>🖼️ 2 Ảnh Banner Giới Thiệu</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1d4ed8] text-[10px] font-extrabold">2 banner</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Trang Giới Thiệu (/gioi-thieu)</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span>🖼️ Quản Lý 2 Ảnh Banner Trang Giới Thiệu (/gioi-thieu)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                      Cấu hình 2 ảnh hiển thị trên trang Giới Thiệu: <strong>1 ảnh Hero đầu trang</strong> (cạnh mục 'Về Chúng Tôi') và <strong>1 banner dải ngang ở giữa trang</strong> (mục 'Sản phẩm của chúng tôi'). Dữ liệu lưu trực tiếp vào Database Supabase.
                    </p>
                  </div>

                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Đang lưu...' : '💾 Lưu 2 Ảnh Banner'}</span>
                  </button>
                </div>

                {/* BANNER 1: ẢNH HERO ĐẦU TRANG GIỚI THIỆU */}
                <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold mb-1">
                        Vị trí 1 · Đầu Trang Giới Thiệu
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        1. Ảnh Hero Trang Giới Thiệu (Cạnh 'Về Chúng Tôi')
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ảnh đại diện xưởng/sản phẩm nằm ở đầu trang Giới Thiệu (/gioi-thieu), bên phải tiêu đề "VỀ CHÚNG TÔI". Tỉ lệ khuyến nghị: 640x420px hoặc 1200x800px.
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white text-xs font-bold cursor-pointer shadow-xs hover:shadow-md transition-all">
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadingImage ? 'Đang nén WebP...' : 'Tải ảnh Hero Giới Thiệu (.webp)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) convertAndUploadWebP(file, 'hero-banner', 'banners');
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preview Banner Hero Giới Thiệu */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[140px] max-h-64 flex items-center justify-center p-2">
                    {heroBannerUrl ? (
                      <img
                        src={heroBannerUrl}
                        alt="Hero Banner Giới Thiệu Preview"
                        className="w-full h-auto max-h-56 object-contain rounded-lg shadow-2xs"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">Chưa có ảnh hero giới thiệu</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đường dẫn URL ảnh Hero Trang Giới Thiệu
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        suppressHydrationWarning
                        type="text"
                        name="hero_banner_url"
                        value={heroBannerUrl}
                        onChange={(e) => setHeroBannerUrl(e.target.value)}
                        placeholder="/media/products/hero-mang-co.webp"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono bg-white text-slate-800"
                      />
                      {heroBannerUrl && (
                        <button
                          type="button"
                          onClick={() => setHeroBannerUrl('/media/products/hero-mang-co.webp')}
                          className="px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 whitespace-nowrap bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-2xs"
                        >
                          Mặc định
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* BANNER 2: BANNER DẢI NGANG TRANG GIỚI THIỆU */}
                <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold mb-1">
                        Vị trí 2 · Giữa Trang Giới Thiệu
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        2. Banner Dải Ngang Trang Giới Thiệu (Mục 'Sản phẩm của chúng tôi')
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ảnh banner dải ngang hiển thị tại Mục 5 trang Giới Thiệu (/gioi-thieu). Tỉ lệ khuyến nghị: 1920x600px hoặc 1200x400px.
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white text-xs font-bold cursor-pointer shadow-xs hover:shadow-md transition-all">
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadingImage ? 'Đang nén WebP...' : 'Tải ảnh Banner Ngang Giới Thiệu (.webp)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) convertAndUploadWebP(file, 'about-banner', 'banners');
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preview Banner Ngang Giới Thiệu */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[140px] max-h-64 flex items-center justify-center p-2">
                    {aboutBannerUrl ? (
                      <img
                        src={aboutBannerUrl}
                        alt="Banner Ngang Giới Thiệu Preview"
                        className="w-full h-auto max-h-56 object-contain rounded-lg shadow-2xs"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">Chưa có ảnh banner giới thiệu</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đường dẫn URL ảnh Banner Dải Ngang
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        suppressHydrationWarning
                        type="text"
                        name="about_banner_url"
                        value={aboutBannerUrl}
                        onChange={(e) => setAboutBannerUrl(e.target.value)}
                        placeholder="/media/banners/banner-mang-co.webp"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono bg-white text-slate-800"
                      />
                      {aboutBannerUrl && (
                        <button
                          type="button"
                          onClick={() => setAboutBannerUrl('/media/banners/banner-mang-co.webp')}
                          className="px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 whitespace-nowrap bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-2xs"
                        >
                          Mặc định
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Đang lưu vào Database...' : '💾 Lưu 2 Ảnh Banner Vào Database'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* =================================================================
              SECTION 8: SAO LƯU & KHÔI PHỤC TOÀN DIỆN (FULL BACKUP & RESTORE)
             ================================================================= */}
          {activeSection === 'cache' && (
            <div className="space-y-6">
              {/* Card Chính: SAO LƯU & KHÔI PHỤC TOÀN DIỆN (DATABASE + ALL ẢNH WEBP) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs mb-2">
                      <Archive className="w-3.5 h-3.5" />
                      FULL SYSTEM BACKUP &amp; RESTORE
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Sao Lưu &amp; Khôi Phục Toàn Diện (Database + Tất Cả Ảnh WebP)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Xuất toàn bộ dữ liệu 5 bảng SQL và 100% hình ảnh trong kho Supabase Storage thành 1 file ZIP duy nhất để lưu trữ an toàn, hoặc tải file ZIP lên để khôi phục lại website bất cứ lúc nào.
                    </p>
                  </div>

                  {/* Nút xóa cache CDN nhanh */}
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => handleRevalidate('all')}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition"
                    title="Xóa cache tĩnh Vercel CDN để toàn trang cập nhật tức thì"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Làm Mới Cache CDN</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CỘT 1: TẢI BẢN SAO LƯU VỀ MÁY */}
                  <div className="p-5 rounded-2xl border border-blue-200/80 bg-blue-50/30 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-blue-950 font-extrabold text-sm mb-1.5">
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>1. Tải Bản Sao Lưu Về Máy (.zip)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Gói gọn toàn bộ Database (cài đặt, danh mục, 22 sản phẩm, 23 bài viết, báo giá) cùng toàn bộ file ảnh trong thư mục <code>media/</code> thành file nén <code>.zip</code>.
                      </p>
                      <ul className="text-xs text-slate-500 space-y-1 bg-white/80 p-3 rounded-xl border border-blue-100 font-medium">
                        <li>✓ File <code>database.json</code> (dữ liệu 5 bảng)</li>
                        <li>✓ Thư mục <code>media/</code> (toàn bộ ảnh sản phẩm, bài viết, banner)</li>
                        <li>✓ File <code>metadata.json</code> (thời gian &amp; thống kê)</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={handleDownloadBackup}
                      disabled={downloadingBackup}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {downloadingBackup ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang nén dữ liệu &amp; tải ảnh về... (Vui lòng đợi)</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>📥 Tải File Sao Lưu Về Máy (.zip)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* CỘT 2: KHÔI PHỤC DỮ LIỆU TỪ FILE SAO LƯU */}
                  <form
                    onSubmit={handleRestoreBackup}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm mb-1.5">
                        <UploadCloud className="w-4 h-4 text-blue-600" />
                        <span>2. Khôi Phục Dữ Liệu Từ File (.zip)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Chọn file <code>.zip</code> sao lưu đã tải trước đó để nạp lại dữ liệu vào 5 bảng và đẩy toàn bộ ảnh trở lại Supabase Storage.
                      </p>

                      {/* Vùng chọn file zip */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-white rounded-xl p-4 cursor-pointer transition text-center bg-white/70">
                        <Archive className="w-6 h-6 text-blue-600 mb-1.5" />
                        <span className="text-xs font-bold text-slate-800">
                          {restoreFile ? restoreFile.name : 'Bấm chọn file .zip sao lưu'}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {restoreFile
                            ? `${(restoreFile.size / (1024 * 1024)).toFixed(2)} MB · Sẵn sàng khôi phục`
                            : 'Chấp nhận file định dạng .zip'}
                        </span>
                        <input
                          type="file"
                          accept=".zip,application/zip"
                          disabled={restoringBackup}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setRestoreFile(f);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      suppressHydrationWarning
                      disabled={!restoreFile || restoringBackup}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {restoringBackup ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Đang giải nén &amp; khôi phục hệ thống...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>⚡ Bắt Đầu Khôi Phục Dữ Liệu</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Card 2: CẤU HÌNH LIÊN KẾT GOOGLE DRIVE & TỰ ĐỘNG SAO LƯU 5 NGÀY */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs mb-2">
                      <Cloud className="w-3.5 h-3.5" />
                      GOOGLE DRIVE AUTOMATION
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span>☁️ Tự Động Sao Lưu Lên Google Drive (Mỗi 5 Ngày)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Cấu hình liên kết Google Drive của bạn để hệ thống tự động xuất và tải file sao lưu (.zip) lên đám mây định kỳ mỗi 5 ngày.
                    </p>
                  </div>

                  {/* Nút kiểm tra và chạy sao lưu thủ công */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={handleTestDriveConnection}
                      disabled={testingDrive || !driveConfig.enabled}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingDrive ? 'animate-spin' : ''}`} />
                      <span>{testingDrive ? 'Đang kiểm tra...' : '🔍 Thử Kết Nối'}</span>
                    </button>

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={handleTriggerDriveBackup}
                      disabled={backingUpDrive || !driveConfig.enabled}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50"
                    >
                      {backingUpDrive ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang tải lên Drive...</span>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-3.5 h-3.5" />
                          <span>☁️ Sao Lưu Lên Drive Ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveDriveConfig} className="space-y-5">
                  {/* Toggle bật/tắt & Chu kỳ ngày */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driveConfig.enabled}
                        onChange={(e) => setDriveConfig({ ...driveConfig, enabled: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Bật chế độ tự động sao lưu lên Google Drive
                        </div>
                        <div className="text-[11px] text-slate-500">
                          File backup ZIP sẽ được tải lên đám mây định kỳ không cần thao tác tay.
                        </div>
                      </div>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Chu kỳ:</span>
                      <select
                        value={driveConfig.frequency_days || 5}
                        onChange={(e) =>
                          setDriveConfig({ ...driveConfig, frequency_days: Number(e.target.value) })
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
                      >
                        <option value={1}>Mỗi 1 ngày</option>
                        <option value={3}>Mỗi 3 ngày</option>
                        <option value={5}>Mỗi 5 ngày (Mặc định)</option>
                        <option value={7}>Mỗi 7 ngày (1 tuần)</option>
                        <option value={15}>Mỗi 15 ngày</option>
                        <option value={30}>Mỗi 30 ngày (1 tháng)</option>
                      </select>
                    </div>
                  </div>

                  {/* Lựa chọn phương thức liên kết */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Chọn Phương Thức Liên Kết Google Drive:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDriveConfig({ ...driveConfig, auth_type: 'webhook' })}
                        className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                          driveConfig.auth_type !== 'service_account'
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>1. Google Apps Script Webhook</span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                              Khuyên dùng (1 phút)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Chỉ cần dán URL Webhook. Không cần tạo tài khoản Google Cloud Developer phức tạp.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDriveConfig({ ...driveConfig, auth_type: 'service_account' })}
                        className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                          driveConfig.auth_type === 'service_account'
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-800 text-white shrink-0 mt-0.5">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">
                            2. Google Service Account (Credentials)
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Dành cho nhà phát triển muốn dùng Client Email và Private Key từ Google Cloud Console.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* PHƯƠNG THỨC 1: GOOGLE APPS SCRIPT WEBHOOK */}
                  {driveConfig.auth_type !== 'service_account' && (
                    <div className="p-5 rounded-2xl border border-blue-200/80 bg-blue-50/30 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-800">
                            Đường Dẫn Webhook Google Apps Script (Web App URL) *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowScriptModal(true)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                          >
                            <span>Xem hướng dẫn &amp; lấy mã Script (1 click)</span>
                          </button>
                        </div>
                        <input
                          type="url"
                          value={driveConfig.webhook_url || ''}
                          onChange={(e) =>
                            setDriveConfig({ ...driveConfig, webhook_url: e.target.value })
                          }
                          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          ID Thư Mục Google Drive (Tùy chọn - nếu muốn lưu vào thư mục riêng)
                        </label>
                        <input
                          type="text"
                          value={driveConfig.folder_id || ''}
                          onChange={(e) =>
                            setDriveConfig({ ...driveConfig, folder_id: e.target.value })
                          }
                          placeholder="Ví dụ: 1A2b3C4d5E6f... (Copy từ link drive.google.com/drive/folders/...)"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* PHƯƠNG THỨC 2: GOOGLE SERVICE ACCOUNT */}
                  {driveConfig.auth_type === 'service_account' && (
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          ID Thư Mục Google Drive (Folder ID) *
                        </label>
                        <input
                          type="text"
                          value={driveConfig.folder_id || ''}
                          onChange={(e) =>
                            setDriveConfig({ ...driveConfig, folder_id: e.target.value })
                          }
                          placeholder="ID thư mục cần chia sẻ quyền Editor cho Service Account"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Client Email (Service Account) *
                        </label>
                        <input
                          type="email"
                          value={driveConfig.client_email || ''}
                          onChange={(e) =>
                            setDriveConfig({ ...driveConfig, client_email: e.target.value })
                          }
                          placeholder="backup-bot@project.iam.gserviceaccount.com"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Private Key (Service Account RSA Key) *
                        </label>
                        <textarea
                          rows={3}
                          value={driveConfig.private_key || ''}
                          onChange={(e) =>
                            setDriveConfig({ ...driveConfig, private_key: e.target.value })
                          }
                          placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Lịch sử sao lưu gần nhất */}
                  {driveConfig.last_backup_at && (
                    <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>
                          Lần sao lưu gần nhất: <strong>{new Date(driveConfig.last_backup_at).toLocaleString('vi-VN')}</strong>
                        </span>
                        {driveConfig.last_backup_status === 'success' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            ✓ Thành công
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                            ✗ Thất bại
                          </span>
                        )}
                      </div>
                      {driveConfig.last_backup_file && (
                        <div className="font-mono text-slate-500 text-[11px]">
                          Tệp: {driveConfig.last_backup_file}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={savingDriveConfig}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition disabled:opacity-50"
                    >
                      {savingDriveConfig ? 'Đang lưu cấu hình...' : '💾 Lưu Cấu Hình Google Drive'}
                    </button>
                  </div>
                </form>

                {/* MODAL HƯỚNG DẪN TẠO GOOGLE APPS SCRIPT WEBHOOK */}
                {showScriptModal && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
                          <Code className="w-5 h-5 text-blue-600" />
                          <span>Hướng Dẫn Tạo Webhook Google Drive Trong 1 Phút</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowScriptModal(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs text-slate-600">
                        <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                          <li>
                            Truy cập <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">script.google.com</a> và bấm <strong>&quot;Dự án mới&quot;</strong>.
                          </li>
                          <li>Xóa đoạn code mặc định và dán toàn bộ đoạn mã bên dưới vào:</li>
                        </ol>

                        <div className="relative rounded-xl bg-slate-900 text-slate-200 p-4 font-mono text-xs overflow-x-auto">
                          <button
                            type="button"
                            onClick={handleCopyAppsScript}
                            className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow"
                          >
                            {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedScript ? 'Đang sao chép...' : 'Sao chép mã'}</span>
                          </button>
                          <pre>{APPS_SCRIPT_CODE}</pre>
                        </div>

                        <ol start={3} className="list-decimal list-inside space-y-2 leading-relaxed">
                          <li>
                            Bấm nút <strong>&quot;Triển khai&quot; (Deploy)</strong> &gt; <strong>&quot;Lần triển khai mới&quot;</strong>.
                          </li>
                          <li>
                            Chọn loại là <strong>&quot;Ứng dụng web&quot; (Web App)</strong>.
                          </li>
                          <li>
                            Mục <em>&quot;Người có quyền truy cập&quot; (Who has access)</em>: Chọn <strong>&quot;Bất kỳ ai&quot; (Anyone)</strong>.
                          </li>
                          <li>
                            Bấm <strong>&quot;Triển khai&quot;</strong>, cho phép quyền truy cập Google Drive của bạn và sao chép <strong>&quot;URL ứng dụng web&quot; (Web App URL)</strong> dán vào ô Webhook URL trên trang Admin này là xong!
                          </li>
                        </ol>
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="button"
                          onClick={() => setShowScriptModal(false)}
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                        >
                          Đã hiểu &amp; Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================================
          MOBILE BOTTOM QUICK-NAVIGATION BAR (< lg)
         ===================================================================== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white border-t border-slate-200 grid grid-cols-6 px-1">
        <button suppressHydrationWarning type="button"
          onClick={() => selectSection('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
            activeSection === 'dashboard' ? 'text-[#0284c7] font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Tổng quan</span>
        </button>

        <button suppressHydrationWarning type="button"
          onClick={() => selectSection('leads')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] relative ${
            activeSection === 'leads' ? 'text-[#0284c7] font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Leads ({newLeadsCount})</span>
        </button>

        <button suppressHydrationWarning type="button"
          onClick={() => selectSection('products')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
            activeSection === 'products' ? 'text-[#0284c7] font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Sản phẩm</span>
        </button>

        <button suppressHydrationWarning type="button"
          onClick={() => selectSection('banners')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
            activeSection === 'banners' ? 'text-[#0284c7] font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Banner</span>
        </button>

        <button suppressHydrationWarning type="button"
          onClick={() => selectSection('posts')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
            activeSection === 'posts' ? 'text-[#0284c7] font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bài SEO</span>
        </button>

        <button suppressHydrationWarning type="button"
          onClick={() => selectSection('webp')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
            activeSection === 'webp' ? 'text-[#0284c7] font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Kho WebP</span>
        </button>
      </nav>
    </div>
  );
}
