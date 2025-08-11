<template>
  <Layout>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Balance Enquiry</h1>
        <p class="mt-2 text-gray-600">
          Check account balance by account number
        </p>
      </div>

      <!-- Enquiry Form -->
      <div class="card">
        <form @submit.prevent="handleBalanceEnquiry" class="space-y-6">
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
              Checking...
            </span>
            <span v-else>Check Balance</span>
          </button>
        </form>
      </div>

      <!-- Balance Result -->
      <div
        v-if="balanceResult"
        class="card bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div
              class="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center"
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-green-800">
              Account Balance
            </h3>
            <div class="mt-2 space-y-1">
              <p class="text-2xl font-bold text-green-900">
                {{ formatCurrency(balanceResult.accountBalance) }}
              </p>
              <p class="text-sm text-green-700">
                <span class="font-medium">Account:</span>
                {{ balanceResult.accountNumber }}
              </p>
              <p class="text-sm text-green-700">
                <span class="font-medium">Name:</span>
                {{ balanceResult.accountName }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Balance Check for Current User -->
      <div
        v-if="user?.accountNumber"
        class="card bg-blue-50 border border-blue-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-blue-800">
              Your Account Balance
            </h3>
            <p class="text-sm text-blue-600">
              Quick check for your current account
            </p>
          </div>
          <button
            @click="checkMyBalance"
            :disabled="isLoading"
            class="btn-primary bg-blue-600 hover:bg-blue-700"
          >
            Check My Balance
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
import { useAuth } from "@/composables/useAuth";

const { getBalance, isLoading, error, clearError } = useBalance();
const { user } = useAuth();

const form = reactive({
  accountNumber: "",
});

const balanceResult = ref(null);

const handleBalanceEnquiry = async () => {
  clearError();
  balanceResult.value = null;

  const result = await getBalance(form.accountNumber);

  if (result.success) {
    balanceResult.value = result.data.accountInfo;
  }
};

const checkMyBalance = async () => {
  if (user.value?.accountNumber) {
    form.accountNumber = user.value.accountNumber;
    await handleBalanceEnquiry();
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ar-SA", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};
</script>
