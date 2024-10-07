// https://nuxt.com/docs/api/configuration/nuxt-config
import dotenv from 'dotenv';

dotenv.config();

export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    server: {
      hmr: {
        clientPort: 3000
      }
    }
  },

  routeRules: {
    
  },

  runtimeConfig: {
    salesforceClientId: process.env.NUXT_SALESFORCE_CLIENT_ID,
    salesforceClientSecret: process.env.NUXT_SALESFORCE_CLIENT_SECRET,
    salesforceRedirectUri: process.env.NUXT_SALESFORCE_REDIRECT_URI,
    username: process.env.NUXT_USERNAME,
    password: process.env.NUXT_PASSWORD,
  },
  
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Nexus Global Holdings',
      meta: [
        { name: 'description', content: 'My amazing site.' }
      ],
      script: [
        { src: 'https://www.paypal.com/sdk/js?client-id=test&currency=USD' },
        { src: 'https://checkout.stripe.com/checkout.js' },
      ],
    },
  },

  css: ["@/assets/scss/app.scss"],
  ssr:true,
  modules: [
    'nuxt-icon',
    '@nuxt/image-edge',
    // "@nuxtjs/i18n",
    '@vueuse/nuxt',
    // 'vue-toastification/nuxt',
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  // i18n: {
  //   strategy: "prefix_except_default",
  //   defaultLocale: "en",
  //   locales: [
  //     {
  //       code: "en",
  //       name: "English",
  //     },
  //     {
  //       code: "fr",
  //       name: "Français",
  //     },
  //   ],
  //   vueI18n: "./i18n.config.ts"
  // },
  pluginsIgnore: [
    /^ignored-plugin/,
    /another-ignored-plugin/,
  ],
  plugins: [

    // {src: '~/node_modules/bootstrap/dist/js/bootstrap.js', mode: 'client'}
    { src: './plugins/useBootstrap.client.ts', mode: 'client' },
    { src: './plugins/showToast.client.js', mode: 'client' },
    '~/plugins/salesforce.js',
    // { src: './plugins/paypal.client.js' }
    // { src: 'https://checkout.stripe.com/checkout.js'}    
  ],
  //    build: { vendor: 'vue-paypal-checkout'},
})
