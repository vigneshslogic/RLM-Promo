<template>
    <Header/>
  <div>
    <WidgetsBreadcrumbs title="wishlist" />
    <section class="wishlist-section section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table cart-table table-responsive-xs" v-if="wishlist.length">
              <thead>
                <tr class="table-head">
                  <th scope="col">image</th>
                  <th scope="col">product name</th>
                  <th scope="col">price</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody v-for="(item, index) in wishlist" :key="index">
                <tr>
                  <td>
                    <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">
                      <img :src="getImage(item?.image)" alt />
                    </nuxt-link>
                  </td>
                  <td>
                    <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">{{ item.name }}</nuxt-link>
                    <div class="mobile-cart-content row">
                      <div class="col-xs-3">
                        <div class="qty-box">
                          <div class="input-group">
                            <span class="input-group-prepend">
                              <button type="button" class="btn quantity-left-minus" data-type="minus" data-field
                                @click="decrement()">
                                <i class="ti-angle-left"></i>
                              </button>
                            </span>
                            <input type="text" name="quantity" class="form-control input-number" v-model="counter" />
                            <span class="input-group-prepend">
                              <button type="button" class="btn quantity-right-plus" data-type="plus" data-field
                                @click="increment()">
                                <i class="ti-angle-right"></i>
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <h2 class="td-color">£{{ Number(item?.price?.toFixed(2)) ?? 0 }}</h2>
                      </div>
                      <div class="col-xs-3">
                        <h2 class="td-color">
                          <a href="#" class="icon">
                            <i class="ti-close"></i>
                          </a>
                        </h2>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h2>£{{ Number(item?.price?.toFixed(2)) ?? 0 }}</h2>
                  </td>
                  <td>
                    <a class="icon me-3" href="#" @click.prevent="removeWishlistItem(item)">
                      <i class="ti-close"></i>
                    </a>
                    <a href="#" class="cart">
                      <i class="ti-shopping-cart" @click="addToCart(item)"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
        <div class="row wishlist-buttons" v-if="wishlist?.length">
          <div class="col-12">
            <nuxt-link :to="{ path: '/' }" :class="'btn btn-solid'">continue shopping</nuxt-link>
          </div>
        </div>
        <div class="col-sm-12 empty-cart-cls text-center" v-if="!wishlist?.length">
          <img src='/images/empty-wishlist.png' class="img-fluid" alt="empty cart" />
          <h3 class="mt-3 empty-text">
            <strong>Your Wishlist is Empty</strong>
          </h3>
          <div class="col-12">
            <nuxt-link :to="{ path: '/' }" class="btn btn-solid">continue shopping</nuxt-link>
          </div>
        </div>
      </div>
    </section>
  
  </div>
  <Footer />
</template>
<script>
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'
export default {
  data(){
    return{
      whishItem:[]
    }
  },
  computed: {

    wishlist() {
      if(!useProductStore().wishlistItems?.length)
      {
        this.whishItem.forEach(item=>{
    useProductStore().addToWishlist(item)  
  })
 
  return useProductStore().wishlistItems
      }
      else{
        return useProductStore().wishlistItems
      }
    },
    curr() {
      return useProductStore().changeCurrency
    }
  },
  methods: {
    getImage(img) {
      return img?.replace(/&amp;/g, '&') ?? '/images/6.jpg'
    },
    removeWishlistItem: function (product) {
      useProductStore().removeWishlistItem(product)
    },
    // addToCart: function (product) {
    //   this.$store.dispatch('cart/addToCart', product)
    // }
  },
  setup(){
    const addToCart = (product) => {
      product.displayUrl = product?.image;
      product.prices = [{ 
        price: product?.price,
        priceBookEntryId: product?.priceBookEntryId,
        priceBookId: product?.priceBookId,
        pricingModel: {
          id: product?.priceModelId,
          frequency: product?.periodBoundary,
        }
      }];
      useCartStore().addToCart(product)
    }
    return {
      addToCart
    }
  },
  mounted(){
    this.whishItem = JSON.parse(localStorage.getItem('whish'))
   
  }
}
</script>
