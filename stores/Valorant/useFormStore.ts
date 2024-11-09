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
    trajectory: [] as Array<any>,
    points: [] as Array<any>,
    isDrawingEnabled: false,
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
      this.addPointToTrajectory('circle', this.x, this.y, 25);
      this.isDrawingEnabled = true;
    },
    resetForm() {
      this.id = 0;
      this.x = 0;
      this.y = 0;
      this.selectedAbility = '';
      this.type = '';
      this.difficulty = '';
      this.youtubeLink = '';
      this.trajectory = [];
      this.isDrawingEnabled = false;
    },
    setId(id: number) {
      this.id = id;
    },
    addPoint(point: any) {
      this.points.push(point);
    },
  },
});
