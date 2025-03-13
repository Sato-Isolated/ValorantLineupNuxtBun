# Documentation Technique des Pages et Routes

## Architecture des Routes

### Structure de Navigation
```
/ (index.vue)
├── /valorant (home.vue)
│   ├── /select-agent
│   └── /[agent]
│       ├── /select-map
│       └── /[map]
```

## Pages Principales

### index.vue

#### Composants
- Layout principal
- Composants de présentation
- Système de navigation

#### Fonctionnalités
```typescript
interface IndexPageFeatures {
  animation: {
    entryAnimation: boolean;
    parallaxEffect: boolean;
  };
  navigation: {
    quickAccess: boolean;
    recentLineups: boolean;
  };
}
```

#### Optimisations
- Chargement différé des assets
- Préchargement des routes populaires
- Optimisation des images

### Valorant/home.vue

#### État Local
```typescript
interface HomeState {
  featuredLineups: Lineup[];
  recentActivity: ActivityLog[];
  userPreferences: UserPrefs;
}
```

#### Composants Intégrés
- Carrousel de lineups
- Statistiques utilisateur
- Dernières mises à jour

#### Hooks Lifecycle
- Préchargement des données
- Gestion du cache
- Nettoyage des ressources

### Valorant/select-agent.vue

#### Fonctionnalités
```typescript
interface AgentSelection {
  filtering: {
    byRole: boolean;
    byAvailability: boolean;
    searchQuery: string;
  };
  display: {
    gridView: boolean;
    detailView: boolean;
  };
}
```

#### Interactions
- Filtrage dynamique
- Prévisualisation des agents
- Navigation fluide

#### Optimisations
- Virtualisation de la grille
- Lazy loading des images
- Mise en cache des filtres

### Valorant/[agent]/select-map.vue

#### État
```typescript
interface MapSelection {
  availableMaps: GameMap[];
  lineupStats: {
    [mapId: string]: {
      total: number;
      byAbility: Record<string, number>;
    };
  };
}
```

#### Fonctionnalités
- Filtrage par disponibilité
- Aperçu des lineups
- Stats par carte

### Valorant/[agent]/[map].vue

#### Composants Core
```typescript
interface MapPageComponents {
  interactiveMap: typeof InteractiveMap;
  lineupList: typeof LineupList;
  abilitySelector: typeof AbilitySelector;
  tutorialOverlay?: typeof TutorialOverlay;
}
```

#### Gestion d'État
- Synchronisation map/liste
- État de l'éditeur
- Historique des actions

## Middleware et Guards

### Authentication
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = useAuthStore().isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    return navigateTo('/login');
  }
});
```

### Validation des Paramètres
```typescript
// middleware/params.ts
export default defineNuxtRouteMiddleware((to) => {
  const { agent, map } = to.params;
  
  if (agent && !isValidAgent(agent)) {
    return abortNavigation();
  }
  
  if (map && !isValidMap(map)) {
    return abortNavigation();
  }
});
```

## SEO et Métadonnées

### Configuration
```typescript
// Exemple de configuration SEO pour une page
definePageMeta({
  title: 'Lineups Valorant',
  description: 'Trouvez les meilleurs lineups pour chaque agent',
  ogImage: '/images/og-image.jpg'
});
```

### Génération Dynamique
- Titres personnalisés par route
- Descriptions basées sur le contenu
- Images Open Graph dynamiques

## Performances

### Optimisations de Route
- Prefetching intelligent
- Code splitting par route
- Mise en cache des composants

### Chargement des Données
- Gestion des états de chargement
- Fallback UI
- Retry sur erreur

## Tests

### Tests Unitaires
```typescript
describe('Pages', () => {
  describe('select-agent.vue', () => {
    it('filtre correctement les agents', () => {
      // Test du filtrage
    });
    
    it('navigue correctement vers la sélection de carte', () => {
      // Test de navigation
    });
  });
});
```

### Tests E2E
- Parcours utilisateur complet
- Validation des transitions
- Tests de performance

## Bonnes Pratiques

### Organisation
- Composants réutilisables
- Logique métier dans les composables
- Types stricts

### Performance
- Optimisation des assets
- Gestion du cache
- Code splitting

### Accessibilité
- Navigation au clavier
- ARIA landmarks
- Contraste suffisant