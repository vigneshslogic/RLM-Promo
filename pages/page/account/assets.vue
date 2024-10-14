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
              <div
                class="card my-3 p-0"
                v-for="(item, index) in assets"
                :key="index"
              >
                <div class="card-header">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-flex align-items-center">
                      <span class="fw-bold">{{ item?.Product2?.Name }}</span>
                      <button
                        type="button"
                        class="btn status-btn mx-3"
                        :class="status === true ? 'active' : 'inactive'"
                      >
                        active
                      </button>
                    </div>
                    <div class="d-flex align-items-center">
                      <span class="mx-2 fw-bold"
                        >£&nbsp;&nbsp;{{ item?.CurrentAmount ?? 0 }} / year</span
                      >
                      <div class="dropdown">
                        <a
                          class="btn btn-outline-primary btn-sm dropdown-toggle text-black-50 text-white"
                          href="#"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        ></a>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item text-black" href="#"
                              >Upgrade</a
                            >
                          </li>
                          <li>
                            <a
                              class="dropdown-item text-black"
                              @click="handleModal(item)"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop"
                              href="#"
                              >Change Quantity</a
                            >
                          </li>
                          <li>
                            <a class="dropdown-item text-black" href="#"
                              >Renew</a
                            >
                          </li>
                          <li>
                            <a class="dropdown-item text-black" href="#"
                              >Cancel</a
                            >
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text">
                    {{ item?.CurrentQuantity }} Users | - | -
                  </p>
                  <div>
                    <div class="row">
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Next Billing Date:</span>
                        <span>{{ dateFormat(item?.LifecycleEndDate, 'next') ?? '-' }}</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Next Payment Amount:</span>
                        <span>£&nbsp;&nbsp;{{ item?.CurrentAmount ?? 0 }}</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">You'll renew on:</span>
                        <span>-</span>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-12 empty-cart-cls text-center py-5" v-else>
              <img
                src="/images/icon-empty-cart.png"
                class="img-fluid"
                alt="empty Assets"
              />
              <h3 class="mt-3">
                <strong>You have no assets at the moment!</strong>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <changeQuantityModal
      v-if="isOpen"
      :is-open="isOpen"
      @close="handleClose()"
      :current-asset="currentAsset"
    />
  </div>
</template>

<script>
import changeQuantityModal from './changeQuantityModal.vue';
export default {
  components: { changeQuantityModal },
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    status: false,
    isOpen: false,
    currentAsset: {},
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
</style>
