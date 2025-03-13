<template>
  <section class="hero">
    <video 
      v-if="isVideoBackground" 
      ref="videoRef"
      :src="sliderBackground" 
      autoplay 
      loop 
      muted 
      playsinline 
      preload="auto"
      class="hero__video"
      :class="{ 'loaded': isVideoLoaded }"
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
    ></video>

    <div class="hero__title-container">
      <h1 class="hero__title">
        <span class="hero__title-top" data-text="Valorant">Valorant</span>
        <span class="hero__title-bottom" data-text="Lineup">Lineup</span>
      </h1>
      <div class="hero__subtitle">Maîtrisez tous les angles</div>
    </div>

    <div class="hero__actions">
      <NuxtLink 
        v-for="(site, index) in sites"
        :key="site.id"
        :to="site.link"
        class="hero-btn"
      >
        <img 
          :src="`/images/valorant/${site.icon}`"
          :alt="site.name"
          class="hero-btn__icon"
          loading="lazy"
          width="40"
          height="40"
          @error="handleImageError"
        />
      </NuxtLink>
    </div>

    <button 
      class="btn btn-glass autoplay-toggle" 
      :class="{ 'is-playing': autoplay }"
      @click="toggleAutoplay"
    >
      <i class="fas" :class="autoplay ? 'fa-pause' : 'fa-play'"></i>
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// Types
type Site = {
  id: number;
  name: string;
  description: string;
  link: string;
  background: string;
  icon: string;
};

// Imports des assets
import video from '~/public/images/valorant/Sequenz_01.webm';

// État réactif pour la gestion vidéo
const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoLoaded = ref(false);
const videoLoadAttempts = ref(0);
const maxVideoLoadAttempts = 3;

// Configuration des sites avec images optimisées
const sites: Site[] = [
  { 
    id: 0, 
    name: 'Valorant Lineup', 
    description: 'Lineups détaillés pour Valorant', 
    link: '/valorant/home', 
    background: video,
    icon: 'icons8-valorant-480.webp'  // Chemin relatif depuis /public/images/valorant/
  },
];

// Computed properties pour la gestion du slider
const sliderBackground = computed(() => sites[activeSlide.value].background);
const isVideoBackground = computed(() => sliderBackground.value.endsWith('.webm'));

// État réactif pour le slider
const activeSlide = ref(0);
const autoplay = ref(true);
const autoplaySpeed = ref(5000);
const movingForward = ref(true);
let intervalId: ReturnType<typeof setInterval>;

// Gestion du chargement de la vidéo
const onVideoLoaded = () => {
  isVideoLoaded.value = true;
  videoLoadAttempts.value = 0;
};

const onVideoError = async () => {
  console.error('Erreur de chargement de la vidéo');
  if (videoLoadAttempts.value < maxVideoLoadAttempts) {
    videoLoadAttempts.value++;
    // Attendre un court délai avant de réessayer
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (videoRef.value) {
      videoRef.value.load();
    }
  }
};

// Gestion des erreurs d'images
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  console.error(`Erreur de chargement de l'image: ${img.src}`);
  // Fallback vers une image par défaut si nécessaire
  // img.src = '/images/valorant/default-icon.webp';
};

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % sites.length;
};

// Gestion de l'autoplay
const startAutoplay = () => {
  autoplay.value = true;
  intervalId = setInterval(() => {
    movingForward.value = true;
    nextSlide();
  }, autoplaySpeed.value);
};

const stopAutoplay = () => {
  autoplay.value = false;
  clearInterval(intervalId);
};

const toggleAutoplay = () => {
  autoplay.value ? stopAutoplay() : startAutoplay();
};

// Amélioration des lifecycle hooks
onMounted(() => {
  startAutoplay();
  // Forcer le chargement de la vidéo si nécessaire
  if (videoRef.value && !isVideoLoaded.value) {
    videoRef.value.load();
  }
});

onBeforeUnmount(() => {
  stopAutoplay();
  isVideoLoaded.value = false;
});
</script>

<style lang="scss" scoped>
@use 'index';
</style>