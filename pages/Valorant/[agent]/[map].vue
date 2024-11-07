<template>
  <div :class="[theme, 'grid-container']">
    <div class="header">
      <div class="header-body">
        <div class="header-content">
          <img @click="goToHomePage" src="/images/Valorant/Logo.webp" alt="Logo de La Brousse" />
          <h1 @click="goToHomePage">La brousse</h1>
        </div>
        <div class="carousel-wrapper">
          <!-- Carousel Agents -->
          <div class="carousel-container">
            <div class="carousel agents-carousel">
              <div class="carousel-item">
                <img @click="goToSelectAgent" :src="agentImage ?? ''" alt="Agent Image" width="82" height="82" />
              </div>
            </div>
          </div>

          <!-- Carousel Maps -->
          <div class="carousel-container">
            <div class="carousel maps-carousel">
              <div class="carousel-item">
                <img @click="goToSelectMap" :src="LoadingMapImage" width="82" height="82" alt="Map Image" />
              </div>
            </div>
          </div>
        </div>
        <div class="switch-mode">
          <button @click="selectedMap && mapStore.toggleMode(selectedMap)">
            Mode : {{ mapStore.isAttackMode ? 'Attaque' : 'Défense' }}
          </button>
        </div>
      </div>
    </div>
    <main class="main-body">
      <div class="main-content">
        <div class="map-container">
          <CanvasImage @lineupClicked="openLineupView" />
        </div>
      </div>
      <FloatingMenu :class="[theme]"/>
    </main>
    <footer class="footer-body">
      <div class="footer-content">
        <a href="https://github.com/Sato-Isolated" target="_blank" rel="noopener noreferrer">Made with ❤️ By <em>Mindlated</em></a>
      </div>
      <div class="combotheme">
        <label for="theme-select">Choisir un thème :</label>
        <select id="theme-select" v-model="selectedTheme" @change="changeTheme">
          <option value="dark">Sombre</option>
          <option value="pastel-dark">Pastel Sombre</option>
        </select>
      </div>
    </footer>
    <div v-for="(lineup, index) in selectedLineups" :key="index">
    <LineupView :lineupId="lineup.id" @close="closeLineup(index)" />
  </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CanvasImage from '~/components/Valorant/CanvasImage.vue';
import FloatingMenu from '~/components/Valorant/FloatingMenu.vue';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useMapStore } from '~/stores/Valorant/mapStore';
import { useMyLineupStoreStore } from '~/stores/Valorant/LineupStore';

const router = useRouter();
const agentStore = useAgentStore();
const mapStore = useMapStore();
const lineupStore = useMyLineupStoreStore();
const selectedAgent = agentStore.selectedAgent;
const agentImage = agentStore.selectedAgentImage;
const selectedMap = agentStore.selectedMap;
const LoadingMapImage = agentStore.selectedMapImage ?? '';


const selectedLineups = ref<any[]>([]); // Tableau pour stocker les lineups sélectionnés

import { ThemeManager } from '~/utils/ThemeManager';
// Gestion du thème
const themeManager = new ThemeManager('pastel-dark');
themeManager.initialize();

// Liaison des valeurs de thème pour l'interface utilisateur
const theme = themeManager.theme;
const selectedTheme = themeManager.selectedTheme;
const changeTheme = () => themeManager.changeTheme();

// Charger le thème depuis le localStorage lors du montage
onMounted(() => {
  if (selectedMap) {
    mapStore.updateMapInteractiveSide(selectedMap);
  }
});

// Navigation vers la page d'accueil
function goToHomePage() {
  console.log("\n==== Navigation: Home Page ====");
  agentStore.resetStore();
  mapStore.resetStore();
  router.push({ path: '/Valorant/' });
}

// Navigation vers la sélection de l'agent
function goToSelectAgent() {
  console.log("\n==== Navigation: Agent Selection ====");
  router.push({ path: '/Valorant/select-agent' });
}

// Navigation vers la sélection de la carte pour un agent
function goToSelectMap() {
  console.log(`\n==== Navigation: Map Selection for Agent ====\nSelected Agent: ${selectedAgent}`);
  router.push({ path: `/Valorant/${selectedAgent}/select-map` });
}

const selectedLineupId = ref<number | null>(null); // Stocke l'ID du lineup sélectionné

// Fonction pour ouvrir la vue du lineup sélectionné
function openLineupView(lineupId: number) {
  selectedLineupId.value = lineupId;
  const lineupData = lineupStore.getLineupById(lineupId);
  if (lineupData && !selectedLineups.value.includes(lineupData)) {
    selectedLineups.value.push(lineupData);
  }
}

// Fonction pour fermer un lineup
function closeLineup(index: number) {
  selectedLineups.value.splice(index, 1);
}
</script>


<style scoped>
@import '@styles/Valorant/pages/InteractiveMap.css';
</style>
