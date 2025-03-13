<template>
  <div 
    class="node-window"
    :class="{ active: isOpen }"
    :style="{ 
      transform: `translate3d(${lineup.windowPosition.x}px, ${lineup.windowPosition.y}px, 0)`,
      willChange: isDragging ? 'transform' : 'auto'
    }"
    v-show="isOpen"
  >
    <div class="window-header" @mousedown="$emit('startDrag', $event)">
      <div class="window-title">
        <h3>Lineup #{{ lineup.id }}</h3>
        <button 
          class="favorite-btn"
          :class="{ 'is-favorite': lineup.isFavorite }"
          @click="toggleFavorite"
          :title="lineup.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <i class="fas" :class="lineup.isFavorite ? 'fa-star' : 'fa-star-o'"></i>
        </button>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="window-content">
      <div class="input-group">
        <label>Description:</label>
        <input 
          type="text" 
          :value="lineup.description"
          @input="updateLineup('description', ($event.target as HTMLInputElement).value)"
          placeholder="Description du lineup..."
        >
      </div>

      <div class="input-group">
        <label>Vidéo YouTube:</label>
        <input 
          type="text" 
          :value="lineup.youtubeUrl"
          @input="updateLineup('youtubeUrl', ($event.target as HTMLInputElement).value)"
          placeholder="URL de la vidéo..."
        >
      </div>

      <div 
        class="video-preview" 
        v-if="lineup.youtubeUrl && embedUrl"
        :class="{ fullscreen: isFullscreen }"
      >
        <div class="video-container">
          <iframe
            :src="embedUrl"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <button 
          v-if="!isFullscreen"
          class="fullscreen-btn"
          @click="toggleFullscreen"
          title="Mode plein écran"
        >
          <i class="fas fa-expand"></i>
        </button>
        <button 
          v-else
          class="close-fullscreen"
          @click="toggleFullscreen"
          title="Quitter le plein écran"
        >
          <i class="fas fa-compress"></i>
        </button>
      </div>

      <div class="abilities-group">
        <label>Capacité:</label>
        <div class="abilities-list">
          <button 
            v-for="ability in abilities"
            :key="ability.name"
            class="ability-btn"
            :class="{ active: lineup.selectedAbility === ability.name }"
            @click="updateLineup('selectedAbility', ability.name)"
          >
            <img :src="ability.icon" :alt="ability.name">
          </button>
        </div>
      </div>

      <div class="actions">
        <button class="save-btn" @click="$emit('save')">
          <i class="fas fa-save"></i> Sauvegarder
        </button>
        <button class="delete-btn" @click="$emit('delete')">
          <i class="fas fa-trash"></i> Supprimer
        </button>
      </div>
    </div>
  </div>

  <!-- Liste des favoris -->
  <div v-if="showFavorites" class="favorites-panel">
    <div class="favorites-header">
      <h3>Lineups favoris</h3>
      <button class="close-favorites" @click="showFavorites = false">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="favorites-list">
      <div v-if="favoriteLineups.length === 0" class="no-favorites">
        Aucun lineup favori
      </div>
      <div 
        v-for="favorite in favoriteLineups" 
        :key="favorite.id"
        class="favorite-item"
        @click="navigateToLineup(favorite)"
      >
        <div class="favorite-info">
          <span class="agent">{{ favorite.agent }}</span>
          <span class="map">{{ favorite.map }}</span>
        </div>
        <div class="favorite-description">
          {{ favorite.description || 'Sans description' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Services
const router = useRouter();
const route = useRoute();

// Récupération de l'agent et de la map actuels
const currentAgent = computed(() => route.params.agent as string);
const currentMap = computed(() => route.params.map as string);

// Types étendus pour les favoris
interface FavoriteLineup {
  id: number;
  agent: string;
  map: string;
  description?: string;
}

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
}

interface Ability {
  name: string;
  icon: string;
}

// Props étendues
interface Props {
  lineup: Lineup & { isFavorite?: boolean };
  abilities: Ability[];
  isOpen: boolean;
  isDragging?: boolean;
}

const props = defineProps<Props>();

// Émits étendus
const emit = defineEmits<{
  (e: 'update:lineup', value: Lineup): void;
  (e: 'close'): void;
  (e: 'save'): void;
  (e: 'delete'): void;
  (e: 'startDrag', event: MouseEvent): void;
}>();

// Computed
const embedUrl = computed(() => {
  const videoId = extractYoutubeVideoId(props.lineup.youtubeUrl);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
});

// État des favoris
const showFavorites = ref(false);
const favoriteLineups = ref(JSON.parse(localStorage.getItem('favoriteLineups') || '[]'));

// État du mode plein écran
const isFullscreen = ref(false);

// Methods
const extractYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const updateLineup = (key: keyof Lineup, value: any) => {
  emit('update:lineup', { 
    ...props.lineup, 
    [key]: value 
  });
};

// Gestion des favoris mise à jour
const toggleFavorite = () => {
  const updatedLineup = {
    ...props.lineup,
    isFavorite: !props.lineup.isFavorite
  };

  // Mise à jour du localStorage
  const favorites = favoriteLineups.value;
  if (updatedLineup.isFavorite) {
    favorites.push({
      id: updatedLineup.id,
      agent: currentAgent.value,
      map: currentMap.value,
      description: updatedLineup.description
    });
  } else {
    const index = favorites.findIndex((f: FavoriteLineup) => f.id === updatedLineup.id);
    if (index !== -1) {
      favorites.splice(index, 1);
    }
  }

  localStorage.setItem('favoriteLineups', JSON.stringify(favorites));
  favoriteLineups.value = favorites;

  emit('update:lineup', updatedLineup);
};

// Toggle du mode plein écran
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  // Ajout/suppression de la classe pour bloquer le scroll du body
  document.body.style.overflow = isFullscreen.value ? 'hidden' : '';
};

// Nettoyage lors de la fermeture
onUnmounted(() => {
  if (isFullscreen.value) {
    document.body.style.overflow = '';
  }
});

// Navigation vers un lineup favori
const navigateToLineup = (favorite: any) => {
  router.push(`/valorant/${favorite.agent.toLowerCase()}/${favorite.map.toLowerCase()}`);
};
</script>

<style lang="scss" scoped>
.node-window {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  background: rgba(15, 25, 35, 0.95);
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 3;
  transform-origin: center;
  pointer-events: auto;
  touch-action: none;
  backface-visibility: hidden;
  
  // Amélioration des performances avec les propriétés GPU-accelerated
  transform-style: preserve-3d;
  backface-visibility: hidden;
  perspective: 1000px;

  // Optimisation des transitions
  transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1);
  will-change: transform;

  &.is-dragging {
    transition: none;
    cursor: grabbing;
    
    * {
      cursor: grabbing;
    }
  }

  // Amélioration de l'interaction
  &:hover {
    .window-header {
      cursor: grab;
    }
  }

  &:active {
    .window-header {
      cursor: grabbing;
    }
  }

  &.active {
    will-change: transform;
  }

  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(255, 70, 85, 0.1);
    cursor: move;

    h3 {
      margin: 0;
      color: #fff;
      font-size: 1rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s ease;

      &:hover {
        color: #ff4655;
      }
    }
  }

  .window-content {
    padding: 1rem;

    .input-group {
      margin-bottom: 1rem;

      label {
        display: block;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      input {
        width: 100%;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #fff;

        &:focus {
          outline: none;
          border-color: #ff4655;
        }
      }
    }

    .video-preview {
      margin-top: 1rem;
      position: relative;

      &.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1100;
        margin: 0;
        background: rgba(0, 0, 0, 0.9);
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .video-container {
          width: 100%;
          max-width: 1280px;
          aspect-ratio: 16/9;
        }

        .close-fullscreen {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;

        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }

      .fullscreen-btn {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        color: #fff;
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 2;

        &:hover {
          background: rgba(0, 0, 0, 0.7);
        }
      }
    }

    .abilities-group {
      margin-bottom: 1rem;

      label {
        display: block;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .abilities-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        .ability-btn {
          width: 40px;
          height: 40px;
          padding: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          &.active {
            border-color: #ff4655;
            box-shadow: 0 0 0 2px rgba(255, 70, 85, 0.3);
          }

          &:hover {
            border-color: #ff4655;
          }
        }
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;

      button {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        &.save-btn {
          background: #ff4655;
          color: #fff;

          &:hover {
            background: darken(#ff4655, 10%);
          }
        }

        &.delete-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ff4655;

          &:hover {
            background: rgba(255, 70, 85, 0.2);
          }
        }
      }
    }
  }
}

// ...existing styles...

.favorite-btn {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.is-favorite {
    color: var(--color-primary);
  }
}

.favorites-panel {
  position: fixed;
  top: var(--header-height);
  right: 0;
  width: 300px;
  height: calc(100vh - var(--header-height));
  background: var(--component-bg);
  border-left: 1px solid var(--border-primary);
  padding: 1rem;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease;

  &.active {
    transform: translateX(0);
  }

  .favorites-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      color: var(--color-text);
      font-size: 1.2rem;
    }
  }

  .favorites-list {
    overflow-y: auto;
    height: calc(100% - 3rem);

    .favorite-item {
      padding: 1rem;
      border: 1px solid var(--border-primary);
      border-radius: var(--card-radius);
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--overlay-light);
      }

      .favorite-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;

        .agent {
          color: var(--color-primary);
          font-weight: 600;
        }

        .map {
          color: var(--color-text-secondary);
        }
      }

      .favorite-description {
        font-size: 0.85rem;
        color: var(--color-text);
        opacity: 0.8;
      }
    }
  }
}

// ...existing styles...
</style>