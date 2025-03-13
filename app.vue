<template>
  <div :class="['app-container', `theme-${currentTheme}`]">
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
const { $theme } = useNuxtApp()
const currentTheme = computed(() => $theme.selectedTheme.value)

// S'assurer que le thème est appliqué dès le montage du composant
onMounted(() => {
  $theme.applyTheme(currentTheme.value)
})
</script>

<style lang="scss">
:root {
  // Valeurs par défaut des variables CSS
  --color-primary: #ff4655;
  --color-primary-rgb: 255, 70, 85;
  --color-secondary: #0f1923;
  --color-secondary-rgb: 15, 25, 35;
  --color-text: #fff;
  --color-text-rgb: 255, 255, 255;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-accent: #ff8f9e;
  
  // Transitions
  --transition-normal: 0.3s;
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
}

.app-container {
  min-height: 100vh;
  background: var(--color-secondary);
  color: var(--color-text);
  transition: 
    background-color var(--transition-normal) var(--ease-out-expo),
    color var(--transition-normal) var(--ease-out-expo);

  * {
    transition-property: background-color, border-color, color, box-shadow, transform, opacity;
    transition-duration: var(--transition-normal);
    transition-timing-function: var(--ease-out-expo);
  }
}
</style>
