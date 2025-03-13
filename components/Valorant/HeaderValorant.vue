<template>
  <!-- En-tête principal de l'application -->
  <header class="valorant-header" role="banner">
    <div class="container">
      <div class="header__content">
        <!-- Logo et titre avec navigation vers la page d'accueil -->
        <nav 
          class="header__logo"
          @click="goToHomePage"
          role="button"
          @keydown.enter="goToHomePage"
          tabindex="0"
          aria-label="Retour à l'accueil">
          <img
            src="/images/Valorant/Logo.webp"
            fetchpriority="high"
            alt="Logo de La Brousse"
            width="64"
            height="64"
          />
          <h1>La Brousse</h1>
        </nav>
        
        <!-- Carousel pour la sélection d'agent et de map -->
        <div v-if="showCarousel" class="carousel-wrapper">
          <!-- Carousel de sélection d'agent -->
          <div 
            class="carousel-container" 
            data-tilt 
            data-tilt-max="10" 
            data-tilt-speed="400">
            <button 
              class="carousel-item" 
              @click="goToAgentSelection"
              aria-label="Sélectionner un agent">
              <img 
                :src="agentImage || '/images/Valorant/icons8-valorant-480.webp'" 
                :alt="agentImage ? 'Image de l\'agent sélectionné' : 'Image par défaut Valorant'"
                width="64"
                height="64"
              />
            </button>
          </div>
          
          <!-- Carousel d'affichage de la map -->
          <div 
            class="carousel-container" 
            data-tilt 
            data-tilt-max="10" 
            data-tilt-speed="400">
            <button 
              class="carousel-item"
              @click="goToMapSelection"
              aria-label="Sélectionner une map">
              <img 
                :src="mapImage || '/images/Valorant/icons8-valorant-480.webp'" 
                :alt="mapImage ? 'Image de la map sélectionnée' : 'Image par défaut Valorant'"
                width="64"
                height="64"
              />
            </button>
          </div>
        </div>

        <!-- Slot pour contenu additionnel -->
        <slot name="header-content"></slot>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Imports nécessaires
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useMapStore } from '~/stores/Valorant/mapStore';

// Interface pour les props
interface HeaderProps {
  showCarousel?: boolean
}

// Définition des props avec typage
const props = withDefaults(defineProps<HeaderProps>(), {
  showCarousel: false
});

// Initialisation des services
const router = useRouter();
const agentStore = useAgentStore();
const mapStore = useMapStore();

// Computed properties pour les images
const agentImage = computed(() => {
  const agent = agentStore.getSelectedAgent;
  return agent ? `/images/Valorant/Agent/${agent}_icon.webp` : null;
});

const mapImage = computed(() => {
  const map = mapStore.getSelectedMap;
  return map ? `/images/Valorant/Map/Loading_${map}.webp` : null;
});

// Méthodes de navigation
const goToHomePage = () => {
  agentStore.clearAgent();
  mapStore.clearMap();
  router.push('/');
};

const goToAgentSelection = () => {
  if (agentStore.hasSelectedAgent) {
    agentStore.clearAgent();
    mapStore.clearMap();
  }
  router.push('/Valorant/select-agent');
};

const goToMapSelection = () => {
  const agent = agentStore.getSelectedAgent;
  if (agent) {
    mapStore.clearMap();
    router.push(`/valorant/${agent.toLowerCase()}/select-map`);
  }
};
</script>

<style lang="scss" scoped>
.valorant-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--component-bg);
  backdrop-filter: blur(var(--bg-blur));
  -webkit-backdrop-filter: blur(var(--bg-blur));
  border-bottom: 1px solid var(--border-primary);
  padding: 1rem 0;

  .container {
    max-width: min(1400px, 100%);
    margin: 0 auto;
    padding: 0 clamp(1rem, 2vw, 2rem);
  }

  .header__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1rem, 2vw, 2rem);
    
    @media (max-width: 768px) {
      flex-direction: column;
      padding: 0 1rem;
    }
  }

  .header__logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: transform 0.3s ease;
    border: none;
    background: none;
    padding: 0;

    &:hover, &:focus-visible {
      transform: scale(1.02);
      outline: none;
    }

    img {
      width: clamp(48px, 5vw, 64px);
      height: clamp(48px, 5vw, 64px);
      object-fit: contain;
    }

    h1 {
      font-size: clamp(1.25rem, 3vw, 1.5rem);
      color: var(--color-text);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  .carousel-wrapper {
    display: flex;
    gap: clamp(1rem, 2vw, 2rem);
    align-items: center;

    .carousel-container {
      width: clamp(48px, 5vw, 64px);
      height: clamp(48px, 5vw, 64px);
      overflow: hidden;
      border: 2px solid var(--border-primary);
      border-radius: var(--card-radius);
      background: var(--overlay-light);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(var(--color-primary-rgb), 0.6);
        box-shadow: var(--card-shadow);
      }

      .carousel-item {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
        background: none;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>