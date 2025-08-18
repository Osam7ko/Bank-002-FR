<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">BankApp 002</h1>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/dashboard"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'text-primary-600 bg-primary-50': $route.name === 'Dashboard',
            }"
          >
            {{ $t("navigation.dashboard") }}
          </router-link>

          <div class="relative group">
            <button
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
            >
              {{ $t("navigation.transactions") }}
              <svg
                class="ml-1 h-4 w-4"
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
            <div
              class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <router-link
                to="/transfer"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                {{ $t("navigation.transfer") }}
              </router-link>
              <router-link
                to="/credit"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                {{ $t("navigation.credit") }}
              </router-link>
              <router-link
                to="/debit"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                {{ $t("navigation.debit") }}
              </router-link>
            </div>
          </div>

          <router-link
            to="/beneficiaries"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'text-primary-600 bg-primary-50': $route.name === 'Beneficiaries',
            }"
          >
            {{ $t("navigation.beneficiaries") }}
          </router-link>

          <router-link
            to="/statement"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'text-primary-600 bg-primary-50': $route.name === 'Statement',
            }"
          >
            {{ $t("navigation.statement") }}
          </router-link>

          <router-link
            to="/cards"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'text-primary-600 bg-primary-50': $route.name === 'Cards',
            }"
          >
            {{ $t("navigation.cards") }}
          </router-link>
        </div>

        <!-- User Menu and Language Switcher -->
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <LanguageSwitcher />

          <div class="relative group">
            <button
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <div
                class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center"
              >
                <span class="text-white font-medium">{{ userInitials }}</span>
              </div>
              <span class="ml-2 text-gray-700 font-medium">{{ userName }}</span>
              <svg
                class="ml-1 h-4 w-4 text-gray-400"
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
            <div
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                {{ $t("navigation.profile") }}
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                {{ $t("navigation.logout") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="md:hidden">
      <div
        class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200"
      >
        <router-link
          to="/dashboard"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.dashboard") }}
        </router-link>
        <router-link
          to="/transfer"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.transfer") }}
        </router-link>
        <router-link
          to="/credit"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.credit") }}
        </router-link>
        <router-link
          to="/debit"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.debit") }}
        </router-link>
        <router-link
          to="/beneficiaries"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.beneficiaries") }}
        </router-link>
        <router-link
          to="/statement"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.statement") }}
        </router-link>
        <router-link
          to="/cards"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.cards") }}
        </router-link>
        <router-link
          to="/profile"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          {{ $t("navigation.profile") }}
        </router-link>
        <button
          @click="handleLogout"
          class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
        >
          {{ $t("navigation.logout") }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";

const { user, logout } = useAuth();
const { t } = useI18n();
const mobileMenuOpen = ref(false);

const userName = computed(() => {
  return (
    user.value?.accountName ||
    user.value?.firstName ||
    user.value?.name ||
    t("messages.user")
  );
});

const userInitials = computed(() => {
  const name = userName.value;
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

const handleLogout = () => {
  mobileMenuOpen.value = false;
  logout();
};
</script>
