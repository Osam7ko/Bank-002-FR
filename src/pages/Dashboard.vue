<template>
  <Layout>
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("dashboard.welcomeBack", { name: userName }) }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ $t("dashboard.accountOverview") }}
        </p>
      </div>

      <!-- Balance Card -->
      <BalanceCard :balance="accountBalance" :account-number="accountNumber" />

      <!-- Quick Actions -->
      <div>
        <h2 class="section-title">{{ $t("dashboard.quickActions") }}</h2>
        <QuickActions />
      </div>

      <!-- Recent Transactions -->
      <RecentTransactions
        :transactions="recentTransactions"
        :is-loading="transactionsLoading"
        :error="transactionsError"
        @retry="loadRecentTransactions"
      />
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import Layout from "@/components/layout/Layout.vue";
import BalanceCard from "@/components/home/BalanceCard.vue";
import QuickActions from "@/components/home/QuickActions.vue";
import RecentTransactions from "@/components/home/RecentTransactions.vue";
import { useAuth } from "@/composables/useAuth";
import { useBalance } from "@/composables/useBalance";
import { useTransactions } from "@/composables/useTransactions";

const { t } = useI18n();
const { user } = useAuth();
const { balance, getBalance } = useBalance();
const { getRecentTransactions } = useTransactions();

const recentTransactions = ref([]);
const transactionsLoading = ref(false);
const transactionsError = ref(null);

const userName = computed(
  () =>
    user.value?.accountName ||
    user.value?.firstName ||
    user.value?.name ||
    t("messages.user")
);

const accountNumber = computed(() => user.value?.accountNumber || "N/A");

// balance is now always a number
const accountBalance = computed(() => Number(balance.value ?? 0));

// helpers for date range (last 30d)
const iso = (d) => d.toISOString().split("T")[0];
const lastNDays = (n) => {
  const today = new Date();
  const start = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  return { from: iso(start), to: iso(today) };
};

const loadAccountBalance = async (acct) => {
  if (!acct) return;
  await getBalance(acct);
};

const loadRecentTransactions = async (acct) => {
  if (!acct) return;
  const { from, to } = lastNDays(30);
  transactionsLoading.value = true;
  transactionsError.value = null;
  try {
    const { success, data, error } = await getRecentTransactions(
      acct,
      from,
      to,
      5
    );
    if (!success) throw new Error(error || "Failed to get recent transactions");
    recentTransactions.value = Array.isArray(data) ? data : [];
  } catch (e) {
    transactionsError.value = e?.message || "Failed to get recent transactions";
    recentTransactions.value = [];
  } finally {
    transactionsLoading.value = false;
  }
};

// ➊ React immediately when the account number shows up (or changes)
watch(
  () => user.value?.accountNumber,
  (acct) => {
    if (acct) {
      loadAccountBalance(acct);
      loadRecentTransactions(acct);
    }
  },
  { immediate: true }
);

// You can keep onMounted for SSR safety but it's not required now
onMounted(() => {
  if (user.value?.accountNumber) {
    loadAccountBalance(user.value.accountNumber);
    loadRecentTransactions(user.value.accountNumber);
  }
});
</script>
