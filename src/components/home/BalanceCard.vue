<template>
  <div class="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-primary-100">
          {{ $t("dashboard.accountBalance") }}
        </h3>
        <div class="mt-2">
          <div class="flex items-center space-x-2">
            <SarIcon size="w-8 h-8" />
            <p class="text-3xl font-bold">{{ formattedBalance }}</p>
          </div>
          <p class="text-primary-200 text-sm mt-1">
            {{ $t("dashboard.account") }}: {{ accountNumber }}
          </p>
        </div>
      </div>
      <div class="text-primary-200">
        <SarIcon size="w-12 h-12" />
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-primary-500">
      <div class="flex justify-between text-sm">
        <span class="text-primary-200">{{
          $t("dashboard.availableBalance")
        }}</span>
        <div class="flex items-center space-x-1">
          <SarIcon size="w-4 h-4" />
          <span class="font-medium">{{ formattedBalance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import SarIcon from "@/components/icons/SarIcon.vue";

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
  return new Intl.NumberFormat("ar-SA", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
});
</script>
