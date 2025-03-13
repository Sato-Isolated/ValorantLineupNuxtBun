<template>
  <div class="grid-container">
    <HeaderValorant :show-carousel="true" />

    <main class="main-body">
      <div class="main-content">
        <!-- Grille des maps -->
        <div class="maps-grid">
          <div v-for="map in maps" 
              :key="map.name" 
              class="map-card"
              @click="selectMap(map.name)">
            <div class="card-image">
              <img :src="map.image" :alt="map.name" loading="lazy" />
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ map.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterValorant />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useMapStore } from '~/stores/Valorant/mapStore';
import HeaderValorant from '~/components/Valorant/HeaderValorant.vue';
import FooterValorant from '~/components/Valorant/FooterValorant.vue';

const router = useRouter();
const agentStore = useAgentStore();
const mapStore = useMapStore();

// Vérification de l'agent sélectionné
onMounted(() => {
  if (!agentStore.hasSelectedAgent) {
    // Redirection vers la page de sélection d'agent si aucun agent n'est sélectionné
    router.push('/valorant/select-agent');
  }
});

// Computed property pour l'agent sélectionné
const selectedAgent = computed(() => agentStore.getSelectedAgent);

// Interface pour les cartes
interface Map {
  name: string;
  image: string;
  interactiveImage: string;
}

// Liste des cartes disponibles
const maps: Map[] = [
  { name: 'Abyss', image: '/images/Valorant/Map/Loading_Abyss.webp', interactiveImage: '/images/Valorant/Map Interactive/Abyss.webp' },
  { name: 'Bind', image: '/images/Valorant/Map/Loading_Bind.webp', interactiveImage: '/images/Valorant/Map Interactive/Bind.webp' },
  { name: 'Breeze', image: '/images/Valorant/Map/Loading_Breeze.webp', interactiveImage: '/images/Valorant/Map Interactive/Breeze.webp' },
  { name: 'Fracture', image: '/images/Valorant/Map/Loading_Fracture.webp', interactiveImage: '/images/Valorant/Map Interactive/Fracture.webp' },
  { name: 'Haven', image: '/images/Valorant/Map/Loading_Haven.webp', interactiveImage: '/images/Valorant/Map Interactive/Haven.webp' },
  { name: 'Icebox', image: '/images/Valorant/Map/Loading_Icebox.webp', interactiveImage: '/images/Valorant/Map Interactive/Icebox.webp' },
  { name: 'Lotus', image: '/images/Valorant/Map/Loading_Lotus.webp', interactiveImage: '/images/Valorant/Map Interactive/Lotus.webp' },
  { name: 'Pearl', image: '/images/Valorant/Map/Loading_Pearl.webp', interactiveImage: '/images/Valorant/Map Interactive/Pearl.webp' },
  { name: 'Split', image: '/images/Valorant/Map/Loading_Split.webp', interactiveImage: '/images/Valorant/Map Interactive/Split.webp' },
  { name: 'Sunset', image: '/images/Valorant/Map/Loading_Sunset.webp', interactiveImage: '/images/Valorant/Map Interactive/Sunset.webp' },
];

// Fonction de sélection de carte
const selectMap = (mapName: string) => {
  if (selectedAgent.value) {
    mapStore.setMap(mapName); // Stockage de la map sélectionnée
    router.push(`/valorant/${selectedAgent.value.toLowerCase()}/${mapName.toLowerCase()}`);
  }
};
</script>

<style lang="scss" scoped>
@use 'select-map';

// Layout principal avec grid
.grid-container {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: var(--background-color, #0f1923);
}

// Style du contenu principal
.main-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;

  .main-content {
    flex: 1;
    max-width: min(2560px, 95%);
    margin: 0 auto;
    padding: 2rem;
    
    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}

.header__agent {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--component-bg);
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);

  .agent-portrait {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--color-primary);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .agent-info {
    h2 {
      color: var(--color-text);
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
}
</style>