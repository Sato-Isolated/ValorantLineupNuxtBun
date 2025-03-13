<template>
  <div 
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
    @mousedown="startDrag"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
interface Props {
  initialPosition: { x: number; y: number };
}

const props = defineProps<Props>();

// Émits
const emit = defineEmits<{
  (e: 'positionUpdate', position: { x: number; y: number }): void;
  (e: 'dragStart'): void;
  (e: 'dragEnd'): void;
}>();

// État local
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

// Gestion du drag
const startDrag = (e: MouseEvent) => {
  if (e.button !== 0) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  isDragging.value = true;
  dragOffset.value = {
    x: e.clientX - props.initialPosition.x,
    y: e.clientY - props.initialPosition.y
  };

  emit('dragStart');
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'grabbing';
};

const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  requestAnimationFrame(() => {
    const newPosition = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y
    };
    emit('positionUpdate', newPosition);
  });
};

const stopDrag = () => {
  isDragging.value = false;
  emit('dragEnd');
  
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.cursor = '';
};
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
  touch-action: none;
  user-select: none;

  &.is-dragging {
    cursor: grabbing;
  }
}
</style>