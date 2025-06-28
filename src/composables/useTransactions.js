import { ref } from "vue";
import { statementAPI } from "@/services/api";

export function useTransactions() {
  const transactions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Generate bank statement
  const generateStatement = async (accountNumber, startDate, endDate) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await statementAPI.generateStatement(
        accountNumber,
        startDate,
        endDate
      );

      transactions.value = response.data;
      return { success: true, data: response.data };
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

      // Get last 30 days transactions
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const response = await statementAPI.recentTransactions(
        accountNumber,
        startDate,
        endDate
      );

      return { success: true, data: response.data };
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
