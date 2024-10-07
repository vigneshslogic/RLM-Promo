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
                          src="/images/6.jpg"
                          />
                          <!-- :src="getDetail?.displayUrl" -->
                      </swiper-slide>
                    </swiper>
                  </div>
                  <div class="col-lg-6 rtl-text">
                    <div class="product-right">
                      <h2>{{ getDetail?.name }}</h2>

                      <h3>${{ selectedPlan?.price }}</h3>
                      <ul class="color-variant">
                        <!-- <li
                          v-bind:class="{ active: activeColor == variant }"
                          v-for="(variant, variantIndex) in Color(
                            getDetail?.variants
                          ) ?? []"
                          :key="variantIndex"
                        >
                          <a
                            :class="[variant]"
                            v-bind:style="{ 'background-color': variant }"
                            @click="
                              sizeVariant(
                                getDetail?.variants[variantIndex].image_id,
                                variantIndex,
                                variant
                              )
                            "
                          ></a>
                        </li> -->
                      </ul>
                      <!-- <div class="pro_inventory" v-if="getDetail?.stock < 8">
                        <p class="active">
                          Hurry! We have only {{ getDetail?.stock }} product in
                          stock.
                        </p>
                        <div class="inventory-scroll">
                          <span style="width: 95%"></span>
                        </div>
                      </div> -->

                      <!-- Manage a variants -->
                      <div class="product-description border-product">
                        <h6 class="product-title size-text">select plan</h6>
                        <div class="size-box">
                          <ul>
                            <li
                              class="product-title"
                              v-for="(price, index) in getDetail?.prices"
                              :key="index"
                              v-bind:class="{
                                active:
                                  price?.priceBookEntryId ==
                                  selectedPlan?.priceBookEntryId,
                              }"
                            >
                              <!-- v-for="(price, index) in prices" :key="index" -->
                              <a
                                v-if="price?.pricingModel?.frequency"
                                href="javascript:void(0)"
                                @click="changeSizeVariant(price)"
                              >
                                {{
                                  Array.from(price?.pricingModel?.frequency)[0]
                                }}
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
                            <!-- :disabled="counter > getDetail?.stock" -->
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
                          class="btn btn-solid"
                          title="Add to cart"
                          @click="addToCart(getDetail, counter)"
                        >
                          <!-- :disabled="counter > getDetail?.stock" -->
                          Add To Cart
                        </button>
                        <!-- </nuxt-link> -->
                        <button
                          class="btn btn-solid ms-2"
                          title="buy now"
                          :disabled="counter > getDetail?.stock"
                        >
                          <!-- @click="buyNow(getDetail, counter)" -->
                          Buy Now
                        </button>
                      </div>
                      <div class="border-product">
                        <h6 class="product-title">product details</h6>
                        <p>
                          {{
                            getDetail?.description.substring(0, 200) + "...."
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
                          <!-- <form class="d-inline-block">
                            <button
                              class="wishlist-btn"
                              @click="addToWishlist(product)"
                            >
                              <i class="fa fa-heart"></i>
                              <span class="title-font">Add To WishList</span>
                            </button>
                          </form> -->
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
                          id="profile-top-tab"
                          data-bs-toggle="tab"
                          href="#top-profile"
                          role="tab"
                          aria-selected="false"
                          ><i class="icofont icofont-man-in-glasses"></i
                          >Specification</a
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
                              The Model is wearing a white blouse from our
                              stylist's collection, see the image for a mock-up
                              of what the actual blouse would look like.it has
                              text written on it in a black cursive language
                              which looks great on a white color.
                            </p>
                          </div>
                          <div class="part">
                            <h5 class="inner-title">fabric:</h5>
                            <p>
                              Art silk is manufactured by synthetic fibres like
                              rayon. It's light in weight and is soft on the
                              skin for comfort in summers.Art silk is
                              manufactured by synthetic fibres like rayon. It's
                              light in weight and is soft on the skin for
                              comfort in summers.
                            </p>
                          </div>
                          <div class="part">
                            <h5 class="inner-title">size & fit:</h5>
                            <p>The model (height 5'8") is wearing a size S</p>
                          </div>
                          <div class="part">
                            <h5 class="inner-title">Material & Care:</h5>
                            <p>Top fabric: pure cotton</p>
                            <p>Bottom fabric: pure cotton</p>
                            <p>Hand-wash</p>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="top-profile"
                        role="tabpanel"
                        aria-labelledby="profile-top-tab"
                      >
                        <p>
                          The Model is wearing a white blouse from our stylist's
                          collection, see the image for a mock-up of what the
                          actual blouse would look like.it has text written on
                          it in a black cursive language which looks great on a
                          white color.
                        </p>
                        <div class="single-product-tables">
                          <table>
                            <tbody>
                              <tr>
                                <td>Sleeve Length</td>
                                <td>Sleevless</td>
                              </tr>
                              <tr>
                                <td>Neck</td>
                                <td>Round Neck</td>
                              </tr>
                              <tr>
                                <td>Occasion</td>
                                <td>Sports</td>
                              </tr>
                            </tbody>
                          </table>
                          <table>
                            <tbody>
                              <tr>
                                <td>Fabric</td>
                                <td>Polyester</td>
                              </tr>
                              <tr>
                                <td>Fit</td>
                                <td>Regular Fit</td>
                              </tr>
                            </tbody>
                          </table>
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

onMounted(async () => {
  getDetail.value = await useProductStore().getProductById(route.params.id);

  selectedPlan.value =
    find(getDetail?.value?.prices, { isDefault: true }) ?? "";
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
  useCartStore().addToCart(product);
};

// export default {
//   data() {
//     return {
//       // slideId: 0,
//       // counter: 1,
//       // activeColor: "",
//       // selectedSize: "",
//       // qty: "",
//       // size: [],
//       // productTYpe: "",
//       // productId: "",
//       product: null,
//     };
//   },
//   computed: {
//     // ...mapState(useProductStore, {
//     //   currency: "currency",
//     // }),

//     // curr() {
//     //   return useProductStore().changeCurrency;
//     // },
//     // getDetail: function () {
//     //   return useProductStore().getProductById(this.$route.params.id);
//     // },
//   },

//   mounted() {
//     this.product = useProductStore().getProductById(this.$route.params.id);
//     // For displaying default color and size on pageload
//     // this.uniqColor = this.getDetail?.variants[0].color;
//     // this.sizeVariant(this.getDetail?.variants[0].image_id);
//     // // Active default color
//     // this.activeColor = this.uniqColor;
//     // this.changeSizeVariant(this.getDetail?.variants[0].size);
//     // // related product type
//     // this.relatedProducts();
//   },

//   methods: {
//     // onSwiper(swiper) {
//     //   this.swiper = swiper;
//     // },
//     // priceCurrency: function () {
//     //   useProductStore().changeCurrency();
//     // },
//     // addToWishlist: function (product) {
//     //   useProductStore().addToWishlist(product);
//     // },
//     // discountedPrice(product) {
//     //   const price =
//     //     (product.price - (product.price * product.discount) / 100) *
//     //     this.curr?.curr;
//     //   return ponMountedProducts display
//     // relatedProducts() {
//     //   this.productTYpe = this.getDetail?.type;
//     //   this.productId = this.getDetail?.id;
//     // },
//     // // Display Unique Color
//     // Color(variants) {
//     //   const uniqColor = [];
//     //   for (let i = 0; i < Object.keys(variants).length; i++) {
//     //     if (uniqColor.indexOf(variants[i].color) === -1) {
//     //       uniqColor.push(variants[i].color);
//     //     }
//     //   }
//     //   return uniqColor;
//     // },
//     // buyNow: function (product, qty) {
//     //   product.quantity = qty || 1;
//     //   useCartStore().addToCart(product);
//     //   this.$router.push("/page/account/checkout");
//     // },
//     // // Change size variant
//     // changeSizeVariant(variant) {
//     //   this.selectedSize = variant;
//     // },
//     // getImgUrl(path) {
//     //   return "/images/" + path;
//     // },
//     // slideTo(id) {
//     //   this.swiper.slideTo(id);

//     //   this.slideId = id;
//     // },

//     // sizeVariant(id, slideId, color) {
//     //   this.swiper.slideTo(slideId);
//     //   this.size = [];
//     //   this.activeColor = color;
//     //   this.getDetail?.variants.filter((item) => {
//     //     if (id === item.image_id) {
//     //       this.size.push(item.size);
//     //     }
//     //   });
//     // },
//   }
// };
</script>
