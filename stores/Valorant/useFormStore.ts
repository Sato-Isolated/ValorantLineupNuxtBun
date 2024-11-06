import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  
  state: () => ({
    id: 0,
    x: 0,
    y: 0,
    selectedAbility: '',
    type: '',
    difficulty: '',
    youtubeLink: '',
    trajectory: [] as Array<{ x: number; y: number; shape: string; radius?: number; endX?: number; endY?: number }>,
    isDrawingEnabled: false // Nouvelle variable
  }),
  actions: {
    
    setCoordinates(x: number, y: number) {
      this.x = x;
      this.y = y;
    },
    addPointToTrajectory(shape: string, x: number, y: number, radius?: number, endX?: number, endY?: number) {
      this.trajectory.push({ shape, x, y, radius, endX, endY });
    },
    drawCircleTrajectory() {
      // Ajoute un cercle avec les coordonnées actuelles du formulaire et un rayon de 25
      this.addPointToTrajectory('circle', this.x, this.y, 25);
      this.isDrawingEnabled = true; // Met sur true
    },
    resetForm() {
      this.id = 0; // Réinitialise l'identifiant
      this.x = 0;
      this.y = 0;
      this.selectedAbility = '';
      this.type = '';
      this.difficulty = '';
      this.youtubeLink = '';
      this.trajectory = [];
    },
    setId(id: number) {
      this.id = id;
    }
  }
});