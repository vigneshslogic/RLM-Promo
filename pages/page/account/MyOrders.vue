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
              <table v-if="orders.length" class="table cart-table table-responsive-xs">
                <thead>
                  <tr class="table-head">
                    <th scope="col">Product ID</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total Amount</th>
                  </tr>
                </thead>
                <tbody v-for="(item, i) in orders" :key="i">
                  <tr>
                    <td>{{ item?.Id }}</td>
                    <td>{{ item?.BillToContact?.Name }}</td>
                    <td>{{ item?.EffectiveDate }}</td>
                    <td>£&nbsp;&nbsp;{{ item?.TotalAmount }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="col-sm-12 empty-cart-cls text-center" v-if="!orders.length">
                <img src='/images/icon-empty-cart.png' class="img-fluid" alt="empty cart" />
                <h3 class="mt-3">
                  <strong>You have no orders at the moment!</strong>
                </h3>
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
