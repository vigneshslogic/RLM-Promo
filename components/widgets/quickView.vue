<template>
  <div>
    <div class="modal-backdrop fade show" v-if="openModal"></div>

    <div
      class="modal fade show d-block bd-example-modal-lg theme-modal"
      id="quick-view"
      aria-hidden="true"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-cartLabel"
      v-if="openModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content quick-view-modal">
          <div class="modal-body">
            <button
              class="close btn-close"
              type="button"
              @click="closeCompare(false)"
            >
              <span>×</span>
            </button>
            <div class="row quickview-modal">
              <div class="col-lg-6 col-12">
                <div class="quick-view-img">
                  <swiper
                    @swiper="onSwiper"
                    :slidesPerView="1"
                    :spaceBetween="20"
                    class="swiper-wrapper h-auto"
                  >
                    <swiper-slide class="swiper-slide">
                      <img
                        class="img-fluid bg-img"
                        :src="getImage(productData?.displayUrl)"
                      />
                    </swiper-slide>
                  </swiper>
                </div>
              </div>
              <div class="col-lg-6 rtl-text">
                <div class="product-right">
                  <h2>{{ productData?.name }}</h2>

                  <h3>£{{ selectedPlan?.price }}</h3>

                  <div class="product-description border-product">
                    <h6 class="product-title size-text">select plan</h6>
                    <div class="size-box">
                      <ul>
                        <li
                          class="product-title"
                          v-for="(price, index) in productData?.prices"
                          :key="index"
                          v-bind:class="{
                            active:
                              price?.priceBookEntryId ==
                              selectedPlan?.priceBookEntryId,
                          }"
                        >
                          <a
                            v-if="price?.pricingModel"
                            href="javascript:void(0)"
                            @click="changeSizeVariant(price)"
                          >
                            {{ price?.pricingModel?.frequency ?? 'One Time' }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="border-product">
                    <h6 class="product-title">product details</h6>
                    <p>
                      {{ productData?.description }}
                    </p>
                  </div>
                  <div class="product-buttons">
                    <!-- <nuxt-link :to="{ path: '/page/account/cart' }"> -->
                    <button
                      class="btn btn-solid"
                      title="Add to cart"
                      @click="addToCart(productData, counter)"
                    >
                      Add To Cart
                    </button>
                    <!-- </nuxt-link> -->
                    <nuxt-link
                      :to="{ path: '/product/sidebar/' + productData.id }"
                    >
                      <button
                        class="btn btn-solid ms-2"
                        title="buy now"
                        :disabled="counter > productData?.stock"
                      >
                        <!-- @click="buyNow(productData, counter)" -->
                        View Details
                      </button>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { useProductStore } from "~~/store/products";
import { useCartStore } from "~~/store/cart";
import pkg from "lodash";

const { find } = pkg;

export default {
  components: {
    SwiperSlide,
    Swiper,
  },
  props: ["openModal", "productData"],
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 20,
        freeMode: true,
      },
      selectedPlan: find(this.productData?.prices, { isDefault: true }) ?? "",
    };
  },

  mounted() {
    if (!this.selectedPlan) {
      this.selectedPlan =
        this.productData?.prices && this.productData?.prices[0];
    }
  },

  computed: {
    curr() {
      return useProductStore().currency;
    },
  },
  methods: {
    // Display Unique Color
    Color(variants) {
      const uniqColor = [];
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqColor.indexOf(variants[i].color) === -1) {
          uniqColor.push(variants[i].color);
        }
      }
      return uniqColor;
    },
    closeCompare(val) {
      this.$emit("closeView", val);
    },
    changeSizeVariant(variant) {
      this.selectedPlan = variant;
    },
    // add to cart
    addToCart: function (product) {
      product.price = this.selectedPlan?.price;
      product.priceBookEntryId = this.selectedPlan?.priceBookEntryId;
      product.priceBookId = this.selectedPlan?.priceBookId;
      product.priceModelId = this.selectedPlan?.pricingModel?.id;
      product.quantity = 1;
      product.periodBoundary = this.selectedPlan?.pricingModel?.frequency ?? "OneTime";
      useCartStore().addToCart(product);
      this.$emit("closeView", false);
    },
    // Get Image Url
    getImage(img) {
      return img?.replace(/&amp;/g, "&") ?? "/images/6.jpg";
    },
    // Display Sale Price Discount
    discountedPrice(product) {
      const price =
        (product.price - (product.price * product.discount) / 100) *
        this.curr.curr;
      return price;
    },
  },
};
</script>
