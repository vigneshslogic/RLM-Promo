<template>
  <div></div>
  <div>
    <div class="modal-backdrop fade show" v-if="openQuote"></div>

    <div
      class="modal fade show d-block bd-example-modal-lg theme-modal cart-modal"
      id="modal-cart"
      aria-hidden="true"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-cartLabel"
      v-if="openQuote"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body modal1 bg-gradient">
            <div class="container-fluid p-0">
              <div class="row cart-modal">
                <div class="col-lg-12 position-relative">
                  <div class="modal-bg addtocart">
                    <div class="modal-header">
                      <h5 class="modal-title">Request a Quote</h5>
                      <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        @click="$emit('closeQuote')" 
                      />
                    </div>
                    <div class="p-3">
                      <form>
                        <div class="form-row row">
                          <div class="form-group col-md-12">
                            <label for="review">Quote Request Details:</label>
                            <textarea
                              v-model="description.value"
                              class="form-control"
                              placeholder="Please add your request details here"
                              id="exampleFormControlTextarea1"
                              rows="6"
                              required
                            />
                            <span class="validate-error" v-if="description.value.length === 0">{{
                              description.errormsg
                            }}</span>
                          </div>
                          
                          <div class="form-group col-md-12">
                            <button
                              class="btn btn-solid my-3"
                              title="Get Quote"
                              @click.prevent="handleGetQuote"
                            > Request Quote
                            </button>
                          </div>
                        </div>
                      </form>
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
import { useCartStore } from '~~/store/cart';

export default {
  props: ["openQuote", "productData", "products", "category", "noAction"],
  emits: ["closeCart"],
  computed: {
    ...mapState(useProductStore, {
      currency: "currency",
    }),
    curr() {
      return useProductStore().changeCurrency;
    },
  },
  data() {
    return {
      description: {value: '', errormsg: ''},
    }
  },
  watch: {
    openQuote: {
      handler(newValue, oldValue) {},
      deep: true,
    },
  },
  methods: {
    // Get Image Url
    getImgUrl(path) {
      return "/images/" + path;
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

    async handleGetQuote() {
      if (!this.noAction) {
        if (this.description.value.length <= 1 ) {
          this.description.errormsg = 'empty not allowed'
        } else {
          this.description.errormsg = ''
        }
        
        if (!this.description.errormsg) {
          const status = await useCartStore().getQuote(this.description.value);
          
          if (status?.quoteId) {
            useNuxtApp().$showToast({ msg: "Your quote request has been submitted. Our team will reach out to your shortly.", type: "info" });
          } else {
            useNuxtApp().$showToast({ msg: "Something went wrong. Please try again later.", type: "error" })
          }
          this.$emit('closeQuote');
        }
      }
    }
  },
};
</script>
