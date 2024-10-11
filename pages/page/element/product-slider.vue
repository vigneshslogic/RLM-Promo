<template>
<div>
    <WidgetsBreadcrumbs title="Slider Element" />
    <section class="section-b-space ratio_asos">
        <div class="container">
            <div class="row">
                <div class="col">
                    <swiper  :slidesPerView="4" :spaceBetween="20" :breakpoints="swiperOption.breakpoints" class="swiper-wrapper">
                        <swiper-slide class="swiper-slide" v-for="(product,index) in productsList" :key="index">
                            <div class="product-box">
                                <ProductBoxProductList @openCartModel="showCart" @showCompareModal="showCoampre" @openQuickView="showQuickView"   @alertSeconds="alert" :product="product" :index="index" />
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
</section>

<WidgetsQuickView :openModal="showQuickViewModel" :productData="quickViewProduct" @closeView="closeViewModal" />
<WidgetsComparePopup :openCompare="showCompareModal" :productData="compareProduct" @closeCompare="closeCompareModal" />
<cart-modal-popup :openCart="showCartModal" :productData="cartProduct" @closeCart="closeCartModal" :products="productsList" />
</div>
</template>

<script>
import {
    mapState
} from 'pinia'
import { useProductStore } from '~~/store/products'
import {
    Swiper,
    SwiperSlide
} from "swiper/vue";
import 'swiper/css';
export default {
    props: ['products'],
    components: {
      Swiper, SwiperSlide,
    },
    data() {
        return {
            title: 'top collection',
            subtitle: 'special offer',
            showQuickViewModel: false,
            showCompareModal: false,
            showCartModal: false,
            quickViewProduct: {},
            compareProduct: {},
            cartProduct: {},
            dismissSecs: 5,
            dismissCountDown: 0,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.',
            swiperOption: {
             
                breakpoints: {
                    1199: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    991: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    420: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    }
                }
            }
        }
    },
    computed: {
        ...mapState(useProductStore,{
            productsList: 'productsList'
        })
    },
    methods: {
        alert(item) {
            this.dismissCountDown = item
        },
        showQuickView(item, productData) {
            this.showQuickViewModel = item
            this.quickViewProduct = productData
        },
        showCoampre(item, productData) {
            this.showCompareModal = item
            this.compareProduct = productData
        },
        closeCompareModal(item) {
            this.showCompareModal = item
        },
        showCart(item, productData) {
            this.showCartModal = item
            this.cartProduct = productData
        },
        closeCartModal(item) {
            this.showCartModal = item
        },
        closeViewModal(item){
        this.showQuickViewModel= item
      }
    }
}
</script>
