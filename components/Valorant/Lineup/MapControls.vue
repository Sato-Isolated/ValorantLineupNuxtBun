<template>
  <div class="controls-container">
    <!-- Mode édition toggle -->
    <div class="edit-mode-toggle">
      <button class="edit-btn" @click="$emit('toggle-edit')">
        <i class="fas" :class="isEditMode ? 'fa-lock-open' : 'fa-lock'"></i>
        {{ isEditMode ? 'Mode Édition' : 'Mode Lecture' }}
      </button>
    </div>

    <!-- Contrôles d'édition -->
    <div class="controls" v-if="isEditMode">
      <button class="control-btn" @click="$emit('clear-all')">
        <i class="fas fa-trash"></i>
        Effacer tout
      </button>
      <button class="control-btn" @click="$emit('save-all')">
        <i class="fas fa-save"></i>
        Sauvegarder
      </button>
      <button class="control-btn" @click="$emit('toggle-mode')">
        <i class="fas" :class="isAttackMode ? 'fa-shield-halved' : 'fa-bomb'"></i>
        {{ isAttackMode ? 'Mode Défense' : 'Mode Attaque' }}
      </button>
    </div>
  </div>

  <div class="map-controls">
    <div class="controls-group">
      <!-- Toggle du mode édition -->
      <button 
        class="control-btn"
        :class="{ active: isEditMode }"
        @click="$emit('toggle-edit')"
        title="Mode édition (E)"
      >
        <i class="fas fa-edit"></i>
      </button>

      <!-- Toggle du mode attaque/défense -->
      <button 
        class="control-btn"
        :class="{ 'attack': isAttackMode, 'defense': !isAttackMode }"
        @click="$emit('toggle-mode')"
        title="Changer de mode (M)"
      >
        <i class="fas" :class="isAttackMode ? 'fa-shield-alt' : 'fa-crosshairs'"></i>
      </button>

      <!-- Actions supplémentaires -->
      <div class="dropdown">
        <button 
          class="control-btn"
          @click="showActions = !showActions"
          title="Plus d'actions"
        >
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div v-if="showActions" class="dropdown-menu">
          <!-- Export des lineups -->
          <button 
            class="dropdown-item"
            @click="exportLineups"
          >
            <i class="fas fa-file-export"></i>
            Exporter les lineups
          </button>

          <!-- Import des lineups -->
          <label class="dropdown-item">
            <i class="fas fa-file-import"></i>
            Importer des lineups
            <input 
              type="file" 
              accept=".json"
              @change="importLineups"
              class="file-input"
            >
          </label>

          <!-- Statistiques -->
          <button 
            class="dropdown-item"
            @click="showStats = true"
          >
            <i class="fas fa-chart-bar"></i>
            Statistiques
          </button>

          <!-- Mode présentation -->
          <button 
            class="dropdown-item"
            @click="$emit('toggle-presentation')"
          >
            <i class="fas fa-tv"></i>
            Mode présentation
          </button>

          <div class="dropdown-divider"></div>

          <!-- Sauvegarder -->
          <button 
            class="dropdown-item"
            @click="$emit('save-all')"
          >
            <i class="fas fa-save"></i>
            Sauvegarder (S)
          </button>

          <!-- Effacer tout -->
          <button 
            class="dropdown-item danger"
            @click="$emit('clear-all')"
          >
            <i class="fas fa-trash"></i>
            Tout effacer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal des statistiques -->
    <div v-if="showStats" class="stats-modal">
      <div class="modal-content">
        <h3>Statistiques des lineups</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.attack }}</span>
            <span class="stat-label">Attaque</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.defense }}</span>
            <span class="stat-label">Défense</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.lastEdit }}</span>
            <span class="stat-label">Dernière modification</span>
          </div>
        </div>
        <button @click="showStats = false" class="close-btn">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Interfaces
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
  lastModified?: number;
  agent: string;
  map: string;
}

// Props avec valeurs par défaut
const props = withDefaults(defineProps<{
  lineups: Lineup[];
  isEditMode: boolean;
  isAttackMode: boolean;
}>(), {
  lineups: () => [],
  isEditMode: false,
  isAttackMode: true
});

// Émits
const emit = defineEmits<{
  (e: 'toggle-edit'): void;
  (e: 'toggle-mode'): void;
  (e: 'save-all'): void;
  (e: 'clear-all'): void;
  (e: 'toggle-presentation'): void;
}>();

import { ref, computed } from 'vue';
import { useLineupStore } from '~/stores/Valorant/lineupStore';

// État local
const showActions = ref(false);
const showStats = ref(false);

// Store
const lineupStore = useLineupStore();

// Statistiques
const stats = computed(() => {
  const lineups = props.lineups || [];
  return {
    total: lineups.length,
    attack: lineups.filter(l => l.type === 'attaque').length,
    defense: lineups.filter(l => l.type === 'defense').length,
    lastEdit: lineups.length > 0 
      ? new Date(Math.max(...lineups.map(l => l.lastModified || 0))).toLocaleDateString()
      : 'Aucune modification'
  };
});

// Export des lineups
const exportLineups = () => {
  try {
    const data = JSON.stringify(props.lineups, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lineups_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
  }
};

// Import des lineups
const importLineups = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const content = e.target?.result as string;
      const importedLineups = JSON.parse(content);
      await lineupStore.importLineups(importedLineups);
      showActions.value = false;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
    }
  };

  reader.readAsText(file);
};
</script>

<style lang="scss" scoped>
.controls-container {
  position: fixed;
  top: 100px; // Position sous le header
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 4;
  background: var(--component-bg);
  padding: 1rem;
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);
  box-shadow: var(--card-shadow);

  .edit-mode-toggle {
    margin-bottom: 0.5rem;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.control-btn,
.edit-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(15, 25, 35, 0.95);
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  width: 100%;
  justify-content: center;

  &:hover {
    background: rgba(255, 70, 85, 0.2);
    border-color: #ff4655;
  }

  i {
    font-size: 1.1rem;
  }
}

// Media queries pour la réactivité
@media (max-width: 768px) {
  .controls-container {
    top: auto;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    flex-direction: row;
    justify-content: center;
    
    .controls {
      flex-direction: row;
    }
  }

  .control-btn,
  .edit-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

.map-controls {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

.controls-group {
  display: flex;
  gap: 0.5rem;
  background: var(--component-bg);
  padding: 0.5rem;
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--overlay-light);
  }

  &.active {
    background: var(--color-primary);
    color: #fff;
  }

  &.attack {
    color: var(--color-attack);
  }

  &.defense {
    color: var(--color-defense);
  }
}

.dropdown {
  position: relative;

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: var(--component-bg);
    border: 1px solid var(--border-primary);
    border-radius: var(--card-radius);
    padding: 0.5rem;
    min-width: 200px;
    animation: slideIn 0.2s ease;

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem;
      border: none;
      background: none;
      color: var(--color-text);
      cursor: pointer;
      text-align: left;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--overlay-light);
      }

      &.danger {
        color: var(--color-error);

        &:hover {
          background: rgba(var(--color-error-rgb), 0.1);
        }
      }

      i {
        width: 20px;
        text-align: center;
      }
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-primary);
      margin: 0.5rem 0;
    }
  }
}

.file-input {
  display: none;
}

.stats-modal {
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

    h3 {
      color: var(--color-text);
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 1.2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;

      .stat-item {
        text-align: center;
        padding: 1rem;
        background: var(--overlay-light);
        border-radius: var(--card-radius);
        border: 1px solid var(--border-primary);

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--color-text);
          font-size: 0.9rem;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>