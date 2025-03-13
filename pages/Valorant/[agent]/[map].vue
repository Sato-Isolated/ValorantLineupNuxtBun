<template>
  <div class="grid-container">
    <HeaderValorant :show-carousel="true" />
    
    <main class="main-content">
      <!-- État de chargement -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement de la page...</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="hasError" class="error-state">
        <p>{{ errorMessage }}</p>
        <button @click="reloadPage" class="retry-button">Réessayer</button>
      </div>

      <!-- Contenu principal -->
      <div 
        v-else-if="selectedAgent && currentMap" 
        class="map-container"
        :class="{
          'attack-mode': isAttackMode,
          'defense-mode': !isAttackMode
        }"
      >
        <!-- Carte interactive -->
        <InteractiveMap
          :lineups="lineups"
          :current-map="currentMap"
          :is-edit-mode="isEditMode"
          @node-click="openNodeWindow"
          @add-node="addNode"
          @error="handleMapError"
        />

        <!-- Fenêtres des nodes -->
        <NodeWindow
          v-for="lineup in lineups"
          :key="'window-' + lineup.id"
          :lineup="lineup"
          :abilities="agentAbilities"
          :is-open="lineup.isWindowOpen"
          @update:lineup="updateLineup($event)"
          @close="closeNodeWindow(lineup)"
          @save="saveNodeData(lineup)"
          @delete="deleteNode(lineup)"
          @start-drag="startDragging($event, lineup)"
        />

        <!-- Contrôles -->
        <MapControls
          :lineups="lineups"
          :is-edit-mode="isEditMode"
          :is-attack-mode="isAttackMode"
          @toggle-edit="toggleEditMode"
          @clear-all="clearNodes"
          @save-all="saveAllNodes"
          @toggle-mode="toggleMode"
        />
      </div>
    </main>

    <FooterValorant />

    <!-- Composants UI -->
    <NotificationToast 
      v-bind="notification"
    />

    <GuideOverlay
      :show="showGuide"
      :shortcuts="KEYBOARD_SHORTCUTS"
      @close="closeGuide"
    />

    <RecentLineups 
      :lineups="recentLineups"
    />

    <NewFeaturesModal
      :features="
        [
          { icon: 'fa-search', description: 'Recherche et filtrage des lineups' },
          { icon: 'fa-star', description: 'Favoris pour retrouver vos lineups préférés' },
          { icon: 'fa-expand', description: 'Mode plein écran pour les vidéos' },
          { icon: 'fa-search-plus', description: 'Zoom sur la carte interactive' }
        ]
      "
      v-model:hasSeenFeatures="hasSeenNewFeatures"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useLineupStore } from '~/stores/Valorant/lineupStore';
import { useAbilitiesStore } from '~/stores/Valorant/abilitiesStore';
import { useEventListener } from '@vueuse/core';

// Chargement optimisé des composants
const LoadingComponent = defineAsyncComponent(() => import('~/components/Valorant/LoadingComponent.vue'));

// Options de chargement asynchrone améliorées
const loadingOptions = {
  loadingComponent: LoadingComponent,
  delay: 0,
  timeout: 30000,
  errorComponent: {
    template: `
      <div class="async-error">
        <i class="fas fa-exclamation-circle"></i>
        <p>Erreur de chargement du composant</p>
        <button @click="$emit('retry')">Réessayer</button>
      </div>
    `,
    props: ['error'],
    emits: ['retry']
  },
  onError: (error: Error, retry: () => void, fail: () => void) => {
    console.error('Erreur de chargement du composant:', error);
    showNotification('Erreur de chargement d\'un composant. Réessayez.', 'error');
  }
};

const InteractiveMap = defineAsyncComponent(() => import('~/components/Valorant/Lineup/InteractiveMap.vue'));
const NodeWindow = defineAsyncComponent(() => import('~/components/Valorant/Lineup/NodeWindow.vue'));
const MapControls = defineAsyncComponent(() => import('~/components/Valorant/Lineup/MapControls.vue'));
const HeaderValorant = defineAsyncComponent(() => import('~/components/Valorant/HeaderValorant.vue'));
const FooterValorant = defineAsyncComponent(() => import('~/components/Valorant/FooterValorant.vue'));
const TutorialOverlay = defineAsyncComponent(() => import('~/components/Valorant/Lineup/TutorialOverlay.vue'));

// Imports des nouveaux composants
const NotificationToast = defineAsyncComponent(() => import('~/components/Valorant/UI/NotificationToast.vue'));
const NewFeaturesModal = defineAsyncComponent(() => import('~/components/Valorant/UI/NewFeaturesModal.vue'));
const GuideOverlay = defineAsyncComponent(() => import('~/components/Valorant/UI/GuideOverlay.vue'));
const RecentLineups = defineAsyncComponent(() => import('~/components/Valorant/Lineup/RecentLineups.vue'));

// Types et interfaces
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

// États et stores
const route = useRoute();
const router = useRouter();
const agentStore = useAgentStore();
const lineupStore = useLineupStore();
const abilitiesStore = useAbilitiesStore();

// État global de la page
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('Une erreur est survenue');
const isInitialized = ref(false);

// États de l'interface utilisateur
const isEditMode = ref(false);
const isAttackMode = ref(true);
const showRecent = ref(false);

// État du drag & drop
const isDragging = ref(false);
const draggedNode = ref<Lineup | null>(null);
const dragOffset = ref({ x: 0, y: 0 });

// Constantes pour les messages
const MESSAGES = {
  CONFIRM_DELETE: 'Êtes-vous sûr de vouloir supprimer tous les nœuds ?',
  SAVE_SUCCESS: 'Lineups sauvegardés avec succès',
  DELETE_SUCCESS: 'Tous les nœuds ont été supprimés',
  ERROR_GENERIC: 'Une erreur est survenue',
  ERROR_INIT: 'Erreur lors de l\'initialisation',
  ERROR_SAVE: 'Erreur lors de la sauvegarde'
};

// État des notifications avec type strict
const notification = reactive<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>({
  show: false,
  message: '',
  type: 'info'
});

// Constantes pour les raccourcis clavier
// Mise à jour des raccourcis clavier avec descriptions
const KEYBOARD_SHORTCUTS = {
  TOGGLE_EDIT: { key: 'e', description: 'Activer/désactiver le mode édition' },
  TOGGLE_MODE: { key: 'm', description: 'Changer le mode attaque/défense' },
  SAVE: { key: 's', description: 'Sauvegarder les changements' },
  CLEAR: { key: 'Delete', description: 'Supprimer tous les nœuds' }
} as const;

// État pour le guide utilisateur
const showGuide = ref(!localStorage.getItem('hasSeenGuide'));
const hasSeenGuide = ref(false);

// Gestion des raccourcis clavier avec useEventListener au lieu de useKeyboard
useEventListener('keydown', (e: KeyboardEvent) => {
  // Ignore les raccourcis si l'utilisateur tape du texte
  if (document.activeElement?.tagName === 'INPUT' || 
      document.activeElement?.tagName === 'TEXTAREA') {
    return;
  }

  if (e.key.toLowerCase() === KEYBOARD_SHORTCUTS.TOGGLE_EDIT.key) {
    toggleEditMode();
  }
  if (e.key.toLowerCase() === KEYBOARD_SHORTCUTS.TOGGLE_MODE.key) {
    toggleMode();
  }
  if (e.key.toLowerCase() === KEYBOARD_SHORTCUTS.SAVE.key && isEditMode.value) {
    saveAllNodes();
  }
  if (e.key === KEYBOARD_SHORTCUTS.CLEAR.key && isEditMode.value) {
    clearNodes();
  }
});

// Fermeture du guide
const closeGuide = () => {
  showGuide.value = false;
  hasSeenGuide.value = true;
  localStorage.setItem('hasSeenGuide', 'true');
};

// Historique des derniers lineups consultés
const recentLineups = ref<Array<{ agent: string; map: string; date: number }>>(
  JSON.parse(localStorage.getItem('recentLineups') || '[]')
);

// Mise à jour de l'historique
onMounted(() => {
  const currentLineup = {
    agent: selectedAgent.value,
    map: currentMap.value,
    date: Date.now()
  };

  recentLineups.value = [
    currentLineup,
    ...recentLineups.value.filter(l => 
      l.agent !== currentLineup.agent || l.map !== currentLineup.map
    )
  ].slice(0, 5); // Garde les 5 derniers

  localStorage.setItem('recentLineups', JSON.stringify(recentLineups.value));
});

// Computed properties
const selectedAgent = computed(() => agentStore.getSelectedAgent);
const currentMap = computed(() => route.params.map as string);
const lineups = computed(() => 
  lineupStore.getLineupsByAgentAndMap(selectedAgent.value, currentMap.value)
);
const agentAbilities = computed(() => 
  abilitiesStore.getAgentAbilities(selectedAgent.value)
);

// Initialisation et gestion du cycle de vie
onMounted(async () => {
  try {
    // Vérification de l'agent sélectionné
    if (!agentStore.hasSelectedAgent) {
      await router.push('/valorant/select-agent');
      return;
    }

    // Initialisation des données
    if (selectedAgent.value && currentMap.value && !isInitialized.value) {
      await lineupStore.init();
      isInitialized.value = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
});

// Gestion des mises à jour des données
watch([selectedAgent, currentMap], async ([newAgent, newMap], [oldAgent, oldMap]) => {
  if (
    newAgent && 
    newMap && 
    (newAgent !== oldAgent || newMap !== oldMap)
  ) {
    try {
      isLoading.value = true;
      await lineupStore.init();
      isInitialized.value = true;
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
}, { immediate: false });

// Gestion des erreurs
const handleError = (error: unknown) => {
  console.error('Erreur:', error);
  hasError.value = true;
  errorMessage.value = error instanceof Error 
    ? error.message 
    : MESSAGES.ERROR_GENERIC;
  showNotification(errorMessage.value, 'error');
};

const handleMapError = (error: string) => {
  hasError.value = true;
  errorMessage.value = error;
};

const reloadPage = () => {
  hasError.value = false;
  isLoading.value = true;
  window.location.reload();
};

// Gestion des nodes
const addNode = (x: number, y: number) => {
  const newLineup: Omit<Lineup, 'id'> = {
    position: { x, y },
    windowPosition: { x: x + 20, y: y + 20 },
    isWindowOpen: true,
    description: '',
    youtubeUrl: '',
    selectedAbility: '',
    type: isAttackMode.value ? 'attaque' : 'defense',
    agent: selectedAgent.value,
    map: currentMap.value
  };

  lineupStore.addLineup(selectedAgent.value, currentMap.value, newLineup);
};

const updateLineup = (lineup: Lineup) => {
  lineupStore.updateLineup(selectedAgent.value, currentMap.value, lineup);
};

const openNodeWindow = (lineup: Lineup) => {
  // Ferme toutes les autres fenêtres
  lineups.value.forEach(l => {
    if (l.id !== lineup.id) {
      l.isWindowOpen = false;
      updateLineup(l);
    }
  });
  
  lineup.isWindowOpen = true;
  updateLineup(lineup);
};

const closeNodeWindow = (lineup: Lineup) => {
  lineup.isWindowOpen = false;
  updateLineup(lineup);
};

const deleteNode = (lineup: Lineup) => {
  lineupStore.deleteLineup(selectedAgent.value, currentMap.value, lineup.id);
};

// Gestion du drag & drop
const startDragging = (e: MouseEvent, lineup: Lineup) => {
  if (e.button !== 0) return; // Uniquement clic gauche
  
  e.preventDefault();
  e.stopPropagation();
  
  isDragging.value = true;
  draggedNode.value = lineup;

  const windowElement = (e.target as HTMLElement).closest('.node-window');
  if (!windowElement) return;
  
  const rect = windowElement.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  document.addEventListener('mousemove', handleDrag, { passive: true });
  document.addEventListener('mouseup', stopDragging);
  document.body.style.cursor = 'grabbing';

  // Application du style de transition au début du drag
  if (windowElement instanceof HTMLElement) {
    windowElement.style.transition = 'none';
    windowElement.style.animation = 'none';
  }
};

// Utilitaire debounce pour éviter les actions multiples
const debounce = (fn: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

// Base function for drag handling
const handleDragBase = (e: MouseEvent) => {
  if (!isDragging.value || !draggedNode.value) return;

  // Utilisation de requestAnimationFrame pour une animation plus fluide
  requestAnimationFrame(() => {
    const x = e.clientX - dragOffset.value.x;
    const y = e.clientY - dragOffset.value.y;

    // Mise à jour fluide de la position
    draggedNode.value.windowPosition = {
      x,
      y
    };
  });
};

// Version optimisée du debounce avec RAF
const debouncedUpdateLineup = (() => {
  let frame: number;
  return (lineup: Lineup) => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      updateLineup(lineup);
    });
  };
})();

// Version debounced des fonctions fréquemment appelées
const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value || !draggedNode.value) return;
  
  e.preventDefault();
  const node = draggedNode.value; // Store reference to avoid multiple null checks
  
  const windowElement = document.querySelector('.node-window');
  if (!windowElement) return;
  
  node.windowPosition = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  };
  
  updateLineup(node);
};

// Amélioration de l'arrêt du drag
const stopDragging = () => {
  const windowElement = document.querySelector('.node-window');
  
  if (windowElement instanceof HTMLElement) {
    // Réactivation des transitions pour un arrêt en douceur
    windowElement.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
  }

  if (draggedNode.value) {
    updateLineup(draggedNode.value);
  }
  
  isDragging.value = false;
  draggedNode.value = null;

  // Nettoyage des listeners et style
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
  document.body.style.cursor = '';
};

// Gestion de la sauvegarde
const saveNodeData = (lineup: Lineup) => {
  updateLineup(lineup);
};

const saveAllNodes = async () => {
  try {
    await lineupStore.saveToLocalStorage();
    showNotification(MESSAGES.SAVE_SUCCESS, 'success');
  } catch (error) {
    console.error('Erreur de sauvegarde:', error);
    showNotification(MESSAGES.ERROR_SAVE, 'error');
  }
};

const clearNodes = async () => {
  if (confirm(MESSAGES.CONFIRM_DELETE)) {
    try {
      await lineupStore.clearLineups(selectedAgent.value, currentMap.value);
      showNotification(MESSAGES.DELETE_SUCCESS, 'success');
    } catch (error) {
      console.error('Erreur de suppression:', error);
      showNotification(MESSAGES.ERROR_GENERIC, 'error');
    }
  }
};

// Toggle des modes
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

const toggleMode = () => {
  isAttackMode.value = !isAttackMode.value;
};

// Nettoyage des événements et optimisation
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
  // Nettoyage des fenêtres ouvertes
  lineups.value?.forEach(lineup => {
    if (lineup.isWindowOpen) {
      lineup.isWindowOpen = false;
      updateLineup(lineup);
    }
  });
});

// Fonction utilitaire pour afficher les notifications
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notification.show = true;
  notification.message = message;
  notification.type = type;
  
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

// État du tutoriel et des nouvelles fonctionnalités
const showTutorial = ref(!localStorage.getItem('tutorialCompleted'));
const hasSeenNewFeatures = ref(!!localStorage.getItem('hasSeenNewFeatures'));
const showingNewFeatures = ref(false);

// Gestion du tutoriel
const closeTutorial = () => {
  showTutorial.value = false;
};

// Gestion des nouvelles fonctionnalités
const showNewFeatures = () => {
  showingNewFeatures.value = true;
};

const closeNewFeatures = () => {
  showingNewFeatures.value = false;
  hasSeenNewFeatures.value = true;
  localStorage.setItem('hasSeenNewFeatures', 'true');
};

</script>

<style lang="scss" scoped>
.grid-container {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: var(--background-color, #0f1923);
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
}

// États de chargement et d'erreur
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-text);

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 70, 85, 0.3);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.retry-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 70, 85, 0.2);
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 70, 85, 0.3);
  }
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &.attack-mode,
  &.defense-mode {
    transition: background-color 0.3s ease;
  }

  &.attack-mode {
    background-color: rgba(255, 70, 85, 0.05);
  }

  &.defense-mode {
    background-color: rgba(46, 213, 115, 0.05);
  }
}

// Styles pour les notifications
.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  
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

  // Amélioration de l'animation
  transform-origin: bottom right;
  animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

// Guide utilisateur
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  .guide-content {
    background: var(--component-bg);
    padding: 2rem;
    border-radius: var(--card-radius);
    border: 1px solid var(--border-primary);
    max-width: 90vw;
    width: 400px;

    h2 {
      color: var(--color-text);
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      text-align: center;
    }

    .guide-shortcuts {
      margin-bottom: 2rem;

      h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 0.5rem;
          color: var(--color-text);

          kbd {
            background: var(--color-primary);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            margin-right: 0.5rem;
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}

// Historique récent (mobile)
.recent-lineups-mobile {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  z-index: 90;

  @media (min-width: 769px) {
    display: none;
  }

  .toggle-recent {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--component-bg);
    border: 1px solid var(--border-primary);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .recent-content {
    position: absolute;
    bottom: 100%;
    right: 0;
    background: var(--component-bg);
    border: 1px solid var(--border-primary);
    border-radius: var(--card-radius);
    padding: 1rem;
    margin-bottom: 0.5rem;
    width: 200px;
    animation: slideUp 0.3s ease;

    h3 {
      color: var(--color-text);
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .recent-item {
        color: var(--color-text);
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background: var(--overlay-light);
        }
      }
    }
  }
}

// Styles pour les nouvelles fonctionnalités
.new-features-badge {
  position: fixed;
  right: 1rem;
  bottom: 5rem;
  background: var(--color-primary);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: pulse 2s infinite;
  z-index: 90;

  i {
    animation: star-spin 2s infinite;
  }
}

.new-features-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  .modal-content {
    background: var(--component-bg);
    padding: 2rem;
    border-radius: var(--card-radius);
    border: 1px solid var(--border-primary);
    max-width: 90vw;
    width: 400px;

    h2 {
      color: var(--color-primary);
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      text-align: center;
    }

    ul {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;

      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--color-text);
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;

        i {
          color: var(--color-primary);
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        &:hover {
          background: var(--overlay-light);
        }
      }
    }

    .close-btn {
      width: 100%;
      padding: 0.75rem;
      background: var(--color-primary);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--color-primary-dark);
      }
    }
  }
}

// Style du composant d'erreur asynchrone
.async-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-text);

  i {
    color: var(--color-error);
    font-size: 2rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--color-primary-dark);
    }
  }
}

// Animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes star-spin {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(20deg); }
  40% { transform: rotate(-20deg); }
  60% { transform: rotate(10deg); }
  80% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}
</style>
