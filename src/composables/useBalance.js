import { ref } from "vue";
import { userAPI } from "@/services/api";

export function useBalance() {
  const balance = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Get balance enquiry
  const getBalance = async (accountNumber) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.balanceEnquiry({ accountNumber });

      if (response.data.responseCode === "004") {
        balance.value = response.data.accountInfo;
        return { success: true, data: response.data };
      } else {
        throw new Error(
          response.data.responseMessage || "Failed to get balance"
        );
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage ||
        err.message ||
        "Failed to get balance";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Get name enquiry
  const getNameEnquiry = async (accountNumber) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.nameEnquiry({ accountNumber });

      return { success: true, data: response.data };
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage ||
        err.message ||
        "Failed to get name";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    balance,
    isLoading,
    error,

    // Methods
    getBalance,
    getNameEnquiry,
    clearError,
  };
}
