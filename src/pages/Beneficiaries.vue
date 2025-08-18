<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ $t("beneficiaries.manageBeneficiaries") }}
          </h1>
          <p class="mt-2 text-gray-600">
            {{ $t("beneficiaries.savedRecipients") }}
          </p>
        </div>
        <button @click="showAddForm = true" class="btn-primary">
          <svg
            class="h-1 w-1 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <!-- <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            /> -->
          </svg>
          {{ $t("beneficiaries.addBeneficiary") }}
        </button>
      </div>

      <!-- Add Beneficiary Form -->
      <div v-if="showAddForm" class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ $t("beneficiaries.addNewBeneficiary") }}
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
              <label for="accountNumber" class="form-label">{{
                $t("forms.accountNumber")
              }}</label>
              <div class="flex space-x-2">
                <input
                  id="accountNumber"
                  v-model="addForm.accountNumber"
                  type="text"
                  required
                  class="input-field flex-1"
                  :placeholder="$t('placeholders.enterAccountNumber')"
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
                    {{ $t("beneficiaries.verifying") }}
                  </span>
                  <span v-else>{{ $t("beneficiaries.verifyAccount") }}</span>
                </button>
              </div>
            </div>
            <div>
              <label for="nickname" class="form-label">{{
                $t("forms.nickname")
              }}</label>
              <input
                id="nickname"
                v-model="addForm.nickname"
                type="text"
                required
                class="input-field"
                :placeholder="$t('placeholders.enterNickname')"
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
            {{ $t("beneficiaries.verifying") }}...
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
                <strong>{{ $t("beneficiaries.verifyAccount") }}:</strong>
                {{ verifiedAccountName }}
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
                {{ $t("beneficiaries.adding") }}
              </span>
              <span v-else>{{ $t("beneficiaries.addBeneficiary") }}</span>
            </button>
            <button
              type="button"
              @click="cancelAdd"
              class="btn-secondary flex-1"
            >
              {{ $t("buttons.cancel") }}
            </button>
          </div>
        </form>
      </div>

      <!-- Beneficiaries List -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          {{ $t("transfer.savedBeneficiaries") }}
        </h2>

        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
          ></div>
          <span class="ml-2 text-gray-600"
            >{{ $t("messages.failedToLoadBeneficiaries") }}...</span
          >
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
            {{ $t("messages.failedToLoadBeneficiaries") }}
          </h3>
          <p class="mt-2 text-gray-500">{{ error }}</p>
          <button @click="loadBeneficiaries" class="mt-4 btn-primary">
            {{ $t("buttons.retry") }}
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
            {{ $t("beneficiaries.noBeneficiaries") }}
          </h3>
          <p class="mt-2 text-gray-500">
            {{ $t("beneficiaries.startByAdding") }}
          </p>
          <button @click="showAddForm = true" class="mt-4 btn-primary">
            {{ $t("beneficiaries.addBeneficiary") }}
          </button>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="beneficiary in beneficiaries"
            :key="beneficiary.accountNumber"
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
                      query: {
                        accountNumber: beneficiary.accountNumber,
                        name: beneficiary.name,
                      },
                    }"
                    class="btn-primary text-sm"
                  >
                    {{ $t("navigation.transfer") }}
                  </router-link>
                  <button
                    @click="deleteBeneficiary(beneficiary.accountNumber)"
                    class="btn-secondary text-sm text-red-600 hover:text-red-700"
                  >
                    {{ $t("buttons.delete") }}
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
import { useI18n } from "vue-i18n";
import Layout from "@/components/layout/Layout.vue";
import { beneficiaryAPI_v2, accountAPI } from "@/services/api";

const { t } = useI18n();

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

    const response = await beneficiaryAPI_v2.getAll();
    beneficiaries.value = response.data || [];
  } catch (err) {
    error.value =
      err.response?.data?.message || t("messages.failedToLoadBeneficiaries");
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

    const response = await accountAPI.nameEnquiry(addForm.accountNumber);

    // The response is directly the account name as a string
    if (response.data) {
      verifiedAccountName.value = response.data;
    } else {
      verificationError.value = t("messages.accountNotFound");
    }
  } catch (err) {
    verificationError.value =
      err.response?.data?.responseMessage ||
      t("messages.failedToVerifyAccount");
  } finally {
    verificationLoading.value = false;
  }
};

const handleAddBeneficiary = async () => {
  try {
    isAdding.value = true;
    addError.value = null;

    const beneficiaryData = {
      beneficiaryName: addForm.nickname,
      accountNumber: addForm.accountNumber,
    };

    await beneficiaryAPI_v2.save({
      name: beneficiaryData.beneficiaryName,
      accountNumber: beneficiaryData.accountNumber,
    });

    successMessage.value = t("messages.beneficiarySavedSuccessfully");
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);

    cancelAdd();
    loadBeneficiaries();
  } catch (err) {
    addError.value =
      err.response?.data?.message || t("messages.failedToAddBeneficiary");
  } finally {
    isAdding.value = false;
  }
};

const deleteBeneficiary = async (accountNumber) => {
  if (!confirm(t("beneficiaries.deleteBeneficiary") + "?")) {
    return;
  }

  try {
    await beneficiaryAPI_v2.deleteByAccountNumber(accountNumber);
    successMessage.value =
      t("messages.failedToDeleteBeneficiary").replace(
        "Failed to delete",
        "Deleted"
      ) + " successfully!";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
    loadBeneficiaries();
  } catch (err) {
    error.value =
      err.response?.data?.message || t("messages.failedToDeleteBeneficiary");
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

const getBeneficiaryInitials = (displayName) => {
  if (!displayName) return "?";
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

onMounted(() => {
  loadBeneficiaries();
});
</script>
