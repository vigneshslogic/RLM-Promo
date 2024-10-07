<template>
  <div>
    <section class="pt-0 category-tools ratio3_2">
      <div class="container">
        <div class="row">
          <div class="col">
            <swiper :breakpoints="swiperOption.breakpoints" :loop="true" :slidesPerView="3"
              class="swiper-wrapper category-m" >
              <swiper-slide class="swiper-slide" v-for="(item, index) in items" :key="index">
                <div class="category-wrapper pt-0">
                  <div>
                    <div>
                      <img :src="item.imagepath" class="img-fluid bg-img" alt />
                    </div>
                    <h4>{{ item.title }}</h4>
                    <div v-html="item.description">
                    </div>
                    <a href="#" class="btn btn-outline">{{ item.button }}</a>
                  </div>
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
import {
  Swiper,
  SwiperSlide
} from "swiper/vue";
import 'swiper/css';
export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      swiperOption: {
        slidesPerView: 4,
        freeMode: true,
        breakpoints: {
          1200: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          991: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          586: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          0: {
            slidesPerView: 1,
          }
        }
      },
      items: [
        {
          imagepath: '/images/tools/category/Nexus_Technology_Solutions.png',
          title: 'Nexus Technology Solutions',
          description: `<ul class="category-link"><li><a href="#">AI-driven Digital Transformation</a></li><li><a href="#">Technology Consulting</a></li><li><a href="#">Enterprise Solutions</a></li></ul>`,
          button: 'view more'
        },
        {
          imagepath: '/images/tools/category/Nexus_Financial_Services.png',
          title: 'Nexus Financial Services',
          description: `<ul class="category-link"><li><a href="#">FinTech Solutions</a></li><li><a href="#">Digital Banking</a></li><li><a href="#">Asset Management</a></li></ul>`,
          button: 'view more'
        },
        {
          imagepath: '/images/tools/category/Nexus_Automotive_Technologies.png',
          title: 'Nexus Automotive Technologies',
          description: `<ul class="category-link"><li><a href="#">Electric Vehicle Design</a></li><li><a href="#">Autonomous Driving Technology</a></li><li><a href="#">Smart Automotive Solutions</a></li></ul>`,
          button: 'view more'
        },
      ]
    }
  },
  
}
</script>
