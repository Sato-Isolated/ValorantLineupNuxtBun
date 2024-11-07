<template>
  <div :class="[theme, 'grid-container']">
    <!-- Header -->
    <header class="header">
      <div class="header-body">
        <div class="header-content">
          <img @click="goToHomePage" src="/images/Valorant/Logo.webp" alt="Logo de La Brousse" width="96" height="96" />
          <h1 @click="goToHomePage">La Brousse</h1>
        </div>
      </div>
    </header>

    <!-- Main Body -->
    <main class="main-body">
      <div class="main-content">
        <section class="content">
          <h1>Valorant</h1>
          <h2>Line-UP</h2>
          <button @click="goToSelectAgent">Choisir un agent</button>
          <!-- Carousel Agents -->
          <div class="carousel-wrapper">
            <div class="carousel-container">
              <div class="carousel agents-carousel">
                <div class="carousel-item" v-for="(image, index) in agents" :key="index">
                  <img :src="image" alt="Agent Image" width="130" height="130" />
                </div>
              </div>
            </div>

            <!-- Carousel Maps -->
            <div class="carousel-container">
              <div class="carousel maps-carousel">
                <div class="carousel-item" v-for="(image, index) in maps" :key="index">
                  <img :src="image" alt="Map Image" width="130" height="130" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="halo-sphere">
          <img src="/images/Valorant/icegif-664.webp" alt="Gif représentant Valorant" width="800" height="800" />
        </section>
      </div>
    </main>

    <!-- Footer -->
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { useAgentStore } from '~/stores/Valorant/agentStore';


// Store des agents et navigation
const agentStore = useAgentStore();
const router = useRouter();

// Navigation
const goToSelectAgent = () => router.push('/Valorant/select-agent');
const goToHomePage = () => {
  agentStore.resetStore();
  router.push('/');
};
import { ThemeManager } from '~/utils/ThemeManager';
// Gestion du thème
const themeManager = new ThemeManager('pastel-dark');
themeManager.initialize();

// Liaison des valeurs de thème pour l'interface utilisateur
const theme = themeManager.theme;
const selectedTheme = themeManager.selectedTheme;
const changeTheme = () => themeManager.changeTheme();

// Fonction pour mélanger un tableau (Fisher-Yates Shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Images des agents et maps
const originalAgents = [
  "/images/Valorant/Agent/Astra_icon.webp",
  "/images/Valorant/Agent/Breach_icon.webp",
  "/images/Valorant/Agent/Brimstone_icon.webp",
  "/images/Valorant/Agent/Chamber_icon.webp",
  "/images/Valorant/Agent/Clove_icon.webp",
  "/images/Valorant/Agent/Cypher_icon.webp",
  "/images/Valorant/Agent/Harbor_icon.webp",
  "/images/Valorant/Agent/Deadlock_icon.webp",
  "/images/Valorant/Agent/Fade_icon.webp",
  "/images/Valorant/Agent/Iso_icon.webp",
  "/images/Valorant/Agent/Neon_icon.webp",
  "/images/Valorant/Agent/Gekko_icon.webp",
  "/images/Valorant/Agent/Omen_icon.webp",
  "/images/Valorant/Agent/Sage_icon.webp",
  "/images/Valorant/Agent/Sova_icon.webp",
  "/images/Valorant/Agent/Viper_icon.webp",
  "/images/Valorant/Agent/Yoru_icon.webp",
  "/images/Valorant/Agent/Jett_icon.webp",
  "/images/Valorant/Agent/KAYO_icon.webp",
  "/images/Valorant/Agent/Killjoy_icon.webp",
  "/images/Valorant/Agent/Phoenix_icon.webp",
  "/images/Valorant/Agent/Raze_icon.webp",
  "/images/Valorant/Agent/Reyna_icon.webp",
  "/images/Valorant/Agent/Skye_icon.webp",
];
const originalMaps = [
  "/images/Valorant/Map/Loading_Abyss.webp",
  "/images/Valorant/Map/Loading_Ascent.webp",
  "/images/Valorant/Map/Loading_Bind.webp",
  "/images/Valorant/Map/Loading_Breeze.webp",
  "/images/Valorant/Map/Loading_Fracture.webp",
  "/images/Valorant/Map/Loading_Haven.webp",
  "/images/Valorant/Map/Loading_Icebox.webp",
  "/images/Valorant/Map/Loading_Lotus.webp",
  "/images/Valorant/Map/Loading_Pearl.webp",
  "/images/Valorant/Map/Loading_Split.webp",
  "/images/Valorant/Map/Loading_Sunset.webp",
];

// Mélange des agents et équilibrage des maps
const agents = ref(shuffleArray([...originalAgents]));

const balanceMaps = () => {
  const balancedMaps = [...originalMaps];
  while (balancedMaps.length < agents.value.length) {
    balancedMaps.push(originalMaps[Math.floor(Math.random() * originalMaps.length)]);
  }
  return shuffleArray(balancedMaps);
};
const maps = ref(balanceMaps());

// Démarrer les carousels synchronisés avec une pause entre chaque slide
const startSyncedCarousels = () => {
  const agentsCarousel = document.querySelector('.agents-carousel') as HTMLElement | null;
  const mapsCarousel = document.querySelector('.maps-carousel') as HTMLElement | null;

  if (!agentsCarousel || !mapsCarousel) return;

  const timeline = gsap.timeline({ repeat: -1, ease: "linear" });
  const slideDuration = 1;
  const pauseDuration = 3;
  const numSlides = agents.value.length;

  if (numSlides === 0) return;

  const agentSlideHeight = agentsCarousel.scrollHeight / numSlides;
  const mapSlideHeight = mapsCarousel.scrollHeight / numSlides;

  for (let i = 0; i < numSlides; i++) {
    timeline
      .to(agentsCarousel, {
        y: `-=${agentSlideHeight}px`,
        duration: slideDuration,
        ease: "linear",
      })
      .to({}, { duration: pauseDuration })
      .to(mapsCarousel, {
        y: `-=${mapSlideHeight}px`,
        duration: slideDuration,
        ease: "linear",
      }, `-=${slideDuration + pauseDuration}`)
      .to({}, { duration: pauseDuration });
  }
};

onMounted(startSyncedCarousels);
</script>


<style scoped>
@import '@styles/Valorant/pages/index.css';
</style>
