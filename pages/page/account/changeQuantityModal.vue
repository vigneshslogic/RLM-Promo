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
                    <div class="row my-3">
                      <div class="col-md-4">
                        <div
                          class="card justify-content-around text-center p-3 w-auto h-100"
                        >
                          <h3>CURRENT</h3>
                          <div>
                            <h3 class="card-title">PROFESSIONAL</h3>
                            <h3 class="card-text">
                              £&nbsp;{{ Number(currentAsset?.TotalLifecycleAmount?.toFixed(2)) ?? 0 }}
                            </h3>
                            <span>EURO per user per month</span>
                          </div>
                          <div>
                            <p>Number of Users</p>
                            <div class="qty-box">
                              <div class="input-group">
                                <span class="input-group-prepend">
                                  <button
                                    type="button"
                                    class="btn quantity-left-minus"
                                    data-type="minus"
                                    data-field
                                    @click="handleNumberUsers('minus')"
                                  >
                                    <i class="ti-minus"></i>
                                  </button>
                                </span>
                                <input
                                  type="number"
                                  min="1"
                                  v-model="noOfUser"
                                  name="quantity"
                                  class="form-control input-number"
                                />
                                <span class="input-group-prepend">
                                  <button
                                    type="button"
                                    class="btn quantity-right-plus"
                                    data-type="plus"
                                    data-field
                                    @click="handleNumberUsers('plus')"
                                  >
                                    <i class="ti-plus"></i>
                                  </button>
                                </span>
                              </div>
                            </div>
                            <p class="mt-3">Effective Date</p>
                            <input
                              class="date-input"
                              type="date"
                              placeholder="DD/MM/YY"
                              v-model="effectiveDate"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="card w-auto h-100 p-3">
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
                                  <td>£&nbsp;{{ Number(currentAsset?.TotalLifecycleAmount?.toFixed(2)) ?? 0 }}</td>
                                  <td>£&nbsp;{{ Number(currentAsset?.TotalLifecycleAmount?.toFixed(2)) ?? 0 }}</td>
                                  <td>£&nbsp;0</td>
                                </tr>
                                <tr>
                                  <td>Discount</td>
                                  <td>£&nbsp;0</td>
                                  <td>£&nbsp;0</td>
                                  <td>£&nbsp;0</td>
                                </tr>
                                <tr>
                                  <td>Quantity</td>
                                  <td>{{ qty }}</td>
                                  <td>{{ noOfUser }}</td>
                                  <td>{{ noOfUser - qty }}</td>
                                </tr>
                                <tr>
                                  <td>Subtotal</td>
                                  <td> £&nbsp;{{ Number(currentAsset?.TotalLifecycleAmount?.toFixed(2)) ?? 0 }}</td>
                                  <td>
                                    {{ `£ ${Number(calculateSubTotal(noOfUser, currentAsset?.TotalLifecycleAmount ?? 0) / qty).toFixed(2)}` }}
                                  </td>
                                  <td>{{ `£ ${Number(calculateSubTotal(noOfUser, Number(currentAsset?.TotalLifecycleAmount).toFixed(2) ?? 0) / qty - Number(currentAsset?.TotalLifecycleAmount).toFixed(2) ?? 0 ).toFixed(2)}` }}</td>
                                </tr>
                                <tr>
                                  <td>Estimated Tax</td>
                                  <td>£&nbsp;0</td>
                                  <td>£&nbsp;0</td>
                                  <td>£&nbsp;0</td>
                                </tr>
                                <tr>
                                  <td>Estimated Total</td>
                                  <td>£&nbsp;{{ totalLifecycleAmount }}</td>
                                  <td>
                                    {{ `£ ${Number(calculateSubTotal(noOfUser, currentAsset?.TotalLifecycleAmount ?? 0)).toFixed(2)}` }}
                                  </td>
                                  <td>{{ `£ ${Number(calculateSubTotal(noOfUser, currentAsset?.TotalLifecycleAmount ?? 0) / qty - totalLifecycleAmount).toFixed(2)}` }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="d-flex justify-content-end">
                            <button
                              type="button"
                              @click="handleUpdate()"
                              class="btn btn-solid"
                            >
                              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              CONFIRM CHANGES
                            </button>
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
  </div>
</template>

<script>
import { useAuthStore } from '~~/store/auth';
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
    qty: 0,
    totalLifecycleAmount: 0,
    isLoading: false,
  }),

  created() {
    const today = new Date().toISOString().slice(0, 10);
    this.effectiveDate = today;
    this.noOfUser = this.currentAsset?.CurrentQuantity;
    this.qty = this.currentAsset?.CurrentQuantity;
    this.totalLifecycleAmount = Number(this.currentAsset?.TotalLifecycleAmount?.toFixed(2)) ?? 0;
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
        this.noOfUser = this.noOfUser <= 1 ? 1 : this.noOfUser - 1;
      }
    },

    calculateSubTotal(user, price) {
      return Number(user * (Number(price) ?? 0).toFixed(2)) ?? 0;
    },

    async handleUpdate() {
      const date = new Date(this.effectiveDate);
      const isoString = date.toISOString();
      this.isLoading = true;
      const payload = {
        inputs: [
          {
            amendAssetIds: [this.currentAsset.Id],
            amendStartDate: isoString,
            quantityChange: this.noOfUser,
            amendOutputType: 'Order',
          },
        ],
      };

      try {
        const response = await useAuthStore().changeQuantity(payload);
        if (response) {
          useNuxtApp().$showToast({ msg: " Your Upgrade Order is placed.", type: "info" });
          this.isLoading = false;
          this.$emit('close');
        } 
      } catch (error) {
        this.isLoading = false;
        this.$emit('close');
        useNuxtApp().$showToast({ msg: "Something went wrong. Please try again later.", type: "error" })
      }
    },
  },
};
</script>

<style scoped>
.date-input {
  padding: 10px 15px;
  border: var(--bs-border-width) solid var(--bs-border-color);
}
</style>
