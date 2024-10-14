<template>
  <div>
    <section class="ratio_asos section-b-space">
      <div class="container">
        <div class="col-12 product-related">
          <h2>{{ title }}</h2>
        </div>

        <div class="row g-sm-4 g-3">
          <div
            class="col-xl-2 col-md-4 col-6"
            v-for="(product, index) in catProducts.slice(1, 7)"
            :key="index"
          >
            <div class="product-box">
              <ProductBoxProductList
                @openCartModel="showCart"
                @showCompareModal="showCoampre"
                @openQuickView="showQuickView"
                :product="product"
                :index="index"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <WidgetsQuickView
      v-if="showQuickViewModel"
      :openModal="showQuickViewModel"
      :productData="quickViewProduct"
      @closeView="closeViewModal"
    />
    <WidgetsComparePopup
      :openCompare="showCompareModal"
      :productData="compareProduct"
      @closeCompare="closeCompareModal"
    />
    <cart-modal-popup
      :openCart="showCartModal"
      :productData="cartProduct"
      @closeCart="closeCartModal"
      :products="products"
    />
  </div>
</template>

<script>
import { useProductStore } from "~~/store/products";
import pkg from 'lodash';

const { shuffle } = pkg;

export default {
  props: ["productTYpe", "productId"],
  components: {},
  data() {
    return {
      title: "Related Products",
      products: [],
      catProducts: [],
      showQuickViewModel: false,
      showCompareModal: false,
      showCartModal: false,
      quickViewProduct: {},
      compareProduct: {},
      cartProduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  computed: {
    productsList: () => useProductStore().productsList,
  },
  async mounted() {
    const getProducts = await this.$getProducts();
    this.catProducts = shuffle(getProducts?.result ?? []).filter((prod) => prod.id !== this.$route.params.id);
  },
  methods: {
    showQuickView(item, productData) {
      this.showQuickViewModel = item;
      this.quickViewProduct = productData;
    },
    showCoampre(item, productData) {
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
  },
};
</script>
