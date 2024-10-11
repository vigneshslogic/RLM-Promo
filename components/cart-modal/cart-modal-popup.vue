<template>
  <div></div>
  <div>
    <div class="modal-backdrop fade show" v-if="openCart"></div>

    <div
      class="modal fade show d-block bd-example-modal-lg theme-modal cart-modal"
      id="modal-cart"
      aria-hidden="true"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-cartLabel"
      v-if="openCart"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body modal1 bg-gradient">
            <div class="container-fluid p-0">
              <div class="row cart-modal">
                <div class="col-lg-12 position-relative">
                  <div class="modal-bg addtocart">
                    <div class="modal-header">
                      <h5 class="modal-title">{{productData?.name}}</h5>
                    </div>
                    <!-- trim dress -->
                    <button
                      class="close btn-close"
                      type="button"
                      @click="closeCart(openCart)"
                    >
                      <span>x</span>
                    </button>
                    <div class="media">
                      <a href="#">
                        <img
                          :src='getImage(productData?.displayUrl)'
                          class="img-fluid"
                          :alt="productData?.name"
                        />
                      </a>
                      <div class="media-body align-self-center text-center">
                        <a href="#">
                          <h6>
                            <i class="fa fa-check"></i>Item
                            <span>{{ productData?.name }}</span>
                            <span> successfully added to your Cart.</span>
                          </h6>
                        </a>
                        <div class="buttons d-flex justify-content-center">
                          <nuxt-link
                            :to="{ path: '/page/account/cart' }"
                            class="btn-sm btn-solid mr-2"
                            >View Cart</nuxt-link
                          >
                          <nuxt-link
                            :to="{ path: '/page/account/checkout' }"
                            class="btn-sm btn-solid mr-2"
                            >Checkout</nuxt-link
                          >
                          <nuxt-link
                            :to="{ path: '/' }"
                            class="btn-sm btn-solid"
                            >Continue Shopping</nuxt-link
                          >
                        </div>
                        <div class="upsell_payment">
                          <img
                            alt=""
                            class="img-fluid w-auto mt-3"
                            src="/images/payment_cart.png"
                          />
                        </div>
                      </div>
                    </div>
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
import { mapState } from "pinia";
import { useProductStore } from "~~/store/products";
export default {
  props: ["openCart", "productData", "products", "category"],
  emits: ["closeCart"],
  computed: {
    ...mapState(useProductStore, {
      currency: "currency",
    }),
    curr() {
      return useProductStore().changeCurrency;
    },
  },
  watch: {
    openCart: {
      handler(newValue, oldValue) {},
      deep: true,
    },
  },
  methods: {
    getImage(img) {
      return img?.replace(/&amp;/g, '&') ?? '/images/6.jpg'
    },
    closeCart(val) {
      val = false;
      this.$emit("closeCart", val);
    },
    cartRelatedProducts(collection, id) {
      return this.products.filter((item) => {
        if (item.collection.find((i) => i === collection)) {
          if (item.id !== id) {
            return item;
          }
        }
      });
    },
    discountedPrice(product) {
      const price =
        (product.price - (product.price * product.discount) / 100) *
        this.curr.curr;
      return price;
    },
  },
};
</script>
