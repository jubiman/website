<script setup lang="ts">
import {useSiteStore} from '@/store/siteStore.ts';
import {getRandomSVG} from '@/utils.ts';


// Select random SVG from @assets/logo/jubicord/*.svg
const imageModules = import.meta.glob('/src/assets/logo/jubicord/*.svg', {
    eager: true,
    query: '?url',
});
let randomSVG = getRandomSVG(imageModules);

const siteStore = useSiteStore();
siteStore.setSiteName('JubiCord');
siteStore.logoPath = randomSVG;

</script>

<template>
    <div class="dashboard">
        <div class="container">
            <!-- Create a button to go to the guilds view -->
            <router-link to="/jubicord/guilds" class="button">Guilds</router-link>
        </div>
    </div>
</template>

<style scoped>
.dashboard {
    padding: 2em;
}
.button {
    /* fark grey */
    background-color: #333;
    color: white;
    border-color: #1a1a1a;
    border-style: solid;
    padding: 1em 2em;
    border-radius: 0.5em;
    text-decoration: none;
    font-size: 1.5em;
    transition: background-color 0.3s;
}
</style>