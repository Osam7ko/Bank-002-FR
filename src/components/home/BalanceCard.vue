<template>
  <div class="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-primary-100">Account Balance</h3>
        <div class="mt-2">
          <p class="text-3xl font-bold">{{ formattedBalance }}</p>
          <p class="text-primary-200 text-sm mt-1">
            Account: {{ accountNumber }}
          </p>
        </div>
      </div>
      <div class="text-primary-200">
        <svg
          class="h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-primary-500">
      <div class="flex justify-between text-sm">
        <span class="text-primary-200">Available Balance</span>
        <span class="font-medium">{{ formattedBalance }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  balance: {
    type: [Number, String],
    default: 0,
  },
  accountNumber: {
    type: String,
    default: "N/A",
  },
});

const formattedBalance = computed(() => {
  const amount = parseFloat(props.balance) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
});
</script>
