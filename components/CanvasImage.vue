<template>
  <div ref="canvasContainer" class="canvas-container">
    <canvas ref="canvasRef" @mousemove="handleMouseMove" @mousedown="startDrawingLine" @click="placeLine" @contextmenu.prevent="handleRightClick" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useFormStore } from '@/stores/useFormStore';
import { useMapStore } from '@/stores/mapStore';
import { useAgentStore } from '@/stores/agentStore';
import { useFetch } from '#app';

const formStore = useFormStore();
const agentStore = useAgentStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainer = ref<HTMLDivElement | null>(null);
const isDrawingLine = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const mapStore = useMapStore();
let backgroundImage: HTMLImageElement | null = null;
interface Lineup {
  selectedAbility: string;
  x: number;
  y: number;
  trajectory: any[];
}

let lineups = ref<Lineup[]>([]);
let isHoveringIcon = false;
// Taille d'origine de l'image
const originalWidth = 1024;
const originalHeight = 1024;

// Fonction pour obtenir les facteurs d'échelle
function getScaleFactors() {
  const canvas = canvasRef.value;
  if (!canvas) return { scaleX: 1, scaleY: 1 };
  return {
    scaleX: canvas.width / originalWidth,
    scaleY: canvas.height / originalHeight,
  };
}
// Fonction pour dessiner la trajectoire complète
function drawTrajectory(trajectory: any[]) {
  if (!formStore.isDrawingEnabled) return;

  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundImage?.src) {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

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

  trajectory.forEach((item: { shape: any; radius: number; x: number; y: number; endX: number | undefined; endY: number | undefined; }) => {
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
  });
}

// Fonction pour dessiner les icônes des points
function drawIcons() {
  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context || !Array.isArray(lineups.value)) return;

  const { scaleX, scaleY } = getScaleFactors();

  const iconCache: { [key: string]: HTMLImageElement } = {};

  lineups.value.forEach(lineup => {
    const iconPath = getIconPath(lineup.selectedAbility);

    if (!iconCache[iconPath]) {
      const img = new Image();
      img.src = iconPath;
      img.onload = () => {
        iconCache[iconPath] = img;
        context.drawImage(img, lineup.x * scaleX - 16, lineup.y * scaleY - 16, 32, 32);
      };
    } else {
      context.drawImage(iconCache[iconPath], lineup.x * scaleX - 16, lineup.y * scaleY - 16, 32, 32);
    }
  });
}

// Fonction pour obtenir le chemin de l'icône
function getIconPath(ability: string): string {
  return `/images/Abilities/${agentStore.selectedAgent}_${ability}.webp`;
}

// Fonction pour charger les données JSON
async function loadLineups() {
  try {
    const { data, error } = await useFetch(`/api/load-lineups?agent=${agentStore.selectedAgent}&map=${agentStore.selectedMap}&type=${mapStore.mapInteractiveSide}`);
    if (error.value) throw new Error(`Erreur de chargement des lineups : ${error.value}`);
    
    const mode = mapStore.isAttackMode ? 'attaque' : 'defense';
    lineups.value = (data.value || []).filter((lineup: { type: string; }) => lineup.type === mode);

    redrawBackgroundImage(); // Redessine l'image de fond et les icônes
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}


function redrawBackgroundImage() {
  const canvas = canvasRef.value;
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const currentBackgroundSrc = mapStore.mapInteractiveSide;

  // Vérifie si l'image de fond a déjà été chargée et cache l'image si nécessaire
  if (!backgroundImage || backgroundImage.src !== currentBackgroundSrc) {
    backgroundImage = new Image();
    backgroundImage.src = currentBackgroundSrc;
    backgroundImage.onload = () => drawCanvasBackground(context);
  } else {
    // Redessine immédiatement si l'image est déjà chargée
    drawCanvasBackground(context);
  }
}

// Fonction pour dessiner l'image de fond et les icônes
function drawCanvasBackground(context: CanvasRenderingContext2D) {
  if (canvasRef.value) {
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
  if (backgroundImage) {
    if (canvasRef.value) {
      context.drawImage(backgroundImage, 0, 0, canvasRef.value.width, canvasRef.value.height);
    }
  }
  drawIcons(); // Dessine les icônes sur le canvas
}


function startDrawingLine() {
  isDrawingLine.value = true;
}

function stopDrawingLine() {
  isDrawingLine.value = false;
}

function handleMouseMove(event: { clientX: number; clientY: number; }) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();

  mousePosition.value = {
    x: (event.clientX - rect.left) / scaleX,
    y: (event.clientY - rect.top) / scaleY,
  };

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

  if (isDrawingLine.value) {
    drawTrajectory(formStore.trajectory);
  }
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

// Place la ligne définitive à la position actuelle de la souris et ajoute la croix
function placeLine() {
  if (isDrawingLine.value) {
    const circle = formStore.trajectory.find((item: { shape: string; }) => item.shape === 'circle');
    if (circle && circle.radius) {
      const startX = circle.x;
      const startY = circle.y;
      formStore.addPointToTrajectory('line', startX, startY, undefined, mousePosition.value.x, mousePosition.value.y);
      formStore.addPointToTrajectory('cross', mousePosition.value.x, mousePosition.value.y);
    }
    stopDrawingLine();
  }
}

// Gère le clic droit pour mettre à jour les coordonnées dans FloatingMenu
function handleRightClick(event: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  const x = Math.floor((event.clientX - rect.left) / scaleX);
  const y = Math.floor((event.clientY - rect.top) / scaleY);
  formStore.setCoordinates(x, y);
}

onMounted(() => {
  const canvas = canvasRef.value;
  const container = canvasContainer.value;
  if (canvas && container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    if (mapStore.mapInteractiveSide && typeof window !== 'undefined') {
      redrawBackgroundImage();
    }
    loadLineups();
  }
});

watch(() => mapStore.mapInteractiveSide, () => {
  redrawBackgroundImage();
  loadLineups();
});

watch(() => mapStore.lineupSaved, (newVal) => {
  if (newVal) {
    loadLineups();
    redrawBackgroundImage();
    mapStore.setLineupSaved(false); // Réinitialiser l'état lineupSaved
  }
});

watch(() => formStore.trajectory, () => {
  console.log("Changement détecté dans formStore.trajectory");
  drawTrajectory(formStore.trajectory);
}, { deep: true });

onUnmounted(() => {
  isDrawingLine.value = false;
});
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