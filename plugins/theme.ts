import { ThemeManager } from '~/utils/ThemeManager'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Création d'une seule instance du ThemeManager
  const themeManager = new ThemeManager('dark')

  // S'assurer que le thème est appliqué au montage de l'application
  if (process.client) {
    // Appliquer le thème immédiatement
    const savedTheme = themeManager.loadThemeFromStorage()
    if (savedTheme) {
      themeManager.applyTheme(savedTheme)
    }

    // Initialiser après le montage pour s'assurer que le DOM est prêt
    nuxtApp.vueApp.mixin({
      mounted() {
        themeManager.initialize()
        // Re-appliquer le thème pour s'assurer que tout est synchronisé
        themeManager.applyTheme(themeManager.selectedTheme.value)
      }
    })
  }

  return {
    provide: {
      theme: themeManager
    }
  }
})