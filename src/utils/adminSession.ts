export function getAdminToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('unap-admin-token') || '';
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('unap-admin-token', token);
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('unap-admin-token');
}

export function hasAdminSession() {
  return Boolean(getAdminToken());
}
