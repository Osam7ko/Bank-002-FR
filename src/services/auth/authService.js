import axios from "axios";

/**
 * Auth Service for JWT-based auth via auth-service behind the gateway.
 * Endpoints:
 *  - POST /auth/register { email, password, fullName }
 *  - POST /auth/login { email, password } -> { accessToken, refreshToken, expiresIn }
 *  - POST /auth/refresh { refreshToken } -> { accessToken, refreshToken, expiresIn }
 *  - POST /auth/logout { refreshToken } (optional)
 *
 * Storage keys:
 *  - accessToken
 *  - refreshToken
 *  - tokenExpiresAt (epoch ms)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// Storage helpers
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "tokenExpiresAt";

function setItem(key, value) {
  if (value === undefined || value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }
}

function getItem(key) {
  const v = localStorage.getItem(key);
  return v;
}

export function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function setTokens(payload) {
  const { accessToken, refreshToken, expiresIn } = payload || {};
  if (!accessToken) {
    clearTokens();
    return;
  }

  let expiresAtMs = null;

  // Prefer backend-provided expiresIn if present
  if (typeof expiresIn === "number" && !Number.isNaN(expiresIn)) {
    expiresAtMs = Date.now() + expiresIn * 1000;
  } else {
    // Derive from JWT exp
    const decoded = decodeJwt(accessToken);
    if (decoded?.exp) {
      expiresAtMs = decoded.exp * 1000;
    }
  }

  setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (expiresAtMs) {
    setItem(EXPIRES_AT_KEY, String(expiresAtMs));
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

export function getAccessToken() {
  return getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return getItem(REFRESH_TOKEN_KEY);
}

export function getTokenExpiresAt() {
  const v = getItem(EXPIRES_AT_KEY);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function isTokenExpired(bufferSec = 0) {
  const accessToken = getAccessToken();
  if (!accessToken) return true;
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) {
    const decoded = decodeJwt(accessToken);
    if (!decoded?.exp) return false; // no exp claim -> assume not expired
    return Date.now() >= decoded.exp * 1000 - bufferSec * 1000;
  }
  return Date.now() >= expiresAt - bufferSec * 1000;
}

export function isTokenExpiringSoon(bufferSec = 30) {
  const accessToken = getAccessToken();
  if (!accessToken) return true;
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) {
    const decoded = decodeJwt(accessToken);
    if (!decoded?.exp) return false;
    return Date.now() >= decoded.exp * 1000 - bufferSec * 1000;
  }
  return Date.now() >= expiresAt - bufferSec * 1000;
}

// Single-flight refresh lock
let refreshPromise = null;

/**
 * Refresh the access token using a single-flight lock to avoid parallel refresh storms.
 */
export async function refreshWithLock() {
  if (refreshPromise) {
    return refreshPromise;
  }
  const rt = getRefreshToken();
  if (!rt) {
    throw new Error("No refresh token available");
  }
  refreshPromise = (async () => {
    const res = await authApi.post("/auth/refresh", { refreshToken: rt });
    if (!res?.data?.accessToken) throw new Error("Invalid refresh response");
    setTokens(res.data);
    return res.data;
  })();
  try {
    const data = await refreshPromise;
    return data;
  } finally {
    refreshPromise = null;
  }
}

/**
 * Refresh if token is expiring within bufferSec seconds.
 */
export async function refreshIfExpiringSoon(bufferSec = 30) {
  if (!getAccessToken()) return null;
  if (!getRefreshToken()) return null;
  if (isTokenExpiringSoon(bufferSec)) {
    try {
      return await refreshWithLock();
    } catch {
      // propagate failure to caller usually
      throw new Error("Refresh failed");
    }
  }
  return null;
}

// API calls
export async function register(payload) {
  // Map to { email, password, fullName }
  let body = { ...payload };
  if (!body.fullName && (body.firstName || body.lastName)) {
    const first = body.firstName || "";
    const last = body.lastName || "";
    body.fullName = `${first} ${last}`.trim();
  }
  if (body.firstName !== undefined) delete body.firstName;
  if (body.lastName !== undefined) delete body.lastName;

  const res = await authApi.post("/auth/register", {
    email: body.email,
    password: body.password,
    fullName: body.fullName || body.name || "",
  });
  return res;
}

export async function login(credentials) {
  const res = await authApi.post("/auth/login", credentials);
  if (res?.data?.accessToken) {
    setTokens(res.data);
  }
  return res;
}

export async function logout() {
  const rt = getRefreshToken();
  try {
    if (rt) {
      await authApi.post("/auth/logout", { refreshToken: rt });
    }
  } catch {
    // ignore server-side logout failures
  } finally {
    clearTokens();
  }
}

export default {
  decodeJwt,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresAt,
  isTokenExpired,
  isTokenExpiringSoon,
  refreshWithLock,
  refreshIfExpiringSoon,
  register,
  login,
  logout,
};
