<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    @mousemove="handleMouseMove"
    @click="handleCanvasClick"
    @contextmenu.prevent="setCoordinatesFromClick"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useFormStore } from '~/stores/Valorant/useFormStore';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useMapStore } from '~/stores/Valorant/mapStore';
import { useFetch } from '#app';
import { useMyLineupStoreStore } from '~/stores/Valorant/LineupStore';

// === États et Références ===
const lineupStore = useMyLineupStoreStore();
const formStore = useFormStore();
const agentStore = useAgentStore();
const mapStore = useMapStore();

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

// Dimensions du canvas
const canvasWidth = ref(1024);
const canvasHeight = ref(1024);

// Variable pour contrôler l'affichage de la trajectoire
const needsRefresh = ref(true);

// Image de la carte
const mapImage = ref<HTMLImageElement | null>(null);

// Cache des icônes des capacités
const abilityIcons = reactive<Record<string, HTMLImageElement>>({});

// Variable pour suivre le point survolé
const hoveredPointId = ref<number | null>(null);

// Variables pour le mode dessin
const drawingStage = ref<'none' | 'placingCross' | 'finished'>('none');
const crossPosition = ref<{ x: number; y: number } | null>(null);
const mousePosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

onMounted(async () => {
  if (canvas.value) {
    context.value = canvas.value.getContext('2d');

    // Charger l'image de la carte
    await loadMapImage();

    // Charger les lineups
    await loadLineups();

    // Charger les icônes des capacités
    loadAbilityIcons();

    drawCanvas();
  }
});

// Observer les changements sur formStore.points
watch(
  () => formStore.points,
  () => {
    loadAbilityIcons();
    drawCanvas();
  },
  { deep: true }
);

// Observer les changements de mode (attaque/défense)
watch(
  () => mapStore.isAttackMode,
  async () => {
    // Recharger l'image de la carte
    await loadMapImage();
    // Recharger les lineups
    await loadLineups();
    // Redessiner le canvas
    drawCanvas();
  }
);

// Observer le changement du mode dessin
watch(() => formStore.isDrawingEnabled, (newVal) => {
  if (newVal) {
    drawingStage.value = 'placingCross';
    // Réinitialiser la trajectoire
    formStore.trajectory = [];
    // Ajouter le cercle aux coordonnées actuelles
    formStore.addPointToTrajectory('circle', formStore.x, formStore.y, 25);
    needsRefresh.value = true; // Activer l'affichage de la trajectoire
    drawCanvas();
  } else {
    drawingStage.value = 'none';
  }
});

// Fonction pour charger l'image de la carte
const loadMapImage = () => {
  return new Promise<void>((resolve, reject) => {
    const mapName = agentStore.selectedMap;
    if (!mapName) {
      console.error('Carte non sélectionnée');
      reject();
      return;
    }

    const imagePath = mapStore.getMapImagePath(mapName);
    if (!imagePath) {
      console.error("Chemin de l'image de la carte non trouvé");
      reject();
      return;
    }

    mapImage.value = new Image();
    mapImage.value.src = imagePath;
    mapImage.value.onload = () => {
      drawCanvas();
      resolve();
    };
    mapImage.value.onerror = () => {
      console.error("Erreur lors du chargement de l'image de la carte");
      reject();
    };
  });
};
let lineups = ref<Lineup[]>([]);

interface Lineup {
  id: string;
  selectedAbility: string;
  x: number;
  y: number;
  trajectory: any[];
  type: string; // Add the 'type' property
}

// Fonction pour charger les lineups
const loadLineups = async () => {
  const agent = agentStore.selectedAgent;
  const map = agentStore.selectedMap;
  const type = mapStore.isAttackMode ? 'attaque' : 'defense';

  if (!agent || !map || !type) {
    console.error('Agent, carte ou type non défini');
    return;
  }

  const { data, error } = await useFetch(`/api/Valorant/load-lineups`, {
    params: {
      agent,
      map,
      type,
    },
  });

  const mode = mapStore.isAttackMode ? 'attaque' : 'defense';
    
    // Filtrage des lineups en fonction du mode
    const filteredLineups = (data.value || []).filter((lineup: { type: string; }) => lineup.type === mode);

    // Met à jour le store lineup avec les lineups filtrés
    lineupStore.lineups = [];
    filteredLineups.forEach((lineup: any) => {
      lineupStore.addLineup(lineup);
    });

    lineups.value = filteredLineups;

  if (error.value) {
    console.error('Erreur lors du chargement des lineups:', error.value);
    return;
  }

  if (data.value) {
    formStore.points = data.value;
  }
};

// Fonction pour charger les icônes des capacités
function getIconPath(ability: string): string {
  return `/images/Valorant/Abilities/${agentStore.selectedAgent}_${ability}.webp`;
}

const loadAbilityIcons = () => {
  const abilities = new Set<string>();
  for (const point of formStore.points) {
    if (point.selectedAbility) {
      abilities.add(point.selectedAbility);
    }
  }

  abilities.forEach((ability) => {
    if (!abilityIcons[ability]) {
      const img = new Image();
      img.src = getIconPath(ability);
      img.onload = () => {
        abilityIcons[ability] = img;
        drawCanvas();
      };
      img.onerror = () => {
        console.error(`Erreur lors du chargement de l'icône pour la capacité ${ability}`);
      };
    }
  });
};

// Fonction pour obtenir les facteurs d'échelle
const getScaleFactors = () => {
  if (!canvas.value) return { scaleX: 1, scaleY: 1 };
  const displayWidth = canvas.value.clientWidth;
  const displayHeight = canvas.value.clientHeight;
  const scaleX = displayWidth / canvasWidth.value;
  const scaleY = displayHeight / canvasHeight.value;
  return { scaleX, scaleY };
};

const drawCanvas = () => {
  if (context.value && canvas.value) {
    // Obtenir les facteurs d'échelle dynamiques
    const { scaleX, scaleY } = getScaleFactors();

    // Effacer le canvas
    context.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    // Dessiner l'image de la carte si elle est chargée
    if (mapImage.value) {
      context.value.drawImage(mapImage.value, 0, 0, canvasWidth.value, canvasHeight.value);
    }

    // Dessiner les icônes des capacités sur les points interactifs
    for (const point of formStore.points) {
      const x = point.x;
      const y = point.y;
      const ability = point.selectedAbility;
      const img = abilityIcons[ability];

      if (img) {
        // Dessiner l'image centrée sur (x, y)
        const imgWidth = 32;
        const imgHeight = 32;
        context.value.drawImage(img, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
      } else {
        // Si l'image n'est pas encore chargée, dessiner un cercle en attente
        context.value.beginPath();
        context.value.arc(x, y, 5, 0, Math.PI * 2);
        context.value.fillStyle = 'blue';
        context.value.fill();
        context.value.closePath();
      }
    }

    // Si un point est survolé, dessiner sa trajectoire en vert
    if (hoveredPointId.value !== null) {
      const point = formStore.points.find((p) => p.id === hoveredPointId.value);
      if (point && point.trajectory && point.trajectory.length > 0) {
        drawTrajectory(point.trajectory, 'green');
      }
    }

    // Dessiner la trajectoire en cours ou non enregistrée si needsRefresh est true
    if (needsRefresh.value && formStore.trajectory && formStore.trajectory.length > 0) {
      // Si en mode dessin, dessiner la prévisualisation de la ligne
      if (drawingStage.value === 'placingCross') {
        const fromX = formStore.x;
        const fromY = formStore.y;
        const toX = mousePosition.value.x;
        const toY = mousePosition.value.y;

        // Dessiner le cercle
        drawTrajectory(formStore.trajectory, 'red');

        // Dessiner la ligne
        context.value.beginPath();
        context.value.moveTo(fromX, fromY);
        context.value.lineTo(toX, toY);
        context.value.strokeStyle = 'red';
        context.value.stroke();
        context.value.closePath();

        // Dessiner la croix à la position de la souris
        drawCross(toX, toY, 'red');
      } else {
        drawTrajectory(formStore.trajectory, 'red');
      }
    }
  }
};

// Fonction pour dessiner une trajectoire
const drawTrajectory = (trajectory: any[], color: string) => {
  if (!context.value) return;

  context.value.strokeStyle = color;

  for (const shape of trajectory) {
    context.value.beginPath();
    switch (shape.shape) {
      case 'circle':
        context.value.arc(shape.x, shape.y, shape.radius || 0, 0, Math.PI * 2);
        context.value.stroke();
        break;
      case 'line':
        context.value.moveTo(shape.x, shape.y);
        context.value.lineTo(shape.endX || 0, shape.endY || 0);
        context.value.stroke();
        break;
      case 'cross':
        drawCross(shape.x, shape.y, color);
        break;
      default:
        // Si la forme n'est pas reconnue, dessiner un point
        context.value.arc(shape.x, shape.y, 5, 0, Math.PI * 2);
        context.value.fillStyle = color;
        context.value.fill();
        break;
    }
    context.value.closePath();
  }
};

// Fonction pour dessiner une croix
const drawCross = (x: number, y: number, color: string) => {
  const size = 10;
  context.value.beginPath();
  context.value.moveTo(x - size, y - size);
  context.value.lineTo(x + size, y + size);
  context.value.moveTo(x + size, y - size);
  context.value.lineTo(x - size, y + size);
  context.value.strokeStyle = color;
  context.value.stroke();
  context.value.closePath();
};

// Gestion des événements de la souris
const handleMouseMove = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  const mouseX = (event.clientX - rect.left) / scaleX;
  const mouseY = (event.clientY - rect.top) / scaleY;

  mousePosition.value = { x: mouseX, y: mouseY };

  if (drawingStage.value === 'placingCross') {
    drawCanvas();
    return;
  }

  let pointFound = false;

  for (const point of formStore.points) {
    const dx = mouseX - point.x;
    const dy = mouseY - point.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 16) {
      // Définir l'ID du point survolé
      hoveredPointId.value = point.id;
      pointFound = true;
      break;
    }
  }

  if (!pointFound) {
    // Aucun point survolé
    hoveredPointId.value = null;
  }

  drawCanvas();
};

const handleCanvasClick = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  const x = (event.clientX - rect.left) / scaleX;
  const y = (event.clientY - rect.top) / scaleY;

  if (drawingStage.value === 'placingCross') {
    // L'utilisateur place la croix
    crossPosition.value = { x, y };

    // Ajouter la ligne et la croix à la trajectoire
    formStore.addPointToTrajectory('line', formStore.x, formStore.y, undefined, x, y);
    formStore.addPointToTrajectory('cross', x, y);

    // Passer à l'étape "finished" pour indiquer que le dessin est terminé mais pas encore enregistré
    drawingStage.value = 'finished';

    drawCanvas();
  } else if (drawingStage.value === 'finished') {
    // L'utilisateur enregistre le point
    const newId = formStore.points.length > 0 ? formStore.points[formStore.points.length - 1].id + 1 : 0;

    const newPoint = {
      id: newId,
      x: formStore.x,
      y: formStore.y,
      selectedAbility: formStore.selectedAbility,
      type: formStore.type,
      difficulty: formStore.difficulty,
      youtubeLink: formStore.youtubeLink,
      trajectory: [...formStore.trajectory],
    };

    // Ajouter le point au store
    formStore.addPoint(newPoint);

    // Réinitialiser le formulaire après l'ajout
    formStore.resetForm();

    // Réinitialiser les variables de dessin
    drawingStage.value = 'none';
    crossPosition.value = null;
    mousePosition.value = { x: 0, y: 0 };
    needsRefresh.value = false; // Désactiver l'affichage de la trajectoire

    drawCanvas();
  } else {
    // Vérifier si un point interactif est cliqué
    for (const point of formStore.points) {
      const dx = x - point.x;
      const dy = y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 16) {
        // Émettre un événement avec l'ID du point
        emit('lineupClicked', point.id);
        break;
      }
    }
  }
};

const setCoordinatesFromClick = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const { scaleX, scaleY } = getScaleFactors();
  const x = Math.floor((event.clientX - rect.left) / scaleX);
  const y = Math.floor((event.clientY - rect.top) / scaleY);
  formStore.setCoordinates(x, y);
};

// Émettre l'événement 'lineupClicked'
const emit = defineEmits<{
  (e: 'lineupClicked', lineupId: number): void;
}>();
</script>

<style scoped>
canvas {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
}
</style>
