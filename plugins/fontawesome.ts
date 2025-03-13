import { defineNuxtPlugin } from '#app'
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCrosshairs, faMap, faUserSecret } from '@fortawesome/free-solid-svg-icons'

// Ajout des icônes à la bibliothèque globale
library.add(faCrosshairs, faMap, faUserSecret)

export default defineNuxtPlugin((nuxtApp) => {
  // Enregistrement du composant FontAwesome globalement
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})