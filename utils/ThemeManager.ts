// ~/utils/ThemeManager.ts
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';

export class ThemeManager {
  theme: Ref<string>;
  selectedTheme: Ref<string>;

  constructor(initialTheme: string = 'pastel-dark') {
    this.theme = ref(initialTheme);
    this.selectedTheme = ref(initialTheme);
  }

  applyTheme(theme: string) {
    document.body.className = theme;
  }

  loadThemeFromStorage() {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.selectedTheme.value = savedTheme;
        this.theme.value = savedTheme;
        this.applyTheme(savedTheme);
      }
    }
  }

  saveThemeToStorage() {
    if (import.meta.client) {
      localStorage.setItem('theme', this.selectedTheme.value);
    }
  }

  changeTheme() {
    this.theme.value = this.selectedTheme.value;
    this.saveThemeToStorage();
    this.applyTheme(this.selectedTheme.value);
  }

  initialize() {
    onMounted(() => {
      this.loadThemeFromStorage();
    });
  }
}
