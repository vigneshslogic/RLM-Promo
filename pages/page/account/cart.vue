<template>
  <div>
  <Header/>
    <WidgetsBreadcrumbs title="Cart" />
    <section class="cart-section section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <table class="table cart-table table-responsive-xs" v-if="cart.length">
              <thead>
                <tr class="table-head">
                  <th scope="col">image</th>
                  <th scope="col">product name</th>
                  <th scope="col">Frequency</th>
                  <th scope="col">price</th>
                  <th scope="col">quantity</th>
                  <th scope="col">action</th>
                  <th scope="col">total</th>
                </tr>
              </thead>
              <tbody v-for="(item, index) in cart" :key="index">
                <tr>
                  <td>
                    <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">
                    <img :src="getImage(item?.image)" alt />
                    </nuxt-link>
                  </td>
                  <td>
                    <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">{{ item.name }}</nuxt-link>
                  </td>
                  <td>
                    {{ item?.periodBoundary }}
                  </td>
                  <td>
                    <h2>£{{ item.price }}</h2>
                  </td>
                  <td>
                    <div class="qty-box">
                      <div class="input-group">
                        <span class="input-group-prepend">
                          <button type="button" class="btn quantity-left-minus" data-type="minus" data-field
                            @click="decrement(item)">
                            <i class="ti-angle-left"></i>
                          </button>
                        </span>
                        <input type="text" name="quantity" class="form-control input-number"
                          :disabled="item.quantity > item.stock" v-model="item.quantity" />
                        <span class="input-group-prepend">
                          <button type="button" class="btn quantity-right-plus" data-type="plus" data-field
                            @click="increment(item)">
                            <i class="ti-angle-right"></i>
                          </button>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a class="icon" href="#" @click.prevent="removeCartItem(item)">
                      <i class="ti-close"></i>
                    </a>
                  </td>
                  <td>
                    <h2 class="td-color">
                      £ {{ (item.price * curr.curr) * item.quantity }}</h2>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="table cart-table table-responsive-md" v-if="cart.length">
              <tfoot>
                <tr>
                  <td>total price :</td>
                  <td>
                    <h2>£{{ cartTotal }}</h2>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div class="col-sm-12 empty-cart-cls text-center" v-if="!cart.length">
              <img src='/images/icon-empty-cart.png' class="img-fluid" alt="empty cart" />
              <h3 class="mt-3">
                <strong>Your Cart is Empty</strong>
              </h3>
              <h4 class="mb-3">Add something to make me happy :)</h4>
              <div class="col-12">
                <nuxt-link :to="{ path: '/' }" class="btn btn-solid">continue shopping</nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="row cart-buttons" v-if="cart.length">
          <div class="col-6">
            <nuxt-link :to="{ path: '/' }" :class="'btn btn-solid'">continue shopping</nuxt-link>
          </div>
          <div class="col-6">
            <button
              v-if="useCookie('userLogin').value"
              class="btn btn-solid"
              title="Get Quote"
              @click="handleGetQuote"
            > Get Quote
            </button>
            
            <nuxt-link :to="{ path: '/page/account/checkout' }" :class="'btn btn-solid ms-2'">check out</nuxt-link>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
  <CartModalQuoteModalPopup v-if="showQuoteModal" :openQuote="showQuoteModal" @closeQuote="closeQuoteModal" />
</template>

<script>
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'
export default {
  data() {
    return {
      counter: 1,
      // cartdata:useLocalStorage('product')
      // cart:[]
      showQuoteModal: false,
    }
  },
  computed: {
    cart() {
      return useCartStore().cartItems
    },
    cartTotal() {
      return useCartStore().cartTotalAmount
    },
    curr() {
      return useProductStore().changeCurrency
    }
  },
  methods: {
    getImage(img) {
      return img?.replace(/&amp;/g, '&') ?? '/images/6.jpg'
    },
    removeCartItem(product) {
      useCartStore().removeCartItem(product)
    },
    increment(product, qty = 1) {

      useCartStore().updateCartQuantity({
        product: product,
        qty: qty
      })
    },
    decrement(product, qty = -1) {
      useCartStore().updateCartQuantity({
        product: product,
        qty: qty
      })
    },
    handleGetQuote() {
      this.showQuoteModal = true;
    },
    closeQuoteModal() {
      this.showQuoteModal = false;
    }
  },

  mounted() {
    this.cartItem = JSON.parse(localStorage.getItem('product'))
  }
}
</script>
