<template>
    <div class="dashboard-right">
      <div class="dashboard">
        <div class="page-title">
          <h2>My Invoices</h2>
        </div>
        <div class="welcome-msg">
          <p>Hello, {{ user?.FirstName }} {{  user?.LastName }}</p>
          <p>
            From your Invoices you have the ability to view your all invoices and
            status of invoice.
          </p>
        </div>
        <div class="box-account box-info">
          <div>
            <div class="box">
              <div class="row mx-auto">
                <div v-if="invoices.length">
                    <div class="card my-3" v-for="(item, index) in invoices" :key="index">
                    <div class="card-header d-flex justify-content-between">
                      <div>
                        <span class="fw-bold pe-3">Invoice Document No:</span>
                        <span>{{ item?.DocumentNumber }}</span> 
                      </div>
                      <button class="btn btn-solid btn-sm p-1">Pay Now</button>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col d-flex flex-column">
                            <span class="fw-bold">Invoice Date</span>
                            <span>{{ item?.InvoiceDate }}</span>
                        </div>
                        <div class="col d-flex flex-column">
                            <span class="fw-bold">Invoice Due Date</span>
                            <span>{{ item?.DueDate }}</span>
                        </div>
                        <div class="col d-flex flex-column">
                            <span class="fw-bold">Total Change Amount with Tax</span>
                            <span>{{ item?.TotalChargeAmountWithTax }}</span>
                        </div>
                        <div class="col d-flex flex-column">
                            <span class="fw-bold">Balance</span>
                            <span>£&nbsp;&nbsp;{{ item?.Balance }}</span>
                        </div>
                        <div class="col d-flex flex-column">
                            <span class="fw-bold">Total Amount</span>
                            <span>£&nbsp;&nbsp;{{ Number(item?.TotalChargeAmountWithTax?.toFixed(2)) ?? 0 }}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>
                <div class="col-sm-12 empty-cart-cls text-center py-5" v-else>
                  <img src='/images/icon-empty-cart.png' class="img-fluid" alt="empty cart" />
                  <h3 class="mt-3">
                    <strong>You have no invoices at the moment!</strong>
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
          invoices: {
              type: Array,
              default: () => [],
          },
          user: {
              type: Object,
              default: () => {}
          },
      }
  }
  </script>
  