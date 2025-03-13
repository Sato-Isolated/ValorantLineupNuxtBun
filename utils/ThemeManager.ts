// Gestionnaire de thèmes Valorant
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

// Configuration des thèmes
const THEME_KEY = 'valorant-theme';

interface AgentTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
}

const AGENT_THEMES: Record<string, AgentTheme> = {
  dark: {
    name: 'Sombre',
    primaryColor: '#FF4655',
    secondaryColor: '#768079',
    backgroundColor: '#0F1923',
    textColor: '#FFFFFF',
    accentColor: '#FF8F9E',
    gradientStart: '#FF4655',
    gradientEnd: '#FF8F9E'
  },
  jett: {
    name: 'Jett',
    primaryColor: '#7AB7E7',
    secondaryColor: '#B5E6FF',
    backgroundColor: '#1B2B3B',
    textColor: '#FFFFFF',
    accentColor: '#88C5FF',
    gradientStart: '#7AB7E7',
    gradientEnd: '#B5E6FF'
  },
  phoenix: {
    name: 'Phoenix',
    primaryColor: '#FF4655',
    secondaryColor: '#FFA559',
    backgroundColor: '#251419',
    textColor: '#FFFFFF',
    accentColor: '#FF8F73',
    gradientStart: '#FF4655',
    gradientEnd: '#FFA559'
  },
  viper: {
    name: 'Viper',
    primaryColor: '#00FF87',
    secondaryColor: '#2F4F4F',
    backgroundColor: '#0F1F1A',
    textColor: '#FFFFFF',
    accentColor: '#4AE6B5',
    gradientStart: '#00FF87',
    gradientEnd: '#4AE6B5'
  },
  sage: {
    name: 'Sage',
    primaryColor: '#67EACA',
    secondaryColor: '#B5E6D8',
    backgroundColor: '#1B322F',
    textColor: '#FFFFFF',
    accentColor: '#9DECD9',
    gradientStart: '#67EACA',
    gradientEnd: '#B5E6D8'
  }
};

const THEMES = Object.keys(AGENT_THEMES) as Array<keyof typeof AGENT_THEMES>;
type Theme = keyof typeof AGENT_THEMES;

export class ThemeManager {
  theme: Ref<Theme>;
  selectedTheme: Ref<Theme>;
  private initialized = false;

  constructor(defaultTheme: Theme = 'dark') {
    this.theme = ref<Theme>(defaultTheme);
    this.selectedTheme = ref<Theme>(defaultTheme);
    
    if (process.client && !this.initialized) {
      const savedTheme = this.loadThemeFromStorage();
      this.selectedTheme.value = savedTheme || defaultTheme;
      this.theme.value = this.selectedTheme.value;
      this.applyTheme(this.selectedTheme.value);
      this.initialize();
    }
  }

  loadThemeFromStorage(): Theme | null {
    if (!process.client) return null;
    
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
    if (savedTheme && savedTheme in AGENT_THEMES) {
      return savedTheme;
    }
    return null;
  }

  applyTheme(theme: Theme) {
    if (process.client && theme in AGENT_THEMES) {
      const themeConfig = AGENT_THEMES[theme];
      
      // Suppression des classes de thème existantes
      THEMES.forEach(t => document.documentElement.classList.remove(`theme-${t}`));
      
      // Application du nouveau thème
      document.documentElement.classList.add(`theme-${theme}`);
      
      // Mise à jour des variables CSS
      const root = document.documentElement;
      const primaryRGB = this.hexToRGB(themeConfig.primaryColor);
      const secondaryRGB = this.hexToRGB(themeConfig.backgroundColor);

      // Application des couleurs principales
      root.style.setProperty('--color-primary', themeConfig.primaryColor);
      root.style.setProperty('--color-secondary', themeConfig.backgroundColor);
      root.style.setProperty('--color-text', themeConfig.textColor);
      root.style.setProperty('--color-accent', themeConfig.accentColor);

      // Application des couleurs RGB
      if (primaryRGB) {
        root.style.setProperty('--color-primary-rgb', primaryRGB.join(', '));
      }
      if (secondaryRGB) {
        root.style.setProperty('--color-secondary-rgb', secondaryRGB.join(', '));
      }

      // Application des dégradés et effets
      root.style.setProperty('--gradient-primary', `linear-gradient(45deg, ${themeConfig.gradientStart}, ${themeConfig.gradientEnd})`);
      root.style.setProperty('--border-primary', `rgba(${primaryRGB?.join(', ') || '255, 70, 85'}, 0.2)`);
      root.style.setProperty('--overlay-primary', `rgba(${primaryRGB?.join(', ') || '255, 70, 85'}, 0.1)`);
      
      localStorage.setItem(THEME_KEY, theme);
    }
  }

  private hexToRGB(hex: string): number[] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  initialize() {
    if (process.client && !this.initialized) {
      // Application immédiate du thème sauvegardé ou par défaut
      this.applyTheme(this.selectedTheme.value);

      // Surveillance des changements de thème
      watch(this.selectedTheme, (newTheme) => {
        this.theme.value = newTheme;
        this.applyTheme(newTheme);
      }, { immediate: true });
      
      this.initialized = true;
    }
  }

  changeTheme() {
    const currentIndex = THEMES.indexOf(this.selectedTheme.value);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    this.selectedTheme.value = THEMES[nextIndex];
  }
}
