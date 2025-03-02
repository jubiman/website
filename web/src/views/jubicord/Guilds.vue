<script setup lang="ts">
// fetch the guilds from the API
import { ref} from 'vue';
import { useSiteStore } from '@/store/siteStore';
import { Guild } from '@/types';
import { getGuilds } from '@/api';
import { getRandomSVG } from '@/utils';

const siteStore = useSiteStore();
siteStore.setSiteName('JubiCord');

const guilds = ref<Guild[]>([]);
getGuilds().then((data) => {
  guilds.value = data;
});

// Select random SVG from @assets/logo/jubicord/*.svg
const imageModules = import.meta.glob('/src/assets/logo/jubicord/*.svg', {
  eager: true,
  query: '?url',
});
let randomSVG = getRandomSVG(imageModules);
siteStore.logoPath = randomSVG;


</script>

<template>

</template>

<style scoped>

</style>