import products from "../data/products.json";
import { defineStore } from "pinia";

export const useProductStore = defineStore({
  id: "product-store",
  state: () => {
    return {
      productsList: products.data,
      products: products.data,
      wishlist: [],
      compare: [],
      currency: {
        value: "usd",
        curr: 1,
        symbol: "$",
      },
      order: [],
      categories: null,
      lastUpdated: null,
      locale: "en",
      searchProducts: [],
    };
  },
  actions: {
    changeCurrency2(payload) {
      this.currency = payload;
      if (this.currency.value === "eur") {
        this.currency.curr = 0.9;
      } else if (this.currency.value === "inr") {
        this.currency.curr = 70.93;
      } else if (this.currency.value === "gbp") {
        this.currency.curr = 0.78;
      } else if (this.currency.value === "usd") {
        this.currency.curr = 1;
      }
    },
    addToWishlist(payload) {
      const wishListItems = this.wishlist.find((item) => item.id === payload.id);

      if (!wishListItems) {
        this.wishlist.push({
          id: payload?.id,
          name: payload?.name,
          image: payload?.displayUrl,
          price: payload?.prices[0]?.price,
          priceBookEntryId: payload?.prices[0]?.priceBookEntryId,
          priceBookId: payload?.prices[0]?.priceBookId,
          priceModelId: payload?.prices[0]?.pricingModel?.id,
          periodBoundary: payload?.prices[0]?.pricingModel?.frequency ?? 'OneTime',
        });
      }
    },
    setInitialWhishlist(payload) {
      this.wishlist = payload;
    },
    removeWishlistItem(payload) {
      const index = this.wishlist.indexOf(payload);
      this.wishlist.splice(index, 1);
    },
    addToCompare(payload) {
      const product = this.products.find((item) => item.id === payload.id);
      const compareItems = this.compare.find((item) => item.id === payload.id);
      if (compareItems) {
      } else {
        this.compare.push({
          ...product,
        });
      }
    },
    setInitialCompare(payload) {
      this.compare = payload;
    },
    removeCompareItem(payload) {
      const index = this.compare.indexOf(payload);
      this.compare.splice(index, 1);
    },
    searchProduct(payload) {
      payload = payload.toLowerCase();
      this.searchProducts = [];
      if (payload.length) {
        this.products.filter((product) => {
          if (product.title.toLowerCase().includes(payload)) {
            this.searchProducts.push(product);
          }
        });
      }
    },
    createOrder(payload) {
      this.order = payload;
    },
    async getProductCategories() {
      try {
        const { $getCategories } = useNuxtApp();
        const response = await $getCategories();

        this.categories = response;
        this.lastUpdated = Date.now();

        // Store data and timestamp in localStorage
        localStorage.setItem('categories', JSON.stringify({ data: response, timestamp: this.lastUpdated }));

        return response;
      } catch (error) {
        return [];
      }
    },
    async loadCategories() {
      const storedData = localStorage.getItem('categories');

      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (storedData) {
        const { data, timestamp } = JSON.parse(storedData);

        // Check if the stored data is still valid (within 24 hours)
        if (now - timestamp < twentyFourHours) {
          this.categories = data; // Use data from localStorage
          return data;
        }
      }

      // If no valid data in localStorage, fetch new data
      this.getProductCategories();
    },
   },
  getters: {
    price: (state) => {
      return state.products.map((product) => {
        if (product.price) {
          return product.price;
        }
      });
    },
    getcollectionProduct: (state) => {
      return (collection) =>
        state.products.filter((product) => {
          return collection === product.collection;
        });
    },
    getProductById: () => {
      return async (id) => {
        const { $getProductDetails } = useNuxtApp();
        const getProducts = await $getProductDetails(id);
        return getProducts;
      }
    },
    compareItems: (state) => {
      return state.compare;
    },
    wishlistItems: (state) => {
      return state.wishlist;
    },
    changeCurrency: (state) => {
      return state.currency;
    },
    getOrder: (state) => {
      return state.order;
    },
  },
});
