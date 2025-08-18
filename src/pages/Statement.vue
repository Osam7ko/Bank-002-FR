<template>
  <Layout>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ $t("statement.bankStatement") }}
        </h1>
        <p class="mt-2 text-gray-600">
          {{ $t("statement.generateReceiveStatement") }}
        </p>
      </div>

      <!-- Statement Form -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          {{ $t("statement.requestStatement") }}
        </h2>

        <form @submit.prevent="handleGenerateStatement" class="space-y-6">
          <div>
            <label for="accountNumber" class="form-label">{{
              $t("forms.accountNumber")
            }}</label>
            <input
              id="accountNumber"
              v-model="form.accountNumber"
              type="text"
              required
              readonly
              class="input-field bg-gray-50 cursor-not-allowed"
              :placeholder="$t('placeholders.yourAccountNumber')"
            />
            <p class="text-sm text-gray-500 mt-1">
              {{ $t("transfer.thisIsYourAccount") }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="form-label">{{
                $t("forms.startDate")
              }}</label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="date"
                required
                class="input-field"
              />
            </div>

            <div>
              <label for="endDate" class="form-label">{{
                $t("forms.endDate")
              }}</label>
              <input
                id="endDate"
                v-model="form.endDate"
                type="date"
                required
                class="input-field"
              />
            </div>
          </div>

          <!-- Quick Date Filters -->
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              @click="setDateRange('week')"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {{ $t("statement.last7Days") }}
            </button>
            <button
              type="button"
              @click="setDateRange('month')"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {{ $t("statement.last30Days") }}
            </button>
            <button
              type="button"
              @click="setDateRange('quarter')"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {{ $t("statement.last3Months") }}
            </button>
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
              {{ $t("statement.generatingStatement") }}
            </span>
            <span v-else>{{ $t("statement.generateStatement") }}</span>
          </button>
        </form>
      </div>

      <!-- How it Works -->
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-blue-800 mb-2">
              {{ $t("statement.howStatementWorks") }}
            </h3>
            <ul class="text-sm text-blue-700 space-y-2">
              <li class="flex items-start">
                <svg
                  class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                {{ $t("statement.statementAsPDF") }}
              </li>
              <li class="flex items-start">
                <svg
                  class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                {{ $t("statement.sentToEmail") }}
              </li>
              <li class="flex items-start">
                <svg
                  class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                {{ $t("statement.includesAllTransactions") }}
              </li>
              <li class="flex items-start">
                <svg
                  class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                {{ $t("statement.checkEmailSpam") }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quick Statement for Current User -->
      <div
        v-if="user?.accountNumber"
        class="card bg-green-50 border border-green-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-green-800">
              {{ $t("statement.quickStatement") }}
            </h3>
            <p class="text-sm text-green-600">
              {{ $t("statement.generateForYourAccount") }}
            </p>
          </div>
          <button
            @click="useMyAccount"
            class="btn-primary bg-green-600 hover:bg-green-700"
          >
            {{ $t("statement.useMyAccount") }}
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="statementSuccess"
        class="card bg-green-50 border border-green-200"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-green-800">
              {{ $t("statement.statementGeneratedSuccessfully") }}
            </h3>
            <div class="mt-2 space-y-1">
              <p class="text-sm text-green-700">
                {{ $t("statement.statementSentToEmail") }}
              </p>
              <p class="text-sm text-green-700">
                <span class="font-medium">{{ $t("statement.period") }}:</span>
                {{ form.startDate }} to
                {{ form.endDate }}
              </p>
              <p class="text-sm text-green-700">
                <span class="font-medium">{{ $t("dashboard.account") }}:</span>
                {{ form.accountNumber }}
              </p>
            </div>
            <button
              @click="statementSuccess = false"
              class="mt-3 text-sm text-green-600 hover:text-green-800 underline"
            >
              {{ $t("statement.generateAnotherStatement") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useTransactions } from "@/composables/useTransactions";
import { useAuth } from "@/composables/useAuth";

const { generateStatement, isLoading, error, clearError } = useTransactions();
const { user } = useAuth();

const form = reactive({
  accountNumber: "",
  startDate: "",
  endDate: "",
});

const statementSuccess = ref(false);

const handleGenerateStatement = async () => {
  clearError();
  statementSuccess.value = false;

  const result = await generateStatement(
    form.accountNumber,
    form.startDate,
    form.endDate
  );

  if (result.success) {
    statementSuccess.value = true;
  }
};

const setDateRange = (range) => {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  let startDate;

  switch (range) {
    case "week":
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "month":
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "quarter":
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
  }

  form.startDate = startDate;
  form.endDate = endDate;
};

const useMyAccount = () => {
  if (user.value?.accountNumber) {
    form.accountNumber = user.value.accountNumber;
    setDateRange("month");
  }
};

onMounted(() => {
  // Set default account number and date range
  if (user.value?.accountNumber) {
    form.accountNumber = user.value.accountNumber;
  }
  setDateRange("month");
});
</script>
