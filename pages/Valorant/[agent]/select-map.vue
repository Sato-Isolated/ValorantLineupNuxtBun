<template>
  <div :class="[theme, 'grid-container']">
    <div class="header">
      <div class="header-body">
        <div class="header-content">
          <img @click="goToHomePage" src="/images/Valorant/Logo.webp"  rel="preload" alt="Logo de La Brousse" />
          <h1 @click="goToHomePage">La brousse</h1>
        </div>
        <div class="carousel-wrapper">
          <!-- Carousel Agents -->
          <div class="carousel-container">
            <div class="carousel agents-carousel">
              <div class="carousel-item">
                <img @click="goToPreviousPage" :src="agentImage" rel="preload" alt="Agent Image" />
              </div>
            </div>
          </div>

          <!-- Carousel Maps -->
          <div class="carousel-container">
            <div class="carousel maps-carousel">
              <div class="carousel-item">
                <img src="/images/Valorant/icons8-valorant-480.webp" rel="preload" alt="Map Image"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <main class="main-body">
      <div class="main-content">
        <section class="line">
          <div class="card" @click="selectMap('Abyss')">
            <img src="/images/Valorant/Map/Loading_Abyss.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Abyss</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Ascent')">
            <img src="/images/Valorant/Map/Loading_Ascent.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Ascent</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Bind')">
            <img src="/images/Valorant/Map/Loading_Bind.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Bind</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Breeze')">
            <img src="/images/Valorant/Map/Loading_Breeze.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Breeze</h1>
            </div>
          </div>

        </section>
        <section class="line">
          <div class="card" @click="selectMap('Fracture')">
            <img src="/images/Valorant/Map/Loading_Fracture.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Fracture</h1>
            </div>

          </div>
          <div class="card" @click="selectMap('Haven')">
            <img src="/images/Valorant/Map/Loading_Haven.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Haven</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Icebox')">
            <img src="/images/Valorant/Map/Loading_Icebox.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Icebox</h1>
            </div>
          </div>
        </section>
        <section class="line">
          <div class="card" @click="selectMap('Lotus')">
            <img src="/images/Valorant/Map/Loading_Lotus.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Lotus</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Pearl')">
            <img src="/images/Valorant/Map/Loading_Pearl.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Pearl</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Split')">
            <img src="/images/Valorant/Map/Loading_Split.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Split</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Sunset')">
            <img src="/images/Valorant/Map/Loading_Sunset.webp"  rel="preload" alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Sunset</h1>
            </div>
          </div>
        </section>
      </div>
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
  </div>
</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { ref, onMounted, nextTick } from 'vue';

const router = useRouter();
const agentStore = useAgentStore();
const selectedAgent = agentStore.selectedAgent;
const agentImage = agentStore.selectedAgentImage ?? undefined;

let selectedMap: string | null = null;

import { ThemeManager } from '~/utils/ThemeManager';
// Gestion du thème
const themeManager = new ThemeManager('pastel-dark');
themeManager.initialize();

// Liaison des valeurs de thème pour l'interface utilisateur
const theme = themeManager.theme;
const selectedTheme = themeManager.selectedTheme;
const changeTheme = () => themeManager.changeTheme();

const mapImages = {
  Abyss: '/images/Valorant/Map/Loading_Abyss.webp',
  Ascent: '/images/Valorant/Map/Loading_Ascent.webp',
  Bind: '/images/Valorant/Map/Loading_Bind.webp',
  Breeze: '/images/Valorant/Map/Loading_Breeze.webp',
  Fracture: '/images/Valorant/Map/Loading_Fracture.webp',
  Haven: '/images/Valorant/Map/Loading_Haven.webp',
  Icebox: '/images/Valorant/Map/Loading_Icebox.webp',
  Lotus: '/images/Valorant/Map/Loading_Lotus.webp',
  Pearl: '/images/Valorant/Map/Loading_Pearl.webp',
  Split: '/images/Valorant/Map/Loading_Split.webp',
  Sunset: '/images/Valorant/Map/Loading_Sunset.webp',
};

const interactMapImages = {
  Abyss: '/images/Valorant/Map Interactive/Abyss.webp',
  Ascent: '/images/Valorant/Map Interactive/Ascent.webp',
  Bind: '/images/Valorant/Map Interactive/Bind.webp',
  Breeze: '/images/Valorant/Map Interactive/Breeze.webp',
  Fracture: '/images/Valorant/Map Interactive/Fracture.webp',
  Haven: '/images/Valorant/Map Interactive/Haven.webp',
  Icebox: '/images/Valorant/Map Interactive/Icebox.webp',
  Lotus: '/images/Valorant/Map Interactive/Lotus.webp',
  Pearl: '/images/Valorant/Map Interactive/Pearl.webp',
  Split: '/images/Valorant/Map Interactive/Split.webp',
  Sunset: '/images/Valorant/Map Interactive/Sunset.webp',
};

// Fonction pour sélectionner une carte
function selectMap(mapName: keyof typeof mapImages) {
  const mapImage = mapImages[mapName];
  const interactMapImage = interactMapImages[mapName];

  // Enregistrer la carte et l'image dans Pinia
  agentStore.setMap(mapName, mapImage, interactMapImage);
  selectedMap = mapName;

  try {
    router.push({
      path: `/Valorant/${selectedAgent}/${selectedMap}`
    });
  } catch (error) {
    console.error('Erreur lors de la navigation :', error);
    alert("Une erreur est survenue lors de la navigation vers la page suivante. Veuillez réessayer.");
  }
}

// Fonction pour retourner à la page précédente
function goToPreviousPage() {
  try {
    router.go(-1);
  } catch (error) {
    console.error('Erreur lors de la navigation :', error);
  }
}

// Fonction pour revenir à la page d'accueil
function goToHomePage() {
  agentStore.resetStore();
  router.push('/Valorant/');
}
</script>



<style scoped>
@import '@styles/Valorant/pages/SelectMap.css';
/* Responsive Styles */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }

  .line {
    flex-direction: column;
  }

  .card {
    max-width: 90%;
  }
}
</style>