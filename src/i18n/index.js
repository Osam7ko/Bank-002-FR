import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

// Get saved language from localStorage or default to English
const savedLocale = localStorage.getItem("locale") || "en";

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
});

// Function to change language and update document direction
export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);

  // Update document direction for RTL support
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
}

// Set initial direction
setLocale(savedLocale);

export default i18n;
