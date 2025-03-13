<template>
  <div class="grid-container">
    <HeaderValorant />
    
    <main class="main-body">
      <div class="main-content">
        <!-- Section Duellistes -->
        <div class="line" data-category="Duellistes">
          <div class="cards-container">
            <div v-for="agent in duellistes" 
                :key="agent.name" 
                class="card"
                @click="selectAgent(agent.name)">
              <div class="card-wrapper">
                <img 
                  :src="agent.fullImage" 
                  :alt="agent.name"
                  class="card-image"
                  loading="lazy"
                />
                <div class="card-content">
                  <h3 class="card-title">{{ agent.name }}</h3>
                  <p class="card-role">{{ agent.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Sentinelles -->
        <div class="line" data-category="Sentinelles">
          <div class="cards-container">
            <div v-for="agent in sentinelles" 
                :key="agent.name" 
                class="card"
                @click="selectAgent(agent.name)">
              <div class="card-wrapper">
                <img 
                  :src="agent.fullImage" 
                  :alt="agent.name"
                  class="card-image"
                  loading="lazy"
                />
                <div class="card-content">
                  <h3 class="card-title">{{ agent.name }}</h3>
                  <p class="card-role">{{ agent.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Contrôleurs -->
        <div class="line" data-category="Contrôleurs">
          <div class="cards-container">
            <div v-for="agent in controleurs" 
                :key="agent.name" 
                class="card"
                @click="selectAgent(agent.name)">
              <div class="card-wrapper">
                <img 
                  :src="agent.fullImage" 
                  :alt="agent.name"
                  class="card-image"
                  loading="lazy"
                />
                <div class="card-content">
                  <h3 class="card-title">{{ agent.name }}</h3>
                  <p class="card-role">{{ agent.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterValorant />
  </div>
</template>

<script setup lang="ts">
import { useAgentStore } from '~/stores/Valorant/agentStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const agentStore = useAgentStore();

// Types
interface Agent {
  name: string;
  fullImage: string;
  role: string;
}

// Données des agents
const duellistes: Agent[] = [
  { name: 'Jett', fullImage: '/images/Valorant/Carte Agents/jett_full.webp', role: 'Duelliste' },
  { name: 'Phoenix', fullImage: '/images/Valorant/Carte Agents/phoenix_full.webp', role: 'Duelliste' },
  { name: 'Neon', fullImage: '/images/Valorant/Carte Agents/neon_full.webp', role: 'Duelliste' },
  { name: 'Raze', fullImage: '/images/Valorant/Carte Agents/raze_full.webp', role: 'Duelliste' },
  { name: 'Reyna', fullImage: '/images/Valorant/Carte Agents/reyna_full.webp', role: 'Duelliste' },
  { name: 'Yoru', fullImage: '/images/Valorant/Carte Agents/yoru_full.webp', role: 'Duelliste' },
  { name: 'Iso', fullImage: '/images/Valorant/Carte Agents/iso_full.webp', role: 'Duelliste' },
];

const sentinelles: Agent[] = [
  { name: 'Killjoy', fullImage: '/images/Valorant/Carte Agents/killjoy_full.webp', role: 'Sentinelle' },
  { name: 'Cypher', fullImage: '/images/Valorant/Carte Agents/cypher_full.webp', role: 'Sentinelle' },
  { name: 'Sage', fullImage: '/images/Valorant/Carte Agents/sage_full.webp', role: 'Sentinelle' },
  { name: 'Chamber', fullImage: '/images/Valorant/Carte Agents/chamber_full.webp', role: 'Sentinelle' },
  { name: 'Deadlock', fullImage: '/images/Valorant/Carte Agents/deadlock_full.webp', role: 'Sentinelle' },
];

const controleurs: Agent[] = [
  { name: 'Viper', fullImage: '/images/Valorant/Carte Agents/viper_full.webp', role: 'Contrôleur' },
  { name: 'Omen', fullImage: '/images/Valorant/Carte Agents/omen_full.webp', role: 'Contrôleur' },
  { name: 'Clove', fullImage: '/images/Valorant/Carte Agents/clove_full.webp', role: 'Contrôleur' },
  { name: 'Harbor', fullImage: '/images/Valorant/Carte Agents/harbor_full.webp', role: 'Contrôleur' },
  { name: 'Brimstone', fullImage: '/images/Valorant/Carte Agents/brimstone_full.webp', role: 'Contrôleur' },
  { name: 'Astra', fullImage: '/images/Valorant/Carte Agents/astra_full.webp', role: 'Contrôleur' },
];

// Fonction de sélection d'agent
const selectAgent = (agentName: string) => {
  // Enregistre l'agent sélectionné dans le store
  agentStore.setAgent(agentName);
  // Redirige vers la page de sélection de carte
  router.push(`/valorant/${agentName.toLowerCase()}/select-map`);
};
</script>

<style lang="scss" scoped>
@use 'select-agent';
</style>