<template>
  <Header />
  <div>
    <WidgetsBreadcrumbs :title="getDetail?.name" />
    <section class="section-b-space">
      <div class="collection-wrapper">
        <div class="container">
          <div class="row">
            <div class="col-lg-3">
              <WidgetsProductSidebar />
            </div>
            <div class="col-lg-9 col-sm-12 col-xs-12 productdetail">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-lg-6">
                    <swiper
                      @swiper="onSwiper"
                      :slidesPerView="1"
                      :spaceBetween="20"
                      class="swiper-wrapper h-auto"
                    >
                      <swiper-slide class="swiper-slide">
                        <img
                          class="img-fluid bg-img"
                          :src="image"
                          />
                      </swiper-slide>
                    </swiper>
                  </div>
                  <div class="col-lg-6 rtl-text">
                    <div class="product-right">
                      <h2>{{ getDetail?.name }}</h2>

                      <h4 v-if="getDetail?.nodeType === 'bundleProduct'" class="text-danger">Request for detail pricing</h4>
                      <h3 v-else>£{{ Number(selectedPlan?.price?.toFixed(2)) ?? 0 }}</h3>
                      
                      <div class="product-description border-product">
                        <h6 class="product-title size-text">select plan</h6>
                        <div class="size-box">
                          <ul v-if="getDetail?.nodeType === 'bundleProduct'">
                            <li
                              v-if="getDetail?.id === '01tPv000006pgL7IAI'"
                              v-show="!(!getDetail?.prices[0] && index > 1 )"
                              class="product-title"
                              :key="index"
                              v-bind:class="{
                                active:
                                  getDetail?.prices[0]?.priceBookEntryId ==
                                  selectedPlan?.priceBookEntryId,
                              }"
                            >
                              <a
                                href="javascript:void(0)"
                                @click="changeSizeVariant(price)"
                              >
                                {{ price?.pricingModel?.frequency ?? 'One Time' }}
                              </a>
                            </li>
                          </ul>
                          <ul v-else>
                            <li
                              v-for="(price, index) in getDetail?.prices"
                              v-show="!(!price && index > 1 )"
                              class="product-title"
                              :key="index"
                              v-bind:class="{
                                active:
                                  price?.priceBookEntryId ==
                                  selectedPlan?.priceBookEntryId,
                              }"
                            >
                              <a
                                href="javascript:void(0)"
                                @click="changeSizeVariant(price)"
                              >
                                {{ price?.pricingModel?.frequency ?? 'One Time' }}
                              </a>
                            </li>
                          </ul>
                        </div>

                        <h6 class="product-title">quantity</h6>
                        <div class="qty-box">
                          <div class="input-group">
                            <span class="input-group-prepend">
                              <button
                                type="button"
                                class="btn quantity-left-minus"
                                data-type="minus"
                                data-field
                                @click="decrement()"
                              >
                                <i class="ti-angle-left"></i>
                              </button>
                            </span>
                            <input
                              type="text"
                              name="quantity"
                              class="form-control input-number"
                              v-model="counter"
                            />
                            <span class="input-group-prepend">
                              <button
                                type="button"
                                class="btn quantity-right-plus"
                                data-type="plus"
                                data-field
                                @click="increment()"
                              >
                                <i class="ti-angle-right"></i>
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="product-buttons">
                        <!-- <nuxt-link :to="{ path: '/page/account/cart' }"> -->
                        <button
                          class="btn btn-solid ms-2"
                          title="Configure"
                          v-if="getDetail?.nodeType === 'bundleProduct' && useCookie('userInfo')?.value?.Id"
                          @click="handleGetQuote"
                        >
                          Request Quote
                        </button>
                        <button
                          class="btn btn-solid ms-2"
                          title="Add to cart"
                          @click="addToCart(getDetail, counter)"
                          v-if="getDetail?.nodeType !== 'bundleProduct'"
                        >
                          Add To Cart
                        </button>
                        <!-- </nuxt-link> -->
                        <button
                          class="btn btn-solid ms-2"
                          title="buy now"
                          :disabled="counter > getDetail?.stock"
                          v-if="getDetail?.nodeType !== 'bundleProduct'"
                        >
                          <!-- @click="buyNow(getDetail, counter)" -->
                          Buy Now
                        </button>
                      </div>
                      <div class="border-product">
                        <h6 class="product-title">product details</h6>
                        <p>
                          {{
                            getDetail?.description?.substring(0, 200) + "...."
                          }}
                        </p>
                      </div>
                      <div class="border-product">
                        <h6 class="product-title">share it</h6>
                        <div class="product-icon">
                          <ul class="product-social">
                            <li>
                              <a href="javascript:void(0)">
                                <i class="fa fa-facebook"></i>
                              </a>
                            </li>
                            <li>
                              <a href="javascript:void(0)">
                                <i class="fa fa-google-plus"></i>
                              </a>
                            </li>
                            <li>
                              <a href="javascript:void(0)">
                                <i class="fa fa-twitter"></i>
                              </a>
                            </li>
                            <li>
                              <a href="javascript:void(0)">
                                <i class="fa fa-instagram"></i>
                              </a>
                            </li>
                            <li>
                              <a href="javascript:void(0)">
                                <i class="fa fa-rss"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="border-product">
                        <h6 class="product-title">Time Reminder</h6>
                        <WidgetsTimer date="December 30, 2024" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <section class="tab-product m-0">
                <div class="row">
                  <div class="col-sm-12 col-lg-12">
                    <ul
                      class="nav nav-tabs nav-material"
                      id="top-tab"
                      role="tablist"
                    >
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          id="top-home-tab"
                          data-bs-toggle="tab"
                          href="#top-home"
                          role="tab"
                          aria-selected="true"
                          ><i class="icofont icofont-ui-home"></i>Details</a
                        >
                        <div class="material-border"></div>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="contact-top-tab"
                          data-bs-toggle="tab"
                          href="#top-contact"
                          role="tab"
                          aria-selected="false"
                          ><i class="icofont icofont-contacts"></i>Video</a
                        >
                        <div class="material-border"></div>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="review-top-tab"
                          data-bs-toggle="tab"
                          href="#top-review"
                          role="tab"
                          aria-selected="false"
                          ><i class="icofont icofont-contacts"></i>Write
                          Review</a
                        >
                        <div class="material-border"></div>
                      </li>
                    </ul>
                    <div class="tab-content nav-material" id="top-tabContent">
                      <div
                        class="tab-pane fade show active"
                        id="top-home"
                        role="tabpanel"
                        aria-labelledby="top-home-tab"
                      >
                        <div class="product-tab-discription">
                          <div class="part">
                            <p>
                              {{ getDetail?.description }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="top-contact"
                        role="tabpanel"
                        aria-labelledby="contact-top-tab"
                      >
                        <div class="">
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/BUWzX78Ye_8"
                            allow="autoplay; encrypted-media"
                            allowfullscreen
                          ></iframe>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="top-review"
                        role="tabpanel"
                        aria-labelledby="review-top-tab"
                      >
                        <form class="theme-form">
                          <div class="form-row row">
                            <div class="col-md-12">
                              <div class="media">
                                <label>Rating</label>
                                <div class="media-body ms-3">
                                  <div class="rating three-star">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <label for="name">Name</label>
                              <input
                                type="text"
                                class="form-control"
                                id="name"
                                placeholder="Enter Your name"
                                required
                              />
                            </div>
                            <div class="col-md-6">
                              <label for="email">Email</label>
                              <input
                                type="text"
                                class="form-control"
                                id="email"
                                placeholder="Email"
                                required
                              />
                            </div>
                            <div class="col-md-12">
                              <label for="review">Review Title</label>
                              <input
                                type="text"
                                class="form-control"
                                id="review"
                                placeholder="Enter your Review Subjects"
                                required
                              />
                            </div>
                            <div class="col-md-12">
                              <label for="review">Review Title</label>
                              <textarea
                                class="form-control"
                                placeholder="Wrire Your Testimonial Here"
                                id="exampleFormControlTextarea1"
                                rows="6"
                              ></textarea>
                            </div>
                            <div class="col-md-12">
                              <button class="btn btn-solid" type="submit">
                                Submit YOur Review
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <WidgetsRelatedProducts
        :productTYpe="productTYpe"
        :productId="productId"
      />
      <CartModalQuoteModalPopup v-if="showQuoteModal" :productData="getDetail" :openQuote="showQuoteModal" :qty="counter" @closeQuote="closeQuoteModal" :noAction="true" />
    </section>
  </div>
  <Footer />
</template>

<script setup>
import "swiper/css";
import { onMounted } from "vue";
import { useProductStore } from "~~/store/products";
import { useRoute } from "vue-router";
import { useCartStore } from "~~/store/cart";
import pkg from 'lodash';

const { find } = pkg;

const getDetail = ref(null);
const route = useRoute();
const counter = ref(1);
const selectedPlan = ref("");
const image = ref('');
const showQuoteModal = ref(false);

const handleGetQuote = () => {
  showQuoteModal.value = true;
};

const closeQuoteModal = () => {
  showQuoteModal.value = false;
}

onMounted(async () => {
  getDetail.value = await useProductStore().getProductById(route.params.id);
  image.value = getDetail.value?.displayUrl?.replace(/&amp;/g, '&') ?? '/images/6.jpg';

  if (!find(getDetail?.value?.prices, { isDefault: true }) && getDetail?.value?.prices) {
    selectedPlan.value = getDetail?.value?.prices[0];
  } else {
    selectedPlan.value =
      find(getDetail?.value?.prices, { isDefault: true }) ?? "";
  }
});

const increment = () => {
  counter.value++;
};

const decrement = () => {
  if (counter.value > 1) counter.value--;
};

const changeSizeVariant = (variant) => {
  selectedPlan.value = variant;
};

const addToCart = (product, qty) => {
  product.price = selectedPlan?.value?.price;
  product.priceBookEntryId = selectedPlan?.value?.priceBookEntryId;
  product.priceBookId = selectedPlan?.value?.priceBookId;
  product.priceModelId = selectedPlan?.value?.pricingModel?.id;
  product.quantity = qty || 1;
  product.periodBoundary = selectedPlan?.value?.pricingModel?.frequency ?? 'OneTime';
  useCartStore().addToCart(product);
  useNuxtApp().$showToast({ msg: "Product Is successfully added to the cart.", type:"info" })
};

const buyNow = (product, qty) => {
  product.price = selectedPlan?.value?.price;
  product.priceBookEntryId = selectedPlan?.value?.priceBookEntryId;
  product.priceBookId = selectedPlan?.value?.priceBookId;
  product.priceModelId = selectedPlan?.value?.pricingModel?.id;
  product.quantity = qty || 1;
  product.periodBoundary = selectedPlan?.value?.pricingModel?.frequency ?? 'OneTime';
  useCartStore().setInitialCart(product);
  
};

</script>
