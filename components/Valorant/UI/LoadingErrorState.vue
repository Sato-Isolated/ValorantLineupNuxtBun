<template>
  <div 
    :class="{
      'state-container': true,
      'loading': isLoading,
      'error': hasError
    }"
  >
    <template v-if="isLoading">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage || 'Chargement...' }}</p>
    </template>

    <template v-else-if="hasError">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <p>{{ errorMessage }}</p>
      <button @click="$emit('retry')" class="retry-button">
        Réessayer
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  loadingMessage?: string;
}>();

// Émits
defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style lang="scss" scoped>
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-text);

  &.loading .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 70, 85, 0.3);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &.error .error-icon {
    color: var(--color-error);
    font-size: 2.5rem;
  }
}

.retry-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 70, 85, 0.2);
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 70, 85, 0.3);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>