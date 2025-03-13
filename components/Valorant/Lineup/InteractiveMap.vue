<template>
  <div class="map-container">
    <!-- Overlay de chargement -->
    <div class="loading-overlay" v-if="isLoading || hasError">
      <div v-if="!hasError" class="loading-spinner"></div>
      <p class="loading-text">
        {{ hasError ? "Erreur de chargement de la carte" : "Chargement de la carte..." }}
      </p>
      <button v-if="hasError" class="retry-button" @click="retryLoading">
        Réessayer
      </button>
    </div>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un lineup..."
        class="search-input"
      />
      <div class="filter-group">
        <label>
          <input 
            type="checkbox" 
            v-model="filters.attack"
          /> Attaque
        </label>
        <label>
          <input 
            type="checkbox" 
            v-model="filters.defense"
          /> Défense
        </label>
      </div>
    </div>

    <!-- Carte interactive avec zoom -->
    <div 
      class="map-wrapper" 
      ref="mapWrapper"
      :style="{ transform: `scale(${zoom})` }"
      @wheel="handleZoom"
    >
      <img 
        ref="mapImageRef"
        :src="mapImageUrl"
        @load="onMapImageLoad"
        @error="onMapLoadError"
        class="map-image"
        :alt="currentMap"
        draggable="false"
      />

      <!-- Nodes -->
      <Node
        v-for="lineup in filteredLineups"
        :key="lineup.id"
        :lineup="lineup"
        :is-selected="lineup.isWindowOpen"
        @click="$emit('node-click', lineup)"
      />

      <!-- Zone de clic pour ajouter des nodes -->
      <div 
        v-if="isEditMode"
        class="click-zone"
        @click="handleMapClick"
      ></div>
    </div>

    <!-- Contrôles de zoom -->
    <div class="zoom-controls">
      <button @click="adjustZoom(-0.1)" class="zoom-btn" title="Zoom arrière">
        <i class="fas fa-minus"></i>
      </button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="adjustZoom(0.1)" class="zoom-btn" title="Zoom avant">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Contrôles de tri -->
    <div class="sort-controls">
      <select v-model="sortBy" class="sort-select">
        <option value="type">Trier par type</option>
        <option value="ability">Trier par capacité</option>
        <option value="date">Trier par date</option>
      </select>
      <button @click="toggleSortOrder" class="sort-order-btn" :title="sortOrder === 'asc' ? 'Croissant' : 'Décroissant'">
        <i class="fas" :class="sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import Node from './Node.vue';

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
  lineups: Lineup[];
  currentMap: string;
  isEditMode: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'add-node', x: number, y: number): void;
  (e: 'node-click', lineup: Lineup): void;
}>();

// Refs
const mapWrapper = ref<HTMLDivElement | null>(null);
const mapImageRef = ref<HTMLImageElement | null>(null);
const isLoading = ref(true);
const hasError = ref(false);
const loadAttempts = ref(0);
const maxLoadAttempts = 3;

// État du zoom
const zoom = ref(1);
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

// État du tri
const sortBy = ref('type');
const sortOrder = ref<'asc' | 'desc'>('asc');

// État de la recherche
const searchQuery = ref('');
const filters = reactive({
  attack: true,
  defense: true
});

// Computed
const mapImageUrl = computed(() => `/images/Valorant/Map Interactive/${props.currentMap}.webp`);

// Computed pour les lineups triés
const sortedLineups = computed(() => {
  let sorted = [...props.lineups];
  
  switch (sortBy.value) {
    case 'type':
      sorted.sort((a, b) => {
        const compare = a.type.localeCompare(b.type);
        return sortOrder.value === 'asc' ? compare : -compare;
      });
      break;
    case 'ability':
      sorted.sort((a, b) => {
        const compare = a.selectedAbility.localeCompare(b.selectedAbility);
        return sortOrder.value === 'asc' ? compare : -compare;
      });
      break;
    case 'date':
      sorted.sort((a, b) => {
        const compare = a.id - b.id;
        return sortOrder.value === 'asc' ? compare : -compare;
      });
      break;
  }
  
  return sorted;
});

// Computed avec recherche et filtres
const filteredLineups = computed(() => {
  let filtered = props.lineups;

  // Filtrage par type
  filtered = filtered.filter(lineup => {
    if (lineup.type === 'attaque' && !filters.attack) return false;
    if (lineup.type === 'defense' && !filters.defense) return false;
    return true;
  });

  // Filtrage par recherche
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(lineup => 
      lineup.description.toLowerCase().includes(query) ||
      lineup.selectedAbility.toLowerCase().includes(query)
    );
  }

  // Application du tri
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'type':
        const compare = a.type.localeCompare(b.type);
        return sortOrder.value === 'asc' ? compare : -compare;
      case 'ability':
        const compareAbility = a.selectedAbility.localeCompare(b.selectedAbility);
        return sortOrder.value === 'asc' ? compareAbility : -compareAbility;
      default:
        const compareId = a.id - b.id;
        return sortOrder.value === 'asc' ? compareId : -compareId;
    }
  });
});

// Watch pour réinitialiser le chargement quand la map change
watch(() => props.currentMap, () => {
  isLoading.value = true;
  hasError.value = false;
  loadAttempts.value = 0;
});

// Methods
const onMapImageLoad = () => {
  isLoading.value = false;
  hasError.value = false;
  loadAttempts.value = 0;
};

const onMapLoadError = () => {
  loadAttempts.value++;
  if (loadAttempts.value >= maxLoadAttempts) {
    isLoading.value = false;
    hasError.value = true;
  } else {
    // Réessayer le chargement après un court délai
    setTimeout(() => {
      if (mapImageRef.value) {
        mapImageRef.value.src = mapImageUrl.value + '?retry=' + loadAttempts.value;
      }
    }, 1000);
  }
};

const retryLoading = () => {
  isLoading.value = true;
  hasError.value = false;
  loadAttempts.value = 0;
  if (mapImageRef.value) {
    mapImageRef.value.src = mapImageUrl.value + '?retry=' + Date.now();
  }
};

const handleMapClick = (e: MouseEvent) => {
  if (!props.isEditMode || !mapWrapper.value || !mapImageRef.value) return;

  const rect = mapWrapper.value.getBoundingClientRect();
  const image = mapImageRef.value;
  
  // Ajustement des coordonnées en prenant en compte le zoom
  const zoomFactor = zoom.value;
  const scaleX = image.naturalWidth / (image.width * zoomFactor);
  const scaleY = image.naturalHeight / (image.height * zoomFactor);
  
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  emit('add-node', x, y);
};

// Gestion du zoom
const handleZoom = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    adjustZoom(delta);
  }
};

const adjustZoom = (delta: number) => {
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom.value + delta));
  zoom.value = Number(newZoom.toFixed(1));
};

// Gestion du tri
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  width: 1024px;
  height: 1024px;
  overflow: hidden;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-height: 1200px) {
    width: min(1024px, 90vh);
    height: min(1024px, 90vh);
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 25, 35, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 10;

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 70, 85, 0.3);
    border-top-color: #ff4655;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: #fff;
    font-size: 1.2rem;
  }
}

.map-wrapper {
  position: relative;
  width: 1024px;
  height: 1024px;
  transform-origin: center center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
  
  // Utilisation de transform3d pour la GPU acceleration
  transform: scale3d(var(--zoom, 1), var(--zoom, 1), 1);
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);

  .map-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  .click-zone {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: crosshair;
    z-index: 1;
    touch-action: none;
  }
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 70, 85, 0.2);
  border: 1px solid rgba(255, 70, 85, 0.5);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 70, 85, 0.3);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.zoom-controls {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--component-bg);
  padding: 0.5rem;
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);
  z-index: 2;

  .zoom-btn {
    background: none;
    border: 1px solid var(--border-primary);
    color: var(--color-text);
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--overlay-light);
    }
  }

  .zoom-level {
    min-width: 60px;
    text-align: center;
    color: var(--color-text);
  }
}

.sort-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--component-bg);
  padding: 0.5rem;
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);
  z-index: 2;

  .sort-select {
    background: none;
    border: 1px solid var(--border-primary);
    color: var(--color-text);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--overlay-light);
    }
  }

  .sort-order-btn {
    background: none;
    border: 1px solid var(--border-primary);
    color: var(--color-text);
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--overlay-light);
    }
  }
}

.search-bar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--component-bg);
  padding: 1rem;
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);
  min-width: 200px;

  .search-input {
    padding: 0.5rem;
    border: 1px solid var(--border-primary);
    border-radius: 4px;
    background: var(--overlay-light);
    color: var(--color-text);
    width: 100%;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  .filter-group {
    display: flex;
    gap: 1rem;
    color: var(--color-text);

    label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      cursor: pointer;
      user-select: none;

      input[type="checkbox"] {
        accent-color: var(--color-primary);
      }
    }
  }
}

// Adaptation pour mobile
@media (max-width: 768px) {
  .search-bar {
    position: fixed;
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    min-width: 0;
  }
}
</style>