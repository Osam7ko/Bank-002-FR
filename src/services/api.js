import axios from "axios";
import { getAccessToken } from "@/services/auth/authService";

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

    // Attach Authorization for protected endpoints only (skip public user register/login)
    if (
      needsAuthHeader(url) &&
      !url.startsWith("/api/auth/register") &&
      !url.startsWith("/api/auth/login")
    ) {
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
    api.post("/api/accounts/credit", { accountNumber, amount }),
  debit: (accountNumber, amount) =>
    api.post("/api/accounts/debit", { accountNumber, amount }),
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
  transfer: (transferRequest) => api.post("/api/transfers", transferRequest),
};

// Card Service
export const cardAPI = {
  // New order-based flow
  products: () => api.get("/api/cards/products"),
  createOrder: (payload) => api.post("/api/cards/orders", payload),
  getOrder: (orderId) =>
    api.get(`/api/cards/orders/${encodeURIComponent(orderId)}`),

  // Existing
  list: (accountNumber) =>
    api.get(`/api/cards/${encodeURIComponent(accountNumber)}`),
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
      params: { accountNumber, startDate: from, endDate: to, email },
      responseType: "blob",
    }),
  recentTransactions: (accountNumber, from, to) =>
    api.get("/api/statements/recent", {
      params: { accountNumber, startDate: from, endDate: to },
    }),
};

// Beneficiary Service (v2)
export const beneficiaryAPI_v2 = {
  save: (dto) => api.post("/api/beneficiaries", dto),
  getAll: () => api.get("/api/beneficiaries"),
  deleteByAccountNumber: (accountNumber) =>
    api.delete(`/api/beneficiaries/${encodeURIComponent(accountNumber)}`),
};

export default api;
