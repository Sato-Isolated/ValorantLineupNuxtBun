<template>
  <div class="async-loading">
    <div class="loading-spinner"></div>
    <p>Chargement...</p>
  </div>
</template>

<style lang="scss" scoped>
.async-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 70, 85, 0.3);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: var(--color-text);
    font-size: 0.9rem;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>