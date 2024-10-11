<template>
<Header/>
  <div>
    <WidgetsBreadcrumbs title="collection"/>
    <section class="section-b-space">
      <div class="collection-wrapper">
        <div class="container">
          <div class="row">
            <div class="collection-content col">
              <div class="page-main-content">
                <div class="top-banner-wrapper">
                  <a href="#">
                    <img src='/images/mega-menu/2.jpg' class="img-fluid bg-img" alt />
                  </a>
                  <div class="top-banner-content small-section pb-0">
                    <h4>fashion</h4>
                    <h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book. It has survived not only five centuries, but
                      also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                      the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                      with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                  </div>
                </div>
                <div class="collection-product-wrapper">
                  <div class="section-t-space portfolio-section metro-section port-col">
                    <MasonryWall :items="products" :padding="16" :column-width="300" :gap="15" class="row">
                      <template #default="{ item , index }" >
                        <div class="col isotopeSelector item m-0">
                          <div class="product-box">
                            <div class="img-wrapper">
                              <div class="front">
                                <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">
                                  <img :src="getImgUrl(item.images[0].src)" :id="item.id" class="img-fluid bg-img"
                                    :alt="item.title" :key="index" />
                                </nuxt-link>
                              </div>
                              <div class="cart-info cart-wrap">
                                <button title="Add to cart" @click="addToCart(item)" variant="primary">
                                  <i class="ti-shopping-cart"></i>
                                </button>
                                <nuxt-link :to="{ path: '/page/account/wishlist' }">
                                  <i class="ti-heart" aria-hidden="true" @click="addToWishlist(item)"></i>
                                </nuxt-link>
                                <a href="javascript:void(0)" title="Quick View" @click="showQuickView(item)"
                                  variant="primary">
                                  <i class="ti-search" aria-hidden="true"></i>
                                </a>
                                <a href="javascript:void(0)" title="Comapre" @click="showCoampre(item)"
                                  variant="primary">
                                  <i class="ti-reload" aria-hidden="true"></i>
                                </a>
                              </div>
                            </div>
                            <div class="product-detail">
                              <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">
                                <h6>{{ item.title }}</h6>
                              </nuxt-link>
                              <h4>{{ currency.symbol }}{{ item.price * currency.curr }}</h4>
                            </div>
                          </div>
                        </div>
                      </template>
                    </MasonryWall>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <WidgetsQuickView :openModal="showQuickViewModel" :productData="quickViewProduct" @closeView="closeViewModal" />
    <WidgetsComparePopup :openCompare="showCompareModal" :productData="compareProduct" @closeCompare="closeCompareModal" />
    <cart-modal-popup :openCart="showCartModal" :productData="cartProduct" @closeCart="closeCartModal" />

  </div>
  <Footer />
</template>
<script setup>
import MasonryWall from '@yeger/vue-masonry-wall'
import { useProductStore } from '~~/store/products';
import { useCartStore } from '~~/store/cart';
import { storeToRefs } from 'pinia'

let { productsList, currency, changeCurrency } = storeToRefs(useProductStore())
let products = [],

  cartVal = false,
  showQuickViewModel = ref(false),
  showCompareModal = ref(false),
  showCartModal = ref(false),
  quickViewProduct = {},
  compareProduct = {},
  cartProduct = {}
productsArray();
function getImgUrl(path) {
  return ('/images/' + path)
};
function productsArray() {
  productsList.value.map((item) => {
    if (item.type === 'metro') {
      products.push(item)
    }
  })
}

function showQuickView(productData) {
  showQuickViewModel.value = true
  quickViewProduct = productData
}
function closeViewModal() {
  showQuickViewModel.value = false
}
function showCoampre(productData) {
  showCompareModal.value = true
  compareProduct = productData
}

function closeCompareModal(item) {
  showCompareModal.value = false
}

function addToWishlist(product) {
  useProductStore().addToWishlist(product)
}
function closeCartModal(item){
  
}
function addToCart(product) {


  useCartStore().addToCart(product)
}



</script>
