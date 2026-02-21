// API helper for backend communication
const API_BASE = import.meta.env.VITE_API_URL || '';

async function apiPost(endpoint: string, data: Record<string, unknown>) {
  try {
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function sendFeedback(answer: 'yes' | 'partly' | 'no', page: string = 'home') {
  return apiPost('/feedback', { answer, page });
}

export function sendCookieConsent(consent: 'accept' | 'reject' | 'necessary') {
  return apiPost('/cookie-consent', { consent });
}

export function sendPageView(page: string, referrer?: string) {
  return apiPost('/pageview', { page, referrer });
}

export function sendSearchLog(data: { profile?: string; budget?: number; internet?: number; minutes?: number; results_count?: number }) {
  return apiPost('/search-log', data);
}

export async function adminLogin(password: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.token;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAdminStats(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}
