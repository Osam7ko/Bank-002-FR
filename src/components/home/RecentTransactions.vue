<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="section-title">Recent Transactions</h3>
      <router-link
        to="/statement"
        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        View All
      </router-link>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="mt-2 text-primary-600 hover:text-primary-700 text-sm"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="transactions.length === 0" class="text-center py-8">
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
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p class="mt-2 text-gray-500">No transactions found</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div
              class="h-10 w-10 rounded-full flex items-center justify-center"
              :class="getTransactionIconBg(transaction.transactionType)"
            >
              <svg
                class="h-5 w-5"
                :class="getTransactionIconColor(transaction.transactionType)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="transaction.transactionType?.toLowerCase() === 'credit'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
                <path
                  v-else-if="
                    transaction.transactionType?.toLowerCase() === 'debit'
                  "
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ getTransactionDescription(transaction) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(transaction.createdAt || transaction.date) }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-center justify-end space-x-1">
            <SarIcon
              size="w-3 h-3"
              :class="getAmountColor(transaction.transactionType)"
            />
            <p
              class="text-sm font-semibold"
              :class="getAmountColor(transaction.transactionType)"
            >
              {{
                formatAmount(transaction.amount, transaction.transactionType)
              }}
            </p>
          </div>
          <p class="text-xs text-gray-500 capitalize">
            {{ transaction.transactionType }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import SarIcon from "@/components/icons/SarIcon.vue";

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

defineEmits(["retry"]);

const formatAmount = (amount, type) => {
  const formattedAmount = new Intl.NumberFormat("ar-SA", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (type?.toLowerCase() === "credit") {
    return `+${formattedAmount}`;
  } else if (type?.toLowerCase() === "debit") {
    return `-${formattedAmount}`;
  }
  return formattedAmount;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getAmountColor = (type) => {
  switch (type?.toLowerCase()) {
    case "credit":
      return "text-green-600";
    case "debit":
      return "text-red-600";
    default:
      return "text-gray-900";
  }
};

const getTransactionIconBg = (type) => {
  switch (type?.toLowerCase()) {
    case "credit":
      return "bg-green-100";
    case "debit":
      return "bg-red-100";
    default:
      return "bg-blue-100";
  }
};

const getTransactionIconColor = (type) => {
  switch (type?.toLowerCase()) {
    case "credit":
      return "text-green-600";
    case "debit":
      return "text-red-600";
    default:
      return "text-blue-600";
  }
};

const getTransactionDescription = (transaction) => {
  const type = transaction.transactionType?.toLowerCase();

  if (type === "transfer") {
    return `Transfer to ${transaction.destinationAccountNumber || "Account"}`;
  } else if (type === "credit") {
    return "Account Credit";
  } else if (type === "debit") {
    return "Account Debit";
  }

  return transaction.description || "Transaction";
};
</script>
