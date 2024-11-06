<template>
  <div class="lineup-view" :style="{ top: position.y + 'px', left: position.x + 'px' }" >
    <div class="lineup-header" @mousedown="startDrag">
      <button @click="$emit('close')">X</button>
    </div>
    <div class="lineup-body" v-if="lineup">
      <p>Difficulty: {{ lineup.difficulty }}</p>
      <iframe v-if="lineup.youtubeLink" :src="lineup.youtubeLink" width="300" height="200" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useMyLineupStoreStore } from '~/stores/Valorant/LineupStore';

const props = defineProps<{ lineupId: number }>();
const lineupStore = useMyLineupStoreStore();

const lineup = computed(() => {
  const lineupData = lineupStore.getLineupById(props.lineupId);
  if (!lineupData) {
    console.error(`Aucun lineup trouvé pour l'ID: ${props.lineupId}`);
  }
  return lineupData;
});

const position = ref({ x: 100, y: 100 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

watch(position, (newPosition) => {
  console.log('Position updated:', newPosition);
});

function startDrag(event: MouseEvent) {
  console.log('Start dragging');
  isDragging.value = true;
  offset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  };
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(event: MouseEvent) {
  if (isDragging.value) {
    position.value = {
      x: event.clientX - offset.value.x,
      y: event.clientY - offset.value.y
    };
    console.log('Dragging to position:', position.value);
  }
}

function stopDrag() {
  console.log('Stop dragging');
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

watch(lineup, (newVal) => {
  console.log('Lineup récupéré:', newVal);
  if (!newVal) {
    console.error('Aucun lineup trouvé pour l\'ID:', lineup.value);
  }
});
</script>

<style scoped>
@import '~/assets/styles/Valorant/components_style/LineupView.css';
</style>
