<template>
  <div
    class="relative w-full h-48 [perspective:1000px] cursor-pointer"
    @click="flipped = !flipped"
    :title="flipped ? 'Tap to view front' : 'Tap to view back'"
  >
    <div
      class="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]"
      :class="flipped ? '[transform:rotateY(180deg)]' : ''"
    >
      <!-- FRONT -->
      <div
        class="absolute inset-0 rounded-xl p-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white [backface-visibility:hidden]"
      >
        <div class="flex justify-between items-start">
          <div class="h-8 opacity-90 font-semibold tracking-wide">
            <img
              src="/002bank_logo.png"
              alt="Bank 002 Logo"
              class="h-16 w-16 mr-2"
            />
          </div>
          <span class="text-xs bg-white/15 px-2 py-0.5 rounded">{{
            card.cardType
          }}</span>
        </div>
        <div class="mt-6 text-lg tracking-widest font-semibold">
          {{ card.maskedCardNumber }}
        </div>
        <div class="mt-4 flex justify-between text-sm opacity-90">
          <div>
            <div>Cardholder</div>
            <div class="font-medium">{{ card.nameOnCard }}</div>
          </div>
          <div class="text-right">
            <div>Expires</div>
            <div class="font-medium">
              {{ card.expiryMonth }}/{{
                (card.expiryYear || "").toString().slice(-2)
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- BACK -->
      <div
        class="absolute inset-0 rounded-xl p-4 bg-gray-900 text-white [transform:rotateY(180deg)] [backface-visibility:hidden]"
      >
        <div class="h-6 bg-gray-700 rounded mb-4"></div>
        <div v-if="secrets">
          <div class="text-sm text-gray-300">Card Number</div>
          <div class="flex items-center gap-2">
            <div class="font-mono text-lg">{{ secrets.pan }}</div>
            <button
              class="text-xs bg-white/10 px-2 py-1 rounded"
              @click.stop="copy(secrets.pan)"
            >
              Copy
            </button>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm text-gray-300">Expiry</div>
              <div class="flex items-center gap-2">
                <div class="font-mono">{{ secrets.expiry }}</div>
                <button
                  class="text-xs bg-white/10 px-2 py-1 rounded"
                  @click.stop="copy(secrets.expiry)"
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-300">CVV</div>
              <div class="flex items-center gap-2">
                <div class="font-mono">{{ secrets.cvv }}</div>
                <button
                  class="text-xs bg-white/10 px-2 py-1 rounded"
                  @click.stop="copy(secrets.cvv)"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-300">
          Full details are available right after issuance only.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCardSecretsStore } from "@/stores/cardSecrets";

const props = defineProps({
  card: { type: Object, required: true },
});

const flipped = ref(false);
const secretsStore = useCardSecretsStore();
const secrets = computed(() => secretsStore.get(props.card.id));

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
};
</script>
