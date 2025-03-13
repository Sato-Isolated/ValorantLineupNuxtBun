<template>
  <div v-if="show" class="guide-overlay">
    <div class="guide-content">
      <h2>Bienvenue dans l'éditeur de lineups !</h2>
      <div class="guide-shortcuts">
        <h3>Raccourcis clavier :</h3>
        <ul>
          <li v-for="(shortcut, key) in shortcuts" :key="key">
            <kbd>{{ shortcut.key }}</kbd> - {{ shortcut.description }}
          </li>
        </ul>
      </div>
      <button @click="$emit('close')" class="guide-close">Compris !</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  show: boolean;
  shortcuts: Record<string, { key: string; description: string; }>;
}

const props = defineProps<Props>();

// Émits
defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style lang="scss" scoped>
.guide-overlay {
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

  .guide-content {
    background: var(--component-bg);
    padding: 2rem;
    border-radius: var(--card-radius);
    border: 1px solid var(--border-primary);
    max-width: 90vw;
    width: 400px;

    h2 {
      color: var(--color-text);
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      text-align: center;
    }

    .guide-shortcuts {
      margin-bottom: 2rem;

      h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 0.5rem;
          color: var(--color-text);

          kbd {
            background: var(--color-primary);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            margin-right: 0.5rem;
            font-size: 0.9rem;
          }
        }
      }
    }
    
    .guide-close {
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>