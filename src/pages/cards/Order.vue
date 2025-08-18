<template>
  <Layout>
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Card Terms &amp; Confirmation
          </h1>
          <p class="mt-2 text-gray-600">
            Confirm your selection and accept Terms &amp; Conditions to proceed.
          </p>
        </div>
        <router-link class="btn-secondary" :to="{ name: 'CardCatalog' }"
          >Back to Catalog</router-link
        >
      </div>

      <div class="card space-y-6">
        <div>
          <label class="form-label">Selected Product Code</label>
          <input class="input-field" :value="productCode" readonly />
          <p v-if="!productCode" class="text-sm text-red-600 mt-1">
            No product selected. Go back to catalog.
          </p>
        </div>

        <div>
          <label class="form-label">Account Number</label>
          <input
            v-model="accountNumber"
            class="input-field"
            placeholder="2025XXXXXXX"
          />
          <p class="text-xs text-gray-500 mt-1">
            Use your default account number if not sure.
          </p>
        </div>

        <div>
          <label class="form-label">Name on Card (optional)</label>
          <input
            v-model="nameOnCard"
            class="input-field uppercase"
            placeholder="OMAR SALEH"
          />
        </div>

        <div class="space-y-2">
          <div class="p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 class="font-medium text-gray-900 mb-1">
              Terms &amp; Conditions
            </h3>
            <p class="text-sm text-gray-600">
              By placing this order, you acknowledge and accept the Cardholder
              Terms &amp; Conditions, including applicable fees and usage
              guidelines provided by the bank.
            </p>
          </div>
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="accept" class="mr-2" />
            <span class="text-sm text-gray-800"
              >I accept the Terms &amp; Conditions</span
            >
          </label>
        </div>

        <div v-if="err" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {{ err }}
        </div>

        <div class="flex gap-2">
          <router-link
            class="btn-secondary flex-1"
            :to="{ name: 'CardCatalog' }"
            >Cancel</router-link
          >
          <button
            class="btn-primary flex-1"
            :disabled="submitting"
            @click="submitOrder"
          >
            <span v-if="submitting" class="flex items-center justify-center">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              Submitting...
            </span>
            <span v-else>Place Order</span>
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/layout/Layout.vue";
import { useCardOrders } from "@/composables/useCardOrders";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { createOrder } = useCardOrders();
const { user } = useAuth();

const productCode = computed(() => (route.query.productCode || "").toString());
const accountNumber = ref("");
const nameOnCard = ref("");
const accept = ref(false);
const submitting = ref(false);
const err = ref("");

onMounted(() => {
  // Prefill from logged-in user if available
  accountNumber.value = user.value?.accountNumber || "";
  const displayName = user.value?.accountName || user.value?.name || "";
  nameOnCard.value = displayName ? displayName.toUpperCase() : "";
});

const submitOrder = async () => {
  err.value = "";
  if (!accept.value) {
    err.value = "Please accept Terms & Conditions";
    return;
  }
  if (!productCode.value || !accountNumber.value) {
    err.value = "Missing productCode or accountNumber";
    return;
  }

  submitting.value = true;
  const { success, data, error } = await createOrder({
    accountNumber: accountNumber.value,
    productCode: productCode.value,
    nameOnCard: nameOnCard.value || undefined,
    acceptTerms: true,
  });
  submitting.value = false;

  if (!success) {
    err.value = error || "Failed to create order";
    return;
  }
  router.push({
    name: "CardOrderProgress",
    params: { orderId: data.orderId },
    query: { accountNumber: accountNumber.value },
  });
};
</script>
