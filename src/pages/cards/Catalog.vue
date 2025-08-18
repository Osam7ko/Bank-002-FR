<template>
  <Layout>
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Choose a Card</h1>
          <p class="mt-2 text-gray-600">
            Pick a card product that suits you best.
          </p>
        </div>
        <router-link class="btn-secondary" :to="{ name: 'Cards' }">
          Back to My Cards
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
      </div>

      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 011.5 0v.5a.75.75 0 11-1.5 0v-.5zm0-6a.75.75 0 011.5 0V11a.75.75 0 11-1.5 0V6.75z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
          </div>
        </div>
      </div>

      <div
        v-if="!loading && !error"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <div
          v-for="p in products"
          :key="p.code"
          class="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-wider text-gray-500">
                Product
              </div>
              <div class="mt-1 text-lg font-semibold text-gray-900">
                {{ p.displayName }}
              </div>
              <div class="text-sm text-gray-600">Network: {{ p.network }}</div>
            </div>
            <div
              class="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700"
            >
              {{ p.code }}
            </div>
          </div>

          <div class="mt-4">
            <div class="text-sm font-medium text-gray-700">Benefits</div>
            <ul
              class="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1"
            >
              <li v-for="b in p.benefits" :key="b">{{ b }}</li>
            </ul>
          </div>

          <div class="mt-5">
            <button class="btn-primary w-full" @click="pick(p)">Select</button>
          </div>
        </div>

        <div
          v-if="products.length === 0 && !loading"
          class="text-gray-500 text-center col-span-full py-10"
        >
          No card products available at the moment.
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useCardOrders } from "@/composables/useCardOrders";
import { useRouter } from "vue-router";

const router = useRouter();
const { products, loading, error, loadProducts } = useCardOrders();

onMounted(loadProducts);

const pick = (p) => {
  router.push({ name: "CardOrder", query: { productCode: p.code } });
};
</script>
