# Documentation Technique des Composants Lineup

## Architecture des Composants

### Composants Principaux
- **InteractiveMap.vue**: Carte interactive principale
- **MapControls.vue**: Contrôles de la carte
- **Node.vue**: Points sur la carte
- **NodeWindow.vue**: Fenêtre de détails

### Composants Utilitaires
- **DragDropManager.vue**: Gestion du drag & drop
  - Système de coordonnées normalisé
  - Gestion des événements souris
  - Animation fluide avec requestAnimationFrame

- **LoadingErrorState.vue**: États de chargement/erreur
  - Affichage des spinners
  - Gestion des erreurs
  - Bouton de retry

- **FilterSortToolbar.vue**: Filtrage et tri
  - Recherche textuelle
  - Filtres par type
  - Options de tri

### Composants UI
- **NotificationToast.vue**: Notifications
- **GuideOverlay.vue**: Guide utilisateur
- **NewFeaturesModal.vue**: Nouvelles fonctionnalités
- **RecentLineups.vue**: Historique récent

## InteractiveMap.vue

### Fonctionnalités
- Système de zoom avec niveaux configurables
- Pan & drag de la carte
- Gestion des calques (overlay)
- Système de coordonnées normalisées
- Gestion des points d'intérêt

### Props
```typescript
interface Props {
  mapId: string;           // Identifiant unique de la carte
  initialZoom?: number;    // Niveau de zoom initial
  markers: LineupNode[];   // Points d'intérêt à afficher
  allowEdit?: boolean;     // Mode édition activé/désactivé
}
```

### Events Émis
- `marker-click`: Émis lors du clic sur un marqueur
- `map-click`: Émis lors du clic sur la carte
- `zoom-change`: Émis lors du changement de niveau de zoom

### États Internes
- Position de la carte (transform matrix)
- Niveau de zoom actuel
- État de drag & pan
- Marqueur sélectionné

### Méthodes Principales
- `normalizeCoordinates`: Conversion coordonnées écran/carte
- `handleZoom`: Gestion du zoom avec limites
- `updateMarkers`: Mise à jour efficace des marqueurs
- `exportMapState`: Sauvegarde de l'état de la carte

## MapControls.vue

### Fonctionnalités
- Contrôles de zoom (+/-)
- Filtres de visualisation
- Mode plein écran
- Réinitialisation de la vue

### Props
```typescript
interface Props {
  zoomLevel: number;
  filters: FilterOptions[];
  showGrid?: boolean;
}
```

### Events Émis
- `zoom-in`: Demande d'augmentation du zoom
- `zoom-out`: Demande de diminution du zoom
- `reset-view`: Demande de réinitialisation
- `filter-change`: Changement dans les filtres

## Node.vue

### Fonctionnalités
- Rendu conditionnel selon le type
- Gestion des états (hover, selected)
- Animation de position
- Tooltips contextuels

### Props
```typescript
interface Props {
  node: LineupNode;
  isSelected: boolean;
  isEditable?: boolean;
}
```

### Types de Nodes
```typescript
interface LineupNode {
  id: string;
  type: 'start' | 'impact' | 'position';
  coordinates: {
    x: number;
    y: number;
  };
  metadata?: {
    ability?: string;
    description?: string;
  };
}
```

## NodeWindow.vue

### Fonctionnalités
- Affichage modal/drawer configurable
- Carrousel d'images/vidéos
- Instructions par étapes
- Navigation entre lineups

### Props
```typescript
interface Props {
  node: LineupNode;
  mediaUrls: string[];
  instructions: Instruction[];
}
```

### Structure des Données
```typescript
interface Instruction {
  step: number;
  text: string;
  image?: string;
  timing?: number;
}
```

## Flux de Données
```
[map].vue (Container)
├── InteractiveMap
│   ├── Node
│   └── FilterSortToolbar
├── NodeWindow
│   └── DragDropManager
└── MapControls
```

## Événements et Communication
- DragDropManager → NodeWindow: Mise à jour des positions
- FilterSortToolbar → InteractiveMap: Filtrage des nodes
- Node → NodeWindow: Ouverture/fermeture des fenêtres

## État Global (Stores)
- lineupStore: Gestion des lineups
- agentStore: Sélection d'agent
- abilitiesStore: Capacités des agents

## Optimisations

### Performance
- Utilisation de `requestAnimationFrame` pour les animations
- Virtualisation des marqueurs hors-champ
- Lazy loading des médias
- Debouncing des événements de souris

### Mémoire
- Nettoyage des listeners
- Gestion du cache des images
- Recyclage des éléments DOM

- Chargement asynchrone des composants
- Utilisation de requestAnimationFrame pour les animations
- Debounce sur les événements fréquents
- GPU acceleration avec transform3d

## Tests Unitaires Recommandés

### InteractiveMap
- Conversion des coordonnées
- Limites de zoom
- Événements tactiles

### Node
- Rendu conditionnel
- Gestion des événements
- Transitions d'état

### MapControls
- États des boutons
- Mise à jour des filtres
- Raccourcis clavier

### NodeWindow
- Chargement des médias
- Navigation
- Validation des données

## Bonnes Pratiques
- Division des responsabilités
- Composants réutilisables
- Props et émits typés
- Gestion propre des événements
- Cleanup des listeners