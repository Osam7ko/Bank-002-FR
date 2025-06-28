<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Beneficiaries</h1>
          <p class="mt-2 text-gray-600">
            Manage your saved transfer recipients
          </p>
        </div>
        <button @click="showAddForm = true" class="btn-primary">
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Beneficiary
        </button>
      </div>

      <!-- Add Beneficiary Form -->
      <div v-if="showAddForm" class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            Add New Beneficiary
          </h2>
          <button @click="cancelAdd" class="text-gray-400 hover:text-gray-600">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleAddBeneficiary" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="accountNumber" class="form-label"
                >Account Number</label
              >
              <div class="flex space-x-2">
                <input
                  id="accountNumber"
                  v-model="addForm.accountNumber"
                  type="text"
                  required
                  class="input-field flex-1"
                  placeholder="Enter account number"
                />
                <button
                  type="button"
                  @click="verifyAccountNumber"
                  :disabled="!addForm.accountNumber || verificationLoading"
                  class="btn-secondary whitespace-nowrap"
                >
                  <span v-if="verificationLoading" class="flex items-center">
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"
                    ></div>
                    Verifying...
                  </span>
                  <span v-else>Verify Account</span>
                </button>
              </div>
            </div>
            <div>
              <label for="nickname" class="form-label">Nickname</label>
              <input
                id="nickname"
                v-model="addForm.nickname"
                type="text"
                required
                class="input-field"
                placeholder="Enter a nickname"
              />
            </div>
          </div>

          <!-- Account Verification -->
          <div
            v-if="verificationLoading"
            class="flex items-center text-blue-600"
          >
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
            ></div>
            Verifying account...
          </div>

          <div
            v-if="verifiedAccountName"
            class="p-4 bg-green-50 border border-green-200 rounded-md"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-green-400 mr-2"
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
              <span class="text-green-800">
                <strong>Account verified:</strong> {{ verifiedAccountName }}
              </span>
            </div>
          </div>

          <div
            v-if="verificationError"
            class="p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-red-800">{{ verificationError }}</span>
            </div>
          </div>

          <div
            v-if="addError"
            class="p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <span class="text-red-800">{{ addError }}</span>
          </div>

          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="isAdding || !verifiedAccountName"
              class="btn-primary flex-1"
            >
              <span v-if="isAdding" class="flex items-center justify-center">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Adding...
              </span>
              <span v-else>Add Beneficiary</span>
            </button>
            <button
              type="button"
              @click="cancelAdd"
              class="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Beneficiaries List -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Saved Beneficiaries
        </h2>

        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
          ></div>
          <span class="ml-2 text-gray-600">Loading beneficiaries...</span>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            Error loading beneficiaries
          </h3>
          <p class="mt-2 text-gray-500">{{ error }}</p>
          <button @click="loadBeneficiaries" class="mt-4 btn-primary">
            Try Again
          </button>
        </div>

        <div v-else-if="beneficiaries.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
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
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            No beneficiaries yet
          </h3>
          <p class="mt-2 text-gray-500">
            Add your first beneficiary to make transfers easier.
          </p>
          <button @click="showAddForm = true" class="mt-4 btn-primary">
            Add Beneficiary
          </button>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="beneficiary in beneficiaries"
            :key="beneficiary.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center"
                  >
                    <span class="text-white font-medium">
                      {{ getBeneficiaryInitials(beneficiary.name) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ beneficiary.name }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ beneficiary.accountNumber }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 flex space-x-2">
                  <router-link
                    :to="{
                      name: 'Transfer',
                      query: { beneficiary: beneficiary.id },
                    }"
                    class="btn-primary text-sm"
                  >
                    Transfer
                  </router-link>
                  <button
                    @click="deleteBeneficiary(beneficiary.accountNumber)"
                    class="btn-secondary text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="card bg-green-50 border border-green-200"
      >
        <div class="flex items-center">
          <svg
            class="h-5 w-5 text-green-400 mr-2"
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
          <span class="text-green-800">{{ successMessage }}</span>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { beneficiaryAPI, userAPI } from "@/services/api";

const beneficiaries = ref([]);
const isLoading = ref(false);
const error = ref(null);
const showAddForm = ref(false);
const isAdding = ref(false);
const addError = ref(null);
const successMessage = ref(null);
const verificationLoading = ref(false);
const verificationError = ref(null);
const verifiedAccountName = ref(null);

const addForm = reactive({
  accountNumber: "",
  nickname: "",
});

const loadBeneficiaries = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await beneficiaryAPI.getAll();
    beneficiaries.value = response.data || [];
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load beneficiaries";
  } finally {
    isLoading.value = false;
  }
};

const verifyAccountNumber = async () => {
  if (!addForm.accountNumber || addForm.accountNumber.length < 5) {
    verifiedAccountName.value = null;
    verificationError.value = null;
    return;
  }

  try {
    verificationLoading.value = true;
    verificationError.value = null;
    verifiedAccountName.value = null;

    const response = await userAPI.nameEnquiry({
      accountNumber: addForm.accountNumber,
    });

    // The response is directly the account name as a string
    if (response.data) {
      verifiedAccountName.value = response.data;
    } else {
      verificationError.value = "Account not found";
    }
  } catch (err) {
    verificationError.value =
      err.response?.data?.responseMessage || "Failed to verify account";
  } finally {
    verificationLoading.value = false;
  }
};

const handleAddBeneficiary = async () => {
  try {
    isAdding.value = true;
    addError.value = null;

    const beneficiaryData = {
      name: addForm.nickname,
      accountNumber: addForm.accountNumber,
    };

    await beneficiaryAPI.save(beneficiaryData);

    successMessage.value = "Beneficiary added successfully!";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);

    cancelAdd();
    loadBeneficiaries();
  } catch (err) {
    addError.value = err.response?.data?.message || "Failed to add beneficiary";
  } finally {
    isAdding.value = false;
  }
};

const deleteBeneficiary = async (id) => {
  if (!confirm("Are you sure you want to delete this beneficiary?")) {
    return;
  }

  try {
    await beneficiaryAPI.delete(id);
    successMessage.value = "Beneficiary deleted successfully!";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
    loadBeneficiaries();
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to delete beneficiary";
  }
};

const cancelAdd = () => {
  showAddForm.value = false;
  addForm.accountNumber = "";
  addForm.nickname = "";
  addError.value = null;
  verificationError.value = null;
  verifiedAccountName.value = null;
};

const getBeneficiaryInitials = (nickname) => {
  if (!nickname) return "?";
  return nickname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

onMounted(() => {
  loadBeneficiaries();
});
</script>
