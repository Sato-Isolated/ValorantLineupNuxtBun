// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/reset.css'],
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate', '@nuxt/image', '@nuxt/scripts'],
  alias: {
    '@styles': 'C:/Users/ismys/Desktop/ValorantLineupNuxtBun/assets/styles'
  },

})