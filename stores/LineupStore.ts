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
      console.log('Ajout du lineup avec ID:', lineup.id);
      this.lineups.push(lineup);
      console.log('État actuel des lineups:', this.lineups);
    },
    removeLineup(index: number) {
      console.log('Suppression du lineup à l\'index:', index);
      this.lineups.splice(index, 1);
      console.log('État actuel des lineups:', this.lineups);
    },
    getLineupById(id: number) {
      console.log('Recherche du lineup avec ID:', id);
      const lineup = this.lineups.find(lineup => lineup.id === id);
      if (!lineup) {
        console.warn(`Aucun lineup trouvé avec l'ID: ${id}`);
      } else {
        console.log('Lineup trouvé:', lineup);
      }
      return lineup;
    }
  }
});
