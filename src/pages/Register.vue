<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t("auth.createAccount") }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t("auth.joinBankAppToday") }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="sr-only">{{
                $t("auth.firstName")
              }}</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                :placeholder="$t('auth.firstName')"
              />
            </div>
            <div>
              <label for="lastName" class="sr-only">{{
                $t("auth.lastName")
              }}</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                :placeholder="$t('auth.lastName')"
              />
            </div>
          </div>

          <div>
            <label for="otherName" class="sr-only">{{
              $t("auth.otherName")
            }}</label>
            <input
              id="otherName"
              v-model="form.otherName"
              name="otherName"
              type="text"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.otherName')"
            />
          </div>

          <div>
            <label for="email" class="sr-only">{{
              $t("auth.emailAddress")
            }}</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.emailAddress')"
            />
          </div>

          <div>
            <label for="password" class="sr-only">{{
              $t("auth.password")
            }}</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.password')"
            />
          </div>

          <div>
            <label for="address" class="sr-only">{{
              $t("auth.address")
            }}</label>
            <input
              id="address"
              v-model="form.address"
              name="address"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.address')"
            />
          </div>

          <div>
            <label for="stateOfOrigin" class="sr-only">{{
              $t("auth.stateOfOrigin")
            }}</label>
            <input
              id="stateOfOrigin"
              v-model="form.stateOfOrigin"
              name="stateOfOrigin"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.stateOfOrigin')"
            />
          </div>

          <div>
            <label for="phoneNumber" class="sr-only">{{
              $t("auth.phoneNumber")
            }}</label>
            <input
              id="phoneNumber"
              v-model="form.phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.phoneNumber')"
            />
          </div>

          <div>
            <label for="alternativePhoneNumber" class="sr-only">{{
              $t("forms.alternativePhoneNumber")
            }}</label>
            <input
              id="alternativePhoneNumber"
              v-model="form.alternativePhoneNumber"
              name="alternativePhoneNumber"
              type="tel"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :placeholder="$t('forms.alternativePhoneNumber')"
            />
          </div>

          <div>
            <label for="gender" class="sr-only">{{
              $t("messages.gender")
            }}</label>
            <select
              id="gender"
              v-model="form.gender"
              name="gender"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            >
              <option value="">{{ $t("auth.selectGender") }}</option>
              <option value="MALE">{{ $t("auth.male") }}</option>
              <option value="FEMALE">{{ $t("auth.female") }}</option>
            </select>
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
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="isLoading"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <div
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
              ></div>
            </span>
            {{
              isLoading ? $t("auth.creatingAccount") : $t("auth.createAccount")
            }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            {{ $t("auth.alreadyHaveAccount") }}
            <router-link
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              {{ $t("auth.signInHere") }}
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useAuth } from "@/composables/useAuth";

const { register, isLoading, error, clearError } = useAuth();

const form = reactive({
  firstName: "",
  lastName: "",
  otherName: "",
  email: "",
  password: "",
  address: "",
  stateOfOrigin: "",
  phoneNumber: "",
  alternativePhoneNumber: "",
  gender: "",
});

const handleRegister = async () => {
  clearError();

  const result = await register({
    firstName: form.firstName,
    lastName: form.lastName,
    otherName: form.otherName || "", // Ensure it's not null
    email: form.email,
    password: form.password,
    address: form.address,
    stateOfOrigin: form.stateOfOrigin,
    phoneNumber: form.phoneNumber,
    alternativePhoneNumber: form.alternativePhoneNumber || "",
    gender: form.gender || "OTHERS",
    status: "ACTIVE",
  });

  if (result.success) {
    console.log("Registration successful");
  }
};
</script>
