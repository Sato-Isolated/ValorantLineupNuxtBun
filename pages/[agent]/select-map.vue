<template>
  <div :class="[theme, 'grid-container']">
    <div class="header">
      <div class="header-body">
        <div class="header-content">
          <img @click="goToHomePage" src="/images/Logo.webp"  alt="Logo de La Brousse" />
          <h1 @click="goToHomePage">La brousse</h1>
        </div>
        <div class="carousel-wrapper">
          <!-- Carousel Agents -->
          <div class="carousel-container">
            <div class="carousel agents-carousel">
              <div class="carousel-item">
                <img @click="goToPreviousPage" :src="agentImage" alt="Agent Image" />
              </div>
            </div>
          </div>

          <!-- Carousel Maps -->
          <div class="carousel-container">
            <div class="carousel maps-carousel">
              <div class="carousel-item">
                <img src="/images/icons8-valorant-480.webp" alt="Map Image"/>
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
            <img src="/images/Map/Loading_Abyss.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Abyss</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Ascent')">
            <img src="/images/Map/Loading_Ascent.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Ascent</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Bind')">
            <img src="/images/Map/Loading_Bind.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Bind</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Breeze')">
            <img src="/images/Map/Loading_Breeze.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Breeze</h1>
            </div>
          </div>

        </section>
        <section class="line">
          <div class="card" @click="selectMap('Fracture')">
            <img src="/images/Map/Loading_Fracture.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Fracture</h1>
            </div>

          </div>
          <div class="card" @click="selectMap('Haven')">
            <img src="/images/Map/Loading_Haven.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Haven</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Icebox')">
            <img src="/images/Map/Loading_Icebox.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Icebox</h1>
            </div>
          </div>
        </section>
        <section class="line">
          <div class="card" @click="selectMap('Lotus')">
            <img src="/images/Map/Loading_Lotus.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Lotus</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Pearl')">
            <img src="/images/Map/Loading_Pearl.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Pearl</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Split')">
            <img src="/images/Map/Loading_Split.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Split</h1>
            </div>
          </div>
          <div class="card" @click="selectMap('Sunset')">
            <img src="/images/Map/Loading_Sunset.webp"  alt="Illustration personnage" />
            <div class="card-content">
              <h1 class="card-title">Sunset</h1>
            </div>
          </div>
        </section>
      </div>
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
  </div>
</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/stores/agentStore';
import { ref, onMounted, nextTick } from 'vue';

const router = useRouter();
const agentStore = useAgentStore();
const selectedAgent = agentStore.selectedAgent;
const agentImage = agentStore.selectedAgentImage ?? undefined;

let selectedMap = null;
// Gestion du thème
const theme = ref('dark');
const selectedTheme = ref('dark');

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

  nextTick(changeTheme);
});

const mapImages = {
  Abyss: '/images/Map/Loading_Abyss.webp',
  Ascent: '/images/Map/Loading_Ascent.webp',
  Bind: '/images/Map/Loading_Bind.webp',
  Breeze: '/images/Map/Loading_Breeze.webp',
  Fracture: '/images/Map/Loading_Fracture.webp',
  Haven: '/images/Map/Loading_Haven.webp',
  Icebox: '/images/Map/Loading_Icebox.webp',
  Lotus: '/images/Map/Loading_Lotus.webp',
  Pearl: '/images/Map/Loading_Pearl.webp',
  Split: '/images/Map/Loading_Split.webp',
  Sunset: '/images/Map/Loading_Sunset.webp',
};

const interactMapImages = {
  Abyss: '/images/Map Interactive/Abyss.webp',
  Ascent: '/images/Map Interactive/Ascent.webp',
  Bind: '/images/Map Interactive/Bind.webp',
  Breeze: '/images/Map Interactive/Breeze.webp',
  Fracture: '/images/Map Interactive/Fracture.webp',
  Haven: '/images/Map Interactive/Haven.webp',
  Icebox: '/images/Map Interactive/Icebox.webp',
  Lotus: '/images/Map Interactive/Lotus.webp',
  Pearl: '/images/Map Interactive/Pearl.webp',
  Split: '/images/Map Interactive/Split.webp',
  Sunset: '/images/Map Interactive/Sunset.webp',
};

function selectMap(mapName: keyof typeof mapImages) {

  const mapImage = mapImages[mapName];
  const interactMapImage = interactMapImages[mapName];
  // Enregistrer la carte et l'image dans Pinia
  agentStore.setMap(mapName, mapImage, interactMapImage);
  selectedMap = mapName;
  
  try {
    router.push({
      path: `/${selectedAgent}/${selectedMap}`
    });
  } catch (error) {
    console.error('Erreur lors de la navigation :', error);
    alert("Une erreur est survenue lors de la navigation vers la page suivante. Veuillez réessayer.");
  }
}

function goToPreviousPage() {
  try {
    router.go(-1);
  } catch (error) {
    console.error('Erreur lors de la navigation :', error);
  }
}

function goToHomePage() {
  agentStore.resetStore();
  router.push('/');
}
</script>


<style scoped>
@import '../../assets/styles/pages/SelectMap.css';
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