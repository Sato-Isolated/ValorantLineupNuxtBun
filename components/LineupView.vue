<template>
  <div class="lineup-view" :style="{ top: position.y + 'px', left: position.x + 'px' }" @mousedown="startDrag">
    <div class="lineup-header">
      <h3>Lineup Details</h3>
      <button @click="$emit('close')">Close</button>
    </div>
    <div class="lineup-body" v-if="lineup">
      <p>Ability: {{ lineup.selectedAbility }}</p>
      <p>Coordinates: ({{ lineup.x }}, {{ lineup.y }})</p>
      <p>Type: {{ lineup.type }}</p>
      <p>Difficulty: {{ lineup.difficulty }}</p>
      <iframe v-if="lineup.youtubeLink" :src="lineup.youtubeLink" width="300" height="200" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useMyLineupStoreStore } from '~/stores/LineupStore';

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
.lineup-view {
  position: absolute;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
  cursor: move;
  width: 300px;
}
.lineup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lineup-body {
  margin-top: 10px;
}
</style>
