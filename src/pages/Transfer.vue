<template>
  <Layout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Transfer Money</h1>
        <p class="mt-2 text-gray-600">Send money to other accounts securely</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Transfer Form -->
        <div class="lg:col-span-2">
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              Transfer Details
            </h2>

            <form @submit.prevent="handleTransfer" class="space-y-6">
              <div>
                <label for="sourceAccountNumber" class="form-label"
                  >From Account</label
                >
                <input
                  id="sourceAccountNumber"
                  v-model="form.sourceAccountNumber"
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

              <div>
                <label for="destinationAccountNumber" class="form-label"
                  >To Account</label
                >
                <div class="relative">
                  <input
                    id="destinationAccountNumber"
                    v-model="form.destinationAccountNumber"
                    type="text"
                    required
                    class="input-field pr-10"
                    placeholder="Destination account number"
                    @blur="checkAccountName"
                  />
                  <button
                    type="button"
                    @click="showBeneficiaries = !showBeneficiaries"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Account Name Display -->
                <div
                  v-if="accountName"
                  class="mt-2 p-2 bg-green-50 border border-green-200 rounded-md"
                >
                  <p class="text-sm text-green-800">
                    <span class="font-medium">Account Name:</span>
                    {{ accountName }}
                  </p>
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
                  placeholder="Transfer description"
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
                    <h3 class="text-sm font-medium text-red-800">
                      {{ error }}
                    </h3>
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
                  Processing Transfer...
                </span>
                <span v-else>Transfer {{ formatCurrency(form.amount) }}</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Saved Beneficiaries -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Saved Beneficiaries
              </h3>
              <button
                @click="loadBeneficiaries"
                class="text-primary-600 hover:text-primary-700 text-sm"
              >
                Refresh
              </button>
            </div>

            <div v-if="beneficiariesLoading" class="flex justify-center py-4">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"
              ></div>
            </div>

            <div
              v-else-if="beneficiaries.length === 0"
              class="text-center py-6"
            >
              <svg
                class="mx-auto h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="mt-2 text-sm text-gray-500">No saved beneficiaries</p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="beneficiary in beneficiaries"
                :key="beneficiary.id"
                class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="selectBeneficiary(beneficiary)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ beneficiary.accountName }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ beneficiary.accountNumber }}
                    </p>
                  </div>
                  <button
                    @click.stop="deleteBeneficiary(beneficiary.id)"
                    class="text-red-400 hover:text-red-600"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div
        v-if="transferSuccess"
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
              Transfer Successful!
            </h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">
                Your transfer of {{ formatCurrency(form.amount) }} has been
                processed successfully.
              </p>
            </div>
            <div class="items-center px-4 py-3">
              <button
                @click="resetForm"
                class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600"
              >
                Make Another Transfer
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

const {
  transfer,
  isLoading,
  error,
  clearError,
  beneficiaries,
  getBeneficiaries,
  deleteBeneficiary: removeBeneficiary,
} = useTransfer();
const { getNameEnquiry } = useBalance();
const { user } = useAuth();

const form = reactive({
  sourceAccountNumber: "",
  destinationAccountNumber: "",
  amount: "",
  description: "",
});

const accountName = ref("");
const transferSuccess = ref(false);
const showBeneficiaries = ref(false);
const beneficiariesLoading = ref(false);

const handleTransfer = async () => {
  clearError();

  const result = await transfer({
    sourceAccountNumber: form.sourceAccountNumber,
    destinationAccountNumber: form.destinationAccountNumber,
    amount: parseFloat(form.amount),
    description: form.description,
  });

  if (result.success) {
    transferSuccess.value = true;
  }
};

const checkAccountName = async () => {
  if (form.destinationAccountNumber) {
    try {
      const result = await getNameEnquiry(form.destinationAccountNumber);
      if (result.success) {
        accountName.value = result.data;
      }
    } catch (error) {
      accountName.value = "";
    }
  }
};

const selectBeneficiary = (beneficiary) => {
  form.destinationAccountNumber = beneficiary.accountNumber;
  accountName.value = beneficiary.accountName;
  showBeneficiaries.value = false;
};

const loadBeneficiaries = async () => {
  beneficiariesLoading.value = true;
  await getBeneficiaries();
  beneficiariesLoading.value = false;
};

const deleteBeneficiary = async (id) => {
  await removeBeneficiary(id);
};

const resetForm = () => {
  form.sourceAccountNumber = user.value?.accountNumber || "";
  form.destinationAccountNumber = "";
  form.amount = "";
  form.description = "";
  accountName.value = "";
  transferSuccess.value = false;
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
  form.sourceAccountNumber = user.value?.accountNumber || "";
  loadBeneficiaries();
});
</script>
