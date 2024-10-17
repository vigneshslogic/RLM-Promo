<template>
  <div>
    <div class="modal-backdrop fade show" v-if="isOpen"></div>
    <div
      class="modal fade show d-block bd-example-modal-md theme-modal cart-modal"
      id="modal-cart"
      aria-hidden="true"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-cartLabel"
      v-if="isOpen"
    >
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body modal1 bg-gradient">
            <div class="container-fluid p-0">
              <div class="row cart-modal">
                <div class="col-lg-12 position-relative">
                  <div class="modal-bg addtocart">
                    <div class="h5 my-2 text-center text-danger">
                      {{
                        type === "cancel"
                          ? "Are you sure want to cancel subscription ?"
                          : "Are you sure want to renew subscription ?"
                      }}
                    </div>
                    <div class="d-flex justify-content-center py-2">
                      <button
                        type="button"
                        @click="close()"
                        class="btn btn-secondary mx-3"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        @click="handleSubscription()"
                        class="btn btn-danger"
                      >
                        Confirm
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
</template>

<script>
import { useAuthStore } from "~~/store/auth";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
    currentAsset: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    async close() {
      this.$emit("close");
    },

    async handleSubscription() {
      const date = new Date();
      const isoString = date.toISOString().split("T")[0];
      switch (this.type) {
        case "cancel":
          const payload = {
            inputs: [
              {
                cancelAssetIds: [this.currentAsset.Id],
                cancelStartDate: `${isoString}T00:00:00.000+0000`,
                cancelOutputType: "Order",
              },
            ],
          };

          const response = await useAuthStore().cancelSubscription(payload);
          if (response) {
            useNuxtApp().$showToast({
              msg: "Your Subscription/ Assets is cancelled successfully!.",
              type: "info",
            });
            this.$emit("close");
          } else {
            useNuxtApp().$showToast({
              msg: "Something went wrong. Please try again later.",
              type: "error",
            });
          }
          break;

        case "renew":
          const data = {
            inputs: [
              {
                renewAssetIds: [this.currentAsset.Id],
                renewOutputType: "Order",
              },
            ],
          };

          const res = await useAuthStore().cancelSubscription(data);
          if (res) {
            useNuxtApp().$showToast({
              msg: "Your Subscription/ Assets is renewal successfully!.",
              type: "info",
            });
            this.$emit("close");
          } else {
            useNuxtApp().$showToast({
              msg: "Something went wrong. Please try again later.",
              type: "error",
            });
          }
        break;

        default:

        break;
      }
    },
  },
};
</script>
