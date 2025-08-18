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
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import Layout from "@/components/layout/Layout.vue";
import BalanceCard from "@/components/home/BalanceCard.vue";
import QuickActions from "@/components/home/QuickActions.vue";
import RecentTransactions from "@/components/home/RecentTransactions.vue";
import { useAuth } from "@/composables/useAuth";
import { useBalance } from "@/composables/useBalance";
import { useTransactions } from "@/composables/useTransactions";

const { user } = useAuth();
const { balance, getBalance } = useBalance();
const { getRecentTransactions } = useTransactions();
const { t } = useI18n();

const recentTransactions = ref([]);
const transactionsLoading = ref(false);
const transactionsError = ref(null);

const userName = computed(() => {
  return (
    user.value?.accountName ||
    user.value?.firstName ||
    user.value?.name ||
    t("messages.user")
  );
});

const accountNumber = computed(() => {
  return user.value?.accountNumber || "N/A";
});

const accountBalance = computed(() => {
  return balance.value?.accountBalance || user.value?.accountBalance || 0;
});

const loadAccountBalance = async () => {
  if (user.value?.accountNumber) {
    await getBalance(user.value.accountNumber);
  }
};

const loadRecentTransactions = async () => {
  transactionsLoading.value = true;
  transactionsError.value = null;
  try {
    const { success, data, error } = await getRecentTransactions(
      user.value.accountNumber
    );
    if (!success) throw new Error(error || "Failed to get recent transactions");
    recentTransactions.value = data;
  } catch (e) {
    transactionsError.value = e.message;
  } finally {
    transactionsLoading.value = false;
  }
};

onMounted(() => {
  // Only load balance, not transactions to avoid automatic statement generation
  loadAccountBalance();
  loadRecentTransactions();
});
</script>
