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
                      <PromoPrice v-else :product="getDetail" :price="calculatedPrice" />
                      
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
                                {{ getPlanLabel(price) }}
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
                                {{ getPlanLabel(price) }}
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div v-if="getDetail?.attributes" class="my-3 w-50">
                          <div v-for="(item, index) in getDetail?.attributes" :key="index">
                            <div v-if="item.dataType === 'PICKLIST'">
                              <h6 class="product-title size-text">Select {{ item.attributeNameOverride || item.name }}</h6>
                              <select
                                class="form-select"
                                aria-label="Default select example"
                                v-model="selectedAttribute"
                                @change="updateSelect(item)"
                              >
                                <option :value="null" hidden>Please select {{ item.attributeNameOverride || item.name }}</option>
                                <option
                                  v-for="(option, i) in item?.attributePickList?.values"
                                  :key="i"
                                  :value="option?.code"
                                >
                                  {{ option?.displayValue }}
                                </option>
                              </select>
                            </div>
                          </div>
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
                        <nuxt-link :to="{ path: '/page/account/checkout' }"> 
                          <button
                            class="btn btn-solid ms-2"
                            title="buy now"
                            :disabled="counter > getDetail?.stock"
                            v-if="getDetail?.nodeType !== 'bundleProduct'"
                            @click="buyNow(getDetail, counter)"
                          >
                            Buy Now
                          </button>
                        </nuxt-link>
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
import { onMounted, ref } from "vue";
import { useProductStore } from "~~/store/products";
import { useRoute } from "vue-router";
import { useCartStore } from "~~/store/cart";
import { useAuthStore } from '~~/store/auth';
import pkg from 'lodash';
import PromoPrice from '~/components/PromoPrice.vue';
import { usePromo } from '~/composables/usePromo';

const { find } = pkg;
const { $showToast } = useNuxtApp();

const getDetail = ref(null);
const route = useRoute();
const counter = ref(1);
const selectedPlan = ref(null);
const image = ref('');
const showQuoteModal = ref(false);

const selectedAttribute = ref(null);
const calculatedPrice = ref(0);
const userInfo = useCookie('userInfo');
const picklistAttributeDef = ref(null);
const handleGetQuote = () => {
  showQuoteModal.value = true;
};

const closeQuoteModal = () => {
  showQuoteModal.value = false;
}

const calculateAttributePrice = async () => {
  if (!selectedPlan.value) {
    calculatedPrice.value = 0;
    return;
  }

  const basePrice = selectedPlan.value.price;
  calculatedPrice.value = basePrice;

  if (selectedAttribute.value && picklistAttributeDef.value?.isPriceImpacting) {
    
    if (selectedPlan.value?.pricingModel) {
        
        try {
            const pricingBody = {
                accessToken: userInfo.value?.accessToken, 
                productId: getDetail.value.id,
                productSellingModelId: selectedPlan.value.pricingModel?.id, 
                sellingModelType: selectedPlan.value.pricingModel?.pricingModelType,
                attributeName: picklistAttributeDef.value.name,
                attributeValue: selectedAttribute.value,
                basePrice: basePrice
            };
            
             const response = await useAuthStore().attributePricing(pricingBody);

            if (response.success) {
                calculatedPrice.value = response.finalPrice;
                $showToast({ msg: `Price updated to: £${response.finalPrice.toFixed(2)}`, type: "success" });
            } else {
                console.warn('Attribute pricing API returned no adjusted price. Keeping base price.');
            }

        } catch (error) {
            console.error('Error during attribute pricing calculation:', error);
            //$showToast({ msg: "Error calculating attribute price. Reverting to list price.", type: "error" });
            calculatedPrice.value = basePrice; 
        }
    }
  } else {
    calculatedPrice.value = basePrice;
  }
};

onMounted(async () => {
  getDetail.value = await useProductStore().getProductById(route.params.id);
  image.value = getDetail.value?.displayUrl?.replace(/&amp;/g, '&') ?? '/images/6.jpg';

  if (getDetail?.value?.prices) {
    const defaultPlan = find(getDetail.value.prices, { isDefault: true });
    selectedPlan.value = defaultPlan || getDetail.value.prices[0];
  }

  const picklistDef = getDetail.value?.attributes?.find(attr => attr.dataType === 'PICKLIST');
  if (picklistDef) {
    picklistAttributeDef.value = picklistDef;
    
    selectedAttribute.value = null; 
    /*
    const defaultValueCode = picklistDef.defaultValue;
    const defaultOption = picklistDef.attributePickList?.values.find(v => v.code === defaultValueCode);
    if (defaultOption) {
        selectedAttribute.value = defaultOption.code;
    } else if (picklistDef.attributePickList?.values?.length > 0) {
        selectedAttribute.value = picklistDef.attributePickList.values[0].code;
    }
    */
  }
  calculateAttributePrice();
});


const increment = () => {
  counter.value++;
};

const decrement = () => {
  if (counter.value > 1) counter.value--;
};

const changeSizeVariant = (variant) => {
  selectedPlan.value = variant;
  calculateAttributePrice(); 
};

const updateSelect = (attributeDef) => {
  console.log('Selected attribute value changed to:', selectedAttribute.value);
  calculateAttributePrice();
};


const addToCart = (product, qty) => {

  product.price = calculatedPrice.value; 
  product.listPrice = selectedPlan.value.price;

  product.priceBookEntryId = selectedPlan.value.priceBookEntryId;
  product.priceBookEntryId = selectedPlan.value.priceBookEntryId;
  product.priceBookId = selectedPlan.value.priceBookId;
  product.priceModelId = selectedPlan.value.pricingModel?.id;
  product.pricingModelType = selectedPlan.value.pricingModel?.pricingModelType;
  product.quantity = qty || 1;
  product.periodBoundary = selectedPlan.value.pricingModel?.frequency ?? 'OneTime';
  
  if (selectedAttribute.value && picklistAttributeDef.value) {
      const selectedOptionDetails = picklistAttributeDef.value.attributePickList.values.find(v => v.code === selectedAttribute.value);
      product.selectedAttribute = {
          name: picklistAttributeDef.value.name,
          code: selectedAttribute.value,
          displayValue: selectedOptionDetails?.displayValue,
          definitionId: picklistAttributeDef.value.id,
          picklistValueId: selectedOptionDetails?.id
      };
  } else {
    delete product.selectedAttribute;
  }
  useCartStore().addToCart(product);
  $showToast({ msg: "Product is successfully added to the cart.", type:"info" })
};

const buyNow = (product, qty) => {
  addToCart(product, qty);
};

const getPlanLabel = (price) => {
  const frequency = price?.pricingModel?.frequency ?? 'One Time';
  const type = price?.pricingModel?.pricingModelType;
  if (type === 'Evergreen') {
    return `${frequency} (Evergreen)`;
  }
  return frequency;
};
</script>