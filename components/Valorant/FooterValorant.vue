<template>
  <footer class="valorant-footer">
    <div class="footer__content">
      <div class="footer__info">
        <a href="https://github.com/Sato-Isolated" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="footer-link">
          Made with <span class="heart" aria-label="coeur">❤️</span> By <em>Mindlated</em>
        </a>
      </div>
      
      <div class="theme-selector">
        <select 
          v-model="selectedTheme" 
          class="theme-select"
          aria-label="Sélecteur de thème">
          <option value="dark">Sombre</option>
          <option value="jett">Jett</option>
          <option value="phoenix">Phoenix</option>
          <option value="viper">Viper</option>
          <option value="sage">Sage</option>
        </select>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { $theme } = useNuxtApp();

// Gestion réactive du thème
const selectedTheme = computed({
  get: () => $theme.selectedTheme.value,
  set: (value) => {
    $theme.selectedTheme.value = value;
    $theme.applyTheme(value);
  }
});
</script>

<style lang="scss" scoped>
// Utilisez les variables CSS du système de thème
.valorant-footer {
  background: rgba(var(--color-secondary-rgb), 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid var(--border-primary);
  padding: 1.5rem 0;
  will-change: backdrop-filter;

  .footer__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    gap: 2rem;

    @media (max-width: 2560px) {
      max-width: 100%;
    }

    @media (max-width: 1440px) {
      max-width: 95%;
      padding: 0 1.5rem;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      padding: 0 1rem;
      gap: 1.5rem;
    }
  }

  .footer-link {
    color: var(--color-text);
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: clamp(0.875rem, 2vw, 1rem);
    opacity: 0.8;

    @media (max-width: 1024px) {
      font-size: clamp(0.8rem, 1.8vw, 0.9rem);
    }

    &:hover {
      opacity: 1;
    }

    .heart {
      color: var(--color-primary);
      display: inline-block;
      animation: heartbeat 1.5s ease infinite;
      will-change: transform;
    }

    em {
      font-style: normal;
      color: var(--color-primary);
      font-weight: 600;
    }
  }

  .theme-selector {
    .theme-select {
      padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1rem);
      background: rgba(var(--color-secondary-rgb), 0.1);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      color: var(--color-text);
      font-size: clamp(0.8rem, 1.8vw, 0.9rem);
      cursor: pointer;
      transition: all 0.3s ease;

      @media (max-width: 1024px) {
        padding: 0.4rem 0.8rem;
      }

      @media (max-width: 768px) {
        width: 100%;
        max-width: 200px;
      }

      &:hover {
        background: rgba(var(--color-secondary-rgb), 0.2);
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--overlay-primary);
      }

      option {
        background: var(--color-secondary);
        color: var(--color-text);
        padding: 0.5rem;
      }
    }
  }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>