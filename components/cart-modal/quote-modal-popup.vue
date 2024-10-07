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
          <div class="modal-body modal1">
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
                            <label for="review">Add Quote text:</label>
                            <textarea
                              class="form-control"
                              placeholder="Write Your Testimonial Here"
                              id="exampleFormControlTextarea1"
                              rows="6"
                            />
                          </div>
                          
                          <div class="form-group col-md-12">
                            <button
                              class="btn btn-solid my-3"
                              title="Get Quote"
                            > Get Quote
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
export default {
  props: ["openQuote", "productData", "products", "category"],
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
  },
};
</script>
