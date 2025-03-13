import { defineStore } from 'pinia';

// Interface pour les capacités
interface Ability {
  name: string;
  icon: string;
  key: string;
}

// Interface pour les capacités d'un agent
interface AgentAbilities {
  [agentName: string]: Ability[];
}

// Store pour gérer les capacités des agents
export const useAbilitiesStore = defineStore('abilities', {
  state: () => ({
    abilities: {
      jett: [
        { name: 'Updraft', icon: '/images/Valorant/Abilities/Jett_Ability1.webp', key: 'Q' },
        { name: 'Tailwind', icon: '/images/Valorant/Abilities/Jett_Ability2.webp', key: 'E' },
        { name: 'Cloudburst', icon: '/images/Valorant/Abilities/Jett_Grenade.webp', key: 'C' },
        { name: 'Blade Storm', icon: '/images/Valorant/Abilities/Jett_Ultimate.webp', key: 'X' }
      ],
      // Autres agents à ajouter
    } as AgentAbilities
  }),

  getters: {
    // Récupère les capacités d'un agent spécifique
    getAgentAbilities: (state) => (agent: string): Ability[] => {
      return state.abilities[agent.toLowerCase()] || [];
    },

    // Vérifie si les capacités d'un agent sont disponibles
    hasAgentAbilities: (state) => (agent: string): boolean => {
      return !!state.abilities[agent.toLowerCase()];
    }
  },

  actions: {
    // Ajoute les capacités d'un nouvel agent
    addAgentAbilities(agent: string, abilities: Ability[]) {
      this.abilities[agent.toLowerCase()] = abilities;
    }
  }
});