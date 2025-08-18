import { ref } from "vue";
import { accountAPI, transferAPI, beneficiaryAPI_v2 } from "@/services/api";

export function useTransfer() {
  const isLoading = ref(false);
  const error = ref(null);
  const beneficiaries = ref([]);

  // Transfer money (BK: POST /api/user/transfer)
  const transfer = async (transferData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await transferAPI.transfer(transferData);

      if (response?.data?.responseCode === "008") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.data?.responseMessage || "Transfer failed");
      }
    } catch (err) {
      error.value =
        err?.response?.data?.responseMessage ||
        err?.message ||
        "Transfer failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Credit account (BK: POST /api/user/credit)
  const credit = async (creditData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await accountAPI.credit(
        creditData?.accountNumber,
        creditData?.amount
      );

      if (response?.data?.responseCode === "00") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.data?.responseMessage || "Credit failed");
      }
    } catch (err) {
      error.value =
        err?.response?.data?.responseMessage || err?.message || "Credit failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Debit account (BK: POST /api/user/debit)
  const debit = async (debitData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await accountAPI.debit(
        debitData?.accountNumber,
        debitData?.amount
      );

      if (response?.data?.responseCode === "00") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.data?.responseMessage || "Debit failed");
      }
    } catch (err) {
      error.value =
        err?.response?.data?.responseMessage || err?.message || "Debit failed";
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

      const response = await beneficiaryAPI_v2.getAll();
      beneficiaries.value = Array.isArray(response?.data) ? response.data : [];

      return { success: true, data: beneficiaries.value };
    } catch (err) {
      error.value =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get beneficiaries";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Save beneficiary (BK: SavedBeneficiaryDto { name, accountNumber })
  const saveBeneficiary = async (beneficiaryData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const payload = {
        name:
          beneficiaryData?.beneficiaryName ||
          beneficiaryData?.accountName ||
          "",
        accountNumber: beneficiaryData?.accountNumber,
      };

      const response = await beneficiaryAPI_v2.save(payload);

      // Refresh list
      await getBeneficiaries();
      return { success: true, data: response.data };
    } catch (err) {
      error.value =
        err?.response?.data?.message ||
        err?.response?.data?.responseMessage ||
        err?.message ||
        "Failed to save beneficiary";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete beneficiary
  const deleteBeneficiary = async (accountNumber) => {
    try {
      isLoading.value = true;
      error.value = null;

      await beneficiaryAPI_v2.deleteByAccountNumber(accountNumber);

      // Refresh beneficiaries list
      await getBeneficiaries();
      return { success: true };
    } catch (err) {
      error.value =
        err?.response?.data?.message ||
        err?.message ||
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
