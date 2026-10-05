// Dynamic API Base resolution:
// 1. REACT_APP_API_BASE environment variable (e.g., in production Vercel deployment)
// 2. Fallback to http://127.0.0.1:8000/api for local dev
// 3. Fallback to /api for reverse proxy or unified container deployment
const rawBase =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.location && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000/api"
    : "/api");

export const API_BASE = rawBase.replace(/\/+$/, "");

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("access_token");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${API_BASE}${cleanPath}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && !path.includes("/auth/login/")) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Only reload if we are not already on unauthenticated view
  }

  return res;
}

export function parseToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export async function demoLogin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Authentication failed.");
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}