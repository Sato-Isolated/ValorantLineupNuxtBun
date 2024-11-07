<template>
  <div :class="[theme, 'grid-container']">
    <div class="header">
      <div class="header-body">
        <div class="header-content">
          <img @click="goToHomePage" src="/images/Valorant/Logo.webp"  alt="Logo de La Brousse" />
          <h1 @click="goToHomePage">La brousse</h1>
        </div>
        <div class="carousel-wrapper">
          <!-- Carousel Agents -->
          <div class="carousel-container">
            <div class="carousel agents-carousel">
              <div class="carousel-item">
                <img src="/images/Valorant/icons8-valorant-480.webp" alt="Agent Image" />
              </div>
            </div>
          </div>
          <!-- Carousel Maps -->
          <div class="carousel-container">
            <div class="carousel maps-carousel">
              <div class="carousel-item">
                <!-- Utilisation d'une image par défaut si mapImage est null -->
                <img :src="mapImage || '/images/Valorant/icons8-valorant-480.webp'" alt="Map Image" />
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
            <img src="/images/Valorant/Carte Agents/kayo_full.webp"  alt="Kayo" />
            <div class="card-content">
              <h1 class="card-title">Kayo</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Gekko')">
            <img src="/images/Valorant/Carte Agents/gekko_full.webp"  alt="Gekko" />
            <div class="card-content">
              <h1 class="card-title">Gekko</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Sova')">
            <img src="/images/Valorant/Carte Agents/sova_full.webp"  alt="Sova" />
            <div class="card-content">
              <h1 class="card-title">Sova</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Fade')">
            <img src="/images/Valorant/Carte Agents/fade_full.webp"  alt="Fade" />
            <div class="card-content">
              <h1 class="card-title">Fade</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Breach')">
            <img src="/images/Valorant/Carte Agents/breach_full.webp"  alt="Breach" />
            <div class="card-content">
              <h1 class="card-title">Breach</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Vyse')">
            <img src="/images/Valorant/Carte Agents/vyse_full.webp"  alt="Vyse" />
            <div class="card-content">
              <h1 class="card-title">Vyse</h1>
            </div>
          </div>
        </section>

        <!-- Ligne 2 -->
        <section class="line">
          <div class="card" @click="selectAgent('KillJoy')">
            <img src="/images/Valorant/Carte Agents/killjoy_full.webp"  alt="KillJoy" />
            <div class="card-content">
              <h1 class="card-title">KillJoy</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Cypher')">
            <img src="/images/Valorant/Carte Agents/cypher_full.webp"  alt="Cypher" />
            <div class="card-content">
              <h1 class="card-title">Cypher</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Sage')">
            <img src="/images/Valorant/Carte Agents/sage_full.webp"  alt="Sage" />
            <div class="card-content">
              <h1 class="card-title">Sage</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Yoru')">
            <img src="/images/Valorant/Carte Agents/yoru_full.webp"  alt="Yoru" />
            <div class="card-content">
              <h1 class="card-title">Yoru</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Deadlock')">
            <img src="/images/Valorant/Carte Agents/deadlock_full.webp"  alt="Deadlock" />
            <div class="card-content">
              <h1 class="card-title">Deadlock</h1>
            </div>
          </div>
        </section>

        <!-- Ligne 3 -->
        <section class="line">
          <div class="card" @click="selectAgent('Viper')">
            <img src="/images/Valorant/Carte Agents/viper_full.webp"  alt="Viper" />
            <div class="card-content">
              <h1 class="card-title">Viper</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Omen')">
            <img src="/images/Valorant/Carte Agents/omen_full.webp"  alt="Omen" />
            <div class="card-content">
              <h1 class="card-title">Omen</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Clove')">
            <img src="/images/Valorant/Carte Agents/clove_full.webp"  alt="Clove" />
            <div class="card-content">
              <h1 class="card-title">Clove</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Harbor')">
            <img src="/images/Valorant/Carte Agents/habor_full.webp"  alt="Harbor" />
            <div class="card-content">
              <h1 class="card-title">Harbor</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Brimstone')">
            <img src="/images/Valorant/Carte Agents/brimstone_full.webp"  alt="Brimstone" />
            <div class="card-content">
              <h1 class="card-title">Brimstone</h1>
            </div>
          </div>
          <div class="card" @click="selectAgent('Astra')">
            <img src="/images/Valorant/Carte Agents/astra_full.webp"  alt="Astra" />
            <div class="card-content">
              <h1 class="card-title">Astra</h1>
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

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/stores/Valorant/agentStore';

const router = useRouter();
const agentStore = useAgentStore();

// Récupérer l'image de la carte et déterminer si une carte est déjà sélectionnée
const mapImage = agentStore.selectedMapImage;
const selectedMap = agentStore.selectedMap;
const isMapSelected = selectedMap !== null;

// Type pour le nom de l'agent
let selectedAgent: string | null = null;

// Gestion du thème
import { ThemeManager } from '~/utils/ThemeManager';
// Gestion du thème
const themeManager = new ThemeManager('pastel-dark');
themeManager.initialize();

// Liaison des valeurs de thème pour l'interface utilisateur
const theme = themeManager.theme;
const selectedTheme = themeManager.selectedTheme;
const changeTheme = () => themeManager.changeTheme();

// Fonction pour sélectionner un agent
function selectAgent(agentName: string) {
  const agentImages: Record<string, string> = {
    Kayo: '/images/Valorant/Agent/KAYO_icon.webp',
    Gekko: '/images/Valorant/Agent/Gekko_icon.webp',
    Sova: '/images/Valorant/Agent/Sova_icon.webp',
    Fade: '/images/Valorant/Agent/Fade_icon.webp',
    Breach: '/images/Valorant/Agent/Breach_icon.webp',
    Vyse: '/images/Valorant/Agent/Vyse_icon.webp',
    KillJoy: '/images/Valorant/Agent/Killjoy_icon.webp',
    Cypher: '/images/Valorant/Agent/Cypher_icon.webp',
    Sage: '/images/Valorant/Agent/Sage_icon.webp',
    Yoru: '/images/Valorant/Agent/Yoru_icon.webp',
    Deadlock: '/images/Valorant/Agent/Deadlock_icon.webp',
    Viper: '/images/Valorant/Agent/Viper_icon.webp',
    Omen: '/images/Valorant/Agent/Omen_icon.webp',
    Clove: '/images/Valorant/Agent/Clove_icon.webp',
    Harbor: '/images/Valorant/Agent/Harbor_icon.webp', // Correction orthographique
    Brimstone: '/images/Valorant/Agent/Brimstone_icon.webp',
    Astra: '/images/Valorant/Agent/Astra_icon.webp',
  };

  selectedAgent = agentName;
  const agentImage = agentImages[agentName];
  agentStore.setAgent(agentName, agentImage);

  try {
    const targetPath = isMapSelected
      ? `/Valorant/${selectedAgent}/${selectedMap}`
      : `/Valorant/${selectedAgent}/select-map`;
    router.push({ path: targetPath });
  } catch (error) {
    console.error("Erreur lors de la navigation :", error);
    alert("Une erreur est survenue lors de la navigation. Veuillez réessayer.");
  }
}

// Fonction pour revenir à la page d'accueil
function goToHomePage() {
  agentStore.resetStore();
  router.push('/Valorant/');
}
</script>



<style scoped>
@import '@styles/Valorant/pages/SelectAgent.css';
</style>