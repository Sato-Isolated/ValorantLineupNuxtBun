# ValorantLineupNuxtBun

## Description
Application web développée avec Nuxt.js et Bun, dédiée à l'apprentissage et au partage des lineups dans Valorant. Cette application permet aux joueurs de visualiser, apprendre et partager des stratégies de lineup pour chaque agent sur toutes les cartes du jeu.

## Technologies Utilisées
- **Frontend**: Nuxt.js 3 (Vue.js)
- **Runtime**: Bun
- **Styles**: SCSS pour une personnalisation avancée
- **UI Components**: Components Vue personnalisés
- **État Global**: Pinia pour la gestion d'état
- **Assets**: Webp pour les images optimisées
- **Typages**: TypeScript pour une meilleure maintenabilité

## Structure du Projet

### Components (`/components`)
Composants réutilisables organisés par domaine fonctionnel:

#### Valorant
- **HeaderValorant.vue**: Barre de navigation principale
  - Navigation entre les sections
  - Menu responsive
  - Gestion du thème

- **FooterValorant.vue**: Pied de page
  - Liens utiles
  - Mentions légales
  - Crédits

#### Lineup
- **InteractiveMap.vue**: Carte interactive principale
  - Système de zoom personnalisé
  - Gestion des événements de souris
  - Affichage des points d'intérêt

- **MapControls.vue**: Contrôles de la carte
  - Boutons de zoom
  - Filtres de visualisation
  - Options d'affichage

- **Node.vue**: Points sur la carte
  - Différents types de marqueurs
  - Animation au survol
  - Gestion des clics

- **NodeWindow.vue**: Fenêtre de détails
  - Affichage des médias
  - Instructions détaillées
  - System de navigation

### Pages (`/pages`)
Organisation hiérarchique des routes:

#### Route Principale
- **index.vue**: Page d'accueil
  - Présentation de l'application
  - Call-to-action
  - Dernières mises à jour

#### Section Valorant
- **home.vue**: Hub principal Valorant
  - Vue d'ensemble des fonctionnalités
  - Statistiques
  - Nouveautés

- **select-agent.vue**: Sélection d'agent
  - Grille d'agents filtrable
  - Informations détaillées
  - Aperçu des capacités

- **[agent]/select-map.vue**: Sélection de carte
  - Liste des cartes disponibles
  - Aperçu des lineups existantes
  - Filtres avancés

- **[agent]/[map].vue**: Vue détaillée
  - Carte interactive
  - Liste des lineups
  - Tutoriels détaillés

### Stores (`/stores/Valorant`)
Gestion de l'état avec Pinia:

- **abilitiesStore.ts**: Gestion des capacités
  - Liste des capacités par agent
  - États des cooldowns
  - Configurations

- **agentStore.ts**: Gestion des agents
  - Informations des agents
  - Sélection courante
  - Filtres

- **lineupStore.ts**: Gestion des lineups
  - Points sur la carte
  - Données des lineups
  - État de l'interface

### Assets (`/assets`)
Organisation des ressources:

- **scss/**: Styles globaux
- **lineup/**: Données JSON des lineups
- **reset.css**: Normalisation CSS

### Public (`/public`)
Ressources statiques:

- **images/valorant/**
  - Abilities/: Icônes des capacités
  - Agent/: Portraits des agents
  - Map/: Images des cartes
  - Map Interactive/: Assets pour la carte interactive

## Configuration

### Nuxt (`nuxt.config.ts`)
```typescript
// Configuration principale de Nuxt
export default defineNuxtConfig({
  // Modules activés
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/style-resources',
  ],
  // Configuration SCSS globale
  css: [
    '@/assets/reset.css',
    '@/assets/scss/main.scss'
  ],
  // Configuration TypeScript
  typescript: {
    strict: true
  }
})
```

## Installation

1. Cloner le repository:
```bash
git clone [url-du-repo]
```

2. Installer les dépendances:
```bash
bun install
```

3. Lancer le serveur de développement:
```bash
bun run dev
```

## Conventions de Code

### Nommage
- Components: PascalCase
- Fichiers: kebab-case
- Variables: camelCase
- Types: PascalCase

### Structure des Components
- Props validées avec TypeScript
- Composition API avec `<script setup>`
- SCSS scopé avec BEM

### Git
- Commits conventionnels
- Branches par fonctionnalité
- Pull requests documentées

## Contribuer
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add: Amazing Feature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
