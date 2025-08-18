import { ref } from "vue";
import { cardAPI } from "@/services/api";

export function useCardOrders() {
  const products = ref([]);
  const order = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const loadProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await cardAPI.products();
      products.value = Array.isArray(data) ? data : [];
    } catch (e) {
      error.value =
        e?.response?.data?.message || e?.message || "Failed to load products";
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (payload) => {
    loading.value = true;
    error.value = null;
    order.value = null;
    try {
      const { data } = await cardAPI.createOrder(payload);
      order.value = data || null;
      return { success: true, data };
    } catch (e) {
      error.value =
        e?.response?.data?.message || e?.message || "Failed to create order";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const getOrder = async (orderId) => {
    try {
      const { data } = await cardAPI.getOrder(orderId);
      order.value = data || null;
      return data;
    } catch (e) {
      throw e;
    }
  };

  return {
    products,
    order,
    loading,
    error,
    loadProducts,
    createOrder,
    getOrder,
  };
}
