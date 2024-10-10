<template>
  <Header />
  <div style="padding-top: 200px;">
    <section class="p-0" v-if="!order">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="error-section">
              <h1>404</h1>
              <h2>page not found</h2>
              <nuxt-link :to="{ path: '/' }" :class="'btn btn-solid'">
                back to home</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- thank-you section start -->
    <section class="section-b-space light-layout" v-if="order">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="success-text">
              <i class="fa fa-check-circle" aria-hidden="true"></i>
              <h2>thank you</h2>
              <p>
                Payment is successfully processing your order.
              </p>
              <p>Transaction ID: {{ order?.requestId }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>
<script>
import { useProductStore } from "~~/store/products";
import { useCartStore } from "~~/store/cart";

export default {
  data() {
    return{
      order: null,
    }
  }, 

  mounted() {
    this.order = JSON.parse(localStorage?.getItem('order-success'));
    useCartStore().clearCart();
  },

  computed: {
    cartTotal() {
      return useCartStore().cartTotalAmount;
    },
    cur() {
      return useProductStore().changeCurrency;
    },
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
  },
};
</script>
