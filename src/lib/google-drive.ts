import crypto from 'crypto';
import JSZip from 'jszip';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import {
  dbGetCategories,
  dbGetInquiries,
  dbGetPosts,
  dbGetProducts,
  dbGetSiteSettings,
} from '@/lib/db';
import { GoogleDriveBackupConfig } from '@/types/database';

async function listAllMediaFiles(
  supabase: ReturnType<typeof getSupabaseAdminClient>
): Promise<string[]> {
  if (!supabase) return [];
  const filePaths: string[] = [];

  async function scanDirectory(prefix: string) {
    if (!supabase) return;
    const { data: items, error } = await supabase.storage.from('media').list(prefix, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error || !items) return;

    for (const item of items) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        await scanDirectory(fullPath);
      } else {
        filePaths.push(fullPath);
      }
    }
  }

  const mainFolders = ['categories', 'products', 'posts', 'banners', 'uploads'];
  for (const folder of mainFolders) {
    await scanDirectory(folder);
  }

  const { data: rootItems } = await supabase.storage.from('media').list('', { limit: 1000 });
  if (rootItems) {
    for (const item of rootItems) {
      if (item.id !== null) {
        filePaths.push(item.name);
      }
    }
  }

  return Array.from(new Set(filePaths));
}

/**
 * Đóng gói toàn bộ 5 bảng SQL và 100% hình ảnh trong kho Supabase Storage thành file ZIP Buffer
 */
export async function generateFullBackupZipBuffer(): Promise<{
  zipBuffer: Buffer;
  filename: string;
  stats: {
    categories: number;
    products: number;
    posts: number;
    inquiries: number;
    images: number;
  };
}> {
  const zip = new JSZip();

  const [siteSettings, categories, products, posts, inquiries] = await Promise.all([
    dbGetSiteSettings(),
    dbGetCategories(),
    dbGetProducts(),
    dbGetPosts(),
    dbGetInquiries(),
  ]);

  const databaseData = {
    site_settings: siteSettings,
    categories,
    products,
    posts,
    inquiries,
  };

  zip.file('database.json', JSON.stringify(databaseData, null, 2));

  let totalImages = 0;
  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    const allFiles = await listAllMediaFiles(supabase);
    totalImages = allFiles.length;

    for (const filePath of allFiles) {
      const { data: blob, error } = await supabase.storage.from('media').download(filePath);
      if (!error && blob) {
        const arrayBuffer = await blob.arrayBuffer();
        zip.file(`media/${filePath}`, Buffer.from(arrayBuffer));
      }
    }
  }

  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(now)
    .replace(/:/g, '-')
    .replace(/ /g, '_');

  const stats = {
    categories: categories.length,
    products: products.length,
    posts: posts.length,
    inquiries: inquiries.length,
    images: totalImages,
  };

  zip.file(
    'metadata.json',
    JSON.stringify(
      {
        project: 'mangcopvc-seo',
        backup_at: now.toISOString(),
        stats,
      },
      null,
      2
    )
  );

  const rawBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const filename = `backup-mangcopvc-${dateStr}.zip`;

  return {
    zipBuffer: rawBuffer as Buffer,
    filename,
    stats,
  };
}

/**
 * Lấy Access Token từ Service Account Credentials bằng JWT Signing (Native Node.js Crypto)
 */
async function getServiceAccountAccessToken(
  clientEmail: string,
  privateKeyRaw: string
): Promise<string> {
  let privateKey = privateKeyRaw.trim();
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
  }
  // Xử lý escaped newlines nếu có
  privateKey = privateKey.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/drive.file',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Claim = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const signatureInput = `${base64Header}.${base64Claim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey, 'base64url');
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Auth error (${res.status}): ${errText}`);
  }

  const tokenData = await res.json();
  return tokenData.access_token as string;
}

/**
 * Upload file lên Google Drive qua REST API v3 Multipart (Service Account)
 */
async function uploadViaServiceAccount(
  clientEmail: string,
  privateKey: string,
  folderId: string | undefined,
  filename: string,
  buffer: Buffer,
  mimeType: string = 'application/zip'
): Promise<{ ok: boolean; fileId?: string; fileUrl?: string; error?: string }> {
  try {
    const accessToken = await getServiceAccountAccessToken(clientEmail, privateKey);

    const metadata: Record<string, unknown> = {
      name: filename,
      mimeType,
    };
    if (folderId && folderId.trim()) {
      metadata.parents = [folderId.trim()];
    }

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody = Buffer.concat([
      Buffer.from(
        delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          `Content-Type: ${mimeType}\r\n` +
          'Content-Transfer-Encoding: base64\r\n\r\n'
      ),
      Buffer.from(buffer.toString('base64')),
      Buffer.from(closeDelimiter),
    ]);

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `Lỗi upload Google Drive (${res.status}): ${err}` };
    }

    const data = await res.json();
    return {
      ok: true,
      fileId: data.id,
      fileUrl: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Upload file lên Google Drive qua Google Apps Script Webhook
 */
async function uploadViaWebhook(
  webhookUrl: string,
  folderId: string | undefined,
  filename: string,
  buffer: Buffer,
  mimeType: string = 'application/zip'
): Promise<{ ok: boolean; fileId?: string; fileUrl?: string; error?: string }> {
  try {
    const payload = {
      filename,
      mimeType,
      folderId: folderId?.trim() || '',
      fileData: buffer.toString('base64'),
    };

    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `Webhook Apps Script lỗi (${res.status}): ${err}` };
    }

    const data = await res.json().catch(() => ({ ok: true }));
    if (data.ok === false) {
      return { ok: false, error: data.error || 'Apps Script trả về lỗi thất bại' };
    }

    return {
      ok: true,
      fileId: data.fileId,
      fileUrl: data.fileUrl || (data.fileId ? `https://drive.google.com/file/d/${data.fileId}/view` : undefined),
    };
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Tải file bản sao lưu lên Google Drive theo cấu hình của người dùng
 */
export async function uploadBackupToGoogleDrive(
  config: GoogleDriveBackupConfig,
  zipBuffer: Buffer,
  filename: string
): Promise<{ ok: boolean; fileUrl?: string; error?: string }> {
  if (config.auth_type === 'service_account') {
    if (!config.client_email || !config.private_key) {
      return { ok: false, error: 'Chưa điền Client Email hoặc Private Key của Service Account' };
    }
    return uploadViaServiceAccount(
      config.client_email,
      config.private_key,
      config.folder_id,
      filename,
      zipBuffer,
      'application/zip'
    );
  }

  // Mặc định hoặc 'webhook'
  if (!config.webhook_url) {
    return { ok: false, error: 'Chưa cấu hình Webhook URL của Google Apps Script' };
  }
  return uploadViaWebhook(
    config.webhook_url,
    config.folder_id,
    filename,
    zipBuffer,
    'application/zip'
  );
}

/**
 * Thử kết nối gửi file kiểm tra (test connection) lên Google Drive
 */
export async function testGoogleDriveConnection(
  config: GoogleDriveBackupConfig
): Promise<{ ok: boolean; message: string; fileUrl?: string }> {
  const nowStr = new Date().toISOString();
  const testBuffer = Buffer.from(
    `Kiểm tra kết nối Google Drive từ Bao Bì Thành Phát (mangcodanang.com)\nThời gian: ${nowStr}\nTrạng thái: Kết nối thành công!`,
    'utf-8'
  );
  const testFileName = `test-connection-${Date.now()}.txt`;

  let res: { ok: boolean; fileUrl?: string; error?: string };

  if (config.auth_type === 'service_account') {
    if (!config.client_email || !config.private_key) {
      return { ok: false, message: 'Thiếu Client Email hoặc Private Key của Google Service Account' };
    }
    res = await uploadViaServiceAccount(
      config.client_email,
      config.private_key,
      config.folder_id,
      testFileName,
      testBuffer,
      'text/plain'
    );
  } else {
    if (!config.webhook_url) {
      return { ok: false, message: 'Thiếu Webhook URL của Google Apps Script' };
    }
    res = await uploadViaWebhook(
      config.webhook_url,
      config.folder_id,
      testFileName,
      testBuffer,
      'text/plain'
    );
  }

  if (res.ok) {
    return {
      ok: true,
      message: 'Kết nối Google Drive thành công! Đã tạo file kiểm thử trên thư mục Drive của bạn.',
      fileUrl: res.fileUrl,
    };
  }

  return {
    ok: false,
    message: res.error || 'Không thể kết nối đến Google Drive. Vui lòng kiểm tra lại cấu hình.',
  };
}

