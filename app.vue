<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
@font-face {
  font-family: 'Anton';
  src: url('/fonts/Anton-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

html,
body {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  font-family: 'Anton', sans-serif;
}
</style>
