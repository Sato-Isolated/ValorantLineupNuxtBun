<template>
  <div class="recent-lineups-mobile">
    <button 
      class="toggle-recent" 
      @click="isOpen = !isOpen"
      aria-label="Afficher l'historique récent">
      <i class="fas fa-history"></i>
    </button>
    <div v-if="isOpen" class="recent-content">
      <h3>Récemment consultés</h3>
      <div class="recent-list">
        <router-link 
          v-for="lineup in lineups"
          :key="lineup.agent + lineup.map"
          :to="'/valorant/' + lineup.agent.toLowerCase() + '/' + lineup.map.toLowerCase()"
          class="recent-item">
          {{ lineup.agent }} - {{ lineup.map }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
defineProps<{
  lineups: Array<{ agent: string; map: string; date: number; }>;
}>();

// État local
const isOpen = ref(false);
</script>

<style lang="scss" scoped>
.recent-lineups-mobile {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  z-index: 90;

  @media (min-width: 769px) {
    display: none;
  }

  .toggle-recent {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--component-bg);
    border: 1px solid var(--border-primary);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .recent-content {
    position: absolute;
    bottom: 100%;
    right: 0;
    background: var(--component-bg);
    border: 1px solid var(--border-primary);
    border-radius: var(--card-radius);
    padding: 1rem;
    margin-bottom: 0.5rem;
    width: 200px;
    animation: slideUp 0.3s ease;

    h3 {
      color: var(--color-text);
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .recent-item {
        color: var(--color-text);
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background: var(--overlay-light);
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>