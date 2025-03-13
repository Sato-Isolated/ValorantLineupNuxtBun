<template>
  <div 
    class="node"
    :class="{ 
      'node-attack': lineup.type === 'attaque', 
      'node-defense': lineup.type === 'defense',
      'is-selected': isSelected,
      'is-dragging': isDragging
    }"
    :style="{ 
      left: `${lineup.position.x}px`, 
      top: `${lineup.position.y}px`,
      cursor: isDragging ? 'grabbing' : 'grab'
    }"
    @click="$emit('click')"
    @mousedown="startDrag"
    @mouseup="stopDrag"
  >
    <div class="node-preview" v-if="lineup.description || lineup.youtubeUrl">
      <span class="node-ability" v-if="lineup.selectedAbility">
        <img :src="`/images/Valorant/Abilities/${lineup.selectedAbility}.webp`" :alt="lineup.selectedAbility">
      </span>
      <span class="node-description">{{ lineup.description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
interface Position {
  x: number;
  y: number;
}

interface Lineup {
  id: number;
  position: Position;
  windowPosition: Position;
  isWindowOpen: boolean;
  description: string;
  youtubeUrl: string;
  selectedAbility: string;
  type: 'attaque' | 'defense';
  agent: string;
  map: string;
}

// Props
const props = defineProps<{
  lineup: Lineup;
  isSelected?: boolean;
  isDragging?: boolean;
}>();

// État local
const isDragging = ref(false);

// Émits
defineEmits<{
  (e: 'click'): void;
}>();

// Méthodes
const startDrag = () => {
  isDragging.value = true;
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>

<style lang="scss" scoped>
.node {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  z-index: 2;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);

    &::before {
      opacity: 0.3;
    }

    .node-preview {
      opacity: 1;
      transform: translateX(-50%) translateY(-5px);
    }
  }

  &.node-attack {
    background-color: #ff4655;
    box-shadow: 0 0 8px rgba(255, 70, 85, 0.6);

    &::before {
      background: rgba(255, 70, 85, 0.3);
    }

    &.is-dragging {
      box-shadow: 0 0 15px rgba(255, 70, 85, 0.8);
    }
  }

  &.node-defense {
    background-color: #00ff87;
    box-shadow: 0 0 8px rgba(0, 255, 135, 0.6);

    &::before {
      background: rgba(0, 255, 135, 0.3);
    }

    &.is-dragging {
      box-shadow: 0 0 15px rgba(0, 255, 135, 0.8);
    }
  }

  &.is-selected {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 3;

    &::before {
      opacity: 0.3;
      width: 24px;
      height: 24px;
    }
  }

  &.is-dragging {
    transform: translate(-50%, -50%) scale(1.4);
    transition: transform 0.1s ease;
    z-index: 4;

    &::before {
      opacity: 0.4;
      width: 32px;
      height: 32px;
    }

    .node-preview {
      opacity: 0;
    }
  }

  .node-preview {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: rgba(15, 25, 35, 0.95);
    padding: 0.5rem;
    border-radius: 4px;
    min-width: 120px;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.2s ease;
    pointer-events: none;
    margin-bottom: 8px;
    z-index: 5;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid rgba(15, 25, 35, 0.95);
    }

    .node-ability {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 0.5rem;
      vertical-align: middle;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 2px;
      }
    }

    .node-description {
      color: #fff;
      font-size: 0.875rem;
      vertical-align: middle;
    }
  }
}
</style>