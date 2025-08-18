<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
      :class="{ 'text-primary-600': dropdownOpen }"
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
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span>{{ currentLanguageLabel }}</span>
      <svg
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': dropdownOpen }"
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
      v-show="dropdownOpen"
      class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50"
      @click.stop
    >
      <button
        @click="changeLanguage('en')"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
        :class="{ 'bg-primary-50 text-primary-600': currentLocale === 'en' }"
      >
        English
      </button>
      <button
        @click="changeLanguage('ar')"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
        :class="{ 'bg-primary-50 text-primary-600': currentLocale === 'ar' }"
      >
        العربية
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { setLocale } from "@/i18n";

const { locale, t } = useI18n();
const dropdownOpen = ref(false);

const currentLocale = computed(() => locale.value);

const currentLanguageLabel = computed(() => {
  return currentLocale.value === "ar" ? "العربية" : "English";
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const changeLanguage = (newLocale) => {
  setLocale(newLocale);
  dropdownOpen.value = false;
};

const closeDropdown = (event) => {
  if (!event.target.closest(".relative")) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
