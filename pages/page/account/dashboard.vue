<template>
  <Header />
  <div>
    <WidgetsBreadcrumbs title="Dashboard" />
    <section class="dashboard-section section-b-space user-dashboard-section">
      <div class="container">
        <div class="row g-3">
          <div class="col-lg-3">
            <div class="dashboard-sidebar">
              <div class="faq-tab">
                <ul
                  class="nav nav-tabs flex-column"
                  id="top-tab"
                  role="tablist"
                >
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#info"
                      class="nav-link active"
                      >Account Info</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#address"
                      class="nav-link"
                      >Address Book</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#orders"
                      class="nav-link"
                      >My Orders</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#assets"
                      class="nav-link"
                      >My Subscriptions/ Assets</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#invoices"
                      class="nav-link"
                      >My Invoices</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#wishlist"
                      class="nav-link"
                      >Newsletter</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#payment"
                      class="nav-link"
                      >Change Password</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-bs-toggle="tab"
                      data-bs-target="#profile"
                      class="nav-link"
                      >Logout</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-9">
            <div class="faq-content tab-content" id="top-tabContent">
              <div class="tab-pane fade show active" id="info">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>My Dashboard</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, John Doe!</p>
                      <p>
                        From your My Account Dashboard you have the ability to
                        view a snapshot of your recent account activity and
                        update your account information. Select a link below to
                        view or edit information.
                      </p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>John Doe</h6>
                              <h6>johndoe@example.com</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>
                                You are currently not subscribed to any
                                newsletter.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="#">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address>
                                123 High Street, <br />
                                London, United Kingdom. <br />
                                W1A 1AA.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                            <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address>
                                You have not set a default shipping address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="address">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>My Dashboard</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, MARK JECNO !</p>
                      <p>
                        From your My Account Dashboard you have the ability to
                        view a snapshot of your recent account activity and
                        update your account information. Select a link below to
                        view or edit information.
                      </p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="javascript.void(0)">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>MARK JECNO</h6>
                              <h6>MARk-JECNO@gmail.com</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>
                                You are currently not subscribed to any
                                newsletter.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="#">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address>
                                You have not set a default billing address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                            <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address>
                                You have not set a default shipping address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="orders">
                <myOrders v-if="orders" :orders="orders?.records" :user="user"/>
              </div>
              <div class="tab-pane fade" id="assets">
                <assets v-if="assets" :assets="assets?.records" :user="user"/>
              </div>
              <div class="tab-pane fade" id="invoices">
                <myInvoices v-if="invoices" :invoices="invoices?.records" :user="user"/>
              </div>
              <div class="tab-pane fade" id="wishlist">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Newsletter</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, MARK JECNO !</p>
                      <p>
                        you how all this mistaken idea of denouncing pleasure
                        and praising pain was born and I will give you a
                        complete account of the system, and expound the actual
                        teachings.
                      </p>
                      <p>
                        Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit
                        Voluptatem Accusantium Doloremque Laudantium
                      </p>
                      <p>
                        On the other hand, we denounce with righteous
                        indignation and dislike men who are so beguiled and
                        demoralized by the charms of pleasure of the moment, so
                        blinded by desire, that they cannot foresee the pain and
                        trouble that are bound to ensue; and equal blame belongs
                        to those who fail in their duty through weakness of
                        will, which is the same as saying through shrinking from
                        toil and pain. These cases are perfectly simple and easy
                        to distinguish. In a free hour, when our power of choice
                        is untrammelled and when nothing prevents our being able
                        to do what we like best, every pleasure is to be
                        welcomed and every pain avoided. But in certain
                        circumstances and owing to the claims of duty or the
                        obligations of business it will frequently occur that
                        pleasures have to be repudiated and annoyances accepted.
                        The wise man therefore always holds in these matters to
                        this principle of selection: he rejects pleasures to
                        secure other greater pleasures, or else he endures pains
                        to avoid worse pains.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="payment">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Change password</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, MARK JECNO !</p>
                      <p>
                        you how all this mistaken idea of denouncing pleasure
                        and praising pain was born and I will give you a
                        complete account of the system, and expound the actual
                        teachings.
                      </p>
                      <p>
                        Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit
                        Voluptatem Accusantium Doloremque Laudantium
                      </p>
                      <p>
                        On the other hand, we denounce with righteous
                        indignation and dislike men who are so beguiled and
                        demoralized by the charms of pleasure of the moment, so
                        blinded by desire, that they cannot foresee the pain and
                        trouble that are bound to ensue; and equal blame belongs
                        to those who fail in their duty through weakness of
                        will, which is the same as saying through shrinking from
                        toil and pain. These cases are perfectly simple and easy
                        to distinguish. In a free hour, when our power of choice
                        is untrammelled and when nothing prevents our being able
                        to do what we like best, every pleasure is to be
                        welcomed and every pain avoided. But in certain
                        circumstances and owing to the claims of duty or the
                        obligations of business it will frequently occur that
                        pleasures have to be repudiated and annoyances accepted.
                        The wise man therefore always holds in these matters to
                        this principle of selection: he rejects pleasures to
                        secure other greater pleasures, or else he endures pains
                        to avoid worse pains.
                      </p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>MARK JECNO</h6>
                              <h6>MARk-JECNO@gmail.com</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>
                                You are currently not subscribed to any
                                newsletter.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="profile">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Log Out</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, MARK JECNO !</p>
                      <p>
                        Log out From your Account Dashboard. Select a link below
                        to view or edit information.
                      </p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>MARK JECNO</h6>
                              <h6>MARk-JECNO@gmail.com</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>
                                You are currently not subscribed to any
                                newsletter.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="#">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address>
                                You have not set a default billing address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                            <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address>
                                You have not set a default shipping address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
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
    </section>
  </div>
  <Footer />
</template>

<script>
import { useAuthStore } from '~~/store/auth'
import myOrders from './myOrders.vue';
import myInvoices from  "./myInvoices.vue";
import assets from './assets.vue';

export default {
  components: { myOrders, myInvoices, assets },
  data() {
    return {
      orders: null,
      invoices: null,
      assets: null,
      user: {},
    }
  },
  
  methods: {
    async getAuthOrders() {
      this.orders = await useAuthStore().getOrders();
    },
    async getAuthInvoices() {
      this.invoices = await useAuthStore().getInvoices();
    },
    async getAuthAssets() {
      this.assets = await useAuthStore().getAssets();
    }
  },

  mounted() {
    this.user = useCookie('userInfo')
    this.getAuthOrders();
    this.getAuthInvoices();
    this.getAuthAssets();
  }
}
</script>
