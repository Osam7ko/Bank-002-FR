import { ref } from "vue";
import { accountAPI } from "@/services/api";

export function useBalance() {
  // Store the balance as a number
  const balance = ref(0);
  // Store account metadata separately
  const meta = ref({});
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetches the account balance and related metadata.
   * @param {string} accountNumber The account number to query.
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const getBalance = async (accountNumber) => {
    try {
      isLoading.value = true;
      error.value = null;

      const res = await accountAPI.balanceEnquiry(accountNumber);

      // Try to get account info from different possible response structures
      const info = res?.data?.accountInfo ?? res?.data?.data ?? null;

      if (!info) {
        // Fallback: try to read a direct field if info is not present
        const maybe = Number(res?.data?.accountBalance ?? NaN);
        balance.value = Number.isFinite(maybe) ? maybe : 0;
        return { success: true, data: res?.data };
      }

      // Normalize the balance to a number and update the state
      const amt = Number(
        typeof info.accountBalance === "string"
          ? info.accountBalance
          : info.accountBalance ?? 0
      );
      balance.value = Number.isFinite(amt) ? amt : 0;

      // Update the metadata state
      meta.value = {
        accountNumber: info.accountNumber,
        accountName: info.accountName,
      };

      return { success: true, data: res?.data };
    } catch (err) {
      error.value =
        err?.response?.data?.responseMessage ||
        err?.message ||
        "Failed to get balance";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetches the account name.
   * This function remains unchanged as the logic is already sound.
   * @param {string} accountNumber The account number to query.
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const getNameEnquiry = async (accountNumber) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await accountAPI.nameEnquiry(accountNumber);
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

  /**
   * Clears the current error state.
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    balance,
    meta,
    isLoading,
    error,

    // Methods
    getBalance,
    getNameEnquiry,
    clearError,
  };
}
