<template>
<Header/>
  <div>
    <WidgetsBreadcrumbs title="Register" />
    <section class="register-page section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h3>{{ title }}</h3>
            <div class="theme-card">
              <span class="validate-error" v-if="errormsg">{{ errormsg }}</span>
              <form class="theme-form" @submit.prevent="handleCreateUser">
                <div class="row">
                  <div class="col-md-6">
                    <label for="First name">First Name</label>
                    <input type="text" class="form-control" id="First name" v-model="fname" placeholder="First Name"
                      name="First name" required />
                  </div>
                  <div class="col-md-6">
                    <label for="lname">Last Name</label>
                    <input type="text" class="form-control" id="lname" v-model="lname" placeholder="Last Name"
                      name="lname" required />
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" name="email"
                      required />
                  </div>
                  <div class="col-md-6">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" v-model="password"
                      placeholder="Enter your password" name="password" required />
                  </div>
                  <div class="col-6">
                    <button type="submit" class="btn btn-solid mt-2" >create account</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>

<script>
import UserAuth from '../auth/auth';
import { useCartStore } from '~~/store/cart';

export default {
  data() {
    return {
      title: 'create account',
      fname: null,
      lname: null,
      email: null,
      password: null,
      errormsg: null,
    }
  },
  computed:{
    cart(){
      return useCartStore().cartItems
    },
  },
  methods: {
    async handleCreateUser() {
      const newUser = {
        FirstName: this.fname,
        LastName: this.lname,
        Email: this.email,
      };

      try {
        const customer = await this.$registerUser(newUser);

        if (customer.status !== 200) {
            this.errormsg = 'Something went wrong try again later!';
        } else {
            UserAuth.localLogin(customer.data);
            useCookie('userLogin').value === 'true';

            if (this.cart.length > 0) {
              this.$router.replace('/page/account/checkout');
            }
            else {
              this.$router.replace('/');
            }

            useCookie('userLogin').value === 'true'
        }
      } catch (error) {
        this.errormsg = 'User already exists on the platform. Try again using new email Address.';
      }
    }
  }
}
</script>
