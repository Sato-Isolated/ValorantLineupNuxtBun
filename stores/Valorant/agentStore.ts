import { defineStore } from 'pinia';

export const useAgentStore = defineStore('agent', {
  state: () => ({
    selectedAgent: null as string | null,
    selectedAgentImage: null as string | null,
    selectedMap: null as string | null,
    selectedMapImage: null as string | null,
    selectedInteractMap: null as string | null,
  }),
  actions: {
    setAgent(agentName: string, agentImage:string) {
      this.selectedAgent = agentName;
      this.selectedAgentImage = agentImage;
    },
    setMap(mapName: string, mapImage: string, interactMap: string) {
      this.selectedMap = mapName;
      this.selectedMapImage = mapImage;
      this.selectedInteractMap = interactMap;
    },
    // Action pour réinitialiser le store
    resetStore() {
      this.selectedAgent = null;
      this.selectedAgentImage = null;
      this.selectedMap = null;
      this.selectedMapImage = null;
      this.selectedInteractMap = null;
    },
  },
  persist: true,
});