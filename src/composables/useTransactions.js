import { ref } from "vue";
import { statementAPI, transactionAPI } from "@/services/api";

export function useTransactions() {
  const transactions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Generate bank statement
  const generateStatement = async (
    accountNumber,
    startDate,
    endDate,
    email = true
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Ensure ISO date-time for backend expectations
      const from = startDate; // "YYYY-MM-DD"
      const to = endDate; // "YYYY-MM-DD"

      // Request PDF (and optionally email via email=true)
      const response = await statementAPI.generateStatementPdf(
        accountNumber,
        from,
        to,
        email
      );

      // Download PDF blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `statement_${accountNumber}_${startDate}_${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Keep transactions state untouched; this call just triggers generation/download
      return { success: true };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate statement";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Get recent transactions (last 10)
  const getRecentTransactions = async (accountNumber) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Last 30 days
      const endDateOnly = new Date().toISOString().split("T")[0];
      const startDateOnly = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const from = startDateOnly; // no time part
      const to = endDateOnly; // no time part

      const response = await transactionAPI.list(
        accountNumber,
        from,
        to,
        0,
        10
      );

      // Page<LedgerEntry> expected. Prefer content if present.
      const data = response?.data;
      const items = Array.isArray(data) ? data : data?.content || [];
      transactions.value = items;

      return { success: true, data: items };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Failed to get recent transactions";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Format transaction amount for display
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format transaction date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get transaction type color
  const getTransactionTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
        return "text-green-600";
      case "debit":
        return "text-red-600";
      case "transfer":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Clear transactions
  const clearTransactions = () => {
    transactions.value = [];
  };

  return {
    // State
    transactions,
    isLoading,
    error,

    // Methods
    generateStatement,
    getRecentTransactions,
    formatAmount,
    formatDate,
    getTransactionTypeColor,
    clearError,
    clearTransactions,
  };
}
