<template>
  <div>
    <div class="modal-backdrop fade show" v-if="isOpen"></div>
    <div
      class="modal fade show d-block bd-example-modal-lg theme-modal cart-modal"
      id="modal-cart"
      aria-hidden="true"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-cartLabel"
      v-if="isOpen"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body modal1 bg-gradient">
            <div class="container-fluid p-0">
              <div class="row cart-modal">
                <div class="col-lg-12 position-relative">
                  <div class="modal-bg addtocart">
                    <div class="modal-header justify-content-center">
                      <div class="d-flex flex-column text-center">
                        <h3>Change Quantity</h3>
                        <span>
                          Enter a new quantity, preview pricing changes, and
                          review terms
                        </span>
                      </div>
                    </div>
                    <button
                      class="close btn-close"
                      type="button"
                      @click="close(openCart)"
                    >
                      <span>x</span>
                    </button>
                    <div class="d-flex my-3">
                      <div class="card d-flex flex-column justify-content-between text-center p-3 w-75">
                        <span>CURRENT</span>
                        <div class="">
                          <h5 class="card-title">PROFESSIONAL</h5>
                          <h3 class="card-text">$179 USD per user per month</h3>
                        </div>
                        <div>
                          <p>Number of Users</p>
                          <div class="qty-box">
                            <div class="input-group">
                              <span class="input-group-prepend">
                                <button type="button" class="btn quantity-left-minus" data-type="minus" data-field
                                  @click="handleNumberUsers('minus')">
                                  <i class="ti-minus"></i>
                                </button>
                              </span>
                              <input type="text" v-model="noOfUser" name="quantity" class="form-control input-number"/>
                              <span class="input-group-prepend">
                                <button type="button" class="btn quantity-right-plus" data-type="plus" data-field
                                  @click="handleNumberUsers('plus')">
                                  <i class="ti-plus"></i>
                                </button>
                              </span>
                            </div>
                          </div>
                          <p class="mt-3">Effective Date</p>
                          <input type="date" placeholder="DD/MM/YY" v-model="effectiveDate" />
                        </div>
                        <div>
                          <button type="button" class="btn btn-primary">
                            UPDATE
                          </button>
                        </div>
                      </div>
                      <div class="card w-100 p-3">
                        <span class="p-2">Pricing Summary:</span>
                        <div class="card-body">
                          <table class="table table-responsive-xs">
                            <thead class="table-head">
                              <tr>
                                <th></th>
                                <th>Current</th>
                                <th>New</th>
                                <th>Change</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>List Price</td>
                              </tr>
                              <tr>
                                <td>Discount</td>
                              </tr>
                              <tr>
                                <td>Quantity</td>
                              </tr>
                              <tr>
                                <td>Subtotal</td>
                              </tr>
                              <tr>
                                <td>Estimated Tax</td>
                              </tr>
                              <tr>
                                <td>Estimated Total</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div class="d-flex justify-content-end">
                          <button type="button" class="btn btn-primary">
                            CONFIRM CHANGES
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">Show Terms & Conditions</div>
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
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    currentAsset: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    fields: [
      'List Price',
      'Discount',
      'Quantity',
      'Subtotal',
      'Estimated Tax',
      'Estimated Total',
    ],
    noOfUser: 1,
    effectiveDate: null,
  }),

  mounted() {
    console.log(this.currentAsset, 'currentAsset');
  },

  methods: {
    async close() {
      this.$emit('close');
    },

    async handleNumberUsers(sign) {
      if (sign === 'plus') {
        this.noOfUser = this.noOfUser + 1;
      }
      if (sign === 'minus') {
        this.noOfUser = this.noOfUser - 1;
      }
    },

    async handleUpdate () {

    }
  },
};
</script>
