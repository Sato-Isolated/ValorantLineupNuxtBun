<template>
  <div ref="popupRef" class="popup-menu">
    <form @submit.prevent="saveLineup">
      <div class="coordinate-div">
        <h1>Coordonnée</h1>
        <label>X</label>
        <input v-model.number="formStore.x" type="number" />
        <label>Y</label>
        <input v-model.number="formStore.y" type="number" />
      </div>

      <div class="abilitie-div">
        <h1>Compétence</h1>
        <div class="options">
          <div v-for="(ability, index) in agentAbilities" :key="index">
            <img :src="getIconPath(ability)" height="32" width="32" @click="selectAbility(ability)" 
                 :class="{ selected: formStore.selectedAbility === ability }"/>
          </div>
        </div>
      </div>

      <div class="sides-div">
        <h1>Type</h1>
        <div class="options">
          <div>
            <label for="attaque">Attaque</label>
            <input type="radio" name="type" value="attaque" v-model="formStore.type" />
          </div>
          <div>
            <label for="defense">Défense</label>
            <input type="radio" name="type" value="defense" v-model="formStore.type" />
          </div>
        </div>
      </div>

      <div class="difficulty-div">
        <h1>Difficulté</h1>
        <div class="options">
          <div>
            <label for="facile">Facile</label>
            <input type="radio" value="facile" v-model="formStore.difficulty" />
          </div>
          <div>
            <label for="moyen">Moyen</label>
            <input type="radio" value="moyen" v-model="formStore.difficulty" />
          </div>
          <div>
            <label for="difficile">Difficile</label>
            <input type="radio" value="difficile" v-model="formStore.difficulty" />
          </div>
        </div>
      </div>

      <div class="youtube-div">
        <h1>Liens Youtube</h1>
        <input type="text" v-model="formStore.youtubeLink" @blur="convertYoutubeLink" />
        <p v-if="youtubeError" class="error-message">{{ youtubeError }}</p>
      </div>

      <div class="group-button">
        <button type="submit">Enregistrer</button>
        <button type="button" @click="formStore.drawCircleTrajectory">Dessiner la trajectoire</button>
        
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useFormStore } from '~/stores/Valorant/useFormStore';
import { useAgentStore } from '~/stores/Valorant/agentStore'; 
import { useMapStore } from '~/stores/Valorant/mapStore';

const formStore = useFormStore();
const agentStore = useAgentStore();
const mapStore = useMapStore();
const agentAbilities = ref(['Ability1', 'Ability2', 'Grenade', 'Ultimate']);
const youtubeError = ref<string | null>(null);
function getIconPath(ability: string): string {
  return `/images/Valorant/Abilities/${agentStore.selectedAgent}_${ability}.webp`;
}

function selectAbility(ability: string) {
  formStore.selectedAbility = ability;
}

function convertYoutubeLink() {
  const youtubeLink = formStore.youtubeLink;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = youtubeLink.match(regex);
  if (match && match[1]) {
    formStore.youtubeLink = `https://www.youtube.com/embed/${match[1]}`;
    youtubeError.value = null;
  } else {
    youtubeError.value = 'Veuillez entrer un lien YouTube valide.';
    formStore.youtubeLink = '';
  }
}


async function saveLineup() {
  // Valider le lien YouTube avant d'envoyer la requête
  convertYoutubeLink();
  if (youtubeError.value) {
    console.error('Error:', youtubeError.value);
    return;
  }

  const map = agentStore.selectedMap;
  const agent = agentStore.selectedAgent;

  try {
    const response = await fetch(`/api/get-last-id?map=${map}&agent=${agent}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get last ID');
    }

    const result = await response.json();
    const newId = result.lastId + 1;
    formStore.setId(newId);

    const saveResponse = await fetch('/api/save-lineup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        map,
        agent,
        data: {
          id: formStore.id,
          x: formStore.x,
          y: formStore.y,
          selectedAbility: formStore.selectedAbility,
          type: formStore.type,
          difficulty: formStore.difficulty,
          youtubeLink: formStore.youtubeLink,
          trajectory: formStore.trajectory
        }
      }),
    });

    if (!saveResponse.ok) {
      throw new Error('Failed to save lineup');
    }

    const saveResult = await saveResponse.json();
    console.log(saveResult.message);

    // Mettre à jour l'état lineupSaved
    mapStore.setLineupSaved(true);

  } catch (error) {
    console.error('Error:', error);
  }
}
</script>

<style scoped>
@import '/assets/styles/Valorant/components_style/FloatingMenu.css';

.ability-icon {
  transition: transform 0.2s;
}

.ability-icon.selected {
  transform: scale(1.1);
  border: 2px solid blue;
}

.selected {
  border: 2px solid #007BFF; /* Couleur bleu plus prononcée */
  transform: scale(1.1); /* Augmente légèrement l'icône */
  transition: transform 0.2s, border-color 0.2s;
  border-radius: 8px; /* Ajoute un coin arrondi pour un effet visuel plus agréable */
}

.error-message {
  color: red;
  font-size: 1.2em;
  margin-bottom: 1rem;
}
</style>
