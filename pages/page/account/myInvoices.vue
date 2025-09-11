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
                      <div>
                        <button
                          class="btn btn-solid btn-sm p-1 mx-1"
                          @click="downloadInvoice(item.Id)"
                          :disabled="downloadingInvoices.includes(item.Id)"
                        >
                          <span v-if="downloadingInvoices.includes(item.Id)" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {{ downloadingInvoices.includes(item.Id) ? 'Downloading...' : 'Download Invoice' }}
                        </button>
                        <button class="btn btn-solid btn-sm p-1 mx-1">Pay Now</button>
                      </div>
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
                            <span class="fw-bold">Total Amount with Tax</span>
                            <span>£&nbsp;&nbsp;{{ item?.TotalChargeAmountWithTax }}</span>
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
  import { useAuthStore } from '~~/store/auth'
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
    },
    data() {
      return {
        downloadingInvoices: [],
      }
    },
    methods: {
      async downloadInvoice(invoiceId) {
        this.downloadingInvoices.push(invoiceId);
        
        try {
          const downloadPromise = useAuthStore().downloadInvoice(invoiceId);

          downloadPromise.then(res => {
            const blob = new Blob([res.data], { type: res.headers["content-type"] });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            const disposition = res.headers["content-disposition"];
            let fileName = "invoice.pdf";
            if (disposition && disposition.indexOf("filename=") !== -1) {
              fileName = disposition.split("filename=")[1].replace(/"/g, "");
            }
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 100);
            useNuxtApp().$showToast({
              msg:"Invoice downloaded successfully!",
              type: 'success'
            });
          }).catch(err => {
            const message = err.response?.data?.message || "No invoice file found.";
            useNuxtApp().$showToast({
              msg:message,
              type: 'warning'
            });
          }).finally(() => {
            this.downloadingInvoices = this.downloadingInvoices.filter(id => id !== invoiceId);
          });  
        } catch (err) {
          console.error("Download initialization failed:", err);
          useNuxtApp().$showToast({
              msg:"Unable to start download.",
              type: 'error'
            });
          this.downloadingInvoices = this.downloadingInvoices.filter(id => id !== invoiceId);
        }
      },
    },
  }
  </script>