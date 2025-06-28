<template>
  <Layout>
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900">
          Welcome back, {{ userName }}!
        </h1>
        <p class="text-gray-600 mt-1">
          Here's an overview of your account activity
        </p>
      </div>

      <!-- Balance Card -->
      <BalanceCard :balance="accountBalance" :account-number="accountNumber" />

      <!-- Quick Actions -->
      <div>
        <h2 class="section-title">Quick Actions</h2>
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

const recentTransactions = ref([]);
const transactionsLoading = ref(false);
const transactionsError = ref(null);

const userName = computed(() => {
  return (
    user.value?.accountName ||
    user.value?.firstName ||
    user.value?.name ||
    "User"
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
  // Remove automatic transaction loading to avoid statement generation
  // Transactions will only be loaded when user explicitly requests them
  recentTransactions.value = [];
  transactionsLoading.value = false;
  transactionsError.value = null;
};

onMounted(() => {
  // Only load balance, not transactions to avoid automatic statement generation
  loadAccountBalance();
});
</script>
