<template>
  <div>
    <!-- Badge de notification -->
    <div 
      v-if="!hasSeenFeatures" 
      class="new-features-badge"
      @click="show"
    >
      <i class="fas fa-star"></i>
      Nouvelles fonctionnalités !
    </div>

    <!-- Modal -->
    <div v-if="isOpen" class="new-features-modal">
      <div class="modal-content">
        <h2>Nouvelles fonctionnalités !</h2>
        <ul>
          <li v-for="feature in features" :key="feature.icon">
            <i :class="['fas', feature.icon]"></i>
            {{ feature.description }}
          </li>
        </ul>
        <button @click="close" class="close-btn">
          Compris !
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
const props = defineProps<{
  features: Array<{ icon: string; description: string; }>;
  hasSeenFeatures: boolean;
}>();

// Émits
const emit = defineEmits<{
  (e: 'update:hasSeenFeatures', value: boolean): void;
}>();

// État local
const isOpen = ref(false);

// Méthodes
const show = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  emit('update:hasSeenFeatures', true);
  localStorage.setItem('hasSeenNewFeatures', 'true');
};
</script>

<style lang="scss" scoped>
.new-features-badge {
  position: fixed;
  right: 1rem;
  bottom: 5rem;
  background: var(--color-primary);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: pulse 2s infinite;
  z-index: 90;

  i {
    animation: star-spin 2s infinite;
  }
}

.new-features-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  .modal-content {
    background: var(--component-bg);
    padding: 2rem;
    border-radius: var(--card-radius);
    border: 1px solid var(--border-primary);
    max-width: 90vw;
    width: 400px;

    h2 {
      color: var(--color-primary);
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      text-align: center;
    }

    ul {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;

      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--color-text);
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;

        i {
          color: var(--color-primary);
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        &:hover {
          background: var(--overlay-light);
        }
      }
    }

    .close-btn {
      width: 100%;
      padding: 0.75rem;
      background: var(--color-primary);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--color-primary-dark);
      }
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes star-spin {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(20deg); }
  40% { transform: rotate(-20deg); }
  60% { transform: rotate(10deg); }
  80% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>