<template>
  <div>
    <section
      class="full-banner parallax small-slider tools-parallax-product"
      v-bind:style="{ 'background-image': `url(${imagepath})` }"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-12">
            <div class="tools-description">
              <div>
                <h3>{{ title }}</h3>
                <div class="tools-form">
                  <div class="search-box">
                    <select name="engine" class="form-control" @change="getCategories">
                      <option value>Select catalog</option>
                      <option 
                        v-for="catalog in catalogs?.catalog"
                        :value="catalog.id"
                        v-html="catalog?.name"
                      />
                    </select>
                  </div>
                  <div class="search-box">
                    <select name="engine" class="form-control" @change="getSubCategories">
                      <option value>Select category</option>
                      <option 
                        v-for="cat in categories"
                        :value="cat.Id"
                        v-html="cat?.Name"
                      />
                    </select>
                  </div>
                  <div class="search-box">
                    <select name="year" class="form-control">
                      <option value>Select sub-category</option>
                      <option 
                        v-for="subCat in subCategories"
                        :value="subCat.id"
                        v-html="subCat.Name"
                      />
                    </select>
                  </div>
                  <div class="search-button">
                    <a href="#" class="btn btn-solid btn-find">find my part</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-12 tools-grey ratio_square">
            <swiper
              :loop="true"
              :breakpoints="swiperOption?.breakpoints"
              :slidesPerView="4"
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
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { useProductStore } from "~/store/products";
import "swiper/css";

export default {
  props: ["catalogues"],
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      // imagepath: '/images/parallax/21.jpg',
      title: "Select you Categories",
      showCart: false,
      showQuickViewModel: false,
      showCompareModal: false,
      quickViewProduct: {},
      compareProduct: {},
      cartProduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 20,
        freeMode: true,
        breakpoints: {
          1200: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          767: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          0: {
            slidesPerView: 2,
          },
        },
      },
      catalogs: [],
      categories: [],
      subCategories: [],
    };
  },
  async mounted() {
    this.catalogs = await useProductStore().loadCategories();
  },
  methods: {
    getCategories(e) {
      this.categories = [];
      this.subCategories = [];
      this.categories = this.catalogs?.categories?.filter((cat) => (e.target.value === cat?.Catalog?.Id));
    },
    getSubCategories(e) {
      this.subCategories = [];
      this.subCategories = this.categories?.find((cat) => (e.target.value === cat.Id))?.ChildCategories?.records ?? [];
      // this.categories = this.catalogs?.categories?.filter((cat) => (e.target.value === cat?.Catalog?.Name));
    },
    alert(item) {
      this.dismissCountDown = item;
    },
    showCartModal(item, productData) {
      this.showCart = item;
      this.cartProduct = productData;
      this.$emit("openCart", this.showCart, this.cartProduct);
    },
    showquickview(item, productData) {
      this.showQuickViewModel = item;
      this.quickViewProduct = productData;
      this.$emit(
        "openQuickview",
        this.showQuickViewModel,
        this.quickViewProduct
      );
    },
    showcomparemodal(item, productData) {
      this.showCompareModal = item;
      this.compareProduct = productData;
      this.$emit("openCompare", this.showCompareModal, this.compareProduct);
    },
  },
};
</script>
