<template>
  <div class="dashboard-right">
    <div class="dashboard">
      <div class="page-title">
        <h2>My Subscription/ Assets</h2>
      </div>
      <div class="welcome-msg">
        <p>Hello, {{ user?.FirstName }} {{ user?.LastName }}</p>
        <p>
          From your Orders you have the ability to view your all orders and
          status of order.
        </p>
      </div>
      <div class="box-account box-info">
        <div>
          <div class="box">
            <div class="row mx-auto h-25" v-if="assets.length">
              <div class="card my-3 p-0" v-for="(item, index) in assets" :key="index">
                <div class="card-header">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <span class="fw-bold">{{ item?.Product2?.Name }}</span>
                      <button type="button" class="btn status-btn mx-3"
                        :class="status === true ? 'active' : 'inactive'">
                        active
                      </button>
                    </div>
                    <div class="d-flex align-items-center">
                      <span class="mx-2 fw-bold">£&nbsp;&nbsp;{{ Number(item?.TotalLifecycleAmount?.toFixed(2)) ?? 0 }}
                        / year</span>
                      <div class="dropdown">
                        <a class="btn btn-outline-primary btn-sm dropdown-toggle text-black-50 text-white" href="#"
                          role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>
                        <ul class="dropdown-menu">
                          <li>
                            <a @click="handleSubscriptionModal('upgrade', item)" class="dropdown-item text-black"
                              href="#">Upgrade</a>
                          </li>
                          <li>
                            <a class="dropdown-item text-black" @click="handleModal(item)" data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop" href="#">Change Quantity</a>
                          </li>
                          <li>
                            <a @click="handleSubscriptionModal('renew', item)" class="dropdown-item text-black"
                              href="#">Renew</a>
                          </li>
                          <li>
                            <a @click="handleSubscriptionModal('cancel', item)" class="dropdown-item text-black"
                              href="#">Cancel</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text">
                    {{ item?.CurrentQuantity }} Users
                  </p>
                  <div>
                    <div class="row">
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Next Billing Date:</span>
                        <span>{{ dateFormat(item?.LifecycleEndDate, 'next') ?? '-' }}</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">You'll renew on:</span>
                        <span>{{ dateFormat(item?.LifecycleEndDate) }}</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Period:</span>
                        <span>
                          {{ dateFormat(item?.LifecycleStartDate) }}
                          {{
                            item?.LifecycleEndDate
                              ? `- ${dateFormat(item?.LifecycleEndDate)}`
                              : ''
                          }}
                        </span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Auto Renewal:</span>
                        <span>
                          <input type="checkbox" checked />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-12 empty-cart-cls text-center py-5" v-else>
              <img src="/images/icon-empty-cart.png" class="img-fluid" alt="empty Assets" />
              <h3 class="mt-3">
                <strong>You have no assets at the moment!</strong>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <upgradeModal v-if="isUpgrade" :is-open="isUpgrade" :current-asset="currentAsset" @close="handleClose"
      @upgrade="handleUpgrade" />
    <changeQuantityModal v-if="isOpen" :is-open="isOpen" @close="handleClose()" :current-asset="currentAsset" />
    <subscriptionModal v-if="isSubscription" :is-open="isSubscription" :type="sbs_type" :current-asset="currentAsset"
      @close="handleClose()" />
  </div>
  <!-- FULL SCREEN LOADER -->
  <div v-if="loading" class="loading-overlay">
    <div class="spinner-border text-light" role="status" style="width:3rem;height:3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

</template>

<script>
import changeQuantityModal from './changeQuantityModal.vue';
import subscriptionModal from './subscriptionModal.vue';
import upgradeModal from './upgradeModal.vue';
import { useAuthStore } from '~~/store/auth';

export default {
  components: { changeQuantityModal, subscriptionModal, upgradeModal },
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => { },
    },
  },

  data: () => ({
    status: false,
    isOpen: false,
    isSubscription: false,
    sbs_type: null,
    isUpgrade: false,
    currentAsset: {},
    loading: false,
  }),

  methods: {
    dateFormat(dateString, type) {
      if (dateString !== null) {
        const date = new Date(dateString);

        if (type === 'next') {
          const day = String(date.getUTCDate() + 1).padStart(2, '0');
          const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
          const year = date.getUTCFullYear();

          return `${day}/${month}/${year}`;
        }

        // Extract the day, month, and year
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getUTCFullYear();

        // Format the date as DD/MM/YYYY
        return `${day}/${month}/${year}`;
      }
    },

    handleModal(item) {
      this.isOpen = true;
      this.currentAsset = item;
    },

    handleClose() {
      this.isOpen = false;
      this.isSubscription = false;
      this.isUpgrade = false;
      this.sbs_type = null;
    },

    handleSubscriptionModal(type, item) {
      this.currentAsset = item;
      if (type === "upgrade") {
        this.isUpgrade = true;
      } else {
        this.sbs_type = type;
        this.isSubscription = true;
      }
    },
    async handleUpgrade({ from, to, plan, qty }) {
      this.loading = true;
      const today = new Date().toISOString().slice(0, 10);
      const date = new Date(today);
      const isoString = date.toISOString();
      const payload = {
        inputs: [
          {
            amendAssetIds: [this.currentAsset.Id],
            amendStartDate: isoString,
            quantityChange: '-' + this.currentAsset?.CurrentQuantity,
            amendOutputType: 'Quote',
          },
        ],
      };
      const other = {
        to,
        plan,
        qty
      }
      try {
        const response = await useAuthStore().upgradeSubscription(payload, other);
        if (response) {
          this.$emit('close');
        }
        useNuxtApp().$showToast({ msg: `Upgraded to ${to.name}`, type: "info" });
      } catch (error) {
        console.error('Upgrade error:', error);
        this.$emit('close');
        useNuxtApp().$showToast({ msg: "Something went wrong. Please try again later.", type: "error" })
      } finally {
        this.isUpgrade = false;
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.status-btn {
  height: 22px;
  padding: 0 10px;
  color: white;
  font-size: x-small;
  border-radius: 10px;
}

.active {
  background-color: green;
}

.inactive {
  background-color: goldenrod;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  /* full screen */
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  /* above modals */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
