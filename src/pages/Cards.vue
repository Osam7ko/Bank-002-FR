<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Cards</h1>
          <p class="mt-2 text-gray-600">Manage your bank cards</p>
        </div>
        <router-link to="/cards/catalog" class="btn-primary">
          Open Card Catalog
        </router-link>
      </div>

      <!-- Error (list) -->
      <div
        v-if="errors.list"
        class="rounded-md bg-red-50 p-3 text-sm text-red-700"
      >
        {{ errors.list }}
      </div>

      <!-- Cards Grid -->
      <div
        v-if="cards.length === 0 && !loading.list"
        class="text-center py-10 text-gray-500"
      >
        No cards found. Click "Open Card Catalog" to request one.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="card in cards"
          :key="card.id"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <FlippableCard :card="card" />
          <div class="mt-5 flex items-center gap-2">
            <button
              v-if="card.status === 'ACTIVE'"
              @click="updateStatus(card.id, 'BLOCKED')"
              class="btn-secondary text-red-600 hover:text-red-700"
              :disabled="loading.updateId === card.id"
            >
              <span
                v-if="loading.updateId === card.id"
                class="flex items-center"
              >
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"
                ></div>
                Blocking...
              </span>
              <span v-else>Block</span>
            </button>
            <button
              v-if="card.status === 'BLOCKED'"
              @click="updateStatus(card.id, 'ACTIVE')"
              class="btn-secondary text-green-600 hover:text-green-700"
              :disabled="loading.updateId === card.id"
            >
              <span
                v-if="loading.updateId === card.id"
                class="flex items-center"
              >
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"
                ></div>
                Unblocking...
              </span>
              <span v-else>Unblock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useAuth } from "@/composables/useAuth";
import { cardAPI } from "@/services/api";
import FlippableCard from "@/components/cards/FlippableCard.vue";

const { user } = useAuth();

const cards = ref([]);
const errors = ref({ list: null });
const loading = ref({
  list: false,
  updateId: null,
});

const loadCards = async () => {
  const accountNumber = user.value?.accountNumber || "";
  if (!accountNumber) return;
  try {
    loading.value.list = true;
    errors.value.list = null;
    const res = await cardAPI.list(accountNumber);
    cards.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    errors.value.list =
      e?.response?.data?.message || e?.message || "Failed to load cards";
  } finally {
    loading.value.list = false;
  }
};

const updateStatus = async (cardId, status) => {
  try {
    loading.value.updateId = cardId;
    await cardAPI.updateStatus(cardId, status);
    await loadCards();
  } catch (e) {
    errors.value.list =
      e?.response?.data?.message || e?.message || "Failed to update status";
    setTimeout(() => (errors.value.list = null), 3000);
  } finally {
    loading.value.updateId = null;
  }
};

onMounted(() => {
  loadCards();
});
</script>
