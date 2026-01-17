const DEFAULT_BASE_URL =
  import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:4000';
const DEFAULT_ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || '';

function normalizeBaseUrl(value: string) {
  if (!value) return DEFAULT_BASE_URL;
  return value.replace(/\/$/, '');
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('unap-admin-base-url');
    if (stored) return normalizeBaseUrl(stored);
  }
  return normalizeBaseUrl(DEFAULT_BASE_URL);
}

export function setBaseUrl(value: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('unap-admin-base-url', normalizeBaseUrl(value));
}

export function getAdminKey() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('unap-admin-key');
    if (stored) return stored;
  }
  return DEFAULT_ADMIN_KEY;
}

export function setAdminKey(value: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('unap-admin-key', value);
}

export function getAdminToken() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('unap-admin-token');
    if (stored) return stored;
  }
  return '';
}

export function setAdminToken(value: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('unap-admin-token', value);
}

type RequestOptions = {
  path: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

export async function apiRequest({
  path,
  method = 'GET',
  body,
  headers = {},
}: RequestOptions) {
  const url = `${getBaseUrl()}${path}`;
  const init: RequestInit = { method, headers: { ...headers }, cache: 'no-store' };
  const adminToken = getAdminToken();
  if (adminToken) {
    init.headers.Authorization = `Bearer ${adminToken}`;
  } else {
    const adminKey = getAdminKey();
    if (adminKey) init.headers['x-admin-key'] = adminKey;
  }
  init.headers['Cache-Control'] = 'no-cache';

  if (body instanceof FormData) {
    init.body = body;
  } else if (method !== 'GET') {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body ?? {});
  }

  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
