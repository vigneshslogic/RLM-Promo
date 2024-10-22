<template>
  <div>
    <div class="img-wrapper">
      <div class="ribbon" v-if="product.new"><span>new</span></div>
      <div class="front">
        <nuxt-link :to="{ path: '/product/sidebar/' + product.id }">
          <!-- src="/images/6.jpg" -->
          <img
            :src="getImage(product?.displayUrl)"
            :id="product?.id"
            class="img-fluid bg-img"
            :alt="product.name"
            :key="index"
          />
        </nuxt-link>
      </div>
      <div class="cart-info cart-wrap">
        <a href="javascript:void(0)" title="Add to Wishlist" tabindex="0">
          <i
            class="fa fa-heart"
            aria-hidden="true"
            @click="addToWishlist(product)"
          ></i>
        </a>
        <button
          data-toggle="modal"
          data-target="#addtocart"
          title="Add to cart"
          @click="addToCart(product)"
          variant="primary"
        >
          <i class="ti-shopping-cart"></i> Add to cart
        </button>
        <a
          href="javascript:void(0)"
          title="Comapre"
          @click="addToCompare(product)"
          variant="primary"
        >
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </a>
        <a
          class="mobile-quick-view"
          title="Quick View"
          @click="showQuickView(product)"
          variant="primary"
        >
          <i class="ti-search" aria-hidden="true"></i>
        </a>
      </div>
      <div class="quick-view-part">
        <a
          href="javascript:void(0)"
          title="Quick View"
          @click="showQuickView(product)"
          variant="primary"
        >
          <i class="ti-search" aria-hidden="true"></i>
        </a>
      </div>
    </div>
    <div class="product-info">
      <div class="rating">
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
      </div>
      <nuxt-link :to="{ path: '/product/sidebar/' + product.id }">
        <h6>{{ product.name }}</h6>
      </nuxt-link>
      <p>{{ product.description }}</p>
      <h4 v-if="getProductPrice">£ {{ getProductPrice }}</h4>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "~~/store/cart";
import { useProductStore } from "~~/store/products";
import { mapState } from "pinia";
import pkg from "lodash";
const { find } = pkg;

export default {
  props: ["product", "index"],
  data() {
    return {
      quickViewProduct: {},
      compareProduct: {},
      cartProduct: {},
      quickView: false,
      showCompareModal: false,
      cartVal: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      image: '',
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productsList: "productsList",
    }),
    curr() {
      return useProductStore().changeCurrency;
    },
    getProductPrice() {
      const exists = find(this.product.prices, { isDefault: true });
      if (exists) {
        return Number(exists?.price?.toFixed(2)) ?? 0;
      }
      return Number(this.product?.prices[0]?.price.toFixed(2)) ?? 0;
    },
  },
  methods: {
    getImage(img) {
      return img?.replace(/&amp;/g, '&') ?? "/images/6.jpg";
    },
    addToCart: function (product) {
      const getDefaultPricing = product?.prices?.find((price) => price.isDefault === true) ?? product?.prices[0];
      this.cartVal = true;
      this.cartProduct = product;
      product.price = getDefaultPricing?.price;
      product.priceBookEntryId = getDefaultPricing?.priceBookEntryId;
      product.priceBookId = getDefaultPricing?.priceBookId;
      product.priceModelId = getDefaultPricing?.pricingModel?.id;
      product.quantity = 1;
      product.periodBoundary = getDefaultPricing?.pricingModel?.frequency ?? "OneTime";
      useCartStore().addToCart(product);

      this.$emit("openCartModel", this.cartVal, this.cartProduct);
    },
    addToWishlist: function (product) {
      this.dismissCountDown = this.dismissSecs;
      useNuxtApp().$showToast({
        msg: "Product Is successfully added to your wishlist.",
        type: "info",
      });
      useProductStore().addToWishlist(product);
    },
    showQuickView: function (productData) {
      this.quickView = true;
      this.quickViewProduct = productData;
      this.$emit("openQuickView", this.quickView, this.quickViewProduct);
    },
    addToCompare: function (product) {
      this.showCompareModal = true;
      this.compareProduct = product;
      this.$emit(
        "showCompareModal",
        this.showCompareModal,
        this.compareProduct
      );
      useProductStore().addToCompare(product);
    },
  },
};
</script>
