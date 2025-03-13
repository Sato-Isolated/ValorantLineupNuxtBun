<template>
  <div class="filter-sort-toolbar">
    <div class="search-section">
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un lineup..."
        class="search-input"
        @input="emitFilters"
      />
    </div>

    <div class="filter-section">
      <label>
        <input 
          type="checkbox" 
          v-model="filters.attack"
          @change="emitFilters"
        /> Attaque
      </label>
      <label>
        <input 
          type="checkbox" 
          v-model="filters.defense"
          @change="emitFilters"
        /> Défense
      </label>
    </div>

    <div class="sort-section">
      <select v-model="sortConfig.by" @change="emitSort" class="sort-select">
        <option value="type">Trier par type</option>
        <option value="ability">Trier par capacité</option>
        <option value="date">Trier par date</option>
      </select>
      <button 
        @click="toggleSortOrder" 
        class="sort-order-btn"
        :title="sortConfig.order === 'asc' ? 'Croissant' : 'Décroissant'"
      >
        <i class="fas" :class="sortConfig.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// État local
const searchQuery = ref('');
const filters = reactive({
  attack: true,
  defense: true
});
const sortConfig = reactive({
  by: 'type',
  order: 'asc' as 'asc' | 'desc'
});

// Émits
const emit = defineEmits<{
  (e: 'filter', filters: { search: string; attack: boolean; defense: boolean }): void;
  (e: 'sort', config: { by: string; order: 'asc' | 'desc' }): void;
}>();

// Méthodes
const emitFilters = () => {
  emit('filter', {
    search: searchQuery.value,
    attack: filters.attack,
    defense: filters.defense
  });
};

const emitSort = () => {
  emit('sort', sortConfig);
};

const toggleSortOrder = () => {
  sortConfig.order = sortConfig.order === 'asc' ? 'desc' : 'asc';
  emitSort();
};
</script>

<style lang="scss" scoped>
.filter-sort-toolbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--component-bg);
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .search-section {
    flex: 1;

    .search-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-primary);
      border-radius: 4px;
      background: var(--overlay-light);
      color: var(--color-text);

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
  }

  .filter-section {
    display: flex;
    gap: 1rem;
    align-items: center;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text);
      cursor: pointer;
      user-select: none;

      input[type="checkbox"] {
        accent-color: var(--color-primary);
      }
    }
  }

  .sort-section {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    .sort-select {
      background: none;
      border: 1px solid var(--border-primary);
      color: var(--color-text);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;

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
      transition: transform 0.2s ease;

      &:hover {
        background: var(--overlay-light);
      }

      i {
        transition: transform 0.2s ease;
      }
    }
  }
}
</style>