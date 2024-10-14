<template>
  <div class="tools-bg">
    <Header />
    <ShopToolsSlider />
    <ShopToolsService />
    <ShopToolsAbout />
    <ShopToolsCategory />
    <ShopToolsProductSlider
      :catalogues="catalogues"
      @openQuickView="showQuickView"
      @openCompare="showCompare"
      @openCart="showCart"
    />
    <ShopToolsCategoryFilters
      :catalogues="filterCatalogs"
      :category="category"
      @openQuickView="showQuickView"
      @openCompare="showCompare"
      @openCart="showCart"
      @applyFilter="handleFilters"
    />
    <Footer />
    <WidgetsQuickView
      v-if="quickViewProduct && showQuickViewModel"
      :openModal="showQuickViewModel"
      :productData="quickViewProduct"
      @closeView="closeViewModal"
    />
    <WidgetsComparePopup
      :openCompare="showCompareModal"
      :productData="compareProduct"
      @closeCompare="closeCompareModal"
    />
    <CartModalPopup
      :openCart="showCartModal"
      :productData="cartProduct"
      @closeCart="closeCartModal"
      :products="products"
    />
    <WidgetsNewsletterPopup />
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useProductStore } from "~~/store/products";

export default {
  data() {
    return {
      products: [],
      catalogues: [],
      filterCatalogs: [],
      category: [],
      showQuickViewModel: false,
      showCompareModal: false,
      showCartModal: false,
      quickViewProduct: {},
      compareProduct: {},
      cartProduct: {},
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productsList: "productsList",
    }),
  },

  methods: {
    productsArray: function () {
      this.productsList.map((item) => {
        if (item.type === "tools") {
          this.products.push(item);
          item.collection.map((i) => {
            const index = this.category.indexOf(i);
            if (index === -1) this.category.push(i);
          });
        }
      });
    },
    showQuickView(item, productData) {
      this.showQuickViewModel = item;
      this.quickViewProduct = productData;
    },
    showCompare(item, productData) {
      this.showCompareModal = item;
      this.compareProduct = productData;
    },
    closeCompareModal(item) {
      this.showCompareModal = item;
    },
    showCart(item, productData) {
      this.showCartModal = item;
      this.cartProduct = productData;
    },
    closeCartModal(item) {
      this.showCartModal = item;
    },
    closeViewModal(item) {
      this.showQuickViewModel = item;
    },
    async getProducts(id = null, isCategory = false) {
      const getProducts = await this.$getProducts(id, isCategory);
      return getProducts?.result ?? [];
    },
    async handleFilters(catalogId, subCatId) {
      this.filterCatalogs = await this.getProducts(subCatId ?? catalogId, subCatId ? true : false);
    }
  },
  async mounted() {
    localStorage.setItem('order-success', null);
    this.productsArray();
    this.catalogues = await this.getProducts();
    this.filterCatalogs = await this.getProducts();
  },
};
</script>
