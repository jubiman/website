<script setup lang="ts">
import { useSiteStore } from '@/store/siteStore';

const siteStore = useSiteStore();
</script>

<template>
  <nav>
    <div class="logo">
      <img :src="siteStore.logoPath" alt="Logo" />
      {{ siteStore.siteName }}
    </div>
    <div>
      <a href="https://github.com/jubiman" target="_blank" rel="noreferrer">GitHub</a>
<!--      <a href="/jubicord">JubiCord</a>-->
      <router-link :to="{name: siteStore.prevName.toLowerCase()}">{{siteStore.prevName}}</router-link>
    </div>
  </nav>
</template>

<style scoped>
/* existing styles */
</style>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #ff1493, #c71585);
  padding: 1em 2em;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 1em;
  transition: color 0.3s, transform 0.3s;
}

nav a:hover {
  color: #333;
  transform: scale(1.1);
}

nav a:last-child {
  padding-right: 2em;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5em;
  font-weight: bold;
  color: white;
}

.logo img {
  margin-right: 0.5em;
  height: 1.5em;
}
</style>