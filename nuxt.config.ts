// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/reset.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  experimental: {
    payloadExtraction: false
  },
  nitro: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core']
    }
  },
  build: {
    transpile: ['@fortawesome/vue-fontawesome']
  }
});