<template>
    <div class="img-wrapper">
      <div class="lable-block">
        <span class="lable3" v-if="product.new">new</span>
        <span class="lable4" v-if="product.sale">on sale</span>
      </div>
      <div class="front">
        <nuxt-link :to="{ path: '/product/sidebar/' + product.id }">
          <!-- src="/images/6.jpg" -->
          <img
            :src="image ?? '/images/6.jpg'"
            :id="product?.id"
            class="img-fluid bg-img"
            :alt="product.name"
            :key="index"
          />
        </nuxt-link>
      </div>
    
      <div class="cart-info cart-wrap">
          <button
            data-toggle="modal"
            data-target="#modal-cart"
            title="Add to cart"
            @click="addToCart(product)"
           
            variant="primary"
          >
            <i class="ti-shopping-cart"></i>
          </button>
        <a href="javascript:void(0)" title="Wishlist">
          <i class="ti-heart" aria-hidden="true" @click="addToWishlist(product)"></i>
        </a>
        <a href="javascript:void(0)" title="Quick View" @click="showQuickView(product)" variant="primary">
          <i class="ti-search" aria-hidden="true"></i>
        </a>
        <a href="javascript:void(0)" title="Comapre" @click.prevent="addToCompare(product)"  variant="primary">
          <i class="ti-reload" aria-hidden="true"></i>
        </a>
      </div>
    </div>
    <div class="product-detail">
      <div class="rating">
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
      </div>
      <nuxt-link :to="{ path: '/product/sidebar/'+product.id}">
        <h6>{{ product.name }}</h6>
      </nuxt-link>
      <p>{{ product.description }}</p>

      <h4 v-if="getProductPrice">£ {{ getProductPrice }}</h4>

      <h4 v-else>{{curr.symbol}}{{ (product.price * curr.curr).toFixed(2) }}</h4>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useProductStore } from '~~/store/products';
import { useCartStore } from '~~/store/cart';
import pkg from "lodash";
const { find } = pkg;

export default {
  props: ['product', 'index'],
  data() {
    return {
      symbol: '$',
      imageSrc: '',
      quickViewProduct: {},
      compareProduct: {},
      cartProduct: {},
      showQuickView: false,
      showCompareModal: false,
      cartval: false,
      variants: {
        productId: '',
        image: ''
      },
      dismissSecs: 5,
      dismissCountDown: 0,
      image: this.product?.displayUrl?.replace(/&amp;/g, '&')
    }
  },
  emits:['opencartmodel','openquickview','alertseconds','showCompareModal'],
  computed: {
    ...mapState(useProductStore,{
      productslist: 'productslist'
    }),
    curr(){  
      return useProductStore().changeCurrency
    },
    getProductPrice() {
      const exists = find(this.product.prices, { isDefault: true });
      return exists?.price ?? '';
    },
  },
  methods: {
    getImgUrl(path) {
    
      return ('/images/'+ path)
    },
    addToCart: function (product) {
      this.cartval = true;
      this.cartProduct = product;
      this.$emit("opencartmodel", this.cartval, this.cartProduct);
      product.price = product?.prices[0]?.price;
      product.priceBookEntryId = product?.prices[0]?.priceBookEntryId;
      product.priceBookId = product?.prices[0]?.priceBookId;
      product.priceModelId = product?.prices[0]?.pricingModel?.id;
      product.quantity = 1;
      product.periodBoundary =
        product?.prices[0]?.pricingModel?.frequency ?? "OneTime";
      useCartStore().addToCart(product);
    },
    addToWishlist: function (product) {
      this.dismissCountDown = this.dismissSecs;
      useNuxtApp().$showToast({
        msg: "Product Is successfully added to your wishlist.",
        type: "info",
      });
      useProductStore().addToWishlist(product);
    },
    showQuickView: function (productData) {
      this.showQuickView = true
      this.quickViewProduct = productData
      this.$emit('openquickview', this.showQuickView, this.quickViewProduct)
    },
    addToCompare: function (product) {
      this.showCompareModal = true
      this.compareProduct = product
      this.$emit('showCompareModal', this.showCompareModal, this.compareProduct)
    
      useProductStore().addToCompare(product)
    },
    Color(variants) {
      const uniqColor = []
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqColor.indexOf(variants[i].color) === -1) {
          uniqColor.push(variants[i].color)
        }
      }
      return uniqColor
    },
    productColorchange(color, product) {
      product.variants.map((item) => {
        if (item.color === color) {
          product.images.map((img) => {
            if (img.image_id === item.image_id) {
              this.imageSrc = img.src
            }
          })
        }
      })
    },
    productVariantChange(imgsrc) {
      this.imageSrc = imgsrc
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
      this.$emit('alertseconds', this.dismissCountDown)
    },
    discountedPrice(product) {
      const price = (product.price - (product.price * product.discount / 100))* this.curr.curr
      return price
      
    }
  },
 
}
</script>
