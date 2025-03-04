<script setup lang="ts">
import {getRandomSVG} from "@/utils.ts";
import {useSiteStore} from "@/store/siteStore.ts";

// Select random SVG from @assets/logo/jubiman/*.svg and set site name and logo
const imageModules = import.meta.glob('/src/assets/logo/jubiman/*.svg', {
    eager: true,
    query: '?url',
});
let randomSVG = getRandomSVG(imageModules);
const siteStore = useSiteStore();
siteStore.setSiteName('Jubiman');
siteStore.logoPath = randomSVG;
</script>

<template>
  <div class="container">
    <!-- Empty container for a short introduction -->
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</template>

<style scoped>
.container {
  padding: 2em;
  margin-top: 4em; /* Adjust for fixed nav bar */
}
</style>