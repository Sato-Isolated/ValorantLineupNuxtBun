// Store Pinia pour la gestion de la map sélectionnée
import { defineStore } from 'pinia';

interface MapState {
  selectedMap: string;
}

export const useMapStore = defineStore('map', {
  // État initial
  state: (): MapState => ({
    selectedMap: ''
  }),

  // Getters
  getters: {
    // Vérifie si une map est sélectionnée
    hasSelectedMap: (state) => state.selectedMap !== '',
    // Retourne la map sélectionnée
    getSelectedMap: (state) => state.selectedMap
  },

  // Actions
  actions: {
    // Définit la map sélectionnée
    setMap(mapName: string) {
      this.selectedMap = mapName;
    },
    // Réinitialise la map sélectionnée
    clearMap() {
      this.selectedMap = '';
    }
  },

  // Configuration de la persistance
  persist: true
});