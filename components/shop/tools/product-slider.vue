<template>
  <div>
    <section class="section-b-space tools-grey ratio_square">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="title3">
              <h2 class="title-inner3">{{ title }}</h2>
              <div class="line"></div>
            </div>

            <!-- <pre>
              {{ catalogues[0] }}
            </pre> -->

            <swiper
              :loop="true"
              :breakpoints="swiperOption.breakpoints"
              :slidesPerView="5"
              :spaceBetween="20"
              class="swiper-wrapper"
            >
              <swiper-slide
                class="swiper-slide"
                v-for="(product, index) in catalogues"
                :key="index"
              >
                <div class="product-box">
                  <ProductBoxSlideProducts
                    @opencartmodel="showCartModal"
                    @showCompareModal="showcomparemodal"
                    @openquickview="showquickview"
                    @alertseconds="alert"
                    :product="product"
                    :index="index"
                  />
                </div>
              </swiper-slide>
            </swiper>
            <!-- <swiper
              :loop="true"
              :breakpoints="swiperOption.breakpoints"
              :slidesPerView="5"
              :spaceBetween="20"
              class="swiper-wrapper"
            >
              <swiper-slide
                class="swiper-slide"
                v-for="(product, index) in products"
                :key="index"
              >
                <div class="product-box">
                  <ProductBoxProductBox7
                    @opencartmodel="showCartModal"
                    @showCompareModal="showcomparemodal"
                    @openquickview="showquickview"
                    @alertseconds="alert"
                    :product="product"
                    :index="index"
                  />
                </div>
              </swiper-slide>
            </swiper> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
// import productBoxSlider from "../../product-box/product-box-slider";
export default {
  props: ["products"],
  components: {
    // productBoxSlider,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      title: "top collection",
      showCart: false,
      showquickviewmodel: false,
      showcomapreModal: false,
      quickviewproduct: {},
      comapreproduct: {},
      cartproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      catalogues: [],
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.",
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 20,
        freeMode: false,
        breakpoints: {
          1199: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          991: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          420: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          0: {
            slidesPerView: 1,
          },
        },
      },
    };
  },
  async mounted() {
    // get products
    this.catalogues = await this.getProducts();
  },
  methods: {
    async getProducts() {
      const getProducts = await this.$getProducts();
      return getProducts?.result ?? [];
    },
    alert(item) {
      this.dismissCountDown = item;
    },
    showCartModal(item, productData) {
      this.showCart = item;
      this.cartproduct = productData;
      this.$emit("openCart", this.showCart, this.cartproduct);
    },
    showquickview(item, productData) {
      this.showquickviewmodel = item;
      this.quickviewproduct = productData;
      this.$emit(
        "openQuickview",
        this.showquickviewmodel,
        this.quickviewproduct
      );
    },
    showcomparemodal(item, productData) {
      this.showcomapreModal = item;
      this.comapreproduct = productData;
      this.$emit("openCompare", this.showcomapreModal, this.comapreproduct);
    },
  },
};
</script>
