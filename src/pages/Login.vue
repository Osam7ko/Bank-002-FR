<template>
  <div
    class="min-h-screen flex bg-gradient-to-br from-primary-600 to-primary-800"
  >
    <!-- Left side - Login Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8">
      <div class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-gray-900">
            {{ $t("auth.welcomeBack") }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {{ $t("auth.signInToAccount") }}
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
                >{{ $t("auth.emailAddress") }}</label
              >
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :placeholder="$t('auth.enterEmail')"
              />
            </div>
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >{{ $t("auth.password") }}</label
              >
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :placeholder="$t('auth.enterPassword')"
              />
            </div>
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

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span
                v-if="isLoading"
                class="absolute left-0 inset-y-0 flex items-center pl-3"
              >
                <div
                  class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                ></div>
              </span>
              {{ isLoading ? $t("auth.signingIn") : $t("auth.signIn") }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              {{ $t("auth.dontHaveAccount") }}
              <router-link
                to="/register"
                class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                {{ $t("auth.signUpHere") }}
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Right side - Project Info -->
    <div
      class="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-8 items-center justify-center"
    >
      <div class="max-w-lg text-white space-y-8">
        <div class="space-y-4">
          <h1 class="text-4xl font-bold">
            {{ $t("features.modernBankingSolution") }}
          </h1>
          <p class="text-lg text-primary-100">
            {{ $t("features.experienceSeamlessBanking") }}
          </p>
        </div>

        <div class="space-y-6">
          <h2 class="text-2xl font-semibold">
            {{ $t("features.currentFeatures") }}
          </h2>
          <ul class="space-y-3">
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-primary-300"
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
              <span>{{ $t("features.secureMoneyTransfers") }}</span>
            </li>
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-primary-300"
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
              <span>{{ $t("features.beneficiaryManagement") }}</span>
            </li>
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-primary-300"
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
              <span>{{ $t("features.realTimeBalanceTracking") }}</span>
            </li>
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-primary-300"
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
              <span>{{ $t("features.transactionHistoryStatements") }}</span>
            </li>
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-primary-300"
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
              <span>{{ $t("features.accountVerificationSecurity") }}</span>
            </li>
          </ul>
        </div>

        <div class="space-y-6">
          <h2 class="text-2xl font-semibold text-yellow-300">
            {{ $t("features.comingSoon") }}
          </h2>
          <ul class="space-y-3">
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-yellow-300"
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
              <span
                ><strong>{{ $t("features.bankCardManagement") }}</strong
                ><br />
                <span class="text-sm text-primary-200">{{
                  $t("features.bankCardManagementDesc")
                }}</span>
              </span>
            </li>
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-yellow-300"
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
              <span
                ><strong>{{ $t("features.subAccountCreation") }}</strong
                ><br />
                <span class="text-sm text-primary-200">{{
                  $t("features.subAccountCreationDesc")
                }}</span>
              </span>
            </li>
            <li class="flex items-center space-x-3">
              <svg
                class="h-5 w-5 text-yellow-300"
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
              <span
                ><strong>{{ $t("features.mobileBankingApp") }}</strong
                ><br />
                <span class="text-sm text-primary-200">{{
                  $t("features.mobileBankingAppDesc")
                }}</span>
              </span>
            </li>
          </ul>
        </div>

        <div class="pt-4 border-t border-primary-600">
          <p class="text-sm text-primary-200">
            {{ $t("features.builtWithModernTech") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useAuth } from "@/composables/useAuth";

const { login, isLoading, error, clearError } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  clearError();

  const result = await login({
    email: form.email,
    password: form.password,
  });

  if (result.success) {
    // Navigation is handled in the useAuth composable
    console.log("Login successful");
  }
};
</script>
