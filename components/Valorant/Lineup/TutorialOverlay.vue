<template>
  <div v-if="show" class="tutorial-overlay">
    <div 
      class="tutorial-step"
      :style="currentStepStyle"
    >
      <div class="step-content">
        <h3>{{ currentStep.title }}</h3>
        <p>{{ currentStep.description }}</p>
        <div class="step-navigation">
          <button 
            v-if="currentStepIndex > 0"
            @click="previousStep"
            class="nav-btn"
          >
            <i class="fas fa-arrow-left"></i> Précédent
          </button>
          <button 
            v-if="currentStepIndex < steps.length - 1"
            @click="nextStep"
            class="nav-btn primary"
          >
            Suivant <i class="fas fa-arrow-right"></i>
          </button>
          <button 
            v-else
            @click="complete"
            class="nav-btn primary"
          >
            Terminer <i class="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay de mise en évidence -->
    <div 
      v-if="currentStep.highlight"
      class="highlight-overlay"
      :style="highlightStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Props
interface TutorialStep {
  title: string;
  description: string;
  position?: { x: number; y: number };
  highlight?: string; // Sélecteur CSS pour l'élément à mettre en évidence
}

const props = defineProps<{
  show: boolean;
  steps: TutorialStep[];
}>();

// Émits
const emit = defineEmits<{
  (e: 'complete'): void;
}>();

// État
const currentStepIndex = ref(0);

// Computed
const currentStep = computed(() => props.steps[currentStepIndex.value]);

const currentStepStyle = computed(() => {
  const step = currentStep.value;
  if (step.position) {
    return {
      position: 'absolute' as const,
      left: `${step.position.x}px`,
      top: `${step.position.y}px`
    };
  }
  return {
    position: 'relative' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  };
});

const highlightStyle = computed(() => {
  const step = currentStep.value;
  if (step.highlight) {
    const element = document.querySelector(step.highlight);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        left: `${rect.left - 10}px`,
        top: `${rect.top - 10}px`,
        width: `${rect.width + 20}px`,
        height: `${rect.height + 20}px`
      };
    }
  }
  return null;
});

// Méthodes
const nextStep = () => {
  if (currentStepIndex.value < props.steps.length - 1) {
    currentStepIndex.value++;
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const complete = () => {
  emit('complete');
};
</script>

<style lang="scss" scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.tutorial-step {
  position: absolute;
  background: var(--component-bg);
  border-radius: var(--card-radius);
  padding: 1.5rem;
  max-width: 400px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1001;

  .step-content {
    h3 {
      color: var(--color-primary);
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    p {
      color: var(--color-text);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .step-navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;

      .nav-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
        background: var(--overlay-light);
        color: var(--color-text);

        &:hover {
          background: var(--overlay-medium);
        }

        &.primary {
          background: var(--color-primary);
          color: #fff;

          &:hover {
            background: var(--color-primary-dark);
          }
        }

        i {
          font-size: 0.9rem;
        }
      }
    }
  }
}

.highlight-overlay {
  position: absolute;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  animation: pulse 2s infinite;
  pointer-events: none;
  z-index: 1001;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 70, 85, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 70, 85, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 70, 85, 0); }
}
</style>