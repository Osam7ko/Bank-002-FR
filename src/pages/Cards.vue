<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Cards</h1>
          <p class="mt-2 text-gray-600">Manage and issue your bank cards</p>
        </div>
        <button @click="openIssueModal" class="btn-primary">
          Issue New Card
        </button>
      </div>

      <!-- Account Selector -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div class="md:col-span-2">
            <label for="cardAccountNumber" class="form-label"
              >Account Number</label
            >
            <input
              id="cardAccountNumber"
              v-model="accountNumber"
              type="text"
              class="input-field"
              :placeholder="
                user?.accountNumber
                  ? user.accountNumber
                  : 'Enter account number'
              "
            />
          </div>
          <div class="flex gap-2">
            <button
              class="btn-secondary w-full md:w-auto"
              @click="useMyAccount"
              :disabled="!user?.accountNumber"
            >
              Use My Account
            </button>
            <button
              class="btn-primary w-full md:w-auto"
              @click="loadCards"
              :disabled="!accountNumber || loading.list"
            >
              <span
                v-if="loading.list"
                class="flex items-center justify-center"
              >
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Loading...
              </span>
              <span v-else>Load Cards</span>
            </button>
          </div>
        </div>
        <p v-if="errors.list" class="text-sm text-red-600 mt-2">
          {{ errors.list }}
        </p>
      </div>

      <!-- Cards Grid -->
      <div
        v-if="cards.length === 0 && !loading.list"
        class="text-center py-10 text-gray-500"
      >
        No cards found. Click "Issue New Card" to create one.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="card in cards"
          :key="card.id"
          class="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs uppercase tracking-wider text-gray-500">
                Card
              </div>
              <div class="mt-1 text-lg font-semibold text-gray-900">
                {{ card.maskedPan }}
              </div>
            </div>
            <span
              :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                card.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : card.status === 'BLOCKED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ card.status }}
            </span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-500">Name on Card</div>
              <div class="font-medium text-gray-900">{{ card.nameOnCard }}</div>
            </div>
            <div>
              <div class="text-gray-500">Type</div>
              <div class="font-medium text-gray-900">{{ card.cardType }}</div>
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

      <!-- Verify Card (optional QA tool) -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Verify Card</h2>
          <button
            class="text-sm text-primary-600 hover:text-primary-700"
            @click="toggleVerify = !toggleVerify"
          >
            {{ toggleVerify ? "Hide" : "Show" }}
          </button>
        </div>
        <div
          v-show="toggleVerify"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label class="form-label">Card Number</label>
            <input
              v-model="verifyForm.cardNumber"
              type="text"
              class="input-field"
            />
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="form-label">MM</label>
              <input
                v-model="verifyForm.expiryMonth"
                type="text"
                class="input-field"
                placeholder="02"
              />
            </div>
            <div>
              <label class="form-label">YYYY</label>
              <input
                v-model="verifyForm.expiryYear"
                type="text"
                class="input-field"
                placeholder="2030"
              />
            </div>
            <div>
              <label class="form-label">CVV</label>
              <input
                v-model="verifyForm.cvv"
                type="password"
                class="input-field"
                placeholder="123"
              />
            </div>
          </div>
          <div class="md:col-span-2 flex gap-2">
            <button
              class="btn-secondary"
              @click="verifyCard"
              :disabled="loading.verify"
            >
              <span v-if="loading.verify" class="flex items-center">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"
                ></div>
                Verifying...
              </span>
              <span v-else>Verify</span>
            </button>
            <div v-if="verifyResult" class="text-sm text-gray-700">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  verifyResult.approved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                ]"
              >
                {{ verifyResult.approved ? "Approved" : "Declined" }}
              </span>
              <span class="ml-2">Reason: {{ verifyResult.reason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue Card Modal -->
    <div
      v-if="issueModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Issue New Card</h2>
          <button
            @click="closeIssueModal"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleIssue" class="space-y-4">
          <div>
            <label class="form-label">Account Number</label>
            <input
              v-model="issueForm.accountNumber"
              type="text"
              class="input-field"
              required
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="form-label">Card Type</label>
              <select v-model="issueForm.cardType" class="input-field" required>
                <option value="VISA">VISA</option>
                <option value="MASTERCARD">MASTERCARD</option>
              </select>
            </div>
            <div>
              <label class="form-label">Name on Card</label>
              <input
                v-model="issueForm.nameOnCard"
                type="text"
                class="input-field uppercase"
                required
              />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="form-label">Expiry Month</label>
              <input
                v-model="issueForm.expiryMonth"
                type="text"
                class="input-field"
                placeholder="02"
                required
              />
            </div>
            <div>
              <label class="form-label">Expiry Year</label>
              <input
                v-model="issueForm.expiryYear"
                type="text"
                class="input-field"
                placeholder="2030"
                required
              />
            </div>
            <div>
              <label class="form-label">CVV</label>
              <input
                v-model="issueForm.cvv"
                type="password"
                class="input-field"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div v-if="errors.issue" class="text-sm text-red-600">
            {{ errors.issue }}
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              class="btn-secondary flex-1"
              @click="closeIssueModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary flex-1"
              :disabled="loading.issue"
            >
              <span
                v-if="loading.issue"
                class="flex items-center justify-center"
              >
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Issuing...
              </span>
              <span v-else>Issue Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useAuth } from "@/composables/useAuth";
import { cardAPI } from "@/services/api";

const { user } = useAuth();

const accountNumber = ref("");
const cards = ref([]);
const errors = ref({ list: null, issue: null });
const loading = ref({
  list: false,
  issue: false,
  updateId: null,
  verify: false,
});
const issueModal = ref(false);
const toggleVerify = ref(false);

const issueForm = ref({
  accountNumber: "",
  cardType: "VISA",
  nameOnCard: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
});

const verifyForm = ref({
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
});

const verifyResult = ref(null);

const useMyAccount = () => {
  if (user.value?.accountNumber) {
    accountNumber.value = user.value.accountNumber;
  }
};

const loadCards = async () => {
  if (!accountNumber.value) return;
  try {
    loading.value.list = true;
    errors.value.list = null;
    const res = await cardAPI.list(accountNumber.value);
    cards.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    errors.value.list =
      e?.response?.data?.message || e?.message || "Failed to load cards";
  } finally {
    loading.value.list = false;
  }
};

const openIssueModal = () => {
  issueForm.value.accountNumber =
    accountNumber.value || user.value?.accountNumber || "";
  issueForm.value.cardType = "VISA";
  issueForm.value.nameOnCard = (
    user.value?.accountName ||
    user.value?.name ||
    ""
  ).toUpperCase();
  issueForm.value.expiryMonth = "";
  issueForm.value.expiryYear = "";
  issueForm.value.cvv = "";
  errors.value.issue = null;
  issueModal.value = true;
};

const closeIssueModal = () => {
  issueModal.value = false;
};

const handleIssue = async () => {
  try {
    loading.value.issue = true;
    errors.value.issue = null;
    verifyResult.value = null;

    const payload = {
      accountNumber: issueForm.value.accountNumber,
      cardType: issueForm.value.cardType,
      nameOnCard: issueForm.value.nameOnCard,
      expiryMonth: issueForm.value.expiryMonth,
      expiryYear: issueForm.value.expiryYear,
      cvv: issueForm.value.cvv,
    };

    const res = await cardAPI.issue(payload);
    // refresh list for that account
    accountNumber.value = payload.accountNumber;
    await loadCards();
    issueModal.value = false;
  } catch (e) {
    errors.value.issue =
      e?.response?.data?.message || e?.message || "Failed to issue card";
  } finally {
    loading.value.issue = false;
  }
};

const updateStatus = async (cardId, status) => {
  try {
    loading.value.updateId = cardId;
    await cardAPI.updateStatus(cardId, status);
    // refresh
    await loadCards();
  } catch (e) {
    // show transient error in list area
    errors.value.list =
      e?.response?.data?.message || e?.message || "Failed to update status";
    setTimeout(() => (errors.value.list = null), 3000);
  } finally {
    loading.value.updateId = null;
  }
};

const verifyCard = async () => {
  try {
    loading.value.verify = true;
    verifyResult.value = null;
    const res = await cardAPI.verify({
      cardNumber: verifyForm.value.cardNumber,
      expiryMonth: verifyForm.value.expiryMonth,
      expiryYear: verifyForm.value.expiryYear,
      cvv: verifyForm.value.cvv,
    });
    verifyResult.value = res.data;
  } catch (e) {
    verifyResult.value = {
      approved: false,
      reason: e?.response?.data?.message || "Verification failed",
    };
  } finally {
    loading.value.verify = false;
  }
};

// Pre-fill account number from user if available
useMyAccount();
if (accountNumber.value) {
  loadCards();
}
</script>
