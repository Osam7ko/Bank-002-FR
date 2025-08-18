// Pinia store to hold one-time card secrets for a short window after issuance
import { defineStore } from 'pinia';

type Secrets = { pan: string; expiry: string; cvv: string };
type SecretsEntry = Secrets & { addedAt: number };

export const useCardSecretsStore = defineStore('cardSecrets', {
  state: () => ({
    byCardId: {} as Record<number, SecretsEntry>,
  }),
  actions: {
    put(cardId: number, s: Secrets) {
      this.byCardId[cardId] = { ...s, addedAt: Date.now() };
    },
    get(cardId: number) {
      const e = this.byCardId[cardId];
      if (!e) return null;
      // auto-expire after 10 minutes
      if (Date.now() - e.addedAt > 10 * 60 * 1000) {
        delete this.byCardId[cardId];
        return null;
      }
      const { pan, expiry, cvv } = e;
      return { pan, expiry, cvv } as Secrets;
    },
    clear(cardId?: number) {
      if (typeof cardId === 'number') {
        delete this.byCardId[cardId];
      } else {
        this.byCardId = {};
      }
    },
  },
});
