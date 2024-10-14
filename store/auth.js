import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: 'auth-store',
    state: () => {
        return {}
    },

    actions: {
        getOrders: async (state) => {
            const { $getOrders } = useNuxtApp();
            const response = await $getOrders();
            return response;
        },

        getInvoices: async (state) => {
            const { $getInvoices } = useNuxtApp();
            const response = await $getInvoices();
            return response;
        },

        getAssets: async (state) => {
            const { $getAssets } = useNuxtApp();
            const response = await $getAssets();
            return response;
        },

        changeQuantity: async (payload) => {
            const { $changeQuantity } = useNuxtApp();
            const response = await $changeQuantity(payload);
            return response;
        }
    }
})