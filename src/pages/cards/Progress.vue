<template>
  <Layout>
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Processing your card…
          </h1>
          <p class="mt-2 text-gray-600">
            We are issuing your new card. This usually takes around
            {{ eta }} seconds.
          </p>
        </div>
        <router-link class="btn-secondary" :to="{ name: 'CardCatalog' }"
          >Back to Catalog</router-link
        >
      </div>

      <div class="card space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-600">Order ID</div>
            <div class="font-mono text-gray-900">{{ orderId }}</div>
          </div>
          <div>
            <span
              :class="[
                'px-3 py-1 text-xs font-semibold rounded-full',
                status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : status === 'REJECTED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-800',
              ]"
            >
              {{ status }}
            </span>
          </div>
        </div>

        <div v-if="status !== 'COMPLETED' && status !== 'REJECTED'">
          <div class="text-sm text-gray-600 mb-2">Estimated time remaining</div>
          <div class="w-full bg-gray-100 rounded-full h-2.5">
            <div
              class="bg-primary-600 h-2.5 rounded-full transition-all"
              :style="{ width: progressBar + '%' }"
            ></div>
          </div>
          <div class="mt-2 text-sm text-gray-700">~ {{ eta }} second(s)</div>
        </div>

        <div
          v-if="status === 'REJECTED'"
          class="rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {{ message || "Order was rejected" }}
        </div>

        <div v-if="status === 'COMPLETED' && card" class="space-y-3">
          <div class="rounded-md bg-green-50 p-3 border border-green-200">
            <h2 class="text-lg font-semibold text-green-800">Card Issued 🎉</h2>
            <p class="text-sm text-green-700">{{ message }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-500">Type</div>
              <div class="font-medium text-gray-900">{{ card.cardType }}</div>
            </div>
            <div>
              <div class="text-gray-500">Masked Number</div>
              <div class="font-medium text-gray-900">
                {{ card.maskedCardNumber }}
                <!-- do not show full PAN -->
              </div>
            </div>
            <div>
              <div class="text-gray-500">Expiry</div>
              <div class="font-medium text-gray-900">
                {{ card.expiryMonth }}/{{ card.expiryYear }}
              </div>
            </div>
            <div>
              <div class="text-gray-500">Account</div>
              <div class="font-medium text-gray-900">
                {{ card.accountNumber }}
              </div>
            </div>
          </div>

          <div class="mt-4">
            <button class="btn-primary" @click="goToCards">
              View my cards
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/layout/Layout.vue";
import { useCardOrders } from "@/composables/useCardOrders";
import { useCardSecretsStore } from "@/stores/cardSecrets";

const route = useRoute();
const router = useRouter();

const orderId = route.params.orderId?.toString() || "";
const accountNumber = (route.query.accountNumber || "").toString();

const { getOrder } = useCardOrders();
const secretsStore = useCardSecretsStore();

const status = ref("PENDING");
const eta = ref(30);
const message = ref("");
const card = ref(null);

let ticking = null;
let polling = null;

const baseEta = ref(30);
const progressBar = computed(() => {
  if (status.value === "COMPLETED") return 100;
  if (baseEta.value <= 0) return 0;
  const consumed = Math.max(0, baseEta.value - eta.value);
  return Math.min(100, Math.round((consumed / baseEta.value) * 100));
});

const poll = async () => {
  try {
    const data = await getOrder(orderId);
    status.value = data?.status || status.value;
    if (data?.etaSeconds != null && baseEta.value === 30) {
      baseEta.value = Number.isFinite(data.etaSeconds)
        ? data.etaSeconds
        : baseEta.value;
    }
    if (data?.etaSeconds != null) {
      eta.value = data.etaSeconds;
    }
    message.value = data?.message || "";
    card.value = data?.card || null;

    // On completion, stash secrets and navigate to cards
    if (status.value === "COMPLETED" && card.value) {
      if (data?.secrets && card.value.id) {
        secretsStore.put(card.value.id, data.secrets);
      }
      if (polling) clearInterval(polling);
      if (ticking) clearInterval(ticking);
      router.push({ name: "Cards" });
    }
    if (status.value === "REJECTED") {
      if (polling) clearInterval(polling);
      if (ticking) clearInterval(ticking);
    }
  } catch (e) {
    if (e?.response?.status === 401) {
      if (polling) clearInterval(polling);
      if (ticking) clearInterval(ticking);
      router.push("/login");
    }
  }
};

onMounted(async () => {
  await poll();
  // countdown tick
  ticking = setInterval(() => {
    if (eta.value > 0) eta.value -= 1;
  }, 1000);
  // poll every 2 seconds
  polling = setInterval(poll, 2000);
});

onUnmounted(() => {
  if (polling) clearInterval(polling);
  if (ticking) clearInterval(ticking);
});

const goToCards = () => {
  if (accountNumber) {
    router.push({ name: "CardsList", params: { accountNumber } });
  } else {
    router.push({ name: "Cards" });
  }
};
</script>
