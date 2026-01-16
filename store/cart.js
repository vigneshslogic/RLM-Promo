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
      let cartItems = this?.cart?.find((item) => item.id === payload.id);
      const qty = payload.quantity ?? 1;

      if (cartItems) {
        cartItems.quantity = qty;
      } else {
        this.cart.push({
          id: payload?.id,
          name: payload?.name,
          image: payload?.displayUrl,
          price: payload?.price,
          listPrice: payload?.listPrice,
          priceBookEntryId: payload?.priceBookEntryId,
          priceBookId: payload?.priceBookId,
          priceModelId: payload?.priceModelId,
          pricingModelType: payload?.pricingModelType,
          selectedAttribute: payload?.selectedAttribute ?? null,
          periodBoundary: payload?.periodBoundary ?? 'OneTime',
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
      this.cart = []; // or use '' to clear it as an empty string
    },
  },
  getters: {
    cartItems: (state) => {
      return state.cart;
    },
    cartTotalAmount: (state) => {
      const promotions = {
        "Business Insider": 15,
        "AD Digital": 10,
        "VK Saturday Plus": 10,
        "National Geographic": 12,
      };

      const getPromoDiscount = (product) => {
        const title = product?.name || '';
        const brand = product?.brand || '';
        const key = Object.keys(promotions).find(k =>
          title.toLowerCase().includes(k.toLowerCase()) ||
          brand.toLowerCase().includes(k.toLowerCase())
        );
        return key ? promotions[key] : 0;
      };

      const calculatePromoPrice = (originalPrice, discountPercent) => {
        if (!discountPercent || discountPercent <= 0) return originalPrice;
        const discount = (originalPrice * discountPercent) / 100;
        return Number((originalPrice - discount).toFixed(2));
      };

      return state.cart.reduce((total, product) => {
        const discountPercent = getPromoDiscount(product);
        const priceToUse = discountPercent > 0 ? calculatePromoPrice(product.price, discountPercent) : product.price;
        return total + priceToUse * product.quantity;
      }, 0);
    },
    cartOriginalTotal: (state) => {
      return state.cart.reduce((total, product) => {
        return total + (product.listPrice || product.price) * product.quantity;
      }, 0);
    },
    cartSavings: (state) => {
      const original = state.cart.reduce((total, product) => {
        return total + (product.listPrice || product.price) * product.quantity;
      }, 0);
      const discounted = state.cart.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
      return original - discounted;
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
