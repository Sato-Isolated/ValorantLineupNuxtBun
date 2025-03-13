# Documentation des Composants Vue

## app.vue
Point d'entrée principal de l'application. Ce composant est le conteneur racine qui gère la structure globale de l'application.

## Components/Valorant/

### HeaderValorant.vue
En-tête de l'application contenant la navigation principale et les éléments de marque Valorant.

### FooterValorant.vue
Pied de page de l'application avec les informations légales et liens utiles.

### Lineup/

#### InteractiveMap.vue
Composant principal de la carte interactive permettant aux joueurs de visualiser et interagir avec les lineups sur les différentes cartes du jeu.

#### MapControls.vue
Barre d'outils et contrôles pour interagir avec la carte interactive (zoom, déplacement, filtres).

#### Node.vue
Représente un point d'intérêt sur la carte (position de lineup, point de lancer, point d'impact).

#### NodeWindow.vue
Fenêtre contextuelle affichant les détails d'un node sélectionné (description, images, vidéos).

## Pages/

### index.vue
Page d'accueil principale de l'application présentant les fonctionnalités clés.

### Valorant/

#### home.vue
Page d'accueil spécifique à la section Valorant avec présentation des différentes fonctionnalités.

#### select-agent.vue
Interface de sélection des agents permettant aux utilisateurs de choisir l'agent pour lequel ils souhaitent voir les lineups.

#### [agent]/select-map.vue
Page de sélection de carte pour un agent spécifique. Permet aux utilisateurs de choisir la carte sur laquelle ils souhaitent voir les lineups.

#### [agent]/[map].vue
Page dynamique affichant les lineups spécifiques pour un agent et une carte donnés. Intègre la carte interactive et les détails des lineups.