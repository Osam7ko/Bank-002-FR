<template>
  <Layout>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Name Enquiry</h1>
        <p class="mt-2 text-gray-600">
          Find account holder's name by account number
        </p>
      </div>

      <!-- Enquiry Form -->
      <div class="card">
        <form @submit.prevent="handleNameEnquiry" class="space-y-6">
          <div>
            <label for="accountNumber" class="form-label">Account Number</label>
            <input
              id="accountNumber"
              v-model="form.accountNumber"
              type="text"
              required
              class="input-field"
              placeholder="Enter account number"
            />
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              Searching...
            </span>
            <span v-else>Find Account Name</span>
          </button>
        </form>
      </div>

      <!-- Name Result -->
      <div
        v-if="nameResult"
        class="card bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div
              class="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-800">Account Found</h3>
            <div class="mt-2 space-y-1">
              <p class="text-2xl font-bold text-blue-900">{{ nameResult }}</p>
              <p class="text-sm text-blue-700">
                <span class="font-medium">Account Number:</span>
                {{ form.accountNumber }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Save as Beneficiary -->
      <div v-if="nameResult" class="card bg-white border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              Save as Beneficiary
            </h3>
            <p class="text-sm text-gray-600">
              Add this account to your saved beneficiaries for quick transfers
            </p>
          </div>
          <button
            @click="handleSaveBeneficiary"
            :disabled="savingBeneficiary"
            class="btn-primary"
          >
            <span v-if="savingBeneficiary" class="flex items-center">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              Saving...
            </span>
            <span v-else>Save Beneficiary</span>
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { reactive, ref } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useBalance } from "@/composables/useBalance";
import { useTransfer } from "@/composables/useTransfer";

const { getNameEnquiry, isLoading, error, clearError } = useBalance();
const { saveBeneficiary } = useTransfer();

const form = reactive({
  accountNumber: "",
});

const nameResult = ref(null);
const savingBeneficiary = ref(false);

const handleNameEnquiry = async () => {
  clearError();
  nameResult.value = null;

  const result = await getNameEnquiry(form.accountNumber);

  if (result.success) {
    nameResult.value = result.data;
  }
};

const handleSaveBeneficiary = async () => {
  if (!nameResult.value || !form.accountNumber) return;

  try {
    savingBeneficiary.value = true;

    const result = await saveBeneficiary({
      accountNumber: form.accountNumber,
      beneficiaryName: nameResult.value,
      bankName: "001 Bank",
    });

    if (result.success) {
      // Show success message or notification
      console.log("Beneficiary saved successfully");
    }
  } catch (err) {
    console.error("Failed to save beneficiary:", err);
  } finally {
    savingBeneficiary.value = false;
  }
};
</script>
