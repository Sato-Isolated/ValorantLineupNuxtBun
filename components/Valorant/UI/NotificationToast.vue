<template>
  <div 
    v-if="show" 
    class="notification"
    :class="type"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>();
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  z-index: 1000;
  transform-origin: bottom right;
  animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  &.success {
    background: rgba(46, 213, 115, 0.9);
    color: #fff;
  }
  
  &.error {
    background: rgba(255, 71, 87, 0.9);
    color: #fff;
  }
  
  &.info {
    background: rgba(55, 125, 255, 0.9);
    color: #fff;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>