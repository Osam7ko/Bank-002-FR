import { ref } from "vue";
import { userAPI, beneficiaryAPI } from "@/services/api";

export function useTransfer() {
  const isLoading = ref(false);
  const error = ref(null);
  const beneficiaries = ref([]);

  // Transfer money
  const transfer = async (transferData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.transfer(transferData);

      if (response.data.responseCode === "002") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.responseMessage || "Transfer failed");
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage || err.message || "Transfer failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Credit account
  const credit = async (creditData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.credit(creditData);

      if (response.data.responseCode === "002") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.responseMessage || "Credit failed");
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage || err.message || "Credit failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Debit account
  const debit = async (debitData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.debit(debitData);

      if (response.data.responseCode === "002") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.responseMessage || "Debit failed");
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage || err.message || "Debit failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Get all beneficiaries
  const getBeneficiaries = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await beneficiaryAPI.getAll();
      beneficiaries.value = response.data;

      return { success: true, data: response.data };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Failed to get beneficiaries";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Save beneficiary
  const saveBeneficiary = async (beneficiaryData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await beneficiaryAPI.save(beneficiaryData);

      if (response.data.responseCode === "002") {
        // Refresh beneficiaries list
        await getBeneficiaries();
        return { success: true, data: response.data };
      } else {
        throw new Error(
          response.data.responseMessage || "Failed to save beneficiary"
        );
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage ||
        err.message ||
        "Failed to save beneficiary";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete beneficiary
  const deleteBeneficiary = async (id) => {
    try {
      isLoading.value = true;
      error.value = null;

      await beneficiaryAPI.delete(id);

      // Refresh beneficiaries list
      await getBeneficiaries();
      return { success: true };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete beneficiary";
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
    isLoading,
    error,
    beneficiaries,

    // Methods
    transfer,
    credit,
    debit,
    getBeneficiaries,
    saveBeneficiary,
    deleteBeneficiary,
    clearError,
  };
}
