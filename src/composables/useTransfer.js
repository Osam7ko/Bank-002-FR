import { ref } from "vue";
import { accountAPI, transferAPI, beneficiaryAPI_v2 } from "@/services/api";

export function useTransfer() {
  const isLoading = ref(false);
  const error = ref(null);
  const beneficiaries = ref([]);

  // Transfer money
  const transfer = async (transferData) => {
    try {
      isLoading.value = true;
      error.value = null;

      // POST /api/transfers with optional Idempotency-Key header
      const response = await transferAPI.transfer(
        transferData,
        transferData?.idempotencyKey
      );

      if (response?.data?.responseCode === "TRF-00") {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.data?.responseMessage || "Transfer failed");
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

      // POST /api/accounts/{accountNumber}/credit?amount=...
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

      // POST /api/accounts/{accountNumber}/debit?amount=...
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

      const response = await beneficiaryAPI_v2.getAll();
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

  // Save beneficiary (align with BK SaveBeneficiaryRequest)
  // SaveBeneficiaryRequest { accountNumber, beneficiaryName, bankName }
  const saveBeneficiary = async (beneficiaryData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const payload = {
        accountNumber: beneficiaryData?.accountNumber,
        beneficiaryName:
          beneficiaryData?.beneficiaryName ||
          beneficiaryData?.accountName ||
          "",
        bankName: beneficiaryData?.bankName || "001 Bank",
      };

      const response = await beneficiaryAPI_v2.save(payload);

      // Treat 200 OK with SavedBeneficiaryDto as success
      await getBeneficiaries();
      return { success: true, data: response.data };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.responseMessage ||
        err.message ||
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
