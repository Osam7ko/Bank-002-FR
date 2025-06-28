import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// User API calls (based on your UserController)
export const userAPI = {
  // Create new user account
  createAccount: (userRequest) => api.post("/api/user", userRequest),

  // Login
  login: (loginDto) => api.post("/api/user/login", loginDto),

  // Balance enquiry
  balanceEnquiry: (enquiryRequest) =>
    api.post("/api/user/balanceEnquiry", enquiryRequest),

  // Name enquiry
  nameEnquiry: (enquiryRequest) =>
    api.post("/api/user/nameEnquiry", enquiryRequest),

  // Credit account
  credit: (creditDebitRequest) =>
    api.post("/api/user/credit", creditDebitRequest),

  // Debit account
  debit: (creditDebitRequest) =>
    api.post("/api/user/debit", creditDebitRequest),

  // Transfer
  transfer: (transferRequest) =>
    api.post("/api/user/transfer", transferRequest),
};

// Beneficiary API calls (based on your BeneficiaryController)
export const beneficiaryAPI = {
  // Save beneficiary
  save: (savedBeneficiaryDto) =>
    api.post("/api/beneficiaries", savedBeneficiaryDto),

  // Get all beneficiaries
  getAll: () => api.get("/api/beneficiaries"),

  // Delete beneficiary
  delete: (id) => api.delete(`/api/beneficiaries/${id}`),
};

// Bank Statement API calls (based on your TransactionController)
export const statementAPI = {
  // Generate bank statement
  generateStatement: (accountNumber, startDate, endDate) =>
    api.get("/bankStatement", {
      params: {
        accountNumber,
        startDate,
        endDate,
      },
    }),

  // Get recent transactions
  recentTransactions: (accountNumber, startDate, endDate) =>
    api.get("/bankStatement/recent", {
      params: {
        accountNumber,
        startDate,
        endDate,
      },
    }),
};

export default api;
