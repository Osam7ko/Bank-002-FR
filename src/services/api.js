import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpiringSoon,
  refreshWithLock,
} from "@/services/auth/authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // JWT via Authorization header, not cookies
  headers: { "Content-Type": "application/json" },
});

// Helper: whether URL path requires auth header
function needsAuthHeader(url = "") {
  // Only attach for /api/** or /aggregate/** calls
  return url.startsWith("/api/") || url.startsWith("/aggregate/");
}

// Request interceptor to add JWT token and preflight refresh if needed
api.interceptors.request.use(
  async (config) => {
    const url = config.url || "";

    // Never attach Authorization for /auth/** endpoints
    if (!url.startsWith("/auth/") && needsAuthHeader(url)) {
      try {
        // Proactive refresh if token is expiring soon
        if (getRefreshToken() && isTokenExpiringSoon(30)) {
          await refreshWithLock();
        }
      } catch {
        // If refresh fails here, proceed without changing request; backend will 401 and response interceptor will handle logout
      }

      const at = getAccessToken();
      if (at) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${at}`;
      }
    }
    console.log("REQ", config.url, config.headers?.Authorization?.slice(0, 20));
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and retry once after refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config || {};
    const status = err.response?.status;
    const url = original.url || "";

    // Only handle 401 from protected resources, avoid /auth/**
    const eligible =
      status === 401 &&
      !original._retry &&
      !url.startsWith("/auth/") &&
      needsAuthHeader(url);

    if (eligible) {
      try {
        if (getRefreshToken()) {
          await refreshWithLock();
          const newAccess = getAccessToken();
          if (newAccess) {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newAccess}`;
          }
          original._retry = true;
          return api.request(original);
        }
      } catch {
        // fall through to reject
      }
    }

    return Promise.reject(err);
  }
);

// User API calls (based on your UserController)
export const profileAPI = {
  bootstrap: () => api.post("/api/profiles/bootstrap"),
  me: () => api.get("/api/profiles/me"),
  updateMe: (body) => api.put("/api/profiles/me", body),
  getById: (profileId) =>
    api.get(`/api/profiles/id/${encodeURIComponent(profileId)}`),
  getByUserId: (userId) =>
    api.get(`/api/profiles/${encodeURIComponent(userId)}`),
  deleteMe: () => api.delete("/api/profiles/me"),
};

// Account Service
export const accountAPI = {
  openAccount: (openAccountRequest) =>
    api.post("/api/accounts", openAccountRequest),
  getAccount: (accountNumber) =>
    api.get(`/api/accounts/${encodeURIComponent(accountNumber)}`),
  balanceEnquiry: (accountNumber) =>
    api.get(`/api/accounts/${encodeURIComponent(accountNumber)}/balance`),
  nameEnquiry: (accountNumber) =>
    api.get(`/api/accounts/${encodeURIComponent(accountNumber)}/name`),
  credit: (accountNumber, amount) =>
    api.post(
      `/api/accounts/${encodeURIComponent(accountNumber)}/credit`,
      null,
      { params: { amount } }
    ),
  debit: (accountNumber, amount) =>
    api.post(`/api/accounts/${encodeURIComponent(accountNumber)}/debit`, null, {
      params: { amount },
    }),
  countByOwner: (profileId) =>
    api.get(`/api/accounts/owner/${encodeURIComponent(profileId)}/count`),
  listByOwner: (profileId) =>
    api.get(`/api/accounts/owner/${encodeURIComponent(profileId)}`),
  getDefaultByOwner: (profileId) =>
    api.get(`/api/accounts/owner/${encodeURIComponent(profileId)}/default`),
  // Alias for compatibility with existing callers
  defaultForOwner: (profileId) =>
    api.get(`/api/accounts/owner/${encodeURIComponent(profileId)}/default`),
};

// Transfer Service
export const transferAPI = {
  transfer: (transferRequest, idempotencyKey) =>
    api.post("/api/transfers", transferRequest, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
    }),
};

// Card Service
export const cardAPI = {
  issue: (issueCardRequest) => api.post("/api/cards", issueCardRequest),
  list: (accountNumber) => api.get("/api/cards", { params: { accountNumber } }),
  updateStatus: (cardId, status) =>
    api.patch(`/api/cards/${encodeURIComponent(cardId)}/status`, { status }),
  verify: (verifyCardRequest) =>
    api.post("/api/cards/verify", verifyCardRequest),
};

// Transaction Service
export const transactionAPI = {
  list: (accountNumber, from, to, page = 0, size = 10) =>
    api.get("/api/transactions", {
      params: { accountNumber, from, to, page, size },
    }),
};

// Statement Service
export const statementAPI = {
  generateStatementPdf: (accountNumber, from, to, email = false) =>
    api.get("/api/statements/pdf", {
      params: { accountNumber, from, to, email },
      responseType: "blob",
    }),
  recentTransactions: (accountNumber, from, to, page = 0, size = 10) =>
    api.get("/api/transactions", {
      params: { accountNumber, from, to, page, size },
    }),
};

// Beneficiary Service (v2)
export const beneficiaryAPI_v2 = {
  save: (dto) => api.post("/api/beneficiaries", dto),
  getAll: () => api.get("/api/beneficiaries"),
  deleteByAccountNumber: (accountNumber) =>
    api.delete(
      `/api/beneficiaries/by-account/${encodeURIComponent(accountNumber)}`
    ),
};

export default api;
