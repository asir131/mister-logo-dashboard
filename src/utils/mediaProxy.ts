import { getBaseUrl } from './apiClient';

const GCS_HOSTS = new Set(['storage.googleapis.com', 'storage.cloud.google.com']);

const extractObjectPath = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);
    if (!GCS_HOSTS.has(parsed.hostname)) return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return parts.slice(1).join('/');
  } catch {
    return null;
  }
};

export const toProxyMediaUrl = (rawUrl?: string | null) => {
  const url = String(rawUrl || '').trim();
  if (!url) return '';
  const base = getBaseUrl().replace(/\/$/, '');
  if (!base) return url;
  if (url.startsWith(`${base}/media/`) || url.startsWith(`${base}/media?`)) {
    return url;
  }
  if (!/^https?:\/\//i.test(url)) return url;
  const objectPath = extractObjectPath(url);
  if (!objectPath) return url;
  return `${base}/media/${objectPath}`;
};
