<template>
  <section class="section-b-space">
    <div class="container">
      <div class="checkout-page">
        <div class="checkout-form">
          <!-- <form> -->
          <div class="row">
            <div class="col-lg-6 col-sm-12">
              <div class="checkout-title">
                <h3>Billing Details</h3>
              </div>
              <div class="row check-out">
                <div class="form-group col-md-6 col-sm-6">
                  <div class="field-label">First Name</div>
                  <input type="text" v-model="user.firstName.value" name="First name" />
                  <span class="validate-error" v-if="user.firstName.value.length === 0">
                    {{ user.firstName.errormsg }}
                  </span>
                </div>
                <div class="form-group col-md-6 col-sm-6">
                  <div class="field-label">Last Name</div>
                  <input type="text" v-model="user.lastName.value" name="Last name" />
                  <span class="validate-error" v-if="user.lastName.value.length === 0">{{ user.lastName.errormsg
                    }}</span>
                </div>
                <div class="form-group col-md-6 col-sm-6">
                  <div class="field-label">Phone</div>
                  <input type="tel" v-model="user.phone.value" name="Phone" />
                  <span class="validate-error" v-if="user.phone.value.length === 0">{{ user.phone.errormsg }}</span>
                </div>
                <div class="form-group col-md-6 col-sm-6">
                  <div class="field-label">Email Address</div>
                  <input type="email" v-model="user.email.value" name="Email Address" />
                  <span class="validate-error" v-if="!user.email.value || !validEmail(user.email.value)">{{
                    user.email.errormsg }}</span>
                </div>
                <div class="form-group col-md-12 col-sm-12">
                  <div class="field-label">Address</div>
                  <input type="text" v-model="user.address.value" name="Address" />
                  <span class="validate-error" v-if="user.address.value.length === 0">{{ user.address.errormsg }}</span>
                </div>
                <div class="form-group col-md-12 col-sm-12">
                  <div class="field-label">Town/City</div>
                  <input type="text" v-model="user.city.value" name="City" />
                  <span class="validate-error" v-if="user.city.value.length === 0">{{ user.city.errormsg }}</span>
                </div>
                <div class="form-group col-md-12 col-sm-6">
                  <div class="field-label">State / County</div>
                  <input type="text" v-model="user.state.value" name="State" />
                  <span class="validate-error" v-if="user.state.value.length === 0">{{ user.state.errormsg }}</span>
                </div>
                <div class="form-group col-md-12 col-sm-6">
                  <div class="field-label">Postal Code</div>
                  <input type="text" v-model="user.pincode.value" name="Postal Code" />
                  <span class="validate-error" v-if="user.pincode.value.length === 0">{{ user.pincode.errormsg }}</span>
                </div>
                <div v-if="!useCookie('userLogin').value" class="form-group col-lg-12 col-md-12 col-sm-12">
                  <nuxt-link :to="{ path: '/page/account/register' }">Create an Account?</nuxt-link>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-sm-12">
              <div class="checkout-details">
                <div class="order-box">
                  <div class="title-box">
                    <div>
                      Product
                      <span>Total</span>
                    </div>
                  </div>
                  <ul class="qty" v-if="cart.length">
                    <li v-for="(item, index) in cart" :key="index">
                      {{ item.name || uppercase }} X {{ item.quantity }} ( {{ getFrequency(item?.periodBoundary) }} )
                      <span>£ {{ item.price * item.quantity }}</span>
                    </li>
                  </ul>
                  <ul class="sub-total">
                    <li>
                      Subtotal
                      <span class="count">£ {{ cartTotal }}</span>
                    </li>
                    <li class="promotion-code">
                      <div class="promo-row">
                        <span class="promo-label">Promotion Code</span>
                        <div class="promo-input">
                          <input
                            type="text"
                            v-model="promoCode"
                            maxlength="12"
                            placeholder="Enter Promo code"
                            :disabled="couponApplied"
                          />
                          <button
                            v-if="!couponApplied"
                            @click="applyCoupon"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <div
                        v-if="couponApplied"
                        class="coupon-applied"
                      >
                        <span>Coupon applied (10% off)</span>
                        <span class="count">-£{{ discountAmount }}</span>
                        <button @click="removeCoupon">✕</button>
                      </div>
                    </li>
                    <li>
                      Shipping
                      <div class="shipping">
                        <div class="shopping-option">
                          <input type="checkbox" name="free-shipping" id="free-shipping" />
                          <label for="free-shipping">Free Shipping</label>
                        </div>
                        <div class="shopping-option">
                          <input type="checkbox" name="local-pickup" id="local-pickup" />
                          <label for="local-pickup">Local Pickup</label>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul class="sub-total">
                    <li>
                      Total
                      <span class="count">£ {{ discountedTotal  }}</span>
                    </li>
                  </ul>
                </div>
                <div class="payment-box">
                  <div class="row check-out">

                    <!-- SAVED PAYMENTS (if any) -->
                    <div v-if="payments.length && !showNewCard" class="form-group col-md-12 col-sm-12">
                      <div class="field-label">Saved Payment Methods</div>
                      <div v-for="p in payments" :key="p.Id"
                        class="border rounded p-3 mb-2 flex items-center cursor-pointer"
                        :class="{ 'border-primary': selectedPaymentId === p.Id }" @click="selectedPaymentId = p.Id">
                        <input type="radio" :value="p.Id" v-model="selectedPaymentId" class="mr-4" />
                        <img :src="getCardImage(p.CardType)" alt="card" style="height:30px" class="mr-3" />
                        <span class="font-medium">
                          {{ p.CardType }} ******* {{ p.CardLastFour }}
                          (Exp {{ p.ExpiryMonth }}/{{ p.ExpiryYear }})
                        </span>
                      </div>

                      <!-- Add new card toggle -->
                      <div class="border-2 border-dashed rounded p-3 text-center cursor-pointer mt-2" @click="() => {
                        showNewCard = true;
                        selectedPaymentId = null;
                        user.cardNumber.value = '';
                        user.expiryDate.value = '';
                        user.securityCode.value = '';
                      }">
                        + Add New Card
                      </div>
                    </div>

                    <!-- NEW PAYMENT FORM -->
                    <div v-if="!payments.length || showNewCard" class="form-group col-md-12 col-sm-12">
                      <!-- Back to saved cards -->
                      <div v-if="payments.length" class="mb-3 text-blue-600 cursor-pointer flex items-center"
                        @click="resetToSavedCards">
                        <i class="fa fa-arrow-left mr-2"></i>
                        Back to Saved Cards
                      </div>
                      <div class="field-label">Card Number</div>
                      <input type="text" v-model="user.cardNumber.value" name="card_number" maxlength="19"
                        placeholder="XXXX XXXX XXXX XXXX" />
                      <span class="validate-error" v-if="user.cardNumber.errormsg">{{ user.cardNumber.errormsg }}</span>

                      <div class="row mt-2">
                        <div class="form-group col-md-6 col-sm-6">
                          <div class="field-label">Expiry Date</div>
                          <input type="text" v-model="user.expiryDate.value" name="expiry_date" placeholder="MM/YY"
                            maxlength="5" pattern="^(0[1-9]|1[0-2])\/\d{2}$" @input="formatExpiryDate" />
                          <span class="validate-error" v-if="user.expiryDate.errormsg">
                            {{ user.expiryDate.errormsg }}
                          </span>
                        </div>
                        <div class="form-group col-md-6 col-sm-6">
                          <div class="field-label">Security Code</div>
                          <input type="password" v-model="user.securityCode.value" name="security_code" maxlength="4"
                            placeholder="***" />
                          <span class="validate-error" v-if="user.securityCode.errormsg">{{ user.securityCode.errormsg
                            }}</span>
                        </div>
                      </div>

                      <div class="form-group col-md-12 col-sm-12">
                        <div class="form-check">
                          <input type="checkbox" id="save-payment" v-model="saveForFuture"
                            class="form-check-input" />
                          <label for="save-payment" class="form-check-label">
                            Save this payment method for future use
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="form-group col-md-12 col-sm-12">
                      <div class="field-label">Auto Renewal</div>
                      <div class="form-check">
                        <input type="checkbox" id="auto-renewal" v-model="user.autoRenewal.value"
                          class="form-check-input" />
                        <label for="auto-renewal" class="form-check-label">
                          Enable automatic renewal for this subscription
                        </label>
                      </div>
                    </div>

                    <!-- Place Order button -->
                    <div class="form-group col-md-12 col-sm-12">
                      <button v-if="useCookie('userLogin').value" class="btn btn-solid" title="Get Quote"
                        @click="handlePlaceOrder">
                        <div v-if="loading" class="spinner-border text-light" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                        <span v-else>Place Order</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <!-- </form> -->
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { useCartStore } from "~~/store/cart";
import { useAuthStore } from "~~/store/auth";
import { useProductStore } from "~~/store/products";
export default {
  props: ["userInfo"],
  computed: {
    cart() {
      return useCartStore().cartItems;
    },
    cartTotal() {
      return useCartStore().cartTotalAmount;
    },
    curr() {
      return useProductStore().changeCurrency;
    },
    discountedTotal() {
      if (this.couponApplied) {
        return (this.cartTotal * (1 - this.discountRate)).toFixed(2);
      }
      return this.cartTotal.toFixed(2);
    },
    discountAmount() {
      if (this.couponApplied) {
        return (this.cartTotal * this.discountRate).toFixed(2);
      }
      return 0;
    }
  },
  data() {
    return {
      errors: [],
      loading: false,
      user: {
        firstName: { value: this.userInfo?.FirstName ?? "John", errormsg: "" },
        lastName: { value: this.userInfo?.LastName ?? "Doe", errormsg: "" },
        phone: { value: this.userInfo?.Phone ?? "+442079460958", errormsg: "" },
        email: { value: this.userInfo?.Email ?? "johndoe@example.com", errormsg: "" },
        address: { value: this.userInfo?.Account?.BillingStreet ?? "123 High Street", errormsg: "" },
        city: { value: this.userInfo?.Account?.BillingCity ?? "London", errormsg: "" },
        state: { value: this.userInfo?.Account?.BillingState ?? "United Kingdom", errormsg: "" },
        pincode: { value: this.userInfo?.Account?.BillingPostalCode ?? "W1A 1AA", errormsg: "" },
        cardNumber: { value: "", errormsg: "" },
        expiryDate: { value: "", errormsg: "" },
        securityCode: { value: "", errormsg: "" },
        autoRenewal: { value: true },
      },
      isLogin: false,
      payment: false,
      environment: "sandbox",
      button_style: {
        label: "checkout",
        size: "medium", // small | medium | large | responsive
        shape: "pill", // pill | rect
        color: "blue", // gold | blue | silver | black
      },
      amtchar: "",
      payments: [],
      selectedPaymentId: null,
      saveForFuture: true,
      showNewCard: false,
      promoCode: "",
      couponApplied: false,
      discountRate: 0.1,
    };
  },

  watch: {
    cart: {
      handler(value) {
        if (value.length == 0) {
          useNuxtApp().$showToast({ msg: "Cart is Empty.", type: "error" });
          this.$router.replace("/page/account/cart");
        }
      },
      deep: true,
    },

    // When user selects a saved payment, autofill masked fields & address
    selectedPaymentId(newVal) {
      if (!newVal) return;

      const p = this.payments.find(x => x.Id === newVal);
      if (p) {
        this.user.cardNumber.value = `**** **** **** ${p.CardLastFour}`;
        const yy = p.ExpiryYear ? String(p.ExpiryYear).slice(-2) : '';
        this.user.expiryDate.value = `${String(p.ExpiryMonth).padStart(2, '0')}/${yy}`;
        this.user.securityCode.value = "";
        this.user.address.value = p.PaymentMethodStreet || this.user.address.value;
        this.user.city.value = p.PaymentMethodCity || this.user.city.value;
        this.user.state.value = p.PaymentMethodState || this.user.state.value;
        this.user.pincode.value = p.PaymentMethodPostalCode || this.user.pincode.value;

        this.user.cardNumber.errormsg = "";
        this.user.expiryDate.errormsg = "";
        this.user.securityCode.errormsg = "";
      }
    },

    "user.cardNumber.value"(val) {
      if (!val) return;
      if (!val.startsWith("****")) {
        this.selectedPaymentId = null;
      }
    }
  },

  methods: {
    async handlePlaceOrder() {
      this.loading = true;
      this.onSubmit();
      const hasSaved = this.payments.length > 0;
      const usingSaved = !!this.selectedPaymentId;
      const cardIsNew = !!this.user.cardNumber.value && !this.user.cardNumber.value.startsWith("****");

      if (hasSaved && !usingSaved && !cardIsNew) {
        useNuxtApp().$showToast({ msg: "Please select a payment method.", type: "warning" });
        this.loading = false;
        return;
      }

      this.isLogin = useCookie("userLogin").value;
      if (!this.isLogin) {
        this.$router.replace("/page/account/login");
      } else if (
        this.user.firstName.errormsg ||
        this.user.lastName.errormsg ||
        this.user.city.errormsg ||
        this.user.pincode.errormsg ||
        this.user.state.errormsg ||
        this.user.phone.errormsg ||
        this.user.email.errormsg ||
        this.user.address.errormsg ||
        this.user.cardNumber.errormsg ||
        this.user.expiryDate.errormsg ||
        this.user.securityCode.errormsg
      ) {
        this.onSubmit();
      } else if (this.isLogin) {
        this.payment = false;
        this.user.discount = this.couponApplied ? 10 : 0;
        const status = await useCartStore().generateOrder(this.user);

        try {
          if (status?.orderId) {
            localStorage.setItem('order-success', JSON.stringify(status));
            useProductStore().createOrder(status);
            const isUsingSaved = !!this.selectedPaymentId;
            const cardIsNew = !!this.user.cardNumber.value && !this.user.cardNumber.value.startsWith("****");
            if (!isUsingSaved && cardIsNew) {
              // build payload
              const parts = (this.user.expiryDate.value || "").split("/");
              const month = parts[0] ? parts[0].padStart(2, "0") : "";
              let year = parts[1] ? parts[1] : "";
              if (year && year.length === 2) year = `20${year}`;
              const { ExpiryMonth, ExpiryYear } = this.parseExpiryDate(this.user.expiryDate.value);

              const payload = {
                CardHolderName: this.user.firstName.value + " " + this.user.lastName.value,
                CardType: this.detectCardType(this.user.cardNumber.value), // e.g. Visa, Amex
                InputCardNumber: this.user.cardNumber.value,  // ⚠️ only if Salesforce allows plain number, otherwise tokenize
                ExpiryMonth,
                ExpiryYear,
                Status: "Active",
                ProcessingMode: "External",
                PaymentMethodStreet: this.user.address.value,
                PaymentMethodCity: this.user.city.value,
                PaymentMethodState: this.user.state.value,
                PaymentMethodPostalCode: this.user.pincode.value,
                PaymentMethodCountry: this.user.state.value,
              };

              try {
                await useAuthStore().createPayment(payload);
              } catch (err) {
                console.warn("createPaymentMethod failed", err);
              }
            }

            this.$router.replace("/page/order-success");
          }
        } catch (error) {
          useNuxtApp().$showToast({ msg: error?.message?.replace(/&#39;/g, "'"), type: "error" })
        }
      }
      this.loading = false;
    },

    onSubmit() {
      if (
        this.user.firstName.value.length <= 1 ||
        this.user.firstName.value.length > 10
      ) {
        this.user.firstName.errormsg = "empty not allowed";
      } else {
        this.user.firstName.errormsg = "";
      }

      if (
        this.user.lastName.value.length <= 1
      ) {
        this.user.lastName.errormsg = "empty not allowed";
      } else {
        this.user.lastName.errormsg = "";
      }

      if (this.user.city.value.length < 3) {
        this.user.city.errormsg = "empty not allowed";
      } else {
        this.user.city.errormsg = "";
      }
      if (this.user.pincode.value.length < 4) {
        this.user.pincode.errormsg = "empty not allowed";
      } else {
        this.user.pincode.errormsg = "";
      }
      if (!this.user.state.value) {
        this.user.state.errormsg = "empty not allowed";
      } else {
        this.user.state.errormsg = "";
      }
      if (!this.user.phone.value) {
        this.user.phone.errormsg = "empty not allowed";
      } else {
        this.user.phone.errormsg = "";
      }
      if (!this.user.address.value) {
        this.user.address.errormsg = "empty not allowed";
      } else {
        this.user.address.errormsg = "";
      }
      if (!this.user.cardNumber.value) {
        this.user.cardNumber.errormsg = "empty not allowed";
      } else {
        this.user.cardNumber.errormsg = "";
      }
      if (!this.user.expiryDate.value) {
        this.user.expiryDate.errormsg = "empty not allowed";
      } else {
        this.user.expiryDate.errormsg = "";
      }
      if (!this.user.securityCode.value) {
        this.user.securityCode.errormsg = "empty not allowed";
      } else {
        this.user.securityCode.errormsg = "";
      }
      if (!this.user.email.value) {
        this.user.email.errormsg = "empty not allowed";
      } else if (!this.validEmail(this.user.email.value)) {
        this.user.email.errormsg = "Valid email required.";
      } else {
        this.user.email.errormsg = "";
      }
      // If using saved payment, skip card validation
      const usingSaved = !!this.selectedPaymentId;
      if (!usingSaved) {
        if (!this.user.cardNumber.value) {
          this.user.cardNumber.errormsg = "empty not allowed";
        } else {
          this.user.cardNumber.errormsg = "";
        }

        if (!this.user.expiryDate.value) {
          this.user.expiryDate.errormsg = "empty not allowed";
        } else {
          this.user.expiryDate.errormsg = "";
        }

        if (!this.user.securityCode.value) {
          this.user.securityCode.errormsg = "empty not allowed";
        } else {
          this.user.securityCode.errormsg = "";
        }
      } else {
        this.user.cardNumber.errormsg = "";
        this.user.expiryDate.errormsg = "";
        this.user.securityCode.errormsg = "";
      }
    },

    validEmail: function (email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    formatExpiryDate(e) {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length >= 3) {
        val = val.slice(0, 2) + "/" + val.slice(2, 4);
      }
      e.target.value = val;
      this.user.expiryDate.value = val;
    },

    parseExpiryDate(input) {
      if (!input) throw new Error("Expiry date is required");

      const raw = input.replace(/\s+/g, "");
      let monthRaw, yearRaw;

      if (raw.includes("/")) {
        [monthRaw, yearRaw] = raw.split("/");
      } else if (raw.length === 4) {
        monthRaw = raw.slice(0, 2);
        yearRaw = raw.slice(2);
      } else if (raw.length === 6) {
        monthRaw = raw.slice(0, 2);
        yearRaw = raw.slice(2);
      } else {
        monthRaw = raw.slice(0, 2);
        yearRaw = raw.slice(2);
      }

      const ExpiryMonth = monthRaw.padStart(2, "0");

      let ExpiryYear;
      if (yearRaw.length === 2) {
        ExpiryYear = "20" + yearRaw;
      } else if (yearRaw.length === 4) {
        ExpiryYear = yearRaw;
      } else {
        ExpiryYear = "26";
      }

      return { ExpiryMonth, ExpiryYear };
    },


    getFrequency(period) {
      switch (period?.toLowerCase()) {
        case 'months':
          return 'Monthly';

        case 'annual':
        case 'annually':
        case 'yearly':
          return 'Annually';

        default:
          return 'One Time';
      }
    },

    getItemTotal(item) {
      if (item?.periodBoundary?.toLowerCase() === 'months') {
        return (item.price * 12 * item.quantity).toFixed(2);
      }
      return (item.price * item.quantity).toFixed(2);
    },

    detectCardType(number) {
      const re = {
        visa: /^4[0-9]{6,}$/,
        mastercard: /^5[1-5][0-9]{5,}$/,
        amex: /^3[47][0-9]{5,}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
      };

      if (re.visa.test(number)) return "Visa";
      if (re.mastercard.test(number)) return "Master Card";
      if (re.amex.test(number)) return "American Express";
      if (re.discover.test(number)) return "Discover";
      return "Maestro";
    },

    getCardImage(cardType) {
      if (!cardType) return "/images/icon/default.png";
      const t = cardType.toLowerCase();
      if (t.includes("visa")) return "/images/icon/visa.png";
      if (t.includes("master")) return "/images/icon/mastercard.png";
      if (t.includes("american")) return "/images/icon/american-express.png";
      return "/images/icon/discover.png";
    },

    resetToSavedCards() {
      this.showNewCard = false;
      this.selectedPaymentId = null;
      this.user.cardNumber.value = "";
      this.user.expiryDate.value = "";
      this.user.securityCode.value = "";
    },

    applyCoupon() {
      if (!this.promoCode) {
        useNuxtApp().$showToast({ msg: "Enter a promo code.", type: "warning" });
        return;
      }
      this.couponApplied = true;
      useNuxtApp().$showToast({ msg: "Promo applied! 10% discount.", type: "success" });
    },
    
    removeCoupon() {
      this.couponApplied = false;
      this.promoCode = "";
      useNuxtApp().$showToast({ msg: "Promo removed.", type: "info" });
    },
  },

  async mounted() {
    this.isLogin = useCookie("userLogin").value;
    if (!this.isLogin) {
      this.$router.replace("/page/account/login");
    } else if (this.isLogin && this.cart.length == 0) {
      useNuxtApp().$showToast({ msg: "Cart is Empty.", type: "error" });
      this.$router.replace("/page/account/cart");
    }
    try {
      const resp = await useAuthStore().getPayments();
      this.payments = resp?.records ?? [];
    } catch (err) {
      this.payments = [];
    }
  },
};
</script>
<style scoped>
.sub-total li.promotion-code .promo-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.sub-total li.promotion-code .promo-input {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.sub-total li.promotion-code .promo-input input {
  flex: 1;
  padding: 0.25rem 0.5rem;
}

.sub-total li.promotion-code .promo-input button {
  white-space: nowrap;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.sub-total li.promotion-code .promo-input button:hover {
  background-color: #e74c3c;
}

.sub-total li.promotion-code .coupon-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #e6ffed;
  border: 1px solid #a6f4b0;
  border-radius: 0.25rem;
  font-size: 14px;
  color: #2f8f46;
  width: 100%;
  box-sizing: border-box;
}

.sub-total li.promotion-code .coupon-applied span:first-child {
  flex: 1;
}

.sub-total li.promotion-code .coupon-applied .count {
  font-weight: 600;
  color: #e74c3c;
  font-size: 16px;
  text-align: right;
  white-space: nowrap;
  margin-right: 0.5rem;
}

.sub-total li.promotion-code .coupon-applied button {
  background: transparent;
  color: #666;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  line-height: 1;
}

.sub-total li.promotion-code .coupon-applied button:hover {
  color: #000;
  border-color: #999;
  background-color: #f5f5f5;
}
</style>