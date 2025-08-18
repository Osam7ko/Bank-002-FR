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
  const accessToken =
    typeof payload === "string" ? payload : payload?.accessToken;
  if (!accessToken) {
    clearTokens();
    return;
  }
  setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getAccessToken() {
  return getItem(ACCESS_TOKEN_KEY);
}

export function isTokenExpired(bufferSec = 0) {
  const accessToken = getAccessToken();
  if (!accessToken) return true;
  const decoded = decodeJwt(accessToken);
  if (!decoded?.exp) return false; // no exp claim -> assume not expired
  return Date.now() >= decoded.exp * 1000 - bufferSec * 1000;
}

export function isTokenExpiringSoon(bufferSec = 30) {
  const accessToken = getAccessToken();
  if (!accessToken) return true;
  const decoded = decodeJwt(accessToken);
  if (!decoded?.exp) return false;
  return Date.now() >= decoded.exp * 1000 - bufferSec * 1000;
}

/**
 * Refresh the access token using a single-flight lock to avoid parallel refresh storms.
 */

// API calls
export async function register(payload) {
  // Backend expects full UserRequest; pass through as-is
  const res = await authApi.post("/api/auth/register", payload);
  return res;
}

export async function login(credentials) {
  const res = await authApi.post("/api/auth/login", credentials);
  const jwt = res?.data?.responseMessage;
  if (jwt) {
    setTokens(jwt);
  }
  return res;
}

export async function logout() {
  clearTokens();
}

export default {
  decodeJwt,
  setTokens,
  clearTokens,
  getAccessToken,
  isTokenExpired,
  isTokenExpiringSoon,
  register,
  login,
  logout,
};
