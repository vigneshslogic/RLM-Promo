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

        downloadInvoice: async (payload) => {
            const { $downloadInvoice } = useNuxtApp();
            const response = await $downloadInvoice(payload);
            return response;
        },

        getAssets: async (state) => {
            const { $getAssets } = useNuxtApp();
            const response = await $getAssets();
            return response;
        },

        getPayments: async (state) => {
            const { $getPayments } = useNuxtApp();
            const response = await $getPayments();
            return response;
        },

        createPayment: async (payload) => {
            const { $createPayment } = useNuxtApp();
            const response = await $createPayment(payload);
            return response;
        },

        changeQuantity: async (payload) => {
            const { $changeQuantity } = useNuxtApp();
            const response = await $changeQuantity(payload);
            return response;
        },

        cancelSubscription: async (payload) => {
            const { $cancelSubscription } = useNuxtApp();
            const response = await $cancelSubscription(payload);
            return response;
        },

        renewSubscription: async (payload) => {
            const { $renewSubscription } = useNuxtApp();
            const response = await $renewSubscription(payload);
            return response;
        },
        
        upgradeSubscription: async (payload,other) => {
            const { $upgradeSubscription } = useNuxtApp();
            const response = await $upgradeSubscription(payload,other);
            return response;
        },

        attributePricing: async (payload) => {
            const { $attributePricing } = useNuxtApp();
            const response = await $attributePricing(payload);
            return response;
        }
    }
})