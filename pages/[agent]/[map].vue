<template>
  <div :class="[theme, 'grid-container']">
    <div class="header">
      <div class="header-body">
        <div class="header-content">
          <img @click="goToHomePage" src="/images/Logo.webp" alt="Logo de La Brousse" />
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
      <FloatingMenu/>
    </main>
    <footer class="footer-body">
      <div class="footer-content">
        Made with ❤️ By <em>Where Is My Kuronami???</em>
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
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import CanvasImage from '~/components/CanvasImage.vue';
import FloatingMenu from '@/components/FloatingMenu.vue';
import { useAgentStore } from '~/stores/agentStore';
import { useMapStore } from '~/stores/mapStore';
import { useMyLineupStoreStore } from '~/stores/LineupStore';

const router = useRouter();
const agentStore = useAgentStore();
const mapStore = useMapStore();
const lineupStore = useMyLineupStoreStore();
const selectedAgent = agentStore.selectedAgent;
const agentImage = agentStore.selectedAgentImage;
const selectedMap = agentStore.selectedMap;
const LoadingMapImage = agentStore.selectedMapImage ?? '';

const theme = ref('dark');
const selectedTheme = ref('dark');
const selectedLineups = ref<any[]>([]); // Tableau pour stocker les lineups sélectionnés

// Fonction pour changer de thème et sauvegarder dans le localStorage
function changeTheme() {
  if (import.meta.client) {
    theme.value = selectedTheme.value;
    localStorage.setItem('theme', selectedTheme.value);
    applyTheme(selectedTheme.value);
  }
}

// Fonction pour appliquer le thème en changeant la classe du body
function applyTheme(theme: string) {
  document.body.className = theme;
}

// Charger le thème du localStorage une fois que le composant est monté côté client
onMounted(() => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      selectedTheme.value = savedTheme;
      theme.value = savedTheme;
      applyTheme(savedTheme);
    }
  }

  nextTick(() => {
    changeTheme();
  });

  if (selectedMap) {
    mapStore.updateMapInteractiveSide(selectedMap);
  }
});

function goToHomePage() {
  console.log("\n==== Navigation: Home Page ====");
  agentStore.resetStore();
  mapStore.resetStore();
  router.push({ name: 'index' });
}

function goToSelectAgent() {
  console.log("\n==== Navigation: Agent Selection ====");
  router.push({ name: 'select-agent' });
}

function goToSelectMap() {
  console.log(`\n==== Navigation: Map Selection for Agent ====\nSelected Agent: ${selectedAgent}`);
  router.push({ path: `/${selectedAgent}/select-map` });
}

const selectedLineupId = ref<number | null>(null); // Store the selected lineup ID

function openLineupView(lineupId: number) {
  selectedLineupId.value = lineupId;
  const lineupData = lineupStore.getLineupById(lineupId);
  if (lineupData && !selectedLineups.value.includes(lineupData)) {
    selectedLineups.value.push(lineupData);
  }
}


function closeLineup(index: number) {
  selectedLineups.value.splice(index, 1);
}
</script>

<style scoped>
@import '../../assets/styles/pages/InteractiveMap.css';
</style>
