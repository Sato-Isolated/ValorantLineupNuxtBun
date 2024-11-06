<template>
  <div ref="canvasContainer" class="canvas-container">
    <canvas ref="canvasRef" @mousemove="handleMouseMove" @mousedown="startDrawingLine" @click="placeLine"
      @contextmenu.prevent="handleRightClick" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useFormStore } from '~/stores/Valorant/useFormStore';
import { useMapStore } from '~/stores/Valorant/mapStore';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useFetch } from '#app';
import { useMyLineupStoreStore } from '~/stores/Valorant/LineupStore';

// === États et Références ===
const lineupStore = useMyLineupStoreStore();
const formStore = useFormStore();
const agentStore = useAgentStore();
const mapStore = useMapStore();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainer = ref<HTMLDivElement | null>(null);
const isDrawingLine = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
let backgroundImage: HTMLImageElement | null = null;
interface Lineup {
  id: string;
  selectedAbility: string;
  x: number;
  y: number;
  trajectory: any[];
}

let lineups = ref<Lineup[]>([]);
let isHoveringIcon = false;
const emits = defineEmits(['lineupClicked']);

// === Initialisation et Cycle de Vie ===
const originalWidth = 1024;
const originalHeight = 1024;

onMounted(() => {
  initializeCanvas();
  loadLineups();
});

function initializeCanvas() {
  const canvas = canvasRef.value;
  const container = canvasContainer.value;
  if (canvas && container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    if (mapStore.mapInteractiveSide && typeof window !== 'undefined') {
      redrawBackgroundImage();
    }
  }
}

onUnmounted(() => {
  isDrawingLine.value = false;
});

watch(() => mapStore.mapInteractiveSide, () => {
  redrawBackgroundImage();
  loadLineups();
});

watch(() => mapStore.lineupSaved, (newVal) => {
  if (newVal) {
    loadLineups();
    redrawBackgroundImage();
    mapStore.setLineupSaved(false);
  }
});

watch(() => formStore.trajectory, () => {
  drawTrajectory(formStore.trajectory);
}, { deep: true });

// === Gestion des Événements Utilisateur ===
function startDrawingLine() {
  isDrawingLine.value = true;
}

function stopDrawingLine() {
  isDrawingLine.value = false;
}

function placeLine(event: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  const clickPosition = {
    x: (event.clientX - rect.left) / scaleX,
    y: (event.clientY - rect.top) / scaleY,
  };

  const clickedLineup = lineups.value.find(lineup => {
    const dx = clickPosition.x - lineup.x;
    const dy = clickPosition.y - lineup.y;
    return Math.sqrt(dx * dx + dy * dy) < 16;
  });

  if (clickedLineup) {
    emits('lineupClicked', clickedLineup.id); // Emit the lineup ID
    resetState();
  } else if (isDrawingLine.value && formStore.isDrawingEnabled) {
    drawFinalLine(clickPosition);
    stopDrawingLine();
  } else {
    resetState();
  }

  drawIcons();
}

function handleMouseMove(event: { clientX: number; clientY: number; }) {
  updateMousePosition(event);
  handleHover();
  if (isDrawingLine.value) {
    drawTrajectory(formStore.trajectory);
  }
}

function handleRightClick(event: MouseEvent) {
  setCoordinatesFromClick(event);
}

function updateMousePosition(event: { clientX: number; clientY: number; }) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  mousePosition.value = {
    x: (event.clientX - rect.left) / scaleX,
    y: (event.clientY - rect.top) / scaleY,
  };
}

function handleHover() {
  if (!isDrawingLine.value) {
    const hoveredLineup = lineups.value.find(lineup => {
      const dx = mousePosition.value.x - lineup.x;
      const dy = mousePosition.value.y - lineup.y;
      return Math.sqrt(dx * dx + dy * dy) < 16;
    });

    if (hoveredLineup) {
      if (!isHoveringIcon) {
        isHoveringIcon = true;
        formStore.isDrawingEnabled = true;
        drawTrajectory(hoveredLineup.trajectory);
      }
    } else if (isHoveringIcon) {
      isHoveringIcon = false;
      formStore.isDrawingEnabled = false;
      clearTrajectory();
    }
  }
}

// === Dessin sur Canvas ===
function drawTrajectory(trajectory: any[]) {
  if (!formStore.isDrawingEnabled) return;

  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundAndIcons(context);

  const { scaleX, scaleY } = getScaleFactors();

  if (isDrawingLine.value) {
    const circle = formStore.trajectory.find((item: { shape: string; }) => item.shape === 'circle');
    if (circle?.radius) {
      const startX = circle.x * scaleX;
      const startY = circle.y * scaleY;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(mousePosition.value.x * scaleX, mousePosition.value.y * scaleY);
      context.strokeStyle = "rgba(0, 255, 0, 0.7)";
      context.lineWidth = 1.5;
      context.stroke();
    }
  }

  trajectory.forEach(drawTrajectoryElement);
}

function drawTrajectoryElement(item: { shape: any; radius: number; x: number; y: number; endX: number | undefined; endY: number | undefined; }) {
  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const { scaleX, scaleY } = getScaleFactors();

  context.beginPath();
  switch (item.shape) {
    case 'circle':
      if (item.radius) {
        context.arc(item.x * scaleX, item.y * scaleY, item.radius * scaleX, 0, 2 * Math.PI);
        context.fillStyle = "rgba(0, 0, 255, 0.5)";
        context.fill();
      }
      break;
    case 'line':
      if (item.endX !== undefined && item.endY !== undefined) {
        context.moveTo(item.x * scaleX, item.y * scaleY);
        context.lineTo(item.endX * scaleX, item.endY * scaleY);
        context.strokeStyle = "blue";
        context.lineWidth = 2;
        context.stroke();
      }
      break;
    case 'cross':
      context.moveTo((item.x - 5) * scaleX, (item.y - 5) * scaleY);
      context.lineTo((item.x + 5) * scaleX, (item.y + 5) * scaleY);
      context.moveTo((item.x - 5) * scaleX, (item.y + 5) * scaleY);
      context.lineTo((item.x + 5) * scaleX, (item.y - 5) * scaleY);
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.stroke();
      break;
  }
}

function drawIcons() {
  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context || !Array.isArray(lineups.value)) return;

  const { scaleX, scaleY } = getScaleFactors();

  lineups.value.forEach(lineup => {
    const icon = loadIcon(getIconPath(lineup.selectedAbility));
    context.drawImage(icon, lineup.x * scaleX - 16, lineup.y * scaleY - 16, 32, 32);
  });
}

function drawBackgroundAndIcons(context: CanvasRenderingContext2D) {
  if (canvasRef.value) {
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
  if (backgroundImage) {
    if (canvasRef.value) {
      context.drawImage(backgroundImage, 0, 0, canvasRef.value.width, canvasRef.value.height);
    }
  }
  drawIcons();
}

function drawFinalLine(clickPosition: { x: number; y: number; }) {
  const circle = formStore.trajectory.find((item: { shape: string; }) => item.shape === 'circle');
  if (circle && circle.radius) {
    const startX = circle.x;
    const startY = circle.y;
    formStore.addPointToTrajectory('line', startX, startY, undefined, clickPosition.x, clickPosition.y);
    formStore.addPointToTrajectory('cross', clickPosition.x, clickPosition.y);
  }
}

// === Utilitaires et Cache ===
function getScaleFactors() {
  const canvas = canvasRef.value;
  if (!canvas) return { scaleX: 1, scaleY: 1 };
  return {
    scaleX: canvas.width / originalWidth,
    scaleY: canvas.height / originalHeight,
  };
}

const iconCache: { [key: string]: HTMLImageElement } = {};

function loadIcon(iconPath: string): HTMLImageElement {
  if (!iconCache[iconPath]) {
    const img = new Image();
    img.src = iconPath;
    iconCache[iconPath] = img;
  }
  return iconCache[iconPath];
}

function getIconPath(ability: string): string {
  return `/images/Valorant/Abilities/${agentStore.selectedAgent}_${ability}.webp`;
}

async function loadLineups() {
  try {
    console.log('Loading lineups...');
    const { data, error } = await useFetch(`/api/Valorant/load-lineups?agent=${agentStore.selectedAgent}&map=${agentStore.selectedMap}&type=${mapStore.mapInteractiveSide}`);
    if (error.value) throw new Error(`Erreur de chargement des lineups : ${error.value}`);

    const mode = mapStore.isAttackMode ? 'attaque' : 'defense';
    lineups.value = (data.value || []).filter((lineup: { type: string; }) => lineup.type === mode);
    const filteredLineups = (data.value || []).filter((lineup: { type: string; }) => lineup.type === mode);

    lineupStore.lineups = [];
    filteredLineups.forEach((lineup: any) => {
      lineupStore.addLineup(lineup);
    });

    console.log('Lineups loaded:', lineups.value);
    console.log('LineupStore contents:', lineupStore.lineups);
    redrawBackgroundImage();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
  }
}

function redrawBackgroundImage() {
  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const currentBackgroundSrc = mapStore.mapInteractiveSide;
  if (!backgroundImage || backgroundImage.src !== currentBackgroundSrc) {
    backgroundImage = new Image();
    backgroundImage.src = currentBackgroundSrc;
    backgroundImage.onload = () => drawBackgroundAndIcons(context);
  } else {
    drawBackgroundAndIcons(context);
  }
}

function setCoordinatesFromClick(event: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  const x = Math.floor((event.clientX - rect.left) / scaleX);
  const y = Math.floor((event.clientY - rect.top) / scaleY);
  formStore.setCoordinates(x, y);
}

function clearTrajectory() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundImage) {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  drawIcons();
}

function resetState() {
  isDrawingLine.value = false;
  isHoveringIcon = false;
  formStore.isDrawingEnabled = false;
  clearTrajectory();
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
</style>