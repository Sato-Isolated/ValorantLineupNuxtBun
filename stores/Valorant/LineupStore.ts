import { defineStore } from 'pinia';

export const useMyLineupStoreStore = defineStore({
  id: 'myLineupStoreStore',
  state: () => ({
    lineups: [] as any[]
  }),
  actions: {
    addLineup(lineup: any) {
      if (!lineup || lineup.id === undefined) {
        console.error('Objet lineup invalide:', lineup);
        return;
      }
      this.lineups.push(lineup);
    },
    removeLineup(index: number) {
      if (index < 0 || index >= this.lineups.length) {
        console.warn('Index de suppression invalide:', index);
        return;
      }
      this.lineups.splice(index, 1);
    },
    getLineupById(id: number) {
      const lineup = this.lineups.find(lineup => lineup.id === id);
      if (!lineup) {
        console.warn(`Aucun lineup trouvé avec l'ID: ${id}`);
      }
      return lineup;
    }
  }
});
