import products from "../data/products.json";

import { defineStore } from "pinia";

export const useCartStore = defineStore({
  id: "cart-store",
  state: () => {
    return {
      products: products.data,
      cart: [],
      abc: {},
    };
  },
  actions: {
    addToCart(payload) {
      const cartItems = this?.cart?.find((item) => item.id === payload.id);
      const qty = payload.quantity ?? 1;

      if (cartItems) {
        cartItems.quantity = qty;
      } else {
        this.cart.push({
          id: payload?.id,
          name: payload?.name,
          image: payload?.displayUrl,
          price: payload?.prices[0]?.price,
          priceBookEntryId: payload?.prices[0]?.priceBookEntryId,
          priceBookId: payload?.prices[0]?.priceBookId,
          priceModelId: payload?.prices[0]?.pricingModel?.id,
          periodBoundary: payload?.prices[0]?.pricingModel?.frequency ?? 'OneTime',
          quantity: qty,
        });
      }
    },
    updateCartQuantity(payload) {
      function calculateStockCounts(product, quantity) {
        const qty = product.quantity + quantity;
        const stock = product.stock;
        if (stock < qty) {
          return false;
        }
        return true;
      }
      this.cart.find((items, index) => {
        if (items.id === payload.product.id) {
          const qty = this.cart[index].quantity + payload.qty;
          const stock = calculateStockCounts(this.cart[index], payload.qty);
          if (qty !== 0 && stock) {
            this.cart[index].quantity = qty;
          } else {
            // state.cart.push({
            //   ...product,
            //   quantity: qty
            // })
          }
          return true;
        }
      });
    },
    removeCartItem(payload) {
      this.cart = this.cart.filter((item) => item.id != payload.id);
    },
    setInitialCart(payload) {
      this.cart = payload;
    },
    clearCart() {
      this.cart = null; // or use '' to clear it as an empty string
    },
  },
  getters: {
    cartItems: (state) => {
      return state.cart;
    },
    cartTotalAmount: (state) => {
      return state.cart.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    },
    getQuote: (state) => {
      return async (description) => {
        const products = state.cart;
        const { $generateQuote } = useNuxtApp();
        const getProducts = await $generateQuote(products, description);
        return getProducts;
      }
    },
    generateOrder: (state) => {
      return async (user) => {
        const products = state.cart;
        const { $placeOrder } = useNuxtApp();
        const response = await $placeOrder(products, user);
        return response;
      }
    },
  },
});
