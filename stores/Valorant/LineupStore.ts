import { defineStore } from 'pinia';

// Interfaces pour typer les données
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

interface LineupsByMap {
  [mapName: string]: Lineup[];
}

interface LineupsByAgent {
  [agentName: string]: LineupsByMap;
}

// Définition du store
export const useLineupStore = defineStore('lineup', {
  state: () => ({
    lineups: {} as LineupsByAgent,
    nextId: 1,
  }),

  getters: {
    // Récupère les lineups pour un agent et une map spécifiques
    getLineupsByAgentAndMap: (state) => (agent: string, map: string): Lineup[] => {
      return state.lineups[agent]?.[map] || [];
    },

    // Vérifie si des lineups existent pour un agent et une map
    hasLineups: (state) => (agent: string, map: string): boolean => {
      return !!state.lineups[agent]?.[map]?.length;
    },
  },

  actions: {
    // Ajoute un nouveau lineup
    addLineup(agent: string, map: string, lineup: Omit<Lineup, 'id' | 'agent' | 'map'>) {
      if (!this.lineups[agent]) {
        this.lineups[agent] = {};
      }
      if (!this.lineups[agent][map]) {
        this.lineups[agent][map] = [];
      }

      const newLineup: Lineup = {
        ...lineup,
        id: this.nextId++,
        agent,
        map
      };

      this.lineups[agent][map].push(newLineup);
      this.saveToLocalStorage();
      
      return newLineup;
    },

    // Met à jour un lineup existant
    updateLineup(agent: string, map: string, lineup: Lineup) {
      const lineups = this.lineups[agent]?.[map];
      if (!lineups) return false;

      const index = lineups.findIndex(l => l.id === lineup.id);
      if (index === -1) return false;

      lineups[index] = lineup;
      this.saveToLocalStorage();
      
      return true;
    },

    // Supprime un lineup
    deleteLineup(agent: string, map: string, lineupId: number) {
      const lineups = this.lineups[agent]?.[map];
      if (!lineups) return false;

      const index = lineups.findIndex(l => l.id === lineupId);
      if (index === -1) return false;

      lineups.splice(index, 1);
      this.saveToLocalStorage();
      
      return true;
    },

    // Supprime tous les lineups d'une map pour un agent
    clearLineups(agent: string, map: string) {
      if (this.lineups[agent]) {
        this.lineups[agent][map] = [];
        this.saveToLocalStorage();
      }
    },

    // Sauvegarde les données dans le localStorage
    saveToLocalStorage() {
      localStorage.setItem('valorant_lineups', JSON.stringify({
        lineups: this.lineups,
        nextId: this.nextId,
      }));
    },

    // Charge les données depuis le localStorage
    loadFromLocalStorage() {
      const stored = localStorage.getItem('valorant_lineups');
      if (stored) {
        const data = JSON.parse(stored);
        this.lineups = data.lineups;
        this.nextId = data.nextId;
      }
    },

    // Importe des lineups depuis un fichier JSON
    importLineups(importedLineups: Lineup[]) {
      // Assure la validité des données importées
      if (!Array.isArray(importedLineups)) {
        throw new Error('Les données importées doivent être un tableau de lineups');
      }

      // Pour chaque lineup importé
      importedLineups.forEach(lineup => {
        // Vérifie si le lineup a toutes les propriétés requises
        if (!this.isValidLineup(lineup)) {
          console.warn('Lineup invalide ignoré:', lineup);
          return;
        }

        // Détermine l'agent et la map à partir des données (à adapter selon votre structure)
        const agent = lineup.agent || 'default';
        const map = lineup.map || 'default';

        // Ajoute le lineup en utilisant l'action existante
        this.addLineup(agent, map, {
          position: lineup.position,
          windowPosition: lineup.windowPosition,
          isWindowOpen: lineup.isWindowOpen,
          description: lineup.description,
          youtubeUrl: lineup.youtubeUrl,
          selectedAbility: lineup.selectedAbility,
          type: lineup.type
        });
      });

      // Sauvegarde les changements
      this.saveToLocalStorage();
    },

    // Vérifie si un lineup est valide
    isValidLineup(lineup: any): lineup is Lineup {
      return (
        lineup &&
        typeof lineup.position === 'object' &&
        typeof lineup.windowPosition === 'object' &&
        typeof lineup.isWindowOpen === 'boolean' &&
        typeof lineup.description === 'string' &&
        typeof lineup.youtubeUrl === 'string' &&
        typeof lineup.selectedAbility === 'string' &&
        (lineup.type === 'attaque' || lineup.type === 'defense')
      );
    },

    // Initialise le store au démarrage
    init() {
      this.loadFromLocalStorage();
    },
  },
});
