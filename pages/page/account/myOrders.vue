<template>
  <div class="dashboard-right">
    <div class="dashboard">
      <div class="page-title">
        <h2>My orders</h2>
      </div>
      <div class="welcome-msg">
        <p>Hello, {{ user?.FirstName }} {{  user?.LastName }}</p>
        <p>
          From your Orders you have the ability to view your all orders and
          status of order.
        </p>
      </div>
      <div class="box-account box-info">
        <div class="box-head">
          <h2>Order Information</h2>
        </div>
        <div>
          <div class="box">
            <div class="box-title mb-3">
              <h3>orders list</h3>
            </div>
            <div class="row mx-auto">
              <div class="col-sm-12 empty-cart-cls text-center" v-if="!orders.length">
                <img src='/images/icon-empty-cart.png' class="img-fluid" alt="empty cart" />
                <h3 class="mt-3">
                  <strong>You have no orders at the moment!</strong>
                </h3>
              </div>
              <div v-if="orders.length">
                <div class="card my-3" v-for="(item, index) in orders" :key="index">
                  <div class="card-header">
                    <div class="d-flex flex-column">
                      <span class="fw-bold">Order</span>
                      <span>{{ item?.Id }}</span> 
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Account Name</span>
                        <span>{{ item?.BillToContact?.Name }}</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Contact Number</span>
                        <span>-</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Order Start Date</span>
                        <span>{{ item?.EffectiveDate }}</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Status</span>
                        <span>-</span>
                      </div>
                      <div class="col d-flex flex-column">
                        <span class="fw-bold">Order Amount</span>
                        <span>£&nbsp;&nbsp;{{ item?.TotalAmount }}</span>
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
export default {
    props: {
        orders: {
            type: Array,
            default: () => [],
        },
        user: {
            type: Object,
            default: () => {}
        },
    },
}
</script>
