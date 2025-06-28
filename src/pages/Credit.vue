<template>
  <Layout>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Credit Account</h1>
        <p class="mt-2 text-gray-600">Add funds to an account</p>
      </div>

      <!-- Credit Form -->
      <div class="card">
        <form @submit.prevent="handleCredit" class="space-y-6">
          <div>
            <label for="accountNumber" class="form-label">Account Number</label>
            <input
              id="accountNumber"
              v-model="form.accountNumber"
              type="text"
              required
              readonly
              class="input-field bg-gray-50 cursor-not-allowed"
              placeholder="Your account number"
            />
            <p class="text-sm text-gray-500 mt-1">
              This is your account number (locked)
            </p>
          </div>

          <!-- Account Name Display -->
          <div
            v-if="accountName"
            class="p-4 bg-green-50 border border-green-200 rounded-md"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  Account Name: {{ accountName }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label for="amount" class="form-label">Amount</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="amount"
                v-model="form.amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                class="input-field pl-7"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label for="description" class="form-label"
              >Description (Optional)</label
            >
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="input-field"
              placeholder="Credit description"
            ></textarea>
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
              Processing Credit...
            </span>
            <span v-else>Credit {{ formatCurrency(form.amount) }}</span>
          </button>
        </form>
      </div>

      <!-- Quick Credit for Current User -->
      <div
        v-if="user?.accountNumber"
        class="card bg-blue-50 border border-blue-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-blue-800">Quick Credit</h3>
            <p class="text-sm text-blue-600">Credit your own account</p>
          </div>
          <button
            @click="useMyAccount"
            class="btn-primary bg-blue-600 hover:bg-blue-700"
          >
            Use My Account
          </button>
        </div>
      </div>

      <!-- Success Modal -->
      <div
        v-if="creditSuccess"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        >
          <div class="mt-3 text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
            >
              <svg
                class="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">
              Credit Successful!
            </h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">
                The account has been credited with
                {{ formatCurrency(form.amount) }} successfully.
              </p>
            </div>
            <div class="items-center px-4 py-3">
              <button
                @click="resetForm"
                class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600"
              >
                Make Another Credit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useTransfer } from "@/composables/useTransfer";
import { useBalance } from "@/composables/useBalance";
import { useAuth } from "@/composables/useAuth";

const { credit, isLoading, error, clearError } = useTransfer();
const { getNameEnquiry } = useBalance();
const { user } = useAuth();

const form = reactive({
  accountNumber: "",
  amount: "",
  description: "",
});

const accountName = ref("");
const creditSuccess = ref(false);

const handleCredit = async () => {
  clearError();

  const result = await credit({
    accountNumber: form.accountNumber,
    amount: parseFloat(form.amount),
    description: form.description,
  });

  if (result.success) {
    creditSuccess.value = true;
  }
};

const checkAccountName = async () => {
  if (form.accountNumber) {
    try {
      const result = await getNameEnquiry(form.accountNumber);
      if (result.success) {
        accountName.value = result.data;
      }
    } catch (error) {
      accountName.value = "";
    }
  }
};

const useMyAccount = () => {
  if (user.value?.accountNumber) {
    form.accountNumber = user.value.accountNumber;
    checkAccountName();
  }
};

const resetForm = () => {
  // Keep the account number, only reset other fields
  form.amount = "";
  form.description = "";
  accountName.value = "";
  creditSuccess.value = false;
  clearError();
};

const formatCurrency = (amount) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

onMounted(() => {
  if (user.value?.accountNumber) {
    form.accountNumber = user.value.accountNumber;
    checkAccountName();
  }
});
</script>
