<template>
  <div :class="['valorant-layout', selectedTheme]">
    <HeaderValorant :show-carousel="false" />

    <main>
      <section class="valorant-hero">
        <div class="hero-background" aria-hidden="true"></div>
        <div class="container">
          <div class="hero__grid">
            <div class="hero__left">
              <div class="hero__text">
                <h1 class="glitch-text" data-text="Valorant">Valorant</h1>
                <h2 class="gradient-text">Line-UP</h2>
                <p class="hero__description">
                  Découvrez et maîtrisez tous les lineups essentiels pour dominer dans Valorant.
                  Chaque agent, chaque map, chaque stratégie.
                </p>
                <div class="hero__actions">
                  <button 
                    @click="goToSelectAgent" 
                    class="btn-valorant"
                    aria-label="Aller à la sélection d'agent">
                    <span class="btn-text">Choisir un agent</span>
                    <span class="btn-glow" aria-hidden="true"></span>
                  </button>
                </div>
                
                <!-- Carousels avec meilleure performance -->
                <div class="carousel-showcase">
                  <div class="carousel-wrapper">
                    <div class="carousel-container" data-tilt>
                      <div class="carousel agents-carousel">
                        <div v-for="(image, index) in agents" 
                             :key="index"
                             class="carousel-item">
                          <img 
                            :src="image" 
                            :alt="'Agent ' + (index + 1)"
                            loading="lazy"
                            width="130" 
                            height="130" />
                        </div>
                      </div>
                    </div>

                    <div class="carousel-container" data-tilt>
                      <div class="carousel maps-carousel">
                        <div v-for="(image, index) in maps" 
                             :key="index"
                             class="carousel-item">
                          <img 
                            :src="image" 
                            :alt="'Carte ' + (index + 1)"
                            loading="lazy"
                            width="130" 
                            height="130" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="hero__right">
              <div class="valorant-sphere" data-tilt data-tilt-max="10">
                <div class="sphere-glow" aria-hidden="true"></div>
                <img 
                  src="/images/Valorant/icegif-664.webp" 
                  alt="Animation Valorant"
                  loading="lazy"
                  width="400" 
                  height="400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="valorant-features">
        <div class="container">
          <h2 class="section-title" data-text="Fonctionnalités">Fonctionnalités</h2>
          
          <div class="features-grid">
            <article class="feature-card" data-tilt>
              <div class="feature-icon" aria-hidden="true">
                <font-awesome-icon :icon="['fas', 'crosshairs']" />
              </div>
              <h3>Lineups précis</h3>
              <p>Des lineups vérifiés pour chaque agent sur toutes les maps.</p>
              <div class="feature-card__hover" aria-hidden="true"></div>
            </article>
            
            <article class="feature-card" data-tilt>
              <div class="feature-icon" aria-hidden="true">
                <font-awesome-icon :icon="['fas', 'map']" />
              </div>
              <h3>Toutes les maps</h3>
              <p>Couverture complète de toutes les maps actuelles.</p>
              <div class="feature-card__hover" aria-hidden="true"></div>
            </article>
            
            <article class="feature-card" data-tilt>
              <div class="feature-icon" aria-hidden="true">
                <font-awesome-icon :icon="['fas', 'user-secret']" />
              </div>
              <h3>Tous les agents</h3>
              <p>Des stratégies pour chaque agent du roster.</p>
              <div class="feature-card__hover" aria-hidden="true"></div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <FooterValorant />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import HeaderValorant from '~/components/Valorant/HeaderValorant.vue';
import FooterValorant from '~/components/Valorant/FooterValorant.vue';
// Assurez-vous que les icônes sont importées
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCrosshairs, faMap, faUserSecret } from '@fortawesome/free-solid-svg-icons';

// Ajout des icônes à la bibliothèque
library.add(faCrosshairs, faMap, faUserSecret);

const router = useRouter();
const { $theme } = useNuxtApp();

// Navigation
const goToSelectAgent = () => router.push('/Valorant/select-agent');

// Gestion du thème avec computed pour la réactivité
const selectedTheme = computed(() => $theme.selectedTheme.value);

// Configuration optimisée de VanillaTilt et autres initialisations
onMounted(() => {
  // Initialiser avec un délai pour assurer le chargement du DOM
  nextTick(() => {
    // Initialisation du système de thème
    $theme.initialize();
    
    startSyncedCarousels();
    animatePage();

    // Optimisation de l'effet de brillance
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.feature-card, .carousel-container').forEach(card => {
          const htmlCard = card as HTMLElement;
          const rect = htmlCard.getBoundingClientRect();
          htmlCard.style.setProperty('--x', `${e.clientX - rect.left}px`);
          htmlCard.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  });
});

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
  // Répéter les maps jusqu'à avoir le même nombre que d'agents
  const repetitions = Math.ceil(agents.value.length / originalMaps.length);
  const balancedMaps = Array(repetitions).fill([...originalMaps]).flat();
  // On coupe à la longueur exacte nécessaire et on mélange
  return shuffleArray(balancedMaps.slice(0, agents.value.length));
};
const maps = ref(balanceMaps());

// Optimisation du carousel avec animation infinie et aléatoire
const startSyncedCarousels = () => {
  const agentsCarousel = document.querySelector('.agents-carousel') as HTMLElement | null;
  const mapsCarousel = document.querySelector('.maps-carousel') as HTMLElement | null;

  if (!agentsCarousel || !mapsCarousel) return;

  const timeline = gsap.timeline({
    repeat: -1,
    onRepeat: () => {
      // Remélanger les arrays à chaque cycle complet
      agents.value = shuffleArray([...originalAgents]);
      maps.value = balanceMaps();
      
      // Reset position
      gsap.set([agentsCarousel, mapsCarousel], { y: 0 });
    }
  });

  const slideDuration = 1.2;
  const pauseDuration = 2.5;
  const numSlides = agents.value.length;

  if (numSlides === 0) return;

  const agentSlideHeight = agentsCarousel.scrollHeight / numSlides;

  gsap.set([agentsCarousel, mapsCarousel], {
    willChange: "transform"
  });

  for (let i = 0; i < numSlides; i++) {
    const randomDelay = Math.random() * 0.5; // Ajoute un délai aléatoire entre 0 et 0.5s
    timeline
      .to([agentsCarousel, mapsCarousel], {
        y: `-=${agentSlideHeight}px`,
        duration: slideDuration,
        ease: "power2.inOut",
        delay: randomDelay
      })
      .to({}, { duration: pauseDuration });
  }
};

// Animations simplifiées de la page
const animatePage = () => {
  const timeline = gsap.timeline({
    defaults: {
      duration: 0.6,
      ease: "power2.out"
    }
  });

  timeline
    .from('.hero__text', {
      y: 20,
    })
    .from('.feature-card', {
      y: 30,
      stagger: 0.15
    }, "-=0.3")
    .from('.valorant-sphere', {
      scale: 0.9,
      duration: 0.8
    }, "-=0.4");
};

</script>

<style lang="scss">
@use 'home';
</style>
