// Store Pinia pour la gestion de l'agent sélectionné
import { defineStore } from 'pinia';

interface AgentState {
  selectedAgent: string;
}

export const useAgentStore = defineStore('agent', {
  // État initial
  state: (): AgentState => ({
    selectedAgent: ''
  }),

  // Getters
  getters: {
    // Vérifie si un agent est sélectionné
    hasSelectedAgent: (state) => state.selectedAgent !== '',
    // Retourne l'agent sélectionné
    getSelectedAgent: (state) => state.selectedAgent
  },

  // Actions
  actions: {
    // Définit l'agent sélectionné
    setAgent(agentName: string) {
      this.selectedAgent = agentName;
    },
    // Réinitialise l'agent sélectionné
    clearAgent() {
      this.selectedAgent = '';
    }
  },

  // Configuration de la persistance
  persist: true
});