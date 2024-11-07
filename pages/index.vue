<template>
<div class="slider">
  <video v-if="isVideoBackground" :src="sliderBackground" autoplay loop muted playsinline class="background-video"></video>

  <button class="nav-btn prev" @click="handlePrevSlide" aria-label="Slide précédente" tabindex="0">←</button>

  <NuxtLink :to="activeLink">
    <div class="slide-content"
         v-for="(site, index) in sites"
         :key="site.id"
         :class="['slide', { active: isActiveSlide(index), 'slide-next': movingForward, 'slide-prev': !movingForward }]">
      <h2>{{ site.name }}</h2>
      <p>{{ site.description }}</p>
    </div>
  </NuxtLink>

  <button class="nav-btn next" @click="handleNextSlide" aria-label="Slide suivante" tabindex="0">→</button>

  <button class="autoplay-toggle" @click="toggleAutoplay">{{ autoplay ? 'Pause' : 'Lecture' }}</button>

  <div class="indicator-container">
    <span v-for="(site, index) in sites" :key="index" :class="['indicator', { active: isActiveSlide(index) }]"
          @click="setActiveSlide(index)" :aria-label="'Aller à la slide ' + (index + 1)" tabindex="0"></span>
  </div>
</div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

type Site = {
  id: number;
  name: string;
  description: string;
  link: string;
  background: string;
};

const sites: Site[] = [
  { id: 0, name: 'Valorant Lineup', description: 'Lineups détaillés pour Valorant', link: '/valorant', background: '/images/valorant/Sequenz 01.webm' },
];

const sliderBackground = computed(() => sites[activeSlide.value].background);
const isVideoBackground = computed(() => sliderBackground.value.endsWith('.webm'));


const activeSlide = ref(0);
const autoplay = ref(true);
const autoplaySpeed = ref(5000);
const movingForward = ref(true);
let intervalId: ReturnType<typeof setInterval>;

const activeLink = computed(() => sites[activeSlide.value].link);
const isActiveSlide = (index: number) => index === activeSlide.value;

const setActiveSlide = (index: number) => {
  stopAutoplay();
  movingForward.value = index > activeSlide.value;
  activeSlide.value = index;
};

const handleNextSlide = () => {
  stopAutoplay();
  movingForward.value = true;
  nextSlide();
};

const handlePrevSlide = () => {
  stopAutoplay();
  movingForward.value = false;
  prevSlide();
};

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % sites.length;
};

const prevSlide = () => {
  activeSlide.value = (activeSlide.value - 1 + sites.length) % sites.length;
};

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

onMounted(() => startAutoplay());
onBeforeUnmount(() => stopAutoplay());
</script>

<style scoped>
.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.slide.active {
  opacity: 1;
  transform: translateX(0);
}

.slide-content {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.slide-content h2 {
  font-size: 5rem;
  transition: transform 0.3s ease;
  color: #ccc;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
}

.slide.active .slide-content h2 {
  transform: scale(1.05);
}

.slide-content p {
  font-size: 2.2rem;
  margin-top: 10px;
  color: #ccc;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 50%;
  background: transparent;
  font-size: 4rem;
  color: white;
}


.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.indicator-container {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.indicator {
  width: 10px;
  height: 10px;
  background: #888;
  border-radius: 50%;
  transition: background 0.3s;
}

.indicator.active {
  background: #ffffff;
  animation: indicatorPulse 0.5s infinite alternate;
}

@keyframes indicatorPulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}

.autoplay-toggle {
  position: absolute;
  bottom: 20px;
  left: 10px;
  font-size: 1.2rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.autoplay-toggle:hover {
  background: rgba(255, 255, 255, 0.4);
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1; /* Place la vidéo derrière le contenu */
}
</style>


