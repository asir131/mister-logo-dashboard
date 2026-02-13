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
  const token = getAdminToken();
  if (!token) return false;
  try {
    const payload = token.split('.')[1];
    if (!payload) throw new Error('Invalid token');
    const decoded = JSON.parse(atob(payload));
    if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
      clearAdminToken();
      return false;
    }
    return true;
  } catch (err) {
    clearAdminToken();
    return false;
  }
}
