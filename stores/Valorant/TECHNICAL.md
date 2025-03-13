# Documentation Technique des Stores

## abilitiesStore.ts

### État Principal
```typescript
interface AbilitiesState {
  abilities: {
    [agentId: string]: Ability[];
  };
  selectedAbility: Ability | null;
  cooldowns: Map<string, number>;
}

interface Ability {
  id: string;
  name: string;
  type: 'Signature' | 'Basic' | 'Ultimate';
  icon: string;
  description: string;
  useTime?: number;
}
```

### Actions
- `fetchAgentAbilities`: Chargement des capacités d'un agent
- `selectAbility`: Sélection d'une capacité pour les lineups
- `resetAbilitySelection`: Réinitialisation de la sélection
- `updateCooldown`: Mise à jour du temps de recharge

### Getters
- `getAgentAbilities`: Capacités par agent
- `getSelectedAbilityDetails`: Détails de la capacité sélectionnée
- `getRemainingCooldown`: Temps de recharge restant

## agentStore.ts

### État Principal
```typescript
interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  filters: AgentFilters;
  loading: boolean;
}

interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  abilities: string[];
  portrait: string;
}

interface AgentFilters {
  role?: AgentRole;
  searchText?: string;
}
```

### Actions
- `loadAgents`: Chargement initial des agents
- `selectAgent`: Sélection d'un agent
- `updateFilters`: Mise à jour des filtres
- `resetSelection`: Réinitialisation de la sélection

### Getters
- `filteredAgents`: Agents filtrés selon les critères
- `getAgentById`: Récupération d'un agent par ID
- `hasLineups`: Vérification de l'existence de lineups

## lineupStore.ts

### État Principal
```typescript
interface LineupState {
  lineups: Lineup[];
  selectedLineup: Lineup | null;
  mapState: MapState;
  editorMode: boolean;
}

interface Lineup {
  id: string;
  agentId: string;
  mapId: string;
  ability: string;
  nodes: LineupNode[];
  instructions: Instruction[];
  media: MediaAsset[];
  tags: string[];
}

interface MapState {
  zoom: number;
  center: Point;
  bounds: Bounds;
}
```

### Actions
- `fetchLineups`: Chargement des lineups pour agent/carte
- `createLineup`: Création d'une nouvelle lineup
- `updateLineup`: Mise à jour d'une lineup existante
- `deleteLineup`: Suppression d'une lineup
- `saveMapState`: Sauvegarde de l'état de la carte
- `toggleEditorMode`: Activation/désactivation mode édition

### Getters
- `getLineupsByAgent`: Lineups filtrées par agent
- `getLineupsByMap`: Lineups filtrées par carte
- `getFilteredLineups`: Lineups avec filtres combinés

## Intégration des Stores

### Exemple d'Utilisation Combinée
```typescript
// Dans un composant
const abilities = useAbilitiesStore();
const agents = useAgentStore();
const lineups = useLineupStore();

// Exemple de workflow
watch(() => agents.selectedAgent, async (newAgent) => {
  if (newAgent) {
    await abilities.fetchAgentAbilities(newAgent.id);
    await lineups.fetchLineups({
      agentId: newAgent.id,
      mapId: currentMap.value
    });
  }
});
```

## Persistence et Cache

### Configuration du Storage
```typescript
// Configuration Pinia avec persistance
export const useAbilitiesStore = defineStore('abilities', {
  persist: {
    storage: localStorage,
    paths: ['cooldowns'] // Persister uniquement les cooldowns
  }
});
```

### Stratégies de Cache
- Mise en cache des données fréquemment utilisées
- Invalidation intelligente du cache
- Préchargement des données courantes

## Optimisations

### Performance
- Actions asynchrones avec gestion d'erreurs
- Mise à jour partielle des états
- Utilisation de `shallowRef` pour les grands objets

### Mémoire
- Nettoyage des données obsolètes
- Limitation de la taille du cache
- Gestion des fuites mémoire

## Bonnes Pratiques

### Organisation du Code
- Séparation des types dans des fichiers dédiés
- Documentation JSDoc pour les méthodes publiques
- Tests unitaires pour chaque store

### Gestion des Erreurs
- Messages d'erreur explicites
- Retry pattern pour les requêtes réseau
- État de fallback en cas d'erreur

### Débogage
- Actions avec logging en développement
- État de debug activable
- Outils de développement Pinia