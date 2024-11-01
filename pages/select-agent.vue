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
                <img src="/images/icons8-valorant-480.webp" alt="Agent Image" />
              </div>
            </div>
          </div>
          <!-- Carousel Maps -->
          <div class="carousel-container">
            <div class="carousel maps-carousel">
              <div class="carousel-item">
                <!-- Utilisation d'une image par défaut si mapImage est null -->
                <img :src="mapImage || '/images/icons8-valorant-480.webp'" alt="Map Image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="main-body">
      <div class="main-content">
        <!-- Ligne 1 -->
        <section class="line">
          <div class="card" @click="selectAgent('Kayo')">
            <img src="/images/Carte Agents/kayo_full.webp"  alt="Kayo" />
            <div class="card-content">
              <h1 class="card-title">Kayo</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Gekko')">
            <img src="/images/Carte Agents/gekko_full.webp"  alt="Gekko" />
            <div class="card-content">
              <h1 class="card-title">Gekko</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Sova')">
            <img src="/images/Carte Agents/sova_full.webp"  alt="Sova" />
            <div class="card-content">
              <h1 class="card-title">Sova</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Fade')">
            <img src="/images/Carte Agents/fade_full.webp"  alt="Fade" />
            <div class="card-content">
              <h1 class="card-title">Fade</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Breach')">
            <img src="/images/Carte Agents/breach_full.webp"  alt="Breach" />
            <div class="card-content">
              <h1 class="card-title">Breach</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Vyse')">
            <img src="/images/Carte Agents/vyse_full.webp"  alt="Vyse" />
            <div class="card-content">
              <h1 class="card-title">Vyse</h1>
            </div>
          </div>
        </section>

        <!-- Ligne 2 -->
        <section class="line">
          <div class="card" @click="selectAgent('KillJoy')">
            <img src="/images/Carte Agents/killjoy_full.webp"  alt="KillJoy" />
            <div class="card-content">
              <h1 class="card-title">KillJoy</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Cypher')">
            <img src="/images/Carte Agents/cypher_full.webp"  alt="Cypher" />
            <div class="card-content">
              <h1 class="card-title">Cypher</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Sage')">
            <img src="/images/Carte Agents/sage_full.webp"  alt="Sage" />
            <div class="card-content">
              <h1 class="card-title">Sage</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Yoru')">
            <img src="/images/Carte Agents/yoru_full.webp"  alt="Yoru" />
            <div class="card-content">
              <h1 class="card-title">Yoru</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Deadlock')">
            <img src="/images/Carte Agents/deadlock_full.webp"  alt="Deadlock" />
            <div class="card-content">
              <h1 class="card-title">Deadlock</h1>
            </div>
          </div>
        </section>

        <!-- Ligne 3 -->
        <section class="line">
          <div class="card" @click="selectAgent('Viper')">
            <img src="/images/Carte Agents/viper_full.webp"  alt="Viper" />
            <div class="card-content">
              <h1 class="card-title">Viper</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Omen')">
            <img src="/images/Carte Agents/omen_full.webp"  alt="Omen" />
            <div class="card-content">
              <h1 class="card-title">Omen</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Clove')">
            <img src="/images/Carte Agents/clove_full.webp"  alt="Clove" />
            <div class="card-content">
              <h1 class="card-title">Clove</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Harbor')">
            <img src="/images/Carte Agents/habor_full.webp"  alt="Harbor" />
            <div class="card-content">
              <h1 class="card-title">Harbor</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Brimstone')">
            <img src="/images/Carte Agents/brimstone_full.webp"  alt="Brimstone" />
            <div class="card-content">
              <h1 class="card-title">Brimstone</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Astra')">
            <img src="/images/Carte Agents/astra_full.webp"  alt="Astra" />
            <div class="card-content">
              <h1 class="card-title">Astra</h1>
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

<script setup>
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/stores/agentStore';

const router = useRouter();
const agentStore = useAgentStore();

// Récupérer l'image de la carte et déterminer si une carte est déjà sélectionnée
const mapImage = agentStore.selectedMapImage;
const selectedMap = agentStore.selectedMap;  // Vérifier s'il y a une carte sélectionnée
const isMapSelected = selectedMap !== null;  // Booléen qui est false si la carte est null

let selectedAgent = null;

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
function applyTheme(theme) {
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
});


function selectAgent(agentName) {
  const agentImages = {
    Kayo: '/images/Agent/KAYO_icon.webp',
    Gekko: '/images/Agent/Gekko_icon.webp',
    Sova: '/images/Agent/Sova_icon.webp',
    Fade: '/images/Agent/Fade_icon.webp',
    Breach: '/images/Agent/Breach_icon.webp',
    Vyse: '/images/Agent/Vyse_icon.webp',
    KillJoy: '/images/Agent/Killjoy_icon.webp',
    Cypher: '/images/Agent/Cypher_icon.webp',
    Sage: '/images/Agent/Sage_icon.webp',
    Yoru: '/images/Agent/Yoru_icon.webp',
    Deadlock: '/images/Agent/Deadlock_icon.webp',
    Viper: '/images/Agent/Viper_icon.webp',
    Omen: '/images/Agent/Omen_icon.webp',
    Clove: '/images/Agent/Clove_icon.webp',
    Harbor: '/images/Agent/Habor_icon.webp',
    Brimstone: '/images/Agent/Brimstone_icon.webp',
    Astra: '/images/Agent/Astra_icon.webp',
  };

  selectedAgent = agentName;
  const agentImage = agentImages[agentName];
  agentStore.setAgent(agentName, agentImage);

  try {
    if (isMapSelected) {
      // Si une carte est déjà sélectionnée, rediriger vers la page finale avec l'agent et la carte
      router.push({
        path: `${selectedAgent}/${selectedMap}`
      });
    } else {
      // Si aucune carte n'est sélectionnée, rediriger vers la page de sélection de la carte
      router.push({
        path: `${selectedAgent}/select-map`
      });
    }
  } catch (error) {
    console.error("Erreur lors de la navigation :", error);
    alert("Une erreur est survenue lors de la navigation. Veuillez réessayer.");
  }
}

function goToHomePage() {
  agentStore.resetStore();
  router.push('/');
}

</script>


<style scoped>
@import '../assets/styles/pages/SelectAgent.css';
</style>