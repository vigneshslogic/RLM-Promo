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
        }
    }
})